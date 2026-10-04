import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const steps = [
  {
    n: '01',
    title: 'Start one of two ways',
    body: 'Contractors can give the working agent a real job on amtechai.com/contractors and watch it draft the estimate. Or start a short chat at app.amtechai.com: a few questions about your business, in your own words.',
  },
  {
    n: '02',
    title: 'Keep it with your email or phone',
    body: 'Sign in with a code sent to you. Whatever you made in the first conversation comes with you: the work, the files and what it learned about your business.',
  },
  {
    n: '03',
    title: 'Your employee, at its own address',
    body: 'It lives at your-business.amtechai.com. Open it and talk to it like a person. It keeps your work in order and shows you what it is doing and what needs you.',
  },
  {
    n: '04',
    title: 'It drafts. You send.',
    body: 'Nothing goes to a customer without your yes. It never asks for a password or a card number in the chat; anything like that goes through its own secure form.',
  },
];

export default function HowItWorks() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">How it works</p>
            <h1 className="max-w-4xl font-display text-display-xl text-black">
              An AI employee that knows your business, set up in a conversation.
            </h1>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/60">
              You tell it about your business the way you would tell a new hire. It does the office work, and you
              approve what goes out.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((s, i) => (
              <AnimatedSection key={s.n} delay={i * 0.06}>
                <div className="glass-card h-full p-8">
                  <p className="mono-label text-red">{s.n}</p>
                  <h2 className="mt-4 font-display text-display-sm text-black">{s.title}</h2>
                  <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{s.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-narrow pt-16 text-center">
          <AnimatedSection>
            <h2 className="font-display text-display-lg text-black">Bring a real job.</h2>
            <p className="mx-auto mt-6 max-w-xl font-body text-body-lg leading-relaxed text-black/60">
              AMTECH runs its own business on an AI employee, and has since August 2026. Try the same thing on yours.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contractors" className="btn-primary">
                Try it on a job
                <ArrowRight size={16} />
              </Link>
              <a href="https://app.amtechai.com/" className="btn-secondary">Create your employee</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
