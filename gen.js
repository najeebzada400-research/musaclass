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
    return { ri: ri, pick: pick, shuffle: shuffle, opts: opts, r: r };
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
      var to = m.pick([10, 100, 1000]), n;
      do { n = m.ri(1000, 99999); } while (n % to === 0);
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
    },

    /* chapters 11 to 16 */
    tally: function (m) {
      var n = m.ri(7, 23), thing = m.pick(['red cars', 'birds', 'buses', 'footballs']);
      return { ch: 11, lesson: 'A', t: 'num', q: 'The tally shows how many ' + thing + ' Musa counted. How many is that?', a: String(n), vis: { type: 'svg', svg: svgTally(n) } };
    },
    barchart: function (m) {
      var labels = m.shuffle(['Mango', 'Durian', 'Banana', 'Rambutan']), step = m.pick([1, 2, 5]);
      var vals = [];
      while (vals.length < 4) { var v = m.ri(1, 8) * step; if (vals.indexOf(v) < 0) vals.push(v); }
      var k = m.ri(0, 2), q, a, t = 'num', o;
      if (k === 0) { var i = m.ri(0, 3); q = 'How many children chose ' + labels[i] + '?'; a = String(vals[i]); }
      else if (k === 1) {
        var x = m.ri(0, 3), y = (x + m.ri(1, 3)) % 4, hi = vals[x] > vals[y] ? x : y, lo = hi === x ? y : x;
        q = 'How many more children chose ' + labels[hi] + ' than ' + labels[lo] + '?'; a = String(vals[hi] - vals[lo]);
      } else {
        var top = vals.indexOf(Math.max.apply(null, vals));
        q = 'Which fruit is the most popular?'; t = 'mc'; a = labels[top]; o = m.shuffle(labels.slice());
      }
      var out = { ch: 11, lesson: 'B', t: t, q: 'The bar chart shows the favourite fruit of a class. ' + q, a: a, vis: { type: 'svg', svg: svgBar(labels, vals, step) } };
      if (o) out.o = o;
      return out;
    },
    pictogram: function (m) {
      var per = m.pick([2, 4, 10]), labels = ['Mon', 'Tue', 'Wed', 'Thu'];
      var counts = labels.map(function () { return m.ri(1, 5) + (per !== 10 && m.r() < 0.35 ? 0.5 : 0); });
      var i = m.ri(0, 3);
      return { ch: 11, lesson: 'B', t: 'num', q: 'The pictogram shows cars washed each day. Each circle stands for ' + per + ' cars. How many cars were washed on ' + { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday' }[labels[i]] + '?',
        a: String(counts[i] * per), vis: { type: 'svg', svg: svgPict(labels, counts, per) } };
    },
    venn: function (m) {
      var sets = m.pick([[3, 'multiples of 3', function (n) { return n % 3 === 0; }], [5, 'multiples of 5', function (n) { return n % 5 === 0; }], [4, 'multiples of 4', function (n) { return n % 4 === 0; }]]);
      var other = m.pick([['odd numbers', function (n) { return n % 2 === 1; }], ['even numbers', function (n) { return n % 2 === 0; }], ['numbers bigger than 20', function (n) { return n > 20; }]]);
      var n = m.ri(2, 40), A = sets[2](n), B = other[1](n);
      var opts = ['Only in "' + sets[1] + '"', 'Only in "' + other[0] + '"', 'In the middle (both)', 'Outside both circles'];
      var a = A && B ? opts[2] : A ? opts[0] : B ? opts[1] : opts[3];
      return { ch: 11, lesson: 'D', t: 'mc', q: 'A Venn diagram has two circles: "' + sets[1] + '" and "' + other[0] + '". Where does ' + n + ' go?', a: a, o: opts };
    },
    mode: function (m) {
      var pool = m.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), modeV = pool[0], list = [modeV, modeV, modeV, pool[1], pool[1], pool[2], pool[3]];
      return { ch: 12, lesson: 'C', t: 'num', q: 'Goals scored in 7 football matches: ' + m.shuffle(list).join(', ') + '. Which number of goals happened most often?', a: String(modeV) };
    },
    statcycle: function (m) {
      var bank = [
        ['Aisyah wants to find out the favourite drink in her class. What should she do first?', 'Write the question she wants to answer', ['Draw a bar chart', 'Say which drink won', 'Colour the chart']],
        ['Musa asks 20 friends their favourite sport and makes tally marks. Which step of the cycle is this?', 'Collecting the data', ['Planning the question', 'Drawing a conclusion', 'Checking the answer is right']],
        ['A class wants to know how pupils come to school. Which question is best to ask?', 'How do you usually come to school?', ['Do you like school?', 'What is your name?', 'How old are you?']],
        ['The bar chart shows Football is the tallest bar. What can the class say?', 'Football is the most popular sport', ['Nobody likes the other sports', 'Football is the hardest sport', 'Everyone plays football']],
        ['Which is the best way to record answers while you ask people?', 'A tally chart', ['A shopping list', 'A clock', 'A map']]
      ];
      var b = m.pick(bank);
      return { ch: 12, lesson: m.pick(['A', 'B', 'C']), t: 'mc', q: b[0], a: b[1], o: m.opts(b[1], b[2]) };
    },
    fracshade: function (m) {
      var n = m.pick([3, 4, 5, 6, 8, 10]), k = m.ri(1, n - 1);
      var c = k + '/' + n;
      return { ch: 13, lesson: 'B', t: 'mc', q: 'What fraction of the shape is shaded?', a: c, vis: { type: 'svg', svg: svgFrac(n, k) },
        o: m.opts(c, [(n - k) + '/' + n, k + '/' + (n + 1), n + '/' + k, k + '/' + (n - k)].filter(function (x) { return x !== c && !/\/0$/.test(x); })) };
    },
    fraccmp: function (m) {
      if (m.r() < 0.5) {
        var a = m.ri(2, 6), b = m.ri(7, 12);
        return { ch: 13, lesson: 'A', t: 'mc', q: 'Which fraction is bigger: 1/' + a + ' or 1/' + b + '?', a: '1/' + a, o: ['1/' + a, '1/' + b, 'They are the same'] };
      }
      var d = m.pick([5, 6, 8, 10]), x = m.ri(1, d - 2), y = m.ri(x + 1, d - 1);
      var o = m.shuffle([x + '/' + d, y + '/' + d]);
      return { ch: 13, lesson: 'E', t: 'mc', q: 'Which fraction is bigger: ' + o[0] + ' or ' + o[1] + '?', a: y + '/' + d, o: o.concat(['They are the same']) };
    },
    fracequiv: function (m) {
      var base = m.pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5]]), k = m.ri(2, 5);
      var c = (base[0] * k) + '/' + (base[1] * k);
      var wrongs = [(base[0] * k) + '/' + (base[1] * k + 1), (base[0] + k) + '/' + (base[1] + k), (base[0] * k + 1) + '/' + (base[1] * k), base[1] + '/' + (base[0] * k + base[1])];
      return { ch: 13, lesson: 'C', t: 'mc', q: 'Which fraction is equal to ' + base[0] + '/' + base[1] + '?', a: c, o: m.opts(c, wrongs) };
    },
    percent: function (m) {
      var k = m.ri(0, 1);
      if (k === 0) {
        var p = m.pick([[50, '1/2'], [25, '1/4'], [10, '1/10'], [75, '3/4']]);
        return { ch: 13, lesson: 'F', t: 'mc', q: 'Which fraction is the same as ' + p[0] + '%?', a: p[1], o: m.opts(p[1], ['1/2', '1/4', '1/10', '3/4', '1/5'].filter(function (x) { return x !== p[1]; }).slice(0, 3)) };
      }
      var pc = m.pick([50, 25, 10]), n = (pc === 25 ? 4 : pc === 10 ? 10 : 2) * m.ri(2, 12);
      return { ch: 13, lesson: 'F', t: 'num', q: 'What is ' + pc + '% of ' + n + '?', a: String(n * pc / 100) };
    },
    fracof: function (m) {
      var d = m.ri(2, 10), n = d * m.ri(2, 10);
      return { ch: 14, lesson: 'A', t: 'num', q: 'What is 1/' + d + ' of ' + n + '?', a: String(n / d) };
    },
    fracadd: function (m) {
      var d = m.pick([5, 6, 7, 8, 9, 10]), a = m.ri(1, d - 2), b = m.ri(1, d - 1 - a), add = m.r() < 0.5;
      if (add) {
        var c = (a + b) + '/' + d;
        return { ch: 14, lesson: 'B', t: 'mc', q: a + '/' + d + ' + ' + b + '/' + d + ' = ?', a: c, o: m.opts(c, [(a + b) + '/' + (2 * d), (a + b + 1) + '/' + d, (a * b) + '/' + d]) };
      }
      var big = a + b, s = a + '/' + d;
      return { ch: 14, lesson: 'C', t: 'mc', q: big + '/' + d + ' ' + MINUS + ' ' + b + '/' + d + ' = ?', a: s, o: m.opts(s, [(big + b) + '/' + d, (a + 1) + '/' + d, a + '/' + (2 * d)]) };
    },
    angle: function (m) {
      var deg = m.pick([25, 40, 55, 70, 90, 90, 115, 130, 150, 165]);
      var kind = deg < 90 ? 'Acute (smaller than a right angle)' : deg === 90 ? 'A right angle' : 'Obtuse (bigger than a right angle)';
      return { ch: 15, lesson: 'A', t: 'mc', q: 'What kind of angle is this?', a: kind, vis: { type: 'svg', svg: svgAngle(deg) },
        o: ['Acute (smaller than a right angle)', 'A right angle', 'Obtuse (bigger than a right angle)', 'A straight line'] };
    },
    compass: function (m) {
      var dirs = ['north', 'east', 'south', 'west'], s = m.ri(0, 3), turn = m.pick([[1, 'a quarter turn clockwise'], [3, 'a quarter turn anticlockwise'], [2, 'a half turn'], [3, 'three quarter turns clockwise']]);
      var c = dirs[(s + turn[0]) % 4];
      return { ch: 15, lesson: 'B', t: 'mc', q: 'Musa faces ' + dirs[s] + '. He makes ' + turn[1] + '. Which way does he face now?', a: 'He faces ' + c,
        o: dirs.map(function (d) { return 'He faces ' + d; }) };
    },
    coord: function (m) {
      var x = m.ri(1, 6), y = m.ri(1, 5);
      if (x === y) x = x === 6 ? 5 : x + 1;
      var c = '(' + x + ', ' + y + ')';
      return { ch: 15, lesson: 'C', t: 'mc', q: 'What are the coordinates of the star?', a: c, vis: { type: 'svg', svg: svgCoord(x, y) },
        o: m.opts(c, ['(' + y + ', ' + x + ')', '(' + x + ', ' + (y + 1) + ')', '(' + (x - 1) + ', ' + y + ')']) };
    },
    prob: function (m) {
      var r, b, colour, want, total, f;
      do {
        r = m.ri(0, 10); b = m.ri(0, 10); colour = m.pick(['red', 'blue']);
        want = colour === 'red' ? r : b; total = r + b; f = total ? want / total : 0;
      } while (!total || (f > 0 && f < 1 && f !== 0.5 && f > 0.3 && f < 0.7));
      var c = want === total ? 'Certain' : want === 0 ? 'Impossible' : want * 2 > total ? 'Likely' : want * 2 < total ? 'Unlikely' : 'Even chance';
      return { ch: 16, lesson: 'A', t: 'mc', q: 'A bag has ' + r + ' red balls and ' + b + ' blue balls. Musa takes one without looking. How likely is it to be ' + colour + '?', a: c,
        o: c === 'Even chance' ? ['Impossible', 'Unlikely', 'Even chance', 'Likely'] : ['Impossible', 'Unlikely', 'Likely', 'Certain'] };
    }
  };

  /* small drawings for the chapter 11 to 16 questions (viewBox about 300 wide, text 14px or more) */
  function svgTally(n) {
    var s = '<svg viewBox="0 0 300 90" width="300" role="img" aria-label="Tally marks">', x = 14, five = Math.floor(n / 5), rest = n % 5;
    for (var g = 0; g < five; g++) {
      for (var i = 0; i < 4; i++) s += '<line x1="' + (x + i * 10) + '" y1="20" x2="' + (x + i * 10) + '" y2="70" stroke="#1B2440" stroke-width="4" stroke-linecap="round"/>';
      s += '<line x1="' + (x - 6) + '" y1="62" x2="' + (x + 36) + '" y2="28" stroke="#D62839" stroke-width="4" stroke-linecap="round"/>';
      x += 58;
    }
    for (var j = 0; j < rest; j++) s += '<line x1="' + (x + j * 10) + '" y1="20" x2="' + (x + j * 10) + '" y2="70" stroke="#1B2440" stroke-width="4" stroke-linecap="round"/>';
    return s + '</svg>';
  }
  function svgBar(labels, vals, step) {
    var max = Math.max.apply(null, vals), top = Math.ceil((max + step) / step) * step, H = 150, base = 175, left = 44;
    var s = '<svg viewBox="0 0 300 210" width="300" role="img" aria-label="Bar chart">';
    for (var v = 0; v <= top; v += step) {
      if (top / step > 10 && (v / step) % 2) continue;
      var y = base - v / top * H;
      s += '<line x1="' + left + '" y1="' + y + '" x2="295" y2="' + y + '" stroke="#D5DBE8" stroke-width="1"/><text x="' + (left - 6) + '" y="' + (y + 5) + '" font-size="14" text-anchor="end" fill="#1B2440">' + v + '</text>';
    }
    labels.forEach(function (l, i) {
      var x = left + 10 + i * 62, h = vals[i] / top * H;
      s += '<rect x="' + x + '" y="' + (base - h) + '" width="40" height="' + h + '" fill="#1F6FEB"/><text x="' + (x + 20) + '" y="198" font-size="14" text-anchor="middle" fill="#1B2440">' + l + '</text>';
    });
    return s + '<line x1="' + left + '" y1="' + base + '" x2="295" y2="' + base + '" stroke="#1B2440" stroke-width="2"/></svg>';
  }
  function svgPict(labels, counts, per) {
    var s = '<svg viewBox="0 0 300 200" width="300" role="img" aria-label="Pictogram">';
    labels.forEach(function (l, i) {
      var y = 26 + i * 38;
      s += '<text x="8" y="' + (y + 5) + '" font-size="15" fill="#1B2440">' + l + '</text>';
      for (var k = 0; k < Math.floor(counts[i]); k++) s += '<circle cx="' + (70 + k * 34) + '" cy="' + y + '" r="13" fill="#FFC43D" stroke="#B88400" stroke-width="1.5"/>';
      if (counts[i] % 1) { var cx = 70 + Math.floor(counts[i]) * 34; s += '<path d="M' + cx + ' ' + (y - 13) + ' A13 13 0 0 0 ' + cx + ' ' + (y + 13) + ' Z" fill="#FFC43D" stroke="#B88400" stroke-width="1.5"/>'; }
    });
    return s + '<circle cx="80" cy="182" r="10" fill="#FFC43D" stroke="#B88400" stroke-width="1.5"/><text x="98" y="187" font-size="14" fill="#1B2440">= ' + per + ' cars</text></svg>';
  }
  function svgFrac(n, k) {
    var w = 260 / n, s = '<svg viewBox="0 0 300 90" width="300" role="img" aria-label="A shape cut into equal parts">';
    for (var i = 0; i < n; i++) s += '<rect x="' + (20 + i * w) + '" y="15" width="' + w + '" height="60" fill="' + (i < k ? '#1F6FEB' : '#FFFFFF') + '" stroke="#1B2440" stroke-width="2"/>';
    return s + '</svg>';
  }
  function svgAngle(deg) {
    var cx = 90, cy = 150, L = 130, rad = deg * Math.PI / 180, x2 = cx + L * Math.cos(rad), y2 = cy - L * Math.sin(rad);
    var s = '<svg viewBox="0 0 300 170" width="300" role="img" aria-label="An angle">';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 180) + '" y2="' + cy + '" stroke="#1B2440" stroke-width="4" stroke-linecap="round"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#1B2440" stroke-width="4" stroke-linecap="round"/>';
    if (deg === 90) s += '<path d="M' + (cx + 22) + ' ' + cy + ' V' + (cy - 22) + ' H' + cx + '" fill="none" stroke="#D62839" stroke-width="3"/>';
    else s += '<path d="M' + (cx + 44) + ' ' + cy + ' A44 44 0 0 0 ' + (cx + 44 * Math.cos(rad)).toFixed(1) + ' ' + (cy - 44 * Math.sin(rad)).toFixed(1) + '" fill="none" stroke="#D62839" stroke-width="3"/>';
    return s + '</svg>';
  }
  function svgCoord(px, py) {
    var g = 36, ox = 40, oy = 220, s = '<svg viewBox="0 0 300 250" width="300" role="img" aria-label="A coordinate grid with a star">';
    for (var i = 0; i <= 6; i++) {
      s += '<line x1="' + (ox + i * g) + '" y1="' + (oy - 6 * g + 6) + '" x2="' + (ox + i * g) + '" y2="' + oy + '" stroke="#D5DBE8" stroke-width="1.5"/>';
      s += '<text x="' + (ox + i * g) + '" y="' + (oy + 20) + '" font-size="14" text-anchor="middle" fill="#1B2440">' + i + '</text>';
    }
    for (var j = 0; j <= 5; j++) {
      s += '<line x1="' + ox + '" y1="' + (oy - j * g) + '" x2="' + (ox + 6 * g) + '" y2="' + (oy - j * g) + '" stroke="#D5DBE8" stroke-width="1.5"/>';
      s += '<text x="' + (ox - 12) + '" y="' + (oy - j * g + 5) + '" font-size="14" text-anchor="middle" fill="#1B2440">' + j + '</text>';
    }
    s += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 6 * g) + '" y2="' + oy + '" stroke="#1B2440" stroke-width="2"/><line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (oy - 5 * g - 10) + '" stroke="#1B2440" stroke-width="2"/>';
    var x = ox + px * g, y = oy - py * g, pts = [];
    for (var k = 0; k < 10; k++) { var r = k % 2 ? 6 : 14, a = -Math.PI / 2 + k * Math.PI / 5; pts.push((x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1)); }
    return s + '<polygon points="' + pts.join(' ') + '" fill="#FFC43D" stroke="#B88400" stroke-width="1.5"/></svg>';
  }

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
    /* ---- harder topics (added 18 Oct 2026: Essa found the first ones too easy) ---- */
    add2d: function (m) {
      if (m.r() < 0.4) {
        var t1 = m.ri(1, 6), t2 = m.ri(1, 9 - t1);
        return { ch: 16, lesson: 'A', t: 'num', q: (t1 * 10) + ' + ' + (t2 * 10) + ' = ?', a: String((t1 + t2) * 10),
          hint: t1 + ' tens add ' + t2 + ' tens makes ' + (t1 + t2) + ' tens.' };
      }
      var tens = m.ri(1, 8), ones = m.ri(0, 7), b = m.ri(2, 9 - ones), a = tens * 10 + ones;
      return { ch: 16, lesson: 'A', t: 'num', q: a + ' + ' + b + ' = ?', a: String(a + b),
        hint: 'Keep the ' + tens + ' tens. Add the ones: ' + ones + ' + ' + b + ' = ' + (ones + b) + '.' };
    },
    sub2d: function (m) {
      if (m.r() < 0.4) {
        var t1 = m.ri(3, 9), t2 = m.ri(1, t1 - 1);
        return { ch: 16, lesson: 'A', t: 'num', q: (t1 * 10) + ' ' + MINUS + ' ' + (t2 * 10) + ' = ?', a: String((t1 - t2) * 10),
          hint: t1 + ' tens take away ' + t2 + ' tens leaves ' + (t1 - t2) + ' tens.' };
      }
      var tens = m.ri(2, 9), ones = m.ri(3, 9), b = m.ri(2, ones), a = tens * 10 + ones;
      return { ch: 16, lesson: 'A', t: 'num', q: a + ' ' + MINUS + ' ' + b + ' = ?', a: String(a - b),
        hint: 'Keep the ' + tens + ' tens. Take away from the ones: ' + ones + ' ' + MINUS + ' ' + b + ' = ' + (ones - b) + '.' };
    },
    bonds20: function (m) {
      var b = m.ri(3, 17), left = m.r() < 0.5;
      return { ch: 10, lesson: 'A', t: 'num', q: left ? '□ + ' + b + ' = 20' : b + ' + □ = 20', say: (left ? 'What number add ' + b : b + ' add what number') + ' makes 20?',
        a: String(20 - b), hint: b > 10 ? 'Count on from ' + b + ' to 20.' : b + ' and ' + (10 - b) + ' make 10. Then 10 more makes 20.' };
    },
    tens100: function (m) {
      var t = m.ri(1, 9) * 10;
      return { ch: 16, lesson: 'A', t: 'num', q: t + ' + □ = 100', say: t + ' add what number makes 100?', a: String(100 - t),
        hint: 'Count on in tens from ' + t + ' to 100.' };
    },
    doubles: function (m) {
      if (m.r() < 0.5) {
        var n = m.ri(3, 10);
        return { ch: 5, lesson: 'A', t: 'num', q: 'Double ' + n + ' = ?', say: 'What is double ' + n + '?', a: String(2 * n), hint: 'Double means add it to itself: ' + n + ' + ' + n + '.' };
      }
      var h = m.ri(2, 10);
      return { ch: 7, lesson: 'A', t: 'num', q: 'Half of ' + (2 * h) + ' = ?', say: 'What is half of ' + (2 * h) + '?', a: String(h), hint: 'Share ' + (2 * h) + ' into 2 equal groups.' };
    },
    three: function (m) {
      var a, b, c;
      do { a = m.ri(2, 9); b = m.ri(2, 9); c = m.ri(2, 9); } while (a + b + c > 20 || a + b + c < 11);
      return { ch: 5, lesson: 'A', t: 'num', q: a + ' + ' + b + ' + ' + c + ' = ?', a: String(a + b + c),
        hint: 'Add two first: ' + a + ' + ' + b + ' = ' + (a + b) + '. Then add ' + c + '.' };
    },
    story: function (m) {
      var k = m.ri(0, 5), x, y;
      if (k === 0) { x = m.ri(5, 12); y = m.ri(3, 8); return { ch: 5, lesson: 'A', t: 'num', q: 'Musa has ' + x + ' cars. Essa gives him ' + y + ' more. How many cars does Musa have now?', a: String(x + y), hint: 'More means add: ' + x + ' + ' + y + '.' }; }
      if (k === 1) { x = m.ri(11, 19); y = m.ri(3, 9); return { ch: 7, lesson: 'A', t: 'num', q: 'There are ' + x + ' birds on a tree. ' + y + ' fly away. How many birds are left?', a: String(x - y), hint: 'Fly away means take away: ' + x + ' ' + MINUS + ' ' + y + '.' }; }
      if (k === 2) { x = m.ri(6, 12); y = m.ri(4, 8); return { ch: 5, lesson: 'A', t: 'num', q: 'A bus has ' + x + ' people. ' + y + ' more get on. How many people are on the bus now?', a: String(x + y), hint: 'Get on means add: ' + x + ' + ' + y + '.' }; }
      if (k === 3) { x = m.ri(10, 20); y = m.ri(2, 9); return { ch: 12, lesson: 'A', t: 'num', q: 'You have RM' + x + '. You spend RM' + y + '. How much money is left?', say: 'You have ' + x + ' ringgit. You spend ' + y + ' ringgit. How much money is left?', a: String(x - y), hint: 'Spend means take away: ' + x + ' ' + MINUS + ' ' + y + '.' }; }
      if (k === 4) { x = m.ri(4, 9); y = m.ri(2, 6); return { ch: 5, lesson: 'A', t: 'num', q: 'Essa has ' + x + ' sweets. Musa has ' + y + ' more than Essa. How many sweets does Musa have?', a: String(x + y), hint: 'More than Essa means add: ' + x + ' + ' + y + '.' }; }
      x = m.ri(12, 20); y = m.ri(4, 9);
      return { ch: 7, lesson: 'A', t: 'num', q: 'There are ' + x + ' cars in a race. ' + y + ' cars stop for a pit stop. How many cars are still racing?', a: String(x - y), hint: 'Stop means take them away: ' + x + ' ' + MINUS + ' ' + y + '.' };
    },
    missub: function (m) {
      var b = m.ri(3, 9), c = m.ri(3, 11);
      return { ch: 10, lesson: 'A', t: 'num', q: '□ ' + MINUS + ' ' + b + ' = ' + c, say: 'What number take away ' + b + ' leaves ' + c + '?', a: String(b + c),
        hint: 'Work backwards: add them. ' + c + ' + ' + b + ' = ?' };
    },
    skip: function (m) {
      var kind = m.ri(0, 3), t, step;
      if (kind === 0) { step = 5; var s0 = m.ri(1, 12) * 5; t = [s0, s0 + 5, s0 + 10, s0 + 15]; }
      else if (kind === 1) { step = -2; var s1 = m.ri(6, 10) * 2; t = [s1, s1 - 2, s1 - 4, s1 - 6]; }
      else if (kind === 2) { step = -10; var s2 = m.ri(6, 10) * 10; t = [s2, s2 - 10, s2 - 20, s2 - 30]; }
      else { step = 10; var s3 = m.ri(1, 5) * 10 + m.ri(1, 9); t = [s3, s3 + 10, s3 + 20, s3 + 30]; }
      var nxt = t[3] + step;
      return { ch: 14, lesson: 'A', t: 'num', q: 'What comes next?  ' + t.join(', ') + ', □', say: 'What comes next? ' + t.join(', '), a: String(nxt),
        hint: step > 0 ? 'Each number goes up by ' + step + '.' : 'Each number goes down by ' + (-step) + '.' };
    },
    placevalue: function (m) {
      var tens = m.ri(2, 9), ones = m.ri(1, 9), n = tens * 10 + ones;
      if (m.r() < 0.5) return { ch: 16, lesson: 'A', t: 'num', q: tens + ' tens and ' + ones + ' ones make what number?', a: String(n), hint: tens + ' tens is ' + (tens * 10) + '. Add ' + ones + ' more.' };
      return { ch: 16, lesson: 'A', t: 'mc', q: 'How many tens are in ' + n + '?', o: m.opts(String(tens), [String(ones), String(n), String(tens * 10)]), a: String(tens), hint: 'The first digit tells you the tens.' };
    },
    compare: function (m) {
      var a, b, c, d;
      do { a = m.ri(3, 10); b = m.ri(3, 10); c = m.ri(3, 10); d = m.ri(3, 10); } while (a + b === c + d || a + b > 20 || c + d > 20);
      var l = a + ' + ' + b, r2 = c + ' + ' + d;
      return { ch: 2, lesson: 'A', t: 'mc', q: 'Which is more?', o: [l, r2], a: a + b > c + d ? l : r2, hint: 'Work out each one: ' + l + ' = ' + (a + b) + ' and ' + r2 + ' = ' + (c + d) + '.' };
    },
    groups: function (m) {
      var g = m.ri(2, 4), each = m.ri(3, 5), icon = m.pick(ICONS);
      return { ch: 5, lesson: 'A', t: 'num', q: g + ' groups of ' + each + ' ' + icon + 's. How many ' + icon + 's altogether?', vis: { type: 'dots', n: g * each, icon: icon }, a: String(g * each),
        hint: 'Count in ' + each + 's: ' + [1, 2, 3, 4].slice(0, g).map(function (i) { return i * each; }).join(', ') + '.' };
    },
    pattern: function (m) {
      var step = m.pick([1, 2, 5, 10]), start = step === 10 ? 10 : m.ri(1, 6) * (step === 5 ? 5 : 1);
      var t = [start, start + step, start + 2 * step, start + 3 * step];
      return { ch: 14, lesson: 'A', t: 'num', q: 'What comes next?  ' + t.join(', ') + ', □', say: 'What comes next? ' + t.join(', '), a: String(start + 4 * step), hint: 'Each number goes up by ' + step + '.' };
    }
  };

  var DEFAULT_PRACTICE = {
    musa: ['pv', 'round', 'compare', 'neg', 'factor', 'multiple', 'divis', 'timeconv', 't24', 'clock', 'perim', 'area', 'add3', 'sub3', 'mul10', 'div10', 'tables', 'mul1', 'div1', 'seq', 'square',
      'tally', 'barchart', 'pictogram', 'venn', 'mode', 'statcycle', 'fracshade', 'fraccmp', 'fracequiv', 'percent', 'fracof', 'fracadd', 'angle', 'compass', 'coord', 'prob'],
    essa: ['add20', 'cross', 'cross', 'teen', 'missing', 'missub', 'bonds20', 'add2d', 'sub2d', 'tens100', 'doubles', 'three', 'story', 'story', 'skip', 'placevalue', 'compare', 'groups', 'clock']
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
