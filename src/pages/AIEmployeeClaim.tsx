import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react';

const CONSENT_VERSION = '1.0.0';
const CONSENT_TEXT =
  'By claiming an AI Employee you consent to ongoing texts from AMTECH for the purpose of operating an AI agent on your behalf, which may connect to accounts or systems you explicitly authorize. You agree to use it lawfully and to take responsibility for what you ask it to do. Msg & data rates may apply. Reply STOP to cancel, HELP for help.';

const QUESTIONS = [
  {
    id: 'q1_business',
    prompt: "What's the business and what does it do? Name, what you sell or build, and how long you've been at it.",
  },
  {
    id: 'q2_team',
    prompt: "Who's on the team and how is it set up? Headcount, and who does what.",
  },
  {
    id: 'q3_office_work',
    prompt: "What office or computer work eats the most of your time?",
  },
  {
    id: 'q4_tools',
    prompt: 'What do you use for email, spreadsheets, estimates, and invoices?',
  },
  {
    id: 'q5_money',
    prompt: 'Roughly what does the business bring in, and what does a typical customer and job look like?',
  },
  {
    id: 'q6_ideal_customer',
    prompt: 'Describe your ideal customer. The kind of work and client you want more of.',
  },
  {
    id: 'q7_friction_customer',
    prompt: 'What kind of customer or request do you deal with too often and wish you had less friction with?',
  },
] as const;

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
  const [busy, setBusy] = useState<'send' | 'claim' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [smsVerified, setSmsVerified] = useState(false);
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
          setSmsVerified(true);
          setSuccess('Phone verified by text. No code needed — just finish the form.');
        } else {
          setError(res.error || 'That text link is no longer valid. Enter your phone to verify by code.');
        }
      } catch {
        if (active) setError('That text link is no longer valid. Enter your phone to verify by code.');
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

  async function sendCode() {
    setError('');
    setSuccess('');
    setBusy('send');
    try {
      const res = await postJson('/claim/send-code', { phone });
      if (!res.ok) throw new Error(res.error || 'Could not send verification code.');
      setCodeSent(true);
      setSuccess('Verification code sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send verification code.');
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
        smsVerified ? { claim_token: claimToken, ...shared } : { phone, code, ...shared }
      );
      if (!res.ok) throw new Error(res.error || 'Could not verify and claim.');
      setSuccess(res.message || "Verified. Your AI employee is being built now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify and claim.');
    } finally {
      setBusy(null);
    }
  }

  function validate() {
    if (!ownsBusiness) return 'This MVP is currently for business owners. AMTECH can still talk through a custom path on a sales call.';
    if (!supervisorName.trim()) return 'Enter your name.';
    if (!agentName.trim()) return 'Name your AI employee.';
    if (!smsVerified) {
      if (!phone.trim()) return 'Enter a phone number.';
      if (!codeSent) return 'Send a verification code first.';
      if (!code.trim()) return 'Enter the verification code.';
    }
    const missing = QUESTIONS.find((question) => !answers[question.id].trim());
    if (missing) return 'Answer every business question before claiming.';
    if (!consentAccepted) return 'Consent is required before AMTECH can text you from the AI employee.';
    return '';
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-black-rich">
      <header className="border-b border-black/10 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="font-display text-sm font-extrabold tracking-[0.06em]">
            AMTECH<span className="text-red">.</span>
          </Link>
          <Link to="/schedule-call" className="text-xs font-semibold text-black/60 transition hover:text-red">
            Talk to AMTECH
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-12">
        <aside className="md:sticky md:top-8 md:self-start">
          <div className="mb-8">
            <p className="mono-label mb-4 text-red">AI Employee Claim</p>
            <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black leading-none">
              Your next employee gets a number.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-black/65">
              AMTECH verifies your phone, records consent, and builds one isolated Hermes AI employee
              with its own Twilio SMS number and client workspace.
            </p>
          </div>

          <div className="grid gap-3 border-y border-black/10 py-5">
            <StatusRow label="Form contract" value="7 answers" />
            <StatusRow
              label="Phone verification"
              value={smsVerified ? 'Verified by text' : codeSent ? 'Code sent' : 'Required'}
            />
            <StatusRow label="Business detail" value={`${completion}%`} />
            <StatusRow label="Provisioning" value="Hermes hook" />
          </div>
        </aside>

        <form onSubmit={submitClaim} className="space-y-5">
          <section className="border border-black/10 bg-white p-5 shadow-card md:p-7">
            <div className="mb-5 flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-red" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-extrabold">Owner and employee</h2>
                <p className="mt-1 text-sm leading-6 text-black/55">
                  This phone becomes the verified supervisor for the provisioned AI employee.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Your name" value={supervisorName} onChange={setSupervisorName} autoComplete="name" />
              <TextField label="AI employee name" value={agentName} onChange={setAgentName} />
              <TextField
                label={smsVerified ? 'Mobile phone (verified by text)' : 'Mobile phone'}
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
                placeholder="+18055550142"
                readOnly={smsVerified}
              />
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-black/55">Timezone</span>
                <select
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                  className="h-12 w-full border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-red"
                >
                  {TIMEZONES.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={ownsBusiness}
                  onChange={(event) => setOwnsBusiness(event.target.checked)}
                  className="h-4 w-4 accent-red"
                />
                I own or operate this business
              </label>
              {smsVerified ? (
                <span className="inline-flex min-h-11 items-center gap-2 border border-[#126b2f]/30 bg-[#f2fbf3] px-4 py-2 text-sm font-bold text-[#126b2f]">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Phone verified by text
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={busy !== null || !phone.trim()}
                  className="inline-flex min-h-11 items-center gap-2 bg-black-rich px-4 py-2 text-sm font-bold text-white transition hover:bg-red disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy === 'send' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Send verification code
                </button>
              )}
            </div>
          </section>

          <section className="border border-black/10 bg-white p-5 shadow-card md:p-7">
            <h2 className="text-xl font-extrabold">Business brain seed</h2>
            <div className="mt-5 grid gap-4">
              {QUESTIONS.map((question, index) => (
                <label key={question.id} className="block">
                  <span className="mb-2 block text-sm font-bold">
                    <span className="mr-2 font-mono text-red">{String(index + 1).padStart(2, '0')}</span>
                    {question.prompt}
                  </span>
                  <textarea
                    value={answers[question.id]}
                    onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                    className="min-h-24 w-full resize-y border border-black/15 bg-[#fbfbf8] px-3 py-3 text-sm leading-6 outline-none transition focus:border-red"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="border border-black/10 bg-white p-5 shadow-card md:p-7">
            <h2 className="text-xl font-extrabold">Verify and claim</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-[220px_1fr]">
              {smsVerified ? (
                <div className="flex items-center gap-2 border border-[#126b2f]/30 bg-[#f2fbf3] px-3 text-sm font-semibold text-[#126b2f]">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Verified by text
                </div>
              ) : (
                <TextField label="Verification code" value={code} onChange={setCode} inputMode="numeric" />
              )}
              <label className="flex items-start gap-3 border border-black/15 bg-[#fbfbf8] p-4 text-sm leading-6 text-black/70">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(event) => setConsentAccepted(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-red"
                />
                <span>{CONSENT_TEXT}</span>
              </label>
            </div>

            {error && <p className="mt-4 border border-red/30 bg-red/5 px-4 py-3 text-sm font-semibold text-red">{error}</p>}
            {success && (
              <p className="mt-4 flex items-start gap-2 border border-black/10 bg-[#f2fbf3] px-4 py-3 text-sm font-semibold text-[#126b2f]">
                <Check className="mt-0.5 h-4 w-4" aria-hidden="true" />
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={busy !== null}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-red px-6 py-3 text-sm font-extrabold text-white transition hover:bg-red-bright disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {busy === 'claim' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Verify phone and claim AI Employee
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-black/55">{label}</span>
      <span className="font-mono font-bold text-black-rich">{value}</span>
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
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-black/55">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={readOnly}
        className={`h-12 w-full border border-black/15 px-3 text-sm outline-none transition focus:border-red ${
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
