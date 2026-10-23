/* ============================================================
   必修第三册 · 第 2 章 静电场中的能量
   ============================================================ */
(function () {

const K = 9e9;
const EPS0 = 8.854e-12;
const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function powStr(v) {
  if (!isFinite(v) || Math.abs(v) < 1e-12) return '0';
  const e = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, e);
  let n = Math.abs(e), es = '';
  if (n === 0) es = '⁰';
  while (n > 0) { es = SUP[n % 10] + es; n = Math.floor(n / 10); }
  return f2(m) + '×10' + (e < 0 ? '⁻' : '') + es;
}
function signCharge(p, pos, r, label) {
  const c = pos ? '#ff8f6b' : '#6cb6ff';
  circleAt(p, r, pos ? 'rgba(255,143,107,.16)' : 'rgba(108,182,255,.16)', c, {w: 2});
  sans(pos ? '+' : '−', X(p.x), Y(p.y) + 1, c, 20, 'center');
  if (label) sans(label, X(p.x), Y(p.y + r + .28), c, 11);
}
function plateV(x, y0, y1, pos, h) {
  const c = pos ? '#ff8f6b' : '#6cb6ff';
  line({x: x, y: y0}, {x: x, y: y1}, c, {w: 3.2});
  const n = 6;
  for (let i = 0; i < n; i++) {
    const y = y0 + (y1 - y0) * (i + .5) / n;
    sans(pos ? '+' : '−', X(x) + (pos ? 15 : -15), Y(y), c, 13);
  }
}

/* ---------- 01 电势能与电势 ---------- */
MODULES.push({
  key: 'potential', tab: '01', name: '电势与电势能', en: 'POTENTIAL', blurb: '能量随位置变',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '拖动试探电荷，比较不同位置的电势、电势能与库仑力',
  state: {Q: 2, q: 1, r: 8, showEq: true, showLines: true},
  reset() { const s = this.state; s.Q = 2; s.q = 1; s.r = 8; s.showEq = true; s.showLines = true; },
  meta() {
    return {
      title: '电势能与电势由电场和位置共同决定',
      desc: '场源电荷 Q 周围存在电场，把试探电荷 q 放在不同位置，它具有不同的电势能。拖动试探电荷改变距离，比较电势 φ、电势能 Ep 与库仑力的变化，注意电势由场源决定，与试探电荷无关。',
      formula: 'φ = kQ/r，E<sub>p</sub> = qφ',
      note: '电势沿电场线方向<b>逐渐降低</b>；Ep 的正负由 q 的正负决定。r 越大，φ 越小但不会为零。'
    };
  },
  phi() { return K * (this.state.Q * 1e-6) / (this.state.r / 100); },
  ep() { return (this.state.q * 1e-6) * this.phi(); },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const O = {x: 0, y: 0};
    const rw = s.r / 5;

    if (s.showLines) {
      const LB = lim();
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2;
        const ux = Math.cos(a), uy = Math.sin(a);
        const pts = [];
        for (let rr = .45; rr < 7; rr += .16) {
          const xx = ux * rr, yy = uy * rr;
          if (xx < LB.x0 || xx > LB.x1 || yy < LB.y0 || yy > LB.y1) break;
          pts.push({x: xx, y: yy});
        }
        if (pts.length < 3) continue;
        path(pts, 'rgba(255,197,107,.32)', {w: 1.2});
        arrow(pts[pts.length - 4], pts[pts.length - 1], 'rgba(255,210,140,.7)', {w: 1.2, head: 7});
      }
    }
    if (s.showEq) {
      for (let k = 1; k <= 3; k++) {
        const rr = k * 1.35;
        const pts = [];
        for (let a = 0; a <= 60; a++) {
          const t = a / 60 * Math.PI * 2;
          pts.push({x: Math.cos(t) * rr, y: Math.sin(t) * rr});
        }
        path(pts, 'rgba(94,234,212,.38)', {w: 1.1, dash: [5, 6]});
        const ph = K * (s.Q * 1e-6) / (rr * .05);
        sans(f1(ph / 1000) + ' kV', X(rr * .72) + 4, Y(rr * .72) - 4, 'rgba(126,236,214,.7)', 10, 'left');
      }
    }

    signCharge(O, s.Q >= 0, .34, 'Q = ' + f1(s.Q) + ' μC');
    line(O, {x: rw, y: 0}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});

    const P = {x: rw, y: 0};
    const pos = s.q >= 0;
    signCharge(P, pos, .23, '');
    handle(P, pos ? '#ff8f6b' : '#6cb6ff', hoverId === 'P');
    sans('q = ' + (s.q > 0 ? '+' : '') + f1(s.q) + ' μC', X(P.x), Y(P.y + .5), pos ? '#ffb08a' : '#a8d0ff', 11);

    const F = K * (s.Q * 1e-6) * (s.q * 1e-6) / Math.pow(s.r / 100, 2);
    const len = clamp(.4 + 1.5 * Math.sqrt(Math.abs(F) / 1.2), .4, 1.7);
    const dir = s.q * s.Q >= 0 ? 1 : -1;
    if (Math.abs(F) > 1e-3) {
      arrow(P, {x: P.x + dir * len, y: 0}, '#b49cff', {w: 2.4, head: 11});
      sans('F', X(P.x + dir * len) + dir * 10, Y(0) - 14, '#c8baff', 12);
    }

    sans('φ = ' + f1(this.phi() / 1000) + ' kV', X(0), Y(-2.3), '#7ef0dc', 15);
    sans('Ep = ' + f2(this.ep()) + ' J', X(0), Y(-2.95), '#ffd79a', 15);
    sans('r = ' + f1(s.r) + ' cm', X(rw / 2), Y(.28), 'rgba(210,225,235,.75)', 11);
    sans('电势沿电场线方向降低', X(lim().x0) + 8, Y(3.7), 'rgba(180,210,220,.6)', 10.5, 'left');
  },
  handles() { return [{id: 'P', x: this.state.r / 5, y: 0}]; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.r = clamp(5 * Math.max(.4, Math.hypot(q.x, q.y)), 4, 28);
  },
  hud() {
    const s = this.state;
    const F = K * (s.Q * 1e-6) * (s.q * 1e-6) / Math.pow(s.r / 100, 2);
    return [
      {k: '电势 φ', v: f1(this.phi() / 1000) + ' kV', hi: true},
      {k: '电势能 Ep', v: f2(this.ep()) + ' J', hi: true},
      {k: '库仑力大小', v: f2(Math.abs(F)) + ' N'},
      {k: '距离 r', v: f1(s.r) + ' cm'},
      {k: '试探电荷 q', v: (s.q > 0 ? '+' : '') + f1(s.q) + ' μC'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '场源电荷 Q / μC', 1, 5, .5, s.Q, v => f1(v), v => s.Q = v);
    addSlider(el, '试探电荷 q / μC', -2, 2, .5, s.q, v => f1(v), v => s.q = v);
    addSlider(el, '距离 r / cm', 4, 28, 1, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '显示等势面', s.showEq, v => s.showEq = v);
    addToggle(el, '显示电场线', s.showLines, v => s.showLines = v);
  }
});

