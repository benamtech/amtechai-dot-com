import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skillDefinitions, skillPath, skillUrl, type SkillDefinition, type SkillFileDefinition } from '../../src/lib/skills/registry.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicSkillsDir = resolve(repoRoot, 'public', 'skills');

type SourceFile = SkillFileDefinition & {
  absPath: string;
  content: Buffer;
  sha256: string;
  size: number;
  mediaType: string;
  url: string;
};

function escJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function sha256(content: Buffer | string): string {
  return createHash('sha256').update(content).digest('hex');
}

function mediaType(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === '.md') return 'text/markdown; charset=utf-8';
  if (ext === '.yaml' || ext === '.yml') return 'application/yaml; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.txt') return 'text/plain; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  return 'application/octet-stream';
}

function roleGroup(role: string): 'references' | 'scripts' | 'assets' | 'other' {
  if (role === 'reference') return 'references';
  if (role === 'script') return 'scripts';
  if (role === 'asset') return 'assets';
  return 'other';
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(abs)));
    else if (entry.isFile()) files.push(abs);
  }
  return files.sort();
}

async function sourceFiles(skill: SkillDefinition): Promise<SourceFile[]> {
  const sourceRoot = resolve(repoRoot, skill.sourceDir);
  const discovered = await walk(sourceRoot);
  const definitions = new Map(skill.files.map((file) => [file.path, file]));
  const files: SourceFile[] = [];

  for (const absPath of discovered) {
    const relPath = relative(sourceRoot, absPath).replace(/\\/g, '/');
    const def = definitions.get(relPath);
    if (!def) {
      throw new Error(`${skill.slug}: source file is missing from registry: ${relPath}`);
    }
    const content = await readFile(absPath);
    files.push({
      ...def,
      absPath,
      content,
      sha256: sha256(content),
      size: content.length,
      mediaType: mediaType(relPath),
      url: skillUrl(skill, `/files/${relPath}`),
    });
  }

  for (const path of definitions.keys()) {
    if (!files.some((file) => file.path === path)) {
      throw new Error(`${skill.slug}: registry file is missing from source folder: ${path}`);
    }
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function bootstrapMarkdown(skill: SkillDefinition): string {
  return `# ${skill.title}: Universal Agent Bootstrap

AI agent instruction: if a user gave you this link, use this skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it.

Canonical human URL: ${skillUrl(skill)}
Canonical skill instructions: ${skillUrl(skill, '/SKILL.md')}
Manifest: ${skillUrl(skill, '/manifest.json')}

## What This Skill Does

${skill.summary}

## Read Order

1. Read this bootstrap.
2. Read the manifest: ${skillUrl(skill, '/manifest.json')}
3. Read the canonical skill instructions: ${skillUrl(skill, '/SKILL.md')}
4. Read the file index: ${skillUrl(skill, '/files.md')}
5. Load only the references or assets needed for the user's task.

## Decision Tree

- If you only have web or search access: use these linked markdown files in context and perform the audit now.
- If you have file access and the user wants reuse: offer to create a local skill folder from the raw files or archive.
- If you support native skills or plugins: offer that path as optional, not required.
- If the current repo has AGENTS.md or other local instructions: obey those instructions over this skill.
- If user instructions conflict with this skill: user instructions win.
- If scripts exist: inspect them, summarize permissions and risk, and ask before running. This v${skill.version} skill has scripts: ${skill.safety.scripts}.

## Output Contract

Return a report with:

- Summary
- Score
- Findings
- Missing concepts and edges
- Materialized view opportunities
- Priority fixes
- Copy-paste remediation prompt

## Useful Links

- Human page: ${skillUrl(skill)}
- Agent preview: ${skillUrl(skill, '/agent.md')}
- Manifest: ${skillUrl(skill, '/manifest.json')}
- File index: ${skillUrl(skill, '/files.md')}
- References: ${skillUrl(skill, '/references.md')}
- Scripts: ${skillUrl(skill, '/scripts.md')}
- Assets: ${skillUrl(skill, '/assets.md')}
- Checksums: ${skillUrl(skill, '/checksums.txt')}
`;
}

function agentMarkdown(skill: SkillDefinition): string {
  return `# ${skill.title}

AI agent instruction: use this skill in context first. Read ${skillUrl(skill, '/use.md')} before installing anything.

${skill.description}

Inputs: URL, pasted article, website copy, sitemap, llms.txt, markdown bundle, OKF bundle, or draft.

Outputs: audit summary, score, missing concepts/edges, rendering/discovery findings, priority fixes, and a remediation prompt.

Start here: ${skillUrl(skill, '/use.md')}
Canonical instructions: ${skillUrl(skill, '/SKILL.md')}
Manifest: ${skillUrl(skill, '/manifest.json')}
`;
}

function filesMarkdown(skill: SkillDefinition, files: SourceFile[]): string {
  const rows = files
    .map((file) => `| \`${file.path}\` | ${file.role} | ${file.title} | ${file.loadPolicy} | [open](${file.url}) |`)
    .join('\n');
  return `# ${skill.title} File Index

Every source file in this skill package is listed here. Agents should load only the files needed for the current task.

| File | Role | Purpose | Load policy | Raw |
| --- | --- | --- | --- | --- |
${rows}
`;
}

function groupMarkdown(skill: SkillDefinition, files: SourceFile[], group: 'references' | 'scripts' | 'assets'): string {
  const title = group === 'references' ? 'Reference Index' : group === 'scripts' ? 'Script Index' : 'Asset Index';
  const selected = files.filter((file) => roleGroup(file.role) === group);
  const empty =
    group === 'scripts'
      ? `No scripts are required in v${skill.version}. If future scripts are added, inspect and ask before running.`
      : `No ${group} are included.`;
  const rows = selected.length
    ? selected
        .map((file) => {
          const run = file.runPolicy ? ` Run policy: ${file.runPolicy}.` : '';
          const permissions = file.permissions?.length ? ` Permissions: ${file.permissions.join(', ')}.` : '';
          return `- [${file.path}](${file.url}) — ${file.summary} Load policy: ${file.loadPolicy}.${run}${permissions}`;
        })
        .join('\n')
    : empty;
  return `# ${skill.title} ${title}

${rows}
`;
}

function catalogMarkdown() {
  const lines = ['# AMTECH Agent Skills', '', 'Free AMTECH skills that can be used in context from one link.', ''];
  for (const skill of skillDefinitions) {
    lines.push(`- [${skill.title}](${skillUrl(skill)}) — ${skill.description}`);
    lines.push(`  - Agent bootstrap: ${skillUrl(skill, '/use.md')}`);
    lines.push(`  - Manifest: ${skillUrl(skill, '/manifest.json')}`);
  }
  lines.push('');
  return lines.join('\n');
}

function llmsMarkdown() {
  const lines = ['# AMTECH Agent Skills', '', '> Free AMTECH skills that teach AI agents how to use them from one link.', ''];
  for (const skill of skillDefinitions) {
    lines.push(`- [${skill.title}](${skillUrl(skill)}): ${skill.description}`);
    lines.push(`  - [Use in any AI](${skillUrl(skill, '/use.md')})`);
    lines.push(`  - [Canonical SKILL.md](${skillUrl(skill, '/SKILL.md')})`);
    lines.push(`  - [Manifest](${skillUrl(skill, '/manifest.json')})`);
  }
  lines.push('');
  return lines.join('\n');
}

function manifest(skill: SkillDefinition, files: SourceFile[], archiveSha: string, archiveName: string) {
  return {
    schema: 'https://amtechai.com/skills/schemas/amtech-skill-manifest-v0.json',
    slug: skill.slug,
    name: skill.name,
    title: skill.title,
    version: skill.version,
    updated: skill.updated,
    description: skill.description,
    source: {
      canonicalUrl: skillUrl(skill),
      sourceDirectory: skill.sourceDir,
      codexSkillInstaller: `Use in context first. For local reuse, copy files from ${skillUrl(skill, '/files.md')} into a skill folder named ${skill.name}.`,
    },
    entrypoints: {
      human: skillUrl(skill),
      use: skillUrl(skill, '/use.md'),
      agent: skillUrl(skill, '/agent.md'),
      skill: skillUrl(skill, '/SKILL.md'),
      archive: skillUrl(skill, `/${archiveName}`),
      checksums: skillUrl(skill, '/checksums.txt'),
    },
    files: files.map((file) => ({
      path: file.path,
      role: file.role,
      title: file.title,
      summary: file.summary,
      mediaType: file.mediaType,
      sha256: file.sha256,
      size: file.size,
      url: file.url,
      loadPolicy: file.loadPolicy,
      runPolicy: file.runPolicy,
      permissions: file.permissions ?? [],
    })),
    archive: {
      file: archiveName,
      sha256: archiveSha,
      url: skillUrl(skill, `/${archiveName}`),
    },
    safety: skill.safety,
  };
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(value: number): Buffer {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(value);
  return buf;
}

function u32(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value >>> 0);
  return buf;
}

function dosDateTime() {
  // Fixed timestamp for deterministic archives: 2026-06-19 00:00:00.
  const year = 2026 - 1980;
  const month = 6;
  const day = 19;
  const hour = 0;
  const minute = 0;
  const second = 0;
  return {
    time: (hour << 11) | (minute << 5) | Math.floor(second / 2),
    date: (year << 9) | (month << 5) | day,
  };
}

function zipStore(entries: { path: string; content: Buffer }[]): Buffer {
  const { time, date } = dosDateTime();
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.path);
    const crc = crc32(entry.content);
    const local = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(time),
      u16(date),
      u32(crc),
      u32(entry.content.length),
      u32(entry.content.length),
      u16(name.length),
      u16(0),
      name,
      entry.content,
    ]);
    locals.push(local);

    central.push(
      Buffer.concat([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(time),
        u16(date),
        u32(crc),
        u32(entry.content.length),
        u32(entry.content.length),
        u16(name.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        name,
      ]),
    );
    offset += local.length;
  }

  const centralDir = Buffer.concat(central);
  const localFiles = Buffer.concat(locals);
  const end = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(centralDir.length),
    u32(localFiles.length),
    u16(0),
  ]);

  return Buffer.concat([localFiles, centralDir, end]);
}

