import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { getNodesByIds } from '../lib/articleKnowledgeGraph';

const articleLinks = [
  {
    title: 'AMTECH vs ChatGPT and Claude',
    description: 'Learn when DIY AI is enough and when a business needs a custom system.',
    to: '/articles/amtech-vs-chatgpt-claude',
  },
  {
    title: 'Create an estimate with ChatGPT',
    description: 'A practical starting point for using AI on real contractor work.',
    to: '/articles/create-estimate-with-chatgpt',
  },
  {
    title: 'Write a pressure washing estimate with AI',
    description: 'See how prompts, scope, and review come together in a field workflow.',
    to: '/articles/write-pressure-washing-estimate-with-ai',
  },
];


const funnelArticles = getNodesByIds(['E1', 'E4', 'E5', 'E3']).map((node) => ({
  title: node.title,
  description: node.description,
  to: node.href,
}));

const funnelSections = [
  {
    title: 'Most contractors are still figuring this out — and that is normal.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    alt: 'Contractor reviewing plans in a workshop.',
    body: [
      'Most AI adoption is still exploratory. Serious business owners are not behind; they are at the decision point where the next advantage gets built.',
      'The businesses pulling ahead are not chasing every app. They are choosing the repeatable work that matters and shaping systems around how the operation already runs.',
      'The move is from “AI sounds interesting” to “this is how it works inside the business.”',
    ],
    related: { label: 'Compare DIY tools with governed systems', to: '/articles/amtech-vs-chatgpt-claude' },
  },
  {
    title: 'The real shift is not more tools. It is removing the friction already felt every week.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    alt: 'Organized tools and work documentation on a bench.',
    body: [
      'Job notes become invoices. Vendor quotes get sorted. Daily crew briefs get written. Materials, permits, and warranty claims stop living in scattered folders and owner memory.',
      'This work does not need your highest skill. It needs consistency, context, and attention — exactly where a designed workflow can carry the load.',
      'When repeat work is handled reliably, crews get clearer direction, customers get faster answers, and the owner gets time back for growth.',
    ],
    related: { label: 'Build a business brain first', to: '/articles/business-brain-free' },
  },
  {
    title: 'What becomes possible when repeat work stops eating the day.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Professional job site with organized construction activity.',
    body: [
      'High-value jobs and customer relationships get more attention. Invoicing moves faster. Quote, material, and coordination errors are easier to catch before they cost money.',
      'The business sees what is happening and can take on more work without adding the same proportion of admin hours.',
      'Those are not abstract AI promises. They are what happens when weekly friction gets removed.',
    ],
    related: { label: 'Create an estimate with ChatGPT', to: '/articles/create-estimate-with-chatgpt' },
  },
  {
    title: 'The data favors teams that move from experiments to workflow redesign.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    alt: 'Clean dashboard and operating data on a monitor.',
    stats: ['95% use AI tools', '75% report productivity gains', 'Several hours freed weekly'],
    body: [
      'Most organizations experimenting with AI see productivity gains. The larger lift comes when repeatable workflows are redesigned around real data, approval points, and customer promises.',
      'For contractors and local service businesses, the highest-leverage opportunities are documentation, quoting, coordination, and back-office cleanup.',
      'The gap is no longer access to AI. The gap is who builds something that fits how the business runs.',
    ],
    related: { label: 'Turn sales data into owner decisions', to: '/articles/garden-center-spring-buy-plan-ai' },
  },
  {
    title: 'Your business two years from now, if the systems start getting built today.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern team workspace with planning materials and laptops.',
    body: [
      'Picture the operation in 2028. Field notes become accurate invoices. Vendor quotes are compared. Crews start with crisp briefs. Materials, permits, and warranties stay tracked.',
      'The owner is not buried in details that used to eat nights and weekends. The owner is reviewing real numbers, talking with customers, winning better jobs, and planning growth.',
      'Competitors doing everything the old way work longer hours for similar results. The advantage belongs to businesses that treat AI as a practical system, not another app.',
    ],
    related: { label: 'Plan from real business memory', to: '/articles/business-brain-free' },
  },
  {
    title: 'The practical difference between exploring AI and actually using it.',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80',
    alt: 'Hands working with paperwork and professional tools.',
    body: [
      'Generic chat tools can help with estimates and notes. But when work is repeatable, tied to money, and visible to customers, one-off prompts can create as much cleanup as they save.',
      'Reliable results come from systems designed around workflow steps, source data, approval points, exceptions, and the human judgment that still matters.',
      'That is the difference between trying AI and having something that works inside the operation.',
    ],
    related: { label: 'See where custom systems beat chat tools', to: '/articles/amtech-vs-chatgpt-claude' },
  },
];


