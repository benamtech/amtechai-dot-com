// The shipped characters as three.js geometry (lane 3D, 2026-10-27). SHAPES, tone, shadeOf, the front-face score and the
// eye sizes are GRAPHICS's port of standard/projection/web/src/ui/characters.tsx (research/2026-10-26-the-website/
// scripts/GRAPHICS/spikes/team-world/src/main.js), kept verbatim. What is new here: the geometry is built in the
// VIEW's frame (x right, y up, z toward the viewer, in the SVG's 40-unit box, centred where the drawing is), so a
// character billboarded to the camera draws exactly the SVG's picture from any camera. Flat per-face vertex colours,
// MeshBasicMaterial: no lighting, each face keeps the SVG's tone.
import { BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, DoubleSide, Color } from "three";

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mean = (ps) => mul(ps.reduce(add, [0, 0, 0]), 1 / ps.length);
const VIEW = [1, 1, 1];
const iso = ([x, y, z]) => [(x - y) * 0.866, (x + y) * 0.5 - z];
const cuboid = ([x, y, z], [w, d, h]) => { const P = (a, b, c) => [x + a * w, y + b * d, z + c * h];
  return [[P(0,0,1),P(1,0,1),P(1,1,1),P(0,1,1)], [P(0,0,0),P(1,0,0),P(1,1,0),P(0,1,0)], [P(0,1,0),P(1,1,0),P(1,1,1),P(0,1,1)],
          [P(0,0,0),P(1,0,0),P(1,0,1),P(0,0,1)], [P(1,0,0),P(1,1,0),P(1,1,1),P(1,0,1)], [P(0,0,0),P(0,1,0),P(0,1,1),P(0,0,1)]]; };
const prismOver = (poly, z0, z1) => { const lo = poly.map(([x, y]) => [x, y, z0]), hi = poly.map(([x, y]) => [x, y, z1]);
  return [hi, lo, ...lo.map((p, i) => [p, lo[(i + 1) % lo.length], hi[(i + 1) % lo.length], hi[i]])]; };
const ngon = (n, r, rot = 0) => Array.from({ length: n }, (_, i) => { const a = rot + (i * 2 * Math.PI) / n; return [Math.cos(a) * r, Math.sin(a) * r]; });
const hull = (v, f) => f.map((ix) => ix.map((i) => v[i]));
const SHAPES = {
  prism: () => [prismOver(ngon(6, 6.5, Math.PI / 6), -5.5, 5.5)],
  wedge: () => [hull([[-6, -6, -5], [6, -6, -5], [6, 6, -5], [-6, 6, -5], [-6, -6, 5], [6, -6, 5]], [[0, 1, 2, 3], [0, 1, 5, 4], [4, 5, 2, 3], [1, 2, 5], [0, 3, 4]])],
  pyramid: () => [hull([[-6.5, -6.5, -5], [6.5, -6.5, -5], [6.5, 6.5, -5], [-6.5, 6.5, -5], [0, 0, 7.5]], [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]])],
  slab: () => [cuboid([-7.5, -6, -3], [15, 12, 6])],
  tent: () => [hull([[-7, -6, -5], [7, -6, -5], [7, 6, -5], [-7, 6, -5], [-7, 0, 5], [7, 0, 5]], [[0, 1, 2, 3], [0, 1, 5, 4], [3, 2, 5, 4], [1, 2, 5], [0, 3, 4]])],
  octa: () => [hull([[7, 0, 0], [0, 7, 0], [-7, 0, 0], [0, -7, 0], [0, 0, 8.5], [0, 0, -8.5]], [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 0, 5]])],
  frustum: () => [hull([[-7, -7, -5], [7, -7, -5], [7, 7, -5], [-7, 7, -5], [-3.6, -3.6, 5.5], [3.6, -3.6, 5.5], [3.6, 3.6, 5.5], [-3.6, 3.6, 5.5]],
    [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]])],
  lblock: () => [cuboid([-6, -6, -6], [12, 5, 5]), cuboid([-6, -1, -6], [12, 7, 5]), cuboid([-6, -1, -1], [5, 7, 8])],
  stairs: () => [cuboid([-6, -6, -6], [12, 12, 4]), cuboid([-6, -6, -2], [12, 8, 4]), cuboid([-6, -6, 2], [12, 4, 4])],
  arch: () => [cuboid([-7, -3.5, -6], [4, 7, 8]), cuboid([3, -3.5, -6], [4, 7, 8]), cuboid([-7, -3.5, 2], [14, 7, 4])],
  cross: () => [cuboid([-2.5, -7.5, -3], [5, 5, 6]), cuboid([-7.5, -2.5, -3], [5, 5, 6]), cuboid([-2.5, -2.5, -3], [5, 5, 6]), cuboid([2.5, -2.5, -3], [5, 5, 6]), cuboid([-2.5, 2.5, -3], [5, 5, 6])],
  star: () => { const R = 7.6, r = 3.2, h = 3.2, k = ngon(5, r, -Math.PI / 2 + Math.PI / 5), pts = ngon(5, R, -Math.PI / 2);
    return [prismOver(k, -h, h), ...pts.map((p, i) => prismOver([k[(i + 4) % 5], p, k[i]], -h, h))]; },
  gem: () => { const top = ngon(8, 3.8, Math.PI / 8), mid = ngon(8, 7, Math.PI / 8);
    const v = [...top.map(([x, y]) => [x, y, 4]), ...mid.map(([x, y]) => [x, y, 1.5]), [0, 0, -7]];
    const f = [[0, 1, 2, 3, 4, 5, 6, 7]]; for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; f.push([i, j, 8 + j, 8 + i]); f.push([8 + i, 8 + j, 16]); }
    return [hull(v, f)]; },
};
const tone = (hex, k) => { const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return "#" + n.map((v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))))).map((v) => v.toString(16).padStart(2, "0")).join(""); };
const shadeOf = (hex, n) => { const l = Math.hypot(...n) || 1; const [nx, ny, nz] = [n[0] / l, n[1] / l, n[2] / l];
  return tone(hex, 0.42 * Math.max(0, nz) - 0.36 * Math.max(0, nx) + 0.04 * Math.max(0, ny) - 0.2 * Math.max(0, -nz)); };