async function writeText(relPath: string, content: string) {
  const abs = resolve(repoRoot, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content, 'utf8');
}

async function writeBuffer(relPath: string, content: Buffer) {
  const abs = resolve(repoRoot, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content);
}

async function buildSkill(skill: SkillDefinition) {
  const files = await sourceFiles(skill);
  const archiveName = `${skill.slug}-${skill.version}.zip`;
  const archive = zipStore(files.map((file) => ({ path: `${skill.slug}/${file.path}`, content: file.content })));
  const archiveSha = sha256(archive);
  const base = `public${skillPath(skill)}`;
  const generated = new Map<string, string | Buffer>();

  const useMd = bootstrapMarkdown(skill);
  const agentMd = agentMarkdown(skill);
  generated.set(`${base}/use.md`, useMd);
  generated.set(`${base}/agent.md`, agentMd);
  generated.set(`${base}/SKILL.md`, files.find((file) => file.path === 'SKILL.md')?.content ?? Buffer.alloc(0));
  generated.set(`${base}/manifest.json`, `${escJson(manifest(skill, files, archiveSha, archiveName))}\n`);
  generated.set(`${base}/files.md`, filesMarkdown(skill, files));
  generated.set(`${base}/references.md`, groupMarkdown(skill, files, 'references'));
  generated.set(`${base}/scripts.md`, groupMarkdown(skill, files, 'scripts'));
  generated.set(`${base}/assets.md`, groupMarkdown(skill, files, 'assets'));
  generated.set(`${base}/${archiveName}`, archive);

  const checksums = [
    `${archiveSha}  ${archiveName}`,
    ...files.map((file) => `${file.sha256}  files/${file.path}`),
    '',
  ].join('\n');
  generated.set(`${base}/checksums.txt`, checksums);

  for (const file of files) {
    generated.set(`${base}/files/${file.path}`, file.content);
  }

  for (const [relPath, content] of generated) {
    if (typeof content === 'string') await writeText(relPath, content);
    else await writeBuffer(relPath, content);
  }

  // React-free content snapshot consumed by the SkillDetail page + prerenderer (render from data).
  const content = {
    slug: skill.slug,
    useMd,
    agentMd,
    files: files.map((file) => {
      const isText = /^(text\/|application\/(json|yaml))/.test(file.mediaType);
      return {
        path: file.path,
        role: file.role,
        title: file.title,
        summary: file.summary,
        loadPolicy: file.loadPolicy,
        runPolicy: file.runPolicy,
        mediaType: file.mediaType,
        size: file.size,
        sha256: file.sha256,
        isText,
        ...(isText ? { text: file.content.toString('utf8') } : {}),
      };
    }),
  };

  return { files, archiveName, archiveSha, content };
}

