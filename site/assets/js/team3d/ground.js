// The Orbit's ground (lane 3D): the plain rings and the blue wires as flat ribbons on the ground plane, one merged mesh
// with per-vertex RGBA, so line widths are the SVG's (in its 640-unit space) at any pixel ratio and the whole ground is
// one draw call. World units: 1 = 10 SVG units; the ground is y = 0; SVG (x, y) -> world (x, 0, y), centred.
import { BufferGeometry, Float32BufferAttribute, Mesh, MeshBasicMaterial, DoubleSide } from "three";

export const W = (x, y) => [(x - 320) / 10, (y - 320) / 10];   // SVG units -> world (x, z)
// the w study's paint (white-after.css .ow, .oclean): line rgba(10,10,10,.16), strong .34, wire rgba(15,98,254,.7) x .85
const LINE = [10 / 255, 10 / 255, 10 / 255], BLUE = [15 / 255, 98 / 255, 254 / 255];
// rings visible under .oclean: [radius, colour, alpha, width, dash, gap] (dash 0 = solid), in SVG units
const RINGS = [[190, LINE, 0.16 * 0.8, 1, 1, 4], [214, LINE, 0.34 * 0.75, 1, 0, 0], [252, LINE, 0.16 * 0.5, 1, 2, 7], [300, LINE, 0.16 * 0.55, 1, 0, 0], [318, LINE, 0.16 * 0.25, 1, 0, 0]];

/** Quadratic wire from a system (sx, sy) to the employee (ex, ey), bowed toward the centre: orbit.mjs's path. */
export function wirePath(sx, sy, ex, ey) {
  const mx = (sx + ex) / 2, my = (sy + ey) / 2, qx = mx + (320 - mx) * 0.55, qy = my + (320 - my) * 0.55;
  return (t) => { const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; return [a * sx + b * qx + c * ex, a * sy + b * qy + c * ey]; };
}

/** Build the ground mesh: rings + wires (each wire: a path function over t in [0, 1]). */
export function ground(wires) {
  const pos = [], col = [];
  // a ribbon along a polyline of SVG points; alpha(x, y) lets the centre fade like the study's radial mask
  const strip = (pts, rgb, alpha, width, dash, gap) => {
    const hw = width / 2;
    let along = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (!L) continue;
      const nx = -dy / L * hw, ny = dx / L * hw;
      // the segment's lit spans under the dash pattern
      const spans = [];
      if (!dash) spans.push([0, L]);
      else { const P = dash + gap; let s = 0; while (s < L) { const ph = (along + s) % P; if (ph < dash) { const e = Math.min(L, s + dash - ph); spans.push([s, e]); s = e; } else s += P - ph; } }
      for (const [s, e] of spans) {
        const ax = x0 + dx * s / L, ay = y0 + dy * s / L, bx = x0 + dx * e / L, by = y0 + dy * e / L;
        const q = [[ax - nx, ay - ny], [bx - nx, by - ny], [bx + nx, by + ny], [ax + nx, ay + ny]];
        for (const j of [0, 1, 2, 0, 2, 3]) { const [px, py] = q[j], [wx, wz] = W(px, py); pos.push(wx, 0, wz); col.push(rgb[0], rgb[1], rgb[2], alpha(px, py)); }
      }
      along += L;
    }
  };
  for (const [r, rgb, a, w, d, g] of RINGS) {
    const n = Math.ceil(r * 0.6), pts = Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [320 + r * Math.cos(t), 320 + r * Math.sin(t)]; });
    strip(pts, rgb, () => a, w, d, g);
  }
  // the SVG's wire is rgba(15,98,254,.7) at opacity .85 (alpha .6); a 1.2-unit ribbon reads lighter than the SVG's
  // antialiased stroke, so it is drawn at .7 (compared side by side at 1440, 2026-10-27)
  for (const f of wires) strip(Array.from({ length: 49 }, (_, i) => f(i / 48)), BLUE, () => 0.7, 1.2, 3, 4);
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(col, 4));
  const m = new Mesh(g, new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, depthTest: false, side: DoubleSide, forceSinglePass: true }));
  m.renderOrder = 0;
  return m;
}
