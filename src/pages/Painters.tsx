import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Receipt, Users, Search } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const jobs = [
  {
    icon: FileText,
    title: 'Estimates and proposals',
    body: 'You describe the job in your own words. The employee turns it into an estimate in your rates and your format, in about two minutes, while you watch. No more nights writing numbers out by hand.',
  },
  {
    icon: Receipt,
    title: 'Invoicing and getting paid',
    body: 'When a job is done, it sends the invoice. When a customer has not paid, it sends a reminder and you decide how firm to be. Your money stops depending on your memory.',
  },
  {
    icon: Users,
    title: 'Clients and follow-up',
    body: 'Every lead and every client in one place, so nothing falls through a crack. It can connect to the software you already use, or keep the list for you. It follows up the way you would, because it learns your voice.',
  },
  {
    icon: Search,
    title: 'Local SEO and marketing',
    body: 'It makes your business easy to find online for Google and for the new AI assistants people ask when they say "find me a painter near me." Real pages about the work you actually do, not a blog full of filler.',
  },
];

const faqs = [
  {
    q: 'Will my clients know it is AI?',
    a: 'Only if you want them to. You approve every message before it goes out, so it reads like you — because it learns your voice.',
  },
  {
    q: 'What if it gets a number wrong?',
    a: 'You check every estimate before it is sent. It drafts, you approve. And it gets sharper on your rates and your customers every week.',
  },
  {
    q: 'How long does setup take?',
    a: 'A couple of hours of calls. We learn your rates, your services, your customers, and your rules. Then it works in your phone and your email — nothing new to learn.',
  },
  {
    q: 'Do I need to know AI?',
    a: 'No. If you can text, you can run it. You describe the job in your own words; it does the office work.',
  },
];

