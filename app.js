(function () {
  'use strict';
  var API = 'https://script.google.com/macros/s/AKfycbwdXJRnitF_bZNgG7GBZeaGMq4OHB0v8nEHphCLQFd7Htt3dpMr1VG2tLXB9VRJKjC4vw/exec';
  var MINUS = '−';

  var KIDS = {
    musa: {
      name: 'Musa', qpr: 20, total: 20, minusWord: 'minus',
      ch: ['', 'Place value', 'Negative numbers', 'Factors and multiples', 'Time', '2D shapes', '3D shapes', 'Area and perimeter',
        'Addition and subtraction', 'Multiplication and division', 'Patterns and sequences', 'Data', 'Statistics', 'Fractions',
        'Calculating with fractions', 'Angles and grids', 'Probability'],
      short: ['', 'Place value', 'Negative numbers', 'Factors', 'Time', '2D shapes', '3D shapes', 'Area and perimeter', 'Add and subtract',
        'Multiply and divide', 'Patterns', 'Data', 'Statistics', 'Fractions', 'Fraction sums', 'Angles and grids', 'Probability'],
      defaultMapUpTo: 10
    },
    essa: {
      name: 'Essa', qpr: 10, total: 20, minusWord: 'take away',
      ch: ['', 'Counting', 'Bigger and smaller', 'Make 10', 'Adding to 10', 'Adding to 20', 'Taking away to 10', 'Taking away to 20',
        'Crossing 10', 'Teen numbers', 'Missing numbers', 'Shapes', 'Money', 'Time', 'Patterns', 'Measuring', 'Numbers to 100'],
      short: ['', 'Count', 'Bigger', 'Make 10', 'Add to 10', 'Add to 20', 'Take to 10', 'Take to 20', 'Cross 10', 'Teens', 'Missing',
        'Shapes', 'Money', 'Time', 'Patterns', 'Measure', 'To 100'],
      defaultMapUpTo: 10
    }
  };
  var LESSONS_MUSA = {
    1: ['Read and write larger numbers', 'Know place value', 'Count on and back', 'Compare and order numbers', 'Round to the nearest 10, 100 and 1 000', 'Round to the nearest 10 000 and 100 000'],
    2: ['Read and write numbers less than 0', 'Count on and back across 0', 'Compare and order numbers'],
    3: ['Understand factors and multiples', 'Tests of divisibility'],
    4: ['Tell time on digital and analogue clocks', 'Use 12-hour and 24-hour timetables', 'Convert between units of time', 'Intervals between units of time'],
    5: ['Combine 2D shapes', 'Make tessellation', 'Find lines of symmetry', 'Reflect shapes'],
    6: ['Identify 2D faces in 3D shapes', 'Make nets of 3D shapes'],
    7: ['Perimeter of 2D shapes', 'Area of 2D shapes', 'Use grids and rules for area and perimeter', 'Area of irregular shapes'],
    8: ['Generalisations with adding and subtracting', 'Symbols for unknown numbers', 'Add 3-digit numbers', 'Subtract 3-digit numbers'],
    9: ['Multiply by 10 and 100', 'Divide by 10 and 100', 'The associative rule', 'Times tables 1 to 10', 'Multiply up to 1 000 by 1-digit numbers', 'Divide up to 100 by 1-digit numbers'],
    10: ['Term-to-term rules', 'Square number patterns'],
    11: ['Tally charts and frequency tables', 'Pictograms and bar charts', 'Dot plots', 'Venn and Carroll diagrams'],
    12: ['Plan a statistical investigation', 'Record and organise data', 'Answer statistical questions'],
    13: ['More parts means smaller parts', 'Divide wholes into equal parts', 'Equivalent fractions', 'Fractions on scales', 'Compare and order fractions', 'Percentages'],
    14: ['Unit fractions', 'Estimate and add fractions', 'Estimate and subtract fractions'],
    15: ['Estimate, compare and classify angles', 'Direction and movement on a grid', 'Coordinates on a grid'],
    16: ['Describe the chance of events', 'Investigations with chance']
  };
  var FACTS = [
    'A top racing pit crew can change all four tyres in about 2 seconds!',
    'A Formula 1 car can go from 0 to 100 km/h in under 3 seconds.',
    'The Sepang racing circuit in Malaysia is about 5.5 km long.',
    'Racing tyres get very hot during a race, around 100 °C. That is as hot as boiling water!',
    'The first Malaysian Grand Prix at Sepang was held in 1999.',
    'A Formula 1 steering wheel has more than 20 buttons and dials.',
    'Racing drivers can feel forces up to 5 times their own body weight in fast corners.',
    'The chequered flag is waved when the winner crosses the finish line.'
  ];
  var UPGRADES = [
    { key: 'stripes', name: 'Racing stripes', need: 15, sw: 'background:repeating-linear-gradient(90deg,#D62839 0 10px,#FFFFFF 10px 16px)' },
    { key: 'spoiler', name: 'Big spoiler', need: 30, sw: 'background:#1B2440' },
    { key: 'gold', name: 'Gold wheels', need: 45, sw: 'background:radial-gradient(circle,#FFC43D 0 30%,#1B2440 32%)' },
    { key: 'blue', name: 'Rocket blue paint', need: 60, sw: 'background:#1F6FEB' }
  ];
  var PICS = ['star', 'moon', 'sun', 'heart', 'tree', 'fish'];
  var CHEERS = {
    essa: ['Yes! Vroom!', 'Super driving!', 'You got it!', 'Brilliant!', 'Zoom zoom! Well done!', 'That is right!', 'Fantastic!', 'Wow, great job!'],
    musa: ['Nice one!', 'Great driving!', 'Spot on!', 'Full speed!']
  };
  var NEARLY = ['Nearly! Try again.', 'Good try! Have another go.', 'Almost! Try again.'];
  var PITS = [
    { key: 'tyre', title: 'Oh no, a flat tyre!', text: 'The pit crew is pumping it up. Your car will be ready soon.' },
    { key: 'hot', title: 'The engine is too hot!', text: 'Your car needs to cool down. The pit crew is checking the engine.' },
    { key: 'fuel', title: 'Out of fuel!', text: 'The fuel tank is empty. The pit crew is filling it up.' },
    { key: 'mud', title: 'Your car is super muddy!', text: 'The pit crew is giving it a big wash.' },
    { key: 'lunch', title: 'The pit crew is having lunch!', text: 'Even racing teams need a break. They will be back soon.' }
  ];
  var IDEAS = ['Draw your dream racing car.', 'Count the cars you can see outside.', 'Build a car with blocks or Lego.',
    'Help someone at home for five minutes.', 'Go and play outside!', 'Read a story with someone.', 'Make up a maths question for your brother.'];

  /* ---------- storage (best effort) ---------- */
  var KEY = 'musaclass-v2';
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === 'object') return s; } catch (e) {} return {}; }
  var L = load();
  L.done = L.done || {}; L.queue = L.queue || []; L.paint = L.paint || {}; L.keep = L.keep || {}; L.pics = L.pics || {};
  if (typeof L.mute !== 'boolean') L.mute = false;
  try { var old = JSON.parse(localStorage.getItem('musaclass-v1')); if (old && old.queue && old.queue.length) { old.queue.forEach(function (i) { i.child = i.child || 'musa'; L.queue.push(i); }); localStorage.removeItem('musaclass-v1'); } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(L)); } catch (e) {} }

  var child = null, plan = null, stats = null, play = null, view = 'loading';
  var race = 0, raceObj = null, qi = 0, answer = '', qStart = 0, pending = [], tries = 0, fbState = '';
  var lastFinish = null, saveState = '', pickCh = 0, pickLesson = '', studiedSent = false, tryState = {};
  var lockPick = '', lockMsg = '', setPick = '', unlocked = {};
  var lastInteract = Date.now(), localActive = 0;
  var app = document.getElementById('app');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function K() { return KIDS[child]; }
  function isEssa() { return child === 'essa'; }
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- sound and voice ---------- */
  var actx = null;
  function ac() {
    if (L.mute) return null;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (e) { return null; }
  }
  function tone(freq, start, dur, type, vol, endFreq) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + start;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function engine() {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime;
    var o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 700;
    o.frequency.setValueAtTime(55, t0);
    o.frequency.exponentialRampToValueAtTime(160, t0 + 0.5);
    o.frequency.exponentialRampToValueAtTime(90, t0 + 0.8);
    o.frequency.exponentialRampToValueAtTime(220, t0 + 1.3);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5);
    o.connect(f); f.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + 1.6);
  }
  function noiseBuf(c, secs) {
    var n = Math.floor(c.sampleRate * secs), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  /* starter motor, engine catches, then three big revs: vroom vroom vroom */
  function engineStart() {
    var c = ac(); if (!c) return;
    var t = c.currentTime + 0.05, out = c.createGain();
    out.gain.value = 0.9; out.connect(c.destination);
    // starter motor: gated, band-passed noise plus a low growl
    var ns = c.createBufferSource(); ns.buffer = noiseBuf(c, 0.8);
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 320; bp.Q.value = 0.8;
    var sg = c.createGain(); sg.gain.setValueAtTime(0, t);
    for (var k = 0; k < 7; k++) {
      var p = t + k * 0.095;
      sg.gain.setValueAtTime(0.0001, p); sg.gain.exponentialRampToValueAtTime(1.6, p + 0.025); sg.gain.exponentialRampToValueAtTime(0.1, p + 0.085);
    }
    sg.gain.setValueAtTime(0, t + 0.7);
    ns.connect(bp); bp.connect(sg); sg.connect(out); ns.start(t); ns.stop(t + 0.75);
    // engine: two detuned saws and a sub square, pulsed by the firing rhythm
    var e = t + 0.62;
    var o1 = c.createOscillator(), o2 = c.createOscillator(), o3 = c.createOscillator();
    o1.type = 'sawtooth'; o2.type = 'sawtooth'; o3.type = 'square';
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 4;
    var am = c.createGain(), lfo = c.createOscillator(), lfoG = c.createGain();
    lfo.type = 'square'; lfoG.gain.value = 0.35; am.gain.value = 0.65;
    lfo.connect(lfoG); lfoG.connect(am.gain);
    var vol = c.createGain();
    var shaper = c.createWaveShaper(), curve = new Float32Array(512);
    for (var s = 0; s < 512; s++) { var x = s / 256 - 1; curve[s] = Math.tanh(1.6 * x); }
    shaper.curve = curve;
    var mix = c.createGain(); mix.gain.value = 0.45;
    o1.connect(mix); o2.connect(mix); o3.connect(mix); mix.connect(shaper); shaper.connect(lp); lp.connect(am); am.connect(vol); vol.connect(out);
    // rpm curve: [time offset, base frequency]
    var pts = [[0, 28], [0.2, 75], [0.45, 44], [0.6, 46], [0.95, 150], [1.35, 52], [1.5, 54], [1.85, 175], [2.25, 56], [2.4, 58], [2.8, 215], [3.4, 62], [3.9, 50]];
    [[o1, 1], [o2, 1.012], [o3, 0.5], [lfo, 0.5]].forEach(function (pair) {
      var f = pair[0].frequency; f.setValueAtTime(pts[0][1] * pair[1], e);
      pts.slice(1).forEach(function (q) { f.exponentialRampToValueAtTime(q[1] * pair[1], e + q[0]); });
    });
    lp.frequency.setValueAtTime(300, e);
    pts.slice(1).forEach(function (q) { lp.frequency.exponentialRampToValueAtTime(220 + q[1] * 11, e + q[0]); });
    vol.gain.setValueAtTime(0.0001, e); vol.gain.exponentialRampToValueAtTime(0.5, e + 0.12);
    pts.slice(1).forEach(function (q) { if (q[0] <= 3.4) vol.gain.exponentialRampToValueAtTime(0.32 + q[1] / 330, e + q[0]); });
    vol.gain.exponentialRampToValueAtTime(0.0001, e + 4.1);
    [o1, o2, o3, lfo].forEach(function (o) { o.start(e); o.stop(e + 4.2); });
  }
  /* real crowd cheer recording (BigSoundBank, CC0) */
  var cheerAudio = null;
  try { cheerAudio = new Audio('sounds/cheer.mp3?v=5'); cheerAudio.preload = 'auto'; } catch (e) {}
  function crowdCheer() {
    if (L.mute) return;
    if (!cheerAudio) { SFX.fanfare(); return; }
    try {
      cheerAudio.currentTime = 0; cheerAudio.volume = 1;
      var p = cheerAudio.play(); if (p && p.catch) p.catch(function () { SFX.fanfare(); });
    } catch (e) { SFX.fanfare(); }
  }
  function stopCheer() { try { if (cheerAudio) cheerAudio.pause(); } catch (e) {} }
  var SFX = {
    start: engineStart,
    cheer: crowdCheer,
    whoosh: function () { tone(500, 0, 0.18, 'triangle', 0.08, 1400); },
    ding: function () { tone(988, 0, 0.18, 'sine', 0.22); tone(1319, 0.12, 0.35, 'sine', 0.22); },
    boop: function () { tone(330, 0, 0.18, 'sine', 0.16, 250); tone(262, 0.16, 0.28, 'sine', 0.14, 220); },
    fanfare: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.3, 'triangle', 0.18); }); tone(1047, 0.55, 0.6, 'triangle', 0.16); },
    clunk: function () { tone(140, 0, 0.25, 'square', 0.12, 60); tone(90, 0.25, 0.4, 'square', 0.1, 40); }
  };
  function sfx(name) { try { if (SFX[name]) SFX[name](); } catch (e) {} }
  var voice = null;
  function pickVoice() {
    try {
      var vs = window.speechSynthesis.getVoices();
      voice = vs.filter(function (v) { return /^en(-|_)(GB|AU|IN|US)/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
    } catch (e) { voice = null; }
  }
  try { pickVoice(); window.speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  function say(text, slow) {
    if (L.mute || !text) return;
    try {
      var s = window.speechSynthesis; s.cancel();
      var u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = voice ? voice.lang : 'en-GB';
      u.rate = slow ? 0.85 : 0.95; u.pitch = 1.1;
      s.speak(u);
    } catch (e) {}
  }
  function speakable(q) {
    if (q.say) return q.say;
    var t = String(q.q);
    t = t.replace(/(\d) (\d{3})/g, '$1$2');
    t = t.replace(/ − /g, ' ' + K().minusWord + ' ').replace(/−(?=\d)/g, 'minus ').replace(/\+/g, isEssa() ? ' add ' : ' plus ')
      .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/=\s*\?/g, ' makes what?').replace(/=/g, isEssa() ? ' makes ' : ' equals ')
      .replace(/□/g, ' what number ').replace(/…/g, '').replace(/cm²/g, 'square centimetres').replace(/°C/g, ' degrees');
    if (q.t === 'mc' && q.o) t += '. Is it ' + q.o.join(', or ') + '?';
    return t;
  }

  /* ---------- server ---------- */
  function apiGet(c) {
    return fetch(API + '?action=plan&child=' + c + '&t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(hydrate);
  }
  /* a plan may keep its races in a file next to the site (races_src), so the Drive plan stays small */
  /* a sequential programme stays on this device until it is finished or its end date passes,
     even if a newer daily plan arrives from the planner */
  function keepProgramme(res) {
    try {
      var p = res && res.plan, c = child; if (!p || !c) return res;
      L.prog = L.prog || {};
      var today = new Date(); today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
      if (p.sequential && p.races && p.races.length) { L.prog[c] = p; save(); return res; }
      var g = L.prog[c];
      if (!g || !g.races || (g.programme_until && g.programme_until < today)) return res;
      var done = (L.done[c] || {})[g.plan_id] || [], n = Math.max(g.total_races || 0, g.races.length), left = 0;
      for (var i = 0; i < n; i++) if (done.indexOf(i) < 0) left++;
      if (!left) return res;
      res.plan = g; if (res.stats) res.stats.done = [];
    } catch (e) {}
    return res;
  }
  function hydrate(res) {
    return hydrate0(res).then(keepProgramme);
  }
  function hydrate0(res) {
    var p = res && res.plan;
    if (!p || !p.races_src || (p.races && p.races.length) || !/^[\w\/.-]+\.json$/.test(p.races_src) || /\.\./.test(p.races_src)) return Promise.resolve(res);
    return fetch(p.races_src + '?v=' + encodeURIComponent(p.plan_id || ''), { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) {
      p.races = (j && j.races) || [];
      return res;
    }).catch(function () { p.races = p.races || []; return res; });
  }
  function apiPost(body) { return fetch(API, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.json(); }); }
  function flushQueue() {
    if (!L.queue.length) return Promise.resolve(true);
    var item = L.queue[0];
    return apiPost(item).then(function (res) {
      if (!res || !res.ok) throw new Error(res && res.error);
      L.queue.shift(); save();
      if (res.stats && item.child === child) stats = res.stats;
      if (res.play && item.child === child) play = res.play;
      return flushQueue();
    });
  }

  function myQueue() { return L.queue.filter(function (i) { return i.child === child && i.action === 'race' && i.complete !== false; }); }
  function starsTotal() { return (stats ? stats.stars : 0) + myQueue().length * 3; }
  function daysTotal() { return stats ? stats.days : 0; }
  function doneMap() {
    var d = {};
    if (!plan) return d;
    ((L.done[child] || {})[plan.plan_id] || []).forEach(function (i) { d[i] = 1; });
    if (stats && stats.done) stats.done.forEach(function (i) { d[i] = 1; });
    return d;
  }
  function has(up) { var u = UPGRADES.filter(function (x) { return x.key === up; })[0]; return starsTotal() >= u.need; }
  function totalRaces() { return Math.max(plan.total_races || K().total, plan.races.length); }
  function qpr() { return plan.questions_per_race || K().qpr; }
  function feedbackNow() { return isEssa() && plan.phase === 'learning'; }

  /* ---------- drawings ---------- */
  function car(w, dark, name, forChild) {
    var who = forChild || child;
    if (who === 'musa') return silverCar(w, dark, name, who);
    if (who === 'essa') return orangeSuper(w, dark, name, who);
    var tyre = dark ? '#0B1226' : '#1B2440';
    var paint = (who === child && L.paint[child] === 'blue' && has('blue')) ? '#1F6FEB' : '#D62839';
    var mine = who === child;
    var gold = mine && has('gold'), spoiler = mine && has('spoiler'), stripes = mine && has('stripes');
    var hub = gold ? '#FFD84D' : '#FFC43D', hubR = gold ? 6 : 4;
    var s = '<svg viewBox="0 0 120 56" width="' + w + '" height="' + Math.round(w * 0.467) + '" aria-hidden="true" class="car">';
    if (spoiler) s += '<rect x="0" y="10" width="24" height="6" rx="2" fill="' + tyre + '"/><rect x="9" y="14" width="5" height="18" fill="' + tyre + '"/>';
    else s += '<rect x="4" y="16" width="16" height="5" rx="2" fill="' + tyre + '"/><rect x="10" y="20" width="4" height="12" fill="' + tyre + '"/>';
    s += '<path d="M6 40 L16 28 L46 24 L60 12 L84 12 L96 25 L112 29 L115 41 L6 41 Z" fill="' + paint + '"/>';
    if (stripes) s += '<path d="M8 38.5 L112 38.5 L113 40.5 L7 40.5 Z" fill="#FFFFFF"/>';
    s += '<path d="M63 15 L82 15 L90 24 L58 24 Z" fill="#BFE3FF"/>';
    if (name) s += '<text x="66" y="36" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="10" fill="#FFFFFF" letter-spacing="0.5">' + esc(name) + '</text>';
    else s += '<circle cx="40" cy="30" r="6" fill="#FFFFFF"/>';
    s += '<circle cx="30" cy="42" r="10" fill="' + tyre + '"/><circle cx="30" cy="42" r="' + hubR + '" fill="' + hub + '"/>' +
      '<circle cx="94" cy="42" r="10" fill="' + tyre + '"/><circle cx="94" cy="42" r="' + hubR + '" fill="' + hub + '"/></svg>';
    return s;
  }
  /* Essa's car: an original low orange supercar (no real make, badge or light design) */
  function orangeSuper(w, dark, name, who) {
    var tyre = dark ? '#0B1226' : '#1B2440';
    var mine = who === child;
    var blue = mine && L.paint[child] === 'blue' && has('blue');
    var paint = blue ? '#1F6FEB' : '#FF7A1A', shade = blue ? '#1452B5' : '#D95F08', trim = '#2A2F3A';
    var gold = mine && has('gold'), spoiler = mine && has('spoiler'), stripes = mine && has('stripes');
    var hub = gold ? '#FFD84D' : '#5B6270', hubR = gold ? 6 : 5;
    var s = '<svg viewBox="0 0 120 56" width="' + w + '" height="' + Math.round(w * 0.467) + '" aria-hidden="true" class="car">';
    if (spoiler) s += '<rect x="0" y="17" width="22" height="4" rx="2" fill="' + tyre + '"/><rect x="9" y="20" width="4" height="10" fill="' + tyre + '"/>';
    s += '<path d="M3 41 L4 33 C6 30 10 29 16 28.5 L34 27 C40 20 48 15.5 58 15 C66 14.8 72 16 78 20 L90 26 C100 27.5 110 30 115 33 C118 35 119 38 119 41 Z" fill="' + paint + '" stroke="' + shade + '" stroke-width="1.2" stroke-linejoin="round"/>';
    s += '<path d="M42 26 C47 19.5 54 16.5 60 16.5 C67 16.5 72 18.5 77 21.5 L84 26 C70 24.5 54 24.5 42 26 Z" fill="' + trim + '"/>';
    s += '<path d="M50 24.5 C54 20 58 18.3 62 18.3 C66.5 18.3 70.5 19.8 74 22.2 L78 24.5 C68 23.5 58 23.6 50 24.5 Z" fill="#BFE3FF"/>';
    s += '<path d="M28 35 C32 31 38 29.5 46 29.8 L43 35.5 Z" fill="' + trim + '"/>';
    s += '<path d="M3 33.5 L11 30 L13 31.2 L4 35 Z" fill="' + trim + '"/><path d="M99 40 L119 40 L119 42 L97 42 Z" fill="' + trim + '"/>';
    if (stripes) s += '<path d="M50 38 L118 38 L118 39.6 L48 39.6 Z" fill="#FFFFFF"/>';
    s += '<path d="M108 31 L115.5 32.8 L115 34.2 L107 32.6 Z" fill="#FFF4D6"/><path d="M4 31 L8 30 L8 32 L4 33 Z" fill="#D62839"/>';
    s += '<path d="M17 41 A11 11 0 0 1 39 41 Z" fill="' + shade + '"/><path d="M83 41 A11 11 0 0 1 105 41 Z" fill="' + shade + '"/>';
    if (name) s += '<text x="68" y="35" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="9" fill="#FFFFFF" letter-spacing="0.6">' + esc(name) + '</text>';
    s += '<circle cx="28" cy="43" r="10" fill="' + tyre + '"/><circle cx="28" cy="43" r="' + hubR + '" fill="' + hub + '"/>' +
      '<circle cx="94" cy="43" r="10" fill="' + tyre + '"/><circle cx="94" cy="43" r="' + hubR + '" fill="' + hub + '"/></svg>';
    return s;
  }
  /* Musa's car: an original long, low silver endurance racer (no real make, badge or number) */
  function silverCar(w, dark, name, who) {
    var tyre = dark ? '#0B1226' : '#1B2440';
    var mine = who === child;
    var blue = mine && L.paint[child] === 'blue' && has('blue');
    var paint = blue ? '#1F6FEB' : '#C9CFD8', shade = blue ? '#1452B5' : '#8C95A3', hi = blue ? '#5B97F5' : '#EEF1F5';
    var gold = mine && has('gold'), spoiler = mine && has('spoiler'), stripes = mine && has('stripes');
    var hub = gold ? '#FFD84D' : '#D7DCE3', hubR = gold ? 6 : 5;
    var s = '<svg viewBox="0 0 120 56" width="' + w + '" height="' + Math.round(w * 0.467) + '" aria-hidden="true" class="car">';
    s += spoiler ? '<rect x="1" y="9" width="24" height="5" rx="2" fill="' + tyre + '"/><rect x="9" y="13" width="4" height="17" fill="' + tyre + '"/>'
      : '<rect x="2" y="15" width="18" height="4" rx="2" fill="' + tyre + '"/><rect x="9" y="18" width="4" height="12" fill="' + tyre + '"/>';
    s += '<path d="M2 41 L3 31 C12 29 30 28 46 26 C52 18 60 15 69 15 C78 15 84 19 88 24 C98 26 108 29 113 32 C117 34 119 37 119 41 Z" fill="' + paint + '" stroke="' + shade + '" stroke-width="1.2" stroke-linejoin="round"/>';
    s += '<path d="M32 33.5 L43 32 L43 35.5 L32 36 Z" fill="' + tyre + '" opacity="0.75"/><path d="M104 40.5 L119 40.5 L119 42 L102 42 Z" fill="' + tyre + '"/>';
    s += '<path d="M46 26 C52 18 60 15 69 15 C78 15 84 19 88 24 C80 22 60 22 46 26 Z" fill="' + hi + '"/>';
    s += '<path d="M56 24 C59 19 64 17 69 17 C75 17 79 19 82 23 C74 22 64 22 56 24 Z" fill="#BFE3FF"/>';
    s += '<path d="M4 37 L117 37" stroke="' + shade + '" stroke-width="1.6"/>';
    if (stripes) s += '<path d="M3 39 L118 39 L118 41 L2 41 Z" fill="#D62839"/>';
    s += '<ellipse cx="113" cy="34" rx="3" ry="1.6" fill="#FFE9A8"/>';
    s += '<path d="M17 41 A11 11 0 0 1 39 41 Z" fill="' + shade + '"/><path d="M83 41 A11 11 0 0 1 105 41 Z" fill="' + shade + '"/>';
    if (name) s += '<text x="66" y="34" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="9" fill="' + (blue ? '#FFFFFF' : '#1B2440') + '" letter-spacing="0.6">' + esc(name) + '</text>';
    s += '<circle cx="28" cy="43" r="9.5" fill="' + tyre + '"/><circle cx="28" cy="43" r="' + hubR + '" fill="' + hub + '"/>' +
      '<circle cx="94" cy="43" r="9.5" fill="' + tyre + '"/><circle cx="94" cy="43" r="' + hubR + '" fill="' + hub + '"/></svg>';
    return s;
  }
  function star(size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path d="M12 2.5 L14.9 8.6 L21.5 9.4 L16.6 13.9 L17.9 20.5 L12 17.2 L6.1 20.5 L7.4 13.9 L2.5 9.4 L9.1 8.6 Z" fill="#FFC43D" stroke="#B88400" stroke-width="1.1" stroke-linejoin="round"/></svg>';
  }
  function picSvg(p, size) {
    var s = '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true">';
    if (p === 'star') s += '<path d="M12 2.5 L14.9 8.6 L21.5 9.4 L16.6 13.9 L17.9 20.5 L12 17.2 L6.1 20.5 L7.4 13.9 L2.5 9.4 L9.1 8.6 Z" fill="#FFC43D" stroke="#B88400" stroke-width="1.1" stroke-linejoin="round"/>';
    if (p === 'moon') s += '<path d="M15 3 A9 9 0 1 0 21 15 A7 7 0 1 1 15 3 Z" fill="#7A8CC9" stroke="#3E4C86" stroke-width="1.1"/>';
    if (p === 'sun') s += '<circle cx="12" cy="12" r="5" fill="#FF8A1F"/><path d="M12 1.5 V4.5 M12 19.5 V22.5 M1.5 12 H4.5 M19.5 12 H22.5 M4.6 4.6 L6.7 6.7 M17.3 17.3 L19.4 19.4 M4.6 19.4 L6.7 17.3 M17.3 6.7 L19.4 4.6" stroke="#FF8A1F" stroke-width="2" stroke-linecap="round"/>';
    if (p === 'heart') s += '<path d="M12 21 C5 15.5 2.5 12.5 2.5 8.6 A4.6 4.6 0 0 1 12 6.5 A4.6 4.6 0 0 1 21.5 8.6 C21.5 12.5 19 15.5 12 21 Z" fill="#E8456B" stroke="#A3203F" stroke-width="1.1"/>';
    if (p === 'tree') s += '<rect x="10.5" y="15" width="3" height="7" fill="#8A5A2B"/><path d="M12 2 L19 15 H5 Z" fill="#2BB673" stroke="#177A45" stroke-width="1.1" stroke-linejoin="round"/>';
    if (p === 'fish') s += '<path d="M3 12 C6 6.5 13 6 17 12 C13 18 6 17.5 3 12 Z" fill="#1F9FD6" stroke="#0E6A93" stroke-width="1.1"/><path d="M17 12 L22 8 V16 Z" fill="#1F9FD6" stroke="#0E6A93" stroke-width="1.1" stroke-linejoin="round"/><circle cx="8" cy="11" r="1.2" fill="#0B1226"/>';
    return s + '</svg>';
  }
  function flagIcon() {
    return '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M5 3 V21" stroke="#1B2440" stroke-width="2" stroke-linecap="round"/><rect x="6" y="4" width="13" height="9" fill="#FFFFFF" stroke="#1B2440" stroke-width="1.4"/><rect x="6" y="4" width="3.25" height="3" fill="#1B2440"/><rect x="12.5" y="4" width="3.25" height="3" fill="#1B2440"/><rect x="9.25" y="7" width="3.25" height="3" fill="#1B2440"/><rect x="15.75" y="7" width="3.25" height="3" fill="#1B2440"/><rect x="6" y="10" width="3.25" height="3" fill="#1B2440"/><rect x="12.5" y="10" width="3.25" height="3" fill="#1B2440"/></svg>';
  }
  function lockIcon() { return '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="#8A97B4"/><path d="M8 11 V8 A4 4 0 0 1 16 8 V11" stroke="#8A97B4" stroke-width="2.2" fill="none"/></svg>'; }
  function speakerIcon() { return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="#1B2440"/><path d="M16 8.5 A5 5 0 0 1 16 15.5 M18.5 6 A8.5 8.5 0 0 1 18.5 18" stroke="#1B2440" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'; }
  function muteIcon() { return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="#1B2440"/><path d="M16 9 L21 14 M21 9 L16 14" stroke="#1B2440" stroke-width="2" stroke-linecap="round"/></svg>'; }
  function clockSvg(h, m) {
    var cx = 100, cy = 100, o = '<svg viewBox="0 0 200 200" width="220" height="220" role="img" aria-label="An analogue clock">';
    o += '<circle cx="100" cy="100" r="92" fill="#FFFFFF" stroke="#1B2440" stroke-width="6"/>';
    for (var i = 0; i < 60; i++) {
      var th = i * 6 * Math.PI / 180, r1 = i % 5 === 0 ? 76 : 82, r2 = 87;
      o += '<line x1="' + (cx + r1 * Math.sin(th)).toFixed(1) + '" y1="' + (cy - r1 * Math.cos(th)).toFixed(1) + '" x2="' + (cx + r2 * Math.sin(th)).toFixed(1) + '" y2="' + (cy - r2 * Math.cos(th)).toFixed(1) + '" stroke="#1B2440" stroke-width="' + (i % 5 === 0 ? 3 : 1.2) + '"/>';
    }
    for (var n = 1; n <= 12; n++) {
      var a = n * 30 * Math.PI / 180;
      o += '<text x="' + (cx + 62 * Math.sin(a)).toFixed(1) + '" y="' + (cy - 62 * Math.cos(a) + 8).toFixed(1) + '" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="22" fill="#1B2440">' + n + '</text>';
    }
    var hA = ((h % 12) + m / 60) * 30 * Math.PI / 180, mA = m * 6 * Math.PI / 180;
    o += '<line x1="100" y1="100" x2="' + (cx + 44 * Math.sin(hA)).toFixed(1) + '" y2="' + (cy - 44 * Math.cos(hA)).toFixed(1) + '" stroke="#1B2440" stroke-width="8" stroke-linecap="round"/>';
    o += '<line x1="100" y1="100" x2="' + (cx + 70 * Math.sin(mA)).toFixed(1) + '" y2="' + (cy - 70 * Math.cos(mA)).toFixed(1) + '" stroke="#D62839" stroke-width="5" stroke-linecap="round"/>';
    return o + '<circle cx="100" cy="100" r="7" fill="#1B2440"/></svg>';
  }
  function gridSvg(v) {
    var s = 40, rows = v.rows || 4, cols = v.cols || 5, on = {};
    (v.cells || []).forEach(function (c) { on[c[0] + ',' + c[1]] = 1; });
    var o = '<svg viewBox="0 0 ' + (cols * s + 20) + ' ' + (rows * s + 20) + '" width="' + (cols * s + 20) * 1.2 + '" role="img" aria-label="A grid of squares with a coloured shape">';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
      o += '<rect x="' + (10 + c * s) + '" y="' + (10 + r * s) + '" width="' + s + '" height="' + s + '" fill="' + (on[r + ',' + c] ? '#FFC43D' : '#FFFFFF') + '" stroke="#8A97B4" stroke-width="1.5"/>';
    return o + '</svg>';
  }
  function iconSvg(icon, size) {
    if (icon === 'star') return star(size);
    if (icon === 'ball') return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#FB923C" stroke="#C2410C" stroke-width="1.4"/><path d="M3.5 10 C8 12 16 12 20.5 10 M12 3 C9 8 9 16 12 21" stroke="#C2410C" stroke-width="1.2" fill="none"/></svg>';
    return '<svg viewBox="0 0 120 56" width="' + Math.round(size * 1.6) + '" height="' + Math.round(size * 0.75) + '" aria-hidden="true"><path d="M6 40 L16 28 L46 24 L60 12 L84 12 L96 25 L112 29 L115 41 L6 41 Z" fill="#D62839"/><path d="M63 15 L82 15 L90 24 L58 24 Z" fill="#BFE3FF"/><circle cx="30" cy="42" r="10" fill="#1B2440"/><circle cx="94" cy="42" r="10" fill="#1B2440"/></svg>';
  }
  function dotsHtml(v) {
    var n = Math.max(0, Math.min(30, v.n || 0)), out = '<div style="display:flex;flex-direction:column;gap:8px;align-items:center" role="img" aria-label="' + n + ' pictures to count">';
    for (var r = 0; r < Math.ceil(n / 5); r++) {
      out += '<div style="display:flex;gap:10px">';
      for (var i = r * 5; i < Math.min(n, r * 5 + 5); i++) out += iconSvg(v.icon || 'star', 34);
      out += '</div>';
    }
    return out + '</div>';
  }
  function blocksHtml(v) {
    var n = Math.max(0, Math.min(40, v.n || 0)), take = v.take || 0, add = v.add || 0;
    var cells = [];
    if (v.frame) {
      for (var f = 0; f < v.frame; f++) cells.push(f < n ? 't' : 'e');
    } else {
      for (var i = 0; i < n; i++) cells.push(i < 10 ? 't' : 'o');
      for (var k = 0; k < take && k < n; k++) cells[n - 1 - k] = 'x';
      for (var a = 0; a < add; a++) cells.push('a');
    }
    var out = '<div class="blocks" role="img" aria-label="Counting blocks">';
    for (var r = 0; r < cells.length; r += 10) {
      out += '<div class="row">';
      cells.slice(r, r + 10).forEach(function (c) { out += '<i class="' + c + '"></i>'; });
      out += '</div>';
    }
    return out + '</div>';
  }
  function shapeSvg(name) {
    var pts = { triangle: '60,10 110,100 10,100', square: '15,15 105,15 105,105 15,105', rectangle: '5,25 115,25 115,95 5,95',
      pentagon: '60,8 112,46 92,106 28,106 8,46', hexagon: '35,10 85,10 112,58 85,106 35,106 8,58' };
    var o = '<svg viewBox="0 0 120 116" width="150" height="145" role="img" aria-label="A ' + esc(name) + '">';
    if (name === 'circle') o += '<circle cx="60" cy="58" r="50" fill="#BFE3FF" stroke="#1D4ED8" stroke-width="4"/>';
    else o += '<polygon points="' + (pts[name] || pts.square) + '" fill="#BFE3FF" stroke="#1D4ED8" stroke-width="4" stroke-linejoin="round"/>';
    return o + '</svg>';
  }
  function safeSvg(svg) {
    var s = String(svg || '');
    if (!/^\s*<svg[\s>]/i.test(s) || /<script|on\w+\s*=|javascript:|<foreignObject|href\s*=/i.test(s)) return '';
    return s;
  }
  function visual(v) {
    if (!v) return '';
    if (v.type === 'clock') return '<div class="visual">' + clockSvg(v.h, v.m) + '</div>';
    if (v.type === 'grid') return '<div class="visual">' + gridSvg(v) + '</div>';
    if (v.type === 'dots') return '<div class="visual">' + dotsHtml(v) + '</div>';
    if (v.type === 'blocks') return '<div class="visual">' + blocksHtml(v) + '</div>';
    if (v.type === 'shape') return '<div class="visual">' + shapeSvg(v.name) + '</div>';
    if (v.type === 'svg') return '<div class="visual">' + safeSvg(v.svg) + '</div>';
    if (v.type === 'draw' && window.MusaGen && MusaGen.draw && MusaGen.draw[v.kind]) { try { return '<div class="visual">' + safeSvg(MusaGen.draw[v.kind].apply(null, v.args || [])) + '</div>'; } catch (e) { return ''; } }
    return '';
  }

  /* ---------- screens ---------- */
  function renderPicker() {
    var h = '<div class="picker"><h1 class="display">Who’s driving today?</h1><div class="drivers">';
    ['musa', 'essa'].forEach(function (c) {
      h += '<button class="driver-car" data-driver="' + c + '" aria-label="' + KIDS[c].name + '">' + car(300, true, KIDS[c].name.toUpperCase(), c) +
        '<div class="strip"><span>Tap to drive</span></div></button>';
    });
    h += '</div><p class="hint">This device remembers who drove last time.</p></div>';
    app.innerHTML = h;
  }

  function renderLock(setup) {
    var name = K().name;
    var h = '<div class="lock"><button class="icon-btn" data-go="picker" style="align-self:flex-start">Not ' + name + '?</button>';
    h += '<div class="lock-head">' + car(190, false, name.toUpperCase()) + '<h1 class="display">Hi ' + name + '!</h1>';
    h += setup ? '<p>Choose your secret picture.<br>Don’t tell anyone!</p>' : '<p>Tap your secret picture.</p>';
    h += '</div><div class="pics">';
    PICS.forEach(function (p) {
      var cls = setup ? (setPick === p ? ' on' : '') : (lockPick === p ? (lockMsg === 'good' ? ' ok' : ' on') : '');
      h += '<button class="pic' + cls + '" data-pic="' + p + '" aria-label="' + p + '">' + picSvg(p, 58) + '</button>';
    });
    h += '</div>';
    if (setup && setPick) h += '<div class="msg good">Great choice! Tap it one more time to keep it.</div>';
    if (!setup && lockMsg === 'mid') h += '<div class="msg mid">Hmm, not that one. Try again!</div>';
    if (lockMsg === 'wait') h += '<div class="msg mid">Checking…</div>';
    if (lockMsg === 'offline') h += '<div class="msg mid">The internet is not working. Ask a grown-up to check it.</div>';
    h += '</div>';
    app.innerHTML = h;
  }

  function header() {
    return '<div class="top"><div class="brand">' + car(86, false, K().name.toUpperCase()) + '<div><div class="brand-small">' + K().name + '’s Maths</div><div class="display brand-big">Grand Prix</div></div></div>' +
      '<div class="top-btns"><button class="icon-btn" data-go="mute" aria-label="' + (L.mute ? 'Turn sound on' : 'Turn sound off') + '">' + (L.mute ? muteIcon() : speakerIcon()) + '</button>' +
      '<button class="icon-btn" data-go="picker">Switch driver</button></div></div>';
  }

  function renderHome() {
    var d = doneMap(), n = totalRaces(), todayDone = !!d[0], allDone = true;
    for (var i = 0; i < n; i++) if (!d[i]) allDone = false;
    var seq = !!plan.sequential, nextIdx = -1;
    if (seq) { for (var si = 0; si < n; si++) if (!d[si]) { nextIdx = si; break; } }
    var trophies = 0;
    if (plan.map) Object.keys(plan.map).forEach(function (k) { if (plan.map[k] === 'mastered') trophies++; });
    var phaseTag = plan.phase === 'checkup' ? 'QUALIFYING' : 'GRAND PRIX';
    var h = header();
    h += '<div class="stats">' +
      '<div class="stat"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 3 L4 21 M16 3 L20 21" stroke="#1B2440" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12 5 V8 M12 11 V14 M12 17 V20" stroke="#E0A100" stroke-width="2" stroke-linecap="round"/></svg><div><b>' + daysTotal() + '</b><span>days on the road</span></div></div>' +
      '<div class="stat">' + star(28) + '<div><b>' + starsTotal() + '</b><span>stars</span></div></div>' +
      '<div class="stat"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M7 3 H17 V9 A5 5 0 0 1 7 9 Z" fill="#FFC43D" stroke="#B88400" stroke-width="1.2"/><path d="M7 5 H4 A3 3 0 0 0 7 10 M17 5 H20 A3 3 0 0 1 17 10" fill="none" stroke="#B88400" stroke-width="1.5"/><path d="M12 14 V18 M8 21 H16" stroke="#B88400" stroke-width="2" stroke-linecap="round"/></svg><div><b>' + trophies + '</b><span>trophies</span></div></div></div>';
    var title = allDone ? 'All 20 races done!' : (todayDone ? 'Today’s race done!' : esc(plan.headline || 'Today’s race is ready!'));
    var msg = allDone ? 'Amazing driving. Keep racing for even more laps!' : (todayDone ? 'Great driving. More races are open if you want them.' : esc(plan.message || 'Just do your best.'));
    if (seq) { title = allDone ? 'All races done!' : 'Next: ' + esc((plan.races[nextIdx] || {}).title || ('Race ' + (nextIdx + 1))); msg = allDone ? 'Amazing driving. Keep racing for even more laps!' : esc(plan.message || 'Just do your best.'); }
    h += '<section class="today"><div class="today-row"><div style="display:flex;flex-direction:column;gap:6px;min-width:0;flex:1 1 260px"><span class="tag">' + phaseTag + ' · DAY ' + (plan.day || 1) + '</span>' +
      '<h2 class="display">' + title + '</h2><p>' + msg + '</p></div>' +
      ((seq ? allDone : todayDone) ? '' : '<button class="go-btn" data-race="' + (seq ? nextIdx : 0) + '" style="margin-top:12px"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4 L20 12 L7 20 Z" fill="#1B2440"/></svg>' + (isEssa() ? 'Go!' : 'Start engine') + '</button>') +
      '</div><div class="road"><div class="tarmac"></div><div class="dash"></div>' + car(140, true, isEssa() ? 'ESSA' : '') + '<div class="pole"></div><div class="flag"></div></div></section>';
    if (allDone) h += '<button class="go-btn keep" data-go="keep">Keep racing</button>';
    if (plan.show_lesson_picker && !isEssa()) h += renderStudied();
    if (seq) {
      h += '<section class="sec"><div class="sec-head"><h3 class="display">Your races</h3><span>One after another. Each one opens the next.</span></div><div class="bonus">';
      for (var sb = 0; sb < n; sb++) {
        var sdone = !!d[sb], snext = sb === nextIdx, slab = sdone ? 'Done' : (snext ? 'Next' : 'Locked');
        h += '<button class="' + (sdone ? 'done' : (snext ? '' : 'locked')) + '"' + (snext ? ' data-race="' + sb + '"' : ' disabled') + ' aria-label="Race ' + (sb + 1) + ' ' + slab + '">' + (sdone ? star(26) : (snext ? flagIcon() : lockIcon())) + '<b>' + (sb + 1) + '</b><small>' + slab + '</small></button>';
      }
      h += '</div></section>';
    } else {
    h += '<section class="sec"><div class="sec-head"><h3 class="display">More races</h3><span>' + (todayDone ? 'Feeling fast? Pick a race!' : 'Finish today’s race to open them') + '</span></div><div class="bonus">';
    for (var b = 1; b < n; b++) {
      var cls = !todayDone ? 'locked' : (d[b] ? 'done' : '');
      var lab = !todayDone ? 'Locked' : (d[b] ? 'Done' : 'Ready');
      h += '<button class="' + cls + '"' + (todayDone && !d[b] ? ' data-race="' + b + '"' : ' disabled') + ' aria-label="Race ' + (b + 1) + ' ' + lab + '">' + (todayDone ? (d[b] ? star(26) : flagIcon()) : lockIcon()) + '<b>' + (b + 1) + '</b><small>' + lab + '</small></button>';
    }
    h += '</div></section>';
    }
    h += '<section class="sec"><div class="sec-head"><h3 class="display">' + (isEssa() ? 'Number road' : 'Grand Prix map') + '</h3><span>' + (isEssa() ? 'Every stop is something to learn' : 'Every chapter is a checkpoint') + '</span></div><div class="map">';
    for (var row = 0; row < 2; row++) {
      h += '<div class="map-row">';
      for (var k = row * 8 + 1; k <= row * 8 + 8; k++) {
        var st = plan.map && plan.map[k] ? plan.map[k] : (k <= K().defaultMapUpTo ? 'qualifying' : 'coming');
        var cl = st === 'mastered' ? 'm' : (st === 'qualifying' || st === 'learning' ? 'q' : 'c');
        h += '<div class="cp"><i class="' + cl + '">' + k + '</i><small>' + K().short[k] + '</small></div>';
      }
      h += '</div>';
    }
    h += '<div class="legend"><span><i style="background:#FFC43D"></i>' + (plan.phase === 'checkup' ? 'Qualifying now' : 'Practising') + '</span><span><i style="background:#2BB673"></i>Mastered</span><span><i style="background:#5A6588"></i>Coming up</span></div></div></section>';
    var stTot = starsTotal();
    h += '<section class="sec"><div class="sec-head"><h3 class="display">Garage upgrades</h3><span>Collect stars to unlock</span></div><div class="garage">';
    UPGRADES.forEach(function (u) {
      var ok = stTot >= u.need;
      var label = ok ? (u.key === 'blue' ? (L.paint[child] === 'blue' ? 'On · tap for red' : 'Unlocked · tap to paint') : 'Unlocked') : (u.need - stTot) + ' more stars';
      var open = (u.key === 'blue' && ok) ? '<button class="up" data-paint="1" style="cursor:pointer">' : '<div class="up">';
      h += open + '<div class="sw" style="' + u.sw + (ok ? '' : ';opacity:.35') + '"></div><b>' + u.name + '</b><small class="' + (ok ? 'ok' : '') + '">' + label + '</small>' + ((u.key === 'blue' && ok) ? '</button>' : '</div>');
    });
    h += '</div></section>';
    app.innerHTML = h;
  }

  function renderStudied() {
    var h = '<section class="studied"><h3 class="display">What did you study today?</h3>';
    if (studiedSent) return h + '<p>Thanks! Your pit crew will plan tomorrow’s race around it.</p></section>';
    h += '<p>Tap the chapter, then the lesson. Your pit crew uses this to plan tomorrow’s race.</p><div class="pick-grid">';
    for (var c = 1; c <= 16; c++) h += '<button class="pick' + (pickCh === c ? ' on' : '') + '" data-pickch="' + c + '" aria-label="Chapter ' + c + ' ' + KIDS.musa.ch[c] + '">' + c + '</button>';
    h += '</div>';
    if (pickCh) {
      h += '<div class="display" style="font-size:20px">' + pickCh + '. ' + KIDS.musa.ch[pickCh] + '</div><div class="pick-grid lessons">';
      LESSONS_MUSA[pickCh].forEach(function (t, i) {
        var letter = String.fromCharCode(65 + i);
        h += '<button class="pick lesson' + (pickLesson === letter ? ' on' : '') + '" data-picklesson="' + letter + '">' + letter + '. ' + esc(t) + '</button>';
      });
      h += '</div><button class="go-btn" data-go="studied"' + (pickLesson ? '' : ' disabled') + ' style="align-self:flex-start">Tell my pit crew</button>';
    }
    return h + '</section>';
  }

  function questionHtml(q) {
    var t = String(q.q);
    var m = t.match(/^\s*(\d+|□)\s*([+−])\s*(\d+|□)\s*=\s*(\?|□|\d+)\s*$/);
    if (isEssa() && m) {
      var part = function (x) { return x === '□' || x === '?' ? '<span class="box" aria-label="missing number"></span>' : '<span class="n">' + esc(x) + '</span>'; };
      var minus = m[2] === '−';
      var op = '<span class="opbox"><span class="opc ' + (minus ? 'minus' : 'plus') + '">' + (minus ? MINUS : '+') + '</span><small class="' + (minus ? 'minus' : 'plus') + '">' + (minus ? 'take away' : 'add') + '</small></span>';
      var rhs = m[4] === '?' ? '' : '<span class="n">=</span>' + part(m[4]);
      return '<div class="eq" aria-label="' + esc(speakable(q)) + '">' + part(m[1]) + op + part(m[3]) + rhs + '</div>';
    }
    var safe = esc(t).replace(/ − /g, ' <span class="op minus">' + MINUS + '</span> ').replace(/ \+ /g, ' <span class="op plus">+</span> ');
    return '<p class="qtext">' + safe + '</p>';
  }

  function renderRace() {
    var qs = raceObj.questions, q = qs[qi], total = qs.length;
    var pct = (qi / total) * 100;
    var label = race >= 100 ? 'Keep racing' : (race === 0 ? (plan.phase === 'checkup' ? 'Qualifying race' : 'Today’s race') : 'Race ' + (race + 1));
    if (plan.sequential && race < 100 && raceObj.title) label = esc(raceObj.title);
    var h = '<div class="race-top"><button class="icon-btn" data-go="home"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5 L8 12 L15 19" stroke="#1B2440" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>Garage</button>' +
      '<div class="display">' + label + '</div><button class="icon-btn" data-go="mute" aria-label="' + (L.mute ? 'Turn sound on' : 'Turn sound off') + '">' + (L.mute ? muteIcon() : speakerIcon()) + '</button></div>';
    h += '<div class="track"><div class="dash"></div><div class="pole"></div><div class="flag"></div><div id="carwrap" style="left:calc(8px + ' + pct + '% * 0.74)">' + car(104, true, isEssa() ? 'ESSA' : '') + '</div></div>';
    h += '<div class="qcard"><div class="q-head"><span class="chip">' + esc(K().ch[q.ch] || '') + '</span><button class="say-btn" data-go="say">' + speakerIcon() + 'Read to me</button></div>' + questionHtml(q) + visual(q.vis);
    var locked = fbState === 'good' || fbState === 'shown';
    if (q.t === 'mc') {
      h += '<div class="opts' + (q.o.length === 2 ? ' two-up' : '') + '">';
      q.o.forEach(function (o, i) {
        var cls = answer === o ? (fbState === 'good' ? ' right' : ' on') : (fbState === 'shown' && o === q.a ? ' right' : '');
        h += '<button class="opt' + (o.length > 8 ? ' long' : '') + cls + '" data-opt="' + i + '"' + (locked ? ' disabled' : '') + '>' + esc(o) + '</button>';
      });
      h += '</div>';
      if (!fbState) h += '<p class="hint">Take your time. Tap the one you think is right.</p>';
    } else {
      var scls = fbState === 'good' ? ' ok' : (fbState === 'try' || fbState === 'shown' ? ' no' : '');
      h += '<div class="entry"><div class="screen' + scls + '" aria-live="polite">' + (answer ? esc(answer) + (q.unit ? '<span class="unit">' + esc(q.unit) + '</span>' : '') : '<span class="ph">Tap the numbers</span>') + '</div>';
      if (!locked && fbState !== 'try') {
        h += '<div class="pad">';
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (d) { h += '<button class="key" data-key="' + d + '">' + d + '</button>'; });
        h += '<button class="key fn" data-key="clear">Clear</button><button class="key" data-key="0">0</button><button class="key fn" data-key="del" aria-label="Delete last digit">⌫ Back</button></div>';
        if (q.neg) h += '<button class="key fn" data-key="neg" style="width:min(100%,360px)">' + MINUS + ' minus sign</button>';
      }
      h += '</div>';
    }
    h += '</div>';
    if (fbState === 'good') {
      h += '<div class="fb good"><div class="stars">' + star(40) + star(54) + star(40) + '</div><h3 class="display">' + esc(lastCheer) + '</h3><p>' + esc(sentence(q)) + '</p><button class="go-btn next" data-go="advance">Next lap</button></div>';
    } else if (fbState === 'try') {
      h += '<div class="fb try"><h3 class="display">Nearly! Try again.</h3>' + (q.hint ? '<p>' + esc(q.hint) + '</p>' : '') + visual(q.hint_vis) +
        '<button class="go-btn next" data-go="retry">Try again</button></div>';
    } else if (fbState === 'shown') {
      h += '<div class="fb try"><h3 class="display">Good try, Essa!</h3><p>' + esc(sentence(q)) + '</p><p style="color:var(--ink-soft);font-size:16px">We will race this one again soon.</p><button class="go-btn next" data-go="advance">Next lap</button></div>';
    } else {
      var btn = feedbackNow() ? 'Check' : (qi === total - 1 ? 'Cross the finish line' : 'Zoom ahead');
      h += '<button class="go-btn next" data-go="next"' + (answer ? '' : ' disabled') + '>' + btn + ' <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M5 12 H18 M13 6 L19 12 L13 18" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    }
    app.innerHTML = h;
  }
  var lastCheer = '';
  function autoHint(q) {
    if (q.hint) return q;
    var t = String(q.q), m, a, b;
    if ((m = t.match(/^\s*(\d+)\s*\+\s*(\d+)\s*=\s*\?\s*$/))) {
      a = +m[1]; b = +m[2];
      q.hint = 'Start at ' + a + '. Count on ' + b + ' more.'; q.hint_vis = q.hint_vis || { type: 'blocks', n: a, add: b };
    } else if ((m = t.match(/^\s*(\d+)\s*−\s*(\d+)\s*=\s*\?\s*$/))) {
      a = +m[1]; b = +m[2];
      if (a > 10 && b > 10) q.hint = 'Take away 10 first: ' + a + ' ' + MINUS + ' 10 = ' + (a - 10) + '. Then take away ' + (b - 10) + ' more.';
      else if (a > 10 && b > a - 10 && a - 10 > 0) q.hint = 'First take away ' + (a - 10) + ' to get to 10. Then take away ' + (b - (a - 10)) + ' more.';
      else q.hint = 'Start at ' + a + '. Take away ' + b + '.';
      if (a <= 40) q.hint_vis = q.hint_vis || { type: 'blocks', n: a, take: b };
    } else if ((m = t.match(/^\s*(\d+)\s*\+\s*□\s*=\s*(\d+)\s*$/))) {
      a = +m[1]; b = +m[2];
      q.hint = 'Count on from ' + a + ' up to ' + b + '.';
      if (b === 10) { q.hint = 'Count the empty boxes.'; q.hint_vis = q.hint_vis || { type: 'blocks', n: a, frame: 10 }; }
    } else if (q.vis && q.vis.type === 'dots') {
      q.hint = 'Touch each one as you count.';
    } else if (/comes after/.test(t)) { q.hint = 'Count on one more.'; }
    else if (/comes before/.test(t)) { q.hint = 'Count back one.'; }
    else if (/bigger|more\?/i.test(t)) { q.hint = 'The bigger number comes later when you count.'; }
    else if (/smallest/i.test(t)) { q.hint = 'The smallest number comes first when you count.'; }
    else if (q.vis && q.vis.type === 'clock') { q.hint = 'The short hand shows the hour.'; }
    else if (/comes next/i.test(t)) { q.hint = 'Look at how much the numbers go up each time.'; }
    else { q.hint = 'Read it again slowly. You can tap Read to me.'; }
    return q;
  }
  function sentence(q) {
    var m = String(q.q).match(/^\s*(\d+)\s*([+−])\s*(\d+)\s*=\s*\?\s*$/);
    if (m) return m[1] + ' ' + (m[2] === '+' ? 'add' : 'take away') + ' ' + m[3] + ' is ' + q.a + '.';
    return 'The answer is ' + q.a + (q.unit ? ' ' + q.unit : '') + '.';
  }

  function norm(s) { return String(s).replace(/\s/g, '').replace(/−/g, '-').replace(/,/g, '').replace(/^0+(?=\d)/, '').toLowerCase(); }
  function isRight(q, given) { return q.t === 'mc' ? given === q.a : norm(given) === norm(q.a); }

  function scoreCheer(right, total) {
    var p = total ? right / total : 0, nm = K().name;
    if (p >= 0.9) return 'Top speed today, ' + nm + '!';
    if (p >= 0.7) return 'Great driving, ' + nm + '!';
    if (p >= 0.5) return 'Good race, ' + nm + '! Your car is getting faster.';
    return 'Well done for finishing, ' + nm + '! Every race makes your car faster.';
  }

  /* confetti burst over the finish screen */
  function celebrate() {
    try {
      var old = document.getElementById('confetti'); if (old) old.remove();
      var cv = document.createElement('canvas'); cv.id = 'confetti';
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50';
      document.body.appendChild(cv);
      var dpr = Math.min(window.devicePixelRatio || 1, 2), W = window.innerWidth, H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      var x = cv.getContext('2d'); x.scale(dpr, dpr);
      var cols = ['#E63946', '#FFC43D', '#2BB673', '#3A86FF', '#FF7AB6', '#FFFFFF', '#1B2440'];
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var N = reduce ? 40 : 160, bits = [];
      for (var i = 0; i < N; i++) {
        var left = i % 2 === 0;
        bits.push({ x: left ? -10 : W + 10, y: H * (0.55 + Math.random() * 0.3),
          vx: (left ? 1 : -1) * (4 + Math.random() * 7), vy: -(9 + Math.random() * 9),
          w: 7 + Math.random() * 7, h: 10 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
          c: cols[i % cols.length], d: Math.random() * 18 });
      }
      var t0 = performance.now();
      (function frame(now) {
        var el = now - t0; if (!document.getElementById('confetti')) return;
        x.clearRect(0, 0, W, H);
        x.globalAlpha = el > 3200 ? Math.max(0, 1 - (el - 3200) / 600) : 1;
        bits.forEach(function (b) {
          if (b.d > 0) { b.d--; return; }
          b.vy += 0.32; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.r += b.vr;
          x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.scale(1, Math.cos(b.r * 2));
          x.fillStyle = b.c; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); x.restore();
        });
        if (el < 3800) requestAnimationFrame(frame); else cv.remove();
      })(t0);
    } catch (e) {}
  }
  var FLAG = '<svg class="wflag" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><rect x="8" y="6" width="4" height="54" rx="2" fill="#1B2440"/><g class="cloth"><rect x="12" y="8" width="44" height="30" fill="#FFFFFF" stroke="#1B2440" stroke-width="2"/>' +
    [0, 1, 2].map(function (r) { return [0, 1, 2, 3].map(function (cc) { return (r + cc) % 2 ? '' : '<rect x="' + (12 + cc * 11) + '" y="' + (8 + r * 10) + '" width="11" height="10" fill="#1B2440"/>'; }).join(''); }).join('') + '</g></svg>';

  function renderFinish() {
    var f = lastFinish, d = doneMap(), more = -1, n = totalRaces();
    for (var b = 1; b < n; b++) if (!d[b]) { more = b; break; }
    var h = '<div class="checker"></div><h1 class="display finish-title">' + FLAG + 'Race finished!' + FLAG + '</h1>';
    var saveLine = saveState === 'saved' ? 'Saved for your pit crew' : (saveState === 'saving' ? 'Sending to your pit crew…' : 'Will send to your pit crew when the internet is back');
    var right = f.items.filter(function (i) { return i.ok; }).length, total = f.items.length;
    var showScore = plan.phase !== 'checkup';
    h += '<p class="finish-sub"><b class="display" style="display:block;font-size:40px;color:#1B2440;margin-bottom:6px">' + right + ' out of ' + total + '</b>' + (showScore ? 'laps were perfect.' : esc(scoreCheer(right, total))) + '</p>';
    h += '<div class="road" style="margin:0;height:150px;background:#2D3550;border-radius:26px;overflow:hidden"><div class="dash" style="bottom:40px"></div><div style="position:absolute;top:0;bottom:0;right:120px;width:32px;background:repeating-conic-gradient(#FFFFFF 0 25%,#1B2440 0 50%) 0 0/16px 16px"></div><div class="victory" style="position:absolute;right:70px;bottom:26px">' + car(190, true, K().name.toUpperCase()) + '</div></div>';
    h += '<div class="prize"><div class="stars">' + star(58) + star(58) + star(58) + '</div><h2 class="display">You earned 3 stars!</h2>' +
      (plan.phase === 'checkup' ? '<p>Your pit crew is studying this race so they can tune your car for the next one.</p>' : '') + '<span class="saved">' + saveLine + '</span></div>';
    if (showScore && !isEssa()) {
      f.items.filter(function (i) { return !i.ok; }).slice(0, 2).forEach(function (w, wi) {
        var q = w.q;
        h += '<div class="tip"><h3 class="display">Pit crew tip</h3><div class="qa"><div style="background:#EEF6FF"><small>THE QUESTION</small><b>' + esc(q.q) + '</b></div>' +
          '<div style="background:#FFF4D6"><small>YOU SAID</small><b>' + esc(w.given) + (q.unit ? ' ' + esc(q.unit) : '') + '</b></div>' +
          '<div style="background:#E3F6EC"><small>THE ANSWER</small><b>' + esc(q.a) + (q.unit ? ' ' + esc(q.unit) : '') + '</b></div></div>';
        if (q.steps && q.steps.length) q.steps.forEach(function (s, i) { h += '<div class="step"><i>' + (i + 1) + '</i><div>' + esc(s) + '</div></div>'; });
        if (q.try && q.try.q) {
          var ts = tryState[wi] || {};
          h += '<div class="try"><div class="display" style="font-size:22px">Your turn: ' + esc(q.try.q) + '</div><div class="try-row">';
          (q.try.o || []).forEach(function (o, oi) { h += '<button class="opt' + (ts.pick === o ? ' on' : '') + '" data-try="' + wi + ':' + oi + '">' + esc(o) + '</button>'; });
          h += '</div>';
          if (ts.pick) h += '<div class="result ' + (ts.pick === q.try.a ? 'good">Spot on! ' : 'mid">Nearly! The answer is ' + esc(q.try.a) + '. ') + esc(q.try.why || '') + '</div>';
          h += '</div>';
        }
        h += '</div>';
      });
    }
    if (showScore) {
      var byCh = {};
      f.items.forEach(function (i) { var c = i.q.ch; byCh[c] = byCh[c] || { n: 0, r: 0 }; byCh[c].n++; if (i.ok) byCh[c].r++; });
      var best = Object.keys(byCh).filter(function (c) { return byCh[c].n >= 2 && byCh[c].r === byCh[c].n; });
      if (best.length) h += '<div class="strong"><svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" style="flex-shrink:0"><circle cx="12" cy="12" r="10" fill="#177A45"/><path d="M7 12.5 L10.5 16 L17 9" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><div><b>Super fast today</b>' + esc(K().ch[best[0]]) + ': every lap perfect!</div></div>';
    }
    h += '<div class="fact"><svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" style="flex-shrink:0"><circle cx="12" cy="12" r="9" fill="none" stroke="#1B2440" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#1B2440"/><path d="M12 3 V9 M12 15 V21 M3 12 H9 M15 12 H21" stroke="#1B2440" stroke-width="2"/></svg><div><b>Pit lane fact</b>' + FACTS[(f.race + (plan.day || 1) * 3) % FACTS.length] + '</div></div>';
    var nextBtn = more > 0 ? '<button class="go-btn" data-race="' + more + '">Next race</button>' : '<button class="go-btn" data-go="keep">Keep racing</button>';
    h += '<div class="two"><button class="plain-btn" data-go="home">Back to garage</button>' + nextBtn + '</div>';
    app.innerHTML = h;
  }

  function pitCarSvg(kind) {
    var s = '<svg viewBox="0 0 160 90" width="260" height="146" aria-hidden="true">';
    s += '<rect x="0" y="74" width="160" height="16" fill="#3C4566"/>';
    if (kind === 'hot') s += '<circle class="steam" cx="108" cy="22" r="7" fill="#DCE4F5"/><circle class="steam s2" cx="118" cy="16" r="9" fill="#DCE4F5"/><circle class="steam s3" cx="100" cy="12" r="6" fill="#DCE4F5"/>';
    s += '<g transform="translate(18,24)"><rect x="4" y="16" width="16" height="5" rx="2" fill="#0B1226"/><rect x="10" y="20" width="4" height="12" fill="#0B1226"/>' +
      '<path d="M6 40 L16 28 L46 24 L60 12 L84 12 L96 25 L112 29 L115 41 L6 41 Z" fill="#D62839"/><path d="M63 15 L82 15 L90 24 L58 24 Z" fill="#BFE3FF"/>';
    if (kind === 'mud') s += '<circle cx="40" cy="34" r="4" fill="#7A4A1F"/><circle cx="70" cy="30" r="3" fill="#7A4A1F"/><circle cx="90" cy="35" r="5" fill="#7A4A1F"/><circle cx="56" cy="37" r="2.5" fill="#7A4A1F"/>';
    s += '<circle cx="30" cy="42" r="10" fill="#0B1226"/><circle cx="30" cy="42" r="4" fill="#FFC43D"/>';
    if (kind === 'tyre') s += '<ellipse cx="94" cy="46" rx="12" ry="6" fill="#0B1226"/>';
    else s += '<circle cx="94" cy="42" r="10" fill="#0B1226"/><circle cx="94" cy="42" r="4" fill="#FFC43D"/>';
    s += '</g>';
    if (kind === 'fuel') s += '<g transform="translate(118,6)"><rect width="36" height="22" rx="5" fill="#FFFFFF"/><path d="M6 17 A12 12 0 0 1 30 17" stroke="#1B2440" stroke-width="2" fill="none"/><line x1="18" y1="17" x2="8" y2="12" stroke="#D62839" stroke-width="3" stroke-linecap="round"/><text x="5" y="10" font-size="7" font-family="Nunito, sans-serif" font-weight="800" fill="#D62839">E</text></g>';
    if (kind === 'lunch') s += '<g transform="translate(124,40)"><rect x="0" y="12" width="28" height="4" rx="2" fill="#B88400"/><circle cx="14" cy="8" r="8" fill="#FFC43D"/><path d="M6 8 H22" stroke="#B88400" stroke-width="2"/></g>';
    if (kind === 'mud') s += '<circle cx="134" cy="30" r="5" fill="#BFE3FF" opacity=".8"/><circle cx="144" cy="20" r="4" fill="#BFE3FF" opacity=".8"/><circle cx="128" cy="16" r="3" fill="#BFE3FF" opacity=".8"/>';
    return s + '</svg>';
  }
  function renderPit() {
    var p = play || {};
    var idx = Math.abs(Math.floor((p.locked_until || 0) / 60000)) % PITS.length;
    var pit = PITS[idx], idea = IDEAS[(idx + (plan ? plan.day || 0 : 0)) % IDEAS.length];
    var left = Math.max(0, (p.locked_until || 0) - Date.now());
    var hh = Math.floor(left / 3600000), mm = Math.ceil((left % 3600000) / 60000);
    if (mm === 60) { hh++; mm = 0; }
    var wait = (hh ? hh + ' h ' : '') + mm + ' min';
    var parent = p.reason === 'parent';
    var h = '<div class="pit"><div class="top"><div class="brand">' + car(70, false, K().name.toUpperCase()) + '<div class="display" style="font-size:24px">' + K().name + '’s pit stop</div></div><button class="icon-btn" data-go="picker">Switch driver</button></div>';
    h += '<div class="pit-card">' + pitCarSvg(parent ? 'lunch' : pit.key) + '<h1 class="display">' + (parent ? 'The garage is closed for now.' : pit.title) + '</h1><p>' + (parent ? 'Your pit crew says it is time for a break.' : pit.text) + '</p>' +
      '<div class="pit-time">Back on the road at ' + esc(p.back_at || '') + '</div><p style="font-size:16px">That is in about ' + wait + '.</p></div>';
    h += '<div class="pit-idea">' + star(40) + '<div><b>While you wait</b>' + idea + '</div></div></div>';
    app.innerHTML = h;
  }

  function renderError(msg) {
    app.innerHTML = '<div class="loading">' + car(160) + '<div class="display">' + msg + '</div><p class="hint">Check the internet, then try again.</p><button class="go-btn" data-go="reload">Try again</button><button class="small-link" data-go="picker">Switch driver</button></div>';
  }

  function render() {
    if (view === 'picker') renderPicker();
    else if (view === 'lock') renderLock(false);
    else if (view === 'setpic') renderLock(true);
    else if (view === 'home') renderHome();
    else if (view === 'race') renderRace();
    else if (view === 'finish') renderFinish();
    else if (view === 'pit') renderPit();
  }
  function goView(v) { view = v; render(); window.scrollTo(0, 0); }

  /* ---------- races ---------- */
  function buildRace(i) {
    if (i < plan.races.length) return plan.races[i];
    var seed = child + '-' + plan.plan_id + '-' + i;
    return { title: i >= 100 ? 'Keep racing' : 'Race ' + (i + 1), generated: true, questions: MusaGen.makeRace(child, seed, qpr(), plan.practice) };
  }
  function startRace(n) {
    if (play && play.locked && play.locked_until > Date.now()) { goView('pit'); return; }
    race = n; raceObj = buildRace(n); qi = 0; answer = ''; pending = []; tries = 0; fbState = ''; qStart = Date.now();
    try { window.speechSynthesis.cancel(); } catch (e) {}
    stopCheer();
    sfx('start');
    goView('race');
  }
  function startKeep() {
    L.keep[child] = L.keep[child] || {};
    var k = (L.keep[child][plan.plan_id] || 0) + 1;
    L.keep[child][plan.plan_id] = k; save();
    startRace(99 + k);
  }
  function record(q, given) {
    pending.push({ id: q.id, given: given, seconds: Math.round((Date.now() - qStart) / 1000), q: q, ok: isRight(q, given) });
  }
  function advance() {
    qi++; answer = ''; tries = 0; fbState = ''; qStart = Date.now();
    if (qi >= raceObj.questions.length) { finishRace(true); return; }
    render();
    var w = document.getElementById('carwrap');
    if (w) {
      var tot = raceObj.questions.length, from = ((qi - 1) / tot) * 100, to = (qi / tot) * 100;
      w.style.transition = 'none'; w.style.left = 'calc(8px + ' + from + '% * 0.74)'; void w.offsetWidth;
      w.style.transition = ''; w.style.left = 'calc(8px + ' + to + '% * 0.74)';
    }
  }
  function next() {
    if (!answer) return;
    var q = raceObj.questions[qi];
    if (!feedbackNow()) { record(q, answer); sfx('whoosh'); advance(); return; }
    var ok = isRight(q, answer);
    if (tries === 0) record(q, answer);
    if (ok) {
      lastCheer = pickOne(CHEERS.essa); fbState = 'good'; sfx('ding');
      setTimeout(function () { say(lastCheer); }, 250);
    } else if (tries === 0) {
      autoHint(q);
      tries = 1; fbState = 'try'; sfx('boop');
      setTimeout(function () { say(pickOne(NEARLY) + (q.hint ? ' ' + q.hint : ''), true); }, 300);
    } else {
      fbState = 'shown'; sfx('boop');
      setTimeout(function () { say('Good try. ' + sentence(q)); }, 300);
    }
    render();
  }
  function packAnswers(list) {
    return list.map(function (p) {
      var o = { id: p.id, given: p.given, seconds: p.seconds };
      if (p.q.generated) o.q = { q: p.q.q, a: p.q.a, t: p.q.t, ch: p.q.ch, lesson: p.q.lesson };
      return o;
    });
  }
  function finishRace(complete) {
    var sid = child + '-' + plan.plan_id + '-r' + race + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (pending.length) {
      L.queue.push({ action: 'race', child: child, plan_id: plan.plan_id, phase: plan.phase, race: race, submission_id: sid, complete: complete, answers: packAnswers(pending) });
    }
    if (complete) {
      L.done[child] = L.done[child] || {};
      L.done[child][plan.plan_id] = (L.done[child][plan.plan_id] || []).concat([race]);
    }
    save();
    if (!complete) {
      saveState = 'saving';
      flushQueue().catch(function () {});
      pending = [];
      return;
    }
    lastFinish = { race: race, items: pending.slice() };
    tryState = {};
    saveState = 'saving';
    try { window.speechSynthesis.cancel(); } catch (e) {}
    sfx('cheer');
    goView('finish');
    celebrate();
    flushQueue().then(function () {
      saveState = 'saved';
      if (play && play.locked && play.locked_until > Date.now()) { showPit(); return; }
      if (view === 'finish') render();
    }).catch(function () { saveState = 'offline'; if (view === 'finish') render(); });
  }

  /* ---------- pit stop timer ---------- */
  function showPit() {
    if (view === 'race' && pending.length) finishRace(false);
    sfx('clunk');
    setTimeout(function () { say(play && play.reason === 'parent' ? 'Time for a break. The garage is closed for now.' : 'Oh no! Your car needs a pit stop.'); }, 400);
    goView('pit');
  }
  function applyPlay(p) {
    if (!p) return;
    play = p;
    if (p.locked && p.locked_until > Date.now()) {
      if (view === 'race' && fbState !== '' ) return;
      if (view !== 'pit' && view !== 'picker' && view !== 'lock' && view !== 'setpic') {
        if (view === 'finish') { goView('pit'); return; }
        showPit();
      }
    }
  }
  function tick() {
    if (!child || !plan || document.hidden) return;
    if (['home', 'race', 'finish'].indexOf(view) < 0) return;
    if (Date.now() - lastInteract > 120000) return;
    localActive += 60;
    apiPost({ action: 'tick', child: child, in_race: view === 'race' }).then(function (res) {
      localActive = 0;
      if (res && res.ok) applyPlay(res.play);
    }).catch(function () {
      var g = play ? play.grace_seconds : 1500;
      if (localActive >= g) {
        play = { locked: true, locked_until: Date.now() + ((play && play.rest_minutes) || 150) * 60000, back_at: '', reason: 'time' };
        var d = new Date(play.locked_until); play.back_at = d.getHours() % 12 + ':' + ('0' + d.getMinutes()).slice(-2);
        localActive = 0; showPit();
      }
    });
  }
  setInterval(tick, 60000);
  var pitChecks = 0;
  setInterval(function () {
    if (view !== 'pit' || !play) return;
    if (play.locked_until && play.locked_until <= Date.now()) { play.locked = false; openGarage(); return; }
    // every minute, ask the pit crew whether Dad has opened the garage
    if (!document.hidden && (++pitChecks % 2 === 0)) { openGarage(true); return; }
    render();
  }, 30000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && child && (view === 'pit' || view === 'home')) openGarage(true);
  });

  /* ---------- picker, lock, boot ---------- */
  function chooseDriver(c) {
    child = c; L.lastDriver = c; save();
    lockPick = ''; lockMsg = ''; setPick = '';
    if (unlocked[c]) { openGarage(); return; }
    plan = null; stats = null; play = null;
    app.innerHTML = '<div class="loading">' + car(160, false, KIDS[c].name.toUpperCase()) + '<div class="display">Warming up the engine…</div></div>';
    apiGet(c).then(function (res) {
      if (!res || !res.ok) throw new Error('no');
      gotPlan(res);
      goView(res.player && !res.player.has_picture ? 'setpic' : 'lock');
    }).catch(function () {
      var cached = readCache(c);
      if (cached && cached.plan) { plan = cached.plan; stats = cached.stats; play = cached.play; goView('lock'); }
      else renderError('The pit lane is out of reach');
    });
  }
  function gotPlan(res) {
    if (res.plan) plan = res.plan;
    stats = res.stats || stats; play = res.play || play;
    try { localStorage.setItem(KEY + '-cache-' + child, JSON.stringify({ plan: plan, stats: stats, play: play })); } catch (e) {}
  }
  function readCache(c) { try { return JSON.parse(localStorage.getItem(KEY + '-cache-' + c)); } catch (e) { return null; } }
  function openGarage(quiet) {
    if (!quiet) app.innerHTML = '<div class="loading">' + car(160, false, K().name.toUpperCase()) + '<div class="display">Warming up the engine…</div></div>';
    var c = child;
    flushQueue().catch(function () {}).then(function () { return apiGet(c); }).then(function (res) {
      if (c !== child) return;
      if (!res || !res.ok || !res.plan) throw new Error('no plan');
      gotPlan(res);
      if (play && play.locked && play.locked_until > Date.now()) goView('pit');
      else if (!quiet || view === 'pit') goView('home');
      else render();
    }).catch(function () {
      if (c !== child) return;
      if (plan) { if (!quiet) goView(play && play.locked && play.locked_until > Date.now() ? 'pit' : 'home'); }
      else renderError('The pit lane is out of reach');
    });
  }
  function hashPic(c, p) { var s = c + ':' + p + ':mc', h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h); }
  function tryPicture(p) {
    lockPick = p; lockMsg = 'wait'; render();
    apiPost({ action: 'login', child: child, pic: p }).then(function (res) {
      if (res && res.ok && res.match) {
        L.pics[child] = hashPic(child, p); save();
        unlocked[child] = true; lockMsg = 'good'; render(); sfx('ding');
        setTimeout(function () { if (play && play.locked && play.locked_until > Date.now()) goView('pit'); else goView('home'); }, 700);
      } else if (res && res.ok && res.needs_setup) {
        goView('setpic');
      } else { lockMsg = 'mid'; sfx('boop'); render(); }
    }).catch(function () {
      if (L.pics[child] && L.pics[child] === hashPic(child, p)) { unlocked[child] = true; goView('home'); }
      else if (L.pics[child]) { lockMsg = 'mid'; render(); }
      else { lockMsg = 'offline'; render(); }
    });
  }
  function setPicture(p) {
    if (setPick !== p) { setPick = p; sfx('whoosh'); render(); return; }
    apiPost({ action: 'login', child: child, pic: p, set: true }).then(function (res) {
      if (res && res.ok && res.match) {
        L.pics[child] = hashPic(child, p); save(); unlocked[child] = true; sfx('fanfare');
        goView('home');
      } else { setPick = ''; render(); }
    }).catch(function () { lockMsg = 'offline'; render(); });
  }

  app.addEventListener('click', function (e) {
    lastInteract = Date.now();
    ac();
    var t = e.target.closest('button');
    if (!t || t.disabled) return;
    if (t.hasAttribute('data-driver')) { chooseDriver(t.getAttribute('data-driver')); return; }
    if (t.hasAttribute('data-pic')) { if (view === 'setpic') setPicture(t.getAttribute('data-pic')); else tryPicture(t.getAttribute('data-pic')); return; }
    if (t.hasAttribute('data-race')) { startRace(parseInt(t.getAttribute('data-race'), 10)); return; }
    if (t.hasAttribute('data-opt')) {
      if (fbState === 'try') return;
      answer = raceObj.questions[qi].o[parseInt(t.getAttribute('data-opt'), 10)]; render(); return;
    }
    if (t.hasAttribute('data-key')) {
      var k = t.getAttribute('data-key');
      if (k === 'del') answer = answer.slice(0, -1);
      else if (k === 'clear') answer = '';
      else if (k === 'neg') answer = answer.charAt(0) === MINUS ? answer.slice(1) : MINUS + answer;
      else if (answer.replace(MINUS, '').length < 7) answer += k;
      render(); return;
    }
    if (t.hasAttribute('data-try')) {
      var parts = t.getAttribute('data-try').split(':'), wi = +parts[0], oi = +parts[1];
      var wq = lastFinish.items.filter(function (i) { return !i.ok; })[wi].q;
      tryState[wi] = { pick: wq.try.o[oi] }; render(); return;
    }
    if (t.hasAttribute('data-paint')) { L.paint[child] = L.paint[child] === 'blue' ? 'red' : 'blue'; save(); render(); return; }
    if (t.hasAttribute('data-pickch')) { pickCh = +t.getAttribute('data-pickch'); pickLesson = ''; render(); return; }
    if (t.hasAttribute('data-picklesson')) { pickLesson = t.getAttribute('data-picklesson'); render(); return; }
    var g = t.getAttribute('data-go');
    if (g === 'home') { if (view === 'race' && pending.length) finishRace(false); goView('home'); }
    else if (g === 'picker') { if (view === 'race' && pending.length) finishRace(false); try { window.speechSynthesis.cancel(); } catch (x) {} goView('picker'); }
    else if (g === 'next') next();
    else if (g === 'advance') advance();
    else if (g === 'retry') { answer = ''; fbState = ''; render(); }
    else if (g === 'say') say(speakable(raceObj.questions[qi]), isEssa());
    else if (g === 'mute') { L.mute = !L.mute; save(); if (L.mute) { try { window.speechSynthesis.cancel(); } catch (x) {} stopCheer(); } render(); }
    else if (g === 'keep') startKeep();
    else if (g === 'reload') { if (child) chooseDriver(child); else goView('picker'); }
    else if (g === 'studied') {
      L.queue.push({ action: 'studied', child: child, chapter: pickCh, lesson: pickLesson }); save();
      studiedSent = true; render(); flushQueue().catch(function () {});
    }
  });

  window.addEventListener('pagehide', function () {
    if (view === 'race' && pending.length && plan) {
      var sid = child + '-' + plan.plan_id + '-r' + race + '-' + Date.now().toString(36) + 'h';
      L.queue.push({ action: 'race', child: child, plan_id: plan.plan_id, phase: plan.phase, race: race, submission_id: sid, complete: false, answers: packAnswers(pending) });
      pending = []; save();
    }
  });

  flushQueue().catch(function () {});
  if (L.lastDriver && KIDS[L.lastDriver]) chooseDriver(L.lastDriver); else goView('picker');
})();
