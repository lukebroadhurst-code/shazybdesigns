/* Shazy b designs — interactions. No dependencies. */
(() => {
'use strict';

/* ---------------------------------------------------------
   Things Sharon (or Luke) may want to edit
   --------------------------------------------------------- */
const CONFIG = {
  email: '',                                   // e.g. 'hello@shazybdesigns.co.uk' — leave '' to hide email options
  messenger: 'https://m.me/61584582190026',
  instagramDm: 'https://ig.me/m/sharonbroadhurst',
};
const GIFT = {
  kicker: 'For Mum',
  title: 'Happy 60th Birthday, Mum',
  message: 'Sixty years of you — and you’re still making beautiful things with your own two hands. This little corner of the internet is all yours: every bag, every cap and every stitch of Shazy b designs, ready for the world to see. Thank you for everything you’ve made, mended and taught me.',
  sign: 'Love you loads — Luke x',
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const el = (tag, attrs = {}, html) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (html) n.innerHTML = html; return n; };
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3800); };

/* ---------------------------------------------------------
   Radio-group builder used by both studios
   --------------------------------------------------------- */
function radios(root, items, current, onPick, kind) {
  root.innerHTML = '';
  items.forEach((it) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(it.id === current));
    b.setAttribute('aria-label', it.name);
    b.title = it.name;
    if (kind === 'chip') { b.className = 'chip'; b.textContent = it.name; }
    else { b.className = 'sw'; b.dataset.tex = it.tex || ''; b.style.background = it.css; }
    b.addEventListener('click', () => {
      $$('[role=radio]', root).forEach((x) => x.setAttribute('aria-checked', 'false'));
      b.setAttribute('aria-checked', 'true');
      onPick(it.id);
    });
    b.addEventListener('keydown', (e) => {
      const sibs = $$('[role=radio]', root); const i = sibs.indexOf(b);
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); sibs[(i + 1) % sibs.length].focus(); sibs[(i + 1) % sibs.length].click(); }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); const j = (i - 1 + sibs.length) % sibs.length; sibs[j].focus(); sibs[j].click(); }
    });
    root.appendChild(b);
  });
}

/* ---------------------------------------------------------
   Page chrome: tape-measure progress, sticky nav, menu, reveal
   --------------------------------------------------------- */
const tapeFill = $('.tape__fill');
const nav = $('.nav');
function onScroll() {
  const h = document.documentElement;
  const p = h.scrollTop / Math.max(1, h.scrollHeight - innerHeight);
  tapeFill.style.width = (p * 100).toFixed(2) + '%';
  nav.classList.toggle('is-stuck', h.scrollTop > 40);
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const burger = $('.burger'), menu = $('#menu');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', open); menu.classList.toggle('open', open); nav.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('a', menu).forEach((a) => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); nav.classList.remove('menu-open'); document.body.style.overflow = ''; }));

const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((n, i) => { n.style.setProperty('--d', ((i % 4) * .08) + 's'); io.observe(n); });
$('#yr').textContent = new Date().getFullYear();

/* count-up */
const cnt = $('[data-count]');
if (cnt && !reduce) {
  const end = +cnt.dataset.count; cnt.textContent = '0';
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); const t0 = performance.now(); (function step(t) { const k = clamp((t - t0) / 1600, 0, 1); cnt.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0); } }).observe(cnt);
}

/* ---------------------------------------------------------
   Hero: thread draws itself, needle follows; mouse parallax
   --------------------------------------------------------- */
