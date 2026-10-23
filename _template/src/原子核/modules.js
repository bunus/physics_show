/* ============================================================
   选择性必修第三册 · 第 5 章 原子核
   01 天然放射现象  02 半衰期  03 核反应方程
   04 质量亏损与结合能  05 裂变与聚变
   ============================================================ */
(function () {

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function sup(n) {
  return String(n).split('').map(c => c === '-' ? '⁻' : SUP[+c]).join('');
}
function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.40)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.40)', {w: 1.4});
  arrow({x: x1 - .35, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .35}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 2, Y(y0) + 32, 'rgba(170,198,210,.85)', 11.5, 'right');
  if (ylab) sans(ylab, X(x0) - 6, Y(y1) - 8, 'rgba(170,198,210,.85)', 11.5, 'left');
}
function nucleusDot(p, A, Z, sym, color, r) {
  circleAt(p, r || .55, 'rgba(20,36,54,.85)', color, {w: 1.8, glow: 5});
  sans(sym, X(p.x), Y(p.y), color, 13);
  if (A != null) sans(sup(A), X(p.x - r * .66), Y(p.y + r * .6), 'rgba(210,232,245,.9)', 10);
  if (Z != null) sans(Z < 0 ? '−' + Math.abs(Z) : String(Z), X(p.x - r * .66), Y(p.y - r * .62), 'rgba(210,232,245,.7)', 9.5);
}

