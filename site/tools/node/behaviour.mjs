// The behaviour a ported page must keep, checked the same way on production and on the port, with the box
// stubbed so nothing reaches app.amtechai.com. Usage: node site/tools/node/behaviour.mjs <base-url>   (prints JSON)
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = await import(path.join(here, 'node_modules/playwright/index.mjs'));
const base = process.argv[2];
const out = {};
const browser = await chromium.launch();

// 1. The mobile menu opens and closes.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await toggle.click();
  await page.waitForTimeout(500);
  const link = page.locator('nav a', { hasText: 'How It Works' }).last();
  out.menuOpens = await link.isVisible();
  out.menuLinks = await page.locator('nav a').evaluateAll((as) => as.filter((a) => a.offsetParent).map((a) => a.textContent.trim()));
  await toggle.click();
  await page.waitForTimeout(600);
  out.menuCloses = !(await link.isVisible());
  await ctx.close();
}

// 2. A section below the fold is hidden until it is scrolled to, then shown.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/painters', { waitUntil: 'load' });
  const h = page.locator('h2', { hasText: 'We run our own business on it.' });
  const op = () => h.evaluate((el) => { let o = 1; for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity); return o; });
  await page.waitForTimeout(300);
  out.fadeBefore = await op();
  await h.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  out.fadeAfter = await op();
  await ctx.close();
}

// 3. Home's phone form goes to the sign-up chat with the number.
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let went = null;
  await page.route('https://app.amtechai.com/**', (r) => { if (r.request().isNavigationRequest()) went ??= r.request().url(); r.fulfill({ body: 'stub' }); });
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.getByPlaceholder('+18055550142').fill('  +1 805 555 0142 ');
  await page.getByRole('button', { name: 'Claim my AI Employee' }).click();
  await page.waitForTimeout(1500);
  out.phoneGoesTo = went;
  await ctx.close();
}

// 4. /contractors: nothing reaches the box before the act; on Start the workspace is made with today's contract.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const hits = [];
  await page.route('https://app.amtechai.com/**', (r) => {
    hits.push(r.request().url());
    r.fulfill({ contentType: 'text/javascript', body: `
      customElements.define('amtech-workspace', class extends HTMLElement {
        start(text, files) { window.__seen = { app: this.getAttribute('app'), fonts: this.getAttribute('fonts'),
          intent: this.getAttribute('intent'), check: this.getAttribute('check'), starters: (this.starters || []).map((s) => s.family),
          text, files: (files || []).map((f) => f.name), parent: this.parentElement && this.parentElement.className }; }
      });` });
  });
  await page.goto(base + '/contractors', { waitUntil: 'networkidle' });
  await page.locator('#job').click();
  await page.locator('#job').pressSequentially('Price this job');
  await page.waitForTimeout(500);
  out.boxHitsBeforeAct = hits.length;
  await page.getByRole('button', { name: 'Invoice a job and get paid' }).first().click();
  out.chipFills = await page.locator('#job').inputValue();
  await page.locator('#job').fill('Price this job: 120 ft of gutter');
  await page.locator('input[type=file]').setInputFiles({ name: 'plan.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
  out.filesLabel = (await page.locator('form label.cursor-pointer').textContent()).trim();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForFunction(() => window.__seen, null, { timeout: 5000 });
  out.workspace = await page.evaluate(() => window.__seen);
  out.boxHits = hits;
  out.placeholderGone = (await page.getByText('The employee opens here when you start.').count()) === 0;
  out.composerCleared = (await page.locator('#job').inputValue()) === '';
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