(function hero() {
  const path = $('#threadPath'), reveal = $('#threadReveal'), needle = $('#threadNeedle');
  if (!path) return;
  const L = path.getTotalLength();
  reveal.style.strokeDasharray = L; reveal.style.strokeDashoffset = reduce ? 0 : L;
  const place = (len) => {
    const a = path.getPointAtLength(len), b = path.getPointAtLength(Math.min(L, len + 2));
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    needle.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${ang})`);
  };
  if (reduce) { place(L * .97); } else {
    const t0 = performance.now() + 500, D = 3600;
    (function tick(t) {
      const k = clamp((t - t0) / D, 0, 1), e = 1 - Math.pow(1 - k, 3);
      reveal.style.strokeDashoffset = L * (1 - e); place(L * e);
      if (k < 1) requestAnimationFrame(tick);
      else (function bob(tt) { needle.style.transform = `translateY(${Math.sin(tt / 600) * 4}px)`; requestAnimationFrame(bob); })(0);
    })(performance.now());
  }
  const stage = $('.hero__stage'); if (!stage || reduce) return;
  const items = $$('[data-depth]', stage);
  const hero = $('.hero');
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    items.forEach((n) => { const d = +n.dataset.depth; n.style.setProperty('--px', (-x * d).toFixed(1) + 'px'); n.style.setProperty('--py', (-y * d).toFixed(1) + 'px'); });
  });
})();

/* ---------------------------------------------------------
   Bag gallery rail + lightbox
   --------------------------------------------------------- */
(function rail() {
  const track = $('#rail'); if (!track) return;
  $$('.rail__btn').forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: +b.dataset.dir * Math.min(640, track.clientWidth * .8), behavior: 'smooth' })));
  let down = false, sx = 0, sl = 0, moved = 0;
  track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft; });
  addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 5) track.classList.add('drag'); track.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { down = false; setTimeout(() => track.classList.remove('drag'), 0); });
  const lb = $('#lightbox'), lbi = $('img', lb), lbc = $('figcaption', lb);
  track.addEventListener('click', (e) => {
    const c = e.target.closest('.tagcard'); if (!c || moved > 5) return;
    lbi.src = c.dataset.full; lbi.alt = $('img', c).alt; lbc.innerHTML = c.dataset.cap; lb.showModal();
  });
  $('.lightbox__x').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
})();

/* ---------------------------------------------------------
   BAG BUILDER
   --------------------------------------------------------- */
(function bagStudio() {
  const svg = $('#bagSvg'); if (!svg) return;
  const DENIM = [
    { id: 'classic', name: 'Classic blue', d: '#3B5C86', dd: '#243A5B', l: '#9DB8D8', css: '#3B5C86', tex: 'denim' },
    { id: 'indigo', name: 'Indigo', d: '#27406A', dd: '#142443', l: '#6F8DB8', css: '#27406A', tex: 'denim' },
    { id: 'light', name: 'Light wash', d: '#7FA0C8', dd: '#4E6E99', l: '#D5E4F4', css: '#7FA0C8', tex: 'denim' },
    { id: 'black', name: 'Black', d: '#2c2f38', dd: '#14161c', l: '#6b7080', css: '#2c2f38', tex: 'denim' },
    { id: 'cherry', name: 'Cherry red', d: '#B3272F', dd: '#7B151B', l: '#E58288', css: '#B3272F', tex: 'denim' },
    { id: 'rose', name: 'Rose', d: '#B96F8B', dd: '#85445F', l: '#EBC0D0', css: '#B96F8B', tex: 'denim' },
  ];
  const PATCH = [{ id: 'butterfly', name: 'Butterflies' }, { id: 'eye', name: 'Evil eye' }, { id: 'bloom', name: 'Bloom' }, { id: 'star', name: 'Star' }, { id: 'none', name: 'No patch' }];
  const STRAP = [
    { id: 'sun', name: 'Sunburst', css: 'radial-gradient(circle,#e5473e 0 28%,#f2a516 30% 55%,#1d4f91 57%)' },
    { id: 'fest', name: 'Festival', css: 'repeating-linear-gradient(0deg,#15121a 0 5px,#e9e5ee 5px 8px)' },
    { id: 'rain', name: 'Rainbow', css: 'linear-gradient(90deg,#e5473e,#f2a516,#4fae5a,#2d7fd0,#8a49b8)' },
    { id: 'folk', name: 'Folk', css: 'radial-gradient(circle,#fbd6a8 0 22%,#5a2670 24% 30%,#b0305a 32%)' },
  ];
  const HW = [
    { id: 'brass', name: 'Brass', h: '#D8B25A', hd: '#7D5F21', css: 'linear-gradient(135deg,#f5e2a0,#c99a3f)' },
    { id: 'silver', name: 'Silver', h: '#D5D9E0', hd: '#6C7280', css: 'linear-gradient(135deg,#fff,#9aa2b0)' },
    { id: 'rose', name: 'Rose gold', h: '#E4A48C', hd: '#9A5A46', css: 'linear-gradient(135deg,#ffd9c9,#c9785f)' },
    { id: 'gun', name: 'Gunmetal', h: '#6B7080', hd: '#262932', css: 'linear-gradient(135deg,#8b90a0,#2c2f38)' },
  ];
  const CHARM = [{ id: 'lime', name: 'Lime slice' }, { id: 'badge', name: 'Music badge' }, { id: 'pom', name: 'Pompom' }, { id: 'none', name: 'Keep it simple' }];

  const S = { denim: 'classic', patch: 'butterfly', strap: 'sun', hw: 'brass', charm: 'lime' };
  const find = (arr, id) => arr.find((x) => x.id === id);

  /* studs along the lip */
  const studs = $('#studs');
  for (let i = 0; i < 11; i++) {
    const t = .1 + i * .08, x = (1 - t) ** 2 * 96 + 2 * t * (1 - t) * 220 + t * t * 344, y = (1 - t) ** 2 * 186 + 2 * t * (1 - t) * 236 + t * t * 186 + 21;
    studs.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 6.4, style: 'fill:url(#stud);stroke:var(--hw-d);stroke-width:1' }));
  }

  const patches = {
    butterfly: `<g transform="rotate(-12) translate(-6 -2)"><use href="#i-butterfly" x="-36" y="-29" width="72" height="58"/></g><g transform="translate(34 -34) rotate(18)"><use href="#i-butterfly" x="-15" y="-12" width="30" height="24"/></g>`,
    eye: `<g><path d="M0 -36 L38 28 L-38 28 Z" fill="#E9772E" stroke="#6b2410" stroke-width="2.4" stroke-linejoin="round"/><path d="M0 -26 L29 22 L-29 22 Z" fill="#FFF1DD"/><path d="M0 -36 L38 28 L-38 28 Z" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" stroke-dasharray="4 3" transform="scale(.9) translate(0 2)"/><path d="M-17 4 Q0 -12 17 4 Q0 20 -17 4Z" fill="#fff" stroke="#123" stroke-width="2"/><circle cx="0" cy="4" r="7" fill="#1f86a8"/><circle cx="0" cy="4" r="3.2" fill="#0b1a22"/><circle cx="-2" cy="2" r="1.3" fill="#fff"/><path d="M-14 -4 l-4 -5 M0 -8 v-6 M14 -4 l4 -5" stroke="#123" stroke-width="1.8" stroke-linecap="round"/></g>`,
    bloom: `<g>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cx="0" cy="-19" rx="9" ry="15" fill="#F4A6C0" stroke="#a23b64" stroke-width="1.6" transform="rotate(${a})"/>`).join('')}<circle r="11" fill="#F3C969" stroke="#8a5f12" stroke-width="1.8"/><circle r="11" fill="none" stroke="#fff" stroke-dasharray="2 3" stroke-width="1.4" transform="scale(.6)"/></g>`,
    star: `<g><polygon points="0,-36 10,-12 36,-12 15,4 23,30 0,15 -23,30 -15,4 -36,-12 -10,-12" fill="#F3C969" stroke="#8a5f12" stroke-width="2.4" stroke-linejoin="round"/><polygon points="0,-36 10,-12 36,-12 15,4 23,30 0,15 -23,30 -15,4 -36,-12 -10,-12" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.5" stroke-dasharray="4 3" transform="scale(.76)"/></g>`,
    none: '',
  };
  const charms = {
    lime: `<g><path d="M0 0v14" stroke="var(--hw-d)" stroke-width="2.4" stroke-dasharray="4 2"/><circle cy="40" r="18" fill="#4fae5a" stroke="#2e7a3a" stroke-width="3"/><circle cy="40" r="13" fill="#cfeec0"/><path d="M0 40L0 28M0 40L10 33M0 40L10 47M0 40L0 52M0 40L-10 47M0 40L-10 33" stroke="#7bc86c" stroke-width="2.2"/><path d="M4 62 C 18 66 18 94 4 100 C -8 94 -8 66 4 62Z" fill="#E8D640" stroke="#a89a12" stroke-width="2"/><path d="M4 70v22" stroke="#fff6a0" stroke-width="2" opacity=".7"/></g>`,
    badge: `<g><path d="M0 0v18" stroke="var(--hw-d)" stroke-width="2.4" stroke-dasharray="4 2"/><circle cy="48" r="24" fill="#15111a" stroke="#fff" stroke-width="2.4"/><path d="M0 62C-18 50 -12 36 -4 40 -1 42 0 44 0 44s1-2 4-4c8-4 14 10-4 22z" fill="#E0357F"/><text y="34" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="600" font-size="9" fill="#fff">I ♥ MUSIC</text></g>`,
    pom: `<g><path d="M0 0v18" stroke="var(--hw-d)" stroke-width="2.4" stroke-dasharray="4 2"/><g stroke="#B0305A" stroke-width="3" stroke-linecap="round">${Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return `<line x1="${(Math.cos(a) * 8).toFixed(1)}" y1="${(46 + Math.sin(a) * 8).toFixed(1)}" x2="${(Math.cos(a) * 21).toFixed(1)}" y2="${(46 + Math.sin(a) * 21).toFixed(1)}"/>`; }).join('')}</g><circle cy="46" r="13" fill="#E0457B"/></g>`,
    none: '',
  };

  function paint(popKey) {
    const dn = find(DENIM, S.denim), hw = find(HW, S.hw);
    svg.style.setProperty('--denim', dn.d); svg.style.setProperty('--denim-d', dn.dd); svg.style.setProperty('--denim-l', dn.l);
    svg.style.setProperty('--hw', hw.h); svg.style.setProperty('--hw-d', hw.hd);
    $('#strapFill').setAttribute('fill', `url(#st-${S.strap})`);
    $('#patch').innerHTML = patches[S.patch]; $('#charm').innerHTML = charms[S.charm];
    const grp = { patch: '#patch', charm: '#charm', strap: '#strap', denim: '#body', hw: '#studs' }[popKey];
    if (grp && !reduce) { const g = $(grp); g.classList.remove('pop'); void g.getBoundingClientRect(); g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center'; g.classList.add('pop'); }
    const parts = [find(DENIM, S.denim).name.toLowerCase() + ' denim', S.patch === 'none' ? 'no patch' : find(PATCH, S.patch).name.toLowerCase() + ' patch', find(STRAP, S.strap).name.toLowerCase() + ' strap', find(HW, S.hw).name.toLowerCase() + ' studs', S.charm === 'none' ? '' : find(CHARM, S.charm).name.toLowerCase()].filter(Boolean);
    $('#bagSummary').textContent = parts.join(' · ');
  }
  const wire = (key, items, kind) => radios($(`.opt[data-key=${key}] [role=radiogroup]`), items, S[key], (id) => { S[key] = id; paint(key); }, kind);
  wire('denim', DENIM); wire('patch', PATCH, 'chip'); wire('strap', STRAP); wire('hw', HW); wire('charm', CHARM, 'chip');
  paint();

  $('#bagShuffle').addEventListener('click', () => {
    const pick = (a) => a[Math.floor(Math.random() * a.length)].id;
    Object.assign(S, { denim: pick(DENIM), patch: pick(PATCH), strap: pick(STRAP), hw: pick(HW), charm: pick(CHARM) });
    [['denim', DENIM], ['patch', PATCH, 'chip'], ['strap', STRAP], ['hw', HW], ['charm', CHARM, 'chip']].forEach(([k, a, kind]) => wire(k, a, kind));
    paint('patch'); paint('charm');
  });
  $('#bagSend').addEventListener('click', () => composeFromStudio('a bag', `I’ve been designing a bag on your website and I’d love one like this: ${$('#bagSummary').textContent}.`));
  window.__bagState = S;
})();