export default function Painters() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-20 md:pt-44 md:pb-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse at center, rgba(228, 37, 28, 0.10) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <h1 className="font-display text-display-hero text-black">
                You run the crew.
                <br />
                <span className="text-red">AMTECH runs the office.</span>
              </h1>
              <p className="mt-7 max-w-xl font-body text-body-lg leading-relaxed text-black/60">
                AMTECH is an AI employee for your painting company. It writes your estimates, sends
                your invoices, and follows up with your clients — while you are on the ladder. You
                approve everything before it goes out.
              </p>
              <ul className="mt-6 max-w-xl space-y-2.5 font-body text-body-md leading-relaxed text-black/60">
                <li className="flex gap-3"><span className="text-red">—</span>Estimates in your rates and your format, drafted while you watch.</li>
                <li className="flex gap-3"><span className="text-red">—</span>Invoices and reminders that go out on time, without you remembering.</li>
                <li className="flex gap-3"><span className="text-red">—</span>Follow-up on every lead, in your voice, so no job slips.</li>
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/schedule-demo" className="btn-primary">
                  Show me it write an estimate
                  <ArrowRight size={16} />
                </Link>
                <a href="#what-it-does" className="btn-secondary">
                  What it handles
                </a>
              </div>
              <p className="mt-4 font-body text-sm leading-relaxed text-black/45">
                Free demo. Bring a real job and watch it become an estimate in about two minutes.
              </p>
            </AnimatedSection>
            <AnimatedSection direction="left" delay={0.1}>
              <img
                src="/painters-hero.jpg"
                alt="Stone vault ribs — the mason's work, in grayscale and red"
                className="w-full rounded-3xl shadow-glass-lg"
                loading="eager"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                Half your market is already asking AI for a painter.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                45% of consumers now use AI tools to find local businesses, up from 6% a year
                earlier (BrightLocal, 2026). When someone asks an AI assistant to find them a
                painter, the businesses that come back are the ones the AI can read. Paid leads do
                not close the gap: contractors pay about $54 per lead for Google Local Services Ads
                (SearchLight Digital, 2026).
              </p>
              <p className="mt-5 font-body text-body-md leading-relaxed text-black/50">
                AMTECH makes your business readable where the new customers are looking.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FOUR JOBS */}
      <section id="what-it-does" className="bg-[#FAFAFA]">
        <div className="container-wide py-20 md:py-24">
          <AnimatedSection>
            <h2 className="font-display text-display-lg text-black">Four jobs. One hire.</h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {jobs.map((j, i) => (
              <AnimatedSection key={j.title} delay={i * 0.07}>
                <div className="glass-card h-full p-8">
                  <j.icon size={24} className="text-red" strokeWidth={1.75} />
                  <h3 className="mt-5 font-display text-display-sm text-black">{j.title}</h3>
                  <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{j.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* YOU STAY IN CHARGE */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                You stay in charge. <span style={{ color: '#2563EB' }}>That is the point.</span>
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                The employee drafts. You approve. Every estimate, every invoice, every message
                waits for your yes before it goes out. 78% of small-business owners do not fully
                trust AI to work without oversight (Business.com, 2026) — so AMTECH is built around
                your approval, not around replacing you.
              </p>
              <p className="mt-5 font-body text-body-md leading-relaxed text-black/50">
                It drafts the estimate; you check the numbers. That is ten minutes, not an evening.
                You will still check its work — and you should.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* THE BRIDGE */}
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <img
                src="/painters-bridge.jpg"
                alt="A typewriter — the old office instrument, rendered in grayscale and red"
                className="w-full rounded-3xl shadow-glass-lg"
                loading="lazy"
              />
            </AnimatedSection>
            <AnimatedSection direction="left" delay={0.1}>
              <h2 className="font-display text-display-md text-black">
                If you use ChatGPT, you already know the feeling.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                You already have a computer write a caption or tidy up your notes. That is what it
                feels like to hand it a piece of writing and get a finished result back. AMTECH
                does that for your whole office. The employee already knows your rates, your
                customers, and the way you write, so it works without you driving each step.
              </p>
              <p className="mt-5 font-body text-body-md leading-relaxed text-black/50">
                Never used any of it? Simpler still: it is an extra pair of hands for everything
                that happens on a computer. You talk to it. You approve what matters. It types.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* NOT ANOTHER SCREEN */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                Other tools make you type more. This does the work.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                Estimating apps and customer lists are screens you fill in yourself, so the work is
                still yours. AMTECH works the other way round: you say what you want, and it does
                the steps. You approve the money and what goes out to a customer. It shows you what
                it did.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ONE LINE INSTEAD OF FOUR */}
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                You already pay for this. Just in four places.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                An SEO company. A customer list. An estimating app. Add them up and you are already
                past $1,500 a month — before any of it actually gets done. AMTECH is one employee
                and one bill, from $1,500 a month.
              </p>
              <div className="mt-8">
                <Link to="/pricing" className="btn-secondary">
                  See what $1,500 a month replaces
                  <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAIR QUESTIONS */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                Fair questions, straight answers.
              </h2>
            </AnimatedSection>
            <div className="mt-10 space-y-6">
              {faqs.map((f, i) => (
                <AnimatedSection key={f.q} delay={i * 0.05}>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-display-sm text-black">{f.q}</h3>
                    <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{f.a}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                We run our own business on it.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                AMTECH runs its own company on an AI employee, and has since August 2026. We write
                our own estimates, answer our own email, and keep our own records with the same
                setup we would build for you. We would not ask you to try something we do not use
                every day.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <div className="rounded-3xl bg-black p-10 md:p-16">
              <h2 className="max-w-3xl font-display text-display-xl text-white">
                Watch it become an estimate.
              </h2>
              <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-white/70">
                Book a call and bring a painting job you need priced. Watch it become a full
                estimate, in your rates and your format, in about two minutes. Then decide if you
                want the rest of the office off your desk.
              </p>
              <div className="mt-10">
                <Link to="/schedule-demo" className="btn-primary">
                  Book a demo
                  <ArrowRight size={16} />
                </Link>
              </div>
              <p className="mt-6 font-mono text-xs text-white/40">
                Free. No software to install. AI employees are early access for a small number of
                businesses.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}