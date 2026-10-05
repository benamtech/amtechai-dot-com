import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paperclip, ShieldCheck, Home as HomeIcon, Receipt, MessageSquare } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import catalogue from '../data/catalogue.json';
import realRun from '../data/real-run.json';

// The employee runs on the platform host. Nothing is requested from it until the visitor acts: a crawler or a
// reader who never types costs nothing and is handed nothing. The page's composer is plain HTML, so words typed
// before the script loads are handed over, never lost (the hydration trap, measured in X12).
const APP = 'https://app.amtechai.com';

type Family = (typeof catalogue)['families'][number];
const starters = catalogue.families.filter((f: Family) => f.starter);
const lead = starters.filter((f: Family) => f.lead);
const more = starters.filter((f: Family) => !f.lead);

type Workspace = HTMLElement & { starters: unknown[]; start: (text: string, files?: File[]) => void };

let loading: Promise<void> | null = null;
function loadWorkspace(): Promise<void> {
  loading ??= new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = `${APP}/w/workspace.js`;
    s.onload = () => ok();
    s.onerror = () => { loading = null; no(new Error('the employee did not load')); };
    document.head.appendChild(s);
  });
  return loading;
}

const owns = [
  {
    icon: HomeIcon,
    title: 'It is yours when you keep it',
    body: 'Give it your email and the code it sends. The same employee, with the same work and its history, opens at your own address on amtechai.com. Nothing is copied and nothing starts over.',
  },
  {
    icon: ShieldCheck,
    title: 'Its own sealed computer',
    body: 'Every visitor gets an employee of their own on its own isolated machine. No password or key lives inside it, so it cannot hand one out, and it cannot see anyone else’s work.',
  },
  {
    icon: Receipt,
    title: 'Invoice the work, stop chasing it',
    body: 'When you say so, it invoices your customer for work done or under way. They pay online by card, the money goes to your own Stripe account, and an unpaid invoice is sent again on its due date. Nothing goes to your customer until you tap Send.',
  },
  {
    icon: MessageSquare,
    title: 'It says it is AI',
    body: 'It is an AI employee and says so. It shows its work: where each number came from, what it assumed, and what it could not find.',
  },
];

const faqs = [
  {
    q: 'Is it free to try?',
    a: 'Yes. There is no card and no sign-up to start. You only give an email if you want to keep it.',
  },
  {
    q: 'What does it cost if I keep it?',
    a: 'There is no monthly fee. You pay for the work it does as it does it, and AMTECH takes 8% of payments your customers make through it. Stripe’s card fee comes out of your side, as it does on any Stripe account. It asks for a card when your use reaches $1.',
  },
  {
    q: 'What can I give it?',
    a: 'Anything your office handles: a job to price, plans, photos, a customer’s email, a rejected vendor file, a pay application, your website. The list above is where it is deepest, not where it stops.',
  },
  {
    q: 'Does it send anything to my customer on its own?',
    a: 'No. It drafts, and you send. Every page, message and payment request waits for your say-so.',
  },
  {
    q: 'Will it ask for my passwords or bank details?',
    a: 'No. It never asks for a password, a card number or a Social Security number in the chat. Stripe collects payout details on its own secure form.',
  },
  {
    q: 'Can I talk to a person?',
    a: 'Yes. AMTECH is Benjamin Palaskas, and you can book a call with him from this page.',
  },
];

