import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ClipboardList, Loader2, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CONSENT_VERSION = '1.1.0';
const CONSENT_TEXT =
  'I agree to receive ongoing texts from AMTECH so my AI Employee can work with me. I understand it may connect to tools or accounts I approve, that I am responsible for how I use it, and that message and data rates may apply. Reply STOP to cancel or HELP for help.';

const QUESTIONS = [
  {
    id: 'q1_business',
    prompt: 'What is the business? Name it, say what you sell or build, and say how long it has been running.',
  },
  {
    id: 'q2_team',
    prompt: 'Who is on the team? Give the headcount and the jobs people handle.',
  },
  {
    id: 'q3_office_work',
    prompt: 'What repeat computer work wastes the most time right now?',
  },
  {
    id: 'q4_tools',
    prompt: 'What tools do you use for email, spreadsheets, estimates, invoices, scheduling, or customer notes?',
  },
  {
    id: 'q5_money',
    prompt: 'What does the business roughly bring in, and what does a normal customer or job look like?',
  },
  {
    id: 'q6_ideal_customer',
    prompt: 'What customer or job do you want more of?',
  },
  {
    id: 'q7_friction_customer',
    prompt: 'What customer, job, or request creates too much friction?',
  },
] as const;

const CLAIM_STEPS = [
  {
    icon: Phone,
    title: 'Verify your number.',
    body: 'This is how the AI Employee knows who it reports to.',
  },
  {
    icon: ClipboardList,
    title: 'Tell us about the business.',
    body: 'Pricing, services, customers, tools, bottlenecks, and the way work actually gets done.',
  },
  {
    icon: MessageSquare,
    title: 'Text it work.',
    body: 'You, a manager, or the person at the desk can send work to the same number.',
  },
];

const BUILD_ITEMS = [
  'Understands your business',
  'Works through text',
  'Helps with admin and growth work',
  'Useful for owners or office staff',
];

const TIMEZONES = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
];

type QuestionId = (typeof QUESTIONS)[number]['id'];
type Answers = Record<QuestionId, string>;

const blankAnswers = QUESTIONS.reduce((acc, question) => {
  acc[question.id] = '';
  return acc;
}, {} as Answers);

