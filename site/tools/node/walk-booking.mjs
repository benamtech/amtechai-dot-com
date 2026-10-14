// Walk the booking page step by step and screenshot each, with the database and the operator notice stubbed (nothing
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
await page.route('**/rest/v1/demo_bookings**', (r) => {
  const q = r.request();
  calls.push({ method: q.method(), query: new URL(q.url()).search, body: q.postData() && JSON.parse(q.postData()), prefer: q.headers().prefer || null, hasKey: Boolean(q.headers().apikey) });
  if (q.method() === 'GET') return r.fulfill({ contentType: 'application/json', body: JSON.stringify([{ booking_time: '11:00 AM PST' }]) });
  return r.fulfill({ status: 201, body: '' });
});
let notice = null;
await page.route('https://app.amtechai.com/site/booking', (r) => { notice = r.request().postDataJSON(); r.fulfill({ status: 200, body: '{}' }); });
const shot = async (n) => { await page.waitForTimeout(700); await page.screenshot({ path: path.join(out, `${n}-${w}.png`), fullPage: true }); };
await page.goto(base + '/schedule-demo', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await page.getByPlaceholder('john@company.com').fill('not-an-email');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await shot('1-errors');
await page.getByPlaceholder('John Smith').fill('Test Person');
await page.getByPlaceholder('john@company.com').fill('test@example.com');
await page.getByPlaceholder('Acme Corp').fill('Test Co');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await shot('2-industry-empty');
await page.locator('.space-y-2 > button:visible').first().click();
await shot('3-industry-picked');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await page.locator('.space-y-2 > button:visible').nth(2).click();
await shot('4-topic-picked');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(500); // the step's 0.2 s exit, then its entry
await shot('5-calendar');
await page.locator('button:has(svg.lucide-chevron-right)').click();
// the first Monday of next month: a fixed weekday, so both pages show the same slots
const mon = await page.locator('.grid-cols-7 > *').evaluateAll((els) => { const cells = els.slice(7); for (let i = 0; i < cells.length; i++) if (i % 7 === 1 && cells[i].tagName === 'BUTTON' && !cells[i].disabled) return i + 7; return -1; });
await page.locator('.grid-cols-7 > *').nth(mon).click();
await page.waitForTimeout(500);
await page.locator('button', { hasText: /^9:30 AM$/ }).click();
await shot('6-slot-picked');
await page.getByRole('button', { name: 'Confirm Booking' }).click();
await page.getByText('Demo Scheduled').waitFor();
await shot('7-confirmed');
console.log(JSON.stringify({ calls, notice }, null, 1));
await b.close();
