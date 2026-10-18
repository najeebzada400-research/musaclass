/* Dania's practice makers: Cambridge Lower Secondary Mathematics, Stage 8.
   Every question carries "steps" (the worked method) so learning mode can show it after a slip.
   Lessons are letters: unit 13.1 is ch 13, lesson A; 13.2 is lesson B, and so on. */
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
  /* tidy number for display: −3, 0.75, 12 500 */
  function d(x) {
    var n = Math.round(x * 1e6) / 1e6;
    if (Object.is(n, -0)) n = 0;
    var neg = n < 0; n = Math.abs(n);
    var s = String(n);
    if (s.indexOf('e') >= 0) s = n.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
    var parts = s.split('.');
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? MINUS : '') + parts.join('.');
  }
  /* plain answer string for typed answers: -3, 0.75, 12500 */
  function A(x) { return d(x).replace(/\s/g, '').replace(MINUS, '-'); }
  function rm(x) { var n = Math.round(x * 100) / 100; return 'RM' + (n % 1 ? n.toFixed(2) : d(n)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function frac(n, den) { var g = gcd(n, den); n /= g; den /= g; if (den < 0) { n = -n; den = -den; } return [n, den]; }
  function fs(f) { return f[1] === 1 ? d(f[0]) : (f[0] < 0 ? MINUS : '') + Math.abs(f[0]) + '/' + f[1]; }
  function mixed(f) {
    var n = f[0], den = f[1];
    if (den === 1) return d(n);
    var neg = n < 0; n = Math.abs(n);
    var w = Math.floor(n / den), r = n % den;
    return (neg ? MINUS : '') + (w ? w + ' ' : '') + r + '/' + den;
  }
  function sgn(n) { return n < 0 ? MINUS + Math.abs(n) : String(n); }
  function br(n) { return n < 0 ? '(' + MINUS + Math.abs(n) + ')' : String(n); }
  /* ax + b written nicely */
  function lin(a, b, v) {
    v = v || 'x';
    var s = a === 1 ? v : a === -1 ? MINUS + v : (a < 0 ? MINUS + Math.abs(a) : a) + v;
    if (a === 0) s = '';
    if (b) s += (s ? (b < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(b) : sgn(b));
    return s || '0';
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
  /* change the last whole number in a string by k, for spare wrong options */
  function tweak(str, k) {
    var re = /\d+(?!.*\d)/;
    var mm = String(str).match(re);
    if (!mm) return null;
    var n = Number(mm[0]) + k;
    if (n < 0) return null;
    return String(str).replace(re, String(n));
  }
  function mc(ch, lesson, q, a, wrongs, steps, m, extra) {
    var w = wrongs.filter(function (x) { return x !== null && x !== undefined && String(x) !== String(a); });
    var uniq = {}; w.forEach(function (x) { uniq[String(x)] = 1; });
    [1, -1, 2, -2, 3, 10].forEach(function (k) {
      if (Object.keys(uniq).length >= 3) return;
      var t = tweak(a, k); if (t && t !== String(a) && !uniq[t]) { uniq[t] = 1; w.push(t); }
    });
    var o = m.opts(a, w);
    var x = { ch: ch, lesson: lesson, t: 'mc', q: q, a: String(a), o: o, steps: steps };
    if (extra) for (var k in extra) x[k] = extra[k];
    return x;
  }
  function num(ch, lesson, q, a, steps, extra) {
    var x = { ch: ch, lesson: lesson, t: 'num', q: q, a: String(a), steps: steps };
    if (String(a).charAt(0) === '-') x.neg = true;
    if (extra) for (var k in extra) x[k] = extra[k];
    return x;
  }
  var NAMES = ['Aisyah', 'Sofia', 'Hana', 'Mei Ling', 'Priya', 'Zara', 'Nur', 'Amira', 'Lina', 'Iman'];

  var T = {
    /* 1.1 factors, multiples and primes */
    hcf: function (m) {
      var g = m.pick([2, 3, 4, 5, 6, 8]), p = m.ri(2, 5), q;
      do { q = m.ri(2, 5); } while (q === p || gcd(p, q) !== 1);
      var a = g * p, b = g * q;
      if (m.r() < 0.5) {
        return num(1, 'A', 'What is the highest common factor (HCF) of ' + a + ' and ' + b + '?', A(g), [
          'List the factors of ' + a + ' and ' + b + ', or split each into prime factors.',
          'The biggest number that divides into both is ' + g + '.',
          'So the HCF is ' + g + '.']);
      }
      var l = lcm(a, b);
      return num(1, 'A', 'What is the lowest common multiple (LCM) of ' + a + ' and ' + b + '?', A(l), [
        'Count up in ' + Math.max(a, b) + 's until you reach a number that ' + Math.min(a, b) + ' also divides into.',
        'Or use HCF: ' + a + ' × ' + b + ' ÷ ' + g + ' = ' + l + '.',
        'So the LCM is ' + l + '.']);
    },
    primeform: function (m) {
      var choices = [[2, 3, 1, 0], [3, 2, 0, 0], [2, 2, 1, 0], [3, 1, 1, 0], [2, 1, 0, 1], [1, 2, 1, 0], [4, 1, 0, 0], [2, 3, 0, 0], [3, 3, 0, 0], [2, 2, 0, 1], [1, 3, 1, 0], [3, 2, 1, 0]];
      var e = m.pick(choices), primes = [2, 3, 5, 7];
      var n = 1; e.forEach(function (k, i) { n *= Math.pow(primes[i], k); });
      var sup = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
      var write = function (ex) { return ex.map(function (k, i) { return k ? primes[i] + sup[k] : ''; }).filter(Boolean).join(' × '); };
      var right = write(e);
      var w1 = e.slice(); var i0 = w1.indexOf(Math.max.apply(null, w1)); w1[i0] = w1[i0] + 1;
      var w2 = e.slice(); var j = w2.findIndex(function (k) { return k > 1; }); if (j >= 0) w2[j]--; else w2[0]++;
      var w3 = e.map(function (k) { return k; }); var nz = w3.map(function (k, i) { return k ? i : -1; }).filter(function (i) { return i >= 0; });
      if (nz.length > 1) { var t = w3[nz[0]]; w3[nz[0]] = w3[nz[1]]; w3[nz[1]] = t; } else w3[1] = (w3[1] || 0) + 1;
      var extra = [write([e[0] + 1, e[1], e[2], e[3]]), write([e[0], e[1] + 1, e[2], e[3]]), write([Math.max(0, e[0] - 1), e[1], e[2] + 1, e[3]]), write([e[0], Math.max(0, e[1] - 1), e[2], e[3] + 1]), write([e[0] + 2, e[1], e[2], e[3]])];
      return mc(1, 'A', 'Which is ' + n + ' written as a product of its prime factors?', right,
        [write(w1), write(w2), write(w3)].concat(extra).filter(Boolean), [
          'Make a factor tree: keep dividing ' + n + ' by primes (2, 3, 5, 7…).',
          'Collect the primes and write repeats with an index.',
          n + ' = ' + right + '.'], m);
    },
    /* 1.2 multiplying and dividing integers */
    integers: function (m) {
      var a = m.ri(2, 12) * m.pick([1, -1]), b = m.ri(2, 9) * m.pick([1, -1]);
      if (a > 0 && b > 0) b = -b;
      if (m.r() < 0.5) {
        var p = a * b;
        return num(1, 'B', 'Work out ' + br(a) + ' × ' + br(b) + '.', A(p), [
          Math.abs(a) + ' × ' + Math.abs(b) + ' = ' + Math.abs(p) + '.',
          (a < 0) === (b < 0) ? 'Two negatives make a positive.' : 'One negative and one positive make a negative.',
          'So the answer is ' + d(p) + '.']);
      }
      var prod = a * b;
      return num(1, 'B', 'Work out ' + br(prod) + ' ÷ ' + br(b) + '.', A(a), [
        Math.abs(prod) + ' ÷ ' + Math.abs(b) + ' = ' + Math.abs(a) + '.',
        (prod < 0) === (b < 0) ? 'Same signs give a positive answer.' : 'Different signs give a negative answer.',
        'So the answer is ' + d(a) + '.']);
    },
    /* 1.3 square roots and cube roots */
    roots: function (m) {
      if (m.r() < 0.5) {
        var s = m.ri(4, 15);
        return num(1, 'C', 'What is √' + (s * s) + '?', A(s), ['Find the number that multiplies by itself to give ' + (s * s) + '.', s + ' × ' + s + ' = ' + (s * s) + ', so √' + (s * s) + ' = ' + s + '.']);
      }
      var c = m.ri(2, 6) * m.pick([1, 1, -1]);
      return num(1, 'C', 'What is ∛' + br(c * c * c) + '?', A(c), ['Find the number that you multiply three times to get ' + d(c * c * c) + '.',
        br(c) + ' × ' + br(c) + ' × ' + br(c) + ' = ' + d(c * c * c) + ', so the cube root is ' + d(c) + '.']);
    },
    /* 1.4 indices */
    indices: function (m) {
      var b = m.pick([2, 3, 5, 7, 10]), p = m.ri(2, 8), q = m.ri(2, 6), kind = m.ri(0, 3);
      if (kind === 0) return num(1, 'D', b + '^' + p + ' × ' + b + '^' + q + ' = ' + b + '^?  What is the missing index?', A(p + q),
        ['When you multiply powers of the same number, add the indices.', p + ' + ' + q + ' = ' + (p + q) + '.'], { pretty: true });
      if (kind === 1) { var big = p + q; return num(1, 'D', b + '^' + big + ' ÷ ' + b + '^' + q + ' = ' + b + '^?  What is the missing index?', A(p),
        ['When you divide powers of the same number, subtract the indices.', big + ' − ' + q + ' = ' + p + '.'], { pretty: true }); }
      if (kind === 2) return num(1, 'D', 'What is ' + m.pick([7, 15, 124, 9, 36]) + '^0?', '1', ['Any number (except 0) to the power 0 is 1.'], { pretty: true });
      var k = m.ri(1, 3), bb = m.pick([2, 3, 4, 5]), val = Math.pow(bb, k);
      return mc(1, 'D', 'What is ' + bb + '^' + MINUS + k + ' as a fraction?', '1/' + val, ['−' + val, '1/' + (bb * k), String(val), MINUS + '1/' + val],
        ['A negative index means "one over".', bb + '^' + MINUS + k + ' = 1 ÷ ' + bb + '^' + k + ' = 1/' + val + '.'], m, { pretty: true });
    },
    /* 2.2 using expressions and formulae */
    substitute: function (m) {
      var x = m.ri(-4, 5); if (x === 0) x = 2;
      var a = m.ri(2, 5), b = m.ri(1, 9) * m.pick([1, -1]);
      if (m.r() < 0.5) {
        var v = a * x + b;
        return num(2, 'B', 'Find the value of ' + lin(a, b) + ' when x = ' + sgn(x) + '.', A(v), [
          'Replace x with ' + sgn(x) + ': ' + a + ' × ' + br(x) + (b < 0 ? ' − ' + Math.abs(b) : ' + ' + b) + '.',
          a + ' × ' + br(x) + ' = ' + d(a * x) + '.', d(a * x) + (b < 0 ? ' − ' + Math.abs(b) : ' + ' + b) + ' = ' + d(v) + '.']);
      }
      var c = m.ri(1, 3), k = m.ri(0, 8), v2 = c * x * x - k;
      return num(2, 'B', 'Find the value of ' + (c === 1 ? '' : c) + 'x² − ' + k + ' when x = ' + sgn(x) + '.', A(v2), [
        'Square first: ' + br(x) + '² = ' + (x * x) + (x < 0 ? ' (a negative number squared is positive).' : '.'),
        (c === 1 ? '' : c + ' × ' + (x * x) + ' = ' + (c * x * x) + '. ') + 'Then subtract ' + k + '.', 'The answer is ' + d(v2) + '.']);
    },
    /* 2.3 expanding brackets */
    expand: function (m) {
      if (m.r() < 0.6) {
        var k = m.ri(2, 7) * m.pick([1, 1, -1]), a = m.ri(1, 5), b = m.ri(1, 9) * m.pick([1, -1]);
        var right = lin(k * a, k * b);
        return mc(2, 'C', 'Expand ' + (k < 0 ? MINUS + Math.abs(k) : k) + '(' + lin(a, b) + ').', right,
          [lin(k * a, b), lin(k * a, -k * b), lin(a + k, k * b), lin(k * a, k + b)], [
            'Multiply each term inside the bracket by ' + sgn(k) + '.',
            sgn(k) + ' × ' + (a === 1 ? 'x' : a + 'x') + ' = ' + lin(k * a, 0) + ' and ' + sgn(k) + ' × ' + sgn(b) + ' = ' + sgn(k * b) + '.',
            'So the answer is ' + right + '.'], m);
      }
      var p = m.ri(1, 6), q = m.ri(1, 6) * m.pick([1, -1]);
      var right2 = 'x² ' + ((p + q) < 0 ? MINUS + ' ' + Math.abs(p + q) + 'x' : (p + q === 0 ? '' : '+ ' + (p + q === 1 ? '' : p + q) + 'x')) + ' ' + (p * q < 0 ? MINUS + ' ' + Math.abs(p * q) : '+ ' + p * q);
      right2 = right2.replace(/\s+/g, ' ').trim();
      var mk = function (s, c) { return ('x² ' + (s < 0 ? MINUS + ' ' + Math.abs(s) + 'x' : (s === 0 ? '' : '+ ' + (s === 1 ? '' : s) + 'x')) + ' ' + (c < 0 ? MINUS + ' ' + Math.abs(c) : '+ ' + c)).replace(/\s+/g, ' ').trim(); };
      return mc(2, 'C', 'Expand (x + ' + p + ')(x ' + (q < 0 ? MINUS + ' ' + Math.abs(q) : '+ ' + q) + ').', right2,
        [mk(p * q, p + q), mk(p + q, -p * q), mk(p - q, p * q), 'x² + ' + (p * q), mk(p + q + 1, p * q), mk(p + q, p + q)], [
          'Multiply each term in the first bracket by each term in the second.',
          'x × x = x², x × ' + sgn(q) + ' = ' + lin(q, 0) + ', ' + p + ' × x = ' + p + 'x, ' + p + ' × ' + sgn(q) + ' = ' + sgn(p * q) + '.',
          'Collect the x terms: ' + right2 + '.'], m);
    },
    /* 2.4 factorising */
    factorise: function (m) {
      var k = m.pick([2, 3, 4, 5, 6]), a, b;
      do { a = m.ri(1, 6); b = m.ri(1, 9) * m.pick([1, -1]); } while (gcd(a, b) !== 1);
      var right = k + '(' + lin(a, b) + ')';
      return mc(2, 'D', 'Factorise ' + lin(k * a, k * b) + ' completely.', right,
        [(k * a) + '(x ' + (b < 0 ? MINUS + ' ' : '+ ') + Math.abs(b) + ')', k + '(' + lin(a, k * b) + ')', (k > 2 && k % 2 === 0 ? (k / 2) + '(' + lin(2 * a, 2 * b) + ')' : (k + 1) + '(' + lin(a, b) + ')'), k + 'x(' + a + (b < 0 ? ' − ' : ' + ') + Math.abs(b) + ')'], [
          'Find the highest common factor of ' + (k * a) + 'x and ' + Math.abs(k * b) + '. It is ' + k + '.',
          'Divide each term by ' + k + ' to fill the bracket: ' + lin(a, b) + '.',
          'So ' + lin(k * a, k * b) + ' = ' + right + '.'], m);
    },
    /* 2.5 constructing and solving equations */
    solve: function (m) {
      var x = m.ri(-3, 9), a = m.ri(2, 7), b = m.ri(1, 15) * m.pick([1, -1]);
      if (m.r() < 0.6) {
        var c = a * x + b;
        return num(2, 'E', 'Solve ' + lin(a, b) + ' = ' + sgn(c) + '.  x = ?', A(x), [
          (b < 0 ? 'Add ' + Math.abs(b) : 'Subtract ' + b) + ' on both sides: ' + a + 'x = ' + sgn(c - b) + '.',
          'Divide both sides by ' + a + ': x = ' + d(x) + '.']);
      }
      var p = a + m.ri(1, 4), q = m.ri(1, 12), rr = p * x + q - a * x;
      return num(2, 'E', 'Solve ' + lin(p, q) + ' = ' + lin(a, rr) + '.  x = ?', A(x), [
        'Take ' + a + 'x from both sides: ' + lin(p - a, q) + ' = ' + sgn(rr) + '.',
        'Take ' + q + ' from both sides: ' + (p - a === 1 ? '' : p - a) + 'x = ' + sgn(rr - q) + '.',
        (p - a === 1 ? 'So x = ' + d(x) + '.' : 'Divide by ' + (p - a) + ': x = ' + d(x) + '.')]);
    },
    /* 2.6 inequalities */
    inequal: function (m) {
      var x = m.ri(-2, 8), a = m.ri(2, 5), b = m.ri(1, 9), sign = m.pick(['<', '>', '≤', '≥']);
      var c = a * x + b;
      var right = 'x ' + sign + ' ' + sgn(x);
      var flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[sign];
      return mc(2, 'F', 'Solve ' + lin(a, b) + ' ' + sign + ' ' + c + '.', right,
        ['x ' + flip + ' ' + sgn(x), 'x ' + sign + ' ' + sgn(x + 1), 'x ' + sign + ' ' + sgn(x + 2), 'x = ' + sgn(x)], [
          'Solve it like an equation, keeping the sign the same.',
          'Subtract ' + b + ': ' + a + 'x ' + sign + ' ' + (c - b) + '.',
          'Divide by ' + a + ': ' + right + '.'], m);
    },
    /* 3.1 multiplying and dividing by 0.1 and 0.01 */
    tenths: function (m) {
      var n = m.pick([m.ri(2, 99), m.ri(11, 99) / 10, m.ri(101, 999) / 10]);
      var by = m.pick([0.1, 0.01]), op = m.pick(['×', '÷']);
      var ans = op === '×' ? n * by : n / by;
      var rule = op === '×' ? (by === 0.1 ? 'Multiplying by 0.1 is the same as dividing by 10.' : 'Multiplying by 0.01 is the same as dividing by 100.')
        : (by === 0.1 ? 'Dividing by 0.1 is the same as multiplying by 10.' : 'Dividing by 0.01 is the same as multiplying by 100.');
      return num(3, 'A', 'Work out ' + d(n) + ' ' + op + ' ' + by + '.', A(ans), [rule, d(n) + ' ' + op + ' ' + by + ' = ' + d(ans) + '.']);
    },
    /* 3.2 rounding */
    rounding: function (m) {
      if (m.r() < 0.5) {
        var x = m.ri(10000, 99999) / 1000, dp = m.pick([1, 2]);
        var ans = Math.round(x * Math.pow(10, dp) + 1e-7) / Math.pow(10, dp);
        return num(3, 'B', 'Round ' + d(x) + ' to ' + dp + ' decimal place' + (dp > 1 ? 's' : '') + '.', ans.toFixed(dp), [
          'Look at the digit after the ' + (dp === 1 ? 'first' : 'second') + ' decimal place.',
          '5 or more rounds up, 4 or less stays the same.', 'So ' + d(x) + ' ≈ ' + ans.toFixed(dp) + '.']);
      }
      var n = m.pick([m.ri(1000, 99999), m.ri(100, 999) / 1000]), sf = m.pick([1, 2]);
      var mag = Math.floor(Math.log10(Math.abs(n))), f = Math.pow(10, mag - sf + 1);
      var ans2 = Math.round(n / f + 1e-7) * f;
      return num(3, 'B', 'Round ' + d(n) + ' to ' + sf + ' significant figure' + (sf > 1 ? 's' : '') + '.', A(ans2), [
        'The first significant figure is the first non-zero digit.',
        'Keep ' + sf + ' significant figure' + (sf > 1 ? 's' : '') + ', look at the next digit to round, then fill the gap with zeros if needed.',
        'So ' + d(n) + ' ≈ ' + d(ans2) + '.']);
    },
    /* 4.2 / 4.3 decimals */
    decimals: function (m) {
      if (m.r() < 0.5) {
        var a = m.ri(2, 9) / 10 * m.pick([1, 10]), b = m.ri(2, 9) / 10;
        var p = a * b;
        return num(4, 'B', 'Work out ' + d(a) + ' × ' + d(b) + '.', A(p), [
          'Ignore the decimal points: ' + Math.round(a * 10) + ' × ' + Math.round(b * 10) + ' = ' + Math.round(a * 10) * Math.round(b * 10) + '.',
          'There are 2 decimal places in the question, so put 2 in the answer: ' + d(p) + '.']);
      }
      var q = m.ri(2, 12), dv = m.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8]), top = q * dv;
      return num(4, 'C', 'Work out ' + d(top) + ' ÷ ' + d(dv) + '.', A(q), [
        'Multiply both numbers by 10 so you divide by a whole number: ' + d(top * 10) + ' ÷ ' + d(dv * 10) + '.',
        d(top * 10) + ' ÷ ' + d(dv * 10) + ' = ' + q + '.']);
    },
    order: function (m) {
      var base = m.ri(1, 8), list = [];
      while (list.length < 4) { var v = base + m.pick([m.ri(1, 9) / 10, m.ri(1, 99) / 100, m.ri(1, 999) / 1000]); v = Math.round(v * 1000) / 1000; if (list.indexOf(v) < 0) list.push(v); }
      var big = Math.max.apply(null, list);
      return mc(4, 'A', 'Which number is the largest?', d(big), list.filter(function (v) { return v !== big; }).map(d), [
        'Line the numbers up by their decimal points.', 'Compare tenths first, then hundredths, then thousandths.', d(big) + ' is the largest.'], m);
    },
    /* 5.1 parallel lines, 5.2 exterior angle */
    angles: function (m) {
      if (m.r() < 0.5) {
        var x = m.ri(35, 80), y = m.ri(30, 85);
        return num(5, 'B', 'In a triangle, two interior angles are ' + x + '° and ' + y + '°. What is the exterior angle at the third corner?', A(x + y), [
          'The exterior angle equals the sum of the two opposite interior angles.', x + '° + ' + y + '° = ' + (x + y) + '°.'], { unit: '°' });
      }
      var a = m.ri(40, 140), kind = m.pick(['alternate', 'corresponding', 'co-interior']);
      if (a === 90) a = 75;
      var ans = kind === 'co-interior' ? 180 - a : a;
      return num(5, 'A', 'Two parallel lines are crossed by a straight line. One angle is ' + a + '°. What is the ' + kind + ' angle to it?', A(ans), [
        kind === 'co-interior' ? 'Co-interior angles add up to 180°.' : (kind === 'alternate' ? 'Alternate angles (Z shape) are equal.' : 'Corresponding angles (F shape) are equal.'),
        kind === 'co-interior' ? '180° − ' + a + '° = ' + ans + '°.' : 'So the angle is ' + ans + '°.'], { unit: '°' });
    },
    /* 6 collecting data */
    data: function (m) {
      var items = [
        ['The number of pets each student has', 'Discrete', ['Continuous', 'Qualitative', 'Neither'], 'You can only count whole pets, so the data is discrete.'],
        ['The heights of plants in a garden', 'Continuous', ['Discrete', 'Qualitative', 'Neither'], 'Height is measured and can take any value, so it is continuous.'],
        ['The time it takes to run 100 m', 'Continuous', ['Discrete', 'Qualitative', 'Neither'], 'Time is measured, so it is continuous.'],
        ['Favourite colours of a class', 'Qualitative', ['Discrete', 'Continuous', 'Neither'], 'Colours are words, not numbers, so the data is qualitative (categorical).'],
        ['Shoe sizes of students', 'Discrete', ['Continuous', 'Qualitative', 'Neither'], 'Shoe sizes only take set values, so they are discrete.']
      ];
      var it = m.pick(items);
      if (m.r() < 0.6) return mc(6, 'A', 'What type of data is this: ' + it[0].toLowerCase() + '?', it[1], it[2], [it[3]], m);
      var s = [
        ['To find what students think of school lunches, Sara asks only her 5 best friends.', 'Biased: the sample is too small and not random', ['A fair random sample', 'Fair, because friends are honest', 'Biased: the questions are too long'], 'Asking only friends is not random and 5 people is too few, so the sample is biased.'],
        ['To survey a school of 600, a teacher picks 60 names at random from the school list.', 'A fair random sample', ['Biased: the sample is too small and not random', 'Biased: only one class is asked', 'Biased: the questions are too long'], 'Every student had an equal chance of being picked, so it is a fair random sample.']
      ];
      var c = m.pick(s);
      return mc(6, 'B', c[0] + ' Which is true?', c[1], c[2], [c[3]], m);
    },
    /* 7 fractions */
    fractions: function (m) {
      var kind = m.ri(0, 3);
      if (kind === 0) {
        var w1 = m.ri(3, 6), w2 = m.ri(1, w1 - 1), den = m.pick([4, 6, 8, 3, 5]), n1, n2;
        do { n1 = m.ri(1, den - 1); n2 = m.ri(1, den - 1); } while (gcd(n1, den) !== 1 || gcd(n2, den) !== 1);
        var ans = frac((w1 * den + n1) - (w2 * den + n2), den);
        var g1 = frac(n1, den), g2 = frac(n2, den);
        return mc(7, 'C', 'Work out ' + w1 + ' ' + g1[0] + '/' + g1[1] + ' − ' + w2 + ' ' + g2[0] + '/' + g2[1] + '.', mixed(ans),
          [mixed(frac(ans[0] + den, den)), mixed(frac(Math.abs((w1 - w2) * den + Math.abs(n1 - n2)), den)), mixed(frac(ans[0] - den > 0 ? ans[0] - den : ans[0] + 2 * den, den)), fs(ans[0] === 0 ? [1, 2] : frac(ans[0] + 1, den))], [
            'Change both to improper fractions over ' + den + ': ' + (w1 * den + n1) + '/' + den + ' − ' + (w2 * den + n2) + '/' + den + '.',
            'Subtract the tops: ' + ((w1 * den + n1) - (w2 * den + n2)) + '/' + den + '.',
            'Simplify and write as a mixed number: ' + mixed(ans) + '.'], m);
      }
      if (kind === 1) {
        var k = m.ri(2, 6), w = m.ri(1, 4), dn = m.pick([2, 3, 4, 5]), nn = m.ri(1, dn - 1);
        var ans1 = frac(k * (w * dn + nn), dn);
        return mc(7, 'D', 'Work out ' + k + ' × ' + w + ' ' + fs(frac(nn, dn)) + '.', mixed(ans1),
          [mixed(frac(k * w * dn + nn, dn)), mixed(frac(k * w * dn + k * nn + dn, dn)), mixed(frac(k * nn, dn)), mixed(frac(ans1[0] + ans1[1], ans1[1]))], [
            'Multiply the whole number part: ' + k + ' × ' + w + ' = ' + (k * w) + '.',
            'Multiply the fraction part: ' + k + ' × ' + fs(frac(nn, dn)) + ' = ' + mixed(frac(k * nn, dn)) + '.',
            'Add them: ' + mixed(ans1) + '.'], m);
      }
      if (kind === 2) {
        var whole = m.ri(2, 12), dd = m.pick([2, 3, 4, 5]), tt = m.ri(1, dd - 1), res = frac(whole * dd, tt);
        return num(7, 'E', 'Work out ' + whole + ' ÷ ' + fs(frac(tt, dd)) + '. (You can type a fraction like 7/2.)', res[1] === 1 ? A(res[0]) : res[0] + '/' + res[1], [
          'Dividing by a fraction is the same as multiplying by its reciprocal (flip it).',
          whole + ' × ' + dd + '/' + tt + ' = ' + (whole * dd) + '/' + tt + '.', 'So the answer is ' + fs(res) + (res[1] === 1 ? '' : ' (= ' + mixed(res) + ')') + '.']);
      }
      var p = m.pick([[1, 3, '0.333…'], [2, 3, '0.666…'], [1, 9, '0.111…'], [5, 9, '0.555…'], [1, 6, '0.1666…'], [5, 6, '0.8333…']]);
      return mc(7, 'A', 'Which decimal is equal to ' + p[0] + '/' + p[1] + '?', p[2], ['0.' + p[0] + p[1], '0.' + p[0], (p[0] / p[1] + 0.1).toFixed(3) + '…', '0.' + p[1]], [
        'Divide ' + p[0] + ' by ' + p[1] + ' (short division).', 'The digits repeat for ever, so it is a recurring decimal: ' + p[2] + '.'], m);
    },
    /* 8.2 circumference */
    circle: function (m) {
      var useR = m.r() < 0.5, v = m.ri(2, 20);
      var dia = useR ? 2 * v : v, c = Math.round(3.14 * dia * 100) / 100;
      return num(8, 'B', 'A circle has a ' + (useR ? 'radius' : 'diameter') + ' of ' + v + ' cm. Use π = 3.14 to find its circumference.', A(c), [
        'Circumference = π × diameter.' + (useR ? ' The diameter is 2 × ' + v + ' = ' + dia + ' cm.' : ''),
        '3.14 × ' + dia + ' = ' + d(c) + ' cm.'], { unit: 'cm' });
    },
    /* 8.1 quadrilaterals and polygons */
    polygons: function (m) {
      var facts = [
        ['Which quadrilateral has exactly one pair of parallel sides?', 'Trapezium', ['Parallelogram', 'Rhombus', 'Kite'], 'A trapezium has exactly one pair of parallel sides.'],
        ['Which quadrilateral has all sides equal but angles that need not be 90°?', 'Rhombus', ['Square', 'Kite', 'Rectangle'], 'A rhombus has four equal sides; its angles do not have to be right angles.'],
        ['Which quadrilateral has two pairs of equal adjacent sides and one line of symmetry?', 'Kite', ['Rhombus', 'Trapezium', 'Parallelogram'], 'A kite has two pairs of equal sides next to each other and one line of symmetry.'],
        ['How many lines of symmetry does a rectangle (not a square) have?', '2', ['4', '1', '0'], 'A rectangle folds onto itself along 2 lines: across the middle both ways.'],
        ['What is the order of rotational symmetry of a parallelogram?', '2', ['1', '4', '0'], 'A parallelogram looks the same twice in a full turn, so the order is 2.']
      ];
      if (m.r() < 0.5) { var f = m.pick(facts); return mc(8, 'A', f[0], f[1], f[2], [f[3]], m); }
      var n = m.pick([5, 6, 8, 9, 10, 12]), sum = (n - 2) * 180;
      var names = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
      return num(8, 'A', 'What is the size of one interior angle of a regular ' + names[n] + ' (' + n + ' sides)?', A(sum / n), [
        'The interior angles of a polygon add up to (n − 2) × 180° = ' + (n - 2) + ' × 180° = ' + sum + '°.',
        'All ' + n + ' angles are equal: ' + sum + ' ÷ ' + n + ' = ' + d(sum / n) + '°.'], { unit: '°' });
    },
    /* 9 sequences and functions */
    nth: function (m) {
      var a = m.ri(2, 7) * m.pick([1, 1, 1, -1]), b = m.ri(-5, 9);
      var terms = [1, 2, 3, 4].map(function (n) { return a * n + b; });
      var seq = terms.map(sgn).join(', ');
      if (m.r() < 0.55) {
        var right = lin(a, b, 'n');
        return mc(9, 'C', 'What is the nth term of the sequence ' + seq + ', …?', right, [lin(a, terms[0], 'n'), lin(b, a, 'n'), lin(a, -b, 'n'), lin(terms[0], a, 'n'), lin(a, b + 1, 'n'), lin(a + 1, b - 1, 'n'), lin(a, b - a, 'n')], [
          'The terms go up by ' + sgn(a) + ' each time, so the rule starts ' + lin(a, 0, 'n') + '.',
          'When n = 1, ' + lin(a, 0, 'n') + ' gives ' + sgn(a) + '. The first term is ' + sgn(terms[0]) + ', so add ' + sgn(b) + '.',
          'The nth term is ' + right + '.'], m);
      }
      var k = m.ri(8, 30);
      return num(9, 'C', 'The nth term of a sequence is ' + lin(a, b, 'n') + '. What is term number ' + k + '?', A(a * k + b), [
        'Put n = ' + k + ' into the rule: ' + a + ' × ' + k + (b < 0 ? ' − ' + Math.abs(b) : (b ? ' + ' + b : '')) + '.', 'The answer is ' + d(a * k + b) + '.']);
    },
    functions: function (m) {
      var a = m.ri(-3, 4), b = m.ri(-5, 8), x = m.ri(-3, 4);
      if (a === 0) a = 2;
      return num(9, 'D', 'For the function y = ' + lin(a, b) + ', what is y when x = ' + sgn(x) + '?', A(a * x + b), [
        'Replace x with ' + sgn(x) + ': y = ' + a + ' × ' + br(x) + (b < 0 ? ' − ' + Math.abs(b) : (b ? ' + ' + b : '')) + '.', 'y = ' + d(a * x + b) + '.']);
    },
    /* 10 percentages */
    percent: function (m) {
      var kind = m.ri(0, 2);
      if (kind === 0) {
        var amt = m.pick([40, 60, 80, 120, 150, 200, 250, 320]), p = m.pick([5, 10, 15, 20, 25, 30, 40]), up = m.r() < 0.5;
        var ans = amt * (up ? 100 + p : 100 - p) / 100;
        return num(10, 'A', (up ? 'Increase' : 'Decrease') + ' RM' + amt + ' by ' + p + '%.', A(ans), [
          p + '% of ' + amt + ' = ' + d(amt * p / 100) + '.',
          (up ? amt + ' + ' : amt + ' − ') + d(amt * p / 100) + ' = ' + d(ans) + '. So the answer is ' + rm(ans) + '.'], { unit: 'RM', unitFirst: true });
      }
      if (kind === 1) {
        var pc = m.pick([3, 8, 12, 15, 20, 35, 5]), inc = m.r() < 0.5, mult = (inc ? 100 + pc : 100 - pc) / 100;
        return num(10, 'B', 'What single number do you multiply by to ' + (inc ? 'increase' : 'decrease') + ' an amount by ' + pc + '%?', A(mult), [
          (inc ? '100% + ' : '100% − ') + pc + '% = ' + (inc ? 100 + pc : 100 - pc) + '%.', 'As a decimal that is ' + d(mult) + '.']);
      }
      var old = m.pick([20, 40, 50, 80, 200, 250]), ch = m.pick([5, 10, 20, 25, 30, 50]), newer = old + old * ch / 100 * (m.r() < 0.6 ? 1 : -1);
      var pchg = (newer - old) / old * 100;
      return num(10, 'A', 'A price changes from RM' + old + ' to ' + rm(newer) + '. What is the percentage ' + (pchg > 0 ? 'increase' : 'decrease') + '?', A(Math.abs(pchg)), [
        'Change = ' + d(Math.abs(newer - old)) + '.', 'Percentage change = change ÷ original × 100 = ' + d(Math.abs(newer - old)) + ' ÷ ' + old + ' × 100 = ' + d(Math.abs(pchg)) + '%.'], { unit: '%' });
    },
    /* 11 graphs: gradient, intercept and reading change in words */
    gradient: function (m) {
      var a = m.ri(-5, 6), b = m.ri(-6, 9);
      if (a === 0) a = 3;
      var kind = m.ri(0, 2);
      if (kind === 0) return num(11, 'C', 'What is the gradient of the line y = ' + lin(a, b) + '?', A(a), ['In y = mx + c, the gradient is m, the number in front of x.', 'So the gradient is ' + d(a) + '.']);
      if (kind === 1) return num(11, 'C', 'Where does the line y = ' + lin(a, b) + ' cross the y-axis? Give the y-intercept.', A(b), ['In y = mx + c, the y-intercept is c.', 'So it crosses the y-axis at ' + d(b) + '.']);
      var c2 = m.ri(-4, 12); if (c2 === b) c2 = b + 3;
      return mc(11, 'C', 'Which line is parallel to y = ' + lin(a, b) + '?', 'y = ' + lin(a, c2), ['y = ' + lin(-a, b), 'y = ' + lin(b === 0 ? a + 1 : b, a), 'y = ' + lin(a + 1, b), 'y = ' + lin(2 * a, b)], [
        'Parallel lines have the same gradient.', 'The gradient of y = ' + lin(a, b) + ' is ' + d(a) + ', so look for ' + lin(a, 0) + ' with any other number added.'], m);
    },
    ratechange: function (m) {
      var s = m.pick([
        { what: 'The depth of water in a tank', u: 'cm', t: 'minute', v: 'h', start: m.ri(80, 200), rate: -m.ri(2, 8) },
        { what: 'The height of a plant', u: 'mm', t: 'day', v: 'h', start: m.ri(10, 40), rate: m.ri(2, 6) },
        { what: 'The money left on a phone card', u: 'sen', t: 'call', v: 'M', start: m.ri(300, 900), rate: -m.ri(15, 40) },
        { what: 'The temperature of an oven', u: '°C', t: 'minute', v: 'T', start: m.ri(20, 30), rate: m.ri(8, 15) }
      ]);
      var eq = s.v + ' = ' + s.start + (s.rate < 0 ? ' − ' : ' + ') + Math.abs(s.rate) + 't';
      var dir = s.rate < 0 ? 'decreases' : 'increases', other = s.rate < 0 ? 'increases' : 'decreases';
      var right = 'It ' + dir + ' by ' + Math.abs(s.rate) + ' ' + s.u + ' each ' + s.t;
      return mc(11, 'D', s.what + ' is ' + eq + ', where t is the number of ' + s.t + 's. How does it change each ' + s.t + '?', right, [
        'It ' + other + ' by ' + Math.abs(s.rate) + ' ' + s.u + ' each ' + s.t, 'It ' + dir + ' by ' + s.start + ' ' + s.u + ' each ' + s.t, 'It ' + other + ' by ' + s.start + ' ' + s.u + ' each ' + s.t], [
          'The number with t is the change each ' + s.t + ': ' + (s.rate < 0 ? MINUS : '+') + Math.abs(s.rate) + '.',
          (s.rate < 0 ? 'The minus sign means it goes down.' : 'The plus sign means it goes up.') + ' Always say the direction as well as the amount.',
          right + '.'], m);
    },
    /* 12 ratio and proportion */
    ratio: function (m) {
      var kind = m.ri(0, 2);
      if (kind === 0) {
        var a, b, k = m.ri(2, 9);
        do { a = m.ri(1, 6); b = m.ri(1, 7); } while (a === b || gcd(a, b) !== 1);
        return mc(12, 'A', 'Write ' + (a * k) + ' : ' + (b * k) + ' in its simplest form.', a + ' : ' + b, [b + ' : ' + a, (a * 2) + ' : ' + (b * 2), (a + 1) + ' : ' + (b + 1), (a * k) + ' : ' + b, a + ' : ' + (b * k)], [
          'Find the highest common factor of ' + (a * k) + ' and ' + (b * k) + ': it is ' + k + '.', 'Divide both parts by ' + k + ': ' + a + ' : ' + b + '.'], m);
      }
      if (kind === 1) {
        var p = m.ri(1, 5), q = m.ri(1, 5), share = m.ri(3, 12), total = (p + q) * share, nm = m.pick(NAMES), nm2 = m.pick(NAMES.filter(function (x) { return x !== nm; }));
        return num(12, 'B', nm + ' and ' + nm2 + ' share RM' + total + ' in the ratio ' + p + ' : ' + q + '. How much does ' + nm + ' get?', A(p * share), [
          'Total parts: ' + p + ' + ' + q + ' = ' + (p + q) + '.', 'One part: ' + total + ' ÷ ' + (p + q) + ' = ' + share + '.', nm + ' gets ' + p + ' × ' + share + ' = RM' + (p * share) + '.'], { unit: 'RM', unitFirst: true });
      }
      var n1 = m.pick([3, 4, 5, 6]), cost1 = n1 * m.pick([2, 3, 4, 5, 1.5, 2.5]), n2 = m.pick([7, 8, 9, 10, 12]);
      var each = cost1 / n1;
      return num(12, 'C', n1 + ' notebooks cost ' + rm(cost1) + '. How much do ' + n2 + ' notebooks cost?', A(each * n2), [
        'Find the cost of one: ' + rm(cost1) + ' ÷ ' + n1 + ' = ' + rm(each) + '.', 'Then ' + n2 + ' cost ' + n2 + ' × ' + rm(each) + ' = ' + rm(each * n2) + '.'], { unit: 'RM', unitFirst: true });
    },
    /* 13 probability, with plenty of "not" questions */
    probnot: function (m) {
      var kind = m.ri(0, 2);
      if (kind === 0) {
        var p = m.ri(5, 85) / 100, col = m.pick(['red', 'blue', 'green', 'yellow']);
        return num(13, 'A', 'The probability that a spinner lands on ' + col + ' is ' + d(p) + '. What is the probability that it does NOT land on ' + col + '?', A(1 - p), [
          'All probabilities add up to 1.', 'P(not ' + col + ') = 1 − ' + d(p) + ' = ' + d(1 - p) + '.']);
      }
      if (kind === 1) {
        var a = m.ri(1, 4) * 5, b = m.ri(1, 6) * 5;
        var pa = a / 100, pb = b / 100;
        return num(13, 'A', 'A spinner has red, blue and other colours. P(red) = ' + d(pa) + ' and P(blue) = ' + d(pb) + '. What is the probability that it lands on neither red nor blue?', A(1 - pa - pb), [
          '"Neither red nor blue" means NOT (red or blue).', 'P(red or blue) = ' + d(pa) + ' + ' + d(pb) + ' = ' + d(pa + pb) + '.',
          'So P(neither) = 1 − ' + d(pa + pb) + ' = ' + d(1 - pa - pb) + '.']);
      }
      var total = m.pick([10, 12, 20, 15]), red = m.ri(2, Math.ceil(total / 2) - 1), notr = frac(total - red, total);
      return mc(13, 'A', 'A bag has ' + total + ' beads. ' + red + ' are red. A bead is taken at random. What is the probability that it is NOT red?', fs(notr), [fs(frac(red, total)), fs(frac(total - red + 1, total)), red + '/' + (total - red), fs(frac(total - red - 1, total))], [
        'There are ' + total + ' − ' + red + ' = ' + (total - red) + ' beads that are not red.', 'P(not red) = ' + (total - red) + '/' + total + (notr[1] !== total ? ' = ' + fs(notr) : '') + '.'], m);
    },
    probtwo: function (m) {
      var kind = m.ri(0, 1);
      if (kind === 0) {
        var target = m.ri(4, 10), ways = 0;
        for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) if (i + j === target) ways++;
        var f = frac(ways, 36);
        return mc(13, 'A', 'Two fair dice are thrown and the scores are added. What is the probability of a total of ' + target + '?', fs(f), [fs(frac(ways + 1, 36)), '1/' + target, fs(frac(ways, 12)), ways + '/6'], [
          'There are 6 × 6 = 36 equally likely outcomes.', 'Totals of ' + target + ': ' + ways + ' ways.', 'P = ' + ways + '/36' + (f[1] !== 36 ? ' = ' + fs(f) : '') + '.'], m);
      }
      var p = m.pick([0.2, 0.25, 0.1, 0.3, 0.05]), trials = m.pick([40, 60, 80, 100, 200]);
      return num(13, 'B', 'The probability that a bus is late is ' + d(p) + '. In ' + trials + ' days, about how many days would you expect the bus to be late?', A(p * trials), [
        'Expected number = probability × number of trials.', d(p) + ' × ' + trials + ' = ' + d(p * trials) + '.']);
    },
    /* 14 position and transformation */
    bearing: function (m) {
      var b = m.ri(1, 35) * 10; if (b === 180) b = 170;
      var back = b >= 180 ? b - 180 : b + 180;
      var pad = function (x) { return ('00' + x).slice(-3); };
      return num(14, 'A', 'The bearing of B from A is ' + pad(b) + '°. What is the bearing of A from B?', pad(back), [
        'A back bearing differs by 180°.', b >= 180 ? pad(b) + '° − 180° = ' + pad(back) + '°.' : pad(b) + '° + 180° = ' + pad(back) + '°.', 'Bearings are always written with three figures.'], { unit: '°' });
    },
    midpoint: function (m) {
      var x1 = m.ri(-4, 8), y1 = m.ri(-4, 8), x2 = x1 + 2 * m.ri(1, 5) * m.pick([1, -1]), y2 = y1 + 2 * m.ri(1, 5) * m.pick([1, -1]);
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      var pt = function (a, b) { return '(' + sgn(a) + ', ' + sgn(b) + ')'; };
      return mc(14, 'B', 'What is the midpoint of the line from ' + pt(x1, y1) + ' to ' + pt(x2, y2) + '?', pt(mx, my), [pt(x2 - x1, y2 - y1), pt(my, mx), pt((x2 - x1) / 2, (y2 - y1) / 2), pt(mx + 1, my)], [
        'Add the x-coordinates and halve: (' + sgn(x1) + ' + ' + sgn(x2) + ') ÷ 2 = ' + d(mx) + '.', 'Do the same for y: (' + sgn(y1) + ' + ' + sgn(y2) + ') ÷ 2 = ' + d(my) + '.', 'Midpoint ' + pt(mx, my) + '.'], m);
    },
    transform: function (m) {
      var x, y;
      do { x = m.ri(1, 6) * m.pick([1, -1]); y = m.ri(1, 6) * m.pick([1, -1]); } while (Math.abs(x) === Math.abs(y));
      var pt = function (a, b) { return '(' + sgn(a) + ', ' + sgn(b) + ')'; };
      var kind = m.ri(0, 2);
      if (kind === 0) return mc(14, 'D', 'The point ' + pt(x, y) + ' is reflected in the y-axis. Where does it go?', pt(-x, y), [pt(x, -y), pt(-x, -y), pt(y, x)], ['Reflecting in the y-axis keeps y the same and changes the sign of x.', 'So ' + pt(x, y) + ' goes to ' + pt(-x, y) + '.'], m);
      if (kind === 1) return mc(14, 'D', 'The point ' + pt(x, y) + ' is reflected in the x-axis. Where does it go?', pt(x, -y), [pt(-x, y), pt(-x, -y), pt(y, x)], ['Reflecting in the x-axis keeps x the same and changes the sign of y.', 'So ' + pt(x, y) + ' goes to ' + pt(x, -y) + '.'], m);
      var len = m.ri(2, 6), k = m.pick([2, 3, 4]);
      return num(14, 'F', 'A shape is enlarged by scale factor ' + k + '. One side was ' + len + ' cm. How long is it now?', A(len * k), ['Every length is multiplied by the scale factor.', len + ' × ' + k + ' = ' + (len * k) + ' cm.'], { unit: 'cm' });
    },
    /* 15.1 miles and kilometres, both ways */
    convert: function (m) {
      var k = m.ri(1, 15) * 5 / 5, toKm = m.r() < 0.5;
      var miles = 5 * m.ri(1, 16), km = miles * 8 / 5;
      if (toKm) return num(15, 'A', 'Convert ' + miles + ' miles into kilometres. (5 miles = 8 km)', A(km), [
        'Miles to km: divide by 5, then multiply by 8.', miles + ' ÷ 5 = ' + (miles / 5) + ', and ' + (miles / 5) + ' × 8 = ' + km + ' km.'], { unit: 'km' });
      return num(15, 'A', 'Convert ' + km + ' km into miles. (5 miles = 8 km)', A(miles), [
        'Km to miles: divide by 8, then multiply by 5. (Km is the bigger number, so the answer in miles is smaller.)', km + ' ÷ 8 = ' + (km / 8) + ', and ' + (km / 8) + ' × 5 = ' + miles + ' miles.'], { unit: 'miles' });
    },
    /* 15.2 parallelogram and trapezium */
    area: function (m) {
      if (m.r() < 0.4) {
        var b = m.ri(4, 15), h = m.ri(3, 12);
        return num(15, 'B', 'A parallelogram has base ' + b + ' cm and perpendicular height ' + h + ' cm. What is its area?', A(b * h), ['Area of a parallelogram = base × perpendicular height.', b + ' × ' + h + ' = ' + (b * h) + ' cm².'], { unit: 'cm²' });
      }
      var a = m.ri(3, 10), c = a + m.ri(2, 8), hh = m.ri(2, 10);
      var ar = (a + c) / 2 * hh;
      return num(15, 'B', 'A trapezium has parallel sides ' + a + ' cm and ' + c + ' cm, and height ' + hh + ' cm. What is its area?', A(ar), [
        'Area of a trapezium = (a + b) ÷ 2 × h.', '(' + a + ' + ' + c + ') ÷ 2 = ' + d((a + c) / 2) + '.', d((a + c) / 2) + ' × ' + hh + ' = ' + d(ar) + ' cm².'], { unit: 'cm²' });
    },
    /* 15.3 / 15.4 triangular prisms */
    prism: function (m) {
      var b = m.pick([3, 4, 6, 5, 8]), h = m.pick([4, 6, 3, 5]), L = m.ri(4, 12);
      var tri = b * h / 2;
      if (m.r() < 0.6) return num(15, 'C', 'A triangular prism has a triangle end with base ' + b + ' cm and height ' + h + ' cm. The prism is ' + L + ' cm long. What is its volume?', A(tri * L), [
        'Area of the triangle = ' + b + ' × ' + h + ' ÷ 2 = ' + d(tri) + ' cm².', 'Volume = area of cross-section × length = ' + d(tri) + ' × ' + L + ' = ' + d(tri * L) + ' cm³.'], { unit: 'cm³' });
      var s = m.pick([[3, 4, 5], [6, 8, 10]]), len = m.ri(4, 10);
      var ends = 2 * (s[0] * s[1] / 2), rect = (s[0] + s[1] + s[2]) * len;
      return num(15, 'D', 'A triangular prism has a right-angled triangle end with sides ' + s.join(' cm, ') + ' cm. It is ' + len + ' cm long. What is its total surface area?', A(ends + rect), [
        'Two triangle ends: 2 × (' + s[0] + ' × ' + s[1] + ' ÷ 2) = ' + ends + ' cm².',
        'Three rectangles: (' + s.join(' + ') + ') × ' + len + ' = ' + rect + ' cm².', 'Total = ' + ends + ' + ' + rect + ' = ' + (ends + rect) + ' cm².'], { unit: 'cm²' });
    },
    /* 16 interpreting and discussing results */
    stats: function (m) {
      var n = m.pick([5, 6, 7]), vals = [];
      for (var i = 0; i < n; i++) vals.push(m.ri(2, 20));
      var sorted = vals.slice().sort(function (a, b) { return a - b; });
      var kind = m.ri(0, 2), list = vals.join(', ');
      if (kind === 0) {
        var sum = vals.reduce(function (s, v) { return s + v; }, 0);
        if (sum % n) { vals[0] += n - (sum % n); sum = vals.reduce(function (s, v) { return s + v; }, 0); list = vals.join(', '); }
        return num(16, 'F', 'Find the mean of: ' + list + '.', A(sum / n), ['Add them: ' + vals.join(' + ') + ' = ' + sum + '.', 'Divide by how many there are: ' + sum + ' ÷ ' + n + ' = ' + d(sum / n) + '.']);
      }
      if (kind === 1) {
        var med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        return num(16, 'F', 'Find the median of: ' + list + '.', A(med), ['Put them in order: ' + sorted.join(', ') + '.',
          n % 2 ? 'The middle value is ' + d(med) + '.' : 'The middle two are ' + sorted[n / 2 - 1] + ' and ' + sorted[n / 2] + '. Halfway between is ' + d(med) + '.']);
      }
      return num(16, 'F', 'Find the range of: ' + list + '.', A(sorted[n - 1] - sorted[0]), ['Range = largest − smallest.', sorted[n - 1] + ' − ' + sorted[0] + ' = ' + (sorted[n - 1] - sorted[0]) + '.']);
    },
    piechart: function (m) {
      var total = m.pick([36, 60, 90, 120, 180, 30, 72]), part = m.ri(1, Math.floor(total / 3));
      var ang = part / total * 360;
      if (Math.round(ang) !== ang) { part = total / 6; ang = 60; }
      return num(16, 'D', 'In a survey of ' + total + ' students, ' + part + ' chose netball. What angle would netball have on a pie chart?', A(ang), [
        'A full pie chart is 360°.', 'Each student is 360 ÷ ' + total + ' = ' + d(360 / total) + '°.', part + ' × ' + d(360 / total) + ' = ' + d(ang) + '°.'], { unit: '°' });
    }
  };

  var DEFAULT_PRACTICE = Object.keys(T);

  function makeSet(seed, count, practice) {
    var pool = [];
    (practice && practice.length ? practice : DEFAULT_PRACTICE.map(function (t) { return { topic: t, w: 1 }; })).forEach(function (p) {
      var t = typeof p === 'string' ? p : p.topic;
      var w = typeof p === 'string' ? 1 : Math.max(1, Math.min(5, Number(p.w) || 1));
      if (T[t]) for (var i = 0; i < w; i++) pool.push(t);
    });
    if (!pool.length) pool = DEFAULT_PRACTICE.slice();
    var r = rngFrom(seed), m = maker(r);
    var qs = [], seen = {}, guard = 0;
    while (qs.length < count && guard < count * 30) {
      guard++;
      var topic = pool[Math.floor(r() * pool.length)];
      if (qs.length && qs[qs.length - 1].topic === topic && pool.length > 1 && guard < count * 15) continue;
      var q = T[topic](m);
      if (seen[q.q]) continue;
      seen[q.q] = 1;
      q.topic = topic;
      q.id = 'g-' + seed + '-q' + (qs.length + 1);
      q.generated = true;
      qs.push(q);
    }
    return qs;
  }

  root.DaniaGen = { makeSet: makeSet, topics: Object.keys(T), _T: T, _maker: maker, _rng: rngFrom };
})(typeof window !== 'undefined' ? window : globalThis);
