import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, CalendarDays, Compass, Layers3, Search, Sparkles, Tags, Users } from 'lucide-react';

const articles = [
  {
    title: 'AMTECH vs. ChatGPT or Claude: What’s the Difference?',
    href: '/articles/amtech-vs-chatgpt-claude',
    category: 'AI fundamentals',
    date: 'June 17, 2026',
    icp: 'Business owners',
    entity: 'AI employee',
    description: 'A practical comparison for owners deciding between DIY chat tools and a custom AI employee.',
    featured: true,
  },
  {
    title: 'Create an Estimate With ChatGPT',
    href: '/articles/create-estimate-with-chatgpt',
    category: 'Prompt guides',
    date: 'June 17, 2026',
    icp: 'Contractors',
    entity: 'Contractor estimates',
    description: 'A copy-ready prompt and workflow for turning field context into a professional estimate draft.',
    featured: true,
  },
  {
    title: 'Write a Pressure Washing Estimate With AI',
    href: '/articles/write-pressure-washing-estimate-with-ai',
    category: 'Industry guides',
    date: 'June 17, 2026',
    icp: 'Exterior cleaners',
    entity: 'AI estimating',
    description: 'Use AI to organize pressure washing scope, assumptions, exclusions, upgrades, and pricing review.',
  },
  {
    title: 'Estimate Painting Cost With AI',
    href: '/articles/estimate-painting-cost-ai',
    category: 'Industry guides',
    date: 'June 17, 2026',
    icp: 'Painters',
    entity: 'AI pricing support',
    description: 'Structure measurements, prep notes, coating assumptions, labor, and optional upgrades with AI.',
  },
];

const categories = [
  ['AI fundamentals', 'Start here if you are learning what AI can and cannot do for a real business.', '/articles?category=ai-fundamentals'],
  ['Prompt guides', 'Copy-ready workflows for documents, estimates, follow-up, and repeatable office work.', '/articles?category=prompt-guides'],
  ['Industry guides', 'Vertical examples for contractors, cleaners, painters, roofers, and local services.', '/articles?category=industry-guides'],
  ['AI employees', 'How custom agents, skills, approvals, records, dashboards, and handoffs fit together.', '/articles?category=ai-employees'],
  ['Local authority', 'Content, service pages, entities, places, proof, and internal links as growth infrastructure.', '/articles?category=local-authority'],
  ['Implementation', 'Data, safety, governance, readiness, pricing, and where human approval belongs.', '/articles?category=implementation'],
];

const rolePaths = [
  {
    role: 'Business owners',
    icon: Briefcase,
    summary: 'Learn what to automate, where AI belongs, and when to work with a consultant.',
    links: [
      ['AMTECH vs. ChatGPT or Claude', '/articles/amtech-vs-chatgpt-claude'],
      ['Create an estimate with ChatGPT', '/articles/create-estimate-with-chatgpt'],
    ],
  },
  {
    role: 'Contractors',
    icon: Compass,
    summary: 'Start with estimating, job notes, follow-up, pricing assumptions, and customer-ready documents.',
    links: [
      ['Pressure washing estimate guide', '/articles/write-pressure-washing-estimate-with-ai'],
      ['Painting cost with AI', '/articles/estimate-painting-cost-ai'],
    ],
  },
  {
    role: 'Future AI sellers',
    icon: Users,
    summary: 'Study buyer problems before trying to sell AI services into owner-led companies.',
    links: [
      ['Read the AI employee comparison', '/articles/amtech-vs-chatgpt-claude'],
      ['Join sales bootcamp', '/sales-bootcamp'],
    ],
  },
];

const glossary = [
  ['AI employee', 'A business-specific system that completes repeated office work under rules and approvals.'],
  ['Custom AI skill', 'A reusable procedure, prompt, example set, or tool instruction for one type of work.'],
  ['Owner bottleneck', 'The point where every estimate, invoice, follow-up, or decision still waits on the owner.'],
  ['Approval boundary', 'The rule that decides what AI can prepare and what a human must approve.'],
  ['Business brain', 'The records, examples, templates, rules, and operating context the system uses.'],
  ['Entity SEO', 'Organizing content around visible people, services, industries, problems, places, and proof.'],
];

const sitemapGroups = [
  {
    title: 'Read',
    links: [
      ['All articles', '/articles'],
      ['AI fundamentals', '/articles?category=ai-fundamentals'],
      ['Prompt guides', '/articles?category=prompt-guides'],
    ],
  },
  {
    title: 'Apply',
    links: [
      ['Our work', '/our-work'],
      ['How it works', '/how-it-works'],
      ['Schedule a demo', '/schedule-demo'],
    ],
  },
  {
    title: 'Train',
    links: [
      ['Sales bootcamp', '/sales-bootcamp'],
      ['Apply', '/apply'],
      ['Contact', '/contact'],
    ],
  },
];

function TextLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-black transition hover:text-red">
      {children} <ArrowRight size={15} />
    </Link>
  );
}

