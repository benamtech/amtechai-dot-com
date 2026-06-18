import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, GraduationCap } from 'lucide-react';

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

const ownerSteps = [
  'Read simple AI guides built around real business tasks.',
  'See where automation belongs and where humans approve.',
  'Book a working session when you want the system designed for you.',
];

const builderSteps = [
  'Learn the language of AI, offers, tools, and client problems.',
  'Study use cases that business owners already understand.',
  'Join the sales bootcamp when you are ready to turn AI knowledge into income.',
];

const proofPoints = [
  'Turn job notes into invoices',
  'Sort vendor quotes',
  'Build daily crew briefs',
  'Reconcile materials lists',
  'Draft permit packets',
  'Organize warranty claims',
];

function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex gap-3 text-sm leading-relaxed ${dark ? 'text-white/72' : 'text-black/68'}`}>
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3.35rem,9vw,8.4rem)] font-black leading-[0.88] tracking-[-0.08em]">
                Learn AI. Use it to win<span className="text-red">.</span>
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

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <h2 className="max-w-3xl text-[clamp(2.3rem,5.6vw,5.4rem)] font-black leading-[0.92] tracking-[-0.065em]">Choose the path that fits why you are here.</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-white/18 bg-white/[0.03] p-6">
              <Briefcase className="mb-8 h-6 w-6 text-red" />
              <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">For owners</h3>
              <CheckList dark items={ownerSteps} />
              <Link to="/schedule-demo" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-white">Book when ready <ArrowRight size={15} /></Link>
            </div>
            <div className="border border-red bg-red/10 p-6">
              <GraduationCap className="mb-8 h-6 w-6 text-red" />
              <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">For builders</h3>
              <CheckList dark items={builderSteps} />
              <Link to="/sales-bootcamp" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-white">Join the bootcamp <ArrowRight size={15} /></Link>
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
