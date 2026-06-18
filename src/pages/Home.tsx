import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, Sparkles } from 'lucide-react';
import { getNodesByIds } from '../lib/articleKnowledgeGraph';

const learningLinks = [
  {
    title: 'AMTECH vs ChatGPT and Claude',
    description: 'Know when a prompt is enough and when the business needs a governed system.',
    to: '/articles/amtech-vs-chatgpt-claude',
  },
  {
    title: 'Create an estimate with ChatGPT',
    description: 'A practical first step for turning job details into clearer scopes and numbers.',
    to: '/articles/create-estimate-with-chatgpt',
  },
  {
    title: 'Build a business brain for free',
    description: 'Start organizing the memory your future AI systems will need to work well.',
    to: '/articles/business-brain-free',
  },
];

const repeatDrag = [
  'Job notes, photos, texts, and voice memos wait for the owner to turn them into action.',
  'Quotes, invoices, and follow-up get delayed because the day is already full.',
  'Crews ask the same questions because direction is scattered across calls and messages.',
  'Customers want fast answers while the office work lives in too many places.',
  'The business is growing, but too much growth still means more owner hours.',
  'AI sounds useful, but the owner does not have time to become the software department.',
];

const agentCapabilities = [
  'Turn job notes into estimates, work orders, invoices, and follow-up drafts',
  'Read intake forms, emails, photos, PDFs, spreadsheets, and customer history',
  'Prepare daily crew briefs, material lists, punch lists, and status updates',
  'Sort vendor quotes, flag missing information, and compare options',
  'Answer routine customer questions with the right context and escalation rules',
  'Keep reviews, referrals, reactivation, reminders, and nurture follow-up moving',
  'Build owner dashboards from sales, jobs, calls, margins, inventory, or bookings',
  'Operate around approvals so the human stays in control where judgment matters',
];

const businessExamples = [
  {
    business: 'Painting contractor',
    before: 'The owner carries estimate details, change orders, color notes, and follow-up in memory.',
    after: 'AMTECH turns photos and notes into scopes, crew briefs, material checks, customer updates, and review requests.',
  },
  {
    business: 'Hardware store',
    before: 'Inventory questions, seasonal demand, contractor accounts, and vendor information live in disconnected systems.',
    after: 'A practical agent helps surface buying decisions, quote requests, product answers, reorders, and local customer follow-up.',
  },
  {
    business: 'Busy restaurant',
    before: 'Reservations, events, reviews, staff notes, ordering, and customer messages compete for attention every day.',
    after: 'The system organizes demand, drafts responses, tracks recurring issues, supports staff handoff, and protects the owner’s time.',
  },
];

const journeySections = [
  {
    eyebrow: 'Pace the current reality',
    title: 'You are not behind. You are carrying too many repeat loops by hand.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80',
    alt: 'Contractor reviewing plans and job paperwork.',
    body: [
      'Most serious local businesses already have the skill, reputation, crews, customers, and demand. The problem is that too many ordinary processes still depend on the owner noticing, remembering, deciding, typing, chasing, and checking.',
      'That is not a character flaw. It is an operating-system problem. When repeat work has no system, it keeps pulling your attention away from the decisions only you can make.',
      'AMTECH starts there: with the work that repeats every week and the friction you already feel.',
    ],
  },
  {
    eyebrow: 'Future pace the owner',
    title: 'Picture your 2028 operating day.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    alt: 'Business owner reviewing numbers in a modern planning workspace.',
    body: [
      'It is Monday morning in 2028. You are not digging through texts before the crews leave. The briefs are ready. Open items are surfaced. The jobs that need your judgment are clearly marked.',
      'You review real numbers: booked work, outstanding estimates, margin warnings, repeat customers, crew capacity, aging invoices, and the next best opportunities. You can feel the difference because the business is quieter even while it is doing more.',
      'You are winning better jobs, protecting your evenings, and operating from visibility instead of pressure.',
    ],
  },
  {
    eyebrow: 'Activate the success mechanism',
    title: 'Remove the automatic drag so your best judgment can aim at growth.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1400&q=80',
    alt: 'Organized workbench with tools and project documentation.',
    body: [
      'A business owner’s success mechanism works best when the target is clear and the clutter is reduced. If the goal is better jobs, stronger margins, faster follow-up, and calmer execution, the repeat loops need to stop consuming the owner’s attention.',
      'Hermes agents and custom AMTECH agents are built for that layer. They handle the practical, repeatable, computer-based work around your real operation so your energy can go back to sales, leadership, hiring, customer relationships, and high-value decisions.',
      'The point is not to become an AI expert. The point is to become the operator whose business has practical systems.',
    ],
  },
  {
    eyebrow: 'Reinforce the new identity',
    title: 'The serious operator does not wait to “figure AI out.” They build the next system.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    alt: 'Clean operating dashboard with business data.',
    body: [
      'There is a version of your business where the website explains clearly, the intake is organized, the follow-up happens, the office has memory, and the owner sees the truth quickly enough to act.',
      'That version is not magic. It is built from ordinary steps: source data, workflow rules, approval points, dashboards, automations, and agents that fit how your company already works.',
      'AMTECH helps you step into that identity now: practical, serious, calm, and ahead of the next operating standard.',
    ],
  },
];

