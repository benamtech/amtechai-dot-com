-- ============================================================================
-- OKF Phase 3 — proposed canonical knowledge store (NOT YET APPLIED)
-- ============================================================================
-- This is the reviewable schema for moving concepts out of TypeScript and into
-- Supabase as a BUILD-TIME source of truth. It lives in docs/ (not
-- supabase/migrations/) on purpose: keeping it here means it is version-controlled
-- and validated (gate G8) without risking accidental `supabase db push` before the
-- Phase-3 gates are met. When Phase 3 begins, promote this file to
-- supabase/migrations/<timestamp>_okf_concepts.sql unchanged.
--
-- Design rules:
--   * Lossless vs src/lib/knowledge OkfConcept (every field has a home).
--   * Read-only public surface, published-only (RLS). Writes go through the service
--     role at build time in CI — never from the browser bundle (gate G9).
--   * Runtime stays static: the site reads the GENERATED bundle/manifest, not this DB
--     per request. This DB is queried only by the build.
-- ============================================================================

create table if not exists public.concepts (
  id              text primary key,                 -- e.g. 'E1', 'N2', 'UC2', 'place-phoenix'
  concept_type    text not null,                    -- OKF `type`: Article|Playbook|Use Case|Place|Industry
  dir             text not null,                    -- bundle subdirectory: articles|playbooks|use-cases|entities
  slug            text not null,
  title           text not null,
  description     text not null,
  resource        text,                             -- live indexable URL (published concepts only)
  tags            text[] not null default '{}',
  status          text not null default 'planned'
                    check (status in ('published', 'planned', 'reference')),
  lead            text,                             -- optional blockquote lead (graph-node mechanism)
  summary         jsonb not null default '[]'::jsonb, -- ordered bullet lines
  relation_label  text not null,                    -- label shown when this concept is a link target
  -- Body is emitted from blocks during content consolidation; nullable until then.
  body            jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (dir, slug)
);

-- Directed edges. target_id is intentionally NOT a foreign key: OKF tolerates broken
-- links, and edges may point at concepts not yet authored. `reason` carries the prose
-- relationship (derived today; authored later).
create table if not exists public.concept_edges (
  source_id  text not null references public.concepts(id) on delete cascade,
  target_id  text not null,
  reason     text,
  primary key (source_id, target_id)
);

create table if not exists public.concept_citations (
  id          bigint generated always as identity primary key,
  concept_id  text not null references public.concepts(id) on delete cascade,
  label       text not null,
  url         text not null,
  publisher   text
);

create index if not exists concept_edges_target_idx on public.concept_edges (target_id);
create index if not exists concept_citations_concept_idx on public.concept_citations (concept_id);

-- ---- Row Level Security: public read, published-only --------------------------
alter table public.concepts enable row level security;
alter table public.concept_edges enable row level security;
alter table public.concept_citations enable row level security;

create policy "concepts public read (published)" on public.concepts
  for select using (status = 'published');

create policy "edges public read (published source)" on public.concept_edges
  for select using (
    exists (select 1 from public.concepts c where c.id = source_id and c.status = 'published')
  );

create policy "citations public read (published concept)" on public.concept_citations
  for select using (
    exists (select 1 from public.concepts c where c.id = concept_id and c.status = 'published')
  );

-- No insert/update/delete policies: anon/auth cannot write. The build pipeline writes
-- with the service role (which bypasses RLS) in CI only.
