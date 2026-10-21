// The booking page, as src/pages/ScheduleDemo.tsx and src/components/schedule/ did it, without React. Every class
// string is the component's own, written out here so Tailwind generates it.
(() => {
  const C = window.BOOKING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const state = { step: 0, name: '', email: '', organization: '', industry: '', topic: '', date: null, time: '', booked: [], loading: false, submitting: false };

  // ---- dates and slots (bookingConstants.ts) ----
  const BASELINE = [[9, 30], [11, 0], [12, 30], [13, 0], [15, 0]];
  const fmtSlot = (h, m) => `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} PT`;
  const shift = (off) => BASELINE.map(([h, m]) => { const t = h * 60 + m + off; return fmtSlot(Math.floor(t / 60), t % 60); });
  const slotsFor = (d) => { const w = d.getDay(); if (w === 4 || w === 1) return shift(0); if (w === 5 || w === 2) return shift(30); if (w === 6 || w === 3) return shift(-30); return []; };
  const display = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const forDB = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

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
      const disabled = date < today || date.getDay() === 0;
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
    const wrap = document.createElement('div'); wrap.className = 'space-y-4'; box.appendChild(wrap);
    for (const [label, part] of [['Morning', slots.filter((t) => t.includes('AM'))], ['Afternoon', slots.filter((t) => t.includes('PM'))]]) {
      if (!part.length) continue;
      const sec = document.createElement('div');
      sec.innerHTML = `<div class="mono-label text-black/50 mb-2">${label}</div><div class="grid grid-cols-2 sm:grid-cols-3 gap-2"></div>`;
      for (const t of part) {
        const isBooked = state.booked.includes(t), on = state.time === t;
        const b = document.createElement('button');
        b.type = 'button'; b.disabled = isBooked; b.textContent = t.replace(' PT', '');
        b.className = `px-2 py-2.5 text-[11px] tracking-wide rounded-lg transition-all duration-200 ${isBooked ? 'border border-black/5 text-black/15 cursor-not-allowed line-through' : on ? 'bg-red text-white font-semibold' : 'border border-black/10 text-black/60 hover:border-black/20 hover:text-black'}`;
        b.addEventListener('click', () => { state.time = t; confirm.textContent = 'Confirm Booking'; times(); });
        sec.lastElementChild.appendChild(b);
      }
      wrap.appendChild(sec);
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
    window.gtag?.('event', 'generate_lead', { industry: state.industry, topic: state.topic });
    for (const el of $$('[data-v]')) el.textContent = booking[el.dataset.v];
    $('[data-booking]').hidden = true;
    const done = $('[data-confirmed]');
    done.hidden = false;
    done.style.transition = 'none'; done.style.opacity = '0'; done.style.transform = 'scale(0.97)';
    done.getBoundingClientRect();
    done.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'; done.style.opacity = '1'; done.style.transform = 'none';
  });

  calendar();
  show($('[data-step="0"]'), 'translateX(20px)');
})();
