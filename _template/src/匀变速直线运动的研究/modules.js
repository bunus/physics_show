/* ============================================================
   必修第一册 · 第 2 章 匀变速直线运动的研究
   ============================================================ */
(function () {

function f1(v) {
  return (Math.abs(v) < 6e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .45, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .45}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 4, Y(y0) - 11, 'rgba(170,198,210,.85)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) - 14, 'rgba(170,198,210,.85)', 11, 'right');
}

function carShape(x, y, color, label) {
  rect({x: x - .6, y: y - .1}, {x: x + .6, y: y + .2}, 'rgba(11,24,38,.92)', color, {w: 1.6});
  poly([{x: x - .3, y: y + .2}, {x: x - .12, y: y + .4}, {x: x + .18, y: y + .4}, {x: x + .34, y: y + .2}],
    'rgba(255,255,255,.05)', color, {w: 1.1});
  circleAt({x: x - .33, y: y - .12}, .1, '#08111c', color, {w: 1.2});
  circleAt({x: x + .33, y: y - .12}, .1, '#08111c', color, {w: 1.2});
  if (label) sans(label, X(x), Y(y + .62), color, 11.5);
}

/* ---------- 01 v-t 图象与速度公式 ---------- */
MODULES.push({
  key: 'vt', tab: '01', name: '速度公式', en: 'VELOCITY & TIME', blurb: '斜率就是加速度',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '拖动直线上的点，改变观察时刻；调节 v₀ 与 a 看直线怎样倾斜',
  playable: true,
  state: {t: 0, playing: true, v0: 2, a: 1.6, showTri: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.v0 = 2; s.a = 1.6; s.showTri = true; },
  meta() {
    return {
      title: 'v-t 图线的斜率就是加速度',
      desc: '匀变速直线运动中，速度随时间均匀变化，v-t 图线是一条倾斜的直线。拖动图上的点，或调节初速度 v₀ 与加速度 a，比较直线的陡峭程度、速度读数与 Δv / Δt 的比值。',
      formula: 'v = v<sub>0</sub> + at，a = Δv / Δt',
      note: '直线的<b>斜率</b>等于加速度：线越陡，速度变化越快。a 与 v 同号时加速，异号时减速。'
    };
  },
  v(t) { return this.state.v0 + this.state.a * t; },
  x(t) { return this.state.v0 * t + .5 * this.state.a * t * t; },
  gx(t) { return -5.7 + t * 1.28; },
  gy(v) { return -2.8 + (v + 20) * .12; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 6) s.t = 0; }
    setFrame(.5, .54, 13.2);
    base();

    const x0 = this.gx(0), x1 = this.gx(6.4);
    axisBox(x0, x1, this.gy(-20), this.gy(26), 't / s', 'v / (m/s)');
    line({x: x0, y: this.gy(0)}, {x: x1, y: this.gy(0)}, 'rgba(198,222,232,.34)', {w: 1.2});

    for (let tt = 0; tt <= 6; tt++) {
      const wx = this.gx(tt);
      line({x: wx, y: this.gy(-20)}, {x: wx, y: this.gy(-20) - .09}, 'rgba(198,222,232,.42)', {w: 1});
      if (tt <= 5) sans(String(tt), X(wx), Y(this.gy(-20)) + 14, 'rgba(160,190,205,.72)', 10);
    }
    for (let vv = -20; vv <= 25; vv += 5) {
      const wy = this.gy(vv);
      line({x: x0 - .1, y: wy}, {x: x0, y: wy}, 'rgba(198,222,232,.38)', {w: 1});
      sans(String(vv), X(x0) - 8, Y(wy), 'rgba(160,190,205,.72)', 10, 'right');
    }

    let tEnd = 6;
    if (s.a < -.01) tEnd = Math.min(6, (-20 - s.v0) / s.a);
    if (s.a > .01) tEnd = Math.min(6, (26 - s.v0) / s.a);
    tEnd = Math.max(.4, tEnd);
    const pts = [];
    for (let tt = 0; tt <= tEnd + 1e-6; tt += .05) pts.push({x: this.gx(tt), y: this.gy(this.v(tt))});
    pts.push({x: this.gx(tEnd), y: this.gy(this.v(tEnd))});
    path(pts, 'rgba(108,182,255,.55)', {w: 1.4, dash: [5, 5]});

    const vv = this.v(s.t);
    const p = {x: this.gx(s.t), y: this.gy(clamp(vv, -20, 26))};
    line({x: x0, y: p.y}, p, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
    line({x: p.x, y: this.gy(-10)}, p, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});

    if (s.showTri && s.t > .9) {
      const t0 = s.t - 1;
      const p0 = {x: this.gx(t0), y: this.gy(this.v(t0))};
      const cor = {x: p.x, y: p0.y};
      line(p0, cor, 'rgba(255,197,107,.8)', {w: 1.8});
      line(cor, p, 'rgba(94,234,212,.8)', {w: 1.8});
      segMath(p0, cor, 'Δt = 1 s', 'rgba(255,210,140,.95)', .5, 14, 12);
      segMath(cor, p, 'Δv = ' + f1(s.a) + ' m/s', 'rgba(126,236,214,.95)', .5, 14, 12);
    }

    dot(p, '#fff6e2', 5.6);
    handle(p, '#6cb6ff', hoverId === 'pt');

    math('v = v₀ + at', X(3.0), Y(3.0), '#cfe8ff', 17, 'left');
    sans('v₀ = ' + f1(s.v0) + ' m/s', X(3.0), Y(2.3), '#9ecbff', 12.5, 'left');
    sans('a = ' + f1(s.a) + ' m/s²', X(3.0), Y(1.72), '#ffd79a', 12.5, 'left');
    sans('t = ' + f1(s.t) + ' s', X(3.0), Y(1.14), 'rgba(190,215,225,.88)', 12.5, 'left');
    sans('v = ' + f1(vv) + ' m/s', X(3.0), Y(.48), '#ffe6b8', 15, 'left');

    let st = 'a = 0：速度保持不变';
    if (s.a > .05) st = 'a > 0：每秒速度增加 ' + f1(s.a) + ' m/s';
    if (s.a < -.05) st = 'a < 0：每秒速度减小 ' + f1(-s.a) + ' m/s';
    sans(st, X(3.0), Y(-.35), 'rgba(180,205,215,.8)', 11.5, 'left');
    sans('图线越陡，速度变化越快', X(-5.7), Y(3.6), 'rgba(160,200,225,.72)', 11.5, 'left');
  },
  handles() {
    return [{id: 'pt', x: this.gx(this.state.t), y: this.gy(clamp(this.v(this.state.t), -20, 26))}];
  },
  drag(id, p) {
    const q = clampPt(p);
    this.state.t = clamp((q.x - this.gx(0)) / 1.28, 0, 6);
  },
  hud() {
    const s = this.state, v = this.v(s.t);
    return [
      {k: '时刻 t', v: f1(s.t) + ' s'},
      {k: '速度 v', v: f1(v) + ' m/s', hi: true},
      {k: '加速度 a', v: f1(s.a) + ' m/s²', hi: true},
      {k: '速度变化 Δv', v: f1(v - s.v0) + ' m/s'},
      {k: '位移 x', v: f1(this.x(s.t)) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 0, 6, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '加速度 a / (m/s²)', -3, 3, .5, s.a, v => f1(v), v => { s.a = v; s.t = 0; });
    addToggle(el, '显示 Δv / Δt 三角形', s.showTri, v => s.showTri = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '回到 t = 0', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 位移与时间的关系 ---------- */
MODULES.push({
  key: 'xof', tab: '02', name: '位移公式', en: 'DISPLACEMENT & TIME', blurb: '面积就是位移',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '看 v-t 图线与 t 轴围成的面积，与小车在地面上的位移对应',
  playable: true,
  state: {t: 0, playing: true, v0: 2, a: 1.2, showArea: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.v0 = 2; s.a = 1.2; s.showArea = true; },
  meta() {
    return {
      title: 'v-t 图线与 t 轴围成的面积等于位移',
      desc: '把匀速运动的矩形面积推广到匀变速运动：梯形面积就是位移，于是得到 x = v₀t + ½at²。调节初速度与加速度，对照图象面积、小车位置和公式计算结果。',
      formula: 'x = v<sub>0</sub>t + ½at<sup>2</sup>',
      note: '位移由<b>面积</b>累加而来，所以含 t² 项。t 轴下方的面积表示负位移（反向运动）。'
    };
  },
  v(t) { return this.state.v0 + this.state.a * t; },
  x(t) { return this.state.v0 * t + .5 * this.state.a * t * t; },
  gx(t) { return -5.5 + t * 1.38; },
  gy(v) { return -.2 + v * .27; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 5) s.t = 0; }
    setFrame(.5, .54, 13);
    base();

    const x0 = this.gx(0), x1 = this.gx(5.4);
    axisBox(x0, x1, this.gy(0), this.gy(12), 't / s', 'v / (m/s)');
    for (let tt = 1; tt <= 5; tt++) {
      const wx = this.gx(tt);
      line({x: wx, y: this.gy(0)}, {x: wx, y: this.gy(0) - .09}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(tt), X(wx), Y(this.gy(0)) + 14, 'rgba(160,190,205,.72)', 10);
    }
    for (let vv = 0; vv <= 12; vv += 3) {
      const wy = this.gy(vv);
      line({x: x0 - .1, y: wy}, {x: x0, y: wy}, 'rgba(198,222,232,.36)', {w: 1});
      sans(String(vv), X(x0) - 8, Y(wy), 'rgba(160,190,205,.72)', 10, 'right');
    }

    const full = [];
    for (let tt = 0; tt <= 5; tt += .05) full.push({x: this.gx(tt), y: this.gy(this.v(tt))});
    path(full, 'rgba(94,234,212,.35)', {w: 1.3, dash: [5, 5]});

    const area = [{x: x0, y: this.gy(0)}];
    for (let tt = 0; tt <= s.t; tt += .04) area.push({x: this.gx(tt), y: this.gy(this.v(tt))});
    area.push({x: this.gx(s.t), y: this.gy(0)});
    if (s.showArea) path(area, 'rgba(94,234,212,.85)', {w: 1.6, fill: 'rgba(94,234,212,.16)', close: true});

    const p = {x: this.gx(s.t), y: this.gy(this.v(s.t))};
    path(full.slice(0, Math.max(2, Math.round(s.t / 5 * 100) + 1)), 'rgba(94,234,212,.9)', {w: 2.4, glow: 7});
    line({x: x0, y: p.y}, p, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 4]});
    line({x: p.x, y: this.gy(0)}, p, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 4]});
    dot(p, '#eafff8', 5.4);

    const xm = this.x(s.t);
    if (s.showArea && xm > 1) {
      sans('面积 = x', X(this.gx(s.t * .45)), Y(this.gy(this.v(s.t * .45) * .45)), 'rgba(190,255,240,.95)', 12);
    }

    ground(-2.1, 'rgba(150,190,205,.5)');
    const carX = -5.4 + xm / 5;
    arrow({x: -5.4, y: -1.55}, {x: carX - .05, y: -1.55}, 'rgba(255,197,107,.7)', {w: 1.6, head: 9});
    carShape(carX, -2.1, '#5eead4', '');
    for (let d = 0; d <= 40; d += 10) {
      const wx = -5.4 + d / 5;
      line({x: wx, y: -2.1}, {x: wx, y: -2.32}, 'rgba(198,222,232,.35)', {w: 1});
      sans(d + ' m', X(wx), Y(-2.62), 'rgba(160,190,205,.65)', 9.5);
    }
    sans('x = ' + f1(xm) + ' m', X(carX), Y(-1.2), '#ffd79a', 12.5);

    math('x = v₀t + ½at²', X(2.4), Y(3.1), '#cfe8ff', 16, 'left');
    sans('v₀t = ' + f1(s.v0 * s.t) + ' m', X(2.4), Y(2.45), '#9ecbff', 12, 'left');
    sans('½at² = ' + f1(.5 * s.a * s.t * s.t) + ' m', X(2.4), Y(1.9), '#9ecbff', 12, 'left');
    sans('x = ' + f1(xm) + ' m', X(2.4), Y(1.28), '#ffe6b8', 14, 'left');
    sans('t = ' + f1(s.t) + ' s，v = ' + f1(this.v(s.t)) + ' m/s', X(2.4), Y(.62), 'rgba(190,215,225,.85)', 11.5, 'left');
    sans('梯形面积如何分成矩形与三角形？', X(2.4), Y(-.1), 'rgba(160,200,210,.72)', 11, 'left');
  },
  hud() {
    const s = this.state, v = this.v(s.t), x = this.x(s.t);
    return [
      {k: '时间 t', v: f1(s.t) + ' s'},
      {k: '速度 v', v: f1(v) + ' m/s', hi: true},
      {k: '位移 x', v: f1(x) + ' m', hi: true},
      {k: '加速度 a', v: f1(s.a) + ' m/s²'},
      {k: '面积值', v: f1(x) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 0, 4, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '加速度 a / (m/s²)', 0, 1.5, .1, s.a, v => f1(v), v => { s.a = v; s.t = 0; });
    addToggle(el, '显示面积（位移）', s.showArea, v => s.showArea = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '回到 t = 0', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 位移与速度的关系 ---------- */
MODULES.push({
  key: 'vx', tab: '03', name: '位移速度关系', en: 'VELOCITY & POSITION', blurb: '不含时间的公式',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '拖动曲线上的点，比较 v–x 曲线与 v²–x 直线的斜率',
  state: {xd: 12, v0: 2, a: 2.5, mode: 0, showMark: true},
  reset() { const s = this.state; s.xd = 12; s.v0 = 2; s.a = 2.5; s.mode = 0; s.showMark = true; },
  meta() {
    return {
      title: '不含时间的位移—速度关系',
      desc: '从 v = v₀ + at 与 x = v₀t + ½at² 中消去时间 t，得到 v² − v₀² = 2ax。把纵轴换成 v²，曲线就变成直线，斜率正好是 2a，处理制动距离一类问题很方便。',
      formula: 'v<sup>2</sup> − v<sub>0</sub><sup>2</sup> = 2ax',
      note: '公式不含 t，适合已知<b>位移与速度</b>而不关心过程的题目；刹车问题要先判断车是否已经停下。'
    };
  },
  v(x) { return Math.sqrt(Math.max(0, this.state.v0 * this.state.v0 + 2 * this.state.a * x)); },
  gx(x) { return -5.5 + x * .2; },
  gy(v) { return this.state.mode === 0 ? -2.5 + v * .35 : -2.5 + v * .024; },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 13);
    base();
    const x0 = this.gx(0), x1 = this.gx(42);
    axisBox(x0, x1, this.gy(0), this.gy(0) + (s.mode === 0 ? 5.1 : 5.2),
      'x / m', s.mode === 0 ? 'v / (m/s)' : 'v² / (m²·s⁻²)');

    for (let xx = 0; xx <= 40; xx += 10) {
      const wx = this.gx(xx);
      line({x: wx, y: this.gy(0)}, {x: wx, y: this.gy(0) - .09}, 'rgba(198,222,232,.38)', {w: 1});
      sans(String(xx), X(wx), Y(this.gy(0)) + 14, 'rgba(160,190,205,.7)', 10);
    }
    const vmax = this.v(40);
    if (s.mode === 0) {
      for (let vv = 0; vv <= 14; vv += 4) {
        const wy = this.gy(vv);
        line({x: x0 - .1, y: wy}, {x: x0, y: wy}, 'rgba(198,222,232,.34)', {w: 1});
        sans(String(vv), X(x0) - 8, Y(wy), 'rgba(160,190,205,.7)', 10, 'right');
      }
    } else {
      for (let q = 0; q <= 200; q += 50) {
        const wy = this.gy(q);
        line({x: x0 - .1, y: wy}, {x: x0, y: wy}, 'rgba(198,222,232,.34)', {w: 1});
        sans(String(q), X(x0) - 8, Y(wy), 'rgba(160,190,205,.7)', 10, 'right');
      }
    }

    const pts = [];
    for (let xx = 0; xx <= 40; xx += .5) {
      const v = this.v(xx);
      pts.push({x: this.gx(xx), y: this.gy(s.mode === 0 ? v : v * v)});
    }
    path(pts, 'rgba(180,156,255,.45)', {w: 1.4, dash: [5, 5]});

    const vv = this.v(s.xd), q = vv * vv;
    const p = {x: this.gx(s.xd), y: this.gy(s.mode === 0 ? vv : q)};
    const cur = pts.filter(o => o.x <= p.x);
    cur.push(p);
    path(cur, 'rgba(180,156,255,.95)', {w: 2.6, glow: 8});

    line({x: x0, y: p.y}, p, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 4]});
    line({x: p.x, y: this.gy(0)}, p, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 4]});
    dot(p, '#f2ecff', 5.6);
    handle(p, '#b49cff', hoverId === 'pt');

    if (s.showMark && s.mode === 1) {
      const pa = {x: x0, y: this.gy(s.v0 * s.v0)};
      const pb = {x: this.gx(40), y: this.gy(this.v(40) * this.v(40))};
      line(pa, pb, 'rgba(255,197,107,.8)', {w: 2});
      segMath(pa, pb, '斜率 = 2a', 'rgba(255,215,150,.95)', .55, 18, 13);
    }

    math(s.mode === 0 ? 'v² − v₀² = 2ax' : 'v² = v₀² + 2ax', X(2.9), Y(3.1), '#d9ceff', 16, 'left');
    sans('v₀ = ' + f1(s.v0) + ' m/s', X(2.9), Y(2.45), '#c7b6ff', 12, 'left');
    sans('a = ' + f1(s.a) + ' m/s²', X(2.9), Y(1.9), '#ffd79a', 12, 'left');
    sans('x = ' + f1(s.xd) + ' m', X(2.9), Y(1.35), 'rgba(205,225,235,.9)', 12, 'left');
    sans('v = ' + f2(vv) + ' m/s', X(2.9), Y(.78), '#eafff8', 14, 'left');
    sans('v² = ' + f2(q) + ' m²/s²', X(2.9), Y(.2), 'rgba(205,225,235,.9)', 12, 'left');
    sans('2ax = ' + f2(2 * s.a * s.xd) + ' m²/s²', X(2.9), Y(-.35), 'rgba(255,215,150,.9)', 12, 'left');
    sans('v² 与 x 成正比，图象是直线', X(2.9), Y(-1.05), 'rgba(160,200,210,.72)', 11, 'left');  },
  handles() {
    const s = this.state, v = this.v(s.xd);
    return [{id: 'pt', x: this.gx(s.xd), y: this.gy(s.mode === 0 ? v : v * v)}];
  },
  drag(id, p) {
    const q = clampPt(p);
    this.state.xd = clamp((q.x - this.gx(0)) / .2, 0, 40);
  },
  hud() {
    const s = this.state, v = this.v(s.xd), t = (v - s.v0) / Math.max(.01, s.a);
    return [
      {k: '位置 x', v: f1(s.xd) + ' m', hi: true},
      {k: '速度 v', v: f2(v) + ' m/s', hi: true},
      {k: 'v²', v: f2(v * v) + ' m²/s²'},
      {k: '2ax', v: f2(2 * s.a * s.xd) + ' m²/s²'},
      {k: '经历时间', v: f1(t) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['v–x 曲线', 'v²–x 直线'], s.mode, i => s.mode = i);
    addSlider(el, '初速度 v₀ / (m/s)', 0, 6, .5, s.v0, v => f1(v), v => s.v0 = v);
    addSlider(el, '加速度 a / (m/s²)', .5, 4, .5, s.a, v => f1(v), v => s.a = v);
    addToggle(el, '显示斜率标注', s.showMark, v => s.showMark = v);
    addBtn(el, '回到 x = 12 m', () => { s.xd = 12; }, 'ghost');
  }
});

