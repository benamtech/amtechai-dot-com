// The Orbit's ground (lane 3D): the rings, spokes, hands and the blue wires as flat ribbons, one merged mesh with
// per-vertex RGBA, so line widths are the SVG's (in its 640-unit space) at any pixel ratio and the whole ground is one
// draw call. World units: 1 = 10 SVG units; the ground is y = 0; SVG (x, y) -> world (x, 0, y), centred.
// The wires carry an "arc" per vertex: the shader lifts them by arc x uLift, so they rise off the floor into gentle
// arcs once the camera has tilted (uLift 0 at rest: the SVG's picture).
import { BufferGeometry, Float32BufferAttribute, Mesh, MeshBasicMaterial, DoubleSide } from "three";

export const W = (x, y) => [(x - 320) / 10, (y - 320) / 10];   // SVG units -> world (x, z)
// white-after.css .ow: line rgba(10,10,10,.16), strong .34, wire rgba(15,98,254,.7) x .85; orbit.css's ring opacities
const LINE = [10 / 255, 10 / 255, 10 / 255], BLUE = [15 / 255, 98 / 255, 254 / 255], L = 0.16, S = 0.34;
// [radius, colour, alpha, width, dash, gap, shown under .oclean]
const RINGS = [[150, S * 0.9, 1.2, 0, 0, false], [166, L * 0.7, 1, 0, 0, false], [190, L * 0.8, 1, 1, 4, true], [214, S * 0.75, 1, 0, 0, true],
  [252, L * 0.5, 1, 2, 7, true], [300, L * 0.55, 1, 0, 0, true], [318, L * 0.25, 1, 0, 0, true]];

/** Quadratic wire from a system (sx, sy) to the employee (ex, ey), bowed toward the centre: orbit.mjs's path. */
export function wirePath(sx, sy, ex, ey) {
  const mx = (sx + ex) / 2, my = (sy + ey) / 2, qx = mx + (320 - mx) * 0.55, qy = my + (320 - my) * 0.55;
  const f = (t) => { const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; return [a * sx + b * qx + c * ex, a * sy + b * qy + c * ey]; };
  f.peak = Math.hypot(sx - ex, sy - ey) / 10 * 0.3;               // the arc's height in world units at full lift
  f.arc = (t) => Math.sin(Math.PI * t) * f.peak;
  return f;
}

/** Build the ground: { clean } = the .oclean variant (no r0/r1, spokes, hands); { mask } = fade the wires at the centre
 *  like the industry/department CSS mask; hands = [[x1, y1, x2, y2], ...] in SVG units. Returns the mesh. */
export function ground(wires, { clean = true, mask = false, hole = 0, hands = [] } = {}) {
  const pos = [], col = [], arc = [];
  const strip = (pts, rgb, alpha, width, dash, gap, arcs) => {
    const hw = width / 2;
    let along = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy); if (!len) continue;
      const nx = -dy / len * hw, ny = dx / len * hw, a0 = arcs ? arcs[i] : 0, a1 = arcs ? arcs[i + 1] : 0;
      const spans = [];
      if (!dash) spans.push([0, len]);
      else { const P = dash + gap; let s = 0; while (s < len) { const ph = (along + s) % P; if (ph < dash) { const e = Math.min(len, s + dash - ph); spans.push([s, e]); s = e; } else s += P - ph; } }
      for (const [s, e] of spans) {
        const ax = x0 + dx * s / len, ay = y0 + dy * s / len, bx = x0 + dx * e / len, by = y0 + dy * e / len;
        const as = a0 + (a1 - a0) * s / len, ae = a0 + (a1 - a0) * e / len;
        const q = [[ax - nx, ay - ny, as], [bx - nx, by - ny, ae], [bx + nx, by + ny, ae], [ax + nx, ay + ny, as]];
        for (const j of [0, 1, 2, 0, 2, 3]) { const [px, py, pa] = q[j], [wx, wz] = W(px, py); pos.push(wx, 0, wz); arc.push(pa); col.push(rgb[0], rgb[1], rgb[2], alpha(px, py)); }
      }
      along += len;
    }
  };
  for (const [r, a, w, d, g, inClean] of RINGS) {
    if (clean && !inClean) continue;
    const n = Math.ceil(r * 0.6), pts = Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [320 + r * Math.cos(t), 320 + r * Math.sin(t)]; });
    strip(pts, LINE, () => a, w, d, g);
  }
  // the SVG's wire alpha is .6; a 1.2-unit ribbon reads lighter than the SVG's antialiased stroke, so .7 (side by side, 1440)
  // the industry/department CSS masks .o-svg: radial transparent to 21%, opaque from 24% of the 452-unit corner radius
  // and where a medal covers the centre (hole, its radius) the wires stop at its edge, as the SVG's are hidden under it
  const r0 = Math.max(mask ? 95 : 0, hole - 4), ramp = hole ? 4 : 13.5;
  const fade = r0 ? (x, y) => 0.7 * Math.min(1, Math.max(0, (Math.hypot(x - 320, y - 320) - r0) / ramp)) : () => 0.7;
  if (!clean) {
    for (const [x1, y1, x2, y2] of hands) strip(Array.from({ length: 25 }, (_, i) => [x1 + (x2 - x1) * i / 24, y1 + (y2 - y1) * i / 24]), LINE, (x, y) => S * 0.55 * fade(x, y) / 0.7, 1.2, 0, 0);
    for (let i = 0; i < 48; i++) { const t = (i * Math.PI) / 24, c = Math.cos(t), s = Math.sin(t); strip([[320 + 150 * c, 320 + 150 * s], [320 + 166 * c, 320 + 166 * s]], LINE, () => L * 0.7, 1, 0, 0); }
  }
  for (const f of wires) { const us = Array.from({ length: 49 }, (_, i) => i / 48); strip(us.map(f), BLUE, fade, 1.2, 3, 4, us.map(f.arc)); }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(col, 4));
  g.setAttribute("arc", new Float32BufferAttribute(arc, 1));
  return new Mesh(g, groundMaterial());
}

let mat = null;
/** One shared material: the lift is a uniform (mat.userData.lift.value), so lifting the wires costs nothing per frame. */
export function groundMaterial() {
  if (mat) return mat;
  mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, depthTest: false, side: DoubleSide, forceSinglePass: true });
  const lift = { value: 0 }; mat.userData.lift = lift;
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uLift = lift;
    sh.vertexShader = "attribute float arc;\nuniform float uLift;\n" + sh.vertexShader.replace("#include <begin_vertex>", "vec3 transformed = vec3(position);\ntransformed.y += arc * uLift;");
  };
  mat.customProgramCacheKey = () => "t3d-ground";
  return mat;
}
