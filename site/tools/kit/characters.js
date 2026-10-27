const hash = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
const tone = (hex, k) => {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return "#" + n.map((v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))))).map((v) => v.toString(16).padStart(2, "0")).join("");
};
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mean = (ps) => mul(ps.reduce(add, [0, 0, 0]), 1 / ps.length);
const VIEW = [1, 1, 1];
const iso = ([x, y, z]) => [(x - y) * 0.866, (x + y) * 0.5 - z];
const cuboid = ([x, y, z], [w, d, h]) => {
  const P = (a, b, c) => [x + a * w, y + b * d, z + c * h];
  return [
    [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)],
    [P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)],
    [P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)],
    [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)],
    [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)],
    [P(0, 0, 0), P(0, 1, 0), P(0, 1, 1), P(0, 0, 1)]
  ];
};
const prismOver = (poly, z0, z1) => {
  const lo = poly.map(([x, y]) => [x, y, z0]), hi = poly.map(([x, y]) => [x, y, z1]);
  return [hi, lo, ...lo.map((p, i) => [p, lo[(i + 1) % lo.length], hi[(i + 1) % lo.length], hi[i]])];
};
const ngon = (n, r, rot = 0) => Array.from({ length: n }, (_, i) => {
  const a = rot + i * 2 * Math.PI / n;
  return [Math.cos(a) * r, Math.sin(a) * r];
});
const hull = (v, f) => f.map((ix) => ix.map((i) => v[i]));
const SHAPES = {
  prism: () => [prismOver(ngon(6, 6.5, Math.PI / 6), -5.5, 5.5)],
  wedge: () => [hull([[-6, -6, -5], [6, -6, -5], [6, 6, -5], [-6, 6, -5], [-6, -6, 5], [6, -6, 5]], [[0, 1, 2, 3], [0, 1, 5, 4], [4, 5, 2, 3], [1, 2, 5], [0, 3, 4]])],
  pyramid: () => [hull([[-6.5, -6.5, -5], [6.5, -6.5, -5], [6.5, 6.5, -5], [-6.5, 6.5, -5], [0, 0, 7.5]], [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]])],
  slab: () => [cuboid([-7.5, -6, -3], [15, 12, 6])],
  tent: () => [hull([[-7, -6, -5], [7, -6, -5], [7, 6, -5], [-7, 6, -5], [-7, 0, 5], [7, 0, 5]], [[0, 1, 2, 3], [0, 1, 5, 4], [3, 2, 5, 4], [1, 2, 5], [0, 3, 4]])],
  octa: () => [hull([[7, 0, 0], [0, 7, 0], [-7, 0, 0], [0, -7, 0], [0, 0, 8.5], [0, 0, -8.5]], [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 0, 5]])],
  frustum: () => [hull(
    [[-7, -7, -5], [7, -7, -5], [7, 7, -5], [-7, 7, -5], [-3.6, -3.6, 5.5], [3.6, -3.6, 5.5], [3.6, 3.6, 5.5], [-3.6, 3.6, 5.5]],
    [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
  )],
  lblock: () => [cuboid([-6, -6, -6], [12, 5, 5]), cuboid([-6, -1, -6], [12, 7, 5]), cuboid([-6, -1, -1], [5, 7, 8])],
  stairs: () => [cuboid([-6, -6, -6], [12, 12, 4]), cuboid([-6, -6, -2], [12, 8, 4]), cuboid([-6, -6, 2], [12, 4, 4])],
  arch: () => [cuboid([-7, -3.5, -6], [4, 7, 8]), cuboid([3, -3.5, -6], [4, 7, 8]), cuboid([-7, -3.5, 2], [14, 7, 4])],
  cross: () => [cuboid([-2.5, -7.5, -3], [5, 5, 6]), cuboid([-7.5, -2.5, -3], [5, 5, 6]), cuboid([-2.5, -2.5, -3], [5, 5, 6]), cuboid([2.5, -2.5, -3], [5, 5, 6]), cuboid([-2.5, 2.5, -3], [5, 5, 6])],
  star: () => {
    const R = 7.6, r = 3.2, h = 3.2, k = ngon(5, r, -Math.PI / 2 + Math.PI / 5), pts = ngon(5, R, -Math.PI / 2);
    return [prismOver(k, -h, h), ...pts.map((p, i) => prismOver([k[(i + 4) % 5], p, k[i]], -h, h))];
  },
  gem: () => {
    const top = ngon(8, 3.8, Math.PI / 8), mid = ngon(8, 7, Math.PI / 8);
    const v = [...top.map(([x, y]) => [x, y, 4]), ...mid.map(([x, y]) => [x, y, 1.5]), [0, 0, -7]];
    const f = [[0, 1, 2, 3, 4, 5, 6, 7]];
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8;
      f.push([i, j, 8 + j, 8 + i]);
      f.push([8 + i, 8 + j, 16]);
    }
    return [hull(v, f)];
  }
};
const SHAPE_NAMES = Object.keys(SHAPES);
const CHAR_HUES = ["#0F9488", "#7C5CD6", "#C8810E", "#2F9E5A", "#A3479C", "#0E7490", "#9A6B2F", "#5E6B7D", "#6E8B3D"];
const mix32 = (s) => {
  let h = hash(s);
  h ^= h >>> 16;
  h = Math.imul(h, 2146121005);
  h ^= h >>> 15;
  h = Math.imul(h, 2221713035);
  h ^= h >>> 16;
  return h >>> 0;
};
const characterOf = (seed) => ({ shape: SHAPE_NAMES[mix32(seed + "#shape") % SHAPE_NAMES.length], hue: CHAR_HUES[mix32(seed + "#hue") % CHAR_HUES.length] });
const shadeOf = (hex, n) => {
  const l = Math.hypot(...n) || 1;
  const [nx, ny, nz] = [n[0] / l, n[1] / l, n[2] / l];
  return tone(hex, 0.42 * Math.max(0, nz) - 0.36 * Math.max(0, nx) + 0.04 * Math.max(0, ny) - 0.2 * Math.max(0, -nz));
};
const DRAWN = /* @__PURE__ */ new Map();
function drawing(shape, hue, size, plinth) {
  const key = `${shape}|${hue}|${size}|${plinth ? 1 : 0}`;
  const kept = DRAWN.get(key);
  if (kept) return kept;
  const parts = SHAPES[shape]();
  const order = parts.map((p) => ({ p, c: mean(p.flat()) })).sort((a, b) => dot(a.c, VIEW) - dot(b.c, VIEW));
  const shown = [];
  for (const { p, c } of order) for (const f of p) {
    const fc = mean(f);
    let n = crs(sub(f[1], f[0]), sub(f[2], f[0]));
    if (dot(n, sub(fc, c)) < 0) n = mul(n, -1);
    if (dot(n, VIEW) > 1e-6) shown.push({ f, n, c: fc });
  }
  const pts = parts.flat(2).map(iso), xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const tall = plinth && size >= 24, fit = tall ? 27 : plinth ? 31 : 33, mid = tall ? 17 : plinth ? 19 : 20.5;
  const k = fit / Math.max(x1 - x0, y1 - y0), ox = 20 - (x0 + x1) / 2 * k, oy = mid - (y0 + y1) / 2 * k;
  const P = (v) => {
    const [a, b] = iso(v);
    return [ox + a * k, oy + b * k];
  };
  const poly = (f) => f.map((v) => P(v).map((t) => t.toFixed(2)).join(",")).join(" ");
  const area = (f) => {
    const q = f.map(P);
    let a = 0;
    q.forEach((p, i) => {
      const r = q[(i + 1) % q.length];
      a += p[0] * r[1] - r[0] * p[1];
    });
    return Math.abs(a) / 2;
  };
  const front = shown.reduce((best, s) => {
    const l = Math.hypot(...s.n);
    const score = (s.n[1] / l + 0.35 * s.n[0] / l + 0.25 * Math.max(0, s.n[2] / l)) * Math.sqrt(area(s.f));
    return !best || score > best.score ? { s, score } : best;
  }, null).s;
  const [cx, cy] = P(front.c), across = (() => {
    const d = sub(P(add(front.c, [1, 0, 0])), P(front.c));
    const l = Math.hypot(d[0], d[1]) || 1;
    return [d[0] / l, d[1] / l];
  })();
  const u = 40 / size, small = size <= 28;
  const ew = Math.max(small ? 2.4 : 1.9, 1.5 * u), eh = Math.max(small ? 4.6 : 3.9, 2.5 * u), gap = Math.max(small ? 1.7 : 1.9, u);
  const eye = (side) => {
    const u2 = side * (gap + ew / 2);
    const bx = cx + across[0] * u2, by = cy + across[1] * u2 - eh * 0.25;
    const ax = across[0] * ew / 2, ay = across[1] * ew / 2;
    return [[bx - ax, by - ay - eh / 2], [bx + ax, by + ay - eh / 2], [bx + ax, by + ay + eh / 2], [bx - ax, by - ay + eh / 2]].map((q) => q.map((t) => t.toFixed(2)).join(",")).join(" ");
  };
  const out = { faces: shown.map((s) => ({ points: poly(s.f), fill: shadeOf(hue, s.n) })), eyes: [eye(-1), eye(1)] };
  DRAWN.set(key, out);
  return out;
}
function characterSVG({ shape, hue, size = 64, plinth = false, seed = "" }) {
  const named = characterOf(seed);
  const s = shape && SHAPES[shape] ? shape : named.shape, h = hue || named.hue;
  const d = drawing(s, h, size, !!plinth);
  let o = `<svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">`;
  if (plinth && size < 24) o += `<line x1="7" y1="38.4" x2="33" y2="38.4" stroke="#B3B3BA" stroke-width="${40 / size}" stroke-linecap="round"/>`;
  if (plinth && size >= 24) o += `<g><polygon points="6,32.6 20,38.2 20,39.7 6,34.1" fill="#C9C9CF"/><polygon points="20,38.2 34,32.6 34,34.1 20,39.7" fill="#B3B3BA"/><polygon points="6,32.6 20,27 34,32.6 20,38.2" fill="#E4E4E8"/></g>`;
  for (const f of d.faces) o += `<polygon points="${f.points}" fill="${f.fill}" stroke="${f.fill}" stroke-width="0.3" stroke-linejoin="round"/>`;
  return o + `<polygon points="${d.eyes[0]}" fill="#FFFFFF"/><polygon points="${d.eyes[1]}" fill="#FFFFFF"/></svg>`;
}
export {
  CHAR_HUES,
  SHAPES,
  SHAPE_NAMES,
  characterOf,
  characterSVG,
  mix32,
  tone
};
