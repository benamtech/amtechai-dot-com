import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Receipt, Users, Search } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const PX = 'https://images.pexels.com/photos';

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

export default function Painters() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-20 md:pt-44 md:pb-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.05) 0%, transparent 70%)' }}
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
                AMTECH is an AI employee for your painting business. You say what needs doing, and
                it gets done: the estimate, the invoice, the follow-up, the marketing. You stay in
                charge.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/schedule-demo" className="btn-primary">
                  See it write an estimate
                  <ArrowRight size={16} />
                </Link>
                <a href="#what-it-does" className="btn-secondary">
                  What it handles
                </a>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="left" delay={0.1}>
              <img
                src={`${PX}/7218578/pexels-photo-7218578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                alt="A painter rolling white paint onto an interior wall"
                className="w-full rounded-3xl object-cover shadow-glass-lg"
                loading="eager"
              />
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

      {/* THE BRIDGE */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <img
                src={`${PX}/34046208/pexels-photo-34046208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                alt="A paint roller applying white paint to a wall"
                className="w-full rounded-3xl object-cover shadow-glass-lg"
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
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
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
            <AnimatedSection direction="left" delay={0.1}>
              <img
                src={`${PX}/5071177/pexels-photo-5071177.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                alt="A freshly painted house exterior"
                className="w-full rounded-3xl object-cover shadow-glass-lg"
                loading="lazy"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ONE LINE INSTEAD OF FOUR */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <img
                src={`${PX}/37556460/pexels-photo-37556460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                alt="A painter working on a construction site"
                className="w-full rounded-3xl object-cover shadow-glass-lg"
                loading="lazy"
              />
            </AnimatedSection>
            <AnimatedSection direction="left" delay={0.1}>
              <h2 className="font-display text-display-md text-black">
                You already pay for this. Just in four places.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                An SEO company. A customer list. An estimating app. Or you do all three yourself at
                night because you cannot afford to hire for it. AMTECH is one employee and one
                bill, from $1,500 a month.
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

      {/* PROOF */}
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
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
            <AnimatedSection direction="left" delay={0.1}>
              <img
                src={`${PX}/994164/pexels-photo-994164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                alt="A painter holding a roller while painting a wall"
                className="w-full rounded-3xl object-cover shadow-glass-lg"
                loading="lazy"
              />
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
                AI employees are early access for a small number of businesses.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}