/* ---------------------------------------------------------
   CAP BUILDER
   --------------------------------------------------------- */
(function capStudio() {
  const out = $('#capOut'), inn = $('#capIn'); if (!out) return;
  const STYLE = [{ id: 'flat', name: 'Flat cap' }, { id: 'baker', name: 'Baker boy' }];
  const FAB = [
    { id: 'denim', name: 'Denim', css: 'url(assets/img/denim.svg) 0 0/44px', tex: 'denim' },
    { id: 'leather', name: 'Leather-look', css: 'linear-gradient(135deg,#6b4636,#2a1710 70%)' },
    { id: 'tweed', name: 'Tweed', css: 'repeating-linear-gradient(135deg,#8a7b66 0 4px,#c4b494 4px 6px,#5d5042 6px 9px)' },
    { id: 'cord', name: 'Mustard cord', css: 'repeating-linear-gradient(90deg,#c8943a 0 4px,#a8761f 4px 6px)' },
    { id: 'plum', name: 'Plum wool', css: 'linear-gradient(135deg,#7a3d92,#3a1649)' },
  ];
  const LIN = [
    { id: 'paisley', name: 'Paisley', css: 'radial-gradient(circle at 30% 35%,#1c8c8f 0 18%,transparent 20%),radial-gradient(circle at 70% 70%,#d6336c 0 14%,transparent 16%),#f3e3c9' },
    { id: 'polka', name: 'Polka dot', css: 'radial-gradient(circle,#fff 0 24%,transparent 26%) 0 0/14px 14px,#1f3252' },
    { id: 'floral', name: 'Floral', css: 'radial-gradient(circle,#F3C969 0 12%,#f2a7b9 14% 34%,transparent 36%) 0 0/20px 20px,#5a2670' },
    { id: 'stripe', name: 'Stripe', css: 'repeating-linear-gradient(135deg,#b0305a 0 6px,#fbf3e8 6px 12px)' },
    { id: 'stars', name: 'Starry', css: 'radial-gradient(circle,#F3C969 0 12%,transparent 14%) 0 0/16px 16px,#0f1d3a' },
  ];
  const S = { style: 'flat', fabric: 'denim', lining: 'paisley' };
  const find = (a, id) => a.find((x) => x.id === id);

  const fabricDefs = `
    <linearGradient id="cshade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
    <linearGradient id="cshadeV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
    <pattern id="f-denim" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><rect width="7" height="7" fill="#3B5C86"/><line x1="0" y1="0" x2="0" y2="7" stroke="#fff" stroke-opacity=".17" stroke-width="2.4"/></pattern>
    <pattern id="f-leather" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#3c2418"/><circle cx="2" cy="2" r="1.1" fill="#fff" opacity=".07"/><circle cx="6.5" cy="6" r="1.3" fill="#000" opacity=".25"/><circle cx="6" cy="1.5" r=".8" fill="#000" opacity=".2"/></pattern>
    <pattern id="f-tweed" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#8a7b66"/><path d="M0 8l4-4 4 4 4-4 4 4M0 16l4-4 4 4 4-4 4 4" fill="none" stroke="#5d5042" stroke-width="2.2"/><path d="M0 4l4-4 4 4 4-4 4 4M0 12l4-4 4 4 4-4 4 4" fill="none" stroke="#c4b494" stroke-width="1.2"/></pattern>
    <pattern id="f-cord" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#c8943a"/><rect width="2" height="6" fill="#a8761f"/></pattern>
    <pattern id="f-plum" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#5a2670"/><circle cx="1.5" cy="1.5" r=".7" fill="#fff" opacity=".12"/><circle cx="4.5" cy="4.5" r=".7" fill="#000" opacity=".2"/></pattern>`;
  const liningDefs = `
    <pattern id="l-paisley" width="46" height="46" patternUnits="userSpaceOnUse"><rect width="46" height="46" fill="#f3e3c9"/><path d="M22 6C34 8 38 22 29 31 22 37 11 33 13 24 15 17 24 19 22 12 21 9 22 6 22 6Z" fill="#1c8c8f"/><circle cx="23" cy="20" r="3" fill="#f3e3c9"/><path d="M0 40C8 36 12 44 8 48M38 0C44 2 46 8 42 12" stroke="#d6336c" stroke-width="3" fill="none"/><circle cx="40" cy="36" r="4" fill="#d6336c"/><circle cx="6" cy="10" r="3" fill="#f2a516"/></pattern>
    <pattern id="l-polka" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#1f3252"/><circle cx="5.5" cy="5.5" r="4.2" fill="#fff"/><circle cx="16.5" cy="16.5" r="4.2" fill="#fff"/><circle cx="16.5" cy="5.5" r="1.8" fill="#e5473e"/><circle cx="5.5" cy="16.5" r="1.8" fill="#e5473e"/></pattern>
    <pattern id="l-floral" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#5a2670"/><g transform="translate(17 17)" fill="#f2a7b9">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-7" rx="4.6" ry="7" transform="rotate(${a})"/>`).join('')}</g><circle cx="17" cy="17" r="3" fill="#F3C969"/><circle cx="0" cy="0" r="3" fill="#b0305a"/><circle cx="34" cy="34" r="3" fill="#b0305a"/><circle cx="34" cy="0" r="3" fill="#b0305a"/><circle cx="0" cy="34" r="3" fill="#b0305a"/></pattern>
    <pattern id="l-stripe" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="26" height="26" fill="#fbf3e8"/><rect width="13" height="26" fill="#b0305a"/></pattern>
    <pattern id="l-stars" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#0f1d3a"/><polygon points="14,4 16.4,10.8 23.6,10.8 17.8,15 20,22 14,17.8 8,22 10.2,15 4.4,10.8 11.6,10.8" fill="#F3C969"/><circle cx="0" cy="0" r="1.6" fill="#fff"/><circle cx="28" cy="28" r="1.6" fill="#fff"/></pattern>`;

  const G = {
    flat: {
      dome: 'M66 226 C 50 152 112 104 216 98 C 304 94 362 140 376 226 Z',
      seams: ['M216 100 C 192 142 170 190 150 228', 'M216 100 C 240 146 258 192 276 228', 'M216 100 C 290 114 340 160 362 226', 'M216 100 C 160 114 108 150 88 226'],
      band: 'M62 216 Q 218 246 378 216 L 380 244 Q 218 276 60 244 Z',
      peak: 'M326 230 C 372 216 424 222 446 250 C 404 268 352 268 314 252 Z',
      button: [216, 99],
    },
    baker: {
      dome: 'M56 232 C 16 128 120 54 226 58 C 328 62 402 124 368 232 Z',
      seams: ['M226 60 C 196 110 176 176 150 236', 'M226 60 C 252 112 268 178 290 236', 'M226 60 C 330 82 380 150 364 232', 'M226 60 C 150 76 78 130 82 232'],
      band: 'M58 226 Q 216 252 370 226 L 370 248 Q 216 274 60 250 Z',
      peak: 'M338 236 C 376 228 414 232 430 252 C 396 266 360 264 330 252 Z',
      button: [226, 60],
    },
  };

  function drawOut() {
    const g = G[S.style], f = `url(#f-${S.fabric})`;
    const seams = g.seams.map((d) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="2.4"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="5 4" transform="translate(1.6 0)"/>`).join('');
    out.innerHTML = `<defs>${fabricDefs}</defs>
      <ellipse cx="228" cy="292" rx="190" ry="14" fill="#000" opacity=".28"/>
      <path d="${g.peak}" fill="${f}" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
      <path d="${g.peak}" fill="url(#cshadeV)"/>
      <path d="${g.peak}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" stroke-dasharray="5 4" transform="translate(386 246) scale(.93) translate(-386 -246)"/>
      <path d="${g.dome}" fill="${f}"/>
      <path d="${g.dome}" fill="url(#cshade)"/>
      ${seams}
      <path d="${g.band}" fill="${f}" stroke="#000" stroke-opacity=".3" stroke-width="2"/>
      <path d="${g.band}" fill="url(#cshadeV)"/>
      <path d="${g.band}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-dasharray="5 4" transform="translate(220 232) scale(.97 .6) translate(-220 -232)"/>
      <circle cx="${g.button[0]}" cy="${g.button[1]}" r="9" fill="${f}" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
      <circle cx="${g.button[0] - 2}" cy="${g.button[1] - 3}" r="3" fill="#fff" opacity=".35"/>`;
  }
  function drawIn() {
    const base = S.style === 'flat' ? { rx: 188, ry: 120 } : { rx: 174, ry: 130 };
    const f = `url(#f-${S.fabric})`, cx = 224, cy = 164;
    const rays = Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2 + .2; const x = cx + Math.cos(a) * (base.rx - 20), y = cy + Math.sin(a) * (base.ry - 20); return `<path d="M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#000" stroke-opacity=".3" stroke-width="2.4"/><path d="M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-dasharray="5 4" transform="translate(1.5 1.5)"/>`; }).join('');
    inn.innerHTML = `<defs>${fabricDefs}${liningDefs}
      <radialGradient id="inshade" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>
      <ellipse cx="${cx + 4}" cy="${cy + 140}" rx="180" ry="12" fill="#000" opacity=".28"/>
      <path d="M${cx + base.rx - 10} ${cy - 40} C ${cx + base.rx + 40} ${cy - 52} ${cx + base.rx + 54} ${cy - 6} ${cx + base.rx + 36} ${cy + 26} C ${cx + base.rx + 20} ${cy + 40} ${cx + base.rx} ${cy + 36} ${cx + base.rx - 14} ${cy + 24} Z" fill="${f}" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${base.rx}" ry="${base.ry}" fill="${f}" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${base.rx - 16}" ry="${base.ry - 16}" fill="url(#l-${S.lining})"/>
      ${rays}
      <ellipse cx="${cx}" cy="${cy}" rx="${base.rx - 16}" ry="${base.ry - 16}" fill="url(#inshade)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${base.rx - 16}" ry="${base.ry - 16}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-dasharray="5 4"/>
      <circle cx="${cx}" cy="${cy}" r="9" fill="#000" opacity=".25"/>
      <g transform="translate(${cx - 14} ${cy + 22})"><use href="#i-tag" width="28" height="37"/></g>`;
  }
  function summary() { $('#capSummary').textContent = `${find(FAB, S.fabric).name.toLowerCase()} ${find(STYLE, S.style).name.toLowerCase()} · ${find(LIN, S.lining).name.toLowerCase()} lining`; }
  const flip = $('#flip'), fbtn = $('#flipBtn');
  const setBack = (b) => { flip.classList.toggle('is-back', b); fbtn.setAttribute('aria-pressed', b); $('span', fbtn).textContent = b ? 'Back outside' : 'Peek inside'; };
  fbtn.addEventListener('click', () => setBack(!flip.classList.contains('is-back')));
  flip.addEventListener('click', () => setBack(!flip.classList.contains('is-back')));
  const redraw = () => { drawOut(); drawIn(); summary(); };
  const wire = (k, items, kind, after) => radios($(`.opt[data-key=${k}] [role=radiogroup]`), items, S[k], (id) => { S[k] = id; redraw(); after && after(); }, kind);
  wire('style', STYLE, 'chip', () => setBack(false)); wire('fabric', FAB, null, () => setBack(false)); wire('lining', LIN, null, () => setBack(true));
  redraw();
  $('#capSend').addEventListener('click', () => composeFromStudio('a cap', `I’d love a made-to-order cap: ${$('#capSummary').textContent}.`));
})();

