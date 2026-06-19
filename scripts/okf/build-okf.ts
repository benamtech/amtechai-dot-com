/**
 * Writes the OKF bundle + discovery files to disk. Run via `npm run okf:build`.
 * Output lives under public/ so it is committed to git (OKF's attribution/history
 * mechanism) and copied verbatim into dist/ by Vite at build time.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OKF_DIR, buildOkfFiles } from './emit.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

async function main() {
  const files = buildOkfFiles();

  // Clean the bundle dir so removed concepts do not leave orphan files behind.
  await rm(resolve(repoRoot, OKF_DIR), { recursive: true, force: true });

  for (const [relPath, content] of files) {
    const abs = resolve(repoRoot, relPath);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, content, 'utf8');
  }

  console.log(`okf:build wrote ${files.size} files (bundle under ${OKF_DIR}/ + sitemap.xml, robots.txt, llms.txt).`);
}

main().catch((error) => {
  console.error('okf:build failed:', error);
  process.exit(1);
});
