import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Crosshair, GitBranch, Layers3, Map, Sparkles } from 'lucide-react';

const publishedArticles = [
  {
    title: 'AMTECH vs. ChatGPT or Claude: What’s the Difference?',
    href: '/articles/amtech-vs-chatgpt-claude',
    category: 'AI employee fundamentals',
    date: '2026-06-17',
    icp: 'Business owners',
    concept: 'AI employee vs general AI',
    description: 'A practical comparison for owners deciding between DIY chat tools and a custom AI employee.',
  },
  {
    title: 'Create an Estimate With ChatGPT',
    href: '/articles/create-estimate-with-chatgpt',
    category: 'First-action guides',
    date: '2026-06-17',
    icp: 'Contractors',
    concept: 'Prompt-to-document workflow',
    description: 'A copy-ready prompt and workflow for turning field context into a professional estimate draft.',
  },
  {
    title: 'Write a Pressure Washing Estimate With AI',
    href: '/articles/write-pressure-washing-estimate-with-ai',
    category: 'Contractor verticals',
    date: '2026-06-17',
    icp: 'Exterior cleaners',
    concept: 'AI estimating',
    description: 'Use AI to organize pressure washing scope, assumptions, exclusions, upgrades, and pricing review.',
  },
  {
    title: 'Estimate Painting Cost With AI',
    href: '/articles/estimate-painting-cost-ai',
    category: 'Contractor verticals',
    date: '2026-06-17',
    icp: 'Painters',
    concept: 'AI pricing support',
    description: 'Structure measurements, prep notes, coating assumptions, labor, and optional upgrades with AI.',
  },
];

const taxonomy = [
  'AI employee fundamentals',
  'AI skills and custom workflows',
  'Agentic operations for small businesses',
  'Contractor and home-service verticals',
  'Local authority + knowledge graph SEO',
  'Data, governance, safety, implementation',
  'Decision, pricing, readiness guides',
  'Field-note industry scenarios',
];

const conceptNodes = [
  ['Owner bottleneck', 'Admin work still depends on the person who should be leading.'],
  ['AI employee', 'A managed system that carries repeated business work across tools and approvals.'],
  ['Custom skill', 'Reusable business knowledge packaged into a task-specific workflow.'],
  ['Approval boundary', 'The line between preparation the AI can do and decisions a human must approve.'],
  ['Local authority', 'Visible proof across services, places, articles, citations, and internal links.'],
  ['Business brain', 'The operating context, examples, templates, rules, and records the system relies on.'],
];

const icpPaths = [
  {
    audience: 'Owner-operators',
    need: 'Learn what to automate without losing judgment.',
    start: 'AMTECH vs. ChatGPT or Claude',
    href: '/articles/amtech-vs-chatgpt-claude',
  },
  {
    audience: 'Contractors',
    need: 'Turn job notes into estimates, follow-up, and cleaner admin.',
    start: 'Create an Estimate With ChatGPT',
    href: '/articles/create-estimate-with-chatgpt',
  },
  {
    audience: 'Future AI sellers',
    need: 'Understand real buyer problems before selling AI services.',
    start: 'AI employee fundamentals',
    href: '/articles/amtech-vs-chatgpt-claude',
  },
];

const sitemapGroups = [
  {
    title: 'Learn',
    links: [
      ['Article hub', '/articles'],
      ['AMTECH vs. ChatGPT or Claude', '/articles/amtech-vs-chatgpt-claude'],
      ['Create an estimate with ChatGPT', '/articles/create-estimate-with-chatgpt'],
    ],
  },
  {
    title: 'Build',
    links: [
      ['Our work', '/our-work'],
      ['How it works', '/how-it-works'],
      ['Schedule a demo', '/schedule-demo'],
    ],
  },
  {
    title: 'Enter the market',
    links: [
      ['Sales bootcamp', '/sales-bootcamp'],
      ['Apply', '/apply'],
      ['Contact', '/contact'],
    ],
  },
];

function ArrowLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-black transition hover:text-red">
      {children} <ArrowRight size={15} />
    </Link>
  );
}

