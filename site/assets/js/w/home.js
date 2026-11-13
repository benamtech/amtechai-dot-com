// Home (layouts/home.html): the start box's examples, and the team forming for each kind of business.
// No library. Without this file the page shows every panel's finished state under its tab's first panel.
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. The start boxes: an example fills the first box with exactly the words it shows; the placeholder walks through
// the examples until the visitor types.
const boxes = [...document.querySelectorAll("[data-hm-start] input")];
const chips = [...document.querySelectorAll(".hm-chips [data-fill]")];
chips.forEach((c) => c.addEventListener("click", () => { const i = boxes[0]; i.value = c.dataset.fill; i.dispatchEvent(new Event("input", { bubbles: true })); i.focus(); }));
boxes.forEach((a) => a.addEventListener("input", () => boxes.forEach((b) => { if (b !== a) b.value = a.value; })));
if (boxes[0] && chips.length && !REDUCE) {
  const first = boxes[0].placeholder, lines = [first, ...chips.map((c) => c.dataset.fill)]; let n = 0;
  setInterval(() => { if (document.activeElement === boxes[0] || boxes[0].value) return; n = (n + 1) % lines.length; boxes.forEach((b) => (b.placeholder = lines[n])); }, 2600);
}

// 2. The kinds: tabs (arrow keys move, as a tablist should), each panel plays once when shown, and the tabs advance by
// themselves until the visitor chooses one.
const host = document.querySelector("[data-hm-kinds]");
if (host) {
  const tabs = [...host.querySelectorAll('[role="tab"]')], panels = [...host.querySelectorAll(".hm-kind")], url = host.querySelector("[data-hm-url]");
  let cur = 0, timer = 0, typer = 0, auto = !REDUCE, seen = false;
  const type = (q) => {
    const text = q.dataset.text || (q.dataset.text = q.textContent); clearInterval(typer);
    q.textContent = ""; q.classList.add("typing"); let i = 0;
    typer = setInterval(() => { q.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(typer); setTimeout(() => q.classList.remove("typing"), 700); } }, 26);
  };
  const show = (n, play) => {
    cur = n;
    tabs.forEach((t, i) => { t.setAttribute("aria-selected", i === n); t.tabIndex = i === n ? 0 : -1; });
    panels.forEach((p, i) => { p.hidden = i !== n; p.classList.remove("play"); });
    if (url) url.textContent = panels[n].dataset.url;
    if (play && !REDUCE) { void panels[n].offsetWidth; panels[n].classList.add("play"); type(panels[n].querySelector("[data-hm-type]")); }
    clearTimeout(timer); if (auto && seen) timer = setTimeout(() => show((cur + 1) % panels.length, true), 9500);
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => { auto = false; show(i, true); });
    t.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return; e.preventDefault(); auto = false; const n = (i + d + tabs.length) % tabs.length; show(n, true); tabs[n].focus(); });
  });
  new IntersectionObserver((es, o) => { if (es.some((e) => e.isIntersecting)) { seen = true; o.disconnect(); show(0, true); } }, { threshold: 0.35 }).observe(host.querySelector(".hm-win"));
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else if (auto && seen) show(cur, false); });
}
