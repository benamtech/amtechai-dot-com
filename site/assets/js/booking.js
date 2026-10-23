// The booking page, as src/pages/ScheduleDemo.tsx and src/components/schedule/ did it, without React. Every class
// string is the component's own, written out here so Tailwind generates it.
(() => {
  const C = window.BOOKING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const state = { step: 0, name: '', email: '', organization: '', industry: '', topic: '', date: null, time: '', booked: [], loading: false, submitting: false };

  // ---- dates and slots ----
  // Ben's real availability, in Eastern Time (he works on the East coast; the page quoted Pacific and offered a flat
  // five slots a day until 2026-10-23). [opens, closes] per weekday, minutes after midnight; Sunday is closed. A slot
  // lasts SLOT minutes and has to END by closing, so the last one starts half an hour before closing.
  // THE PLATFORM HOLDS THE SAME SCHEDULE: standard/platform/setup_call.py HOURS in ai-employee-v2 refuses (400) any
  // time this file does not list. Change the two together, platform first.
  const HOURS = { 0: null, 1: [630, 1020], 2: [600, 810], 3: [570, 870], 4: [630, 900], 5: [660, 1200], 6: [660, 900] };
  const SLOT = 30;
  const clock = (m) => { const h = Math.floor(m / 60), ap = h < 12 ? 'AM' : 'PM'; return `${h % 12 === 0 ? 12 : h % 12}:${String(m % 60).padStart(2, '0')} ${ap}`; };
  const fmtSlot = (m) => `${clock(m)} ET`;
  const slotsFor = (d) => {
    const w = HOURS[d.getDay()];
    if (!w) return [];
    const out = [];
    for (let t = w[0]; t + SLOT <= w[1]; t += SLOT) out.push(t);
    return out;
  };
  // One or two slots on every open day are held back, so a day does not read as wide open. Seeded by the date, so a
  // day always shows the same holds; a held slot looks exactly like a booked one, and is never held twice in a row.
  const seeded = (key) => {
    let h = 2166136261;
    for (const ch of key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const heldFor = (d, taken) => {
    const rnd = seeded(forDB(d));
    const want = 1 + (rnd() < 0.45 ? 1 : 0);
    const slots = slotsFor(d);
    const free = slots.map((_, i) => i).filter((i) => !taken.has(slots[i]));
    const picks = [];
    while (picks.length < want) {
      const open = free.filter((i) => picks.every((p) => Math.abs(p - i) > 1));
      if (!open.length) break;
      picks.push(open[Math.floor(rnd() * open.length)]);
    }
    return new Set(picks.map((i) => slots[i]));
  };
  // The instant a stored label means, in minutes after midnight Eastern. Rows written before 2026-10-23 carry a
  // Pacific label; +3 h reads them as the Eastern moment they were booked for.
  const storedMinutes = (label) => {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)\s*(PST|PDT|PT|EST|EDT|ET)?$/i.exec(String(label).trim());
    if (!m) return null;
    const h = (Number(m[1]) % 12) + (/pm/i.test(m[3]) ? 12 : 0);
    return h * 60 + Number(m[2]) + (/^P[SD]?T$/i.test(m[4] || '') ? 180 : 0);
  };
  const display = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const forDB = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // ---- time zones (2026-10-23, Ben: "the calendar shows the times in the person's local time, shows the time zone it
  // detects, and they can switch"). The calendar's days and slots are Ben's, in Eastern Time, and the label sent to the
  // platform stays the Eastern one ('12:30 PM ET'), so nothing the platform checks changes. Only what the visitor reads
  // is translated: each slot is shown in the zone they pick, which starts as the one their browser reports.
  const ET = 'America/New_York';
  const ZONE_KEY = 'amtech-booking-zone';
  const validZone = (tz) => { try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch (e) { return false; } };
  const detected = (() => { try { const z = Intl.DateTimeFormat().resolvedOptions().timeZone; return z && validZone(z) ? z : ET; } catch (e) { return ET; } })();
  let zone = (() => { try { const z = localStorage.getItem(ZONE_KEY); return z && validZone(z) ? z : detected; } catch (e) { return detected; } })();
  const dayKey = (at, tz) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
  // How far a zone's wall clock is ahead of UTC at a moment, in ms.
  const offsetMs = (tz, at) => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(at).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - Math.floor(at.getTime() / 1000) * 1000;
  };
  // The moment an Eastern slot (minutes after midnight) on calendar day d means: twice round, so a day that changes
  // its clocks still lands on the right hour.
  const instant = (d, mins) => {
    const wall = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, mins);
    let t = wall;
    for (let i = 0; i < 2; i++) t = wall - offsetMs(ET, new Date(t));
    return new Date(t);
  };
  // "Pacific Time" where the browser can say it (longGeneric), else "Pacific Daylight Time".
  const zoneName = (tz, at = new Date()) => {
    for (const style of ['longGeneric', 'long']) {
      try {
        const v = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: style }).formatToParts(at).find((x) => x.type === 'timeZoneName')?.value;
        if (v) return v;
      } catch (e) { /* an older browser without that style: try the next */ }
    }
    return tz;
  };
  const zoneShort = (tz, at) => {
    try { return new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(at).find((x) => x.type === 'timeZoneName')?.value || tz; } catch (e) { return tz; }
  };
  const city = (tz) => tz.split('/').pop().replace(/_/g, ' ');
  const localClock = (at) => new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit' }).format(at);
  const localHour = (at) => Number(new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', hour: 'numeric' }).format(at)) % 24;
  const localWeekday = (at) => new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short' }).format(at);
  // A slot as the visitor reads it: their clock, and their day when it is not the calendar's day.
  const shown = (d, mins) => {
    const at = instant(d, mins);
    return dayKey(at, zone) === forDB(d) ? localClock(at) : `${localClock(at)} ${localWeekday(at)}`;
  };
  // Today, in Eastern Time: the platform takes bookings from tomorrow, Eastern, whatever the visitor's own date is.
  const today = (() => { const [y, m, d] = dayKey(new Date(), ET).split('-').map(Number); return new Date(y, m - 1, d); })();
  const COMMON = [ET, 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'];
  function zonePicker() {
    const sel = $('[data-zone]');
    if (!sel) return;
    const now = new Date(), seen = new Set();
    const add = (tz, text, into) => {
      if (seen.has(tz) || !validZone(tz)) return;
      seen.add(tz);
      const o = document.createElement('option');
      o.value = tz; o.textContent = text;
      into.appendChild(o);
    };
    add(detected, `${zoneName(detected, now)} (${city(detected)}), yours`, sel);
    for (const tz of COMMON) add(tz, `${zoneName(tz, now)} (${city(tz)})${tz === ET ? ', our calendar' : ''}`, sel);
    let all = [];
    try { all = Intl.supportedValuesOf('timeZone'); } catch (e) { all = []; }
    if (all.length) {
      const group = document.createElement('optgroup');
      group.label = 'Every time zone';
      for (const tz of all) add(tz, `${city(tz)} (${zoneShort(tz, now)})`, group);
      sel.appendChild(group);
    }
    if (!seen.has(zone)) zone = detected;
    sel.value = zone;
    sel.addEventListener('change', () => {
      zone = sel.value;
      try { localStorage.setItem(ZONE_KEY, zone); } catch (e) { /* a private window keeps it for this visit only */ }
      times();
    });
  }

  // ---- the platform's front door, the only writer of bookings (2026-10-20). The page holds no database key: it asks
  // which times are taken (the times only) and sends the booking, which the platform checks, stores and mails to the
  // operator, never to the address typed. One booking per slot is the platform's rule, so a time can be "just taken".
  async function bookedSlots(date) {
    try {
      const r = await fetch(`${C.slots}?date=${date}`);
      if (!r.ok) throw new Error(String(r.status));
      return (await r.json()).taken || [];
    } catch (e) { console.error('Failed to fetch booked slots:', e); return []; }
  }
  async function createBooking(b) {
    try {
      const r = await fetch(C.book, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
      if (r.status === 409) return 'taken';
      if (!r.ok) throw new Error(String(r.status));
      return 'ok';
    } catch (e) { console.error('Failed to create booking:', e); return 'failed'; }
  }

  // ---- motion (framer-motion: enter x 20, exit x -20, 0.2 s; AnimatePresence waits for the exit) ----
  const show = (el, from) => {
    el.hidden = false;
    el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = from;
    el.getBoundingClientRect();
    el.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'; el.style.opacity = '1'; el.style.transform = 'none';
  };
  let moving = Promise.resolve();
  const go = (n) => {
    const from = $(`[data-step="${state.step}"]`);
    const to = $(`[data-step="${n}"]`);
    state.step = n;
    indicator();
    moving = moving.then(() => new Promise((done) => {
      from.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'; from.style.opacity = '0'; from.style.transform = 'translateX(-20px)';
      setTimeout(() => { from.hidden = true; show(to, 'translateX(20px)'); done(); }, 200);
    }));
  };

  // ---- step indicator (StepIndicator.tsx) ----
  const CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3"><path d="M20 6 9 17l-5-5"></path></svg>';
  function indicator() {
    $$('[data-dot]').forEach((dot, i) => {
      const done = i < state.step, active = i === state.step;
      dot.className = `w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-md transition-all duration-300 ${done ? 'bg-red text-white' : active ? 'border border-black/30 text-black' : 'border border-black/20 text-black/50'}`;
      dot.innerHTML = done ? CHECK : String(i + 1);
      const label = dot.nextElementSibling;
      label.className = `hidden sm:inline text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors duration-300 ${active ? 'text-black' : done ? 'text-black/60' : 'text-black/50'}`;
    });
    $$('[data-line]').forEach((line, k) => {
      line.className = `w-4 sm:w-8 lg:w-12 h-px transition-colors duration-300 ${k + 1 < state.step ? 'bg-black' : 'bg-black/10'}`;
    });
  }

  // ---- step 0 (InfoStep.tsx) ----
  const info = $('[data-info]');
  info.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (k) => info.elements[k].value;
    const errs = {};
    if (!v('name').trim()) errs.name = 'Name is required';
    if (!v('email').trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) errs.email = 'Enter a valid email';
    if (!v('organization').trim()) errs.organization = 'Organization is required';
    for (const k of ['name', 'email', 'organization']) { const p = $(`[data-error="${k}"]`); p.textContent = errs[k] || ''; p.hidden = !errs[k]; }
    if (Object.keys(errs).length) return;
    state.name = v('name').trim(); state.email = v('email').trim(); state.organization = v('organization').trim();
    go(1);
  });

  // ---- steps 1 and 2 (SelectionStep.tsx) ----
  $$('[data-pick]').forEach((panel) => {
    const key = panel.dataset.pick;
    const next = $('[data-next]', panel);
    $$('[data-option]', panel).forEach((b) => b.addEventListener('click', () => {
      state[key] = b.dataset.option;
      $$('[data-option]', panel).forEach((o) => {
        const on = o.dataset.option === state[key];
        o.className = `w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center justify-between ${on ? 'glass-bright text-black' : 'glass text-black/60 hover:text-black'}`;
        o.style.borderColor = on ? 'rgba(225, 29, 42, 0.3)' : '';
        o.querySelector('svg').toggleAttribute('hidden', !on);
      });
      next.disabled = false;
    }));
    const n = Number(panel.dataset.step);
    next.addEventListener('click', () => go(n + 1));
    $('[data-back]', panel).addEventListener('click', () => go(n - 1));
  });

  // ---- step 3 (DateTimeStep.tsx, CalendarPicker.tsx, TimePicker.tsx) ----
  const step3 = $('[data-step="3"]');
  $('[data-back]', step3).addEventListener('click', () => go(2));
  const confirm = $('[data-confirm]');
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  function calendar() {
    const y = view.getFullYear(), m = view.getMonth();
    $('[data-month]').textContent = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    $('[data-prev]').disabled = !(new Date(y, m, 1) > monthStart(today));
    $('[data-nextmonth]').disabled = !(new Date(y, m + 1, 1) <= new Date(today.getFullYear(), today.getMonth() + 3, 1));
    const grid = $('[data-days]');
    $$('[data-cell]', grid).forEach((c) => c.remove());
    const first = new Date(y, m, 1).getDay(), count = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) grid.insertAdjacentHTML('beforeend', '<div data-cell class="aspect-square"></div>');
    for (let d = 1; d <= count; d++) {
      const date = new Date(y, m, d);
      const disabled = date < today || !HOURS[date.getDay()];
      const selected = state.date ? sameDay(date, state.date) : false;
      const isToday = sameDay(date, today);
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.cell = ''; b.disabled = disabled; b.textContent = String(d);
      b.className = `aspect-square flex items-center justify-center text-[12px] font-medium rounded-lg transition-all duration-150 relative ${disabled ? 'text-black/10 cursor-not-allowed' : selected ? 'bg-red text-white font-bold' : isToday ? 'text-black font-bold' : 'text-black/60 hover:bg-black/[0.04]'}`;
      if (isToday && !selected) b.insertAdjacentHTML('beforeend', '<span class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red"></span>');
      b.addEventListener('click', () => pickDate(date));
      grid.appendChild(b);
    }
  }
  $('[data-prev]').addEventListener('click', () => { const p = new Date(view.getFullYear(), view.getMonth() - 1, 1); if (p.getFullYear() > today.getFullYear() - 1) { view = p; calendar(); } });
  $('[data-nextmonth]').addEventListener('click', () => { const n = new Date(view.getFullYear(), view.getMonth() + 1, 1); if (n <= new Date(today.getFullYear(), today.getMonth() + 3, 1)) { view = n; calendar(); } });

  async function pickDate(date) {
    state.date = date; state.time = ''; state.loading = true;
    calendar(); times();
    const asked = date;
    const booked = await bookedSlots(forDB(date));
    if (state.date !== asked) return;
    state.booked = booked; state.loading = false; times();
  }
  function times() {
    const box = $('[data-times]');
    confirm.disabled = !state.date || !state.time || state.submitting;
    if (!state.date) { box.innerHTML = '<div class="flex items-center justify-center h-full min-h-[200px]"><p class="mono-label text-black/50">Select a date first</p></div>'; return; }
    box.innerHTML = '';
    box.insertAdjacentHTML('beforeend', '<div class="text-[11px] text-black/55 mb-4"></div>');
    box.lastElementChild.textContent = display(state.date);
    if (sameDay(state.date, today)) { box.insertAdjacentHTML('beforeend', '<div class="flex items-center justify-center h-full min-h-[160px]"><p class="mono-label text-black/55">Sorry — All booked up!</p></div>'); return; }
    if (state.loading) { box.insertAdjacentHTML('beforeend', '<div class="flex items-center justify-center py-8"><div class="mono-label text-black/50">Loading availability...</div></div>'); return; }
    const slots = slotsFor(state.date);
    const taken = new Set(state.booked.map(storedMinutes).filter((m) => m !== null));
    const held = heldFor(state.date, taken);
    const wrap = document.createElement('div'); wrap.className = 'space-y-4'; box.appendChild(wrap);
    // Grouped by the visitor's own clock, in time order: Ben's Friday evening is a Pacific visitor's afternoon, and a
    // Tokyo visitor's Monday night runs on into Tuesday morning, so a group names the day when it is not the calendar's.
    const groups = [];
    for (const t of slots) {
      const at = instant(state.date, t), h = localHour(at);
      const key = (h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening')
        + (dayKey(at, zone) === forDB(state.date) ? '' : `, ${localWeekday(at)}`);
      if (!groups.length || groups[groups.length - 1][0] !== key) groups.push([key, []]);
      groups[groups.length - 1][1].push(t);
    }
    for (const [label, part] of groups) {
      if (!part.length) continue;
      const sec = document.createElement('div');
      sec.innerHTML = `<div class="mono-label text-black/50 mb-2">${label}</div><div class="grid grid-cols-2 sm:grid-cols-3 gap-2"></div>`;
      for (const t of part) {
        const time = fmtSlot(t), isBooked = taken.has(t) || held.has(t), on = state.time === time;
        const b = document.createElement('button');
        b.type = 'button'; b.disabled = isBooked; b.textContent = localClock(instant(state.date, t));     // the group names the day
        if (zone !== ET) b.title = `${clock(t)} Eastern`;
        b.className = `px-2 py-2.5 text-[11px] tracking-wide rounded-lg transition-all duration-200 ${isBooked ? 'border border-black/5 text-black/15 cursor-not-allowed line-through' : on ? 'bg-red text-white font-semibold' : 'border border-black/10 text-black/60 hover:border-black/20 hover:text-black'}`;
        b.addEventListener('click', () => { state.time = time; confirm.textContent = 'Confirm Booking'; times(); });
        sec.lastElementChild.appendChild(b);
      }
      wrap.appendChild(sec);
    }
    // The chosen time said both ways, so the call is in the visitor's diary at the right hour.
    if (state.time && zone !== ET) {
      const t = storedMinutes(state.time);
      const note = document.createElement('p');
      note.className = 'text-[11px] text-black/55';
      note.textContent = `${shown(state.date, t)} ${zoneShort(zone, instant(state.date, t))} is ${clock(t)} Eastern Time, when the call is on our calendar.`;
      wrap.appendChild(note);
    }
  }

  confirm.addEventListener('click', async () => {
    if (!state.date || !state.time) return;
    state.submitting = true; confirm.textContent = 'Scheduling...'; times();
    const booking = { name: state.name, email: state.email, organization: state.organization, industry: state.industry, topic: state.topic, bookingDate: forDB(state.date), bookingTime: state.time };
    const res = await createBooking(booking);
    state.submitting = false;
    if (res !== 'ok') {
      if (res === 'taken') { state.time = ''; state.booked = await bookedSlots(forDB(state.date)); }
      confirm.textContent = res === 'taken' ? 'That time was just taken. Pick another' : 'That did not go through. Try again';
      times();
      return;
    }
    confirm.textContent = 'Confirm Booking'; times();
    booking.bookingDate = display(state.date);
    const at = instant(state.date, storedMinutes(state.time));
    booking.bookingTime = zone === ET ? `${clock(storedMinutes(state.time))} Eastern Time`
      : `${shown(state.date, storedMinutes(state.time))} ${zoneName(zone, at)} (${clock(storedMinutes(state.time))} Eastern)`;
    window.gtag?.('event', 'generate_lead', { industry: state.industry, topic: state.topic });
    for (const el of $$('[data-v]')) el.textContent = booking[el.dataset.v];
    $('[data-booking]').hidden = true;
    const done = $('[data-confirmed]');
    done.hidden = false;
    done.style.transition = 'none'; done.style.opacity = '0'; done.style.transform = 'scale(0.97)';
    done.getBoundingClientRect();
    done.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'; done.style.opacity = '1'; done.style.transform = 'none';
  });

  zonePicker();
  calendar();
  show($('[data-step="0"]'), 'translateX(20px)');
})();
