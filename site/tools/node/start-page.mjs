// /start's own states, checked in a browser with the AI employee's workspace stubbed (lane START, 2026-10-27; the live
// employee answers on amtechai.com only). Named: the name typed is shown as typed, the workspace gets exactly it, the
// page turns ready and sends start_loaded, the workspace fills the screen with no page scroll. Failed: workspace.js
// 404s (at once) or never draws (after 12 s): the failed state with a retry and a person. Empty: no name, the start
// field, and nothing asked of app.amtechai.com. Screenshots of each state at 390 and 1440 go to <shots-dir>.
//   node site/tools/node/start-page.mjs <base-url | public-dir> [shots-dir]
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
const here = path.dirname(new URL(import.meta.url).pathname);
const pw = await import(path.join(here, 'node_modules/playwright/index.mjs'));
let [base, shots = '/tmp/start-shots'] = process.argv.slice(2);
fs.mkdirSync(shots, { recursive: true });
let server;
if (!/^https?:/.test(base)) {
  const pub = base;
  server = http.createServer((q, r) => {
    let f = path.join(pub, decodeURI(q.url.split('?')[0]));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    const t = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' }[path.extname(f)] || 'application/octet-stream';
    r.writeHead(200, { 'content-type': t }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
}
// The stub draws itself in a shadow root as the real element does (public.tsx: a mount div, React inside), records
// what start() was given, and paints a stand-in workspace (a header, a thread, a message box at the bottom of 100dvh).
const STUB = (draws) => `customElements.define('amtech-workspace', class extends HTMLElement {
  connectedCallback() { const sh = this.attachShadow({ mode: 'open' }); const m = document.createElement('div'); m.style.height = '100%'; sh.appendChild(m);
    ${draws ? `m.innerHTML = '<div style="height:100dvh;display:flex;flex-direction:column;font:15px Geist,sans-serif;background:#fbfbfa"><div style="height:56px;border-bottom:1px solid #e4e4e7;display:flex;align-items:center;padding:0 16px;gap:10px"><b>Your employee</b><span style="margin-left:auto;color:#0F62FE">Sign in</span></div><div style="flex:1;padding:20px;color:#52525b">Stub workspace (the real one is app.amtechai.com/w/workspace.js)</div><div id=box style="margin:10px;height:56px;border:1px solid #0a0a0a;border-radius:8px;padding:16px">Message box</div></div>';` : ''} }
  start(name) { window.__started = { name, intent: this.getAttribute('intent'), app: this.getAttribute('app'), signin: this.getAttribute('signin'), fonts: this.getAttribute('fonts'), expand: this.getAttribute('expand') }; } });`;
const NAME = 'Ventura Roofing & Gutters «Co»';
const browser = await pw.chromium.launch();
const fails = []; const rows = [];
const ok = (cond, what) => { rows.push({ what, ok: !!cond }); if (!cond) fails.push(what); };
async function open(width, url, ws) {   // ws: 'draws' | 'never' | '404' | 'hold'
  const ctx = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 } });
  await ctx.route(/googletagmanager|google-analytics/, (r) => r.abort());
  const app = [];
  let release;
  await ctx.route('https://app.amtechai.com/**', async (r) => {
    const u = r.request().url(); app.push(u);
    if (!u.endsWith('/w/workspace.js')) return r.fulfill({ body: '' });
    if (ws === '404') return r.fulfill({ status: 404, body: '' });
    if (ws === 'hold') await new Promise((res) => { release = res; });
    return r.fulfill({ contentType: 'text/javascript', body: STUB(ws !== 'never') });
  });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'domcontentloaded' });
  return { ctx, page, app, release: () => release && release() };
}
const state = (page) => page.evaluate(() => document.documentElement.dataset.state);
const events = (page) => page.evaluate(() => (window.dataLayer || []).filter((a) => a[0] === 'event').map((a) => a[1]));
const shot = (page, n) => page.screenshot({ path: path.join(shots, n + '.png') });
const url = '/start?' + new URLSearchParams({ business: '  ' + NAME + ' ', industry: 'roofing' });