/* ---------- 02 电势差与等势面 ---------- */
MODULES.push({
  key: 'diff', tab: '02', name: '电势差', en: 'POTENTIAL DIFFERENCE', blurb: '两点之间的差',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '拖动 A、B 两点，比较电势差与电场力做的功',
  state: {E: 500, q: 2, A: {x: -1.5, y: -1.0}, B: {x: 1.7, y: 1.1}, showEq: true, showD: true},
  reset() {
    const s = this.state;
    s.E = 500; s.q = 2; s.A = {x: -1.5, y: -1.0}; s.B = {x: 1.7, y: 1.1};
    s.showEq = true; s.showD = true;
  },
  meta() {
    return {
      title: '电势差等于电场力做功与电荷量之比',
      desc: '匀强电场中，A、B 两点的电势差 UAB 只由电场和两点位置决定，与移动的电荷无关。拖动 A、B 改变位置，观察电势差、电场力做功与路径无关，只与始末位置有关。',
      formula: 'U<sub>AB</sub> = φ<sub>A</sub> − φ<sub>B</sub>，W<sub>AB</sub> = qU<sub>AB</sub>',
      note: '沿电场线方向电势降低，所以 φ<sub>A</sub> > φ<sub>B</sub> 时 U<sub>AB</sub> > 0。电场力做正功，电势能减少。'
    };
  },
  uab() { return this.state.E * (this.state.B.x - this.state.A.x) * .05; },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    plateV(-2.95, -2.1, 2.1, true);
    plateV(2.95, -2.1, 2.1, false);
    for (let i = 0; i < 8; i++) {
      const y = -2.0 + i * .57;
      arrow({x: -2.86, y: y}, {x: 2.86, y: y}, 'rgba(123,224,192,.32)', {w: 1.2, head: 7});
    }
    if (s.showEq) {
      for (let i = 0; i <= 5; i++) {
        const x = -2.4 + i * 0.96;
        line({x: x, y: -2.05}, {x: x, y: 2.05}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 5]});
      }
      sans('虚线：等势面', X(-2.3), Y(2.45), 'rgba(190,215,225,.55)', 10, 'left');
    }

    const A = s.A, B = s.B;
    if (s.showD) {
      line({x: A.x, y: A.y}, {x: B.x, y: A.y}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      line({x: B.x, y: A.y}, {x: B.x, y: B.y}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      arrow(A, B, '#ffc56b', {w: 2.4, head: 12});
      sans('d', X((A.x + B.x) / 2), Y(A.y) - 16, '#ffd79a', 14);
    }
    dot(A, '#7be0c0', 6);
    sans('A', X(A.x) - 12, Y(A.y) + 4, '#8fe9d8', 13, 'right');
    dot(B, '#ffc56b', 6);
    sans('B', X(B.x) + 12, Y(B.y) + 4, '#ffd79a', 13, 'left');
    handle(A, '#7be0c0', hoverId === 'A');
    handle(B, '#ffc56b', hoverId === 'B');

    const u = this.uab();
    sans('UAB = ' + f1(u) + ' V', X(0), Y(-2.6), '#8fe9d8', 15);
    sans('φA ' + (u > 0 ? '高于' : '低于') + ' φB', X(0), Y(-3.15), 'rgba(190,215,225,.65)', 11);
  },
  handles() { return [{id: 'A', x: this.state.A.x, y: this.state.A.y}, {id: 'B', x: this.state.B.x, y: this.state.B.y}]; },
  drag(id, p) {
    const q = clampPt(p);
    if (id === 'A') this.state.A = {x: clamp(q.x, -2.7, 2.7), y: clamp(q.y, -1.95, 1.95)};
    else this.state.B = {x: clamp(q.x, -2.7, 2.7), y: clamp(q.y, -1.95, 1.95)};
  },
  hud() {
    const s = this.state;
    const u = this.uab();
    const w = (s.q * 1e-6) * u * 1000;
    const d = Math.hypot(s.B.x - s.A.x, s.B.y - s.A.y) * .05;
    return [
      {k: '电势差 UAB', v: f1(u) + ' V', hi: true},
      {k: '电场力做功 W', v: f2(w) + ' mJ', hi: true},
      {k: '场强 E', v: s.E.toFixed(0) + ' V/m'},
      {k: '两点距离', v: f2(d) + ' m'},
      {k: '电荷量 q', v: f1(s.q) + ' μC'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '场强 E / (V/m)', 100, 1000, 50, s.E, v => v.toFixed(0), v => s.E = v);
    addSlider(el, '电荷量 q / μC', -5, 5, .5, s.q, v => f1(v), v => s.q = v);
    addToggle(el, '显示等势面', s.showEq, v => s.showEq = v);
    addToggle(el, '显示位移与投影', s.showD, v => s.showD = v);
    addBtn(el, 'A、B 回到默认位置', () => { s.A = {x: -1.5, y: -1.0}; s.B = {x: 1.7, y: 1.1}; }, 'ghost');
  }
});

