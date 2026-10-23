/* ============================================================
   必修第二册 · 第 7 章 万有引力与宇宙航行
   ============================================================ */
(function () {

const G = 6.67e-11;
const GM = 3.986e14;          // 地球引力常量 GM / (m³·s⁻²)
const RE = 6.371e6;           // 地球半径 / m
const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function f1(v) {
  return (Math.abs(v) < .05 ? 0 : v).toFixed(1).replace('-', '−');
}
function f2(v) {
  return (Math.abs(v) < .005 ? 0 : v).toFixed(2).replace('-', '−');
}
function sup(n) {
  const t = String(Math.abs(Math.round(n))).split('').map(c => SUP[+c]).join('');
  return (n < 0 ? '⁻' : '') + t;
}
function sci(v) {
  if (!isFinite(v) || v <= 0) return '0';
  const e = Math.floor(Math.log10(v));
  return (v / Math.pow(10, e)).toFixed(1) + '×10' + sup(e);
}
function kepler(M, e) {
  let E = M;
  for (let i = 0; i < 6; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}
function arcPts(c, r, a0, a1, n) {
  const out = [];
  n = n || 60;
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    out.push({x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a)});
  }
  return out;
}

function cross(c, r, color, a) {
  line({x: c.x - r, y: c.y}, {x: c.x + r, y: c.y}, color, {w: 1});
  line({x: c.x, y: c.y - r}, {x: c.x, y: c.y + r}, color, {w: 1.2});
}

/* ---------- 01 开普勒三定律 ---------- */
MODULES.push({
  key: 'kp-laws', tab: '01', name: '开普勒定律', en: "KEPLER'S LAWS", blurb: '椭圆 · 面积 · 周期',
  accent: '#9ad0ff', rgb: '154,208,255',
  hint: '改变偏心率与半长轴，观察面积速度与周期关系',
  playable: true,
  state: {t: 0, playing: true, e: .42, a: 2.1, showArea: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.e = .42; s.a = 2.1; s.showArea = true;
  },
  meta() {
    return {
      title: '开普勒三定律：椭圆、面积与周期',
      desc: '行星沿椭圆轨道绕太阳运行，太阳在椭圆的一个焦点上。离太阳近时运动快、远时运动慢，但相等时间内扫过的面积相等；轨道越大，公转周期越长。',
      formula: 'a<sup>3</sup>/T<sup>2</sup> = k<br>相同时间内扫过相同面积',
      note: '着色面积大小相等，但近日点附近弧长更长——所以那里<b>速度更大</b>。这就是"面积速度不变"。'
    };
  },
  au() { return this.state.a / 2.1; },
  period() { return Math.pow(this.au(), 1.5); },
  posM(M) {
    const s = this.state, e = s.e, a = s.a, b = a * Math.sqrt(1 - e * e);
    const E = kepler(((M % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), e);
    return {x: a * Math.cos(E), y: b * Math.sin(E), E: E};
  },
  draw(dt) {
    const s = this.state;
    const T = this.period();
    if (s.playing) s.t += dt * .34 / T;
    setFrame(.5, .5, 12.5);
    base();
    const e = s.e, a = s.a, b = a * Math.sqrt(1 - e * e);
    const sun = {x: a * e, y: 0};

    /* 椭圆轨道 */
    const orb = [];
    for (let i = 0; i <= 140; i++) orb.push(this.posM(Math.PI * 2 * i / 140));
    path(orb, 'rgba(154,208,255,.45)', {w: 1.6});

    /* 相等面积 */
    if (s.showArea) {
      const dM = .72;
      [-dM / 2, Math.PI - dM / 2].forEach((m0, i) => {
        const pts = [{x: sun.x, y: sun.y}];
        for (let k = 0; k <= 26; k++) pts.push(this.posM(m0 + dM * k / 26));
        pts.push(sun);
        path(pts, i ? 'rgba(255,143,163,.55)' : 'rgba(255,209,102,.55)',
          {fill: i ? 'rgba(255,143,163,.14)' : 'rgba(255,209,102,.14)', w: 1.2, close: true});
        sans(i ? '远日点附近' : '近日点附近', X(sun.x + (i ? 1.15 : -1.15)), Y(i ? -.85 : .85),
          i ? 'rgba(255,170,190,.8)' : 'rgba(255,215,150,.85)', 10.5);
      });
    }

    /* 太阳与行星 */
    circleAt(sun, .2, 'rgba(255,205,110,.85)', 'rgba(255,225,160,.9)', {w: 1.6});
    dot(sun, '#ffd166', 6);
    sans('太阳', X(sun.x), Y(.42), 'rgba(255,220,150,.9)', 10.5);

    const M = s.t * Math.PI * 2;
    const P = this.posM(M);
    line(sun, P, 'rgba(255,255,255,.22)', {w: 1.2, dash: [5, 5]});
    circleAt(P, .13, 'rgba(154,208,255,.9)', 'rgba(220,240,255,.9)', {w: 1.4});
    dot(P, '#bcdcff', 4);

    /* 近日点、远日点标注 */
    const per = this.posM(0), aph = this.posM(Math.PI);
    circleAt(per, .05, 'rgba(255,209,102,.9)', null, {w: 1});
    circleAt(aph, .05, 'rgba(255,143,163,.9)', null, {w: 1});
    sans('近日点', X(per.x) + 6, Y(per.y) + 22, 'rgba(255,215,150,.75)', 10, 'left');
    sans('远日点', X(aph.x) - 6, Y(aph.y) + 22, 'rgba(255,170,190,.75)', 10, 'right');

    sans('a = ' + f2(this.au()) + ' AU，T = ' + f2(T) + ' 年', X(-5.9), Y(3.5), 'rgba(190,220,245,.9)', 12, 'left');
    sans('T² / a³ = ' + f2(T * T / Math.pow(this.au(), 3)) + ' 年²/AU³', X(-5.9), Y(3.05), 'rgba(160,200,230,.75)', 11, 'left');
  },
  hud() {
    const s = this.state, T = this.period(), aAU = this.au();
    const vp = 2 * Math.PI * aAU / T * Math.sqrt((1 + s.e) / (1 - s.e));
    const va = 2 * Math.PI * aAU / T * Math.sqrt((1 - s.e) / (1 + s.e));
    return [
      {k: '半长轴 a', v: f2(aAU) + ' AU'},
      {k: '偏心率 e', v: f2(s.e)},
      {k: '公转周期 T', v: f2(T) + ' 年', hi: true},
      {k: '近日点速度', v: f2(vp) + ' AU/年', hi: true},
      {k: '远日点速度', v: f2(va) + ' AU/年'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '轨道偏心率 e', 0, .6, .02, s.e, v => f2(v), v => s.e = v);
    addSlider(el, '半长轴 a / AU', .7, 1.25, .05, this.au(), v => f2(v), v => s.a = v * 2.1);
    addToggle(el, '显示相等面积', s.showArea, v => s.showArea = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 万有引力定律 ---------- */
MODULES.push({
  key: 'grav-law', tab: '02', name: '万有引力', en: 'UNIVERSAL GRAVITY', blurb: '平方反比',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变质量与距离，看引力大小随距离平方减小',
  state: {m1: 20, m2: 30, r: 2.4, showCurve: true},
  reset() {
    const s = this.state;
    s.m1 = 20; s.m2 = 30; s.r = 2.4; s.showCurve = true;
  },
  meta() {
    return {
      title: '万有引力：与质量成正比，与距离平方成反比',
      desc: '任意两个物体之间都存在相互吸引的力，方向沿两者连线。质量越大引力越大，距离越远引力越小，而且随距离的平方迅速减小。两个力是一对作用力与反作用力。',
      formula: 'F = Gm<sub>1</sub>m<sub>2</sub>/r<sup>2</sup><br>G = 6.67×10<sup>−11</sup> N·m²/kg²',
      note: '两个箭头<b>等大反向</b>，分别作用在两个物体上。注意日常物体的引力极小，所以感觉不到。'
    };
  },
  F() { const s = this.state; return G * s.m1 * s.m2 / (s.r * s.r); },
  draw() {
    const s = this.state;
    setFrame(.5, .56, 12);
    base();
    const A = {x: -s.r / 2, y: .4}, B = {x: s.r / 2, y: .4};
    const F = this.F(), Fref = G * 50 * 50 / 1;
    const len = Math.max(.16, 1.75 * F / Fref);
    const ra = .22 + .1 * Math.pow(s.m1 / 50, 1 / 3), rb = .22 + .1 * Math.pow(s.m2 / 50, 1 / 3);

    /* 连线 */
    line({x: A.x, y: A.y}, {x: B.x, y: B.y}, 'rgba(255,255,255,.12)', {w: 1, dash: [5, 6]});

    /* 力 */
    arrow({x: A.x + ra, y: A.y}, {x: A.x + ra + len, y: A.y}, '#ff8fa3', {w: 2.8, head: 12, glow: 6});
    arrow({x: B.x - rb, y: B.y}, {x: B.x - rb - len, y: B.y}, '#6cb6ff', {w: 2.8, head: 12, glow: 6});
    sans('F', X(A.x + ra + len / 2), Y(A.y) - 16, '#ffb3c6', 12.5);
    sans('F', X(B.x - rb - len / 2), Y(B.y) - 16, '#a8d0ff', 12.5);

    /* 天体 */
    circleAt(A, ra, 'rgba(255,143,163,.85)', 'rgba(255,200,210,.9)', {w: 1.4});
    circleAt(B, rb, 'rgba(108,182,255,.85)', 'rgba(190,220,255,.9)', {w: 1.4});
    sans('m₁ = ' + f1(s.m1) + ' kg', X(A.x), Y(A.y - ra - .38), '#ffb3c6', 11.5);
    sans('m₂ = ' + f1(s.m2) + ' kg', X(B.x), Y(B.y - rb - .38), '#a8d0ff', 11.5);

    /* 距离标注 */
    line({x: A.x, y: -.35}, {x: B.x, y: -.35}, 'rgba(255,197,107,.55)', {w: 1.4});
    line({x: A.x, y: -.2}, {x: A.x, y: -.5}, 'rgba(255,197,107,.55)', {w: 1.4});
    line({x: B.x, y: -.2}, {x: B.x, y: -.5}, 'rgba(255,197,107,.55)', {w: 1.4});
    sans('r = ' + f1(s.r) + ' m', X(0), Y(-.75), 'rgba(255,215,150,.9)', 12);

    sans('F = ' + sci(F) + ' N', X(-5.6), Y(3.5), 'rgba(255,220,160,.95)', 13, 'left');
    sans('两力等大反向，是一对相互作用力', X(-5.6), Y(3.05), 'rgba(175,200,215,.75)', 11, 'left');

    /* F—r 曲线 */
    if (s.showCurve) {
      const bx0 = 2.5, bx1 = 5.7, by0 = 1.5, by1 = 3.4;
      rect({x: bx0, y: by0}, {x: bx1, y: by1}, 'rgba(8,14,24,.6)', 'rgba(200,222,232,.18)', {w: 1});
      const mx = r => bx0 + .5 + (r - 1) / 4 * (bx1 - bx0 - .8);
      const my = v => by0 + .3 + Math.min(1, v / Fref) * (by1 - by0 - .6);
      line({x: mx(1), y: my(0)}, {x: mx(5), y: my(0)}, 'rgba(200,222,232,.35)', {w: 1});
      line({x: mx(1), y: my(0)}, {x: mx(1), y: by1 - .15}, 'rgba(200,222,232,.35)', {w: 1});
      const pts = [];
      for (let r = 1; r <= 5.001; r += .05) pts.push({x: mx(r), y: my(G * s.m1 * s.m2 / (r * r))});
      path(pts, 'rgba(255,197,107,.9)', {w: 2, glow: 5});
      dot({x: mx(s.r), y: my(F)}, '#ffffff', 4);
      sans('F', X(bx0 + .2), Y(by1 - .3), 'rgba(200,222,232,.6)', 10);
      sans('r', X(bx1 - .25), Y(by0 + .05), 'rgba(200,222,232,.6)', 10);
      sans('F ∝ 1/r²', X((bx0 + bx1) / 2 + .3), Y(by1 - .1), 'rgba(255,215,150,.8)', 10.5);
    }
  },
  hud() {
    const s = this.state;
    return [
      {k: 'm₁', v: f1(s.m1) + ' kg'},
      {k: 'm₂', v: f1(s.m2) + ' kg'},
      {k: '距离 r', v: f1(s.r) + ' m', hi: true},
      {k: '万有引力 F', v: sci(this.F()) + ' N', hi: true},
      {k: '相对大小', v: f1(100 * this.F() / (G * 2500)) + ' %'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '质量 m₁ / kg', 5, 50, 1, s.m1, v => f1(v), v => s.m1 = v);
    addSlider(el, '质量 m₂ / kg', 5, 50, 1, s.m2, v => f1(v), v => s.m2 = v);
    addSlider(el, '距离 r / m', 1, 5, .1, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '显示 F—r 曲线', s.showCurve, v => s.showCurve = v);
  }
});

/* ---------- 03 卫星环绕与第一宇宙速度 ---------- */
MODULES.push({
  key: 'sat-orbit', tab: '03', name: '卫星环绕', en: 'ORBIT', blurb: 'v = √(GM/r)',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '拖动轨道半径，看卫星速度与周期怎样变化',
  playable: true,
  state: {t: 0, playing: true, r: 6.8, showV: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.r = 6.8; s.showV = true;
  },
  meta() {
    return {
      title: '卫星环绕：速度由轨道半径决定',
      desc: '卫星绕地球做匀速圆周运动，万有引力提供向心力，由此得到 v = √(GM/r)。轨道越高，速度越小、周期越长。贴着地面飞行的速度 7.9 km/s 就是第一宇宙速度。',
      formula: 'GMm/r<sup>2</sup> = mv<sup>2</sup>/r<br>v = √(GM/r)，T = 2πr/v',
      note: '轨道半径越大，卫星<b>越慢</b>。同步卫星要"停"在赤道上空，就必须在约 36000 km 的高度。'
    };
  },
  RM() { return this.state.r * 1e6; },
  v() { return Math.sqrt(GM / this.RM()); },
  Tmin() { return 2 * Math.PI * this.RM() / this.v() / 60; },
  draw(dt) {
    const s = this.state;
    const T = this.Tmin();
    if (s.playing) s.t += dt;
    setFrame(.5, .5, 13);
    base();
    const rw = 1.15 * (this.RM() / RE);
    const th = s.t * .85 * Math.pow(84.5 / T, .45);

    /* 地球 */
    circleAt({x: 0, y: 0}, 1.15, 'rgba(60,140,255,.22)', 'rgba(120,190,255,.65)', {w: 1.8});
    path(arcPts({x: 0, y: 0}, 1.15, .6, 2.2, 30), 'rgba(150,220,255,.35)', {w: 3});
    path(arcPts({x: 0, y: 0}, 1.15, 3.6, 4.4, 20), 'rgba(150,220,255,.28)', {w: 2.4});
    dot({x: 0, y: 0}, 'rgba(140,200,255,.5)', 3);

    /* 轨道 */
    circleAt({x: 0, y: 0}, rw, 'rgba(108,182,255,.10)', 'rgba(108,182,255,.45)', {w: 1.4, dash: [7, 6]});
    circleAt({x: 0, y: 0}, 1.15, null, 'rgba(160,220,255,.35)', {w: 1, dash: [3, 5]});

    const P = {x: rw * Math.cos(th), y: rw * Math.sin(th)};
    line({x: 0, y: 0}, P, 'rgba(255,255,255,.15)', {w: 1, dash: [4, 5]});

    if (s.showV) {
      const vlen = .85, dirx = -Math.sin(th), diry = Math.cos(th);
      arrow(P, {x: P.x + dirx * vlen, y: P.y + diry * vlen}, '#7be0c0', {w: 2.6, head: 11, glow: 6});
      sans('v', X(P.x + dirx * vlen) + 12, Y(P.y + diry * vlen) - 8, '#a9f0dd', 12, 'left');
      const glen = .62;
      arrow(P, {x: P.x - Math.cos(th) * glen, y: P.y - Math.sin(th) * glen}, '#ff8fa3', {w: 2, head: 9, dash: [5, 4]});
      sans('F万', X(P.x - Math.cos(th) * glen) - 14, Y(P.y - Math.sin(th) * glen) + 14, '#ffb3c6', 10.5, 'right');
    }
    circleAt(P, .085, 'rgba(180,220,255,.95)', 'rgba(255,255,255,.9)', {w: 1.2});

    sans('v = ' + f2(this.v() / 1000) + ' km/s', X(-5.9), Y(3.55), 'rgba(126,236,214,.95)', 12.5, 'left');
    sans('r = ' + f1(this.RM() / 1000) + ' km，T = ' + f1(T) + ' min', X(-5.9), Y(3.1), 'rgba(175,205,225,.8)', 11, 'left');
    sans('第一宇宙速度 7.9 km/s = 贴近地面飞行的速度', X(-5.9), Y(-3.55), 'rgba(150,185,205,.65)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '轨道半径 r', v: f1(this.RM() / 1000) + ' km', hi: true},
      {k: '离地高度 h', v: f1((this.RM() - RE) / 1000) + ' km'},
      {k: '线速度 v', v: f2(this.v() / 1000) + ' km/s', hi: true},
      {k: '运行周期 T', v: f1(this.Tmin()) + ' min'},
      {k: '向心加速度', v: f2(GM / (this.RM() * this.RM())) + ' m/s²'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '轨道半径 r / (10⁶ m)', 6.5, 26, .1, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '显示速度与引力', s.showV, v => s.showV = v);
    addBtn(el, '贴近地面（7.9 km/s）', () => { s.r = 6.5; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 同步卫星与变轨 ---------- */
MODULES.push({
  key: 'geo-transfer', tab: '04', name: '变轨', en: 'ORBIT TRANSFER', blurb: '加速 · 转移 · 同步',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '切换三条轨道，看卫星在不同轨道上的速度与周期',
  playable: true,
  state: {t: 0, playing: true, h: 36000, mode: 0},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.h = 36000; s.mode = 0;
  },
  meta() {
    return {
      title: '变轨：从近地轨道到同步轨道',
      desc: '卫星先在近地圆轨道运行，在合适的位置点火加速，进入椭圆转移轨道；到达远地点时再次加速，速度刚好满足同步轨道的要求，就成为与地球同步的卫星。',
      formula: 'r<sub>同步</sub> = 4.2×10<sup>7</sup> m<br>v<sub>同步</sub> = √(GM/r) ≈ 3.1 km/s',
      note: '两次点火都是<b>加速</b>，但进入更高轨道后速度反而更小——加速是为了把轨道"抬高"。'
    };
  },
  r1() { return RE + 300e3; },
  r2() { return RE + this.state.h * 1000; },
  rw() { return .95 * Math.sqrt(this.r1() / RE); },
  rw2() { return .95 * Math.sqrt(this.r2() / RE); },
  aMid() { return (this.r1() + this.r2()) / 2; },
  rr(k) { return .95 * Math.sqrt(k / RE); },
  draw(dt) {
    const s = this.state;
    setFrame(.5, .5, 12.5);
    base();
    const r1 = this.rw(), r2 = this.rw2(), am = (r1 + r2) / 2, cm = (r2 - r1) / 2;
    const bm = Math.sqrt(Math.max(.001, am * am - cm * cm));
    const T1 = 2 * Math.PI * this.r1() / Math.sqrt(GM / this.r1()) / 60;
    const Tm = 2 * Math.PI * this.aMid() / Math.sqrt(GM * (2 / this.r1() - 1 / this.aMid())) / 60;
    const T2 = 2 * Math.PI * this.r2() / Math.sqrt(GM / this.r2()) / 60;
    if (s.playing) s.t += dt;
    const spd = 2 * Math.PI * 1.1 * Math.pow(84.5 / (s.mode === 0 ? T1 : s.mode === 2 ? T2 : Tm), .6);

    /* 地球 */
    circleAt({x: 0, y: 0}, .95, 'rgba(60,140,255,.22)', 'rgba(120,190,255,.65)', {w: 1.8});
    path(arcPts({x: 0, y: 0}, .95, .5, 2.1, 24), 'rgba(150,220,255,.3)', {w: 2.6});
    path(arcPts({x: 0, y: 0}, .95, 3.5, 4.5, 20), 'rgba(150,220,255,.25)', {w: 2.2});
    sans('地球', X(0), Y(-.02), 'rgba(190,225,255,.7)', 10);

    /* 三条轨道 */
    circleAt({x: 0, y: 0}, r1, 'rgba(123,224,192,.05)', s.mode === 0 ? 'rgba(123,224,192,.85)' : 'rgba(123,224,192,.30)', {w: s.mode === 0 ? 2 : 1.2});
    circleAt({x: 0, y: 0}, r2, 'rgba(123,224,192,.04)', s.mode === 2 ? 'rgba(123,224,192,.85)' : 'rgba(123,224,192,.28)', {w: s.mode === 2 ? 2 : 1.2, dash: s.mode === 2 ? null : [6, 6]});
    const el = [];
    for (let i = 0; i <= 120; i++) {
      const E = Math.PI * 2 * i / 120;
      el.push({x: cm + am * Math.cos(E), y: bm * Math.sin(E)});
    }
    path(el, s.mode === 1 ? 'rgba(255,209,102,.9)' : 'rgba(255,209,102,.28)', {w: s.mode === 1 ? 2.2 : 1.2, dash: s.mode === 1 ? null : [6, 6]});

    /* 卫星位置 */
    let P, vnow, Tnow;
    if (s.mode === 0) {
      const th = s.t * spd;
      P = {x: r1 * Math.cos(th), y: r1 * Math.sin(th)};
      vnow = Math.sqrt(GM / this.r1()); Tnow = T1;
    } else if (s.mode === 2) {
      const th = s.t * spd;
      P = {x: r2 * Math.cos(th), y: r2 * Math.sin(th)};
      vnow = Math.sqrt(GM / this.r2()); Tnow = T2;
    } else {
      const Mm = s.t * spd;
      const E = kepler(((Mm % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), cm / am);
      P = {x: cm + am * Math.cos(E), y: bm * Math.sin(E)};
      const rr = Math.hypot(P.x, P.y) * RE / .95;
      vnow = Math.sqrt(GM * (2 / rr - 1 / this.aMid())); Tnow = Tm;
    }
    line({x: 0, y: 0}, P, 'rgba(255,255,255,.15)', {w: 1, dash: [4, 5]});
    circleAt(P, .085, 'rgba(190,255,235,.95)', 'rgba(255,255,255,.9)', {w: 1.2});

    /* 标注 */
    sans(['近地圆轨道', '椭圆转移轨道', '同步圆轨道'][s.mode], X(-5.9), Y(3.55), 'rgba(150,240,215,.95)', 12.5, 'left');
    sans('v = ' + f2(vnow / 1000) + ' km/s，T = ' + f1(Tnow) + ' min', X(-5.9), Y(3.1), 'rgba(175,210,230,.85)', 11, 'left');
    sans('h₂ = ' + (this.state.h / 1000).toFixed(0) + '×10³ km', X(-5.9), Y(2.65), 'rgba(160,195,215,.7)', 10.5, 'left');
    const near = {x: r1 * Math.cos(Math.PI), y: r1 * Math.sin(Math.PI)};
    circleAt(near, .05, 'rgba(255,255,255,.5)', null, {w: 1});
  },
  hud() {
    const s = this.state;
    const v1 = Math.sqrt(GM / this.r1()) / 1000, v2 = Math.sqrt(GM / this.r2()) / 1000;
    const T2 = 2 * Math.PI * this.r2() / Math.sqrt(GM / this.r2()) / 3600;
    return [
      {k: '同步轨道高度', v: (s.h / 1000).toFixed(0) + '×10³ km', hi: true},
      {k: '同步轨道速度', v: f2(v2) + ' km/s', hi: true},
      {k: '同步周期', v: f2(T2) + ' h'},
      {k: '近地轨道速度', v: f2(v1) + ' km/s'},
      {k: '第一次点火 Δv', v: f2((Math.sqrt(GM * (2 / this.r1() - 1 / this.aMid())) - Math.sqrt(GM / this.r1())) / 1000) + ' km/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['近地圆', '转移椭圆', '同步圆'], s.mode, i => { s.mode = i; s.t = 0; });
    addSlider(el, '同步轨道高度 / km', 33000, 38000, 200, s.h, v => (v / 1000).toFixed(0) + '×10³', v => { s.h = v; s.t = 0; });
    addToggle(el, '显示轨道标注', !!s.showTag, v => s.showTag = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 双星系统 ---------- */
MODULES.push({
  key: 'binary', tab: '05', name: '双星', en: 'BINARY STAR', blurb: '同一周期，共同质心',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变两颗星的质量，看它们的轨道半径与周期怎样变化',
  playable: true,
  state: {t: 0, playing: true, m1: 3, m2: 6, L: 1.4, showOrbit: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.m1 = 3; s.m2 = 6; s.L = 1.4; s.showOrbit = true;
  },
  meta() {
    return {
      title: '双星：同一周期，绕共同质心',
      desc: '两颗星相互吸引，绕连线上的某点做匀速圆周运动，这个点是它们共同的质心。它们周期相同、角速度相同，轨道半径与质量成反比，质量大的星半径小、走得更慢。',
      formula: 'm<sub>1</sub>ω<sup>2</sup>r<sub>1</sub> = m<sub>2</sub>ω<sup>2</sup>r<sub>2</sub><br>T = 2π√(L<sup>3</sup>/G(m<sub>1</sub>+m<sub>2</sub>))',
      note: '两者之间的万有引力大小相等，但质量大的星<b>半径更小</b>，所以由半径比可以直接读出质量比。'
    };
  },
  r1() { const s = this.state; return s.L * s.m2 / (s.m1 + s.m2); },
  r2() { const s = this.state; return s.L * s.m1 / (s.m1 + s.m2); },
  T() { const s = this.state; return Math.sqrt(Math.pow(s.L, 3) / (s.m1 + s.m2)); },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt * .5;
    setFrame(.5, .5, 12);
    base();
    const r1 = this.r1() * 2.2, r2 = this.r2() * 2.2;
    const T = this.T(), w = 2 * Math.PI / (T * 1.6);
    const th = s.t * w;

    if (s.showOrbit) {
      circleAt({x: 0, y: 0}, r1, 'rgba(255,143,163,.03)', 'rgba(255,143,163,.35)', {w: 1.2, dash: [5, 5]});
      circleAt({x: 0, y: 0}, r2, 'rgba(108,182,255,.03)', 'rgba(108,182,255,.35)', {w: 1.2, dash: [5, 5]});
    }
    cross({x: 0, y: 0}, .16, 'rgba(220,232,240,.6)');
    sans('质心', X(0), Y(0) + 30, 'rgba(200,215,230,.7)', 10.5);

    const A = {x: -r1 * Math.cos(th), y: -r1 * Math.sin(th)};
    const B = {x: r2 * Math.cos(th), y: r2 * Math.sin(th)};
    line(A, B, 'rgba(255,255,255,.16)', {w: 1, dash: [5, 5]});
    line({x: 0, y: 0}, A, 'rgba(255,143,163,.45)', {w: 1.4});
    line({x: 0, y: 0}, B, 'rgba(108,182,255,.45)', {w: 1.4});

    const ra = .16 + .06 * Math.pow(s.m1 / 10, 1 / 3), rb = .16 + .06 * Math.pow(s.m2 / 10, 1 / 3);
    const sc = .10;
    arrow(A, {x: A.x + Math.sin(th) * r1 * w * sc, y: A.y - Math.cos(th) * r1 * w * sc}, 'rgba(255,143,163,.9)', {w: 2.2, head: 9});
    arrow(B, {x: B.x - Math.sin(th) * r2 * w * sc, y: B.y + Math.cos(th) * r2 * w * sc}, 'rgba(108,182,255,.9)', {w: 2.2, head: 9});
    circleAt(A, ra, 'rgba(255,143,163,.9)', 'rgba(255,205,215,.9)', {w: 1.4});
    circleAt(B, rb, 'rgba(108,182,255,.9)', 'rgba(200,225,255,.9)', {w: 1.4});
    sans('m₁', X(A.x), Y(A.y - ra - .32), '#ffb3c6', 11.5);
    sans('m₂', X(B.x), Y(B.y - rb - .32), '#a8d0ff', 11.5);

    sans('r₁ : r₂ = ' + f2(this.r1() / this.r2()) + ' = m₂ : m₁', X(-5.9), Y(3.55), 'rgba(205,190,255,.95)', 12, 'left');
    sans('周期 T = ' + f2(T) + ' 年（两者相同）', X(-5.9), Y(3.1), 'rgba(185,175,235,.8)', 11, 'left');
  },
  hud() {
    const s = this.state, T = this.T();
    return [
      {k: 'm₁ : m₂', v: f1(s.m1) + ' : ' + f1(s.m2)},
      {k: '轨道半径 r₁', v: f2(this.r1()) + ' AU'},
      {k: '轨道半径 r₂', v: f2(this.r2()) + ' AU'},
      {k: '共同周期 T', v: f2(T) + ' 年', hi: true},
      {k: '线速度 v₁', v: f2(2 * Math.PI * this.r1() / T) + ' AU/年', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '星体质量 m₁ / M☉', 1, 10, .5, s.m1, v => f1(v), v => s.m1 = v);
    addSlider(el, '星体质量 m₂ / M☉', 1, 10, .5, s.m2, v => f1(v), v => s.m2 = v);
    addSlider(el, '两星间距 L / AU', .6, 1.8, .05, s.L, v => f2(v), v => s.L = v);
    addToggle(el, '显示轨道与质心', s.showOrbit, v => s.showOrbit = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
