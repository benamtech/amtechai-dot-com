// The hero's team as a live 3D scene (lane 3D, 2026-10-27). Loaded only by loader.js, after the page has painted and
// only where WebGL2 runs on a real GPU. It takes over the SVG Orbit already on the page without moving anything:
//   - the camera starts straight above the ring with the frame fitted to the figure, and every character is turned to
//     face the camera at its isometric view (characters.js), so the first 3D frame is the SVG's picture;
//   - the canvas fades in over the figure after that first frame; then the SVG drawings fade out (the labels stay DOM,
//     moved with the CSS `translate` property by how far their anchor's projection has moved: crisp, no reflow, CLS 0);
//   - motion: the characters bob and blink; every few seconds a teammate "works" (a pulse runs from the employee to it,
//     it hops); the wires carry the SVG's pulses; scrolling tilts the ring back along damped CatmullRom waypoints
//     (Kage's rig: technique only), with a few motes respawned ahead of the camera;
//   - a frame governor: lower pixel ratio, then no motes, then lower again, then stop and give the SVG back.
// Paused off-screen and in a hidden tab. Everything the eye reads (names, systems) is still the DOM's.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshBasicMaterial, CircleGeometry, PlaneGeometry, CanvasTexture,
  Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Vector3, Vector2, CatmullRomCurve3, Raycaster, Plane,
} from "three";
import { character } from "./characters.js";
import { ground, wirePath, W } from "./ground.js";

const EASE = "cubic-bezier(.16,1,.3,1)";
const CSS = `.t3d-c{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .6s ${EASE}}
.t3d-on .t3d-c{opacity:1}
.orbit .o-svg,.orbit .o-ch>svg,.orbit .o-ch::before{transition:opacity .6s ${EASE}}
.t3d-on .o-svg,.t3d-on .o-ch>svg,.t3d-on .o-ch::before{opacity:0}
.t3d-on .o-ch,.t3d-on .o-sys{will-change:translate}`;
const FOV = 24, TAU = Math.PI * 2, D2R = Math.PI / 180;
// waypoints over the hero's scroll progress: elevation, azimuth (deg), distance (x the fitted distance)
const WAY = [[89.9, 0, 1], [68, -7, 0.97], [54, -14, 0.93]];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (cur, to, rate, dt) => cur + (to - cur) * (1 - Math.exp(-rate * dt));
const pct = (el, k) => parseFloat(el.style[k]) * 6.4;   // the Orbit's inline left/top % -> SVG units (640)

function softDisc(stops) {      // a radial texture: [offset, alpha] stops, white, tinted by the material
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  for (const [o, a] of stops) r.addColorStop(o, `rgba(255,255,255,${a})`);
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new CanvasTexture(c);
}