/* ---------- 01 天然放射现象 ---------- */
MODULES.push({
  key: 'radio', tab: '01', name: '三种射线', en: 'RADIOACTIVITY', blurb: '磁场中分道扬镳',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '改变磁感应强度，看 α、β 射线的弯曲程度怎样变化，γ 射线始终不偏',
  playable: true,
  state: {B: .5, t: 0, playing: true, showField: true, showPath: true},
  reset() { const s = this.state; s.B = .5; s.t = 0; s.playing = true; s.showField = true; s.showPath = true; },
  meta() {
    return {
      title: 'α、β、γ 三种射线在磁场中分家',
      desc: '放射性元素发出的射线进入垂直纸面向里的磁场：带正电的 α 射线向上偏转，带负电的 β 射线向下偏转且弯得更厉害，不带电的 γ 射线沿直线前进。',
      formula: 'r = mv/(qB)：α 质量大，r 大；β 质量小，r 小',
      note: '注意 <b>γ 射线不偏转</b>，说明它不带电。α 射线电离本领最强但穿透能力最弱，γ 射线恰好相反。'
    };
  },
  rA() { return 31.1 / Math.max(.08, this.state.B); },
  rB() { return .142 / Math.max(.08, this.state.B); },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    setFrame(.5, .55, 15);
    base();

    /* --- 铅盒 --- */
    rect({x: -6.9, y: -1.3}, {x: -4.7, y: 1.3}, 'rgba(180,195,210,.16)', 'rgba(200,220,235,.5)', {w: 1.4});
    rect({x: -4.7, y: -.22}, {x: -4.35, y: .22}, 'rgba(10,20,32,.95)', 'rgba(200,220,235,.35)', {w: 1});
    sans('铅盒（放射源）', X(-5.8), Y(1.6), 'rgba(200,222,236,.8)', 10.5);

    /* --- 磁场区域 --- */
    if (s.showField) {
      rect({x: -3.6, y: -3.4}, {x: 2.8, y: 3.4}, 'rgba(94,234,212,.03)', 'rgba(94,234,212,.16)', {w: 1, dash: [5, 6]});
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const px = -3.1 + i * 1.45, py = -2.6 + j * 1.3;
          line({x: px - .09, y: py - .09}, {x: px + .09, y: py + .09}, 'rgba(94,234,212,.32)', {w: 1.1});
          line({x: px - .09, y: py + .09}, {x: px + .09, y: py - .09}, 'rgba(94,234,212,.32)', {w: 1.1});
        }
      }
      sans('B 垂直纸面向里', X(-3.2), Y(3.75), 'rgba(120,235,215,.65)', 10, 'left');
    }

    /* --- 三条射线 --- */
    const Ra = 7 / Math.max(.12, s.B);
    const Rb = 2 / Math.max(.12, s.B);
    const arcA = [{x: -4.35, y: 0}], arcB = [{x: -4.35, y: 0}];
    const da = Math.min(1.45, Math.asin(clamp(8.2 / Ra, 0, .96)));
    for (let i = 1; i <= 60; i++) {
      const d = da * i / 60;
      arcA.push({x: -4.35 + Ra * Math.sin(d), y: Ra * (1 - Math.cos(d))});
    }
    for (let i = 1; i <= 60; i++) {
      const d = 1.55 * i / 60;
      const px = -4.35 + Rb * Math.sin(d), py = -Rb * (1 - Math.cos(d));
      if (px > 4.0 || py < -3.35) break;
      arcB.push({x: px, y: py});
    }
    if (s.showPath) {
      path(arcA, 'rgba(255,143,171,.85)', {w: 2.2, glow: 6});
      path(arcB, 'rgba(108,182,255,.85)', {w: 2.2, glow: 6});
    }
    line({x: -4.35, y: 0}, {x: 4.0, y: 0}, 'rgba(200,235,225,.55)', {w: 2, dash: [7, 6]});

    const ph = (s.t * .55) % 1;
    const ia = Math.min(arcA.length - 1, Math.floor(ph * arcA.length));
    const ib = Math.min(arcB.length - 1, Math.floor(ph * arcB.length));
    if (ia > 0) dot(arcA[ia], '#ffd0dc', 4.4);
    if (ib > 0) dot(arcB[ib], '#bcdcff', 4.4);
    dot({x: -4.35 + ph * 8.35, y: 0}, '#d8fff4', 4.2);

    /* --- 荧光屏 --- */
    line({x: 4.2, y: -3.4}, {x: 4.2, y: 3.4}, 'rgba(210,235,240,.45)', {w: 3});
    sans('荧光屏', X(4.2), Y(3.75), 'rgba(200,225,235,.75)', 10);

    sans('α（正电，r 大）', X(3.9), Y(2.6), 'rgba(255,175,200,.9)', 10.5, 'right');
    sans('γ（不带电，直线）', X(3.9), Y(-.45), 'rgba(200,240,230,.85)', 10.5, 'right');
    sans('β（负电，r 小）', X(3.9), Y(-2.9), 'rgba(160,205,255,.9)', 10.5, 'right');
    sans('B = ' + f2(s.B) + ' T', X(-3.1), Y(-3.15), 'rgba(120,235,215,.75)', 10.5, 'left');
  },
  hud() {
    return [
      {k: '磁感应强度 B', v: f2(this.state.B) + ' T', hi: true},
      {k: 'α 射线偏转半径', v: f1(this.rA()) + ' cm'},
      {k: 'β 射线偏转半径', v: f2(this.rB()) + ' cm', hi: true},
      {k: 'γ 射线', v: '不偏转（不带电）'},
      {k: '穿透能力', v: 'γ > β > α'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '磁感应强度 B / T', .1, 1.2, .05, s.B, v => f2(v), v => s.B = v);
    addToggle(el, '显示磁场区域', s.showField, v => s.showField = v);
    addToggle(el, '显示射线径迹', s.showPath, v => s.showPath = v);
    addToggle(el, '粒子运动动画', s.playing, v => s.playing = v);
    addBtn(el, '复位', () => { s.B = .5; s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 半衰期 ---------- */
MODULES.push({
  key: 'halflife', tab: '02', name: '半衰期', en: 'HALF-LIFE', blurb: '一半又一半',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '每经过一个半衰期，剩下的原子核就减少一半，这是统计规律',
  playable: true,
  state: {T: 3, t: 0, playing: true, showCurve: true, ks: [], seed: 9},
  reset() {
    const s = this.state;
    s.T = 3; s.t = 0; s.playing = true; s.showCurve = true; s.seed = 9;
    s.ks = [];
    for (let i = 0; i < 48; i++) {
      s.ks.push({u: this.rnd(), c: 0});
    }
  },
  rnd() {
    const s = this.state;
    s.seed = (s.seed * 16807) % 2147483647;
    if (s.seed <= 0) s.seed += 2147483646;
    return s.seed / 2147483647;
  },
  meta() {
    return {
      title: '半衰期：每过 T，剩下的一半',
      desc: '放射性元素的原子核有半数发生衰变所需的时间叫半衰期。经过一个半衰期剩一半，两个半衰期剩四分之一。它是大量原子核的统计规律，对单个核无法预言何时衰变。',
      formula: 'N = N₀(1/2)<sup>t/T</sup>',
      note: '半衰期由元素本身决定，<b>与温度、压强、化学状态无关</b>。图中每个小圆代表一个原子核。'
    };
  },
  frac() { return Math.pow(.5, this.state.t / this.state.T); },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      if (s.t > s.T * 4.6) { s.t = 0; for (let i = 0; i < s.ks.length; i++) s.ks[i].c = 0; }
    }
    setFrame(.5, .55, 16);
    base();

    /* --- 左：原子核阵列 --- */
    const x0 = -7.4, y0 = 2.5, gap = .78;
    let alive = 0;
    for (let i = 0; i < s.ks.length; i++) {
      const k = s.ks[i];
      const col = i % 8, row = Math.floor(i / 8);
      const p = {x: x0 + col * gap, y: y0 - row * gap};
      const dead = Math.pow(.5, s.t / s.T) < k.u;
      if (!dead) alive++;
      if (dead) {
        circleAt(p, .16, 'rgba(120,140,155,.12)', 'rgba(140,160,175,.28)', {w: 1});
      } else {
        circleAt(p, .19, 'rgba(255,197,107,.35)', '#ffc56b', {w: 1.3, glow: 4});
      }
    }
    sans('亮：未衰变   暗：已衰变', X(-7.4), Y(-2.1), 'rgba(190,215,228,.7)', 10, 'left');
    sans('共 48 个原子核（示意）', X(-7.4), Y(-2.6), 'rgba(170,198,212,.6)', 10, 'left');

    /* --- 右：N-t 曲线 --- */
    if (s.showCurve) {
      const gx = t => -.4 + t / (s.T * 4.6) * 8.0;
      const gy = n => -2.4 + n * 5.4;
      axisBox(gx(0), gx(s.T * 4.6), gy(0), gy(1.05), 't', 'N/N₀');
      for (let k = 1; k <= 4; k++) {
        const xx = gx(s.T * k);
        line({x: xx, y: gy(0)}, {x: xx, y: gy(0) - .08}, 'rgba(198,222,232,.4)', {w: 1});
        sans(k + 'T', X(xx), Y(gy(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
        line({x: xx, y: gy(0)}, {x: xx, y: gy(1)}, 'rgba(255,255,255,.10)', {w: 1, dash: [4, 5]});
        sans('1/' + Math.pow(2, k), X(xx), Y(gy(Math.pow(.5, k))) - 11, 'rgba(200,225,235,.65)', 9.5);
      }
      for (let n = 0; n <= 1.001; n += .25) {
        line({x: gx(0) - .08, y: gy(n)}, {x: gx(0), y: gy(n)}, 'rgba(198,222,232,.35)', {w: 1});
        sans(f2(n), X(gx(0)) - 7, Y(gy(n)), 'rgba(160,190,205,.72)', 9.5, 'right');
      }
      const pts = [];
      for (let t = 0; t <= s.T * 4.6; t += s.T * .02) pts.push({x: gx(t), y: gy(Math.pow(.5, t / s.T))});
      path(pts, 'rgba(255,197,107,.45)', {w: 1.8});
      const upto = [];
      for (let t = 0; t <= s.t; t += s.T * .02) upto.push({x: gx(t), y: gy(Math.pow(.5, t / s.T))});
      upto.push({x: gx(s.t), y: gy(this.frac())});
      path(upto, '#ffc56b', {w: 2.6, glow: 8});
      dot({x: gx(s.t), y: gy(this.frac())}, '#fff6e2', 5);
      sans('N = N₀(1/2)^(t/T)', X(gx(0)) + 8, Y(gy(.96)), 'rgba(255,215,154,.9)', 11, 'left');
    }
  },
  hud() {
    const s = this.state, fr = this.frac();
    return [
      {k: '经过时间 t', v: f2(s.t) + ' s', hi: true},
      {k: '半衰期 T', v: f1(s.T) + ' s'},
      {k: '剩余比例', v: f1(fr * 100) + ' %', hi: true},
      {k: '剩余原子核', v: Math.round(fr * 48) + ' 个'},
      {k: '已衰变', v: Math.round((1 - fr) * 48) + ' 个'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '半衰期 T / s', 1, 8, .5, s.T, v => f1(v), v => { s.T = v; s.t = 0; });
    addSlider(el, '时间 t / s', 0, 36, .1, s.t, v => f1(v), v => s.t = v);
    addToggle(el, '显示 N-t 曲线', s.showCurve, v => s.showCurve = v);
    addToggle(el, '自动计时', s.playing, v => s.playing = v);
    addBtn(el, '重新开始', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 核反应方程 ---------- */
MODULES.push({
  key: 'reaction', tab: '03', name: '核反应方程', en: 'NUCLEAR REACTION', blurb: '两个守恒要配平',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '检查方程两边：质量数之和与电荷数之和都必须相等',
  playable: true,
  state: {kind: 0, p: 1, playing: true},
  reset() { const s = this.state; s.kind = 0; s.p = 1; s.playing = true; },
  meta() {
    return {
      title: '配平核反应：质量数与电荷数守恒',
      desc: '核反应方程两边，质量数之和必须相等，电荷数之和也必须相等。α 衰变放出氦核，β 衰变的实质是核内一个中子变成质子并放出一个电子，裂变则是一个重核分成两个中等质量的核。',
      formula: 'ΣA 前 = ΣA 后，ΣZ 前 = ΣZ 后',
      note: 'β 衰变中电子来自原子核内部，<b>不是核外电子</b>。写出方程后先查 A，再查 Z，两步都对才算配平。'
    };
  },
  RX() {
    return [
      {name: 'α 衰变', lhs: [{A: 238, Z: 92, s: 'U'}], rhs: [{A: 234, Z: 90, s: 'Th'}, {A: 4, Z: 2, s: 'He'}]},
      {name: 'β 衰变', lhs: [{A: 234, Z: 90, s: 'Th'}], rhs: [{A: 234, Z: 91, s: 'Pa'}, {A: 0, Z: -1, s: 'e'}]},
      {name: '人工转变', lhs: [{A: 14, Z: 7, s: 'N'}, {A: 4, Z: 2, s: 'He'}], rhs: [{A: 17, Z: 8, s: 'O'}, {A: 1, Z: 1, s: 'H'}]},
      {name: '重核裂变', lhs: [{A: 235, Z: 92, s: 'U'}, {A: 1, Z: 0, s: 'n'}], rhs: [{A: 141, Z: 56, s: 'Ba'}, {A: 92, Z: 36, s: 'Kr'}, {A: 3, Z: 0, s: '3n'}]}
    ][this.state.kind];
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.p += dt * .55; if (s.p > 1) s.p = 0; }
    setFrame(.5, .55, 16);
    base();
    const R = this.RX();
    const sumA = a => a.reduce((x, y) => x + y.A, 0);
    const sumZ = a => a.reduce((x, y) => x + y.Z, 0);
    const A1 = sumA(R.lhs), A2 = sumA(R.rhs), Z1 = sumZ(R.lhs), Z2 = sumZ(R.rhs);

    sans(R.name, X(-6.8), Y(3.75), 'rgba(210,232,246,.95)', 13, 'left');
    sans('两边的 A 与 Z 都必须相等', X(6.8), Y(3.75), 'rgba(180,208,225,.7)', 10.5, 'right');
    const pl = Math.min(1, s.p / .6);

    for (let i = 0; i < R.lhs.length; i++) {
      const n = R.lhs[i];
      nucleusDot({x: -5.4 + i * 1.9 + pl * .4, y: 1.75}, n.A, n.Z, n.s, '#9ad0ff', .58);
    }
    for (let i = 0; i < R.rhs.length; i++) {
      const n = R.rhs[i];
      nucleusDot({x: 1.3 + i * 1.9 + (1 - pl) * .45, y: 1.75}, n.A, n.Z, n.s, '#ffc56b', .58);
    }
    arrow({x: -2.55, y: 1.75}, {x: .55, y: 1.75}, 'rgba(200,228,240,.7)', {w: 2.2, head: 11});
    sans(s.kind === 1 ? 'β 衰变放出电子' : s.kind === 0 ? '放出 α 粒子' : s.kind === 2 ? '人工转变' : '分裂并放出中子',
      X(-.9), Y(2.3), 'rgba(190,218,235,.7)', 10);

    /* --- 守恒校验 --- */
    const zx = -3.4, sc = .0115;
    line({x: zx, y: -3.0}, {x: zx, y: .6}, 'rgba(198,222,232,.45)', {w: 1.3});
    sans('质量数 A', X(-6.7), Y(.85), 'rgba(190,220,235,.85)', 11, 'left');
    rect({x: zx, y: -.05}, {x: zx + A1 * sc, y: .35}, 'rgba(154,208,255,.22)', '#9ad0ff', {w: 1.4});
    rect({x: zx, y: -.75}, {x: zx + A2 * sc, y: -.35}, 'rgba(255,197,107,.22)', '#ffc56b', {w: 1.4});
    sans('前 ' + A1, X(zx + A1 * sc) + 10, Y(.15), '#9ad0ff', 10.5, 'left');
    sans('后 ' + A2, X(zx + A2 * sc) + 10, Y(-.55), '#ffc56b', 10.5, 'left');

    sans('电荷数 Z', X(-6.7), Y(-1.35), 'rgba(190,220,235,.85)', 11, 'left');
    rect({x: zx, y: -1.75}, {x: zx + Z1 * sc, y: -1.35}, 'rgba(154,208,255,.22)', '#9ad0ff', {w: 1.4});
    rect({x: zx, y: -2.45}, {x: zx + Z2 * sc, y: -2.05}, 'rgba(255,197,107,.22)', '#ffc56b', {w: 1.4});
    sans('前 ' + Z1, X(zx + Z1 * sc) + 10, Y(-1.55), '#9ad0ff', 10.5, 'left');
    sans('后 ' + Z2, X(zx + Z2 * sc) + 10, Y(-2.25), '#ffc56b', 10.5, 'left');

    const okA = A1 === A2, okZ = Z1 === Z2;
    sans((okA ? '✓ ' : '✗ ') + '质量数守恒', X(zx), Y(-3.35), okA ? '#9af0d8' : '#ff8fab', 11, 'left');
    sans((okZ ? '✓ ' : '✗ ') + '电荷数守恒', X(zx + 2.6), Y(-3.35), okZ ? '#9af0d8' : '#ff8fab', 11, 'left');
  },
  hud() {
    const R = this.RX();
    const A1 = R.lhs.reduce((x, y) => x + y.A, 0), A2 = R.rhs.reduce((x, y) => x + y.A, 0);
    const Z1 = R.lhs.reduce((x, y) => x + y.Z, 0), Z2 = R.rhs.reduce((x, y) => x + y.Z, 0);
    return [
      {k: '反应类型', v: R.name, hi: true},
      {k: '反应前质量数', v: A1 + ''},
      {k: '反应后质量数', v: A2 + '', hi: true},
      {k: '反应前电荷数', v: Z1 + ''},
      {k: '反应后电荷数', v: Z2 + ''},
      {k: '是否配平', v: A1 === A2 && Z1 === Z2 ? '已配平' : '未配平'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['α 衰变', 'β 衰变', '人工转变'], s.kind, i => { s.kind = i; s.p = 1; });
    addSlider(el, '反应进度', 0, 1, .02, s.p, v => f2(v), v => { s.p = v; s.playing = false; });
    addToggle(el, '自动播放反应', s.playing, v => s.playing = v);
    addBtn(el, '重核裂变', () => { s.kind = 3; s.p = 1; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 质量亏损与结合能 ---------- */
MODULES.push({
  key: 'binding', tab: '04', name: '结合能', en: 'BINDING ENERGY', blurb: '铁附近最稳定',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '沿曲线移动，看中等质量的核为什么比结合能最大、最稳定',
  state: {A: 56, showPeak: true},
  reset() { const s = this.state; s.A = 56; s.showPeak = true; },
  meta() {
    return {
      title: '比结合能越大，原子核越稳定',
      desc: '核子结合成原子核时放出的能量叫结合能。结合能除以核子数得到比结合能，它随质量数先增大后减小，在铁附近达到最大。重核裂变和轻核聚变都会向这个方向进行并放出能量。',
      formula: 'E = Δm c²，E<sub>b</sub>/A 最大处最稳定',
      note: '看图：<b>A ≈ 56 处比结合能最高</b>。裂变使重核向中间移动，聚变使轻核向中间移动，两者都放出能量。'
    };
  },
  data() {
    return [[2, 1.11], [4, 7.07], [6, 5.33], [9, 6.46], [12, 7.68], [16, 7.98], [20, 8.03],
      [24, 8.06], [32, 8.49], [40, 8.55], [48, 8.66], [56, 8.79], [62, 8.79], [70, 8.70],
      [90, 8.70], [110, 8.55], [140, 8.35], [170, 8.10], [200, 7.90], [220, 7.80], [238, 7.57]];
  },
  ba(A) {
    const d = this.data();
    if (A <= d[0][0]) return d[0][1];
    for (let i = 1; i < d.length; i++) {
      if (A <= d[i][0]) {
        const t = (A - d[i - 1][0]) / (d[i][0] - d[i - 1][0]);
        return d[i - 1][1] + (d[i][1] - d[i - 1][1]) * t;
      }
    }
    return d[d.length - 1][1];
  },
  gx(a) { return -5.9 + a / 250 * 11.6; },
  gy(e) { return -2.7 + e / 10 * 5.6; },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();

    axisBox(this.gx(0), this.gx(250), this.gy(0), this.gy(10), '质量数 A', 'E/A / (MeV)');
    for (let a = 50; a <= 250; a += 50) {
      line({x: this.gx(a), y: this.gy(0)}, {x: this.gx(a), y: this.gy(0) - .07}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(a), X(this.gx(a)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
    }
    for (let e = 2; e <= 10; e += 2) {
      line({x: this.gx(0) - .08, y: this.gy(e)}, {x: this.gx(0), y: this.gy(e)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(e), X(this.gx(0)) - 7, Y(this.gy(e)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }

    const pts = [];
    for (let a = 2; a <= 240; a += 1) pts.push({x: this.gx(a), y: this.gy(this.ba(a))});
    path(pts, '#ff8fab', {w: 2.6, glow: 8});

    if (s.showPeak) {
      line({x: this.gx(56), y: this.gy(0)}, {x: this.gx(56), y: this.gy(8.79)}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
      dot({x: this.gx(56), y: this.gy(8.79)}, '#ffe2ea', 4.6);
      sans('铁-56：8.79 MeV/核子', X(this.gx(60)) + 6, Y(this.gy(9.3)), 'rgba(255,200,215,.85)', 10, 'left');
    }
    arrow({x: this.gx(210), y: this.gy(6.6)}, {x: this.gx(110), y: this.gy(7.4)}, 'rgba(154,208,255,.6)', {w: 1.6, head: 9});
    sans('裂变方向', X(this.gx(170)), Y(this.gy(6.1)), 'rgba(160,205,255,.75)', 10);
    arrow({x: this.gx(10), y: this.gy(4.4)}, {x: this.gx(45), y: this.gy(6.4)}, 'rgba(123,224,192,.6)', {w: 1.6, head: 9});
    sans('聚变方向', X(this.gx(12)), Y(this.gy(3.8)), 'rgba(150,240,215,.75)', 10);

    const A = s.A, ba = this.ba(A);
    const cx = this.gx(A), cy = this.gy(ba);
    line({x: cx, y: this.gy(0)}, {x: cx, y: cy}, 'rgba(255,143,171,.4)', {w: 1.2, dash: [4, 4]});
    dot({x: cx, y: cy}, '#fff0f4', 5.6);
    handle({x: cx, y: cy}, '#ff8fab', hoverId === 'a');

    sans('当前核：A = ' + A.toFixed(0), X(this.gx(128)), Y(this.gy(5.0)), '#ffe2ea', 11.5, 'left');
    sans('比结合能 ' + f2(ba) + ' MeV/核子', X(this.gx(128)), Y(this.gy(4.2)), 'rgba(255,200,215,.85)', 11, 'left');
    sans('总结合能 ' + f1(ba * A) + ' MeV', X(this.gx(128)), Y(this.gy(3.45)), 'rgba(190,215,230,.8)', 11, 'left');
    sans('质量亏损 ' + f2(ba * A / 931.5) + ' u', X(this.gx(128)), Y(this.gy(2.7)), 'rgba(190,215,230,.8)', 11, 'left');
  },
  handles() { return [{id: 'a', x: this.gx(this.state.A), y: this.gy(this.ba(this.state.A))}]; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.A = clamp((q.x - this.gx(0)) / (this.gx(1) - this.gx(0)), 2, 238);
  },
  hud() {
    const A = this.state.A, ba = this.ba(A);
    return [
      {k: '质量数 A', v: A.toFixed(0), hi: true},
      {k: '比结合能', v: f2(ba) + ' MeV/核子', hi: true},
      {k: '总结合能', v: f1(ba * A) + ' MeV'},
      {k: '质量亏损 Δm', v: f2(ba * A / 931.5) + ' u'},
      {k: '每核子质量亏损', v: f2(ba / 931.5) + ' u'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '质量数 A', 2, 238, 1, s.A, v => v.toFixed(0), v => s.A = v);
    addToggle(el, '标出铁-56 峰值', s.showPeak, v => s.showPeak = v);
    addBtn(el, '跳到铁-56', () => { s.A = 56; }, 'ghost');
  }
});

/* ---------- 05 裂变与聚变 ---------- */
MODULES.push({
  key: 'fission', tab: '05', name: '裂变与聚变', en: 'FISSION & FUSION', blurb: '两条放能的路',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '中子引发链式反应；轻核在高温下聚变。两条路都朝比结合能更大的方向走',
  playable: true,
  state: {mode: 0, t: 0, playing: true, ns: [], nuc: [], frag: [], dead: 0, seed: 5, p: 0},
  reset() {
    const s = this.state;
    s.mode = 0; s.t = 0; s.playing = true; s.dead = 0; s.seed = 5; s.p = 0;
    s.frag = [];
    s.nuc = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        s.nuc.push({x: -3.2 + c * 1.45, y: 1.9 - r * 1.32, a: 1});
      }
    }
    s.ns = [{x: -6.6, y: 1.9, vx: 2.4, vy: 0}];
  },
  rnd() {
    const s = this.state;
    s.seed = (s.seed * 16807) % 2147483647;
    if (s.seed <= 0) s.seed += 2147483646;
    return s.seed / 2147483647;
  },
  meta() {
    return {
      title: '裂变与聚变都向更稳定的方向走',
      desc: '重核裂变时，一个中子引发反应并放出更多中子，可以形成链式反应；轻核聚变需要极高温度克服库仑斥力，但每个核子释放的能量更多。两者都使原子核向比结合能更大的方向移动。',
      formula: '²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n + 200 MeV',
      note: '比较每核子放出的能量：<b>聚变（约 3.5 MeV）大于裂变（约 0.85 MeV）</b>，这就是太阳与氢弹的能量来源。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    setFrame(.5, .55, 15);
    base();

    if (s.mode === 0) {
      if (s.playing) {
        for (let i = s.ns.length - 1; i >= 0; i--) {
          const n = s.ns[i];
          n.x += n.vx * dt; n.y += n.vy * dt;
          if (n.x > 6.6 || n.x < -7 || Math.abs(n.y) > 4) { s.ns.splice(i, 1); continue; }
          for (let j = 0; j < s.nuc.length; j++) {
            const u = s.nuc[j];
            if (u.a < .5) continue;
            if (Math.hypot(u.x - n.x, u.y - n.y) < .34) {
              u.a = 0; s.dead++;
              for (let k = 0; k < 3; k++) {
                const ang = (this.rnd() - .5) * 2.6;
                s.ns.push({x: u.x, y: u.y, vx: Math.cos(ang) * 2.1, vy: Math.sin(ang) * 2.1});
              }
              for (let k = 0; k < 2; k++) {
                const ang = (k ? 1 : -1) * (.5 + this.rnd() * .7);
                s.frag.push({x: u.x, y: u.y, vx: Math.cos(ang) * 1.3, vy: Math.sin(ang) * 1.3, a: 1});
              }
              s.ns.splice(i, 1);
              break;
            }
          }
        }
        for (let i = s.frag.length - 1; i >= 0; i--) {
          const f = s.frag[i];
          f.x += f.vx * dt; f.y += f.vy * dt; f.a -= dt * .5;
          if (f.a <= 0) s.frag.splice(i, 1);
        }
        if (s.dead >= s.nuc.length && s.ns.length === 0) {
          if (s.t > 6) { const m = s.mode; this.reset(); s.mode = m; }
        }
      }
      for (let i = 0; i < s.nuc.length; i++) {
        const u = s.nuc[i];
        if (u.a < .5) {
          circleAt({x: u.x, y: u.y}, .17, 'rgba(140,160,175,.10)', 'rgba(150,170,185,.22)', {w: 1});
        } else {
          circleAt({x: u.x, y: u.y}, .31, 'rgba(255,197,107,.22)', '#ffc56b', {w: 1.5});
          sans('U', X(u.x), Y(u.y), 'rgba(255,220,170,.9)', 9.5);
        }
      }
      for (let i = 0; i < s.frag.length; i++) {
        const f = s.frag[i];
        circleAt({x: f.x, y: f.y}, .15, 'rgba(255,143,171,' + f2(f.a * .5) + ')', null);
      }
      for (let i = 0; i < s.ns.length; i++) {
        const n = s.ns[i];
        circleAt({x: n.x, y: n.y}, .1, '#d8fff4', null);
      }
      sans('²³⁵U 核', X(-3.2), Y(3.5), '#ffd79a', 11.5, 'left');
      sans('中子（蓝白小点）', X(-.2), Y(3.5), 'rgba(200,245,235,.85)', 11, 'left');
      sans('已裂变 ' + s.dead + ' / ' + s.nuc.length + ' 个，飞行中子 ' + s.ns.length + ' 个',
        X(-6.6), Y(-3.15), 'rgba(190,220,235,.85)', 11, 'left');
      sans('每次裂变放出 2～3 个中子，反应可以自我维持', X(-6.6), Y(-2.65), 'rgba(160,195,212,.7)', 10, 'left');
    } else {
      const p = (s.t % 3.2) / 3.2;
      const cx = 0, cy = .3;
      const dx = 3.2 * (1 - Math.min(1, p / .62));
      circleAt({x: cx - dx, y: cy}, .5, 'rgba(154,208,255,.25)', '#9ad0ff', {w: 1.6});
      circleAt({x: cx + dx, y: cy}, .55, 'rgba(255,197,107,.25)', '#ffc56b', {w: 1.6});
      sans('²H', X(cx - dx), Y(cy), 'rgba(210,235,255,.95)', 12);
      sans('³H', X(cx + dx), Y(cy), 'rgba(255,225,175,.95)', 12);
      if (p < .62) {
        sans('高温高压，克服库仑斥力', X(0), Y(-1.4), 'rgba(190,218,235,.7)', 10.5);
        for (let i = 0; i < 6; i++) {
          const a = i / 6 * 6.28 + s.t;
          circleAt({x: cx + Math.cos(a) * .9, y: cy + Math.sin(a) * .9}, .05, 'rgba(255,180,120,.45)', null);
        }
      } else {
        const q = (p - .62) / .38;
        const fa = 1 - q * .5;
        circleAt({x: cx, y: cy + q * 1.1}, .45 * fa, 'rgba(123,224,192,.3)', '#7be0c0', {w: 1.6});
        sans('⁴He', X(cx), Y(cy + q * 1.1), 'rgba(210,255,245,.95)', 12);
        circleAt({x: cx + 1.2 + q * 2.2, y: cy - q * .9}, .12, 'rgba(220,255,248,.85)', null);
        if (q < .35) circleAt({x: cx, y: cy}, .6 + q * 2.4, null, 'rgba(255,236,190,' + f2(.7 * (1 - q / .35)) + ')', {w: 2});
      }
      sans('²H + ³H → ⁴He + n + 17.6 MeV', X(0), Y(3.4), 'rgba(210,240,250,.95)', 12.5);
      sans('太阳内部每秒有约 6 亿吨氢发生聚变', X(0), Y(-3.3), 'rgba(170,200,215,.65)', 10);
    }

    /* --- 右侧能量对比条 --- */
    const bx = 3.5, sc = .62;
    sans('每核子释放能量', X(bx), Y(2.95), 'rgba(200,228,238,.85)', 11, 'left');
    sans('裂变 0.85 MeV', X(bx), Y(2.35), 'rgba(255,215,154,.85)', 10.5, 'left');
    rect({x: bx, y: 1.98}, {x: bx + .85 * sc, y: 2.22}, 'rgba(255,197,107,.35)', '#ffc56b', {w: 1.2});
    sans('聚变 3.50 MeV', X(bx), Y(1.55), 'rgba(150,240,215,.85)', 10.5, 'left');
    rect({x: bx, y: 1.18}, {x: bx + 3.5 * sc, y: 1.42}, 'rgba(123,224,192,.35)', '#7be0c0', {w: 1.2});
  },
  hud() {
    const s = this.state;
    if (s.mode === 0) {
      return [
        {k: '裂变核数', v: s.dead + ' 个', hi: true},
        {k: '飞行中子', v: s.ns.length + ' 个'},
        {k: '每次释放能量', v: '200 MeV', hi: true},
        {k: '每核子释放', v: '0.85 MeV'},
        {k: '1 kg 铀释放', v: '8.2×10¹³ J'}
      ];
    }
    return [
      {k: '聚变反应', v: 'D + T → He + n', hi: true},
      {k: '每次释放能量', v: '17.6 MeV', hi: true},
      {k: '每核子释放', v: '3.5 MeV'},
      {k: '所需温度', v: '约 10⁸ K'},
      {k: '1 kg 燃料释放', v: '3.4×10¹⁴ J'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['链式裂变', '轻核聚变'], s.mode, i => { s.mode = i; s.t = 0; s.dead = 0; s.ns = []; s.frag = []; if (i === 0) this.reset(); });
    addSlider(el, '中子速度 / (m/s)', 1, 5, .2, 2.4, v => f1(v), v => {
      for (let i = 0; i < s.ns.length; i++) {
        const a = Math.atan2(s.ns[i].vy, s.ns[i].vx);
        s.ns[i].vx = Math.cos(a) * v; s.ns[i].vy = Math.sin(a) * v;
      }
    });
    addToggle(el, '显示能量对比', true, v => s.showBar = v);
    addToggle(el, '自动进行反应', s.playing, v => s.playing = v);
    addBtn(el, '重新开始', () => this.reset(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