/* ---------------------------------------------------------
   Alteration demos
   --------------------------------------------------------- */
(function hem() {
  const r = $('#hemRange'); if (!r) return;
  const waist = 44, y0 = 322, yEnd = 268;
  const edge = (side, y) => { const k = (y - waist) / (y0 - waist); return side === 'L' ? [62 + 14 * k, 146 - 6 * k] : [154 + 6 * k, 238 - 14 * k]; };
  const leg = (side, y) => { const [a, b] = edge(side, waist), [c, d] = edge(side, y); return `M${a} ${waist} H${b} L${d} ${y} H${c} Z`; };
  function paint() {
    const t = r.value / 100, y = y0 + (yEnd - y0) * t;
    ['L', 'R'].forEach((s) => {
      $('#leg' + s).setAttribute('d', leg(s, y)); $('#legShade' + s).setAttribute('d', leg(s, y));
      const [c, d] = edge(s, y - 9); $('#hem' + s).setAttribute('d', `M${c + 1} ${y - 9} H${d - 1}`);
      $('#hem' + s).style.opacity = .25 + .75 * t;
      const [c0, d0] = edge(s, y), [c1, d1] = edge(s, y0);
      $('#bunch' + s).innerHTML = Array.from({ length: 5 }, (_, i) => { const yy = y - 40 + i * 7.5; const [a, b] = edge(s, yy); return `<path d="M${a + 4} ${yy} Q${(a + b) / 2} ${yy - 5 + (i % 2) * 9} ${b - 4} ${yy}"/>`; }).join('');
      $('#bunch' + s).style.opacity = Math.max(0, 1 - t * 2.4);
    });
    const [lc, ld] = edge('L', y), [rc, rd] = edge('R', y), [lc1, ld1] = edge('L', y0), [rc1, rd1] = edge('R', y0);
    $('#hemWastePath').setAttribute('d', `M${lc} ${y} H${ld} L${ld1} ${y0} H${lc1} Z M${rc} ${y} H${rd} L${rd1} ${y0} H${rc1} Z`);
    $('#hemWaste').style.opacity = t > .05 ? .9 : 0;
    $('#hemOut').textContent = t < .12 ? 'Too long! Drag to hem them ✂' : t < .9 ? 'Getting there…' : 'Just right ✓ Beautifully hemmed';
  }
  r.addEventListener('input', paint); paint();
})();

