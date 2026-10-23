/* ============================================================
   选择性必修第三册 · 第 2 章 气体、固体和液体
   01 玻意耳定律  02 查理定律与盖—吕萨克定律  03 理想气体状态方程
   04 晶体与非晶体  05 液体表面张力
   ============================================================ */
(function () {

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
const R = 8.31;

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function sci(x, d) {
  if (!isFinite(x) || x === 0) return '0';
  let a = Math.abs(x), e = Math.floor(Math.log10(a));
  a /= Math.pow(10, e);
  if (a >= 9.95) { a /= 10; e += 1; }
  const sup = String(e).replace('-', '⁻').split('').map(c => /[0-9]/.test(c) ? SUB[+c] : c).join('');
  return a.toFixed(d == null ? 1 : d) + '×10' + sup;
}
function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.40)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.40)', {w: 1.4});
  arrow({x: x1 - .35, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .35}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 2, Y(y0) + 32, 'rgba(170,198,210,.85)', 11.5, 'right');
  if (ylab) sans(ylab, X(x0) - 6, Y(y1) - 8, 'rgba(170,198,210,.85)', 11.5, 'left');
}

/* ---------- 01 玻意耳定律 ---------- */
MODULES.push({
  key: 'boyle', tab: '01', name: '玻意耳定律', en: 'BOYLE LAW', blurb: '等温压缩气体',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '推动活塞改变体积，观察压强计读数与 p-V 图上的双曲线',
  playable: true,
  state: {V: 2.0, T: 300, playing: false, dir: -1, showCurve: true, showFamily: false},
  reset() {
    const s = this.state;
    s.V = 2.0; s.T = 300; s.playing = false; s.dir = -1; s.showCurve = true; s.showFamily = false;
  },
  meta() {
    return {
      title: '温度不变时，压强与体积成反比',
      desc: '封闭在气缸里的气体，在温度保持不变时被缓慢压缩或膨胀。体积越小，单位体积内的分子数越多，单位时间撞击器壁的分子越多，压强就越大，p 与 V 成反比。',
      formula: 'pV = C（T 不变），p<sub>1</sub>V<sub>1</sub> = p<sub>2</sub>V<sub>2</sub>',
      note: '注意 p-V 图是<b>双曲线</b>的一支。判断等温变化的关键是：过程中气体温度始终等于环境温度。'
    };
  },
  p() { return .04 * R * this.state.T / (this.state.V * 1e-3); },
  gx(v) { return -5.9 + v / 4.5 * 11.6; },
  gy(p) { return -2.6 + p / 2.1e5 * 3.7; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.V += s.dir * dt * .55;
      if (s.V < 1.0) { s.V = 1.0; s.dir = 1; }
      if (s.V > 4.0) { s.V = 4.0; s.dir = -1; }
      if (this._setV) this._setV(s.V);
    }
    const p = this.p();
    setFrame(.5, .55, 15);
    base();

    /* --- 左：气缸与活塞 --- */
    const y0 = 1.75, y1 = 3.3, xL = -6.3;
    const xP = xL + .55 + (s.V - 1) / 3 * 2.9;
    rect({x: xL, y: y0}, {x: xP, y: y1}, 'rgba(98,178,220,.10)', 'rgba(170,215,240,.35)', {w: 1.4});
    rect({x: xL, y: y0}, {x: xP, y: y1}, null, 'rgba(255,143,171,.55)', {w: 1.2, dash: [5, 6]});
    for (let i = 0; i < 26; i++) {
      const gx2 = xL + .18 + ((i * 0.83) % (xP - xL - .35));
      const gy2 = y0 + .2 + ((i * 1.37) % (y1 - y0 - .4));
      circleAt({x: gx2, y: gy2}, .045, 'rgba(255,170,195,.55)', null);
    }
    rect({x: xP, y: y0 - .2}, {x: xP + .26, y: y1 + .2}, 'rgba(230,240,248,.85)', 'rgba(255,255,255,.6)', {w: 1.2});
    line({x: xP + .13, y: y1 + .2}, {x: xP + .13, y: y1 + .85}, 'rgba(230,240,248,.7)', {w: 3});
    sans('活塞', X(xP + .13), Y(y0 - .35), 'rgba(220,232,242,.8)', 10.5);
    sans('封闭气体 V = ' + f2(s.V) + ' L', X((xL + xP) / 2), Y(y1 + .33), 'rgba(255,175,200,.9)', 11.5);
    arrow({x: xP + .62, y: (y0 + y1) / 2}, {x: xP + (s.dir > 0 ? 1.25 : -.1), y: (y0 + y1) / 2}, '#ff8fab', {w: 2.2, head: 10});

    /* --- 右：p-V 图 --- */
    axisBox(this.gx(0), this.gx(4.5), this.gy(0), this.gy(2.0e5), 'V / L', 'p / (10⁵ Pa)');
    for (let v = 1; v <= 4; v++) {
      line({x: this.gx(v), y: this.gy(0)}, {x: this.gx(v), y: this.gy(0) - .07}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(v), X(this.gx(v)), Y(this.gy(0)) + 13, 'rgba(160,190,205,.7)', 9.5);
    }
    for (let q = 1; q <= 4; q++) {
      const pp = q * .5e5;
      line({x: this.gx(0) - .08, y: this.gy(pp)}, {x: this.gx(0), y: this.gy(pp)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(f1(q * .5), X(this.gx(0)) - 7, Y(this.gy(pp)), 'rgba(160,190,205,.7)', 9.5, 'right');
    }
    if (s.showFamily) {
      const Ts = [250, 300, 350, 400];
      for (let i = 0; i < Ts.length; i++) {
        const arr = [];
        for (let v = 1; v <= 4.4; v += .05) arr.push({x: this.gx(v), y: this.gy(.04 * R * Ts[i] / (v * 1e-3))});
        path(arr, 'rgba(255,143,171,.22)', {w: 1.3});
        sans(f1(Ts[i]) + ' K', X(this.gx(4.2)), Y(this.gy(.04 * R * Ts[i] / 4.2e-3)) + 12, 'rgba(255,175,200,.45)', 9.5, 'right');
      }
    }
    if (s.showCurve) {
      const arr = [];
      const n = .04, T = s.T;
      for (let v = 1; v <= 4.4; v += .04) arr.push({x: this.gx(v), y: this.gy(n * R * T / (v * 1e-3))});
      path(arr, '#ff8fab', {w: 2.6, glow: 8});
      sans('pV = 恒量', X(this.gx(3.1)), Y(this.gy(1.05e5)), 'rgba(255,175,200,.9)', 11.5);
    }
    const cx = this.gx(s.V), cy = this.gy(p);
    line({x: cx, y: this.gy(0)}, {x: cx, y: cy}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
    line({x: this.gx(0), y: cy}, {x: cx, y: cy}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
    dot({x: cx, y: cy}, '#ffe2ea', 5.6);
    handle({x: cx, y: cy}, '#ff8fab', hoverId === 'pt');
    sans('p = ' + f2(p / 1e5) + '×10⁵ Pa', X(this.gx(0)) + 10, Y(this.gy(1.86e5)), 'rgba(255,200,215,.9)', 11, 'left');
  },
  handles() { return [{id: 'pt', x: this.gx(this.state.V), y: this.gy(this.p())}]; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.V = clamp((q.x - this.gx(0)) / (this.gx(1) - this.gx(0)), 1.0, 4.0);
  },
  hud() {
    const s = this.state, p = this.p();
    return [
      {k: '体积 V', v: f2(s.V) + ' L', hi: true},
      {k: '压强 p', v: f2(p / 1e5) + '×10⁵ Pa', hi: true},
      {k: 'pV 乘积', v: f1(p * s.V * 1e-3) + ' J'},
      {k: '温度 T', v: f1(s.T) + ' K'},
      {k: '变化趋势', v: s.dir < 0 ? '等温压缩' : '等温膨胀'}
    ];
  },
  panel(el) {
    const s = this.state;
    this._sl = addSlider(el, '体积 V / L', 1.0, 4.0, .05, s.V, v => f2(v), v => s.V = v);
    this._setV = v => { if (this._sl) this._sl.set(v); };
    addSlider(el, '温度 T / K', 250, 400, 5, s.T, v => f1(v), v => s.T = v);
    addToggle(el, '显示 p-V 曲线', s.showCurve, v => s.showCurve = v);
    addToggle(el, '显示不同温度的等温线', s.showFamily, v => s.showFamily = v);
    addToggle(el, '自动压缩与膨胀', s.playing, v => s.playing = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 查理定律与盖—吕萨克定律 ---------- */
MODULES.push({
  key: 'charles', tab: '02', name: '查理定律', en: 'CHARLES LAW', blurb: '等容与等压变化',
  accent: '#9ad0ff', rgb: '154,208,255',
  hint: '升温看 p-T 与 V-T 两条直线，注意它们的延长线都过坐标原点',
  playable: true,
  state: {T: 300, playing: false, mode: 0, showRead: true},
  reset() { const s = this.state; s.T = 300; s.playing = false; s.mode = 0; s.showRead = true; },
  meta() {
    return {
      title: '等容与等压：直线都指向原点',
      desc: '一定质量的气体，体积不变时压强与热力学温度成正比；压强不变时体积与热力学温度成正比。把 p-T、V-T 图画出来，两条直线延长后都通过坐标原点。',
      formula: 'p/T = C<sub>1</sub>（等容），V/T = C<sub>2</sub>（等压）',
      note: '只有用<b>热力学温度 K</b> 时直线才过原点。若用摄氏温度作横轴，截距是 −273.15 ℃，这就是绝对零度的由来。'
    };
  },
  p() { return 1.0e5 * this.state.T / 273.15; },
  vol() { return 2.0 * this.state.T / 273.15; },
  gx1(T) { return -6.3 + (T - 200) / 300 * 5.0; },
  gyP(p) { return -2.5 + p / 2.0e5 * 5.2; },
  gx2(T) { return .9 + (T - 200) / 300 * 5.0; },
  gyV(v) { return -2.5 + v / 4.0 * 5.2; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.T += dt * 45;
      if (s.T > 500) s.T = 200;
      if (this._setT) this._setT(s.T);
    }
    const p = this.p(), V = this.vol();
    setFrame(.5, .55, 15);
    base();

    /* --- 左：p-T --- */
    axisBox(this.gx1(200), this.gx1(500), this.gyP(0), this.gyP(2.0e5), 'T / K', 'p / (10⁵ Pa)');
    for (let T = 200; T <= 500; T += 100) {
      sans(String(T), X(this.gx1(T)), Y(this.gyP(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
      line({x: this.gx1(T), y: this.gyP(0)}, {x: this.gx1(T), y: this.gyP(0) - .07}, 'rgba(198,222,232,.35)', {w: 1});
    }
    for (let q = 1; q <= 4; q++) {
      line({x: this.gx1(200) - .08, y: this.gyP(q * .5e5)}, {x: this.gx1(200), y: this.gyP(q * .5e5)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(f1(q * .5), X(this.gx1(200)) - 7, Y(this.gyP(q * .5e5)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }
    const lp = [];
    for (let T = 200; T <= 500; T += 5) lp.push({x: this.gx1(T), y: this.gyP(1.0e5 * T / 273.15)});
    path(lp, s.mode === 0 ? '#ff8fab' : 'rgba(255,143,171,.35)', {w: s.mode === 0 ? 2.6 : 1.4, glow: s.mode === 0 ? 8 : 0});
    dot({x: this.gx1(s.T), y: this.gyP(p)}, '#ffe2ea', 5.6);
    handle({x: this.gx1(s.T), y: this.gyP(p)}, '#ff8fab', hoverId === 'pt1');
    sans('等容变化', X(this.gx1(215)), Y(this.gyP(1.9e5)), '#ffb8cb', 11.5, 'left');
    if (s.showRead) sans('p/T = ' + f1(p / s.T) + ' Pa/K', X(this.gx1(215)), Y(this.gyP(1.72e5)), 'rgba(255,190,208,.8)', 10.5, 'left');

    /* --- 右：V-T --- */
    axisBox(this.gx2(200), this.gx2(500), this.gyV(0), this.gyV(4.0), 'T / K', 'V / L');
    for (let T = 200; T <= 500; T += 100) {
      sans(String(T), X(this.gx2(T)), Y(this.gyV(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
      line({x: this.gx2(T), y: this.gyV(0)}, {x: this.gx2(T), y: this.gyV(0) - .07}, 'rgba(198,222,232,.35)', {w: 1});
    }
    for (let q = 1; q <= 4; q++) {
      line({x: this.gx2(200) - .08, y: this.gyV(q)}, {x: this.gx2(200), y: this.gyV(q)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(q), X(this.gx2(200)) - 7, Y(this.gyV(q)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }
    const lv = [];
    for (let T = 200; T <= 500; T += 5) lv.push({x: this.gx2(T), y: this.gyV(2.0 * T / 273.15)});
    path(lv, s.mode === 1 ? '#7be0c0' : 'rgba(123,224,192,.35)', {w: s.mode === 1 ? 2.6 : 1.4, glow: s.mode === 1 ? 8 : 0});
    dot({x: this.gx2(s.T), y: this.gyV(V)}, '#d6fff4', 5.6);
    handle({x: this.gx2(s.T), y: this.gyV(V)}, '#7be0c0', hoverId === 'pt2');
    sans('等压变化', X(this.gx2(215)), Y(this.gyV(3.7)), '#9af0d8', 11.5, 'left');
    if (s.showRead) sans('V/T = ' + f2(V / s.T) + ' L/K', X(this.gx2(215)), Y(this.gyV(3.35)), 'rgba(150,240,215,.8)', 10.5, 'left');

    line({x: this.gx1(273.15), y: this.gyP(0)}, {x: this.gx1(273.15), y: this.gyP(1.0e5)}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 5]});
    sans('273 K', X(this.gx1(273.15)) + 4, Y(this.gyP(0)) - 10, 'rgba(200,220,230,.45)', 9.5, 'left');
    sans('T = ' + f1(s.T) + ' K（t = ' + f1(s.T - 273.15) + ' ℃）', X(-6.3), Y(3.45), 'rgba(200,228,240,.85)', 11.5, 'left');
  },
  handles() {
    const s = this.state;
    return [
      {id: 'pt1', x: this.gx1(s.T), y: this.gyP(this.p())},
      {id: 'pt2', x: this.gx2(s.T), y: this.gyV(this.vol())}
    ];
  },
  drag(id, p) {
    const q = clampPt(p);
    const T = id === 'pt1'
      ? 200 + (q.x - this.gx1(200)) / 5.0 * 300
      : 200 + (q.x - this.gx2(200)) / 5.0 * 300;
    this.state.T = clamp(T, 200, 500);
  },
  hud() {
    const s = this.state, p = this.p(), V = this.vol();
    return [
      {k: '温度 T', v: f1(s.T) + ' K', hi: true},
      {k: '摄氏温度 t', v: f1(s.T - 273.15) + ' ℃'},
      {k: '压强 p', v: f2(p / 1e5) + '×10⁵ Pa', hi: true},
      {k: '体积 V', v: f2(V) + ' L'},
      {k: 'p/T', v: f1(p / s.T) + ' Pa/K'},
      {k: 'V/T', v: f2(V / s.T * 1000) + '×10⁻³ L/K'}
    ];
  },
  panel(el) {
    const s = this.state;
    this._sl = addSlider(el, '温度 T / K', 200, 500, 1, s.T, v => f1(v), v => s.T = v);
    this._setT = v => { if (this._sl) this._sl.set(v); };
    addSeg(el, ['等容', '等压'], s.mode, i => s.mode = i);
    addToggle(el, '显示比值读数', s.showRead, v => s.showRead = v);
    addToggle(el, '自动升温', s.playing, v => s.playing = v);
    addBtn(el, '回到 300 K', () => { s.T = 300; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 理想气体状态方程 ---------- */
MODULES.push({
  key: 'ideal', tab: '03', name: '状态方程', en: 'IDEAL GAS LAW', blurb: 'pV/T 保持不变',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换过程类型，改变末态参数，验证 pV/T 始终等于同一个常数',
  state: {mode: 0, VB: 3.0, TB: 450, showIso: true},
  reset() { const s = this.state; s.mode = 0; s.VB = 3.0; s.TB = 450; s.showIso = true; },
  meta() {
    return {
      title: 'pV/T = 恒量：三个参量一起变',
      desc: '一定质量的理想气体，压强与体积的乘积跟热力学温度的比值保持不变。无论是等温、等压还是等容过程，初末状态都满足这个关系，可以统一成一个状态方程。',
      formula: 'pV/T = C，p<sub>1</sub>V<sub>1</sub>/T<sub>1</sub> = p<sub>2</sub>V<sub>2</sub>/T<sub>2</sub>',
      note: '先把摄氏温度换成<b>热力学温度</b>再代入。三种特殊过程只是这个方程在某个参量不变时的特例。'
    };
  },
  A() { return {p: 1.0e5, V: 2.0, T: 300}; },
  B() {
    const s = this.state, A = this.A();
    if (s.mode === 0) {
      const V = s.VB;
      return {p: A.p * A.V / V, V: V, T: A.T};
    }
    if (s.mode === 1) {
      const T = s.TB;
      return {p: A.p, V: A.V * T / A.T, T: T};
    }
    const T = s.TB;
    return {p: A.p * T / A.T, V: A.V, T: T};
  },
  gx(v) { return -5.4 + v / 4.5 * 10.8; },
  gy(p) { return -2.7 + p / 2.5e5 * 5.4; },
  draw() {
    const s = this.state, A = this.A(), B = this.B();
    setFrame(.5, .55, 15);
    base();

    axisBox(this.gx(0), this.gx(4.5), this.gy(0), this.gy(2.5e5), 'V / L', 'p / (10⁵ Pa)');
    for (let v = 1; v <= 4; v++) {
      line({x: this.gx(v), y: this.gy(0)}, {x: this.gx(v), y: this.gy(0) - .07}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(v), X(this.gx(v)), Y(this.gy(0)) + 14, 'rgba(160,190,205,.72)', 9.5);
    }
    for (let q = 1; q <= 5; q++) {
      line({x: this.gx(0) - .08, y: this.gy(q * .5e5)}, {x: this.gx(0), y: this.gy(q * .5e5)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(f1(q * .5), X(this.gx(0)) - 7, Y(this.gy(q * .5e5)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }

    if (s.showIso) {
      const iso = [];
      for (let v = .8; v <= 4.4; v += .05) iso.push({x: this.gx(v), y: this.gy(A.p * A.V / v)});
      path(iso, 'rgba(180,156,255,.22)', {w: 1.4, dash: [5, 6]});
      const isoT = [];
      for (let v = .8; v <= 4.4; v += .05) isoT.push({x: this.gx(v), y: this.gy(A.p * A.V * B.T / A.T / v)});
      path(isoT, 'rgba(255,199,107,.16)', {w: 1.4, dash: [5, 6]});
    }

    const pa = {x: this.gx(A.V), y: this.gy(A.p)};
    const pb = {x: this.gx(B.V), y: this.gy(B.p)};
    if (s.mode === 0) {
      const arr = [];
      for (let i = 0; i <= 40; i++) {
        const v = A.V + (B.V - A.V) * i / 40;
        arr.push({x: this.gx(v), y: this.gy(A.p * A.V / v)});
      }
      path(arr, '#ffc56b', {w: 2.2, glow: 6});
    } else {
      line(pa, pb, '#ffc56b', {w: 2.2, glow: 6});
    }

    dot(pa, '#e8e0ff', 5.6);
    dot(pb, '#ffe3b0', 5.6);
    sans('A', X(pa.x) - 12, Y(pa.y) - 12, '#cbb8ff', 12.5);
    sans('B', X(pb.x) + 12, Y(pb.y) + 12, '#ffd79a', 12.5);
    handle(pb, '#ffc56b', hoverId === 'b');

    const names = ['等温过程', '等压过程', '等容过程'];
    sans(names[s.mode] + '：' + (s.mode === 0 ? 'T 不变，p 与 V 成反比' : s.mode === 1 ? 'p 不变，V 与 T 成正比' : 'V 不变，p 与 T 成正比'),
      X(this.gx(0)) + 8, Y(this.gy(2.3e5)), 'rgba(210,232,242,.88)', 11.5, 'left');

    const dA = A.p * A.V * 1e-3 / A.T, dB = B.p * B.V * 1e-3 / B.T;
    sans('pV/T：A 状态 ' + f2(dA) + ' J/K', X(this.gx(0)) + 8, Y(this.gy(1.05e5)), 'rgba(200,182,255,.9)', 11.5, 'left');
    sans('B 状态 ' + f2(dB) + ' J/K', X(this.gx(0)) + 8, Y(this.gy(.8e5)), 'rgba(255,215,154,.9)', 11.5, 'left');
  },
  handles() {
    const B = this.B();
    return [{id: 'b', x: this.gx(B.V), y: this.gy(B.p)}];
  },
  drag(id, p) {
    const q = clampPt(p);
    const s = this.state;
    if (s.mode === 0) {
      s.VB = clamp((q.x - this.gx(0)) / (this.gx(1) - this.gx(0)), 1.0, 4.0);
    } else {
      s.TB = clamp(300 * (q.x - this.gx(0)) / (this.gx(1) - this.gx(0)) / 2.0, 200, 600);
    }
  },
  hud() {
    const A = this.A(), B = this.B();
    return [
      {k: '初态 p₁', v: f2(A.p / 1e5) + '×10⁵ Pa', hi: true},
      {k: '初态 V₁', v: f2(A.V) + ' L'},
      {k: '初态 T₁', v: f1(A.T) + ' K'},
      {k: '末态 p₂', v: f2(B.p / 1e5) + '×10⁵ Pa', hi: true},
      {k: '末态 V₂', v: f2(B.V) + ' L'},
      {k: '末态 T₂', v: f1(B.T) + ' K'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['等温', '等压', '等容'], s.mode, i => s.mode = i);
    addSlider(el, '末态体积 V₂ / L', 1.0, 4.0, .05, s.VB, v => f2(v), v => s.VB = v);
    addSlider(el, '末态温度 T₂ / K', 200, 600, 5, s.TB, v => f1(v), v => s.TB = v);
    addToggle(el, '显示等温线参考', s.showIso, v => s.showIso = v);
    addBtn(el, '复位末态', () => { s.VB = 3.0; s.TB = 450; }, 'ghost');
  }
});

/* ---------- 04 晶体与非晶体 ---------- */
MODULES.push({
  key: 'crystal', tab: '04', name: '晶体与非晶体', en: 'CRYSTAL & AMORPHOUS', blurb: '有无固定熔点',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '对比微观排列与熔化曲线：晶体有固定熔点，非晶体没有',
  playable: true,
  state: {kind: 0, t: 0, playing: true, showLattice: true, dots: []},
  reset() {
    const s = this.state;
    s.kind = 0; s.t = 0; s.playing = true; s.showLattice = true;
    s.dots = [];
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        s.dots.push({x: c * .62 + (rnd() - .5) * .2, y: r * .62 + (rnd() - .5) * .2, j: rnd()});
      }
    }
  },
  meta() {
    return {
      title: '有没有固定熔点，看熔化曲线',
      desc: '晶体内部微粒按一定规则排列，熔化时温度停在熔点不变；非晶体内部微粒排列无序，加热时逐渐变软，没有确定的熔点。观察两条曲线的平台差异。',
      formula: '晶体：有固定熔点；非晶体：无固定熔点',
      note: '曲线平台表示<b>吸热但温度不变</b>，热量全部用于破坏规则的排列。非晶体的曲线只是斜率改变，找不到平台。'
    };
  },
  tempAt(t) {
    if (this.state.kind === 0) {
      if (t < 4) return 20 + 15 * t;
      if (t < 8) return 80;
      return 80 + 12 * (t - 8);
    }
    if (t < 5) return 20 + 10.4 * t;
    return 72 + 5.2 * (t - 5);
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt * 1.6;
      if (s.t > 12) { s.t = 0; }
    }
    setFrame(.5, .55, 15);
    base();

    /* --- 左：微观排列 --- */
    sans('微观结构', X(-6.0), Y(1.95), 'rgba(200,225,235,.85)', 12, 'left');
    if (s.showLattice) {
      for (let i = 0; i < s.dots.length; i++) {
        const d = s.dots[i];
        const jx = s.kind === 0 ? 0 : Math.sin(d.j * 9.1) * .1;
        const jy = s.kind === 0 ? 0 : Math.cos(d.j * 7.3) * .1;
        circleAt({x: -6.0 + d.x + jx, y: -1.35 + d.y + jy}, .13, 'rgba(255,197,107,.18)', '#ffc56b', {w: 1.2});
      }
      if (s.kind === 0) {
        for (let r = 0; r < 5; r++) {
          line({x: -6.0, y: -1.35 + r * .62}, {x: -6.0 + 6 * .62, y: -1.35 + r * .62}, 'rgba(255,197,107,.16)', {w: 1});
        }
      }
    }
    sans(s.kind === 0 ? '微粒规则排列 · 长程有序' : '微粒杂乱堆积 · 无序',
      X(-6.0), Y(-2.05), s.kind === 0 ? 'rgba(255,215,154,.85)' : 'rgba(200,215,225,.75)', 10.5, 'left');

    /* --- 右：熔化曲线 --- */
    const gx = t => -1.4 + t / 12 * 7.2;
    const gy = T => -2.6 + T / 140 * 5.2;
    line({x: gx(0), y: gy(0)}, {x: gx(12.4), y: gy(0)}, 'rgba(198,222,232,.40)', {w: 1.3});
    line({x: gx(0), y: gy(0)}, {x: gx(0), y: gy(140)}, 'rgba(198,222,232,.40)', {w: 1.3});
    arrow({x: gx(12.4) - .3, y: gy(0)}, {x: gx(12.4), y: gy(0)}, 'rgba(198,222,232,.5)', {w: 1.1, head: 8});
    arrow({x: gx(0), y: gy(140) - .3}, {x: gx(0), y: gy(140)}, 'rgba(198,222,232,.5)', {w: 1.1, head: 8});
    sans('t / min', X(gx(12.4)), Y(gy(0)) + 15, 'rgba(170,198,210,.85)', 10.5, 'right');
    sans('T / ℃', X(gx(0)) - 8, Y(gy(140)) + 10, 'rgba(170,198,210,.85)', 10.5, 'left');
    for (let T = 40; T <= 120; T += 40) {
      line({x: gx(0) - .07, y: gy(T)}, {x: gx(0), y: gy(T)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(T), X(gx(0)) - 7, Y(gy(T)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }
    if (s.kind === 0) {
      line({x: gx(0), y: gy(80)}, {x: gx(12.4), y: gy(80)}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 5]});
      sans('熔点 80 ℃', X(gx(11.6)), Y(gy(80)) - 11, 'rgba(255,215,154,.8)', 10, 'right');
    }
    const pts = [];
    const n = Math.max(1, Math.floor(s.t * 20));
    for (let i = 0; i <= n; i++) {
      const tt = s.t * i / n;
      pts.push({x: gx(tt), y: gy(this.tempAt(tt))});
    }
    path(pts, s.kind === 0 ? '#ffc56b' : '#7be0c0', {w: 2.6, glow: 8});
    const T0 = this.tempAt(s.t);
    dot({x: gx(s.t), y: gy(T0)}, '#fff6e2', 5.6);
    sans('T = ' + f1(T0) + ' ℃', X(gx(s.t)) + 12, Y(gy(T0)) - 12, '#ffe3b0', 11, 'left');

    sans(s.kind === 0 ? '晶体：熔化时温度不变' : '非晶体：无平台',
      X(gx(3.4)), Y(gy(128)), s.kind === 0 ? '#ffd79a' : '#9af0d8', 11, 'left');
  },
  hud() {
    const s = this.state, T = this.tempAt(s.t);
    return [
      {k: '物质类别', v: s.kind === 0 ? '晶体（萘）' : '非晶体（玻璃）', hi: true},
      {k: '熔点', v: s.kind === 0 ? '80 ℃' : '无固定熔点', hi: true},
      {k: '当前温度', v: f1(T) + ' ℃'},
      {k: '加热时间', v: f1(s.t) + ' min'},
      {k: '物态', v: s.kind === 0 ? (s.t < 4 ? '固态' : s.t < 8 ? '固液共存' : '液态') : (T < 72 ? '固态' : '软化中')}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['晶体', '非晶体'], s.kind, i => { s.kind = i; s.t = 0; });
    addSlider(el, '加热时间 t / min', 0, 12, .1, s.t, v => f1(v), v => s.t = v);
    addToggle(el, '显示微粒排列', s.showLattice, v => s.showLattice = v);
    addToggle(el, '自动加热', s.playing, v => s.playing = v);
    addBtn(el, '重新加热', () => { s.t = 0; s.playing = true; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 液体表面张力 ---------- */
MODULES.push({
  key: 'surface', tab: '05', name: '表面张力', en: 'SURFACE TENSION', blurb: '液面收缩的力量',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '改变金属框长度与液体种类，比较拉紧液膜所需的力',
  playable: true,
  state: {L: 10, liq: 0, x: .8, playing: false},
  reset() { const s = this.state; s.L = 10; s.liq = 0; s.x = .8; s.playing = false; },
  meta() {
    return {
      title: '表面张力：液面像一层绷紧的膜',
      desc: '液体表面层的分子间距较大，分子间表现为引力，使液面有收缩到最小的趋势。金属框上的肥皂膜会把可动边拉向内侧，拉力大小 F = 2σL，因为液膜有两个表面。',
      formula: 'F = 2σL（σ 为表面张力系数）',
      note: '看清公式里的 <b>2</b>：液膜有前后两个表面，每个表面都对长度为 L 的边施加 σL 的拉力。'
    };
  },
  sigma() { return [72, 22, 25][this.state.liq]; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.x -= dt * .35;
      if (s.x < -1.3) s.x = .9;
    }
    setFrame(.5, .55, 15);
    base();

    const h = 1.2 + s.L * .12;
    const xl = -5.6, xr = s.x;
    const yT = h / 2, yB = -h / 2;

    rect({x: xl, y: yB}, {x: xr, y: yT}, 'rgba(123,224,192,.10)', 'rgba(123,224,192,.35)', {w: 1, dash: [5, 6]});
    line({x: xl, y: yB}, {x: xr, y: yB}, '#cfdae4', {w: 4});
    line({x: xl, y: yT}, {x: xr, y: yT}, '#cfdae4', {w: 4});
    line({x: xl, y: yB}, {x: xl, y: yT}, '#cfdae4', {w: 5});
    line({x: xr, y: yB - .12}, {x: xr, y: yT + .12}, '#e8f0f8', {w: 5});
    sans('可动边', X(xr) + 12, Y(yT + .28), 'rgba(220,232,242,.85)', 10.5, 'left');
    sans('金属框', X(xl) - 10, Y(yB - .3), 'rgba(200,215,225,.7)', 10.5, 'right');

    const L = s.L;
    line({x: xr + .38, y: yB}, {x: xr + .38, y: yT}, '#ffc56b', {w: 1.4});
    arrow({x: xr + .38, y: yB}, {x: xr + .38, y: yB - .1}, '#ffc56b', {w: 1.2, head: 6});
    arrow({x: xr + .38, y: yT}, {x: xr + .38, y: yT + .1}, '#ffc56b', {w: 1.2, head: 6});
    sans('L = ' + f1(L) + ' cm', X(xr + .55), Y(0), '#ffd79a', 11, 'left');

    const Fm = 2 * this.sigma() * L / 100;
    const scale = clamp(Fm / 3, .5, 2.6);
    arrow({x: xr - .05, y: h * .26}, {x: xr - .05 - scale, y: h * .26}, '#7be0c0', {w: 2.6, head: 12});
    arrow({x: xr - .05, y: -h * .26}, {x: xr - .05 - scale, y: -h * .26}, '#7be0c0', {w: 2.6, head: 12});
    sans('F = ' + f1(Fm) + ' mN', X(xr - scale / 2), Y(-h / 2 - .45), '#9af0d8', 11.5);

    /* --- 右侧：液滴与表面层分子 --- */
    const cx = 3.6, cy = .5;
    circleAt({x: cx, y: cy}, 1.15, 'rgba(110,200,230,.12)', 'rgba(140,225,240,.55)', {w: 1.4});
    for (let i = 0; i < 3; i++) {
      circleAt({x: cx, y: cy}, 1.15 - i * .06, null, 'rgba(150,230,245,.12)', {w: 1});
    }
    sans('液滴趋于球形', X(cx), Y(cy - 1.55), 'rgba(160,235,240,.85)', 11);
    sans('表面积趋于最小', X(cx), Y(cy - 1.95), 'rgba(150,205,220,.65)', 10.5);

    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (i + .5) / 9;
      const px2 = cx + Math.cos(a) * 1.05, py2 = cy + Math.sin(a) * 1.05;
      arrow({x: px2, y: py2}, {x: px2 - Math.cos(a) * .42, y: py2 - Math.sin(a) * .42}, 'rgba(255,197,107,.55)', {w: 1.4, head: 7});
    }
    sans('表面层分子只受内侧引力', X(cx), Y(cy + 1.55), 'rgba(255,215,154,.7)', 10, 'left');
    sans('液体', X(cx), Y(cy + 1.15), 'rgba(180,225,240,.55)', 10);
  },
  hud() {
    const Fm = 2 * this.sigma() * this.state.L / 100;
    return [
      {k: '可动边长度 L', v: f1(this.state.L) + ' cm', hi: true},
      {k: '表面张力系数 σ', v: f1(this.sigma()) + ' mN/m'},
      {k: '拉力 F = 2σL', v: f1(Fm) + ' mN', hi: true},
      {k: '液膜表面数', v: '2 个'},
      {k: '液体种类', v: ['水', '酒精', '肥皂水'][this.state.liq] + ' 液膜'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '可动边长度 L / cm', 4, 20, .5, s.L, v => f1(v), v => s.L = v);
    addSeg(el, ['水', '酒精', '肥皂水'], s.liq, i => s.liq = i);
    addToggle(el, '显示拉力方向', true, v => s.showF = v);
    addToggle(el, '自动收缩液膜', s.playing, v => s.playing = v);
    addBtn(el, '复位', () => { s.x = .8; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
