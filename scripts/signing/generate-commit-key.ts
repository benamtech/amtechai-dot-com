/**
 * Generate the dedicated Ed25519 SSH commit-signing key for AMTECH skill publishing (docs/skills/standard/03).
 * Private half: .amtech/commit-signing-key (git-ignored, mode 600). Public half + allowed_signers: committed
 * under signing/ so anyone can verify the publishing-commit signatures. Configures local git to SSH-sign.
 * Separate from the artifact Ed25519 signing key (key separation by purpose). Idempotent.
 */
import { execFileSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const priv = resolve('.amtech/commit-signing-key');
const pub = resolve('signing/commit-signing-key.pub');
const allowed = resolve('signing/allowed_signers');
mkdirSync(resolve('.amtech'), { recursive: true });
mkdirSync(resolve('signing'), { recursive: true });

if (existsSync(priv)) {
  console.log('commit-signing key already present at .amtech/commit-signing-key; nothing to do.');
  process.exit(0);
}
execFileSync('ssh-keygen', ['-t', 'ed25519', '-f', priv, '-N', '', '-C', 'amtech-skill-publishing'], { stdio: 'inherit' });
chmodSync(priv, 0o600);
copyFileSync(`${priv}.pub`, pub);
rmSync(`${priv}.pub`, { force: true });
writeFileSync(allowed, `amtech-skill-publishing ${readFileSync(pub, 'utf8').trim()}\n`, 'utf8');
for (const [k, v] of [['gpg.format', 'ssh'], ['user.signingkey', priv], ['gpg.ssh.allowedSignersFile', allowed], ['commit.gpgsign', 'true']] as const) {
  execFileSync('git', ['config', k, v]);
}
const fp = execFileSync('ssh-keygen', ['-lf', pub], { encoding: 'utf8' }).split(' ')[1];
console.log(`Generated commit-signing key ${fp}. Private: .amtech/commit-signing-key (git-ignored); public + allowed_signers under signing/. git is configured to SSH-sign.`);