(function zip() {
  const svg = $('#zipSvg'); if (!svg) return;
  const teeth = $('#zipTeeth'), pull = $('#zipPull'), out = $('#zipOut');
  const N = 22, step = 14.4, y0 = 16, MIN = 8, MAX = 262;
  let pullY = MAX, drag = false;
  const smooth = (x) => x * x * (3 - 2 * x);
  const panels = [...svg.querySelectorAll('rect')];
  const lp = el('path', { fill: '#3B5C86' }), rp = el('path', { fill: '#3B5C86' }), lt = el('path', { fill: 'url(#twill2)' }), rt = el('path', { fill: 'url(#twill2)' });
  const gap = el('rect', { x: 100, y: 0, width: 100, height: 330, fill: '#0e1829' });
  panels.slice(0, 5).forEach((p) => p.remove());
  svg.insertBefore(rt, teeth); svg.insertBefore(lt, rt); svg.insertBefore(rp, lt); svg.insertBefore(lp, rp); svg.insertBefore(gap, lp);
  const open = (y) => smooth(clamp((pullY + 10 - y) / 70, 0, 1));
  function paint() {
    let L = 'M40 0 H', R = '';
    const ptsL = [], ptsR = [];
    for (let y = 0; y <= 330; y += 6) { const a = open(y); ptsL.push([146 - 34 * a, y]); ptsR.push([154 + 34 * a, y]); }
    const d = (pts, base, end) => `M${base} 0 ` + pts.map((p) => `L${p[0].toFixed(1)} ${p[1]}`).join(' ') + ` L${end} 330 Z`;
    lp.setAttribute('d', d(ptsL, 40, 40)); lt.setAttribute('d', d(ptsL, 40, 40));
    rp.setAttribute('d', d(ptsR, 260, 260)); rt.setAttribute('d', d(ptsR, 260, 260));
    teeth.innerHTML = '';
    for (let i = 0; i < N; i++) {
      const y = y0 + i * step, a = open(y), eL = 146 - 34 * a, eR = 154 + 34 * a, odd = i % 2;
      const lx = eL - 14 + (odd ? 0 : 9 * (1 - a)), rx = eR + 0 - (odd ? 9 * (1 - a) : 0);
      teeth.appendChild(el('rect', { x: lx, y: y, width: 15, height: 9, rx: 3, fill: '#d8b25a', stroke: '#7d5f21', 'stroke-width': 1.2 }));
      teeth.appendChild(el('rect', { x: rx, y: y + step / 2, width: 15, height: 9, rx: 3, fill: '#e6c36d', stroke: '#7d5f21', 'stroke-width': 1.2 }));
    }
    pull.setAttribute('transform', `translate(0 ${pullY})`);
    out.textContent = pullY < 30 ? 'Zipped up ✓ Good as new' : pullY > MAX - 6 ? 'Broken! Pull the zip up ↑' : 'Keep going…';
  }
  const toY = (e) => { const r = svg.getBoundingClientRect(); return (e.clientY - r.top) / r.height * 330; };
  svg.addEventListener('pointerdown', (e) => { drag = true; svg.setPointerCapture(e.pointerId); pullY = clamp(toY(e) - 20, MIN, MAX); pull.style.cursor = 'grabbing'; paint(); });
  svg.addEventListener('pointermove', (e) => { if (!drag) return; pullY = clamp(toY(e) - 20, MIN, MAX); paint(); });
  const end = () => { drag = false; pull.style.cursor = 'grab'; };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  svg.addEventListener('keydown', (e) => { if (e.key === 'ArrowUp') pullY = clamp(pullY - 18, MIN, MAX); else if (e.key === 'ArrowDown') pullY = clamp(pullY + 18, MIN, MAX); else return; e.preventDefault(); paint(); });
  paint();
})();