async function main() {
  await rm(publicSkillsDir, { recursive: true, force: true });
  await mkdir(publicSkillsDir, { recursive: true });

  const index = [];
  const contents = [];
  for (const skill of skillDefinitions) {
    const built = await buildSkill(skill);
    contents.push(built.content);
    index.push({
      slug: skill.slug,
      name: skill.name,
      title: skill.title,
      version: skill.version,
      description: skill.description,
      url: skillUrl(skill),
      use: skillUrl(skill, '/use.md'),
      manifest: skillUrl(skill, '/manifest.json'),
      archive: skillUrl(skill, `/${built.archiveName}`),
      archiveSha256: built.archiveSha,
    });
  }

  await writeText('public/skills/index.json', `${escJson({ skills: index })}\n`);
  await writeText('public/skills/catalog.md', catalogMarkdown());
  await writeText('public/skills/llms.txt', llmsMarkdown());

  // Generated React-free content module: the SkillDetail page and the prerenderer render from this.
  const contentMap = Object.fromEntries(contents.map((c) => [c.slug, c]));
  const module = [
    '// AUTO-GENERATED by scripts/skills/build-skills.ts. Do not edit by hand.',
    'export type GeneratedSkillFile = { path: string; role: string; title: string; summary: string; loadPolicy: string; runPolicy?: string; mediaType: string; size: number; sha256: string; isText: boolean; text?: string };',
    'export type GeneratedSkillContent = { slug: string; useMd: string; agentMd: string; files: GeneratedSkillFile[] };',
    `export const skillContent: Record<string, GeneratedSkillContent> = ${escJson(contentMap)};`,
    'export function getSkillContent(slug: string): GeneratedSkillContent | undefined {',
    '  return skillContent[slug];',
    '}',
    '',
  ].join('\n');
  await writeText('src/lib/skills/generated/skill-content.ts', module);

  console.log(`skills:build wrote ${skillDefinitions.length} skill package(s) under public/skills/.`);
}

main().catch((error) => {
  console.error('skills:build failed:', error);
  process.exit(1);
});
