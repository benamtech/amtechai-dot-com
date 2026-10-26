/**
 * shoot.mjs - photograph and film one page as a visitor meets it, at 1440 and 390.
 *
 *   node docs/first-principles/lab/shoot.mjs <round> <name> <url> [--hold 6] [--full]
 *
 * Writes docs/first-principles/shots/<round>/:
 *   <name>-desktop-first.png   <name>-phone-first.png      the first screen, after --hold seconds (motion settles)
 *   <name>-desktop-calm.png    <name>-phone-calm.png       the first screen with prefers-reduced-motion: reduce
 *   <name>-desktop-full.png    <name>-phone-full.png       the whole page (capped at 12,000 px), only with --full
 *   <name>-desktop.webm        <name>-phone.webm           the hold, then a scroll through the page at reading pace
 *   <name>.json                                            console errors, failed requests, overflowing controls,
 *                                                          bytes and LCP at 1440, the page's height
 * GET and scroll only: nothing is clicked, typed or submitted, so a preview wired to anything live is safe to shoot.
 */
import pkg from "/home/georgej/AMTECH/ai-employee-v2/lab/hermes-agent-345cd2b0/node_modules/playwright/index.js";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const { chromium } = pkg;
const args = process.argv.slice(2);
const flag = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const full = args.includes("--full"); if (full) args.splice(args.indexOf("--full"), 1);
const hold = Number(flag("--hold", "6"));
const [round, name, url] = args;
if (!url) { console.error("usage: shoot.mjs <round> <name> <url> [--hold 6] [--full]"); process.exit(2); }
const out = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "shots", round);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/home/georgej/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome" });
const SIZES = [
  ["desktop", { width: 1440, height: 900 }, 1, undefined],
  ["phone", { width: 390, height: 844 }, 2, "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"],
];
const report = { round, name, url, at: new Date().toISOString(), sizes: {} };
for (const [size, vp, scale, ua] of SIZES) {
  const r = { console_errors: [], failed: [], overflow: [] };
  const vdir = fs.mkdtempSync(path.join(out, ".v-"));
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: scale, userAgent: ua, recordVideo: { dir: vdir, size: vp } });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") r.console_errors.push(m.text().slice(0, 200)); });
  page.on("requestfailed", (q) => r.failed.push(`${q.failure()?.errorText} ${q.url().slice(0, 120)}`));
  let bytes = 0; page.on("response", async (res) => { try { bytes += (await res.body()).length; } catch {} });
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch((e) => r.console_errors.push("goto: " + String(e).slice(0, 120)));
  r.load_ms = Date.now() - t0;
  await page.waitForTimeout(hold * 1000);
  await page.screenshot({ path: path.join(out, `${name}-${size}-first.png`) });
  r.lcp_ms = await page.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true }); setTimeout(() => res(Math.round(v)), 200); }));
  // A control whose text spills out of it (DP-900 K8): text wrapping inside a fixed-height button or chip.
  r.overflow = await page.evaluate(() => [...document.querySelectorAll("button,a,[role=button],input,label,.chip")]
    .filter((e) => { const s = getComputedStyle(e); return e.offsetHeight > 0 && e.scrollHeight > e.clientHeight + 2 && s.overflow !== "auto" && s.overflow !== "scroll"; })
    .slice(0, 10).map((e) => (e.innerText || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 60)));
  r.height = await page.evaluate(() => document.documentElement.scrollHeight);
  // Scroll at reading pace: 1.6 viewport per 2.2 s, eased, so the clip shows each section arrive.
  await page.evaluate(async () => {
    const H = document.documentElement.scrollHeight - innerHeight; const step = innerHeight * 0.8;
    for (let y = 0; y < H; y += step) { scrollTo({ top: Math.min(y + step, H), behavior: "smooth" }); await new Promise((z) => setTimeout(z, 1100)); }
    await new Promise((z) => setTimeout(z, 1200));
  });
  if (full) {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);
    const h = Math.min(r.height, 12000);
    await page.setViewportSize({ width: vp.width, height: h }).catch(() => {});
    await page.screenshot({ path: path.join(out, `${name}-${size}-full.png`), clip: { x: 0, y: 0, width: vp.width, height: h } }).catch((e) => r.console_errors.push("full: " + String(e).slice(0, 80)));
  }
  r.bytes_kb = Math.round(bytes / 1024);
  const video = page.video();
  await ctx.close();
  // Small enough to commit every round: 960 px wide at most, 15 fps, VP9 at CRF 46 (a 20 s clip of a photo-heavy page
  // went 2.8 MB -> 0.9 MB, measured 2026-10-26); the raw recording is kept only if ffmpeg fails.
  if (video) {
    const raw = await video.path(), dst = path.join(out, `${name}-${size}.webm`);
    const enc = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-vf", `scale='min(960,iw)':-2,fps=15`, "-c:v", "libvpx-vp9",
      "-crf", "46", "-b:v", "0", "-row-mt", "1", "-deadline", "realtime", "-cpu-used", "8", "-an", dst]);
    if (enc.status !== 0) fs.renameSync(raw, dst);
  }
  fs.rmSync(vdir, { recursive: true, force: true });
  // The calm shot: the same first screen for a visitor who asked for less motion.
  const calm = await browser.newContext({ viewport: vp, deviceScaleFactor: scale, userAgent: ua, reducedMotion: "reduce" });
  const cp = await calm.newPage();
  await cp.goto(url, { waitUntil: "load", timeout: 60000 }).catch(() => {});
  await cp.waitForTimeout(Math.min(hold, 3) * 1000);
  await cp.screenshot({ path: path.join(out, `${name}-${size}-calm.png`) });
  await calm.close();
  report.sizes[size] = r;
}
await browser.close();
fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(report, null, 1));
const d = report.sizes.desktop, p = report.sizes.phone;
console.log(JSON.stringify({ name, out, desktop: { lcp_ms: d.lcp_ms, kb: d.bytes_kb, errors: d.console_errors.length, overflow: d.overflow.length, h: d.height },
  phone: { lcp_ms: p.lcp_ms, errors: p.console_errors.length, overflow: p.overflow.length, h: p.height } }));
