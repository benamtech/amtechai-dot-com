// The site's checks, run after every build (`npm run build`) and on Netlify before a deploy: what a person, a search
// engine and an AI reader get from site/public/ is complete and true to itself. Exits 1 and names each failure.
//   node site/tools/check.mjs
import fs from 'node:fs';
import path from 'node:path';

const PUB = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public');
const ORIGIN = 'https://amtechai.com';
const fail = [];
const bad = (where, what) => fail.push(`${where}: ${what}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(PUB).map((f) => '/' + path.relative(PUB, f));
const fileSet = new Set(files);
const pageOf = (f) => (f === '/index.html' ? '/' : f.replace(/\/index\.html$/, ''));
const pages = files.filter((f) => f.endsWith('/index.html')).map((f) => ({ file: f, route: pageOf(f), html: fs.readFileSync(PUB + f, 'utf8') }));

// Redirects: what each source sends where, so a link to a redirected URL counts as live.
const redirects = fs.readFileSync(path.join(PUB, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'))
  .map((l) => l.trim().split(/\s+/)).map(([from, to, code]) => ({ from, to, code }));
const redirected = (p) => redirects.some(({ from }) => (from.endsWith('/*') ? p === from.slice(0, -2) || p.startsWith(from.slice(0, -1)) : p === from));
const served = (p) => {
  const clean = decodeURI(p.split('#')[0].split('?')[0]).replace(/\/$/, '') || '/';
  return clean === '/' || fileSet.has(clean) || fileSet.has(clean + '/index.html') || redirected(clean);
};

// 1. Every page: one title, a description, one canonical that is its own URL, one h1, structured data that parses.
for (const p of pages) {
  const head = p.html.split('</head>')[0];
  const titles = head.match(/<title>[^<]+<\/title>/g) || [];
  if (titles.length !== 1) bad(p.route, `${titles.length} <title> tags`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(head)) bad(p.route, 'no meta description');
  const canon = [...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (canon.length !== 1 || canon[0] !== ORIGIN + (p.route === '/' ? '' : p.route) && canon[0] !== ORIGIN + p.route) bad(p.route, `canonical ${JSON.stringify(canon)}`);
  const h1 = (p.html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) bad(p.route, `${h1} <h1> elements`);
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { bad(p.route, `structured data does not parse: ${e.message}`); }
  }
  // 2. Every link and asset inside the site resolves to a file or a redirect.
  for (const m of p.html.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) if (!served(m[1])) bad(p.route, `links to ${m[1]}, which the site does not serve`);
  for (const m of p.html.matchAll(/(?:href|src)="https:\/\/amtechai\.com(\/[^"]*)"/g)) if (!served(m[1])) bad(p.route, `links to ${ORIGIN}${m[1]}, which the site does not serve`);
}
if (!fileSet.has('/404.html')) bad('/404.html', 'missing: an unknown URL would get Netlify\'s own page');

// 3. The sitemap lists every page and nothing else.
const sitemap = fs.readFileSync(path.join(PUB, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, '') || '/');
for (const l of locs) if (!pages.some((p) => p.route === l)) bad('sitemap.xml', `lists ${l}, which is not a page`);
for (const p of pages) if (!locs.includes(p.route)) bad('sitemap.xml', `misses ${p.route}`);

// 4. Every article has its Markdown twin and its knowledge-bundle entry, and llms.txt and the bundle index name it.
const llms = fs.readFileSync(path.join(PUB, 'llms.txt'), 'utf8');
const okfIndex = fs.readFileSync(path.join(PUB, 'okf/index.md'), 'utf8');
for (const p of pages.filter((p) => /^\/articles\/[^/]+$/.test(p.route))) {
  const slug = p.route.split('/')[2];
  if (!fileSet.has(`/articles/${slug}.md`)) bad(p.route, 'no Markdown twin');
  if (!fileSet.has(`/okf/articles/${slug}.md`)) bad(p.route, 'no knowledge-bundle entry');
  if (!llms.includes(`${ORIGIN}${p.route})`)) bad('llms.txt', `does not list ${p.route}`);
  if (!okfIndex.includes(`(/articles/${slug}.md)`)) bad('okf/index.md', `does not list ${slug}`);
  if (!p.html.includes(`href="${ORIGIN}/articles/${slug}.md"`)) bad(p.route, 'its head does not name its Markdown twin');
}

// 5. Links inside the bundle (relative to /okf/) and in llms.txt resolve.
for (const f of files.filter((f) => f.startsWith('/okf/') && f.endsWith('.md'))) {
  for (const m of fs.readFileSync(PUB + f, 'utf8').matchAll(/\]\((\/[^)]+\.md)\)/g)) if (!fileSet.has('/okf' + m[1])) bad(f, `links to /okf${m[1]}, which is not in the bundle`);
}
for (const m of llms.matchAll(/https:\/\/amtechai\.com(\/[^)\s]*)/g)) if (!served(m[1])) bad('llms.txt', `links to ${m[1]}, which the site does not serve`);

// 6. Every redirect lands somewhere the site serves, and no live page is shadowed by a forced redirect.
for (const { from, to } of redirects) {
  if (to.startsWith('/') && !to.startsWith('/.netlify/') && !served(to)) bad('_redirects', `${from} -> ${to}, which the site does not serve`);
  if (!from.includes('*') && (fileSet.has(from) || fileSet.has(from + '/index.html'))) bad('_redirects', `${from} is a live page and also redirected`);
}

if (fail.length) { console.error(`check: ${fail.length} problem(s)\n  ` + fail.join('\n  ')); process.exit(1); }
console.log(`check: ${pages.length} pages, ${locs.length} sitemap URLs, ${redirects.length} redirects, ${files.filter((f) => f.endsWith('.md')).length} Markdown files: all good`);
