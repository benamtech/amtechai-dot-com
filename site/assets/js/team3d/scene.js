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
  Points, PointsMaterial, InstancedMesh, Matrix4, BufferGeometry, Float32BufferAttribute, Vector3, Vector2, CatmullRomCurve3, Raycaster, Plane,
} from "three";
import { character } from "./characters.js";
import { ground, groundMaterial, wirePath, W } from "./ground.js";

// the page's rules for the swap are in assets/css/w/team3d.css (in the site's bundle)
const FOV = 32, TAU = Math.PI * 2, D2R = Math.PI / 180;
// the canvas overhangs the figure (left/right 10%, top 4%, bottom 22%: the near side grows as the ring tilts back)
const ML = 0.1, MT = 0.04, MB = 0.22;
// After the swap the camera rises from straight down (the SVG's view) to a 3/4 view over INTRO s, ease-out; then the
// hero's scroll carries it along these waypoints (elevation, azimuth in degrees, distance x the fitted distance):
// a slow orbit of 22 degrees and a slight dolly in. Kage's rig, as technique: CatmullRom through hand-set stops, damped.
const WAY = [[55, 0, 1], [50, -12, 0.95], [44, -22, 0.9]], REST = 89.9, INTRO = 1.4;
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
  const medal = !!centreEl && centreEl.hasAttribute("data-t3d-centre");
  let hole = 0;                                       // the medal's radius in SVG units: wires and pulses stop under it
  if (!chEls.length || chEls.length !== team.length) return "team-mismatch";
  const info = (window.__t3d = window.__t3d || {});
  Object.assign(info, { state: "starting", frames: 0, firstFrameAt: null, level: 0, t0: performance.now() });

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
  // the halo is white-after.css's .ow .o-ch::before (the hue at 30%, 12% at 55%, gone by 72%). The SVG's grey
  // drop-shadow (0 10px 12px, .16) is not drawn: it does not read beside the halo, and it cost six draw calls
  const halo = softDisc([[0, 0.3], [0.778, 0.12], [1, 0]]), contact = softDisc([[0, 1], [0.45, 0.55], [1, 0]]);
  const unitPlane = new PlaneGeometry(1, 1);
  const chars = team.map((m, i) => {
    const el = chEls[i], c = character(m.shape, m.hue), holder = new Group(), hop = new Group();
    const h = new Mesh(unitPlane, new MeshBasicMaterial({ map: halo, color: m.hue, transparent: true, depthWrite: false, depthTest: false }));
    h.renderOrder = 1;
    // a soft contact shadow on the floor under the feet: nothing at rest (the SVG has none), up with the tilt
    const sh = new Mesh(unitPlane, new MeshBasicMaterial({ map: contact, color: 0x0a0a0a, opacity: 0, transparent: true, depthWrite: false, depthTest: false }));
    sh.rotation.x = -Math.PI / 2; sh.renderOrder = 1; scene.add(sh);
    // in the transparent list too, so the ground and halos (drawn without depth) go first and the solids on top
    // (forceSinglePass: three draws a transparent DoubleSide material in two passes, flipping .side and recompiling
    // the program's parameters twice a frame; measured 2026-10-27: 118 material updates a second each, gone with this)
    c.solid.traverse((o) => { o.renderOrder = 2; if (o.material) { o.material.transparent = true; o.material.forceSinglePass = true; } });
    hop.add(c.solid); holder.add(h, hop); scene.add(holder);
    return { el, x: pct(el, "left"), y: pct(el, "top"), holder, hop, halo: h, shadow: sh, eyes: c.eyes, emp: i === 0, ph: i % 2 ? 3 : 0, jump: -1 };
  });
  const emp = chars[0];
  const sys = sysEls.map((el) => ({ el, x: pct(el, "left"), y: pct(el, "top") }));
  // the home Orbit is "ow oclean" (no r0/r1, spokes, hands); the industry and department Orbits are "ow" and their CSS
  // masks the SVG's centre under the medal: read both from the page, so the ground draws what the SVG draws
  const clean = fig.classList.contains("oclean"), svgEl = fig.querySelector(".o-svg"), svgCS = svgEl && getComputedStyle(svgEl);
  const mask = !!svgCS && [svgCS.maskImage, svgCS.webkitMaskImage].some((m) => m && m !== "none");

  // ---- the ground (rings + wires) and the pulses: rebuilt in layout() because phones hide some systems
  let groundMesh = null, wires = [];
  const pulseGeo = new CircleGeometry(0.34, 20); pulseGeo.rotateX(-Math.PI / 2);
  const pulseMat = new MeshBasicMaterial({ color: 0x0f62fe, transparent: true, depthWrite: false, depthTest: false });
  const pulses = new InstancedMesh(pulseGeo, pulseMat, 12); pulses.renderOrder = 1; pulses.count = 0; pulses.frustumCulled = false; scene.add(pulses);
  const pm = new Matrix4(), hidden = new Matrix4().makeScale(0, 0, 0);
  const work = new Mesh(pulseGeo, pulseMat.clone()); work.renderOrder = 1; work.visible = false; scene.add(work);

  // ---- motes, respawned in the cone ahead of the camera
  const MOTES = 36, mpos = new Float32Array(MOTES * 3), mvel = new Float32Array(MOTES);
  const mg = new BufferGeometry(); mg.setAttribute("position", new Float32BufferAttribute(mpos, 3));
  const motes = new Points(mg, new PointsMaterial({ map: softDisc([[0, 1], [0.6, 0.8], [1, 0]]), color: 0x9db4f0, size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0.45, depthWrite: false, depthTest: false }));
  motes.renderOrder = 1; motes.frustumCulled = false; scene.add(motes);
  const ray = new Raycaster(), ndc = new Vector2(), hit = new Vector3(), plane = new Plane(new Vector3(0, 1, 0), 0);
  const spawn = (i, anywhere) => {
    ndc.set(Math.random() * 1.8 - 0.9, Math.random() * 1.8 - 0.9); ray.setFromCamera(ndc, cam);
    plane.constant = -(anywhere ? Math.random() * 14 : Math.random() * 3);
    if (!ray.ray.intersectPlane(plane, hit)) hit.set(0, 0, 0);
    mpos.set([hit.x, hit.y, hit.z], i * 3); mvel[i] = 0.5 + Math.random() * 0.7;
  };

  // ---- layout: sizes in px -> world (the figure maps the SVG's 640 units; world = SVG / 10)
  let w = 0, h = 0, cw = 0, ch = 0, wpp = 0, D = 0, relabel = true;
  const camUp = new Vector3(), camRight = new Vector3(), tmp = new Vector3();
  function layout() {
    w = fig.clientWidth; h = fig.clientHeight; if (!w || !h) return;
    cw = w * (1 + 2 * ML); ch = h * (1 + MT + MB);
    renderer.setSize(cw, ch, false);
    wpp = 64 / h;                                  // world units per CSS px at the ground, at rest
    // the camera is centred on the figure: a full view symmetric about its centre, the canvas a window of it
    const fh = h * (1 + 2 * MB), t = Math.tan((FOV / 2) * D2R);
    D = 32 / t; cam.fov = 2 * Math.atan(t * fh / h) / D2R; cam.aspect = cw / fh;
    cam.setViewOffset(cw, fh, 0, (MB - MT) * h, cw, ch); cam.updateProjectionMatrix(); relabel = true;
    for (const c of chars) {
      const svg = c.el.querySelector("svg"), cs = svg ? getComputedStyle(svg) : null;
      const sz = cs ? parseFloat(cs.width) : 64, H = c.el.offsetHeight;
      c.size = sz * wpp; c.up = (0.58 * H - sz / 2) * wpp;             // the drawing's centre, above the anchor
      c.hop.scale.setScalar(c.size / 40);
      const hs = sz * 1.75 * wpp; c.halo.scale.set(hs, hs, 1); c.halo.position.set(0, (-0.14 * H - (-0.58 * H + sz / 2)) * -wpp, -0.1);
    }
    // wires: only to systems the page shows (phones hide the 3 and 9 o'clock ones)
    const live = sys.filter((s) => getComputedStyle(s.el).display !== "none");
    wires = live.map((s) => ({ s, f: wirePath(s.x, s.y, emp.x, emp.y), i: sys.indexOf(s) }));
    if (groundMesh) { scene.remove(groundMesh); groundMesh.geometry.dispose(); }
    hole = medal ? (centreEl.offsetWidth / 2 / w) * 640 : 0;
    groundMesh = ground(wires.map((x) => x.f), { clean, mask, hole, hands: chars.slice(1).map((c) => [emp.x, emp.y, c.x, c.y]) }); scene.add(groundMesh);
    pulses.count = Math.min(12, wires.length);
  }

  // ---- the rig
  const curve = new CatmullRomCurve3(WAY.map(([e, a, d]) => new Vector3(e, a, d)), false, "catmullrom", 0.42);
  let prog = 0, progTo = 0, px = 0, py = 0, pxTo = 0, pyTo = 0, introAt = Infinity, iu = 0;
  const readScroll = () => { const r = wrap.getBoundingClientRect(), top = r.top + scrollY; progTo = clamp(scrollY / Math.max(1, top + r.height * 0.6), 0, 1); };
  const onMove = (e) => { pxTo = (e.clientX / innerWidth) * 2 - 1; pyTo = (e.clientY / innerHeight) * 2 - 1; };
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;   // parallax on a desktop pointer, never on touch
  const wp = new Vector3(), lastCam = new Vector3(NaN, 0, 0);
  let moved = true;
  function placeCamera(dt) {
    prog = damp(prog, progTo, 3.2, dt); px = damp(px, pxTo, 2.4, dt); py = damp(py, pyTo, 2.4, dt);
    const u = clamp((t - introAt) / INTRO, 0, 1); iu = 1 - Math.pow(1 - u, 3);           // ease-out cubic
    curve.getPoint(prog, wp);
    const el = (REST + (wp.x - REST) * iu - py * 2.5 * iu) * D2R, az = (wp.y + px * 4) * iu * D2R, d = D * (1 + (wp.z - 1) * iu);
    tmp.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)).multiplyScalar(d);
    moved = !dt || tmp.distanceToSquared(lastCam) > 1e-8 || !(lastCam.x === lastCam.x); lastCam.copy(tmp);
    if (!moved) return;
    cam.position.copy(tmp); cam.lookAt(0, 0, 0); cam.updateMatrixWorld();
    camUp.set(0, 1, 0).applyQuaternion(cam.quaternion); camRight.set(1, 0, 0).applyQuaternion(cam.quaternion);
    groundMaterial().userData.lift.value = iu;                                             // the wires rise into arcs
  }

  // ---- labels: DOM, moved by the projected delta of their anchors
  const proj = (x, z, out) => { tmp.set(x, 0, z).project(cam); out[0] = (tmp.x + 1) / 2 * cw - ML * w; out[1] = (1 - tmp.y) / 2 * ch - MT * h; return out; };
  const xy = [0, 0];
  const follow = (el, sx, sy) => {
    const [wx, wz] = W(sx, sy); proj(wx, wz, xy);
    const dx = xy[0] - (sx / 640) * w, dy = xy[1] - (sy / 640) * h;
    const v = Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 ? "" : `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    if (el.__t3d !== v) { el.style.translate = v; el.__t3d = v; }
  };

  // the centre: "Your business" follows the ring's centre; a medal (data-t3d-centre) sits on ring r0 (150 units), so it
  // follows the middle of r0's projected near and far points and scales to r0's projected depth, never covering the
  // team as the ring tilts (scale and translate are transforms: no reflow)
  const q1 = [0, 0], q2 = [0, 0];
  function centre() {
    if (!medal) return follow(centreEl, 320, 320);
    proj(0, -15, q1); proj(0, 15, q2);
    const dx = (q1[0] + q2[0]) / 2 - w / 2, dy = (q1[1] + q2[1]) / 2 - h / 2, k = (q2[1] - q1[1]) / (h * 300 / 640);
    const v = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`, sc = Math.abs(k - 1) < 0.002 ? "" : k.toFixed(3);
    if (centreEl.__t3d !== v + sc) { centreEl.style.translate = v; centreEl.style.scale = sc; centreEl.__t3d = v + sc; }
  }

  // ---- the frame
  let t = 0, nextWork = 2.2, mate = 0, workFrom = -1, workTo = null;
  const mates = chars.slice(1), feet = new Vector3();
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
      // contact shadow: where the ray from the camera through the drawing's feet meets the floor; smaller in a hop
      if (iu > 0) {
        feet.copy(c.holder.position).addScaledVector(camUp, -0.42 * c.size).sub(cam.position);
        const k = -cam.position.y / feet.y; c.shadow.position.copy(cam.position).addScaledVector(feet, k); c.shadow.position.y = 0.02;
        const hopK = 1 - Math.min(0.35, (lift / wpp) / 30), sw = c.size * 0.95 * hopK;
        c.shadow.scale.set(sw, sw * 0.62, 1); c.shadow.material.opacity = 0.28 * iu * hopK;
        c.halo.material.opacity = 1 - 0.6 * iu;
      }
      c.shadow.visible = iu > 0;
    }
    // the SVG's pulses: system -> employee, dur 2.8 + 0.6 (i mod 3) s, begin 0.7 i s
    for (let k = 0; k < pulses.count; k++) { const { f, i } = wires[k], dur = 2.8 + (i % 3) * 0.6, b = 0.7 * i;
      if (t < b) { pulses.setMatrixAt(k, hidden); continue; } const u = ((t - b) / dur) % 1, [sx, sy] = f(u), [wx, wz] = W(sx, sy); if (hole && Math.hypot(sx - 320, sy - 320) < hole) { pulses.setMatrixAt(k, hidden); continue; } pulses.setMatrixAt(k, pm.makeTranslation(wx, 0.01 + f.arc(u) * iu, wz)); }
    pulses.instanceMatrix.needsUpdate = true;
    // a teammate works: a pulse runs from the employee to it, then it hops
    if (mates.length && t >= nextWork) { workTo = mates[mate++ % mates.length]; workFrom = t; nextWork = t + 2.6 + Math.random() * 1.2; }
    if (workTo) { const u = (t - workFrom) / 0.7;
      if (u >= 1) { work.visible = false; workTo.jump = t; workTo = null; }
      else { const [ax, az] = W(emp.x, emp.y), [bx, bz] = W(workTo.x, workTo.y), e = 1 - Math.pow(1 - u, 3); work.material.opacity = Math.min(1, 4 * (1 - u));
        work.position.set(ax + (bx - ax) * e, 0.01, az + (bz - az) * e); work.visible = !hole || Math.hypot(work.position.x, work.position.z) * 10 > hole; } }
    // motes drift toward the camera; respawned ahead of it when they leave the view
    if (motes.visible) { const pos = mg.attributes.position;
      for (let i = 0; i < MOTES; i++) { const j = i * 3; mpos[j + 1] += mvel[i] * dt; mpos[j] += Math.sin(t * 0.4 + i) * 0.15 * dt;
        tmp.set(mpos[j], mpos[j + 1], mpos[j + 2]).project(cam); if (mpos[j + 1] > 16 || Math.abs(tmp.x) > 1 || Math.abs(tmp.y) > 1) spawn(i, false); }
      pos.needsUpdate = true; }
    renderer.render(scene, cam);
    if (moved || relabel) { relabel = false; for (const c of chars) follow(c.el, c.x, c.y); for (const s of sys) follow(s.el, s.x, s.y); if (centreEl) centre(); }
  }

  // ---- governor (Kage's idea: watch the frame time, step quality down; here never back up, and finally give up)
  // a sample is capped at 50 ms, so one stall (a screenshot, a GC, the page's own work) cannot condemn the scene.
  // Over ~49 fps: hold. Slower: a step after two windows of 40 frames, after one when under 36 fps; under 22 fps:
  // stop at once. The steps: lower pixel ratio (only where it is above 1), then no motes at ratio 1, then 0.75, then stop.
  const steps = [...(pr0 > 1 ? [() => { pr = Math.max(1, pr0 * 0.75); }] : []), () => { pr = 1; motes.visible = false; }, () => { pr = 0.75; }];
  let acc = 0, n = 0, settle = 30, level = 0, slow = 0;
  function govern(ms) {
    if (settle > 0) { settle--; return; }
    acc += Math.min(ms, 50); n++; if (n < 40) return;
    const mean = acc / n; acc = 0; n = 0; info.meanMs = +mean.toFixed(1);
    if (mean <= 20.5) { slow = 0; return; }
    if (mean > 45) return stop("governor");
    if (++slow < (mean > 28 ? 1 : 2)) return;
    slow = 0; info.level = ++level; settle = 30;
    if (level > steps.length) return stop("governor");
    steps[level - 1](); renderer.setPixelRatio(pr); renderer.setSize(cw, ch, false);
  }

  // ---- loop, visibility, stop
  let raf = 0, last = null, visible = true, stopped = false;
  const tick = (now) => {
    raf = 0; if (stopped || !visible || document.hidden) { last = null; return; }
    raf = requestAnimationFrame(tick);
    const ms = last === null ? 16.7 : now - last; last = now;
    frame(Math.min(0.05, ms / 1000));
    if (!info.frames++) { info.firstFrameAt = performance.now(); info.state = "running"; introAt = t + 0.7; requestAnimationFrame(() => { fig.classList.add("t3d-on"); if (medal && centreEl.getAttribute("data-t3d-centre") !== "behind") fig.classList.add("t3d-front"); setTimeout(() => { const o = fig.querySelector(".o-svg"); if (o && o.pauseAnimations && fig.classList.contains("t3d-on")) o.pauseAnimations(); }, 700); }); }
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
    fig.classList.remove("t3d-on", "t3d-front"); const o = fig.querySelector(".o-svg"); if (o && o.unpauseAnimations) o.unpauseAnimations();
    for (const el of [...chEls, ...sysEls, centreEl]) if (el) { el.style.translate = ""; el.style.scale = ""; el.__t3d = ""; }
    setTimeout(() => { canvas.remove(); renderer.dispose(); renderer.forceContextLoss(); }, 700);
  }
  info.stop = stop; if (/[?&]t3ddebug/.test(location.search)) info.three = { renderer, scene, cam };
  canvas.addEventListener("webglcontextlost", () => stop("context-lost"));
  reduceMQ.addEventListener && reduceMQ.addEventListener("change", (e) => { if (e.matches) stop("reduced-motion"); });

  layout(); readScroll(); prog = progTo; placeCamera(0);
  for (let i = 0; i < MOTES; i++) spawn(i, true);
  addEventListener("scroll", onScroll, { passive: true }); if (fine) addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVis); ro.observe(fig);
  go();
  return "started";
}
