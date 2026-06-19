/**
 * Phase 3 parity + RLS check. Run via `npm run okf:db:verify`.
 *
 * Reads the PUBLIC concept surface through the anon key (exactly what a browser or external
 * agent sees) and asserts:
 *   1. RLS exposes only `published` concepts (planned/reference rows are not anon-readable).
 *   2. The published set in the database matches the in-code façade exactly (no drift).
 *
 * This proves the database projection is faithful to the authored source without needing the
 * service-role key. Requires network + VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (from .env).
 */
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { getConcepts } from '../../src/lib/knowledge/concepts.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

async function readEnv(): Promise<Record<string, string>> {
  const env: Record<string, string> = {};
  try {
    const raw = await readFile(resolve(repoRoot, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m) env[m[1]] = m[2];
    }
  } catch {
    /* fall back to process.env */
  }
  return { ...env, ...process.env } as Record<string, string>;
}

async function main() {
  const env = await readEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('okf:db:verify needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('concepts').select('id, title, status').order('id');
  if (error) {
    console.error('okf:db:verify query failed:', error.message);
    process.exit(1);
  }
  const rows = data ?? [];

  const errors: string[] = [];
  // 1. RLS: anon must see only published.
  const nonPublished = rows.filter((r) => r.status !== 'published');
  if (nonPublished.length) errors.push(`RLS leak: anon read ${nonPublished.length} non-published row(s).`);

  // 2. Parity with the in-code published set.
  const codePublished = getConcepts().filter((c) => c.status === 'published');
  const dbIds = new Set(rows.map((r) => r.id));
  const codeIds = new Set(codePublished.map((c) => c.id));
  for (const c of codePublished) if (!dbIds.has(c.id)) errors.push(`Missing in DB: ${c.id} (${c.title}).`);
  for (const r of rows) if (!codeIds.has(r.id)) errors.push(`Extra in DB (stale): ${r.id}.`);
  for (const r of rows) {
    const c = codePublished.find((x) => x.id === r.id);
    if (c && c.title !== r.title) errors.push(`Title drift for ${r.id}.`);
  }

  errors.forEach((e) => console.error(`  FAIL  ${e}`));
  console.log(`\nokf:db:verify — anon-readable rows: ${rows.length}, in-code published: ${codePublished.length}, ${errors.length} error(s).`);
  if (errors.length) process.exit(1);
  console.log('Database projection matches the authored source and RLS exposes only published concepts.');
}

main().catch((error) => {
  console.error('okf:db:verify crashed:', error);
  process.exit(1);
});
