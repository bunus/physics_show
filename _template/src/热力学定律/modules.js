/* ============================================================
   选择性必修第三册 · 第 3 章 热力学定律
   01 改变内能的两种方式  02 热力学第一定律  03 等温与绝热过程
   04 热力学第二定律  05 能量守恒与永动机
   ============================================================ */
(function () {

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
const R = 8.31;
const G = 9.8;

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.40)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.40)', {w: 1.4});
  arrow({x: x1 - .35, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .35}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 2, Y(y0) + 15, 'rgba(170,198,210,.85)', 11.5, 'right');
  if (ylab) sans(ylab, X(x0) - 6, Y(y1) - 8, 'rgba(170,198,210,.85)', 11.5, 'left');
}
function flowDots(a, b, color, ph, n) {
  for (let i = 0; i < n; i++) {
    const t = (ph + i / n) % 1;
    const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
    circleAt({x: x, y: y}, .055, color, null);
  }
}

/* ---------- 01 改变内能的两种方式 ---------- */
MODULES.push({
  key: 'two_ways', tab: '01', name: '改变内能', en: 'TWO WAYS', blurb: '做功与热传递',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '压缩活塞或加热气体，两种方式都能让温度计示数升高',
  playable: true,
  state: {dV: .8, Q: 300, prog: 1, playing: true, showFlame: true},
  reset() { const s = this.state; s.dV = .8; s.Q = 300; s.prog = 1; s.playing = true; s.showFlame = true; },
  meta() {
    return {
      title: '做功和热传递都能改变内能',
      desc: '让气体温度升高有两条路：外界压缩气体做功，或者让它从外界吸热。两种方式效果相同，都使分子平均动能增大、内能增加，但本质不同——一个是能量的转化，一个是能量的转移。',
      formula: 'ΔU = W + Q（W 为外界对气体做的功）',
      note: '比较两条路径：同样的 ΔU，可以全部由<b>做功</b>完成，也可以全部由<b>热传递</b>完成，还可以两者各占一部分。'
    };
  },
  T() {
    const s = this.state, V0 = 2.0, V = Math.max(.3, V0 - s.dV * s.prog);
    const Tw = 300 * Math.pow(V0 / V, 2 / 3);
    return Tw + s.Q * s.prog / (.2 * 1.5 * R);
  },
  V() { return Math.max(.3, 2.0 - this.state.dV * this.state.prog); },
  U() { return .2 * 1.5 * R * this.T(); },
  draw(dt) {
    const s = this.state;
    if (s.playing && s.prog < 1) s.prog = Math.min(1, s.prog + dt * .45);
    setFrame(.5, .55, 15);
    base();
    const T = this.T(), V = this.V(), U = this.U();

    /* --- 左：气缸、活塞、热源 --- */
    const xL = -6.0, y0 = -1.7, y1 = 1.3;
    const xP = xL + .5 + (V / 2.0) * 3.2;
    rect({x: xL, y: y0}, {x: xP, y: y1}, 'rgba(94,234,212,.07)', 'rgba(170,215,230,.4)', {w: 1.5});
    for (let i = 0; i < 22; i++) {
      const px = xL + .2 + ((i * .71) % Math.max(.3, xP - xL - .35));
      const py = y0 + .2 + ((i * 1.13) % (y1 - y0 - .4));
      circleAt({x: px, y: py}, .05, 'rgba(94,234,212,.5)', null);
    }
    rect({x: xP, y: y0 - .18}, {x: xP + .24, y: y1 + .18}, 'rgba(232,242,248,.82)', 'rgba(255,255,255,.55)', {w: 1.1});
    line({x: xP + .12, y: y1 + .18}, {x: xP + .12, y: y1 + .7}, 'rgba(232,242,248,.7)', {w: 3});
    arrow({x: xP + .75, y: .1}, {x: xP + .3, y: .1}, '#6cb6ff', {w: 2.4, head: 11});
    sans('压缩做功', X(xP + .9), Y(.55), 'rgba(150,200,255,.9)', 10.5, 'left');

    if (s.showFlame && s.Q > 0) {
      for (let i = 0; i < 4; i++) {
        const fx = xL + .7 + i * .55;
        const hgt = .35 + .18 * Math.abs(Math.sin(s.prog * 6 + i));
        poly([{x: fx - .13, y: y0 - .12}, {x: fx, y: y0 - .12 - hgt}, {x: fx + .13, y: y0 - .12}],
          'rgba(255,150,90,.5)', 'rgba(255,190,120,.8)', {w: 1});
      }
      sans('加热', X(xL + 1.6), Y(y0 - .85), 'rgba(255,180,120,.85)', 10.5, 'left');
    }

    /* --- 右：温度计与内能条 --- */
    const tx = .9;
    rect({x: tx - .16, y: -2.4}, {x: tx + .16, y: 1.9}, 'rgba(255,255,255,.05)', 'rgba(200,225,235,.4)', {w: 1.2});
    const hT = clamp((T - 250) / 350, 0, 1) * 3.9;
    rect({x: tx - .1, y: -2.3}, {x: tx + .1, y: -2.3 + hT}, T > 420 ? '#ff8fab' : '#ffc56b', null);
    circleAt({x: tx, y: -2.6}, .32, T > 420 ? 'rgba(255,143,171,.5)' : 'rgba(255,197,107,.45)', 'rgba(255,220,170,.6)', {w: 1.2});
    sans('T = ' + f1(T) + ' K', X(tx + .45), Y(1.4), '#ffe3b0', 12, 'left');

    sans('内能 U', X(2.9), Y(2.1), 'rgba(200,228,238,.85)', 12, 'left');
    rect({x: 2.9, y: 1.2}, {x: 3.1, y: 1.9}, null, 'rgba(200,225,235,.35)', {w: 1});
    const bw = clamp(U / 1800, 0, 1) * 2.8;
    rect({x: 3.1, y: 1.25}, {x: 3.1 + bw, y: 1.85}, 'rgba(94,234,212,.35)', '#5eead4', {w: 1.4});
    sans(f1(U) + ' J', X(3.25 + bw), Y(1.55), '#9af0d8', 11.5, 'left');
    sans('体积 V = ' + f2(V) + ' L', X(2.9), Y(.6), 'rgba(190,215,228,.8)', 11, 'left');
    sans('初态 300 K、2.0 L', X(2.9), Y(.05), 'rgba(160,190,205,.65)', 10.5, 'left');
    sans('ΔT = ' + f1(T - 300) + ' K', X(2.9), Y(-.5), '#ffe3b0', 11.5, 'left');
    sans('做功 ΔV = ' + f2(s.dV * s.prog) + ' L', X(2.9), Y(-1.4), 'rgba(150,200,255,.85)', 11, 'left');
    sans('吸热 Q = ' + f1(s.Q * s.prog) + ' J', X(2.9), Y(-1.9), 'rgba(255,180,120,.85)', 11, 'left');
  },
  hud() {
    const T = this.T(), U = this.U();
    const W = U - 748.2 - this.state.Q * this.state.prog;
    return [
      {k: '温度 T', v: f1(T) + ' K', hi: true},
      {k: '内能 U', v: f1(U) + ' J', hi: true},
      {k: '体积 V', v: f2(this.V()) + ' L'},
      {k: '外界做功 W', v: f1(W) + ' J'},
      {k: '吸收热量 Q', v: f1(this.state.Q * this.state.prog) + ' J'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '压缩量 ΔV / L', 0, 1.5, .05, s.dV, v => f2(v), v => { s.dV = v; s.prog = 0; });
    addSlider(el, '吸热 Q / J', 0, 600, 10, s.Q, v => f1(v), v => { s.Q = v; s.prog = 0; });
    addToggle(el, '显示热源火焰', s.showFlame, v => s.showFlame = v);
    addToggle(el, '自动演示过程', s.playing, v => s.playing = v);
    addBtn(el, '重新开始', () => { s.prog = 0; s.playing = true; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 热力学第一定律 ---------- */
MODULES.push({
  key: 'firstlaw', tab: '02', name: '热力学第一定律', en: 'FIRST LAW', blurb: '能量收支要平衡',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '调节吸热与做功，看内能的变化量是否总等于两者之和',
  playable: true,
  state: {Q: 300, W: -100, playing: true, showFlow: true, t: 0},
  reset() { const s = this.state; s.Q = 300; s.W = -100; s.playing = true; s.showFlow = true; s.t = 0; },
  meta() {
    return {
      title: 'ΔU = Q + W：一本能量的账',
      desc: '系统内能的增加量，等于它吸收的热量与外界对它做的功之和。吸热为正、放热为负；外界对系统做功为正、系统对外做功为负。改变其中一项，看内能怎样重新分配。',
      formula: 'ΔU = Q + W',
      note: '符号最容易出错：<b>吸热 Q > 0</b>、<b>外界做功 W > 0</b>。若 Q + W 为负，内能减少，温度降低。'
    };
  },
  U1() { return 500; },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    const Q = s.Q, W = s.W, dU = Q + W;
    setFrame(.5, .55, 15);
    base();

    /* --- 中央气体 --- */
    const cx = 0, cy = .5;
    rect({x: cx - 1.3, y: cy - 1.3}, {x: cx + 1.3, y: cy + 1.3}, 'rgba(108,182,255,.10)', '#6cb6ff', {w: 1.8});
    sans('气体', X(cx), Y(cy + .25), 'rgba(200,228,250,.95)', 14);
    sans('U₁ = 500 J', X(cx), Y(cy - .35), 'rgba(170,200,225,.8)', 11);

    /* --- 吸热箭头（左进） --- */
    const la = {x: -5.5, y: cy + .75}, lb = {x: -1.45, y: cy + .75};
    const qLen = clamp(Math.abs(Q) / 400, .15, 1) * 3.6;
    if (Q >= 0) {
      arrow({x: la.x, y: la.y}, {x: la.x + qLen, y: la.y}, '#ff8fab', {w: 3, head: 13});
      if (s.showFlow) flowDots(la, {x: la.x + qLen, y: la.y}, 'rgba(255,143,171,.85)', s.t * .6, 5);
      sans('Q = +' + f1(Q) + ' J 吸热', X(la.x), Y(la.y + .45), 'rgba(255,170,195,.95)', 11.5, 'left');
    } else {
      arrow({x: la.x + qLen, y: la.y}, {x: la.x, y: la.y}, '#6cb6ff', {w: 3, head: 13});
      sans('Q = ' + f1(Q) + ' J 放热', X(la.x), Y(la.y + .45), 'rgba(150,200,255,.95)', 11.5, 'left');
    }

    /* --- 做功箭头（右下进） --- */
    const ra = {x: 5.5, y: cy - .75}, rb = {x: 1.45, y: cy - .75};
    const wLen = clamp(Math.abs(W) / 400, .15, 1) * 3.6;
    if (W >= 0) {
      arrow({x: ra.x, y: ra.y}, {x: ra.x - wLen, y: ra.y}, '#ffc56b', {w: 3, head: 13});
      if (s.showFlow) flowDots(ra, {x: ra.x - wLen, y: ra.y}, 'rgba(255,197,107,.85)', s.t * .6, 5);
      sans('W = +' + f1(W) + ' J 外界做功', X(ra.x), Y(ra.y - .5), 'rgba(255,215,154,.95)', 11.5, 'right');
    } else {
      arrow({x: ra.x - wLen, y: ra.y}, {x: ra.x, y: ra.y}, '#b49cff', {w: 3, head: 13});
      sans('W = ' + f1(W) + ' J 对外做功', X(ra.x), Y(ra.y - .5), 'rgba(200,182,255,.95)', 11.5, 'right');
    }

    /* --- 底部：ΔU 能量条 --- */
    const zx = -1.2, sc = .0038;
    line({x: zx, y: -3.55}, {x: zx, y: -1.95}, 'rgba(198,222,232,.45)', {w: 1.4});
    const rows = [
      {y: -2.25, v: Q, c: '#ff8fab', n: 'Q'},
      {y: -2.85, v: W, c: '#ffc56b', n: 'W'},
      {y: -3.45, v: dU, c: '#7be0c0', n: 'ΔU'}
    ];
    for (let i = 0; i < rows.length; i++) {
      const b = rows[i];
      const bw = clamp(b.v * sc, -3.6, 4.2);
      rect({x: zx, y: b.y - .2}, {x: zx + bw, y: b.y + .2}, 'rgba(255,255,255,.06)', null);
      rect({x: zx, y: b.y - .2}, {x: zx + bw, y: b.y + .2}, null, b.c, {w: 1.5});
      sans(b.n, X(zx) - 12, Y(b.y), b.c, 12, 'right');
      sans((b.v < 0 ? '−' : '') + f1(Math.abs(b.v)) + ' J',
        b.v < 0 ? X(zx) + 10 : X(zx + bw) + 10, Y(b.y), b.c, 10.5, 'left');
    }
    sans('ΔU = Q + W = ' + (dU < 0 ? '−' : '') + f1(Math.abs(dU)) + ' J', X(-4.6), Y(-1.55),
      '#9af0d8', 12.5, 'left');
    sans('末态内能 U₂ = ' + f1(500 + dU) + ' J', X(2.4), Y(-1.55), 'rgba(190,220,235,.85)', 11.5, 'left');
    sans(dU > 0 ? '内能增加，温度升高' : dU < 0 ? '内能减少，温度降低' : '内能不变',
      X(-4.6), Y(-1.05), dU > 0 ? 'rgba(255,170,195,.9)' : dU < 0 ? 'rgba(150,200,255,.9)' : 'rgba(190,215,228,.8)', 11, 'left');
  },
  hud() {
    const s = this.state, dU = s.Q + s.W;
    return [
      {k: '吸热 Q', v: f1(s.Q) + ' J', hi: true},
      {k: '外界做功 W', v: f1(s.W) + ' J', hi: true},
      {k: '内能增量 ΔU', v: f1(dU) + ' J'},
      {k: '末态内能 U₂', v: f1(500 + dU) + ' J'},
      {k: '过程性质', v: dU > 0 ? '内能增大' : dU < 0 ? '内能减小' : '内能守恒'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '吸热 Q / J', -400, 400, 10, s.Q, v => f1(v), v => s.Q = v);
    addSlider(el, '外界做功 W / J', -400, 400, 10, s.W, v => f1(v), v => s.W = v);
    addToggle(el, '显示能量流动', s.showFlow, v => s.showFlow = v);
    addToggle(el, '能量流动动画', s.playing, v => s.playing = v);
    addBtn(el, '等温过程（ΔU = 0）', () => { s.W = -s.Q; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 等温与绝热过程 ---------- */
MODULES.push({
  key: 'isoadi', tab: '03', name: '等温与绝热', en: 'ISOTHERMAL & ADIABATIC', blurb: '谁更陡一些',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '从同一点出发膨胀，比较两条曲线：绝热线比等温线更陡',
  playable: true,
  state: {k: 1.0, playing: false, gas: 0, showIso: true},
  reset() { const s = this.state; s.k = 1.0; s.playing = false; s.gas = 0; s.showIso = true; },
  meta() {
    return {
      title: '绝热线比等温线更陡',
      desc: '从同一状态出发让气体膨胀：等温过程中温度不变，压强按 pV = 恒量 下降；绝热过程中气体对外做功却不吸热，内能减少、温度降低，压强下降得更快。',
      formula: '等温 pV = C；绝热 pV<sup>γ</sup> = C′',
      note: '绝热膨胀时 T 下降，所以相同体积下压强更小，曲线更陡。γ 由气体分子自由度决定：单原子 5/3，双原子 7/5。'
    };
  },
  gamma() { return [5 / 3, 7 / 5][this.state.gas]; },
  p0() { return 1.0e5; },
  V0() { return 2.0; },
  T0() { return 300; },
  pIso(V) { return this.p0() * this.V0() / V; },
  pAd(V) { return this.p0() * Math.pow(this.V0() / V, this.gamma()); },
  tAd(V) { return this.T0() * Math.pow(this.V0() / V, this.gamma() - 1); },
  gx(v) { return -5.6 + v / 4.5 * 11.2; },
  gy(p) { return -2.7 + p / 2.2e5 * 5.4; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.k += dt * .35;
      if (s.k > 2.6) s.k = 1.0;
    }
    const V = this.V0() * s.k;
    setFrame(.5, .55, 15);
    base();

    axisBox(this.gx(0), this.gx(4.5), this.gy(0), this.gy(2.2e5), 'V / L', 'p / (10⁵ Pa)');
    for (let v = 1; v <= 4; v++) {
      line({x: this.gx(v), y: this.gy(0)}, {x: this.gx(v), y: this.gy(0) - .07}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(v), X(this.gx(v)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
    }
    for (let q = 1; q <= 4; q++) {
      line({x: this.gx(0) - .08, y: this.gy(q * .5e5)}, {x: this.gx(0), y: this.gy(q * .5e5)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(f1(q * .5), X(this.gx(0)) - 7, Y(this.gy(q * .5e5)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }

    if (s.showIso) {
      const iso = [];
      for (let v = .8; v <= 4.4; v += .04) {
        if (this.pIso(v) <= 2.25e5) iso.push({x: this.gx(v), y: this.gy(this.pIso(v))});
      }
      path(iso, '#6cb6ff', {w: 2.4, glow: 6});
      sans('等温线 pV = C', X(this.gx(3.35)), Y(this.gy(.62e5)), 'rgba(150,200,255,.9)', 11, 'right');
    }
    const ad = [];
    for (let v = .8; v <= 4.4; v += .04) {
      if (this.pAd(v) <= 2.25e5) ad.push({x: this.gx(v), y: this.gy(this.pAd(v))});
    }
    path(ad, '#b49cff', {w: 2.6, glow: 8});
    sans('绝热线 pV^γ = C′', X(this.gx(1.85)), Y(this.gy(.86e5)), 'rgba(203,184,255,.95)', 11, 'left');

    const pI = this.pIso(V), pA = this.pAd(V);
    line({x: this.gx(V), y: this.gy(0)}, {x: this.gx(V), y: this.gy(Math.max(pI, pA))}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 4]});
    dot({x: this.gx(V), y: this.gy(pI)}, '#dbeaff', 5);
    dot({x: this.gx(V), y: this.gy(pA)}, '#e8e0ff', 5);
    handle({x: this.gx(V), y: this.gy(pI)}, '#6cb6ff', hoverId === 'k');

    dot({x: this.gx(this.V0()), y: this.gy(this.p0())}, '#fff6e2', 6);
    sans('同一初态', X(this.gx(this.V0())) + 12, Y(this.gy(this.p0())) - 12, 'rgba(235,240,248,.9)', 10.5, 'left');

    sans('等温线：T = ' + f1(this.T0()) + ' K 保持不变', X(this.gx(2.3)), Y(this.gy(2.06e5)), 'rgba(150,200,255,.92)', 11, 'left');
    sans('绝热线：T 降到 ' + f1(this.tAd(V)) + ' K', X(this.gx(2.3)), Y(this.gy(1.84e5)), 'rgba(203,184,255,.95)', 11, 'left');
    sans('γ = ' + f2(this.gamma()) + '（' + (s.gas === 0 ? '单原子' : '双原子') + '分子），绝热膨胀对外做功、内能减少',
      X(this.gx(2.3)), Y(this.gy(1.62e5)), 'rgba(190,215,230,.75)', 10.5, 'left');
  },
  handles() { return [{id: 'k', x: this.gx(this.V0() * this.state.k), y: this.gy(this.pIso(this.V0() * this.state.k))}]; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.k = clamp((q.x - this.gx(0)) / (this.gx(1) - this.gx(0)) / this.V0(), 1.0, 2.6);
  },
  hud() {
    const V = this.V0() * this.state.k;
    return [
      {k: '体积 V', v: f2(V) + ' L', hi: true},
      {k: '等温压强', v: f2(this.pIso(V) / 1e5) + '×10⁵ Pa'},
      {k: '绝热压强', v: f2(this.pAd(V) / 1e5) + '×10⁵ Pa', hi: true},
      {k: '等温温度', v: f1(this.T0()) + ' K'},
      {k: '绝热温度', v: f1(this.tAd(V)) + ' K'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '膨胀比 V/V₀', 1.0, 2.6, .02, s.k, v => f2(v), v => s.k = v);
    addSeg(el, ['单原子', '双原子'], s.gas, i => s.gas = i);
    addToggle(el, '显示等温线', s.showIso, v => s.showIso = v);
    addToggle(el, '自动膨胀', s.playing, v => s.playing = v);
    addBtn(el, '回到初态', () => { s.k = 1.0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 热力学第二定律 ---------- */
MODULES.push({
  key: 'secondlaw', tab: '04', name: '热力学第二定律', en: 'SECOND LAW', blurb: '热传递有方向',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '看热量自发从高温物体流向低温物体，温度相等后不会自动倒流',
  playable: true,
  state: {T1: 420, T2: 300, t: 0, playing: true, reverse: false, C: 100},
  reset() { const s = this.state; s.T1 = 420; s.T2 = 300; s.t = 0; s.playing = true; s.reverse = false; s.C = 100; },
  meta() {
    return {
      title: '热量不能自发地从低温传到高温',
      desc: '两个温度不同的物体接触后，热量总是自发地从高温物体传向低温物体，直到温度相同。这个过程不可逆：温度相等后，热量不会自动重新聚集到一边，总熵只会增大。',
      formula: 'ΔS = Q(1/T<sub>低</sub> − 1/T<sub>高</sub>) > 0',
      note: '注意热量传递的<b>方向性</b>：温差消失后过程停止，不会自行反向。这就是第二定律的开尔文表述与克劳修斯表述的核心。'
    };
  },
  Tm() { return (this.state.T1 + this.state.T2) / 2; },
  tempAt(which, t) {
    const s = this.state, Tm = (s.T1 + s.T2) / 2;
    const tau = 9;
    if (s.reverse) {
      const T0 = which === 0 ? s.T1 : s.T2;
      return Tm + (T0 - Tm) * (1 + t / tau * .55);
    }
    const T0 = which === 0 ? s.T1 : s.T2;
    return Tm + (T0 - Tm) * Math.exp(-t / tau);
  },
  entropy() {
    const s = this.state, Tm = (s.T1 + s.T2) / 2;
    return s.C * (Math.log(Tm / s.T1) + Math.log(Tm / s.T2));
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 40) s.t = 0; }
    const t1 = this.tempAt(0, s.t), t2 = this.tempAt(1, s.t);
    setFrame(.5, .55, 15);
    base();

    const bw = 2.3, bh = 2.1;
    const c1 = {x: -3.0, y: .6}, c2 = {x: 3.0, y: .6};
    const hot = t1 >= t2;

    rect({x: c1.x - bw / 2, y: c1.y - bh / 2}, {x: c1.x + bw / 2, y: c1.y + bh / 2},
      'rgba(255,120,150,.18)', hot ? '#ff8fab' : '#6cb6ff', {w: 1.8});
    rect({x: c2.x - bw / 2, y: c2.y - bh / 2}, {x: c2.x + bw / 2, y: c2.y + bh / 2},
      'rgba(108,182,255,.14)', hot ? '#6cb6ff' : '#ff8fab', {w: 1.8});
    sans('A', X(c1.x), Y(c1.y + .55), 'rgba(240,246,250,.9)', 13);
    sans('B', X(c2.x), Y(c2.y + .55), 'rgba(240,246,250,.9)', 13);
    sans(f1(t1) + ' K', X(c1.x), Y(c1.y - .5), 'rgba(255,215,225,.95)', 13);
    sans(f1(t2) + ' K', X(c2.x), Y(c2.y - .5), 'rgba(200,225,255,.95)', 13);

    line({x: c1.x + bw / 2, y: c1.y}, {x: c2.x - bw / 2, y: c2.y}, 'rgba(220,235,245,.55)', {w: 6});
    sans('导热杆', X(0), Y(c1.y - .38), 'rgba(200,220,235,.65)', 10.5);

    const dt2 = Math.abs(t1 - t2);
    const flowing = dt2 > .8;
    if (flowing) {
      const dir = t1 > t2 ? 1 : -1;
      const a = {x: -1.35 * dir, y: 1.0}, b = {x: 1.35 * dir, y: 1.0};
      arrow(a, b, '#ffc56b', {w: 2.6, head: 12});
      flowDots(a, b, 'rgba(255,197,107,.95)', (s.t * .35) % 1, 4);
      sans('Q', X(0), Y(1.45), '#ffd79a', 13);
    } else {
      sans('温度相同，净热流为零', X(0), Y(1.2), 'rgba(200,220,230,.7)', 10.5);
    }

    const barY = -1.7;
    const scale = 2.4 / 140;
    sans('温度对比', X(-4.4), Y(2.6), 'rgba(200,225,235,.85)', 11.5, 'left');
    rect({x: -4.4, y: barY}, {x: -4.4 + (t1 - 280) * scale, y: barY + .3}, 'rgba(255,143,171,.35)', '#ff8fab', {w: 1.2});
    rect({x: -4.4, y: barY - .52}, {x: -4.4 + (t2 - 280) * scale, y: barY - .22}, 'rgba(108,182,255,.35)', '#6cb6ff', {w: 1.2});
    sans('A', X(-4.62), Y(barY + .15), '#ffb0c4', 11, 'right');
    sans('B', X(-4.62), Y(barY - .37), '#9ecbff', 11, 'right');

    const dS = this.entropy();
    sans('总熵变 ΔS ≈ ' + f2(dS) + ' J/K', X(1.2), Y(-2.9), '#ffd79a', 11.5, 'left');
    sans(dS > 0 ? 'ΔS > 0：过程可以自发进行' : 'ΔS = 0：已达平衡', X(1.2), Y(-3.45),
      dS > 0 ? 'rgba(255,215,154,.85)' : 'rgba(190,215,228,.7)', 10.5, 'left');
    if (s.reverse) sans('反向进行需要外界做功，不能自发！', X(-4.4), Y(-3.45), '#ff8fab', 11, 'left');
    sans('时间 t = ' + f1(s.t) + ' s', X(-4.4), Y(3.3), 'rgba(180,205,220,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: 'A 物体温度', v: f1(this.tempAt(0, s.t)) + ' K', hi: true},
      {k: 'B 物体温度', v: f1(this.tempAt(1, s.t)) + ' K', hi: true},
      {k: '温差', v: f1(Math.abs(this.tempAt(0, s.t) - this.tempAt(1, s.t))) + ' K'},
      {k: '总熵变', v: f2(this.entropy()) + ' J/K'},
      {k: '热流方向', v: this.reverse ? '低温 → 高温（需外界做功）' : (Math.abs(s.T1 - s.T2) < 1 ? '已达热平衡' : '高温 → 低温')}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, 'A 初温 T₁ / K', 340, 500, 5, s.T1, v => f1(v), v => { s.T1 = v; s.t = 0; });
    addSlider(el, 'B 初温 T₂ / K', 260, 330, 5, s.T2, v => f1(v), v => { s.T2 = v; s.t = 0; });
    addToggle(el, '演示「反向」传热', s.reverse, v => { s.reverse = v; s.t = 0; });
    addToggle(el, '自动进行', s.playing, v => s.playing = v);
    addBtn(el, '重新开始', () => { s.t = 0; s.reverse = false; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 能量守恒与永动机 ---------- */
MODULES.push({
  key: 'energy', tab: '05', name: '能量守恒', en: 'ENERGY CONSERVATION', blurb: '机械能变成了内能',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '摆球每摆一次幅度小一点：机械能减少，内能增加，总能量不变',
  playable: true,
  state: {th: .7, om: 0, t: 0, playing: true, b: .35, th0: .7, E0: 0},
  reset() {
    const s = this.state;
    s.th0 = .7; s.th = .7; s.om = 0; s.t = 0; s.playing = true; s.b = .35;
    s.E0 = 1 * G * 1.2 * (1 - Math.cos(.7));
  },
  meta() {
    return {
      title: '总能量守恒，永动机不可能制成',
      desc: '摆球摆动时不断克服阻力，机械能逐渐减少，但减少的部分全部转化为摆球与空气的内能。把机械能与内能相加，总量始终不变，这正是能量守恒定律。',
      formula: 'E<sub>机械</sub> + E<sub>内</sub> = 恒量',
      note: '不消耗能量却能不断对外做功的机器叫<b>永动机</b>，它违反能量守恒定律，永远造不出来。'
    };
  },
  Emech() {
    const s = this.state;
    return .5 * 1 * 1.44 * s.om * s.om + 1 * G * 1.2 * (1 - Math.cos(s.th));
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      const sub = 4;
      const h = dt / sub;
      for (let i = 0; i < sub; i++) {
        const acc = -(G / 1.2) * Math.sin(s.th) - s.b * s.om;
        s.om += acc * h;
        s.th += s.om * h;
        s.t += h;
      }
      if (Math.abs(s.th) > 1.4) s.th = Math.sign(s.th) * 1.4;
    }
    const Em = this.Emech(), E0 = Math.max(s.E0, Em);
    const Ei = Math.max(0, E0 - Em);

    setFrame(.5, .55, 15);
    base();

    const px = -3.2, py = 3.55, len = 3.6;
    const bx = px + Math.sin(s.th) * len, by = py - Math.cos(s.th) * len;
    line({x: px, y: py}, {x: bx, y: by}, 'rgba(210,228,238,.7)', {w: 2.2});
    circleAt({x: px, y: py}, .12, 'rgba(210,228,238,.5)', 'rgba(235,245,250,.8)', {w: 1.2});
    const bobR = .3;
    circleAt({x: bx, y: by}, bobR, 'rgba(123,224,192,.28)', '#7be0c0', {w: 1.8, glow: 8});
    dot({x: bx, y: by}, 'rgba(230,255,248,.9)', 3);
    line({x: px, y: py - len - .55}, {x: px, y: py}, 'rgba(255,255,255,.10)', {w: 1, dash: [5, 6]});
    angleArc({x: px, y: py}, -Math.PI / 2, -Math.PI / 2 + s.th, 78, 'rgba(255,197,107,.6)', '', 11);
    sans('θ = ' + f1(s.th * 180 / Math.PI) + '°', X(px + .35), Y(py - len * .55), '#ffd79a', 11, 'left');
    sans('m = 1 kg，L = 1.2 m', X(px), Y(py + .48), 'rgba(190,215,228,.7)', 10.5);

    /* --- 能量条 --- */
    const zx = 1.3, sc = .42;
    line({x: zx, y: -3.0}, {x: zx, y: 2.6}, 'rgba(198,222,232,.45)', {w: 1.4});
    const rows = [
      {y: 1.9, v: Em, c: '#7be0c0', n: 'E机械'},
      {y: .9, v: Ei, c: '#ff8fab', n: 'E内'},
      {y: -.2, v: Em + Ei, c: '#ffc56b', n: 'E总'}
    ];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const w = clamp(r.v * sc, 0, 4.4);
      rect({x: zx, y: r.y - .24}, {x: zx + w, y: r.y + .24}, 'rgba(255,255,255,.05)', null);
      rect({x: zx, y: r.y - .24}, {x: zx + w, y: r.y + .24}, null, r.c, {w: 1.6});
      sans(r.n, X(zx) - 12, Y(r.y), r.c, 11.5, 'right');
      sans(f2(r.v) + ' J', X(zx + w) + 10, Y(r.y), r.c, 10.5, 'left');
    }
    sans('E总 保持不变', X(zx), Y(-1.1), 'rgba(255,215,154,.9)', 11.5);
    sans('机械能减少 ' + f2(E0 - Em) + ' J，全部转化为内能', X(zx), Y(-1.65), 'rgba(180,208,222,.75)', 10.5);
    line({x: 1.3, y: 2.4}, {x: 5.7, y: 2.4}, 'rgba(255,255,255,.08)', {w: 1});
    sans('能量账本', X(1.3), Y(2.95), 'rgba(200,228,238,.85)', 11.5, 'left');
    if (s.b < .01) sans('无阻力：机械能守恒，摆幅不变', X(-5.6), Y(-3.4), '#9af0d8', 11, 'left');
    else sans('有阻力：机械能 → 内能，总能量守恒', X(-5.6), Y(-3.4), 'rgba(190,215,228,.75)', 10.5, 'left');
  },
  hud() {
    const s = this.state, Em = this.Emech(), E0 = Math.max(s.E0, Em);
    return [
      {k: '机械能', v: f2(Em) + ' J', hi: true},
      {k: '内能增量', v: f2(Math.max(0, E0 - Em)) + ' J', hi: true},
      {k: '总能量', v: f2(E0) + ' J'},
      {k: '摆角', v: f1(s.th * 180 / Math.PI) + '°'},
      {k: '运行时间', v: f1(s.t) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初始摆角 θ₀ / °', 10, 60, 1, 40, v => f1(v), v => {
      s.th0 = v * Math.PI / 180; s.th = s.th0; s.om = 0; s.t = 0;
      s.E0 = G * 1.2 * (1 - Math.cos(s.th0));
    });
    addSlider(el, '阻力系数 b', 0, .8, .05, s.b, v => f1(v), v => s.b = v);
    addToggle(el, '显示能量条', true, v => s.showBar = v);
    addToggle(el, '自动摆动', s.playing, v => s.playing = v);
    addBtn(el, '重新释放', () => { s.th = s.th0; s.om = 0; s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
