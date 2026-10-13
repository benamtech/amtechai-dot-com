// What the React shell did on every page, without it: the navbar's scroll state and mobile menu, and the
// fade-up each section made as it came into view (framer-motion: 24 px, 1 s, ease [0.16, 1, 0.3, 1], once,
// 60 px inside the viewport). Classes named here are read by Tailwind, so they exist in the CSS.
(() => {
  const bar = document.querySelector('[data-nav-bar]');
  if (bar) {
    const set = () => {
      const on = window.scrollY > 20;
      bar.classList.toggle('bg-white/86', on);
      bar.classList.toggle('bg-white/72', !on);
    };
    set();
    window.addEventListener('scroll', set, { passive: true });
  }

  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (toggle && menu) {
    const closed = toggle.querySelector('[data-when-closed]');
    const open = toggle.querySelector('[data-when-open]');
    let shown = false;
    toggle.addEventListener('click', () => {
      shown = !shown;
      toggle.setAttribute('aria-expanded', String(shown));
      closed.toggleAttribute('hidden', shown);
      open.toggleAttribute('hidden', !shown);
      if (shown) {
        menu.hidden = false;
        menu.getBoundingClientRect();
        menu.classList.add('menu-in');
      } else {
        menu.classList.remove('menu-in');
        menu.addEventListener('transitionend', () => { if (!shown) menu.hidden = true; }, { once: true });
      }
    });
  }

  // An article's Copy prompt button: copies the prompt as written.
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const text = btn.closest('section')?.querySelector('[data-copy-text]');
    if (!text || !navigator.clipboard) return;
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(text.textContent);
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy prompt'; }, 1600);
    });
  });

  const fades = document.querySelectorAll('[data-fade]');
  if (!('IntersectionObserver' in window)) { fades.forEach((el) => el.classList.add('in')); return; }
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); }
  }, { rootMargin: '-60px' });
  fades.forEach((el) => seen.observe(el));
})();
