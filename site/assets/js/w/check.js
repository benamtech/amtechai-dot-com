/* The visitor check (Cloudflare Turnstile), in the page's own document, before the visitor's words are sent.

   Why it is here (2026-10-28): the workspace used to start the check AT the visitor's first act, inside its own shadow
   root, after the workspace had loaded from app.amtechai.com, and bounded it with its own timers. Measured in Ben's real
   Firefox, the check took 13 s after the words; in Cloudflare's analytics 33 of 35 challenges in a week were issued and
   never solved nor failed: abandoned, hidden below the workspace or torn down at 15 s. So the check starts as early as
   the visitor shows intent and the token waits for the words, not the other way round:

   - On a page with a start field (`ahead`), the first focus or keystroke in it runs the check quietly. A token goes to
     sessionStorage for /start. If Cloudflare wants a click here, the widget is let go: /start asks for it in its card.
   - On /start (`token`), a fresh stored token is used at once; otherwise the check runs from the page's load, beside the
     workspace's own load. `token()` is handed to the workspace as `el.check`; each call gives a token once (a token is
     single use), and a later call (a retried visit) runs the check again.

   No timers of ours: Turnstile retries, refreshes an expired token and times out an unanswered click itself. Only its
   error ends a wait, and its code goes to the page's analytics as visitor_check_failed. */
(() => {
  const me = document.currentScript;
  const SITEKEY = me && me.dataset.sitekey;
  if (!SITEKEY || window.amtechCheck) return;
  const KEY = 'amtech-check';
  const FRESH_MS = 270e3;                  // Cloudflare honours a token for 300 s
  const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__amtechTsReady&render=explicit';
  let api = null;
  const load = () => api || (api = new Promise((ok, no) => {
    if (window.turnstile) return ok(window.turnstile);
    window.__amtechTsReady = () => ok(window.turnstile);
    const s = document.createElement('script');
    s.src = SRC; s.async = true;
    s.onerror = () => { api = null; s.remove(); no(new Error('script blocked')); };
    document.head.appendChild(s);
  }));
  const tell = (reason) => { try { window.gtag && gtag('event', 'visitor_check_failed', { reason }); } catch (e) { /* no analytics */ } };
  const keep = (t) => { try { sessionStorage.setItem(KEY, JSON.stringify({ t, at: Date.now() })); } catch (e) { /* private mode */ } };
  const stored = () => {
    try {
      const v = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      sessionStorage.removeItem(KEY);
      return v && v.t && Date.now() - v.at < FRESH_MS ? v.t : null;
    } catch (e) { return null; }
  };

  /** A start field's page: run the check quietly once the visitor starts on the field. */
  const ahead = (field) => {
    let begun = false;
    const begin = () => {
      if (begun) return;
      begun = true;
      const box = document.createElement('div');
      box.className = 'vcheck-ahead';
      field.form.after(box);
      load().then((ts) => {
        const id = ts.render(box, {
          sitekey: SITEKEY, appearance: 'interaction-only', action: 'ahead',
          callback: keep,
          'before-interactive-callback': () => { try { ts.remove(id); } catch (e) { /* gone */ } box.remove(); },
          'error-callback': (code) => { tell(`ahead ${code}`); return true; },
        });
      }).catch(() => tell('ahead script blocked'));
    };
    field.addEventListener('focus', begin, { once: true });
    field.addEventListener('input', begin, { once: true });
  };

  /** /start: the card that holds the widget, seen only while Cloudflare asks the person for a click. */
  let card = null, slot = null, widget = null, waiting = [], token = null, failed = null, dropped = false;
  const show = (on) => {
    if (!card) return;
    card.classList.toggle('on', on);
    card.setAttribute('aria-hidden', on ? 'false' : 'true');
  };
  // A token handed to the workspace ends this widget. Left alive, Turnstile renews it every 300 s for as long as the
  // page is open, and a renewal that asks for a click put the card over the conversation (measured 2026-10-28: a
  // /start left open re-issued a challenge about every five minutes). A retried visit renders a new one.
  const spent = () => {
    if (widget === null) return;
    const id = widget;
    widget = null;
    setTimeout(() => { try { window.turnstile.remove(id); } catch (e) { /* gone */ } });   // not inside its own callback
    show(false);
  };
  const settle = (err, t) => {
    const w = waiting; waiting = [];
    if (!err) failed = null;
    if (!w.length) { if (err) failed = err; else token = t; return; }
    if (!err) spent();
    w.forEach(([ok, no]) => (err ? no(err) : ok(t)));
  };
  const run = () => load().then((ts) => {
    if (dropped) return;                     // ended before Turnstile's script arrived: nothing renders
    if (widget !== null) { ts.reset(widget); return; }
    widget = ts.render(slot, {
      sitekey: SITEKEY, appearance: 'interaction-only', action: 'start',
      callback: (t) => { show(false); settle(null, t); },
      'before-interactive-callback': () => show(true),
      'after-interactive-callback': () => show(false),
      'error-callback': (code) => { show(false); tell(`error ${code}`); settle(new Error(`error ${code}`)); return true; },
    });
  }).catch((e) => { tell(e.message); settle(e); });
  const own = (where, line) => {
    card = document.createElement('div');
    card.className = 'vcheck';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', line);
    card.setAttribute('aria-hidden', 'true');
    const p = document.createElement('p');
    p.textContent = line;
    slot = document.createElement('div');
    card.append(p, slot);
    where.appendChild(card);
    token = stored();
    if (!token) run();
  };
  /** A token for one visit. The first may already be waiting; any later one runs the check again. */
  let first = true;
  const get = () => new Promise((ok, no) => {
    dropped = false;
    if (token) { const t = token; token = null; first = false; spent(); return ok(t); }
    if (failed) { const e = failed; failed = null; first = false; return no(e); }
    waiting.push([ok, no]);
    if (!first || widget === null && !api) run();
    first = false;
  });

  /** /start, a visitor coming back: no visit will be made, so the check ends and its card never asks (walked
   *  2026-10-29: Cloudflare asked "Verify you are human" over the conversation the workspace had just reopened). */
  const drop = () => { dropped = true; spent(); token = null; };

  window.amtechCheck = { ahead, own, token: get, drop };
  document.querySelectorAll('form[data-start] input[name=business]').forEach(ahead);
})();
