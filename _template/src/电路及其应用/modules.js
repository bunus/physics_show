/* ============================================================
   必修第三册 · 第 3 章 电路及其应用
   ============================================================ */
(function () {

const RHO = [
  {n: '铜', rho: 1.7e-8, c: '#ffb27a'},
  {n: '铝', rho: 2.8e-8, c: '#c9d4dc'},
  {n: '镍铬合金', rho: 1.1e-6, c: '#a8b8c8'}
];

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function fR(v) {
  if (!isFinite(v)) return '—';
  if (v >= 100) return v.toFixed(0);
  if (v >= 1) return v.toFixed(2);
  return v.toFixed(3);
}
function wire(a, b) {
  line(a, b, 'rgba(200,225,235,.5)', {w: 1.7});
}
function cellV(x, y) {
  line({x: x - .3, y: y + .14}, {x: x + .3, y: y + .14}, '#e8f2f4', {w: 2.6});
  line({x: x - .15, y: y - .16}, {x: x + .15, y: y - .16}, '#e8f2f4', {w: 2.6});
}
function cellH(x, y) {
  line({x: x - .16, y: y - .32}, {x: x - .16, y: y + .32}, '#e8f2f4', {w: 2.6});
  line({x: x + .14, y: y - .16}, {x: x + .14, y: y + .16}, '#e8f2f4', {w: 2.6});
}
function resBox(cx, cy, w, h, label, color) {
  rect({x: cx - w / 2, y: cy - h / 2}, {x: cx + w / 2, y: cy + h / 2},
    'rgba(11,24,40,.95)', color, {w: 1.7});
  sans(label, X(cx), Y(cy), color, 11.5);
}
function meter(c, r, label, color) {
  circleAt(c, r, 'rgba(11,24,40,.95)', color, {w: 1.8});
  sans(label, X(c.x), Y(c.y) + 1, color, 14);
}

/* ---------- 01 欧姆定律与 U-I 图 ---------- */
MODULES.push({
  key: 'ohm', tab: '01', name: '欧姆定律', en: 'OHM LAW', blurb: '电压与电流',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '调节电压与电阻，观察电流表读数与 U-I 图工作点',
  playable: true,
  state: {R: 6, U: 6, phase: 0, playing: true, showGraph: true},
  reset() { const s = this.state; s.R = 6; s.U = 6; s.phase = 0; s.playing = true; s.showGraph = true; },
  perimeter() {
    return [{x: -6, y: -1.7}, {x: -1.4, y: -1.7}, {x: -1.4, y: 1.7}, {x: -6, y: 1.7}, {x: -6, y: -1.7}];
  },
  at(f) {
    const p = this.perimeter();
    let total = 0, segs = [];
    for (let i = 1; i < p.length; i++) {
      const L = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
      segs.push(L); total += L;
    }
    let d = ((f % 1) + 1) % 1 * total;
    for (let i = 0; i < segs.length; i++) {
      if (d <= segs[i]) {
        const t = segs[i] < 1e-6 ? 0 : d / segs[i];
        return {x: p[i].x + (p[i + 1].x - p[i].x) * t, y: p[i].y + (p[i + 1].y - p[i].y) * t};
      }
      d -= segs[i];
    }
    return p[0];
  },
  meta() {
    return {
      title: '欧姆定律：I = U / R',
      desc: '导体中的电流与两端电压成正比、与电阻成反比。调节电压和电阻，观察电流读数与 U-I 图上的工作点怎样移动，理解图线的斜率就是电阻，并注意电压、电流、电阻的单位。',
      formula: 'I = U / R，U = IR',
      note: '同一导体的 U-I 图是<b>过原点的直线</b>，斜率等于电阻。电阻越大，直线越陡。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.phase += dt * .3;
    setFrame(.5, .55, 14);
    base();
    const I = s.U / s.R;

    wire({x: -6, y: -1.7}, {x: -1.4, y: -1.7});
    wire({x: -1.4, y: -1.7}, {x: -1.4, y: 1.7});
    wire({x: -1.4, y: 1.7}, {x: -6, y: 1.7});
    wire({x: -6, y: 1.7}, {x: -6, y: .16});
    wire({x: -6, y: -.16}, {x: -6, y: -1.7});
    cellV(-6, 0);
    resBox(-3.7, 1.7, 1.3, .5, 'R', '#5eead4');
    wire({x: -4.35, y: 1.7}, {x: -3.05, y: 1.7});

    for (let i = 0; i < 14; i++) {
      const p = this.at(s.phase + i / 14);
      if (Math.abs(p.x + 6) < .22 && Math.abs(p.y) < .3) continue;
      dot(p, 'rgba(126,236,214,.9)', 3);
    }
    sans('I', X(-1.4) + 12, Y(.2), '#8fe9d8', 13, 'left');
    sans('U = ' + f1(s.U) + ' V', X(-6) - 14, Y(-.75), '#dfe9ee', 12, 'right');
    sans('R = ' + f1(s.R) + ' Ω', X(-3.7), Y(1.7) - 22, '#8fe9d8', 12);

    if (s.showGraph) {
      const x0 = .7, x1 = 6.6, y0 = -2.4, y1 = 2.6;
      line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(200,225,235,.45)', {w: 1.3});
      line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(200,225,235,.45)', {w: 1.3});
      arrow({x: x1 - .4, y: y0}, {x: x1, y: y0}, 'rgba(200,225,235,.55)', {w: 1.2, head: 8});
      arrow({x: x0, y: y1 - .4}, {x: x0, y: y1}, 'rgba(200,225,235,.55)', {w: 1.2, head: 8});
      sans('I / A', X(x1) - 2, Y(y0) + 16, 'rgba(180,210,220,.8)', 10.5, 'right');
      sans('U / V', X(x0) - 8, Y(y1) + 10, 'rgba(180,210,220,.8)', 10.5, 'right');

      const gx = i => x0 + i / 4 * (x1 - x0);
      const gy = u => y0 + u / 12 * (y1 - y0);
      for (let i = 1; i <= 4; i++) {
        line({x: gx(i), y: y0}, {x: gx(i), y: y0 - .09}, 'rgba(200,225,235,.4)', {w: 1});
        sans(String(i), X(gx(i)), Y(y0) + 14, 'rgba(170,200,212,.7)', 9.5);
      }
      for (let u = 3; u <= 12; u += 3) {
        line({x: x0 - .1, y: gy(u)}, {x: x0, y: gy(u)}, 'rgba(200,225,235,.4)', {w: 1});
        sans(String(u), X(x0) - 8, Y(gy(u)), 'rgba(170,200,212,.7)', 9.5, 'right');
      }
      const ie = Math.min(4, 12 / s.R);
      line({x: gx(0), y: gy(0)}, {x: gx(ie), y: gy(ie * s.R)}, 'rgba(94,234,212,.85)', {w: 2.4, glow: 6});
      const pu = s.U, pi = I;
      line({x: gx(pi), y: gy(0)}, {x: gx(pi), y: gy(pu)}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      line({x: gx(0), y: gy(pu)}, {x: gx(pi), y: gy(pu)}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      dot({x: gx(pi), y: gy(pu)}, '#fff1cf', 5);
      sans('斜率 = R', X(x1) - 14, Y(y1) - 8, 'rgba(160,220,210,.7)', 10.5, 'right');
      sans('工作点 (' + f2(pi) + ' A, ' + f1(pu) + ' V)', X(x0) + 10, Y(y1) - 12, 'rgba(200,225,235,.8)', 10.5, 'left');
    }
  },
  hud() {
    const s = this.state;
    return [
      {k: '电压 U', v: f1(s.U) + ' V'},
      {k: '电阻 R', v: f1(s.R) + ' Ω'},
      {k: '电流 I', v: f2(s.U / s.R) + ' A', hi: true},
      {k: '电功率 P', v: f2(s.U * s.U / s.R) + ' W', hi: true},
      {k: 'U-I 斜率', v: f1(s.R) + ' Ω'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电压 U / V', 2, 12, .5, s.U, v => f1(v), v => s.U = v);
    addSlider(el, '电阻 R / Ω', 2, 20, .5, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '显示 U-I 图', s.showGraph, v => s.showGraph = v);
    addToggle(el, '电流方向动画', s.playing, v => s.playing = v);
    addBtn(el, '恢复默认', () => { s.U = 6; s.R = 6; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 串联与并联 ---------- */
MODULES.push({
  key: 'combo', tab: '02', name: '串并联', en: 'SERIES & PARALLEL', blurb: '电流与电压分配',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '切换串联与并联，调节两个电阻，比较总电阻和电流分配',
  state: {mode: 0, R1: 6, R2: 3, U: 6, showU: true},
  reset() { const s = this.state; s.mode = 0; s.R1 = 6; s.R2 = 3; s.U = 6; s.showU = true; },
  meta() {
    return {
      title: '串联分压，并联分流',
      desc: '串联电路中电流处处相等，电压按电阻大小分配；并联电路中各支路电压相等，电流按电阻的反比分配。切换两种连接方式，调节两个电阻，比较总电阻、总电流与各元件上的电压和电流。',
      formula: 'R<sub>串</sub> = R<sub>1</sub> + R<sub>2</sub>，1/R<sub>并</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub>',
      note: '串联总电阻<b>大于</b>任一分电阻；并联总电阻<b>小于</b>任一分电阻。并联支路越多，总电阻越小。'
    };
  },
  vals() {
    const s = this.state;
    if (s.mode === 0) {
      const R = s.R1 + s.R2, I = s.U / R;
      return {R, I, I1: I, I2: I, U1: I * s.R1, U2: I * s.R2};
    }
    const R = s.R1 * s.R2 / (s.R1 + s.R2);
    return {R, I: s.U / R, I1: s.U / s.R1, I2: s.U / s.R2, U1: s.U, U2: s.U};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const v = this.vals();

    if (s.mode === 0) {
      wire({x: -5.4, y: -1.6}, {x: -5.4, y: 1.7});
      wire({x: -5.4, y: 1.7}, {x: 5, y: 1.7});
      wire({x: 5, y: 1.7}, {x: 5, y: -1.6});
      wire({x: 5, y: -1.6}, {x: -5.4, y: -1.6});
      cellV(-5.4, 0);
      resBox(-2.4, 1.7, 1.4, .52, 'R₁', '#6cb6ff');
      resBox(1.6, 1.7, 1.4, .52, 'R₂', '#b49cff');
      sans('I', X(-3.9), Y(1.7) - 8, '#8fe9d8', 12);
      sans('I', X(0), Y(1.7) - 8, '#8fe9d8', 12);
      sans('I', X(5) + 14, Y(0), '#8fe9d8', 12, 'left');
      if (s.showU) {
        sans('U₁ = ' + f2(v.U1) + ' V', X(-2.4), Y(1.7) + 42, '#a8d0ff', 11.5);
        sans('U₂ = ' + f2(v.U2) + ' V', X(1.6), Y(1.7) + 42, '#c8baff', 11.5);
      }
      sans('U = ' + f1(s.U) + ' V', X(-5.4) - 12, Y(-.9), '#dfe9ee', 12, 'right');
      sans('串联：电流相同，电压相加', X(0), Y(-2.8), 'rgba(190,215,225,.8)', 12);
    } else {
      wire({x: -5.4, y: -1.7}, {x: -5.4, y: 1.7});
      wire({x: -5.4, y: 1.7}, {x: 5, y: 1.7});
      wire({x: -5.4, y: -1.7}, {x: 5, y: -1.7});
      wire({x: 5, y: 1.7}, {x: 5, y: -1.7});
      cellV(-5.4, 0);
      resBox(-1, 1.7, 1.4, .52, 'R₁', '#6cb6ff');
      resBox(-1, -1.7, 1.4, .52, 'R₂', '#b49cff');
      sans('I₁', X(-1), Y(1.7) - 20, '#a8d0ff', 11.5);
      sans('I₂', X(-1), Y(-1.7) + 20, '#c8baff', 11.5);
      sans('I', X(-4.4), Y(-1.7) + 18, '#8fe9d8', 12);
      if (s.showU) {
        sans('U₁ = ' + f2(v.U1) + ' V', X(-1), Y(1.7) + 42, '#a8d0ff', 11.5);
        sans('U₂ = ' + f2(v.U2) + ' V', X(-1), Y(-1.7) - 42, '#c8baff', 11.5);
      }
      sans('U = ' + f1(s.U) + ' V', X(-5.4) - 12, Y(-.9), '#dfe9ee', 12, 'right');
      sans('并联：电压相同，电流相加', X(0), Y(-3.0), 'rgba(190,215,225,.8)', 12);
    }
    sans('R总 = ' + f2(v.R) + ' Ω', X(4.9), Y(3.35), '#ffd79a', 14, 'right');
    sans('I总 = ' + f2(v.I) + ' A', X(4.9), Y(2.8), '#8fe9d8', 13, 'right');
  },
  hud() {
    const s = this.state, v = this.vals();
    return [
      {k: '总电阻', v: f2(v.R) + ' Ω', hi: true},
      {k: '总电流', v: f2(v.I) + ' A', hi: true},
      {k: 'R₁ 上电压', v: f2(v.U1) + ' V'},
      {k: 'R₂ 上电压', v: f2(v.U2) + ' V'},
      {k: '总功率', v: f2(s.U * v.I) + ' W'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['串联', '并联'], s.mode, i => s.mode = i);
    addSlider(el, '电阻 R₁ / Ω', 1, 20, .5, s.R1, v => f1(v), v => s.R1 = v);
    addSlider(el, '电阻 R₂ / Ω', 1, 20, .5, s.R2, v => f1(v), v => s.R2 = v);
    addSlider(el, '电源电压 U / V', 2, 12, .5, s.U, v => f1(v), v => s.U = v);
    addToggle(el, '显示电压标注', s.showU, v => s.showU = v);
  }
});

/* ---------- 03 电阻定律 ---------- */
MODULES.push({
  key: 'resistivity', tab: '03', name: '电阻定律', en: 'RESISTIVITY', blurb: '材料与尺寸',
  accent: '#ffb27a', rgb: '255,178,122',
  hint: '切换材料，改变长度与导线直径，观察电阻的变化',
  state: {mat: 1, L: 1.0, d: 1.0, showI: true},
  reset() { const s = this.state; s.mat = 1; s.L = 1.0; s.d = 1.0; s.showI = true; },
  meta() {
    return {
      title: '电阻定律：R = ρL / S',
      desc: '导体的电阻由材料、长度和横截面积共同决定。改变材料、长度与导线直径，观察电阻的变化，理解公式中每个量的含义；注意横截面积要用平方米，直径要先换算成米再求面积。',
      formula: 'R = ρL / S，S = πd<sup>2</sup>/4',
      note: '同种材料、粗细相同时，<b>越长电阻越大</b>；长度相同时，<b>越粗电阻越小</b>。电阻率由材料本身决定。'
    };
  },
  area() { return Math.PI * Math.pow(this.state.d, 2) / 4; },
  res() { return RHO[this.state.mat].rho * this.state.L / (this.area() * 1e-6); },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const m = RHO[s.mat];
    const len = 2.0 + s.L * 2.2;
    const th = .12 + s.d * .26;
    const x0 = -len / 2, x1 = len / 2;

    circleAt({x: x0, y: 0}, th, 'rgba(18,32,44,.9)', m.c, {w: 1.6});
    circleAt({x: x1, y: 0}, th, 'rgba(18,32,44,.9)', m.c, {w: 1.6});
    rect({x: x0, y: -th}, {x: x1, y: th}, 'rgba(30,44,56,.55)', m.c, {w: 1.4});

    if (s.showI) {
      for (let i = 0; i < 5; i++) {
        const xx = x0 + (i + .5) * len / 5;
        arrow({x: xx - .18, y: 0}, {x: xx + .18, y: 0}, 'rgba(123,224,192,.9)', {w: 1.4, head: 7});
      }
    }

    line({x: x0, y: -1.15}, {x: x1, y: -1.15}, 'rgba(255,255,255,.3)', {w: 1});
    line({x: x0, y: -1.08}, {x: x0, y: -1.22}, 'rgba(255,255,255,.45)', {w: 1});
    line({x: x1, y: -1.08}, {x: x1, y: -1.22}, 'rgba(255,255,255,.45)', {w: 1});
    sans('L = ' + f2(s.L) + ' m', X(0), Y(-1.42), 'rgba(210,228,236,.85)', 12);

    circleAt({x: 0, y: -2.55}, .62, 'rgba(30,44,56,.5)', m.c, {w: 1.4});
    arrow({x: -.62, y: -2.55}, {x: .62, y: -2.55}, 'rgba(255,255,255,.5)', {w: 1.2, head: 7});
    arrow({x: .62, y: -2.55}, {x: -.62, y: -2.55}, 'rgba(255,255,255,.5)', {w: 1.2, head: 7});
    sans('d = ' + f2(s.d) + ' mm', X(0), Y(-3.32), 'rgba(210,228,236,.8)', 11);

    sans(m.n, X(-4.6), Y(2.9), m.c, 15, 'left');
    sans('ρ = ' + m.rho.toExponential(1).replace('e-', '×10⁻').replace('e+', '×10'), X(-4.6), Y(2.35), 'rgba(190,215,225,.75)', 11, 'left');
    sans('R = ' + fR(this.res()) + ' Ω', X(0), Y(2.35), '#ffd79a', 17);
  },
  hud() {
    const s = this.state, m = RHO[s.mat];
    return [
      {k: '材料', v: m.n + ' 导线'},
      {k: '电阻率 ρ', v: m.rho.toExponential(1) + ' Ω·m', hi: true},
      {k: '长度 L', v: f2(s.L) + ' m'},
      {k: '横截面积 S', v: f2(this.area()) + ' mm²'},
      {k: '电阻 R', v: fR(this.res()) + ' Ω', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['铜', '铝', '镍铬'], s.mat, i => s.mat = i);
    addSlider(el, '长度 L / m', .2, 2, .1, s.L, v => f2(v), v => s.L = v);
    addSlider(el, '直径 d / mm', .2, 1.5, .1, s.d, v => f2(v), v => s.d = v);
    addToggle(el, '显示电流方向', s.showI, v => s.showI = v);
    addBtn(el, '恢复默认尺寸', () => { s.L = 1; s.d = 1; }, 'ghost');
  }
});

/* ---------- 04 电表改装 ---------- */
MODULES.push({
  key: 'meter', tab: '04', name: '电表改装', en: 'METER CONVERSION', blurb: '分压与分流',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换电压表与电流表，调节量程，观察所需的改装电阻',
  state: {mode: 0, Ig: 5, Rg: 50, range: 3, showPath: true},
  reset() { const s = this.state; s.mode = 0; s.Ig = 5; s.Rg = 50; s.range = 3; s.showPath = true; },
  meta() {
    return {
      title: '表头改装成电压表或电流表',
      desc: '表头只能测量很小的电流和电压。串联一个大电阻可以分压，把表头改装成电压表；并联一个小电阻可以分流，把表头改装成电流表。切换两种改装方式，调节量程，观察所需电阻与量程的关系。',
      formula: '电压表 R<sub>串</sub> = U/I<sub>g</sub> − R<sub>g</sub>；电流表 R<sub>并</sub> = I<sub>g</sub>R<sub>g</sub>/(I − I<sub>g</sub>)',
      note: '改装后表头的<b>满偏电流 Ig 不变</b>。电压表内阻很大，电流表内阻很小，这是它们接入电路的方式决定的。'
    };
  },
  rs() {
    const s = this.state;
    if (s.mode === 0) return Math.max(0, s.range / (s.Ig * 1e-3) - s.Rg);
    const den = s.range - s.Ig * 1e-3;
    return den > 0 ? s.Ig * 1e-3 * s.Rg / den : 0;
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const R = this.rs();

    if (s.mode === 0) {
      wire({x: -4.9, y: .9}, {x: -2, y: .9});
      wire({x: -.6, y: .9}, {x: 1.35, y: .9});
      wire({x: 2.25, y: .9}, {x: 4.9, y: .9});
      resBox(-1.3, .9, 1.4, .5, 'R串', '#b49cff');
      meter({x: 1.8, y: .9}, .45, 'G', '#ffd79a');
      sans('Rg = ' + s.Rg.toFixed(0) + ' Ω', X(1.8), Y(.9) + 31, 'rgba(210,228,236,.85)', 9.5);
      sans('R串 = ' + fR(R) + ' Ω', X(-1.3), Y(.9) - 28, 'rgba(205,190,255,.9)', 10);
      dot({x: -4.9, y: .9}, '#dfe9ee', 4);
      dot({x: 4.9, y: .9}, '#dfe9ee', 4);
      sans('+', X(-4.9) - 14, Y(.9), '#ff8f6b', 14);
      sans('−', X(4.9) + 14, Y(.9), '#6cb6ff', 14);
      arrow({x: -4.9, y: 2.0}, {x: 4.9, y: 2.0}, 'rgba(255,215,154,.55)', {w: 1.4, head: 9, dash: [5, 4]});
      sans('U = 量程 ' + f1(s.range) + ' V', X(0), Y(2.32), '#ffd79a', 12);
      sans('串联分压：U = Ig(Rg + R串)', X(0), Y(-1.7), 'rgba(200,225,235,.8)', 12);
    } else {
      wire({x: -4.9, y: 0}, {x: -1.2, y: 0});
      wire({x: 2.8, y: 0}, {x: 4.9, y: 0});
      wire({x: -1.2, y: 0}, {x: -1.2, y: 1.2});
      wire({x: -1.2, y: 1.2}, {x: .55, y: 1.2});
      wire({x: 1.45, y: 1.2}, {x: 2.8, y: 1.2});
      wire({x: 2.8, y: 1.2}, {x: 2.8, y: 0});
      wire({x: -1.2, y: 0}, {x: -1.2, y: -1.2});
      wire({x: -1.2, y: -1.2}, {x: .1, y: -1.2});
      wire({x: 1.7, y: -1.2}, {x: 2.8, y: -1.2});
      wire({x: 2.8, y: -1.2}, {x: 2.8, y: 0});
      meter({x: 1, y: 1.2}, .45, 'G', '#ffd79a');
      sans('Rg', X(1), Y(1.2) + 24, 'rgba(210,228,236,.7)', 9);
      resBox(.9, -1.2, 1.6, .46, 'R并', '#b49cff');
      dot({x: -4.9, y: 0}, '#dfe9ee', 4);
      dot({x: 4.9, y: 0}, '#dfe9ee', 4);
      dot({x: -1.2, y: 0}, '#dfe9ee', 3.4);
      dot({x: 2.8, y: 0}, '#dfe9ee', 3.4);
      sans('I = 量程 ' + f1(s.range) + ' A', X(0), Y(-2.25), '#ffd79a', 12);
      sans('并联分流：IgRg = (I − Ig)R并', X(0), Y(-2.8), 'rgba(200,225,235,.8)', 11.5);
    }

    sans('表头：满偏电流 Ig = ' + f1(s.Ig) + ' mA', X(-4.9), Y(3.1), 'rgba(200,225,235,.8)', 11.5, 'left');
    sans('改装电阻 R = ' + fR(R) + ' Ω', X(-4.9), Y(2.6), 'rgba(200,225,235,.8)', 11.5, 'left');
  },
  hud() {
    const s = this.state;
    const n = s.mode === 0 ? s.range / (s.Ig * 1e-3 * s.Rg) : s.range / (s.Ig * 1e-3);
    return [
      {k: '满偏电流 Ig', v: f1(s.Ig) + ' mA'},
      {k: '表头内阻 Rg', v: s.Rg.toFixed(0) + ' Ω'},
      {k: '改装电阻', v: fR(this.rs()) + ' Ω', hi: true},
      {k: '量程', v: f1(s.range) + (s.mode === 0 ? ' V' : ' A'), hi: true},
      {k: '量程扩大倍数', v: n.toFixed(0) + ' 倍'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['电压表', '电流表'], s.mode, i => s.mode = i);
    addSlider(el, '满偏电流 Ig / mA', 1, 10, .5, s.Ig, v => f1(v), v => s.Ig = v);
    addSlider(el, '表头内阻 Rg / Ω', 20, 100, 5, s.Rg, v => v.toFixed(0), v => s.Rg = v);
    addSlider(el, '目标量程 / (V 或 A)', 1, 15, .5, s.range, v => f1(v), v => s.range = v);
    addToggle(el, '显示分流/分压路径', s.showPath, v => s.showPath = v);
  }
});

/* ---------- 05 伏安法测电阻 ---------- */
MODULES.push({
  key: 'voltammetry', tab: '05', name: '伏安法', en: 'VOLT-AMMETER', blurb: '内接与外接',
  accent: '#ffd166', rgb: '255,209,102',
  hint: '切换电流表外接与内接，比较测量值与真实值的误差',
  state: {mode: 0, Rx: 20, RA: 1, RV: 3000, U0: 6, showErr: true},
  reset() { const s = this.state; s.mode = 0; s.Rx = 20; s.RA = 1; s.RV = 3000; s.U0 = 6; s.showErr = true; },
  meta() {
    return {
      title: '伏安法测电阻的系统误差',
      desc: '用电压表和电流表测量电阻时，电表内阻会给结果带来系统误差。切换电流表外接与内接，比较测量值、真实值与相对误差，理解大电阻用内接、小电阻用外接的选用原则，并学会分析误差来源。',
      formula: 'R<sub>测</sub> = U/I，外接 R<sub>测</sub> < R<sub>x</sub>，内接 R<sub>测</sub> > R<sub>x</sub>',
      note: '外接时电压表<b>分流</b>，测量值偏小；内接时电流表<b>分压</b>，测量值偏大。待测电阻远大于电流表内阻时用内接。'
    };
  },
  vals() {
    const s = this.state;
    const Rm = s.mode === 0 ? s.Rx * s.RV / (s.Rx + s.RV) : s.Rx + s.RA;
    return {Rm, I: s.U0 / Rm, U: s.U0, err: (Rm - s.Rx) / s.Rx * 100};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const v = this.vals();

    wire({x: -4.9, y: -1.9}, {x: -4.9, y: 1.4});
    wire({x: -4.9, y: 1.4}, {x: 4.9, y: 1.4});
    wire({x: 4.9, y: 1.4}, {x: 4.9, y: -1.9});
    wire({x: 4.9, y: -1.9}, {x: -4.9, y: -1.9});
    cellH(0, -1.9);
    sans('6 V', X(0), Y(-1.9) - 30, '#dfe9ee', 11);

    meter({x: -2.4, y: 1.4}, .44, 'A', '#8fe9d8');
    resBox(2.3, 1.4, 1.3, .52, 'Rx', '#ffd166');
    wire({x: -1.96, y: 1.4}, {x: 1.65, y: 1.4});
    wire({x: 2.95, y: 1.4}, {x: 4.9, y: 1.4});

    const vL = s.mode === 0 ? 1.0 : -3.25;
    const vR = 4.1;
    wire({x: vL, y: 1.4}, {x: vL, y: 2.55});
    wire({x: vL, y: 2.55}, {x: vR, y: 2.55});
    wire({x: vR, y: 2.55}, {x: vR, y: 1.4});
    meter({x: (vL + vR) / 2, y: 2.55}, .42, 'V', '#ffb27a');
    dot({x: vL, y: 1.4}, '#dfe9ee', 3.2);
    dot({x: vR, y: 1.4}, '#dfe9ee', 3.2);

    sans(s.mode === 0 ? '电流表外接' : '电流表内接', X(-4.9), Y(3.35), 'rgba(200,225,235,.9)', 13, 'left');
    sans('U = ' + f2(v.U) + ' V', X(-4.6), Y(-3.0), 'rgba(160,200,255,.85)', 11.5, 'left');
    sans('I = ' + f1(v.I * 1000) + ' mA', X(-4.6), Y(-3.5), 'rgba(126,236,214,.85)', 11.5, 'left');
    if (s.showErr) {
      sans('R测 = ' + f2(v.Rm) + ' Ω', X(4.6), Y(-3.0), '#ffd79a', 12.5, 'right');
      sans('误差 ' + f1(v.err) + ' %', X(4.6), Y(-3.5), v.err > 0 ? '#ff9f8a' : '#8fe9d8', 12.5, 'right');
    }
  },
  hud() {
    const s = this.state, v = this.vals();
    return [
      {k: '电压表读数 U', v: f2(v.U) + ' V'},
      {k: '电流表读数 I', v: f1(v.I * 1000) + ' mA'},
      {k: '测量值 R测', v: f2(v.Rm) + ' Ω', hi: true},
      {k: '相对误差', v: f1(v.err) + ' %', hi: true},
      {k: '真实值 Rx', v: s.Rx.toFixed(0) + ' Ω'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['外接', '内接'], s.mode, i => s.mode = i);
    addSlider(el, '待测电阻 Rx / Ω', 5, 100, 1, s.Rx, v => v.toFixed(0), v => s.Rx = v);
    addSlider(el, '电流表内阻 RA / Ω', .5, 5, .5, s.RA, v => f1(v), v => s.RA = v);
    addSlider(el, '电压表内阻 RV / Ω', 500, 5000, 100, s.RV, v => v.toFixed(0), v => s.RV = v);
    addToggle(el, '显示误差分析', s.showErr, v => s.showErr = v);
  }
});

})();
