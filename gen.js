/* MusaClass question makers: build practice races instantly on the device. */
(function (root) {
  function rngFrom(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    var a = h >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var MINUS = '−';
  function fmtN(n) {
    if (n < 0) return MINUS + fmtN(-n);
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function maker(r) {
    var ri = function (a, b) { return a + Math.floor(r() * (b - a + 1)); };
    var pick = function (arr) { return arr[Math.floor(r() * arr.length)]; };
    var shuffle = function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    };
    var opts = function (correct, wrongs) {
      var seen = {}; var list = [String(correct)]; seen[String(correct)] = 1;
      wrongs.forEach(function (w) { w = String(w); if (!seen[w] && list.length < 4) { seen[w] = 1; list.push(w); } });
      return shuffle(list);
    };
    return { ri: ri, pick: pick, shuffle: shuffle, opts: opts };
  }

  /* ---------- Musa, Cambridge Stage 4 ---------- */
  var MUSA = {
    pv: function (m) {
      var n, digits, pos, d;
      do {
        n = m.ri(10000, 99999); digits = String(n); pos = m.ri(0, 3); d = Number(digits[pos]);
      } while (d === 0 || digits.split(String(d)).length !== 2);
      var place = Math.pow(10, 4 - pos);
      var value = d * place;
      return { ch: 1, lesson: 'B', t: 'mc', q: 'What is the value of the digit ' + d + ' in ' + fmtN(n) + '?', a: fmtN(value),
        o: m.opts(fmtN(value), [fmtN(d), fmtN(d * 10), fmtN(d * 100), fmtN(d * 1000), fmtN(d * 10000)].filter(function (x) { return x !== fmtN(value); })) };
    },
    round: function (m) {
      var n = m.ri(1000, 99999); var to = m.pick([10, 100, 1000]);
      var a = Math.floor(n / to + 0.5) * to;
      return { ch: 1, lesson: 'E', t: 'num', q: 'Round ' + fmtN(n) + ' to the nearest ' + fmtN(to) + '.', a: String(a) };
    },
    compare: function (m) {
      var base = m.ri(20, 89) * 1000;
      var nums = [];
      while (nums.length < 4) {
        var x = base + m.pick([m.ri(0, 9) * 100 + m.ri(0, 9) * 10, m.ri(0, 9) * 101, m.ri(0, 9) * 110, m.ri(0, 9) * 11]);
        if (nums.indexOf(x) < 0) nums.push(x);
      }
      var big = Math.max.apply(null, nums);
      return { ch: 1, lesson: 'D', t: 'mc', q: 'Which number is the greatest?', a: fmtN(big), o: m.shuffle(nums.map(fmtN)) };
    },
    neg: function (m) {
      var t = m.ri(-5, 8), k = m.ri(2, 9), fall = m.ri(0, 1) === 1 || t > 4;
      var res = fall ? t - k : t + k;
      var f = function (x) { return fmtN(x) + ' °C'; };
      return { ch: 2, lesson: 'B', t: 'mc',
        q: 'It is ' + f(t) + '. The temperature ' + (fall ? 'falls' : 'rises') + ' by ' + k + ' degrees. What is the temperature now?',
        a: f(res), o: m.opts(f(res), [f(-res), f(res + 2), f(res - 2), f(t + (fall ? k : -k))]) };
    },
    factor: function (m) {
      var N = m.pick([12, 18, 20, 24, 30, 36, 40, 48]);
      var divs = [], non = [];
      for (var i = 2; i <= 12; i++) { if (N % i === 0) { if (i < N) divs.push(i); } else non.push(i); }
      var c = m.pick(divs);
      return { ch: 3, lesson: 'A', t: 'mc', q: 'Which of these numbers is a factor of ' + N + '?', a: String(c), o: m.opts(c, m.shuffle(non).slice(0, 3)) };
    },
    multiple: function (m) {
      var k = m.ri(3, 9), c = k * m.ri(3, 9);
      var wrong = [];
      while (wrong.length < 3) { var x = c + m.ri(-7, 7); if (x > 0 && x % k !== 0 && wrong.indexOf(x) < 0) wrong.push(x); }
      return { ch: 3, lesson: 'A', t: 'mc', q: 'Which of these numbers is a multiple of ' + k + '?', a: String(c), o: m.opts(c, wrong) };
    },
    divis: function (m) {
      var d = m.pick([2, 5, 10]);
      var c = d * m.ri(11, 99);
      var wrong = [];
      while (wrong.length < 3) { var x = m.ri(101, 999); if (x % d !== 0 && wrong.indexOf(x) < 0) wrong.push(x); }
      return { ch: 3, lesson: 'B', t: 'mc', q: 'Which number can be divided by ' + d + ' with nothing left over?', a: String(c), o: m.opts(c, wrong) };
    },
    timeconv: function (m) {
      var k = m.ri(0, 2);
      if (k === 0) { var h = m.ri(2, 6); return { ch: 4, lesson: 'C', t: 'num', q: 'How many minutes are there in ' + h + ' hours?', a: String(h * 60) }; }
      if (k === 1) { var w = m.ri(2, 8); return { ch: 4, lesson: 'C', t: 'num', q: 'How many days are there in ' + w + ' weeks?', a: String(w * 7) }; }
      var mi = m.ri(2, 6); return { ch: 4, lesson: 'C', t: 'num', q: 'How many seconds are there in ' + mi + ' minutes?', a: String(mi * 60) };
    },
    t24: function (m) {
      var h = m.ri(1, 11), mm = m.pick(['00', '15', '30', '45']);
      var c = (h + 12) + ':' + mm;
      return { ch: 4, lesson: 'B', t: 'mc', q: 'Which 24-hour time is the same as ' + h + ':' + mm + ' pm?', a: c,
        o: m.opts(c, [(h < 10 ? '0' : '') + h + ':' + mm, (h + 10) + ':' + mm, (h + 11) + ':' + mm, (h + 13 > 23 ? h + 1 : h + 13) + ':' + mm]) };
    },
    clock: function (m) {
      var h = m.ri(1, 12), mm = m.pick([0, 15, 30, 45]);
      var lab = function (hh, x) { return hh + ':' + (x < 10 ? '0' : '') + x; };
      var c = lab(h, mm);
      var swapH = mm === 0 ? 12 : mm / 5;
      return { ch: 4, lesson: 'A', t: 'mc', q: 'What time does the clock show?', vis: { type: 'clock', h: h, m: mm }, a: c,
        o: m.opts(c, [lab(swapH, (h % 12) * 5), lab(h % 12 + 1, mm), lab(h, (mm + 15) % 60), lab(h === 1 ? 12 : h - 1, mm)]) };
    },
    perim: function (m) {
      var l = m.ri(3, 12), w = m.ri(2, 9);
      return { ch: 7, lesson: 'A', t: 'num', unit: 'cm', q: 'A rectangle is ' + l + ' cm long and ' + w + ' cm wide. What is its perimeter?', a: String(2 * (l + w)) };
    },
    area: function (m) {
      var l = m.ri(3, 12), w = m.ri(2, 9);
      return { ch: 7, lesson: 'B', t: 'num', unit: 'cm²', q: 'A rectangle is ' + l + ' cm long and ' + w + ' cm wide. What is its area?', a: String(l * w) };
    },
    add3: function (m) { var a = m.ri(125, 599), b = m.ri(108, 399); return { ch: 8, lesson: 'C', t: 'num', q: a + ' + ' + b + ' = ?', a: String(a + b) }; },
    sub3: function (m) { var a = m.ri(300, 999), b = m.ri(101, a - 40); return { ch: 8, lesson: 'D', t: 'num', q: a + ' ' + MINUS + ' ' + b + ' = ?', a: String(a - b) }; },
    mul10: function (m) { var n = m.ri(3, 99), k = m.pick([10, 100]); return { ch: 9, lesson: 'A', t: 'num', q: n + ' × ' + k + ' = ?', a: String(n * k) }; },
    div10: function (m) { var k = m.pick([10, 100]), n = m.ri(3, 99) * k; return { ch: 9, lesson: 'B', t: 'num', q: fmtN(n) + ' ÷ ' + k + ' = ?', a: String(n / k) }; },
    tables: function (m) { var a = m.ri(2, 10), b = m.ri(2, 10); return { ch: 9, lesson: 'D', t: 'num', q: a + ' × ' + b + ' = ?', a: String(a * b) }; },
    mul1: function (m) { var a = m.ri(12, 250), b = m.ri(2, 9); return { ch: 9, lesson: 'E', t: 'num', q: a + ' × ' + b + ' = ?', a: String(a * b) }; },
    div1: function (m) { var b = m.ri(2, 9), q = m.ri(2, Math.floor(100 / b)); return { ch: 9, lesson: 'F', t: 'num', q: (b * q) + ' ÷ ' + b + ' = ?', a: String(q) }; },
    seq: function (m) {
      var step = m.pick([3, 4, 5, 6, 7, 8, 9, 11, 25, -3, -4, -5, -6, -9]);
      var start = step > 0 ? m.ri(1, 50) : m.ri(60, 120);
      var t = [start, start + step, start + 2 * step, start + 3 * step];
      return { ch: 10, lesson: 'A', t: 'num', q: 'What number comes next?  ' + t.join(', ') + ', …', a: String(start + 4 * step) };
    },
    square: function (m) {
      var s = m.ri(2, 10), c = s * s;
      var wrong = [];
      while (wrong.length < 3) { var x = c + m.ri(-8, 12); if (x > 1 && Math.sqrt(x) % 1 !== 0 && wrong.indexOf(x) < 0) wrong.push(x); }
      return { ch: 10, lesson: 'B', t: 'mc', q: 'Which of these is a square number?', a: String(c), o: m.opts(c, wrong) };
    }
  };

  /* ---------- Essa, Cambridge Stage 1 ---------- */
  var ICONS = ['car', 'ball', 'star'];
  var ESSA = {
    count: function (m) {
      var n = m.ri(3, 15), icon = m.pick(ICONS);
      return { ch: 1, lesson: 'A', t: 'num', q: 'How many ' + icon + 's?', vis: { type: 'dots', n: n, icon: icon }, a: String(n), hint: 'Touch each one as you count.' };
    },
    after: function (m) { var n = m.ri(5, 19); return { ch: 1, lesson: 'A', t: 'num', q: 'What number comes after ' + n + '?', a: String(n + 1), hint: 'Count on one more from ' + n + '.' }; },
    before: function (m) { var n = m.ri(2, 20); return { ch: 1, lesson: 'A', t: 'num', q: 'What number comes before ' + n + '?', a: String(n - 1), hint: 'Count back one from ' + n + '.' }; },
    bigger: function (m) {
      var a = m.ri(1, 20), b; do { b = m.ri(1, 20); } while (b === a);
      return { ch: 2, lesson: 'A', t: 'mc', q: 'Which number is bigger?', o: [String(a), String(b)], a: String(Math.max(a, b)), hint: 'The bigger number comes later when you count.' };
    },
    bonds: function (m) {
      var a = m.ri(1, 9);
      return { ch: 3, lesson: 'A', t: 'num', q: a + ' + □ = 10', say: a + ' add what number makes 10?', a: String(10 - a), hint: 'Count the empty boxes.', hint_vis: { type: 'blocks', n: a, frame: 10 } };
    },
    add10: function (m) {
      var a = m.ri(1, 8), b = m.ri(1, 10 - a);
      return { ch: 4, lesson: 'A', t: 'num', q: a + ' + ' + b + ' = ?', a: String(a + b), hint: 'Start at ' + a + '. Count on ' + b + ' more.', hint_vis: { type: 'blocks', n: a, add: b } };
    },
    add20: function (m) {
      var a = m.ri(5, 12), b = m.ri(2, 20 - a > 9 ? 9 : 20 - a);
      return { ch: 5, lesson: 'A', t: 'num', q: a + ' + ' + b + ' = ?', a: String(a + b), hint: 'Start at ' + a + '. Count on ' + b + ' more.', hint_vis: { type: 'blocks', n: a, add: b } };
    },
    sub10: function (m) {
      var a = m.ri(3, 10), b = m.ri(1, a);
      return { ch: 6, lesson: 'A', t: 'num', q: a + ' ' + MINUS + ' ' + b + ' = ?', a: String(a - b), hint: 'Start at ' + a + '. Take away ' + b + '.', hint_vis: { type: 'blocks', n: a, take: b } };
    },
    sub20: function (m) {
      var a = m.ri(12, 19), b = m.ri(1, a - 10);
      return { ch: 7, lesson: 'A', t: 'num', q: a + ' ' + MINUS + ' ' + b + ' = ?', a: String(a - b), hint: 'Start at ' + a + '. Take away ' + b + '.', hint_vis: { type: 'blocks', n: a, take: b } };
    },
    cross: function (m) {
      var a = m.ri(11, 18), b = m.ri(a - 9, 9);
      if (b <= a - 10) b = a - 9;
      var first = a - 10, rest = b - first;
      return { ch: 8, lesson: 'A', t: 'num', q: a + ' ' + MINUS + ' ' + b + ' = ?', a: String(a - b),
        hint: 'First take away ' + first + ' to get to 10. Then take away ' + rest + ' more.', hint_vis: { type: 'blocks', n: a, take: b } };
    },
    teen: function (m) {
      var a = m.ri(13, 20), b = m.ri(11, a - 1);
      return { ch: 9, lesson: 'A', t: 'num', q: a + ' ' + MINUS + ' ' + b + ' = ?', a: String(a - b),
        hint: 'Take away 10 first: ' + a + ' ' + MINUS + ' 10 = ' + (a - 10) + '. Then take away ' + (b - 10) + ' more.', hint_vis: { type: 'blocks', n: a, take: b } };
    },
    missing: function (m) {
      var b = m.ri(1, 9), c = m.ri(b + 2, Math.min(b + 10, 20));
      return { ch: 10, lesson: 'A', t: 'num', q: '□ + ' + b + ' = ' + c, say: 'What number add ' + b + ' makes ' + c + '?', a: String(c - b), hint: 'Count on from ' + b + ' up to ' + c + '.' };
    },
    clock: function (m) {
      var h = m.ri(1, 12), half = m.ri(0, 1) === 1;
      var lab = function (x, hf) { return hf ? 'half past ' + x : x + " o'clock"; };
      return { ch: 13, lesson: 'A', t: 'mc', q: 'What time is it?', vis: { type: 'clock', h: h, m: half ? 30 : 0 }, a: lab(h, half),
        o: m.opts(lab(h, half), [lab(h, !half), lab(h % 12 + 1, half), lab(h === 1 ? 12 : h - 1, half)]), hint: 'The short hand shows the hour.' };
    },
    pattern: function (m) {
      var step = m.pick([1, 2, 5, 10]), start = step === 10 ? 10 : m.ri(1, 6) * (step === 5 ? 5 : 1);
      var t = [start, start + step, start + 2 * step, start + 3 * step];
      return { ch: 14, lesson: 'A', t: 'num', q: 'What comes next?  ' + t.join(', ') + ', □', say: 'What comes next? ' + t.join(', '), a: String(start + 4 * step), hint: 'Each number goes up by ' + step + '.' };
    }
  };

  var DEFAULT_PRACTICE = {
    musa: ['pv', 'round', 'compare', 'neg', 'factor', 'multiple', 'divis', 'timeconv', 't24', 'clock', 'perim', 'area', 'add3', 'sub3', 'mul10', 'div10', 'tables', 'mul1', 'div1', 'seq', 'square'],
    essa: ['count', 'after', 'before', 'bigger', 'bonds', 'add10', 'add20', 'sub10', 'sub20', 'cross', 'cross', 'teen', 'missing', 'clock', 'pattern']
  };

  function makeRace(child, seed, count, practice) {
    var bank = child === 'essa' ? ESSA : MUSA;
    var pool = [];
    (practice && practice.length ? practice : DEFAULT_PRACTICE[child].map(function (t) { return { topic: t, w: 1 }; })).forEach(function (p) {
      var t = typeof p === 'string' ? p : p.topic;
      var w = typeof p === 'string' ? 1 : Math.max(1, Math.min(5, Number(p.w) || 1));
      if (bank[t]) for (var i = 0; i < w; i++) pool.push(t);
    });
    if (!pool.length) pool = DEFAULT_PRACTICE[child].slice();
    var r = rngFrom(seed);
    var m = maker(r);
    var qs = [], seen = {}, guard = 0;
    while (qs.length < count && guard < count * 20) {
      guard++;
      var topic = pool[Math.floor(r() * pool.length)];
      if (qs.length && qs[qs.length - 1].topic === topic && pool.length > 1 && guard < count * 10) continue;
      var q = bank[topic](m);
      if (seen[q.q + (q.vis ? JSON.stringify(q.vis) : '')]) continue;
      seen[q.q + (q.vis ? JSON.stringify(q.vis) : '')] = 1;
      q.topic = topic;
      q.id = 'g-' + seed + '-q' + (qs.length + 1);
      q.generated = true;
      qs.push(q);
    }
    return qs;
  }

  root.MusaGen = { makeRace: makeRace, fmtN: fmtN, topics: { musa: Object.keys(MUSA), essa: Object.keys(ESSA) } };
})(typeof window !== 'undefined' ? window : globalThis);
