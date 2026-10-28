// /investors: the deck one plate at a time with a full-screen view, and the documents opened on the page. Without
// this script the page is every plate in order and each "Read" opens its PDF; nothing below is needed to read anything.
(() => {
  const deck = document.querySelector('[data-deck]');
  if (deck) {
    const plates = [...deck.querySelectorAll('[data-plate]')];
    const list = deck.querySelector('[data-deck-list]');
    const ui = deck.querySelector('[data-deck-ui]');
    const count = deck.querySelector('[data-deck-count]');
    const prev = deck.querySelector('[data-deck-prev]');
    const next = deck.querySelector('[data-deck-next]');
    const full = deck.querySelector('[data-deck-full]');
    const fullImg = deck.querySelector('[data-deck-full-img]');
    const fullCount = deck.querySelector('[data-deck-full-count]');
    const fullPrev = deck.querySelector('[data-deck-full-prev]');
    const fullNext = deck.querySelector('[data-deck-full-next]');
    const last = plates.length - 1;
    let i = 0;
    let inView = false;
    let opener = null;

    const img = (k) => plates[k].querySelector('img');
    const isFull = () => !full.hidden;

    const show = (k) => {
      i = Math.max(0, Math.min(last, k));
      plates.forEach((p, n) => { p.hidden = n !== i; });
      const label = `${i + 1} / ${plates.length}`;
      count.textContent = label;
      fullCount.textContent = label;
      prev.disabled = fullPrev.disabled = i === 0;
      next.disabled = fullNext.disabled = i === last;
      if (isFull()) {
        fullImg.src = img(i).dataset.full;
        fullImg.alt = img(i).alt;
      }
      // Fetch the next plate before it is asked for.
      if (i < last) {
        img(i + 1).loading = 'eager';
        if (isFull()) new Image().src = img(i + 1).dataset.full;
      }
      history.replaceState(null, '', i === 0 ? location.pathname : '#' + plates[i].id);
    };

    const openFull = (from) => {
      opener = from || document.activeElement;
      full.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      show(i);
      // The browser's own full screen where it has one (not on iPhone); the black view works either way.
      if (full.requestFullscreen && document.fullscreenEnabled) full.requestFullscreen().catch(() => {});
      fullNext.focus();
    };
    const closeFull = () => {
      if (!isFull()) return;
      full.hidden = true;
      document.documentElement.style.overflow = '';
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      opener?.focus();
    };

    list.classList.add('iv-one');
    ui.hidden = false;
    prev.addEventListener('click', () => show(i - 1));
    next.addEventListener('click', () => show(i + 1));
    fullPrev.addEventListener('click', () => show(i - 1));
    fullNext.addEventListener('click', () => show(i + 1));
    deck.querySelector('[data-deck-full-close]').addEventListener('click', closeFull);
    deck.querySelectorAll('[data-deck-open]').forEach((b) => b.addEventListener('click', () => openFull(b)));
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) closeFull(); });

    // In full screen: a tap on the left third goes back, anywhere else goes forward.
    deck.querySelector('[data-deck-full-stage]').addEventListener('click', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      show(i + (e.clientX - r.left < r.width / 3 ? -1 : 1));
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.3 }).observe(list);
    }
    document.addEventListener('keydown', (e) => {
      if (document.querySelector('dialog[open]') || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isFull() && e.key === 'Escape') { closeFull(); return; }
      if (!isFull() && !inView) return;
      if (e.key === 'ArrowRight' || (isFull() && e.key === ' ')) { e.preventDefault(); show(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    });

    // A horizontal swipe turns the plate, on the page and in full screen.
    let x0 = null;
    const start = (e) => { x0 = e.touches[0].clientX; };
    const end = (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) { e.preventDefault(); show(i + (dx < 0 ? 1 : -1)); }
    };
    [list, full].forEach((el) => {
      el.addEventListener('touchstart', start, { passive: true });
      el.addEventListener('touchend', end);
    });

    const fromHash = () => Math.max(0, plates.findIndex((p) => '#' + p.id === location.hash));
    show(fromHash());
    window.addEventListener('hashchange', () => show(fromHash()));
  }

  // "Read": the document opens in a panel on this page; Escape, the close button or a click outside closes it.
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
