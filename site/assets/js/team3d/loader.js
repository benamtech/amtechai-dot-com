// team3d loader (lane 3D, 2026-10-27): decides whether the hero's 3D team may run, and only then fetches it.
// Runs after `load`, then idle. Bails (the SVG Orbit stays) on: reduced motion, Save-Data, no WebGL2, a software
// renderer, or a context with a major performance caveat. Imports the scene only once its Orbit is in view.
// The partial (layouts/_partials/team3d.html) emits <script type="application/json" data-t3d="scene URL">.
const why = (r) => { window.__t3d = Object.assign(window.__t3d || {}, { reason: r }); };
function run() {
  const tag = document.querySelector("script[data-t3d]"), wrap = tag && tag.parentElement;
  if (!wrap) return why("no-host");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return why("reduced-motion");
  if ((navigator.connection || {}).saveData) return why("save-data");
  const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  if (!gl) return why("no-webgl2");
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  const lose = gl.getExtension("WEBGL_lose_context"); lose && lose.loseContext();
  window.__t3d = { gl: r };
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r)) return why("software");
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect(); why("loading");
    import(tag.dataset.t3d).then((m) => why(m.start(wrap, JSON.parse(tag.textContent)))).catch((e) => why("error: " + e));
  });
  io.observe(wrap);
}
const idle = () => (window.requestIdleCallback || ((f) => setTimeout(f, 1)))(run, { timeout: 2500 });
document.readyState === "complete" ? idle() : addEventListener("load", idle, { once: true });
