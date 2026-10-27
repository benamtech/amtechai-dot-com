// The Swarm (lane ART kit): the team as points of light that drift as a swarm, then gather into a halo around the
// statue's head and join into a network. Canvas 2D, no library. Starts after first paint; stops when the sky leaves
// the screen or the tab hides; halves itself if frames run long (a governor, after Kage's); under reduced motion it
// draws one still frame of the gathered halo. Colours: the shipped teammate hues plus ivory.
const sky = document.querySelector(".sky"), cv = sky && sky.querySelector(".swarm");
if (cv) {
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches, COARSE = matchMedia("(pointer: coarse)").matches; let done = false;
  const HUES = ["#0F9488", "#7C5CD6", "#C8810E", "#2F9E5A", "#A3479C", "#0E7490"];
  // colours from the canvas (white ground: data-line="10,10,10" data-dot="#0A0A0A" data-strength="0.5"); defaults are the dusk sky's
  const LINE = cv.dataset.line || "246,234,214", DOT = cv.dataset.dot || "#F6EAD6", STR = +(cv.dataset.strength || 1);
  const g = cv.getContext("2d"); let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0, P = [], on = true, t0 = performance.now(), last = t0;
  const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  function size() {
    const r = sky.getBoundingClientRect(); DPR = Math.min(devicePixelRatio || 1, 1.5);
    W = r.width; H = r.height; cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + "px"; cv.style.height = H + "px";
    const art = (sky.querySelector(".orbit") || sky.querySelector(".sky-plate")).getBoundingClientRect();
    cx = art.left - r.left + art.width * 0.5; cy = art.top - r.top + art.height * 0.5; R = art.width * 0.30;
  }
  function make(n) {
    P = Array.from({ length: n }, (_, i) => { const ring = i % 3, a = (i / n) * Math.PI * 2 * 3 + ring * 0.7;
      return { x: rnd() * W, y: rnd() * H, vx: 0, vy: 0, a, ring, s: i % 9 === 0 ? 2.6 : 1.3 + rnd() * 1.1, c: DOT === "hue" || i % (cv.dataset.dot ? 2 : 4) === 0 ? HUES[i % HUES.length] : DOT, ph: rnd() * 6.28 }; });
  }
  const pointer = { x: -1e4, y: -1e4 };
  sky.addEventListener("pointermove", (e) => { const r = sky.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; }, { passive: true });
  sky.addEventListener("pointerleave", () => { pointer.x = pointer.y = -1e4; });
  function step(dt, time, settle) {
    const gather = settle ? 1 : Math.min(1, Math.max(0, (time - 0.8) / 3.2));
    for (const p of P) {
      const rr = R * (1 + p.ring * 0.17), a = p.a + time * (0.05 + p.ring * 0.02) * (p.ring % 2 ? -1 : 1);
      const hx = cx + rr * Math.cos(a), hy = cy + rr * 0.92 * Math.sin(a);
      // swarm: a curl-ish flow; gather: a spring to the halo
      const fx = Math.sin(p.y * 0.006 + time * 0.4 + p.ph) * 18, fy = Math.cos(p.x * 0.005 - time * 0.3 + p.ph) * 18;
      let ax = fx * (1 - gather) + (hx - p.x) * 2.2 * gather, ay = fy * (1 - gather) + (hy - p.y) * 2.2 * gather;
      const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy; if (d2 < 9000) { ax += (dx / Math.sqrt(d2 + 1)) * 260; ay += (dy / Math.sqrt(d2 + 1)) * 260; }
      p.vx = (p.vx + ax * dt) * 0.9; p.vy = (p.vy + ay * dt) * 0.9; p.x += p.vx * dt * 6; p.y += p.vy * dt * 6;
    }
    return gather;
  }
  function draw(gather, time) {
    g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    g.lineWidth = 0.6;
    const L = 64 + 30 * gather, L2 = L * L;
    for (let i = 0; i < P.length; i++) { const p = P[i]; for (let j = i + 1; j < P.length; j++) { const q = P[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
      if (d < L2) { g.strokeStyle = `rgba(${LINE},${(0.22 * STR * (1 - d / L2) * (0.35 + 0.65 * gather)).toFixed(3)})`; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); } } }
    for (const p of P) { const tw = (0.7 + 0.3 * Math.sin(time * 2 + p.ph)) * (p.c === DOT ? Math.min(1, STR * 1.2) : 1); g.globalAlpha = tw; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 6.283); g.fill();
      if (p.s > 2) { g.globalAlpha = 0.18 * tw; g.beginPath(); g.arc(p.x, p.y, p.s * 4, 0, 6.283); g.fill(); } }
    g.globalAlpha = 1;
  }
  let acc = 0, n = 0, count = W < 700 ? 110 : 170;
  function frame(now) {
    if (!on || done) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; const time = (now - t0) / 1000;
    acc += dt; n++; if (n === 40) { if (acc / n > 0.024 && P.length > 50) P.length = Math.floor(P.length / 2); acc = 0; n = 0; }
    const gth = step(dt, time, false); draw(gth, time);
    if (COARSE && time > 6.5) { done = true; window.__swarm = { frames: (window.__swarm?.frames || 0) + 1, count: P.length, settled: true }; return; } // phones: the halo forms, then it rests window.__swarm = { frames: (window.__swarm?.frames || 0) + 1, count: P.length };
    requestAnimationFrame(frame);
  }
  const start = () => {
    size(); count = COARSE ? 60 : W < 700 ? 110 : 170; make(count);
    if (REDUCE) { for (let k = 0; k < 400; k++) step(0.03, 6 + k * 0.03, true); draw(1, 6); window.__swarm = { frames: 1, count: P.length, still: true }; return; }
    new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting && !document.hidden; if (on && !was) { last = performance.now(); requestAnimationFrame(frame); } }).observe(sky);
    document.addEventListener("visibilitychange", () => { const was = on; on = !document.hidden; if (on && !was) { last = performance.now(); requestAnimationFrame(frame); } });
    requestAnimationFrame(frame);
  };
  addEventListener("resize", () => { size(); });
  // after first paint: the page is readable and the action clickable before a single particle is computed
  if (document.readyState === "complete") requestAnimationFrame(() => setTimeout(start, 0)); else addEventListener("load", () => requestAnimationFrame(() => setTimeout(start, 0)));
}