// the spike's screen basis in the solids' space (iso(R) = (1, 0), iso(U) = (0, -1))
const R = [0.57735, -0.57735, 0], U = [-1 / 3, -1 / 3, 2 / 3], TOWARD = mul([1, 1, 1], 1 / Math.sqrt(3));

/** One character: { body, eyes, eyeY } in the view frame, 40-unit box, origin at the box's centre. */
export function character(shape, hue) {
  const parts = (SHAPES[shape] || SHAPES.prism)();
  const pts = parts.flat(2).map(iso), xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const k = 33 / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  // solid space -> view frame: x = iso x, y = -iso y (up), z = depth toward the viewer; the drawing's centre sits at
  // (20, 20.5) of the SVG's box (data/characters.json bounds), so 0.5 below the box's centre
  const V = (v) => { const [ix, iy] = iso(v); return [(ix - cx) * k, -(iy - cy) * k - 0.5, (v[0] + v[1] + v[2]) * 0.7071 * k]; };
  const P = (v) => iso(v).map((t) => t * k);
  const pos = [], col = [], c3 = new Color();
  let front = null;
  const area = (f) => { const q = f.map(P); let a = 0; q.forEach((p, i) => { const r = q[(i + 1) % q.length]; a += p[0] * r[1] - r[0] * p[1]; }); return Math.abs(a) / 2; };
  for (const p of parts) { const c = mean(p.flat()); for (const f of p) {
    const fc = mean(f); let n = crs(sub(f[1], f[0]), sub(f[2], f[0])); if (dot(n, sub(fc, c)) < 0) n = mul(n, -1);
    c3.setStyle(shadeOf(hue, n));
    for (let i = 1; i < f.length - 1; i++) for (const v of [f[0], f[i], f[i + 1]]) { pos.push(...V(v)); col.push(c3.r, c3.g, c3.b); }
    if (dot(n, VIEW) > 1e-6) { const l = Math.hypot(...n); const score = (n[1] / l + 0.35 * n[0] / l + 0.25 * Math.max(0, n[2] / l)) * Math.sqrt(area(f));
      if (!front || score > front.score) front = { c: fc, n, score }; }
  } }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("color", new Float32BufferAttribute(col, 3));
  const body = new Mesh(g, new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  // eyes (the spike's): across the front face's horizontal, upright on screen, projected along the view ray onto the face
  const ew = 1.9, eh = 3.9, gap = 1.9, cS = P(front.c), d = sub(P(add(front.c, [1, 0, 0])).concat(0), cS.concat(0));
  const dl = Math.hypot(d[0], d[1]) || 1, across = [d[0] / dl, d[1] / dl], nl = Math.hypot(...front.n);
  const ec = V(add(front.c, mul(front.n, 0.08 / nl))), ep = [];
  for (const side of [-1, 1]) {
    const u = side * (gap + ew / 2), bx = across[0] * u, by = across[1] * u - eh * 0.25, ax = across[0] * ew / 2, ay = across[1] * ew / 2;
    const q = [[bx - ax, by - ay - eh / 2], [bx + ax, by + ay - eh / 2], [bx + ax, by + ay + eh / 2], [bx - ax, by - ay + eh / 2]]
      .map(([sx, sy]) => { const p0 = add(add(front.c, mul(R, sx / k)), mul(U, -sy / k));
        const t = -dot(front.n, sub(p0, front.c)) / dot(front.n, TOWARD);
        return sub(V(add(add(p0, mul(TOWARD, t)), mul(front.n, 0.08 / nl))), ec); });
    for (const i of [0, 1, 2, 0, 2, 3]) ep.push(...q[i]);
  }
  const eg = new BufferGeometry(); eg.setAttribute("position", new Float32BufferAttribute(ep, 3));
  const eyes = new Mesh(eg, new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide }));
  eyes.position.set(ec[0], ec[1], ec[2] + 0.05);
  const solid = new Group(); solid.add(body, eyes);
  return { solid, eyes };
}
