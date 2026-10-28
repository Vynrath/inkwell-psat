/* Inkwell interaction effects: things that respond to the pointer and to answers.
   Loaded after app.js. Everything here is optional polish and switches off for reduced motion. */
(() => {
  'use strict';
  const calm = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = () => window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const buzz = (p) => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* not allowed here */ } };
  const COLORS = ['#FFD84A', '#FF9F43', '#F2497B', '#8B5CF6', '#3049D8', '#23B27A', '#2E8FD8'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ---------- particle burst from a point ---------- */
  function burst(x, y, opts = {}) {
    if (calm()) return;
    const n = opts.count || 14, spread = opts.spread || 90, shapes = opts.shapes || ['dot', 'star', 'bar'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      const shape = pick(shapes);
      p.className = `spark ${shape}`;
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.setProperty('--c', opts.color || pick(COLORS));
      document.body.append(p);
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.6, d = spread * (0.55 + Math.random() * 0.6);
      const dx = Math.cos(a) * d, dy = Math.sin(a) * d - (opts.lift || 20);
      const anim = p.animate([
        { transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy * 1.15 + 30}px)) scale(.6) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.2,1)' });
      anim.onfinish = () => p.remove();
    }
  }
  const centerOf = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------- answers ---------- */
  document.addEventListener('ink:answer', (e) => {
    const { ok, combo } = e.detail;
    const body = document.getElementById('lbody');
    if (ok) {
      buzz(15);
      const el = body && (body.querySelector('.choice.right, .tile.right, .seg-s.right, .slot, .answerin input, .blank.filled') || body.querySelector('.qwrap'));
      if (el) { const [x, y] = centerOf(el); burst(x, y, { count: combo >= 5 ? 26 : 14, spread: combo >= 5 ? 140 : 90 }); }
      rider('hop');
    } else {
      buzz([40, 40, 40]);
      const q = body && body.querySelector('.qwrap');
      if (q && !calm()) { q.classList.remove('jolt'); void q.offsetWidth; q.classList.add('jolt'); }
      rider('dizzy');
    }
  });

  /* ---------- Dot rides the lesson progress bar ---------- */
  let riderEl = null, barObs = null;
  function placeRider() {
    const top = document.querySelector('#lesson .lesson-top'), bar = top && top.querySelector('.bar'), fill = bar && bar.querySelector('i');
    if (!bar || !riderEl) return;
    const tb = top.getBoundingClientRect(), bb = bar.getBoundingClientRect();
    const pct = parseFloat(fill.style.width) || 0;
    riderEl.style.left = (bb.left - tb.left + (bb.width * pct) / 100) + 'px';
    riderEl.style.top = (bb.top - tb.top + bb.height / 2) + 'px';
  }
  function setupRider() {
    const top = document.querySelector('#lesson .lesson-top');
    if (!top || top.querySelector('.rider')) return;
    const m = document.querySelector('.rail .brand svg, .topbar .brand svg');
    riderEl = document.createElement('span');
    riderEl.className = 'rider';
    riderEl.innerHTML = m ? m.outerHTML : '';
    top.style.position = 'relative';
    top.append(riderEl);
    const fill = top.querySelector('.bar > i');
    barObs = new MutationObserver(placeRider);
    barObs.observe(fill, { attributes: true, attributeFilter: ['style'] });
    requestAnimationFrame(placeRider);
  }
  function rider(kind) {
    if (!riderEl || calm()) return;
    riderEl.classList.remove('hop', 'dizzy'); void riderEl.offsetWidth; riderEl.classList.add(kind);
  }
  new MutationObserver(() => {
    if (document.getElementById('lesson')) setupRider();
    else if (riderEl) { riderEl = null; if (barObs) barObs.disconnect(); }
  }).observe(document.body, { childList: true });
  window.addEventListener('resize', placeRider);

  /* ---------- Dot's eyes follow the pointer ---------- */
  let px = innerWidth / 2, py = innerHeight / 3, eyeQueued = false;
  function lookAt() {
    eyeQueued = false;
    if (calm()) return;
    document.querySelectorAll('svg.mascot').forEach((svg) => {
      const r = svg.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !r.width) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.5;
      const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
      const eyes = svg.querySelector('.eyes');
      if (eyes) eyes.style.translate = `${((dx / d) * 3 * k).toFixed(2)}px ${((dy / d) * 2.4 * k).toFixed(2)}px`;
    });
  }
  document.addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY;
    if (!eyeQueued) { eyeQueued = true; requestAnimationFrame(lookAt); }
  }, { passive: true });

  /* ---------- pet Dot ---------- */
  const LINES = ['Purr…', 'You’ve got this!', 'One more lesson?', 'Meow!', 'Read the question first.', 'Predict, then pick.', 'Ink-credible!', 'Hehe, that tickles.', 'Watch the transition words.', 'Check every part of the choice.'];
  let pets = 0;
  function petDot(svg) {
    pets++;
    svg.classList.remove('petted'); void svg.getBoundingClientRect(); svg.classList.add('petted');
    const r = svg.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.3, { count: 7, spread: 50, shapes: ['heart'], color: '#FF6B8B', lift: 40 });
    buzz(10);
    let b = document.getElementById('dotsays');
    if (!b) { b = document.createElement('div'); b.id = 'dotsays'; b.className = 'dotsays'; b.setAttribute('role', 'status'); document.body.append(b); }
    b.textContent = pets % 7 === 0 ? `That’s ${pets} pets. Dot approves.` : pick(LINES);
    b.style.left = Math.min(innerWidth - 120, Math.max(120, r.left + r.width / 2)) + 'px';
    b.style.top = Math.max(12, r.top - 12) + 'px';
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 1800);
  }
  document.addEventListener('click', (e) => {
    const svg = e.target.closest && e.target.closest('svg.mascot');
    if (svg && !e.target.closest('.item, button.btn')) petDot(svg);
  });

  /* ---------- streak flame flare ---------- */
  document.addEventListener('click', (e) => {
    const f = e.target.closest && e.target.closest('.stat.flame');
    if (!f) return;
    f.classList.remove('flare'); void f.offsetWidth; f.classList.add('flare');
    const svg = f.querySelector('svg'); if (svg) { const [x, y] = centerOf(svg); burst(x, y, { count: 10, spread: 40, shapes: ['dot'], color: '#FF7A1A', lift: 30 }); }
  });

  /* ---------- skill nodes pop when tapped ---------- */
  document.addEventListener('click', (e) => {
    const n = e.target.closest && e.target.closest('.node:not(.rest)');
    if (!n) return;
    const face = n.querySelector('.face'); if (face) { const [x, y] = centerOf(face); burst(x, y, { count: 10, spread: 60 }); }
  });

  /* ---------- tap ripples ---------- */
  const RIPPLE = '.btn, .choice, .tile, .mode, .tab, .seg button, .goalpick button';
  document.addEventListener('pointerdown', (e) => {
    if (calm()) return;
    const el = e.target.closest && e.target.closest(RIPPLE);
    if (!el || el.disabled) return;
    const r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
    const s = document.createElement('span');
    s.className = 'ripple';
    Object.assign(s.style, { width: size + 'px', height: size + 'px', left: e.clientX - r.left - size / 2 + 'px', top: e.clientY - r.top - size / 2 + 'px' });
    el.append(s);
    setTimeout(() => s.remove(), 650);
  }, { passive: true });

  /* ---------- spotlight + 3D tilt follow the pointer ---------- */
  const SPOT = '.choice, .tile, .ptile, .mode, .item, .ach';
  const TILT = '.ptile, .mode, .item, .bellcard, .ach, .stile, .unit-head, .card.hello, .kv > div';
  let tilted = null;
  function untilt() { if (!tilted) return; tilted.style.transform = ''; tilted.classList.remove('tilting'); tilted = null; }
  document.addEventListener('pointermove', (e) => {
    if (!fine() || calm()) return;
    const t = e.target.closest ? e.target : null; if (!t) return;
    const s = t.closest(SPOT);
    if (s) { const r = s.getBoundingClientRect(); s.style.setProperty('--mx', `${e.clientX - r.left}px`); s.style.setProperty('--my', `${e.clientY - r.top}px`); }
    const el = t.closest(TILT);
    if (el !== tilted) untilt();
    if (!el || el.disabled) return;
    tilted = el;
    if (!el.querySelector(':scope > .glare')) { const g = document.createElement('span'); g.className = 'glare'; g.setAttribute('aria-hidden', 'true'); el.append(g); }
    const r = el.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    const max = r.width > 400 ? 3 : 8;
    el.classList.add('tilting');
    el.style.transform = `perspective(800px) rotateX(${(-ny * max).toFixed(2)}deg) rotateY(${(nx * max).toFixed(2)}deg) translateY(-2px)`;
    el.style.setProperty('--gx', `${(nx + 0.5) * 100}%`); el.style.setProperty('--gy', `${(ny + 0.5) * 100}%`);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', untilt);
  document.addEventListener('scroll', untilt, { passive: true });
})();