(function mend() {
  const g = $('#mendStitches'), btn = $('#mendBtn'), out = $('#mendOut'), tear = $('#mendTear'); if (!g) return;
  const pts = [[70, 170], [102, 150], [128, 176], [160, 142], [192, 178], [226, 150]];
  const stitches = [];
  const segs = pts.slice(1).map((p, i) => [pts[i], p]);
  segs.forEach(([a, b]) => { const n = 4; for (let k = 0; k < n; k++) { const t = (k + .5) / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), nx = -dy / len * 11, ny = dx / len * 11; stitches.push(`M${(x - nx).toFixed(1)} ${(y - ny).toFixed(1)} L${(x + nx).toFixed(1)} ${(y + ny).toFixed(1)}`); } });
  g.innerHTML = stitches.map((d) => `<path d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" style="transition:stroke-dashoffset .25s ease-out"/>`).join('');
  const paths = $$('path', g); let done = false;
  btn.addEventListener('click', () => {
    done = !done;
    paths.forEach((p, i) => { p.style.transitionDelay = done ? i * 70 + 'ms' : '0ms'; p.style.strokeDashoffset = done ? 0 : 1; });
    tear.style.transition = 'opacity .6s ease ' + (done ? paths.length * 60 + 'ms' : '0ms'); tear.style.opacity = done ? .08 : 1;
    btn.textContent = done ? 'Tear it again' : 'Mend it';
    out.textContent = done ? 'Mended with love ✓' : 'Small tears, big difference.';
  });
})();