const outcomes = [
  'Cleaner mornings and fewer late-night admin sessions',
  'Faster movement from lead to quote to scheduled work to invoice',
  'Better crew direction without the owner repeating the same explanation',
  'More accurate numbers for pricing, staffing, purchasing, and growth',
  'More freedom to think, sell, lead, and choose the jobs worth taking',
];

const funnelArticles = getNodesByIds(['E1', 'E4', 'E5', 'E3']).map((node) => ({
  title: node.title,
  description: node.description,
  to: node.href,
}));

export default function Home() {
  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="mb-6 font-mono text-xs font-black uppercase tracking-[0.28em] text-red">For contractors and local operators</p>
              <h1 className="max-w-6xl text-[clamp(3.2rem,8.5vw,8.8rem)] font-black leading-[0.86] tracking-[-0.085em]">
                Build the business that gives you room<span className="text-red">.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/70 md:text-xl">
                AMTECH builds practical AI systems for serious local businesses: contractors, hardware stores, restaurants, shops, service companies, and any operation where repeat computer work is stealing owner time.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/schedule-demo" className="inline-flex items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-black text-white transition hover:bg-red-bright">
                  Map your first system <ArrowRight size={16} />
                </Link>
                <Link to="/articles" className="inline-flex items-center justify-center gap-3 border-2 border-black px-7 py-4 text-sm font-black transition hover:bg-black hover:text-white">
                  Learn what AI can do <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="border-2 border-black bg-[#f4f4f4] p-6">
              <Briefcase className="mb-8 h-7 w-7 text-red" />
              <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">The old self-image:</h2>
              <p className="mt-4 text-sm leading-6 text-black/64">“I am the person who has to remember everything, approve everything, and clean it up later.”</p>
              <div className="my-6 h-px bg-black/20" />
              <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">The new one:</h2>
              <p className="mt-4 text-sm leading-6 text-black/64">“I am the operator who builds systems, sees the numbers, and has space to lead.”</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-red">What it feels like now</p>
            <h2 className="mt-5 text-[clamp(2.35rem,5.6vw,5.4rem)] font-black leading-[0.9] tracking-[-0.07em]">Buried in work that should not need your highest skill.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {repeatDrag.map((item) => (
              <div key={item} className="border-2 border-black bg-white p-5 text-sm font-black leading-6 tracking-[-0.02em]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4]">
        {journeySections.map((section, index) => (
          <article key={section.title} className={`border-b-4 border-black ${index % 2 === 1 ? 'bg-black text-white' : 'bg-[#f4f4f4] text-black'}`}>
            <div className={`container-wide grid lg:grid-cols-2 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative aspect-[4/5] min-h-[500px] overflow-hidden border-x-4 border-black lg:aspect-auto lg:min-h-[650px]">
                <img src={section.image} alt={section.alt} className="h-full w-full object-cover grayscale" loading="lazy" />
                <div className={`absolute inset-0 ${index % 2 === 1 ? 'bg-black/25' : 'bg-red/10 mix-blend-multiply'}`} />
              </div>
              <div className="flex min-h-[560px] flex-col justify-center py-14 lg:px-14 lg:py-20">
                <div className="border-2 border-current bg-white/5 p-7 md:p-10">
                  <p className="mb-5 font-mono text-xs font-black uppercase tracking-[0.24em] text-red">{section.eyebrow}</p>
                  <h3 className="text-[clamp(2.05rem,4.8vw,5rem)] font-black leading-[0.91] tracking-[-0.065em]">{section.title}</h3>
                  <div className="mt-8 space-y-5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className={`text-base leading-8 md:text-lg ${index % 2 === 1 ? 'text-white/72' : 'text-black/66'}`}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="border-b-4 border-black bg-white py-20 md:py-28">
        <div className="container-wide">
          <div className="max-w-5xl">
            <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-red">Capability breadth</p>
            <h2 className="mt-5 text-[clamp(2.35rem,5.8vw,5.8rem)] font-black leading-[0.9] tracking-[-0.07em]">If the business uses a computer, an agent can probably remove drag.</h2>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-black/64">A basic Hermes agent or custom AMTECH agent is not limited to one trade. It can support normal business work across documents, emails, calendars, forms, CRMs, spreadsheets, phones, reviews, inventory, estimates, bookings, and reports.</p>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {agentCapabilities.map((capability) => (
              <div key={capability} className="border-2 border-black bg-[#f4f4f4] p-5">
                <CheckCircle2 className="mb-5 h-5 w-5 text-red" />
                <p className="text-sm font-black leading-6 tracking-[-0.02em]">{capability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black py-20 text-white md:py-28">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="text-[clamp(2.3rem,5.5vw,5.4rem)] font-black leading-[0.9] tracking-[-0.07em]">Different businesses. Same operating advantage.</h2>
            <p className="max-w-2xl text-lg leading-8 text-white/64">AMTECH does not sell a generic chatbot. We study the repeat loops in the business, then build the simplest system that gives the owner freedom, clarity, and leverage.</p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {businessExamples.map((example) => (
              <div key={example.business} className="border border-white/18 bg-white/[0.03] p-7">
                <h3 className="text-2xl font-black tracking-[-0.04em] text-white">{example.business}</h3>
                <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-red">Before</p>
                <p className="mt-2 leading-7 text-white/58">{example.before}</p>
                <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red">After</p>
                <p className="mt-2 leading-7 text-white/72">{example.after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Sparkles className="mb-8 h-7 w-7 text-red" />
            <h2 className="text-[clamp(2.1rem,5vw,4.8rem)] font-black leading-[0.92] tracking-[-0.065em]">What freedom and abundance look like in operations.</h2>
            <p className="mt-6 text-lg leading-8 text-black/64">Not hype. More room. Better attention. Cleaner decisions. A business that can absorb opportunity without automatically turning it into chaos.</p>
          </div>
          <div className="grid gap-4">
            {outcomes.map((outcome) => (
              <div key={outcome} className="border-2 border-black bg-white p-6 text-xl font-black leading-tight tracking-[-0.04em]">
                {outcome}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-20 md:py-28">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="max-w-3xl text-[clamp(2.3rem,5.4vw,5rem)] font-black leading-[0.92] tracking-[-0.065em]">Learn enough to make the next serious move.</h2>
            <p className="max-w-2xl text-lg leading-8 text-black/64">Use the articles to understand the tools. Use AMTECH when you are ready to turn repeat work into a practical operating system.</p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {learningLinks.map((article) => (
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
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {funnelArticles.slice(0, 2).map((article) => (
              <Link key={article.to} to={article.to} className="group border-2 border-black bg-white p-6 transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]">
                <h3 className="text-2xl font-black leading-tight tracking-[-0.04em]">{article.title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/62">{article.description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-black">Read article <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-red">Next step</p>
            <h2 className="mt-5 text-[clamp(2.35rem,5.8vw,5.8rem)] font-black leading-[0.9] tracking-[-0.07em]">Bring the repeat work. We will map the system.</h2>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/66">If you are a serious operator, you do not need more random AI noise. You need the first practical system that gives the business memory, direction, and room to grow.</p>
          </div>
          <div className="border border-red bg-red/10 p-7 md:p-9">
            <h3 className="text-3xl font-black leading-none tracking-[-0.05em]">Start with one workflow.</h3>
            <p className="mt-5 leading-7 text-white/64">Estimates, follow-up, customer intake, job handoff, inventory, reporting, reviews, scheduling, or admin cleanup. One clear target is enough to begin.</p>
            <Link to="/schedule-demo" className="mt-9 inline-flex items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-black text-white transition hover:bg-red-bright">
              Schedule a demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
