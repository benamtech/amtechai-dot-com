-- ============================================================================
-- Skills registry — public read projection of the consumable AMTECH skills.
-- ============================================================================
-- Mirrors the OKF concepts pattern (20260619042548_okf_concepts):
--   * The TypeScript registry (src/lib/skills/registry.ts) + the build-emitted
--     authority file (public/.well-known/skill-authority.json) remain the
--     authoring source of truth. This table is a queryable PROJECTION of that
--     data, the same way public.concepts projects src/lib/knowledge.
--   * Runtime stays static: skill PAGES are served as prerendered HTML reading the
--     generated bundle, not this DB per request. This DB is for internal agents,
--     verification tooling, and future products that want to query the registry.
--   * Read-only public surface, published-only (RLS). No insert/update/delete
--     policies: anon/auth cannot write. The build pipeline refreshes rows with the
--     service role (which bypasses RLS) in CI only.
--
-- skill_article_links carries the bidirectional skill<->article graph that is
-- declared in two human/agent-visible places: the article's amtech:demonstrates
-- meta tag (src/lib/seo/pageMeta.ts) and this DB row.
-- ============================================================================

create table if not exists public.skills (
  slug                    text primary key,                 -- e.g. 'okf-audit'
  name                    text not null,
  title                   text not null,
  version                 text not null,                    -- semver, matches archive + authority file
  updated                 date not null,
  status                  text not null default 'published'
                            check (status in ('published', 'planned', 'deprecated')),
  description             text not null,
  summary                 text not null,
  source_dir              text not null,                    -- authoring dir, e.g. src/lib/skills/source/okf-audit
  audience                text[] not null default '{}',
  use_cases               text[] not null default '{}',
  canonical_url           text not null,                    -- https://amtechai.com/skills/<slug>
  archive_url             text not null,                    -- downloadable .zip of materialized views
  archive_sha256          text not null,                    -- integrity hash, matches skill-authority.json
  registry_url            text not null,                    -- https://amtechai.com/.well-known/skill-authority.json
  safety_scripts          text not null default 'none'
                            check (safety_scripts in ('none', 'optional', 'required')),
  safety_requires_network boolean not null default false,
  safety_requires_secrets boolean not null default false,
  safety_risk_note        text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Directed skill -> article edges. article_slug is intentionally NOT a foreign key:
-- articles are not (yet) a table, and OKF tolerates edges pointing at concepts that
-- live outside this schema. `relationship` carries the edge kind ('demonstrates').
create table if not exists public.skill_article_links (
  skill_slug    text not null references public.skills(slug) on delete cascade,
  article_slug  text not null,
  relationship  text not null default 'demonstrates',
  created_at    timestamptz not null default now(),
  primary key (skill_slug, article_slug, relationship)
);

create index if not exists skill_article_links_article_idx
  on public.skill_article_links (article_slug);

-- ---- Row Level Security: public read, published-only --------------------------
alter table public.skills enable row level security;
alter table public.skill_article_links enable row level security;

drop policy if exists "skills public read (published)" on public.skills;
create policy "skills public read (published)" on public.skills
  for select using (status = 'published');

drop policy if exists "skill_article_links public read (published skill)" on public.skill_article_links;
create policy "skill_article_links public read (published skill)" on public.skill_article_links
  for select using (
    exists (select 1 from public.skills s where s.slug = skill_slug and s.status = 'published')
  );

-- No insert/update/delete policies: writes go through the service role at build time.

-- ---- Seed: current registry snapshot ------------------------------------------
-- Idempotent. Refresh values match src/lib/skills/registry.ts and the build-emitted
-- public/.well-known/skill-authority.json at the time of writing.
insert into public.skills (
  slug, name, title, version, updated, status, description, summary, source_dir,
  audience, use_cases, canonical_url, archive_url, archive_sha256, registry_url,
  safety_scripts, safety_requires_network, safety_requires_secrets, safety_risk_note
) values (
  'okf-audit',
  'okf-audit',
  'OKF Audit Skill',
  '0.1.0',
  '2026-06-19',
  'published',
  'A consumable AMTECH skill for auditing articles, websites, drafts, sitemaps, and OKF bundles for AI-readable knowledge quality.',
  'Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to audit content for OKF-style structure, agent-readable surfaces, entity coverage, citations, links, and materialized views.',
  'src/lib/skills/source/okf-audit',
  array['AI agents', 'content strategists', 'technical marketers', 'business owners', 'SEO operators'],
  array[
    'Audit an article for OKF and agent-readable knowledge quality.',
    'Find missing entities, relationships, and internal links.',
    'Evaluate sitemap, llms.txt, markdown, JSON, and HTML surfaces.',
    'Generate a remediation prompt for another AI or implementation agent.'
  ],
  'https://amtechai.com/skills/okf-audit',
  'https://amtechai.com/skills/okf-audit/okf-audit-0.1.0.zip',
  '4bd9090a84885a0e73882a45101b885b0d62b7c66dbeee8bc35bd94d646496c8',
  'https://amtechai.com/.well-known/skill-authority.json',
  'none',
  true,
  false,
  'V1 has no required scripts. Use in context first. Ask before creating files, installing anything, or fetching private URLs.'
)
on conflict (slug) do update set
  name                    = excluded.name,
  title                   = excluded.title,
  version                 = excluded.version,
  updated                 = excluded.updated,
  status                  = excluded.status,
  description             = excluded.description,
  summary                 = excluded.summary,
  source_dir              = excluded.source_dir,
  audience                = excluded.audience,
  use_cases               = excluded.use_cases,
  canonical_url           = excluded.canonical_url,
  archive_url             = excluded.archive_url,
  archive_sha256          = excluded.archive_sha256,
  registry_url            = excluded.registry_url,
  safety_scripts          = excluded.safety_scripts,
  safety_requires_network = excluded.safety_requires_network,
  safety_requires_secrets = excluded.safety_requires_secrets,
  safety_risk_note        = excluded.safety_risk_note,
  updated_at              = now();

insert into public.skill_article_links (skill_slug, article_slug, relationship) values
  ('okf-audit', 'what-ai-agents-see-when-they-read-your-website', 'demonstrates')
on conflict (skill_slug, article_slug, relationship) do nothing;
