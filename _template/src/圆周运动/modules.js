/* ============================================================
   必修第二册 · 第 6 章 圆周运动
   ============================================================ */
(function () {

const g = 10;

function f1(v) {
  return (Math.abs(v) < .05 ? 0 : v).toFixed(1).replace('-', '−');
}
function f2(v) {
  return (Math.abs(v) < .005 ? 0 : v).toFixed(2).replace('-', '−');
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
function ball2(p, color, r) {
  circleAt(p, r || .16, 'rgba(9,16,26,.94)', color, {w: 2});
  dot(p, color, 3);
}
function cross(c, r, color, a) {
  line({x: c.x - r, y: c.y}, {x: c.x + r, y: c.y}, color, {w: 1});
  line({x: c.x, y: c.y - r}, {x: c.x, y: c.y + r}, color, {w: 1});
}

/* ---------- 01 线速度与角速度 ---------- */
MODULES.push({
  key: 'cm-vw', tab: '01', name: '线速度与角速度', en: 'v AND ω', blurb: '转得一样快吗',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '改变角速度与半径，比较线速度 v = ωr',
  playable: true,
  state: {t: 0, playing: true, w: 1.2, r: 1.9, showV: true, showMark: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.w = 1.2; s.r = 1.9; s.showV = true; s.showMark = true;
  },
  meta() {
    return {
      title: '线速度与角速度：v = ωr',
      desc: '转盘上的红点随盘一起转动。转过的角度 Δθ 与所用时间之比叫角速度，走过的弧长 Δs 与时间之比叫线速度。半径越大，同样的角速度下线速度越大。',
      formula: 'v = ωr，ω = Δθ/Δt<br>T = 2π/ω，n = 1/T',
      note: '注意扫过的<b>角度</b>与走过的<b>弧长</b>同时增大：角度只与时间有关，弧长还要乘上半径。'
    };
  },
  C() { return {x: 0, y: .3}; },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt * .8;
    setFrame(.5, .5, 12);
    base();
    const C = this.C(), R = 2.55;
    const th = s.w * s.t;

    /* 转盘 */
    circleAt(C, R, 'rgba(123,224,192,.035)', 'rgba(123,224,192,.28)', {w: 1.5});
    for (let k = 0; k < 12; k++) {
      const a = th + k * Math.PI / 6;
      line(C, {x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a)}, 'rgba(123,224,192,.10)', {w: 1});
    }
    circleAt(C, .07, 'rgba(123,224,192,.5)', 'rgba(123,224,192,.7)', {w: 1.2});

    /* 扫过的弧与半径 */
    const P = {x: C.x + s.r * Math.cos(th), y: C.y + s.r * Math.sin(th)};
    path(arcPts(C, s.r, 0, Math.max(th % (Math.PI * 2), .001), 80), 'rgba(255,209,102,.55)', {w: 3.4, glow: 6});
    line(C, P, 'rgba(123,224,192,.55)', {w: 1.6});

    /* 等时间间隔的位置 */
    if (s.showMark) {
      for (let k = 1; k * .6 <= s.t; k++) {
        const a = s.w * k * .6;
        dot({x: C.x + s.r * Math.cos(a), y: C.y + s.r * Math.sin(a)}, 'rgba(255,255,255,.45)', 2.6);
      }
    }

    /* 速度矢量 */
    const v = s.w * s.r;
    if (s.showV) {
      const sc = .17;
      arrow(P, {x: P.x - Math.sin(th) * v * sc, y: P.y + Math.cos(th) * v * sc}, '#6cb6ff', {w: 2.8, head: 12, glow: 6});
      sans('v', X(P.x - Math.sin(th) * v * sc) + 14, Y(P.y + Math.cos(th) * v * sc) - 10, '#a8d0ff', 13, 'left');
    }
    ball2(P, '#ff8fa3', .17);

    /* 角度 */
    const aStart = 0;
    angleArc(C, aStart, th % (Math.PI * 2) || .001, 46, 'rgba(255,209,102,.6)', '', 11);
    sans('Δθ', X(C.x) + 62, Y(C.y) - 6, 'rgba(255,220,150,.9)', 11.5);
    sans('r = ' + f1(s.r) + ' m', X(C.x + s.r * .52), Y(C.y + s.r * .30), 'rgba(160,235,215,.85)', 11);

    sans('ω = ' + f1(s.w) + ' rad/s', X(-5.5), Y(3.5), 'rgba(190,240,225,.9)', 12.5, 'left');
    sans('v = ωr = ' + f2(v) + ' m/s', X(-5.5), Y(3.0), 'rgba(160,200,255,.9)', 12, 'left');
  },
  hud() {
    const s = this.state, v = s.w * s.r;
    return [
      {k: '角速度 ω', v: f2(s.w) + ' rad/s', hi: true},
      {k: '半径 r', v: f1(s.r) + ' m'},
      {k: '线速度 v', v: f2(v) + ' m/s', hi: true},
      {k: '周期 T', v: f2(2 * Math.PI / s.w) + ' s'},
      {k: '转速 n', v: f2(s.w / (2 * Math.PI)) + ' r/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '角速度 ω / (rad/s)', .4, 2.6, .05, s.w, v => f2(v), v => s.w = v);
    addSlider(el, '半径 r / m', .6, 2.4, .1, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '显示速度矢量', s.showV, v => s.showV = v);
    addToggle(el, '显示等时间间隔的位置', s.showMark, v => s.showMark = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 向心加速度 ---------- */
MODULES.push({
  key: 'cm-ac', tab: '02', name: '向心加速度', en: 'CENTRIPETAL', blurb: '速度方向一直在变',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '改变线速度与半径，看向心加速度 a = v²/r 的大小',
  playable: true,
  state: {t: 0, playing: true, v: 6, r: 1.9, showDv: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.v = 6; s.r = 1.9; s.showDv = true;
  },
  meta() {
    return {
      title: '匀速圆周运动也有加速度',
      desc: '速率不变，速度方向却时刻改变，所以存在加速度。这个加速度始终指向圆心，叫作向心加速度，大小与线速度的平方成正比、与半径成反比。',
      formula: 'a = v<sup>2</sup>/r = ω<sup>2</sup>r = 4π<sup>2</sup>r/T<sup>2</sup>',
      note: '因为速度方向不断改变，必有<b>指向圆心</b>的加速度；速率不变并不等于没有加速度。'
    };
  },
  C() { return {x: 0, y: .35}; },
  draw(dt) {
    const s = this.state, C = this.C();
    if (s.playing) s.t += dt * .8;
    setFrame(.5, .5, 12.5);
    base();
    const th = s.v / s.r * s.t;
    const a = s.v * s.v / s.r;

    circleAt(C, s.r, 'rgba(108,182,255,.02)', 'rgba(108,182,255,.30)', {w: 1.4, dash: [6, 6]});
    dot(C, 'rgba(160,200,255,.6)', 3.6);
    cross(C, .16, 'rgba(160,200,255,.5)');

    const P = {x: C.x + s.r * Math.cos(th), y: C.y + s.r * Math.sin(th)};
    line(C, P, 'rgba(255,255,255,.16)', {w: 1.1, dash: [5, 5]});
    path(arcPts(C, s.r, 0, Math.max(th % (Math.PI * 2), .001), 80), 'rgba(108,182,255,.30)', {w: 2});

    const sc = .12, asc = Math.min(1.9, a * .055);
    arrow(P, {x: P.x - Math.sin(th) * s.v * sc, y: P.y + Math.cos(th) * s.v * sc}, '#7be0c0', {w: 2.6, head: 11});
    sans('v', X(P.x - Math.sin(th) * s.v * sc) + 12, Y(P.y + Math.cos(th) * s.v * sc) - 8, '#a9f0dd', 12.5, 'left');
    arrow(P, {x: P.x - Math.cos(th) * asc, y: P.y - Math.sin(th) * asc}, '#ff8fa3', {w: 3, head: 12, glow: 7});
    sans('a', X(P.x) - Math.cos(th) * asc * 1.0 - 12 * Math.cos(th), Y(P.y) - Math.sin(th) * asc * 1.0 + 8, '#ffb3c6', 13);
    ball2(P, '#6cb6ff', .16);

    /* 速度变化量三角形 */
    if (s.showDv) {
      const O = {x: -4.4, y: -2.9}, d = .8;
      const t1 = th - d;
      const A1 = {x: O.x - Math.sin(t1) * s.v * sc, y: O.y + Math.cos(t1) * s.v * sc};
      const A2 = {x: O.x - Math.sin(th) * s.v * sc, y: O.y + Math.cos(th) * s.v * sc};
      arrow(O, A1, 'rgba(126,236,214,.40)', {w: 1.8, head: 9});
      arrow(O, A2, 'rgba(126,236,214,.9)', {w: 2.2, head: 10});
      arrow(A1, A2, '#ff8fa3', {w: 2.4, head: 10});
      sans('v1', X(A1.x) + 12, Y(A1.y) - 6, 'rgba(160,235,215,.8)', 10.5, 'left');
      sans('v2', X(A2.x) + 12, Y(A2.y) - 6, 'rgba(160,235,215,.95)', 10.5, 'left');
      sans('Δv', (X(A1.x) + X(A2.x)) / 2 + 14, (Y(A1.y) + Y(A2.y)) / 2 - 8, '#ffb3c6', 11.5, 'left');
      sans('速度矢量三角形', X(O.x) - 6, Y(O.y) - 150, 'rgba(150,195,220,.65)', 10.5, 'left');
    }

    sans('a = v²/r = ' + f1(a) + ' m/s²', X(-5.6), Y(3.5), 'rgba(255,179,198,.95)', 12.5, 'left');
    sans('v = ' + f1(s.v) + ' m/s，r = ' + f1(s.r) + ' m', X(-5.6), Y(3.0), 'rgba(170,210,235,.85)', 11.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '线速度 v', v: f1(s.v) + ' m/s', hi: true},
      {k: '半径 r', v: f1(s.r) + ' m'},
      {k: '向心加速度 a', v: f1(s.v * s.v / s.r) + ' m/s²', hi: true},
      {k: '角速度 ω', v: f2(s.v / s.r) + ' rad/s'},
      {k: '周期 T', v: f2(2 * Math.PI * s.r / s.v) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '线速度 v / (m/s)', 2, 10, .2, s.v, v => f1(v), v => s.v = v);
    addSlider(el, '半径 r / m', 1, 2.4, .1, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '显示速度变化量三角形', s.showDv, v => s.showDv = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 向心力：圆锥摆 ---------- */
MODULES.push({
  key: 'cm-conic', tab: '03', name: '向心力', en: 'CENTRIPETAL FORCE', blurb: '绳拉力的分力',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变摆长与摆角，看拉力的水平分力怎样提供向心力',
  playable: true,
  state: {t: 0, playing: true, L: 2.2, th: 35, showF: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.L = 2.2; s.th = 35; s.showF = true;
  },
  meta() {
    return {
      title: '圆锥摆：拉力的水平分力提供向心力',
      desc: '小球在水平面内做匀速圆周运动，悬点在上方。绳的拉力沿绳方向，它的竖直分力与重力平衡，水平分力指向圆心，正好提供向心力，因此摆角越大转速越快。',
      formula: 'F<sub>n</sub> = mg·tanθ = mω<sup>2</sup>r<br>r = L·sinθ，T = mg/cosθ',
      note: '竖直方向没有加速度，所以 <b>拉力竖直分力 = 重力</b>；水平分力才是向心力，方向指向圆心。'
    };
  },
  pivot() { return {x: 0, y: 3.25}; },
  geo() {
    const s = this.state, r = s.th * Math.PI / 180;
    return {rad: s.L * Math.sin(r), y: 3.25 - s.L * Math.cos(r), r: r};
  },
  draw(dt) {
    const s = this.state, G0 = this.geo();
    if (s.playing) s.t += dt * 1.1;
    setFrame(.5, .47, 12);
    base();
    const P = this.pivot(), m = .5;
    const ph = s.t * 1.6;
    const B = {x: G0.rad * Math.cos(ph), y: G0.y + G0.rad * .30 * Math.sin(ph)};
    const k = .30;

    /* 悬点与水平圆 */
    cross(P, .18, 'rgba(200,220,230,.6)');
    sans('O', X(P.x) + 16, Y(P.y) - 10, 'rgba(200,220,230,.75)', 11, 'left');
    path(arcPts({x: 0, y: G0.y}, G0.rad, 0, Math.PI * 2, 90).map(q => ({x: q.x, y: G0.y + (q.y - G0.y) * k})),
      'rgba(255,197,107,.30)', {w: 1.4, dash: [5, 5]});
    line({x: 0, y: P.y}, {x: 0, y: G0.y - G0.rad * k - .3}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});

    /* 绳与球 */
    line(P, B, 'rgba(230,240,245,.8)', {w: 1.8});
    line({x: 0, y: G0.y}, B, 'rgba(255,255,255,.12)', {w: 1, dash: [4, 4]});

    /* 受力 */
    if (s.showF) {
      const Fn = m * g * Math.tan(G0.r), Ft = m * g / Math.cos(G0.r), sc = .045;
      const frac = 1 - Math.min(.72, Ft * sc / s.L);
      arrow(B, {x: B.x, y: B.y - m * g * .10}, '#6cb6ff', {w: 2.4, head: 11});
      sans('mg', X(B.x) - 12, Y(B.y - m * g * .10) + 4, '#a8d0ff', 10.5, 'right');
      arrow(B, {x: B.x - Fn * sc, y: B.y}, '#ff8fa3', {w: 2.4, head: 11});
      sans('F向', X(B.x - Fn * sc), Y(B.y) + 18, '#ffb3c6', 10.5);
      arrow(B, {x: P.x + (B.x - P.x) * frac, y: B.y + (P.y - B.y) * frac}, '#ffd166', {w: 2.6, head: 11});
      sans('T', X(B.x) + (P.x - B.x) * .34 - 10, Y(B.y) + (P.y - B.y) * .34, '#ffe3a3', 12);
    }
    ball2(B, '#ff8fa3', .17);

    /* 角度与数据 */
    const a1 = Math.PI / 2;
    angleArc(P, a1, a1 - G0.r, 48, 'rgba(255,197,107,.65)', '', 11);
    sans('θ', X(P.x) + 54, Y(P.y) - 24, '#ffd166', 12.5, 'left');
    sans('L = ' + f1(s.L) + ' m', X((P.x + B.x) / 2) + 12, Y((P.y + B.y) / 2), 'rgba(220,232,238,.8)', 11, 'left');

    sans('圆锥摆：小球在水平面内做匀速圆周运动', X(-5.6), Y(3.6), 'rgba(255,214,150,.9)', 11.5, 'left');
  },
  hud() {
    const s = this.state, G0 = this.geo(), m = .5;
    const w = Math.sqrt(g / (s.L * Math.cos(G0.r)));
    return [
      {k: '摆角 θ', v: f1(s.th) + '°', hi: true},
      {k: '圆周半径 r', v: f2(G0.rad) + ' m'},
      {k: '线速度 v', v: f2(w * G0.rad) + ' m/s'},
      {k: '向心力 F', v: f2(m * g * Math.tan(G0.r)) + ' N', hi: true},
      {k: '绳拉力 T', v: f2(m * g / Math.cos(G0.r)) + ' N'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '摆长 L / m', 1.2, 2.8, .1, s.L, v => f1(v), v => s.L = v);
    addSlider(el, '摆角 θ / °', 15, 65, 1, s.th, v => f1(v), v => s.th = v);
    addToggle(el, '显示受力分析', s.showF, v => s.showF = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 皮带与齿轮传动 ---------- */
MODULES.push({
  key: 'cm-belt', tab: '04', name: '传动', en: 'DRIVE', blurb: '皮带 · 齿轮 · 同轴',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换传动方式，比较两轮的线速度与角速度',
  playable: true,
  state: {t: 0, playing: true, r1: 1.8, r2: 1.1, w1: 1.6, mode: 0},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.r1 = 1.8; s.r2 = 1.1; s.w1 = 1.6; s.mode = 0;
  },
  meta() {
    return {
      title: '皮带、齿轮与同轴传动',
      desc: '皮带传动的两轮边缘线速度相同；齿轮啮合同样是边缘线速度相同、转向相反；同轴转动的两轮角速度相同。抓住"什么量相同"就能算出另一个轮的角速度。',
      formula: '皮带 / 齿轮：ω<sub>1</sub>r<sub>1</sub> = ω<sub>2</sub>r<sub>2</sub><br>同轴：ω<sub>1</sub> = ω<sub>2</sub>',
      note: '先判断<b>什么量相等</b>：同一条皮带、相互啮合的齿轮边缘线速度相等；同一根轴上的轮子角速度相等。'
    };
  },
  centers() {
    const s = this.state;
    if (s.mode === 2) return [{x: 0, y: .4}, {x: 0, y: .4}];
    const d = s.mode === 1 ? s.r1 + s.r2 : 4.6;
    return [{x: -d / 2, y: .4}, {x: d / 2, y: .4}];
  },
  om2() {
    const s = this.state;
    if (s.mode === 2) return s.w1;
    return (s.mode === 1 ? -1 : 1) * s.w1 * s.r1 / s.r2;
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt * .7;
    setFrame(.5, .52, 12.5);
    base();
    const cs = this.centers(), A = cs[0], B = cs[1];
    const a1 = s.w1 * s.t, a2 = this.om2() * s.t;

    const wheel = (c, r, ang, color, teeth) => {
      circleAt(c, r, 'rgba(180,156,255,.05)', color, {w: 2});
      circleAt(c, r * .62, 'rgba(180,156,255,.03)', 'rgba(180,156,255,.18)', {w: 1});
      dot(c, 'rgba(200,185,255,.5)', 2.6);
      const n = teeth || 16;
      if (teeth) {
        for (let i = 0; i < n; i++) {
          const a = ang + i * Math.PI * 2 / n;
          line({x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r},
            {x: c.x + Math.cos(a) * (r + .14), y: c.y + Math.sin(a) * (r + .14)}, color, {w: 1.6});
        }
      }
      line(c, {x: c.x + Math.cos(ang) * r, y: c.y + Math.sin(ang) * r}, color, {w: 2.2});
      circleAt({x: c.x + Math.cos(ang) * r, y: c.y + Math.sin(ang) * r}, .075, color, color, {w: 1});
    };

    /* 皮带 */
    if (s.mode === 0) {
      const dx = B.x - A.x, d = Math.abs(dx);
      const cp = Math.min(1, Math.max(-1, (s.r1 - s.r2) / d));
      const psi = Math.acos(cp);
      const nT = {x: Math.cos(psi), y: Math.sin(psi)};
      const nB = {x: Math.cos(psi), y: -Math.sin(psi)};
      const p1 = {x: A.x + s.r1 * nT.x, y: A.y + s.r1 * nT.y};
      const p2 = {x: B.x + s.r2 * nT.x, y: B.y + s.r2 * nT.y};
      const q1 = {x: A.x + s.r1 * nB.x, y: A.y + s.r1 * nB.y};
      const q2 = {x: B.x + s.r2 * nB.x, y: B.y + s.r2 * nB.y};
      line(p1, p2, 'rgba(190,175,255,.75)', {w: 2});
      line(q1, q2, 'rgba(190,175,255,.75)', {w: 2});
      path(arcPts(A, s.r1, psi, Math.PI * 2 - psi, 50), 'rgba(190,175,255,.55)', {w: 2.2});
      path(arcPts(B, s.r2, -psi, psi, 50), 'rgba(190,175,255,.55)', {w: 2.2});
    }

    wheel(A, s.r1, a1, '#8fd8ff', s.mode === 1 ? 18 : 0);
    wheel(B, s.r2, a2, '#ffd166', s.mode === 1 ? 14 : 0);

    /* 标注 */
    sans('轮 1  r₁ = ' + f1(s.r1) + ' m', X(A.x), Y(A.y - s.r1 - .55), '#a8d8ff', 11.5);
    sans('轮 2  r₂ = ' + f1(s.r2) + ' m', X(B.x), Y(B.y - s.r2 - .55), '#ffe3a3', 11.5);
    line({x: A.x, y: A.y}, {x: A.x + s.r1 * .98, y: A.y}, 'rgba(143,216,255,.5)', {w: 1, dash: [4, 4]});
    line({x: B.x, y: B.y}, {x: B.x + s.r2 * .98, y: B.y}, 'rgba(255,209,102,.5)', {w: 1, dash: [4, 4]});

    const names = ['皮带传动：边缘线速度相同', '齿轮传动：边缘线速度相同、转向相反', '同轴传动：角速度相同'];
    sans(names[s.mode], X(-5.6), Y(3.6), 'rgba(205,190,255,.9)', 12, 'left');
    sans('v1 = v2 = ' + f2(s.w1 * s.r1) + ' m/s', X(-5.6), Y(3.1), 'rgba(170,210,235,.8)', 11.5, 'left');
    sans('ω1 = ' + f2(s.w1) + ' rad/s，ω2 = ' + f2(Math.abs(this.om2())) + ' rad/s',
      X(-5.6), Y(2.65), 'rgba(170,210,235,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, w2 = this.om2();
    return [
      {k: 'r₁ : r₂', v: f1(s.r1) + ' : ' + f1(s.r2), hi: true},
      {k: 'ω₁', v: f2(s.w1) + ' rad/s'},
      {k: 'ω₂', v: f2(Math.abs(w2)) + ' rad/s', hi: true},
      {k: '边缘线速度', v: f2(s.w1 * s.r1) + ' m/s'},
      {k: '转速 n₁', v: f2(s.w1 / (2 * Math.PI)) + ' r/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['皮带', '齿轮', '同轴'], s.mode, i => { s.mode = i; s.t = 0; });
    addSlider(el, '轮 1 半径 r₁ / m', 1, 2.1, .1, s.r1, v => f1(v), v => s.r1 = v);
    addSlider(el, '轮 2 半径 r₂ / m', .7, 1.8, .1, s.r2, v => f1(v), v => s.r2 = v);
    addSlider(el, '轮 1 角速度 ω₁ / (rad/s)', .6, 3, .1, s.w1, v => f1(v), v => s.w1 = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 竖直面内的圆周运动 ---------- */
MODULES.push({
  key: 'cm-vert', tab: '05', name: '竖直面圆周', en: 'VERTICAL LOOP', blurb: '最高点的临界速度',
  accent: '#ff8fab', rgb: '255,143,163',
  hint: '调节最低点速度与轨道半径，判断小球能否通过最高点',
  playable: true,
  state: {t: 0, playing: true, R: 1.8, vb: 8, rod: false, phi: 0, dir: 1, ph: 0, hold: 0, fly: null},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.R = 1.8; s.vb = 8; s.rod = false;
    s.phi = 0; s.dir = 1; s.ph = 0; s.hold = 0; s.fly = null;
  },
  meta() {
    return {
      title: '竖直面内过最高点的临界条件',
      desc: '小球在竖直圆轨道内侧运动。绳子只能拉不能推，过最高点时重力已指向圆心，速度太小球会脱离轨道；换成轻杆，杆可以支撑小球，速度再小也能通过。',
      formula: '绳：mg = mv<sup>2</sup>/R → v<sub>min</sub> = √(gR)<br>最低点 v<sub>底</sub> ≥ √(5gR)',
      note: '比较<b>绳（只能拉）</b>与<b>杆（可拉可压）</b>的临界条件：绳子要求最高点有足够速度，杆没有这个要求。'
    };
  },
  C() { return {x: 0, y: .5}; },
  vc() { return Math.sqrt(5 * g * this.state.R); },
  vGod() { return Math.sqrt(g * this.state.R); },
  vAt(phi) {
    const s = this.state;
    return Math.sqrt(Math.max(0, s.vb * s.vb - 2 * g * s.R * (1 - Math.cos(phi))));
  },
  slackPhi() {
    const s = this.state;
    const c = (2 * g * s.R - s.vb * s.vb) / (3 * g * s.R);
    return Math.acos(Math.min(1, Math.max(-1, c)));
  },
  posAt(phi) {
    const C = this.C(), R = this.state.R;
    return {x: C.x + R * Math.sin(phi), y: C.y - R * Math.cos(phi)};
  },
  flyPos() {
    const f = this.state.fly;
    return {x: f.p.x + f.v.x * f.t, y: f.p.y + f.v.y * f.t - .5 * g * f.t * f.t};
  },
  step(dt) {
    const s = this.state;
    if (!s.playing) return;
    if (s.ph === 0) {
      if (!s.rod && s.vb < this.vc() && s.dir > 0 && s.phi >= this.slackPhi() - .002) {
        const v = this.vAt(s.phi), p = this.posAt(s.phi);
        s.fly = {p: p, v: {x: v * Math.cos(s.phi), y: v * Math.sin(s.phi)}, t: 0};
        s.ph = 1;
        return;
      }
      const v = this.vAt(s.phi);
      if (v < .3 && Math.abs(Math.cos(s.phi)) < .999) {
        s.dir = -s.dir;
        s.phi += s.dir * .012;
      } else {
        s.phi += s.dir * v / s.R * dt * .72;
      }
      if (s.dir > 0 && s.phi > Math.PI * 2) s.phi -= Math.PI * 2;
      if (s.dir < 0 && s.phi < 0) s.phi += Math.PI * 2;
    } else if (s.ph === 1) {
      s.fly.t += dt * .72;
      const q = this.flyPos();
      if (q.y < -2.9 || s.fly.t > 2.6) { s.ph = 2; s.hold = 0; }
    } else {
      s.hold += dt;
      if (s.hold > 1) {
        s.phi = 0; s.dir = 1; s.ph = 0; s.fly = null; s.hold = 0;
      }
    }
  },
  draw(dt) {
    const s = this.state, C = this.C(), R = s.R, m = .5;
    this.step(dt);
    setFrame(.5, .5, 12);
    base();
    ground(-2.95, 'rgba(150,190,205,.35)');

    /* 轨道 */
    circleAt(C, R, 'rgba(255,143,163,.02)', 'rgba(255,143,163,.35)', {w: 2.2});
    circleAt(C, R * .97, null, 'rgba(255,143,163,.10)', {w: 1});
    dot(C, 'rgba(255,180,200,.55)', 3);

    const ph = s.ph === 0 ? s.phi : 0;
    const P = s.ph === 0 ? this.posAt(s.phi) : this.flyPos();
    const v = s.ph === 0 ? this.vAt(s.phi) : Math.hypot(s.fly.v.x, s.fly.v.y - g * s.fly.t);

    /* 绳 / 杆 */
    if (s.ph === 0) {
      line(C, P, s.rod ? 'rgba(200,220,230,.75)' : 'rgba(200,220,230,.55)', {w: s.rod ? 2.4 : 1.5});
    }
    /* 速度 */
    if (s.ph === 0) {
      const tx = Math.cos(s.phi) * s.dir, ty = Math.sin(s.phi) * s.dir, sc = .10;
      arrow(P, {x: P.x + tx * v * sc, y: P.y + ty * v * sc}, '#7be0c0', {w: 2.4, head: 10});
    } else {
      const f = s.fly, vx = f.v.x, vy = f.v.y - g * f.t, sc = .10;
      arrow(P, {x: P.x + vx * sc, y: P.y + vy * sc}, '#7be0c0', {w: 2.2, head: 9});
    }

    /* 受力 */
    if (s.ph === 0) {
      const T = m * (v * v / R + g * Math.cos(s.phi));
      const tl = Math.min(2.0, Math.abs(T) * .07);
      if (T > 0) {
        arrow(P, {x: P.x + (C.x - P.x) / R * tl, y: P.y + (C.y - P.y) / R * tl}, '#ffd166', {w: 2.2, head: 10});
      } else {
        arrow(P, {x: P.x - (C.x - P.x) / R * tl, y: P.y - (C.y - P.y) / R * tl}, '#8fd8ff', {w: 2.2, head: 10});
      }
      arrow(P, {x: P.x, y: P.y - .5}, '#6cb6ff', {w: 2, head: 9});
      sans('mg', X(P.x) - 12, Y(P.y - .5), '#a8d0ff', 10, 'right');
    }
    ball2(P, '#ff8fab', .17);

    /* 临界提示 */
    const vc = this.vc();
    sans('v底 = ' + f1(s.vb) + ' m/s，临界 √(5gR) = ' + f2(vc) + ' m/s',
      X(-5.7), Y(3.6), 'rgba(255,190,205,.95)', 11.5, 'left');
    if (!s.rod && s.vb < vc && s.ph >= 1) {
      sans('绳已松弛，小球做斜抛运动', X(-5.7), Y(3.15), 'rgba(255,209,102,.95)', 11.5, 'left');
    } else if (!s.rod && s.vb < vc) {
      sans('速度不足，无法通过最高点', X(-5.7), Y(3.15), 'rgba(255,209,102,.85)', 11, 'left');
    } else {
      sans(s.rod ? '轻杆：可以支撑，能通过最高点' : '速度足够，能通过最高点',
        X(-5.7), Y(3.15), 'rgba(160,235,215,.9)', 11, 'left');
    }
    sans('m = 0.5 kg，g = 10 m/s²', X(-5.7), Y(-3.4), 'rgba(150,180,195,.55)', 10, 'left');
  },
  hud() {
    const s = this.state, vc = this.vc();
    const vtop = Math.sqrt(Math.max(0, s.vb * s.vb - 4 * g * s.R));
    const Ttop = .5 * (vtop * vtop / s.R - g);
    return [
      {k: '最低点速度', v: f1(s.vb) + ' m/s', hi: true},
      {k: '临界速度 √(5gR)', v: f2(vc) + ' m/s', hi: true},
      {k: '最高点速度', v: s.vb >= vc ? f2(vtop) + ' m/s' : '不可达'},
      {k: '最高点拉力', v: s.vb >= vc ? f2(Ttop) + ' N' : '绳已松弛'},
      {k: '底部向心加速度', v: f2(s.vb * s.vb / s.R) + ' m/s²'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '最低点速度 v / (m/s)', 4, 12, .1, s.vb, v => f1(v), v => {
      s.vb = v; s.phi = 0; s.dir = 1; s.ph = 0; s.fly = null; s.hold = 0;
    });
    addSlider(el, '轨道半径 R / m', 1.2, 2.1, .1, s.R, v => f1(v), v => {
      s.R = v; s.phi = 0; s.dir = 1; s.ph = 0; s.fly = null; s.hold = 0;
    });
    addToggle(el, '杆模型（可支撑）', s.rod, v => {
      s.rod = v; s.phi = 0; s.dir = 1; s.ph = 0; s.fly = null; s.hold = 0;
    });
    addBtn(el, '重新开始', () => { s.phi = 0; s.dir = 1; s.ph = 0; s.fly = null; s.hold = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