export default function Contractors() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [started, setStarted] = useState(false);
  const [why, setWhy] = useState<string | null>(null);
  const holder = useRef<HTMLDivElement>(null);
  const el = useRef<Workspace | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => { el.current?.remove(); }, []);

  const start = async (said?: string) => {
    const words = (said ?? text).trim();
    if (!words && !files.length) { box.current?.focus(); return; }
    setWhy(null);
    try {
      await loadWorkspace();
    } catch (e) {
      setWhy(String((e as Error).message ?? e));
      return;
    }
    if (!el.current) {
      const w = document.createElement('amtech-workspace') as Workspace;
      w.setAttribute('app', APP);
      w.setAttribute('fonts', 'none');            // this page already loads Inter and IBM Plex Mono
      w.setAttribute('intent', 'contractors');
      w.starters = starters;
      holder.current?.appendChild(w);
      el.current = w;
    }
    el.current.start(words, files);
    setStarted(true);
    setText('');
    setFiles([]);
    requestAnimationFrame(() => holder.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const pick = (say: string) => {
    setText(say);
    requestAnimationFrame(() => { box.current?.focus(); box.current?.setSelectionRange(say.length, say.length); });
  };

  return (
    <>
      {/* HERO: the composer is the first act */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-12 md:pt-44 md:pb-16">
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse at center, rgba(228, 37, 28, 0.22) 0%, rgba(228, 37, 28, 0.06) 45%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h1 className="text-center font-display text-display-hero text-black">
                Give it the office work.
                <br />
                <span className="text-red">It does it in front of you.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-center font-body text-body-lg leading-relaxed text-black/60">
                A real AMTECH employee for your trade, working live on this page. Tell it the job in your own
                words, or drop in what you have. It does the first real piece now, you can keep talking to it while it works, and you keep it if it is useful.
              </p>
            </AnimatedSection>
            <form
              className="mt-9 border border-black/15 bg-white p-3"
              onSubmit={(e) => { e.preventDefault(); start(); }}
            >
              <label htmlFor="job" className="sr-only">The work</label>
              <textarea
                id="job"
                ref={box}
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) start(); }}
                placeholder="Price this job: replace 220 feet of 6-inch gutter in Scranton, PA. My rate is $14 a foot."
                className="w-full resize-y border-0 bg-transparent font-body text-body-md text-black outline-none placeholder:text-black/35"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 font-body text-sm text-black/55 hover:text-black">
                  <Paperclip size={16} />
                  {files.length ? `${files.length} file${files.length > 1 ? 's' : ''}: ${files.map((f) => f.name).join(', ')}` : 'Plans, photos, a PDF or an email'}
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) => setFiles([...(e.target.files ?? [])])}
                  />
                </label>
                <button type="submit" className="btn-primary">
                  Start
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
            {why && <p className="mt-3 font-body text-sm text-red">{why}</p>}
            <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Where to start">
              {lead.map((f: Family) => (
                <button
                  key={f.family}
                  type="button"
                  onClick={() => pick(f.say)}
                  className="border border-black/15 bg-white px-3 py-2 font-body text-sm text-black/70 hover:border-black/40 hover:text-black"
                >
                  {f.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => box.current?.focus()}
                className="px-3 py-2 font-body text-sm text-black/50 underline underline-offset-4 hover:text-black"
              >
                or anything else your office needs
              </button>
            </div>
            <p className="mt-4 text-center font-body text-sm leading-relaxed text-black/45">
              Free to try. No card and no sign-up to start.
            </p>
          </div>
        </div>
      </section>

      {/* THE EMPLOYEE: mounted on the first act, here */}
      <section className="bg-[#FAFAFA]" aria-label="The AMTECH employee, working">
        <div ref={holder} className="container-wide pb-16">
          {!started && (
            <div className="mx-auto max-w-5xl border border-dashed border-black/15 p-10 text-center">
              <p className="font-body text-body-md text-black/50">The employee opens here when you start.</p>
            </div>
          )}
        </div>
      </section>

      {/* WHAT IT DOES: generated from the skills it ships with */}
      <section id="what-it-does" className="bg-white">
        <div className="container-wide py-20 md:py-24">
          <AnimatedSection>
            <h2 className="font-display text-display-lg text-black">Office work with a customer, a deadline or a form attached.</h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {lead.map((f: Family, i: number) => (
              <AnimatedSection key={f.family} delay={i * 0.07}>
                <button type="button" onClick={() => pick(f.say)} className="glass-card h-full w-full p-8 text-left">
                  <h3 className="font-display text-display-sm text-black">{f.label}</h3>
                  <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{f.card}</p>
                </button>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <h3 className="mt-14 font-display text-display-sm text-black">More it can do</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {more.map((f: Family) => (
                <li key={f.family}>
                  <button type="button" onClick={() => pick(f.say)} className="text-left font-body text-body-md text-black/70 underline-offset-4 hover:text-black hover:underline">
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* A REAL RUN, INCLUDING WHAT IT COULD NOT DO */}
      <section className="bg-[#0a0a0a]">
        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-white">
                A real run on this page. <span className="text-red">Including what it could not do.</span>
              </h2>
              <p className="mt-6 font-body text-body-md leading-relaxed text-white/60">{realRun.note}</p>
            </AnimatedSection>
            <div className="mt-10 space-y-5">
              {realRun.turns.map((t: { who: string; text: string }, i: number) => (
                <AnimatedSection key={i} delay={i * 0.04}>
                  <div className={t.who === 'you' ? 'border-l-2 border-white/30 pl-5' : 'border-l-2 border-red pl-5'}>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/45">{t.who === 'you' ? 'You' : 'The employee'}</p>
                    <p className="mt-2 whitespace-pre-line font-body text-body-md leading-relaxed text-white/80">{t.text}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU OWN, AND WHAT IT WILL NEVER DO */}
      <section className="bg-[#f4f4f4]">
        <div className="container-wide py-16 md:py-24">
          <AnimatedSection>
            <h2 className="font-display text-display-md text-black">
              It drafts. <span style={{ color: '#2563EB' }}>You decide.</span>
            </h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {owns.map((d, i) => (
              <AnimatedSection key={d.title} delay={i * 0.07}>
                <div className="glass-card h-full p-8">
                  <d.icon size={24} className="text-red" strokeWidth={1.75} />
                  <h3 className="mt-5 font-display text-display-sm text-black">{d.title}</h3>
                  <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{d.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT COSTS */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">No monthly fee. No contract.</h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                You pay for the work it does as it does it, and AMTECH takes 8% of what your customers pay
                through it. It asks for a card when your use reaches $1. Nothing
                is charged to start, and there is nothing to cancel.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAIR QUESTIONS */}
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">Fair questions, straight answers.</h2>
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

      {/* CTA, and a person */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <div className="rounded-3xl bg-black p-10 md:p-16">
              <h2 className="max-w-3xl font-display text-display-xl text-white">Bring the work that is waiting.</h2>
              <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-white/70">
                AMTECH runs its own business on an AI employee, and has since August 2026. This is the same
                kind of employee, ready for yours.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); box.current?.focus(); }} className="btn-primary">
                  Start with the work
                  <ArrowRight size={16} />
                </button>
                <Link to="/schedule-demo" className="btn-secondary">
                  Talk to a person at AMTECH
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