export default function AIEmployeeClaim() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [agentName, setAgentName] = useState('Operator');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [ownsBusiness, setOwnsBusiness] = useState(true);
  const [answers, setAnswers] = useState<Answers>(blankAnswers);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState<'send' | 'verify' | 'claim' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claimToken, setClaimToken] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Claim your AI Employee | AMTECH';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Claim an AMTECH AI Employee with one verified onboarding form and phone consent.'
      );
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('t')) return;
    const prefilledPhone = params.get('phone');
    if (prefilledPhone) setPhone(prefilledPhone);
  }, []);

  // Door 2: arrived from a text-in link. Validate it server-side, then prefill and
  // lock the phone so the form can skip the verification code entirely.
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('t');
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await postJson('/claim/start-from-sms', { token });
        if (!active) return;
        if (res.ok && res.phone) {
          setPhone(res.phone);
          setClaimToken(token);
          setSuccess('Your phone is already verified. Finish the form to claim it.');
        } else {
          setError(res.error || 'That text link expired. Enter your phone and use a code instead.');
        }
      } catch {
        if (active) setError('That text link expired. Enter your phone and use a code instead.');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    const filled = QUESTIONS.filter((question) => answers[question.id].trim().length > 0).length;
    return Math.round((filled / QUESTIONS.length) * 100);
  }, [answers]);
  const phoneVerified = Boolean(claimToken);

  async function sendCode() {
    setError('');
    setSuccess('');
    setBusy('send');
    try {
      const res = await postJson('/claim/send-code', { phone });
      if (!res.ok) throw new Error(res.error || 'Could not send the code.');
      setCodeSent(true);
      setSuccess('Code sent. Enter it below when it arrives.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code.');
    } finally {
      setBusy(null);
    }
  }

  async function verifyCode() {
    setError('');
    setSuccess('');
    if (!phone.trim()) {
      setError('Enter a phone number.');
      return;
    }
    if (!codeSent) {
      setError('Send the code first.');
      return;
    }
    if (!code.trim()) {
      setError('Enter the code.');
      return;
    }

    setBusy('verify');
    try {
      const res = await postJson('/claim/verify-code', { phone, code });
      if (!res.ok || !res.claim_token) throw new Error(res.error || 'Could not verify the code.');
      setPhone(res.phone || phone);
      setClaimToken(res.claim_token);
      setSuccess('Phone verified. Finish the form to claim it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify the code.');
    } finally {
      setBusy(null);
    }
  }

  async function submitClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setBusy('claim');
    try {
      const shared = {
        owns_business: ownsBusiness,
        supervisor_name: supervisorName,
        agent_name: agentName,
        timezone,
        answers,
        consent_accepted: consentAccepted,
        consent_text_version: CONSENT_VERSION,
      };
      const res = await postJson(
        '/claim/verify-and-claim',
        { claim_token: claimToken, ...shared }
      );
      if (!res.ok) throw new Error(res.error || 'Could not verify and claim.');
      setSuccess(res.message || 'Claim received. AMTECH is building your AI Employee now.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify and claim.');
    } finally {
      setBusy(null);
    }
  }

  function validate() {
    if (!ownsBusiness) return 'This version is for business owners and operators. Book a call if you need a custom path.';
    if (!supervisorName.trim()) return 'Enter your name.';
    if (!agentName.trim()) return 'Name your AI employee.';
    if (!phoneVerified) {
      if (!phone.trim()) return 'Enter a phone number.';
      if (!codeSent) return 'Send the code first.';
      return 'Verify your phone before telling us about the business.';
    }
    const missing = QUESTIONS.find((question) => !answers[question.id].trim());
    if (missing) return 'Answer all seven business questions.';
    if (!consentAccepted) return 'Check the text consent box before claiming.';
    return '';
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black">
      <Navbar />
      <main>
        <section className="border-b-4 border-black bg-white pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
              <div>
                <h1 className="max-w-6xl text-[clamp(3rem,8vw,8rem)] font-black leading-[0.86] tracking-[-0.08em]">
                  Text your AI Employee. The work gets done<span className="text-red">.</span>
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-black/68 md:text-xl">
                  It is set up to understand your business, pricing, brand, documents, and the way you work. You text it what you need, and it helps turn hours of office and growth work into minutes without making you learn AI tools.
                </p>
              </div>

              <div className="border-2 border-black bg-[#f4f4f4] p-6">
                <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">What you get.</h2>
                <div className="mt-7 grid gap-3">
                  {BUILD_ITEMS.map((item) => (
                    <div key={item} className="flex items-center gap-3 border border-black/15 bg-white px-4 py-3">
                      <Check className="h-4 w-4 shrink-0 text-red" aria-hidden="true" />
                      <span className="text-sm font-black leading-5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-4 border-black bg-[#f4f4f4] py-10 md:py-14">
          <div className="container-wide grid gap-4 md:grid-cols-3">
            {CLAIM_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="border-2 border-black bg-white p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-red" aria-hidden="true" />
                    <span className="font-mono text-sm font-black text-black/35">
                      {index + 1}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black leading-none tracking-[-0.04em]">{step.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-black/62">{step.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container-wide grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
            <aside className="border-2 border-black bg-black p-6 text-white lg:sticky lg:top-24">
              <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
                Built for the owner and the office.
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/62">
                Use it yourself, or let the person who runs the desk use it. The point is simple: more business work gets done without adding more back-office weight.
              </p>
              <div className="mt-8 grid gap-3 border-t border-white/12 pt-6">
                <StatusRow label="Questions" value="7" dark />
                <StatusRow
                  label="Phone"
                  value={phoneVerified ? 'Verified' : codeSent ? 'Code sent' : 'Needed'}
                  dark
                />
                <StatusRow label="Answers done" value={`${completion}%`} dark />
                <StatusRow label="Setup" value="Ready after claim" dark />
              </div>
            </aside>

            <form onSubmit={submitClaim} className="space-y-6">
              <section className="border-2 border-black bg-[#f4f4f4] p-5 md:p-7">
                <div className="mb-6 flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-6 w-6 text-red" aria-hidden="true" />
                  <div>
                    <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">Who should it work with?</h2>
                    <p className="mt-3 text-sm leading-6 text-black/62">
                      This is the main person who can text the AI Employee and get work back.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Your name" value={supervisorName} onChange={setSupervisorName} autoComplete="name" />
                  <TextField label="What should we call it?" value={agentName} onChange={setAgentName} />
                  <TextField
                    label={phoneVerified ? 'Phone verified' : 'Mobile phone'}
                    value={phone}
                    onChange={setPhone}
                    autoComplete="tel"
                    placeholder="+18055550142"
                    readOnly={phoneVerified}
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-black/65">Timezone</span>
                    <select
                      value={timezone}
                      onChange={(event) => setTimezone(event.target.value)}
                      className="h-12 w-full border-2 border-black bg-white px-3 text-sm font-semibold outline-none transition focus:border-red"
                    >
                      {TIMEZONES.map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <label className="inline-flex min-h-11 items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm font-black">
                    <input
                      type="checkbox"
                      checked={ownsBusiness}
                      onChange={(event) => setOwnsBusiness(event.target.checked)}
                      className="h-4 w-4 accent-red"
                    />
                    I own or operate this business
                  </label>
                  {phoneVerified ? (
                    <span className="inline-flex min-h-11 items-center gap-2 border-2 border-[#126b2f] bg-[#f2fbf3] px-4 py-2 text-sm font-black text-[#126b2f]">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Phone verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendCode}
                      disabled={busy !== null || !phone.trim()}
                      className="inline-flex min-h-11 items-center gap-2 bg-black px-4 py-2 text-sm font-black text-white transition hover:bg-red disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy === 'send' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      Send code
                    </button>
                  )}
                </div>
              </section>

              <section className="border-2 border-black bg-white p-5 md:p-7">
                <div className="mb-6 flex items-start gap-3">
                  <Phone className="mt-1 h-6 w-6 text-red" aria-hidden="true" />
                  <div>
                    <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">Verify your phone.</h2>
                    <p className="mt-3 text-sm leading-6 text-black/62">
                      Enter the code here. After this, the last step is just consent and claim.
                    </p>
                  </div>
                </div>

                {phoneVerified ? (
                  <div className="flex min-h-12 items-center gap-2 border-2 border-[#126b2f] bg-[#f2fbf3] px-4 py-3 text-sm font-black text-[#126b2f]">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Phone verified
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-[220px_auto] md:items-end">
                    <TextField label="Code" value={code} onChange={setCode} inputMode="numeric" />
                    <button
                      type="button"
                      onClick={verifyCode}
                      disabled={busy !== null || !codeSent || !code.trim()}
                      className="inline-flex min-h-12 items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-red disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy === 'verify' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      Verify phone
                    </button>
                  </div>
                )}
              </section>

              <section className="border-2 border-black bg-white p-5 md:p-7">
                <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">Tell us about your business.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-black/62">
                  Give us the basics: what you sell, how you price, who you serve, what slows you down, and what kind of work you want handled faster.
                </p>
                <div className="mt-7 grid gap-4">
                  {QUESTIONS.map((question, index) => (
                    <label key={question.id} className="block border-2 border-black bg-[#f4f4f4] p-4">
                      <span className="mb-3 flex items-start gap-3 text-sm font-black leading-6">
                        <span className="font-mono text-red">{String(index + 1).padStart(2, '0')}</span>
                        <span>{question.prompt}</span>
                      </span>
                      <textarea
                        value={answers[question.id]}
                        onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                        className="min-h-28 w-full resize-y border-2 border-black bg-white px-3 py-3 text-sm font-medium leading-6 outline-none transition focus:border-red"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="border-2 border-black bg-[#f4f4f4] p-5 md:p-7">
                <h2 className="text-3xl font-black leading-none tracking-[-0.05em]">Claim it.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-black/62">
                  Once claimed, AMTECH sets up the first version so it can help with work like estimates, invoices, email drafts, follow-up, material checks, and customer details.
                </p>
                <div className="mt-6 grid gap-4">
                  <label className="flex items-start gap-3 border-2 border-black bg-white p-4 text-sm font-semibold leading-6 text-black/70">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(event) => setConsentAccepted(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-red"
                    />
                    <span>{CONSENT_TEXT}</span>
                  </label>
                </div>

                {error && <p className="mt-4 border-2 border-red bg-red/5 px-4 py-3 text-sm font-black text-red">{error}</p>}
                {success && (
                  <p className="mt-4 flex items-start gap-2 border-2 border-[#126b2f] bg-[#f2fbf3] px-4 py-3 text-sm font-black text-[#126b2f]">
                    <Check className="mt-0.5 h-4 w-4" aria-hidden="true" />
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy !== null}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-red px-6 py-3 text-sm font-black text-white transition hover:bg-red-bright disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                >
                  {busy === 'claim' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Claim my AI Employee
                </button>
              </section>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StatusRow({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className={dark ? 'text-white/45' : 'text-black/55'}>{label}</span>
      <span className={`font-mono font-black ${dark ? 'text-white' : 'text-black'}`}>{value}</span>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  inputMode,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: 'numeric';
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-black/65">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={readOnly}
        className={`h-12 w-full border-2 border-black px-3 text-sm font-semibold outline-none transition focus:border-red ${
          readOnly ? 'cursor-not-allowed bg-[#f2fbf3] text-black/70' : 'bg-white'
        }`}
      />
    </label>
  );
}

async function postJson(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { ...body, ok: res.ok && body.ok !== false };
}
