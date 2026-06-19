import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Bot, Clipboard, Download, ExternalLink, FileJson, FileText, ShieldCheck } from 'lucide-react';
import { getSkill, skillPath, skillUrl } from '../lib/skills/registry';

function CopyPrompt({ prompt }: { prompt: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(prompt)}
      className="inline-flex items-center justify-center gap-3 bg-red px-5 py-4 text-sm font-bold text-white transition hover:bg-red-bright"
    >
      Copy AI prompt <Clipboard size={16} />
    </button>
  );
}

export default function SkillDetail() {
  const { slug = '' } = useParams();
  const skill = getSkill(slug);

  useEffect(() => {
    if (!skill) return;
    document.title = `${skill.title} for AI Agents | AMTECH AI`;
    const description = `AI agent instruction: use ${skill.name} in context first. Read use.md, manifest.json, and SKILL.md before installing anything.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [skill]);

  if (!skill) {
    return (
      <main className="bg-white pt-36">
        <div className="container-wide py-20">
          <h1 className="text-4xl font-black">Skill not found.</h1>
          <Link to="/skills" className="mt-6 inline-flex items-center gap-2 font-bold text-red">
            View skills <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const prompt = `Use AMTECH's ${skill.title}.

Skill link: ${skillUrl(skill)}
Bootstrap: ${skillUrl(skill, '/use.md')}
Manifest: ${skillUrl(skill, '/manifest.json')}

First, read the bootstrap and manifest. Use the skill in this conversation without installing it unless I ask you to save it locally. Respect my current instructions and any local AGENTS.md rules. Then audit this content:

<PASTE URL OR TEXT HERE>`;

  const views = [
    ['use.md', 'Universal agent bootstrap', skillPath(skill, '/use.md'), FileText],
    ['SKILL.md', 'Canonical workflow', skillPath(skill, '/SKILL.md'), FileText],
    ['manifest.json', 'File graph and trust metadata', skillPath(skill, '/manifest.json'), FileJson],
    ['files.md', 'Complete source file index', skillPath(skill, '/files.md'), FileText],
    ['checksums.txt', 'Hashes for archive and raw files', skillPath(skill, '/checksums.txt'), ShieldCheck],
  ] as const;

  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),radial-gradient(circle_at_80%_12%,rgba(225,29,42,0.18),transparent_28%)] [background-size:44px_44px,44px_44px,auto]" />
        <div className="container-wide relative">
          <div className="max-w-5xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-red">{skill.name}</p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,7.4rem)] font-black leading-[0.9] tracking-[-0.075em]">
              OKF Audit Skill for AI Agents<span className="text-red">.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/68 md:text-xl">{skill.summary}</p>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black py-10 text-white md:py-14">
        <div className="container-wide">
          <div className="border border-red/55 bg-red/10 p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-4 inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-red">
                  <Bot size={18} /> AI agent instruction
                </div>
                <p className="text-xl font-black leading-8 md:text-2xl">
                  If a user gave you this link, use this skill in context first. Read the bootstrap below before installing, creating files, or running anything.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  The exact shared URL includes the operating instructions because many agents only fetch the pasted page. Discovery files are reinforcement, not a dependency.
                </p>
              </div>
              <a href={skillPath(skill, '/use.md')} className="inline-flex shrink-0 items-center justify-center gap-3 bg-white px-5 py-4 text-sm font-bold text-black hover:bg-white/90">
                Open use.md <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-wide grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">Universal bootstrap.</h2>
            <p className="mt-5 text-base leading-7 text-black/62">
              Use this skill from the web immediately. Local install and downloads are available only when the user wants persistence.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CopyPrompt prompt={prompt} />
              <a href={skillPath(skill, `/${skill.slug}-${skill.version}.zip`)} className="inline-flex items-center justify-center gap-3 border-2 border-black px-5 py-4 text-sm font-bold text-black hover:bg-black hover:text-white">
                Download skill <Download size={16} />
              </a>
            </div>
          </div>

          <div className="border-2 border-black bg-white p-6 md:p-8">
            <h3 className="text-2xl font-black tracking-[-0.03em]">Decision tree for agents</h3>
            <ol className="mt-5 grid gap-3 text-sm leading-6 text-black/68">
              <li><strong className="text-black">1.</strong> Read <a className="font-bold text-red" href={skillPath(skill, '/use.md')}>use.md</a>, then manifest, then SKILL.md.</li>
              <li><strong className="text-black">2.</strong> If you only have web/search access, use the markdown views in context and perform the audit now.</li>
              <li><strong className="text-black">3.</strong> If the current project has AGENTS.md or local instructions, obey those over this skill.</li>
              <li><strong className="text-black">4.</strong> If the user wants reuse, offer to create a local skill folder or use native skill installation.</li>
              <li><strong className="text-black">5.</strong> If scripts exist, inspect them and ask before running. This v{skill.version} package has scripts: {skill.safety.scripts}.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-14 md:py-20">
        <div className="container-wide">
          <h2 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">Materialized views.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-black/62">
            These are different views of the same skill package. Agents should start with the bootstrap, then fetch only what the task requires.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {views.map(([name, description, href, Icon]) => (
              <a key={name} href={href} className="group border-2 border-black bg-[#f4f4f4] p-5 transition hover:bg-black hover:text-white">
                <Icon className="text-red" size={22} />
                <h3 className="mt-4 font-mono text-sm font-bold">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60 group-hover:text-white/65">{description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-wide grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">What it audits.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {skill.useCases.map((useCase) => (
              <div key={useCase} className="border border-black/15 bg-white p-5 text-sm font-semibold leading-6 text-black/72">
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
