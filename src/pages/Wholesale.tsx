import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ─── Campaign Dashboard Component ───────────────────────────────────────────

const statusRows = [
  { label: 'Not Called', count: 247, pulse: false },
  { label: 'No Answer', count: 89, pulse: false },
  { label: 'Reached', count: 34, pulse: false },
  { label: 'Interested', count: 12, pulse: false },
  { label: 'Callback', count: 8, pulse: false },
  { label: 'Meeting Booked', count: 3, pulse: true },
];

function CampaignDashboard() {
  return (
    <div className="border border-white/10 bg-black w-full">
      <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
          Campaign Dashboard — Wholesale Lead Qualifier
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E11D2A] animate-pulse" />
          <span className="font-mono text-[0.55rem] uppercase tracking-wider text-[#E11D2A]">Live</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.06] p-px">
        {statusRows.map((row) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`bg-black px-5 py-4 relative ${row.pulse ? 'ring-1 ring-[#E11D2A]/40' : ''}`}
          >
            {row.pulse && (
              <motion.div
                className="absolute inset-0 bg-[#E11D2A]/5"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <p className={`font-mono text-2xl font-bold leading-none ${row.pulse ? 'text-[#E11D2A]' : 'text-white'}`}>
              {row.count}
            </p>
            <p className="mt-1.5 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-white/30">
              {row.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="border-t border-white/10 px-5 py-3 flex items-center gap-2"
      >
        <span className="text-[#E11D2A]">
          <Check size={11} />
        </span>
        <span className="font-mono text-[0.58rem] text-white/40">
          SMS sent · Calendar event created
        </span>
      </motion.div>
    </div>
  );
}

// ─── Lead List Dashboard Component ──────────────────────────────────────────

const leads = [
  { name: 'Martinez, R.', status: 'Callback Requested', attempts: 2, highlight: false, dim: false },
  { name: 'Okafor Property', status: 'Meeting Booked', attempts: 1, highlight: true, dim: false },
  { name: 'Chen Holdings', status: 'Interested', attempts: 3, highlight: false, dim: true },
  { name: '[number]', status: 'No Answer', attempts: 4, highlight: false, dim: false },
  { name: '[number]', status: 'Bad Number', attempts: 1, highlight: false, dim: false },
];

function LeadListDashboard() {
  return (
    <div className="border border-white/10 bg-black w-full">
      <div className="border-b border-white/10 px-5 py-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
          Active Campaign — Lead Outcomes
        </span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {leads.map((lead) => (
          <div
            key={lead.name + lead.status}
            className={`flex items-center justify-between px-5 py-3.5 ${
              lead.highlight ? 'border-l-2 border-[#E11D2A]' : lead.dim ? 'border-l-2 border-[#E11D2A]/25' : 'border-l-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-[0.7rem] text-white/60 shrink-0 w-32 truncate">
                {lead.name}
              </span>
              <span className={`font-mono text-[0.65rem] uppercase tracking-wider ${
                lead.highlight ? 'text-[#E11D2A]' : lead.dim ? 'text-[#E11D2A]/50' : 'text-white/30'
              }`}>
                {lead.status}
              </span>
            </div>
            <span className="font-mono text-[0.58rem] text-white/20 shrink-0">
              {lead.attempts} attempt{lead.attempts !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared primitives ───────────────────────────────────────────────────────

function RedButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 bg-[#E11D2A] px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-[#FF1A2B] active:scale-[0.98]"
      onClick={() => window.gtag?.('event', 'cta_click', { page: 'wholesale' })}
    >
      {children}
      <ArrowRight size={13} />
    </a>
  );
}

function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/70 transition-all duration-200 hover:border-white/50 hover:text-white active:scale-[0.98]"
    >
      {children}
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#E11D2A] mb-4">
      {children}
    </p>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const CTA_HREF = 'mailto:ben@amtechai.com?subject=Wholesale Beta Application';
const DEMO_HREF = 'mailto:ben@amtechai.com?subject=Wholesale Demo Request';

export default function Wholesale() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Nav ── */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-base font-black tracking-[0.06em] text-white">AMTECH</span>
          <span className="text-base font-black text-[#E11D2A]">.</span>
        </Link>
        <a
          href={CTA_HREF}
          className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#E11D2A] hover:text-white transition-colors"
        >
          Apply for Beta
        </a>
      </header>

      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06] px-6 py-24 md:py-36">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel>AI Wholesale Real Estate Launch Lab</SectionLabel>
            <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] font-black leading-[1] tracking-[-0.04em] text-white">
              Stop Dialing<br />
              From Spreadsheets.<br />
              <span className="text-[#E11D2A]">Let AI Work<br />the List.</span>
            </h1>
            <p className="mt-8 max-w-xl font-body text-[1rem] leading-[1.75] text-white/50">
              AMTECH gives aspiring and active wholesalers an AI acquisition system — lead upload, batch calling, outcome tracking, calendar booking, and SMS alerts. You follow up. The AI does the rest.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <RedButton href={CTA_HREF}>Apply for Beta Access</RedButton>
              <OutlineButton href="#how-it-works">See How It Works</OutlineButton>
            </div>
            <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#E11D2A]/70">
              Beta cohort: 5 users max. Hands-on setup included.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <CampaignDashboard />
          </motion.div>
        </div>
      </section>

      {/* ── 2. Problem ── */}
      <section className="border-b border-white/[0.06] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-black leading-[1.1] tracking-[-0.03em] text-white max-w-3xl mb-16"
          >
            The Bottleneck Is Infrastructure. Not Motivation.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
            {[
              "Most beginner wholesalers have lists.\nThey don\u2019t have a system for working them.",
              "Manual cold calling burns time and filters people out before they close a single deal.",
              "Scattered spreadsheets and missed callbacks kill deals that were already in reach.",
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black px-8 py-10"
              >
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#E11D2A] mb-5">
                  0{i + 1}
                </p>
                <p className="font-body text-[0.95rem] leading-[1.75] text-white/55 whitespace-pre-line">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center font-display text-[1.1rem] font-semibold text-white tracking-[-0.01em]"
          >
            The system should tell you who to call. Not make you guess.
          </motion.p>
        </div>
      </section>

      {/* ── 3. System Workflow ── */}
      <section id="how-it-works" className="border-b border-white/[0.06] bg-[#0A0A0A] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>System Architecture</SectionLabel>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-black tracking-[-0.03em] text-white mb-16">
            How the AMTECH Acquisition System Works
          </h2>

          {/* Step flow */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-stretch min-w-max gap-0">
              {[
                'Upload List',
                'Select Agent',
                'Launch Batch',
                'AI Calls Leads',
                'Dashboard Updates',
                'Booking Detected',
                'Calendar Event Created',
                'SMS Alert Sent',
              ].map((step, i) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className={`border border-white/10 px-5 py-4 text-center min-w-[120px] ${
                      i === 7 ? 'border-[#E11D2A]/50 bg-[#E11D2A]/5' : 'bg-black'
                    }`}
                  >
                    <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-white/25 mb-2">
                      Step {i + 1}
                    </p>
                    <p className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${
                      i === 7 ? 'text-[#E11D2A]' : 'text-white/80'
                    }`}>
                      {step}
                    </p>
                  </motion.div>
                  {i < 7 && (
                    <div className="w-6 shrink-0 flex items-center justify-center">
                      <div className="h-px w-full bg-white/10" />
                      <span className="text-white/20 text-xs absolute ml-1">›</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 font-mono text-[0.7rem] text-white/35 tracking-[0.1em]">
            The human follows up. The system handles the rest.
          </p>
        </div>
      </section>

      {/* ── 4. What You Get ── */}
      <section className="border-b border-white/[0.06] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Included in Beta</SectionLabel>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-black tracking-[-0.03em] text-white mb-16">
            The System
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
            {[
              {
                title: 'AMTECH Campaign Dashboard',
                body: 'Lead pool, call outcomes, opportunities, booked meetings, and next actions — organized by campaign, not raw call log.',
              },
              {
                title: 'Wholesale Lead Qualifier Agent',
                body: 'An AI voice agent configured for seller acquisition: qualifies interest, collects callback details, identifies appointment opportunities.',
              },
              {
                title: 'Batch Calling System',
                body: 'Upload a list, select your agent, launch a batch. The system calls the leads and returns structured outcomes.',
              },
              {
                title: 'Calendar Booking Automation',
                body: 'When a call outcome resolves as booked, AMTECH creates a Google Calendar event and invites you automatically.',
              },
              {
                title: 'SMS Appointment Alerts',
                body: 'You receive a text the moment a new appointment is created. No dashboard monitoring required.',
              },
              {
                title: 'Weekly Implementation Support',
                body: 'Live weekly sessions to review campaigns, troubleshoot outcomes, and improve execution.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-black border-t-2 border-[#E11D2A] px-8 py-8"
              >
                <h3 className="font-display text-[0.95rem] font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="font-body text-[0.875rem] leading-[1.7] text-white/40">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Dashboard Section ── */}
      <section className="border-b border-white/[0.06] bg-[#0A0A0A] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>Outcome Tracking</SectionLabel>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-black tracking-[-0.03em] text-white mb-8">
              The Dashboard Tells You What Happened
            </h2>
            <div className="space-y-5 text-white/50 font-body text-[0.95rem] leading-[1.75]">
              <p>
                Every lead in your campaign has a status. AMTECH tracks the full lifecycle so you know exactly who to contact and why.
              </p>
              <p>
                Most non-connections are normal outbound attrition — no answer, voicemail, unavailable lines. AMTECH separates those from real outcomes.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <LeadListDashboard />
          </motion.div>
        </div>
      </section>

      {/* ── 6. Who This Is For ── */}
      <section className="border-b border-white/[0.06] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Fit</SectionLabel>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-black tracking-[-0.03em] text-white mb-16">
            This System Is Not for Everyone
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
            <div className="bg-black px-8 py-10">
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#E11D2A] mb-8">
                This is for you if:
              </h3>
              <div className="space-y-5">
                {[
                  'You are willing to pull or pay for lead lists.',
                  'You will follow up fast when a booking appears.',
                  'You understand this requires execution, not just access.',
                  'You are an existing wholesaler who wants AI-assisted outbound.',
                  'You can commit real time to implementation.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check size={13} className="text-[#E11D2A] shrink-0 mt-0.5" />
                    <p className="font-body text-[0.875rem] leading-snug text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black px-8 py-10">
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/25 mb-8">
                This is not for you if:
              </h3>
              <div className="space-y-5">
                {[
                  'People expecting passive income or guaranteed deals.',
                  'People unwilling to call leads back.',
                  'People with no budget for lists or calls.',
                  'People who want a magic button.',
                  'People unwilling to learn compliance and follow-up basics.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <X size={13} className="text-white/20 shrink-0 mt-0.5" />
                    <p className="font-body text-[0.875rem] leading-snug text-white/30">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Beta Application ── */}
      <section className="border-b border-white/[0.06] bg-[#0A0A0A] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>Beta Access</SectionLabel>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-black tracking-[-0.04em] text-white mb-8">
              Controlled Beta.<br />5 Users Maximum.
            </h2>
            <div className="space-y-4 text-white/50 font-body text-[0.95rem] leading-[1.75] mb-4 max-w-xl mx-auto">
              <p>
                We are opening a small first cohort for the AI Wholesale Real Estate Launch Lab. Setup and support are hands-on, so we are keeping the group small.
              </p>
              <p>
                If accepted, we review your goals, market, list plan, and follow-up capacity before configuring your campaign.
              </p>
            </div>
            <p className="font-mono text-[0.75rem] text-white/70 mb-10">
              Beta entry:{' '}
              <span className="text-white font-semibold">$1,000–$2,000</span>{' '}
              depending on setup and support needs.
            </p>
            <RedButton href={CTA_HREF}>Apply for Beta Access</RedButton>
            <p className="mt-6 font-mono text-[0.58rem] text-white/20 max-w-md mx-auto leading-relaxed">
              No income guarantees. Results depend on execution, list quality, market conditions, and compliance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. Disclaimer ── */}
      <section className="border-b border-white/[0.06] px-6 py-14 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-white/20 mb-5">
            Important — Results Disclaimer
          </p>
          <p className="font-body text-[0.8rem] leading-[1.75] text-white/25">
            This system provides AI-assisted outreach infrastructure and implementation support. Results depend on list quality, market conditions, follow-up, negotiation, and user execution. AMTECH does not guarantee deals, income, or any specific business outcome.
          </p>
          <p className="mt-3 font-body text-[0.8rem] leading-[1.75] text-white/25">
            Users are responsible for compliance with applicable real estate, telemarketing, and privacy laws in their jurisdiction. AMTECH provides software and support — not legal, financial, or real estate advice.
          </p>
        </div>
      </section>

      {/* ── 9. Final CTA ── */}
      <section className="px-6 py-24 md:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black tracking-[-0.04em] text-white mb-6">
              Ready to Run Your First<br />AI Acquisition Campaign?
            </h2>
            <p className="font-body text-[0.95rem] leading-[1.75] text-white/40 max-w-lg mx-auto mb-10">
              Apply for the beta. We keep the cohort small so setup is supported from day one.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <RedButton href={CTA_HREF}>Apply for Beta Access</RedButton>
              <OutlineButton href={DEMO_HREF}>Request a Demo</OutlineButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-8 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-sm font-black tracking-[0.06em] text-white">AMTECH</span>
          <span className="text-sm font-black text-[#E11D2A]">.</span>
        </Link>
        <p className="font-mono text-[0.58rem] text-white/20">
          &copy; {new Date().getFullYear()} AMTECH.
        </p>
      </footer>

    </div>
  );
}
