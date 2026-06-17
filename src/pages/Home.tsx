import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const workflowRows = [
  ['Missed calls sit until someone remembers.', 'AI calls back, qualifies, logs, and alerts the operator.'],
  ['Estimates wait for the owner at night.', 'AI drafts from notes, photos, and pricing rules for human approval.'],
  ['Payroll prep eats Friday morning.', 'AI organizes timesheets, exceptions, and review notes before approval.'],
  ['Leads disappear into inboxes.', 'AI routes follow-up, creates tasks, and marks next action.'],
  ['Reviews depend on memory.', 'AI requests, tracks, and escalates reputation workflows.'],
];

const guideCards = [
  {
    industry: 'Painting companies',
    title: 'Create and send estimates with an AI agent',
    to: '/articles/estimate-painting-cost-ai',
    details: ['Capture notes, photos, and pricing rules.', 'Keep final price and scope with the owner.', 'Send a cleaner estimate while the job is still warm.'],
  },
  {
    industry: 'Pressure washing',
    title: 'Write a pressure washing estimate with AI',
    to: '/articles/write-pressure-washing-estimate-with-ai',
    details: ['Turn site details into a usable draft.', 'Standardize scope, add-ons, and exclusions.', 'Reduce quote delays after walkthroughs.'],
  },
  {
    industry: 'Local service teams',
    title: 'Know when ChatGPT is not enough',
    to: '/articles/amtech-vs-chatgpt-claude',
    details: ['Separate prompts from operating systems.', 'Connect follow-up, records, and approvals.', 'Build repeatable workflows instead of one-off chats.'],
  },
];

const systemCategories = [
  'Missed-call recovery agents — callback, qualify, book, alert.',
  'Estimate drafting systems — collect inputs, draft scope, prepare quote.',
  'Invoice and payment follow-up — remind, log, escalate, report.',
  'Payroll prep assistants — organize hours, exceptions, job notes.',
  'Lead follow-up systems — route conversations and next actions.',
  'Review-request engines — request, track, and organize reputation signals.',
  'Hiring intake agents — screen applicants and summarize fit.',
  'Operator dashboards — show what happened, what matters, and what needs approval.',
];

const industries = ['Painting', 'Cleaning', 'HVAC', 'Roofing', 'Landscaping', 'Plumbing', 'Real estate', 'Medical practices', 'Professional services', 'Local service businesses'];
const skills = ['Estimate generator', 'Payroll prep assistant', 'Missed-call recovery agent', 'Review-request agent', 'Invoice follow-up agent', 'Hiring intake agent', 'Customer reactivation agent', 'Dispatch assistant', 'Lead qualification agent', 'CRM update agent'];

