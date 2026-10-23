/* ============================================================
   选择性必修第一册 · 第 2 章 机械振动
   01 简谐运动的图象  02 弹簧振子的回复力  03 单摆周期
   04 阻尼振动与受迫振动  05 共振
   ============================================================ */
(function () {

const PI2 = Math.PI * 2;

function f1(v) {
  const s = (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
  return s.replace('-', '−');
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.replace(/0+$/, '').replace(/\.$/, '').replace('-', '−');
}

function axisL(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .45, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .45}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 3, Y(y0) + 15, 'rgba(170,198,210,.85)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) + 12, 'rgba(170,198,210,.85)', 11, 'right');
}

function wallBand(x, y0, y1, color) {
  rect({x: x - .16, y: y0}, {x: x, y: y1}, 'rgba(150,180,195,.18)', color || 'rgba(170,200,215,.5)', {w: 1.4});
  for (let y = y0; y < y1; y += .34) {
    line({x: x - .16, y: y}, {x: x - .42, y: y - .18}, 'rgba(170,200,215,.3)', {w: 1});
  }
}

/* ---------- 01 简谐运动的图象 ---------- */
MODULES.push({
  key: 'shm-graph', tab: '01', name: '简谐运动图象', en: 'SIMPLE HARMONIC', blurb: '正弦曲线的来历',
  accent: '#9ad0ff', rgb: '154,208,255',
  hint: '让参考圆上的点匀速转动，看它的投影画出正弦曲线',
  playable: true,
  state: {t: 0, playing: true, A: 6, T: 1.6, showCircle: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.A = 6; s.T = 1.6; s.showCircle = true; },
  meta() {
    return {
      title: '匀速圆周运动的投影就是简谐运动',
      desc: '把一个匀速转动的参考圆上的点投影到竖直直径上，投影点的高低随时间按正弦规律变化，正是弹簧振子的位移—时间图象。圆周运动转一周，振子恰好完成一次全振动。',
      formula: 'x = A sin(ωt)，ω = 2π/T',
      note: '图象的<b>峰值</b>是振幅 A，<b>两个相邻峰值</b>之间的时间间隔是周期 T。位移图线不是振子的运动轨迹。'
    };
  },
  om() { return PI2 / Math.max(.4, this.state.T); },
  AW() { return this.state.A / 3; },
  gx(t) { return -6.5 + t * 1.1; },
  gy(x) { return -.7 + x * .86; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 6) s.t = 0; }
    setFrame(.5, .55, 15);
    base();

    const w = this.om(), A = this.AW();
    axisL(-6.6, .45, this.gy(0), this.gy(2.55), 't / s', 'x');
    for (let t = 0; t <= 6; t += 1) {
      line({x: this.gx(t), y: this.gy(0)}, {x: this.gx(t), y: this.gy(0) - .07}, 'rgba(198,222,232,.45)', {w: 1});
      sans(String(t), X(this.gx(t)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.7)', 10);
    }
    sans('+' + String(Math.round(s.A)) + ' cm', X(-6.5) - 6, Y(this.gy(A)), 'rgba(170,198,210,.7)', 10, 'right');
    sans('−' + String(Math.round(s.A)) + ' cm', X(-6.5) - 6, Y(this.gy(-A)), 'rgba(170,198,210,.7)', 10, 'right');
    line({x: -6.6, y: this.gy(A)}, {x: .4, y: this.gy(A)}, 'rgba(255,255,255,.1)', {w: 1, dash: [4, 5]});
    line({x: -6.6, y: this.gy(-A)}, {x: .4, y: this.gy(-A)}, 'rgba(255,255,255,.1)', {w: 1, dash: [4, 5]});

    /* 完整曲线（暗） */
    const all = [];
    for (let t = 0; t <= 6; t += .04) all.push({x: this.gx(t), y: this.gy(A * Math.sin(w * t))});
    path(all, 'rgba(154,208,255,.22)', {w: 1.6});

    const trace = [];
    for (let t = 0; t <= s.t; t += .03) trace.push({x: this.gx(t), y: this.gy(A * Math.sin(w * t))});
    if (trace.length > 1) path(trace, '#9ad0ff', {w: 2.6, glow: 8});

    const x = A * Math.sin(w * s.t);
    const pt = {x: this.gx(s.t), y: this.gy(x)};
    dot(pt, '#e8f4ff', 5.5);
    line({x: pt.x, y: this.gy(0)}, pt, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});

    /* 参考圆 */
    if (s.showCircle) {
      const cx = 3.9, cy = this.gy(0), R = A * .72;
      circleAt({x: cx, y: cy}, R, 'rgba(154,208,255,.05)', 'rgba(154,208,255,.45)', {w: 1.4, dash: [5, 4]});
      const th = w * s.t;
      const px = cx + R * Math.sin(th), py = cy + R * Math.cos(th);
      line({x: cx, y: cy}, {x: px, y: py}, 'rgba(154,208,255,.75)', {w: 2});
      dot({x: px, y: py}, '#9ad0ff', 6);
      dot({x: cx, y: cy}, 'rgba(200,225,240,.7)', 3);
      line({x: px, y: py}, {x: px, y: cy}, 'rgba(154,208,255,.35)', {w: 1.2, dash: [4, 4]});
      line({x: cx, y: py}, {x: px, y: py}, 'rgba(154,208,255,.35)', {w: 1.2, dash: [4, 4]});
      line({x: cx - R - .5, y: py}, {x: this.gx(s.t), y: py}, 'rgba(255,255,255,.14)', {w: 1, dash: [3, 6]});
      circleAt({x: cx, y: py}, .09, '#ffffff', null, {w: 0});
      sans('参考圆', X(cx), Y(cy + R + .42), 'rgba(170,205,225,.8)', 11);
      sans('匀速转动 ω = ' + f2(w) + ' rad/s', X(cx), Y(cy + R + .95), 'rgba(170,205,225,.6)', 10);
      math('A', X(cx) + 12, Y(cy + R / 2) + 6, 'rgba(200,225,240,.8)', 15);
    }
    sans('x = A sin ωt', X(-6.3), Y(this.gy(2.72)), 'rgba(154,208,255,.9)', 13, 'left');
  },
  hud() {
    const s = this.state, w = this.om();
    const x = this.AW() * Math.sin(w * s.t);
    return [
      {k: '振幅 A', v: String(Math.round(s.A)) + ' cm', hi: true},
      {k: '周期 T', v: f2(s.T) + ' s', hi: true},
      {k: '频率 f', v: f2(1 / s.T) + ' Hz'},
      {k: '位移 x', v: f1(x * 3) + ' cm'},
      {k: '相位 ωt', v: f1(w * s.t) + ' rad'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '振幅 A / cm', 2, 8, .5, s.A, v => String(Math.round(v)), v => s.A = v);
    addSlider(el, '周期 T / s', .8, 3, .1, s.T, v => f2(v), v => s.T = v);
    addToggle(el, '显示参考圆', s.showCircle, v => s.showCircle = v);
    addBtn(el, '从头播放', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 弹簧振子的回复力 ---------- */
MODULES.push({
  key: 'spring', tab: '02', name: '弹簧振子', en: 'SPRING OSCILLATOR', blurb: '力与位移反向',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '改变劲度系数与质量，比较回复力、加速度与位移的方向',
  playable: true,
  state: {t: 0, playing: true, k: 60, m: .5, A: 6, showF: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.k = 60; s.m = .5; s.A = 6; s.showF = true; },
  meta() {
    return {
      title: '回复力 F = −kx 指向平衡位置',
      desc: '水平弹簧振子在光滑杆上往复运动。位移向右时弹簧被拉长，回复力向左；位移向左时弹簧被压缩，回复力向右。力总是与位移反向，大小与位移成正比，所以叫简谐运动。',
      formula: 'F = −kx，a = −(k/m)x，T = 2π√(m/k)',
      note: '在<b>平衡位置</b>回复力为零而速度最大；在<b>最大位移处</b>速度为零而回复力最大。'
    };
  },
  om() { return Math.sqrt(this.state.k / this.state.m); },
  AW() { return this.state.A / 3; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .55, 15);
    base();

    const w = this.om(), A = this.AW();
    const x = A * Math.cos(w * s.t);
    const v = -A * w * Math.sin(w * s.t);
    const a = -w * w * x * .03;
    const bx = x, by = .55;
    const floor = .05;

    line({x: -7, y: floor}, {x: 7, y: floor}, 'rgba(170,205,220,.35)', {w: 1.6});
    for (let kk = -7; kk < 7; kk += .5) line({x: kk, y: floor}, {x: kk - .18, y: floor - .22}, 'rgba(170,205,220,.16)', {w: 1});

    wallBand(-5.6, floor, 2.4, 'rgba(170,200,215,.45)');
    spring({x: -5.6, y: by}, {x: bx - .55, y: by}, 16, 'rgba(94,234,212,.85)', {amp: .2, w: 1.8});

    rect({x: bx - .55, y: by - .5}, {x: bx + .55, y: by + .5}, 'rgba(16,34,44,.95)', '#5eead4', {w: 1.8});
    sans('m', X(bx), Y(by), 'rgba(200,245,235,.9)', 13);

    line({x: 0, y: floor}, {x: 0, y: 2.2}, 'rgba(255,255,255,.2)', {w: 1.1, dash: [5, 5]});
    sans('O 平衡位置', X(.35), Y(2.05), 'rgba(180,210,220,.65)', 10.5, 'left');
    arrow({x: 0, y: -.32}, {x: bx, y: -.32}, '#9ad0ff', {w: 2, head: 9});
    sans('x = ' + f1(x * 3) + ' cm', X(bx / 2), Y(-.64), 'rgba(180,220,255,.9)', 11);

    if (s.showF) {
      const F = -s.k * x * .03;
      arrow({x: bx, y: by + 1.0}, {x: bx + clamp(F * .5, -2.2, 2.2), y: by + 1.0}, '#ff8fab', {w: 2.8, head: 12});
      sans('F = ' + f2(F) + ' N', X(bx), Y(by + 1.45), 'rgba(255,179,198,.95)', 11);
      arrow({x: bx, y: by + 1.85}, {x: bx + clamp(a * .18, -1.6, 1.6), y: by + 1.85}, '#ffc56b', {w: 2, head: 9});
      sans('a = ' + f1(a) + ' m/s²', X(bx), Y(by + 2.25), 'rgba(255,215,154,.9)', 10.5);
    }
    if (Math.abs(v) > .05) {
      arrow({x: bx, y: by - 1.1}, {x: bx + clamp(v * 1.5, -1.7, 1.7), y: by - 1.1}, '#6cb6ff', {w: 2.4, head: 10});
      sans('v = ' + f2(v * .03) + ' m/s', X(bx), Y(by - 1.44), 'rgba(168,208,255,.9)', 10.5);
    }

    sans('k = ' + String(Math.round(s.k)) + ' N/m    m = ' + f1(s.m) + ' kg    T = 2π√(m/k) = ' + f2(PI2 / w) + ' s',
      X(-7.2), Y(-1.95), 'rgba(180,215,225,.85)', 12, 'left');
    sans('F 与 x 始终反向：拉长时被拉回，压缩时被推回', X(-7.2), Y(-2.42), 'rgba(150,190,205,.6)', 11, 'left');
  },
  hud() {
    const s = this.state, w = this.om(), A = this.AW();
    const x = A * Math.cos(w * s.t), v = -A * w * Math.sin(w * s.t);
    return [
      {k: '位移 x', v: f1(x * 3) + ' cm', hi: true},
      {k: '回复力 F', v: f2(-s.k * x * .03) + ' N', hi: true},
      {k: '加速度 a', v: f1(-w * w * x * .03) + ' m/s²'},
      {k: '速度 v', v: f2(v * .03) + ' m/s'},
      {k: '周期 T', v: f2(PI2 / w) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '劲度系数 k / (N/m)', 20, 120, 5, s.k, v => String(Math.round(v)), v => s.k = v);
    addSlider(el, '振子质量 m / kg', .2, 1.2, .05, s.m, v => f1(v), v => s.m = v);
    addSlider(el, '振幅 A / cm', 3, 8, .5, s.A, v => String(Math.round(v)), v => s.A = v);
    addToggle(el, '显示力与加速度', s.showF, v => s.showF = v);
    addBtn(el, '回到平衡位置', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 单摆的周期 ---------- */
MODULES.push({
  key: 'pendulum', tab: '03', name: '单摆', en: 'PENDULUM', blurb: '只与摆长和 g 有关',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变摆长与重力加速度，验证周期与摆球质量、振幅无关',
  playable: true,
  state: {t: 0, playing: true, L: 1, g: 9.8, th0: 14, showArc: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.L = 1; s.g = 9.8; s.th0 = 14; s.showArc = true; },
  meta() {
    return {
      title: '单摆的周期由摆长和重力加速度决定',
      desc: '摆球在重力与绳拉力作用下绕悬点摆动。摆角很小时，回复力与位移成正比，单摆做简谐运动。改变摆长、换到重力不同的星球，周期随之改变；改变摆球质量或小振幅，周期几乎不变。',
      formula: 'T = 2π√(L/g)',
      note: '公式只在<b>小角度（θ < 5°）</b>下成立。摆长是从悬点到摆球<b>球心</b>的距离。'
    };
  },
  om() { return Math.sqrt(this.state.g / Math.max(.2, this.state.L)); },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .58, 15);
    base();

    const w = this.om(), th0 = s.th0 * Math.PI / 180;
    const th = th0 * Math.cos(w * s.t);
    const SC = 2.15;
    const piv = {x: 0, y: 3.35};
    const Lr = s.L * SC;
    const bob = {x: piv.x + Lr * Math.sin(th), y: piv.y - Lr * Math.cos(th)};

    /* 天花板 */
    rect({x: -2.6, y: 3.55}, {x: 2.6, y: 3.95}, 'rgba(150,180,195,.18)', 'rgba(170,200,215,.5)', {w: 1.4});
    for (let x = -2.5; x < 2.6; x += .42) line({x: x, y: 3.55}, {x: x - .2, y: 3.33}, 'rgba(170,200,215,.3)', {w: 1});
    circleAt(piv, .1, 'rgba(200,220,235,.9)', null, {w: 0});

    /* 摆动轨迹 */
    if (s.showArc) {
      const arc = [];
      for (let k = 0; k <= 24; k++) {
        const q = -th0 + 2 * th0 * k / 24;
        arc.push({x: piv.x + Lr * Math.sin(q), y: piv.y - Lr * Math.cos(q)});
      }
      path(arc, 'rgba(180,156,255,.35)', {w: 1.6, dash: [6, 5]});
    }
    line({x: piv.x, y: piv.y}, {x: piv.x, y: piv.y - Lr - .45}, 'rgba(255,255,255,.18)', {w: 1.1, dash: [5, 5]});
    line(piv, bob, 'rgba(210,225,235,.9)', {w: 2});
    circleAt(bob, .34, 'rgba(180,156,255,.9)', 'rgba(220,205,255,.95)', {w: 1.4});
    dot(bob, '#ffffff', 2.5);

    angleArc(piv, -Math.PI / 2, th - Math.PI / 2, 76, 'rgba(255,197,107,.65)',
      f1(Math.abs(th) * 180 / Math.PI) + '°', 11);

    /* 摆长标注 */
    const mx = (piv.x + bob.x) / 2, my = (piv.y + bob.y) / 2;
    sans('L = ' + f1(s.L) + ' m', X(mx) - 14, Y(my), 'rgba(210,225,235,.85)', 11, 'right');

    /* 数据 */
    const T0 = PI2 * Math.sqrt(s.L / s.g);
    const Tc = T0 * (1 + th0 * th0 / 16 + 11 * Math.pow(th0, 4) / 3072);
    sans('T = 2π√(L/g) = ' + f2(T0) + ' s', X(-6.9), Y(-1.95), '#cabaff', 13, 'left');
    sans('摆角 ' + String(Math.round(s.th0)) + '° 时的实际周期 ' + f2(Tc) + ' s', X(-6.9), Y(-2.45), 'rgba(175,205,215,.7)', 10.5, 'left');
    sans('g = ' + f1(s.g) + ' m/s²', X(-6.9), Y(-2.85), 'rgba(175,205,215,.7)', 10.5, 'left');

    /* 摆球速度矢量 */
    const v = -Lr * th0 * w * Math.sin(w * s.t);
    if (Math.abs(v) > .08) {
      arrow(bob, {x: bob.x + v * .5, y: bob.y + th * .2}, '#6cb6ff', {w: 2.2, head: 10});
    }
  },
  hud() {
    const s = this.state, T0 = PI2 * Math.sqrt(s.L / s.g);
    const th0 = s.th0 * Math.PI / 180;
    const Tc = T0 * (1 + th0 * th0 / 16);
    const th = th0 * Math.cos(this.om() * s.t);
    return [
      {k: '摆长 L', v: f1(s.L) + ' m'},
      {k: '周期 T', v: f2(Tc) + ' s', hi: true},
      {k: '频率 f', v: f2(1 / Tc) + ' Hz'},
      {k: '当前偏角', v: f1(Math.abs(th) * 180 / Math.PI) + '°'},
      {k: '摆球速度', v: f1(Math.abs(s.L * th0 * this.om() * Math.sin(this.om() * s.t))) + ' m/s', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '摆长 L / m', .4, 1.6, .05, s.L, v => f2(v), v => s.L = v);
    addSlider(el, '重力加速度 g / (m/s²)', 1.6, 15, .1, s.g, v => f1(v), v => s.g = v);
    addSlider(el, '最大摆角 θ₀ / °', 2, 25, 1, s.th0, v => String(Math.round(v)), v => { s.th0 = v; s.t = 0; });
    addToggle(el, '显示摆动轨迹', s.showArc, v => s.showArc = v);
    addBtn(el, '月球（g = 1.6）', () => { s.g = 1.6; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 阻尼振动与受迫振动 ---------- */
MODULES.push({
  key: 'damped', tab: '04', name: '阻尼与受迫', en: 'DAMPED & DRIVEN', blurb: '振幅为何衰减',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '切换阻尼振动与受迫振动，看振动频率由谁决定',
  playable: true,
  state: {t: 0, playing: true, mode: 0, b: .3, fd: 1.8, showEnv: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.mode = 0; s.b = .3; s.fd = 1.8; s.showEnv = true; },
  meta() {
    return {
      title: '阻尼让振幅衰减，受迫让频率被"接管"',
      desc: '阻尼振动中，能量不断转化为内能，振幅按指数规律衰减，但周期几乎不变。受迫振动中，振子最终按驱动力的频率振动，这个频率由驱动力决定，与振子的固有频率无关。',
      formula: 'x = A e<sup>−bt</sup>cos ωt（阻尼）　f = f<sub>驱</sub>（受迫）',
      note: '看<b>振幅包络线</b>：阻尼振动中它是一条下降的指数曲线；受迫振动进入稳定后振幅不再变化。'
    };
  },
  om0() { return PI2 * 1.2; },
  gx(t) { return -6.4 + t * .88; },
  gy(x) { return .1 + x * 1.35; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 10) s.t = 0; }
    setFrame(.5, .56, 15);
    base();

    const w0 = this.om0(), wd = PI2 * s.fd;
    const ex = t => Math.exp(-s.b * t);
    const xs = t => s.mode === 0
      ? Math.cos(w0 * t) * ex(t)
      : Math.cos(wd * t) * (1 - Math.exp(-1.4 * t)) * .85 + Math.cos(w0 * t) * ex(t) * .35;

    axisL(-6.6, 2.6, this.gy(0), this.gy(1.25), 't / s', 'x');
    for (let t = 0; t <= 10; t += 2) {
      line({x: this.gx(t), y: this.gy(0)}, {x: this.gx(t), y: this.gy(0) - .07}, 'rgba(198,222,232,.45)', {w: 1});
      sans(String(t), X(this.gx(t)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.7)', 10);
    }
    const lim0 = this.gy(1.05);
    line({x: -6.6, y: lim0}, {x: 2.5, y: lim0}, 'rgba(255,255,255,.1)', {w: 1, dash: [4, 5]});
    line({x: -6.6, y: this.gy(-1.05)}, {x: 2.5, y: this.gy(-1.05)}, 'rgba(255,255,255,.1)', {w: 1, dash: [4, 5]});

    if (s.mode === 0 && s.showEnv) {
      const up = [], dn = [];
      for (let t = 0; t <= 10; t += .1) {
        up.push({x: this.gx(t), y: this.gy(ex(t))});
        dn.push({x: this.gx(t), y: this.gy(-ex(t))});
      }
      path(up, 'rgba(255,197,107,.55)', {w: 1.4, dash: [5, 4]});
      path(dn, 'rgba(255,197,107,.55)', {w: 1.4, dash: [5, 4]});
      sans('包络线 A·e^(−bt)', X(this.gx(6.4)), Y(this.gy(ex(6.4))) - 14, 'rgba(255,215,154,.8)', 10.5);
    }

    const pts = [];
    for (let t = 0; t <= 10; t += .02) pts.push({x: this.gx(t), y: this.gy(xs(t))});
    path(pts, s.mode === 0 ? '#ffc56b' : '#6cb6ff', {w: 2.4, glow: 7, alpha: .85});

    const tr = [];
    for (let t = 0; t <= s.t; t += .02) tr.push({x: this.gx(t), y: this.gy(xs(t))});
    if (tr.length > 1) path(tr, s.mode === 0 ? '#ffc56b' : '#6cb6ff', {w: 2.8, glow: 9});
    const p = {x: this.gx(s.t), y: this.gy(xs(s.t))};
    dot(p, '#fff6e2', 5.5);

    /* 右侧振子示意 */
    const cxs = 4.6, baseY = -.4;
    line({x: 3.4, y: baseY}, {x: 3.4, y: 2.2}, 'rgba(170,200,215,.4)', {w: 1.4});
    const amp = s.mode === 0 ? ex(s.t) * 1.5 : 1.3;
    const off = xs(s.t) * amp;
    spring({x: 3.4, y: 1.0}, {x: cxs + off - .45, y: 1.0}, 12, 'rgba(170,205,220,.7)', {amp: .16, w: 1.5});
    rect({x: cxs + off - .45, y: .55}, {x: cxs + off + .45, y: 1.45}, 'rgba(16,34,44,.95)',
      s.mode === 0 ? '#ffc56b' : '#6cb6ff', {w: 1.8});
    line({x: cxs, y: .35}, {x: cxs, y: 1.7}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
    sans(s.mode === 0 ? '阻尼振动' : '受迫振动', X(cxs), Y(2.55), 'rgba(180,210,220,.8)', 11.5);

    const Tnow = s.mode === 0 ? PI2 / w0 : 1 / s.fd;
    sans((s.mode === 0 ? '周期由固有频率决定：T = ' : '稳定后周期由驱动力决定：T = ') + f2(Tnow) + ' s',
      X(-6.4), Y(-2.55), 'rgba(180,215,225,.85)', 12, 'left');
  },
  hud() {
    const s = this.state, w0 = this.om0();
    const amp = s.mode === 0 ? Math.exp(-s.b * s.t) : 1;
    return [
      {k: '振幅', v: f1(amp * 6) + ' cm', hi: true},
      {k: '阻尼系数 b', v: f2(s.b) + ' s⁻¹'},
      {k: '振动周期', v: f2(s.mode === 0 ? PI2 / w0 : 1 / s.fd) + ' s'},
      {k: '固有频率', v: f2(w0 / PI2) + ' Hz'},
      {k: '驱动频率', v: f2(s.fd) + ' Hz'}
    ];
  },
  panel(el) {
    const s = this.state;
    const seg = addSeg(el, ['阻尼', '受迫'], s.mode, i => { s.mode = i; s.t = 0; seg.set(i); });
    addSlider(el, '阻尼系数 b / s⁻¹', 0, 1.2, .05, s.b, v => f2(v), v => s.b = v);
    addSlider(el, '驱动频率 f / Hz', .4, 3, .1, s.fd, v => f2(v), v => s.fd = v);
    addToggle(el, '显示振幅包络', s.showEnv, v => s.showEnv = v);
    addBtn(el, '重新开始', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 共振 ---------- */
MODULES.push({
  key: 'resonance', tab: '05', name: '共振', en: 'RESONANCE', blurb: '频率对上就发飙',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '把驱动频率调到固有频率，看振幅怎样急剧增大',
  playable: true,
  state: {t: 0, playing: true, fd: 1.5, f0: 1.5, beta: .18, showPeak: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.fd = 1.5; s.f0 = 1.5; s.beta = .18; s.showPeak = true; },
  meta() {
    return {
      title: '驱动频率接近固有频率时振幅最大',
      desc: '受迫振动的振幅与驱动频率有关。当驱动频率远离固有频率时振幅很小，接近固有频率时振幅迅速增大，这叫共振。阻尼越小，共振峰越尖锐、峰值越高。',
      formula: 'f<sub>驱</sub> = f<sub>固</sub> 时共振，A<sub>max</sub> = F<sub>0</sub>/(2βmω<sub>0</sub>)',
      note: '军队过桥要<b>便步走</b>、机器要避开共振转速，都是为了防止共振；而声音的共鸣、核磁共振则要利用它。'
    };
  },
  ratio(f) {
    const s = this.state, f0 = s.f0, b = s.beta;
    const num = 2 * b * f0;
    const den = Math.sqrt(Math.pow(f0 * f0 - f * f, 2) + Math.pow(2 * b * f, 2));
    return den < 1e-6 ? 1 : num / den;
  },
  fx(f) { return -6.4 + f * 2.85; },
  fy(a) { return -2.4 + a * 3.25; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .56, 15);
    base();

    axisL(-6.5, 2.4, this.fy(0), this.fy(1.25), '', 'A');
    sans('f / Hz', X(-6.45), Y(this.fy(0)) + 16, 'rgba(170,198,210,.85)', 11, 'left');
    for (let f = 0; f <= 3.001; f += .5) {
      line({x: this.fx(f), y: this.fy(0)}, {x: this.fx(f), y: this.fy(0) - .07}, 'rgba(198,222,232,.45)', {w: 1});
      if (f > .1) sans(f1(f), X(this.fx(f)), Y(this.fy(0)) + 14, 'rgba(160,190,205,.7)', 10);
    }

    const curve = [];
    for (let f = .04; f <= 3.001; f += .02) curve.push({x: this.fx(f), y: this.fy(Math.min(1.22, this.ratio(f)))});
    path(curve, 'rgba(255,143,171,.9)', {w: 2.4, glow: 7});

    if (s.showPeak) {
      line({x: this.fx(s.f0), y: this.fy(0)}, {x: this.fx(s.f0), y: this.fy(1.2)}, 'rgba(255,255,255,.22)', {w: 1.2, dash: [5, 5]});
      sans('固有频率 f₀ = ' + f2(s.f0) + ' Hz', X(this.fx(s.f0)) + 8, Y(this.fy(1.12)), 'rgba(220,235,245,.75)', 10.5, 'left');
    }

    const A = Math.min(1.22, this.ratio(s.fd));
    line({x: this.fx(s.fd), y: this.fy(0)}, {x: this.fx(s.fd), y: this.fy(A)}, 'rgba(255,197,107,.55)', {w: 1.4, dash: [4, 4]});
    line({x: -6.5, y: this.fy(A)}, {x: this.fx(s.fd), y: this.fy(A)}, 'rgba(255,197,107,.3)', {w: 1.2, dash: [3, 6]});
    dot({x: this.fx(s.fd), y: this.fy(A)}, '#ffe3b0', 6.5);
    sans('工作点', X(this.fx(s.fd)) + 10, Y(this.fy(A)) - 12, 'rgba(255,225,175,.95)', 10.5, 'left');

    /* 右侧受迫振子 */
    const cx = 4.8, cy = .5;
    line({x: 3.5, y: cy - 1.5}, {x: 3.5, y: cy + 1.5}, 'rgba(170,200,215,.4)', {w: 1.4});
    const off = Math.sin(PI2 * s.fd * s.t) * (A * 1.15);
    spring({x: 3.5, y: cy}, {x: cx + off - .42, y: cy}, 13, 'rgba(255,143,171,.75)', {amp: .15, w: 1.5});
    rect({x: cx + off - .42, y: cy - .42}, {x: cx + off + .42, y: cy + .42}, 'rgba(24,20,30,.95)', '#ff8fab', {w: 1.8});
    sans('受迫振子', X(cx), Y(cy + 1.15), 'rgba(255,179,198,.85)', 11);
    sans('振幅比 ' + A.toFixed(2), X(cx), Y(cy - 1.15), 'rgba(255,215,154,.9)', 11.5);

    const phi = Math.atan2(2 * s.beta * s.fd, s.f0 * s.f0 - s.fd * s.fd) * 180 / Math.PI;
    sans('驱动频率 ' + f2(s.fd) + ' Hz，相位差 ' + f1(Math.abs(phi)) + '°',
      X(-6.4), Y(3.3), 'rgba(180,215,225,.85)', 11.5, 'left');
  },
  hud() {
    const s = this.state, A = Math.min(1.22, this.ratio(s.fd));
    const phi = Math.atan2(2 * s.beta * s.fd, s.f0 * s.f0 - s.fd * s.fd) * 180 / Math.PI;
    return [
      {k: '固有频率 f₀', v: f2(s.f0) + ' Hz'},
      {k: '驱动频率 f', v: f2(s.fd) + ' Hz', hi: true},
      {k: '振幅比 A/A₀', v: A.toFixed(2), hi: true},
      {k: '阻尼系数 β', v: f2(s.beta) + ' s⁻¹'},
      {k: '相位差', v: f1(Math.abs(phi)) + '°'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '驱动频率 f / Hz', .2, 3, .02, s.fd, v => f2(v), v => s.fd = v);
    addSlider(el, '固有频率 f₀ / Hz', .6, 2.6, .05, s.f0, v => f2(v), v => s.f0 = v);
    addSlider(el, '阻尼系数 β / s⁻¹', .03, .8, .01, s.beta, v => f2(v), v => s.beta = v);
    addToggle(el, '显示固有频率', s.showPeak, v => s.showPeak = v);
    addBtn(el, '对准共振', () => { s.fd = s.f0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
