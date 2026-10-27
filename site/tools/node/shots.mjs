// Full-page screenshots of built pages at phone and desk width, served from a build folder with no other server.
// What a person checks a page with before saying anything about it (Ben, 2026-10-27: look at every page at 390 and
// 1440, in full).   node site/tools/node/shots.mjs <public-dir> <out-dir> <path> [path...]
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
const here = path.dirname(new URL(import.meta.url).pathname);
const pw = await import(path.join(here, 'node_modules/playwright/index.mjs'));
const [pub, out, ...paths] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
const server = http.createServer((q, r) => {
  let p = decodeURI(q.url.split('?')[0]); let f = path.join(pub, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  else if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  else if (!fs.existsSync(f) && fs.existsSync(path.join(f, 'index.html'))) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('404'); }
  r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await pw.chromium.launch();
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: w === 390 ? 2 : 1, reducedMotion: 'reduce' });
  await ctx.route(/googletagmanager|google-analytics/, (r) => r.abort());
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const name = (p.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'index') + `-${w}`;
    await page.screenshot({ path: path.join(out, name + '.png'), fullPage: true });
    // Labels that overflow their box or the screen (ART's bounding-box check, 2026-10-27)
    const bad = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,p,a,button,span,b,dt,dd,li,label')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).slice(0, 8).map((e) => `${e.tagName}.${e.className}: ${e.textContent.trim().slice(0, 40)}`));
    console.log(name, bad.length ? 'OFFSCREEN ' + JSON.stringify(bad) : 'ok');
  }
  await ctx.close();
}
await browser.close(); server.close();
