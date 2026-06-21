import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Phone, Quote } from 'lucide-react';
import { getNodesByIds } from '../lib/articleKnowledgeGraph';

const learningLinks = [
  {
    title: 'AMTECH vs ChatGPT and Claude',
    description: 'Know when a prompt is enough and when the business needs a working employee.',
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

type HomepageNarrativeSection = {
  title: string;
  image: string;
  alt: string;
  body: string[];
  related?: { label: string; to: string };
  stats?: string[];
};

const homepageNarrativeSections: HomepageNarrativeSection[] = [
  {
    title: 'The problem is not effort. It is where the effort is going.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    alt: 'Contractor reviewing plans in a workshop.',
    body: [
      'A serious owner can work hard all day and still lose the night to estimates, replies, records, invoices, job notes, vendor questions, and follow-up.',
      'That work matters. It protects revenue and reputation. But it should not all require the owner to sit at a screen and push every task across the line.',
      'The first win is not a dramatic reinvention. It is moving repeat computer work to a worker that can remember the business, follow the rule, prepare the artifact, and report back.',
    ],
    related: { label: 'Compare AI tools with working employees', to: '/articles/amtech-vs-chatgpt-claude' },
  },
  {
    title: 'Give the business a worker it can actually use.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    alt: 'Organized tools and work documentation on a bench.',
    body: [
      'An AMTECH AI Employee is set up around your services, pricing, customers, documents, tools, tone, and operating rules. You reach it by text. It has its own number. It knows who it reports to.',
      'You can ask for the estimate draft, the invoice note, the customer reply, the material check, the lead follow-up, the job summary, or the list of exceptions that need your attention.',
      'The owner still owns the judgment. The employee handles the preparation, the repeat steps, and the clean handoff back to the person in charge.',
    ],
    related: { label: 'Build a business brain first', to: '/articles/business-brain-free' },
  },
  {
    title: 'The business starts to see itself clearly.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern team workspace with planning materials and laptops.',
    body: [
      'A worker with memory changes the owner’s day. Open estimates, unpaid invoices, customer promises, missing details, margin concerns, and follow-up opportunities stop hiding across texts, inboxes, photos, and spreadsheets.',
      'Morning check-ins can surface what happened, what is waiting, and what needs a decision. The owner reviews exceptions instead of reconstructing the entire operation from scattered fragments.',
      'This is the practical mental shift: from carrying the business in your head to managing a business that can show you what needs to be done.',
    ],
    related: { label: 'Plan from real business memory', to: '/articles/business-brain-free' },
  },
  {
    title: 'The right promise is smaller, stronger, and easier to trust.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    alt: 'Clean dashboard and operating data on a monitor.',
    body: [
      'Do not start by trusting AI with the whole company. Start by giving it real work with clear boundaries: draft this, summarize that, compare these, prepare the reply, find the missing detail, make the report.',
      'AMTECH builds the first version around the work that already repeats. The employee learns the business context, uses approved procedures, and pauses where a human decision belongs.',
      'A good first claim is simple: this should take less owner time tomorrow than it took yesterday.',
    ],
  },
  {
    title: 'Capacity changes the way an owner thinks.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Professional job site with organized construction activity.',
    body: [
      'When the routine work has somewhere to go, the owner gets room back: room to price better, train better, hire better, follow up faster, protect margins, and choose the jobs worth becoming known for.',
      'This is not about making the business less human. It is about giving the human operator a cleaner instrument panel and a worker that can carry the administrative weight.',
      'Hard work still matters. The difference is whether every small task keeps collecting interest from the owner’s attention.',
    ],
    related: { label: 'Create an estimate with ChatGPT', to: '/articles/create-estimate-with-chatgpt' },
  },
  {
    title: 'Claim the employee. Teach it the business. Put it to work.',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80',
    alt: 'Hands working with paperwork and professional tools.',
    body: [
      'The claim form asks for the plain facts: what the business does, who is on the team, what work wastes time, what tools you use, what a normal job looks like, and which customers you want more or less of.',
      'That becomes the first business brain. The provisioner creates an isolated employee profile, gives it a phone number, schedules check-ins, and sets it up to report to you.',
      'The offer is direct because the work is direct. Claim the AI Employee, then start handing it the tasks that should not keep living on your desk.',
    ],
  },
];


const additionalArticles = getNodesByIds(['E1', 'E4', 'E5', 'E3']).map((node) => ({
  title: node.title,
  description: node.description,
  to: node.href,
}));

export default function Home() {
  const navigate = useNavigate();
  const [claimPhone, setClaimPhone] = useState('');

  function submitPhoneClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = claimPhone.trim();
    navigate(trimmed ? `/claim?phone=${encodeURIComponent(trimmed)}` : '/claim');
  }

  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-wide">
          <div className="max-w-6xl">
            <h1 className="max-w-6xl text-[clamp(3.2rem,8.5vw,8.8rem)] font-black leading-[0.86] tracking-[-0.085em]">
              Your next employee is an AI agent<span className="text-red">.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/70 md:text-xl">
              AMTECH sets up a textable AI Employee for serious local businesses. It learns your pricing, services, documents, customers, tools, and operating rules, then helps get estimates, invoices, follow-up, job notes, reports, and other office work done without making you learn another AI tool.
            </p>
            <Link
              to="/claim"
              className="mt-10 inline-flex min-h-12 items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-black text-white transition hover:bg-red-bright"
            >
              Claim my AI Employee
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="agent-entry" className="border-b border-black/15 bg-white py-3">
        <div className="container-wide flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-xs text-black/45">This site is agent-readable.</span>
          <a href="/skills" className="text-xs text-black/55 underline underline-offset-2 hover:text-black">Skills</a>
          <a href="/okf/index.md" className="text-xs text-black/55 underline underline-offset-2 hover:text-black">Knowledge graph</a>
          <a href="/llms.txt" className="text-xs text-black/55 underline underline-offset-2 hover:text-black">llms.txt</a>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black py-12 text-white md:py-16">
        <div className="container-wide">
          <Link
            to="/articles/amtech-vs-chatgpt-claude"
            className="group grid gap-6 border border-white/16 bg-white/[0.03] p-6 transition hover:border-red/70 md:grid-cols-[1fr_auto] md:items-center md:p-8"
          >
            <div>
              <h2 className="max-w-4xl text-[clamp(1.8rem,4vw,3.8rem)] font-black leading-[0.96] tracking-[-0.055em]">
                Know the difference between using ChatGPT and managing an AI Employee.
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-black text-white">
              Read the comparison
              <ArrowRight className="transition group-hover:translate-x-1" size={16} />
            </span>
          </Link>
        </div>
      </section>

      <section className="bg-[#f4f4f4]">
        {homepageNarrativeSections.map((section, index) => (
          <article key={section.title} className={`border-b-4 border-black ${index % 2 === 1 ? 'bg-black text-white' : 'bg-[#f4f4f4] text-black'}`}>
            <div className={`container-wide grid lg:grid-cols-2 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative aspect-[4/5] min-h-[500px] overflow-hidden border-x-4 border-black lg:aspect-auto lg:min-h-[650px]">
                <img src={section.image} alt={section.alt} className="h-full w-full object-cover grayscale" loading="lazy" />
                <div className={`absolute inset-0 ${index % 2 === 1 ? 'bg-black/25' : 'bg-red/10 mix-blend-multiply'}`} />
              </div>
              <div className="flex min-h-[560px] flex-col justify-center py-14 lg:px-14 lg:py-20">
                <div className="p-1 md:p-4">
                  <h3 className="text-[clamp(2.05rem,4.8vw,5rem)] font-black leading-[0.91] tracking-[-0.065em]">{section.title}</h3>
                  {'stats' in section && section.stats ? (
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {section.stats.map((stat) => (
                        <div key={stat} className="border border-current px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-red">
                          {stat}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-8 space-y-5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className={`text-base leading-8 md:text-lg ${index % 2 === 1 ? 'text-white/72' : 'text-black/66'}`}>{paragraph}</p>
                    ))}
                  </div>
                  {section.related ? (
                    <Link to={section.related.to} className={`mt-8 inline-flex items-center gap-2 text-sm font-black ${index % 2 === 1 ? 'text-white' : 'text-black'}`}>
                      {section.related.label}
                      <ArrowRight size={15} />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
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
            {additionalArticles.slice(0, 2).map((article) => (
              <Link key={article.to} to={article.to} className="group border-2 border-black bg-white p-6 transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]">
                <h3 className="text-2xl font-black leading-tight tracking-[-0.04em]">{article.title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/62">{article.description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-black">Read article <ArrowRight className="transition group-hover:translate-x-1" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#f4f4f4] py-16 md:py-20">
        <div className="container-wide">
          <div className="grid gap-8 border-2 border-black bg-white p-7 md:p-10 lg:grid-cols-[120px_1fr] lg:items-start">
            <Quote className="h-12 w-12 text-red" aria-hidden="true" />
            <div>
              <p className="max-w-5xl text-[clamp(1.6rem,3.4vw,3.2rem)] font-black leading-[1.02] tracking-[-0.05em]">
                A landscaper sent photos, a voice note, and a rough price range. The AI Employee organized the scope, drafted the estimate, wrote the customer follow-up, and returned the approval points before the owner got back to the office.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/58">
                The hard work was still human judgment. The drag was gathering, formatting, and remembering. That is the part the employee handled.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <h2 className="text-[clamp(2.35rem,5.8vw,5.8rem)] font-black leading-[0.9] tracking-[-0.07em]">Put your number in. Claim your AI Employee.</h2>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/66">The claim page will ask seven business questions, verify the phone, capture consent, and start the setup path for a textable worker built around your business.</p>
          </div>
          <form onSubmit={submitPhoneClaim} className="border border-red bg-red/10 p-7 md:p-9">
            <label className="block">
              <span className="mb-3 block text-sm font-black text-white/70">Mobile phone</span>
              <input
                value={claimPhone}
                onChange={(event) => setClaimPhone(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+18055550142"
                className="h-14 w-full border-2 border-white bg-white px-4 text-base font-semibold text-black outline-none transition focus:border-red"
              />
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-red px-7 py-4 text-sm font-black text-white transition hover:bg-red-bright"
            >
              Claim my AI Employee
              <Phone size={16} />
            </button>
            <p className="mt-4 text-xs leading-5 text-white/45">
              You will verify this number on the claim page before anything is provisioned.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
