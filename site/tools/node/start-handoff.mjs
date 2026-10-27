// The start field's handoff, checked in a browser with the AI employee's workspace stubbed (the live employee answers
// on amtechai.com only, so a preview or a local build can only be checked this way): on each page, a business's name
// typed into the start field and submitted reaches /start, and /start gives exactly that name to the workspace as its
// first input. Nothing reaches app.amtechai.com before the submit. Exits 1 on a failure.
//   node site/tools/node/start-handoff.mjs <base-url | public-dir> [path...]
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
const here = path.dirname(new URL(import.meta.url).pathname);
const pw = await import(path.join(here, 'node_modules/playwright/index.mjs'));
let [base, ...paths] = process.argv.slice(2);
if (!paths.length) paths = ['/', '/industries/roofing', '/departments/being-found', '/services', '/industries'];
let server;
if (!/^https?:/.test(base)) {
  const pub = base;
  server = http.createServer((q, r) => {
    let f = path.join(pub, decodeURI(q.url.split('?')[0]));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': f.endsWith('.html') ? 'text/html' : f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' });
    fs.createReadStream(f).pipe(r);
  }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
}
// The stub: a custom element with the workspace's attributes and start(), recording what it was given.
const STUB = `customElements.define('amtech-workspace', class extends HTMLElement { start(name) { window.__started = { name, intent: this.getAttribute('intent'), app: this.getAttribute('app'), signin: this.getAttribute('signin') }; } });`;
const NAME = "Ventura Roofing & Gutters";
const browser = await pw.chromium.launch();
const fails = []; const rows = [];
for (const width of [390, 1440]) {
  for (const p of paths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    await ctx.route(/googletagmanager|google-analytics/, (r) => r.abort());
    const early = [];
    await ctx.route('https://app.amtechai.com/**', (r) => {
      if (r.request().url().endsWith('/w/workspace.js')) return r.fulfill({ contentType: 'text/javascript', body: STUB });
      early.push(r.request().url()); return r.fulfill({ body: '' });
    });
    const page = await ctx.newPage();
    await page.goto(base + p, { waitUntil: 'load' });
    const before = early.length;
    const field = page.locator('form[data-start] input[name=business]').first();
    await field.fill(NAME);
    await Promise.all([page.waitForURL(/\/start\?/), field.press('Enter')]);
    await page.waitForFunction(() => window.__started, null, { timeout: 5000 }).catch(() => {});
    const got = await page.evaluate(() => window.__started || null);
    const url = new URL(page.url());
    const ok = got && got.name === NAME && got.intent === 'start' && before === 0;
    rows.push({ width, page: p, url: url.pathname + url.search, started: got && got.name, industry: url.searchParams.get('industry'), early: before, ok: !!ok });
    if (!ok) fails.push(`${width} ${p}: ${JSON.stringify({ got, before })}`);
    await ctx.close();
  }
}
await browser.close(); if (server) server.close();
console.log(JSON.stringify(rows, null, 1));
if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log(`start handoff: ${rows.length} of ${rows.length} pass`);
