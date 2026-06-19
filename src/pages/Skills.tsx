import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Download, FileText, GitBranch, ShieldCheck } from 'lucide-react';
import { skillDefinitions, skillPath } from '../lib/skills/registry';

const principles = [
  { title: 'First fetch wins', body: 'The shared URL includes the agent bootstrap directly in static page text.', icon: Bot },
  { title: 'Use before install', body: 'Every skill is usable in context by ChatGPT, Claude, Codex, and AMTECH agents.', icon: FileText },
  { title: 'Inspectable source', body: 'Raw files, manifests, checksums, and archives are exposed for trust review.', icon: ShieldCheck },
];

const registrySteps = [
  {
    title: 'Authored in git',
    body: 'The registry lives in `src/lib/skills/registry.ts` and publishes commit-pinned source, so the public page can always point back to a specific Git tree.',
  },
  {
    title: 'Materialized for agents',
    body: 'The build emits public skill pages, raw files, manifests, checksums, archives, and signed certificate files so the same skill can be fetched, read, and verified in more than one way.',
  },
  {
    title: 'Signed, not guessed',
    body: 'Each certificate binds the skill, version, canonical URL, repository commit, and digests. That is stronger than a bare checksum because it gives the page a signed identity.',
  },
];

const comparisonRows = [
  {
    label: 'Anthropic Agent Skills',
    strength: 'Filesystem-first skills that load on demand across Claude products.',
    fit: 'Closest to the skill runtime model, but not a public AMTECH-style registry with reciprocal links and signed public artifacts.',
  },
  {
    label: 'OpenAI GPTs / GPT Store',
    strength: 'Community-built GPTs with directory-style discovery, policy review, and identity checks.',
    fit: 'Good for discovery and moderation. AMTECH leans harder on source provenance, raw fetchability, and commit pinning.',
  },
  {
    label: 'GitHub / package registries',
    strength: 'Strong version control, source history, and artifact distribution.',
    fit: 'Great for provenance and release discipline. AMTECH adds an agent-facing public page, one-link use, and a signed certificate layer.',
  },
];

export default function Skills() {
  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-75 [background:linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),radial-gradient(circle_at_78%_18%,rgba(225,29,42,0.16),transparent_26%)] [background-size:42px_42px,42px_42px,auto]" />
        <div className="container-wide relative">
          <div className="max-w-5xl">
            <h1 className="text-[clamp(3rem,8vw,7.6rem)] font-black leading-[0.9] tracking-[-0.07em]">
              Agent skills<span className="text-red">.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/68 md:text-xl">
              Free AMTECH skill packages designed so a modern AI can use one link immediately, then install or save the skill only when the environment supports it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="container-wide">
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map(({ title, body, icon: Icon }) => (
              <div key={title} className="border border-white/12 bg-white/[0.04] p-6">
                <Icon className="text-red" size={24} />
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="mb-10 max-w-4xl">
            <h2 className="text-[clamp(2rem,5vw,4.8rem)] font-black leading-[0.92] tracking-[-0.06em]">How the registry works.</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-black/60">
              AMTECH treats skills like signed, git-backed artifacts. The public registry is a source catalog, a delivery surface, and a trust layer at the same time.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {registrySteps.map(({ title, body }) => (
              <article key={title} className="border-2 border-black bg-white p-6">
                <GitBranch className="text-red" size={22} />
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-black/65">{body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 border-2 border-black bg-white p-6 md:p-8">
            <h3 className="text-2xl font-black tracking-[-0.04em]">How AMTECH compares.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65">
              The pattern is closer to a registry than a storefront: one source of truth, signed outputs, reciprocal links, and a page that humans and agents can inspect without guessing.
            </p>
            <div className="mt-6 grid gap-4">
              {comparisonRows.map(({ label, strength, fit }) => (
                <div key={label} className="grid gap-2 border border-black/10 bg-[#f4f4f4] p-4 md:grid-cols-[220px_1fr_1fr] md:gap-4">
                  <div className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-black/55">{label}</div>
                  <div className="text-sm leading-6 text-black/75">{strength}</div>
                  <div className="text-sm leading-6 text-black/60">{fit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[clamp(2rem,5vw,4.8rem)] font-black leading-[0.92] tracking-[-0.06em]">Available skills.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-black/60">
                Each skill has a human page, universal agent bootstrap, canonical SKILL.md, manifest, file indexes, raw files, archive, and checksums.
              </p>
            </div>
            <a href="/skills/catalog.md" className="inline-flex items-center gap-2 font-mono text-sm font-bold text-red hover:text-black">
              catalog.md <ArrowRight size={15} />
            </a>
          </div>

          <div className="grid gap-6">
            {skillDefinitions.map((skill) => (
              <article key={skill.slug} className="border-2 border-black bg-white p-6 md:p-8">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                  <div>
                    <h3 className="text-3xl font-black tracking-[-0.04em] md:text-5xl">{skill.title}</h3>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-black/65">{skill.summary}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Link to={skillPath(skill)} className="inline-flex items-center justify-center gap-3 bg-black px-5 py-4 text-sm font-bold text-white hover:bg-black/85">
                      Open skill page <ArrowRight size={16} />
                    </Link>
                    <a href={skillPath(skill, '/use.md')} className="inline-flex items-center justify-center gap-3 border-2 border-black px-5 py-4 text-sm font-bold text-black hover:bg-black hover:text-white">
                      Agent bootstrap <FileText size={16} />
                    </a>
                    <a href={skillPath(skill, `/${skill.slug}-${skill.version}.zip`)} className="inline-flex items-center justify-center gap-3 border-2 border-black px-5 py-4 text-sm font-bold text-black hover:bg-black hover:text-white">
                      Download package <Download size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
