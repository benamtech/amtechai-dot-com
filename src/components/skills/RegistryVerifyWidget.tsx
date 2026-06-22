import { useState } from 'react';
import { recomputeVerdict, recomputeAuthorityLog, type ReplayResult, type ReplayStep } from '../../lib/skills/verification/recomputeWeb';
import { skillDefinitions } from '../../lib/skills/registry';

/**
 * The /registry "verify anything, live" widget. Pick a certified skill (recompute its full verdict — Ed25519
 * certificate, sourcePackage, manifest SRI, catalog root, authority record, AND the RFC-6962 transparency-log
 * root + head inclusion) or the whole authority log (recompute the Merkle root + verify the signed tree head).
 * Every check runs in the browser with WebCrypto + fetch (recomputeWeb.ts) — a downstream copy of this page
 * cannot fake it. Shows where the verified subject connects: the catalog root and the Merkle tree root.
 */
const STATUS_MARK: Record<ReplayStep['status'], string> = { pass: '✓', fail: '✗', skipped: '–', unsupported: '?' };
const STATUS_CLASS: Record<ReplayStep['status'], string> = {
  pass: 'text-green-400',
  fail: 'text-red',
  skipped: 'text-white/40',
  unsupported: 'text-white/40',
};
const LOG_TARGET = '__authority_log__';

export default function RegistryVerifyWidget() {
  const [target, setTarget] = useState<string>(skillDefinitions[0]?.slug ?? LOG_TARGET);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<ReplayStep[]>([]);
  const [verdict, setVerdict] = useState<ReplayResult['verdict'] | null>(null);
  const [connection, setConnection] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setSteps([]);
    setVerdict(null);
    setConnection(null);
    setError(null);
    try {
      if (target === LOG_TARGET) {
        const log = await recomputeAuthorityLog();
        setSteps([
          { label: `Recompute the RFC-6962 Merkle root over ${log.treeSize} record(s)`, status: log.root && log.root === log.sthRoot ? 'pass' : 'fail', detail: `${log.root.slice(0, 24)}…` },
          { label: 'Signed tree head matches the recomputed root', status: log.root === log.sthRoot ? 'pass' : 'fail' },
          { label: 'Signed tree head Ed25519 signature verifies', status: log.signatureOk ? 'pass' : 'fail' },
        ]);
        setVerdict(log.ok ? 'verified' : log.detail ? 'unverifiable' : 'invalid');
        if (log.ok) setConnection([`Tree root ${log.root.slice(0, 24)}… over ${log.treeSize} signed records`, `Every leaf = SHA-256(0x00 ‖ canonicalJson(record))`]);
        if (log.detail) setError(log.detail);
      } else {
        const result = await recomputeVerdict(target, (_i, step) => setSteps((prev) => [...prev, step]));
        setSteps(result.steps);
        setVerdict(result.verdict);
        if (result.verdict === 'verified') {
          setConnection([
            `In the catalog root over all ${skillDefinitions.length} skills' certificate digests`,
            `Bound by the head authority record, included in the RFC-6962 transparency-log tree`,
          ]);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Choose what to verify"
          className="min-w-[12rem] flex-1 border border-white/25 bg-black px-3 py-2 font-mono text-xs text-white"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          disabled={running}
        >
          {skillDefinitions.map((s) => (
            <option key={s.slug} value={s.slug}>
              skill · {s.slug}
            </option>
          ))}
          <option value={LOG_TARGET}>authority transparency log (whole tree)</option>
        </select>
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="border border-white bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-black hover:bg-transparent hover:text-white disabled:opacity-50"
        >
          {running ? 'Recomputing…' : 'Verify'}
        </button>
      </div>

      {(steps.length > 0 || verdict) && (
        <ol className="mt-4 space-y-1.5 font-mono text-xs">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className={STATUS_CLASS[s.status]}>{STATUS_MARK[s.status]}</span>
              <span className="text-white/80">
                {s.label}
                {s.detail ? <span className="text-white/40"> — {s.detail}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      )}

      {verdict && (
        <p className="mt-4 font-mono text-sm">
          <span className="text-white/60">verdict: </span>
          <span className={verdict === 'verified' ? 'font-bold text-green-400' : verdict === 'invalid' ? 'font-bold text-red' : 'text-white/50'}>{verdict}</span>
        </p>
      )}

      {connection && (
        <div className="mt-3 border-l-2 border-green-400 pl-3">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-white/50">Connects to</p>
          <ul className="mt-1 space-y-0.5 text-xs text-white/75">
            {connection.map((c, i) => (
              <li key={i}>↳ {c}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-3 font-mono text-xs text-red">error: {error}</p>}
    </div>
  );
}
