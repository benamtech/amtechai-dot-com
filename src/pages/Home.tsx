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
    details: ['Inputs: customer request, site notes, pricing rules, photos', 'Human review: final price and scope', 'Output: draft estimate ready to send'],
  },
  {
    industry: 'Cleaning companies',
    title: 'Complete weekly payroll review in under 20 minutes',
    details: ['Inputs: timesheets, job schedule, exception notes', 'Human review: hours, overtime, adjustments', 'Output: payroll summary and exception list'],
  },
  {
    industry: 'HVAC companies',
    title: 'Recover missed calls before the lead books elsewhere',
    details: ['Inputs: missed-call log, service area, booking rules', 'Human review: escalated exceptions', 'Output: callback result, booked appointment, CRM note'],
  },
  {
    industry: 'Roofing companies',
    title: 'Turn inspection notes into follow-up tasks',
    details: ['Inputs: inspection record, customer status, quote stage', 'Human review: offer and timeline', 'Output: follow-up sequence and sales task list'],
  },
  {
    industry: 'Real estate wholesalers',
    title: 'Convert lead lists into booked seller conversations',
    details: ['Inputs: lead list, call rules, qualification script', 'Human review: appointment readiness', 'Output: booked meeting and outcome dashboard'],
  },
  {
    industry: 'Professional services',
    title: 'Route intake requests without losing context',
    details: ['Inputs: form submissions, email requests, qualification rules', 'Human review: unusual cases', 'Output: organized intake record and next action'],
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

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div className={`mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] ${dark ? 'text-white/55' : 'text-black/55'}`}>
      <span className="h-2 w-2 bg-red" />
      <span>{children}</span>
    </div>
  );
}

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
      <section className="relative border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-8 grid max-w-3xl grid-cols-2 border border-black text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-black/60 md:grid-cols-4">
                {['AI operating procedures', 'SMB owners', 'Time back', 'Operator approval'].map((item) => (
                  <div key={item} className="border-r border-black/20 px-3 py-3 last:border-r-0 md:px-4">{item}</div>
                ))}
              </div>
              <h1 className="max-w-5xl text-[clamp(3.2rem,9vw,8.6rem)] font-black leading-[0.88] tracking-[-0.08em]">
                Install AI into the work your business actually does<span className="text-red">.</span>
              </h1>
              <p className="mt-9 max-w-3xl text-lg leading-8 text-black/70 md:text-xl">
                AMTECH builds and teaches AI operating systems for small and medium businesses: missed-call recovery, estimate drafting, payroll prep, lead follow-up, invoice chasing, booking, dispatch, reviews, and the practical admin work that slows operators down.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-black/58">
                This is not AI hype. This is procedure, infrastructure, and training for serious business owners entering the next operating era.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/schedule-demo" className="inline-flex items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-bold text-white transition hover:bg-red-bright">
                  Book an operator briefing <ArrowRight size={16} />
                </Link>
                <Link to="/our-work" className="inline-flex items-center justify-center gap-3 border border-black px-7 py-4 text-sm font-bold text-black transition hover:bg-black hover:text-white">
                  Open the field guide index <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="border-2 border-black bg-[#f4f4f4] p-5">
              <div className="border-b border-black pb-4 text-sm font-bold uppercase tracking-[0.12em]">Public field manual</div>
              <div className="space-y-5 pt-5 text-sm leading-6 text-black/68">
                <p><strong className="text-black">Built for:</strong> ambitious operators who know AI matters but do not know where it fits into daily work.</p>
                <p><strong className="text-black">Output:</strong> clearer procedures, faster response, cleaner admin, and approval points the owner can trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1fr]">
          <SectionLabel dark>Operating premise</SectionLabel>
          <div>
            <h2 className="max-w-4xl text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.96] tracking-[-0.06em]">The next employee in your business may not be a person. But the operator is still in charge.</h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/66">AI is not a replacement for judgment. It is an instrument for repetitive work: reading messages, drafting replies, preparing estimates, organizing leads, updating records, and surfacing exceptions before they become expensive.</p>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white py-20 md:py-24">
        <div className="container-wide">
          <SectionLabel>Workflow comparison</SectionLabel>
          <div className="border-2 border-black">
            <div className="grid grid-cols-2 bg-black text-sm font-bold uppercase tracking-[0.12em] text-white"><div className="p-4">The old way</div><div className="border-l border-white/30 p-4">The AMTECH system</div></div>
            {workflowRows.map(([oldWay, newWay]) => (
              <div key={oldWay} className="grid border-t border-black md:grid-cols-2">
                <div className="p-5 text-black/62">{oldWay}</div>
                <div className="border-t border-black bg-[#f4f4f4] p-5 font-semibold text-black md:border-l md:border-t-0">{newWay}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-black/60">The machine handles repetition. The human approves judgment.</p>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.7fr_1fr]"><SectionLabel>Operating library</SectionLabel><h2 className="text-[clamp(2rem,4.6vw,4.5rem)] font-black leading-none tracking-[-0.055em]">Every guide is a business procedure, not a blog post.</h2></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guideCards.map((card) => (
              <article key={card.title} className="border-2 border-black bg-white p-5">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.13em] text-red">{card.industry}</p>
                <h3 className="mb-5 text-xl font-black leading-tight tracking-[-0.025em]">{card.title}</h3>
                <ProcedureList items={card.details} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-2">
            <div><SectionLabel dark>System diagram</SectionLabel><h2 className="text-[clamp(2rem,4.5vw,4.2rem)] font-black leading-none tracking-[-0.055em]">Human does / AI does.</h2><p className="mt-6 max-w-xl text-white/60">AMTECH systems are designed around approval points. Automation without control is not operational progress.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-white/25 p-5"><h3 className="mb-4 text-lg font-black">Human operator</h3><ProcedureList dark items={['Defines rules, pricing, boundaries, approvals.', 'Reviews exceptions and customer-sensitive moments.', 'Makes final decisions.', 'Owns the customer relationship.']} /></div>
              <div className="border border-red bg-red/10 p-5"><h3 className="mb-4 text-lg font-black">AI system</h3><ProcedureList dark items={['Reads inbound data and applies the defined procedure.', 'Drafts, routes, reminds, summarizes, and updates records.', 'Prepares the work so decisions happen faster.', 'Protects response time and operational memory.']} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><SectionLabel>System categories</SectionLabel><h2 className="text-[clamp(2rem,4.4vw,4rem)] font-black leading-none tracking-[-0.055em]">Practical AI systems for the administrative work that blocks growth.</h2></div>
          <div className="grid gap-px border-2 border-black bg-black">
            {systemCategories.map((item, index) => (
              <div key={item} className="grid grid-cols-[72px_1fr] bg-white"><div className="border-r border-black p-4 text-sm font-black text-red">{String(index + 1).padStart(2, '0')}</div><div className="p-4 text-sm leading-6 text-black/72">{item}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-black py-20 text-white md:py-28">
        <div className="container-wide">
          <SectionLabel dark>Evidence plate</SectionLabel>
          <h2 className="max-w-5xl text-[clamp(2.6rem,7vw,7rem)] font-black leading-[0.9] tracking-[-0.075em]">Most AI projects fail because they start with software instead of procedure<span className="text-red">.</span></h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/64">AMTECH starts with the task: who does it, what inputs it needs, what output matters, what can go wrong, and where the human must approve. Only then do we build the agent, dashboard, or workflow.</p>
          <div className="mt-10 grid gap-3 md:grid-cols-5">{['Before/after workflow', 'Output specimen', 'Operator checklist', 'Exception log', 'Dashboard panel'].map((item) => <div key={item} className="border border-white/18 p-4 text-sm font-semibold text-white/72">{item}</div>)}</div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div><SectionLabel>Index / industries</SectionLabel><h2 className="mb-8 text-4xl font-black tracking-[-0.05em] md:text-6xl">Find the work by industry.</h2><div className="flex flex-wrap gap-2">{industries.map((item) => <span key={item} className="border border-black bg-white px-4 py-2 text-sm font-semibold">{item}</span>)}</div></div>
          <div><SectionLabel>Index / AI skills</SectionLabel><h2 className="mb-8 text-4xl font-black tracking-[-0.05em] md:text-6xl">Find the system by job-to-be-done.</h2><div className="flex flex-wrap gap-2">{skills.map((item) => <span key={item} className="border border-black bg-white px-4 py-2 text-sm font-semibold">{item}</span>)}</div></div>
        </div>
      </section>

      <section className="bg-red py-20 text-white md:py-24">
        <div className="container-wide grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><h2 className="max-w-4xl text-[clamp(2.2rem,5vw,5rem)] font-black leading-[0.95] tracking-[-0.065em]">If your business has repeated administrative work, there is probably a procedure to install.</h2><p className="mt-6 max-w-2xl text-white/82">Bring the task. We will map the old workflow, define the approval points, identify where AI belongs, and show what system should be built first.</p></div>
          <div className="flex flex-col gap-3"><Link to="/schedule-demo" className="inline-flex items-center justify-center gap-3 bg-white px-7 py-4 text-sm font-black text-black">Book an operator briefing <ArrowRight size={16} /></Link><Link to="/our-work" className="inline-flex items-center justify-center gap-3 border border-white px-7 py-4 text-sm font-black text-white">Browse field guides <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  );
}
