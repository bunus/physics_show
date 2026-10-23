/* ============================================================
   必修第一册 · 第 1 章 运动的描述
   ============================================================ */
(function () {

const SUB = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];

function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function f1(v) {
  const s = (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
  return s;
}

function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .45, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .45}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 4, Y(y0) + 15, 'rgba(170,198,210,.85)', 11.5, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) + 12, 'rgba(170,198,210,.85)', 11.5, 'right');
}

function carShape(x, y, color, label) {
  rect({x: x - .66, y: y - .13}, {x: x + .66, y: y + .2}, 'rgba(11,24,38,.92)', color, {w: 1.7});
  poly([{x: x - .34, y: y + .2}, {x: x - .14, y: y + .43}, {x: x + .2, y: y + .43}, {x: x + .4, y: y + .2}],
    'rgba(255,255,255,.05)', color, {w: 1.2});
  circleAt({x: x - .38, y: y - .14}, .11, '#08111c', color, {w: 1.3});
  circleAt({x: x + .38, y: y - .14}, .11, '#08111c', color, {w: 1.3});
  if (label) sans(label, X(x), Y(y + .66), color, 11.5);
}

function roadBand(x0, x1, y, off) {
  rect({x: x0, y: y - .22}, {x: x1, y: y - .02}, 'rgba(255,255,255,.035)', 'rgba(170,205,220,.16)', {w: 1});
  ctx.save();
  ctx.strokeStyle = 'rgba(200,228,236,.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 11]);
  ctx.beginPath();
  ctx.moveTo(X(x0), Y(y - .12));
  ctx.lineTo(X(x1), Y(y - .12));
  ctx.stroke();
  ctx.restore();
  for (let k = 0; k < 40; k++) {
    const wx = x0 + ((k * 1.1 - (off || 0)) % 12 + 12) % 12;
    line({x: wx, y: y - .22}, {x: wx, y: y - .02}, 'rgba(200,228,236,.22)', {w: 1});
  }
}