for (const width of [390, 1440]) {
  // Loading (the script held), then ready.
  let { ctx, page, app, release } = await open(width, url, 'hold');
  await page.waitForTimeout(400);
  ok(await state(page) === 'loading', `${width} loading state while workspace.js is on its way`);
  ok((await page.textContent('[data-name]')) === NAME, `${width} the name is shown exactly as typed (trimmed)`);
  await shot(page, `start-${width}-loading`);
  release();
  await page.waitForFunction(() => document.documentElement.dataset.state === 'ready', null, { timeout: 8000 }).catch(() => {});
  ok(await state(page) === 'ready', `${width} ready once the workspace draws`);
  const got = await page.evaluate(() => window.__started);
  ok(got && got.name === NAME && got.intent === 'start' && got.fonts === 'none' && got.expand === 'none' && got.signin === 'https://app.amtechai.com/signup', `${width} the workspace got the name and the contract (${JSON.stringify(got)})`);
  ok((await events(page)).includes('start_loaded'), `${width} start_loaded sent`);
  await page.waitForTimeout(500);
  const geo = await page.evaluate(() => { const r = document.querySelector('amtech-workspace').getBoundingClientRect(); const s = document.scrollingElement; return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: innerHeight, w: innerWidth, scroll: s.scrollHeight - s.clientHeight, overflow: getComputedStyle(document.body).overflow }; });
  ok(geo.top === 0 && Math.abs(geo.bottom - geo.h) < 1 && Math.abs(geo.right - geo.w) < 1 && geo.overflow === 'hidden', `${width} the workspace fills the screen height, no page scroll (${JSON.stringify(geo)})`);
  const box = await page.evaluate(() => document.querySelector('amtech-workspace').shadowRoot.querySelector('#box').getBoundingClientRect().bottom);
  ok(box <= geo.h, `${width} the message box is above the fold (${box} <= ${geo.h})`);
  await shot(page, `start-${width}-ready`);
  await ctx.close();

  // Failed at once: workspace.js 404s.
  ({ ctx, page, app } = await open(width, url, '404'));
  await page.waitForFunction(() => document.documentElement.dataset.state === 'failed', null, { timeout: 5000 }).catch(() => {});
  ok(await state(page) === 'failed', `${width} failed state when workspace.js 404s`);
  ok(await page.isVisible('[data-retry]') && await page.isVisible('.st-fail a[href^="mailto:"]'), `${width} retry and a person shown`);
  ok((await events(page)).includes('start_failed'), `${width} start_failed sent`);
  await shot(page, `start-${width}-failed`);
  await ctx.close();

  // Empty: no name.
  ({ ctx, page, app } = await open(width, '/start', 'draws'));
  await page.waitForTimeout(600);
  ok(await state(page) === 'empty' && await page.isVisible('.st-empty form[data-start] input[name=business]'), `${width} empty state shows the start field`);
  ok(app.length === 0, `${width} nothing asked of app.amtechai.com with no name (${app.length})`);
  await shot(page, `start-${width}-empty`);
  await page.fill('.st-empty input[name=business]', 'Casa Verde');
  await Promise.all([page.waitForURL(/business=Casa/), page.press('.st-empty input[name=business]', 'Enter')]);
  await page.waitForFunction(() => window.__started, null, { timeout: 5000 }).catch(() => {});
  ok((await page.evaluate(() => window.__started && window.__started.name)) === 'Casa Verde', `${width} the empty state's field starts the workspace`);
  await ctx.close();

  // Empty with a package (/start?config=<package>, as the service cards and the Markdown twins link): the package, the
  // trade page and the door go with the name typed (MISSED.md §4.2, 2026-10-28).
  ({ ctx, page, app } = await open(width, '/start?config=this-months-posts-and-pictures&industry=roofing&for=agency', 'draws'));
  await page.waitForTimeout(600);
  ok(await state(page) === 'empty', `${width} a package link with no name is the empty state`);
  await page.fill('.st-empty input[name=business]', 'Casa Verde');
  await Promise.all([page.waitForURL(/business=Casa/), page.press('.st-empty input[name=business]', 'Enter')]);
  const kept = new URL(page.url()).searchParams;
  ok(kept.get('config') === 'this-months-posts-and-pictures' && kept.get('industry') === 'roofing' && kept.get('for') === 'agency'
     && kept.getAll('config').length === 1, `${width} the empty state keeps the package, trade and door (${page.url()})`);
  await ctx.close();

  // No JavaScript.
  const nctx = await browser.newContext({ viewport: { width, height: 844 }, javaScriptEnabled: false });
  const np = await nctx.newPage(); await np.goto(base + url);
  ok(await np.isVisible('.st-ns') && !(await np.isVisible('.st-load')), `${width} no-JavaScript message, no spinner`);
  await np.screenshot({ path: path.join(shots, `start-${width}-noscript.png`) });
  await nctx.close();
}
// Never draws: failed after 12 s (one width; it waits the full 12 s).
{
  const { ctx, page } = await open(390, url, 'never');
  await page.waitForTimeout(9000);
  ok(await state(page) === 'loading', 'still loading at 9 s when the workspace never draws');
  await page.waitForFunction(() => document.documentElement.dataset.state === 'failed', null, { timeout: 6000 }).catch(() => {});
  ok(await state(page) === 'failed', 'failed by about 12 s when the workspace never draws');
  await ctx.close();
}
await browser.close(); if (server) server.close();
console.log(JSON.stringify(rows, null, 1));
if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log(`start page: ${rows.length} of ${rows.length} pass; shots in ${shots}`);
