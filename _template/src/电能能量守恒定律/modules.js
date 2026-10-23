/* ============================================================
   必修第三册 · 第 4 章 电能 能量守恒定律
   ============================================================ */
(function () {

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
function resBox(cx, cy, w, h, label, color) {
  rect({x: cx - w / 2, y: cy - h / 2}, {x: cx + w / 2, y: cy + h / 2},
    'rgba(11,24,40,.95)', color, {w: 1.7});
  sans(label, X(cx), Y(cy), color, 11.5);
}

/* ---------- 01 电功与电功率 ---------- */
MODULES.push({
  key: 'power', tab: '01', name: '电功与功率', en: 'ELECTRIC POWER', blurb: '电能转化为光',
  accent: '#ffd166', rgb: '255,209,102',
  hint: '调节电压与电阻，观察灯泡亮度、电功率和累积电能',
  playable: true,
  state: {U: 220, R: 100, t: 0, playing: true, showBar: true},
  reset() { const s = this.state; s.U = 220; s.R = 100; s.t = 0; s.playing = true; s.showBar = true; },
  meta() {
    return {
      title: '电流做功，电能转化为其他形式的能',
      desc: '电流做功的过程就是电能转化为其他形式能的过程。调节电压和电阻，观察灯泡的亮度、电功率与通电时间怎样影响消耗的电能，理解 W = UIt 与 P = UI 的区别与联系，并注意单位换算。',
      formula: 'P = UI，W = UIt',
      note: '功率描述做功的<b>快慢</b>，电能描述做功的<b>多少</b>。灯泡越亮说明实际功率越大，但消耗的电能还要看通电时间。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t = Math.min(120, s.t + dt);
    setFrame(.5, .55, 14);
    base();
    const I = s.U / s.R, P = s.U * I, W = P * s.t;
    const b = clamp(P / 600, .1, 1);

    wire({x: -.28, y: .5}, {x: -.28, y: .05});
    wire({x: -.28, y: .05}, {x: -3.3, y: .05});
    wire({x: -3.3, y: .05}, {x: -3.3, y: -1.25});
    wire({x: -3.3, y: -1.25}, {x: -1.3, y: -1.25});
    wire({x: .28, y: .5}, {x: .28, y: .05});
    wire({x: .28, y: .05}, {x: 3.3, y: .05});
    wire({x: 3.3, y: .05}, {x: 3.3, y: -1.25});
    wire({x: 3.3, y: -1.25}, {x: 1.3, y: -1.25});
    rect({x: -1.3, y: -1.62}, {x: 1.3, y: -1.02}, 'rgba(11,24,40,.95)', 'rgba(255,209,102,.65)', {w: 1.6});
    sans('电源 U = ' + f1(s.U) + ' V', X(0), Y(-1.32), '#ffe3b0', 12);

    circleAt({x: 0, y: 1.15}, .92, 'rgba(255,214,120,' + (.05 + .1 * b) + ')', null);
    circleAt({x: 0, y: 1.15}, .68, 'rgba(255,214,120,' + (.12 + .18 * b) + ')', 'rgba(255,225,160,' + (.45 + .5 * b) + ')', {w: 2});
    poly([{x: -.28, y: 1.55}, {x: -.14, y: 1.15}, {x: 0, y: 1.55}, {x: .14, y: 1.15}, {x: .28, y: 1.55}],
      null, 'rgba(255,240,190,' + (.5 + .5 * b) + ')', {w: 2});
    rect({x: -.3, y: .5}, {x: .3, y: .62}, 'rgba(200,215,225,.35)', 'rgba(200,225,235,.5)', {w: 1.2});
    sans('灯泡（纯电阻）', X(0), Y(2.15), 'rgba(255,235,200,.85)', 11.5);
    sans('R = ' + f1(s.R) + ' Ω', X(0), Y(1.15) + 46, '#ffe3b0', 11);

    circleAt({x: 4.45, y: 1.05}, .62, 'rgba(11,24,40,.9)', 'rgba(200,225,235,.5)', {w: 1.3});
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      line({x: 4.45 + Math.cos(a) * .52, y: 1.05 + Math.sin(a) * .52},
        {x: 4.45 + Math.cos(a) * .62, y: 1.05 + Math.sin(a) * .62}, 'rgba(200,225,235,.45)', {w: 1});
    }
    const dial = s.t * P / 12000;
    line({x: 4.45, y: 1.05}, {x: 4.45 + Math.cos(dial) * .45, y: 1.05 + Math.sin(dial) * .45}, '#ffd166', {w: 2});
    sans('电能表', X(4.45), Y(1.9), 'rgba(200,225,235,.75)', 10.5);

    sans('P = UI = ' + f1(P) + ' W', X(-4.6), Y(2.7), '#8fe9d8', 14, 'left');
    sans('W = Pt = ' + f2(W / 1000) + ' kJ', X(-4.6), Y(2.1), '#ffd79a', 14, 'left');
    sans('t = ' + f1(s.t) + ' s', X(-4.6), Y(1.5), 'rgba(190,215,225,.7)', 11, 'left');

    if (s.showBar) {
      const frac = clamp(W / 30000, 0, 1);
      rect({x: -4.5, y: -2.65}, {x: 4.5, y: -2.25}, 'rgba(255,255,255,.05)', 'rgba(200,225,235,.2)', {w: 1});
      rect({x: -4.5, y: -2.65}, {x: -4.5 + 9 * frac, y: -2.25}, 'rgba(255,209,102,.35)', 'rgba(255,209,102,.7)', {w: 1});
      sans('累积电能（满格 30 kJ）', X(0), Y(-2.95), 'rgba(190,215,225,.6)', 10.5);
    }
  },
  hud() {
    const s = this.state;
    const I = s.U / s.R;
    return [
      {k: '电压 U', v: f1(s.U) + ' V'},
      {k: '电流 I', v: f2(I) + ' A'},
      {k: '电功率 P', v: f1(s.U * I) + ' W', hi: true},
      {k: '电能 W', v: f2(s.U * I * s.t / 1000) + ' kJ', hi: true},
      {k: '通电时间 t', v: f1(s.t) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电压 U / V', 100, 240, 10, s.U, v => v.toFixed(0), v => s.U = v);
    addSlider(el, '电阻 R / Ω', 50, 200, 5, s.R, v => v.toFixed(0), v => s.R = v);
    addToggle(el, '自动计时', s.playing, v => s.playing = v);
    addToggle(el, '显示电能累积条', s.showBar, v => s.showBar = v);
    addBtn(el, '电能表清零', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 焦耳定律 ---------- */
MODULES.push({
  key: 'joule', tab: '02', name: '焦耳定律', en: 'JOULE HEATING', blurb: '电热与电功',
  accent: '#ff8f6b', rgb: '255,143,107',
  hint: '切换纯电阻与电动机，比较电功与电热的分配',
  playable: true,
  state: {mode: 0, I: 1.5, R: 8, back: 6, t: 0, playing: true, showSplit: true},
  reset() { const s = this.state; s.mode = 0; s.I = 1.5; s.R = 8; s.back = 6; s.t = 0; s.playing = true; s.showSplit = true; },
  meta() {
    return {
      title: '焦耳定律：Q = I²Rt',
      desc: '电流通过导体时会产生热量，焦耳定律给出 Q = I²Rt。切换纯电阻与电动机，比较电功与电热的差别，理解电能全部转化为内能、以及电能转化为机械能和内能两种情况的区别。',
      formula: 'Q = I<sup>2</sup>Rt，P<sub>热</sub> = I<sup>2</sup>R',
      note: '纯电阻电路中 <b>W = Q</b>；含电动机的电路中 W > Q，因为大部分电能转化成了机械能。'
    };
  },
  vals() {
    const s = this.state;
    const Pheat = s.I * s.I * s.R;
    const U = s.mode === 0 ? s.I * s.R : s.I * s.R + s.back;
    const Ptot = U * s.I;
    return {U, Pheat, Ptot, Pmech: s.mode === 0 ? 0 : Ptot - Pheat};
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t = Math.min(60, s.t + dt);
    setFrame(.5, .55, 14);
    base();
    const v = this.vals();

    if (s.mode === 0) {
      rect({x: -1.5, y: .55}, {x: 1.5, y: 1.65}, 'rgba(255,143,107,.1)', '#ff8f6b', {w: 2});
      poly([{x: -.9, y: 1.4}, {x: -.45, y: .85}, {x: 0, y: 1.4}, {x: .45, y: .85}, {x: .9, y: 1.4}],
        null, 'rgba(255,200,170,.9)', {w: 2});
      sans('电阻 R', X(0), Y(1.95), '#ffb3a0', 12);
      sans('电能 → 内能', X(0), Y(.25), 'rgba(255,190,160,.75)', 11);
    } else {
      circleAt({x: 0, y: 1.1}, .7, 'rgba(255,143,107,.08)', '#ff8f6b', {w: 2});
      sans('M', X(0), Y(1.1), '#ffb3a0', 24);
      angleArc({x: 0, y: 1.1}, -1.2, 1.4, 34, 'rgba(255,209,102,.8)', '', 12);
      arrow({x: 1.1, y: 1.9}, {x: .55, y: 1.55}, 'rgba(255,209,102,.85)', {w: 1.6, head: 8});
      sans('电动机', X(0), Y(1.98), '#ffb3a0', 12);
      sans('电能 → 机械能 + 内能', X(0), Y(.22), 'rgba(255,190,160,.75)', 11);
    }

    const ex = s.mode === 0 ? 1.5 : .72;
    wire({x: -3.6, y: 1.1}, {x: -ex, y: 1.1});
    wire({x: ex, y: 1.1}, {x: 3.6, y: 1.1});
    wire({x: -3.6, y: 1.1}, {x: -3.6, y: -1.4});
    wire({x: 3.6, y: 1.1}, {x: 3.6, y: -1.4});
    wire({x: -3.6, y: -1.4}, {x: -1.2, y: -1.4});
    wire({x: 1.2, y: -1.4}, {x: 3.6, y: -1.4});
    rect({x: -1.2, y: -1.72}, {x: 1.2, y: -1.08}, 'rgba(11,24,40,.95)', 'rgba(200,225,235,.4)', {w: 1.4});
    sans('U = ' + f2(v.U) + ' V', X(0), Y(-1.4), '#dfe9ee', 12);
    sans('I = ' + f2(s.I) + ' A', X(-4.5), Y(2.4), 'rgba(126,236,214,.85)', 12, 'left');
    sans('R = ' + f1(s.R) + ' Ω', X(-4.5), Y(1.85), 'rgba(255,190,160,.85)', 12, 'left');

    if (s.showSplit) {
      const tot = Math.max(v.Ptot, .01);
      const w = 8.6;
      rect({x: -4.3, y: -2.55}, {x: 4.3, y: -2.15}, 'rgba(255,255,255,.05)', 'rgba(200,225,235,.2)', {w: 1});
      rect({x: -4.3, y: -2.55}, {x: -4.3 + w * (v.Pheat / tot), y: -2.15},
        'rgba(255,143,107,.4)', 'rgba(255,143,107,.8)', {w: 1});
      if (v.Pmech > .01) {
        rect({x: -4.3 + w * (v.Pheat / tot), y: -2.55}, {x: 4.3, y: -2.15},
          'rgba(123,224,192,.3)', 'rgba(123,224,192,.7)', {w: 1});
      }
      sans('P热 = ' + f1(v.Pheat) + ' W', X(-3.6), Y(-2.85), '#ffb3a0', 10.5, 'left');
      if (v.Pmech > .01) sans('P机 = ' + f1(v.Pmech) + ' W', X(3.6), Y(-2.85), '#8fe9d8', 10.5, 'right');
    }
    sans('Q = ' + f2(v.Pheat * s.t / 1000) + ' kJ', X(0), Y(-3.35), 'rgba(255,190,160,.9)', 12);
  },
  hud() {
    const s = this.state, v = this.vals();
    return [
      {k: '电流 I', v: f2(s.I) + ' A'},
      {k: '总电功率', v: f1(v.Ptot) + ' W', hi: true},
      {k: '发热功率', v: f1(v.Pheat) + ' W', hi: true},
      {k: '机械功率', v: f1(v.Pmech) + ' W'},
      {k: '发热量 Q', v: f2(v.Pheat * s.t / 1000) + ' kJ'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['纯电阻', '电动机'], s.mode, i => { s.mode = i; s.t = 0; });
    addSlider(el, '电流 I / A', .2, 3, .1, s.I, v => f1(v), v => s.I = v);
    addSlider(el, '电阻 R / Ω', 2, 20, 1, s.R, v => v.toFixed(0), v => s.R = v);
    addSlider(el, '反电动势 E反 / V', 0, 10, .5, s.back, v => f1(v), v => s.back = v);
    addToggle(el, '显示能量分配', s.showSplit, v => s.showSplit = v);
    addBtn(el, '热量清零', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 电动势与内阻 ---------- */
MODULES.push({
  key: 'emf', tab: '03', name: '电动势与内阻', en: 'EMF & INTERNAL R', blurb: '电源的两个参数',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '调节电动势、内阻与外电阻，观察路端电压和内电压',
  state: {emf: 6, r: 1, R: 5, showInternal: true},
  reset() { const s = this.state; s.emf = 6; s.r = 1; s.R = 5; s.showInternal = true; },
  meta() {
    return {
      title: '电动势 ε 与内阻 r',
      desc: '电源把其他形式的能转化为电能，电动势描述这种转化的本领，内阻则使电源自身发热。调节电动势、内阻与外电阻，观察路端电压随电流的变化，理解 U = ε − Ir 的物理意义。',
      formula: 'U = ε − Ir，I = ε/(R + r)',
      note: '外电路断开时路端电压等于电动势；外电阻减小时电流增大，<b>内电压 Ir 增大</b>，路端电压减小。'
    };
  },
  vals() {
    const s = this.state;
    const I = s.emf / (s.R + s.r);
    return {I, U: I * s.R, Ur: I * s.r};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const v = this.vals();

    wire({x: -4.4, y: -1.5}, {x: -4.4, y: .3});
    wire({x: -4.4, y: .74}, {x: -4.4, y: 1.6});
    cellV(-4.4, .6);
    resBox(-4.4, -.6, .62, .68, 'r', '#ff8f6b');
    wire({x: -4.4, y: 1.6}, {x: .7, y: 1.6});
    resBox(1.5, 1.6, 1.5, .52, 'R', '#5eead4');
    wire({x: 2.25, y: 1.6}, {x: 4.4, y: 1.6});
    wire({x: 4.4, y: 1.6}, {x: 4.4, y: -1.5});
    wire({x: 4.4, y: -1.5}, {x: -4.4, y: -1.5});

    sans('ε', X(-4.4) - 22, Y(.6), '#ffe3b0', 15, 'right');
    sans('ε = ' + f1(s.emf) + ' V', X(-5.6), Y(.6) - 24, 'rgba(255,227,176,.9)', 11, 'left');
    if (s.showInternal) {
      sans('内阻 r = ' + f1(s.r) + ' Ω', X(-4.4) - 12, Y(-.6), 'rgba(255,179,160,.9)', 10.5, 'right');
    }
    sans('R = ' + f1(s.R) + ' Ω', X(1.5), Y(1.6) + 36, '#8fe9d8', 11.5);
    sans('U = ' + f2(v.U) + ' V', X(1.5), Y(1.6) - 30, '#8fe9d8', 12.5);

    const w = 8.8;
    const frac = v.U / Math.max(s.emf, .01);
    rect({x: -4.4, y: -2.5}, {x: 4.4, y: -2.1}, 'rgba(255,255,255,.05)', 'rgba(200,225,235,.2)', {w: 1});
    rect({x: -4.4, y: -2.5}, {x: -4.4 + w * frac, y: -2.1}, 'rgba(94,234,212,.3)', 'rgba(94,234,212,.7)', {w: 1});
    if (s.showInternal) {
      rect({x: -4.4 + w * frac, y: -2.5}, {x: 4.4, y: -2.1}, 'rgba(255,143,107,.3)', 'rgba(255,143,107,.7)', {w: 1});
      sans('U内 = ' + f2(v.Ur) + ' V', X(3.9), Y(-2.8), '#ffb3a0', 10.5, 'right');
    }
    sans('路端电压 U = ' + f2(v.U) + ' V', X(-4.4), Y(-2.8), '#8fe9d8', 10.5, 'left');
    sans('ε = U + Ir', X(0), Y(-3.3), 'rgba(200,225,235,.7)', 11.5);
  },
  hud() {
    const s = this.state, v = this.vals();
    return [
      {k: '电动势 ε', v: f1(s.emf) + ' V', hi: true},
      {k: '内阻 r', v: f1(s.r) + ' Ω'},
      {k: '电流 I', v: f2(v.I) + ' A', hi: true},
      {k: '路端电压 U', v: f2(v.U) + ' V'},
      {k: '内电压 Ir', v: f2(v.Ur) + ' V'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电动势 ε / V', 1.5, 12, .5, s.emf, v => f1(v), v => s.emf = v);
    addSlider(el, '内阻 r / Ω', .2, 5, .2, s.r, v => f1(v), v => s.r = v);
    addSlider(el, '外电阻 R / Ω', 1, 20, .5, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '显示内电压', s.showInternal, v => s.showInternal = v);
    addBtn(el, '外电路断开', () => { s.R = 20; }, 'ghost');
  }
});

/* ---------- 04 闭合电路欧姆定律 ---------- */
MODULES.push({
  key: 'closed', tab: '04', name: '闭合电路', en: 'CLOSED CIRCUIT', blurb: 'U-I 图线',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '调节电动势、内阻与外电阻，观察 U-I 图上的工作点',
  state: {emf: 6, r: 1, R: 5, showShort: true},
  reset() { const s = this.state; s.emf = 6; s.r = 1; s.R = 5; s.showShort = true; },
  meta() {
    return {
      title: '闭合电路欧姆定律与 U-I 图',
      desc: '闭合电路中，电流由电动势和总电阻共同决定。调节电动势、内阻与外电阻，观察 U-I 图上的工作点怎样移动，理解图线的纵截距就是电动势、斜率的绝对值就是内阻。',
      formula: 'I = ε/(R + r)，U = ε − Ir',
      note: 'U-I 图线是一条<b>向下倾斜的直线</b>：纵截距为 ε，横截距为短路电流 ε/r，斜率绝对值为 r。'
    };
  },
  vals() {
    const s = this.state;
    const I = s.emf / (s.R + s.r);
    return {I, U: s.emf - I * s.r};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const v = this.vals();
    const x0 = -4.8, x1 = 5.4, y0 = -2.5, y1 = 2.7;
    const gx = i => x0 + i / 12 * (x1 - x0);
    const gy = u => y0 + u / 10 * (y1 - y0);

    line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(200,225,235,.45)', {w: 1.3});
    line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(200,225,235,.45)', {w: 1.3});
    arrow({x: x1 - .45, y: y0}, {x: x1, y: y0}, 'rgba(200,225,235,.55)', {w: 1.2, head: 8});
    arrow({x: x0, y: y1 - .45}, {x: x0, y: y1}, 'rgba(200,225,235,.55)', {w: 1.2, head: 8});
    sans('I / A', X(x1) - 4, Y(y0) + 16, 'rgba(180,210,220,.8)', 10.5, 'right');
    sans('U / V', X(x0) - 8, Y(y1) + 10, 'rgba(180,210,220,.8)', 10.5, 'right');
    for (let i = 2; i <= 12; i += 2) {
      line({x: gx(i), y: y0}, {x: gx(i), y: y0 - .08}, 'rgba(200,225,235,.35)', {w: 1});
      sans(String(i), X(gx(i)), Y(y0) + 14, 'rgba(170,200,212,.65)', 9);
    }
    for (let u = 2; u <= 10; u += 2) {
      line({x: x0 - .1, y: gy(u)}, {x: x0, y: gy(u)}, 'rgba(200,225,235,.35)', {w: 1});
      sans(String(u), X(x0) - 8, Y(gy(u)), 'rgba(170,200,212,.65)', 9, 'right');
    }

    const iMax = Math.min(12, s.emf / s.r);
    line({x: gx(0), y: gy(s.emf)}, {x: gx(iMax), y: gy(s.emf - iMax * s.r)}, 'rgba(108,182,255,.85)', {w: 2.6, glow: 7});
    dot({x: gx(0), y: gy(s.emf)}, '#dfe9ee', 4.5);
    sans('ε = ' + f1(s.emf) + ' V', X(gx(0)) + 10, Y(gy(s.emf)) - 12, 'rgba(200,225,235,.9)', 10.5, 'left');

    if (s.showShort && s.emf / s.r <= 12) {
      dot({x: gx(s.emf / s.r), y: gy(0)}, '#ff8f6b', 4.5);
      sans('短路电流 ' + f1(s.emf / s.r) + ' A', X(gx(s.emf / s.r)) - 6, Y(gy(0)) - 14, '#ffb3a0', 10, 'right');
    }

    line({x: gx(v.I), y: gy(0)}, {x: gx(v.I), y: gy(v.U)}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
    line({x: gx(0), y: gy(v.U)}, {x: gx(v.I), y: gy(v.U)}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
    dot({x: gx(v.I), y: gy(v.U)}, '#fff1cf', 5.5);
    sans('工作点 R = ' + f1(s.R) + ' Ω', X(gx(v.I)) + 12, Y(gy(v.U)) - 14, 'rgba(255,235,200,.9)', 11, 'left');

    sans('斜率绝对值 = 内阻 r = ' + f1(s.r) + ' Ω', X(x1), Y(y1) - 10, 'rgba(160,200,255,.7)', 10.5, 'right');
    sans('U = ε − Ir', X(x0) + 12, Y(y1) - 10, 'rgba(200,225,235,.8)', 12, 'left');
  },
  hud() {
    const s = this.state, v = this.vals();
    return [
      {k: '电动势 ε', v: f1(s.emf) + ' V', hi: true},
      {k: '内阻 r', v: f1(s.r) + ' Ω'},
      {k: '工作电流 I', v: f2(v.I) + ' A', hi: true},
      {k: '路端电压 U', v: f2(v.U) + ' V'},
      {k: '短路电流', v: f1(s.emf / s.r) + ' A'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电动势 ε / V', 1.5, 9, .5, s.emf, v => f1(v), v => s.emf = v);
    addSlider(el, '内阻 r / Ω', .5, 4, .25, s.r, v => f1(v), v => s.r = v);
    addSlider(el, '外电阻 R / Ω', 1, 20, .5, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '标出短路点', s.showShort, v => s.showShort = v);
  }
});

/* ---------- 05 电源输出功率与效率 ---------- */
MODULES.push({
  key: 'output', tab: '05', name: '输出功率', en: 'OUTPUT POWER', blurb: 'R = r 时最大',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '调节外电阻，观察输出功率曲线与效率的变化',
  state: {emf: 6, r: 2, R: 4, showPeak: true},
  reset() { const s = this.state; s.emf = 6; s.r = 2; s.R = 4; s.showPeak = true; },
  meta() {
    return {
      title: '输出功率最大时效率只有 50%',
      desc: '电源的输出功率随外电阻变化，当外电阻等于内阻时输出功率最大。调节外电阻与内阻，观察 P-R 曲线和效率的变化，注意最大输出功率与最高效率并不同时出现，理解二者的区别。',
      formula: 'P<sub>出</sub> = ε<sup>2</sup>R/(R + r)<sup>2</sup>，η = R/(R + r)',
      note: 'R = r 时输出功率最大，但效率仅 <b>50%</b>；R 越大效率越高，输出功率却减小。输电要选高效率而不是最大功率。'
    };
  },
  pout(R) { return this.state.emf * this.state.emf * R / Math.pow(R + this.state.r, 2); },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const pm = s.emf * s.emf / (4 * s.r);
    const x0 = -4.8, x1 = 5.4, y0 = -2.4, y1 = 2.7;
    const gx = r => x0 + r / 20 * (x1 - x0);
    const gy = p => y0 + p / (pm * 1.35) * (y1 - y0);

    line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(200,225,235,.45)', {w: 1.3});
    line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(200,225,235,.45)', {w: 1.3});
    arrow({x: x1 - .45, y: y0}, {x: x1, y: y0}, 'rgba(200,225,235,.55)', {w: 1.2, head: 8});
    arrow({x: x0, y: y1 - .45}, {x: x0, y: y1}, 'rgba(200,225,235,.55)', {w: 1.2, head: 8});
    sans('R / Ω', X(x1) - 4, Y(y0) + 16, 'rgba(180,210,220,.8)', 10.5, 'right');
    sans('P出 / W', X(x0) - 8, Y(y1) + 10, 'rgba(180,210,220,.8)', 10.5, 'right');
    for (let i = 0; i <= 20; i += 5) {
      line({x: gx(i), y: y0}, {x: gx(i), y: y0 - .08}, 'rgba(200,225,235,.35)', {w: 1});
      sans(String(i), X(gx(i)), Y(y0) + 14, 'rgba(170,200,212,.65)', 9);
    }

    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const R = i / 160 * 20;
      pts.push({x: gx(R), y: gy(this.pout(R))});
    }
    path(pts, 'rgba(180,156,255,.9)', {w: 2.4, glow: 6});

    if (s.showPeak) {
      line({x: gx(s.r), y: y0}, {x: gx(s.r), y: gy(pm)}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      dot({x: gx(s.r), y: gy(pm)}, '#ffd79a', 5);
      sans('R = r 时最大', X(gx(s.r)) + 10, Y(gy(pm)) - 12, '#ffd79a', 10.5, 'left');
    }

    const P = this.pout(s.R), eta = s.R / (s.R + s.r) * 100;
    line({x: gx(s.R), y: y0}, {x: gx(s.R), y: gy(P)}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
    dot({x: gx(s.R), y: gy(P)}, '#fff1cf', 5);
    const nearR = s.R > 13;
    sans('R = ' + f1(s.R) + ' Ω，P出 = ' + f2(P) + ' W', X(gx(s.R)) + (nearR ? -10 : 10), Y(gy(P)) + 16, 'rgba(255,235,200,.9)', 10.5, nearR ? 'right' : 'left');

    sans('P出 = ε²R/(R + r)²', X(x0) + 12, Y(y1) - 12, 'rgba(205,190,255,.85)', 12, 'left');
    sans('效率 η = ' + f1(eta) + ' %', X(x1), Y(y0) + 42, '#8fe9d8', 12, 'right');
  },
  hud() {
    const s = this.state;
    const P = this.pout(s.R);
    const Ptot = s.emf * s.emf / (s.R + s.r);
    return [
      {k: '外电阻 R', v: f1(s.R) + ' Ω'},
      {k: '输出功率 P出', v: f2(P) + ' W', hi: true},
      {k: '总功率 P总', v: f2(Ptot) + ' W'},
      {k: '效率 η', v: f1(s.R / (s.R + s.r) * 100) + ' %', hi: true},
      {k: '内阻损耗', v: f2(Ptot - P) + ' W'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '外电阻 R / Ω', .5, 20, .5, s.R, v => f1(v), v => s.R = v);
    addSlider(el, '内阻 r / Ω', .5, 5, .25, s.r, v => f1(v), v => s.r = v);
    addSlider(el, '电动势 ε / V', 2, 12, .5, s.emf, v => f1(v), v => s.emf = v);
    addToggle(el, '标出最大功率点', s.showPeak, v => s.showPeak = v);
    addBtn(el, '令 R = r', () => { s.R = s.r; }, 'ghost');
  }
});

})();
