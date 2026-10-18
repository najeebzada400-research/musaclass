/* Genius Garden: Dania's Stage 8 maths practice. Talks to the same MusaClass connector with child=dania. */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbwdXJRnitF_bZNgG7GBZeaGMq4OHB0v8nEHphCLQFd7Htt3dpMr1VG2tLXB9VRJKjC4vw/exec';
  var CHILD = 'dania', KEY = 'genius-garden-v1', MINUS = '−';
  var QPS = 10, TOTAL = 10;
  var app = document.getElementById('app');
  var UNITS = ['', 'Integers', 'Expressions, formulae and equations', 'Place value and rounding', 'Decimals',
    'Angles and constructions', 'Collecting data', 'Fractions', 'Shapes and symmetry', 'Sequences and functions',
    'Percentages', 'Graphs', 'Ratio and proportion', 'Probability', 'Position and transformation',
    'Distance, area and volume', 'Interpreting and discussing results'];
  var PICS = ['rose', 'tulip', 'daisy', 'butterfly', 'cherry', 'sunflower'];
  var PIC_NAMES = { rose: 'Rose', tulip: 'Tulip', daisy: 'Daisy', butterfly: 'Butterfly', cherry: 'Cherry blossom', sunflower: 'Sunflower' };
  var FACTS = [
    'A sunflower head is packed with seeds in spirals. Count them one way and the other: you usually get two Fibonacci numbers, like 34 and 55.',
    'Most daisies, buttercups and lilies have a Fibonacci number of petals: 3, 5, 8, 13, 21 or 34.',
    'A honeybee cell is a regular hexagon. Hexagons tile with no gaps and use the least wax for the space they hold.',
    'The angle between new leaves on many plants is close to 137.5°, the "golden angle". It stops leaves shading each other.',
    'A butterfly is symmetrical: its left and right wings are reflections in the line down its body.',
    'Rose petals often grow in a spiral turning by about 137.5° each time, the same golden angle.',
    'The probability of a coin landing heads is 0.5, but in only 10 throws getting exactly 5 heads happens about 1 time in 4.',
    'π has been worked out to over 100 trillion decimal places, yet 3.14 is enough for most school problems.'
  ];
  var CHEERS_RIGHT = ['Lovely!', 'Spot on, Genius!', 'Beautiful!', 'Exactly right!', 'In full bloom!', 'Perfect!'];

  /* ---------- storage ---------- */
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === 'object') return s; } catch (e) {} return {}; }
  var L = load();
  L.queue = L.queue || []; L.done = L.done || {}; L.scores = L.scores || {};
  if (typeof L.mute !== 'boolean') L.mute = false;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(L)); } catch (e) {} }

  var view = 'loading', plan = null, stats = null, play = null, unlocked = false;
  var lockPick = '', lockMsg = '', setPick = '';
  var setIdx = 0, setObj = null, qi = 0, answer = '', pending = [], qStart = 0, fb = '', lastFinish = null, saveState = '';
  var lastInteract = Date.now(), localActive = 0;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pretty(s) { return esc(s).replace(/(\d+)\^(−?\d+)/g, '$1<sup>$2</sup>'); }
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function learning() { return plan && plan.phase === 'learning'; }
  function total() { return Math.max(plan.total_races || TOTAL, plan.races.length); }
  function qps() { return plan.questions_per_race || QPS; }
  function norm(s) { return String(s).replace(/\s/g, '').replace(/−/g, '-').replace(/,/g, '').replace(/^0+(?=\d)/, '').toLowerCase(); }
  function numVal(s) {
    var t = norm(s), m = t.match(/^(-?)(\d+)\/(\d+)$/);
    if (m) return Number(m[3]) ? (m[1] ? -1 : 1) * Number(m[2]) / Number(m[3]) : null;
    m = t.match(/^-?(\d+\.?\d*|\.\d+)$/);
    return m ? Number(t) : null;
  }
  function isRight(q, given) {
    if (q.t === 'mc') return given === q.a;
    if (norm(given) === norm(q.a)) return true;
    var g = numVal(given), a = numVal(q.a);
    return g !== null && a !== null && Math.abs(g - a) < 1e-9;
  }
  function doneMap() {
    var d = {};
    if (!plan) return d;
    (L.done[plan.plan_id] || []).forEach(function (i) { d[i] = 1; });
    if (stats && stats.done) stats.done.forEach(function (i) { d[i] = 1; });
    return d;
  }
  function myQueue() { return L.queue.filter(function (i) { return i.action === 'race' && i.complete !== false; }); }
  function petals() { return (stats ? stats.stars : 0) + myQueue().length * 3; }
  function minutesLeft() {
    if (!play) return null;
    return Math.max(0, Math.round((play.play_seconds - (play.active_seconds || 0)) / 60));
  }

  /* ---------- sound ---------- */
  var actx = null;
  function ac() {
    if (L.mute) return null;
    try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); return actx; } catch (e) { return null; }
  }
  function tone(f, start, dur, type, vol) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + start, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.16, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  var cheerAudio = null;
  try { cheerAudio = new Audio('../sounds/cheer.mp3?v=5'); cheerAudio.preload = 'auto'; } catch (e) {}
  var SFX = {
    chime: function () { [784, 988, 1319].forEach(function (f, i) { tone(f, i * 0.09, 0.4, 'sine', 0.14); }); },
    soft: function () { tone(523, 0, 0.25, 'triangle', 0.1); tone(440, 0.15, 0.35, 'triangle', 0.09); },
    tap: function () { tone(1200, 0, 0.06, 'sine', 0.05); },
    sparkle: function () { [1047, 1319, 1568, 2093].forEach(function (f, i) { tone(f, i * 0.07, 0.3, 'sine', 0.1); }); },
    cheer: function () {
      if (L.mute) return;
      if (!cheerAudio) { SFX.sparkle(); return; }
      try { cheerAudio.currentTime = 0; var p = cheerAudio.play(); if (p && p.catch) p.catch(function () { SFX.sparkle(); }); } catch (e) { SFX.sparkle(); }
    },
    rest: function () { tone(392, 0, 0.5, 'sine', 0.1); tone(330, 0.3, 0.7, 'sine', 0.09); }
  };
  function sfx(n) { try { if (SFX[n]) SFX[n](); } catch (e) {} }
  function stopCheer() { try { if (cheerAudio) cheerAudio.pause(); } catch (e) {} }

  /* ---------- pictures ---------- */
  function flowerSVG(kind, w) {
    w = w || 80;
    var s = '<svg viewBox="0 0 100 100" width="' + w + '" height="' + w + '" aria-hidden="true">';
    if (kind === 'rose') {
      s += '<path d="M50 60 V95" stroke="#3FA36B" stroke-width="5" fill="none"/><path d="M50 80 Q36 70 30 76 Q38 86 50 82" fill="#3FA36B"/>' +
        '<circle cx="50" cy="40" r="26" fill="#E9488A"/><circle cx="50" cy="40" r="18" fill="#D33A7A"/><path d="M38 40 Q50 22 62 40 Q50 52 38 40Z" fill="#F06A9F"/><path d="M44 40 Q50 30 56 40 Q50 46 44 40Z" fill="#B8226A"/>';
    } else if (kind === 'tulip') {
      s += '<path d="M50 58 V95" stroke="#3FA36B" stroke-width="5" fill="none"/><path d="M50 84 Q30 70 26 58 Q44 64 50 80" fill="#3FA36B"/>' +
        '<path d="M28 26 L38 40 L50 22 L62 40 L72 26 Q76 56 50 62 Q24 56 28 26Z" fill="#FF8A7A"/><path d="M50 22 L62 40 L72 26 Q76 56 50 62Z" fill="#F26D60"/>';
    } else if (kind === 'daisy') {
      s += '<path d="M50 58 V95" stroke="#3FA36B" stroke-width="5" fill="none"/>';
      for (var i = 0; i < 12; i++) s += '<ellipse cx="50" cy="22" rx="7" ry="16" fill="#FFFFFF" stroke="#F4C6DA" stroke-width="1.5" transform="rotate(' + (i * 30) + ' 50 40)"/>';
      s += '<circle cx="50" cy="40" r="11" fill="#FFC94D"/>';
    } else if (kind === 'butterfly') {
      s += '<path d="M50 30 Q22 4 12 26 Q8 46 48 48Z" fill="#B79CFF"/><path d="M50 30 Q78 4 88 26 Q92 46 52 48Z" fill="#B79CFF"/>' +
        '<path d="M48 52 Q18 54 22 76 Q34 88 49 60Z" fill="#E9488A"/><path d="M52 52 Q82 54 78 76 Q66 88 51 60Z" fill="#E9488A"/>' +
        '<circle cx="28" cy="28" r="5" fill="#FFFFFF"/><circle cx="72" cy="28" r="5" fill="#FFFFFF"/><rect x="47" y="26" width="6" height="44" rx="3" fill="#4A1638"/>' +
        '<path d="M49 27 Q42 14 38 12 M51 27 Q58 14 62 12" stroke="#4A1638" stroke-width="2" fill="none"/>';
    } else if (kind === 'cherry') {
      s += '<path d="M14 92 Q40 70 86 78" stroke="#7A3E68" stroke-width="5" fill="none"/>';
      for (var j = 0; j < 5; j++) s += '<ellipse cx="50" cy="24" rx="12" ry="16" fill="#FFC1D9" transform="rotate(' + (j * 72) + ' 50 42)"/>';
      s += '<circle cx="50" cy="42" r="7" fill="#E9488A"/>';
      for (var k = 0; k < 5; k++) s += '<circle cx="' + (50 + 10 * Math.cos(k * 1.257)) + '" cy="' + (42 + 10 * Math.sin(k * 1.257)) + '" r="1.8" fill="#B8226A"/>';
    } else {
      s += '<path d="M50 60 V95" stroke="#3FA36B" stroke-width="5" fill="none"/><path d="M50 78 Q66 66 72 72 Q64 84 50 80" fill="#3FA36B"/>';
      for (var p = 0; p < 16; p++) s += '<ellipse cx="50" cy="16" rx="6" ry="14" fill="#FFC94D" transform="rotate(' + (p * 22.5) + ' 50 40)"/>';
      s += '<circle cx="50" cy="40" r="14" fill="#7A4A2A"/><circle cx="50" cy="40" r="9" fill="#5B3520"/>';
    }
    return s + '</svg>';
  }
  function plotSVG(state, n) {
    var hue = ['#E9488A', '#FF8A7A', '#B79CFF', '#FFC94D', '#F06A9F'][n % 5];
    var s = '<svg viewBox="0 0 64 76" aria-hidden="true"><path d="M6 70 Q32 60 58 70 L58 76 L6 76Z" fill="#C98F6B"/>';
    if (state === 'done') {
      s += '<path d="M32 66 V34" stroke="#3FA36B" stroke-width="4"/><path d="M32 54 Q20 46 16 52 Q22 60 32 58" fill="#3FA36B"/>';
      for (var i = 0; i < 6; i++) s += '<ellipse cx="32" cy="12" rx="7" ry="11" fill="' + hue + '" transform="rotate(' + (i * 60) + ' 32 26)"/>';
      s += '<circle cx="32" cy="26" r="6" fill="#FFC94D"/>';
    } else if (state === 'next') {
      s += '<path d="M32 66 V40" stroke="#3FA36B" stroke-width="4"/><path d="M32 56 Q22 50 18 54 Q24 62 32 60" fill="#3FA36B"/><path d="M24 40 Q32 18 40 40 Q32 46 24 40Z" fill="' + hue + '"/>';
    } else {
      s += '<path d="M32 66 V54" stroke="#3FA36B" stroke-width="4"/><path d="M32 58 Q26 52 24 56 Q28 60 32 60" fill="#7CC79C"/>';
    }
    return s + '</svg>';
  }
  function bouquetSVG() {
    var s = '<svg viewBox="0 0 240 170" aria-hidden="true"><path d="M95 168 L120 96 L145 168Z" fill="#FFD6E7"/><path d="M95 168 L120 96 L145 168" stroke="#E9488A" stroke-width="3" fill="none"/>';
    var spots = [[120, 52, '#E9488A'], [82, 70, '#FF8A7A'], [158, 70, '#B79CFF'], [100, 34, '#FFC94D'], [142, 34, '#F06A9F'], [60, 44, '#FFC1D9'], [180, 44, '#FF8A7A']];
    spots.forEach(function (p, idx) {
      s += '<path d="M120 110 Q' + ((p[0] + 120) / 2) + ' ' + (p[1] + 40) + ' ' + p[0] + ' ' + (p[1] + 10) + '" stroke="#3FA36B" stroke-width="3" fill="none"/><g class="bloom" style="animation-delay:' + (idx * 0.08) + 's">';
      for (var i = 0; i < 6; i++) s += '<ellipse cx="' + p[0] + '" cy="' + (p[1] - 11) + '" rx="7" ry="11" fill="' + p[2] + '" transform="rotate(' + (i * 60) + ' ' + p[0] + ' ' + p[1] + ')"/>';
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#FFF2B3"/></g>';
    });
    return s + '</svg>';
  }
  function canSVG() {
    return '<svg viewBox="0 0 200 140" width="200" height="140" aria-hidden="true"><path d="M40 60 H120 V120 Q120 128 112 128 H48 Q40 128 40 120Z" fill="#B79CFF"/>' +
      '<path d="M120 76 L170 46 L176 54 L126 90Z" fill="#9C80F0"/><circle cx="178" cy="48" r="8" fill="#9C80F0"/><path d="M60 60 Q80 26 100 60" stroke="#7A3E68" stroke-width="7" fill="none"/>' +
      '<g fill="#7FC8F8"><circle cx="186" cy="68" r="3"/><circle cx="192" cy="82" r="3"/><circle cx="182" cy="92" r="3"/></g>' +
      '<g><circle cx="22" cy="118" r="10" fill="#E9488A"/><circle cx="14" cy="128" r="8" fill="#FFC1D9"/><circle cx="30" cy="130" r="8" fill="#FFC1D9"/></g></svg>';
  }

  /* ---------- petals confetti ---------- */
  function petalsBurst() {
    try {
      var old = document.getElementById('petals'); if (old) old.remove();
      var cv = document.createElement('canvas'); cv.id = 'petals';
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50';
      document.body.appendChild(cv);
      var dpr = Math.min(window.devicePixelRatio || 1, 2), W = window.innerWidth, H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      var x = cv.getContext('2d'); x.scale(dpr, dpr);
      var cols = ['#E9488A', '#FFC1D9', '#FF8A7A', '#B79CFF', '#FFC94D', '#FFFFFF', '#F06A9F'];
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var bits = [];
      for (var i = 0; i < (reduce ? 30 : 120); i++) bits.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 1.6, vy: 1.6 + Math.random() * 2.4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.12, s: 6 + Math.random() * 8, c: cols[i % cols.length], sw: Math.random() * 6 });
      var t0 = performance.now();
      (function frame(now) {
        var el = now - t0; if (!document.getElementById('petals')) return;
        x.clearRect(0, 0, W, H);
        x.globalAlpha = el > 3600 ? Math.max(0, 1 - (el - 3600) / 700) : 1;
        bits.forEach(function (b) {
          b.sw += 0.05; b.x += b.vx + Math.sin(b.sw) * 0.9; b.y += b.vy; b.r += b.vr;
          x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c;
          x.beginPath(); x.ellipse(0, 0, b.s * 0.55, b.s, 0, 0, Math.PI * 2); x.fill(); x.restore();
        });
        if (el < 4300) requestAnimationFrame(frame); else cv.remove();
      })(t0);
    } catch (e) {}
  }

  /* ---------- server ---------- */
  function apiGet() { return fetch(API + '?action=plan&child=' + CHILD + '&t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }); }
  function apiPost(body) { return fetch(API, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.json(); }); }
  function flushQueue() {
    if (!L.queue.length) return Promise.resolve(true);
    var item = L.queue[0];
    return apiPost(item).then(function (res) {
      if (!res || !res.ok) throw new Error(res && res.error);
      L.queue.shift(); save();
      if (res.stats) stats = res.stats;
      if (res.play) play = res.play;
      return flushQueue();
    });
  }
  function fallbackPlan() {
    return { plan_id: today(), phase: 'checkup', day: 1, headline: 'Hello, Genius', message: 'Your garden is ready. Pick a set and let it bloom.', questions_per_race: QPS, total_races: TOTAL, races: [], practice: [] };
  }
  function gotPlan(res) {
    plan = res.plan || plan || fallbackPlan();
    stats = res.stats || stats; play = res.play || play;
    try { localStorage.setItem(KEY + '-cache', JSON.stringify({ plan: plan, stats: stats, play: play })); } catch (e) {}
  }
  function readCache() { try { return JSON.parse(localStorage.getItem(KEY + '-cache')); } catch (e) { return null; } }
  function locked() { return play && play.locked && play.locked_until > Date.now(); }

  /* ---------- sets ---------- */
  function buildSet(i) {
    if (i < plan.races.length) return plan.races[i];
    var seed = 'dania-' + plan.plan_id + '-' + i;
    return { title: i >= 100 ? 'Bonus set' : 'Set ' + (i + 1), generated: true, questions: DaniaGen.makeSet(seed, qps(), plan.practice) };
  }
  function startSet(n) {
    if (locked()) { goView('rest'); return; }
    stopCheer();
    setIdx = n; setObj = buildSet(n); qi = 0; answer = ''; pending = []; fb = ''; qStart = Date.now();
    sfx('tap');
    goView('set');
  }
  function startBonus() {
    L.bonus = L.bonus || {};
    var k = (L.bonus[plan.plan_id] || 0) + 1; L.bonus[plan.plan_id] = k; save();
    startSet(100 + k);
  }
  function record(q, given) {
    pending.push({ id: q.id, given: given, seconds: Math.round((Date.now() - qStart) / 1000), q: q, ok: isRight(q, given) });
  }
  function submit() {
    var q = setObj.questions[qi];
    if (!answer) return;
    record(q, answer);
    if (!learning()) { sfx('tap'); advance(); return; }
    var ok = pending[pending.length - 1].ok;
    fb = ok ? 'good' : 'slip';
    sfx(ok ? 'chime' : 'soft');
    render();
  }
  function advance() {
    fb = ''; answer = ''; qi++; qStart = Date.now();
    if (qi >= setObj.questions.length) { finishSet(true); return; }
    render();
  }
  function packAnswers(list) {
    return list.map(function (p) {
      var o = { id: p.id, given: p.given, seconds: p.seconds };
      if (p.q.generated) o.q = { q: p.q.q, a: p.q.a, t: p.q.t, ch: p.q.ch, lesson: p.q.lesson };
      return o;
    });
  }
  function finishSet(complete) {
    var sid = CHILD + '-' + plan.plan_id + '-r' + setIdx + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (pending.length) L.queue.push({ action: 'race', child: CHILD, plan_id: plan.plan_id, phase: plan.phase, race: setIdx, submission_id: sid, complete: complete, answers: packAnswers(pending) });
    if (complete) {
      L.done[plan.plan_id] = (L.done[plan.plan_id] || []).concat([setIdx]);
      var right = pending.filter(function (p) { return p.ok; }).length;
      L.scores[plan.plan_id] = L.scores[plan.plan_id] || {};
      L.scores[plan.plan_id][setIdx] = right + '/' + pending.length;
    }
    save();
    if (!complete) { flushQueue().catch(function () {}); pending = []; return; }
    lastFinish = { set: setIdx, items: pending.slice() };
    pending = [];
    saveState = 'saving';
    sfx('cheer');
    goView('finish');
    petalsBurst();
    flushQueue().then(function () {
      saveState = 'saved';
      if (locked()) { goView('rest'); return; }
      if (view === 'finish') render();
    }).catch(function () { saveState = 'offline'; if (view === 'finish') render(); });
  }
  function scoreCheer(right, n) {
    var p = n ? right / n : 0;
    if (p >= 0.9) return 'Genius level! Your garden is in full bloom.';
    if (p >= 0.7) return 'Brilliant work, Genius!';
    if (p >= 0.5) return 'Good set! Your garden is growing.';
    return 'Well done for finishing. Every set makes you stronger.';
  }

  /* ---------- views ---------- */
  function goView(v) { view = v; render(); window.scrollTo(0, 0); }
  function topBar(right) {
    return '<div class="top"><div class="brand">' + flowerSVG('cherry', 42) + '<div><div class="script">Genius Garden</div><small>Dania’s maths</small></div></div>' +
      '<div style="display:flex;gap:8px">' + (right || '') + '<button class="icon-btn" data-go="mute" aria-label="' + (L.mute ? 'Turn sound on' : 'Turn sound off') + '">' + (L.mute ? 'Sound off' : 'Sound on') + '</button></div></div>';
  }
  function renderLock(first) {
    var h = '<div class="lock"><h1 class="script">Hello, Genius</h1>';
    h += '<p class="sub">' + (first ? 'Choose your secret flower. Keep it to yourself.' : 'Tap your secret flower to open your garden.') + '</p><div class="pics">';
    PICS.forEach(function (p) {
      var on = first ? setPick === p : lockPick === p;
      h += '<button class="pic' + (on ? ' on' : '') + '" data-pic="' + p + '" aria-label="' + PIC_NAMES[p] + '">' + flowerSVG(p, 90) + '</button>';
    });
    h += '</div>';
    var msg = first ? (setPick ? 'Tap the ' + PIC_NAMES[setPick].toLowerCase() + ' again to save it.' : '') :
      ({ wait: 'Checking…', good: 'Welcome back, Genius!', mid: 'Not that one. Try again.', offline: 'The garden is offline. Check the internet and try again.' }[lockMsg] || '');
    h += '<div class="msg ' + (lockMsg === 'good' ? 'good' : lockMsg === 'mid' ? 'mid' : '') + '" role="status">' + esc(msg) + '</div></div>';
    app.innerHTML = h;
  }
  function renderHome() {
    var d = doneMap(), n = total(), next = -1, doneCount = 0, sc = L.scores[plan.plan_id] || {};
    for (var i = 0; i < n; i++) { if (d[i]) doneCount++; else if (next < 0) next = i; }
    var left = minutesLeft();
    var h = topBar();
    h += '<section class="hello"><div><h1 class="script">' + esc(plan.headline && plan.headline.indexOf('Genius') >= 0 ? plan.headline : 'Welcome back, Genius') + '</h1>' +
      '<p>' + esc(plan.message || 'Pick a set and let your garden bloom.') + '</p></div><div>' + flowerSVG('sunflower', 70) + '</div>' +
      '<div class="stats"><span class="chip">' + petals() + ' petals</span><span class="chip">' + doneCount + ' of ' + n + ' sets today</span>' +
      (left !== null ? '<span class="chip time">' + left + ' min of garden time left</span>' : '') + '</div></section>';
    h += '<div class="section-title">Today’s garden</div><div class="garden">';
    for (var j = 0; j < n; j++) {
      var st = d[j] ? 'done' : (j === next ? 'next' : 'seed');
      h += '<button class="plot ' + st + '" data-set="' + j + '" aria-label="Set ' + (j + 1) + (d[j] ? ', done' : '') + '">' + plotSVG(st, j) + '<b>Set ' + (j + 1) + '</b><span>' + (d[j] ? (sc[j] || 'Bloomed') : (j === next ? 'Start' : '10 questions')) + '</span></button>';
    }
    h += '</div>';
    if (next >= 0) h += '<button class="big-btn" data-set="' + next + '">Start set ' + (next + 1) + '</button>';
    else h += '<button class="big-btn" data-go="bonus">Bonus set</button><p class="note">Every set is done today. Bonus sets are extra practice whenever you like.</p>';
    if (plan.phase === 'checkup') h += '<p class="note">These first sets help me see what you already know. You will see your score at the end of each set.</p>';
    app.innerHTML = h;
  }
  function renderSet() {
    var q = setObj.questions[qi], n = setObj.questions.length;
    var h = topBar('<button class="icon-btn" data-go="home">Garden</button>');
    h += '<div class="bar-row"><span class="script">' + esc(setIdx >= 100 ? 'Bonus set' : 'Set ' + (setIdx + 1)) + '</span><b>' + (qi + 1) + ' of ' + n + '</b></div><div class="progress">';
    for (var i = 0; i < n; i++) h += '<i class="' + (i < qi ? 'done' : i === qi ? 'now' : '') + '"></i>';
    h += '</div><section class="qcard"><div class="qmeta">' + esc(UNITS[q.ch] || '') + '</div><div class="qtext">' + pretty(q.q) + '</div>';
    var last = pending.length && pending[pending.length - 1].id === q.id ? pending[pending.length - 1] : null;
    if (q.t === 'mc') {
      h += '<div class="opts">';
      q.o.forEach(function (o, oi) {
        var cls = 'opt';
        if (fb && last) { if (o === q.a) cls += ' right'; else if (o === last.given) cls += ' wrong'; }
        else if (answer === o) cls += ' on';
        h += '<button class="' + cls + '" data-opt="' + oi + '"' + (fb ? ' disabled' : '') + '>' + pretty(o) + '</button>';
      });
      h += '</div>';
    } else {
      var shown = answer ? esc(answer) : '<span class="ph">Type your answer</span>';
      var unit = q.unit ? '<span class="unit">' + esc(q.unit) + '</span>' : '';
      h += '<div class="answer" aria-live="polite">' + (q.unitFirst ? unit + shown : shown + unit) + '</div>';
      if (!fb) {
        h += '<div class="pad">';
        ['7', '8', '9', 'del', '4', '5', '6', 'neg', '1', '2', '3', '/', '0', '.', 'clear'].forEach(function (k) {
          var label = { del: '⌫', neg: '±', clear: 'Clear', '/': 'a/b' }[k] || k;
          h += '<button class="key' + (k.length > 1 || k === '/' ? ' fn' : '') + '" data-key="' + k + '"' + (k === 'clear' ? ' style="grid-column: span 2"' : '') + '>' + label + '</button>';
        });
        h += '</div>';
      }
    }
    if (fb === 'good') h += '<div class="feedback good"><h3>' + pickOne(CHEERS_RIGHT) + '</h3>' + (q.steps && q.steps.length ? esc(q.steps[q.steps.length - 1]) : '') + '</div>';
    if (fb === 'slip') {
      h += '<div class="feedback slip"><h3>Nearly. Here is how it works</h3><ol>';
      (q.steps || []).forEach(function (s) { h += '<li>' + pretty(s) + '</li>'; });
      h += '</ol><p style="margin:8px 0 0">The answer is <span class="ans">' + pretty(q.unitFirst && q.unit ? q.unit + q.a.replace('-', MINUS) : q.a.replace(/^-/, MINUS) + (q.unit ? ' ' + q.unit : '')) + '</span>.</p></div>';
    }
    h += fb ? '<button class="go" data-go="advance">' + (qi + 1 < n ? 'Next question' : 'Finish set') + '</button>'
      : '<button class="go" data-go="submit"' + (answer ? '' : ' disabled') + '>' + (learning() ? 'Check' : (qi + 1 < n ? 'Next' : 'Finish set')) + '</button>';
    h += '</section>';
    app.innerHTML = h;
  }
  function renderFinish() {
    var f = lastFinish, d = doneMap(), n = total(), more = -1;
    for (var b = 0; b < n; b++) if (!d[b]) { more = b; break; }
    var right = f.items.filter(function (i) { return i.ok; }).length, cnt = f.items.length;
    var saveLine = saveState === 'saved' ? 'Saved' : (saveState === 'saving' ? 'Saving…' : 'Will save when the internet is back');
    var h = topBar();
    h += '<div class="finish"><h1 class="script">Set complete!</h1><div class="bouquet">' + bouquetSVG() + '</div>';
    h += '<div class="score">' + right + ' out of ' + cnt + '<small>' + esc(saveLine) + ' · +3 petals</small></div>';
    h += '<p class="cheer">' + esc(scoreCheer(right, cnt)) + '</p>';
    h += '<div class="fact"><b>Garden maths</b>' + esc(FACTS[(f.set + (plan.day || 1) * 3) % FACTS.length]) + '</div>';
    h += '<div class="two"><button class="big-btn soft" data-go="home">Back to garden</button>' +
      (more >= 0 ? '<button class="big-btn" data-set="' + more + '">Next set</button>' : '<button class="big-btn" data-go="bonus">Bonus set</button>') + '</div></div>';
    app.innerHTML = h;
  }
  function renderRest() {
    var parent = play && play.reason === 'parent';
    var ms = play && play.locked_until ? play.locked_until - Date.now() : 0;
    var hh = Math.floor(ms / 3600000), mm = Math.floor(ms % 3600000 / 60000);
    var h = topBar();
    h += '<div class="rest">' + canSVG() + '<h1 class="script">' + (parent ? 'Garden closed for now' : 'Garden break') + '</h1>';
    h += '<p>' + (parent ? 'Your garden is resting. It will open again soon.' : 'Great session, Genius. Your flowers need time to soak up the water.') + '</p>';
    if (ms > 0) h += '<div class="count">' + (hh ? hh + ' h ' : '') + mm + ' min</div><p>Back at ' + esc(play.back_at || '') + '</p>';
    h += '<div class="ideas"><b>While you wait</b><ul><li>Drink some water and stretch.</li><li>Look back over a page of your Stage 8 book.</li><li>Step outside and give your eyes a rest from the screen.</li></ul></div></div>';
    app.innerHTML = h;
  }
  function renderError(msg) {
    app.innerHTML = '<div class="loading"><div class="script">Oh, petals</div><p>' + esc(msg) + '</p><button class="big-btn" data-go="reload" style="max-width:320px;margin:16px auto 0">Try again</button></div>';
  }
  function render() {
    if (view === 'lock') renderLock(false);
    else if (view === 'setpic') renderLock(true);
    else if (view === 'home') renderHome();
    else if (view === 'set') renderSet();
    else if (view === 'finish') renderFinish();
    else if (view === 'rest') renderRest();
  }

  /* ---------- timer ---------- */
  function showRest() {
    if (view === 'set' && pending.length) finishSet(false);
    sfx('rest');
    goView('rest');
  }
  function applyPlay(p) {
    if (!p) return;
    play = p;
    if (locked()) {
      if (view === 'set' && fb) return;
      if (['rest', 'lock', 'setpic', 'loading'].indexOf(view) < 0) showRest();
    } else if (view === 'home') render();
  }
  function tick() {
    if (!plan || document.hidden || !unlocked) return;
    if (['home', 'set', 'finish'].indexOf(view) < 0) return;
    if (Date.now() - lastInteract > 120000) return;
    localActive += 60;
    apiPost({ action: 'tick', child: CHILD, in_race: view === 'set' }).then(function (res) {
      localActive = 0;
      if (res && res.ok) applyPlay(res.play);
    }).catch(function () {
      var g = play ? play.grace_seconds : 2100;
      if (localActive >= g) {
        var until = Date.now() + ((play && play.rest_minutes) || 150) * 60000, dd = new Date(until);
        play = { locked: true, locked_until: until, back_at: (dd.getHours() % 12 || 12) + ':' + ('0' + dd.getMinutes()).slice(-2), reason: 'time', play_seconds: 1800, active_seconds: 0 };
        localActive = 0; showRest();
      }
    });
  }
  setInterval(tick, 60000);
  var restChecks = 0;
  setInterval(function () {
    if (view !== 'rest' || !play) return;
    if (play.locked_until && play.locked_until <= Date.now()) { play.locked = false; openGarden(true); return; }
    if (!document.hidden && (++restChecks % 2 === 0)) { openGarden(true); return; }
    render();
  }, 30000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && unlocked && (view === 'rest' || view === 'home')) openGarden(true);
  });

  /* ---------- opening ---------- */
  function hashPic(p) { var s = CHILD + ':' + p + ':gg', h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h); }
  function openGarden(quiet) {
    flushQueue().catch(function () {}).then(function () { return apiGet(); }).then(function (res) {
      if (!res || !res.ok) throw new Error('no answer');
      gotPlan(res);
      if (!unlocked) { goView(res.player && !res.player.has_picture ? 'setpic' : 'lock'); return; }
      if (locked()) { if (view !== 'rest') goView('rest'); else render(); }
      else if (!quiet || view === 'rest') goView('home');
      else render();
    }).catch(function () {
      var cached = readCache();
      if (!plan && cached && cached.plan) { plan = cached.plan; stats = cached.stats; play = cached.play; }
      if (!unlocked) { if (plan) goView('lock'); else renderError('The garden is out of reach. Check the internet and try again.'); return; }
      if (!quiet) goView(locked() ? 'rest' : 'home');
    });
  }
  function tryPicture(p) {
    lockPick = p; lockMsg = 'wait'; render();
    apiPost({ action: 'login', child: CHILD, pic: p }).then(function (res) {
      if (res && res.ok && res.match) {
        L.pic = hashPic(p); save(); unlocked = true; lockMsg = 'good'; render(); sfx('sparkle');
        setTimeout(function () { goView(locked() ? 'rest' : 'home'); }, 700);
      } else if (res && res.ok && res.needs_setup) { goView('setpic'); }
      else { lockMsg = 'mid'; sfx('soft'); render(); }
    }).catch(function () {
      if (L.pic && L.pic === hashPic(p)) { unlocked = true; goView(locked() ? 'rest' : 'home'); }
      else if (L.pic) { lockMsg = 'mid'; render(); }
      else { lockMsg = 'offline'; render(); }
    });
  }
  function setPicture(p) {
    if (setPick !== p) { setPick = p; sfx('tap'); render(); return; }
    apiPost({ action: 'login', child: CHILD, pic: p, set: true }).then(function (res) {
      if (res && res.ok && res.match) { L.pic = hashPic(p); save(); unlocked = true; sfx('sparkle'); goView(locked() ? 'rest' : 'home'); }
      else { setPick = ''; render(); }
    }).catch(function () { lockMsg = 'offline'; render(); });
  }

  app.addEventListener('click', function (e) {
    lastInteract = Date.now();
    ac();
    var t = e.target.closest('button');
    if (!t || t.disabled) return;
    if (t.hasAttribute('data-pic')) { if (view === 'setpic') setPicture(t.getAttribute('data-pic')); else tryPicture(t.getAttribute('data-pic')); return; }
    if (t.hasAttribute('data-set')) { startSet(parseInt(t.getAttribute('data-set'), 10)); return; }
    if (t.hasAttribute('data-opt')) { answer = setObj.questions[qi].o[parseInt(t.getAttribute('data-opt'), 10)]; sfx('tap'); render(); return; }
    if (t.hasAttribute('data-key')) {
      var k = t.getAttribute('data-key');
      if (k === 'del') answer = answer.slice(0, -1);
      else if (k === 'clear') answer = '';
      else if (k === 'neg') answer = answer.charAt(0) === MINUS ? answer.slice(1) : MINUS + answer;
      else if (k === '.' && /[.\/]/.test(answer.split('/').pop())) { /* one point per number */ }
      else if (k === '/' && (answer.indexOf('/') >= 0 || !answer.replace(MINUS, ''))) { /* one fraction bar */ }
      else if (answer.replace(MINUS, '').length < 10) answer += k;
      render(); return;
    }
    var g = t.getAttribute('data-go');
    if (g === 'home') { if (view === 'set' && pending.length) finishSet(false); stopCheer(); goView(locked() ? 'rest' : 'home'); }
    else if (g === 'submit') submit();
    else if (g === 'advance') advance();
    else if (g === 'bonus') startBonus();
    else if (g === 'mute') { L.mute = !L.mute; save(); if (L.mute) stopCheer(); render(); }
    else if (g === 'reload') { app.innerHTML = '<div class="loading"><div class="script">Hello, Genius</div><p>Watering the garden…</p></div>'; openGarden(false); }
  });
  window.addEventListener('pagehide', function () {
    if (view === 'set' && pending.length && plan) {
      var sid = CHILD + '-' + plan.plan_id + '-r' + setIdx + '-' + Date.now().toString(36) + 'h';
      L.queue.push({ action: 'race', child: CHILD, plan_id: plan.plan_id, phase: plan.phase, race: setIdx, submission_id: sid, complete: false, answers: packAnswers(pending) });
      pending = []; save();
    }
  });

  openGarden(false);
})();