/* ---------------------------------------------------------
   Contact
   --------------------------------------------------------- */
function composeFromStudio(topic, text) {
  const r = $(`input[name=topic][value="${topic}"]`); if (r) r.checked = true;
  const m = $('#fMsg'); m.value = text + '\n\n';
  $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  setTimeout(() => m.focus({ preventScroll: true }), 700);
}
(function contact() {
  const form = $('#noteForm'); if (!form) return;
  if (CONFIG.email) {
    $('#mailItem').hidden = false; $('#lnkMail').href = 'mailto:' + CONFIG.email; $('#mailText').insertAdjacentText('afterbegin', CONFIG.email); $('#sendMail').hidden = false;
  }
  const build = () => {
    const name = $('#fName').value.trim(), topic = $('input[name=topic]:checked').value, msg = $('#fMsg').value.trim();
    return `Hi Sharon${name ? ', it’s ' + name : ''}! I’m getting in touch about ${topic}.${msg ? '\n\n' + msg : ''}`;
  };
  form.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-send]'); if (!b) return;
    const text = build(), k = b.dataset.send;
    if (k === 'mail') { location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Hello from the website')}&body=${encodeURIComponent(text)}`; return; }
    try { await navigator.clipboard.writeText(text); toast('Message copied — just paste it into the chat ✂'); } catch { toast('Opening the chat — type your message there'); }
    setTimeout(() => window.open(k === 'ig' ? CONFIG.instagramDm : CONFIG.messenger, '_blank', 'noopener'), 650);
  });
})();

/* ---------------------------------------------------------
   60th birthday gift (open with  ?gift  or  #gift )
   --------------------------------------------------------- */
