// Measure the team3d layer on the harness page (lane 3D, 2026-10-27; adapted from GRAPHICS's scripts/GRAPHICS/measure.mjs).
// No server: Playwright's router answers http://t3d.test/ from the built harness (build.sh), and counts the bytes (raw
// and gzip -9, as a CDN would send them).
//   node measure.mjs [dist=/tmp/t3d-public] [--modes gpu,sw,phone4x,reduced] [--shots out-dir] [--window 10]
// Modes: gpu = Chromium on this laptop's GPU (--use-angle=gl; the Intel HD 5500) at 1440x900; sw = default headless
// (SwiftShader, software); phone4x = GPU + 4x CPU throttle at 390x844 DPR 2 (a phone STAND-IN, not a phone);
// reduced = GPU with prefers-reduced-motion. One JSON line per mode, with the 1-minute load average beside it.
import pkg from "/home/georgej/AMTECH/ai-employee-v2/lab/hermes-agent-345cd2b0/node_modules/playwright/index.js";
import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib";
const { chromium } = pkg; const exe = "/home/georgej/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome";
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const dist = argv[0] && !argv[0].startsWith("--") ? argv[0] : "/tmp/t3d-public";
const PATH = arg("--path", "/"), TAG = arg("--tag", "home");
const modes = arg("--modes", "gpu,sw,phone4x,reduced").split(","), shots = arg("--shots", null), WINDOW_S = +arg("--window", "10");
const GPU = ["--use-angle=gl", "--ignore-gpu-blocklist", "--enable-gpu"];
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif" };
async function serve(ctx, tally) {
  await ctx.route("http://t3d.test/**", async (route) => {
    let p = new URL(route.request().url()).pathname; if (p.endsWith("/")) p += "index.html";
    const f = path.join(dist, decodeURIComponent(p));
    if (!fs.existsSync(f)) return route.fulfill({ status: 404, body: "" });
    const body = fs.readFileSync(f), gz = zlib.gzipSync(body, { level: 9 }).length;
    tally.files.push({ p, raw: body.length, gz, at: Date.now() }); tally.raw += body.length; tally.gzip += gz;
    route.fulfill({ status: 200, body, headers: { "content-type": types[path.extname(f)] || "application/octet-stream" } });
  });
  await ctx.route(/^https?:\/\/(?!t3d\.test)/, (r) => r.abort());    // analytics and the like: not measured here
}
// rAF deltas, LCP element, CLS, and when the page was usable (the start field typed into)
const INIT = `(() => { const d = []; let last = 0; const f = (t) => { if (last) d.push(t - last); last = t; requestAnimationFrame(f); }; requestAnimationFrame(f);
  window.__raf = { take: () => d.splice(0) }; window.__lcp = []; window.__cls = 0;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), el: e.element ? (e.element.tagName + "." + (e.element.className || "")).slice(0, 60) : null, size: e.size }); }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); })();`;
