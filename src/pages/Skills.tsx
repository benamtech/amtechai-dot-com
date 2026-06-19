import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Download, FileText, ShieldCheck } from 'lucide-react';
import { skillDefinitions, skillPath } from '../lib/skills/registry';

const principles = [
  { title: 'First fetch wins', body: 'The shared URL includes the agent bootstrap directly in static page text.', icon: Bot },
  { title: 'Use before install', body: 'Every skill is usable in context by ChatGPT, Claude, Codex, and AMTECH agents.', icon: FileText },
  { title: 'Inspectable source', body: 'Raw files, manifests, checksums, and archives are exposed for trust review.', icon: ShieldCheck },
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
