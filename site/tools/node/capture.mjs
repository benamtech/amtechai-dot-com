// Capture a live page as it is now: rendered markup after every scroll-in fade has run, the stylesheets it loads,
// and full-page screenshots at phone and desk width (the baseline the Hugo port is diffed against).
// Usage: node capture.mjs <base-url> <out-dir> <path> [path...]   (ENGINE=firefox|webkit for another engine)
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const pw = await import(path.join(here, 'node_modules/playwright/index.mjs'));
const engine = process.env.ENGINE || 'chromium';
const [base, out, ...paths] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await pw[engine].launch();
const settle = async (page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
};
const css = new Set();
for (const w of [390, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('response', (r) => { if (r.request().resourceType() === 'stylesheet') css.add(r.url()); });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await settle(page);
    const name = p.replace(/\//g, '_') || '_';
    await page.screenshot({ path: path.join(out, `live${name}-${w}${engine === 'chromium' ? '' : '-' + engine}.png`), fullPage: true });
    if (w === 1280) fs.writeFileSync(path.join(out, `live${name}.html`), await page.content());
    console.log('captured', p, w);
  }
  await ctx.close();
}
fs.writeFileSync(path.join(out, 'stylesheets.json'), JSON.stringify([...css], null, 1));
await browser.close();