(function gift() {
  const root = $('#giftRoot'); if (!root) return;
  const wanted = /(^|[?&#])gift(=|&|$)/.test(location.search + location.hash);
  if (!wanted) return;
  document.body.style.overflow = 'hidden';
  root.innerHTML = `
  <div class="gift" role="dialog" aria-modal="true" aria-label="A birthday surprise">
    <canvas class="gift__canvas"></canvas>
    <button class="gift__skip" type="button">Skip</button>
    <div class="gift__in">
      <p class="gift__kicker gift__kicker--pre">${GIFT.kicker}</p>
      <button class="gift__box" type="button" aria-label="Open your present">
        <svg viewBox="0 0 240 230">
          <ellipse cx="120" cy="214" rx="104" ry="11" fill="#000" opacity=".35"/>
          <rect x="30" y="104" width="180" height="108" rx="8" fill="#B0305A"/>
          <rect x="30" y="104" width="180" height="108" rx="8" fill="url(#giftStripe)"/>
          <rect x="108" y="104" width="24" height="108" fill="#F3C969"/>
          <g class="gift__lid">
            <rect x="20" y="68" width="200" height="42" rx="8" fill="#C93A6A"/>
            <rect x="108" y="68" width="24" height="42" fill="#F3C969"/>
            <path d="M120 66 C 84 22 40 40 62 62 C 76 74 108 68 120 66Z" fill="#F3C969" stroke="#b5802a" stroke-width="2"/>
            <path d="M120 66 C 156 22 200 40 178 62 C 164 74 132 68 120 66Z" fill="#F3C969" stroke="#b5802a" stroke-width="2"/>
            <circle cx="120" cy="66" r="10" fill="#E5B24A" stroke="#b5802a" stroke-width="2"/>
          </g>
          <defs><pattern id="giftStripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="16" height="16" fill="none"/><circle cx="4" cy="4" r="2" fill="#fff" opacity=".25"/><circle cx="12" cy="12" r="2" fill="#F3C969" opacity=".5"/></pattern></defs>
        </svg>
      </button>
      <p class="gift__hint">Tap to open</p>
      <div class="gift__reveal">
        <div class="gift__sixty">60</div>
        <h2 class="gift__h">${GIFT.title}</h2>
        <p class="gift__msg">${GIFT.message}</p>
        <p class="gift__sign">${GIFT.sign}</p>
        <button class="btn btn--cream gift__enter" type="button">Step inside your website <svg><use href="#i-arrow"/></svg></button>
      </div>
    </div>
  </div>`;
  const g = $('.gift', root), cv = $('canvas', g), ctx = cv.getContext('2d');
  let parts = [], raf = 0;
  const size = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  size(); addEventListener('resize', size);
  const COLS = ['#B0305A', '#E98BA8', '#F3C969', '#5A2670', '#3B5C86', '#A9C3DE', '#FBF3E8', '#E9772E'];
  function burst(n = 150, x = innerWidth / 2, y = innerHeight * .45) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 11;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, r: 4 + Math.random() * 7, c: COLS[i % COLS.length], k: ['btn', 'rect', 'circ', 'star'][i % 4], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 1 });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height); ctx.save(); ctx.scale(devicePixelRatio, devicePixelRatio);
    parts = parts.filter((p) => p.y < innerHeight + 30);
    for (const p of parts) {
      p.vy += .28; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.k === 'rect') ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      else if (p.k === 'circ') { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.6, 0, 7); ctx.fill(); }
      else if (p.k === 'btn') { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-p.r / 2.4, -p.r / 2.4, 2, 2); ctx.fillRect(p.r / 4, -p.r / 2.4, 2, 2); ctx.fillRect(-p.r / 2.4, p.r / 4, 2, 2); ctx.fillRect(p.r / 4, p.r / 4, 2, 2); }
      else { ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.lineTo(Math.cos(i * 1.2566 - 1.57) * p.r, Math.sin(i * 1.2566 - 1.57) * p.r); ctx.lineTo(Math.cos(i * 1.2566 - .94) * p.r / 2.2, Math.sin(i * 1.2566 - .94) * p.r / 2.2); } ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    ctx.restore();
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  }
  const openBox = () => { if (g.classList.contains('is-open')) return; g.classList.add('is-open'); burst(180); setTimeout(() => g.classList.add('is-revealed'), 950); setTimeout(() => burst(90, innerWidth * .2, innerHeight * .6), 350); setTimeout(() => burst(90, innerWidth * .8, innerHeight * .6), 600); };
  $('.gift__box', g).addEventListener('click', openBox);
  const close = () => { g.classList.add('is-gone'); document.body.style.overflow = ''; setTimeout(() => { g.remove(); badge(); }, 1100); };
  $('.gift__skip', g).addEventListener('click', close); $('.gift__enter', g).addEventListener('click', () => { burst(120); close(); });
  function badge() {
    const b = document.createElement('button'); b.className = 'giftbadge'; b.type = 'button'; b.textContent = '60'; b.setAttribute('aria-label', 'Re-read your birthday message');
    b.addEventListener('click', () => { b.remove(); document.body.style.overflow = 'hidden'; gift.replay(); });
    document.body.appendChild(b);
  }
  gift.replay = () => { const keep = location.hash; root.innerHTML = ''; history.replaceState(null, '', location.pathname + '?gift' + keep); gift(); };
})();

})();
