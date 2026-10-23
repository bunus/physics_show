/* ============================================================
   必修第二册 · 第 8 章 机械能守恒定律
   ============================================================ */
(function () {

const g = 10;

function f1(v) {
  return (Math.abs(v) < .05 ? 0 : v).toFixed(1).replace('-', '−');
}
function f2(v) {
  return (Math.abs(v) < .005 ? 0 : v).toFixed(2).replace('-', '−');
}
function box(c, w, h, fill, stroke) {
  rect({x: c.x - w / 2, y: c.y - h / 2}, {x: c.x + w / 2, y: c.y + h / 2}, fill, stroke, {w: 1.8});
}

/* 能量条：x 处画一根竖直条，h 为高度（世界单位） */
function bar(x, w, h, y0, color, label, val) {
  line({x: x - w, y: y0}, {x: x + w, y: y0}, 'rgba(200,222,232,.28)', {w: 1});
  if (h > .01) rect({x: x - w, y: y0}, {x: x + w, y: y0 + h}, color, color, {alpha: .55, w: 1});
  if (label) sans(label, X(x), Y(y0 - .34), 'rgba(200,220,230,.8)', 10);
  if (val != null) sans(val, X(x), Y(y0 + h + .22), 'rgba(220,235,240,.9)', 10);
}

/* ---------- 01 功与功率 ---------- */
MODULES.push({
  key: 'wk-work', tab: '01', name: '功与功率', en: 'WORK & POWER', blurb: 'F、s 与夹角',
  accent: '#ff8fab', rgb: '255,143,163',
  hint: '改变拉力大小与夹角，看做功与功率怎样变化',
  playable: true,
  state: {x: -4.2, x0: -4.2, t: 0, playing: true, F: 20, th: 35, v: 1.6, showD: true},
  reset() {
    const s = this.state;
    s.x = -4.2; s.x0 = -4.2; s.t = 0; s.playing = true;
    s.F = 20; s.th = 35; s.v = 1.6; s.showD = true;
  },
  meta() {
    return {
      title: '功等于力乘位移再乘余弦',
      desc: '用与水平方向成 α 角的力拉着木箱前进。只有沿位移方向的分力做功，所以 W = Flcosα；功率表示做功的快慢，等于力沿运动方向的分量与速度的乘积。',
      formula: 'W = Fl·cosα<br>P = Fv·cosα',
      note: 'α = 90° 时做功为零；α > 90° 时力做负功。观察<b>竖直分力</b>虽然有力，却不做功。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      s.x += s.v * dt * .9;
      if (s.x > 3.4) { s.x = s.x0; s.t = 0; }
    }
    setFrame(.45, .58, 12.5);
    base();
    ground(0, 'rgba(150,190,205,.42)');
    const r = s.th * Math.PI / 180;
    const B = {x: s.x, y: .48};

    /* 位移标尺 */
    line({x: s.x0, y: -.35}, {x: s.x, y: -.35}, 'rgba(123,224,192,.75)', {w: 2.4});
    line({x: s.x0, y: -.2}, {x: s.x0, y: -.5}, 'rgba(123,224,192,.75)', {w: 1.6});
    line({x: s.x, y: -.2}, {x: s.x, y: -.5}, 'rgba(123,224,192,.75)', {w: 1.6});
    sans('l = ' + f1(s.x - s.x0) + ' m', X((s.x0 + s.x) / 2), Y(-.85), 'rgba(150,240,215,.9)', 11.5);

    /* 木箱 */
    box(B, .9, .78, 'rgba(255,143,163,.12)', 'rgba(255,143,163,.85)');
    dot(B, 'rgba(255,143,163,.9)', 3);

    /* 拉力与其分解 */
    const sc = .055;
    const tip = {x: B.x + Math.cos(r) * s.F * sc, y: B.y + Math.sin(r) * s.F * sc};
    arrow(B, tip, '#ffd166', {w: 3, head: 13, glow: 7});
    sans('F', X(tip.x) + 10, Y(tip.y) + 6, '#ffe3a3', 12.5, 'left');
    if (s.showD) {
      line(tip, {x: tip.x, y: B.y}, 'rgba(255,255,255,.20)', {w: 1, dash: [4, 4]});
      line(tip, {x: B.x, y: tip.y}, 'rgba(255,255,255,.20)', {w: 1, dash: [4, 4]});
      arrow({x: B.x, y: B.y - .05}, {x: tip.x, y: B.y - .05}, '#7be0c0', {w: 2.2, head: 10});
      arrow({x: B.x - .05, y: B.y}, {x: B.x - .05, y: tip.y}, '#8fb8ff', {w: 2.2, head: 10});
      sans('Fcosα', X((B.x + tip.x) / 2), Y(B.y) - 22, 'rgba(150,240,215,.95)', 11);
      sans('Fsinα', X(B.x) - 16, Y((B.y + tip.y) / 2), 'rgba(165,200,255,.95)', 11, 'right');
    }
    angleArc(B, 0, r, 44, 'rgba(255,209,102,.6)', '', 11);
    sans('α = ' + f1(s.th) + '°', X(B.x) + 60, Y(B.y) + 16, 'rgba(255,215,150,.9)', 11);

    const W = s.F * (s.x - s.x0) * Math.cos(r);
    sans('W = Flcosα = ' + f1(W) + ' J', X(-5.35), Y(3.55), 'rgba(255,190,205,.95)', 12, 'left');
    sans('P = Fvcosα = ' + f1(s.F * s.v * Math.cos(r)) + ' W', X(-5.35), Y(3.05), 'rgba(175,205,225,.85)', 11, 'left');
  },
  hud() {
    const s = this.state, r = s.th * Math.PI / 180;
    return [
      {k: '拉力 F', v: f1(s.F) + ' N'},
      {k: '夹角 α', v: f1(s.th) + '°', hi: true},
      {k: '水平分力', v: f1(s.F * Math.cos(r)) + ' N'},
      {k: '功率 P', v: f1(s.F * s.v * Math.cos(r)) + ' W', hi: true},
      {k: '已做功 W', v: f1(s.F * (s.x - s.x0) * Math.cos(r)) + ' J'},
      {k: '位移 l', v: f1(s.x - s.x0) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '拉力 F / N', 5, 30, 1, s.F, v => f1(v), v => s.F = v);
    addSlider(el, '夹角 α / °', 0, 80, 1, s.th, v => f1(v), v => s.th = v);
    addSlider(el, '速度 v / (m/s)', .4, 3, .1, s.v, v => f1(v), v => s.v = v);
    addToggle(el, '显示力的分解', s.showD, v => s.showD = v);
    addBtn(el, '重新开始', () => { s.x = s.x0; s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 动能定理 ---------- */
MODULES.push({
  key: 'wk-ek', tab: '02', name: '动能定理', en: 'WORK-ENERGY', blurb: '合力做功等于动能变化',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '改变初速度与动摩擦因数，看滑行距离与动能变化',
  playable: true,
  state: {t: 0, playing: true, v0: 6, mu: .25, m: 2, x0: -4.6, hold: 0, showE: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.v0 = 6; s.mu = .25; s.m = 2; s.hold = 0; s.showE = true;
  },
  meta() {
    return {
      title: '动能定理：合力做功等于动能变化',
      desc: '木块以初速度滑上粗糙水平面，只受摩擦力作用。摩擦力与位移反向，做负功，木块的动能减少，最终停下。合力做的功恰好等于动能的变化量。',
      formula: 'W<sub>合</sub> = ΔE<sub>k</sub> = ½mv<sup>2</sup> − ½mv<sub>0</sub><sup>2</sup><br>−μmgs = 0 − ½mv<sub>0</sub><sup>2</sup>',
      note: '摩擦力的功为负，动能减少。增大 μ 或 v₀，看滑行距离怎样变化：<b>s = v₀²/(2μg)</b>。'
    };
  },
  a() { return this.state.mu * g; },
  draw(dt) {
    const s = this.state;
    const a = this.a(), T = s.v0 / a;
    if (s.playing) {
      if (s.t < T) s.t = Math.min(T, s.t + dt * .55);
      else { s.hold += dt; if (s.hold > .9) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.42, .56, 13);
    base();
    ground(0, 'rgba(150,190,205,.42)');
    const x = s.x0 + s.v0 * s.t - .5 * a * s.t * s.t;
    const v = Math.max(0, s.v0 - a * s.t);
    const B = {x: x, y: .42};

    /* 走过的距离标尺 */
    const sEnd = s.v0 * s.v0 / (2 * a);
    line({x: s.x0, y: -.3}, {x: s.x0 + sEnd, y: -.3}, 'rgba(255,255,255,.16)', {w: 1.4});
    line({x: s.x0, y: -.3}, {x: x, y: -.3}, 'rgba(108,182,255,.8)', {w: 2.4});
    sans('s = ' + f1(x - s.x0) + ' m', X((s.x0 + x) / 2), Y(-.75), 'rgba(170,210,255,.9)', 11.5);

    /* 木块与摩擦 */
    box(B, .85, .72, 'rgba(108,182,255,.12)', 'rgba(108,182,255,.9)');
    if (v > .05) {
      arrow(B, {x: B.x - .75 - Math.min(1.1, a * .09), y: B.y - .25}, '#ff8fa3', {w: 2.4, head: 11});
      sans('f', Math.max(26, X(B.x - 1.0)), Y(B.y - .25) + 17, '#ffb3c6', 11, 'left');
      arrow({x: B.x + .5, y: B.y + .62}, {x: B.x + .5 + v * .13, y: B.y + .62}, '#7be0c0', {w: 2.4, head: 11});
      sans('v', X(B.x + .5 + v * .13) + 12, Y(B.y + .62) - 8, '#a9f0dd', 11.5, 'left');
    } else {
      sans('停止', X(B.x), Y(B.y + .72), 'rgba(200,220,230,.75)', 11);
    }

    /* 能量条 */
    const Ek0 = .5 * s.m * s.v0 * s.v0, Ek = .5 * s.m * v * v;
    if (s.showE) {
      const y0 = -.9, maxH = 2.5, sc = maxH / Math.max(1, Ek0);
      bar(2.4, .34, Math.max(.005, Ek * sc), y0, '#7be0c0', 'Ek', f1(Ek) + ' J');
      bar(3.4, .34, Math.max(.005, (Ek0 - Ek) * sc), y0, '#ff8fa3', '|Wf|', f1(Ek0 - Ek) + ' J');
      bar(4.4, .34, Math.max(.005, Ek0 * sc), y0, 'rgba(255,209,102,.5)', 'Ek0', f1(Ek0) + ' J');
      sans('能量 / J', X(3.4), Y(y0 + maxH + .75), 'rgba(180,200,215,.7)', 10.5);
    }

    sans('v = ' + f1(v) + ' m/s', X(-5.3), Y(3.5), 'rgba(160,235,215,.95)', 12.5, 'left');
    sans('a = μg = ' + f1(a) + ' m/s²', X(-5.3), Y(3.05), 'rgba(175,205,225,.8)', 11.5, 'left');
  },
  hud() {
    const s = this.state;
    const a = this.a(), v = Math.max(0, s.v0 - a * s.t);
    return [
      {k: '速度 v', v: f1(v) + ' m/s', hi: true},
      {k: '动能 Ek', v: f1(.5 * s.m * v * v) + ' J', hi: true},
      {k: '摩擦力做功', v: f1(-s.mu * s.m * g * (s.v0 * s.t - .5 * a * s.t * s.t)) + ' J'},
      {k: '加速度大小', v: f1(a) + ' m/s²'},
      {k: '滑行距离 s', v: f1(s.v0 * s.v0 / (2 * a)) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 2, 8, .2, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '动摩擦因数 μ', .05, .5, .01, s.mu, v => f2(v), v => { s.mu = v; s.t = 0; });
    addSlider(el, '质量 m / kg', 1, 5, .5, s.m, v => f1(v), v => s.m = v);
    addToggle(el, '显示能量条', s.showE, v => s.showE = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 重力势能与弹性势能 ---------- */
MODULES.push({
  key: 'wk-ep', tab: '03', name: '势能', en: 'POTENTIAL ENERGY', blurb: '重力势能 ↔ 弹性势能',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变质量、劲度系数与下落高度，看三种能量怎样转换',
  playable: true,
  state: {t: 0, playing: true, m: 1, k: 300, y0: 3, showE: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.m = 1; s.k = 300; s.y0 = 3; s.showE = true;
  },
  meta() {
    return {
      title: '重力势能与弹性势能的相互转化',
      desc: '小球从高处自由下落，重力势能不断转化为动能；接触弹簧后动能又转化为弹性势能，直到速度为零。整个过程中机械能保持不变，只是在不同形式之间转移。',
      formula: 'E<sub>p</sub> = mgh，E<sub>p</sub> = ½kx<sup>2</sup><br>E<sub>k</sub> + E<sub>p</sub> = 常量',
      note: '三种能量之和始终等于初始的重力势能，条形图总高度不变——这就是<b>机械能守恒</b>。'
    };
  },
  YC: .72,
  calc() {
    const s = this.state, yc = this.YC;
    const t1 = Math.sqrt(Math.max(.001, 2 * (s.y0 - yc) / g));
    const v1 = g * t1, w = Math.sqrt(s.k / s.m), xe = s.m * g / s.k;
    const xAt = tau => xe * (1 - Math.cos(w * tau)) + (v1 / w) * Math.sin(w * tau);
    let t2 = 0;
    for (let i = 1; i <= 4000; i++) {
      const tau = i * .0005;
      if (xAt(tau) <= 0) { t2 = tau; break; }
    }
    const v2 = Math.abs(-xe * w * Math.sin(w * t2) + v1 * Math.cos(w * t2));
    const t3 = v2 / g;
    let xmax = 0;
    for (let i = 0; i <= 400; i++) {
      const tau = t2 * i / 400;
      xmax = Math.max(xmax, xAt(tau));
    }
    return {t1: t1, t2: t2, t3: t3, v1: v1, v2: v2, w: w, xe: xe, xAt: xAt, xmax: xmax, T: t1 + t2 + t3};
  },
  state_at(t) {
    const s = this.state, c = this.calc(), yc = this.YC;
    if (t < c.t1) return {y: s.y0 - .5 * g * t * t, v: g * t, ph: 0};
    if (t < c.t1 + c.t2) {
      const tau = t - c.t1;
      return {y: yc - c.xAt(tau), v: Math.abs(c.w * (c.xe * Math.sin(c.w * tau) + (c.v1 / c.w) * Math.cos(c.w * tau))), ph: 1};
    }
    const tau = Math.min(t - c.t1 - c.t2, c.t3);
    return {y: yc + c.v2 * tau - .5 * g * tau * tau, v: Math.max(0, c.v2 - g * tau), ph: 2};
  },
  draw(dt) {
    const s = this.state, c = this.calc();
    if (s.playing) {
      s.t += dt * .55;
      if (s.t > c.T) s.t = 0;
    }
    setFrame(.36, .76, 12.5);
    base();
    ground(0, 'rgba(150,190,205,.45)');
    const st = this.state_at(s.t);
    const x = Math.max(0, this.YC - st.y);

    /* 零势能面与高度标注 */
    line({x: -4.4, y: 0}, {x: 2.2, y: 0}, 'rgba(255,209,102,.35)', {w: 1.2, dash: [6, 5]});
    sans('零势能面', X(-4.3), Y(-.32), 'rgba(255,215,150,.6)', 10, 'left');
    line({x: -1.5, y: 0}, {x: -1.5, y: st.y}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 5]});
    sans('h = ' + f2(st.y) + ' m', X(-1.5) - 10, Y(st.y / 2), 'rgba(220,235,240,.7)', 10.5, 'right');

    /* 弹簧 */
    spring({x: 0, y: .06}, {x: 0, y: .5 - x}, 9, 'rgba(255,197,107,.85)', {amp: .16, w: 2});
    line({x: -.42, y: .5 - x}, {x: .42, y: .5 - x}, 'rgba(255,197,107,.85)', {w: 2.4});
    line({x: -.42, y: .06}, {x: .42, y: .06}, 'rgba(255,197,107,.5)', {w: 2});

    /* 小球 */
    const yb = this.YC - x;
    circleAt({x: 0, y: yb}, .22, 'rgba(255,143,163,.85)', 'rgba(255,200,210,.95)', {w: 1.6});
    if (st.v > .05) {
      arrow({x: .32, y: yb}, {x: .32, y: yb - Math.min(1.1, st.v * .09)}, '#7be0c0', {w: 2, head: 9});
      sans('v', X(.32) + 12, Y(yb - Math.min(1.1, st.v * .09) / 2), '#a9f0dd', 11, 'left');
    }

    /* 小球初始高度 */
    line({x: -2.0, y: s.y0}, {x: .5, y: s.y0}, 'rgba(255,255,255,.10)', {w: 1, dash: [4, 5]});
    sans('h₀ = ' + f1(s.y0) + ' m', X(.55), Y(s.y0) + 12, 'rgba(200,220,230,.55)', 10, 'left');

    /* 能量条 */
    const Ep = s.m * g * st.y, Es = .5 * s.k * x * x, Ek = .5 * s.m * st.v * st.v;
    const tot = s.m * g * s.y0;
    if (s.showE) {
      const y0 = -.55, sc = 3.2 / Math.max(1, tot);
      bar(3.2, .32, Ek * sc, y0, '#7be0c0', 'Ek', f1(Ek) + ' J');
      bar(4.2, .32, Ep * sc, y0, '#6cb6ff', 'Ep重', f1(Ep) + ' J');
      bar(5.2, .32, Es * sc, y0, '#ffc56b', 'Ep弹', f1(Es) + ' J');
      line({x: 2.6, y: y0 + tot * sc}, {x: 5.7, y: y0 + tot * sc}, 'rgba(255,255,255,.35)', {w: 1.2, dash: [6, 5]});
      sans('总机械能 ' + f1(tot) + ' J', X(4.2), Y(y0 + tot * sc + .72), 'rgba(220,235,240,.85)', 10.5);
    }

    sans('最大压缩量 x = ' + f2(c.xmax) + ' m', X(-4.35), Y(3.55), 'rgba(255,215,150,.9)', 10.5, 'left');
  },
  hud() {
    const s = this.state, st = this.state_at(s.t);
    const x = Math.max(0, this.YC - st.y);
    return [
      {k: '小球高度 h', v: f2(st.y) + ' m'},
      {k: '速度 v', v: f2(st.v) + ' m/s', hi: true},
      {k: '重力势能', v: f1(s.m * g * st.y) + ' J'},
      {k: '弹性势能', v: f1(.5 * s.k * x * x) + ' J', hi: true},
      {k: '动能', v: f1(.5 * s.m * st.v * st.v) + ' J'},
      {k: '总机械能', v: f1(s.m * g * s.y0) + ' J'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '质量 m / kg', .5, 2, .1, s.m, v => f2(v), v => { s.m = v; s.t = 0; });
    addSlider(el, '劲度系数 k / (N/m)', 100, 400, 10, s.k, v => (v / 1).toFixed(0), v => { s.k = v; s.t = 0; });
    addSlider(el, '下落高度 h / m', 1.8, 3.6, .1, s.y0, v => f2(v), v => { s.y0 = v; s.t = 0; });
    addToggle(el, '显示能量条', s.showE, v => s.showE = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 机械能守恒：摆 ---------- */
MODULES.push({
  key: 'wk-pend', tab: '04', name: '机械能守恒', en: 'CONSERVATION', blurb: '摆球的总能量不变',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '改变摆长与释放角度，看动能与势能此消彼长',
  playable: true,
  state: {t: 0, playing: true, L: 2.1, th0: 50, m: 1, th: 50, dir: 1, showE: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.L = 2.1; s.th0 = 50; s.m = 1;
    s.th = 50; s.dir = 1; s.showE = true;
  },
  meta() {
    return {
      title: '只有重力做功，机械能守恒',
      desc: '把摆球拉到一定角度释放。摆球下降时重力势能转化为动能，上升时动能又变回重力势能。忽略空气阻力，动能与重力势能之和始终不变，摆动幅度也不会减小。',
      formula: 'E<sub>k</sub> + E<sub>p</sub> = 常量<br>mgh = ½mv<sup>2</sup>',
      note: '观察能量条：<b>两根柱子此消彼长</b>，总高度不变。摆到最高点时动能为零，全部是重力势能。'
    };
  },
  P() { return {x: 0, y: 3.0}; },
  geo() {
    const s = this.state, P = this.P();
    const r = s.th * Math.PI / 180;
    return {r: r, x: P.x + s.L * Math.sin(r), y: P.y - s.L * Math.cos(r)};
  },
  draw(dt) {
    const s = this.state, P = this.P(), G0 = this.geo();
    if (s.playing) {
      const vv = Math.max(.12, Math.sqrt(Math.max(0, 2 * g * s.L * (Math.cos(G0.r) - Math.cos(s.th0 * Math.PI / 180)))));
      s.th += s.dir * vv / s.L * dt * 57.2958;
      if (s.th > s.th0) { s.th = s.th0; s.dir = -1; }
      if (s.th < -s.th0) { s.th = -s.th0; s.dir = 1; }
    }
    setFrame(.5, .52, 11.5);
    base();
    const G1 = this.geo();
    const h = s.L * (Math.cos(G1.r) - Math.cos(s.th0 * Math.PI / 180));
    const v = Math.sqrt(Math.max(0, 2 * g * h));

    /* 支架 */
    line({x: -1.2, y: P.y}, {x: 1.2, y: P.y}, 'rgba(200,220,230,.35)', {w: 2});
    line({x: P.x, y: P.y}, {x: P.x, y: P.y + .45}, 'rgba(200,220,230,.3)', {w: 3});
    dot(P, 'rgba(200,220,230,.75)', 4);

    /* 轨迹弧与最低点参考 */
    const arc = [];
    for (let a = -s.th0; a <= s.th0; a += 1) {
      const r = a * Math.PI / 180;
      arc.push({x: P.x + s.L * Math.sin(r), y: P.y - s.L * Math.cos(r)});
    }
    path(arc, 'rgba(123,224,192,.25)', {w: 1.4, dash: [5, 6]});
    const low = {x: P.x, y: P.y - s.L};
    line({x: low.x - 1.5, y: low.y}, {x: low.x + 1.5, y: low.y}, 'rgba(255,209,102,.35)', {w: 1.2, dash: [6, 5]});
    sans('最低点', X(low.x + 1.6), Y(low.y) + 12, 'rgba(255,215,150,.6)', 10, 'left');

    /* 绳与球 */
    line(P, {x: G1.x, y: G1.y}, 'rgba(225,235,240,.75)', {w: 1.6});
    const B = {x: G1.x, y: G1.y};
    if (v > .05) {
      const tx = Math.cos(G1.r) * (s.dir >= 0 ? 1 : -1), ty = Math.sin(G1.r) * (s.dir >= 0 ? 1 : -1);
      arrow(B, {x: B.x + tx * v * .1, y: B.y + ty * v * .1}, '#6cb6ff', {w: 2.4, head: 10});
      sans('v', X(B.x + tx * v * .1) + 12, Y(B.y + ty * v * .1) - 8, '#a8d0ff', 11, 'left');
    }
    circleAt(B, .18, 'rgba(255,143,163,.9)', 'rgba(255,205,215,.95)', {w: 1.5});

    /* 高度 */
    line({x: B.x, y: B.y}, {x: B.x, y: low.y}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 4]});
    sans('h = ' + f2(h) + ' m', X(B.x) + 10, Y((B.y + low.y) / 2), 'rgba(220,235,240,.7)', 10, 'left');
    sans('θ = ' + f1(s.th) + '°', X(P.x) - 26, Y(P.y - .34), 'rgba(255,215,150,.85)', 10.5, 'right');

    /* 能量条 */
    const Ek = .5 * s.m * v * v, Ep = s.m * g * h, tot = s.m * g * s.L * (1 - Math.cos(s.th0 * Math.PI / 180));
    if (s.showE) {
      const y0 = -0.4, sc = 3.1 / Math.max(.5, tot);
      bar(2.3, .34, Ek * sc, y0, '#6cb6ff', 'Ek', f1(Ek) + ' J');
      bar(3.3, .34, Ep * sc, y0, '#ffc56b', 'Ep', f1(Ep) + ' J');
      line({x: 1.8, y: y0 + tot * sc}, {x: 3.9, y: y0 + tot * sc}, 'rgba(255,255,255,.32)', {w: 1.2, dash: [6, 5]});
      sans('E总 = ' + f1(tot) + ' J', X(3.1), Y(y0 + tot * sc + .3), 'rgba(220,235,240,.85)', 10.5);
    }

    sans('L = ' + f1(s.L) + ' m，θ₀ = ' + f1(s.th0) + '°', X(-5.4), Y(3.5), 'rgba(150,240,215,.9)', 11.5, 'left');
  },
  hud() {
    const s = this.state, G1 = this.geo();
    const h = s.L * (Math.cos(G1.r) - Math.cos(s.th0 * Math.PI / 180));
    const v = Math.sqrt(Math.max(0, 2 * g * h));
    const tot = s.m * g * s.L * (1 - Math.cos(s.th0 * Math.PI / 180));
    return [
      {k: '摆角 θ', v: f1(s.th) + '°'},
      {k: '速度 v', v: f2(v) + ' m/s', hi: true},
      {k: '高度 h', v: f2(h) + ' m'},
      {k: '动能 Ek', v: f2(.5 * s.m * v * v) + ' J', hi: true},
      {k: '总机械能', v: f2(tot) + ' J'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '摆长 L / m', 1.4, 2.4, .1, s.L, v => f1(v), v => { s.L = v; s.th = s.th0; s.dir = 1; });
    addSlider(el, '释放角 θ₀ / °', 15, 70, 1, s.th0, v => f1(v), v => { s.th0 = v; s.th = v; s.dir = 1; });
    addSlider(el, '质量 m / kg', .5, 2, .1, s.m, v => f1(v), v => s.m = v);
    addToggle(el, '显示能量条', s.showE, v => s.showE = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 功能关系与摩擦生热 ---------- */
MODULES.push({
  key: 'wk-heat', tab: '05', name: '摩擦生热', en: 'FRICTION & HEAT', blurb: '相对位移才生热',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变初速度与动摩擦因数，看相对位移与热量',
  playable: true,
  state: {t: 0, playing: true, v0: 4.5, mu: .35, M: 4, hold: 0, showRel: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.v0 = 4.5; s.mu = .35; s.M = 4; s.hold = 0; s.showRel = true;
  },
  meta() {
    return {
      title: '摩擦生热：用相对位移来计算',
      desc: '木块滑上静止的长木板，两者之间发生相对滑动。摩擦力对木块做负功、对木板做正功，这一对力做功的代数和为负，其绝对值等于产生的热量，由相对位移决定。',
      formula: 'Q = f·Δs<sub>相对</sub> = μmg·Δs<sub>相对</sub><br>Q = ΔE<sub>k</sub>',
      note: '热量按<b>相对位移</b>算，不是按木块对地的位移算。两者最后速度相同，相对滑动才停止。'
    };
  },
  m() { return 2; },
  acc() {
    const s = this.state;
    return {a: s.mu * g, aB: s.mu * g * this.m() / s.M};
  },
  tStar() {
    const s = this.state, A = this.acc();
    return s.v0 / (A.a + A.aB);
  },
  draw(dt) {
    const s = this.state;
    const A = this.acc(), ts = this.tStar(), m = this.m();
    if (s.playing) {
      if (s.t < ts) s.t = Math.min(ts, s.t + dt * .5);
      else { s.hold += dt; if (s.hold > 1.1) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.42, .6, 13);
    base();
    ground(0, 'rgba(150,190,205,.42)');

    const sb = s.v0 * s.t - .5 * A.a * s.t * s.t;
    const sB = .5 * A.aB * s.t * s.t;
    const vb = Math.max(0, s.v0 - A.a * s.t);
    const vB = A.aB * s.t;
    const boardX = -5.4 + sB;

    /* 长木板 */
    rect({x: boardX, y: 0}, {x: boardX + 5.4, y: .38}, 'rgba(180,156,255,.10)', 'rgba(180,156,255,.65)', {w: 1.6});
    /* 木块 */
    const bx = -5.0 + sb;
    box({x: bx, y: .78}, .9, .76, 'rgba(255,143,163,.14)', 'rgba(255,143,163,.9)');

    /* 相对位移：板上标记点与木块之间 */
    if (s.showRel) {
      const mark = boardX + .4;
      line({x: mark, y: .28}, {x: mark, y: 1.42}, 'rgba(255,255,255,.25)', {w: 1, dash: [4, 4]});
      line({x: bx, y: 1.42}, {x: bx, y: 1.62}, 'rgba(255,215,150,.7)', {w: 1.2});
      line({x: bx, y: 1.52}, {x: mark, y: 1.52}, 'rgba(255,209,102,.75)', {w: 1.6});
      sans('Δs相对 = ' + f1(Math.max(0, sb - sB)) + ' m', X((bx + mark) / 2), Y(1.85), 'rgba(255,215,150,.95)', 10.5);
    }

    /* 速度箭头 */
    if (vb > .05) {
      arrow({x: bx, y: .78}, {x: bx + Math.min(1.2, vb * .16), y: .78}, '#7be0c0', {w: 2.2, head: 10});
      sans('v木', X(bx) + Math.min(1.2, vb * .16) + 10, Y(.78) - 10, '#a9f0dd', 10.5, 'left');
    }
    if (vB > .05) {
      arrow({x: boardX + 4.2, y: .2}, {x: boardX + 4.2 + Math.min(1.0, vB * .16), y: .2}, '#b49cff', {w: 2.2, head: 10});
      sans('v板', X(boardX + 4.2) + Math.min(1.0, vB * .16) + 10, Y(.2) - 10, '#cdbaff', 10.5, 'left');
    }

    /* 热量读数 */
    const rel = Math.max(0, sb - sB);
    const Q = s.mu * m * g * rel;
    sans('Q = μmg·Δs相对 = ' + f1(Q) + ' J', X(-5.3), Y(3.55), 'rgba(255,180,196,.95)', 11.5, 'left');
    sans('v木 = ' + f1(vb) + ' m/s，v板 = ' + f1(vB) + ' m/s', X(-5.3), Y(3.1), 'rgba(175,205,225,.8)', 10.5, 'left');
  },
  hud() {
    const s = this.state, A = this.acc(), m = this.m();
    const sb = s.v0 * s.t - .5 * A.a * s.t * s.t, sB = .5 * A.aB * s.t * s.t;
    const rel = Math.max(0, sb - sB);
    const vi = s.v0, vc = m * s.v0 / (m + s.M);
    return [
      {k: '木块速度', v: f1(Math.max(0, s.v0 - A.a * s.t)) + ' m/s', hi: true},
      {k: '木板速度', v: f1(A.aB * s.t) + ' m/s'},
      {k: '相对位移', v: f1(rel) + ' m', hi: true},
      {k: '产生的热量', v: f1(s.mu * m * g * rel) + ' J'},
      {k: '动能损失', v: f1(.5 * m * vi * vi - .5 * (m + s.M) * vc * vc) + ' J'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '木块初速度 v₀ / (m/s)', 2.5, 5.5, .1, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '动摩擦因数 μ', .2, .5, .01, s.mu, v => f2(v), v => { s.mu = v; s.t = 0; });
    addSlider(el, '木板质量 M / kg', 3, 8, .5, s.M, v => f1(v), v => { s.M = v; s.t = 0; });
    addToggle(el, '显示相对位移', s.showRel, v => s.showRel = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