/* ---------- 03 匀强电场 U = Ed ---------- */
MODULES.push({
  key: 'ud', tab: '03', name: 'U = Ed', en: 'UNIFORM FIELD', blurb: '电压与场强',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '改变板间电压与板间距，观察场强怎样变化',
  state: {U: 300, d: 6, showLines: true, showEq: false},
  reset() { const s = this.state; s.U = 300; s.d = 6; s.showLines = true; s.showEq = false; },
  meta() {
    return {
      title: '匀强电场中 U = Ed',
      desc: '两块平行金属板之间形成匀强电场，板间电势差 U 与场强 E、板间距 d 满足 U = Ed。增大电压或减小板距，观察电场线与场强大小的变化，理解「单位长度上的电势降落」。',
      formula: 'E = U / d（d 为沿场强方向的距离）',
      note: '公式中 d 必须是<b>沿电场方向</b>的距离。板距不变时，电压越高场强越大；电压不变时，板距越小场强越大。'
    };
  },
  field() { return this.state.U / (this.state.d / 100); },
  draw() {
    const s = this.state;
    setFrame(.5, .52, 14);
    base();
    const gap = s.d * .4;
    const xL = -gap / 2, xR = gap / 2;

    if (s.showLines) {
      for (let i = 0; i < 7; i++) {
        const y = -1.8 + i * .6;
        arrow({x: xL + .07, y: y}, {x: xR - .07, y: y}, 'rgba(108,182,255,.45)', {w: 1.3, head: 8});
      }
    }
    if (s.showEq) {
      for (let i = 0; i <= 4; i++) {
        const x = xL + (xR - xL) * i / 4;
        line({x: x, y: -1.9}, {x: x, y: 1.9}, 'rgba(255,255,255,.15)', {w: 1, dash: [4, 5]});
      }
      sans('等势面', X(xR) + 10, Y(2.15), 'rgba(200,220,230,.6)', 10, 'left');
    }

    plateV(xL, -2.1, 2.1, true);
    plateV(xR, -2.1, 2.1, false);

    line({x: xL, y: -2.35}, {x: xR, y: -2.35}, 'rgba(255,255,255,.3)', {w: 1});
    line({x: xL, y: -2.28}, {x: xL, y: -2.42}, 'rgba(255,255,255,.45)', {w: 1});
    line({x: xR, y: -2.28}, {x: xR, y: -2.42}, 'rgba(255,255,255,.45)', {w: 1});
    sans('d = ' + f1(s.d) + ' cm', X(0), Y(-2.62), 'rgba(200,225,235,.85)', 12);

    line({x: xL, y: -1.9}, {x: xL, y: -3.2}, 'rgba(200,225,235,.35)', {w: 1.2, dash: [4, 4]});
    line({x: xR, y: -1.9}, {x: xR, y: -3.2}, 'rgba(200,225,235,.35)', {w: 1.2, dash: [4, 4]});
    line({x: xL, y: -3.05}, {x: 0, y: -3.05}, 'rgba(200,225,235,.35)', {w: 1.2});
    line({x: 0, y: -3.05}, {x: xR, y: -3.05}, 'rgba(200,225,235,.35)', {w: 1.2});
    line({x: -.14, y: -3.28}, {x: -.14, y: -2.84}, '#dfe9ee', {w: 2.4});
    line({x: .14, y: -3.16}, {x: .14, y: -2.96}, '#dfe9ee', {w: 2.4});
    sans('U = ' + s.U.toFixed(0) + ' V', X(0) + 26, Y(-3.05), '#dfe9ee', 12, 'left');

    sans('E = ' + this.field().toFixed(0) + ' V/m', X(0), Y(2.55), '#a8d0ff', 16);
    sans('U = Ed', X(0), Y(3.1), 'rgba(200,225,235,.8)', 14);
  },
  hud() {
    const s = this.state;
    const E = this.field();
    return [
      {k: '板间电压 U', v: s.U.toFixed(0) + ' V', hi: true},
      {k: '板间距 d', v: f1(s.d) + ' cm'},
      {k: '场强 E', v: E.toFixed(0) + ' V/m', hi: true},
      {k: '每厘米电势降落', v: (E / 100).toFixed(0) + ' V/cm'},
      {k: '电场性质', v: '匀强电场'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电压 U / V', 100, 1000, 50, s.U, v => v.toFixed(0), v => s.U = v);
    addSlider(el, '板间距 d / cm', 2, 10, .5, s.d, v => f1(v), v => s.d = v);
    addToggle(el, '显示电场线', s.showLines, v => s.showLines = v);
    addToggle(el, '显示等势面', s.showEq, v => s.showEq = v);
    addBtn(el, '恢复默认', () => { s.U = 300; s.d = 6; }, 'ghost');
  }
});

/* ---------- 04 电容器与电容 ---------- */
MODULES.push({
  key: 'capacitor', tab: '04', name: '电容器', en: 'CAPACITOR', blurb: '储存电荷',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变电压、正对面积与板间距，观察电容与电荷量的变化',
  state: {U: 200, S: 100, d: 4, diel: false, showField: true},
  reset() { const s = this.state; s.U = 200; s.S = 100; s.d = 4; s.diel = false; s.showField = true; },
  meta() {
    return {
      title: '电容由电容器本身决定',
      desc: '平行板电容器的电容与正对面积成正比、与板间距成反比，插入电介质会增大电容。调节电压、面积和板距，观察电容、极板电荷与板间场强如何变化，理解 C = Q/U 的含义。',
      formula: 'C = ε<sub>r</sub>ε<sub>0</sub>S / d，Q = CU',
      note: '电容是电容器<b>本身的性质</b>，与是否带电无关。接在电源上时 U 不变，插入电介质后 Q 增大。'
    };
  },
  cap() {
    const s = this.state;
    const er = s.diel ? 3 : 1;
    return er * EPS0 * (s.S * 1e-4) / (s.d * 1e-3);
  },
  draw() {
    const s = this.state;
    setFrame(.5, .5, 14);
    base();
    const gap = s.d * .35;
    const xL = -gap / 2, xR = gap / 2;
    const hh = 1.2 + (s.S - 50) / 150 * .7;
    const y0 = -hh, y1 = hh;

    if (s.diel) {
      rect({x: xL + .03, y: y0}, {x: xR - .03, y: y1}, 'rgba(180,156,255,.14)', 'rgba(180,156,255,.35)', {w: 1, dash: [4, 4]});
      sans('电介质 εr = 3', X(0), Y(0), 'rgba(205,190,255,.9)', 12);
    } else {
      sans('真空 εr = 1', X(0), Y(0), 'rgba(180,200,215,.45)', 11);
    }

    if (s.showField) {
      for (let i = 0; i < 6; i++) {
        const y = y0 + (y1 - y0) * (i + .5) / 6;
        arrow({x: xL + .05, y: y}, {x: xR - .05, y: y}, 'rgba(123,224,192,.5)', {w: 1.2, head: 7});
      }
    }
    line({x: xL, y: y0}, {x: xL, y: y1}, '#ff8f6b', {w: 5});
    line({x: xR, y: y0}, {x: xR, y: y1}, '#6cb6ff', {w: 5});
    for (let i = 0; i < 5; i++) {
      const y = y0 + (y1 - y0) * (i + .5) / 5;
      sans('+', X(xL) - 13, Y(y), '#ff8f6b', 13);
      sans('−', X(xR) + 13, Y(y), '#6cb6ff', 13);
    }

    line({x: xL, y: y1}, {x: xL, y: 2.55}, 'rgba(210,230,240,.5)', {w: 1.4});
    line({x: xR, y: y1}, {x: xR, y: 2.55}, 'rgba(210,230,240,.5)', {w: 1.4});
    line({x: xL, y: 2.55}, {x: -.2, y: 2.55}, 'rgba(210,230,240,.5)', {w: 1.4});
    line({x: .2, y: 2.55}, {x: xR, y: 2.55}, 'rgba(210,230,240,.5)', {w: 1.4});
    line({x: -.2, y: 2.3}, {x: -.2, y: 2.8}, '#dfe9ee', {w: 2.2});
    line({x: .2, y: 2.42}, {x: .2, y: 2.68}, '#dfe9ee', {w: 2.2});
    sans('U = ' + s.U.toFixed(0) + ' V', X(0), Y(2.15), '#dfe9ee', 12);

    sans('S = ' + s.S.toFixed(0) + ' cm²', X(xL) - 16, Y(y1 + .3), 'rgba(255,190,160,.8)', 11, 'right');
    line({x: xL, y: y0 - .3}, {x: xR, y: y0 - .3}, 'rgba(255,255,255,.3)', {w: 1});
    sans('d = ' + f1(s.d) + ' mm', X(0), Y(y0 - .62), 'rgba(200,225,235,.8)', 11);
  },
  hud() {
    const s = this.state, C = this.cap();
    return [
      {k: '电容 C', v: (C * 1e12).toFixed(1) + ' pF', hi: true},
      {k: '电荷量 Q', v: (C * s.U * 1e9).toFixed(1) + ' nC', hi: true},
      {k: '电压 U', v: s.U.toFixed(0) + ' V'},
      {k: '场强 E', v: (s.U / (s.d / 1000) / 1000).toFixed(1) + ' kV/m'},
      {k: '电介质 εr', v: s.diel ? '3（插入）' : '1（真空）'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电压 U / V', 50, 500, 10, s.U, v => v.toFixed(0), v => s.U = v);
    addSlider(el, '正对面积 S / cm²', 50, 200, 10, s.S, v => v.toFixed(0), v => s.S = v);
    addSlider(el, '板间距 d / mm', 2, 8, .5, s.d, v => f1(v), v => s.d = v);
    addToggle(el, '插入电介质', s.diel, v => s.diel = v);
    addToggle(el, '显示电场线', s.showField, v => s.showField = v);
  }
});

/* ---------- 05 带电粒子在电场中的加速 ---------- */
MODULES.push({
  key: 'accelerate', tab: '05', name: '电场加速', en: 'ACCELERATION', blurb: 'qU = ½mv²',
  accent: '#ff8f6b', rgb: '255,143,107',
  hint: '改变加速电压或粒子种类，观察末速度与动能',
  playable: true,
  state: {U: 500, kind: 0, t: 0, playing: true, showV: true, trail: []},
  reset() {
    const s = this.state;
    s.U = 500; s.kind = 0; s.t = 0; s.playing = true; s.showV = true; s.trail = [];
  },
  kinds() {
    return [
      {n: '质子', q: 1.602e-19, m: 1.673e-27, c: '#ff8f6b'},
      {n: '电子', q: 1.602e-19, m: 9.109e-31, c: '#6cb6ff'},
      {n: 'α粒子', q: 3.204e-19, m: 6.645e-27, c: '#ffd166'}
    ];
  },
  meta() {
    return {
      title: '电场加速：qU = ½mv²',
      desc: '带电粒子在两块平行金属板间被电场加速，电场力做功 qU 转化为粒子的动能。改变加速电压或选择质子、电子、α 粒子，观察末速度与动能的差异，体会比荷对加速效果的影响。',
      formula: 'qU = ½mv<sup>2</sup>，v = √(2qU/m)',
      note: '加速电压相同时，<b>比荷 q/m 越大，末速度越大</b>；电子比质子轻得多，更容易被加速到高速。'
    };
  },
  kin() { return this.kinds()[this.state.kind]; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      if (s.t > 2.1) { s.t = 0; s.trail = []; }
    }
    setFrame(.5, .5, 14);
    base();
    const k = this.kin();
    const vmax = Math.sqrt(2 * k.q * s.U / k.m);
    const prog = clamp(.5 * .9 * s.t * s.t, 0, 1);
    const x = -2.55 + 5.1 * prog;
    const v = vmax * Math.sqrt(prog);

    if (s.playing && prog > .01) {
      s.trail.push({x: x, y: .4});
      if (s.trail.length > 90) s.trail.shift();
    }

    for (let i = 0; i < 7; i++) {
      const y = -1.9 + i * .63;
      arrow({x: -2.48, y: y}, {x: 2.48, y: y}, 'rgba(255,143,107,.3)', {w: 1.2, head: 7});
    }
    line({x: -2.55, y: -2.1}, {x: -2.55, y: 2.1}, '#ff8f6b', {w: 2.2});
    line({x: 2.55, y: -2.1}, {x: 2.55, y: 2.1}, '#6cb6ff', {w: 2.2});
    for (let i = 0; i < 6; i++) {
      const y = -1.75 + i * .7;
      sans('+', X(-2.55) - 13, Y(y), '#ff8f6b', 12);
      sans('−', X(2.55) + 13, Y(y), '#6cb6ff', 12);
    }
    sans('U = ' + s.U.toFixed(0) + ' V', X(0), Y(2.55), '#ffd7c4', 14);

    if (s.trail.length > 2) path(s.trail, 'rgba(255,214,170,.4)', {w: 2});
    dot({x: x, y: .4}, k.c, 6);
    sans(k.n, X(x), Y(.4) - 30, k.c, 11.5);

    if (s.showV && v > 0) {
      const l = clamp(.4 + 1.2 * Math.sqrt(v / vmax), .4, 1.6);
      arrow({x: x + .16, y: .4}, {x: x + .16 + l, y: .4}, '#7be0c0', {w: 2.2, head: 10});
      sans('v', X(x + .16 + l), Y(.4) + 26, '#8fe9d8', 13);
    }

    const barW = 8;
    rect({x: -4, y: -2.95}, {x: 4, y: -2.6}, 'rgba(255,255,255,.06)', 'rgba(200,225,235,.2)', {w: 1});
    rect({x: -4, y: -2.95}, {x: -4 + barW * prog, y: -2.6}, 'rgba(123,224,192,.35)', 'rgba(123,224,192,.6)', {w: 1});
    sans('动能 Ek = qU·(x/d)', X(0), Y(-3.25), 'rgba(190,215,225,.65)', 10.5);
    sans('Ek = ' + (k.q * s.U / 1.602e-19).toFixed(0) + ' eV', X(4) + 12, Y(-2.78), '#8fe9d8', 11, 'left');
  },
  hud() {
    const s = this.state, k = this.kin();
    const vmax = Math.sqrt(2 * k.q * s.U / k.m);
    const tReal = Math.sqrt(.02 * k.m / (k.q * s.U));
    return [
      {k: '加速电压 U', v: s.U.toFixed(0) + ' V', hi: true},
      {k: '末速度 v', v: powStr(vmax) + ' m/s', hi: true},
      {k: '末动能 Ek', v: (k.q * s.U / 1.602e-19).toFixed(0) + ' eV'},
      {k: '加速时间', v: (tReal * 1e9).toFixed(0) + ' ns'},
      {k: '粒子', v: k.n}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '加速电压 U / V', 100, 1000, 50, s.U, v => v.toFixed(0), v => { s.U = v; s.t = 0; s.trail = []; });
    addSeg(el, ['质子', '电子', 'α'], s.kind, i => { s.kind = i; s.t = 0; s.trail = []; });
    addToggle(el, '显示速度矢量', s.showV, v => s.showV = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '重新发射', () => { s.t = 0; s.trail = []; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