/* ---------- 01 参考系与相对运动 ---------- */
MODULES.push({
  key: 'frame', tab: '01', name: '参考系', en: 'REFERENCE FRAME', blurb: '谁在动，谁在静',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '拖动任一车辆，或切换参考系观察运动描述的变化',
  playable: true,
  state: {t: 0, playing: true, ref: 0, va: 0, vB: -3, xa: -4, xb: 4},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.ref = 0; s.va = 0; s.vB = -3; s.xa = -4; s.xb = 4;
  },
  meta() {
    return {
      title: '选谁做参考系，运动就长什么样',
      desc: '同一辆车，以地面为参考系可能是静止的，以另一辆车为参考系却在运动。切换参考系，观察两车的位置、间距与相对速度怎样随视角改变；拖动车辆还可以改变它们的初始位置。',
      formula: 'v<sub>BA</sub> = v<sub>B</sub> − v<sub>A</sub>',
      note: '参考系是描述运动的前提：<b>选谁做参照，谁就被看作静止</b>。两车的相对速度等于速度之差，与选地面还是选车无关。'
    };
  },
  pos() {
    const s = this.state;
    return {a: s.xa + s.va * s.t, b: s.xb + s.vB * s.t};
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      if (s.t > 4.4) s.t = 0;
    }
    setFrame(.5, .56, 15);
    base();
    const p = this.pos();
    const anchor = s.ref === 1 ? p.a : s.ref === 2 ? p.b : 0;
    const off = anchor * 2.1;
    const L = lim();

    const shift = s.ref === 1 ? -(p.a - s.xa) : s.ref === 2 ? -(p.b - s.xb) : 0;
    roadBand(L.x0, L.x1, 0, shift % 1.1);

    const ax = p.a - anchor + (s.ref === 1 ? 0 : 0);
    const bx = p.b - anchor;

    if (s.ref === 0) {
      const guardL = L.x0 + .3, guardR = L.x1 - .3;
      if (ax > guardL && ax < guardR) carShape(ax, .1, '#ffc56b', 'A 车');
      if (bx > guardL && bx < guardR) carShape(bx, .1, '#6cb6ff', 'B 车');
    } else if (s.ref === 1) {
      carShape(0, .1, '#ffc56b', 'A 车（参考系）');
      if (bx > L.x0 + .3 && bx < L.x1 - .3) carShape(bx, .1, '#6cb6ff', 'B 车');
    } else {
      carShape(0, .1, '#6cb6ff', 'B 车（参考系）');
      if (ax > L.x0 + .3 && ax < L.x1 - .3) carShape(ax, .1, '#ffc56b', 'A 车');
    }

    const arrowY = 1.5;
    if (s.ref === 0) {
      if (Math.abs(s.vB) > .05) {
        arrow({x: p.b - .9, y: arrowY}, {x: p.b + (s.vB > 0 ? 1.3 : -1.3), y: arrowY}, '#6cb6ff', {w: 2.4, head: 12});
        sans('v_B = 3 m/s', X(p.b), Y(arrowY) - 16, '#9ecbff', 11.5);
      }
    } else {
      const rel = s.ref === 1 ? s.vB - s.va : s.va - s.vB;
      const c = s.ref === 1 ? '#6cb6ff' : '#ffc56b';
      arrow({x: -.9, y: arrowY}, {x: (rel > 0 ? 1.3 : -1.3), y: arrowY}, c, {w: 2.4, head: 12});
      sans('相对速度 ' + f1(Math.abs(rel)) + ' m/s', X(0), Y(arrowY) - 16, c, 11.5);
    }

    const labels = ['地面', 'A 车', 'B 车'];
    sans('参考系：' + labels[s.ref] + '（虚线为车道）', X(L.x0) + 16, Y(L.y1) + 20, 'rgba(180,210,220,.75)', 11.5, 'left');
    sans('拖动 × / × 可改变初始位置', X(L.x1) - 16, Y(L.y1) + 20, 'rgba(140,170,185,.55)', 10.5, 'right');
  },
  handles() {
    const p = this.pos(), s = this.state;
    const anchor = s.ref === 1 ? p.a : s.ref === 2 ? p.b : 0;
    const arr = [{id: 'a', x: p.a - anchor, y: .1}];
    if (s.ref !== 2) arr.push({id: 'b', x: p.b - anchor, y: .1});
    return arr;
  },
  drag(id, p) {
    const q = clampPt(p), s = this.state;
    const target = q.x;
    const anchor = s.ref === 1 ? this.pos().a : s.ref === 2 ? this.pos().b : 0;
    if (id === 'a') s.xa = target + anchor - s.va * s.t;
    else s.xb = target + anchor - s.vB * s.t;
  },
  hud() {
    const s = this.state, p = this.pos();
    const names = ['地面', 'A 车', 'B 车'];
    const rel = s.ref === 1 ? s.vB - s.va : s.ref === 2 ? s.va - s.vB : s.vB;
    return [
      {k: '参考系', v: names[s.ref], hi: true},
      {k: 'A 车位置', v: f1(p.a * 2) + ' m'},
      {k: 'B 车位置', v: f1(p.b * 2) + ' m'},
      {k: '两车间距', v: f1(Math.abs(p.b - p.a) * 2) + ' m'},
      {k: '相对速度', v: f1(Math.abs(rel)) + ' m/s', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['地面', 'A 车', 'B 车'], s.ref, i => { s.ref = i; s.t = 0; });
    addSlider(el, 'A 车速度 / (m/s)', -4, 4, .5, s.va, v => f1(v), v => s.va = v);
    addSlider(el, 'B 车速度 / (m/s)', -6, 2, .5, s.vB, v => f1(v), v => s.vB = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '回到 t = 0', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 质点、路程与位移 ---------- */
MODULES.push({
  key: 'disp', tab: '02', name: '位移与路程', en: 'DISPLACEMENT', blurb: '起点到终点',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '拖动终点 B，比较轨迹长度（路程）与直线距离（位移）',
  state: {B: {x: 3.4, y: 1.8}, showPath: true, showVec: true},
  reset() { this.state.B = {x: 3.4, y: 1.8}; this.state.showPath = true; this.state.showVec = true; },
  meta() {
    return {
      title: '位移是矢量，路程是标量',
      desc: '质点从 A 沿曲线运动到 B：轨迹的长度叫路程，由起点指向终点的有向线段叫位移。拖动 B 点改变终点，比较两者的大小，体会「走得多」与「位置变了多少」的区别。',
      formula: '|Δx| ≤ s，Δx = x<sub>末</sub> − x<sub>初</sub>',
      note: '只有<b>单向直线运动</b>时路程才等于位移大小。位移只看起点与终点，与中间怎么走无关。'
    };
  },
  A() { return {x: -4, y: -.8}; },
  track() {
    const A = this.A(), B = this.state.B;
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, amp = Math.min(1.5, L * .28);
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, k = Math.sin(Math.PI * t) * amp;
      pts.push({x: A.x + dx * t + nx * k, y: A.y + dy * t + ny * k});
    }
    return pts;
  },
  length() {
    const pts = this.track();
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return s;
  },
  draw() {
    setFrame(.5, .54, 15);
    base();
    const A = this.A(), B = this.state.B, pts = this.track();
    const scale = 1.5;
    if (this.state.showPath) {
      path(pts, '#6cb6ff', {w: 2.6, glow: 8});
      sans('轨迹（路程）', X(B.x) + 12, Y(B.y) - 14, 'rgba(140,196,255,.9)', 11.5, 'left');
    }
    if (this.state.showVec) {
      arrow(A, B, '#ffc56b', {w: 3, head: 14});
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      math('Δx', X(mx) + 14, Y(my) + 14, '#ffd79a', 17, 'left');
    }
    dot(A, '#5eead4', 6);
    sans('A 起点', X(A.x) - 10, Y(A.y) + 20, '#8fe9d8', 11.5, 'right');
    dot(B, '#ffc56b', 6);
    handle(B, '#ffc56b', hoverId === 'B');

    const s = this.length() * scale, d = Math.hypot(B.x - A.x, B.y - A.y) * scale;
    sans('s = ' + f1(s) + ' m', X(-5.4), Y(3.2), '#9ecbff', 13, 'left');
    sans('|Δx| = ' + f1(d) + ' m', X(-5.4), Y(2.55), '#ffd79a', 13, 'left');
    sans(s - d > .05 ? '曲线路径比直线长 ' + f1(s - d) + ' m' : '两点重合，位移为零',
      X(-5.4), Y(1.9), 'rgba(175,205,215,.7)', 11, 'left');

    const ang = Math.atan2(B.y - A.y, B.x - A.x);
    angleArc(A, 0, ang, 42, 'rgba(255,199,107,.55)', '', 12);
    sans(f1(Math.abs(ang * 180 / Math.PI)) + '°', X(A.x) + 58, Y(A.y) + (ang > 0 ? -14 : 18), 'rgba(255,215,154,.8)', 11);
  },
  handles() { return [{id: 'B', x: this.state.B.x, y: this.state.B.y}]; },
  drag(id, p) { this.state.B = clampPt(p); },
  hud() {
    const A = this.A(), B = this.state.B, s = this.length() * 1.5;
    const d = Math.hypot(B.x - A.x, B.y - A.y) * 1.5;
    return [
      {k: '路程 s', v: f1(s) + ' m', hi: true},
      {k: '位移大小', v: f1(d) + ' m', hi: true},
      {k: 's − |Δx|', v: f1(s - d) + ' m'},
      {k: '位移方向', v: f1(Math.abs(Math.atan2(B.y - A.y, B.x - A.x) * 180 / Math.PI)) + '°'}
    ];
  },
  panel(el) {
    const s = this.state;
    addToggle(el, '显示运动轨迹（路程）', s.showPath, v => s.showPath = v);
    addToggle(el, '显示位移矢量', s.showVec, v => s.showVec = v);
    addBtn(el, '回到默认终点', () => { s.B = {x: 3.4, y: 1.8}; }, 'ghost');
  }
});

/* ---------- 03 平均速度与瞬时速度 ---------- */
MODULES.push({
  key: 'vel', tab: '03', name: '速度', en: 'VELOCITY', blurb: '割线趋近切线',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '拖动 t₀ 或缩小 Δt，看割线斜率怎样趋近瞬时速度',
  playable: true,
  state: {t0: 1.4, dt: 1.6, playing: false},
  reset() { this.state.t0 = 1.4; this.state.dt = 1.6; this.state.playing = false; },
  meta() {
    return {
      title: '平均速度在 Δt → 0 时趋于瞬时速度',
      desc: '在 x-t 图象上取两点连成割线，割线斜率就是这段时间的平均速度。拖动 t₀ 改变时刻、缩小 Δt，割线逐渐贴近切线——切线斜率即为该时刻的瞬时速度。',
      formula: 'v̄ = Δx/Δt，v = lim<sub>Δt→0</sub> Δx/Δt',
      note: '平均速度粗略描述一段过程，瞬时速度精确描述某一时刻。观察 Δt 变小时，<b>平均速度与瞬时速度的差值</b>怎样缩小。'
    };
  },
  x(t) { return .8 * t + .35 * t * t; },
  v(t) { return .8 + .7 * t; },
  gx(t) { return -4.9 + t * 1.36; },
  gy(x) { return -2.9 + x * .29; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t0 += dt * 1.6;
      if (s.t0 > 6.6) { s.t0 = .2; }
    }
    setFrame(.5, .55, 14);
    base();
    axisBox(this.gx(0), this.gx(7), this.gy(0), this.gy(19), 't / s', 'x / m');

    for (let t = 0; t <= 7; t++) {
      const wx = this.gx(t);
      line({x: wx, y: this.gy(0)}, {x: wx, y: this.gy(0) - .09}, 'rgba(198,222,232,.45)', {w: 1});
      sans(String(t), X(wx), Y(this.gy(0)) + 14, 'rgba(160,190,205,.7)', 10);
    }
    for (let x = 0; x <= 18; x += 3) {
      const wy = this.gy(x);
      line({x: this.gx(0) - .1, y: wy}, {x: this.gx(0), y: wy}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(x), X(this.gx(0)) - 8, Y(wy), 'rgba(160,190,205,.7)', 10, 'right');
    }

    const pts = [];
    for (let t = 0; t <= 7; t += .05) pts.push({x: this.gx(t), y: this.gy(this.x(t))});
    path(pts, 'rgba(180,156,255,.85)', {w: 2.4, glow: 7});
    sans('x = 0.8t + 0.35t²', X(this.gx(6.7)), Y(this.gy(17.2)), 'rgba(196,178,255,.85)', 11.5, 'right');

    const t0 = s.t0, t1 = Math.min(6.98, t0 + s.dt);
    const p0 = {x: this.gx(t0), y: this.gy(this.x(t0))};
    const p1 = {x: this.gx(t1), y: this.gy(this.x(t1))};

    line({x: this.gx(0), y: this.gy(this.x(t0))}, {x: this.gx(t0), y: this.gy(this.x(t0))}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
    line({x: this.gx(t0), y: this.gy(0)}, {x: this.gx(t0), y: this.gy(this.x(t0))}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});

    line(p0, p1, 'rgba(255,199,107,.9)', {w: 2.6});
    dot(p0, '#fff1cf', 5.4);
    dot(p1, '#b49cff', 4.6);
    handle(p0, '#ffc56b', hoverId === 't0');

    const k = this.v(t0);
    const dx = 1.5, dy = k * .62 * dx;
    line({x: p0.x - dx, y: p0.y - dy}, {x: p0.x + dx, y: p0.y + dy}, 'rgba(94,234,212,.85)', {w: 1.8, dash: [6, 4]});
    sans('切线 v = ' + f1(k) + ' m/s', X(p0.x + 1.9), Y(p0.y + dy * .9), 'rgba(126,236,214,.95)', 11.5, 'left');
    segLabel(p0, p1, '割线', 'rgba(255,210,140,.95)', .5, 16, 11);

    sans('t₀ = ' + f1(t0) + ' s，Δt = ' + f1(s.dt) + ' s', X(this.gx(0)) + 8, Y(this.gy(18.4)), 'rgba(180,205,215,.8)', 11.5, 'left');
  },
  handles() { return [{id: 't0', x: this.gx(this.state.t0), y: this.gy(this.x(this.state.t0))}]; },
  drag(id, p) {
    const q = clampPt(p);
    const t = (q.x - this.gx(0)) / (this.gx(1) - this.gx(0));
    this.state.t0 = clamp(t, .1, 6.4);
  },
  hud() {
    const s = this.state, t0 = s.t0, dt = Math.max(.01, s.dt);
    const avg = (this.x(t0 + dt) - this.x(t0)) / dt;
    return [
      {k: '时刻 t₀', v: f1(t0) + ' s', hi: true},
      {k: '平均速度', v: f1(avg) + ' m/s', hi: true},
      {k: '瞬时速度', v: f1(this.v(t0)) + ' m/s'},
      {k: '差值', v: f2(Math.abs(avg - this.v(t0))) + ' m/s'},
      {k: 'Δt', v: f1(s.dt) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '时刻 t₀ / s', .2, 6.4, .1, s.t0, v => f1(v), v => s.t0 = v);
    addSlider(el, '时间间隔 Δt / s', .05, 2.5, .05, s.dt, v => f1(v), v => s.dt = v);
    addBtn(el, 'Δt → 0（看瞬时）', () => { s.dt = .05; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 加速度 ---------- */
MODULES.push({
  key: 'accel', tab: '04', name: '加速度', en: 'ACCELERATION', blurb: '速度变化的快慢',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变初速度与加速度，观察 v-t 图斜率与速度、加速度方向',
  playable: true,
  state: {t: 0, playing: true, v0: 2, a: 1.5, showV: true, showA: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.v0 = 2; s.a = 1.5; s.showV = true; s.showA = true; },
  meta() {
    return {
      title: '加速度是速度变化的快慢',
      desc: '调节初速度 v₀ 与加速度 a，观察小车速度矢量与加速度矢量的方向关系。v-t 图是一条直线，直线的斜率就是加速度，斜率越大速度变化越快。',
      formula: 'a = Δv/Δt = (v − v<sub>0</sub>)/t',
      note: '加速度与速度<b>同向则加速，反向则减速</b>；a 的符号只表示方向，大小看绝对值。速度为零时加速度可以不为零。'
    };
  },
  v(t) { return this.state.v0 + this.state.a * t; },
  x(t) { return this.state.v0 * t + .5 * this.state.a * t * t; },
  gx(t) { return -4.6 + t * 1.15; },
  gy(v) { return -1.4 + v * .26; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 5.6) s.t = 0; }
    setFrame(.5, .58, 14);
    base();

    roadBand(-6.3, 6.3, 3.0, 0);

    const v = this.v(s.t);
    const carX = clamp(this.x(s.t) * .32 - 4.4, -5.9, 5.9);
    carShape(carX, 3.0, '#ffc56b', '');
    if (s.showV) {
      arrow({x: carX + .7, y: 3.45}, {x: carX + .7 + v * .22, y: 3.45}, '#6cb6ff', {w: 2.6, head: 12});
      sans('v = ' + f1(v) + ' m/s', X(carX + .7), Y(3.45) - 15, '#a8d0ff', 11);
    }
    if (s.showA) {
      arrow({x: carX - .7, y: 2.6}, {x: carX - .7 + s.a * .3, y: 2.6}, '#ff8fab', {w: 2.4, head: 11});
      sans('a = ' + f1(s.a) + ' m/s²', X(carX - .7), Y(2.6) + 16, '#ffb3c6', 11);
    }

    axisBox(this.gx(0), this.gx(6.2), this.gy(-8), this.gy(9.6), 't / s', 'v / (m/s)');
    line({x: this.gx(0), y: this.gy(0)}, {x: this.gx(6.1), y: this.gy(0)}, 'rgba(198,222,232,.3)', {w: 1.2});

    const pA = {x: this.gx(0), y: this.gy(s.v0)};
    const pB = {x: this.gx(6.1), y: this.gy(this.v(6.1))};
    line(pA, pB, 'rgba(255,197,107,.28)', {w: 1.6, dash: [5, 5]});
    const pT = {x: this.gx(s.t), y: this.gy(v)};
    line(pA, pT, '#ffc56b', {w: 2.6, glow: 8});
    dot(pA, '#ffe3b0', 4.2);
    dot(pT, '#fff6e2', 5.6);

    line({x: this.gx(s.t), y: this.gy(0)}, pT, 'rgba(255,255,255,.22)', {w: 1.1, dash: [4, 4]});
    line({x: this.gx(0), y: this.gy(v)}, pT, 'rgba(255,255,255,.22)', {w: 1.1, dash: [4, 4]});

    const dv = v - s.v0;
    if (Math.abs(s.t) > .15) {
      segMath(pA, pT, 'Δv', 'rgba(255,220,160,.95)', .55, 18, 15);
      sans('a = Δv/Δt = ' + f1(s.a) + ' m/s²', X(this.gx(4.6)), Y(this.gy(8.6)), 'rgba(255,220,160,.9)', 12, 'left');
    }
    sans(dv > .05 ? '速度增大' : dv < -.05 ? '速度减小' : '速度不变',
      X(this.gx(.15)), Y(this.gy(8.6)), 'rgba(190,215,225,.75)', 11.5, 'left');
    handle(pT, '#ffc56b', hoverId === 'pt');
  },
  handles() {
    const t = this.state.t;
    return [{id: 'pt', x: this.gx(t), y: this.gy(this.v(t))}];
  },
  drag(id, p) {
    const q = clampPt(p);
    const t = (q.x - this.gx(0)) / (this.gx(1) - this.gx(0));
    const vv = (q.y - this.gy(0)) / (this.gy(1) - this.gy(0));
    this.state.t = clamp(t, 0, 5.6);
    this.state.v0 = clamp(vv - this.state.a * this.state.t, -8, 9);
  },
  hud() {
    const s = this.state, v = this.v(s.t);
    return [
      {k: 'v', v: f1(v) + ' m/s', hi: true},
      {k: 'a', v: f1(s.a) + ' m/s²', hi: true},
      {k: 'Δv', v: f1(v - s.v0) + ' m/s'},
      {k: '方向关系', v: s.a * v > 0 ? '同向 · 加速' : s.a * v < 0 ? '反向 · 减速' : '—'},
      {k: '位移', v: f1(this.x(s.t) * 2) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', -6, 8, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '加速度 a / (m/s²)', -4, 4, .25, s.a, v => f1(v), v => { s.a = v; s.t = 0; });
    addToggle(el, '显示速度矢量', s.showV, v => s.showV = v);
    addToggle(el, '显示加速度矢量', s.showA, v => s.showA = v);
    addBtn(el, '重置时间', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 用图象描述运动 ---------- */
MODULES.push({
  key: 'graphs', tab: '05', name: '运动图象', en: 'MOTION GRAPHS', blurb: 'x-t 与 v-t 对照',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '切换运动类型，比较位置—时间与速度—时间图象的形状',
  playable: true,
  state: {t: 1.2, playing: true, mode: 1, v0: 4, a: 1},
  reset() { const s = this.state; s.t = 1.2; s.playing = true; s.mode = 1; s.v0 = 4; s.a = 1; },
  meta() {
    return {
      title: '图象的斜率藏着速度与加速度',
      desc: '左图是位置—时间图象，右图是速度—时间图象。切换匀速、匀加速、匀减速与静止四种运动，比较两条曲线的形状，并观察同一时刻两个图上的对应点。',
      formula: 'x-t 图象斜率 = v，v-t 图象斜率 = a',
      note: 'x-t 图是<b>抛物线</b>表示匀变速运动；v-t 图是<b>倾斜直线</b>表示匀变速运动，直线与 t 轴围成的面积等于位移。'
    };
  },
  vx(t) {
    const s = this.state;
    if (s.mode === 0) return 3;
    if (s.mode === 3) return 0;
    if (s.mode === 2) return Math.max(0, s.v0 - s.a * t);
    return s.v0 + s.a * t;
  },
  xAt(t) {
    const s = this.state;
    if (s.mode === 0) return 3 * t;
    if (s.mode === 3) return 1.2;
    if (s.mode === 2) {
      const tc = Math.min(t, s.v0 / Math.max(.001, s.a));
      return s.v0 * tc - .5 * s.a * tc * tc + Math.max(0, t - tc) * 0;
    }
    return s.v0 * t + .5 * s.a * t * t;
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 5.4) s.t = 0; }
    setFrame(.5, .54, 16);
    base();

    const x = this.xAt(s.t), v = this.vx(s.t);
    const L = lim();
    sans('x-t 图象', X(-6.8), Y(3.5), 'rgba(150,235,215,.9)', 12, 'left');
    sans('v-t 图象', X(1.0), Y(3.5), 'rgba(255,210,140,.9)', 12, 'left');

    const lx0 = -6.7, lx1 = -.7, ly0 = -2.9, ly1 = 2.9;
    const rx0 = 1.1, rx1 = 6.9;
    const mapX1 = t => lx0 + (t / 6) * (lx1 - lx0);
    const mapY1 = q => ly0 + (q / 26) * (ly1 - ly0);
    const mapX2 = t => rx0 + (t / 6) * (rx1 - rx0);
    const mapY2 = q => ly0 + ((q + 4) / 14) * (ly1 - ly0);

    axisBox(lx0, lx1, ly0, ly1, '', '');
    axisBox(rx0, rx1, ly0, ly1, '', '');
    sans('t/s', X(lx1) - 6, Y(ly0) + 15, 'rgba(170,198,210,.8)', 10.5, 'right');
    sans('x/m', X(lx0) - 8, Y(ly1) + 12, 'rgba(170,198,210,.8)', 10.5, 'right');
    sans('t/s', X(rx1) - 6, Y(ly0) + 15, 'rgba(170,198,210,.8)', 10.5, 'right');
    sans('v/(m/s)', X(rx0) - 8, Y(ly1) + 12, 'rgba(170,198,210,.8)', 10.5, 'right');

    const p1 = [], p2 = [];
    for (let t = 0; t <= 5.9; t += .06) {
      p1.push({x: mapX1(t), y: mapY1(clamp(this.xAt(t), 0, 26))});
      p2.push({x: mapX2(t), y: mapY2(this.vx(t))});
    }
    path(p1, 'rgba(123,224,192,.9)', {w: 2.4, glow: 7});
    path(p2, 'rgba(255,197,107,.9)', {w: 2.4, glow: 7});

    if (s.mode === 1 || s.mode === 2) {
      dot({x: mapX1(s.t), y: mapY1(clamp(x, 0, 26))}, '#ffffff', 5);
      dot({x: mapX2(s.t), y: mapY2(v)}, '#ffffff', 5);
      line({x: mapX1(s.t), y: ly0}, {x: mapX1(s.t), y: ly1}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
      line({x: mapX2(s.t), y: ly0}, {x: mapX2(s.t), y: ly1}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
    } else {
      dot({x: mapX1(s.t), y: mapY1(clamp(x, 0, 26))}, '#ffffff', 5);
      dot({x: mapX2(s.t), y: mapY2(v)}, '#ffffff', 5);
    }

    const names = ['匀速直线', '匀加速直线', '匀减速直线', '静止'];
    sans('当前：' + names[s.mode], X(lx0) + 6, Y(ly1) + 26, 'rgba(200,225,232,.85)', 12, 'left');
    sans('斜率 = 速度', X(lx0) + 6, Y(ly1) + 2, 'rgba(150,200,210,.6)', 10.5, 'left');
    sans('斜率 = 加速度', X(rx0) + 6, Y(ly1) + 2, 'rgba(150,200,210,.6)', 10.5, 'left');
    sans('t = ' + f1(s.t) + ' s', X(L.x0) + 14, Y(L.y1) + 18, 'rgba(180,210,220,.75)', 11.5, 'left');
  },
  hud() {
    const s = this.state, x = this.xAt(s.t), v = this.vx(s.t);
    const slopeA = s.mode === 1 ? s.a : s.mode === 2 ? -s.a : 0;
    return [
      {k: 't', v: f1(s.t) + ' s'},
      {k: 'x', v: f1(x) + ' m', hi: true},
      {k: 'v', v: f1(v) + ' m/s', hi: true},
      {k: 'a', v: (s.mode === 0 || s.mode === 3) ? '0 m/s²' : f1(slopeA) + ' m/s²'},
      {k: '图象', v: s.mode === 0 ? 'x-t 直线' : s.mode === 3 ? '水平线' : (s.mode === 1 ? 'x-t 抛物线' : 'x-t 抛物线')}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['匀速', '匀加速', '匀减速'], s.mode > 2 ? 0 : s.mode, i => { s.mode = i; s.t = 0; });
    addSlider(el, '初速度 v₀ / (m/s)', 0, 8, .5, s.v0, v => f1(v), v => { s.v0 = v; s.t = 0; });
    addSlider(el, '加速度大小 a / (m/s²)', .2, 3, .1, s.a, v => f1(v), v => { s.a = v; s.t = 0; });
    addToggle(el, '静止状态', s.mode === 3, v => { s.mode = v ? 3 : 1; s.t = 0; });
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
