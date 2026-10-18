// /investors: the deck as a viewer and the documents as reading panels. Without this script the page is every plate
// in order with its words, and each "Read it here" opens its PDF; nothing below is needed to read anything.
// Classes named here are read by Tailwind, so they exist in the CSS: border-black opacity-100 opacity-60.
(() => {
  const deck = document.querySelector('[data-deck]');
  if (deck) {
    const plates = [...deck.querySelectorAll('[data-plate]')];
    const ui = deck.querySelector('[data-deck-ui]');
    const count = deck.querySelector('[data-deck-count]');
    const prev = deck.querySelector('[data-deck-prev]');
    const next = deck.querySelector('[data-deck-next]');
    const thumbs = [...deck.querySelectorAll('[data-deck-thumb]')];
    const list = deck.querySelector('[data-deck-list]');
    let i = 0;

    const fromHash = () => {
      const k = plates.findIndex((p) => '#' + p.id === location.hash);
      return k < 0 ? 0 : k;
    };

    const show = (k, focus) => {
      i = Math.max(0, Math.min(plates.length - 1, k));
      plates.forEach((p, n) => { p.hidden = n !== i; });
      count.textContent = `${i + 1} / ${plates.length}`;
      prev.disabled = i === 0;
      next.disabled = i === plates.length - 1;
      prev.classList.toggle('opacity-60', i === 0);
      next.classList.toggle('opacity-60', i === plates.length - 1);
      thumbs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute('aria-selected', String(on));
        t.classList.toggle('border-black', on);
        t.classList.toggle('opacity-100', on);
        t.classList.toggle('opacity-60', !on);
      });
      // The next plate's large image, fetched before it is asked for.
      const after = plates[i + 1]?.querySelector('img');
      if (after) after.loading = 'eager';
      history.replaceState(null, '', i === 0 && !location.hash ? location.pathname : '#' + plates[i].id);
      if (focus) plates[i].querySelector('figure')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    list.classList.remove('space-y-16');
    ui.hidden = false;
    prev.addEventListener('click', () => show(i - 1, true));
    next.addEventListener('click', () => show(i + 1, true));
    thumbs.forEach((t, n) => t.addEventListener('click', () => show(n, true)));

    // Arrow keys move the deck while it is on screen and no panel is open.
    let inView = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.3 }).observe(deck);
    }
    document.addEventListener('keydown', (e) => {
      if (!inView || document.querySelector('dialog[open]') || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, false); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, false); }
    });

    // A horizontal swipe on the plate turns it.
    let x0 = null;
    list.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    list.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1), false);
    });

    show(fromHash(), false);
    window.addEventListener('hashchange', () => show(fromHash(), true));
  }

  // "Read it here": the document opens in a panel on this page; Escape, the close button or a click outside closes it.
  document.querySelectorAll('[data-doc-open]').forEach((a) => {
    const dialog = document.getElementById(a.dataset.docOpen);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.showModal();
      dialog.querySelector('[tabindex="0"]')?.scrollTo(0, 0);
    });
    dialog.querySelector('[data-doc-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => a.focus());
  });
})();
