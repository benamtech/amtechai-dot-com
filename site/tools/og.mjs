// The share images (og:image, twitter:image): one 1200x630 PNG per indexable page, drawn from the built page itself.
// The words are the page's own <h1> (its red payoff kept), the characters are the ones the page shows (from
// data/characters.json), the mark is AMTECH. on white. No generated pixels and no composed words.
//
//   npm run build (or site/tools/build.sh), then:  node site/tools/og.mjs [public-dir] [route-filter]
//
// Writes site/static/og/<key>.png (key: the route, slashes to dashes; "/" is "home") and site/static/og/manifest.json
// (each key's H1, so check.mjs can say when a page's H1 has changed since its image was drawn). Head tags pick
// /og/<key>.png when it exists, else the home image (w/top.html, head.html). Vercel does not run this: run it after
// changing an H1 and commit the PNGs. Needs Playwright (site/tools/node).
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const SITE = path.join(here, '..');
const PUB = path.resolve(process.argv[2] || path.join(SITE, 'public'));
const only = process.argv[3];
const OUT = path.join(SITE, 'static', 'og');
const { chromium } = await import(path.join(here, 'node', 'node_modules', 'playwright', 'index.mjs'));
const chars = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'characters.json'), 'utf8'));
const team = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'team.json'), 'utf8')).map((t) => t.id);
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(SITE, 'static', 'fonts', 'w', f)).toString('base64');

export const keyOf = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(PUB).filter((f) => f.endsWith('/index.html')).map((f) => {
  const route = '/' + path.relative(PUB, f).replace(/\/?index\.html$/, '');
  const html = fs.readFileSync(f, 'utf8');
  return { route, html };
}).filter((p) => !/<meta name="robots" content="noindex/.test(p.html) && (!only || p.route.includes(only)));

// The H1 as the page shows it: only its .red span kept as markup, every other tag dropped.
function h1Of(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!m) return null;
  return m[1].replace(/<span class="blue">([\s\S]*?)<\/span>/g, '\u0003$1\u0002').replace(/<span class="red">([\s\S]*?)<\/span>/g, '\u0001$1\u0002').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ').trim().replace(/\u0001/g, '<span class="red">').replace(/\u0003/g, '<span class="blue">').replace(/\u0002/g, '</span>');
}
// The characters the page shows, in order (the sprite's <use href="#ch-id">); the whole team when it shows none.
function teamOf(html) {
  const ids = [...new Set([...html.matchAll(/href="#ch-([a-z0-9]+)"/g)].map((m) => m[1]))].filter((id) => chars[id] && !id.endsWith('-p'));
  return (ids.length ? ids : team).slice(0, 6);
}

const card = (h1, ids) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:C;src:url(${font('CormorantGaramond-latin.woff2')}) format("woff2");font-weight:300 700}
@font-face{font-family:G;src:url(${font('Geist-latin.woff2')}) format("woff2");font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;background:#fff;overflow:hidden}
body{position:relative;font-family:G,sans-serif;color:#0A0A0A}
.mark{position:absolute;left:72px;top:60px;font:700 34px/1 G;letter-spacing:-0.03em}.mark i{font-style:normal;color:#E11D2A}
h1{position:absolute;left:72px;top:128px;width:1000px;height:290px;display:flex;align-items:center;font-family:C,serif;font-weight:500;letter-spacing:-0.012em;line-height:1.02;text-wrap:balance}
.red{color:#E11D2A}.blue{color:#0F62FE;font-family:G,sans-serif;font-weight:700;letter-spacing:-0.03em}#t{display:block;width:100%}
.team{position:absolute;left:72px;bottom:56px;display:flex;gap:18px;align-items:flex-end}
.team svg{width:92px;height:92px}
.rule{position:absolute;left:72px;right:72px;bottom:172px;height:1px;background:#E4E4E7}
</style></head><body>
<div class="mark">AMTECH<i>.</i></div>
<h1 id="h"><span id="t">${h1}</span></h1>
<div class="rule"></div>
<div class="team">${ids.map((id) => `<svg viewBox="0 0 40 40">${chars[id]}</svg>`).join('')}</div>
<script>
(() => {
const h = document.getElementById('h'), t = document.getElementById('t');
let s = 96; h.style.fontSize = s + 'px';
while (s > 40 && t.offsetHeight > h.clientHeight) { s -= 2; h.style.fontSize = s + 'px'; }
document.body.dataset.size = s;
})();
</script></body></html>`;

fs.mkdirSync(OUT, { recursive: true });
const manifestFile = path.join(OUT, 'manifest.json');
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const p of pages) {
  const h1 = h1Of(p.html);
  if (!h1) { console.log(`og: ${p.route} has no h1, skipped`); continue; }
  await page.setContent(card(h1, teamOf(p.html)), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  if (!(await page.evaluate(() => document.body.dataset.size))) throw new Error(`og: ${p.route}: the fitting script did not run`);
  const key = keyOf(p.route);
  if (process.env.OG_DEBUG) console.log(p.route, await page.evaluate(() => [document.body.dataset.size, document.getElementById('t').offsetHeight, document.getElementById('h').clientHeight, getComputedStyle(document.getElementById('t')).fontSize]));
  await page.screenshot({ path: path.join(OUT, key + '.png'), type: 'png' });
  manifest[key] = h1.replace(/<[^>]+>/g, '');
  n++;
}
await browser.close();
fs.writeFileSync(manifestFile, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 1) + '\n');
console.log(`og: ${n} share images -> ${path.relative(process.cwd(), OUT)}`);
