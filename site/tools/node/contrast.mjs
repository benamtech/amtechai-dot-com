// Every text on every page can be read: its colour against what is behind it is at least 3:1, measured in a real
// browser (graphics 7, KICKOFF-7 §0.5). The site's <body> is `text-white`, so an element that sets no colour of its own
// is white, and on a light section it is invisible: /create shipped its frame chips and its price table that way, and
// only a person looking caught it. This looks at every element that holds text, in Chromium, as a visitor sees it.
//
//   node site/tools/node/contrast.mjs [--min 3] [--route /create]     # after `npm run build`; exits 1 and names each
//
// The background is the nearest ancestor's solid colour, alpha-blended up the tree; text over an image or a gradient
// cannot be measured this way and is listed as unmeasured (never passed silently). Not run on Netlify (no browser
// there): run it before a page is published, as check.mjs runs after every build.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const PUB = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'public');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const MIN = Number(arg('--min', 3));
const ONLY = arg('--route', null);

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml' };
const server = http.createServer((req, res) => {
  let p = decodeURI(req.url.split('?')[0]);
  let f = path.join(PUB, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const routes = walk(PUB).filter((f) => f.endsWith('/index.html')).map((f) => '/' + path.relative(PUB, path.dirname(f))).map((r) => (r === '/.' ? '/' : r))
  .filter((r) => !ONLY || r === ONLY).sort();

const browser = await chromium.launch();
const fails = [];
const unmeasured = [];
for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' }).catch(() => {});
    // Fade-ins start at opacity 0; the page is measured as it settles.
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important} [data-fade]{opacity:1!important;transform:none!important}' }).catch(() => {});
    const got = await page.evaluate((min) => {
      const rgba = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; };
      const over = (top, bottom) => { const a = top[3]; return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1); };
      const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
      // What is PAINTED beneath the text, not its DOM ancestors: a fixed header floats over a section it is not inside
      // (measured: the nav read 1:1 against <body>'s black while it sat on the white hero). The stack at the text's
      // centre, topmost first, composited until something opaque.
      const bgOf = (el) => {
        const r = el.getBoundingClientRect();
        const x = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
        const stack = [];
        const all = document.elementsFromPoint(x, y);
        const at = all.findIndex((n) => n === el || el.contains(n));
        if (at < 0) return { covered: true };              // something is painted over it here: not measurable
        for (const n of all.slice(at)) {
          if (el.contains(n) && n !== el) continue;
          const cs = getComputedStyle(n);
          if (cs.backgroundImage && cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url("data:image/svg')) return { image: true };
          if (['IMG', 'VIDEO', 'CANVAS', 'IFRAME'].includes(n.tagName)) return { image: true };
          const c = rgba(cs.backgroundColor);
          if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; }
        }
        let bg = [255, 255, 255, 1];
        for (const c of stack.reverse()) bg = over(c, bg);
        return { bg };
      };
      const out = { fail: [], unmeasured: [] };
      for (const el of document.querySelectorAll('body *')) {
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'PATH'].includes(el.tagName.toUpperCase())) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (cs.visibility === 'hidden' || cs.display === 'none' || r.width === 0 || r.height === 0 || Number(cs.opacity) === 0) continue;
        if (el.closest('[hidden],[aria-hidden="true"],.sr-only')) continue;
        el.scrollIntoView({ block: 'center' });
        const fg = rgba(cs.color);
        const b = bgOf(el);
        const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
        const where = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
        if (b.image || b.covered) { out.unmeasured.push({ where, text: (b.covered ? '[covered] ' : '') + text }); continue; }
        const shown = over([fg[0], fg[1], fg[2], fg[3] * Number(cs.opacity)], b.bg);
        const r2 = ratio(shown, b.bg);
        if (r2 < min) out.fail.push({ where, text, ratio: Math.round(r2 * 100) / 100 });
      }
      return out;
    }, MIN);
    for (const f of got.fail) fails.push(`${route} @${viewport.width}px  ${f.ratio}:1  ${f.where}  "${f.text}"`);
    for (const u of got.unmeasured) unmeasured.push(`${route}  ${u.where}  "${u.text}"`);
  }
  await page.close();
}
await browser.close();
server.close();
const uniq = (a) => [...new Set(a)];
if (uniq(unmeasured).length) console.log(`${uniq(unmeasured).length} text element(s) over an image or gradient, not measured (look at them):\n  ` + uniq(unmeasured).slice(0, 40).join('\n  '));
if (fails.length) {
  console.error(`\nFAIL: ${uniq(fails).length} text element(s) under ${MIN}:1 against what is behind them\n  ` + uniq(fails).join('\n  '));
  process.exit(1);
}
console.log(`contrast: every measured text element on ${routes.length} page(s), at desktop and phone width, is at least ${MIN}:1`);