export function start(wrap, data) {
  const fig = wrap.querySelector(".orbit"); if (!fig) return "no-orbit";
  const chEls = [...fig.querySelectorAll(".o-ch")], sysEls = [...fig.querySelectorAll(".o-sys")];
  const centreEl = wrap.querySelector("[data-t3d-centre],.h2-centre");
  const team = (data && data.team) || [];
  if (!chEls.length || chEls.length !== team.length) return "team-mismatch";
  const info = (window.__t3d = window.__t3d || {});
  Object.assign(info, { state: "starting", frames: 0, firstFrameAt: null, level: 0, t0: performance.now() });

  if (!document.getElementById("t3d-css")) { const s = document.createElement("style"); s.id = "t3d-css"; s.textContent = CSS; document.head.append(s); }
  const canvas = document.createElement("canvas"); canvas.className = "t3d-c"; canvas.setAttribute("aria-hidden", "true");
  let renderer;
  try { renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }); }
  catch (e) { return "no-context"; }
  fig.prepend(canvas);
  renderer.setClearColor(0xffffff, 0);
  const gl = renderer.getContext(), ext = gl.getExtension("WEBGL_debug_renderer_info");
  info.renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  const pr0 = Math.min(devicePixelRatio || 1, 2); let pr = pr0; renderer.setPixelRatio(pr);

  const scene = new Scene(), cam = new PerspectiveCamera(FOV, 1, 1, 2000); cam.up.set(0, 0, -1);
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");

  // ---- the team: anchors from the Orbit's own markup, looks from the data (data/team.json via the partial)
  const halo = softDisc([[0, 0.3], [0.778, 0.12], [1, 0]]), shade = softDisc([[0, 1], [0.5, 0.45], [1, 0]]);
  const unitPlane = new PlaneGeometry(1, 1);
  const chars = team.map((m, i) => {
    const el = chEls[i], c = character(m.shape, m.hue), holder = new Group(), hop = new Group();
    const h = new Mesh(unitPlane, new MeshBasicMaterial({ map: halo, color: m.hue, transparent: true, depthWrite: false, depthTest: false }));
    const s = new Mesh(unitPlane, new MeshBasicMaterial({ map: shade, color: 0x0a0a0a, opacity: 0.13, transparent: true, depthWrite: false, depthTest: false }));
    h.renderOrder = 1; s.renderOrder = 1;
    // in the transparent list too, so the ground and halos (drawn without depth) go first and the solids on top
    c.solid.traverse((o) => { o.renderOrder = 2; if (o.material) o.material.transparent = true; });
    hop.add(c.solid); holder.add(h, s, hop); scene.add(holder);
    return { el, x: pct(el, "left"), y: pct(el, "top"), holder, hop, halo: h, shadow: s, eyes: c.eyes, emp: i === 0, ph: i % 2 ? 3 : 0, jump: -1 };
  });
  const emp = chars[0];
  const sys = sysEls.map((el) => ({ el, x: pct(el, "left"), y: pct(el, "top") }));

  // ---- the ground (rings + wires) and the pulses: rebuilt in layout() because phones hide some systems
  let groundMesh = null, wires = [];
  const pulseGeo = new CircleGeometry(0.34, 20); pulseGeo.rotateX(-Math.PI / 2);
  const pulseMat = new MeshBasicMaterial({ color: 0x0f62fe, transparent: true, depthWrite: false, depthTest: false });
  const pulses = [];
  const work = new Mesh(pulseGeo, pulseMat.clone()); work.renderOrder = 1; work.visible = false; scene.add(work);

  // ---- motes, respawned in the cone ahead of the camera
  const MOTES = 36, mpos = new Float32Array(MOTES * 3), mvel = new Float32Array(MOTES);
  const mg = new BufferGeometry(); mg.setAttribute("position", new Float32BufferAttribute(mpos, 3));
  const motes = new Points(mg, new PointsMaterial({ map: softDisc([[0, 1], [0.6, 0.8], [1, 0]]), color: 0x8fa9f0, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false, depthTest: false }));
  motes.renderOrder = 1; motes.frustumCulled = false; scene.add(motes);
  const ray = new Raycaster(), ndc = new Vector2(), hit = new Vector3(), plane = new Plane(new Vector3(0, 1, 0), 0);
  const spawn = (i, anywhere) => {
    ndc.set(Math.random() * 1.8 - 0.9, Math.random() * 1.8 - 0.9); ray.setFromCamera(ndc, cam);
    plane.constant = -(anywhere ? Math.random() * 14 : Math.random() * 3);
    if (!ray.ray.intersectPlane(plane, hit)) hit.set(0, 0, 0);
    mpos.set([hit.x, hit.y, hit.z], i * 3); mvel[i] = 0.5 + Math.random() * 0.7;
  };

  // ---- layout: sizes in px -> world (the figure maps the SVG's 640 units; world = SVG / 10)
  let w = 0, h = 0, wpp = 0, D = 0;
  const camUp = new Vector3(), camRight = new Vector3(), tmp = new Vector3();
  function layout() {
    w = fig.clientWidth; h = fig.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    wpp = 64 / h;                                  // world units per CSS px at the ground, at rest
    D = 32 / Math.tan((FOV / 2) * D2R); cam.updateProjectionMatrix();
    for (const c of chars) {
      const svg = c.el.querySelector("svg"), cs = svg ? getComputedStyle(svg) : null;
      const sz = cs ? parseFloat(cs.width) : 64, H = c.el.offsetHeight;
      c.size = sz * wpp; c.up = (-0.58 * H + sz / 2) * wpp;            // the drawing's centre above the anchor
      c.hop.scale.setScalar(c.size / 40);
      const hs = sz * 1.75 * wpp; c.halo.scale.set(hs, hs, 1); c.halo.position.set(0, (-0.14 * H - (-0.58 * H + sz / 2)) * -wpp, -0.1);
      c.shadow.scale.set(sz * 1.1 * wpp, sz * 0.9 * wpp, 1); c.shadow.position.set(0, -10 * wpp, -0.05);   // drop-shadow(0 10px 12px)
    }
    // wires: only to systems the page shows (phones hide the 3 and 9 o'clock ones)
    const live = sys.filter((s) => getComputedStyle(s.el).display !== "none");
    wires = live.map((s) => ({ s, f: wirePath(s.x, s.y, emp.x, emp.y), i: sys.indexOf(s) }));
    if (groundMesh) { scene.remove(groundMesh); groundMesh.geometry.dispose(); }
    groundMesh = ground(wires.map((x) => x.f)); scene.add(groundMesh);
    while (pulses.length < wires.length) { const p = new Mesh(pulseGeo, pulseMat); p.renderOrder = 1; scene.add(p); pulses.push(p); }
    pulses.forEach((p, i) => { p.visible = i < wires.length; });
  }

  // ---- the rig
  const way = WAY.map(([el, az, d]) => new Vector3(Math.cos(el * D2R) * Math.sin(az * D2R), Math.sin(el * D2R), Math.cos(el * D2R) * Math.cos(az * D2R)).multiplyScalar(d));
  const curve = new CatmullRomCurve3(way, false, "catmullrom", 0.42);
  let prog = 0, progTo = 0, px = 0, py = 0, pxTo = 0, pyTo = 0;
  const readScroll = () => { const r = wrap.getBoundingClientRect(), top = r.top + scrollY; progTo = clamp(scrollY / Math.max(1, top + r.height * 0.6), 0, 1); };
  const onMove = (e) => { pxTo = (e.clientX / innerWidth) * 2 - 1; pyTo = (e.clientY / innerHeight) * 2 - 1; };
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function placeCamera(dt) {
    prog = damp(prog, progTo, 4, dt); px = damp(px, pxTo, 3, dt); py = damp(py, pyTo, 3, dt);
    curve.getPoint(prog, tmp); const len = tmp.length();
    const par = fine ? Math.max(0, 1 - prog / 0.3) : 0;          // pointer parallax only near the top (Kage: fades)
    tmp.x += px * 0.035 * par; tmp.z += py * 0.025 * par;
    cam.position.copy(tmp.normalize().multiplyScalar(D * len));
    cam.lookAt(0, 0, 0); cam.updateMatrixWorld();
    camUp.set(0, 1, 0).applyQuaternion(cam.quaternion); camRight.set(1, 0, 0).applyQuaternion(cam.quaternion);
  }

  // ---- labels: DOM, moved by the projected delta of their anchors
  const proj = (x, z, out) => { tmp.set(x, 0, z).project(cam); out[0] = (tmp.x + 1) / 2 * w; out[1] = (1 - tmp.y) / 2 * h; return out; };
  const xy = [0, 0];
  const follow = (el, sx, sy) => {
    const [wx, wz] = W(sx, sy); proj(wx, wz, xy);
    const dx = xy[0] - (sx / 640) * w, dy = xy[1] - (sy / 640) * h;
    const v = Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 ? "" : `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    if (el.__t3d !== v) { el.style.translate = v; el.__t3d = v; }
  };

  // ---- the frame
  let t = 0, nextWork = 2.2, mate = 0, workFrom = -1, workTo = null;
  const mates = chars.slice(1);
  function frame(dt) {
    t += dt; placeCamera(dt);
    const bobAmp = 4 * wpp;
    for (const c of chars) {
      const [wx, wz] = W(c.x, c.y);
      c.holder.position.set(wx, 0, wz).addScaledVector(camUp, c.up);
      c.holder.quaternion.copy(cam.quaternion);
      // bob: orbit.css's 6 s ease-in-out, 4 px, every other one half a cycle on
      let lift = bobAmp * (1 - Math.cos(TAU * ((t + c.ph) / 6))) / 2, sq = 1;
      if (c.jump >= 0) { const u = (t - c.jump) / 0.55; if (u >= 1) c.jump = -1; else { lift += 9 * wpp * Math.sin(Math.PI * u); sq = u > 0.85 ? 1 - 0.09 * Math.sin(Math.PI * (u - 0.85) / 0.15) : 1; } }
      c.hop.position.y = lift; c.hop.scale.set(c.size / 40 / Math.sqrt(sq), (c.size / 40) * sq, c.size / 40);
      const blink = ((t + c.ph * 1.7 + (c.emp ? 2 : 0)) % 4.6) < 0.12; c.eyes.scale.y = blink ? 0.12 : 1;
    }
    // the SVG's pulses: system -> employee, dur 2.8 + 0.6 (i mod 3) s, begin 0.7 i s
    wires.forEach(({ f, i }, k) => { const dur = 2.8 + (i % 3) * 0.6, b = 0.7 * i, p = pulses[k];
      if (t < b) { p.visible = false; return; } p.visible = true; const [sx, sy] = f(((t - b) / dur) % 1), [wx, wz] = W(sx, sy); p.position.set(wx, 0.01, wz); });
    // a teammate works: a pulse runs from the employee to it, then it hops
    if (mates.length && t >= nextWork) { workTo = mates[mate++ % mates.length]; workFrom = t; nextWork = t + 2.6 + Math.random() * 1.2; }
    if (workTo) { const u = (t - workFrom) / 0.7;
      if (u >= 1) { work.visible = false; workTo.jump = t; workTo = null; }
      else { const [ax, az] = W(emp.x, emp.y), [bx, bz] = W(workTo.x, workTo.y), e = 1 - Math.pow(1 - u, 3); work.visible = true; work.material.opacity = Math.min(1, 4 * (1 - u));
        work.position.set(ax + (bx - ax) * e, 0.01, az + (bz - az) * e); } }
    // motes drift toward the camera; respawned ahead of it when they leave the view
    if (motes.visible) { const pos = mg.attributes.position;
      for (let i = 0; i < MOTES; i++) { const j = i * 3; mpos[j + 1] += mvel[i] * dt; mpos[j] += Math.sin(t * 0.4 + i) * 0.15 * dt;
        tmp.set(mpos[j], mpos[j + 1], mpos[j + 2]).project(cam); if (mpos[j + 1] > 16 || Math.abs(tmp.x) > 1 || Math.abs(tmp.y) > 1) spawn(i, false); }
      pos.needsUpdate = true; }
    renderer.render(scene, cam);
    for (const c of chars) follow(c.el, c.x, c.y);
    for (const s of sys) follow(s.el, s.x, s.y);
    if (centreEl) follow(centreEl, 320, 320);
  }

  // ---- governor (Kage's idea: watch the frame time, step quality down; here never back up, and finally give up)
  let acc = 0, n = 0, settle = 40, level = 0;
  function govern(ms) {
    if (settle > 0) { settle--; return; }
    acc += ms; n++; if (n < 45) return;
    const mean = acc / n; acc = 0; n = 0; info.meanMs = +mean.toFixed(1);
    if (mean <= 20.5) return;                                           // ~49 fps or better: hold
    info.level = ++level; settle = 40;
    if (level === 1) pr = Math.max(1, pr0 * 0.75);
    else if (level === 2) { pr = 1; motes.visible = false; }
    else if (level === 3) pr = 0.75;
    else return stop("governor");
    renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
  }

  // ---- loop, visibility, stop
  let raf = 0, last = null, visible = true, stopped = false;
  const tick = (now) => {
    raf = 0; if (stopped || !visible || document.hidden) { last = null; return; }
    raf = requestAnimationFrame(tick);
    const ms = last === null ? 16.7 : now - last; last = now;
    frame(Math.min(0.05, ms / 1000));
    if (!info.frames++) { info.firstFrameAt = performance.now(); info.state = "running"; requestAnimationFrame(() => { fig.classList.add("t3d-on"); setTimeout(() => { const o = fig.querySelector(".o-svg"); if (o && o.pauseAnimations && fig.classList.contains("t3d-on")) o.pauseAnimations(); }, 700); }); }
    else govern(ms);
  };
  const go = () => { if (!raf && !stopped && visible && !document.hidden) raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; go(); }); io.observe(wrap);
  const onVis = () => go();
  const ro = new ResizeObserver(() => layout());
  const onScroll = () => readScroll();
  function stop(why) {
    if (stopped) return; stopped = true; info.state = "stopped:" + why;
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
    removeEventListener("scroll", onScroll); removeEventListener("pointermove", onMove); document.removeEventListener("visibilitychange", onVis);
    fig.classList.remove("t3d-on"); const o = fig.querySelector(".o-svg"); if (o && o.unpauseAnimations) o.unpauseAnimations();
    for (const el of [...chEls, ...sysEls, centreEl]) if (el) { el.style.translate = ""; el.__t3d = ""; }
    setTimeout(() => { canvas.remove(); renderer.dispose(); renderer.forceContextLoss(); }, 700);
  }
  info.stop = stop;
  canvas.addEventListener("webglcontextlost", () => stop("context-lost"));
  reduceMQ.addEventListener && reduceMQ.addEventListener("change", (e) => { if (e.matches) stop("reduced-motion"); });

  layout(); readScroll(); prog = progTo; placeCamera(0);
  for (let i = 0; i < MOTES; i++) spawn(i, true);
  addEventListener("scroll", onScroll, { passive: true }); if (fine) addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVis); ro.observe(fig);
  go();
  return "started";
}
