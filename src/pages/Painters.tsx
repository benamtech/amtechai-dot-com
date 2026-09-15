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

const notAnotherScreen = [
  {
    title: 'You approve the important parts.',
    body: 'Money and customer contact stay in your hands. You approve before anything is sent or any money moves. Everything else it just does, and then shows you what it did.',
  },
  {
    title: 'It learns your business once, then stops needing to be told.',
    body: 'Your rates, your scope, your customers, the way you write and talk. It learns these once and uses them on every job after. You are not re-explaining yourself every time.',
  },
  {
    title: 'It improves on its own.',
    body: 'The technology behind it keeps getting better, so your employee gets better without you doing anything. Software you buy off the shelf is exactly as good the day you buy it as it will ever be. This is the opposite.',
  },
];

export default function Painters() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-20 md:pt-44 md:pb-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.05) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <p className="mono-label mb-5 text-red">For painting contractors</p>
            <h1 className="max-w-4xl font-display text-display-hero text-black">
              You run the crew.
              <br />
              <span className="text-black/40">AMTECH runs the office.</span>
            </h1>
            <p className="mt-8 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              AMTECH is an AI employee for your painting business. You talk or type what needs
              doing, and it gets done: the estimate, the invoice, the follow-up, the marketing.
              You stay in charge. The paper work stops piling up on you.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/schedule-demo" className="btn-primary">
                See it write an estimate
                <ArrowRight size={16} />
              </Link>
              <a href="#what-it-does" className="btn-secondary">
                What it handles
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* WHAT AN AI EMPLOYEE IS — bridges both audiences */}
      <section className="bg-white">
        <div className="container-narrow py-16 md:py-20">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">What an AI employee is</p>
            <h2 className="max-w-3xl font-display text-display-md text-black">
              If you already talk to AI, you already know half of this.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              You use ChatGPT or Claude for a caption, a second opinion, or turning rough notes
              into something that reads more official. That is what it feels like to hand a
              computer a piece of writing and get a finished result back. AMTECH takes that same
              feeling and runs it all the way to the end. The employee already knows your rates,
              your customers, your scope, and the way you write. So instead of you copying notes
              into a chat window every single time, it writes the estimate for every job, sends
              the invoice after, and follows up the leads you would have forgotten. You are not
              driving each step by hand. It runs the process and hands you the result to approve.
            </p>
            <p className="mt-6 max-w-2xl font-body text-body-md leading-relaxed text-black/40">
              If you have never opened any of it, put it even simpler. It is an extra pair of
              hands for everything that happens on a computer. You talk to it the way you talk
              to a person. You approve the parts that matter, what gets sent and what gets spent.
              It does the typing, the remembering, and the following up.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FOUR JOBS */}
      <section id="what-it-does" className="bg-[#FAFAFA]">
        <div className="container-wide py-20 md:py-28">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">What it handles</p>
            <h2 className="max-w-3xl font-display text-display-lg text-black">
              Four jobs. One hire.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              A painting business runs on more than paint. Every one of these is a job you are
              doing yourself right now, usually at night. The employee takes them over.
            </p>
          </AnimatedSection>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {jobs.map((j, i) => (
              <AnimatedSection key={j.title} delay={i * 0.08}>
                <div className="glass-card h-full p-8">
                  <j.icon size={24} className="text-red" strokeWidth={1.75} />
                  <h3 className="mt-5 font-display text-display-sm text-black">{j.title}</h3>
                  <p className="mt-3 font-body text-body-md leading-relaxed text-black/50">{j.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* NOT ANOTHER SCREEN */}
      <section className="bg-white">
        <div className="container-narrow py-20 md:py-28">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">Not another screen to drive</p>
            <h2 className="max-w-3xl font-display text-display-lg text-black">
              Most software asks you to do more typing.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              Estimating apps and customer-list tools are things you fill in yourself. They hand
              you a screen and the work is still yours. AMTECH works the other way around: you
              describe what you want, and it does the steps. You watch the result, you approve
              it, and it moves on to the next thing.
            </p>
          </AnimatedSection>
          <div className="mt-12 space-y-8">
            {notAnotherScreen.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.08}>
                <div className="flex gap-5">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-subtle">
                    <span className="font-mono text-sm font-semibold text-red">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-display-sm text-black">{p.title}</h3>
                    <p className="mt-2 max-w-xl font-body text-body-md leading-relaxed text-black/50">{p.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ONE LINE INSTEAD OF FOUR */}
      <section className="bg-[#FAFAFA]">
        <div className="container-narrow py-20 md:py-28">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">One line instead of four</p>
            <h2 className="max-w-3xl font-display text-display-lg text-black">
              You are already paying for this. Just spread across four bills.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              A painter pays an SEO company for one thing, a customer-list tool for another, an
              estimating app for a third, and does the rest himself at night because he cannot
              afford to hire for it. Every one of those is a bill and every one still needs a
              person to run it.
            </p>
            <p className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              AMTECH replaces all of it with one employee and one bill, from $1,500 a month. The
              same money, one place, and the work actually gets done instead of getting added to
              your pile.
            </p>
            <div className="mt-10">
              <Link to="/pricing" className="btn-secondary">
                See what $1,500 a month replaces
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PROOF */}
      <section className="bg-white">
        <div className="container-narrow py-20 md:py-28">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">Proof, not pitch</p>
            <h2 className="max-w-3xl font-display text-display-lg text-black">
              We run our own business on the exact thing we are selling you.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              AMTECH runs its own company on an AI employee, and has since August 2026. We write
              our own estimates, answer our own email, and keep our own records with the same
              setup we would build for you. We are not asking you to try something we do not use
              every day ourselves.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <div className="rounded-3xl bg-black p-10 md:p-16">
              <p className="mono-label mb-5 text-red-bright">Bring a real job</p>
              <h2 className="max-w-3xl font-display text-display-xl text-white">
                Watch it become an estimate.
              </h2>
              <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-white/60">
                Book a call and bring a painting job you need priced. Watch it become a full
                estimate &mdash; your rates, your scope, your format &mdash; in about two minutes.
                If you like what you see, we talk about the rest of the office. If you do not,
                you keep the estimate and go paint.
              </p>
              <div className="mt-10">
                <Link to="/schedule-demo" className="btn-primary">
                  Book a demo
                  <ArrowRight size={16} />
                </Link>
              </div>
              <p className="mt-6 font-mono text-xs text-white/30">
                AI employees are early access for a small number of businesses.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}