const businessExamples: Array<{
  business: string;
  before: string;
  after: string;
}> = [];

const repeatWorkOutcomes = [
  'More time for high-value jobs and customer relationships',
  'Faster turnaround from job completion to invoicing',
  'Fewer quote, material, and coordination errors',
  'Clearer visibility into what is actually happening',
  'More capacity without proportionally more admin hours',
];

const proofPoints = [
  'Turn job notes into invoices',
  'Sort vendor quotes',
  'Build daily crew briefs',
  'Reconcile materials lists',
  'Draft permit packets',
  'Organize warranty claims',
];


export default function Home() {
  return (
    <main className="bg-[#f4f4f4] text-black" data-business-examples-count={businessExamples.length}>
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3.35rem,9vw,8.4rem)] font-black leading-[0.88] tracking-[-0.08em]">
                Learn AI. <br/> Use it to win<span className="text-red">.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/70 md:text-xl">
                AMTECH helps business owners understand AI and customize it to work within their business.
              </p>
            </div>
            <div className="grid gap-3">
              <Link to="/articles" className="group border-2 border-black bg-[#f4f4f4] p-5 transition hover:bg-white">
                <Briefcase className="mb-8 h-6 w-6 text-red" />
                <h2 className="text-2xl font-black tracking-[-0.04em]">I run a business.</h2>
                <p className="mt-3 text-sm leading-6 text-black/62">Learn what AI can do, then work with AMTECH to map and build the right system.</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-black">Go to business path <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
              <Link to="/sales-bootcamp" className="group border-2 border-black bg-black p-5 text-white transition hover:bg-[#151515]">
                <GraduationCap className="mb-8 h-6 w-6 text-red" />
                <h2 className="text-2xl font-black tracking-[-0.04em]">I work in sales.</h2>
                <p className="mt-3 text-sm leading-6 text-white/62">Learn the basics, understand what businesses buy, and train toward selling AI services.</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white">Go to bootcamp path <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-20 md:py-28">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="max-w-3xl text-[clamp(2.3rem,5.4vw,5rem)] font-black leading-[0.92] tracking-[-0.065em]">Start with the basics. Follow the problem.</h2>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {articleLinks.map((article) => (
              <Link key={article.to} to={article.to} className="group flex min-h-[230px] flex-col justify-between border-2 border-black bg-[#f4f4f4] p-6 transition hover:bg-white">
                <BookOpen className="h-6 w-6 text-red" />
                <div>
                  <h3 className="text-2xl font-black leading-tight tracking-[-0.04em]">{article.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-black/62">{article.description}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-black text-black">Read article <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.06em]">When the work repeats, AI can help.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-black/62">AMTECH focuses on the repeat work most contractors, local service companies, and traditional small businesses still handle by hand: paperwork, job details, vendor coordination, and back-office cleanup.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point} className="border-2 border-black bg-white p-5 text-sm font-black leading-tight tracking-[-0.02em]">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-20 md:py-28">
        <div className="container-wide">
          <div className="max-w-5xl">
            <h2 className="text-[clamp(2.5rem,6.5vw,6.7rem)] font-black leading-[0.88] tracking-[-0.075em]">
              From curiosity to operating advantage.
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-black/64">
              Most buyers will research long before they are ready to buy. The smart move is education, memory, and practical clarity: what repeats, what costs time, what needs approval, and what can become a trusted system.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4]">
        {funnelSections.map((section, index) => (
          <article key={section.title} className={`border-b-4 border-black ${index % 2 === 1 ? 'bg-black text-white' : 'bg-[#f4f4f4] text-black'}`}>
            <div className={`container-wide grid gap-0 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative aspect-[4/5] min-h-[520px] overflow-hidden border-x-4 border-black lg:aspect-auto lg:min-h-[620px]">
                <img src={section.image} alt={section.alt} className="h-full w-full object-cover grayscale" loading="lazy" />
                <div className={`absolute inset-0 ${index % 2 === 1 ? 'bg-black/25' : 'bg-red/10 mix-blend-multiply'}`} />
              </div>
              <div className="flex min-h-[560px] flex-col justify-center px-0 py-14 lg:px-14 lg:py-20">
                <div className="border-2 border-current bg-white/5 p-7 md:p-10">
                  <h3 className="text-[clamp(2.05rem,4.8vw,5rem)] font-black leading-[0.91] tracking-[-0.065em]">{section.title}</h3>
                  <div className="mt-8 space-y-5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className={`text-base leading-8 md:text-lg ${index % 2 === 1 ? 'text-white/70' : 'text-black/66'}`}>{paragraph}</p>
                    ))}
                  </div>
                  <Link
                    to={section.related.to}
                    className={`mt-8 inline-flex items-center gap-2 border-b-2 pb-1 text-sm font-black transition ${index % 2 === 1 ? 'border-white/30 text-white hover:border-white' : 'border-black/25 text-black hover:border-black'}`}
                  >
                    {section.related.label}
                    <ArrowRight size={15} />
                  </Link>
                  {'stats' in section && section.stats ? (
                    <div className="mt-8 grid gap-3 md:grid-cols-3">
                      {section.stats.map((stat) => (
                        <div key={stat} className="border-2 border-red bg-red/10 p-4 text-xl font-black leading-tight tracking-[-0.04em] text-red">{stat}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Sparkles className="mb-8 h-7 w-7 text-red" />
            <h2 className="text-[clamp(2.1rem,5vw,4.8rem)] font-black leading-[0.92] tracking-[-0.065em]">Articles that make AI practical.</h2>
            <p className="mt-6 text-lg leading-8 text-black/64">We write plain-English articles for owners who want to understand AI before they buy it, build it, or trust it with real work.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {funnelArticles.map((article) => (
              <Link key={article.to} to={article.to} className="group flex min-h-[210px] flex-col justify-between border-2 border-black bg-white p-6 transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]">
                <BookOpen className="h-6 w-6 text-red" />
                <div>
                  <h3 className="text-2xl font-black leading-tight tracking-[-0.04em]">{article.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-black/62">{article.description}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-black text-black">Read article <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-[clamp(2.15rem,5vw,4.9rem)] font-black leading-[0.92] tracking-[-0.065em]">What this is really about.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              AI is useful when it gives the business more time, fewer errors, and clearer decisions. The win is not novelty. The win is a calmer operation that can handle more work without adding more chaos.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-2 border-white bg-white p-7 text-black">
              <h3 className="text-2xl font-black tracking-[-0.04em]">Less drag.</h3>
              <p className="mt-4 leading-7 text-black/64">Notes, quotes, invoices, and follow-up move faster because the repeat work has a place to go.</p>
            </div>
            <div className="border-2 border-white bg-white p-7 text-black">
              <h3 className="text-2xl font-black tracking-[-0.04em]">More room.</h3>
              <p className="mt-4 leading-7 text-black/64">Owners get time back for customers, hiring, sales, and the decisions that actually move the business.</p>
            </div>
            <div className="border border-white/18 p-7 md:col-span-2">
              <div className="grid gap-3 md:grid-cols-3">
                {repeatWorkOutcomes.slice(1, 4).map((outcome) => (
                  <p key={outcome} className="text-sm font-black leading-6 tracking-[-0.02em] text-white/72">
                    {outcome}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div className="border border-white/18 p-7 md:p-9">
            <h2 className="text-[clamp(2rem,4.4vw,4.2rem)] font-black leading-[0.94] tracking-[-0.06em]">Need the tech guy?</h2>
            <p className="mt-6 max-w-xl text-white/64">Bring the messy process. AMTECH helps define the workflow, approval points, data, and first system worth building.</p>
            <Link to="/schedule-demo" className="mt-9 inline-flex items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-black text-white transition hover:bg-red-bright">
              Schedule a demo <ArrowRight size={16} />
            </Link>
          </div>
          <div className="border border-red bg-red/10 p-7 md:p-9">
            <h2 className="text-[clamp(2rem,4.4vw,4.2rem)] font-black leading-[0.94] tracking-[-0.06em]">Want to sell AI?</h2>
            <p className="mt-6 max-w-xl text-white/64">Learn the basics, understand the buyer, and train for conversations that turn AI interest into real opportunity.</p>
            <Link to="/sales-bootcamp" className="mt-9 inline-flex items-center justify-center gap-3 bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-white/90">
              Join sales bootcamp <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
