/**
 * Emits idempotent seed SQL for the OKF concept tables from the in-code façade.
 *
 * This is the deterministic bridge for Phase 3: the same `getConcepts()` source that produces
 * the markdown bundle produces the database rows, so the two can never drift. Run its output
 * through the Supabase SQL editor / MCP / CLI (service role). It does a full refresh
 * (`truncate ... cascade`) so re-seeding always matches source exactly.
 *
 *   node scripts/okf/db-seed-sql.ts > /tmp/okf-seed.sql
 */
import { getConcepts } from '../../src/lib/knowledge/concepts.ts';

// --no-body omits the (large) rich body markdown — useful for a compact live seed of the
// public surface + graph. The full body is included by default for a lossless cutover seed.
const includeBody = !process.argv.includes('--no-body');

const q = (s: string | undefined) => (s == null ? 'null' : `'${s.replace(/'/g, "''")}'`);
const arr = (xs: string[]) => `array[${xs.map((x) => `'${x.replace(/'/g, "''")}'`).join(', ')}]::text[]`;
const jsonb = (value: unknown) => `$okf$${JSON.stringify(value)}$okf$::jsonb`;

const concepts = getConcepts();
const out: string[] = [];

out.push('begin;');
out.push('truncate table public.concepts cascade;');

const conceptValues = concepts.map((c) =>
  `(${[
    q(c.id),
    q(c.conceptType),
    q(c.dir),
    q(c.slug),
    q(c.title),
    q(c.description),
    q(c.resource),
    arr(c.tags),
    q(c.status),
    q(c.lead),
    jsonb(c.summary),
    q(c.relationLabel),
    includeBody && c.bodyMarkdown ? jsonb({ markdown: c.bodyMarkdown, timestamp: c.timestamp ?? null }) : 'null',
  ].join(', ')})`,
);
out.push(
  'insert into public.concepts (id, concept_type, dir, slug, title, description, resource, tags, status, lead, summary, relation_label, body) values',
  conceptValues.join(',\n') + ';',
);

const edgeValues = concepts.flatMap((c) => c.edgeTargetIds.map((t) => `(${q(c.id)}, ${q(t)})`));
if (edgeValues.length) {
  out.push('insert into public.concept_edges (source_id, target_id) values', edgeValues.join(',\n') + ';');
}

const citationValues = concepts.flatMap((c) =>
  c.citations.map((cit) => `(${q(c.id)}, ${q(cit.label)}, ${q(cit.url)}, ${q(cit.publisher)})`),
);
if (citationValues.length) {
  out.push('insert into public.concept_citations (concept_id, label, url, publisher) values', citationValues.join(',\n') + ';');
}

out.push('commit;');
console.log(out.join('\n'));
