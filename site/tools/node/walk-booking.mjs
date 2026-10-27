// Walk the booking page (C on white, lane PAGES2 2026-10-27: selectors by label and data attribute) step by step and screenshot each, with the platform's two booking routes stubbed (nothing
// is written). Usage: node walk-booking.mjs <base-url> <out-dir> [width]   Prints what each call carried, as JSON.
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = await import(path.join(here, 'node_modules/playwright/index.mjs'));
const [base, out, width = '1280'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const w = Number(width);
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 } });
await page.route(/googletagmanager|google-analytics/, (r) => r.abort());
const calls = [];
await page.route('https://app.amtechai.com/site/slots**', (r) => {
  const q = r.request();
  calls.push({ method: q.method(), query: new URL(q.url()).search, hasKey: Boolean(q.headers().apikey) });
  return r.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true, taken: ['11:00 AM PST'] }) });
});
let notice = null;
await page.route('https://app.amtechai.com/site/booking', (r) => {
  if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST' } });
  notice = r.request().postDataJSON();
  return r.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*' }, contentType: 'application/json', body: '{"ok":true}' });
});
const shot = async (n) => { await page.waitForTimeout(700); await page.screenshot({ path: path.join(out, `${n}-${w}.png`), fullPage: true }); };
await page.goto(base + '/schedule-demo', { waitUntil: 'networkidle' });
await page.locator('[data-step]:visible').getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await page.getByLabel('Email address').fill('not-an-email');
await page.locator('[data-step]:visible').getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await shot('1-errors');
await page.getByLabel('Your name').fill('Test Person');
await page.getByLabel('Email address').fill('test@example.com');
await page.getByLabel("Your business's name").fill('Test Co');
await page.locator('[data-step]:visible').getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await shot('2-industry-empty');
await page.locator('[data-option]:visible').first().click();
await shot('3-industry-picked');
await page.locator('[data-step]:visible').getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await page.locator('[data-option]:visible').nth(2).click();
await shot('4-topic-picked');
await page.locator('[data-step]:visible').getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await shot('5-calendar');
await page.locator('[data-nextmonth]').click();
// the first Monday of next month: a fixed weekday, so both pages show the same slots
const mon = await page.locator('[data-days] > *').evaluateAll((els) => { const cells = els.slice(7); for (let i = 0; i < cells.length; i++) if (i % 7 === 1 && cells[i].tagName === 'BUTTON' && !cells[i].disabled) return i + 7; return -1; });
await page.locator('[data-days] > *').nth(mon).click();
await page.waitForTimeout(500);
await page.locator('[data-times] button:not([disabled])').first().click();
await shot('6-slot-picked');
await page.getByRole('button', { name: 'Book the call' }).click();
await page.getByText('Your call is booked.').waitFor();
await shot('7-confirmed');
console.log(JSON.stringify({ calls, notice }, null, 1));
await b.close();