export default function Articles() {
  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_70%_20%,rgba(225,29,42,0.16),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:auto,44px_44px,44px_44px]" />
        <div className="container-wide relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_410px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3.25rem,9vw,8.4rem)] font-black leading-[0.88] tracking-[-0.08em]">
                The AMTECH knowledge graph<span className="text-red">.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/68 md:text-xl">
                Articles, glossary paths, decision guides, and operator maps for business owners learning how AI becomes practical work.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/articles/amtech-vs-chatgpt-claude" className="inline-flex items-center justify-center gap-3 bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-black/85">
                  Start with AI employees <ArrowRight size={16} />
                </Link>
                <Link to="/schedule-demo" className="inline-flex items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-bold text-white transition hover:bg-red-bright">
                  Book a business call <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="border-2 border-black bg-black p-5 text-white shadow-2xl shadow-red/10">
              <GitBranch className="mb-10 h-7 w-7 text-red" />
              <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">A map, not a blog.</h2>
              <p className="mt-5 text-sm leading-6 text-white/62">Every node connects a problem, buyer, tool, workflow, service, and next action. Read until the shape of the system becomes obvious.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.92] tracking-[-0.065em]">Pick a door into the graph.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {icpPaths.map((path) => (
              <Link key={path.audience} to={path.href} className="group border border-white/18 bg-white/[0.03] p-6 transition hover:border-red hover:bg-red/10">
                <Crosshair className="mb-10 h-6 w-6 text-red" />
                <h3 className="text-2xl font-black tracking-[-0.04em]">{path.audience}</h3>
                <p className="mt-4 text-sm leading-6 text-white/62">{path.need}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-white">Start: {path.start} <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-20 md:py-28">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.92] tracking-[-0.065em]">Published nodes.</h2>
            <p className="max-w-2xl text-lg leading-8 text-black/62">The live library starts with comparison and first-action guides. The structure is built to expand into AI employees, custom skills, local authority, safety, readiness, and field-note scenarios.</p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {publishedArticles.map((article) => (
              <Link key={article.href} to={article.href} className="group grid gap-6 border-2 border-black bg-[#f4f4f4] p-6 transition hover:bg-white md:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-8 flex flex-wrap gap-2">
                    <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white">{article.category}</span>
                    <span className="border border-black/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black/54">{article.icp}</span>
                  </div>
                  <h3 className="text-3xl font-black leading-none tracking-[-0.05em]">{article.title}</h3>
                  <p className="mt-5 text-sm leading-6 text-black/62">{article.description}</p>
                </div>
                <div className="flex flex-row justify-between gap-6 border-t border-black/15 pt-5 text-xs font-black uppercase tracking-[0.16em] text-black/42 md:flex-col md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <span>{article.date}</span>
                  <span>{article.concept}</span>
                  <ArrowRight className="text-red transition group-hover:translate-x-1" size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">Glossary by concept.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-black/62">Use these concepts like coordinates. They explain how AMTECH thinks about agents, skills, workflows, governance, local authority, and owner leverage.</p>
          </div>
          <div className="grid gap-px border-2 border-black bg-black sm:grid-cols-2">
            {conceptNodes.map(([term, definition]) => (
              <div key={term} className="bg-white p-5">
                <Sparkles className="mb-8 h-5 w-5 text-red" />
                <h3 className="text-xl font-black tracking-[-0.03em]">{term}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">The editorial sitemap.</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {taxonomy.map((item, index) => (
                <div key={item} className="grid grid-cols-[64px_1fr] border border-white/18 bg-white/[0.03]">
                  <div className="border-r border-white/14 p-4 text-sm font-black text-red">{String(index + 1).padStart(2, '0')}</div>
                  <div className="p-4 text-sm font-bold leading-6 text-white/78">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-red py-20 text-white md:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <Map className="mb-10 h-8 w-8 text-white" />
            <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em]">Sitemap for humans and crawlers.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {sitemapGroups.map((group) => (
              <div key={group.title} className="border border-white/35 bg-black/10 p-5">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-black"><Layers3 size={18} /> {group.title}</h3>
                <div className="space-y-3">
                  {group.links.map(([label, href]) => <ArrowLink key={href} to={href}>{label}</ArrowLink>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">If the map points to your bottleneck, build the system.</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/schedule-demo" className="group border-2 border-black bg-black p-6 text-white transition hover:bg-[#151515]">
              <Compass className="mb-10 h-6 w-6 text-red" />
              <h3 className="text-2xl font-black tracking-[-0.04em]">Business owners</h3>
              <p className="mt-4 text-sm leading-6 text-white/62">Bring the messy workflow. AMTECH will map what should become an AI employee.</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-black">Schedule a demo <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
            </Link>
            <Link to="/sales-bootcamp" className="group border-2 border-black bg-[#f4f4f4] p-6 transition hover:bg-white">
              <BookOpen className="mb-10 h-6 w-6 text-red" />
              <h3 className="text-2xl font-black tracking-[-0.04em]">Future AI sellers</h3>
              <p className="mt-4 text-sm leading-6 text-black/62">Learn the buyer language before selling AI into real businesses.</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-black">Join sales bootcamp <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