/* ---------- 04 自由落体运动 ---------- */
MODULES.push({
  key: 'free', tab: '04', name: '自由落体', en: 'FREE FALL', blurb: 'g 下的匀加速',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '切换星球的重力加速度，比较下落快慢与落地速度',
  playable: true,
  state: {t: 0, playing: true, g: 9.8, h0: 20, showStrobe: true, showV: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.g = 9.8; s.h0 = 20; s.showStrobe = true; s.showV = true; },
  meta() {
    return {
      title: '自由落体是初速度为零的匀加速运动',
      desc: '忽略空气阻力，物体只在重力作用下下落，加速度为 g。改变 g 与下落高度，观察小球越落越快、相等时间内位移越来越大，同时对照右侧的 v-t 直线与落地速度。',
      formula: 'h = ½gt<sup>2</sup>，v = gt，v<sup>2</sup> = 2gh',
      note: '地球上 g ≈ 9.8 m/s²，月球约 1.6 m/s²。下落快慢<b>与质量无关</b>，只看 g 和高度。'
    };
  },
  te() { return Math.sqrt(2 * this.state.h0 / this.state.g); },
  hAt(t) { return .5 * this.state.g * Math.min(t, this.te()) * Math.min(t, this.te()); },
  vAt(t) { return this.state.g * Math.min(t, this.te()); },
  yOf(h) { return 2.9 - (h / this.state.h0) * 5.5; },
  draw(dt) {
    const s = this.state, te = this.te();
    if (s.playing) { s.t += dt; if (s.t > te + .8) s.t = 0; }
    setFrame(.5, .55, 13);
    base();
    ground(-2.6, 'rgba(150,190,205,.5)');

    const xr = -4.7;
    line({x: xr, y: -2.6}, {x: xr, y: 2.9}, 'rgba(198,222,232,.35)', {w: 1.2});
    for (let h = 0; h <= s.h0 + .01; h += 5) {
      const wy = this.yOf(h);
      line({x: xr - .12, y: wy}, {x: xr + .12, y: wy}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(h), X(xr - .3), Y(wy), 'rgba(160,190,205,.7)', 9.5, 'right');
    }
    sans('h / m', X(xr - .3), Y(3.15), 'rgba(170,198,210,.8)', 10.5, 'right');

    const h = this.hAt(s.t), v = this.vAt(s.t);
    const by = this.yOf(h), bx = -3.6;

    if (s.showStrobe) {
      const tmax = Math.min(s.t, te);
      for (let tt = 0; tt <= tmax; tt += .1) {
        const hy = this.yOf(.5 * s.g * tt * tt);
        dot({x: bx, y: hy}, 'rgba(255,197,107,' + (0.12 + .5 * tt / Math.max(.1, te)).toFixed(2) + ')', 2.4);
      }
    }

    circleAt({x: bx, y: by}, .22, '#ffc56b', 'rgba(255,236,200,.95)', {w: 1.3});
    if (s.showV && v > .05) {
      const vl = Math.min(2.2, v * .1, Math.max(.4, by + 3.3));
      arrow({x: bx + .5, y: by}, {x: bx + .5, y: by - vl}, '#ff8fab', {w: 2.6, head: 11});
      sans('v = ' + f1(v), X(bx + .72), Y(by - .45), '#ffb3c6', 11, 'left');
    }
    sans('h = ' + f1(h) + ' m', X(bx), Y(by + .45), '#ffe6b8', 12);

    const qx = tt => .8 + (tt / Math.max(.4, te)) * 4.6;
    const qy = vv => -2.3 + (vv / Math.max(1, s.g * te)) * 4.9;
    axisBox(qx(0), qx(te) + .3, -2.3, 2.65, 't / s', 'v / (m/s)');
    sans('0', X(qx(0)) - 6, Y(-2.3) + 14, 'rgba(160,190,205,.7)', 9.5, 'right');
    sans(f1(te), X(qx(te)), Y(-2.3) + 14, 'rgba(160,190,205,.7)', 9.5);
    sans(f1(s.g * te), X(qx(0)) + 5, Y(2.65) - 12, 'rgba(160,190,205,.7)', 9.5, 'left');
    const gl = [];
    for (let tt = 0; tt <= te; tt += te / 40) gl.push({x: qx(tt), y: qy(s.g * tt)});
    path(gl, 'rgba(255,197,107,.9)', {w: 2.2, glow: 6});
    const gp = {x: qx(Math.min(s.t, te)), y: qy(v)};
    dot(gp, '#fff6e2', 5);
    line({x: qx(0), y: gp.y}, gp, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 4]});

    math('h = ½gt²', X(-.5), Y(3.35), '#ffe6b8', 16, 'left');
    math('v = gt', X(2.2), Y(3.35), '#ffd0a0', 16, 'left');
    sans('t = ' + f1(Math.min(s.t, te)) + ' s，落地速度 ' + f1(s.g * te) + ' m/s',
      X(.2), Y(-2.85), 'rgba(190,215,225,.78)', 11, 'left');
    if (s.t >= te) sans('已落地', X(bx), Y(by - .55), '#ff9db8', 12);
  },
  hud() {
    const s = this.state, te = this.te(), v = this.vAt(s.t);
    return [
      {k: '下落时间 t', v: f1(Math.min(s.t, te)) + ' s'},
      {k: '下落高度 h', v: f1(this.hAt(s.t)) + ' m', hi: true},
      {k: '速度 v', v: f1(v) + ' m/s', hi: true},
      {k: '重力加速度 g', v: f1(s.g) + ' m/s²'},
      {k: '落地速度', v: f1(s.g * te) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '重力加速度 g / (m/s²)', 1.6, 12, .2, s.g, v => f1(v), v => { s.g = v; s.t = 0; });
    addSlider(el, '下落高度 h / m', 5, 30, 1, s.h0, v => f1(v), v => { s.h0 = v; s.t = 0; });
    addToggle(el, '显示频闪位置', s.showStrobe, v => s.showStrobe = v);
    addToggle(el, '显示速度矢量', s.showV, v => s.showV = v);
    addBtn(el, '重新下落', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 追及与相遇 ---------- */
MODULES.push({
  key: 'chase', tab: '05', name: '追及相遇', en: 'CHASE PROBLEM', blurb: '何时追上',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '调节前车速度与后车加速度，观察间距变化，判断能否追上',
  playable: true,
  state: {t: 0, playing: true, vA: 4, a: 2, d0: 8, showVec: true, showGap: true, hold: 0},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.vA = 4; s.a = 2; s.d0 = 8; s.showVec = true; s.showGap = true; s.hold = 0; },
  meta() {
    return {
      title: '追及问题：位移之差等于初始间距',
      desc: '前方汽车以 vA 匀速行驶，后方汽车从静止开始以 a 加速追赶。两车相遇时，后车位移比前车多出的部分正好等于初始间距。调节速度与加速度，观察间距先增大还是直接缩小。',
      formula: '½at<sup>2</sup> = d<sub>0</sub> + v<sub>A</sub>t',
      note: '后车速度小于前车时，间距仍在<b>增大</b>；速度相等时间距最大，之后才开始缩小。'
    };
  },
  tc() {
    const s = this.state;
    return (s.vA + Math.sqrt(s.vA * s.vA + 2 * s.a * s.d0)) / s.a;
  },
  xB(t) { return -5.4 + .5 * this.state.a * t * t / 8; },
  xA(t) { return -5.4 + this.state.d0 / 8 + this.state.vA * t / 8; },
  draw(dt) {
    const s = this.state, tc = this.tc();
    if (s.playing) {
      if (s.t < tc) s.t = Math.min(tc, s.t + dt * .85);
      else { s.hold += dt; if (s.hold > 1.1) { s.t = 0; s.hold = 0; } }
    }
    setFrame(.5, .55, 13);
    base();

    rect({x: -5.8, y: -.5}, {x: 5.9, y: .9}, 'rgba(255,255,255,.03)', 'rgba(170,205,220,.18)', {w: 1});
    line({x: -5.8, y: .2}, {x: 5.9, y: .2}, 'rgba(200,228,236,.3)', {w: 1.4, dash: [10, 10]});

    const pa = this.xA(s.t), pb = this.xB(s.t);
    carShape(pa, .78, '#ff8fab', 'A 车（匀速）');
    carShape(pb, -.36, '#5eead4', 'B 车（加速）');

    if (s.showVec) {
      arrow({x: pa + .7, y: .78}, {x: pa + .7 + s.vA * .16, y: .78}, '#ff8fab', {w: 2.2, head: 10});
      sans('v_A = ' + f1(s.vA), X(pa + .8), Y(1.06), '#ffb3c6', 10.5, 'left');
      const vb = Math.min(s.a * s.t, s.a * tc);
      arrow({x: pb + .7, y: -.36}, {x: pb + .7 + vb * .16, y: -.36}, '#5eead4', {w: 2.2, head: 10});
      sans('v_B = ' + f1(vb), X(pb + .8), Y(-.64), '#8fe9d8', 10.5, 'left');
    }

    if (s.showGap) {
      const gy0 = 1.75;
      line({x: pa, y: .78}, {x: pa, y: gy0}, 'rgba(255,143,171,.5)', {w: 1.2, dash: [4, 4]});
      line({x: pb, y: -.36}, {x: pb, y: gy0}, 'rgba(94,234,212,.5)', {w: 1.2, dash: [4, 4]});
      if (pa - pb > .25) {
        arrow({x: pb, y: gy0}, {x: pa, y: gy0}, 'rgba(255,214,150,.85)', {w: 1.6, head: 8});
        arrow({x: pa, y: gy0}, {x: pb, y: gy0}, 'rgba(255,214,150,.85)', {w: 1.6, head: 8});
        sans('间距 ' + f1(Math.max(0, s.d0 + s.vA * s.t - .5 * s.a * s.t * s.t)) + ' m',
          X((pa + pb) / 2), Y(gy0 + .3), '#ffe0a8', 12);
      } else {
        sans('相遇！', X(pa), Y(gy0 + .3), '#fff1cf', 13);
      }
    }

    const mx = this.xA(tc);
    line({x: mx, y: -1.1}, {x: mx, y: 1.9}, 'rgba(255,255,255,.14)', {w: 1, dash: [3, 5]});
    sans('相遇位置', X(mx), Y(-1.32), 'rgba(200,220,230,.6)', 10);

    math('½at² = d₀ + v_A·t', X(-5.6), Y(-2.05), '#d8f5ee', 15, 'left');
    sans('d₀ = ' + f1(s.d0) + ' m，追及时刻 t = ' + f2(tc) + ' s', X(-5.6), Y(-2.62), 'rgba(190,215,225,.85)', 11.5, 'left');
    const gap = s.d0 + s.vA * s.t - .5 * s.a * s.t * s.t;
    sans('当前间距 ' + f1(Math.max(0, gap)) + ' m，后车还需追 ' + f1(Math.max(0, gap)) + ' m',
      X(-5.6), Y(-3.0), 'rgba(160,200,210,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, tc = this.tc(), vb = Math.min(s.a * s.t, s.a * tc);
    const gap = Math.max(0, s.d0 + s.vA * s.t - .5 * s.a * s.t * s.t);
    return [
      {k: '时间 t', v: f1(s.t) + ' s'},
      {k: 'B 车速度', v: f1(vb) + ' m/s', hi: true},
      {k: '两车间距', v: f1(gap) + ' m', hi: true},
      {k: 'A 车速度', v: f1(s.vA) + ' m/s'},
      {k: '追及时刻', v: f1(tc) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '前车速度 v_A / (m/s)', 2, 5, .5, s.vA, v => f1(v), v => { s.vA = v; s.t = 0; s.hold = 0; });
    addSlider(el, '后车加速度 a / (m/s²)', 1, 3, .25, s.a, v => f1(v), v => { s.a = v; s.t = 0; s.hold = 0; });
    addSlider(el, '初始间距 d₀ / m', 4, 12, 1, s.d0, v => f1(v), v => { s.d0 = v; s.t = 0; s.hold = 0; });
    addToggle(el, '显示速度矢量', s.showVec, v => s.showVec = v);
    addToggle(el, '显示间距标注', s.showGap, v => s.showGap = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