export default function Articles() {
  const featured = articles.filter((article) => article.featured);

  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_70%_20%,rgba(225,29,42,0.16),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:auto,44px_44px,44px_44px]" />
        <div className="container-wide relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_410px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3.25rem,9vw,8.4rem)] font-black leading-[0.88] tracking-[-0.08em]">
                AI learning library<span className="text-red">.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/68 md:text-xl">
                Practical articles, prompts, definitions, and implementation paths for business owners learning where AI actually fits.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/articles/amtech-vs-chatgpt-claude" className="inline-flex items-center justify-center gap-3 bg-black px-7 py-4 text-sm font-bold text-white transition hover:bg-black/85">
                  Start with AI basics <ArrowRight size={16} />
                </Link>
                <Link to="/articles/create-estimate-with-chatgpt" className="inline-flex items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-bold text-white transition hover:bg-red-bright">
                  Use a prompt now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="border-2 border-black bg-black p-5 text-white shadow-2xl shadow-red/10">
              <Search className="mb-10 h-7 w-7 text-red" />
              <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">Find the useful next thing.</h2>
              <p className="mt-5 text-sm leading-6 text-white/62">Browse by topic, role, entity, or recency. The goal is simple: learn enough to make a better operating decision.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide">
          <div className="mb-12 grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.92] tracking-[-0.065em]">Featured articles.</h2>
            <p className="max-w-2xl text-lg leading-8 text-white/62">A traditional starting shelf: one strategic comparison, one practical prompt workflow, both written for owner-led companies.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {featured.map((article) => (
              <Link key={article.href} to={article.href} className="group border border-white/18 bg-white/[0.03] p-6 transition hover:border-red hover:bg-red/10">
                <div className="mb-10 flex flex-wrap gap-2">
                  <span className="bg-red px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white">{article.category}</span>
                  <span className="border border-white/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/54">{article.icp}</span>
                </div>
                <h3 className="text-3xl font-black leading-none tracking-[-0.05em] md:text-4xl">{article.title}</h3>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/62">{article.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-white">Read featured article <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[310px_1fr] lg:items-start">
          <aside className="border-2 border-black bg-[#f4f4f4] p-5 lg:sticky lg:top-28">
            <Tags className="mb-8 h-6 w-6 text-red" />
            <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">Browse by topic.</h2>
            <div className="mt-8 space-y-3">
              {categories.map(([title, , href]) => <TextLink key={title} to={href}>{title}</TextLink>)}
            </div>
          </aside>
          <div>
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 className="text-[clamp(2rem,4.5vw,4.4rem)] font-black leading-[0.94] tracking-[-0.06em]">Latest library entries.</h2>
              <CalendarDays className="hidden h-8 w-8 text-red sm:block" />
            </div>
            <div className="grid gap-4">
              {articles.map((article) => (
                <Link key={article.href} to={article.href} className="group grid gap-6 border-2 border-black bg-[#f4f4f4] p-6 transition hover:bg-white md:grid-cols-[1fr_220px]">
                  <div>
                    <div className="mb-6 flex flex-wrap gap-2">
                      <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white">{article.category}</span>
                      <span className="border border-black/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black/54">{article.entity}</span>
                    </div>
                    <h3 className="text-3xl font-black leading-none tracking-[-0.05em]">{article.title}</h3>
                    <p className="mt-5 text-sm leading-6 text-black/62">{article.description}</p>
                  </div>
                  <div className="flex flex-row justify-between gap-5 border-t border-black/15 pt-5 text-xs font-black uppercase tracking-[0.16em] text-black/42 md:flex-col md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <span>{article.date}</span>
                    <span>{article.icp}</span>
                    <ArrowRight className="text-red transition group-hover:translate-x-1" size={18} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide">
          <div className="mb-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">Browse by category.</h2>
            <p className="max-w-2xl text-lg leading-8 text-black/62">These shelves organize the library by entity and item type: articles, prompts, guides, implementation notes, glossary entries, and buyer paths.</p>
          </div>
          <div className="grid gap-px border-2 border-black bg-black md:grid-cols-2 lg:grid-cols-3">
            {categories.map(([title, description, href]) => (
              <Link key={title} to={href} className="group bg-white p-5 transition hover:bg-[#f4f4f4]">
                <Layers3 className="mb-8 h-5 w-5 text-red" />
                <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/62">{description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-black">Open category <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">Read by role.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/62">Business education pages work best when the reader can see themselves. Start with the path closest to the job you are trying to do.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {rolePaths.map((path) => {
              const Icon = path.icon;
              return (
                <div key={path.role} className="border border-white/18 bg-white/[0.03] p-6">
                  <Icon className="mb-10 h-6 w-6 text-red" />
                  <h3 className="text-2xl font-black tracking-[-0.04em]">{path.role}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/62">{path.summary}</p>
                  <div className="mt-8 space-y-3">
                    {path.links.map(([label, href]) => <TextLink key={href} to={href}>{label}</TextLink>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">Glossary.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-black/62">The core concepts behind AMTECH articles, category pages, and implementation guides.</p>
          </div>
          <div className="grid gap-px border-2 border-black bg-black sm:grid-cols-2">
            {glossary.map(([term, definition]) => (
              <div key={term} className="bg-[#f4f4f4] p-5">
                <Sparkles className="mb-8 h-5 w-5 text-red" />
                <h3 className="text-xl font-black tracking-[-0.03em]">{term}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red py-20 text-white md:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <BookOpen className="mb-10 h-8 w-8 text-white" />
            <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.94] tracking-[-0.06em]">Sitemap.</h2>
            <p className="mt-6 max-w-xl text-white/78">A compact index for readers and crawlers: learn, apply, or train into the AI market.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {sitemapGroups.map((group) => (
              <div key={group.title} className="border border-white/35 bg-black/10 p-5">
                <h3 className="mb-5 text-lg font-black">{group.title}</h3>
                <div className="space-y-3">
                  {group.links.map(([label, href]) => <TextLink key={href} to={href}>{label}</TextLink>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
