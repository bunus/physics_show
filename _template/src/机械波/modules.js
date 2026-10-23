/* ============================================================
   选择性必修第一册 · 第 3 章 机械波
   01 波的形成与传播  02 波长、频率与波速  03 波的图象与振动图象
   04 波的叠加与干涉  05 衍射与多普勒效应
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

function axisW(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .45, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .45}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 3, Y(y0) + 15, 'rgba(170,198,210,.85)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) + 12, 'rgba(170,198,210,.85)', 11, 'right');
}

/* ---------- 01 波的形成与传播 ---------- */
MODULES.push({
  key: 'waveform', tab: '01', name: '波的形成', en: 'WAVE FORMATION', blurb: '振动传出去',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '看手先振动，相邻质点跟着振动，波形却整体向右平移',
  playable: true,
  state: {t: 0, playing: true, f: .5, v: 3, showV: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.f = .5; s.v = 3; s.showV = true; },
  meta() {
    return {
      title: '机械波传播的是振动形式和能量',
      desc: '左手握住绳端上下抖动，绳上的质点一个带一个地振动起来。每个质点只在原位上下振动，并不随波向右移动；向右传出去的是振动这种运动形式和能量。',
      formula: 'v = λf = λ/T',
      note: '看<b>红点</b>：它只上下振动，从不向右跑。介质质点不随波迁移，这是横波最容易被误解的地方。'
    };
  },
  om() { return PI2 * this.state.f; },
  lam() { return this.state.v / this.state.f; },
  yAt(x, t) {
    const s = this.state, x0 = -6.4;
    const d = t - (x - x0) / s.v;
    if (d < 0) return 0;
    return .78 * Math.sin(this.om() * d);
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 14) s.t = 0; }
    setFrame(.5, .55, 15);
    base();

    const front = -6.4 + s.v * s.t;
    line({x: -6.8, y: 0}, {x: 6.8, y: 0}, 'rgba(255,255,255,.12)', {w: 1, dash: [4, 6]});

    const pts = [];
    for (let x = -6.4; x <= 6.2; x += .12) pts.push({x: x, y: this.yAt(x, s.t)});
    path(pts, '#ff8fab', {w: 2.4, glow: 7});

    for (let x = -6.4; x <= 6.2; x += .46) {
      const y = this.yAt(x, s.t);
      dot({x: x, y: y}, 'rgba(255,190,210,.8)', 2.6);
    }

    /* 手 */
    const hy = this.yAt(-6.4, s.t);
    circleAt({x: -6.62, y: hy}, .3, 'rgba(255,197,107,.85)', 'rgba(255,225,180,.9)', {w: 1.4});
    sans('手', X(-6.62), Y(hy) - 26, 'rgba(255,215,154,.85)', 10.5);
    if (front < 6.4) {
      line({x: front, y: -1.5}, {x: front, y: 1.5}, 'rgba(255,255,255,.28)', {w: 1.3, dash: [5, 5]});
      sans('波前', X(front), Y(1.75), 'rgba(220,235,245,.7)', 10.5);
    }

    /* 观察质点 */
    const xo = -.3, yo = this.yAt(xo, s.t);
    const reached = s.t > (xo + 6.4) / s.v;
    const vo = reached ? this.om() * .78 * Math.cos(this.om() * (s.t - (xo + 6.4) / s.v)) : 0;
    dot({x: xo, y: yo}, '#ffffff', 5.5);
    sans('P', X(xo), Y(yo) + 26, 'rgba(235,245,250,.9)', 11);
    if (s.showV && Math.abs(vo) > .06) {
      arrow({x: xo, y: yo}, {x: xo, y: yo + clamp(vo * .55, -.9, .9)}, '#6cb6ff', {w: 2.2, head: 9});
    }

    if (s.t * s.v < 13) {
      arrow({x: -6.4, y: -2.2}, {x: front, y: -2.2}, 'rgba(255,143,171,.5)', {w: 1.6, head: 9});
      sans('已传播 ' + f1(Math.min(12.6, s.t * s.v)) + ' m', X((-6.4 + front) / 2), Y(-2.55),
        'rgba(255,179,198,.8)', 10.5);
    }
    sans('v = λf = ' + f1(s.v) + ' m/s，λ = ' + f2(this.lam()) + ' m',
      X(-6.8), Y(3.5), 'rgba(180,215,225,.85)', 12, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '波长 λ', v: f2(this.lam()) + ' m', hi: true},
      {k: '频率 f', v: f2(s.f) + ' Hz'},
      {k: '周期 T', v: f2(1 / s.f) + ' s', hi: true},
      {k: '波速 v', v: f1(s.v) + ' m/s'},
      {k: '已传播', v: f1(Math.min(12.6, s.t * s.v)) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '频率 f / Hz', .3, 1.2, .05, s.f, v => f2(v), v => s.f = v);
    addSlider(el, '波速 v / (m/s)', 1.5, 5, .1, s.v, v => f1(v), v => s.v = v);
    addToggle(el, '显示质点振动方向', s.showV, v => s.showV = v);
    addBtn(el, '重新抖动', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 波长、频率与波速 ---------- */
MODULES.push({
  key: 'wavelength', tab: '02', name: '波长与波速', en: 'WAVELENGTH', blurb: '一个周期走一个λ',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '调节频率与波速，用标注尺量出相邻两个波峰的距离',
  playable: true,
  state: {t: 0, playing: true, f: .8, v: 3, showMark: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.f = .8; s.v = 3; s.showMark = true; },
  meta() {
    return {
      title: '波速 = 波长 × 频率',
      desc: '波在一个周期内向前推进的距离叫波长。频率由波源决定，波速由介质决定，两者共同决定了波长。改变频率而波速不变时波长变短，改变波速时波长也相应改变。',
      formula: 'v = λ/T = λf',
      note: '频率<b>只由波源决定</b>，进入另一种介质时频率不变、波速改变，所以波长会变。'
    };
  },
  lam() { return this.state.v / this.state.f; },
  om() { return PI2 * this.state.f; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .55, 15);
    base();

    const lam = this.lam(), T = 1 / s.f, om = this.om();
    axisW(-6.9, 6.9, -2.4, 1.9, 'x / m', 'y');

    const pts = [];
    for (let x = -6.8; x <= 6.8; x += .05) {
      pts.push({x: x, y: 1.1 * Math.sin(PI2 * (x / lam - s.t / T))});
    }
    path(pts, '#6cb6ff', {w: 2.5, glow: 8});

    /* 两个相邻波峰 */
    let x1 = lam * (s.t / T + .25);
    x1 -= lam * Math.round((x1 + 4) / lam);
    const x2 = x1 + lam;

    if (s.showMark && x2 < 6.6) {
      dot({x: x1, y: 1.1}, '#e8f4ff', 5);
      dot({x: x2, y: 1.1}, '#e8f4ff', 5);
      line({x: x1, y: 1.1}, {x: x1, y: -1.55}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
      line({x: x2, y: 1.1}, {x: x2, y: -1.55}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
      arrow({x: x1, y: -1.35}, {x: x2, y: -1.35}, '#ffc56b', {w: 2, head: 10});
      arrow({x: x2, y: -1.35}, {x: x1, y: -1.35}, '#ffc56b', {w: 2, head: 10});
      sans('λ = ' + f2(lam) + ' m', X((x1 + x2) / 2), Y(-1.7), 'rgba(255,215,154,.95)', 12.5);
    }

    sans('v = λf = ' + f2(lam) + ' m × ' + f2(s.f) + ' Hz = ' + f1(s.v) + ' m/s',
      X(-6.9), Y(2.3), 'rgba(180,215,225,.9)', 12.5, 'left');
    sans('T = ' + f2(T) + ' s', X(6.8), Y(2.3), 'rgba(160,195,210,.75)', 11.5, 'right');
  },
  hud() {
    const s = this.state, lam = this.lam();
    return [
      {k: '波长 λ', v: f2(lam) + ' m', hi: true},
      {k: '频率 f', v: f2(s.f) + ' Hz'},
      {k: '周期 T', v: f2(1 / s.f) + ' s'},
      {k: '波速 v', v: f1(s.v) + ' m/s', hi: true},
      {k: '一个周期推进', v: f2(lam) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '频率 f / Hz', .6, 1.5, .05, s.f, v => f2(v), v => s.f = v);
    addSlider(el, '波速 v / (m/s)', 1.5, 4.5, .1, s.v, v => f1(v), v => s.v = v);
    addToggle(el, '显示波长标注', s.showMark, v => s.showMark = v);
    addBtn(el, '暂停在波峰', () => { s.t = 0; s.playing = false; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 波的图象与振动图象 ---------- */
MODULES.push({
  key: 'graphs', tab: '03', name: '两种图象', en: 'WAVE GRAPHS', blurb: '波形与振动',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '左图是某一时刻的波形，右图是 P 点自己的振动历史',
  playable: true,
  state: {t: 0, playing: true, f: .8, v: 3, xp: -2.2, showLink: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.f = .8; s.v = 3; s.xp = -2.2; s.showLink = true; },
  meta() {
    return {
      title: '波形图是"照片"，振动图是"录像"',
      desc: '波的图象横轴是位置，描述某一时刻所有质点的位移，形状随时间整体平移；振动图象横轴是时间，描述一个质点在各时刻的位移，是一条正弦曲线。两者形状相似，含义完全不同。',
      formula: 'y = A sin[2π(x/λ − t/T)]（波形）　y = A sin[2π(t/T − x<sub>0</sub>/λ)]（振动）',
      note: '波形图上<b>横轴是 x</b>，相邻波峰间距是波长；振动图上<b>横轴是 t</b>，相邻波峰间距是周期。'
    };
  },
  lam() { return this.state.v / this.state.f; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .55, 15);
    base();

    const lam = this.lam(), T = 1 / s.f, A = 1.05;
    const lx0 = -6.6, lx1 = .2, cy = .55;
    const mx = x => lx0 + (x + 6.6) / 13 * (lx1 - lx0);

    /* 左：波形 */
    axisW(lx0, lx1, cy, cy + 2.05, '', '');
    line({x: lx0, y: cy}, {x: lx1, y: cy}, 'rgba(198,222,232,.4)', {w: 1.4});
    sans('y-x 波形图（某一时刻）', X(lx0), Y(cy + 1.9), 'rgba(143,233,216,.9)', 10.5, 'left');
    sans('x / m', X(lx1) - 3, Y(cy) + 15, 'rgba(170,198,210,.7)', 10, 'right');

    const pts = [];
    for (let x = -6.6; x <= .2; x += .04) {
      pts.push({x: mx(x), y: cy + A * Math.sin(PI2 * (x / lam - s.t / T))});
    }
    path(pts, '#5eead4', {w: 2.4, glow: 7});

    const yp = A * Math.sin(PI2 * (s.xp / lam - s.t / T));
    const px = mx(s.xp);
    dot({x: px, y: cy + yp}, '#ffffff', 5.5);
    line({x: px, y: cy}, {x: px, y: cy + yp}, 'rgba(255,255,255,.2)', {w: 1, dash: [3, 3]});
    sans('P', X(px), Y(cy + yp) + (yp > 0 ? 22 : -22), 'rgba(235,245,250,.95)', 11.5);

    /* 右：振动图象 */
    const rx0 = 1.2, rx1 = 6.7, ry = .55;
    const mt = tt => rx0 + (tt + 4) / 4 * (rx1 - rx0);
    arrow({x: rx0, y: ry}, {x: rx1, y: ry}, 'rgba(198,222,232,.55)', {w: 1.3, head: 9});
    line({x: rx0, y: ry}, {x: rx0, y: ry + 1.9}, 'rgba(198,222,232,.4)', {w: 1.3});
    sans('y-t 振动图象（P 点的录像）', X(rx0), Y(ry + 1.9), 'rgba(255,215,154,.9)', 10.5, 'left');
    sans('t（相对现在）', X(rx1), Y(ry + 1.58), 'rgba(170,198,210,.7)', 10, 'right');
    for (let k = 0; k <= 4; k++) {
      const tt = s.t - 4 + k;
      sans(k === 4 ? '现在' : (k - 4) + ' s', X(mt(tt)), Y(ry) + 14, 'rgba(160,190,205,.6)', 9.5);
      line({x: mt(tt), y: ry}, {x: mt(tt), y: ry - .06}, 'rgba(198,222,232,.35)', {w: 1});
    }
    const vp = [];
    for (let k = 0; k <= 80; k++) {
      const tt = s.t - 4 + 4 * k / 80;
      vp.push({x: mt(tt), y: ry + A * Math.sin(PI2 * (s.xp / lam - tt / T))});
    }
    path(vp, '#ffc56b', {w: 2.3, glow: 6});
    dot({x: mt(s.t), y: ry + yp}, '#fff3dc', 5);

    if (s.showLink) {
      line({x: rx0 - .15, y: ry + yp}, {x: rx1 + .1, y: ry + yp}, 'rgba(255,255,255,.13)', {w: 1, dash: [3, 6]});
    }

    sans('波形随时间整体平移，P 点只在竖直方向振动',
      X(-6.6), Y(-1.95), 'rgba(180,215,225,.8)', 11.5, 'left');
    sans('λ = ' + f2(lam) + ' m　T = ' + f2(T) + ' s　v = ' + f1(s.v) + ' m/s',
      X(-6.6), Y(-2.45), 'rgba(160,195,210,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, lam = this.lam(), T = 1 / s.f;
    const yp = 1.05 * Math.sin(PI2 * (s.xp / lam - s.t / T));
    const vy = -1.05 * PI2 * s.f * Math.cos(PI2 * (s.xp / lam - s.t / T));
    return [
      {k: '波长 λ', v: f2(lam) + ' m', hi: true},
      {k: '周期 T', v: f2(T) + ' s'},
      {k: '波速 v', v: f1(s.v) + ' m/s', hi: true},
      {k: 'P 点位移', v: f2(yp) + ' m'},
      {k: 'P 点速度', v: f2(vy) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '频率 f / Hz', .6, 1.4, .05, s.f, v => f2(v), v => s.f = v);
    addSlider(el, '波速 v / (m/s)', 1.5, 4.5, .1, s.v, v => f1(v), v => s.v = v);
    addSlider(el, 'P 点位置 x / m', -6, -.6, .2, s.xp, v => f1(v), v => s.xp = v);
    addToggle(el, '显示等位移连线', s.showLink, v => s.showLink = v);
    addBtn(el, '重新开始', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 波的叠加与干涉 ---------- */
MODULES.push({
  key: 'interfere', tab: '04', name: '干涉', en: 'INTERFERENCE', blurb: '加强线与减弱线',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变波长与波源间距，观察加强线的疏密与方向',
  playable: true,
  state: {t: 0, playing: true, lam: 1.6, d: 4.4, showLines: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.lam = 1.6; s.d = 4.4; s.showLines = true; },
  meta() {
    return {
      title: '两列相干波叠加，出现稳定的加强和减弱',
      desc: '两个同频率、同相位的波源在水面上激起两列波。到两波源的路程差等于波长整数倍的地方振动始终加强，等于半波长奇数倍的地方始终减弱，形成稳定的干涉图样。',
      formula: 'Δr = nλ 加强，Δr = (2n+1)λ/2 减弱',
      note: '干涉是波特有的现象。<b>加强点</b>并不是位移始终最大，而是在最大值与最小值之间振动，只是振幅最大。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .52, 15);
    base();

    const c = s.d / 2, lam = s.lam, v = lam * 1.2;
    const sx1 = -c, sx2 = c;
    const yy = .1;

    /* 加强线 / 减弱线 */
    if (s.showLines) {
      for (let n = 1; n <= 3; n++) {
        const a = n * lam / 2, b2 = c * c - a * a;
        if (b2 < .04) continue;
        const b = Math.sqrt(b2);
        const up = [], dn = [];
        for (let u = 0; u <= 2.2; u += .07) {
          up.push({x: a * Math.cosh(u), y: b * Math.sinh(u) + yy});
          dn.push({x: -a * Math.cosh(u), y: b * Math.sinh(u) + yy});
        }
        path(up, 'rgba(255,197,107,.4)', {w: 1.3, dash: [6, 5]});
        path(dn, 'rgba(255,197,107,.4)', {w: 1.3, dash: [6, 5]});
      }
      line({x: 0, y: -4}, {x: 0, y: 4.2}, 'rgba(255,197,107,.35)', {w: 1.3, dash: [6, 5]});
      sans('虚线：振动加强的位置', X(-6.3), Y(4.25), 'rgba(255,215,154,.75)', 10.5, 'left');
    }

    /* 波面 */
    for (let k = 0; k < 6; k++) {
      const r1 = ((v * s.t) % lam) + k * lam;
      if (r1 < 9) {
        circleAt({x: sx1, y: yy}, r1, null, 'rgba(180,156,255,.28)', {w: 1.3});
        circleAt({x: sx2, y: yy}, r1, null, 'rgba(180,156,255,.28)', {w: 1.3});
      }
    }
    circleAt({x: sx1, y: yy}, .22, '#b49cff', '#e2d8ff', {w: 1.4});
    circleAt({x: sx2, y: yy}, .22, '#b49cff', '#e2d8ff', {w: 1.4});
    sans('S₁', X(sx1), Y(yy - .45), 'rgba(210,195,255,.9)', 11);
    sans('S₂', X(sx2), Y(yy - .45), 'rgba(210,195,255,.9)', 11);

    const nmax = Math.floor(c / (lam / 2));
    sans('波长 λ = ' + f2(lam) + ' m，间距 d = ' + f1(s.d) + ' m，加强线 ' + (2 * Math.min(3, Math.max(0, nmax)) + 1) + ' 条',
      X(-6.8), Y(-2.3), 'rgba(180,215,225,.85)', 12, 'left');
    sans('加强：Δr = nλ　　减弱：Δr = (2n+1)λ/2',
      X(-6.8), Y(-2.75), 'rgba(160,195,210,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, c = s.d / 2;
    return [
      {k: '波长 λ', v: f2(s.lam) + ' m', hi: true},
      {k: '波源间距 d', v: f1(s.d) + ' m', hi: true},
      {k: '波速 v', v: f2(s.lam * 1.2) + ' m/s'},
      {k: '频率 f', v: '1.20 Hz'},
      {k: 'd/λ', v: (s.d / s.lam).toFixed(2)}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '波长 λ / m', .8, 2.6, .1, s.lam, v => f2(v), v => s.lam = v);
    addSlider(el, '波源间距 d / m', 2, 7, .2, s.d, v => f1(v), v => s.d = v);
    addToggle(el, '显示加强线', s.showLines, v => s.showLines = v);
    addBtn(el, '重新起振', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 衍射与多普勒效应 ---------- */
MODULES.push({
  key: 'diffract', tab: '05', name: '衍射与多普勒', en: 'DIFFRACTION', blurb: '绕过与变调',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '切换衍射与多普勒，比较缝宽与波长、波源速度与波速',
  playable: true,
  state: {t: 0, playing: true, mode: 0, lam: 1.2, b: .9, vs: 1.4, showArc: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.mode = 0; s.lam = 1.2; s.b = .9; s.vs = 1.4; s.showArc = true;
  },
  meta() {
    return {
      title: '缝宽与波长相近时衍射最明显',
      desc: '波遇到障碍物会绕过去。缝宽与波长差不多甚至更小时，波能明显地绕到缝后各个方向；缝宽远大于波长时，波几乎沿直线前进。波源靠近观察者时，接收到的频率变高，这就是多普勒效应。',
      formula: '明显衍射：d ≲ λ，　f′ = f·v/(v − v<sub>s</sub>)',
      note: '衍射不需要"两条缝"，<b>一列波</b>遇到障碍就能发生；干涉才需要两列相干波。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; }
    setFrame(.5, .52, 15);
    base();

    const lam = s.lam, v = 2.4, T = lam / v;

    if (s.mode === 0) {
      /* 挡板 */
      const half = s.b / 2;
      rect({x: -.12, y: -3.2}, {x: .12, y: -half}, 'rgba(140,170,185,.35)', 'rgba(180,205,220,.6)', {w: 1.2});
      rect({x: -.12, y: half}, {x: .12, y: 3.2}, 'rgba(140,170,185,.35)', 'rgba(180,205,220,.6)', {w: 1.2});
      sans('缝宽 b = ' + f1(s.b) + ' m', X(1.0), Y(half + .45), 'rgba(190,215,225,.85)', 10.5, 'left');

      /* 入射平面波 */
      const ph = (v * s.t) % lam;
      for (let k = 0; k < 10; k++) {
        const x = -.4 - ph - k * lam;
        if (x < -7) break;
        line({x: x, y: -3.1}, {x: x, y: 3.1}, 'rgba(255,197,107,.3)', {w: 1.4});
      }

      /* 缝后圆波 */
      const ratio = lam / Math.max(.05, s.b);
      const amax = ratio >= 1 ? Math.PI / 2 : Math.min(Math.PI / 2, Math.asin(clamp(ratio, 0, 1)) + .28);
      for (let k = 0; k < 7; k++) {
        const r = ph + k * lam;
        if (r > 8.4) break;
        const arc = [];
        for (let q = -amax; q <= amax; q += .06) arc.push({x: Math.cos(q) * r, y: Math.sin(q) * r});
        path(arc, 'rgba(255,197,107,' + (0.5 - k * 0.055).toFixed(2) + ')', {w: 1.6});
      }
      sans('b / λ = ' + (s.b / lam).toFixed(2) + (ratio > 2 ? '，缝太宽，几乎沿直线' : '，衍射明显'),
        X(-6.8), Y(-2.3), 'rgba(255,215,154,.85)', 12, 'left');
    } else {
      /* 多普勒 */
      const vs = s.vs, xs = -6.2 + vs * s.t;
      for (let n = 1; n <= 9; n++) {
        const te = s.t - n * T;
        if (te < 0) continue;
        const r = v * (s.t - te);
        if (r > 13) continue;
        circleAt({x: -6.2 + vs * te, y: 0}, r, null, 'rgba(255,197,107,' + (0.5 - n * 0.045).toFixed(2) + ')', {w: 1.4});
      }
      circleAt({x: xs, y: 0}, .3, '#ffc56b', '#ffe3b0', {w: 1.6});
      arrow({x: xs, y: 1.4}, {x: xs + vs * .8, y: 1.4}, '#ffc56b', {w: 2.4, head: 10});
      sans('v = ' + f1(vs) + ' m/s', X(xs + vs * .4), Y(1.75), 'rgba(255,215,154,.9)', 10.5);

      circleAt({x: 6.2, y: 0}, .28, 'rgba(108,182,255,.9)', '#c9e4ff', {w: 1.6});
      sans('观察者', X(6.2), Y(-.55), 'rgba(180,215,255,.9)', 10.5);

      const fp = v * 1 / Math.max(.2, v - vs);
      const f0 = 1 / T;
      sans('波源靠近观察者，波面被"挤密"，接收频率变高',
        X(-6.8), Y(-2.3), 'rgba(255,215,154,.85)', 11.5, 'left');
      sans('f′ = f·v/(v − v_s) = ' + f2(f0) + ' × ' + f2(v / (v - vs)) + ' = ' + f2(fp) + ' Hz',
        X(-6.8), Y(-2.75), 'rgba(180,215,225,.8)', 11.5, 'left');
    }

    if (s.t > 14) s.t = 0;
    if (s.mode === 1 && (-6.2 + s.vs * s.t) > 4.4) s.t = 0;
    sans(s.mode === 0 ? '衍射' : '多普勒效应', X(6.8), Y(3.85),
      'rgba(200,225,235,.75)', 12, 'right');
  },
  hud() {
    const s = this.state, v = 2.4, f0 = v / s.lam;
    if (s.mode === 0) {
      return [
        {k: '波长 λ', v: f2(s.lam) + ' m', hi: true},
        {k: '缝宽 b', v: f2(s.b) + ' m', hi: true},
        {k: 'b/λ', v: (s.b / s.lam).toFixed(2)},
        {k: '频率 f', v: f2(f0) + ' Hz'},
        {k: '波速 v', v: f1(v) + ' m/s'}
      ];
    }
    const fp = f0 * v / Math.max(.2, v - s.vs);
    return [
      {k: '波源速度', v: f1(s.vs) + ' m/s', hi: true},
      {k: '发出频率', v: f2(f0) + ' Hz'},
      {k: '接收频率', v: f2(fp) + ' Hz', hi: true},
      {k: '频率变化', v: f2(fp - f0) + ' Hz'},
      {k: '波长', v: f2(s.lam) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    const seg = addSeg(el, ['衍射', '多普勒'], s.mode, i => { s.mode = i; s.t = 0; seg.set(i); });
    addSlider(el, '波长 λ / m', .6, 2, .1, s.lam, v => f2(v), v => s.lam = v);
    addSlider(el, '缝宽 b / m', .2, 2.4, .1, s.b, v => f2(v), v => s.b = v);
    addSlider(el, '波源速度 v_s / (m/s)', .2, 2, .1, s.vs, v => f1(v), v => s.vs = v);
    addToggle(el, '显示波前', s.showArc, v => s.showArc = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
