/* ============================================================
   选择性必修第三册 · 第 23 章 分子动理论
   01 分子大小  02 布朗运动  03 分子间作用力
   04 分子速率分布  05 物体的内能
   ============================================================ */
(function () {

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function sci(x, d) {
  if (!isFinite(x) || x === 0) return '0';
  const sign = x < 0 ? '−' : '';
  let a = Math.abs(x), e = Math.floor(Math.log10(a));
  a /= Math.pow(10, e);
  if (a >= 9.95) { a /= 10; e += 1; }
  const sup = String(e).replace('-', '⁻').split('').map(c => /[0-9]/.test(c) ? SUB[+c] : c).join('');
  return sign + a.toFixed(d == null ? 1 : d) + '×10' + sup;
}

function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.40)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.40)', {w: 1.4});
  arrow({x: x1 - .35, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .35}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 2, Y(y0) + 32, 'rgba(170,198,210,.85)', 11.5, 'right');
  if (ylab) sans(ylab, X(x0) - 6, Y(y1) - 8, 'rgba(170,198,210,.85)', 11.5, 'left');
}

/* ---------- 01 分子的大小：油膜法 ---------- */
MODULES.push({
  key: 'size', tab: '01', name: '分子大小', en: 'MOLECULE SIZE', blurb: '油膜法测直径',
  accent: '#9ad0ff', rgb: '154,208,255',
  hint: '调节一滴油酸的体积与油膜面积，读出分子直径的数量级',
  playable: true,
  state: {V: 1.2, S: .30, spread: 0, playing: true, showZoom: true},
  reset() {
    const s = this.state;
    s.V = 1.2; s.S = .30; s.spread = 0; s.playing = true; s.showZoom = true;
  },
  meta() {
    return {
      title: '一滴油铺成单分子层，量出分子直径',
      desc: '把一滴油酸酒精溶液滴在水面上，酒精溶于水并挥发，油酸展开成厚度只有一个分子的油膜。量出纯油酸的体积 V 与油膜面积 S，由 d = V/S 就能估出分子直径的数量级。',
      formula: 'd = V / S，分子直径数量级 10<sup>−10</sup> m',
      note: '把油膜看成<b>单分子层</b>是估算的关键：体积除以面积就是厚度。改变 V 或 S，看 d 是否仍在 10⁻¹⁰ m 这一数量级。'
    };
  },
  d10() { return this.state.V / Math.max(.02, this.state.S); },
  draw(dt) {
    const s = this.state;
    if (s.playing && s.spread < 1) s.spread = Math.min(1, s.spread + dt * .55);
    setFrame(.5, .56, 14);
    base();
    const d = this.d10();

    /* --- 左侧：浅盘俯视 --- */
    const cx = -3.7, cy = -.2;
    circleAt({x: cx, y: cy}, 2.55, 'rgba(90,160,205,.06)', 'rgba(150,205,235,.30)', {w: 1.2});
    circleAt({x: cx, y: cy}, 2.55, null, 'rgba(150,205,235,.16)', {w: 1, dash: [5, 7]});
    const rFilm = Math.sqrt(s.S / Math.PI) * 4;
    const rw = rFilm * easeInOut(s.spread);
    if (rw > .02) circleAt({x: cx, y: cy}, rw, 'rgba(154,208,255,.20)', '#9ad0ff', {w: 1.7, glow: 6});
    dot({x: cx, y: cy}, 'rgba(200,228,255,.75)', 2.4);
    sans('浅盘俯视', X(cx), Y(cy + 2.95), 'rgba(180,212,228,.85)', 12);
    sans('油膜面积 S = ' + f2(s.S) + ' m²', X(cx), Y(cy + .05), 'rgba(206,232,250,.92)', 12);
    if (s.spread < .98) sans('油酸正在展开…', X(cx), Y(cy - .55), 'rgba(150,205,235,.6)', 10.5);

    /* --- 右侧：单分子层放大 --- */
    if (s.showZoom) {
      const bx0 = .9, bx1 = 7.0, by0 = -3.2, by1 = 3.0;
      rect({x: bx0, y: by0}, {x: bx1, y: by1}, 'rgba(12,26,40,.55)', 'rgba(150,205,235,.28)', {w: 1.2});
      sans('放大 10⁹ 倍 · 单分子层截面', X(bx0 + .15), Y(by1 - .32), 'rgba(180,215,230,.85)', 11.5, 'left');
      rect({x: bx0 + .3, y: -2.6}, {x: bx1 - .3, y: -1.0}, 'rgba(90,160,205,.16)', null);
      line({x: bx0 + .3, y: -1.0}, {x: bx1 - .3, y: -1.0}, 'rgba(160,210,240,.55)', {w: 1.5});
      sans('水', X(bx0 + .75), Y(-1.85), 'rgba(150,200,230,.65)', 11);
      for (let i = 0; i < 7; i++) {
        const mx = 1.55 + i * .62;
        circleAt({x: mx, y: -1.85}, .12, 'rgba(120,180,215,.30)', null);
      }
      for (let i = 0; i < 8; i++) {
        circleAt({x: 1.55 + i * .55, y: -.62}, .29, 'rgba(154,208,255,.30)', '#9ad0ff', {w: 1.3});
      }
      const tx = 6.35;
      line({x: tx, y: -1.0}, {x: tx, y: -.32}, '#ffc56b', {w: 1.6});
      arrow({x: tx, y: -1.0}, {x: tx, y: -1.08}, '#ffc56b', {w: 1.3, head: 7});
      arrow({x: tx, y: -.33}, {x: tx, y: -.25}, '#ffc56b', {w: 1.3, head: 7});
      sans('d', X(tx), Y(.15), '#ffd79a', 13);
      sans('厚度 = 分子直径', X(3.95), Y(1.45), 'rgba(190,218,232,.85)', 11.5);
      sans('d = V/S = ' + f1(d) + '×10⁻¹⁰ m', X(3.95), Y(.85), '#ffd79a', 12.5);
      sans('单分子层：油酸分子直立在水面上', X(bx0 + .15), Y(by0 + .35), 'rgba(160,195,212,.65)', 10.5, 'left');
    }
  },
  hud() {
    const d = this.d10();
    const N = this.state.V / Math.pow(d, 3) * 1e20;
    return [
      {k: '纯油酸体积 V', v: f1(this.state.V) + '×10⁻¹⁰ m³', hi: true},
      {k: '油膜面积 S', v: f2(this.state.S) + ' m²'},
      {k: '分子直径 d', v: f1(d) + '×10⁻¹⁰ m', hi: true},
      {k: '油膜中分子数', v: sci(N, 1) + ' 个'},
      {k: '直径数量级', v: '10⁻¹⁰ m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '纯油酸体积 V / (10⁻¹⁰ m³)', .4, 2.4, .1, s.V, v => f1(v), v => { s.V = v; s.spread = 0; });
    addSlider(el, '油膜面积 S / m²', .10, .90, .02, s.S, v => f2(v), v => { s.S = v; s.spread = 0; });
    addToggle(el, '显示单分子层放大图', s.showZoom, v => s.showZoom = v);
    addToggle(el, '自动展开油膜', s.playing, v => s.playing = v);
    addBtn(el, '重新展开', () => { s.spread = 0; s.playing = true; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 布朗运动 ---------- */
MODULES.push({
  key: 'brownian', tab: '02', name: '布朗运动', en: 'BROWNIAN MOTION', blurb: '微粒的无规则运动',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '升温或减小颗粒，看花粉颗粒运动更剧烈；折线是颗粒轨迹，不是分子轨迹',
  playable: true,
  state: {T: 300, t: 0, playing: true, rsize: 1, showMol: true, showTrail: true, ps: [], mol: [], seed: 7},
  reset() {
    const s = this.state;
    s.T = 300; s.t = 0; s.playing = true; s.rsize = 1; s.showMol = true; s.showTrail = true; s.seed = 7;
    s.ps = [
      {x: -2.4, y: .9, a: .4, tr: [], len: 0, wait: .05, sp: .95},
      {x: 1.8, y: -1.2, a: 2.4, tr: [], len: 0, wait: .09, sp: 1.1},
      {x: .4, y: 2.0, a: 4.7, tr: [], len: 0, wait: .14, sp: .8}
    ];
    s.mol = [];
    for (let i = 0; i < 66; i++) {
      s.mol.push({x: (this.rnd() - .5) * 10.6, y: (this.rnd() - .5) * 6.0, p: this.rnd() * 6.28});
    }
  },
  rnd() {
    const s = this.state;
    s.seed = (s.seed * 16807) % 2147483647;
    if (s.seed <= 0) s.seed += 2147483646;
    return s.seed / 2147483647;
  },
  speed() { return 1.1 * Math.sqrt(this.state.T / 300) / this.state.rsize; },
  meta() {
    return {
      title: '布朗运动：分子撞击留下的折线',
      desc: '悬浮在水中的花粉颗粒受到周围液体分子无规则的撞击，做不停地、无规则的运动。颗粒越大，各方向撞击越容易抵消；温度越高、颗粒越小，运动越剧烈。',
      formula: '布朗运动是分子无规则运动的<b>间接反映</b>',
      note: '折线是<b>颗粒</b>的位置轨迹，不是分子轨迹。注意折线的无规则性，以及温度、颗粒大小对剧烈程度的影响。'
    };
  },
  step(dt) {
    const s = this.state;
    const u = this.speed();
    for (let i = 0; i < s.ps.length; i++) {
      const p = s.ps[i];
      p.wait -= dt;
      if (p.wait <= 0) {
        p.a += (this.rnd() - .5) * 3.4;
        p.wait = .05 + this.rnd() * .07;
      }
      const px = p.x, py = p.y;
      p.x += Math.cos(p.a) * u * p.sp * dt;
      p.y += Math.sin(p.a) * u * p.sp * dt;
      if (p.x < -5.4) { p.x = -5.4; p.a = Math.PI - p.a; }
      if (p.x > 5.4) { p.x = 5.4; p.a = Math.PI - p.a; }
      if (p.y < -3.0) { p.y = -3.0; p.a = -p.a; }
      if (p.y > 3.0) { p.y = 3.0; p.a = -p.a; }
      p.len += Math.hypot(p.x - px, p.y - py);
      if (s.showTrail) {
        p.tr.push({x: p.x, y: p.y});
        if (p.tr.length > 300) p.tr.shift();
      } else if (p.tr.length) p.tr.length = 0;
    }
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; this.step(dt); }
    setFrame(.5, .55, 15);
    base();
    rect({x: -5.8, y: -3.4}, {x: 5.8, y: 3.4}, 'rgba(70,150,160,.05)', 'rgba(150,205,235,.22)', {w: 1.3});

    for (let i = 0; i < s.mol.length; i++) {
      const m = s.mol[i];
      m.x += Math.sin(s.t * 2.6 + m.p + i) * dt * .9;
      m.y += Math.cos(s.t * 2.1 + m.p * 1.3 + i) * dt * .9;
      if (m.x < -5.6) m.x = 5.6; if (m.x > 5.6) m.x = -5.6;
      if (m.y < -3.2) m.y = 3.2; if (m.y > 3.2) m.y = -3.2;
      if (s.showMol) circleAt({x: m.x, y: m.y}, .045, 'rgba(160,225,210,.30)', null);
    }

    for (let i = 0; i < s.ps.length; i++) {
      const p = s.ps[i];
      if (s.showTrail && p.tr.length > 1) path(p.tr, 'rgba(123,224,192,.62)', {w: 1.6});
      circleAt({x: p.x, y: p.y}, .16 + .06 * s.rsize, 'rgba(123,224,192,.28)', '#7be0c0', {w: 1.6});
      dot({x: p.x, y: p.y}, '#d6fff4', 3.2);
    }

    line({x: -5.5, y: -3.75}, {x: -3.5, y: -3.75}, 'rgba(210,235,240,.8)', {w: 1.6});
    line({x: -5.5, y: -3.85}, {x: -5.5, y: -3.65}, 'rgba(210,235,240,.8)', {w: 1.2});
    line({x: -3.5, y: -3.85}, {x: -3.5, y: -3.65}, 'rgba(210,235,240,.8)', {w: 1.2});
    sans('1 μm', X(-4.5), Y(-3.95), 'rgba(200,228,235,.75)', 10.5);

    sans('液体分子（示意）', X(-5.6), Y(3.15), 'rgba(160,215,205,.55)', 10.5, 'left');
    sans('花粉颗粒', X(2.6), Y(3.15), '#9af0d8', 11);
    arrow({x: 2.9, y: 3.0}, {x: 2.3, y: 2.5}, 'rgba(123,224,192,.55)', {w: 1.2, head: 8});
    if (s.showTrail) sans('轨迹由位置连线而成，不是分子路径', X(-5.6), Y(-3.1), 'rgba(170,205,210,.6)', 10.5, 'left');
  },
  hud() {
    const s = this.state, p0 = s.ps[0];
    let disp = 0, path = 0;
    if (p0) {
      disp = Math.hypot(p0.x - (-2.4), p0.y - .9);
      path = p0.len;
    }
    return [
      {k: '温度 T', v: f1(s.T) + ' K', hi: true},
      {k: '颗粒平均速率', v: f2(this.speed() * .5) + ' μm/s', hi: true},
      {k: '观察时间 t', v: f1(s.t) + ' s'},
      {k: '1 号颗粒位移', v: f2(disp * .5) + ' μm'},
      {k: '1 号颗粒路程', v: f2(path * .5) + ' μm'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '水温 T / K', 200, 600, 10, s.T, v => f1(v), v => s.T = v);
    addSlider(el, '颗粒半径 r / μm', .4, 1.6, .1, s.rsize, v => f1(v), v => s.rsize = v);
    addToggle(el, '显示液体分子', s.showMol, v => s.showMol = v);
    addToggle(el, '显示运动轨迹', s.showTrail, v => s.showTrail = v);
    addBtn(el, '重新开始', () => this.reset(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 分子间作用力 ---------- */
MODULES.push({
  key: 'molforce', tab: '03', name: '分子间作用力', en: 'INTERMOLECULAR FORCE', blurb: '引力与斥力的合力',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '拖动曲线上的点或滑动滑块，改变分子间距，观察引力与斥力谁占上风',
  state: {x: 1.35, showParts: true},
  reset() { this.state.x = 1.35; this.state.showParts = true; },
  meta() {
    return {
      title: '分子间同时存在引力和斥力',
      desc: '两个分子之间既有引力又有斥力，两者都随距离增大而减小，但斥力减小得更快。合力在 r = r₀ 时为零；r 小于 r₀ 表现为斥力，大于 r₀ 表现为引力。',
      formula: 'F = F<sub>斥</sub> − F<sub>引</sub>，r = r<sub>0</sub> 时 F = 0',
      note: '注意 <b>r = r₀</b> 处合力为零，但引力和斥力都不为零。距离再大一些，合力虽为引力却迅速趋近于零。'
    };
  },
  F11(x) { return 8 * (Math.pow(x, -13) - Math.pow(x, -7)); },
  E21(x) { return 2 * (Math.pow(x, -12) - 2 * Math.pow(x, -6)); },
  gx(x) { return -5.6 + (x - .9) / 2.1 * 11.0; },
  gy(F) { return -2.6 + (clamp(F, -2.5, 6.5) + 2.5) / 9 * 6.2; },
  draw() {
    const s = this.state;
    const x = s.x, F = this.F11(x);
    setFrame(.5, .55, 14);
    base();

    axisBox(this.gx(.9), this.gx(3.0), this.gy(-2.5), this.gy(6.5), 'r / r₀', 'F / (10⁻¹¹ N)');
    for (let t = 1; t <= 3.001; t += .5) {
      line({x: this.gx(t), y: this.gy(0)}, {x: this.gx(t), y: this.gy(0) - .09}, 'rgba(198,222,232,.4)', {w: 1});
      sans(f1(t), X(this.gx(t)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
    }
    for (let q = -2; q <= 6; q += 2) {
      if (q === 0) continue;
      line({x: this.gx(.9) - .08, y: this.gy(q)}, {x: this.gx(.9), y: this.gy(q)}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(q), X(this.gx(.9)) - 7, Y(this.gy(q)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }
    line({x: this.gx(1), y: this.gy(-2.5)}, {x: this.gx(1), y: this.gy(6.5)}, 'rgba(255,255,255,.10)', {w: 1, dash: [4, 6]});

    const curve = [];
    for (let xx = .925; xx <= 3.001; xx += .01) curve.push({x: this.gx(xx), y: this.gy(this.F11(xx))});
    if (s.showParts) {
      const pr = [], pa = [];
      for (let xx = .925; xx <= 3.001; xx += .01) {
        pr.push({x: this.gx(xx), y: this.gy(8 * Math.pow(xx, -13))});
        pa.push({x: this.gx(xx), y: this.gy(-8 * Math.pow(xx, -7))});
      }
      path(pr, 'rgba(255,143,171,.55)', {w: 1.5, dash: [5, 5]});
      path(pa, 'rgba(108,182,255,.60)', {w: 1.5, dash: [5, 5]});
    }
    path(curve, '#ffc56b', {w: 2.6, glow: 7});

    const px = this.gx(x), py = this.gy(F);
    line({x: px, y: this.gy(0)}, {x: px, y: py}, 'rgba(255,199,107,.45)', {w: 1.3, dash: [4, 4]});
    dot({x: px, y: py}, '#fff3d6', 5.6);
    handle({x: px, y: py}, '#ffc56b', hoverId === 'r');

    sans('r₀', X(this.gx(.955)), Y(this.gy(-1.7)), 'rgba(200,225,235,.8)', 12);
    sans('平衡位置 F = 0', X(this.gx(1.08)), Y(this.gy(1.3)), 'rgba(180,210,225,.75)', 10.5, 'left');
    sans('r < r₀ · 斥力为主', X(this.gx(1.1)), Y(this.gy(4.9)), '#ffb3c6', 11, 'left');
    sans('r > r₀ · 引力为主', X(this.gx(2.05)), Y(this.gy(-.95)), '#9ecbff', 11, 'left');

    sans('F引', X(this.gx(2.62)) + 4, Y(this.gy(-.5)), 'rgba(140,196,255,.9)', 11, 'left');
    sans('F斥', X(this.gx(1.22)) + 6, Y(this.gy(3.4)), 'rgba(255,163,190,.9)', 11, 'left');
    sans('F合', X(this.gx(1.62)) - 4, Y(this.gy(-.95)) - 4, '#ffd79a', 11.5);

    sans('r = ' + f2(x * .3) + ' nm · ' + (x < .995 ? '表现为斥力' : x > 1.005 ? '表现为引力' : '合力为零'),
      X(this.gx(1.32)), Y(this.gy(6.2)),
      x < .995 ? '#ffb3c6' : x > 1.005 ? '#9ecbff' : '#ffd79a', 12.5, 'left');
  },
  handles() { return [{id: 'r', x: this.gx(this.state.x), y: this.gy(this.F11(this.state.x))}]; },
  drag(id, p) {
    const q = clampPt(p);
    const x = (q.x - this.gx(.9)) / (this.gx(1) - this.gx(.9)) * .1 + .9;
    this.state.x = clamp(x, .93, 3.0);
  },
  hud() {
    const x = this.state.x, F = this.F11(x), Ep = this.E21(x);
    return [
      {k: '分子间距 r', v: f2(x * .3) + ' nm', hi: true},
      {k: '合力 F', v: (F >= 0 ? '' : '−') + f1(Math.abs(F)) + '×10⁻¹¹ N', hi: true},
      {k: '引力大小', v: f1(8 * Math.pow(x, -7)) + '×10⁻¹¹ N'},
      {k: '斥力大小', v: f1(8 * Math.pow(x, -13)) + '×10⁻¹¹ N'},
      {k: '分子势能 Eₚ', v: (Ep >= 0 ? '' : '−') + f2(Math.abs(Ep)) + '×10⁻²¹ J'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '分子间距 r / r₀', .93, 3.0, .01, s.x, v => f2(v), v => s.x = v);
    addToggle(el, '显示引力与斥力分量', s.showParts, v => s.showParts = v);
    addBtn(el, '回到 r = r₀', () => { s.x = 1; }, 'ghost');
  }
});

/* ---------- 04 分子速率分布 ---------- */
MODULES.push({
  key: 'maxwell', tab: '04', name: '速率分布', en: 'SPEED DISTRIBUTION', blurb: '温度决定峰位',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '升高温度，看分布曲线右移变扁；切换气体，比较分子质量的影响',
  playable: true,
  state: {T: 300, gas: 1, playing: false, showMarks: true},
  reset() { const s = this.state; s.T = 300; s.gas = 1; s.playing = false; s.showMarks = true; },
  M() { return [.002, .032, .044][this.state.gas]; },
  vp(T) {
    const t = T == null ? this.state.T : T;
    return Math.sqrt(2 * 8.31 * Math.max(50, t) / this.M());
  },
  fv(v, T) {
    const vp = this.vp(T), u = v / vp;
    return 4 / (Math.sqrt(Math.PI) * vp) * u * u * Math.exp(-u * u);
  },
  gx(v) { return -5.7 + v / 1400 * 11.0; },
  gy(f) { return -2.3 + f * 1000 / 4.4 * 5.9; },
  meta() {
    return {
      title: '大量分子的速率服从统计规律',
      desc: '气体分子速率各不相同，但大量分子的速率分布遵循确定规律：中间速率的分子多，极快极慢的分子少。温度升高，曲线峰值右移并变低，说明分子运动整体变剧烈。',
      formula: 'f(v) = 4π(M/2πRT)<sup>3/2</sup>v²e<sup>−Mv²/2RT</sup>',
      note: '曲线与横轴围成的面积恒为 1。温度升高时<b>曲线变矮变宽</b>，但最概然速率、平均速率、方均根速率都变大。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.T += dt * 60;
      if (s.T > 700) s.T = 150;
      if (this._setT) this._setT(s.T);
    }
    setFrame(.5, .55, 14);
    base();

    axisBox(this.gx(0), this.gx(1400), this.gy(0), this.gy(4.4), 'v / (m/s)', 'f(v) / (10⁻³ s/m)');
    for (let v = 0; v <= 1400; v += 200) {
      line({x: this.gx(v), y: this.gy(0)}, {x: this.gx(v), y: this.gy(0) - .09}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(v), X(this.gx(v)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.72)', 10);
    }
    for (let y = 1; y <= 4; y++) {
      line({x: this.gx(0) - .1, y: this.gy(y)}, {x: this.gx(0), y: this.gy(y)}, 'rgba(198,222,232,.38)', {w: 1});
      sans(String(y), X(this.gx(0)) - 8, Y(this.gy(y)), 'rgba(160,190,205,.72)', 10, 'right');
    }

    if (Math.abs(s.T - 300) > 12) {
      const ref = [];
      for (let v = 0; v <= 1400; v += 10) ref.push({x: this.gx(v), y: this.gy(this.fv(v, 300))});
      path(ref, 'rgba(255,255,255,.22)', {w: 1.5, dash: [6, 6]});
      sans('300 K 参考', X(this.gx(1280)), Y(this.gy(1.6)), 'rgba(200,220,230,.45)', 10.5, 'right');
    }

    const cur = [];
    for (let v = 0; v <= 1400; v += 8) cur.push({x: this.gx(v), y: this.gy(this.fv(v))});
    path(cur, '#6cb6ff', {w: 2.6, glow: 8});

    const vp = this.vp();
    const vbar = 1.1284 * vp, vrms = 1.2247 * vp;
    if (s.showMarks) {
      const marks = [
        {v: vp, c: '#6cb6ff', t: 'v_p'},
        {v: vbar, c: '#7be0c0', t: 'v̄'},
        {v: vrms, c: '#ffc56b', t: 'v_rms'}
      ];
      for (let i = 0; i < marks.length; i++) {
        const m = marks[i];
        line({x: this.gx(m.v), y: this.gy(0)}, {x: this.gx(m.v), y: this.gy(this.fv(m.v))}, m.c, {w: 1.2, dash: [4, 5]});
      }
      dot({x: this.gx(vp), y: this.gy(this.fv(vp))}, '#dbeeff', 5);
    }

    const rows = [
      {c: '#6cb6ff', t: '最概然速率 v_p = ' + f1(vp) + ' m/s'},
      {c: '#7be0c0', t: '平均速率 v̄ = ' + f1(vbar) + ' m/s'},
      {c: '#ffc56b', t: '方均根速率 = ' + f1(vrms) + ' m/s'}
    ];
    for (let i = 0; i < rows.length; i++) {
      const yy = 3.9 - i * .44;
      line({x: -5.5, y: yy}, {x: -4.9, y: yy}, rows[i].c, {w: 2.4});
      sans(rows[i].t, X(-4.7), Y(yy), rows[i].c, 11, 'left');
    }
    sans(['氢气 H₂', '氧气 O₂', '二氧化碳 CO₂'][s.gas] + ' · T = ' + f1(s.T) + ' K',
      X(-5.6), Y(3.05), 'rgba(190,218,230,.85)', 11.5, 'left');
  },
  hud() {
    const s = this.state, vp = this.vp();
    return [
      {k: '温度 T', v: f1(s.T) + ' K', hi: true},
      {k: '最概然速率', v: f1(vp) + ' m/s', hi: true},
      {k: '平均速率', v: f1(1.1284 * vp) + ' m/s'},
      {k: '方均根速率', v: f1(1.2247 * vp) + ' m/s'},
      {k: '摩尔质量 M', v: f1(this.M() * 1000) + ' g/mol'}
    ];
  },
  panel(el) {
    const s = this.state;
    this._sl = addSlider(el, '温度 T / K', 150, 700, 10, s.T, v => f1(v), v => s.T = v);
    this._setT = v => { if (this._sl) this._sl.set(v); };
    addSeg(el, ['H₂', 'O₂', 'CO₂'], s.gas, i => { s.gas = i; });
    addToggle(el, '显示三种特征速率', s.showMarks, v => s.showMarks = v);
    addToggle(el, '自动升温', s.playing, v => s.playing = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 物体的内能 ---------- */
MODULES.push({
  key: 'internal', tab: '05', name: '物体的内能', en: 'INTERNAL ENERGY', blurb: '动能与势能之和',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '升温提高分子平均动能，增大间距改变分子势能，看内能怎样变化',
  state: {T: 300, x: 1.32, showCurve: true},
  reset() { const s = this.state; s.T = 300; s.x = 1.32; s.showCurve = true; },
  meta() {
    return {
      title: '内能 = 分子动能总和 + 分子势能总和',
      desc: '物体内所有分子的动能与势能之和叫内能。温度越高，分子平均动能越大；分子间距改变时分子势能随之改变。所以内能由温度、体积和物质的量共同决定。',
      formula: 'U = Σ E<sub>k</sub> + Σ E<sub>p</sub>，E<sub>k</sub> = 3kT/2',
      note: '理想气体忽略分子势能，内能只由<b>温度</b>和物质的量决定；实际气体压缩时分子势能变化不可忽略。'
    };
  },
  Ek() { return 1.5 * 1.38e-23 * this.state.T * 1e21; },
  Ep() { const x = this.state.x; return 2 * (Math.pow(x, -12) - 2 * Math.pow(x, -6)); },
  u(xx) { return -6.3 + (xx - .85) / 1.15 * 6.0; },
  v(ep) { return -2.6 + (clamp(ep, -3.6, 3.6) + 4) / 8 * 5.4; },
  draw() {
    const s = this.state;
    const Ek = this.Ek(), Ep = this.Ep(), U = Ek + Ep;
    setFrame(.5, .56, 14);
    base();

    if (s.showCurve) {
      const pts = [];
      for (let xx = .86; xx <= 2.001; xx += .01) pts.push({x: this.u(xx), y: this.v(this.E21v(xx))});
      line({x: -6.3, y: this.v(0)}, {x: -.3, y: this.v(0)}, 'rgba(198,222,232,.40)', {w: 1.2});
      line({x: -6.3, y: this.v(0)}, {x: -6.3, y: this.v(-3.6)}, 'rgba(198,222,232,.28)', {w: 1.2});
      path(pts, '#b49cff', {w: 2.4, glow: 6});
      sans('Eₚ — r 曲线', X(-2.9), Y(2.55), 'rgba(200,182,255,.9)', 11.5, 'right');
      sans('r₀', X(this.u(1)), Y(this.v(0)) - 12, 'rgba(190,215,228,.7)', 11);
      sans('Eₚ < 0：分子被束缚', X(-6.15), Y(-2.75), 'rgba(180,205,220,.6)', 10.5, 'left');
      sans('r / r₀', X(-.35), Y(this.v(0)) + 14, 'rgba(170,198,210,.8)', 10.5, 'right');
      const cx = this.u(s.x), cy = this.v(Ep);
      line({x: cx, y: this.v(0)}, {x: cx, y: cy}, 'rgba(180,156,255,.4)', {w: 1.2, dash: [4, 4]});
      dot({x: cx, y: cy}, '#e8e0ff', 5);
      handle({x: cx, y: cy}, '#b49cff', hoverId === 'r');
      sans('r = ' + f2(s.x) + ' r₀', X(cx), Y(this.v(-3.2)), '#cbb8ff', 10.5);
    }

    /* --- 右侧能量条 --- */
    const zx = 1.5, sc = .34;
    line({x: zx, y: -1.4}, {x: zx, y: 2.6}, 'rgba(198,222,232,.45)', {w: 1.4});
    const bars = [
      {y: 2.0, v: Ek, c: '#6cb6ff', n: 'Eₖ'},
      {y: .9, v: Ep, c: '#ffc56b', n: 'Eₚ'},
      {y: -.2, v: U, c: '#7be0c0', n: 'U'}
    ];
    for (let i = 0; i < bars.length; i++) {
      const b = bars[i];
      const w = clamp(b.v * sc, -3.3, 3.4);
      rect({x: zx, y: b.y - .26}, {x: zx + w, y: b.y + .26}, 'rgba(255,255,255,.06)', null);
      rect({x: zx, y: b.y - .26}, {x: zx + w, y: b.y + .26}, null, b.c, {w: 1.6});
      sans(b.n, X(zx - 4.6), Y(b.y), b.c, 12.5, 'right');
      const txt = (b.v < 0 ? '−' : '') + f1(Math.abs(b.v)) + '×10⁻²¹ J';
      sans(txt, b.v < 0 ? X(zx) + 10 : X(zx + w) + 10, Y(b.y), b.c, 11, 'left');
    }
    sans('单个分子的平均能量', X(3.6), Y(3.05), 'rgba(200,225,235,.85)', 11.5);
    sans('T = ' + f1(s.T) + ' K，r = ' + f2(s.x) + ' r₀', X(1.4), Y(-2.6), 'rgba(180,208,222,.75)', 11, 'left');
  },
  E21v(xx) { return 2 * (Math.pow(xx, -12) - 2 * Math.pow(xx, -6)); },
  handles() { return this.state.showCurve ? [{id: 'r', x: this.u(this.state.x), y: this.v(this.Ep())}] : []; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.x = clamp(.86 + (q.x + 6.3) / 6.0 * 1.15, .86, 2.0);
  },
  hud() {
    const Ek = this.Ek(), Ep = this.Ep();
    return [
      {k: '温度 T', v: f1(this.state.T) + ' K', hi: true},
      {k: '平均动能 Eₖ', v: f1(Ek) + '×10⁻²¹ J'},
      {k: '平均势能 Eₚ', v: (Ep < 0 ? '−' : '') + f2(Math.abs(Ep)) + '×10⁻²¹ J'},
      {k: '平均内能', v: f1(Ek + Ep) + '×10⁻²¹ J', hi: true},
      {k: '分子间距', v: f2(this.state.x) + ' r₀'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '温度 T / K', 150, 700, 10, s.T, v => f1(v), v => s.T = v);
    addSlider(el, '分子间距 r / r₀', .86, 2.0, .01, s.x, v => f2(v), v => s.x = v);
    addToggle(el, '显示分子势能曲线', s.showCurve, v => s.showCurve = v);
    addBtn(el, '回到 r = r₀', () => { s.x = 1; }, 'ghost');
  }
});

})();
