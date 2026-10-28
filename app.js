/* Inkwell: PSAT practice app. Plain JavaScript, no build step. Progress is stored in this browser (localStorage). */
(() => {
  'use strict';

  /* ------------------------------------------------------------------ data */
  const SK = window.INK_SKILLS, UN = window.INK_UNITS, QS = window.INK_QUESTIONS;
  const SKMAP = Object.fromEntries(SK.map((s) => [s.id, s]));
  const UNMAP = Object.fromEntries(UN.map((u) => [u.id, u]));
  const MATH = new Set(['lin', 'exp', 'sta', 'adv', 'geo']);
  const MIN = 60e3, HOUR = 36e5, DAY = 864e5;
  // Cooldowns after an answer. Box 0 = answered wrong (back soon); each correct answer moves it up a box.
  const INTERVALS = [10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
  const HEART_MS = 20 * MIN, MAX_HEARTS = 5, LESSON_LEN = 8, REVIEW_LEN = 10, SPEED_SECS = 60;
  const KEY = 'inkwell.v1';

  const KIND = {
    mc: 'Choose the best answer', cloze: 'Fill in the blank', tf: 'True or false?', match: 'Match the pairs',
    sort: 'Sort into groups', order: 'Put it in order', tap: 'Tap the answer', punct: 'Pick the punctuation', input: 'Type your answer',
  };

  /* --------------------------------------------------------------- storage */
  let memCopy = null;
  const defaults = () => ({
    v: 1, xp: 0, gems: 60, hearts: MAX_HEARTS, heartsAt: Date.now(),
    streak: 0, best: 0, lastGoalDay: null, freezes: 1, days: {},
    daily: freshDaily(), q: {}, ach: {}, owned: ['none'], hat: 'none',
    lessons: 0, perfects: 0, totalCorrect: 0, totalAnswered: 0, bestComboEver: 0, bestSpeed: 0, mistakeRuns: 0, tried: [],
    settings: { goal: 20, sound: true, hearts: true, theme: 'system', remind: true, remindAt: '19:00', notify: false, lastNotified: null },
    welcomed: false, notice: null,
  });
  function freshDaily() { return { day: dayKey(), xp: 0, lessons: 0, correct: 0, bestCombo: 0, perfect: 0, math: 0, claimed: [] }; }
  function merge(d, o) {
    for (const k in o) {
      const a = d[k], b = o[k];
      if (b && typeof b === 'object' && !Array.isArray(b) && a && typeof a === 'object' && !Array.isArray(a)) d[k] = merge(a, b);
      else d[k] = b;
    }
    return d;
  }
  function load() {
    try {
      let raw = null;
      try { raw = localStorage.getItem(KEY); } catch (e) { raw = memCopy; }
      if (raw) return merge(defaults(), JSON.parse(raw));
    } catch (e) { /* corrupted: start fresh */ }
    return defaults();
  }
  function save() {
    const raw = JSON.stringify(S);
    memCopy = raw;
    try { localStorage.setItem(KEY, raw); } catch (e) { /* storage blocked: keep in memory */ }
  }

  /* ------------------------------------------------------------------ time */
  const pad = (n) => String(n).padStart(2, '0');
  function dayKey(d = new Date()) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  const keyDate = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const dayDiff = (a, b) => Math.round((keyDate(b) - keyDate(a)) / DAY);
  const addDays = (k, n) => { const d = keyDate(k); d.setDate(d.getDate() + n); return dayKey(d); };
  function fmtDur(ms) {
    ms = Math.max(0, ms);
    const m = Math.ceil(ms / MIN);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ${m % 60}m`;
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  function fmtWhen(ts) {
    const d = new Date(ts), now = new Date();
    const t = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const diff = dayDiff(dayKey(now), dayKey(d));
    if (diff === 0) return `today at ${t}`;
    if (diff === 1) return `tomorrow at ${t}`;
    return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at ${t}`;
  }

  /* --------------------------------------------------------------- helpers */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const strip = (s) => String(s).replace(/<[^>]+>/g, '');
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) { if (c == null || c === false) continue; el.append(c.nodeType ? c : document.createTextNode(c)); }
    return el;
  }
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const calm = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function countUp(el, to, ms = 900, prefix = '', suffix = '') {
    if (calm() || !to) { el.textContent = prefix + to + suffix; return; }
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = prefix + Math.round(to * e) + suffix;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ----------------------------------------------------------------- icons */
  const I = {
    flame: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.6 2.2c.3 3-1.2 4.6-2.7 6.1C8.4 9.8 7 11.3 7 14a5 5 0 0 0 10 0c0-1.7-.7-3-1.5-4 .1 1.6-.5 2.6-1.4 3 .6-3.4-.3-7.6-1.5-10.8Z"/><path d="M12 22a7 7 0 0 1-7-7c0-3.6 2-5.6 3.5-7.1L9.6 6.8c.2 1.9.9 3 2.4 3.4C11.4 7 12 4.4 12.6 2.2 16 5.6 19 9.7 19 15a7 7 0 0 1-7 7Z" opacity=".35"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h10l4 6-9 12L3 9l4-6Z" opacity=".35"/><path d="M7 3h10l4 6H3l4-6Zm-4 6h18l-9 12L3 9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 21 8.5 9 12 3l3.5 6L12 21Z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.5 1.1 4.4 2.5.9-1.4 2.3-2.5 4.4-2.5 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z"/></svg>',
    learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"/></svg>',
    practice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
    quests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8l-1 6h-6L8 3Z"/><circle cx="12" cy="15" r="6"/><path d="m12 12 1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 14.3l2-.3 1-2Z" fill="currentColor"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/></svg>',
    stack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
    medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10l-2.5 6h-5L7 3Z"/><circle cx="12" cy="15" r="6"/><path d="M12 12.5v5M10 13.5l2-1"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  };

  /* ---------------------------------------------------------------- mascot */
  const HATS = {
    none: { name: 'No outfit', price: 0, desc: 'Dot, as is.' },
    scarf: { name: 'Cozy Scarf', price: 40, desc: 'For long winter study nights.' },
    phones: { name: 'Headphones', price: 80, desc: 'Lo-fi beats to study to.' },
    party: { name: 'Party Hat', price: 60, desc: 'Every streak is a party.' },
    grad: { name: 'Grad Cap', price: 120, desc: 'Dress for the score you want.' },
    crown: { name: 'Crown', price: 220, desc: 'Royalty of the reading section.' },
  };
  function hatSVG(hat) {
    switch (hat) {
      case 'scarf': return '<path d="M30 86c10 8 50 8 60 0l2 9c-12 8-52 8-64 0l2-9Z" fill="#E2483F"/><path d="M74 92l8 20-9 2-6-19 7-3Z" fill="#E2483F"/><path d="M36 92l2 6M48 95v6M60 96v6M72 95v6" stroke="#fff" stroke-width="2" opacity=".7"/>';
      case 'phones': return '<path d="M24 52c0-26 72-26 72 0" fill="none" stroke="#2B2B33" stroke-width="7" stroke-linecap="round"/><rect x="15" y="46" width="15" height="24" rx="7" fill="#FFD84A" stroke="#2B2B33" stroke-width="3"/><rect x="90" y="46" width="15" height="24" rx="7" fill="#FFD84A" stroke="#2B2B33" stroke-width="3"/>';
      case 'party': return '<path d="M60 0 76 34H44L60 0Z" fill="#FFD84A" stroke="#C9A21A" stroke-width="2"/><path d="M52 17h16M48 26h24" stroke="#E2483F" stroke-width="4"/><circle cx="60" cy="2" r="5" fill="#E2483F"/>';
      case 'grad': return '<path d="M60 8 98 22 60 36 22 22 60 8Z" fill="#2B2B33"/><path d="M40 28v10c10 6 30 6 40 0V28" fill="#2B2B33"/><path d="M92 24v18" stroke="#FFD84A" stroke-width="3"/><circle cx="92" cy="44" r="4" fill="#FFD84A"/>';
      case 'crown': return '<path d="M36 34 40 10l12 14 8-18 8 18 12-14 4 24H36Z" fill="#FFD84A" stroke="#C9A21A" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="27" r="3.5" fill="#E2483F"/><circle cx="46" cy="29" r="2.5" fill="#2E8BD8"/><circle cx="74" cy="29" r="2.5" fill="#2E8BD8"/>';
      default: return '';
    }
  }
  function mascot(mood = 'happy', hat = S.hat, cls = 'mascot') {
    const eyes = {
      happy: '<path d="M41 60q6-8 12 0M67 60q6-8 12 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
      calm: '<circle cx="47" cy="60" r="7" fill="#fff"/><circle cx="73" cy="60" r="7" fill="#fff"/><circle cx="48.5" cy="61" r="3.5" fill="#101633"/><circle cx="74.5" cy="61" r="3.5" fill="#101633"/>',
      sad: '<circle cx="47" cy="62" r="6.5" fill="#fff"/><circle cx="73" cy="62" r="6.5" fill="#fff"/><circle cx="47" cy="64" r="3.3" fill="#101633"/><circle cx="73" cy="64" r="3.3" fill="#101633"/><path d="M39 52l12 4M81 52l-12 4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
      wow: '<circle cx="47" cy="59" r="9" fill="#fff"/><circle cx="73" cy="59" r="9" fill="#fff"/><circle cx="47" cy="59" r="4.5" fill="#101633"/><circle cx="73" cy="59" r="4.5" fill="#101633"/><circle cx="49" cy="57" r="1.6" fill="#fff"/><circle cx="75" cy="57" r="1.6" fill="#fff"/>',
    }[mood] || '';
    const mouth = {
      happy: '<path d="M52 74q8 8 16 0" fill="#FF8FA0" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
      calm: '<path d="M55 74q5 4 10 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
      sad: '<path d="M54 78q6-5 12 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
      wow: '<ellipse cx="60" cy="76" rx="5" ry="6" fill="#FF8FA0" stroke="#fff" stroke-width="2"/>',
    }[mood] || '';
    const hatTop = ['party', 'grad', 'crown'].includes(hat);
    return `<svg class="${cls}" viewBox="0 ${hatTop ? -4 : 6} 120 ${hatTop ? 124 : 114}" role="img" aria-label="Dot the ink cat">
      <path class="body" d="M96 98c14-2 18-14 10-22" fill="none" stroke-width="7" stroke-linecap="round" style="fill:none;stroke:var(--mascot)"/>
      <path class="body" d="M28 46 32 18l20 18M92 46 88 18 68 36"/>
      <path class="body" d="M60 30c26 0 40 16 40 40 0 22-16 38-40 38S20 92 20 70c0-24 14-40 40-40Z"/>
      <path d="M33 23l3 13 9-6Z M87 23l-3 13-9-6Z" fill="#FF8FA0" opacity=".7"/>
      <ellipse cx="60" cy="96" rx="22" ry="8" fill="#fff" opacity=".08"/>
      <g class="eyes">${eyes}</g>
      <path d="M57 68h6l-3 3Z" fill="#FF8FA0"/>
      ${mouth}
      <circle cx="36" cy="72" r="5" fill="#FF8FA0" opacity=".45"/><circle cx="84" cy="72" r="5" fill="#FF8FA0" opacity=".45"/>
      ${hatSVG(hat)}
    </svg>`;
  }

  /* -------------------------------------------------------------- state ops */
  let S = load();

  function syncHearts() {
    if (S.hearts >= MAX_HEARTS) { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); return; }
    const n = Math.floor((Date.now() - S.heartsAt) / HEART_MS);
    if (n > 0) {
      S.hearts = Math.min(MAX_HEARTS, S.hearts + n);
      S.heartsAt += n * HEART_MS;
      if (S.hearts >= MAX_HEARTS) S.heartsAt = Date.now();
    }
  }
  function loseHeart() {
    if (!S.settings.hearts) return;
    if (S.hearts >= MAX_HEARTS) S.heartsAt = Date.now();
    S.hearts = Math.max(0, S.hearts - 1);
  }

  function rollover() {
    const today = dayKey();
    if (S.daily.day !== today) S.daily = freshDaily();
    if (S.streak > 0 && S.lastGoalDay) {
      const gap = dayDiff(S.lastGoalDay, today);
      if (gap > 1) {
        const missed = gap - 1;
        if (S.freezes >= missed) {
          for (let i = 1; i <= missed; i++) S.days[addDays(S.lastGoalDay, i)] = 'frozen';
          S.freezes -= missed;
          S.lastGoalDay = addDays(today, -1);
          S.notice = { type: 'frozen', n: missed };
        } else {
          S.notice = { type: 'lost', n: S.streak };
          S.streak = 0;
        }
      }
    }
    syncHearts();
    save();
  }

  function addXP(n) {
    S.xp += n;
    S.daily.xp += n;
    const t = dayKey();
    if (S.daily.xp >= S.settings.goal && S.lastGoalDay !== t) {
      S.streak = S.lastGoalDay === addDays(t, -1) ? S.streak + 1 : 1;
      S.lastGoalDay = t;
      S.days[t] = 'goal';
      S.best = Math.max(S.best, S.streak);
      return true;
    }
    return false;
  }

  function levelInfo(xp) {
    let lvl = 1, need = 100, rest = xp;
    while (rest >= need) { rest -= need; lvl++; need = 100 + (lvl - 1) * 50; }
    return { lvl, into: rest, need };
  }

  /* ------------------------------------------------------ spaced repetition */
  const isReady = (q, now = Date.now()) => { const r = S.q[q.id]; return !r || r.due <= now; };
  function grade(q, ok) {
    const now = Date.now();
    const r = S.q[q.id] || { box: 0, c: 0, w: 0, due: 0, seen: 0 };
    r.seen = now;
    if (ok) { r.box = Math.min(r.box + 1, INTERVALS.length - 1); r.c++; } else { r.box = 0; r.w++; }
    r.due = now + INTERVALS[r.box];
    S.q[q.id] = r;
  }
  function skillStats(sid) {
    const qs = QS.filter((q) => q.s === sid), now = Date.now();
    let ready = 0, seen = 0, mast = 0, pts = 0, c = 0, w = 0, next = Infinity;
    for (const q of qs) {
      const r = S.q[q.id];
      if (!r || r.due <= now) ready++; else next = Math.min(next, r.due);
      if (r) { seen++; c += r.c; w += r.w; pts += Math.min(r.box, 3); if (r.box >= 3) mast++; }
    }
    return { total: qs.length, ready, seen, mast, pct: pts / (3 * qs.length), acc: c + w ? c / (c + w) : null, next };
  }
  const mistakesPool = () => QS.filter((q) => { const r = S.q[q.id]; return r && r.w > 0 && r.box <= 1; });
  const reviewPool = () => QS.filter((q) => S.q[q.id]);
  const pt1Pool = () => QS.filter((q) => q.src === 'pt1');
  function buildQueue(mode, sid) {
    const now = Date.now();
    let pool = mode === 'skill' ? QS.filter((q) => q.s === sid) : mode === 'mistakes' ? mistakesPool() : mode === 'review' ? reviewPool() : mode === 'pt1' ? pt1Pool() : QS.slice();
    let av = pool.filter((q) => isReady(q, now));
    if (mode === 'speed') av = av.filter((q) => ['mc', 'tf', 'cloze', 'punct', 'input'].includes(q.t));
    const wrong = shuffle(av.filter((q) => S.q[q.id] && S.q[q.id].box === 0));
    const fresh = shuffle(av.filter((q) => !S.q[q.id]));
    const due = av.filter((q) => S.q[q.id] && S.q[q.id].box > 0).sort((a, b) => S.q[a.id].due - S.q[b.id].due);
    if (mode === 'speed') return shuffle(av);
    if (mode === 'review' || mode === 'mistakes') return [...wrong, ...due].slice(0, REVIEW_LEN);
    if (mode === 'pt1') { const missed = fresh.filter((q) => q.missed); return [...wrong, ...missed, ...fresh.filter((q) => !q.missed), ...due].slice(0, REVIEW_LEN); }
    return [...wrong, ...fresh, ...due].slice(0, LESSON_LEN);
  }
  function nextUnlock(pool) {
    const now = Date.now(); let m = Infinity;
    for (const q of pool) { const r = S.q[q.id]; if (r && r.due > now) m = Math.min(m, r.due); }
    return m;
  }
  function upcoming() {
    const now = Date.now(); const out = { day: 0, three: 0, week: 0 };
    for (const r of Object.values(S.q)) {
      if (r.due <= now) continue;
      const d = r.due - now;
      if (d <= DAY) out.day++; if (d <= 3 * DAY) out.three++; if (d <= 7 * DAY) out.week++;
    }
    return out;
  }

  /* ---------------------------------------------------------------- quests */
  const QUEST_POOL = [
    { id: 'xp', label: (g) => `Earn ${g} XP`, goals: [20, 30, 50], key: 'xp' },
    { id: 'lessons', label: (g) => `Finish ${g} lessons`, goals: [2, 3], key: 'lessons' },
    { id: 'combo', label: (g) => `Get ${g} right in a row`, goals: [5, 8], key: 'bestCombo' },
    { id: 'correct', label: (g) => `Answer ${g} questions correctly`, goals: [15, 25], key: 'correct' },
    { id: 'perfect', label: () => 'Finish a lesson with no mistakes', goals: [1], key: 'perfect' },
    { id: 'math', label: (g) => `Get ${g} math questions right`, goals: [5, 10], key: 'math' },
  ];
  function seeded(seed) {
    let x = 2166136261;
    for (const ch of seed) x = Math.imul(x ^ ch.charCodeAt(0), 16777619);
    return () => { x = Math.imul(x ^ (x >>> 15), 2246822507); x = Math.imul(x ^ (x >>> 13), 3266489909); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
  }
  function todaysQuests() {
    const r = seeded(S.daily.day), pool = QUEST_POOL.slice(), out = [];
    while (out.length < 3) {
      const t = pool.splice(Math.floor(r() * pool.length), 1)[0];
      const gi = Math.floor(r() * t.goals.length), g = t.goals[gi];
      out.push({ id: t.id, label: t.label(g), goal: g, key: t.key, reward: gi === t.goals.length - 1 && t.goals.length > 1 ? 25 : 15 });
    }
    return out;
  }
  function checkQuests() {
    for (const q of todaysQuests()) {
      if (!S.daily.claimed.includes(q.id) && (S.daily[q.key] || 0) >= q.goal) {
        S.daily.claimed.push(q.id);
        S.gems += q.reward;
        toast(`Quest complete: ${q.label}. +${q.reward} gems`, I.quests);
      }
    }
  }

  /* ---------------------------------------------------------- achievements */
  const ACH = [
    { id: 'first', name: 'First Page', desc: 'Finish your first lesson', test: () => S.lessons >= 1 },
    { id: 'streak3', name: 'Warming Up', desc: 'Reach a 3-day streak', test: () => S.best >= 3 },
    { id: 'streak7', name: 'Week of Ink', desc: 'Reach a 7-day streak', test: () => S.best >= 7 },
    { id: 'streak30', name: 'Unstoppable', desc: 'Reach a 30-day streak', test: () => S.best >= 30 },
    { id: 'xp100', name: 'Century', desc: 'Earn 100 total XP', test: () => S.xp >= 100 },
    { id: 'xp1000', name: 'Ink Machine', desc: 'Earn 1,000 total XP', test: () => S.xp >= 1000 },
    { id: 'perfect', name: 'Spotless', desc: 'Finish a lesson with no mistakes', test: () => S.perfects >= 1 },
    { id: 'combo10', name: 'On a Roll', desc: 'Get 10 right in a row', test: () => S.bestComboEver >= 10 },
    { id: 'speed12', name: 'Quick Draw', desc: 'Score 12+ in a Speed Round', test: () => S.bestSpeed >= 12 },
    { id: 'comeback', name: 'Comeback', desc: 'Finish a mistakes review', test: () => S.mistakeRuns >= 1 },
    { id: 'explorer', name: 'Explorer', desc: 'Try all 17 skills', test: () => S.tried.length >= SK.length },
    { id: 'master', name: 'Mastered', desc: 'Master every question in one skill', test: () => SK.some((s) => { const st = skillStats(s.id); return st.mast === st.total; }) },
    { id: 'style', name: 'Dressed Up', desc: 'Buy an outfit for Dot', test: () => S.owned.length > 1 },
  ];
  function checkAch() {
    for (const a of ACH) if (!S.ach[a.id] && a.test()) { S.ach[a.id] = Date.now(); toast(`Achievement unlocked: ${a.name}`, I.medal); }
  }

  /* ----------------------------------------------------------- sound & fx */
  let AC = null;
  function tone(freqs, type = 'sine', dur = 0.12, gap = 0.09, vol = 0.07) {
    if (!S.settings.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = AC.currentTime + 0.01;
      freqs.forEach((f, i) => {
        const o = AC.createOscillator(), g = AC.createGain(), t = t0 + i * gap;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + 0.02);
      });
    } catch (e) { /* audio unavailable */ }
  }
  const sfx = {
    ok: () => tone([660, 990], 'sine', 0.16, 0.08),
    no: () => tone([233, 175], 'triangle', 0.2, 0.12, 0.06),
    tap: () => tone([540], 'sine', 0.05, 0, 0.025),
    win: () => tone([523, 659, 784, 1047], 'sine', 0.2, 0.1),
    streak: () => tone([392, 523, 659, 784, 1047, 1319], 'triangle', 0.22, 0.08, 0.06),
  };
  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = h('canvas', { id: 'confetti' }); document.body.append(c);
    const ctx = c.getContext('2d'), W = (c.width = innerWidth), H = (c.height = innerHeight);
    const cols = ['#FFD84A', '#3049D8', '#EE6A1C', '#128A59', '#B83A72', '#1590C2'];
    const ps = Array.from({ length: 130 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, c: pick(cols) }));
    let f = 0;
    (function step() {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }
      if (++f < 110) requestAnimationFrame(step); else c.remove();
    })();
  }
  function toast(msg, icon = I.check) {
    let box = $('.toasts'); if (!box) { box = h('div', { class: 'toasts', 'aria-live': 'polite' }); document.body.append(box); }
    const t = h('div', { class: 'toast', html: `${icon}<span>${esc(msg)}</span>` });
    box.append(t); while (box.children.length > 2) box.firstChild.remove(); setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 260); }, 3200);
  }

  /* ------------------------------------------------------------ reminders */
  function reminderTime() { const [hh, mm] = S.settings.remindAt.split(':').map(Number); const t = new Date(); t.setHours(hh, mm, 0, 0); return t; }
  const goalMet = () => S.daily.xp >= S.settings.goal;
  const reminderDue = () => S.settings.remind && Date.now() >= reminderTime().getTime() && !goalMet();
  function notify() {
    const title = S.streak > 0 ? `Keep your ${S.streak}-day streak going` : 'Time for a quick Inkwell lesson';
    const body = 'One lesson takes about three minutes.';
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((r) => r.showNotification(title, { body, icon: 'icon.svg', tag: 'inkwell-daily' })).catch(() => {});
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'icon.svg', tag: 'inkwell-daily' });
      }
    } catch (e) { /* notifications unavailable */ }
  }
  function tickReminder() {
    if (reminderDue() && S.settings.notify && S.settings.lastNotified !== dayKey()) {
      notify(); S.settings.lastNotified = dayKey(); save();
    }
  }
  async function enableNotify() {
    if (!('Notification' in window)) { toast('This browser can’t show notifications here. Use the calendar reminder instead.', I.bell); return; }
    try {
      const p = await Notification.requestPermission();
      if (p === 'granted') { S.settings.notify = true; save(); toast('Notifications are on.', I.bell); }
      else toast('Notifications are blocked. Allow them in your browser’s site settings, or use the calendar reminder.', I.bell);
    } catch (e) { toast('Notifications aren’t available here. Use the calendar reminder instead.', I.bell); }
    renderView();
  }
  function downloadICS() {
    const [hh, mm] = S.settings.remindAt.split(':').map(Number);
    const d = new Date(), url = location.href.split('#')[0];
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const start = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hh)}${pad(mm)}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Inkwell//PSAT Practice//EN', 'BEGIN:VEVENT',
      `UID:inkwell-daily-${Date.now()}@inkwell`, `DTSTAMP:${stamp}`, `DTSTART:${start}`, 'DURATION:PT10M', 'RRULE:FREQ=DAILY',
      'SUMMARY:Inkwell: daily PSAT practice', `DESCRIPTION:One lesson keeps your streak alive. ${url}`, `URL:${url}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Inkwell practice', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    try {
      const a = h('a', { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: 'inkwell-reminder.ics' });
      document.body.append(a); a.click(); a.remove();
      toast('Calendar file created. Open it to add the daily reminder.', I.bell);
    } catch (e) { toast('Your browser blocked the download.', I.bell); }
  }

  /* ============================================================ VISUALS */
  function tableHTML(t) {
    return `<div class="qtable"><table>${t.cap ? `<caption>${esc(t.cap)}</caption>` : ''}<thead><tr>${t.head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function barsHTML(b) {
    const W = 360, H = 200, L = 34, B = 28, T = 16, max = Math.ceil(Math.max(...b.data.map((d) => d[1])) / 10) * 10;
    const bw = (W - L - 10) / b.data.length;
    const y = (v) => T + (H - T - B) * (1 - v / max);
    let s = '';
    for (let v = 0; v <= max; v += max / 4) s += `<line x1="${L}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--line)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" style="fill:var(--muted)">${v}</text>`;
    b.data.forEach(([lab, v], i) => {
      const x = L + i * bw + bw * 0.18, w = bw * 0.64;
      s += `<rect x="${x}" y="${y(v)}" width="${w}" height="${y(0) - y(v)}" rx="4" style="fill:var(--brand)"/><text x="${x + w / 2}" y="${H - 9}" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--ink)">${esc(lab)}</text>`;
    });
    return `<div class="chart"><div class="cap">${esc(b.cap)}</div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(b.cap)}: ${b.data.map((d) => `${d[0]} ${d[1]}`).join(', ')}">${s}</svg></div>`;
  }
  function graphHTML(g) {
    const S2 = 240, P = 14, R = 6, sc = (S2 - 2 * P) / (2 * R);
    const X = (v) => P + (v + R) * sc, Y = (v) => P + (R - v) * sc;
    let s = '';
    for (let i = -R; i <= R; i++) s += `<line x1="${X(i)}" x2="${X(i)}" y1="${Y(R)}" y2="${Y(-R)}" style="stroke:var(--line)" stroke-width="${i === 0 ? 0 : 1}"/><line y1="${Y(i)}" y2="${Y(i)}" x1="${X(-R)}" x2="${X(R)}" style="stroke:var(--line)" stroke-width="${i === 0 ? 0 : 1}"/>`;
    let poly, line;
    if (g.line === 'h') {
      poly = g.shade === 'above' ? [[-R, g.v], [R, g.v], [R, R], [-R, R]] : [[-R, g.v], [R, g.v], [R, -R], [-R, -R]];
      line = [X(-R), Y(g.v), X(R), Y(g.v)];
    } else {
      poly = g.shade === 'left' ? [[g.v, -R], [g.v, R], [-R, R], [-R, -R]] : [[g.v, -R], [g.v, R], [R, R], [R, -R]];
      line = [X(g.v), Y(-R), X(g.v), Y(R)];
    }
    s += `<polygon points="${poly.map(([a, b]) => `${X(a)},${Y(b)}`).join(' ')}" style="fill:var(--brand);fill-opacity:.18"/>`;
    s += `<line x1="${X(-R)}" x2="${X(R)}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--muted)" stroke-width="1.5"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(-R)}" y2="${Y(R)}" style="stroke:var(--muted)" stroke-width="1.5"/>`;
    for (const v of [-4, -2, 2, 4]) s += `<text x="${X(v)}" y="${Y(0) + 13}" text-anchor="middle" font-size="10" style="fill:var(--muted)">${v}</text><text x="${X(0) - 5}" y="${Y(v) + 3}" text-anchor="end" font-size="10" style="fill:var(--muted)">${v}</text>`;
    s += `<line x1="${line[0]}" y1="${line[1]}" x2="${line[2]}" y2="${line[3]}" style="stroke:var(--brand)" stroke-width="3" ${g.dashed ? 'stroke-dasharray="8 6"' : ''}/>`;
    s += `<text x="${X(R) - 2}" y="${Y(0) - 5}" text-anchor="end" font-size="11" font-style="italic" style="fill:var(--ink)">x</text><text x="${X(0) + 6}" y="${Y(R) + 10}" font-size="11" font-style="italic" style="fill:var(--ink)">y</text>`;
    const desc = `${g.dashed ? 'Dashed' : 'Solid'} ${g.line === 'h' ? 'horizontal' : 'vertical'} line at ${g.line === 'h' ? 'y' : 'x'} = ${g.v}, shaded ${g.shade}.`;
    return `<div class="chart"><svg viewBox="0 0 ${S2} ${S2}" style="max-width:280px" role="img" aria-label="${desc}">${s}</svg></div>`;
  }

  /* ============================================================ WIDGETS
     Each returns { el, check() -> {ok, answer}, reveal(ok), key?(n) }. ctx.ready(bool) toggles the Check button;
     ctx.auto(ok, answer) submits on its own (used by match). */
  function choiceButtons(texts, onPick, cls = 'choice') {
    return texts.map((t, k) => h('button', { class: cls, type: 'button', 'aria-pressed': 'false', onclick: () => onPick(k) },
      cls === 'choice' ? h('span', { class: 'k' }, String(k + 1)) : null, h('span', { html: t })));
  }
  function wMC(q, ctx) {
    const order = shuffle(q.c.map((_, i) => i)); let sel = null;
    const box = h('div', { class: 'choices' });
    const btns = choiceButtons(order.map((i) => q.c[i]), (k) => { sel = order[k]; btns.forEach((b, j) => b.setAttribute('aria-pressed', j === k)); sfx.tap(); ctx.ready(true); });
    box.append(...btns);
    return {
      el: box, check: () => ({ ok: sel === q.a, answer: q.c[q.a] }),
      reveal: () => { box.classList.add('locked'); btns.forEach((b, k) => { if (order[k] === q.a) b.classList.add('right'); else if (order[k] === sel) b.classList.add('wrong'); }); },
      key: (n) => btns[n - 1] && btns[n - 1].click(),
    };
  }
  function wTF(q, ctx) {
    let sel = null;
    const box = h('div', { class: 'choices tfrow' });
    const btns = choiceButtons(['True', 'False'], (k) => { sel = k === 0; btns.forEach((b, j) => b.setAttribute('aria-pressed', j === k)); sfx.tap(); ctx.ready(true); });
    btns.forEach((b) => b.querySelector('.k').remove());
    box.append(...btns);
    return {
      el: box, check: () => ({ ok: sel === q.a, answer: q.a ? 'True' : 'False' }),
      reveal: () => { box.classList.add('locked'); btns.forEach((b, k) => { const v = k === 0; if (v === q.a) b.classList.add('right'); else if (v === sel) b.classList.add('wrong'); }); },
      key: (n) => btns[n - 1] && btns[n - 1].click(),
    };
  }
  function wCloze(q, ctx, passageEl) {
    const order = shuffle(q.c.map((_, i) => i)); let sel = null;
    const blank = passageEl.querySelector('.blank');
    const row = h('div', { class: 'chips' });
    const tiles = order.map((i, k) => h('button', { class: 'tile', type: 'button', onclick: () => {
      sel = i; tiles.forEach((t, j) => t.classList.toggle('sel', j === k));
      blank.textContent = q.c[i]; blank.classList.add('filled'); sfx.tap(); ctx.ready(true);
    } }, q.c[i]));
    row.append(...tiles);
    return {
      el: row, check: () => ({ ok: sel === q.a, answer: q.c[q.a] }),
      reveal: () => { row.style.pointerEvents = 'none'; tiles.forEach((t, k) => { if (order[k] === q.a) t.classList.add('right'); else if (order[k] === sel) t.classList.add('wrong'); }); },
      key: (n) => tiles[n - 1] && tiles[n - 1].click(),
    };
  }
  function punctSentence(q, m) {
    const none = m === '(no punctuation)';
    return `${q.before}${none ? '' : m}${m === '—' ? '' : ' '}${q.after}`;
  }
  function wPunct(q, ctx) {
    const order = shuffle(q.c.map((_, i) => i)); let sel = null;
    const slot = h('span', { class: 'slot empty' }, '?');
    const after = h('span', {}, ' ' + q.after);
    const line = h('div', { class: 'punctline' }, q.before, slot, after);
    const marks = h('div', { class: 'marks' });
    const label = (m) => (m === '(no punctuation)' ? 'no mark' : m.trim());
    const tiles = order.map((i, k) => h('button', { class: 'tile', type: 'button', 'aria-label': q.c[i], onclick: () => {
      sel = i; tiles.forEach((t, j) => t.classList.toggle('sel', j === k));
      const m = q.c[i];
      slot.textContent = m === '(no punctuation)' ? '∅' : m.trim(); slot.classList.toggle('empty', m === '(no punctuation)');
      after.textContent = (m === '—' ? '' : ' ') + q.after;
      sfx.tap(); ctx.ready(true);
    } }, label(q.c[i])));
    marks.append(...tiles);
    return {
      el: h('div', { class: 'stack' }, line, marks), check: () => ({ ok: sel === q.a, answer: punctSentence(q, q.c[q.a]) }),
      reveal: () => { marks.style.pointerEvents = 'none'; tiles.forEach((t, k) => { if (order[k] === q.a) t.classList.add('right'); else if (order[k] === sel) t.classList.add('wrong'); }); },
      key: (n) => tiles[n - 1] && tiles[n - 1].click(),
    };
  }
  function parseNum(s) {
    if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(s)) { const [a, b] = s.split('/').map(Number); return b ? a / b : NaN; }
    return /^-?\d*\.?\d+$/.test(s) ? Number(s) : NaN;
  }
  const norm = (s) => String(s).toLowerCase().replace(/−/g, '-').replace(/[\s$,%]/g, '');
  function wInput(q, ctx) {
    const inp = h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': 'Your answer', placeholder: 'Your answer', id: 'answer-input' });
    inp.addEventListener('input', () => ctx.ready(inp.value.trim().length > 0));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && inp.value.trim()) { e.preventDefault(); e.stopPropagation(); ctx.submit(); } });
    setTimeout(() => inp.focus(), 220);
    return {
      el: h('div', { class: 'answerin' }, inp),
      check: () => {
        const v = norm(inp.value), n = parseNum(v);
        const ok = q.a.some((a) => { const an = norm(a); return an === v || (!isNaN(n) && Math.abs(parseNum(an) - n) < 1e-9); });
        return { ok, answer: q.a[0] };
      },
      reveal: (ok) => { inp.disabled = true; inp.style.borderColor = ok ? 'var(--good)' : 'var(--bad)'; },
      typing: true,
    };
  }
  function wTap(q, ctx) {
    let sel = null;
    const wrap = h('div', { class: 'segtext' });
    const btns = q.segs.map((t, k) => h('button', { class: 'seg-s', type: 'button', onclick: () => { sel = k; btns.forEach((b, j) => b.classList.toggle('sel', j === k)); sfx.tap(); ctx.ready(true); } }, t));
    btns.forEach((b, k) => { wrap.append(b); if (k < btns.length - 1) wrap.append(' '); });
    return {
      el: wrap, check: () => ({ ok: sel === q.a, answer: q.segs[q.a] }),
      reveal: () => { wrap.style.pointerEvents = 'none'; btns.forEach((b, k) => { b.classList.remove('sel'); if (k === q.a) b.classList.add('right'); else if (k === sel) b.classList.add('wrong'); }); },
    };
  }
  function wMatch(q, ctx) {
    const n = q.pairs.length, L = shuffle([...Array(n).keys()]), R = shuffle([...Array(n).keys()]);
    let sel = null, matched = 0, mistakes = 0;
    const colL = h('div', { class: 'col' }), colR = h('div', { class: 'col' });
    const mk = (side, i) => h('button', { class: 'tile', type: 'button', 'data-side': side, 'data-i': i, onclick: (e) => tapTile(e.currentTarget, side, i) }, q.pairs[i][side === 'L' ? 0 : 1]);
    colL.append(...L.map((i) => mk('L', i))); colR.append(...R.map((i) => mk('R', i)));
    function tapTile(el, side, i) {
      if (!sel || sel.side === side) { if (sel) sel.el.classList.remove('sel'); sel = { el, side, i }; el.classList.add('sel'); sfx.tap(); return; }
      const a = sel; sel = null; a.el.classList.remove('sel');
      if (a.i === i) {
        a.el.classList.add('done'); el.classList.add('done'); matched++; tone([700 + matched * 60], 'sine', 0.08, 0, 0.04);
        if (matched === n) setTimeout(() => ctx.auto(mistakes === 0, q.pairs.map((p) => `${p[0]} → ${p[1]}`).join('; ')), 350);
      } else {
        mistakes++; sfx.no();
        [a.el, el].forEach((x) => { x.classList.remove('miss'); void x.offsetWidth; x.classList.add('miss'); setTimeout(() => x.classList.remove('miss'), 400); });
      }
    }
    return { el: h('div', { class: 'matchgrid' }, colL, colR), check: () => ({ ok: mistakes === 0, answer: '' }), reveal: () => {}, auto: true };
  }
  function wSort(q, ctx) {
    const order = shuffle([...q.items.keys()]); const place = new Map(); let sel = null;
    const pool = h('div', { class: 'chips' });
    const bins = q.bins.map((name, b) => {
      const list = h('div', { class: 'stack' });
      const head = h('button', { class: 'binhead', type: 'button', onclick: () => drop(b) }, name);
      const el = h('div', { class: 'bin', onclick: (e) => { if (e.target === el) drop(b); } }, head, list);
      return { el, list, head };
    });
    function drop(b) { if (sel == null) return; place.set(sel, b); sel = null; sfx.tap(); draw(); }
    function tile(i) {
      return h('button', { class: 'tile' + (sel === i ? ' sel' : ''), type: 'button', 'data-i': i, onclick: () => {
        if (place.has(i)) { place.delete(i); sel = null; } else sel = sel === i ? null : i;
        sfx.tap(); draw();
      } }, q.items[i][0]);
    }
    function draw() {
      pool.replaceChildren(...order.filter((i) => !place.has(i)).map(tile));
      bins.forEach((bn, b) => { bn.list.replaceChildren(...order.filter((i) => place.get(i) === b).map(tile)); bn.el.classList.toggle('target', sel != null); });
      if (!pool.children.length) pool.append(h('span', { class: 'muted' }, 'All sorted. Tap a card to move it back.'));
      ctx.ready(place.size === q.items.length);
    }
    draw();
    return {
      el: h('div', { class: 'stack' }, h('p', { class: 'muted', style: 'margin:0' }, 'Tap a card, then tap a group.'), pool, h('div', { class: 'bins' }, ...bins.map((b) => b.el))),
      check: () => ({ ok: q.items.every((it, i) => place.get(i) === it[1]), answer: q.bins.map((b, bi) => `${b}: ${q.items.filter((it) => it[1] === bi).map((it) => it[0]).join(', ')}`).join(' | ') }),
      reveal: () => {
        bins.forEach((bn) => { bn.el.style.pointerEvents = 'none'; bn.list.querySelectorAll('.tile').forEach((t) => { const i = +t.dataset.i; t.classList.add(q.items[i][1] === place.get(i) ? 'right' : 'wrong'); }); });
      },
    };
  }
  function wOrder(q, ctx) {
    const n = q.tiles.length; let order = shuffle([...Array(n).keys()]);
    if (order.every((v, i) => v === i)) order = order.reverse();
    const ans = [];
    const line = h('div', { class: 'orderline' }), pool = h('div', { class: 'orderpool' });
    function draw() {
      line.replaceChildren(...(ans.length ? ans.map((i, k) => h('button', { class: 'tile', type: 'button', 'data-i': i, onclick: () => { ans.splice(k, 1); sfx.tap(); draw(); } }, h('span', { class: 'n' }, String(k + 1)), h('span', {}, q.tiles[i]))) : [h('span', { class: 'muted' }, 'Tap the pieces below in order.')]));
      pool.replaceChildren(...order.filter((i) => !ans.includes(i)).map((i) => h('button', { class: 'tile', type: 'button', onclick: () => { ans.push(i); sfx.tap(); draw(); } }, q.tiles[i])));
      ctx.ready(ans.length === n);
    }
    draw();
    return {
      el: h('div', { class: 'stack' }, line, pool), check: () => ({ ok: ans.every((v, i) => v === i), answer: q.tiles.map((t, i) => `${i + 1}. ${t}`).join('  ') }),
      reveal: () => { line.style.pointerEvents = 'none'; [...line.children].forEach((t, k) => t.classList.add(ans[k] === k ? 'right' : 'wrong')); },
    };
  }

  /* ============================================================ LESSON */
  let L = null;
  const PRAISE = ['Nice!', 'Correct!', 'You got it.', 'Sharp reading.', 'Exactly right.', 'Great work!', 'Nailed it.'];
  const OOPS = ['Not quite.', 'Almost.', 'Close, but not it.', 'Good try.'];

  function startLesson(mode, sid) {
    closeSheet();
    syncHearts();
    if (mode !== 'speed' && S.settings.hearts && S.hearts <= 0) { heartsSheet(); return; }
    const queue = buildQueue(mode, sid);
    if (!queue.length) { if (mode === 'skill') skillSheet(sid); else toast('Nothing is ready in that mode right now.', I.clock); return; }
    L = { mode, sid, queue, total: queue.length, idx: 0, done: 0, retried: new Set(), first: new Map(), combo: 0, maxCombo: 0, xp: 0, start: Date.now(), state: 'answer', speedScore: 0, ended: false };
    if (mode === 'speed') L.speedEnd = Date.now() + SPEED_SECS * 1000;
    if (mode === 'skill' && !S.tried.includes(sid)) S.tried.push(sid);
    buildLessonShell();
    showQuestion();
  }

  function buildLessonShell() {
    const el = h('div', { class: 'lesson', id: 'lesson', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Lesson' });
    el.innerHTML = `
      <div class="lesson-top">
        <button class="iconbtn" data-act="quit" aria-label="Quit lesson">${I.close}</button>
        <div class="bar" role="progressbar" aria-label="Lesson progress"><i style="width:0%"></i></div>
        <div id="lstat"></div>
      </div>
      <div class="lesson-body" id="lbody"></div>
      <div class="lesson-foot" id="lfoot"></div>`;
    document.body.append(el);
    document.body.style.overflow = 'hidden'; document.body.classList.add('in-lesson');
    updateLessonTop();
    if (L.mode === 'speed') L.timer = setInterval(updateLessonTop, 250);
  }
  function updateLessonTop() {
    if (!L) return;
    const bar = $('#lesson .bar > i'), st = $('#lstat');
    if (L.mode === 'speed') {
      const left = Math.max(0, L.speedEnd - Date.now());
      bar.style.width = `${100 - (left / (SPEED_SECS * 1000)) * 100}%`;
      st.innerHTML = `<span class="timer num">${Math.ceil(left / 1000)}s</span>`;
      if (left <= 0 && L.state === 'answer' && !L.ended) finishLesson();
    } else {
      bar.style.width = `${(L.done / L.total) * 100}%`;
      st.innerHTML = S.settings.hearts ? `<span class="hearts" aria-label="${S.hearts} hearts">${I.heart}<span>${S.hearts}</span></span>` : `<span class="hearts" aria-label="Unlimited hearts">${I.heart}<span>∞</span></span>`;
    }
  }

  function showQuestion() {
    const q = L.queue[L.idx], body = $('#lbody'), foot = $('#lfoot');
    L.state = 'answer'; L.q = q;
    const skill = SKMAP[q.s], unit = UNMAP[skill.unit];
    const wrap = h('div', { class: 'qwrap' });
    const retry = L.retried.has(q.id) && L.first.has(q.id);
    wrap.append(h('div', { class: 'qtype' }, h('span', { class: 'kind' }, KIND[q.t]),
      h('span', { class: 'chip', style: `background:var(--${unit.color});color:#fff` }, skill.name),
      retry ? h('span', { class: 'chip' }, 'Second try') : null,
      q.src === 'pt1' ? h('span', { class: 'chip' }, `Practice Test 1 \u00b7 Q${q.tq}`) : null,
      q.missed ? h('span', { class: 'chip', style: 'background:var(--hl);color:var(--on-hl)' }, 'You missed this on the test') : null));
    if (q.tbl) wrap.append(h('div', { html: tableHTML(q.tbl) }));
    if (q.bars) wrap.append(h('div', { html: barsHTML(q.bars) }));
    if (q.graph) wrap.append(h('div', { html: graphHTML(q.graph) }));
    let passageEl = null;
    if (q.t === 'cloze') {
      passageEl = h('div', { class: 'passage', html: q.p.replace('___', '<span class="blank" aria-label="blank">&nbsp;</span>') });
      wrap.append(passageEl, h('div', { class: 'prompt' }, 'Which choice completes the text most logically and precisely?'));
    } else {
      if (q.p) wrap.append(h('div', { class: 'passage', html: q.p }));
      if (q.t === 'punct') wrap.append(h('div', { class: 'prompt' }, 'Which choice completes the text so that it follows the conventions of Standard English?'));
      else if (q.q) wrap.append(h('div', { class: 'prompt', html: q.q }));
    }
    const ctx = {
      ready: (on) => { const b = $('#checkbtn'); if (b) b.disabled = !on; },
      submit: () => onCheck(),
      auto: (ok, answer) => resolve(ok, answer),
    };
    const W = { mc: wMC, tf: wTF, cloze: wCloze, punct: wPunct, input: wInput, tap: wTap, match: wMatch, sort: wSort, order: wOrder }[q.t];
    L.w = W(q, ctx, passageEl);
    wrap.append(L.w.el);
    const old = body.querySelector('.qwrap');
    if (old && !calm()) { old.classList.add('qout'); setTimeout(() => { if (L && L.q === q) { body.replaceChildren(wrap); body.scrollTop = 0; } }, 150); }
    else { body.replaceChildren(wrap); body.scrollTop = 0; }
    foot.className = 'lesson-foot';
    foot.innerHTML = L.w.auto
      ? `<div class="inner"><button class="btn ghost" data-act="skipmatch">Can’t do this now</button></div>`
      : `<div class="inner"><button class="btn" id="checkbtn" data-act="check" disabled>Check</button></div>`;
    updateLessonTop();
  }

  function onCheck() {
    if (!L || L.state !== 'answer' || !L.w) return;
    const b = $('#checkbtn'); if (b && b.disabled) return;
    const { ok, answer } = L.w.check();
    resolve(ok, answer);
  }

  function resolve(ok, answer) {
    if (!L || L.state !== 'answer') return;
    if (L.mode === 'speed' && Date.now() > L.speedEnd) { finishLesson(); return; }
    L.state = 'feedback';
    const q = L.q, first = !L.first.has(q.id);
    if (first) {
      L.first.set(q.id, ok); grade(q, ok); S.totalAnswered++;
      if (ok) { S.totalCorrect++; S.daily.correct++; if (MATH.has(q.s)) S.daily.math++; }
    }
    L.w.reveal(ok);
    if (ok) {
      L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo);
      L.xp += (first ? 2 : 1) + (L.combo >= 3 ? 1 : 0);
      L.done++; if (L.mode === 'speed') L.speedScore++;
      sfx.ok();
      restart($('#lesson .bar'), 'shine');
      xpFloat(`+${(first ? 2 : 1) + (L.combo >= 3 ? 1 : 0)} XP`);
      if ([3, 5, 10, 15].includes(L.combo)) comboFlash(L.combo);
    } else {
      L.combo = 0; sfx.no();
      if (L.mode !== 'speed') {
        loseHeart(); L.lostHeart = S.settings.hearts;
        if (!L.retried.has(q.id)) { L.retried.add(q.id); L.queue.push(q); } else L.done++;
      }
    }
    S.daily.bestCombo = Math.max(S.daily.bestCombo, L.combo);
    S.bestComboEver = Math.max(S.bestComboEver, L.combo);
    save();
    updateLessonTop();
    if (L.lostHeart) {
      L.lostHeart = false;
      const hb = $('#lstat .hearts'); restart(hb, 'lose');
      if (hb && !calm()) { const m = h('span', { class: 'minus' }, '\u22121'); hb.append(m); setTimeout(() => m.remove(), 1000); }
    }
    const foot = $('#lfoot');
    foot.className = 'lesson-foot ' + (ok ? 'ok' : 'no');
    const willRetry = !ok && L.mode !== 'speed' && L.queue.lastIndexOf(q) > L.idx;
    foot.innerHTML = `
      <div class="verdict" role="status" aria-live="assertive">
        ${mascot(ok ? 'happy' : 'sad')}
        <div>
          <h3>${ok ? pick(PRAISE) : pick(OOPS)}</h3>
          ${!ok && answer ? `<p class="ans">Correct answer: ${esc(strip(answer))}</p>` : ''}
          <p>${esc(q.e)}</p>
          ${willRetry ? '<p class="muted">You’ll see this one again at the end of the lesson.</p>' : ''}
        </div>
      </div>
      <div class="inner"><button class="btn ${ok ? 'good' : 'bad'}" data-act="continue" id="contbtn">Continue</button></div>`;
    setTimeout(() => { const c = $('#contbtn'); if (c) c.focus({ preventScroll: true }); }, 30);
  }

  function xpFloat(text) {
    if (calm()) return;
    const b = $('#checkbtn') || $('#lfoot .inner'); if (!b) return;
    const r = b.getBoundingClientRect();
    const el = h('div', { class: 'xpfloat', style: `left:${r.left + r.width / 2 - 30}px;top:${r.top - 34}px` }, text);
    document.body.append(el); setTimeout(() => el.remove(), 1000);
  }
  function comboFlash(n) {
    const top = $('#lesson .lesson-top'); if (!top) return;
    const el = h('div', { class: 'combo', html: `${I.flame}<span>${n} in a row!</span>` }); top.style.position = 'relative'; top.append(el);
    setTimeout(() => el.remove(), 1300);
  }

  function onContinue() {
    if (!L || L.state !== 'feedback') return;
    if (L.mode === 'speed' && Date.now() >= L.speedEnd) { finishLesson(); return; }
    if (L.mode !== 'speed' && S.settings.hearts && S.hearts <= 0) { finishLesson(true); return; }
    L.idx++;
    if (L.idx >= L.queue.length) finishLesson(); else showQuestion();
  }

  function finishLesson(outOfHearts = false) {
    if (!L || L.ended) return;
    L.ended = true;
    clearInterval(L.timer);
    const answered = L.first.size;
    const right = [...L.first.values()].filter(Boolean).length;
    const perfect = !outOfHearts && answered > 0 && right === answered && L.mode !== 'speed';
    const completed = !outOfHearts && answered > 0;
    let xp = L.xp + (completed ? 5 : 0) + (perfect ? 5 : 0);
    let gems = completed ? 5 + (perfect ? 5 : 0) : 0;
    if (L.mode === 'speed') { xp = L.speedScore * 2 + (L.speedScore >= 8 ? 5 : 0); gems = L.speedScore >= 8 ? 5 : 0; S.bestSpeed = Math.max(S.bestSpeed, L.speedScore); }
    const extended = addXP(xp);
    S.gems += gems;
    if (completed) { S.lessons++; S.daily.lessons++; }
    if (perfect) { S.perfects++; S.daily.perfect++; }
    if (completed && L.mode === 'mistakes') S.mistakeRuns++;
    checkQuests(); checkAch(); save();
    const secs = Math.round((Date.now() - L.start) / 1000);
    const acc = answered ? Math.round((right / answered) * 100) : 0;
    const body = $('#lbody'), foot = $('#lfoot');
    $('#lesson .bar > i').style.width = '100%';
    let title = 'Lesson complete!', mood = 'happy', sub = '';
    if (outOfHearts) { title = 'Out of hearts'; mood = 'sad'; sub = `Your answers were saved. Hearts refill one every 20 minutes, or you can refill them in the shop.`; }
    else if (L.mode === 'speed') { title = `Time! You scored ${L.speedScore}`; mood = L.speedScore >= 8 ? 'wow' : 'happy'; sub = S.bestSpeed === L.speedScore && L.speedScore > 0 ? 'That’s your best Speed Round yet.' : `Best so far: ${S.bestSpeed}`; }
    else if (perfect) { title = 'Perfect lesson!'; mood = 'wow'; sub = 'No mistakes. +5 bonus XP and +5 bonus gems.'; }
    else if (answered && acc < 60) { sub = 'The ones you missed come back in about 10 minutes, so you can try them again soon.'; }
    body.innerHTML = `<div class="done">${mascot(mood)}
      <h1>${esc(title)}</h1>${sub ? `<p class="muted" style="margin:0">${esc(sub)}</p>` : ''}
      <div class="kv"><div><b data-count="${xp}" data-prefix="+">+${xp}</b><span>XP</span></div><div><b>${L.mode === 'speed' ? L.speedScore : acc + '%'}</b><span>${L.mode === 'speed' ? 'Correct' : 'Accuracy'}</span></div><div><b>${Math.floor(secs / 60)}:${pad(secs % 60)}</b><span>Time</span></div></div>
      <div class="kv"><div><b data-count="${L.maxCombo}">${L.maxCombo}</b><span>Best combo</span></div><div><b data-count="${gems}" data-prefix="+">+${gems}</b><span>Gems</span></div><div><b>${S.daily.xp}/${S.settings.goal}</b><span>Daily goal</span></div></div>
    </div>`;
    body.querySelectorAll('[data-count]').forEach((el, i) => { const n = +el.dataset.count, p = el.dataset.prefix || ''; el.textContent = p + '0'; setTimeout(() => countUp(el, n, 800, p), 350 + i * 120); });
    foot.className = 'lesson-foot';
    foot.innerHTML = `<div class="inner"><button class="btn" data-act="${extended ? 'streakscreen' : 'endlesson'}" id="contbtn">Continue</button></div>`;
    if (!outOfHearts) { sfx.win(); if (perfect || L.mode === 'speed' && L.speedScore >= 8) confetti(); }
    setTimeout(() => { const c = $('#contbtn'); if (c) c.focus({ preventScroll: true }); }, 30);
  }

  function streakScreen() {
    const body = $('#lbody'), foot = $('#lfoot');
    body.innerHTML = `<div class="done"><div class="bigflame">${I.flame}</div><div class="bigcount num">${Math.max(0, S.streak - 1)}</div>
      <h1>${S.streak === 1 ? 'Streak started!' : `${S.streak}-day streak!`}</h1>
      <p class="muted" style="margin:0">You hit today’s goal. Come back tomorrow to keep it going.</p>
      <div class="card" style="width:100%">${weekStrip()}</div></div>`;
    foot.innerHTML = `<div class="inner"><button class="btn hl" data-act="endlesson" id="contbtn">Keep going</button></div>`;
    sfx.streak();
    setTimeout(() => { const c = $('.bigcount'); if (c) { c.textContent = S.streak; restart(c, 'pop'); } confetti(); }, calm() ? 0 : 650);
  }

  function endLesson() {
    if (L) clearInterval(L.timer);
    L = null;
    const el = $('#lesson'); if (el) el.remove();
    document.body.style.overflow = ''; document.body.classList.remove('in-lesson');
    renderView();
  }

  /* ============================================================ SHEETS */
  function openSheet(html, uc) {
    closeSheet();
    const scrim = h('div', { class: 'scrim', id: 'sheet', onclick: (e) => { if (e.target === scrim) closeSheet(); } });
    const sh = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', html });
    if (uc) sh.style.setProperty('--uc', uc);
    scrim.append(sh); document.body.append(scrim);
    const f = sh.querySelector('button.btn, button'); if (f) f.focus({ preventScroll: true });
  }
  function closeSheet() { const s = $('#sheet'); if (s) s.remove(); }

  function skillSheet(sid) {
    const sk = SKMAP[sid], u = UNMAP[sk.unit], st = skillStats(sid);
    const ready = Math.min(st.ready, LESSON_LEN);
    const body = st.ready > 0
      ? `<button class="btn block" data-act="start" data-skill="${sid}">Start lesson · ${ready} question${ready === 1 ? '' : 's'}</button>`
      : `<div class="tipline">${I.clock.replace('<svg', '<svg style="width:18px;height:18px;vertical-align:-3px;margin-right:6px"')}You’ve answered everything here for now. The next question unlocks ${esc(fmtWhen(st.next))} (in ${fmtDur(st.next - Date.now())}).</div>
         <button class="btn ghost block" data-act="go" data-view="practice">Try another mode</button>`;
    openSheet(`
      <div class="top"><div class="icon">${esc(sk.icon)}</div><div><div class="eyebrow">${esc(u.name)}</div><h2>${esc(sk.name)}</h2></div></div>
      <div class="kv"><div><b>${st.ready}</b><span>Ready now</span></div><div><b>${st.mast}/${st.total}</b><span>Mastered</span></div><div><b>${st.acc == null ? '–' : Math.round(st.acc * 100) + '%'}</b><span>Accuracy</span></div></div>
      <div class="bar good" aria-label="Skill mastery"><i style="width:${Math.round(st.pct * 100)}%"></i></div>
      <div class="tipline"><b>Tip:</b> ${esc(sk.tip)}</div>
      ${body}
      <p class="muted" style="margin:0;font-size:14px">Questions you get right rest for 1 day, then 3, 7, 16, and 35 days. Missed questions come back after 10 minutes.</p>`, `var(--${u.color})`);
  }
  function heartsSheet() {
    const can = S.gems >= 30;
    openSheet(`<div class="top"><div class="icon" style="background:var(--heart)">${I.heart.replace('<svg', '<svg style="width:30px;height:30px"')}</div><div><h2>You’re out of hearts</h2><p class="muted" style="margin:2px 0 0">Next heart in ${fmtDur(HEART_MS - (Date.now() - S.heartsAt))}.</p></div></div>
      <button class="btn block" data-act="buy" data-item="hearts" ${can ? '' : 'disabled'}>Refill hearts · 30 gems</button>
      <button class="btn ghost block" data-act="hearts-off">Turn on unlimited hearts</button>
      <p class="muted" style="margin:0;font-size:14px">Unlimited hearts can be switched back off any time in Settings.</p>`);
  }
  function quitSheet() {
    openSheet(`<h2>Quit this lesson?</h2><p class="muted" style="margin:0">Answers you already gave are saved, but you won’t get the completion bonus.</p>
      <button class="btn block" data-act="closesheet">Keep going</button><button class="btn ghost block" data-act="quitnow">Quit</button>`);
  }

  /* ============================================================ VIEWS */
  const VIEWS = [
    { id: 'learn', label: 'Learn', icon: I.learn },
    { id: 'practice', label: 'Practice', icon: I.practice },
    { id: 'quests', label: 'Quests', icon: I.quests },
    { id: 'profile', label: 'Profile', icon: I.profile },
    { id: 'shop', label: 'Shop', icon: I.shop },
    { id: 'prefs', label: 'Settings', icon: I.gear },
  ];
  const curView = () => { const v = (location.hash || '').slice(1); return VIEWS.some((x) => x.id === v) ? v : 'learn'; };

  function shell() {
    const app = $('#app');
    app.innerHTML = `
      <div class="shell">
        <nav class="rail" aria-label="Main">
          <div class="brand">${mascot('happy', S.hat, 'mascot')}<span>Inkwell</span></div>
          ${VIEWS.map((v) => `<button class="tab" data-act="go" data-view="${v.id}">${v.icon}<span>${v.label}</span></button>`).join('')}
        </nav>
        <main class="main">
          <div class="topbar"><div class="brand">${mascot('happy', S.hat, 'mascot')}<span>Inkwell</span></div><div class="stats" id="stats"></div></div>
          <div class="wrap" id="view"></div>
        </main>
        <aside class="aside" id="aside" aria-label="Today"></aside>
      </div>
      <nav class="tabbar" aria-label="Main">${VIEWS.filter((v) => v.id !== 'prefs').map((v) => `<button class="tab" data-act="go" data-view="${v.id}">${v.icon}<span>${v.label}</span></button>`).join('')}</nav>`;
  }

  function statsHTML() {
    syncHearts();
    const v = curView();
    return `<span class="stat flame ${S.streak ? '' : 'off'}" title="Day streak">${I.flame}<span>${S.streak}</span><span class="sr"> day streak</span></span>
      <span class="stat gem" title="Gems">${I.gem}<span>${S.gems}</span><span class="sr"> gems</span></span>
      <span class="stat heart" title="Hearts">${I.heart}<span>${S.settings.hearts ? S.hearts : '∞'}</span><span class="sr"> hearts</span></span>
      <button class="iconbtn" data-act="go" data-view="prefs" aria-label="Settings" style="${v === 'prefs' ? 'color:var(--brand)' : ''}">${I.gear}</button>`;
  }

  function goalRing(size = 76) {
    const pct = Math.min(1, S.daily.xp / S.settings.goal), r = 30, C = 2 * Math.PI * r;
    return `<svg viewBox="0 0 76 76" width="${size}" height="${size}" role="img" aria-label="${S.daily.xp} of ${S.settings.goal} XP today">
      <circle cx="38" cy="38" r="${r}" fill="none" style="stroke:var(--surface-2)" stroke-width="9"/>
      <circle cx="38" cy="38" r="${r}" fill="none" style="stroke:${pct >= 1 ? 'var(--good)' : 'var(--hl)'}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 38 38)" class="ringfill" style="--c:${C}"/>
      <text x="38" y="43" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--ink);font-family:var(--f-mono)">${Math.round(pct * 100)}%</text></svg>`;
  }
  function weekStrip() {
    const t = dayKey(), labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let out = '';
    for (let i = -6; i <= 0; i++) {
      const k = addDays(t, i), st = S.days[k], d = keyDate(k);
      out += `<div class="d ${st || ''} ${i === 0 ? 'today' : ''}"><span>${labels[d.getDay()]}</span><span class="dot">${st === 'goal' ? I.flame : st === 'frozen' ? I.snow : ''}</span></div>`;
    }
    return `<div class="week" aria-label="Last 7 days">${out}</div>`;
  }
  function todayCard() {
    return `<div class="card goalring">${goalRing()}<div><div class="eyebrow">Daily goal</div><h3>${S.daily.xp} / ${S.settings.goal} XP</h3><p class="muted" style="margin:2px 0 0;font-size:14px">${goalMet() ? 'Goal reached. Your streak is safe today.' : `${S.settings.goal - S.daily.xp} XP to go. About ${Math.max(1, Math.ceil((S.settings.goal - S.daily.xp) / 20))} lesson${Math.ceil((S.settings.goal - S.daily.xp) / 20) > 1 ? 's' : ''}.`}</p></div></div>`;
  }
  function questsCard() {
    const qs = todaysQuests();
    return `<div class="card"><div class="row between"><h2>Daily quests</h2><span class="chip">${S.daily.claimed.length}/3</span></div>
      ${qs.map((q) => { const p = Math.min(S.daily[q.key] || 0, q.goal), done = S.daily.claimed.includes(q.id);
        return `<div class="quest ${done ? 'done' : ''}"><span style="font-weight:700">${esc(q.label)}</span><span class="reward">${done ? I.check : I.gem}${done ? 'Done' : '+' + q.reward}</span><div class="bar"><i style="width:${(p / q.goal) * 100}%"></i></div><span class="muted num" style="font-size:13px">${p} / ${q.goal}</span></div>`; }).join('')}
      <p class="muted" style="margin:6px 0 0;font-size:13px">New quests every day at midnight.</p></div>`;
  }
  function streakCard() {
    return `<div class="card stack"><div class="row between"><div class="row" style="gap:8px"><span style="width:28px;height:28px;color:var(--flame);display:inline-block">${I.flame}</span><h2>${S.streak} day streak</h2></div><span class="chip" title="Streak freezes">${I.snow.replace('<svg', '<svg style="width:14px;height:14px"')} ${S.freezes}/2</span></div>
      ${weekStrip()}<p class="muted" style="margin:0;font-size:13px">Best: ${S.best} days. A streak freeze covers a missed day automatically.</p></div>`;
  }
  function asideHTML() { return todayCard() + questsCard() + streakCard(); }

  function noticeCard() {
    if (!S.notice) return '';
    const n = S.notice;
    const msg = n.type === 'lost' ? `Your ${n.n}-day streak ended. Start a new one today; one lesson is enough.` : `A streak freeze covered ${n.n === 1 ? 'yesterday' : `${n.n} missed days`}. Your streak is safe.`;
    return `<div class="banner">${n.type === 'lost' ? I.flame : I.snow}<span>${esc(msg)}</span><button class="linkbtn" data-act="dismiss">OK</button></div>`;
  }
  function reminderBanner() {
    if (!reminderDue()) return '';
    return `<div class="banner">${I.bell}<span><b>${S.streak ? `Keep your ${S.streak}-day streak alive.` : 'Time for today’s practice.'}</b> ${S.settings.goal - S.daily.xp} XP to reach your goal before midnight.</span><button class="btn small hl" data-act="quick">Start</button></div>`;
  }
  function welcomeCard() {
    if (S.welcomed) return '';
    return `<div class="card hello">${mascot('wow', S.hat, 'mascot idle')}<div><div class="eyebrow">Welcome to Inkwell</div><h2>Hi, I’m Dot. Let’s get you PSAT-ready.</h2>
      <p class="muted" style="margin:4px 0 0">Short lessons, every question type on the test, and questions you’ve answered rest for a while before they come back. Pick a daily goal:</p>
      <div class="goalpick">${[[10, 'Casual'], [20, 'Regular'], [30, 'Serious'], [50, 'Intense']].map(([g, n]) => `<button data-act="goal" data-goal="${g}" aria-pressed="${S.settings.goal === g}">${n} · ${g} XP</button>`).join('')}</div>
      <div class="row" style="margin-top:12px;flex-wrap:wrap"><button class="btn" data-act="start" data-skill="voc">Start the first lesson</button><button class="linkbtn" data-act="welcomed">Just look around</button></div></div></div>`;
  }

  function nodeHTML(sk, uc, i = 0, isNext = false) {
    const st = skillStats(sk.id), r = 38, C = 2 * Math.PI * r;
    const badge = st.ready > 0 ? `<span class="badge" title="${st.ready} ready">${st.ready}</span>` : `<span class="badge clock" title="Next unlock in ${fmtDur(st.next - Date.now())}">${I.clock}</span>`;
    return `<div class="node-row" style="--i:${i}"><button class="node ${st.ready ? '' : 'rest'} ${isNext ? 'next' : ''}" data-act="skill" data-skill="${sk.id}" style="--uc:var(--${uc})" aria-label="${esc(sk.name)}: ${st.ready} ready, ${Math.round(st.pct * 100)}% mastered">
      <span class="disc"><svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--surface-2)" stroke-width="5"/><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--hl)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - st.pct)}" transform="rotate(-90 42 42)" class="ringfill" style="--c:${C}"/></svg>${isNext ? `<span class="starttip">${S.tried.includes(sk.id) ? 'Next' : 'Start'}</span>` : ''}
      <span class="face">${esc(sk.icon)}</span>${badge}</span>
      <span class="label">${esc(sk.name)}</span></button></div>`;
  }

  function viewLearn() {
    const due = reviewPool().filter((q) => isReady(q)).length;
    let html = welcomeCard() + noticeCard() + reminderBanner();
    html += `<div class="aside-hide-wide">${todayCard()}</div>`;
    if (due > 0) html += `<div class="banner" style="background:var(--surface);border-color:var(--line)">${I.redo.replace('<svg', '<svg style="color:var(--brand)"')}<span><b>${due} question${due === 1 ? ' is' : 's are'} ready for review.</b> Reviewing at the right time is how answers stick.</span><button class="btn small" data-act="mode" data-mode="review">Review</button></div>`;
    const nextSk = SK.find((s) => skillStats(s.id).ready > 0);
    let ni = 0;
    UN.forEach((u, ui) => {
      const skills = SK.filter((s) => s.unit === u.id);
      html += `<section class="unit" style="--uc:var(--${u.color})" aria-label="${esc(u.name)}">
        <div class="unit-head"><div><div class="eyebrow">Unit ${ui + 1} · ${ui < 5 ? 'Reading & Writing' : 'Math'}</div><h2>${esc(u.name)}</h2><p>${esc(u.blurb)}</p></div><div class="unit-num">${ui + 1}</div></div>
        <div class="path">${skills.map((s) => nodeHTML(s, u.color, ni++, nextSk && s.id === nextSk.id)).join('')}</div></section>`;
    });
    return html;
  }

  function viewPractice() {
    const mist = mistakesPool(), mr = mist.filter((q) => isReady(q)).length;
    const rv = reviewPool(), rr = rv.filter((q) => isReady(q)).length;
    const up = upcoming();
    const mode = (id, color, icon, title, desc, n, disabledMsg) => `<button class="mode" data-act="mode" data-mode="${id}" ${n ? '' : 'disabled'}>
      <span class="icon" style="background:${color}">${icon}</span><span><h3>${title}</h3><p>${n ? desc : disabledMsg}</p></span><span class="chip">${n ? n + ' ready' : '0'}</span></button>`;
    const nm = nextUnlock(mist), nr = nextUnlock(rv);
    return `<div><h1 style="font-size:30px">Practice</h1><p class="muted" style="margin:4px 0 0">Extra ways to earn XP. Everything here follows the same cooldowns as lessons.</p></div>
      <div class="modes">
        ${mode('mistakes', 'var(--bad)', I.redo, 'Fix your mistakes', 'Questions you missed recently, while they’re fresh.', mr, mist.length ? `Nothing to fix yet. Next one is ready in ${fmtDur(nm - Date.now())}.` : 'No mistakes to fix yet. Nice.')}
        ${mode('review', 'var(--brand)', I.stack, 'Mixed review', 'Questions across all skills that are due again.', rr, rv.length ? `Nothing is due. Next review unlocks in ${fmtDur(nr - Date.now())}.` : 'Answer a few questions first. Reviews unlock after a day.')}
        ${(() => { const pp = pt1Pool(); return mode('pt1', 'var(--u3)', I.medal, 'Practice Test 1 review', `${pp.length} questions rebuilt from your PSAT practice test, starting with the one you missed.`, pp.filter((q) => isReady(q)).length, `All ${pp.length} are resting. Next one unlocks in ${fmtDur(nextUnlock(pp) - Date.now())}.`); })()}
        ${mode('speed', 'var(--flame)', I.bolt, 'Speed round', `Answer as many as you can in ${SPEED_SECS} seconds. No hearts lost.`, QS.filter((q) => isReady(q) && ['mc', 'tf', 'cloze', 'punct', 'input'].includes(q.t)).length, 'Everything is resting. Come back later.')}
      </div>
      <div class="card stack"><h2>Coming back soon</h2><p class="muted" style="margin:0">Questions you answer rest before you see them again. Here’s when they return.</p>
        <div class="kv"><div><b>${up.day}</b><span>Next 24 hours</span></div><div><b>${up.three}</b><span>Next 3 days</span></div><div><b>${up.week}</b><span>Next 7 days</span></div></div></div>`;
  }

  function viewQuests() {
    return `<div><h1 style="font-size:30px">Quests</h1><p class="muted" style="margin:4px 0 0">Daily goal, quests, and your streak.</p></div>${todayCard()}${questsCard()}${streakCard()}`;
  }

  function viewProfile() {
    const lv = levelInfo(S.xp), mast = SK.reduce((a, s) => a + skillStats(s.id).mast, 0), seen = Object.keys(S.q).length;
    const acc = S.totalAnswered ? Math.round((S.totalCorrect / S.totalAnswered) * 100) : null;
    const t = dayKey(); let heat = '';
    const startOff = -34 - keyDate(t).getDay() + 6; // align to week ending Saturday
    for (let i = startOff; i < startOff + 35; i++) {
      const k = addDays(t, i), st = S.days[k];
      const cls = i > 0 ? 'future' : st || '';
      heat += `<i class="${cls}" title="${k}${st ? ' · ' + (st === 'goal' ? 'goal met' : 'freeze used') : ''}"></i>`;
    }
    const rows = SK.map((s) => { const st = skillStats(s.id); return `<tr><td>${esc(s.name)}</td><td class="num">${st.seen}/${st.total}</td><td><span class="minibar"><i style="width:${Math.round(st.pct * 100)}%"></i></span></td><td class="num">${st.acc == null ? '–' : Math.round(st.acc * 100) + '%'}</td><td class="num">${st.ready}</td></tr>`; }).join('');
    return `<div class="card hello">${mascot('calm', S.hat, 'mascot idle')}<div><div class="eyebrow">Level ${lv.lvl}</div><h2>${S.xp.toLocaleString()} XP total</h2>
        <div class="bar brand" style="margin-top:8px" aria-label="Level progress"><i style="width:${(lv.into / lv.need) * 100}%"></i></div><p class="muted num" style="margin:4px 0 0;font-size:13px">${lv.need - lv.into} XP to level ${lv.lvl + 1}</p></div></div>
      <div class="statgrid">
        <div class="stile"><b>${S.streak}</b><span>Day streak</span></div><div class="stile"><b>${S.best}</b><span>Best streak</span></div>
        <div class="stile"><b>${S.lessons}</b><span>Lessons</span></div><div class="stile"><b>${acc == null ? '–' : acc + '%'}</b><span>First-try accuracy</span></div>
        <div class="stile"><b>${seen}/${QS.length}</b><span>Questions seen</span></div><div class="stile"><b>${mast}</b><span>Mastered</span></div>
        <div class="stile"><b>${S.bestSpeed}</b><span>Best speed round</span></div><div class="stile"><b>${Object.keys(S.ach).length}/${ACH.length}</b><span>Achievements</span></div>
      </div>
      <div class="card stack"><h2>Last 5 weeks</h2><div class="heat" aria-label="Streak calendar">${heat}</div>
        <div class="legend"><span style="--c:var(--flame)">Goal met</span><span style="--c:var(--gem)">Freeze used</span><span style="--c:var(--surface-2)">Missed</span></div></div>
      <div class="card stack"><h2>Skills</h2><p class="muted" style="margin:0;font-size:14px">A question counts as mastered after you get it right three times in a row, spaced out over days.</p>
        <div class="tablewrap"><table class="data"><thead><tr><th>Skill</th><th class="num">Seen</th><th>Mastery</th><th class="num">Accuracy</th><th class="num">Ready</th></tr></thead><tbody>${rows}</tbody></table></div></div>
      <div class="card stack"><h2>Achievements</h2><div class="achs">${ACH.map((a) => `<div class="ach ${S.ach[a.id] ? '' : 'locked'}"><span class="medal">${S.ach[a.id] ? I.medal : I.lock}</span><b>${esc(a.name)}</b><span>${esc(a.desc)}</span></div>`).join('')}</div></div>`;
  }

  function viewShop() {
    syncHearts();
    const hat = (id) => { const it = HATS[id], own = S.owned.includes(id), on = S.hat === id;
      return `<div class="item"><div class="art">${mascot('happy', id)}</div><b>${esc(it.name)}</b><p>${esc(it.desc)}</p>
        ${own ? `<button class="btn small ${on ? 'ghost' : ''}" data-act="equip" data-item="${id}" ${on ? 'disabled' : ''}>${on ? 'Wearing' : 'Wear'}</button>`
        : `<button class="btn small" data-act="buy" data-item="${id}" ${S.gems >= it.price ? '' : 'disabled'}><span class="price">${I.gem}${it.price}</span></button>`}</div>`; };
    return `<div class="row between" style="flex-wrap:wrap"><div><h1 style="font-size:30px">Shop</h1><p class="muted" style="margin:4px 0 0">Earn gems from lessons, quests, and perfect scores.</p></div><span class="stat gem" style="font-size:18px">${I.gem}<span>${S.gems}</span></span></div>
      <h2 style="font-size:20px">Power-ups</h2>
      <div class="shopgrid">
        <div class="item"><div class="art" style="color:var(--gem)">${I.snow.replace('<svg', '<svg style="width:56px;height:56px"')}</div><b>Streak Freeze</b><p>Covers one missed day automatically. You can hold 2. You have ${S.freezes}.</p>
          <button class="btn small" data-act="buy" data-item="freeze" ${S.gems >= 50 && S.freezes < 2 ? '' : 'disabled'}>${S.freezes >= 2 ? 'Fully stocked' : `<span class="price">${I.gem}50</span>`}</button></div>
        <div class="item"><div class="art" style="color:var(--heart)">${I.heart.replace('<svg', '<svg style="width:56px;height:56px"')}</div><b>Heart Refill</b><p>Back to ${MAX_HEARTS} hearts. You have ${S.settings.hearts ? S.hearts : 'unlimited'}.</p>
          <button class="btn small" data-act="buy" data-item="hearts" ${S.gems >= 30 && S.settings.hearts && S.hearts < MAX_HEARTS ? '' : 'disabled'}>${!S.settings.hearts || S.hearts >= MAX_HEARTS ? 'Full' : `<span class="price">${I.gem}30</span>`}</button></div>
      </div>
      <h2 style="font-size:20px">Outfits for Dot</h2>
      <div class="shopgrid">${Object.keys(HATS).map(hat).join('')}</div>`;
  }

  function viewPrefs() {
    const seg = (act, cur, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button data-act="${act}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
    const sw = (act, on, label) => `<button class="switch" role="switch" aria-checked="${on}" aria-label="${label}" data-act="${act}"></button>`;
    const notifState = !('Notification' in window) ? 'Not supported in this browser' : Notification.permission === 'granted' ? (S.settings.notify ? 'On' : 'Allowed') : Notification.permission === 'denied' ? 'Blocked in browser settings' : 'Off';
    return `<div><h1 style="font-size:30px">Settings</h1></div>
      <div class="card">
        <div class="field"><span class="lbl">Daily goal</span>${seg('goal', S.settings.goal, [[10, 'Casual · 10 XP'], [20, 'Regular · 20 XP'], [30, 'Serious · 30 XP'], [50, 'Intense · 50 XP']])}<span class="hint">Meeting your goal each day builds your streak.</span></div>
        <div class="field"><div class="row between"><span class="lbl">Sound effects</span>${sw('sound', S.settings.sound, 'Sound effects')}</div></div>
        <div class="field"><div class="row between"><span class="lbl">Unlimited hearts</span>${sw('heartsmode', !S.settings.hearts, 'Unlimited hearts')}</div><span class="hint">Hearts make mistakes cost something. Turn this on for low-pressure practice.</span></div>
        <div class="field"><span class="lbl">Theme</span>${seg('theme', S.settings.theme, [['system', 'Match device'], ['light', 'Light'], ['dark', 'Dark']])}</div>
      </div>
      <div class="card">
        <h2>Reminders</h2>
        <div class="field"><div class="row between"><label for="remind-at">Daily reminder</label>${sw('remind', S.settings.remind, 'Daily reminder')}</div>
          <div class="row" style="flex-wrap:wrap"><input type="time" id="remind-at" value="${S.settings.remindAt}" ${S.settings.remind ? '' : 'disabled'}><span class="hint">If you haven’t hit your goal by this time, Inkwell reminds you.</span></div></div>
        <div class="field"><span class="lbl">Browser notifications</span><span class="hint">Status: ${notifState}. Notifications appear while Inkwell is open or installed as an app.</span>
          <div><button class="btn small ghost" data-act="notify">${I.bell.replace('<svg', '<svg style="width:18px;height:18px"')} Allow notifications</button></div></div>
        <div class="field"><span class="lbl">Calendar reminder</span><span class="hint">Works even when Inkwell is closed: adds a repeating daily event at your reminder time to your phone or computer calendar.</span>
          <div><button class="btn small ghost" data-act="ics">Add to calendar</button></div></div>
      </div>
      <div class="card">
        <h2>Your progress</h2>
        <div class="field"><span class="hint">Progress is saved in this browser only. To move it to another device, copy a backup code here and paste it there.</span>
          <div class="row" style="flex-wrap:wrap"><button class="btn small ghost" data-act="export">Copy backup code</button><button class="btn small ghost" data-act="import">Restore from code</button></div>
          <textarea id="backup" aria-label="Backup code" placeholder="Backup code appears here, or paste one to restore"></textarea></div>
        <div class="field"><span class="lbl">Start over</span><span class="hint">Erases all XP, streaks, gems, and question history in this browser.</span><div id="resetbox"><button class="btn small bad" data-act="reset1">Reset progress</button></div></div>
      </div>
      <p class="muted" style="font-size:13px">Inkwell is an independent study tool with original practice questions. It isn’t affiliated with the College Board.</p>`;
  }

  let lastView = null, lastStats = null, asideDone = false;
  function renderView() {
    if (!$('#app .shell')) shell();
    const v = curView();
    document.querySelectorAll('[data-act="go"].tab').forEach((t) => t.setAttribute('aria-current', t.dataset.view === v ? 'page' : 'false'));
    $('#stats').innerHTML = statsHTML();
    const now = { flame: S.streak, gem: S.gems, heart: S.settings.hearts ? S.hearts : -1 };
    if (lastStats) for (const k of Object.keys(now)) if (now[k] !== lastStats[k]) restart($(`#stats .stat.${k}`), 'bump');
    lastStats = now;
    const render = { learn: viewLearn, practice: viewPractice, quests: viewQuests, profile: viewProfile, shop: viewShop, prefs: viewPrefs }[v];
    const viewEl = $('#view');
    viewEl.innerHTML = render();
    if (v !== lastView) { restart(viewEl, 'enter'); window.scrollTo(0, 0); } else viewEl.classList.remove('enter');
    lastView = v;
    const asideEl = $('#aside');
    asideEl.innerHTML = asideHTML();
    if (!asideDone) { asideEl.classList.add('enter'); asideDone = true; } else asideEl.classList.remove('enter');
    document.querySelectorAll('.rail .brand, .topbar .brand').forEach((b) => { b.innerHTML = `${mascot('happy', S.hat, 'mascot')}<span>Inkwell</span>`; });
    const ti = $('#remind-at'); if (ti) ti.addEventListener('change', () => { S.settings.remindAt = ti.value || '19:00'; S.settings.lastNotified = null; save(); toast(`Reminder set for ${ti.value}.`, I.bell); });
  }

  function applyTheme() {
    const t = S.settings.theme;
    if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
  }

  /* ============================================================ EVENTS */
  function buy(item) {
    if (item === 'freeze') { if (S.gems < 50 || S.freezes >= 2) return; S.gems -= 50; S.freezes++; toast('Streak Freeze equipped.', I.snow); }
    else if (item === 'hearts') { if (S.gems < 30) return; S.gems -= 30; S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); toast('Hearts refilled.', I.heart); closeSheet(); }
    else if (HATS[item]) { const p = HATS[item].price; if (S.gems < p) return; S.gems -= p; S.owned.push(item); S.hat = item; toast(`Dot is wearing the ${HATS[item].name}.`, I.shop); }
    checkAch(); save(); renderView();
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const a = t.dataset.act;
    switch (a) {
      case 'go': closeSheet(); if (location.hash.slice(1) !== t.dataset.view) location.hash = t.dataset.view; else renderView(); window.scrollTo(0, 0); break;
      case 'skill': skillSheet(t.dataset.skill); break;
      case 'start': S.welcomed = true; save(); startLesson('skill', t.dataset.skill); break;
      case 'mode': startLesson(t.dataset.mode); break;
      case 'quick': {
        if (reviewPool().some((q) => isReady(q))) startLesson('review');
        else { const s = SK.find((x) => skillStats(x.id).ready > 0); if (s) startLesson('skill', s.id); }
        break;
      }
      case 'check': onCheck(); break;
      case 'continue': onContinue(); break;
      case 'skipmatch': if (L && L.state === 'answer') resolve(false, L.q.pairs.map((p) => `${p[0]} → ${p[1]}`).join('; ')); break;
      case 'streakscreen': streakScreen(); break;
      case 'endlesson': endLesson(); break;
      case 'quit': if (L && L.ended) endLesson(); else quitSheet(); break;
      case 'quitnow': closeSheet(); endLesson(); break;
      case 'closesheet': closeSheet(); break;
      case 'goal': S.settings.goal = +t.dataset.goal || +t.dataset.v; save(); renderView(); break;
      case 'welcomed': S.welcomed = true; save(); renderView(); break;
      case 'dismiss': S.notice = null; save(); renderView(); break;
      case 'buy': buy(t.dataset.item); break;
      case 'equip': S.hat = t.dataset.item; save(); renderView(); break;
      case 'hearts-off': S.settings.hearts = false; save(); closeSheet(); renderView(); toast('Unlimited hearts are on.', I.heart); break;
      case 'sound': S.settings.sound = !S.settings.sound; save(); renderView(); if (S.settings.sound) sfx.ok(); break;
      case 'heartsmode': S.settings.hearts = !S.settings.hearts; save(); renderView(); break;
      case 'theme': S.settings.theme = t.dataset.v; save(); applyTheme(); renderView(); break;
      case 'remind': S.settings.remind = !S.settings.remind; save(); renderView(); break;
      case 'notify': enableNotify(); break;
      case 'ics': downloadICS(); break;
      case 'export': {
        const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
        const ta = $('#backup'); ta.value = code; ta.select();
        const done = () => toast('Backup code copied. Paste it into Inkwell on your other device.');
        try { navigator.clipboard.writeText(code).then(done, () => toast('Select the code in the box and copy it.')); } catch (err) { toast('Select the code in the box and copy it.'); }
        break;
      }
      case 'import': {
        const ta = $('#backup');
        try {
          const obj = JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));
          if (!obj || typeof obj !== 'object' || !obj.q) throw new Error('bad');
          S = merge(defaults(), obj); rollover(); applyTheme(); renderView(); toast('Progress restored.');
        } catch (err) { toast('That code didn’t work. Copy the whole code and try again.'); }
        break;
      }
      case 'reset1': $('#resetbox').innerHTML = '<div class="row" style="flex-wrap:wrap"><span style="font-weight:700">Erase everything?</span><button class="btn small bad" data-act="reset2">Yes, erase</button><button class="btn small ghost" data-act="reset0">Cancel</button></div>'; break;
      case 'reset0': renderView(); break;
      case 'reset2': S = defaults(); save(); applyTheme(); location.hash = 'learn'; renderView(); toast('Progress erased. Fresh start!'); break;
      default: break;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if ($('#sheet')) closeSheet(); return; }
    if (!L || $('#sheet')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (L.ended) { const c = $('#contbtn'); if (c) c.click(); }
      else if (L.state === 'answer') onCheck(); else onContinue();
    } else if (/^[1-9]$/.test(e.key) && L.state === 'answer' && L.w && L.w.key) {
      L.w.key(+e.key);
    }
  });

  window.addEventListener('hashchange', () => { closeSheet(); renderView(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { rollover(); if (!L) renderView(); } });
  setInterval(() => {
    const before = S.daily.day; rollover(); tickReminder();
    if (!L && !$('#sheet') && (before !== S.daily.day || curView() === 'learn' || curView() === 'shop')) {
      const st = $('#stats'); if (st) st.innerHTML = statsHTML();
    }
  }, 30000);

  /* ============================================================ BOOT */
  try {
    if ('serviceWorker' in navigator && location.protocol === 'https:' && window.top === window) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  } catch (e) { /* no service worker here */ }
  applyTheme();
  rollover();
  renderView();
  tickReminder();
  window.Inkwell = { state: () => S, questions: QS, current: () => (L && !L.ended ? L.q : null) };
})();