const pct = (a, q) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.floor(q * s.length))].toFixed(1); };
const load1 = () => +fs.readFileSync("/proc/loadavg", "utf8").split(" ")[0];
async function one(mode) {
  const gpu = mode !== "sw", phone = mode === "phone4x", throttle = mode.endsWith("4x") ? 4 : 1;
  const browser = await chromium.launch({ executablePath: exe, args: gpu ? GPU : [] });
  try {
    const vp = phone ? { width: 390, height: 844 } : { width: 1440, height: 900 };
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: phone ? 2 : 1, reducedMotion: mode === "reduced" ? "reduce" : "no-preference", hasTouch: phone, isMobile: phone });
    const tally = { raw: 0, gzip: 0, files: [] }; await serve(ctx, tally);
    const page = await ctx.newPage(); await page.addInitScript(INIT);
    const cdp = await ctx.newCDPSession(page); await cdp.send("Performance.enable");
    if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
    const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200))); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
    const tNav = Date.now();
    await page.goto("http://t3d.test" + PATH, { waitUntil: "load" });
    // the start field is usable now, before any scene: type into it and read it back
    const typed = await page.evaluate(() => { const i = document.querySelector("form input"); if (!i) return null; i.focus(); i.value = "Acme Roofing"; return document.activeElement === i && i.value === "Acme Roofing"; });
    await page.waitForFunction(() => window.__t3d && (window.__t3d.firstFrameAt || /^(reduced-motion|save-data|no-webgl2|software|no-host|error|team|no-)/.test(window.__t3d.reason || "")), null, { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(phone ? 2500 : 1500);
    const st = await page.evaluate(() => ({ t3d: Object.fromEntries(Object.entries(window.__t3d || {}).filter(([, v]) => typeof v !== "function")), fcp: performance.getEntriesByType("paint").find((e) => e.name === "first-contentful-paint")?.startTime ?? null,
      load: performance.getEntriesByType("navigation")[0].loadEventEnd, canvas: !!document.querySelector(".t3d-c"), on: !!document.querySelector(".t3d-on") }));
    const sceneFile = tally.files.find((f) => f.p.includes("/team3d/scene.")), loaderFile = tally.files.find((f) => f.p.includes("/team3d/loader."));
    let fps = null, deltas = [], m0, m1;
    if (st.t3d.firstFrameAt) {
      await page.evaluate(() => window.__raf.take());
      m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
      const f0 = await page.evaluate(() => window.__t3d.frames);
      // scroll a little halfway through so the camera move is inside the window
      await page.waitForTimeout(WINDOW_S * 500); await page.mouse.wheel(0, 300); await page.waitForTimeout(WINDOW_S * 500);
      const f1 = await page.evaluate(() => window.__t3d.frames); deltas = await page.evaluate(() => window.__raf.take());
      m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
      fps = +((f1 - f0) / (m1.Timestamp - m0.Timestamp)).toFixed(1);
    }
    const end = await page.evaluate(() => ({ lcp: window.__lcp.at(-1) || null, cls: +window.__cls.toFixed(4), t3d: Object.fromEntries(Object.entries(window.__t3d || {}).filter(([, v]) => typeof v !== "function")) }));
    const wall = m1 ? m1.Timestamp - m0.Timestamp : 1;
    const r = { page: PATH, mode, loadavg_1m: load1(), viewport: `${vp.width}x${vp.height}@${phone ? 2 : 1}`, cpu_throttle: throttle, renderer: end.t3d.gl || end.t3d.renderer || null,
      reason: end.t3d.reason, state: end.t3d.state || null, scene_loaded: !!sceneFile, canvas: st.canvas, swapped: st.on,
      loader_gzip: loaderFile ? loaderFile.gz : null, scene_gzip: sceneFile ? sceneFile.gz : null, page_gzip_total: tally.gzip, files: tally.files.length,
      fcp_ms: st.fcp && Math.round(st.fcp), load_ms: Math.round(st.load), scene_request_after_nav_ms: sceneFile ? sceneFile.at - tNav : null,
      first_frame_ms: st.t3d.firstFrameAt ? Math.round(st.t3d.firstFrameAt) : null, start_field_usable_before_scene: typed,
      fps, raf_p50_ms: pct(deltas, 0.5), raf_p95_ms: pct(deltas, 0.95), raf_over_33ms: deltas.filter((d) => d > 33.4).length,
      governor_level: end.t3d.level ?? null, governor_mean_ms: end.t3d.meanMs ?? null,
      main_task_ms_per_s: m1 ? +(((m1.TaskDuration - m0.TaskDuration) / wall) * 1000).toFixed(0) : null,
      script_ms_per_s: m1 ? +(((m1.ScriptDuration - m0.ScriptDuration) / wall) * 1000).toFixed(0) : null,
      js_heap_mb: m1 ? +(m1.JSHeapUsedSize / 1048576).toFixed(1) : null, lcp: end.lcp, cls: end.cls, errors };
    console.log(JSON.stringify(r));
    if (shots) {   // stills at scroll 0 (after the intro), 200 and 400
      fs.mkdirSync(shots, { recursive: true });
      for (const y of [0, 200, 400]) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(y ? 2000 : 2600);
        await page.screenshot({ path: `${shots}/${TAG}-${vp.width}-${mode}-y${y}.png` }); }
      console.log(JSON.stringify({ mode, after_shots: await page.evaluate(() => window.__t3d && { state: window.__t3d.state, level: window.__t3d.level, meanMs: window.__t3d.meanMs }) }));
    }
  } finally { await browser.close(); }
}
for (const m of modes) await one(m);
