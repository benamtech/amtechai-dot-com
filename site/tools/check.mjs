// The site's checks, run after every build (`npm run build`) and on Vercel before a deploy: what a person, a search
// engine and an AI reader get from site/public/ is complete and true to itself. Exits 1 and names each failure.
//   node site/tools/check.mjs
import fs from 'node:fs';
import path from 'node:path';

const PUB = process.env.CHECK_PUBLIC || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public');
const ORIGIN = 'https://amtechai.com';
const fail = [];
const bad = (where, what) => fail.push(`${where}: ${what}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(PUB).map((f) => '/' + path.relative(PUB, f));
const fileSet = new Set(files);
const pageOf = (f) => (f === '/index.html' ? '/' : f.replace(/\/index\.html$/, ''));
const pages = files.filter((f) => f.endsWith('/index.html')).map((f) => ({ file: f, route: pageOf(f), html: fs.readFileSync(PUB + f, 'utf8') }));

// Redirects (vercel.json, the one place they are written): what each source sends where, so a link to a redirected
// URL counts as live. A splat source, `/old(/.*)?` (/old, /old/ and everything under it), is read as `/old/*`.
const redirects = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'vercel.json'), 'utf8')).redirects
  .map(({ source, destination, statusCode }) => ({ from: source.replace(/\(\/\.\*\)\?$/, '/*'), to: destination, code: statusCode }));
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
if (!fileSet.has('/404.html')) bad('/404.html', 'missing: an unknown URL would get the host\'s own page');

// 3. The sitemap lists every page search engines may index, and nothing else.
const sitemap = fs.readFileSync(path.join(PUB, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, '') || '/');
for (const l of locs) if (!pages.some((p) => p.route === l)) bad('sitemap.xml', `lists ${l}, which is not a page`);
for (const p of pages) {
  const noindex = /<meta name="robots" content="noindex/.test(p.html);
  if (noindex && locs.includes(p.route)) bad('sitemap.xml', `lists ${p.route}, which asks search engines not to index it`);
  if (!noindex && !locs.includes(p.route)) bad('sitemap.xml', `misses ${p.route}`);
}

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
for (const { from, to, code } of redirects) {
  if (code !== 301) bad('vercel.json', `${from} redirects with ${code}; every redirect here is a 301 (Vercel's \`permanent\` is a 308)`);
  if (to.startsWith('/') && !served(to)) bad('vercel.json', `${from} -> ${to}, which the site does not serve`);
  if (!from.includes('*') && (fileSet.has(from) || fileSet.has(from + '/index.html'))) bad('vercel.json', `${from} is a live page and also redirected`);
}

// 7. The new pages (C on white, <body class="w">) and the search layer (lane SEARCH, 2026-10-27; AISEO page-spec 2.1-2.5):
// each indexable one has its Markdown twin named in its head, its OKF v0.2 concept listed in the bundle's index, its
// llms.txt line, its sitemap row with a lastmod, a PNG favicon, and structured data with a WebPage (or CollectionPage).
const sitemapRows = Object.fromEntries([...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map((m) => [m[1].replace(ORIGIN, '') || '/', m[2]]));
const ldOf = (p) => [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => { try { const j = JSON.parse(m[1]); return j['@graph'] || [j]; } catch { return []; } });
const typesOf = (nodes) => nodes.flatMap((n) => [].concat(n['@type'] || []));
let orgNodes = 0;
for (const p of pages) {
  const types = typesOf(ldOf(p));
  orgNodes += types.filter((t) => t === 'Organization' || t === 'OnlineBusiness').length;
  for (const t of ['Review', 'AggregateRating', 'HowTo', 'LocalBusiness']) if (types.includes(t)) bad(p.route, `structured data carries ${t}, which this site never marks up`);
  if (!/<body class="w"/.test(p.html) || /<meta name="robots" content="noindex/.test(p.html)) continue;
  const twin = p.route === '/' ? '/index.md' : `${p.route}.md`;
  const concept = p.route === '/' ? '/home.md' : `${p.route}.md`;
  const url = ORIGIN + (p.route === '/' ? '/' : p.route);
  if (!fileSet.has(twin)) bad(p.route, `no Markdown twin at ${twin}`);
  if (!p.html.includes(`<link rel="alternate" type="text/markdown" href="${ORIGIN}${twin}"`)) bad(p.route, 'its head does not name its Markdown twin');
  if (!fileSet.has('/okf' + concept)) bad(p.route, `no knowledge-bundle concept at /okf${concept}`);
  if (!okfIndex.includes(`](${concept})`)) bad('okf/index.md', `does not list ${concept}`);
  if (!llms.includes(`](${url})`)) bad('llms.txt', `does not list ${url}`);
  if (!(p.route in sitemapRows)) bad('sitemap.xml', `misses ${p.route}`); else if (!sitemapRows[p.route]) bad('sitemap.xml', `${p.route} has no lastmod`);
  if (!/<link rel="icon" type="image\/png"[^>]*href="\/favicon-48\.png"/.test(p.html)) bad(p.route, 'no 48px PNG favicon in its head');
  if (!types.some((t) => t === 'WebPage' || t === 'CollectionPage')) bad(p.route, 'its structured data has no WebPage or CollectionPage');
  if (p.route !== '/' && !types.includes('BreadcrumbList')) bad(p.route, 'its structured data has no BreadcrumbList');
  const desc = (p.html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (desc.length < 70 || desc.length > 160) bad(p.route, `meta description is ${desc.length} characters; 70-160`);
  // FAQPage only for questions the page shows.
  const text = p.html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#39;|&rsquo;/g, "'").replace(/&amp;/g, '&');
  for (const n of ldOf(p).filter((n) => n['@type'] === 'FAQPage')) for (const q of n.mainEntity || []) if (!text.includes(q.name)) bad(p.route, `FAQPage question not visible: ${q.name}`);
}
if (orgNodes !== 1) bad('structured data', `${orgNodes} Organization nodes across the site; exactly one (home), the rest reference #organization`);
for (const f of ['/favicon-48.png', '/favicon-192.png', '/apple-touch-icon.png', '/favicon.ico', '/logo.png', '/content-hashes.json']) if (!fileSet.has(f)) bad(f, 'missing');

if (fileSet.has('/content-hashes.json')) {
  const hashes = JSON.parse(fs.readFileSync(PUB + '/content-hashes.json', 'utf8'));
  for (const l of locs) if (!hashes[ORIGIN + (l === '/' ? '/' : l)]) bad('content-hashes.json', `misses ${l}, so IndexNow would never hear it changed`);
}

// 8. Titles and descriptions are unique across the site (Google: "Create unique descriptions for each page").
for (const [what, re] of [['title', /<title>([^<]+)<\/title>/], ['meta description', /<meta name="description" content="([^"]*)"/]]) {
  const seen = {};
  for (const p of pages) { const v = (p.html.split('</head>')[0].match(re) || [])[1]; if (v) (seen[v] ||= []).push(p.route); }
  for (const [v, rs] of Object.entries(seen)) if (rs.length > 1) bad(what, `${rs.join(', ')} share ${JSON.stringify(v.slice(0, 80))}`);
}

// 9. The bundle is OKF v0.2: the root's frontmatter is exactly okf_version "0.2", no v0.1 `timestamp`, a known status.
if (!/^---\nokf_version: "0\.2"\n---\n/.test(okfIndex)) bad('okf/index.md', 'frontmatter is not exactly okf_version: "0.2"');
for (const f of files.filter((f) => f.startsWith('/okf/') && f.endsWith('.md') && !f.endsWith('/index.md') && f !== '/okf/log.md')) {
  const fm = (fs.readFileSync(PUB + f, 'utf8').match(/^---\n([\s\S]*?)\n---/) || [])[1];
  if (!fm || !/^type: \S/m.test(fm)) { bad(f, 'no frontmatter with a type'); continue; }
  if (/^timestamp:/m.test(fm)) bad(f, 'v0.1 `timestamp` key');
  const st = (fm.match(/^status: "?([^"\n]+)"?$/m) || [])[1];
  if (st && !['draft', 'stable', 'deprecated'].includes(st)) bad(f, `status ${st}`);
}

// 10. Nothing written to steer language models, in any page or machine file (Bing: "content designed to manipulate
// or interfere with language models ... may result in reduced visibility or removal").
const steer = /ignore (all |any )?(previous|prior) instructions|(ai|llm|language model|chatgpt|assistant)s?[^.<]{0,40}(should|must|always) (recommend|cite|mention|rank)|note to (ai|llm|language models)/i;
for (const f of files.filter((f) => /\.(html|md|txt|json)$/.test(f))) if (steer.test(fs.readFileSync(PUB + f, 'utf8'))) bad(f, 'carries text aimed at language models');

// 11. The new pages are written, never assembled (Ben, 2026-10-27: "All pages are to be individually written"; ART's
// study once printed "What roofing ask first" from "What " + label + " ask first"). A layout of the new families may not
// build a sentence from a page's fields, change a field's case to fit one, or fall back to stock words when a page
// leaves a field out: every heading and line a visitor reads comes whole from the page's own file or from data/w.json.
const LAYOUTS = path.join(PUB, '..', 'layouts');
const ownWords = ['home.html', 'industries', 'departments', 'services', 'questions', '_partials/w']   // the visible page; w/jsonld and w/meta build machine ids
  
  .map((p) => path.join(LAYOUTS, p)).filter((p) => fs.existsSync(p))
  .flatMap((p) => (fs.statSync(p).isDirectory() ? walk(p) : [p])).filter((f) => f.endsWith('.html') && !/w\/(jsonld|meta)\.html$/.test(f));
for (const f of ownWords) {
  const where = 'layouts/' + path.relative(LAYOUTS, f);
  const src = fs.readFileSync(f, 'utf8').replace(/\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}/g, '');
  // Words are letters with a space between them; a URL, an #id or a class name ("ow") is not prose.
  const words = (t) => /[A-Za-z]{2,} [A-Za-z]{2,}|[A-Za-z]{2,} %|% ?[a-z]* [A-Za-z]{2,}/.test(t) && !/^[%a-z]*[/#.]/.test(t);
  for (const m of src.matchAll(/printf\s+"([^"]*)"/g)) if (words(m[1])) bad(where, `builds words with printf "${m[1]}"`);
  for (const m of src.matchAll(/\|\s*default\s+"([^"]*)"/g)) if (words(m[1]) && m[1] !== 'AMTECH AI') bad(where, `falls back to stock words "${m[1].slice(0, 50)}"`);
  for (const m of src.matchAll(/\b(lower|upper|title|humanize|strings\.FirstUpper)\s+(\$?\.Params|\.)/g)) bad(where, `changes a field's case to fit it into a sentence (${m[0]})`);
}

if (fail.length) { console.error(`check: ${fail.length} problem(s)\n  ` + fail.join('\n  ')); process.exit(1); }
console.log(`check: ${pages.length} pages, ${locs.length} sitemap URLs, ${redirects.length} redirects, ${files.filter((f) => f.endsWith('.md')).length} Markdown files: all good`);
