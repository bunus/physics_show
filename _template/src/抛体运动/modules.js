/* ============================================================
   必修第二册 · 第 5 章 抛体运动
   ============================================================ */
(function () {

const g = 10;                        // 本章统一取 g = 10 m/s²

function f1(v) {
  return (Math.abs(v) < .05 ? 0 : v).toFixed(1).replace('-', '−');
}
function f2(v) {
  return (Math.abs(v) < .005 ? 0 : v).toFixed(2).replace('-', '−');
}

/* 左下原点式直角坐标轴 */
function axes(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(200,222,232,.35)', {w: 1.3});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(200,222,232,.35)', {w: 1.3});
  arrow({x: x1 - .5, y: y0}, {x: x1, y: y0}, 'rgba(200,222,232,.5)', {w: 1.1, head: 8});
  arrow({x: x0, y: y1 - .5}, {x: x0, y: y1}, 'rgba(200,222,232,.5)', {w: 1.1, head: 8});
  if (xlab) sans(xlab, X(x1) - 5, Y(y0) + 15, 'rgba(175,200,212,.8)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 9, Y(y1) + 10, 'rgba(175,200,212,.8)', 11, 'right');
}

/* 抛体小球 */
function ballAt(p, color, r) {
  circleAt(p, r || .2, 'rgba(9,16,26,.94)', color, {w: 2});
  dot(p, color, 3.2);
}

/* ---------- 01 平抛运动的分解 ---------- */
MODULES.push({
  key: 'pb-split', tab: '01', name: '平抛分解', en: 'HORIZONTAL THROW', blurb: '水平匀速＋自由落体',
  accent: '#ffa97a', rgb: '255,169,122',
  hint: '调初速度与抛出高度，看两个分运动怎样合成为曲线',
  playable: true,
  state: {t: 0, hold: 0, playing: true, v0: 6, h: 5, showV: true, showMark: true},
  reset() {
    const s = this.state;
    s.t = 0; s.hold = 0; s.playing = true; s.v0 = 6; s.h = 5; s.showV = true; s.showMark = true;
  },
  meta() {
    return {
      title: '平抛运动：水平匀速，竖直自由落体',
      desc: '小球从桌面水平抛出后只受重力。水平方向没有力，做匀速直线运动；竖直方向初速度为零，做自由落体运动。两个空心球是分运动的影子，它们的合运动就是这条曲线。',
      formula: 'x = v<sub>0</sub>t，y = ½gt<sup>2</sup><br>v<sub>x</sub> = v<sub>0</sub>，v<sub>y</sub> = gt',
      note: '看等时间间隔的点：<b>水平间隔相等</b>说明水平匀速；<b>竖直间隔越来越大</b>说明竖直在加速。'
    };
  },
  X0: -2.7,
  Tf() { return Math.sqrt(2 * this.state.h / g); },
  pos(t) {
    const s = this.state, q = Math.min(Math.max(t, 0), this.Tf());
    return {x: this.X0 + s.v0 * q, y: s.h - .5 * g * q * q};
  },
  draw(dt) {
    const s = this.state, Tf = this.Tf();
    if (s.playing) {
      if (s.t < Tf) s.t = Math.min(Tf, s.t + dt * .5);
      else { s.hold += dt; if (s.hold > .9) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.34, .78, 13);
    base();
    const L = lim();
    ground(0, 'rgba(150,190,205,.42)');

    /* 桌面 */
    rect({x: -4.25, y: s.h}, {x: this.X0 - .04, y: s.h - .2}, 'rgba(255,169,122,.10)', 'rgba(255,169,122,.45)', {w: 1.4});
    line({x: this.X0 - .72, y: s.h - .2}, {x: this.X0 - .72, y: 0}, 'rgba(255,169,122,.30)', {w: 1.3});
    line({x: this.X0 - 1.18, y: 0}, {x: this.X0 - 1.18, y: s.h + .2}, 'rgba(255,215,175,.18)', {w: 1, dash: [4, 5]});
    sans('v₀ 水平抛出', X(this.X0) - 12, Y(s.h + .42), 'rgba(255,196,156,.9)', 11.5, 'right');

    /* 完整轨迹 + 已走轨迹 */
    const full = [], done = [];
    for (let i = 0; i <= 70; i++) {
      const t = Tf * i / 70, q = this.pos(t);
      full.push(q);
      if (t <= s.t) done.push(q);
    }
    path(full, 'rgba(255,169,122,.28)', {w: 1.3, dash: [5, 6]});
    path(done, '#ffa97a', {w: 2.6, glow: 8});

    const P = this.pos(s.t);
    const Qx = {x: P.x, y: s.h}, Qy = {x: this.X0, y: P.y};

    /* 等时间间隔位置 */
    if (s.showMark) {
      for (let k = 0; k * .2 <= Tf + 1e-6; k++) {
        const q = this.pos(k * .2);
        dot(q, 'rgba(255,215,175,.7)', 2.5);
        line({x: q.x, y: 0}, {x: q.x, y: .15}, 'rgba(255,215,175,.30)', {w: 1});
        line({x: this.X0 - 1.18, y: q.y}, {x: this.X0 - 1.03, y: q.y}, 'rgba(255,215,175,.35)', {w: 1.2});
      }
    }

    /* 分运动影子 + 虚线 */
    line(Qx, P, 'rgba(255,255,255,.20)', {w: 1.1, dash: [4, 5]});
    line(Qy, P, 'rgba(255,255,255,.20)', {w: 1.1, dash: [4, 5]});
    circleAt(Qx, .13, 'rgba(255,255,255,.04)', 'rgba(255,215,175,.7)', {w: 1.4});
    circleAt(Qy, .13, 'rgba(255,255,255,.04)', 'rgba(120,200,255,.7)', {w: 1.4});
    sans('水平匀速', X(Qx.x) + 16, Y(Qx.y) - 12, 'rgba(255,215,175,.85)', 10.5, 'left');
    sans('自由落体', X(Qy.x) - 14, Y(Qy.y) + 18, 'rgba(140,205,255,.9)', 10.5, 'right');

    /* 速度分解 */
    if (s.showV) {
      const vy = g * s.t, sc = .15;
      arrow(P, {x: P.x + s.v0 * sc, y: P.y}, '#ffd166', {w: 2.4, head: 10});
      arrow(P, {x: P.x, y: P.y - vy * sc}, '#7fd1ff', {w: 2.4, head: 10});
      arrow(P, {x: P.x + s.v0 * sc, y: P.y - vy * sc}, '#ff8fa3', {w: 2.6, head: 12});
      sans('vx', X(P.x + s.v0 * sc) + 10, Y(P.y) - 12, '#ffe3a3', 11);
      sans('vy', X(P.x) - 14, Y(P.y - vy * sc) - 4, '#a9e2ff', 11, 'right');
      sans('v', X(P.x + s.v0 * sc) + 16, Y(P.y - vy * sc) + 14, '#ffb3c6', 11.5, 'left');
    }
    ballAt(P, '#ffa97a', .2);

    sans('t = ' + f2(s.t) + ' s', X(L.x0) + 16, Y(L.y1) + 18, 'rgba(190,214,224,.85)', 12, 'left');
    sans('下落高度 y = ' + f1(s.h - P.y) + ' m', X(L.x0) + 16, Y(L.y1) + 40, 'rgba(160,190,205,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, P = this.pos(s.t), vy = g * s.t;
    return [
      {k: '时间 t', v: f2(s.t) + ' s', hi: true},
      {k: '水平位移 x', v: f1(P.x - this.X0) + ' m', hi: true},
      {k: '下落高度 y', v: f1(s.h - P.y) + ' m'},
      {k: '水平速度 vx', v: f1(s.v0) + ' m/s'},
      {k: '竖直速度 vy', v: f1(vy) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 2, 10, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '抛出高度 h / m', 2, 5.4, .2, s.h, v => f1(v), v => { s.h = v; s.t = 0; });
    addToggle(el, '显示速度分解', s.showV, v => s.showV = v);
    addToggle(el, '显示等时间间隔的点', s.showMark, v => s.showMark = v);
    addBtn(el, '重新抛出', () => { s.t = 0; s.hold = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 平抛的落地时间 ---------- */
MODULES.push({
  key: 'pb-time', tab: '02', name: '落地时间', en: 'TIME OF FLIGHT', blurb: '同一高度同时落地',
  accent: '#ffd166', rgb: '255,209,102',
  hint: '改变高度，看三个不同初速度的小球是否同时落地',
  playable: true,
  state: {t: 0, hold: 0, playing: true, h: 5, showPath: true},
  reset() {
    const s = this.state;
    s.t = 0; s.hold = 0; s.playing = true; s.h = 5; s.showPath = true;
  },
  meta() {
    return {
      title: '落地时间只由高度决定',
      desc: '三个小球从同一高度同时水平抛出，初速度不同。它们的水平射程相差很大，但始终处在同一高度，最后同时落地——平抛的飞行时间只由下落高度决定。',
      formula: 't = √(2h/g)，x = v<sub>0</sub>√(2h/g)',
      note: '竖直方向的分运动与水平初速度无关。改变 h 看落地时间变化，改变 v₀ 则只改变射程。'
    };
  },
  X0: -3.2,
  vs: [4, 6.5, 9],
  cs: ['#ffd166', '#ff9f7a', '#6cb6ff'],
  Tf() { return Math.sqrt(2 * this.state.h / g); },
  pos(i, t) {
    const s = this.state, q = Math.min(Math.max(t, 0), this.Tf());
    return {x: this.X0 + this.vs[i] * q, y: s.h - .5 * g * q * q};
  },
  draw(dt) {
    const s = this.state, Tf = this.Tf();
    if (s.playing) {
      if (s.t < Tf) s.t = Math.min(Tf, s.t + dt * .55);
      else { s.hold += dt; if (s.hold > .8) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.32, .78, 14);
    base();
    const L = lim();
    ground(0, 'rgba(150,190,205,.42)');

    /* 发射平台 */
    rect({x: -4.3, y: s.h}, {x: this.X0 - .04, y: s.h - .2}, 'rgba(255,209,102,.08)', 'rgba(255,209,102,.35)', {w: 1.3});
    line({x: this.X0 - .85, y: s.h - .2}, {x: this.X0 - .85, y: 0}, 'rgba(255,209,102,.25)', {w: 1.2});
    sans('h = ' + f1(s.h) + ' m', X(this.X0 - .5), Y(s.h + .42), 'rgba(255,225,150,.9)', 11.5);

    /* 三条轨迹 */
    if (s.showPath) {
      for (let i = 0; i < 3; i++) {
        const pts = [];
        for (let k = 0; k <= 50; k++) pts.push(this.pos(i, Tf * k / 50));
        path(pts, this.cs[i], {w: 1.5, dash: [4, 5], alpha: .45});
      }
    }

    /* 同一时刻三球等高 */
    const ps = [];
    for (let i = 0; i < 3; i++) ps.push(this.pos(i, s.t));
    if (s.t < Tf - .02) line(ps[0], ps[2], 'rgba(255,255,255,.14)', {w: 1, dash: [5, 6]});

    /* 已走过的轨迹与小球 */
    for (let i = 0; i < 3; i++) {
      const done = [];
      for (let k = 0; k <= 50; k++) {
        const t = Tf * k / 50;
        if (t <= s.t) done.push(this.pos(i, t));
      }
      path(done, this.cs[i], {w: 2.2, glow: 6});
      ballAt(ps[i], this.cs[i], .17);
      const land = this.pos(i, Tf);
      circleAt(land, .1, 'rgba(255,255,255,.06)', this.cs[i], {w: 1.2});
    }

    /* 落点标注 */
    for (let i = 0; i < 3; i++) {
      const x = this.X0 + this.vs[i] * Tf;
      sans(f1(this.vs[i]) + ' m/s', X(x), Y(-.42), this.cs[i], 10.5);
      sans(f1(this.vs[i] * Tf) + ' m', X(x), Y(-.86), 'rgba(180,205,215,.65)', 10);
    }

    line({x: this.X0 - .35, y: 0}, {x: this.X0 - .35, y: s.h}, 'rgba(255,209,102,.3)', {w: 1, dash: [4, 4]});
    sans('t = ' + f2(s.t) + ' s', X(L.x1) - 18, Y(L.y1) + 22, 'rgba(200,220,228,.85)', 13, 'right');
    if (s.t > Tf - .02) sans('三球同时落地', X(L.x1) - 18, Y(L.y1) + 46, '#ffd166', 12, 'right');
  },
  hud() {
    const s = this.state, Tf = this.Tf();
    return [
      {k: '抛出高度 h', v: f1(s.h) + ' m'},
      {k: '飞行时间 t', v: f2(Tf) + ' s', hi: true},
      {k: '射程 · 4 m/s', v: f1(4 * Tf) + ' m'},
      {k: '射程 · 6.5 m/s', v: f1(6.5 * Tf) + ' m'},
      {k: '射程 · 9 m/s', v: f1(9 * Tf) + ' m', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '抛出高度 h / m', 2, 5.4, .2, s.h, v => f1(v), v => { s.h = v; s.t = 0; });
    addToggle(el, '显示完整轨迹', s.showPath, v => s.showPath = v);
    addBtn(el, '同时重新抛出', () => { s.t = 0; s.hold = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 斜抛运动 ---------- */
MODULES.push({
  key: 'pb-oblique', tab: '03', name: '斜抛运动', en: 'OBLIQUE THROW', blurb: '对称的抛物线',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '改变抛射角与初速度，看最高点与射程怎样变化',
  playable: true,
  state: {t: 0, hold: 0, playing: true, v0: 9, th: 45, showV: true},
  reset() {
    const s = this.state;
    s.t = 0; s.hold = 0; s.playing = true; s.v0 = 9; s.th = 45; s.showV = true;
  },
  meta() {
    return {
      title: '斜抛：两个分运动，一条对称抛物线',
      desc: '小球以一定角度斜向上抛出，水平方向匀速、竖直方向竖直上抛。轨迹是一条关于最高点对称的抛物线，最高点竖直分速度为零，落地时速度大小等于抛出速度。',
      formula: 'v<sub>x</sub> = v<sub>0</sub>cosθ，v<sub>y</sub> = v<sub>0</sub>sinθ − gt<br>T = 2v<sub>0</sub>sinθ/g',
      note: '升到最高点用时与落回地面用时相等，所以轨迹左右对称。改变抛射角，看射程与最大高度怎样此消彼长。'
    };
  },
  X0: -3.9,
  Tf() {
    const s = this.state, r = s.th * Math.PI / 180;
    return 2 * s.v0 * Math.sin(r) / g;
  },
  pos(t) {
    const s = this.state, r = s.th * Math.PI / 180;
    const q = Math.min(Math.max(t, 0), this.Tf());
    return {x: this.X0 + s.v0 * Math.cos(r) * q, y: s.v0 * Math.sin(r) * q - .5 * g * q * q};
  },
  draw(dt) {
    const s = this.state, r = s.th * Math.PI / 180, Tf = this.Tf();
    if (s.playing) {
      if (s.t < Tf) s.t = Math.min(Tf, s.t + dt * .55);
      else { s.hold += dt; if (s.hold > .8) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.36, .78, 14);
    base();
    const L = lim();
    ground(0, 'rgba(150,190,205,.42)');

    const xt = s.v0 * Math.cos(r), yt = s.v0 * Math.sin(r);
    const H = yt * yt / (2 * g), R = s.v0 * s.v0 * Math.sin(2 * r) / g;

    /* 完整轨迹 */
    const full = [], done = [];
    for (let i = 0; i <= 80; i++) {
      const t = Tf * i / 80, q = this.pos(t);
      full.push(q);
      if (t <= s.t) done.push(q);
    }
    path(full, 'rgba(123,224,192,.26)', {w: 1.3, dash: [5, 6]});
    path(done, '#7be0c0', {w: 2.6, glow: 8});

    /* 最高点与射程 */
    const apex = {x: this.X0 + R / 2, y: H};
    line({x: apex.x, y: 0}, apex, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
    line(this.pos(0), apex, 'rgba(255,255,255,.10)', {w: 1, dash: [4, 5]});
    circleAt(apex, .08, 'rgba(255,255,255,.5)', 'rgba(255,255,255,.25)', {w: 1});
    sans('H = ' + f2(H) + ' m', X(apex.x) + 10, Y(H) - 12, 'rgba(190,235,225,.85)', 10.5, 'left');

    /* 射程条 */
    line({x: this.X0, y: -.35}, {x: this.X0 + R, y: -.35}, 'rgba(255,209,102,.5)', {w: 1.4});
    line({x: this.X0, y: -.2}, {x: this.X0, y: -.5}, 'rgba(255,209,102,.5)', {w: 1.4});
    line({x: this.X0 + R, y: -.2}, {x: this.X0 + R, y: -.5}, 'rgba(255,209,102,.5)', {w: 1.4});
    sans('R = ' + f2(R) + ' m', X(this.X0 + R / 2), Y(-.75), 'rgba(255,215,150,.9)', 11.5);

    /* 抛出角 */
    angleArc({x: this.X0, y: 0}, 0, r, 34, 'rgba(255,255,255,.4)', '', 11);
    sans('θ = ' + f1(s.th) + '°', X(this.X0) + 56, Y(.0) + 18, 'rgba(215,230,235,.85)', 11);

    /* 速度分解 */
    const P = this.pos(s.t), vy = yt - g * s.t, sc = .14;
    if (s.showV) {
      arrow(P, {x: P.x + xt * sc, y: P.y}, '#ffd166', {w: 2.2, head: 9});
      arrow(P, {x: P.x, y: P.y + vy * sc}, '#7fd1ff', {w: 2.2, head: 9});
      arrow(P, {x: P.x, y: P.y}, {x: P.x + xt * sc, y: P.y + vy * sc}, '#ff8fa3', {w: 2.4, head: 11});
    }
    ballAt(P, '#7be0c0', .19);

    sans('抛出：v₀ = ' + f1(s.v0) + ' m/s，θ = ' + f1(s.th) + '°',
      X(L.x0) + 16, Y(L.y1) + 18, 'rgba(190,214,224,.85)', 12, 'left');
    sans('t = ' + f2(s.t) + ' s', X(L.x0) + 16, Y(L.y1) + 40, 'rgba(160,190,205,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, r = s.th * Math.PI / 180;
    const yt = s.v0 * Math.sin(r);
    return [
      {k: '抛射角 θ', v: f1(s.th) + '°'},
      {k: '初速度 v₀', v: f1(s.v0) + ' m/s'},
      {k: '最大高度 H', v: f2(yt * yt / (2 * g)) + ' m', hi: true},
      {k: '射程 R', v: f2(s.v0 * s.v0 * Math.sin(2 * r) / g) + ' m', hi: true},
      {k: '飞行时间 T', v: f2(2 * yt / g) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 5, 10, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '抛射角 θ / °', 15, 75, 1, s.th, v => f1(v), v => { s.th = v; s.t = 0; });
    addToggle(el, '显示速度分解', s.showV, v => s.showV = v);
    addBtn(el, '重新抛出', () => { s.t = 0; s.hold = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 速度方向与位移方向 ---------- */
MODULES.push({
  key: 'pb-dir', tab: '04', name: '速度方向', en: 'DIRECTION', blurb: 'tan α = 2 tan β',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变初速度与高度，比较速度偏角 α 与位移偏角 β',
  playable: true,
  state: {t: 0, hold: 0, playing: true, v0: 6, h: 4, showExt: true},
  reset() {
    const s = this.state;
    s.t = 0; s.hold = 0; s.playing = true; s.v0 = 6; s.h = 4; s.showExt = true;
  },
  meta() {
    return {
      title: '速度偏角与位移偏角的定量关系',
      desc: '平抛过程中，从抛出点指向小球的有向线段是位移，它的倾角记作 β；小球的速度方向与水平方向的夹角记作 α。任意时刻都满足 tanα = 2tanβ。',
      formula: 'tanα = v<sub>y</sub>/v<sub>x</sub> = gt/v<sub>0</sub><br>tanβ = y/x，tanα = 2tanβ',
      note: '把速度矢量反向延长，它一定交于水平位移的<b>中点</b>。这个结论常用来快速作出速度方向。'
    };
  },
  X0: -3.5,
  Tf() { return Math.sqrt(2 * this.state.h / g); },
  pos(t) {
    const s = this.state, q = Math.min(Math.max(t, 0), this.Tf());
    return {x: this.X0 + s.v0 * q, y: s.h - .5 * g * q * q};
  },
  draw(dt) {
    const s = this.state, Tf = this.Tf();
    if (s.playing) {
      if (s.t < Tf) s.t = Math.min(Tf, s.t + dt * .45);
      else { s.hold += dt; if (s.hold > 1.1) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.36, .76, 13.5);
    base();
    const L = lim();
    ground(0, 'rgba(150,190,205,.42)');

    const A = {x: this.X0, y: s.h}, P = this.pos(s.t);
    const vy = g * s.t;

    /* 轨迹 */
    const full = [], done = [];
    for (let i = 0; i <= 70; i++) {
      const t = Tf * i / 70, q = this.pos(t);
      full.push(q);
      if (t <= s.t) done.push(q);
    }
    path(full, 'rgba(180,156,255,.24)', {w: 1.3, dash: [5, 6]});
    path(done, 'rgba(180,156,255,.95)', {w: 2.4, glow: 7});

    /* 水平参考线 */
    line({x: A.x, y: A.y}, {x: L.x1 - .2, y: A.y}, 'rgba(255,255,255,.13)', {w: 1, dash: [5, 5]});
    line({x: P.x - 1.4, y: P.y}, {x: P.x + 1.4, y: P.y}, 'rgba(255,255,255,.13)', {w: 1, dash: [5, 5]});

    /* 位移矢量 */
    arrow(A, P, '#ffc56b', {w: 2.8, head: 12});
    sans('s', X((A.x + P.x) / 2) - 14, Y((A.y + P.y) / 2) + 6, '#ffe0a8', 15);

    /* 速度矢量 */
    const sc = .22;
    arrow(P, {x: P.x + s.v0 * sc, y: P.y - vy * sc}, '#6cb6ff', {w: 3, head: 13, glow: 6});
    sans('v', X(P.x + s.v0 * sc) + 12, Y(P.y - vy * sc) - 10, '#a8d0ff', 15, 'left');

    /* 两个偏角 */
    const aA = Math.atan2(P.y - A.y, P.x - A.x);
    const aV = Math.atan2(-vy, s.v0);
    angleArc(A, 0, aA, 50, 'rgba(255,199,107,.75)', 'β', 13);
    angleArc(P, 0, aV, 44, 'rgba(140,196,255,.85)', 'α', 13);

    /* 反向延长线交水平位移中点 */
    if (s.showExt && s.t > .12) {
      const xm = A.x + (P.x - A.x) / 2;
      line({x: A.x, y: 0}, {x: A.x, y: A.y}, 'rgba(255,255,255,.12)', {w: 1, dash: [4, 5]});
      line(P, {x: xm, y: A.y}, 'rgba(108,182,255,.55)', {w: 1.4, dash: [6, 5]});
      line({x: xm, y: A.y}, {x: xm, y: -.15}, 'rgba(255,199,107,.5)', {w: 1.4, dash: [4, 4]});
      circleAt({x: xm, y: A.y}, .07, 'rgba(255,199,107,.9)', 'rgba(255,199,107,.4)', {w: 1});
      sans('x/2', X(xm), Y(A.y) + 20, 'rgba(255,215,155,.9)', 11);
    }

    ballAt(P, '#ffa97a', .19);

    const ta = Math.tan(Math.abs(aV)), tb = P.x > A.x + .01 ? Math.abs((A.y - P.y) / (P.x - A.x)) : 0;
    sans('tanα = ' + f2(ta) + '，tanβ = ' + f2(tb) + '，比值 ' + (tb > .01 ? f1(ta / tb) : '—'),
      X(L.x0) + 16, Y(L.y1) + 18, 'rgba(200,220,230,.9)', 12, 'left');
    sans('t = ' + f2(s.t) + ' s', X(L.x0) + 16, Y(L.y1) + 40, 'rgba(160,190,205,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, P = this.pos(s.t);
    const A = {x: this.X0, y: s.h};
    const aV = Math.atan2(g * s.t, s.v0) * 180 / Math.PI;
    const aS = P.x > A.x + .01 ? Math.atan2(s.h - P.y, P.x - A.x) * 180 / Math.PI : 0;
    return [
      {k: '速度偏角 α', v: f1(aV) + '°', hi: true},
      {k: '位移偏角 β', v: f1(aS) + '°'},
      {k: '位移大小 s', v: f2(Math.hypot(P.x - A.x, P.y - A.y)) + ' m'},
      {k: 'tanα / tanβ', v: aS > 1 ? f2(Math.tan(aV * Math.PI / 180) / Math.tan(aS * Math.PI / 180)) : '2.00', hi: true},
      {k: '速度大小 v', v: f1(Math.hypot(s.v0, g * s.t)) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 2, 10, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '抛出高度 h / m', 2, 5, .2, s.h, v => f1(v), v => { s.h = v; s.t = 0; });
    addToggle(el, '显示速度反向延长线', s.showExt, v => s.showExt = v);
    addBtn(el, '重新抛出', () => { s.t = 0; s.hold = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 射程与落点 ---------- */
MODULES.push({
  key: 'pb-range', tab: '05', name: '射程', en: 'RANGE', blurb: '45° 射程最大',
  accent: '#ff8fa3', rgb: '255,143,163',
  hint: '拖动抛射角，比较 30°、45°、60° 三条轨迹的落点',
  playable: true,
  state: {t: 0, hold: 0, playing: true, v0: 9, th: 45, showCurve: true},
  reset() {
    const s = this.state;
    s.t = 0; s.hold = 0; s.playing = true; s.v0 = 9; s.th = 45; s.showCurve = true;
  },
  meta() {
    return {
      title: '抛射角 45° 时射程最大',
      desc: '同样大小的初速度，抛射角不同，落点也不同。30° 与 60° 两条轨迹落点重合，射程相等；45° 时射程达到最大值。右上角的曲线把射程随角度的变化完整画了出来。',
      formula: 'R = v<sub>0</sub><sup>2</sup>sin2θ / g<br>θ = 45° 时 R<sub>max</sub> = v<sub>0</sub><sup>2</sup>/g',
      note: '互补的两个抛射角（如 30° 与 60°）射程相同，但 60° 的轨迹更高、飞行时间更长。'
    };
  },
  X0: -4.0,
  Tf(th) {
    const s = this.state, r = th * Math.PI / 180;
    return 2 * s.v0 * Math.sin(r) / g;
  },
  pos(th, t) {
    const s = this.state, r = th * Math.PI / 180;
    const q = Math.min(Math.max(t, 0), this.Tf(th));
    return {x: this.X0 + s.v0 * Math.cos(r) * q, y: s.v0 * Math.sin(r) * q - .5 * g * q * q};
  },
  draw(dt) {
    const s = this.state, Tf = this.Tf(s.th);
    if (s.playing) {
      if (s.t < Tf) s.t = Math.min(Tf, s.t + dt * .55);
      else { s.hold += dt; if (s.hold > .7) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.34, .78, 14.5);
    base();
    const L = lim();
    ground(0, 'rgba(150,190,205,.42)');

    const Rmax = s.v0 * s.v0 / g;
    const comp = [30, 60];
    const cc = ['rgba(120,200,255,.42)', 'rgba(255,209,102,.42)'];

    /* 对比轨迹 */
    for (let i = 0; i < 2; i++) {
      const pts = [];
      for (let k = 0; k <= 50; k++) pts.push(this.pos(comp[i], this.Tf(comp[i]) * k / 50));
      path(pts, cc[i], {w: 1.5, dash: [5, 5]});
      const land = this.pos(comp[i], this.Tf(comp[i]));
      circleAt(land, .09, 'rgba(255,255,255,.5)', cc[i], {w: 1.2});
      sans(comp[i] + '°', X(land.x) + 4, Y(-.5) - (i ? 14 : 0), cc[i], 10.5);
    }

    /* 当前角度轨迹 */
    const full = [], done = [];
    for (let k = 0; k <= 80; k++) {
      const t = Tf * k / 80, q = this.pos(s.th, t);
      full.push(q);
      if (t <= s.t) done.push(q);
    }
    path(full, 'rgba(255,143,163,.22)', {w: 1.3, dash: [5, 6]});
    path(done, '#ff8fa3', {w: 2.6, glow: 8});

    const P = this.pos(s.th, s.t);
    angleArc({x: this.X0, y: 0}, 0, s.th * Math.PI / 180, 30, 'rgba(255,255,255,.35)', '', 10);
    sans(f1(s.th) + '°', X(this.X0) + 52, Y(.05) + 16, 'rgba(220,232,238,.85)', 11);

    /* 射程条 */
    const R = s.v0 * s.v0 * Math.sin(2 * s.th * Math.PI / 180) / g;
    line({x: this.X0, y: -.4}, {x: this.X0 + R, y: -.4}, 'rgba(255,143,163,.7)', {w: 2});
    line({x: this.X0, y: -.22}, {x: this.X0, y: -.58}, 'rgba(255,143,163,.7)', {w: 1.6});
    line({x: this.X0 + R, y: -.22}, {x: this.X0 + R, y: -.58}, 'rgba(255,143,163,.7)', {w: 1.6});
    sans('R = ' + f2(R) + ' m', X(this.X0 + R / 2), Y(-.92), 'rgba(255,180,196,.95)', 12);

    ballAt(P, '#ff8fa3', .19);

    /* 射程—角度曲线 */
    if (s.showCurve) {
      const bx0 = 3.3, bx1 = 5.9, by0 = 2.1, by1 = 5.5;
      rect({x: bx0, y: by0}, {x: bx1, y: by1}, 'rgba(8,14,24,.6)', 'rgba(200,222,232,.18)', {w: 1});
      const mx = a => bx0 + .45 + (a / 90) * (bx1 - bx0 - .7);
      const my = v => by0 + .35 + (v / (Rmax * 1.05)) * (by1 - by0 - .7);
      line({x: bx0 + .45, y: by0 + .35}, {x: bx1 - .2, y: by0 + .35}, 'rgba(200,222,232,.35)', {w: 1});
      line({x: bx0 + .45, y: by0 + .35}, {x: bx0 + .45, y: by1 - .2}, 'rgba(200,222,232,.35)', {w: 1});
      const cv2 = [];
      for (let a = 0; a <= 90; a += 2) cv2.push({x: mx(a), y: my(s.v0 * s.v0 * Math.sin(2 * a * Math.PI / 180) / g)});
      path(cv2, 'rgba(255,209,102,.9)', {w: 2, glow: 5});
      dot({x: mx(s.th), y: my(R)}, '#ffffff', 4);
      sans('45°', X(mx(45)), Y(by0 + .1), 'rgba(200,222,232,.6)', 10);
      sans('θ / °', X(bx1 - .3), Y(by0 + .1), 'rgba(200,222,232,.6)', 10, 'right');
      sans('R', X(bx0 + .1), Y(by1 - .35), 'rgba(200,222,232,.6)', 10);
      sans('射程随角度变化', X((bx0 + bx1) / 2), Y(by1 - .05), 'rgba(255,215,150,.8)', 10.5);
    }

    sans('t = ' + f2(s.t) + ' s', X(L.x0) + 16, Y(L.y1) + 18, 'rgba(190,214,224,.85)', 12, 'left');
  },
  hud() {
    const s = this.state, r = s.th * Math.PI / 180;
    const R = s.v0 * s.v0 * Math.sin(2 * r) / g, Rm = s.v0 * s.v0 / g;
    return [
      {k: '抛射角 θ', v: f1(s.th) + '°', hi: true},
      {k: '当前射程 R', v: f2(R) + ' m', hi: true},
      {k: '最大射程', v: f2(Rm) + ' m'},
      {k: '与最大之差', v: f2(Rm - R) + ' m'},
      {k: '飞行时间 T', v: f2(2 * s.v0 * Math.sin(r) / g) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '抛射角 θ / °', 10, 80, 1, s.th, v => f1(v), v => { s.th = v; s.t = 0; });
    addSlider(el, '初速度 v₀ / (m/s)', 5, 9.5, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addToggle(el, '显示射程—角度曲线', s.showCurve, v => s.showCurve = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
