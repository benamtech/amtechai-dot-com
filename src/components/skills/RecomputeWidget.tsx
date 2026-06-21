import { useState } from 'react';
import { recomputeVerdict, type ReplayResult, type ReplayStep } from '../../lib/skills/verification/recomputeWeb';

/**
 * "Verify this yourself" — the live, in-browser twin of the build-time badge (docs/skills/standard/09).
 * On click it RECOMPUTES the verdict from the published surfaces with WebCrypto + fetch (see recomputeWeb.ts),
 * streaming each step pass/fail. The point is that a downstream re-renderer can copy the static badge but
 * cannot fake this — it has to run the recompute. Client-only; SkillDetail portals it into the mount that
 * renderSkillContent emits in the "Source & verification" section.
 */

const STATUS_MARK: Record<ReplayStep['status'], string> = {
  pass: '✓',
  fail: '✗',
  skipped: '–',
  unsupported: '?',
};
const STATUS_CLASS: Record<ReplayStep['status'], string> = {
  pass: 'text-green-700',
  fail: 'text-red',
  skipped: 'text-black/40',
  unsupported: 'text-black/40',
};
const VERDICT_CLASS: Record<ReplayResult['verdict'], string> = {
  verified: 'text-green-700',
  invalid: 'text-red',
  unverifiable: 'text-black/50',
};

export default function RecomputeWidget({ slug }: { slug: string }) {
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<ReplayStep[]>([]);
  const [verdict, setVerdict] = useState<ReplayResult['verdict'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setSteps([]);
    setVerdict(null);
    setError(null);
    try {
      const result = await recomputeVerdict(slug, (_i, step) => setSteps((prev) => [...prev, step]));
      setSteps(result.steps);
      setVerdict(result.verdict);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="border border-black/15 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-black/70">
          Don&rsquo;t trust the badge — <span className="font-semibold text-black">recompute it</span>. This
          re-derives the verdict in your browser from the published files (Ed25519 + SHA-256 over the
          certificate, source package, manifest SRI, catalog root, and authority record).
        </p>
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="shrink-0 border border-black bg-black px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-red hover:border-red disabled:opacity-50"
        >
          {running ? 'Recomputing…' : 'Verify this yourself ↻'}
        </button>
      </div>

      {steps.length > 0 && (
        <ol className="mt-4 space-y-1.5 border-t border-black/10 pt-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-2 font-mono text-xs leading-5">
              <span className={`shrink-0 font-bold ${STATUS_CLASS[step.status]}`}>{STATUS_MARK[step.status]}</span>
              <span className="text-black/75">
                {step.label}
                {step.detail ? <span className="text-black/45"> — {step.detail}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      )}

      {verdict && (
        <p className="mt-3 border-t border-black/10 pt-3 font-mono text-xs">
          <span className="text-black/55">recomputed verdict: </span>
          <span className={`font-bold uppercase tracking-[0.12em] ${VERDICT_CLASS[verdict]}`}>{verdict}</span>
        </p>
      )}

      {error && <p className="mt-3 font-mono text-xs text-red">recompute error: {error}</p>}
    </div>
  );
}
