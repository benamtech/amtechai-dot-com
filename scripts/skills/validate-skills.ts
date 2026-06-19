import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skillDefinitions, skillPath, skillUrl } from '../../src/lib/skills/registry.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const errors: string[] = [];

type ManifestFile = {
  path: string;
  sha256: string;
};

type SkillManifest = {
  files?: ManifestFile[];
  archive?: {
    file?: string;
    sha256?: string;
  };
};

async function read(relPath: string, binary = false): Promise<Buffer | string | null> {
  try {
    const content = await readFile(resolve(repoRoot, relPath));
    return binary ? content : content.toString('utf8');
  } catch {
    return null;
  }
}

function sha256(content: Buffer | string): string {
  return createHash('sha256').update(content).digest('hex');
}

function fail(message: string) {
  errors.push(message);
}

function hasSkillFrontmatter(content: string): boolean {
  return /^---\n[\s\S]*?^name:\s*.+\n[\s\S]*?^description:\s*.+\n[\s\S]*?^---/m.test(content);
}

async function validateSkill(slug: string) {
  const skill = skillDefinitions.find((item) => item.slug === slug);
  if (!skill) return;
  const base = `public${skillPath(skill)}`;
  const required = ['use.md', 'agent.md', 'SKILL.md', 'manifest.json', 'files.md', 'references.md', 'scripts.md', 'assets.md', 'checksums.txt'];

  for (const file of required) {
    if (!(await read(`${base}/${file}`))) fail(`${skill.slug}: missing generated ${file}. Run npm run skills:build.`);
  }

  const skillMd = await read(`${base}/SKILL.md`);
  if (typeof skillMd !== 'string' || !hasSkillFrontmatter(skillMd)) fail(`${skill.slug}: generated SKILL.md has invalid frontmatter.`);

  const useMd = await read(`${base}/use.md`);
  if (typeof useMd === 'string') {
    for (const needle of ['AI agent instruction', 'use this skill in the current conversation first', 'manifest.json', 'SKILL.md']) {
      if (!useMd.includes(needle)) fail(`${skill.slug}: use.md missing bootstrap phrase: ${needle}`);
    }
  }

  const manifestRaw = await read(`${base}/manifest.json`);
  let manifest: SkillManifest | null = null;
  if (typeof manifestRaw === 'string') {
    try {
      manifest = JSON.parse(manifestRaw);
    } catch {
      fail(`${skill.slug}: manifest.json is not valid JSON.`);
    }
  }

  if (manifest) {
    for (const def of skill.files) {
      const entry = manifest.files?.find((file) => file.path === def.path);
      if (!entry) {
        fail(`${skill.slug}: manifest missing file ${def.path}.`);
        continue;
      }
      const raw = await read(`${base}/files/${def.path}`, true);
      if (!raw || !(raw instanceof Buffer)) {
        fail(`${skill.slug}: missing raw file ${def.path}.`);
        continue;
      }
      if (sha256(raw) !== entry.sha256) fail(`${skill.slug}: hash mismatch for ${def.path}.`);
    }

    const archivePath = manifest.archive?.file;
    if (!archivePath) fail(`${skill.slug}: manifest missing archive file.`);
    else {
      const archive = await read(`${base}/${archivePath}`, true);
      if (!archive || !(archive instanceof Buffer)) fail(`${skill.slug}: missing archive ${archivePath}.`);
      else if (sha256(archive) !== manifest.archive.sha256) fail(`${skill.slug}: archive hash mismatch.`);
    }
  }
}

async function main() {
  for (const skill of skillDefinitions) await validateSkill(skill.slug);

  const rootLlms = await read('public/llms.txt');
  const sitemap = await read('public/sitemap.xml');
  const skillsLlms = await read('public/skills/llms.txt');
  const catalog = await read('public/skills/catalog.md');

  for (const skill of skillDefinitions) {
    for (const [label, content] of [
      ['public/skills/llms.txt', skillsLlms],
      ['public/skills/catalog.md', catalog],
    ] as const) {
      if (typeof content !== 'string' || !content.includes(skillUrl(skill, '/use.md'))) fail(`${label} missing ${skill.slug} use.md URL.`);
    }
    if (typeof rootLlms !== 'string' || !rootLlms.includes(skillUrl(skill))) fail(`public/llms.txt missing ${skill.slug}. Run npm run okf:build after skills changes.`);
    if (typeof sitemap !== 'string' || !sitemap.includes(skillUrl(skill))) fail(`public/sitemap.xml missing ${skill.slug}. Run npm run okf:build after skills changes.`);
  }

  if (errors.length) {
    console.error(`skills:validate found ${errors.length} error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`skills:validate passed for ${skillDefinitions.length} skill package(s).`);
}

main().catch((error) => {
  console.error('skills:validate crashed:', error);
  process.exit(1);
});
