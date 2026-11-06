/* Inkwell: PSAT practice app. Plain JavaScript, no build step. Progress is stored in this browser (localStorage). */
(() => {
  'use strict';

  /* ------------------------------------------------------------------ data */
  const SK = window.INK_SKILLS, UN = window.INK_UNITS, QS = window.INK_QUESTIONS;
  const SKMAP = Object.fromEntries(SK.map((s) => [s.id, s]));
  /* Every word the app can teach: the 90 drilled vocab words plus the glossary of words used in
     Vocab Vault / Words in Context questions. */
  const GLOSS = (window.INK_GLOSSARY || []).map(([w, pos, d, s]) => ({ sid: 'voc', w, pos, d, s, gloss: true }));
  const ALLW = [...(window.INK_WORDS || []), ...GLOSS];
  const WMAP = new Map(ALLW.map((x) => [x.w, x]));
  const WRE = ALLW.map((x) => [x.w, new RegExp(`\\b${x.w.endsWith('y') ? x.w.slice(0, -1) + '(?:y|ies)' : x.w}(?:s|es|d|ed|ing|ly)?\\b`)]);
  const SCAN_SK = new Set(['voc', 'wic']);
  // Words a question actually tests or shows as choices (only scanned in vocabulary-type skills).
  function detectWords(q, promptOnly) {
    if (!SCAN_SK.has(q.s)) return [];
    const parts = promptOnly ? [q.q] : [q.q, ...(q.c || []), ...(q.pairs || []).flat(), ...(q.items || []).map((i) => i[0])];
    const text = String(parts.filter((x) => typeof x === 'string').join(' | ')).replace(/<[^>]+>/g, '').toLowerCase();
    return WRE.filter(([, re]) => re.test(text)).map(([w]) => w);
  }
  const UNMAP = Object.fromEntries(UN.map((u) => [u.id, u]));
  const MATH = new Set(['lin', 'exp', 'sta', 'adv', 'geo']);
  /* SAT/PSAT vs ACT: which units show on the journey. ACT mode = the four ACT units plus shared foundations. */
  const ACT_PATH = ['u9', 'u10', 'u11', 'u12', 'u5', 'u6', 'u7', 'u8', 'u1'];
  const examUnits = () => (S.settings.exam === 'act' ? ACT_PATH.map((id) => UNMAP[id]).filter(Boolean) : UN.filter((u) => !u.act));
  /* Test pace in seconds per question: SAT R&W 64 min / 54 q, SAT math 70 min / 44 q, ACT per section. */
  const PACE_UNIT = { u9: 42, u10: 67, u11: 67, u12: 60 };
  const paceFor = (q) => { const u = SKMAP[q.s] && SKMAP[q.s].unit; return PACE_UNIT[u] || (MATH.has(q.s) ? 95 : 71); };
  const MIN = 60e3, HOUR = 36e5, DAY = 864e5;
  // Cooldowns after an answer. Box 0 = answered wrong (back soon); each correct answer moves it up a box.
  const INTERVALS = [10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
  /* Mastery: right MAST_BOX times in a row, each spaced out (same day, then 1, 3 and 7 days later),
     with at least 75% accuracy overall. One wrong answer resets the run. */
  const MAST_BOX = 4, MAST_ACC = 0.75;
  const isMast = (r) => !!r && r.box >= MAST_BOX && r.c / (r.c + r.w) >= MAST_ACC;
  const mastPts = (r) => (!r ? 0 : isMast(r) ? MAST_BOX : Math.min(r.box, MAST_BOX - 1));
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
    lessons: 0, perfects: 0, bellRuns: 0, bell: { day: null, done: false, score: 0, total: 0 }, totalCorrect: 0, totalAnswered: 0, bestComboEver: 0, bestSpeed: 0, mistakeRuns: 0, tried: [],
    settings: { exam: 'sat', qtimer: 'pace', goal: 100, sound: true, hearts: true, theme: 'system', remind: true, remindAt: '19:00', notify: false, lastNotified: null },
    welcomed: false, notice: null,
    learned: [], learnedInit: false, vocabReset: 0, guides: {}, wordKnow: {}, weekly: null, weeklyHist: [], sectionHist: [], pace: { n: 0, on: 0 }, essays: {}, essayXPDay: null, goalX3: true, goal100: true, chests: {}, unitRuns: {}, pets: 0, owl: 0, lark: 0, perfectBells: 0, newBadges: [],
  });
  function freshDaily() { return { day: dayKey(), xp: 0, lessons: 0, correct: 0, bestCombo: 0, perfect: 0, math: 0, bell: 0, claimed: [] }; }
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
      if (raw) {
        const o = JSON.parse(raw);
        if (!o.goalX3) { if (o.settings && o.settings.goal) o.settings.goal *= 3; o.goalX3 = true; } // daily goals were tripled
        if (!o.goal100) { o.settings = o.settings || {}; o.settings.goal = 100; o.goal100 = true; } // daily goal set to 100 XP
        return merge(defaults(), o);
      }
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
    scarf: { name: 'Cozy Scarf', price: 150, desc: 'For long winter study nights.' },
    phones: { name: 'Headphones', price: 400, desc: 'Lo-fi beats to study to.' },
    party: { name: 'Party Hat', price: 250, desc: 'Every streak is a party.' },
    grad: { name: 'Grad Cap', price: 600, desc: 'Dress for the score you want.' },
    crown: { name: 'Crown', price: 1000, desc: 'Royalty of the reading section.' },
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
    const K = '#101633';
    const eyes = {
      happy: `<path d="M41 59q6-7 12 0M67 59q6-7 12 0" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
      calm: `<circle cx="47" cy="59" r="5.5" fill="${K}"/><circle cx="73" cy="59" r="5.5" fill="${K}"/><circle cx="49" cy="57" r="1.8" fill="#fff"/><circle cx="75" cy="57" r="1.8" fill="#fff"/>`,
      sad: `<circle cx="47" cy="61" r="5" fill="${K}"/><circle cx="73" cy="61" r="5" fill="${K}"/><circle cx="48.5" cy="59.5" r="1.5" fill="#fff"/><circle cx="74.5" cy="59.5" r="1.5" fill="#fff"/><path d="M39 51l11 4M81 51l-11 4" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
      wow: `<circle cx="47" cy="58" r="7.5" fill="${K}"/><circle cx="73" cy="58" r="7.5" fill="${K}"/><circle cx="49.5" cy="55.5" r="2.4" fill="#fff"/><circle cx="75.5" cy="55.5" r="2.4" fill="#fff"/>`,
    }[mood] || '';
    const beak = {
      happy: '<path d="M51 67q9-5 18 0q-9 9-18 0Z" fill="#FF9F43"/><path d="M53 68.5q7 3 14 0" fill="none" stroke="#D9731F" stroke-width="1.6" stroke-linecap="round"/>',
      calm: '<path d="M52 67q8-4 16 0l-8 7Z" fill="#FF9F43"/>',
      sad: '<path d="M53 69q7-3 14 0l-7 6Z" fill="#F08A35"/>',
      wow: '<path d="M52 66q8-5 16 0l-8 4Z" fill="#FF9F43"/><path d="M53 72l7 6 7-6q-7-3-14 0Z" fill="#E8822C"/><path d="M54 71h12" stroke="#B85A1C" stroke-width="1.6"/>',
    }[mood] || '';
    const hatTop = ['party', 'grad', 'crown'].includes(hat);
    return `<svg class="${cls}" viewBox="0 ${hatTop ? -4 : 6} 120 ${hatTop ? 124 : 114}" role="img" aria-label="Dot the penguin">
      <path class="body flipper l" d="M27 62c-11 5-17 20-14 33 7-3 14-12 16-22Z"/>
      <path class="body flipper r" d="M93 62c11 5 17 20 14 33-7-3-14-12-16-22Z"/>
      <path class="body" d="M60 20c24 0 38 21 38 50 0 27-15 42-38 42S22 97 22 70c0-29 14-50 38-50Z"/>
      <path class="body" d="M57 22c-3-7 2-12 7-11-3 2-4 6-3 11Z"/>
      <path d="M60 41c-5-6-23-7-27 7-3 12 3 22 6 28 4 9 4 24 21 31 17-7 17-22 21-31 3-6 9-16 6-28-4-14-22-13-27-7Z" fill="#fff"/>
      <path d="M44 109c-8 0-12 4-11 8h20c1-4-1-8-9-8ZM76 109c8 0 12 4 11 8H67c-1-4 1-8 9-8Z" fill="#FF9F43"/>
      <g class="eyes">${eyes}</g>
      ${beak}
      <ellipse cx="38" cy="70" rx="5" ry="3.5" fill="#FF8FA0" opacity=".55"/><ellipse cx="82" cy="70" rx="5" ry="3.5" fill="#FF8FA0" opacity=".55"/>
      ${hatSVG(hat)}
    </svg>`;
  }

  /* -------------------------------------------------------------- state ops */
  let S = load();
  /* Vocabulary you've been taught. Words you'd already answered before this existed count as learned. */
  function wordsOf(q) {
    if (q.vw) return [q.vw];
    if (q.t === 'match' && q.id.startsWith('vw-')) return q.pairs.map((p) => p[0]);
    return detectWords(q);
  }
  /* Word knowledge: S.learned = taught and passed the quick check; S.wordKnow[w] = 'known' (you said you
     know it), 'learn' (you said you don't), 'review' (you missed it, so it gets retaught). */
  const isLearned = (w) => S.learned.includes(w) || S.wordKnow[w] === 'known';
  const needsTeach = (w) => !isLearned(w) && (S.wordKnow[w] === 'learn' || S.wordKnow[w] === 'review');
  const unasked = (w) => !isLearned(w) && !needsTeach(w);
  function markReview(w) { if (!vocabWord(w)) return false; S.learned = S.learned.filter((x) => x !== w); S.wordKnow[w] = 'review'; return true; }
  if (!S.learnedInit) {
    const set = new Set(S.learned);
    for (const q of QS) if (S.q[q.id]) wordsOf(q).forEach((w) => set.add(w));
    S.learned = [...set]; S.learnedInit = true;
  }
  /* Relearn vocab: forget which words were taught and their question history, so each word comes back
     as a fresh "Learn it" card, then a quick check, then lesson questions. */
  function resetVocab() {
    S.learned = []; S.wordKnow = {};
    for (const k of Object.keys(S.q)) if (k.startsWith('vw-')) delete S.q[k];
  }
  if (S.vocabReset < 1) { resetVocab(); S.vocabReset = 1; save(); }

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
      if (r) { seen++; c += r.c; w += r.w; pts += mastPts(r); if (isMast(r)) mast++; }
    }
    return { total: qs.length, ready, seen, mast, pct: pts / (MAST_BOX * qs.length), acc: c + w ? c / (c + w) : null, next };
  }
  const mistakesPool = () => QS.filter((q) => { const r = S.q[q.id]; return r && r.w > 0 && r.box <= 1; });
  const reviewPool = () => QS.filter((q) => S.q[q.id]);
  const pt1Pool = () => QS.filter((q) => q.src === 'pt1');
  const unitPool = (uid) => QS.filter((q) => SKMAP[q.s] && SKMAP[q.s].unit === uid);
  /* At most NEW_WORDS unlearned vocab words per lesson, so the "learn first" part stays short. */
  const NEW_WORDS = 5;
  function capNew(list, n) {
    const fresh = new Set(), out = [];
    for (const q of list) {
      if (out.length >= n) break;
      const nw = wordsOf(q).filter((w) => !isLearned(w) && !fresh.has(w));
      if (fresh.size + nw.length > NEW_WORDS) continue;
      nw.forEach((w) => fresh.add(w)); out.push(q);
    }
    return out;
  }
  function buildQueue(mode, sid) {
    const now = Date.now();
    let pool = mode === 'hard' ? QS.filter((q) => q.d === 3) : mode === 'unit' ? unitPool(sid) : mode === 'skill' ? QS.filter((q) => q.s === sid) : mode === 'mistakes' ? mistakesPool() : mode === 'review' ? reviewPool() : mode === 'pt1' ? pt1Pool() : QS.slice();
    let av = pool.filter((q) => isReady(q, now));
    if (mode === 'speed') av = av.filter((q) => ['mc', 'tf', 'cloze', 'punct', 'input'].includes(q.t));
    const wrong = shuffle(av.filter((q) => S.q[q.id] && S.q[q.id].box === 0));
    const fresh = shuffle(av.filter((q) => !S.q[q.id]));
    const due = av.filter((q) => S.q[q.id] && S.q[q.id].box > 0).sort((a, b) => S.q[a.id].due - S.q[b.id].due);
    if (mode === 'speed') return shuffle(av.filter((q) => wordsOf(q).every(isLearned)));
    if (mode === 'review' || mode === 'mistakes') return capNew([...wrong, ...due], REVIEW_LEN);
    if (mode === 'hard') return [...wrong, ...fresh, ...due].slice(0, REVIEW_LEN);
    if (mode === 'unit') {
      // Unit review: mistakes first, then test-style questions, then a shuffled mix across the unit's skills.
      const pt = fresh.filter((q) => q.src === 'pt1'), rest = fresh.filter((q) => q.src !== 'pt1');
      const bySkill = {}; for (const q of rest) (bySkill[q.s] = bySkill[q.s] || []).push(q);
      const mixed = []; const lists = Object.values(bySkill);
      for (let i = 0; mixed.length < rest.length; i++) for (const l of lists) if (l[i]) mixed.push(l[i]);
      return capNew([...wrong, ...pt.slice(0, 3), ...due.slice(0, 3), ...mixed, ...pt.slice(3), ...due.slice(3)], REVIEW_LEN);
    }
    if (mode === 'pt1') { const missed = fresh.filter((q) => q.missed); return capNew([...wrong, ...missed, ...fresh.filter((q) => !q.missed), ...due], REVIEW_LEN); }
    return capNew([...wrong, ...fresh, ...due], LESSON_LEN);
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
    { id: 'bell', label: () => 'Finish today\u2019s Bell Ringer', goals: [1], key: 'bell' },
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
  /* ------------------------------------------------------- badges (tiered) */
  const TIER_NAME = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', diamond: 'Diamond' };
  const BI = {
    flame: '<path d="M12 2.5c.8 3.6 5.5 5.3 5.5 10.6a5.5 5.5 0 0 1-11 0c0-2.8 1.6-4.3 2.4-6.4 1.4 1.1 2.1 2.5 2.1 4.3 1.6-2 1.8-5.2 1-8.5z"/>',
    bolt: '<path d="M13 2 4.5 13.5H11L10 22l9-12h-6.5z"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/><path d="M8 7.5h8M8 11h6"/>',
    star: '<path d="M12 2.8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.4l6.2-.9z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.8 8.2 13.6 13.6 8.2 15.8 10.4 10.4z"/>',
    chest: '<path d="M3.5 10.5h17V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1zM3.5 10.5A4.5 4.5 0 0 1 8 6h8a4.5 4.5 0 0 1 4.5 4.5"/><path d="M10.5 10.5h3v4h-3z"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    abc: '<path d="M3 18 7 6l4 12M4.4 14h5.2M14 6v12h3.2a3 3 0 0 0 0-6H14m0 0h2.6a3 3 0 0 0 0-6H14"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8.5 6.5h7M8.5 11h1M14.5 11h1M8.5 14.5h1M14.5 14.5h1M8.5 18h1M14.5 18h1"/>',
    quill: '<path d="M20 3C11 4 6 10 5 19l-1 2M20 3c-1 7-5 11-11 12M20 3l-9 9"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2zM10 21a2 2 0 0 0 4 0"/>',
    watch: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.6 1.8M9.5 2.5h5M12 2.5V6"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
    hat: '<path d="M2.5 18.5h19M6 18.5c0-6.5 2.4-11.5 6-11.5s6 5 6 11.5M7.6 13.5h8.8"/>',
    fish: '<path d="M2.5 12c3-4.6 8.2-6 12.5-3.4L20.5 5v14l-5.5-3.6C10.7 18 5.5 16.6 2.5 12z"/><circle cx="8" cy="11" r=".9" fill="currentColor"/>',
    paw: '<ellipse cx="12" cy="16" rx="4.6" ry="4"/><ellipse cx="5.6" cy="10.6" rx="1.9" ry="2.4"/><ellipse cx="18.4" cy="10.6" rx="1.9" ry="2.4"/><ellipse cx="9.2" cy="6" rx="1.9" ry="2.4"/><ellipse cx="14.8" cy="6" rx="1.9" ry="2.4"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5M4 3.5v5h5"/>',
    peak: '<path d="M2 20 9.2 6.5l4 6.8 2.3-3.3L22 20z"/><path d="M7.6 9.6 9.2 11l1.4-1.4"/>',
    flag: '<path d="M5 21.5V3M5 3.5h12.5l-2.5 4.5 2.5 4.5H5"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
    gem: '<path d="M6.5 3.5h11L21.5 9 12 20.5 2.5 9z"/><path d="M2.5 9h19M9 3.5 12 20.5 15 3.5"/>',
    scroll: '<path d="M6 3.5h11.5a2 2 0 0 1 2 2V18a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 18v-1.5h11V18a2.5 2.5 0 0 0 2.5 2.5M6 3.5a2 2 0 0 0-2 2V7h4"/><path d="M9.5 8.5h6M9.5 12h6"/>',
  };
  const VOCAB_SK = new Set(['voc', 'wic', 'vta', 'vae', 'vas']);
  const GENRE_SK = ['lit', 'soc', 'hum', 'nat'];
  const correctIn = (pred) => { let n = 0; for (const q of QS) if (pred(q)) { const r = S.q[q.id]; if (r) n += r.c; } return n; };
  const mastQ = () => { let n = 0; for (const k in S.q) if (isMast(S.q[k])) n++; return n; };
  const fullSkills = () => SK.filter((s) => { const st = skillStats(s.id); return st.total && st.mast === st.total; }).length;
  const fullUnit = () => (UN.some((u) => { const p = unitPool(u.id); return p.length && p.every((q) => isMast(S.q[q.id])); }) ? 1 : 0);
  const B = (cat, id, tier, icon, name, desc, val, goal) => ({ cat, id, tier, icon, name, desc, val, goal });
  const BADGE_CATS = [['streak', 'Streaks'], ['xp', 'Experience'], ['lessons', 'Lessons'], ['skill', 'Skill & accuracy'], ['journey', 'Journey & exploration'], ['subject', 'Subjects'], ['bell', 'Bell Ringer & speed'], ['fun', 'Just for fun']];
  const ACH = [
    B('streak', 'streak3', 'bronze', 'flame', 'Warming Up', 'Reach a 3-day streak', () => S.best, 3),
    B('streak', 'streak7', 'silver', 'flame', 'Week of Ink', 'Reach a 7-day streak', () => S.best, 7),
    B('streak', 'streak14', 'silver', 'flame', 'Fortnight Flame', 'Reach a 14-day streak', () => S.best, 14),
    B('streak', 'streak30', 'gold', 'flame', 'Unstoppable', 'Reach a 30-day streak', () => S.best, 30),
    B('streak', 'streak60', 'gold', 'flame', 'Torchbearer', 'Reach a 60-day streak', () => S.best, 60),
    B('streak', 'streak100', 'diamond', 'flame', 'Eternal Flame', 'Reach a 100-day streak', () => S.best, 100),
    B('xp', 'xp100', 'bronze', 'bolt', 'Century', 'Earn 100 total XP', () => S.xp, 100),
    B('xp', 'xp500', 'silver', 'bolt', 'Ink Spiller', 'Earn 500 total XP', () => S.xp, 500),
    B('xp', 'xp1000', 'silver', 'bolt', 'Ink Machine', 'Earn 1,000 total XP', () => S.xp, 1000),
    B('xp', 'xp2500', 'gold', 'bolt', 'Printing Press', 'Earn 2,500 total XP', () => S.xp, 2500),
    B('xp', 'xp5000', 'diamond', 'bolt', 'Grand Library', 'Earn 5,000 total XP', () => S.xp, 5000),
    B('lessons', 'first', 'bronze', 'book', 'First Page', 'Finish your first lesson', () => S.lessons, 1),
    B('lessons', 'les10', 'bronze', 'book', 'Page Turner', 'Finish 10 lessons', () => S.lessons, 10),
    B('lessons', 'les25', 'silver', 'book', 'Chapter Book', 'Finish 25 lessons', () => S.lessons, 25),
    B('lessons', 'les50', 'gold', 'book', 'Novelist', 'Finish 50 lessons', () => S.lessons, 50),
    B('lessons', 'les100', 'diamond', 'book', 'Epic Saga', 'Finish 100 lessons', () => S.lessons, 100),
    B('skill', 'perfect', 'bronze', 'star', 'Spotless', 'Finish a lesson with no mistakes', () => S.perfects, 1),
    B('skill', 'perfect5', 'silver', 'star', 'Clean Copy', 'Finish 5 perfect lessons', () => S.perfects, 5),
    B('skill', 'perfect20', 'gold', 'star', 'Flawless Folio', 'Finish 20 perfect lessons', () => S.perfects, 20),
    B('skill', 'combo10', 'bronze', 'target', 'On a Roll', 'Get 10 right in a row', () => S.bestComboEver, 10),
    B('skill', 'combo20', 'silver', 'target', 'Hot Hand', 'Get 20 right in a row', () => S.bestComboEver, 20),
    B('skill', 'combo30', 'gold', 'target', 'Untouchable', 'Get 30 right in a row', () => S.bestComboEver, 30),
    B('skill', 'mast25', 'bronze', 'gem', 'Sticky Ink', 'Master 25 questions', mastQ, 25),
    B('skill', 'mast100', 'silver', 'gem', 'Deep Roots', 'Master 100 questions', mastQ, 100),
    B('skill', 'master', 'gold', 'gem', 'Mastered', 'Master every question in one skill', () => Math.min(1, fullSkills()), 1),
    B('skill', 'master5', 'diamond', 'gem', 'Polymath', 'Master every question in 5 skills', fullSkills, 5),
    B('skill', 'unitmaster', 'diamond', 'peak', 'Region Legend', 'Master every question in one region of the journey', fullUnit, 1),
    B('journey', 'explorer', 'silver', 'compass', 'Explorer', `Try all ${SK.length} skills`, () => SK.filter((s) => S.tried.includes(s.id)).length, SK.length),
    B('journey', 'genres', 'bronze', 'scroll', 'Genre Hopper', 'Try all four Passage Types skills', () => GENRE_SK.filter((s) => S.tried.includes(s)).length, 4),
    B('journey', 'review1', 'bronze', 'map', 'Region Review', 'Finish a Unit Review', () => Object.keys(S.unitRuns).length, 1),
    B('journey', 'reviewall', 'gold', 'map', 'Grand Tour', 'Finish a Unit Review in every SAT region', () => Object.keys(S.unitRuns).filter((id) => UNMAP[id] && !UNMAP[id].act).length, UN.filter((u) => !u.act).length),
    B('journey', 'chest1', 'bronze', 'chest', 'Treasure Hunter', 'Open a treasure chest on the journey', () => Object.keys(S.chests).length, 1),
    B('journey', 'chestall', 'gold', 'chest', 'Cartographer', 'Open every SAT treasure chest', () => Object.keys(S.chests).filter((id) => UNMAP[id] && !UNMAP[id].act).length, UN.filter((u) => !u.act).length),
    B('journey', 'seen100', 'bronze', 'eye', 'Curious Mind', 'Answer 100 different questions', () => Object.keys(S.q).length, 100),
    B('journey', 'seen250', 'silver', 'eye', 'Well Read', 'Answer 250 different questions', () => Object.keys(S.q).length, 250),
    B('journey', 'seenall', 'diamond', 'flag', 'Seen It All', 'Answer every question in Inkwell', () => Object.keys(S.q).filter((k) => QS.some((q) => q.id === k)).length, QS.length),
    B('subject', 'vocab50', 'silver', 'abc', 'Wordsmith', 'Get 50 vocabulary answers right', () => correctIn((q) => VOCAB_SK.has(q.s)), 50),
    B('subject', 'read100', 'silver', 'quill', 'Close Reader', 'Get 100 reading & writing answers right', () => correctIn((q) => !MATH.has(q.s)), 100),
    B('subject', 'passage40', 'silver', 'scroll', 'Bookworm', 'Get 40 Passage Types answers right', () => correctIn((q) => GENRE_SK.includes(q.s)), 40),
    B('subject', 'math50', 'silver', 'calc', 'Number Cruncher', 'Get 50 math answers right', () => correctIn((q) => MATH.has(q.s)), 50),
    B('subject', 'math150', 'gold', 'calc', 'Mathlete', 'Get 150 math answers right', () => correctIn((q) => MATH.has(q.s)), 150),
    B('subject', 'pt1all', 'gold', 'medal', 'Test Veteran', 'Get every Practice Test 1 question right at least once', () => pt1Pool().filter((q) => S.q[q.id] && S.q[q.id].c > 0).length, pt1Pool().length),
    B('bell', 'bell1', 'bronze', 'bell', 'Ding!', 'Finish a Bell Ringer', () => S.bellRuns, 1),
    B('bell', 'bell7', 'silver', 'bell', 'Class Is in Session', 'Finish 7 Bell Ringers', () => S.bellRuns, 7),
    B('bell', 'bell30', 'gold', 'bell', 'Bell Tower', 'Finish 30 Bell Ringers', () => S.bellRuns, 30),
    B('bell', 'bellperfect', 'silver', 'bell', 'Perfect Pitch', 'Get every Bell Ringer question right', () => S.perfectBells, 1),
    B('bell', 'speed6', 'bronze', 'watch', 'Off the Line', 'Score 6+ in a Speed Round', () => S.bestSpeed, 6),
    B('bell', 'speed12', 'silver', 'watch', 'Quick Draw', 'Score 12+ in a Speed Round', () => S.bestSpeed, 12),
    B('bell', 'speed20', 'gold', 'watch', 'Lightning Reader', 'Score 20+ in a Speed Round', () => S.bestSpeed, 20),
    B('fun', 'comeback', 'bronze', 'redo', 'Comeback', 'Finish a mistakes review', () => S.mistakeRuns, 1),
    B('fun', 'comeback5', 'silver', 'redo', 'Phoenix', 'Finish 5 mistakes reviews', () => S.mistakeRuns, 5),
    B('fun', 'owl', 'bronze', 'moon', 'Night Owl', 'Finish a lesson after 10 p.m.', () => S.owl, 1),
    B('fun', 'lark', 'bronze', 'sun', 'Early Bird', 'Finish a lesson before 7 a.m.', () => S.lark, 1),
    B('fun', 'style', 'bronze', 'hat', 'Dressed Up', 'Buy an outfit for Dot', () => S.owned.length - 1, 1),
    B('fun', 'wardrobe', 'gold', 'hat', 'Fashion Icon', 'Own every outfit in the shop', () => S.owned.length - 1, Object.keys(HATS).length - 1),
    B('fun', 'pet25', 'bronze', 'fish', 'Dot’s Best Friend', 'Pet Dot 25 times', () => S.pets, 25),
    B('fun', 'pet100', 'silver', 'fish', 'Penguin Whisperer', 'Pet Dot 100 times', () => S.pets, 100),
  ];
  const ACHMAP = Object.fromEntries(ACH.map((a) => [a.id, a]));
  const badgeArt = (a, big = false) => {
    const on = !!S.ach[a.id];
    const icon = a.icon === 'medal' ? I.medal.replace(/<\/?svg[^>]*>/g, '') : BI[a.icon];
    return `<span class="bhex t-${on ? a.tier : 'locked'}${big ? ' big' : ''}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${on ? icon : I.lock.replace(/<\/?svg[^>]*>/g, '')}</svg></span>`;
  };
  function checkAch() {
    let added = false;
    for (const a of ACH) if (!S.ach[a.id] && a.val() >= a.goal) { S.ach[a.id] = Date.now(); S.newBadges.push(a.id); added = true; }
    if (added && !L) setTimeout(showBadges, 250);
  }
  function showBadges() {
    if (L || $('#sheet')) return;
    const ids = S.newBadges.filter((id) => ACHMAP[id]); S.newBadges = []; save();
    if (!ids.length) return;
    const list = ids.slice(0, 6).map((id) => ACHMAP[id]), one = list.length === 1 ? list[0] : null;
    openSheet(`<div class="badgecele">
      <div class="eyebrow">${one ? `New ${TIER_NAME[one.tier]} badge` : 'New badges'}</div>
      <div class="celebadges">${list.map((a, i) => `<div class="cb" style="--k:${i}">${badgeArt(a, true)}${one ? '' : `<b>${esc(a.name)}</b>`}</div>`).join('')}</div>
      <h2>${one ? esc(one.name) : `${ids.length} badges unlocked!`}</h2>
      <p class="muted" style="margin:0">${one ? esc(one.desc) : ids.length > 6 ? `Plus ${ids.length - 6} more. See them all on your profile.` : 'Nice work. See them all on your profile.'}</p>
      <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn" data-act="closesheet">Awesome!</button><button class="btn ghost" data-act="go" data-view="profile">See all badges</button></div></div>`);
    sfx.win(); confetti();
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
  /* Pointer drag: a tap still works; moving more than 8px turns it into a drag with a floating copy. */
  function draggable(el, getTargets, onDrop) {
    el.classList.add('dragtile');
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || el.disabled) return;
      const sx = e.clientX, sy = e.clientY, r = el.getBoundingClientRect();
      let ghost = null, over = null;
      const hit = (x, y) => getTargets().find((t) => { const b = t.getBoundingClientRect(); return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom; });
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!ghost) {
          if (Math.hypot(dx, dy) < 8) return;
          ghost = el.cloneNode(true); ghost.classList.add('ghostdrag'); ghost.classList.remove('sel');
          Object.assign(ghost.style, { width: r.width + 'px', height: r.height + 'px', left: r.left + 'px', top: r.top + 'px' });
          document.body.append(ghost); el.classList.add('dragging'); sfx.tap();
        }
        ev.preventDefault();
        ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-8, Math.min(8, dx / 30))}deg) scale(1.06)`;
        const t = hit(ev.clientX, ev.clientY);
        if (t !== over) { if (over) over.classList.remove('dropover'); over = t; if (over) over.classList.add('dropover'); }
      };
      const up = () => {
        document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up);
        if (!ghost) return;
        ghost.remove(); el.classList.remove('dragging');
        if (over) over.classList.remove('dropover');
        el.dataset.dragged = '1'; setTimeout(() => { delete el.dataset.dragged; }, 50);
        if (over) onDrop(over);
      };
      document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
    });
  }
  const wasDragged = (e) => e && e.currentTarget && e.currentTarget.dataset.dragged;

  function choiceButtons(texts, onPick, cls = 'choice') {
    return texts.map((t, k) => h('button', { class: cls, type: 'button', 'aria-pressed': 'false', onclick: () => onPick(k) },
      cls === 'choice' ? h('span', { class: 'k' }, String(k + 1)) : null, h('span', { html: t })));
  }
  function wMC(q, ctx) {
    const order = q.keep ? q.c.map((_, i) => i) : shuffle(q.c.map((_, i) => i)); let sel = null;
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
    const btns = choiceButtons(q.labels || ['True', 'False'], (k) => { sel = k === 0; btns.forEach((b, j) => b.setAttribute('aria-pressed', j === k)); sfx.tap(); ctx.ready(true); });
    btns.forEach((b) => b.querySelector('.k').remove());
    box.append(...btns);
    return {
      el: box, check: () => ({ ok: sel === q.a, answer: (q.labels || ['True', 'False'])[q.a ? 0 : 1] }),
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
    const mk = (side, i) => {
      const el = h('button', { class: 'tile', type: 'button', 'data-side': side, 'data-i': i, onclick: (e) => { if (!wasDragged(e)) tapTile(e.currentTarget, side, i); } }, q.pairs[i][side === 'L' ? 0 : 1]);
      draggable(el, () => [...(side === 'L' ? colR : colL).querySelectorAll('.tile:not(.done)')], (t) => {
        if (el.classList.contains('done')) return;
        if (sel) sel.el.classList.remove('sel');
        sel = null; tapTile(el, side, i); tapTile(t, t.dataset.side, +t.dataset.i);
      });
      return el;
    };
    colL.append(...L.map((i) => mk('L', i))); colR.append(...R.map((i) => mk('R', i)));
    function tapTile(el, side, i) {
      if (!sel || sel.side === side) { if (sel) sel.el.classList.remove('sel'); sel = { el, side, i }; el.classList.add('sel'); sfx.tap(); return; }
      const a = sel; sel = null; a.el.classList.remove('sel');
      if (a.i === i) {
        matched++; const k = matched;
        [a.el, el].forEach((x) => { x.classList.add('done', 'paired'); x.style.setProperty('--pc', `var(--pair-${(k - 1) % 6 + 1})`); x.prepend(h('span', { class: 'pairno', 'aria-hidden': 'true' }, String(k))); x.setAttribute('aria-label', `${x.textContent.slice(String(k).length)} — pair ${k}`); }); tone([700 + matched * 60], 'sine', 0.08, 0, 0.04);
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
      const el = h('button', { class: 'tile' + (sel === i ? ' sel' : ''), type: 'button', 'data-i': i, onclick: (e) => {
        if (wasDragged(e)) return;
        if (place.has(i)) { place.delete(i); sel = null; } else sel = sel === i ? null : i;
        sfx.tap(); draw();
      } }, q.items[i][0]);
      draggable(el, () => bins.map((b) => b.el), (binEl) => { const b = bins.findIndex((x) => x.el === binEl); if (b >= 0) { place.set(i, b); sel = null; sfx.tap(); draw(); } });
      return el;
    }
    function draw() {
      pool.replaceChildren(...order.filter((i) => !place.has(i)).map(tile));
      bins.forEach((bn, b) => { bn.list.replaceChildren(...order.filter((i) => place.get(i) === b).map(tile)); bn.el.classList.toggle('target', sel != null); });
      if (!pool.children.length) pool.append(h('span', { class: 'muted' }, 'All sorted. Tap a card to move it back.'));
      ctx.ready(place.size === q.items.length);
    }
    draw();
    return {
      el: h('div', { class: 'stack' }, h('p', { class: 'muted', style: 'margin:0' }, 'Drag each card into a group, or tap a card and then a group.'), pool, h('div', { class: 'bins' }, ...bins.map((b) => b.el))),
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
      line.replaceChildren(...(ans.length ? ans.map((i, k) => h('button', { class: 'tile', type: 'button', 'data-i': i, onclick: () => { ans.splice(k, 1); sfx.tap(); draw(); } }, h('span', { class: 'n' }, String(k + 1)), h('span', {}, q.tiles[i]))) : [h('span', { class: 'muted' }, 'Tap or drag the pieces below, in order.')]));
      pool.replaceChildren(...order.filter((i) => !ans.includes(i)).map((i) => {
        const el = h('button', { class: 'tile', type: 'button', onclick: (e) => { if (wasDragged(e)) return; ans.push(i); sfx.tap(); draw(); } }, q.tiles[i]);
        draggable(el, () => [line], () => { ans.push(i); sfx.tap(); draw(); });
        return el;
      }));
      ctx.ready(ans.length === n);
    }
    draw();
    return {
      el: h('div', { class: 'stack' }, line, pool), check: () => ({ ok: ans.every((v, i) => v === i), answer: q.tiles.map((t, i) => `${i + 1}. ${t}`).join('  ') }),
      reveal: () => { line.style.pointerEvents = 'none'; [...line.children].forEach((t, k) => t.classList.add(ans[k] === k ? 'right' : 'wrong')); },
    };
  }

  /* ============================================================ BELL RINGER
     Brings back questions you missed or answered a while ago, rebuilt in a different format. */
  const BELL_LEN = 6;
  const bellToday = () => S.bell && S.bell.day === dayKey() && S.bell.done;
  const seenPool = () => QS.filter((q) => S.q[q.id]);
  const vocabWord = (w) => WMAP.get(w);
  /* Vocab variations: every time a vocab question is shown it's rebuilt with different wording,
     a different question style, and freshly picked wrong answers (including close "trap" meanings). */
  const rnd1 = (a) => a[Math.floor(Math.random() * a.length)];
  const capW = (t) => t[0].toUpperCase() + t.slice(1);
  function vInfo(w) {
    const it = vocabWord(w); if (!it) return null;
    const v = (window.INK_VOCAB_VARIANTS || {})[w] || [[], [], [], null];
    return { ...it, alts: [it.d, ...v[0]], syn: v[1], traps: v[2], sents: v[3] ? [it.s, v[3]] : [it.s] };
  }
  const nearW = (a, b) => a === b || (window.INK_VOCAB_CLUSTERS || []).some((c) => c.includes(a) && c.includes(b));
  let ALLOWED = null; // words allowed as wrong-answer choices: ones you know + this lesson's words
  const otherWordsAny = (it, n) => shuffle((window.INK_WORDS || []).filter((x) => x.pos === it.pos && !nearW(x.w, it.w))).slice(0, n);
  const otherWords = (it, n) => shuffle(ALLW.filter((x) => x.pos === it.pos && !nearW(x.w, it.w) && (!ALLOWED || ALLOWED.has(x.w)))).slice(0, n);
  const defOf = (x) => { const v = vInfo(x.w); return v ? rnd1(v.alts) : x.d; };
  const WX = () => window.INK_WORD_EXPLAIN || {};
  const vExplain = (it) => `${capW(it.w)} means ${it.d}${it.syn.length ? ` (similar words: ${it.syn.join(', ')})` : ''}.${WX()[it.w] ? '\n' + WX()[it.w] : ''}`;
  /* Full, step-by-step explanations (explanations.js) replace the short built-in ones wherever a question is answered. */
  const EXPL = () => window.INK_EXPLAIN || {};
  const explainText = (q) => { if (q.bell || q.vw || (q.id || '').startsWith('vw-')) return q.e || ''; const b = q.base || q; return EXPL()[b.id] || q.e || ''; };
  const ELBL = /^(Correct|Answer|Why not the others|Why|Tip|Rule|Remember|Note|Trap|Check|Shortcut|Idea|Order|Steps?(?: \d+)?|Common mistakes?|Key idea|Formula|Pattern|Test|Also|Example|Compare|Science fact|Positive|Negative|Supports|Weakens|Specific|Vague|Text [12]|Kant|Later critics|Still the same ship|Not the same ship|Push factors[^:]*|Pull factors[^:]*|Mean|Median|Numbers|[xy]|Case \d|Row \d[^:]*|First draw blue|Second draw blue|Both|Assumption|Study|Recommendation|Tradition|Break|Reaction|Puzzle|Problem|Earlier solution|New solution|Total|Time going|Time returning|Doubled|Odd|Even)(?=:)/;
  const fmtE = (t) => String(t || '').split('\n').filter((x) => x.trim()).map((line) => { const m = line.match(ELBL); return `<p class="eline">${m ? `<b>${esc(m[0])}:</b>${esc(line.slice(m[0].length + 1))}` : esc(line)}</p>`; }).join('');
  /* Second wording for every non-vocab question (questions-alt.js). The original shows the first time,
     the reworded version the next, and so on. A retry in the same lesson gets the other version. */
  function altVersion(q) {
    let a = (window.INK_ALT || {})[q.id];
    if (!a && q.q) for (const [re, r] of (window.INK_ALT_RULES || [])) if (re.test(q.q)) { a = { q: q.q.replace(re, r) }; break; }
    return a;
  }
  const useAlt = (q) => { const r = S.q[q.id]; return (r ? r.c + r.w : 0) % 2 === 1; };
  function vary(q0) {
    const q = q0.base || q0;
    if (q.learn || q.bell) return q0;
    if (!q.vw && !q.id.startsWith('vw-')) { const a = altVersion(q); return a && useAlt(q) ? { ...q, ...a, base: q, reworded: true } : q; }
    if (q.t === 'match' && q.id.startsWith('vw-')) return { ...q, base: q, pairs: q.pairs.map(([w, d]) => { const it = vInfo(w); return [w, it ? rnd1(it.alts) : d]; }) };
    if (!q.vw) return q0;
    const it = vInfo(q.vw); if (!it) return q0;
    const expl = vExplain(it);
    const meaning = rnd1(it.alts), pos = { a: 'adjective', v: 'verb', n: 'noun' }[it.pos];
    const meaningQ = () => {
      const traps = shuffle(it.traps).slice(0, Math.random() < 0.5 ? 1 : 2);
      return { ...q, base: q, t: 'mc', kind: 'Choose the meaning', q: `What does <b>${it.w}</b> (${pos}) most nearly mean?`, c: [meaning, ...traps, ...otherWordsAny(it, 3 - traps.length).map(defOf)], a: 0, e: expl };
    };
    if (q.t === 'cloze') {
      const ow = otherWords(it, 3);
      if (!ow.length) return { ...meaningQ(), kind: 'Meaning in context', p: rnd1(it.sents).replace('___', `<b>${it.w}</b>`), q: `As used here, what does <b>${it.w}</b> most nearly mean?` };
      return { ...q, base: q, p: rnd1(it.sents), c: [it.w, ...ow.map((x) => x.w)], a: 0, e: `${expl} That is what the clues in the sentence point to.` };
    }
    const r = Math.random();
    if (r < 0.4) return meaningQ(); // 1–2 close-but-wrong traps plus other meanings (plain English, no unknown words)
    if (r < 0.6) { const ow = otherWords(it, 3); if (!ow.length) return meaningQ(); return { ...q, base: q, kind: 'Find the word', q: `Which word means \u201c${meaning}\u201d?`, c: [it.w, ...ow.map((x) => x.w)], a: 0, e: expl }; }
    if (r < 0.8 && it.syn.length) {
      const ow = otherWords(it, 3); if (!ow.length) return meaningQ();
      return { ...q, base: q, kind: 'Closest synonym', q: `Which word is closest in meaning to \u201c${rnd1(it.syn)}\u201d?`, c: [it.w, ...ow.map((x) => x.w)], a: 0, e: expl };
    }
    const right = Math.random() < 0.45, shown = right ? meaning : (it.traps.length ? rnd1(it.traps) : defOf(otherWordsAny(it, 1)[0]));
    return { ...q, base: q, t: 'tf', kind: 'Yes or no', labels: ['Yes', 'No'], q: `Does <b>${it.w}</b> mean \u201c${shown}\u201d?`, a: right,
      e: right ? `Yes. ${expl}` : `No, that\u2019s a close-sounding trap. ${expl}` };
  }
  function bellVariant(q, r) {
    const v = bellVariant0(q, r); if (!v || q.vw) return v;
    const full = EXPL()[q.id]; if (!full || !q.e) return v;
    const pre = v.e && v.e.endsWith(q.e) ? v.e.slice(0, v.e.length - q.e.length).trim() : '';
    return { ...v, e: pre ? `${pre}\n${full}` : full };
  }
  function bellVariant0(q, r) {
    const pickOne = (arr) => arr[Math.floor(r() * arr.length)];
    const base = { id: 'bell-' + q.id, s: q.s, orig: q.id, origType: q.t, bell: true, tbl: q.tbl, bars: q.bars, graph: q.graph, src: q.src, tq: q.tq };
    const YN = ['Yes', 'No'];
    const wrongChoices = (q.c || []).filter((_, i) => i !== q.a);
    if (q.vw && (q.t === 'mc' || q.t === 'cloze')) {
      const me = vocabWord(q.vw), pool = (window.INK_WORDS || []).filter((x) => x.pos === me.pos && x.w !== me.w && isLearned(x.w));
      const opts = shuffle(pool).slice(0, 3);
      const vi = vInfo(me.w), md = rnd1(vi.alts), expl = vExplain(vi);
      if (q.t === 'mc') return { ...base, t: 'mc', kind: 'Reverse it', q: `Which word means \u201c${md}\u201d?`, c: [me.w, ...opts.map((x) => x.w)], a: 0, e: expl };
      const wrongD = [...shuffle(vi.traps).slice(0, 1), ...opts.map((x) => rnd1(vInfo(x.w).alts))].slice(0, 3);
      return { ...base, t: 'mc', kind: 'Meaning in context', p: rnd1(vi.sents).replace('___', `<b>${me.w}</b>`), q: `As used here, what does <b>${me.w}</b> most nearly mean?`, c: [md, ...wrongD], a: 0, e: expl };
    }
    switch (q.t) {
      case 'mc': {
        if (r() < 0.35) return { ...base, t: 'mc', kind: 'This or that', p: q.p, q: q.q, c: [q.c[q.a], pickOne(wrongChoices)], a: 0, e: q.e };
        const right = r() < 0.5, shown = right ? q.c[q.a] : pickOne(wrongChoices);
        return { ...base, t: 'tf', kind: 'Check the answer', labels: YN, p: q.p, q: `${q.q}<div class="proposed">Proposed answer: <b>${shown}</b></div>Is that the best answer?`, a: right, e: `The best answer is \u201c${strip(q.c[q.a])}.\u201d ${q.e}` };
      }
      case 'cloze': {
        const right = r() < 0.5, shown = right ? q.c[q.a] : pickOne(wrongChoices);
        return { ...base, t: 'tf', kind: 'Check the answer', labels: YN, p: q.p.replace('___', `<mark>${shown}</mark>`), q: 'Does the highlighted word or phrase complete the text logically and precisely?', a: right, e: `The best choice is \u201c${q.c[q.a]}.\u201d ${q.e}` };
      }
      case 'punct': {
        const right = r() < 0.5, shown = right ? q.c[q.a] : pickOne(wrongChoices);
        return { ...base, t: 'tf', kind: 'Spot the error', labels: YN, p: punctSentence(q, shown), q: 'Is this sentence punctuated correctly?', a: right, e: `Correct version: ${punctSentence(q, q.c[q.a])} ${q.e}` };
      }
      case 'tf': {
        const others = shuffle(QS.filter((x) => x.id !== q.id && x.e && x.s === q.s && x.t !== 'match')).slice(0, 2);
        const fill = shuffle(QS.filter((x) => x.id !== q.id && x.t === 'tf')).slice(0, 2 - others.length);
        return { ...base, t: 'mc', kind: 'Explain why', p: q.p, q: `<i>\u201c${strip(q.q)}\u201d</i><br>This statement is <b>${q.a ? 'true' : 'false'}</b>. Which explanation shows why?`, c: [q.e, ...[...others, ...fill].map((x) => x.e)], a: 0, e: q.e };
      }
      case 'input': {
        const n = parseNum(norm(q.a[0]));
        if (isNaN(n)) return { ...base, t: 'tf', kind: 'Check the answer', labels: YN, p: q.p, q: `${q.q}<div class="proposed">Proposed answer: <b>${q.a[0]}</b></div>Is that right?`, a: true, e: q.e };
        const fmt = (v) => String(Math.round(v * 100) / 100);
        const cands = [n + 1, n - 1, n * 2, n / 2, -n, n + 10, n - 10, n * 1.5, n + 5].map((v) => fmt(v)).filter((v, i, a) => v !== fmt(n) && a.indexOf(v) === i);
        return { ...base, t: 'mc', kind: 'Pick the answer', p: q.p, q: q.q, c: [fmt(n), ...shuffle(cands).slice(0, 3)], a: 0, e: q.e };
      }
      case 'match': {
        const i = Math.floor(r() * q.pairs.length);
        return { ...base, t: 'mc', kind: 'One pair', q: `Which one goes with <b>${q.pairs[i][0]}</b>?`, c: [q.pairs[i][1], ...q.pairs.filter((_, j) => j !== i).map((p2) => p2[1])], a: 0, e: q.e };
      }
      case 'sort': {
        const it = pickOne(q.items), right = r() < 0.5, bin = right ? it[1] : 1 - it[1];
        return { ...base, t: 'tf', kind: 'Quick sort', p: q.p, q: `${q.q}<div class="proposed">\u201c${it[0]}\u201d \u2192 <b>${q.bins[bin]}</b></div>Is that the right group?`, labels: YN, a: right, e: `\u201c${it[0]}\u201d belongs in ${q.bins[it[1]]}. ${q.e}` };
      }
      case 'tap': {
        const opts = [q.segs[q.a], ...shuffle(q.segs.filter((_, i) => i !== q.a)).slice(0, 3)];
        return { ...base, t: 'mc', kind: 'Choose it', p: q.p, q: q.q.replace(/^Tap/, 'Pick'), c: opts, a: 0, e: q.e };
      }
      case 'order': {
        const last = r() < 0.5;
        return { ...base, t: 'mc', kind: last ? 'Last step' : 'First step', q: `${q.q} Which piece comes ${last ? 'last' : 'first'}?`, c: [last ? q.tiles[q.tiles.length - 1] : q.tiles[0], ...q.tiles.slice(last ? 0 : 1, last ? -1 : undefined)].slice(0, 4), a: 0, e: q.e };
      }
      default: return null;
    }
  }
  function buildBell() {
    const seen = seenPool();
    if (seen.length < 3) return [];
    const r = seeded('bell' + dayKey() + seen.length);
    const missed = seen.filter((q) => S.q[q.id].w > 0).sort((a, b) => S.q[b.id].seen - S.q[a.id].seen);
    const old = seen.filter((q) => S.q[q.id].w === 0).sort((a, b) => S.q[a.id].seen - S.q[b.id].seen);
    const picks = [...missed.slice(0, 4)];
    for (const q of [...old, ...missed.slice(4)]) { if (picks.length >= BELL_LEN) break; picks.push(q); }
    return shuffle(picks).map((q) => bellVariant(q, r)).filter(Boolean);
  }
  function bellGrade(q, ok) {
    if (ok) return;
    const r = S.q[q.orig] || { box: 0, c: 0, w: 0, due: 0, seen: 0 };
    r.box = 0; r.w++; r.seen = Date.now(); r.due = Date.now() + INTERVALS[0];
    S.q[q.orig] = r;
  }
  function wordOfDay() {
    const W = window.INK_WORDS || []; if (!W.length) return null;
    return W[Math.floor(seeded('wotd' + dayKey())() * W.length)];
  }

  /* ============================================================ WEEKLY CHALLENGE
     20 mixed questions, fixed for the week (Monday to Sunday). Take it any day; progress saves after
     every answer, so you can leave and resume. Doesn't change your review schedule. */
  const WEEKLY_LEN = 20, WEEKLY_RW = 11;
  const MATH_UNITS = new Set(['u6', 'u7', 'u10']);
  function weekKey(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dayKey(x); }
  const sShuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const isMathQ = (q) => SKMAP[q.s] && MATH_UNITS.has(SKMAP[q.s].unit);
  function buildWeekly(wk) {
    const r = seeded('weekly' + wk);
    const ids = new Set(examUnits().map((u) => u.id));
    const pool = QS.filter((q) => SKMAP[q.s] && ids.has(SKMAP[q.s].unit) && !['match', 'sort', 'order'].includes(q.t));
    const spread = (list, n) => {
      const by = {}; for (const q of list) (by[q.s] = by[q.s] || []).push(q);
      const lists = sShuffle(Object.values(by).map((l) => sShuffle(l, r)), r), out = [];
      for (let i = 0; out.length < n && lists.some((l) => l[i]); i++) for (const l of lists) if (l[i] && out.length < n) out.push(l[i]);
      return out;
    };
    const rw = spread(pool.filter((q) => !isMathQ(q)), WEEKLY_RW), math = spread(pool.filter(isMathQ), WEEKLY_LEN - WEEKLY_RW);
    return sShuffle([...rw, ...math], r).map((q) => q.id);
  }
  function weekly() {
    const wk = weekKey();
    if (!S.weekly || S.weekly.week !== wk) { S.weekly = { week: wk, ids: buildWeekly(wk), ans: {}, done: false }; save(); }
    return S.weekly;
  }
  const weeklyAnswered = (w) => Object.keys(w.ans).length;
  function weeklySplit(w) {
    const out = { rw: [0, 0], math: [0, 0], missed: {} };
    for (const id of w.ids) { const q = QS.find((x) => x.id === id); if (!q || !(id in w.ans)) continue;
      const k = isMathQ(q) ? 'math' : 'rw'; out[k][1]++; if (w.ans[id]) out[k][0]++; else out.missed[q.s] = (out.missed[q.s] || 0) + 1; }
    return out;
  }
  function weeklyCard() {
    const w = weekly(), n = weeklyAnswered(w), hist = S.weeklyHist.slice(-8), last = S.weeklyHist[S.weeklyHist.length - 1];
    const bars = hist.length ? `<div class="whist" aria-label="Weekly Challenge history">${hist.map((h) => `<div class="wb" title="Week of ${h.week}: ${h.score}/${h.total}"><i style="height:${Math.max(6, Math.round((h.score / h.total) * 100))}%"></i><small class="num">${h.score}</small></div>`).join('')}</div>` : '';
    let status, btn;
    if (w.done) { status = `Done this week: <b>${w.score}/${w.ids.length}</b>. A new challenge starts Monday.`; btn = `<button class="btn small" disabled>Completed</button>`; }
    else if (n) { status = `In progress: <b>${n}/${w.ids.length}</b> answered. Your answers are saved.`; btn = `<button class="btn small hl" data-act="mode" data-mode="weekly">Resume</button>`; }
    else { status = `${w.ids.length} mixed questions (${WEEKLY_RW} ${S.settings.exam === 'act' ? 'English, reading &amp; science' : 'reading &amp; writing'}, ${w.ids.length - WEEKLY_RW} math). Take it any day this week, all at once or in pieces.`; btn = `<button class="btn small hl" data-act="mode" data-mode="weekly">Start</button>`; }
    return `<div class="card stack weekly"><div class="row between" style="flex-wrap:wrap;gap:8px"><div><div class="eyebrow">Weekly Challenge</div><h2 style="margin:2px 0 0">See how far you’ve come</h2></div>${btn}</div>
      <p class="muted" style="margin:0">${status}</p>
      <p class="muted" style="margin:0;font-size:14px">Earn 3 XP per correct answer plus 25 XP and 15 gems for finishing. No hearts lost. ${last ? `Last result: ${last.score}/${last.total} (week of ${last.week}).` : ''}</p>${bars}</div>`;
  }

  /* ============================================================ TIMED SECTIONS
     Test-like: one overall clock, no feedback until the end, then a review of every miss. */
  const RW_RANK = { u2: 1, u1: 1, u3: 2, u8: 2, u5: 3, u4: 4 };
  const SECTIONS = {
    'sat-rw': { exam: 'sat', name: 'SAT Reading & Writing module', n: 27, mins: 32, pool: (q) => !q.act && !MATH.has(q.s) && SKMAP[q.s] && RW_RANK[SKMAP[q.s].unit] && !VOCAB_SK.has(q.s) && q.s !== 'ess' && ['mc', 'cloze', 'punct'].includes(q.t), sort: (a, b) => RW_RANK[SKMAP[a.s].unit] - RW_RANK[SKMAP[b.s].unit] },
    'sat-math': { exam: 'sat', name: 'SAT Math module', n: 22, mins: 35, pool: (q) => MATH.has(q.s) && ['mc', 'input'].includes(q.t), sort: (a, b) => (a.d || 1) - (b.d || 1) },
    'act-eng': { exam: 'act', name: 'ACT English (3 passages)', n: 30, mins: 21, pool: (q) => SKMAP[q.s] && SKMAP[q.s].unit === 'u9', inOrder: true },
    'act-math': { exam: 'act', name: 'ACT Math', n: 20, mins: 22, pool: (q) => SKMAP[q.s] && SKMAP[q.s].unit === 'u10' },
    'act-read': { exam: 'act', name: 'ACT Reading (3 passages)', n: 18, mins: 20, pool: (q) => SKMAP[q.s] && SKMAP[q.s].unit === 'u11', inOrder: true },
    'act-sci': { exam: 'act', name: 'ACT Science (3 passages)', n: 18, mins: 18, pool: (q) => SKMAP[q.s] && SKMAP[q.s].unit === 'u12', inOrder: true },
  };
  function buildSection(id) {
    const sec = SECTIONS[id], pool = QS.filter(sec.pool);
    if (sec.inOrder) return pool.slice(0, sec.n);
    // a third hard questions when available, the rest mixed
    const hard = shuffle(pool.filter((q) => q.d === 3)), rest = shuffle(pool.filter((q) => q.d !== 3));
    const pick = [...hard.slice(0, Math.round(sec.n / 3)), ...rest].slice(0, sec.n);
    return sec.sort ? pick.sort(sec.sort) : shuffle(pick);
  }
  function sectionsCard() {
    const ex = S.settings.exam;
    const rows = Object.entries(SECTIONS).filter(([, s]) => s.exam === ex).map(([id, s]) => {
      const hist = S.sectionHist.filter((x) => x.id === id), last = hist[hist.length - 1], best = hist.reduce((m, x) => Math.max(m, Math.round((x.score / x.total) * 100)), 0);
      return `<button class="mode" data-act="section" data-sec="${id}"><span class="icon" style="background:linear-gradient(135deg,#3049D8,#7B47CF)">${I.clock}</span><span><h3>${s.name}</h3><p>${s.n} questions · ${s.mins} min${last ? ` · last ${last.score}/${last.total} · best ${best}%` : ''}</p></span></button>`;
    }).join('');
    return `<div class="card stack"><div class="row between" style="flex-wrap:wrap;gap:8px"><div><div class="eyebrow">Timed sections · ${ex === 'act' ? 'ACT' : 'SAT'}</div><h2 style="margin:2px 0 0">Practice under real time limits</h2></div>${examSwitch().replace('examswitch card', 'examswitch')}</div>
      <p class="muted" style="margin:0">One clock for the whole section, no answers shown until the end, then a review of every miss. Same pace as the real test.</p><div class="modes">${rows}</div></div>`;
  }

  /* ============================================================ LESSON */
  let L = null;
  const PRAISE = ['Nice!', 'Correct!', 'You got it.', 'Sharp reading.', 'Exactly right.', 'Great work!', 'Nailed it.'];
  const OOPS = ['Not quite.', 'Almost.', 'Close, but not it.', 'Good try.'];

  /* New vocab: first a card for each word (meaning + example), then a quick check on each, then the lesson. */
  function teachPhase(list) {
    const words = [...new Set(list)].map(vocabWord).filter(Boolean);
    if (!words.length) return [];
    const teach = words.map((it, k) => ({ id: 'teach-' + it.w, t: 'teach', learn: true, s: it.sid, vw: it.w, n: k + 1, of: words.length }));
    const checks = shuffle(words).map((it) => {
      // Quick check asks for the meaning, so the wrong choices are plain-English definitions, never unknown words.
      const others = shuffle(ALLW.filter((x) => x.w !== it.w && !nearW(x.w, it.w) && x.d !== it.d));
      const opts = [...others.filter((x) => words.includes(x)), ...others.filter((x) => !words.includes(x) && x.pos === it.pos), ...others].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
      return { id: 'learncheck-' + it.w, t: 'mc', learn: true, s: it.sid, vw: it.w, kind: 'Quick check',
        q: `What does <b>${it.w}</b> mean?`, c: [rnd1(vInfo(it.w).alts), ...opts.map((x) => x.d)], a: 0,
        e: `${it.w[0].toUpperCase() + it.w.slice(1)} means ${it.d}. Example: ${it.s.replace('___', it.w)}${WX()[it.w] ? '\n' + WX()[it.w] : ''}` };
    });
    return [...teach, ...checks];
  }
  function wordCheckCard(q) {
    return h('div', { class: 'teach wordcheck', html: `
      <h2 class="guide-h">Do you know these words?</h2>
      <p class="muted" style="margin:0">This lesson uses ${q.words.length === 1 ? 'this word' : `these ${q.words.length} words`}. Be honest: any you don\u2019t know get a quick lesson first, and you won\u2019t be asked about ${q.words.length === 1 ? 'it' : 'them'} again.</p>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn small ghost" data-act="wcall" data-v="known">I know all of them</button><button class="btn small ghost" data-act="wcall" data-v="learn">Teach me all</button></div>
      <div class="wclist">${q.words.map((w) => { const it = vocabWord(w); return `<div class="wcrow" data-w="${w}"><div><b>${esc(w)}</b> <small class="muted">${{ a: 'adjective', v: 'verb', n: 'noun' }[it.pos]}</small></div>
        <div class="seg" role="group" aria-label="${esc(w)}"><button data-act="wc" data-w="${w}" data-v="known" aria-pressed="false">I know it</button><button data-act="wc" data-w="${w}" data-v="learn" aria-pressed="false">Teach me</button></div></div>`; }).join('')}</div>` });
  }
  function wcPick(w, v) {
    if (!L || !L.q || L.q.t !== 'wordcheck') return;
    const set = (word) => { L.wc[word] = v; document.querySelectorAll(`.wcrow[data-w="${word}"] [data-act="wc"]`).forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === v)); };
    if (w) set(w); else L.q.words.forEach(set);
    const done = L.q.words.every((x) => L.wc[x]), c = $('#contbtn'); if (c) c.disabled = !done;
  }
  function teachCard(q) {
    const it = vocabWord(q.vw), pos = { a: 'adjective', v: 'verb', n: 'noun' }[it.pos];
    return h('div', { class: 'teach', html: `
      <div class="teach-word">${esc(it.w)}<span class="teach-pos">${pos}</span></div>
      <div class="teach-def"><span class="lbl">Means</span>${esc(it.d)}</div>
      ${(() => { const v = vInfo(it.w); return (v.alts.length > 1 ? `<div class="teach-alt"><span class="lbl">Also put as</span>${v.alts.slice(1).map(esc).join(' \u00b7 ')}</div>` : '') + (v.syn.length ? `<div class="teach-alt"><span class="lbl">Similar words</span>${v.syn.map(esc).join(', ')}</div>` : ''); })()}
      ${WX()[it.w] ? `<div class="teach-alt teach-more"><span class="lbl">In plain words</span>${esc(WX()[it.w])}</div>` : ''}
      <div class="passage">${esc(it.s).replace('___', `<b>${esc(it.w)}</b>`)}</div>
      <p class="muted teach-note">Word ${q.n} of ${q.of} to learn. You'll get a quick check on each one, then the lesson starts.</p>` });
  }

  /* "How to solve" guides (SAT + ACT): step-by-step cards before the first practice in each skill. */
  const GUIDES = () => ({ ...(window.INK_SAT_GUIDES || {}), ...(window.INK_ACT_GUIDES || {}) });
  const guideCards = (sid) => (GUIDES()[sid] || []).map((g, i, all) => ({ id: `guide-${sid}-${i}`, t: 'guide', learn: true, s: sid, g, n: i + 1, of: all.length }));
  function guideSheet(sid) {
    const G = GUIDES()[sid]; if (!G) return;
    const sk = SKMAP[sid], u = UNMAP[sk.unit];
    openSheet(`<div class="top"><div class="icon">${esc(sk.icon)}</div><div><div class="eyebrow">How to solve</div><h2>${esc(sk.name)}</h2></div></div>
      ${G.map((g, i) => `<details class="eguide"${i < 2 ? ' open' : ''}><summary>${i + 1}. ${esc(g.h)}</summary><div class="ebody">${g.html}</div></details>`).join('')}
      <button class="btn block" data-act="start" data-skill="${sid}">Practice ${esc(sk.name)}</button>`, `var(--${u.color});--uc2:var(--${u.color}b)`);
  }

  function startLesson(mode, sid) {
    closeSheet();
    syncHearts();
    if (!['speed', 'bell', 'weekly', 'section'].includes(mode) && S.settings.hearts && S.hearts <= 0) { heartsSheet(); return; }
    let queue = mode === 'section' ? buildSection(sid) : mode === 'bell' ? (bellToday() ? [] : buildBell()) : mode === 'weekly' ? (weekly().done ? [] : weekly().ids.filter((id) => !(id in S.weekly.ans)).map((id) => QS.find((q) => q.id === id)).filter(Boolean)) : buildQueue(mode, sid);
    let learnEnd = 0, pendingTeach = [];
    const lessonWords = [...new Set(queue.flatMap(wordsOf))].filter((w) => vocabWord(w));
    ALLOWED = new Set([...ALLW.filter((x) => isLearned(x.w)).map((x) => x.w), ...lessonWords]);
    if (!['bell', 'speed', 'weekly', 'section'].includes(mode) && queue.length) {
      const ask = lessonWords.filter(unasked); pendingTeach = lessonWords.filter(needsTeach);
      const pre = ask.length ? [{ id: 'wordcheck', t: 'wordcheck', learn: true, s: queue[0].s, words: ask }] : teachPhase(pendingTeach);
      learnEnd = pre.length; queue = [...pre, ...queue];
    }
    const G = GUIDES()[sid];
    if (mode === 'skill' && G && queue.length && !S.guides[sid]) { const gc = guideCards(sid); learnEnd += gc.length; queue = [...gc, ...queue]; }
    if (!queue.length) { if (mode === 'skill') skillSheet(sid); else if (mode === 'unit') unitSheet(sid); else if (mode === 'weekly') toast('This week\u2019s challenge is done. A new one starts Monday.', I.medal); else if (mode === 'bell') toast(bellToday() ? 'Today\u2019s Bell Ringer is done. A new one starts at midnight.' : 'Answer at least 3 questions to unlock the Bell Ringer.', I.bell); else toast('Nothing is ready in that mode right now.', I.clock); return; }
    L = { mode, sid, queue, total: queue.length, idx: 0, done: 0, retried: new Set(), first: new Map(), combo: 0, maxCombo: 0, xp: 0, start: Date.now(), state: 'answer', speedScore: 0, ended: false, learnEnd, pendingTeach, wc: {} };
    if (mode === 'speed') L.speedEnd = Date.now() + SPEED_SECS * 1000;
    if (mode === 'skill' && !S.tried.includes(sid)) S.tried.push(sid);
    if (mode === 'unit') L.unit = sid;
    if (mode === 'weekly') { L.total = S.weekly.ids.length; L.done = weeklyAnswered(S.weekly); }
    if (mode === 'section') { L.sec = SECTIONS[sid]; L.secId = sid; L.secEnd = Date.now() + L.sec.mins * 60000; L.review = []; }
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
    if (L.mode === 'speed' || L.mode === 'section') L.timer = setInterval(updateLessonTop, 250);
  }
  function updateLessonTop() {
    if (!L) return;
    const bar = $('#lesson .bar > i'), st = $('#lstat');
    if (L.mode === 'speed') {
      const left = Math.max(0, L.speedEnd - Date.now());
      bar.style.width = `${100 - (left / (SPEED_SECS * 1000)) * 100}%`;
      st.innerHTML = `<span class="timer num">${Math.ceil(left / 1000)}s</span>`;
      if (left <= 0 && L.state === 'answer' && !L.ended) finishLesson();
    } else if (L.mode === 'section') {
      const left = Math.max(0, L.secEnd - Date.now());
      bar.style.width = `${(L.first.size / L.total) * 100}%`;
      st.innerHTML = `<span class="timer num${left < 60000 ? ' low' : ''}">${fmtClock(left)}</span>`;
      if (left <= 0 && !L.ended) finishLesson();
    } else if (L.mode === 'weekly') {
      bar.style.width = `${(L.done / L.total) * 100}%`;
      st.innerHTML = `<span class="hearts" style="color:var(--brand)" aria-label="Weekly Challenge">${I.medal}<span>${L.done}/${L.total}</span></span>`;
    } else if (L.mode === 'bell') {
      bar.style.width = `${(L.done / L.total) * 100}%`;
      st.innerHTML = `<span class="hearts" style="color:var(--flame)" aria-label="Bell Ringer">${I.bell}<span>${L.done}/${L.total}</span></span>`;
    } else {
      bar.style.width = `${(L.done / L.total) * 100}%`;
      st.innerHTML = S.settings.hearts ? `<span class="hearts" aria-label="${S.hearts} hearts">${I.heart}<span>${S.hearts}</span></span>` : `<span class="hearts" aria-label="Unlimited hearts">${I.heart}<span>∞</span></span>`;
    }
  }

  function showQuestion() {
    const q = vary(L.queue[L.idx]), body = $('#lbody'), foot = $('#lfoot');
    L.state = 'answer'; L.q = q;
    const skill = SKMAP[q.s], unit = UNMAP[skill.unit];
    const wrap = h('div', { class: 'qwrap' });
    const retry = L.retried.has(q.id) && L.first.has(q.id);
    wrap.append(h('div', { class: 'qtype' }, h('span', { class: 'kind' }, q.t === 'wordcheck' ? 'Word check' : q.t === 'guide' ? 'How to solve' : q.t === 'teach' ? 'Learn it' : q.kind || KIND[q.t]),
      h('span', { class: 'chip', style: `--uc:var(--${unit.color});--uc2:var(--${unit.color}b);background:var(--${unit.color});color:#fff` }, skill.name),
      retry ? h('span', { class: 'chip' }, 'Second try') : null,
      q.learn ? h('span', { class: 'chip', style: 'background:var(--hl);color:var(--on-hl)' }, q.t === 'guide' ? 'Strategy' : q.t === 'wordcheck' ? 'Vocabulary' : 'New word') : null,
      q.d === 3 ? h('span', { class: 'chip hardchip' }, 'Hard') : null,
      q.reworded ? h('span', { class: 'chip' }, 'Reworded') : null,
      q.act ? h('span', { class: 'chip actchip' }, 'ACT') : null,
      qTimerOn(q) ? h('span', { class: 'qclock num', id: 'qclock', 'aria-label': 'Time for this question' }, fmtClock(paceFor(q) * 1000)) : null,
      q.bell ? h('span', { class: 'chip bellchip' }, `Bell Ringer \u00b7 was \u201c${KIND[q.origType]}\u201d`) : null,
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
    if (q.t === 'teach' || q.t === 'guide' || q.t === 'wordcheck') {
      wrap.append(q.t === 'wordcheck' ? wordCheckCard(q) : q.t === 'guide' ? h('div', { class: 'teach guide', html: `<h2 class="guide-h">${esc(q.g.h)}</h2><div class="ebody">${q.g.html}</div><p class="muted teach-note">Step ${q.n} of ${q.of}${q.n === q.of ? ' \u00b7 Next up: practice questions.' : ''}</p>` }) : teachCard(q));
      const old0 = body.querySelector('.qwrap');
      if (old0 && !calm()) { old0.classList.add('qout'); setTimeout(() => { if (L && L.q === q) { body.replaceChildren(wrap); body.scrollTop = 0; } }, 150); }
      else { body.replaceChildren(wrap); body.scrollTop = 0; }
      L.state = 'feedback'; L.w = null;
      foot.className = 'lesson-foot';
      foot.innerHTML = q.t === 'wordcheck' ? `<div class="inner"><button class="btn" data-act="continue" id="contbtn" disabled>Continue</button></div>` : `<div class="inner"><button class="btn" data-act="continue" id="contbtn">${q.t === 'guide' ? (q.n === q.of ? 'Start practice' : 'Next') : 'Got it'}</button></div>`;
      setTimeout(() => { const c = $('#contbtn'); if (c) c.focus({ preventScroll: true }); }, 30);
      updateLessonTop();
      return;
    }
    const W = { mc: wMC, tf: wTF, cloze: wCloze, punct: wPunct, input: wInput, tap: wTap, match: wMatch, sort: wSort, order: wOrder }[q.t];
    L.w = W(q, ctx, passageEl);
    wrap.append(L.w.el);
    const old = body.querySelector('.qwrap');
    if (old && !calm()) { old.classList.add('qout'); setTimeout(() => { if (L && L.q === q) { body.replaceChildren(wrap); body.scrollTop = 0; } }, 150); }
    else { body.replaceChildren(wrap); body.scrollTop = 0; }
    foot.className = 'lesson-foot';
    foot.innerHTML = L.w.auto
      ? `<div class="inner"><button class="btn ghost" data-act="skipmatch">Can’t do this now</button></div>`
      : L.mode === 'section' ? `<div class="inner"><button class="btn ghost" data-act="secskip">Skip</button><button class="btn" id="checkbtn" data-act="check" disabled>Next</button></div>`
      : `<div class="inner"><button class="btn" id="checkbtn" data-act="check" disabled>Check</button></div>`;
    updateLessonTop();
    clearInterval(L.qTick); L.qTick = null; L.timedOut = false;
    if (qTimerOn(q)) { L.qStart = Date.now(); L.qLimit = paceFor(q) * 1000; L.qTick = setInterval(qTickFn, 250); }
  }
  function qTimerOn(q) { return S.settings.qtimer !== 'off' && L && !['speed', 'weekly', 'section'].includes(L.mode) && !q.learn && q.t !== 'teach'; }
  function qTickFn() {
    if (!L || L.state !== 'answer' || !L.qStart) { if (L) { clearInterval(L.qTick); L.qTick = null; } return; }
    const left = L.qLimit - (Date.now() - L.qStart), el = $('#qclock');
    if (el) { el.textContent = left > 0 ? fmtClock(left) : '+' + fmtClock(-left); el.classList.toggle('over', left <= 0); el.classList.toggle('low', left > 0 && left < 10000); }
    if (left <= 0 && S.settings.qtimer === 'strict' && L.w && !L.w.auto) { clearInterval(L.qTick); L.qTick = null; L.timedOut = true; const { answer } = L.w.check(); resolve(false, answer); }
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
    const q = L.q;
    if (L.qTick) { clearInterval(L.qTick); L.qTick = null; }
    if (L.qStart && !q.learn) { S.pace.n++; if (Date.now() - L.qStart <= L.qLimit) S.pace.on++; L.qStart = 0; }
    if (q.learn) { resolveLearn(q, ok, answer); return; }
    if (L.mode === 'section') {
      L.state = 'feedback';
      if (!L.first.has(q.id)) { L.first.set(q.id, ok); grade(q, ok); S.totalAnswered++; if (ok) { S.totalCorrect++; S.daily.correct++; if (MATH.has(q.s)) S.daily.math++; } L.review.push({ q, ok, answer }); }
      L.done++; sfx.tap(); save();
      setTimeout(() => { if (!L || L.ended) return; L.idx++; if (L.idx >= L.queue.length) finishLesson(); else showQuestion(); }, 140);
      return;
    }
    const first = !L.first.has(q.id);
    if (first) {
      if (!ok && !q.learn) {
        const base = q.base || q, ans = base.c && typeof base.c[base.a] === 'string' ? base.c[base.a].toLowerCase().trim() : '';
        const missedW = [...new Set([...(q.vw ? [q.vw] : detectWords(base, true)), ...(vocabWord(ans) ? [ans] : [])])].filter(markReview);
        L.reteach = missedW;
      } else L.reteach = [];
      L.first.set(q.id, ok); if (L.mode === 'weekly') S.weekly.ans[q.id] = ok; else if (q.bell) bellGrade(q, ok); else grade(q, ok); S.totalAnswered++;
      if (ok) { S.totalCorrect++; S.daily.correct++; if (MATH.has(q.s)) S.daily.math++; }
    }
    L.w.reveal(ok);
    document.dispatchEvent(new CustomEvent('ink:answer', { detail: { ok, combo: ok ? L.combo + 1 : 0 } }));
    if (ok) {
      L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo);
      L.xp += (first ? 2 : 1) + (L.combo >= 3 ? 1 : 0);
      L.done++; if (L.mode === 'speed') L.speedScore++;
      sfx.ok();
      restart($('#lesson .bar'), 'shine');
      xpFloat(L.mode === 'weekly' ? '+3 XP' : `+${(first ? 2 : 1) + (L.combo >= 3 ? 1 : 0)} XP`);
      if ([3, 5, 10, 15].includes(L.combo)) comboFlash(L.combo);
    } else {
      L.combo = 0; sfx.no();
      if (L.mode === 'bell' || L.mode === 'weekly') L.done++;
      else if (L.mode !== 'speed') {
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
    const willRetry = !ok && L.mode !== 'speed' && L.mode !== 'bell' && L.mode !== 'weekly' && L.queue.lastIndexOf(q) > L.idx;
    foot.innerHTML = `
      <div class="verdict" role="status" aria-live="assertive">
        ${mascot(ok ? 'happy' : 'sad')}
        <div>
          <h3>${ok ? pick(PRAISE) : L.timedOut ? 'Time\u2019s up.' : pick(OOPS)}</h3>
          ${!ok && answer ? `<p class="ans">Correct answer: ${esc(strip(answer))}</p>` : ''}
          <div class="expl">${fmtE(explainText(q))}</div>
          ${willRetry ? '<p class="muted">You’ll see this one again at the end of the lesson.</p>' : ''}
          ${!ok && L.reteach && L.reteach.length ? `<p class="muted">We\u2019ll reteach <b>${L.reteach.map(esc).join(', ')}</b> before your next lesson.</p>` : ''}
          ${!ok && L.mode === 'bell' ? '<p class="muted">The original question is back in \u201cFix your mistakes\u201d in 10 minutes.</p>' : ''}
        </div>
      </div>
      <div class="inner"><button class="btn ${ok ? 'good' : 'bad'}" data-act="continue" id="contbtn">Continue</button></div>`;
    setTimeout(() => { const c = $('#contbtn'); if (c) c.focus({ preventScroll: true }); }, 30);
  }

  function resolveLearn(q, ok, answer) {
    L.w.reveal(ok);
    if (ok) { L.done++; sfx.ok(); if (!S.learned.includes(q.vw)) S.learned.push(q.vw); S.wordKnow[q.vw] = 'learned'; save(); }
    else { sfx.no(); L.queue.splice(L.learnEnd, 0, q); L.learnEnd++; }
    updateLessonTop();
    const foot = $('#lfoot');
    foot.className = 'lesson-foot ' + (ok ? 'ok' : 'no');
    foot.innerHTML = `
      <div class="verdict" role="status" aria-live="assertive">
        ${mascot(ok ? 'happy' : 'sad')}
        <div>
          <h3>${ok ? pick(PRAISE) : pick(OOPS)}</h3>
          ${!ok && answer ? `<p class="ans">Correct answer: ${esc(strip(answer))}</p>` : ''}
          <div class="expl">${fmtE(explainText(q))}</div>
          ${ok ? '' : '<p class="muted">This was just a practice check, so no heart lost. You\u2019ll try it again before the lesson starts.</p>'}
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
    if (L.mode !== 'speed' && L.mode !== 'bell' && L.mode !== 'weekly' && S.settings.hearts && S.hearts <= 0) { finishLesson(true); return; }
    if (L.q && L.q.t === 'wordcheck') {
      if (!L.q.words.every((w) => L.wc[w])) return;
      const toLearn = [];
      for (const w of L.q.words) { if (L.wc[w] === 'known') S.wordKnow[w] = 'known'; else { S.wordKnow[w] = 'learn'; toLearn.push(w); } }
      const tp = teachPhase([...L.pendingTeach, ...toLearn]);
      L.queue.splice(L.idx + 1, 0, ...tp); L.total += tp.length; L.learnEnd = L.idx + 1 + tp.length; save();
    }
    if (L.q && (L.q.t === 'teach' || L.q.t === 'guide' || L.q.t === 'wordcheck')) L.done++;
    if (L.q && L.q.t === 'guide' && L.q.n === L.q.of) { S.guides[L.q.s] = true; save(); }
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
    if (L.mode === 'bell') { xp = L.xp + 10 + (perfect ? 5 : 0); gems = 10 + (perfect ? 5 : 0); S.bell = { day: dayKey(), done: true, score: right, total: answered }; S.bellRuns++; S.daily.bell = 1; }
    if (L.mode === 'speed') { xp = L.speedScore * 2 + (L.speedScore >= 8 ? 5 : 0); gems = L.speedScore >= 8 ? 5 : 0; S.bestSpeed = Math.max(S.bestSpeed, L.speedScore); }
    let wk = null, secRes = null;
    if (L.mode === 'section') {
      const total = L.queue.length, score = [...L.first.values()].filter(Boolean).length, secs0 = Math.round((Date.now() - L.start) / 1000);
      const timeUp = Date.now() >= L.secEnd, finished = L.first.size >= total;
      xp = score * 2 + (finished || timeUp ? 10 : 0); gems = finished || timeUp ? 5 : 0;
      S.sectionHist.push({ id: L.secId, date: dayKey(), score, total, secs: secs0 });
      secRes = { score, total, unanswered: total - L.first.size, timeUp };
      const ls = $('#lstat'); if (ls) ls.innerHTML = '';
    }
    if (L.mode === 'weekly') {
      const w = S.weekly, all = weeklyAnswered(w) >= w.ids.length;
      xp = 0; gems = 0;
      if (all && !w.done) {
        const sp = weeklySplit(w), score = Object.values(w.ans).filter(Boolean).length;
        const prev = S.weeklyHist[S.weeklyHist.length - 1];
        xp = score * 3 + 25; gems = 15;
        w.done = true; w.score = score;
        S.weeklyHist.push({ week: w.week, score, total: w.ids.length, rw: sp.rw, math: sp.math, date: dayKey() });
        wk = { score, total: w.ids.length, sp, prev };
      }
    }
    const extended = addXP(xp);
    S.gems += gems;
    if (completed) { S.lessons++; S.daily.lessons++; }
    if (perfect) { S.perfects++; S.daily.perfect++; }
    if (completed && L.mode === 'mistakes') S.mistakeRuns++;
    if (completed && L.mode === 'unit') S.unitRuns[L.unit] = (S.unitRuns[L.unit] || 0) + 1;
    if (perfect && L.mode === 'bell') S.perfectBells++;
    if (completed) { const hr = new Date().getHours(); if (hr >= 22) S.owl = 1; if (hr < 7 && hr >= 3) S.lark = 1; }
    checkQuests(); checkAch(); save();
    const secs = Math.round((Date.now() - L.start) / 1000);
    const acc = secRes ? Math.round((secRes.score / secRes.total) * 100) : wk ? Math.round((wk.score / wk.total) * 100) : answered ? Math.round((right / answered) * 100) : 0;
    const body = $('#lbody'), foot = $('#lfoot');
    $('#lesson .bar > i').style.width = '100%';
    let title = 'Lesson complete!', mood = 'happy', sub = '';
    if (outOfHearts) { title = 'Out of hearts'; mood = 'sad'; sub = `Your answers were saved. Hearts refill one every 20 minutes, or you can refill them in the shop.`; }
    else if (L.mode === 'speed') { title = `Time! You scored ${L.speedScore}`; mood = L.speedScore >= 8 ? 'wow' : 'happy'; sub = S.bestSpeed === L.speedScore && L.speedScore > 0 ? 'That’s your best Speed Round yet.' : `Best so far: ${S.bestSpeed}`; }
    else if (secRes) {
      title = `${L.sec.name}: ${secRes.score}/${secRes.total}`; mood = secRes.score / secRes.total >= 0.8 ? 'wow' : 'happy';
      sub = `${Math.round((secRes.score / secRes.total) * 100)}% correct${secRes.unanswered ? `, ${secRes.unanswered} ${secRes.timeUp ? 'not reached before time ran out' : 'left unanswered'}` : ''}. Missed questions are below and back in \u201cFix your mistakes.\u201d`;
    }
    else if (L.mode === 'weekly' && wk) {
      title = `Weekly Challenge: ${wk.score}/${wk.total}`; mood = wk.score / wk.total >= 0.8 ? 'wow' : 'happy';
      const d = wk.prev ? wk.score - wk.prev.score : null;
      const weak = Object.entries(wk.sp.missed).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([sid]) => SKMAP[sid].name);
      sub = `Reading & writing ${wk.sp.rw[0]}/${wk.sp.rw[1]} \u00b7 Math ${wk.sp.math[0]}/${wk.sp.math[1]}. ` + (d == null ? 'This is your baseline; next week shows your progress.' : d > 0 ? `Up ${d} from last time!` : d < 0 ? `Down ${-d} from last time. Check the skills below.` : 'Same as last time.') + (weak.length ? ` Work on: ${weak.join(', ')}.` : ' Nothing missed!');
    }
    else if (L.mode === 'weekly') { title = 'Progress saved'; mood = 'happy'; sub = `${weeklyAnswered(S.weekly)}/${S.weekly.ids.length} answered. Finish the rest any day this week to collect your XP.`; }
    else if (L.mode === 'unit' && !outOfHearts && answered) { title = perfect ? 'Perfect Unit Review!' : 'Unit Review complete!'; mood = perfect ? 'wow' : 'happy'; sub = `${UNMAP[L.unit].name}: ${right} of ${answered} right on the first try.`; }
    else if (L.mode === 'bell') { title = perfect ? 'Perfect Bell Ringer!' : 'Bell Ringer done!'; mood = perfect ? 'wow' : 'happy'; sub = perfect ? 'Every old answer still stuck. +15 XP bonus and +15 gems.' : `${right} of ${answered} right. Anything you missed is back in \u201cFix your mistakes.\u201d`; }
    else if (perfect) { title = 'Perfect lesson!'; mood = 'wow'; sub = 'No mistakes. +5 bonus XP and +5 bonus gems.'; }
    else if (answered && acc < 60) { sub = 'The ones you missed come back in about 10 minutes, so you can try them again soon.'; }
    body.innerHTML = `<div class="done">${mascot(mood)}
      <h1>${esc(title)}</h1>${sub ? `<p class="muted" style="margin:0">${esc(sub)}</p>` : ''}
      <div class="kv"><div><b data-count="${xp}" data-prefix="+">+${xp}</b><span>XP</span></div><div><b>${L.mode === 'speed' ? L.speedScore : acc + '%'}</b><span>${L.mode === 'speed' ? 'Correct' : 'Accuracy'}</span></div><div><b>${Math.floor(secs / 60)}:${pad(secs % 60)}</b><span>Time</span></div></div>
      <div class="kv"><div><b data-count="${L.maxCombo}">${L.maxCombo}</b><span>Best combo</span></div><div><b data-count="${gems}" data-prefix="+">+${gems}</b><span>Gems</span></div><div><b>${S.daily.xp}/${S.settings.goal}</b><span>Daily goal</span></div></div>
    </div>`;
    if (secRes) {
      const missed = L.review.filter((r) => !r.ok), skipped = L.queue.filter((q) => !L.first.has(q.id));
      if (missed.length || skipped.length) body.insertAdjacentHTML('beforeend', `<div class="secreview"><h2>Review</h2>${[...missed.map((r) => ({ q: r.q, answer: r.answer })), ...skipped.map((q) => ({ q, answer: null, skipped: true }))].map((r, i) => {
        const q = r.q, ans = r.answer || (q.c ? q.c[q.a] : q.a ? q.a[0] : '');
        return `<details class="eguide"><summary>${i + 1}. ${esc(strip(q.q || q.p || '').slice(0, 90))}\u2026${r.skipped ? ' <small class="muted">(not reached)</small>' : ''}</summary><div class="ebody">${q.p ? `<div class="passage" style="max-height:220px;overflow:auto">${q.p}</div>` : ''}${q.q ? `<p><b>${q.q}</b></p>` : ''}<p class="ans"><b>Correct answer:</b> ${esc(strip(String(ans)))}</p><div class="expl">${fmtE(explainText(q))}</div></div></details>`; }).join('')}</div>`);
    }
    body.querySelectorAll('[data-count]').forEach((el, i) => { const n = +el.dataset.count, p = el.dataset.prefix || ''; el.textContent = p + '0'; setTimeout(() => countUp(el, n, 800, p), 350 + i * 120); });
    foot.className = 'lesson-foot';
    foot.innerHTML = `<div class="inner"><button class="btn" data-act="${extended ? 'streakscreen' : 'endlesson'}" id="contbtn">Continue</button></div>`;
    if (!outOfHearts) { sfx.win(); if (perfect || L.mode === 'speed' && L.speedScore >= 8 || (wk && wk.prev && wk.score > wk.prev.score)) confetti(); }
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
    if (S.newBadges.length) setTimeout(showBadges, 350);
  }

  /* ============================================================ SHEETS */
  function openSheet(html, uc) {
    closeSheet();
    const scrim = h('div', { class: 'scrim', id: 'sheet', onclick: (e) => { if (e.target === scrim) closeSheet(); } });
    const sh = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', html });
    if (uc) { const [a, b] = uc.split(';--uc2:'); sh.style.setProperty('--uc', a); if (b) sh.style.setProperty('--uc2', b); }
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
      <div class="tipline"><b>Tip:</b> ${esc((window.INK_TIPS || {})[sid] || sk.tip)}</div>
      ${GUIDES()[sid] ? `<button class="btn ghost block" data-act="guide" data-skill="${sid}">How to solve these questions${S.guides[sid] ? '' : ' (shown before your first lesson)'}</button>` : ''}
      ${body}
      <p class="muted" style="margin:0;font-size:14px">Questions you get right rest for 1 day, then 3, 7, 16, and 35 days. Missed questions come back after 10 minutes.</p>`, `var(--${u.color});--uc2:var(--${u.color}b)`);
  }
  function unitStats(uid) {
    const pool = unitPool(uid), now = Date.now();
    const ready = pool.filter((q) => isReady(q, now)).length;
    const mist = pool.filter((q) => { const r = S.q[q.id]; return r && r.w > 0 && r.box <= 1 && r.due <= now; }).length;
    const pt = pool.filter((q) => q.src === 'pt1');
    const mast = pool.filter((q) => isMast(S.q[q.id])).length;
    return { total: pool.length, ready, mist, pt: pt.length, ptReady: pt.filter((q) => isReady(q, now)).length, mast, next: nextUnlock(pool) };
  }
  function unitSheet(uid) {
    const u = UNMAP[uid], st = unitStats(uid), n = Math.min(st.ready, REVIEW_LEN);
    const skills = SK.filter((s) => s.unit === uid).map((s) => s.name).join(', ');
    openSheet(`
      <div class="top"><div class="icon">${I.medal.replace('<svg', '<svg style="width:30px;height:30px"')}</div><div><div class="eyebrow">${esc(u.name)}</div><h2>Unit Review</h2></div></div>
      <p class="muted" style="margin:0">A mixed practice round across ${esc(skills)}. Your mistakes come first, then Practice Test 1 questions, then a mix from every skill in the unit.</p>
      <div class="kv"><div><b>${st.ready}</b><span>Ready now</span></div><div><b>${st.mist}</b><span>Mistakes to fix</span></div>${st.pt ? `<div><b>${st.ptReady}/${st.pt}</b><span>Practice Test 1</span></div>` : `<div><b>${st.mast}/${st.total}</b><span>Mastered</span></div>`}</div>
      <div class="bar good" aria-label="Unit mastery"><i style="width:${st.total ? Math.round((st.mast / st.total) * 100) : 0}%"></i></div>
      <p class="muted" style="margin:0;font-size:14px">${st.mast} of ${st.total} questions in this unit mastered.</p>
      ${n ? `<button class="btn block" data-act="startunit" data-unit="${uid}">Start Unit Review \u00b7 ${n} questions</button>`
        : `<div class="tipline">Everything in this unit is resting. The next question unlocks ${esc(fmtWhen(st.next))}.</div>`}`, `var(--${u.color});--uc2:var(--${u.color}b)`);
  }
  function reviewNodeHTML(u, i, dx = 0) {
    const st = unitStats(u.id), r = 38, C = 2 * Math.PI * r, pct = st.total ? st.mast / st.total : 0;
    const badge = st.ready > 0 ? `<span class="badge" title="${st.ready} ready">${Math.min(st.ready, 99)}</span>` : `<span class="badge clock">${I.clock}</span>`;
    return `<div class="node-row ${S.unitRuns[u.id] ? 'visited' : ''}" style="--i:${i};--dx:${dx}"><button class="node review ${st.ready ? '' : 'rest'}" data-act="unitreview" data-unit="${u.id}" style="--uc:var(--${u.color});--uc2:var(--${u.color}b)" aria-label="${esc(u.name)} Unit Review: ${st.ready} ready">
      <span class="disc"><svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--surface-2)" stroke-width="5"/><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--hl)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 42 42)" class="ringfill" style="--c:${C}"/></svg>
      <span class="face">${I.medal}</span>${badge}</span>
      <span class="label">Unit Review</span>${st.mist ? `<span class="sublabel">${st.mist} to fix</span>` : st.ptReady ? `<span class="sublabel">${st.ptReady} test questions</span>` : ''}</button></div>`;
  }
  function practiceStrip() {
    const now = Date.now();
    const mr = mistakesPool().filter((q) => isReady(q, now)).length, rr = reviewPool().filter((q) => isReady(q, now)).length;
    const pr = pt1Pool().filter((q) => isReady(q, now)).length;
    const sr = QS.filter((q) => isReady(q, now) && ['mc', 'tf', 'cloze', 'punct', 'input'].includes(q.t)).length;
    const tile = (m, g, icon, label, n, sub) => `<button class="ptile" data-act="mode" data-mode="${m}" ${n ? '' : 'disabled'} style="--pg:${g}"><span class="picon">${icon}</span><span class="ptext"><b>${label}</b><span>${n ? sub : 'Nothing ready'}</span></span>${n ? `<span class="pcount num">${n}</span>` : ''}</button>`;
    return `<section class="pstrip" aria-label="Quick practice"><div class="row between"><h2>Quick practice</h2><button class="linkbtn" data-act="go" data-view="practice">All modes</button></div>
      <div class="pgrid">
        ${tile('mistakes', 'linear-gradient(135deg,var(--bad),var(--bad-2))', I.redo, 'Fix mistakes', mr, 'Missed recently')}
        ${tile('review', 'var(--g-brand)', I.stack, 'Mixed review', rr, 'Due again')}
        ${tile('pt1', 'linear-gradient(135deg,var(--u3),var(--u3b))', I.medal, 'Practice Test 1', pr, 'From your PSAT')}
        ${tile('speed', 'linear-gradient(135deg,#FFB347,var(--flame),var(--flame-2))', I.bolt, 'Speed round', sr ? 60 : 0, '60 seconds')}
      </div></section>`;
  }
  function heartsSheet() {
    const can = S.gems >= 30;
    openSheet(`<div class="top"><div class="icon" style="background:var(--heart)">${I.heart.replace('<svg', '<svg style="width:30px;height:30px"')}</div><div><h2>You’re out of hearts</h2><p class="muted" style="margin:2px 0 0">Next heart in ${fmtDur(HEART_MS - (Date.now() - S.heartsAt))}.</p></div></div>
      <button class="btn block" data-act="buy" data-item="hearts" ${can ? '' : 'disabled'}>Refill hearts · 30 gems</button>
      <button class="btn ghost block" data-act="hearts-off">Turn on unlimited hearts</button>
      <p class="muted" style="margin:0;font-size:14px">Unlimited hearts can be switched back off any time in Settings.</p>`);
  }
  function quitSheet() {
    openSheet(`<h2>${L && L.mode === 'weekly' ? 'Take a break?' : L && L.mode === 'section' ? 'End the section now?' : 'Quit this lesson?'}</h2><p class="muted" style="margin:0">${L && L.mode === 'weekly' ? `Your ${weeklyAnswered(S.weekly)} answers are saved. Come back any day this week to finish and collect your XP.` : 'Answers you already gave are saved, but you won’t get the completion bonus.'}</p>
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
    { id: 'essay', label: 'Essay Lab', icon: I.quests, hidden: true },
  ];
  const curView = () => { const v = (location.hash || '').slice(1); return VIEWS.some((x) => x.id === v) ? v : 'learn'; };

  function shell() {
    const app = $('#app');
    app.innerHTML = `
      <div class="shell">
        <nav class="rail" aria-label="Main">
          <div class="brand">${mascot('happy', S.hat, 'mascot')}<span>Inkwell</span></div>
          ${VIEWS.filter((v) => !v.hidden).map((v) => `<button class="tab" data-act="go" data-view="${v.id}">${v.icon}<span>${v.label}</span></button>`).join('')}
        </nav>
        <main class="main">
          <div class="topbar"><div class="brand">${mascot('happy', S.hat, 'mascot')}<span>Inkwell</span></div><div class="stats" id="stats"></div></div>
          <div class="wrap" id="view"></div>
        </main>
        <aside class="aside" id="aside" aria-label="Today"></aside>
      </div>
      <nav class="tabbar" aria-label="Main">${VIEWS.filter((v) => v.id !== 'prefs' && !v.hidden).map((v) => `<button class="tab" data-act="go" data-view="${v.id}">${v.icon}<span>${v.label}</span></button>`).join('')}</nav>`;
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
        return `<div class="quest ${done ? 'qdone' : ''}"><span style="font-weight:700">${esc(q.label)}</span><span class="reward">${done ? I.check : I.gem}${done ? 'Done' : '+' + q.reward}</span><div class="bar"><i style="width:${(p / q.goal) * 100}%"></i></div><span class="muted num" style="font-size:13px">${p} / ${q.goal}</span></div>`; }).join('')}
      <p class="muted" style="margin:6px 0 0;font-size:13px">New quests every day at midnight.</p></div>`;
  }
  function streakCard() {
    return `<div class="card stack"><div class="row between"><div class="row" style="gap:8px"><span style="width:28px;height:28px;color:var(--flame);display:inline-block">${I.flame}</span><h2>${S.streak} day streak</h2></div><span class="chip" title="Streak freezes">${I.snow.replace('<svg', '<svg style="width:14px;height:14px"')} ${S.freezes}/2</span></div>
      ${weekStrip()}<p class="muted" style="margin:0;font-size:13px">Best: ${S.best} day${S.best === 1 ? "" : "s"}. A streak freeze covers a missed day automatically.</p></div>`;
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
      <div class="goalpick">${[[60, 'Casual'], [100, 'Regular'], [150, 'Serious'], [200, 'Intense']].map(([g, n]) => `<button data-act="goal" data-goal="${g}" aria-pressed="${S.settings.goal === g}">${n} · ${g} XP</button>`).join('')}</div>
      <div class="row" style="margin-top:12px;flex-wrap:wrap"><button class="btn" data-act="start" data-skill="voc">Start the first lesson</button><button class="linkbtn" data-act="welcomed">Just look around</button></div></div></div>`;
  }

  function bellCard() {
    const seen = seenPool().length, done = bellToday(), wd = wordOfDay();
    const status = done ? `<span class="bellscore">${I.check}${S.bell.score}/${S.bell.total} today</span>`
      : seen < 3 ? '<span class="bellnote">Unlocks after you answer 3 questions.</span>'
      : `<button class="btn small bellbtn" data-act="mode" data-mode="bell">${I.bell}Start \u00b7 ${Math.min(BELL_LEN, seen)} questions</button>`;
    return `<section class="bellcard" aria-label="Daily Bell Ringer">
      <div class="bell-main"><div class="eyebrow">Daily Bell Ringer</div>
        <h2>${done ? 'Done for today. Nice ringing.' : 'Old answers, new questions'}</h2>
        <p>${done ? 'A new set starts at midnight, built from what you\u2019ve missed and what you answered longest ago.' : 'Up to six questions you missed or answered a while ago, each rebuilt in a different style. Mistakes go back into review.'}</p>
        ${status}</div>
      ${wd ? `<div class="wotd"><div class="eyebrow">Word of the day</div><b>${esc(wd.w)}</b><i>${{ a: 'adjective', v: 'verb', n: 'noun' }[wd.pos]}</i><span>${esc(wd.d)}</span><small>${wd.s.replace('___', `<u>${esc(wd.w)}</u>`)}</small></div>` : ''}
    </section>`;
  }

  /* ------------------------------------------------------------- journey */
  const REGIONS = {
    u1: { name: 'Word Woods', scene: 'trees' }, u2: { name: 'Structure Cliffs', scene: 'cliffs' }, u3: { name: 'Evidence Valley', scene: 'hills' },
    u4: { name: 'Transition River', scene: 'river' }, u5: { name: 'Grammar Gardens', scene: 'flowers' }, u8: { name: 'Story Library', scene: 'books' },
    u6: { name: 'Algebra Peaks', scene: 'peaks' }, u7: { name: 'Data Observatory', scene: 'stars' },
    u9: { name: 'ACT English Coast', scene: 'river' }, u10: { name: 'ACT Math Ridge', scene: 'peaks' }, u11: { name: 'ACT Reading Room', scene: 'books' }, u12: { name: 'ACT Science Lab', scene: 'stars' },
  };
  const region = (uid) => REGIONS[uid] || { name: UNMAP[uid].name, scene: 'hills' };
  const EMB = {
    trees: '<path d="M12 2 5.5 11.5h3.8L6 16.5h12l-3.3-5h3.8z"/><path d="M12 16.5V22"/>',
    cliffs: '<path d="M2.5 21 7.5 9l3 4 3.5-9L21.5 21z"/>',
    hills: '<path d="M1.5 19.5c3.5-7 7.5-7 10.5-2 3-5 7-6 10.5 2z"/><circle cx="17" cy="6" r="2.5"/>',
    river: '<path d="M2.5 7.5c3-2.2 6.5 2.2 9.5 0s6.5-2.2 9.5 0M2.5 12.5c3-2.2 6.5 2.2 9.5 0s6.5-2.2 9.5 0M2.5 17.5c3-2.2 6.5 2.2 9.5 0s6.5-2.2 9.5 0"/>',
    flowers: '<circle cx="12" cy="8" r="2"/><path d="M12 3.5v2.5M12 10v11M7.5 8H10M14 8h2.5M12 16c-3 0-4.5-2-4.5-3.5 2.5 0 4.5 1.5 4.5 3.5zM12 18.5c3 0 4.5-2 4.5-3.5-2.5 0-4.5 1.5-4.5 3.5z"/>',
    books: '<path d="M3.5 4h4v16h-4zM8.5 4h4v16h-4zM14 5.2l3.8-1 3.8 14.8-3.8 1z"/>',
    peaks: '<path d="M1.5 20.5 8.8 6.5l4 7 2.4-3.4 7.3 10.4z"/><path d="M7.2 9.6l1.6 1.5 1.5-1.5"/>',
    stars: '<path d="M12 3.5l1.9 4.7 5 .4-3.8 3.3 1.2 4.9L12 14.2l-4.3 2.6 1.2-4.9-3.8-3.3 5-.4z"/><path d="M19 18.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>',
  };
  const MOTIF = {
    trees: ['<path d="M30 8 11 48h10L6 76h48L39 48h10z"/><rect x="27" y="76" width="6" height="11"/><path d="M68 30 56 56h7l-9 19h28l-9-19h7z" opacity=".6"/><rect x="65.5" y="75" width="5" height="9" opacity=".6"/>',
      '<path d="M58 10 44 40h8L40 64h36L64 40h8z"/><rect x="55" y="64" width="6" height="12"/><path d="M20 40 10 62h6l-7 14h22l-7-14h6z" opacity=".6"/>'],
    cliffs: ['<path d="M0 90 9 44l15-9 7-27 19 11 8 25 15 7 17 39z"/><path d="M24 36l5 20M50 20l-4 26" stroke="var(--bg)" stroke-width="2.5" fill="none" opacity=".45"/>',
      '<path d="M8 90 22 52l12 4 10-30 14 20 10-8 14 52z"/><path d="M44 30l3 22" stroke="var(--bg)" stroke-width="2.5" fill="none" opacity=".45"/>'],
    hills: ['<path d="M0 84c15-32 36-32 52 0z"/><path d="M34 86c16-26 40-26 56 0z" opacity=".6"/><circle cx="66" cy="22" r="10" opacity=".5"/>',
      '<path d="M4 86c18-28 40-28 56 0z" opacity=".6"/><path d="M40 86c14-36 36-36 50 0z"/><path d="M14 30h18M18 24h10" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".5"/>'],
    river: ['<path d="M2 30c14-10 29 10 43 0s29-10 43 0M2 52c14-10 29 10 43 0s29-10 43 0M2 74c14-10 29 10 43 0s29-10 43 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
      '<path d="M10 86V50M18 86V40M26 86V56" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><ellipse cx="18" cy="38" rx="3.5" ry="9"/><ellipse cx="10" cy="48" rx="3" ry="8" opacity=".7"/><path d="M40 70c12-8 24 8 36 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".6"/>'],
    flowers: ['<path d="M28 86V44M64 86V56" stroke="currentColor" stroke-width="3"/><circle cx="28" cy="34" r="7"/><circle cx="28" cy="20" r="7" opacity=".6"/><circle cx="16" cy="38" r="7" opacity=".6"/><circle cx="40" cy="38" r="7" opacity=".6"/><circle cx="64" cy="50" r="6"/><circle cx="64" cy="38" r="6" opacity=".6"/><circle cx="54" cy="54" r="6" opacity=".6"/><circle cx="74" cy="54" r="6" opacity=".6"/><path d="M28 66c-8 0-12-6-12-10 7 0 12 4 12 10z"/>',
      '<path d="M46 88V40" stroke="currentColor" stroke-width="3"/><circle cx="46" cy="30" r="9"/><circle cx="46" cy="12" r="8" opacity=".55"/><circle cx="30" cy="34" r="8" opacity=".55"/><circle cx="62" cy="34" r="8" opacity=".55"/><path d="M46 70c10 0 15-7 15-12-8 0-15 5-15 12z"/>'],
    books: ['<rect x="10" y="26" width="14" height="60" rx="2"/><rect x="26" y="16" width="14" height="70" rx="2" opacity=".6"/><rect x="42" y="34" width="12" height="52" rx="2"/><path d="M58 30l12-3 14 56-12 3z" opacity=".6"/>',
      '<rect x="12" y="66" width="66" height="10" rx="2"/><rect x="18" y="54" width="56" height="12" rx="2" opacity=".6"/><rect x="14" y="44" width="60" height="10" rx="2"/><path d="M44 8l14 26H30z" opacity=".5"/>'],
    peaks: ['<path d="M0 88 30 24l16 26 10-14 34 52z"/><path d="M24 36l6-12 6 12-6 4z" fill="var(--bg)" opacity=".7"/>',
      '<path d="M6 88 44 12l40 76z"/><path d="M36 28l8-16 8 16-8 5z" fill="var(--bg)" opacity=".7"/><path d="M58 88l16-30 14 30z" opacity=".6"/>'],
    stars: ['<path d="M24 12l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/><path d="M66 30l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" opacity=".6"/><path d="M20 88V70a20 20 0 0 1 40 0v18z"/><path d="M44 58 64 40" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
      '<circle cx="30" cy="26" r="14" opacity=".6"/><circle cx="36" cy="22" r="12" fill="var(--bg)" opacity=".8"/><path d="M66 50l2.5 6.5 6.5.5-5 4 1.5 6.5-5.5-3.5-5.5 3.5 1.5-6.5-5-4 6.5-.5z"/><circle cx="18" cy="70" r="3"/><circle cx="76" cy="16" r="2.5"/>'],
  };
  const sceneHTML = (scene, side) => { const m = MOTIF[scene] || MOTIF.hills;
    return `<div class="scenery ${side}" aria-hidden="true">${[0, 1, 0].map((k, i) => `<svg viewBox="0 0 90 90" fill="currentColor" style="--s:${side === 'r' ? -1 : 1};--k:${i}">${m[(k + (side === 'r' ? 1 : 0)) % m.length]}</svg>`).join('')}</div>`; };
  const CHEST_GEMS = 30;
  const chestNeed = (uid) => Math.min(15, unitPool(uid).length);
  const unitSeen = (uid) => unitPool(uid).filter((q) => S.q[q.id]).length;
  const unitPct = (uid) => { const p = unitPool(uid); if (!p.length) return 0; let pts = 0; for (const q of p) { const r = S.q[q.id]; pts += mastPts(r); } return Math.round((pts / (MAST_BOX * p.length)) * 100); };
  const chestSVG = (open) => `<svg class="chestsvg" viewBox="0 0 48 46" aria-hidden="true">${open ? '<circle cx="24" cy="18" r="13" fill="#FFE27A" opacity=".55"/><path d="M16 20l4-6 4 6-4 4zM26 18l4-5 4 5-4 4z" fill="#7EE8FA"/><path d="M21 17l3-4 3 4-3 3z" fill="#FF6B8B"/>' : ''}
    <path d="M6 22h36v19a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#B5652B"/><path d="M6 26h36" stroke="#8E4A1F" stroke-width="1.5" opacity=".6"/><path d="M14 22v22M34 22v22" stroke="#FFD84A" stroke-width="3"/>
    <g class="lid" ${open ? 'transform="translate(0 -9) rotate(-18 6 22)"' : ''}><path d="M6 22a10 10 0 0 1 10-10h16a10 10 0 0 1 10 10z" fill="#D2803A"/><path d="M14 13.5V22M34 13.5V22" stroke="#FFD84A" stroke-width="3"/><path d="M6 20.5h36V24H6z" fill="#FFD84A"/></g>
    ${open ? '' : '<rect x="20" y="20" width="8" height="10" rx="2" fill="#FFE27A" stroke="#9A5A12" stroke-width="1.5"/><circle cx="24" cy="25" r="1.4" fill="#9A5A12"/>'}</svg>`;
  function chestHTML(u, i, dx) {
    const R = region(u.id), need = chestNeed(u.id), have = Math.min(need, unitSeen(u.id)), open = !!S.chests[u.id], ready = !open && have >= need;
    return `<div class="node-row" style="--i:${i};--dx:${dx}"><button class="node chest ${open ? 'opened' : ready ? 'ready' : 'locked'}" data-act="chest" data-unit="${u.id}" style="--uc:var(--${u.color});--uc2:var(--${u.color}b)" aria-label="${esc(R.name)} treasure chest: ${open ? 'opened' : ready ? 'ready to open' : `${have} of ${need} questions answered`}">
      <span class="disc"><span class="face">${chestSVG(open)}</span>${ready ? '<span class="badge">!</span>' : ''}</span>
      <span class="label">${open ? 'Chest opened' : ready ? 'Open the chest!' : 'Treasure chest'}</span>${open ? `<span class="sublabel">+${CHEST_GEMS} gems found</span>` : ready ? `<span class="sublabel">+${CHEST_GEMS} gems inside</span>` : `<span class="sublabel">${have}/${need} answered</span>`}</button></div>`;
  }
  function openChest(uid, btn) {
    const R = region(uid);
    if (S.chests[uid]) { toast(`You already opened the ${R.name} chest.`, I.gem); return; }
    const need = chestNeed(uid), have = unitSeen(uid);
    if (have < need) { const n = need - have; toast(`Answer ${n} more question${n === 1 ? '' : 's'} in ${R.name} to open this chest.`, I.lock); return; }
    S.chests[uid] = Date.now(); S.gems += CHEST_GEMS; save();
    sfx.win(); if (btn) btn.classList.add('popping');
    setTimeout(() => { confetti(); toast(`+${CHEST_GEMS} gems from the ${R.name} chest!`, I.gem); checkAch(); save(); renderView(); }, 550);
  }
  function journeyOrder() { const out = []; examUnits().forEach((u) => SK.filter((s) => s.unit === u.id).forEach((s) => out.push(s))); return out; }
  function drawTrail(animate) {
    const j = document.getElementById('journey'); if (!j) return;
    const svg = j.querySelector('svg.trail'), discs = [...j.querySelectorAll('.path .node .disc')];
    if (!svg || !discs.length) return;
    const amp = parseFloat(getComputedStyle(j).getPropertyValue('--amp')) || 1;
    const off = (el) => { let x = 0, y = 0; while (el && el !== j) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; };
    const pts = discs.map((d) => { const [x, y] = off(d), row = d.closest('.node-row'); const dx = parseFloat(row.style.getPropertyValue('--dx')) || 0;
      return { x: x + d.offsetWidth / 2 + dx * amp, y: y + d.offsetHeight / 2, visited: row.classList.contains('visited') }; });
    const th = j.querySelector('.trailhead'), sm = j.querySelector('.summit .flagpin');
    if (th) { const [x, y] = off(th); pts.unshift({ x: x + th.offsetWidth / 2, y: y + th.offsetHeight / 2, visited: true }); }
    if (sm) { const [x, y] = off(sm); pts.push({ x: x + sm.offsetWidth / 2, y: y + sm.offsetHeight / 2, visited: false }); }
    const W = j.offsetWidth, H = j.offsetHeight;
    const curve = (list) => list.map((p, i) => { if (!i) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`; const a = list[i - 1], m = (p.y - a.y) / 2; return `C${a.x.toFixed(1)} ${(a.y + m).toFixed(1)} ${p.x.toFixed(1)} ${(p.y - m).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join('');
    let last = 0; pts.forEach((p, i) => { if (p.visited) last = i; });
    const stops = [...j.querySelectorAll('.region')].map((r) => { const cs = getComputedStyle(r); return [((off(r)[1] + r.offsetHeight / 2) / H).toFixed(3), cs.getPropertyValue('--uc').trim(), cs.getPropertyValue('--uc2').trim()]; });
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.innerHTML = `<defs><linearGradient id="trailgrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}">${stops.map(([o, a, b]) => `<stop offset="${o}" stop-color="${a}"/><stop offset="${Math.min(1, +o + 0.02)}" stop-color="${b}"/>`).join('')}</linearGradient></defs>
      <path class="road" d="${curve(pts)}"/><path class="roadline" d="${curve(pts)}"/>${last > 0 ? `<path class="walked" d="${curve(pts.slice(0, last + 1))}"/>` : ''}`;
    const walked = svg.querySelector('.walked');
    if (walked && animate && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) && walked.getTotalLength) {
      const len = walked.getTotalLength();
      walked.style.strokeDasharray = len; walked.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: Math.min(2400, 600 + len * 0.35), easing: 'cubic-bezier(.2,.8,.2,1)', delay: 250, fill: 'backwards' });
    }
  }
  let trailT = null;
  window.addEventListener('resize', () => { clearTimeout(trailT); trailT = setTimeout(() => drawTrail(false), 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => drawTrail(false));

  function nodeHTML(sk, uc, i = 0, isNext = false, dx = 0) {
    const st = skillStats(sk.id), r = 38, C = 2 * Math.PI * r;
    const badge = st.ready > 0 ? `<span class="badge" title="${st.ready} ready">${st.ready}</span>` : `<span class="badge clock" title="Next unlock in ${fmtDur(st.next - Date.now())}">${I.clock}</span>`;
    const here = isNext ? `<span class="here ${dx >= 0 ? 'l' : 'r'}" aria-hidden="true">${mascot('happy', S.hat, 'mascot')}<i>You are here</i></span>` : '';
    return `<div class="node-row ${st.seen ? 'visited' : ''}" style="--i:${i};--dx:${dx}"><button class="node ${st.ready ? '' : 'rest'} ${isNext ? 'next' : ''}" data-act="skill" data-skill="${sk.id}" style="--uc:var(--${uc});--uc2:var(--${uc}b)" aria-label="${esc(sk.name)}: ${st.ready} ready, ${Math.round(st.pct * 100)}% mastered">
      <span class="disc"><svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--surface-2)" stroke-width="5"/><circle cx="42" cy="42" r="${r}" fill="none" style="stroke:var(--hl)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - st.pct)}" transform="rotate(-90 42 42)" class="ringfill" style="--c:${C}"/></svg>${isNext ? `<span class="starttip">${S.tried.includes(sk.id) ? 'Next' : 'Start'}</span>` : ''}
      <span class="face">${esc(sk.icon)}</span>${badge}</span>${here}
      <span class="label">${esc(sk.name)}</span></button></div>`;
  }

  function examSwitch() {
    const e = S.settings.exam;
    return `<div class="examswitch card"><div><div class="eyebrow">Studying for</div><b>${e === 'act' ? 'The ACT' : 'The SAT / PSAT'}</b></div>
      <div class="seg" role="group" aria-label="Test">${[['sat', 'SAT / PSAT'], ['act', 'ACT']].map(([v, l]) => `<button data-act="exam" data-v="${v}" aria-pressed="${e === v}">${l}</button>`).join('')}</div></div>`;
  }
  function viewLearn() {
    let html = welcomeCard() + noticeCard() + reminderBanner() + bellCard();
    html += `<div class="aside-hide-wide">${todayCard()}</div>`;
    html += practiceStrip() + examSwitch();
    const order = journeyOrder();
    const nextSk = order.find((s) => skillStats(s.id).seen === 0) || order.find((s) => skillStats(s.id).ready > 0);
    const wave = (k) => Math.round(Math.sin(k * 0.82 + 0.4) * 62);
    let ni = 0, gi = 0;
    const JU = examUnits(), jIds = new Set(JU.map((u) => u.id)), JQ = QS.filter((q) => SKMAP[q.s] && jIds.has(SKMAP[q.s].unit));
    const opened = JU.filter((u) => S.chests[u.id]).length;
    let allPts = 0; for (const q of JQ) { const r = S.q[q.id]; allPts += mastPts(r); }
    const total = Math.round((allPts / (MAST_BOX * JQ.length)) * 100);
    html += `<section class="journey" id="journey" aria-label="Your study journey"><svg class="trail" aria-hidden="true"></svg>
      <div class="trailhead"><span class="thicon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + BI.map + '</svg>'}</span><span><b>Trailhead</b><small>Your PSAT journey starts here</small></span></div>`;
    JU.forEach((u, ui) => {
      const skills = SK.filter((s) => s.unit === u.id), R = region(u.id), pct = unitPct(u.id);
      html += `<div class="region scene-${R.scene}" style="--uc:var(--${u.color});--uc2:var(--${u.color}b)" aria-label="${esc(R.name)}: ${esc(u.name)}">
        ${sceneHTML(R.scene, 'l')}${sceneHTML(R.scene, 'r')}
        <div class="signpost"><span class="emblem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EMB[R.scene]}</svg></span>
          <div class="sp-text"><div class="eyebrow">Stop ${ui + 1} · ${u.act ? 'ACT' : ['u6', 'u7'].includes(u.id) ? 'Math' : S.settings.exam === 'act' ? 'Foundations' : 'Reading & Writing'}</div><h2>${esc(R.name)}</h2><p>${esc(u.name)}: ${esc(u.blurb)}</p></div>
          <span class="sp-pct"><b class="num">${pct}%</b><span>explored</span></span></div>
        <div class="path">${skills.map((s) => nodeHTML(s, u.color, ni++, nextSk && s.id === nextSk.id, wave(gi++))).join('')}${reviewNodeHTML(u, ni++, wave(gi++))}${chestHTML(u, ni++, wave(gi++))}</div></div>`;
    });
    html += `<div class="summit"><span class="flagpin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${BI.flag}</svg></span>
      <div class="eyebrow">The summit</div><h2>${opened === JU.length && total >= 100 ? 'You conquered the whole map!' : opened === JU.length ? 'Every chest found!' : 'Keep climbing'}</h2>
      <p class="muted" style="margin:0">Journey ${total}% explored · ${opened}/${JU.length} chests opened</p>
      <div class="bar good" aria-label="Journey progress"><i style="width:${total}%"></i></div></div></section>`;
    return html;
  }

  function viewPractice() {
    const mist = mistakesPool(), mr = mist.filter((q) => isReady(q)).length;
    const rv = reviewPool(), rr = rv.filter((q) => isReady(q)).length;
    const up = upcoming();
    const mode = (id, color, icon, title, desc, n, disabledMsg) => `<button class="mode" data-act="mode" data-mode="${id}" ${n ? '' : 'disabled'}>
      <span class="icon" style="background:${color}">${icon}</span><span><h3>${title}</h3><p>${n ? desc : disabledMsg}</p></span><span class="chip">${n ? n + ' ready' : '0'}</span></button>`;
    const nm = nextUnlock(mist), nr = nextUnlock(rv);
    return `<div><h1 style="font-size:30px">Practice</h1><p class="muted" style="margin:4px 0 0">Extra ways to earn XP and check your progress.</p></div>
      ${weeklyCard()}
      ${sectionsCard()}
      <button class="mode" data-act="go" data-view="essay"><span class="icon" style="background:linear-gradient(135deg,var(--u4),var(--u4b))">${I.quests}</span><span><h3>Essay Lab</h3><p>How to write a high-scoring essay, timed practice prompts, and essay drills.</p></span></button>
      <div class="modes">
        ${(() => { const hp = QS.filter((q) => q.d === 3); return mode('hard', 'linear-gradient(135deg,#B83A72,#3049D8)', I.medal, 'Hard Set', `${hp.length} of the toughest SAT-level questions, 10 at a time.`, hp.filter((q) => isReady(q)).length, 'All hard questions are resting. Come back later.'); })()}
        ${mode('mistakes', 'linear-gradient(135deg,var(--bad),var(--bad-2))', I.redo, 'Fix your mistakes', 'Questions you missed recently, while they’re fresh.', mr, mist.length ? `Nothing to fix yet. Next one is ready in ${fmtDur(nm - Date.now())}.` : 'No mistakes to fix yet. Nice.')}
        ${mode('review', 'var(--g-brand)', I.stack, 'Mixed review', 'Questions across all skills that are due again.', rr, rv.length ? `Nothing is due. Next review unlocks in ${fmtDur(nr - Date.now())}.` : 'Answer a few questions first. Reviews unlock after a day.')}
        ${mode('bell', 'linear-gradient(135deg,#FF8A3D,#E2418F)', I.bell, 'Daily Bell Ringer', 'Missed and older questions, rebuilt in new styles. Once a day.', bellToday() ? 0 : seenPool().length >= 3 ? Math.min(BELL_LEN, seenPool().length) : 0, bellToday() ? `Done today: ${S.bell.score}/${S.bell.total}. A new one starts at midnight.` : 'Answer at least 3 questions to unlock it.')}
        ${(() => { const pp = pt1Pool(); return mode('pt1', 'linear-gradient(135deg,var(--u3),var(--u3b))', I.medal, 'Practice Test 1 review', `${pp.length} questions rebuilt from your PSAT practice test, starting with the one you missed.`, pp.filter((q) => isReady(q)).length, `All ${pp.length} are resting. Next one unlocks in ${fmtDur(nextUnlock(pp) - Date.now())}.`); })()}
        ${mode('speed', 'linear-gradient(135deg,#FFB347,var(--flame),var(--flame-2))', I.bolt, 'Speed round', `Answer as many as you can in ${SPEED_SECS} seconds. No hearts lost.`, QS.filter((q) => isReady(q) && ['mc', 'tf', 'cloze', 'punct', 'input'].includes(q.t)).length, 'Everything is resting. Come back later.')}
      </div>
      <div class="card stack"><h2>Coming back soon</h2><p class="muted" style="margin:0">Questions you answer rest before you see them again. Here’s when they return.</p>
        <div class="kv"><div><b>${up.day}</b><span>Next 24 hours</span></div><div><b>${up.three}</b><span>Next 3 days</span></div><div><b>${up.week}</b><span>Next 7 days</span></div></div></div>`;
  }

  /* ============================================================ ESSAY LAB */
  let essayPid = null, essayTick = null, essayEnd = 0, essaySaveT = null;
  const wordCount = (t) => (t.trim().match(/\S+/g) || []).length;
  const RUBRIC = [['ia', 'Ideas & Analysis', 'Clear position; weighs perspectives; explains why it matters'], ['ds', 'Development & Support', 'Specific examples, each explained'],
    ['or', 'Organization', 'One idea per paragraph, logical order, real transitions'], ['lu', 'Language Use', 'Precise words, varied sentences, few errors']];
  function viewEssay() {
    const E = window.INK_ESSAY; if (!E) return '<p>Essay Lab didn’t load. Refresh the page.</p>';
    const p = essayPid && E.prompts.find((x) => x.id === essayPid);
    if (p) return essayWriter(p);
    return `<div><h1 style="font-size:30px">Essay Lab</h1><p class="muted" style="margin:4px 0 0">How to write a high-scoring essay, timed practice, and drills. Built for the optional ACT Writing test; the same skills power SAT/ACT English questions and school essays.</p></div>
      <div class="card stack"><h2>Drill the skills</h2><p class="muted" style="margin:0">Theses, evidence, analysis, counterarguments, and conclusions as quick questions. It’s also on your journey in Expression of Ideas.</p>
        <button class="btn" data-act="start" data-skill="ess">Start an Essay Essentials lesson</button></div>
      <div class="card stack"><h2>The guide</h2>${E.guide.map((g, i) => `<details class="eguide"${i === 0 ? ' open' : ''}><summary>${g.title}</summary><div class="ebody">${g.html}</div></details>`).join('')}</div>
      <div class="card stack"><h2>Timed practice</h2><p class="muted" style="margin:0">One prompt, 40 minutes. Drafts save as you type. Finish an essay of 250+ words for 20 XP and 5 gems (once a day), then score yourself with the rubric.</p>
        <div class="modes">${E.prompts.map((x) => { const d = S.essays[x.id]; return `<button class="mode" data-act="essayopen" data-pid="${x.id}"><span><h3>${esc(x.title)}</h3><p>${d ? (d.done ? `Finished · ${d.words} words${d.self ? ` · self-score ${d.self}/12` : ''}` : `Draft · ${d.words} words`) : 'Not started'}</p></span></button>`; }).join('')}</div></div>`;
  }
  function essayWriter(p) {
    const d = S.essays[p.id] || { text: '', words: 0, rub: {} }, rub = d.rub || {};
    const opts = (k) => `<select data-rub="${k}"><option value="">–</option>${[1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}"${+rub[k] === n ? ' selected' : ''}>${n}</option>`).join('')}</select>`;
    return `<button class="btn ghost small" data-act="essayback" style="justify-self:start">← Essay Lab</button>
      <div class="card stack"><div class="eyebrow">Practice prompt</div><h2 style="margin:0">${esc(p.title)}</h2><p style="margin:0">${esc(p.issue)}</p>
        ${p.persp.map((t, i) => `<div class="persp"><b>Perspective ${i + 1}</b><p>${esc(t)}</p></div>`).join('')}
        <p class="muted" style="margin:0"><b>Your task:</b> Write an argumentative essay on this issue. State and develop your own perspective, explain how it relates to at least one of the perspectives above, and support your ideas with reasoning and specific examples.</p></div>
      <div class="card stack">
        <div class="row between" style="flex-wrap:wrap;gap:8px"><span class="etimer num" id="etimer">${essayEnd > Date.now() ? fmtClock(essayEnd - Date.now()) : '40:00'}</span><span class="muted num" id="ewords">${d.words || 0} words</span><button class="btn small" data-act="essaytimer" id="etbtn">${essayEnd > Date.now() ? 'Stop timer' : 'Start 40-min timer'}</button></div>
        <textarea id="essaybox" rows="18" placeholder="Spend about 8 minutes planning: your position, two reasons with examples, and the strongest objection. Then write here.">${esc(d.text || '')}</textarea>
        <details class="eguide"><summary>Score yourself with the rubric</summary><div class="ebody">
          <p class="muted" style="margin-top:0">Rate each domain 1–6 the way one reader would (6 = insightful and precise, 4 = clear and adequate, 2 = weak or unclear). Your score is the average, doubled to the 2–12 scale.</p>
          ${RUBRIC.map(([k, n, h]) => `<div class="rubrow"><div><b>${n}</b><small class="muted">${h}</small></div>${opts(k)}</div>`).join('')}
          <p style="margin-bottom:0"><b>Self-score: <span id="eself">${d.self ? d.self + '/12' : '–'}</span></b></p></div></details>
        <button class="btn" data-act="essaydone">${d.done ? 'Save changes' : 'Finish essay'}</button>
      </div>`;
  }
  const fmtClock = (ms) => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${pad(t % 60)}`; };
  function essayTimerTick() {
    const el = $('#etimer'), left = essayEnd - Date.now();
    if (el) el.textContent = fmtClock(left);
    if (left <= 0) { clearInterval(essayTick); essayTick = null; essayEnd = 0; toast('Time! Finish your sentence and proofread.', I.clock); const b = $('#etbtn'); if (b) b.textContent = 'Start 40-min timer'; }
  }
  function essayStore(patch) { S.essays[essayPid] = { text: '', words: 0, rub: {}, ...(S.essays[essayPid] || {}), ...patch, updated: Date.now() }; clearTimeout(essaySaveT); essaySaveT = setTimeout(save, 400); }
  document.addEventListener('input', (e) => {
    if (e.target.id !== 'essaybox' || !essayPid) return;
    const w = wordCount(e.target.value); essayStore({ text: e.target.value, words: w });
    const wc = $('#ewords'); if (wc) wc.textContent = `${w} words`;
  });
  document.addEventListener('change', (e) => {
    if (!e.target.dataset || !e.target.dataset.rub || !essayPid) return;
    const rub = { ...((S.essays[essayPid] || {}).rub || {}), [e.target.dataset.rub]: e.target.value };
    const vals = RUBRIC.map(([k]) => +rub[k]).filter(Boolean);
    const self = vals.length === 4 ? Math.round((vals.reduce((a, b) => a + b, 0) / 4) * 2) : null;
    essayStore({ rub, self }); const el = $('#eself'); if (el) el.textContent = self ? `${self}/12` : '–';
  });
  function essayAction(act, t) {
    if (act === 'essayopen') { essayPid = t.dataset.pid; renderView(); window.scrollTo(0, 0); }
    else if (act === 'essayback') { essayPid = null; renderView(); window.scrollTo(0, 0); }
    else if (act === 'essaytimer') {
      if (essayEnd > Date.now()) { clearInterval(essayTick); essayTick = null; essayEnd = 0; t.textContent = 'Start 40-min timer'; const el = $('#etimer'); if (el) el.textContent = '40:00'; }
      else { essayEnd = Date.now() + 40 * MIN; clearInterval(essayTick); essayTick = setInterval(essayTimerTick, 1000); t.textContent = 'Stop timer'; essayTimerTick(); }
    } else if (act === 'essaydone') {
      const box = $('#essaybox'), text = box ? box.value : '', w = wordCount(text);
      essayStore({ text, words: w });
      if (w < 250) { toast(`Keep going: ${w} words so far. Finish at 250+ (strong ACT essays usually run 450+).`, I.clock); save(); return; }
      const first = !S.essays[essayPid].done; essayStore({ done: true });
      if (first && S.essayXPDay !== dayKey()) { S.essayXPDay = dayKey(); addXP(20); S.gems += 5; checkQuests(); checkAch(); toast('Essay finished! +20 XP and +5 gems. Now score it with the rubric.', I.check); }
      else toast('Essay saved.', I.check);
      save(); renderView();
    }
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
        <div class="stile"><b>${S.bestSpeed}</b><span>Best speed round</span></div><div class="stile"><b>${ACH.filter((a) => S.ach[a.id]).length}/${ACH.length}</b><span>Badges</span></div>
      </div>
      <div class="card stack"><h2>Last 5 weeks</h2><div class="heat" aria-label="Streak calendar">${heat}</div>
        <div class="legend"><span style="--c:var(--flame)">Goal met</span><span style="--c:var(--gem)">Freeze used</span><span style="--c:var(--surface-2)">Missed</span></div></div>
      <div class="card stack"><h2>Skills</h2><p class="muted" style="margin:0;font-size:14px">A question counts as mastered after you get it right four times in a row, spaced out over more than a week (same day, then 1, 3, and 7 days later), with at least 75% accuracy on it overall. One miss starts the run over.</p>
        <div class="tablewrap"><table class="data"><thead><tr><th>Skill</th><th class="num">Seen</th><th>Mastery</th><th class="num">Accuracy</th><th class="num">Ready</th></tr></thead><tbody>${rows}</tbody></table></div></div>
      ${badgesCard()}`;
  }

  function badgesCard() {
    const got = ACH.filter((a) => S.ach[a.id]);
    const tiers = ['bronze', 'silver', 'gold', 'diamond'].map((t) => `<span class="tierchip t-${t}"><i></i>${got.filter((a) => a.tier === t).length}/${ACH.filter((a) => a.tier === t).length} ${TIER_NAME[t]}</span>`).join('');
    const groups = BADGE_CATS.map(([cat, label]) => {
      const list = ACH.filter((a) => a.cat === cat), n = list.filter((a) => S.ach[a.id]).length;
      return `<div class="bgroup"><div class="row between"><h3>${label}</h3><span class="muted num" style="font-size:13px">${n}/${list.length}</span></div><div class="achs">${list.map((a) => {
        const on = !!S.ach[a.id], v = Math.min(a.val(), a.goal);
        return `<div class="ach ${on ? 'got' : 'locked'}" title="${on ? 'Unlocked ' + new Date(S.ach[a.id]).toLocaleDateString() : esc(a.desc)}">${badgeArt(a)}<b>${esc(a.name)}</b><span>${esc(a.desc)}</span>
          ${on ? `<em class="tier t-${a.tier}">${TIER_NAME[a.tier]}</em>` : `<span class="bprog"><span class="minibar"><i style="width:${Math.round((v / a.goal) * 100)}%"></i></span><small class="num">${v.toLocaleString()}/${a.goal.toLocaleString()}</small></span>`}</div>`;
      }).join('')}</div></div>`;
    }).join('');
    return `<div class="card stack"><div class="row between" style="flex-wrap:wrap"><h2>Badges</h2><span class="num" style="font-weight:800">${got.length}/${ACH.length}</span></div><div class="tierchips">${tiers}</div>${groups}</div>`;
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
        <div class="field"><span class="lbl">Studying for</span>${seg('exam', S.settings.exam, [['sat', 'SAT / PSAT'], ['act', 'ACT']])}<span class="hint">Changes the journey, Weekly Challenge, and timed sections. Your progress is kept for both.</span></div>
        <div class="field"><span class="lbl">Question timer</span>${seg('qtimer', S.settings.qtimer, [['off', 'Off'], ['pace', 'Pace'], ['strict', 'Strict']])}<span class="hint">Shows a countdown at real test pace on each question. Pace lets you go over (the clock turns red); Strict counts a question wrong when time runs out.${S.pace.n ? ` You\u2019ve answered ${Math.round((S.pace.on / S.pace.n) * 100)}% of timed questions on pace.` : ''}</span></div>
        <div class="field"><span class="lbl">Daily goal</span>${seg('goal', S.settings.goal, [[60, 'Casual · 60 XP'], [100, 'Regular · 100 XP'], [150, 'Serious · 150 XP'], [200, 'Intense · 200 XP']])}<span class="hint">Meeting your goal each day builds your streak.</span></div>
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
        <div class="field"><span class="lbl">Relearn vocab</span><span class="hint">Your words: ${ALLW.filter((x) => isLearned(x.w)).length} known, ${ALLW.filter((x) => needsTeach(x.w)).length} to learn or review, ${ALLW.filter((x) => unasked(x.w)).length} not asked yet (of ${ALLW.length}). Every vocab word gets taught again from its \u201cLearn it\u201d card. Clears your vocab question history only; XP, gems, and badges stay.</span><div id="relearnbox"><button class="btn small" data-act="relearn1">Relearn all words</button></div></div>
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
    const render = { learn: viewLearn, practice: viewPractice, quests: viewQuests, profile: viewProfile, shop: viewShop, prefs: viewPrefs, essay: viewEssay }[v];
    const viewEl = $('#view');
    viewEl.innerHTML = render();
    if (v !== lastView) { restart(viewEl, 'enter'); window.scrollTo(0, 0); } else viewEl.classList.remove('enter');
    const entered = v !== lastView;
    lastView = v;
    if (v === 'learn') requestAnimationFrame(() => drawTrail(entered));
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
      case 'unitreview': unitSheet(t.dataset.unit); break;
      case 'chest': openChest(t.dataset.unit, t); break;
      case 'startunit': startLesson('unit', t.dataset.unit); break;
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
      case 'quitnow': closeSheet(); if (L && (L.mode === 'weekly' || L.mode === 'section')) finishLesson(); else endLesson(); break;
      case 'section': startLesson('section', t.dataset.sec); break;
      case 'wc': wcPick(t.dataset.w, t.dataset.v); break;
      case 'wcall': wcPick(null, t.dataset.v); break;
      case 'guide': guideSheet(t.dataset.skill); break;
      case 'secskip': if (L && L.state === 'answer') { const { answer } = L.w.check(); resolve(false, answer); } break;
      case 'exam': S.settings.exam = t.dataset.v; save(); renderView(); break;
      case 'qtimer': S.settings.qtimer = t.dataset.v; save(); renderView(); break;
      case 'essayopen': case 'essayback': case 'essaytimer': case 'essaydone': essayAction(t.dataset.act, t); break;
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
      case 'relearn1': $('#relearnbox').innerHTML = '<div class="row" style="flex-wrap:wrap"><span style="font-weight:700">Relearn every word?</span><button class="btn small" data-act="relearn2">Yes, relearn</button><button class="btn small ghost" data-act="relearn0">Cancel</button></div>'; break;
      case 'relearn0': $('#relearnbox').innerHTML = '<button class="btn small" data-act="relearn1">Relearn all words</button>'; break;
      case 'relearn2': resetVocab(); save(); renderView(); toast('Vocab reset. New words will be taught first.'); break;
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

  document.addEventListener('ink:pet', () => { S.pets++; checkAch(); save(); });
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
  checkAch(); save();
  window.Inkwell = { state: () => S, questions: QS, current: () => (L && !L.ended ? L.q : null), bellVariant: (q, seed) => bellVariant(q, seeded(String(seed))) };
})();