function ProcedureList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex gap-3 text-sm leading-relaxed ${dark ? 'text-white/68' : 'text-black/68'}`}>
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
      <section className="relative overflow-hidden border-b border-black/10 bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_20%_0%,rgba(225,29,42,0.18),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(0,0,0,0.08),transparent_30%)]" />
        <div className="container-wide relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,8.5vw,8rem)] font-black leading-[0.9] tracking-[-0.075em]">
                Install AI into the work your business actually does<span className="text-red">.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/70 md:text-xl">
                AMTECH builds practical AI systems for small and medium businesses: missed-call recovery, estimate drafting, payroll prep, lead follow-up, invoice chasing, booking, dispatch, reviews, and the admin work that slows operators down.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/schedule-demo" className="inline-flex items-center justify-center gap-3 rounded-full bg-red px-7 py-4 text-sm font-bold text-white shadow-red-glow-btn transition hover:bg-red-bright">
                  Book an operator briefing <ArrowRight size={16} />
                </Link>
                <Link to="/our-work" className="inline-flex items-center justify-center gap-3 rounded-full border border-black/15 bg-black/[0.03] px-7 py-4 text-sm font-bold text-black transition hover:border-black/25 hover:bg-black/[0.07]">
                  See the work <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/10 text-sm">
                {[
                  ['Built for', 'SMB owners'],
                  ['First wins', 'Faster response'],
                  ['Control', 'Human approval'],
                  ['Output', 'Cleaner admin'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{label}</p>
                    <p className="mt-2 font-bold text-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-narrow">
          <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.96] tracking-[-0.06em]">The next employee in your business may not be a person. But the operator is still in charge.</h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/66">AI is strongest when the work is clear: read the request, prepare the draft, update the record, flag the exception, and wait for approval when judgment matters.</p>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-20 md:py-24">
        <div className="container-wide">
          <h2 className="mb-10 max-w-3xl text-[clamp(2rem,4.6vw,4.5rem)] font-black leading-none tracking-[-0.055em]">Replace loose follow-up with operating systems.</h2>
          <div className="overflow-hidden rounded-3xl border border-black/12">
            <div className="grid grid-cols-2 bg-black text-sm font-bold text-white"><div className="p-4">The old way</div><div className="border-l border-white/20 p-4">The AMTECH system</div></div>
            {workflowRows.map(([oldWay, newWay]) => (
              <div key={oldWay} className="grid border-t border-black/10 md:grid-cols-2">
                <div className="bg-white p-5 text-black/62">{oldWay}</div>
                <div className="border-t border-black/10 bg-[#f7f7f7] p-5 font-semibold text-black md:border-l md:border-t-0">{newWay}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide">
          <h2 className="mb-5 max-w-4xl text-[clamp(2rem,4.6vw,4.5rem)] font-black leading-none tracking-[-0.055em]">Learn the workflows worth automating first.</h2>
          <p className="mb-12 max-w-2xl text-lg leading-8 text-black/62">Start with the operational problems customers feel immediately: slow estimates, missed calls, inconsistent follow-up, and admin tasks that pull owners out of revenue work.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {guideCards.map((card) => (
              <Link key={card.title} to={card.to} className="group flex min-h-[360px] flex-col rounded-3xl border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:border-red/40 hover:shadow-xl hover:shadow-black/5">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.13em] text-red">{card.industry}</p>
                <h3 className="mb-5 text-2xl font-black leading-tight tracking-[-0.035em]">{card.title}</h3>
                <ProcedureList items={card.details} />
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-black group-hover:text-red">Read the guide <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-start">
          <div><h2 className="text-[clamp(2rem,4.5vw,4.2rem)] font-black leading-none tracking-[-0.055em]">Human judgment stays at the center.</h2><p className="mt-6 max-w-xl text-white/60">Automation should make the next decision easier, not hide the decision. AMTECH systems are built around approvals, exceptions, and customer-sensitive moments.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 p-6"><h3 className="mb-4 text-lg font-black">Human operator</h3><ProcedureList dark items={['Defines rules, pricing, boundaries, approvals.', 'Reviews exceptions and sensitive moments.', 'Makes final decisions.', 'Owns the customer relationship.']} /></div>
            <div className="rounded-3xl border border-red/60 bg-red/10 p-6"><h3 className="mb-4 text-lg font-black">AI system</h3><ProcedureList dark items={['Reads inbound data and applies the procedure.', 'Drafts, routes, reminds, and updates records.', 'Prepares the work before review.', 'Protects response time and operational memory.']} /></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div><h2 className="text-[clamp(2rem,4.4vw,4rem)] font-black leading-none tracking-[-0.055em]">Practical AI systems for the administrative work that blocks growth.</h2></div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10">
            {systemCategories.map((item, index) => (
              <div key={item} className="grid grid-cols-[72px_1fr] bg-white"><div className="border-r border-black/10 p-4 text-sm font-black text-red">{String(index + 1).padStart(2, '0')}</div><div className="p-4 text-sm leading-6 text-black/72">{item}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-black py-20 text-white md:py-28">
        <div className="container-wide">
          <h2 className="max-w-5xl text-[clamp(2.6rem,7vw,7rem)] font-black leading-[0.9] tracking-[-0.075em]">Most AI projects fail because they start with software instead of procedure<span className="text-red">.</span></h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/64">AMTECH starts with the task: inputs, outputs, failure points, approval moments, and the customer experience. The software comes after the operating logic is clear.</p>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div><h2 className="mb-8 text-4xl font-black tracking-[-0.05em] md:text-6xl">Industries we build for.</h2><div className="flex flex-wrap gap-2">{industries.map((item) => <span key={item} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">{item}</span>)}</div></div>
          <div><h2 className="mb-8 text-4xl font-black tracking-[-0.05em] md:text-6xl">Jobs AI can take off your desk.</h2><div className="flex flex-wrap gap-2">{skills.map((item) => <span key={item} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">{item}</span>)}</div></div>
        </div>
      </section>

      <section className="bg-red py-20 text-white md:py-24">
        <div className="container-wide grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><h2 className="max-w-4xl text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.95] tracking-[-0.065em]">Bring us one repetitive task. We will show you where AI belongs.</h2><p className="mt-6 max-w-2xl text-white/82">Map the old workflow, define approval points, and identify the first system worth building.</p></div>
          <div className="flex flex-col gap-3"><Link to="/schedule-demo" className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-black">Book an operator briefing <ArrowRight size={16} /></Link><Link to="/our-work" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-7 py-4 text-sm font-black text-white">See the work <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  );
}
