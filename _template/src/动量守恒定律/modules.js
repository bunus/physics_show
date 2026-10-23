/* ============================================================
   选择性必修第一册 · 第 1 章 动量守恒定律
   01 冲量与动量定理  02 动量守恒（碰撞）  03 弹性与非弹性碰撞
   04 反冲与火箭      05 人船模型
   ============================================================ */
(function () {

function f1(v) {
  const s = (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
  return s.replace('-', '−');
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.replace(/0+$/, '').replace(/\.$/, '').replace('-', '−');
}

/* ---------- 通用绘图小工具 ---------- */
function rail(x0, x1, y, color) {
  line({x: x0, y: y}, {x: x1, y: y}, color || 'rgba(200,228,236,.42)', {w: 1.6});
  for (let x = Math.ceil(x0); x <= Math.floor(x1); x++) {
    line({x: x, y: y}, {x: x - .16, y: y - .2}, 'rgba(200,228,236,.16)', {w: 1});
  }
}

function cart(x, y, hw, color, label) {
  rect({x: x - hw, y: y - .46}, {x: x + hw, y: y + .02}, 'rgba(12,22,34,.9)', color, {w: 1.8});
  circleAt({x: x - hw * .55, y: y - .54}, .12, '#08111c', color, {w: 1.2});
  circleAt({x: x + hw * .55, y: y - .54}, .12, '#08111c', color, {w: 1.2});
  if (label) sans(label, X(x), Y(y + .34), color, 11);
}

function barH(zx, y, w0, fill, stroke) {
  const x1 = zx + w0;
  rect({x: Math.min(zx, x1), y: y - .17}, {x: Math.max(zx, x1), y: y + .17}, fill, stroke, {w: 1.3});
}

/* ---------- 01 冲量与动量定理 ---------- */
MODULES.push({
  key: 'impulse', tab: '01', name: '冲量与动量', en: 'IMPULSE', blurb: '力在时间上的积累',
  accent: '#ffa97a', rgb: '255,169,122',
  hint: '调节力、质量与作用时间，看 F-t 图线下的面积怎样改变动量',
  playable: true,
  state: {t: 0, playing: true, m: 2, v0: 1, F: 6, dur: .8, showArea: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.m = 2; s.v0 = 1; s.F = 6; s.dur = .8; s.showArea = true;
  },
  meta() {
    return {
      title: '冲量：力在时间上的积累',
      desc: '小车在光滑水平面上受水平恒力作用而加速。下方 F-t 图象里，图线与时间轴围成的矩形面积就是这段时间内力的冲量；面积越大，小车动量的改变越大。改变力、质量与作用时间，验证 I = Δp。',
      formula: 'I = FΔt = Δp = mv′ − mv<sub>0</sub>',
      note: '同样的冲量，作用时间越长需要的力越小，这就是<b>缓冲</b>的原理：安全气囊、跳高垫都在延长 Δt。'
    };
  },
  acc() { return this.state.F / this.state.m; },
  vAt(t) { const s = this.state; return s.v0 + this.acc() * Math.min(t, s.dur); },
  sAt(t) {
    const s = this.state, td = Math.min(t, s.dur);
    return s.v0 * td + .5 * this.acc() * td * td + (t > s.dur ? this.vAt(s.dur) * (t - s.dur) : 0);
  },
  gx(t) { return -6.3 + t * 5.5; },
  gy(F) { return -2.5 + F * .295; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 2) s.t = 0; }
    setFrame(.5, .56, 15);
    base();

    /* 轨道与小车 */
    rail(-6.8, 6.8, 2.35);
    const xw = clamp(-5.6 + this.sAt(s.t) * .55, -6.2, 5.9);
    cart(xw, 2.35, .6, '#ffa97a', 'm = ' + f1(s.m) + ' kg');
    const v = this.vAt(s.t);
    if (v > .05) {
      arrow({x: xw + .72, y: 2.85}, {x: xw + .72 + clamp(v * .42, .35, 2.5), y: 2.85}, '#6cb6ff', {w: 2.6, head: 12});
      sans('v = ' + f1(v) + ' m/s', X(xw + .72), Y(3.2), '#a8d0ff', 11.5, 'center');
    }
    if (s.t < s.dur) {
      arrow({x: xw - .95, y: 1.9}, {x: xw - .95 + clamp(s.F * .14, .4, 1.4), y: 1.9}, '#ff8fab', {w: 2.6, head: 11});
      sans('F = ' + f1(s.F) + ' N', X(xw - .95 + .7), Y(1.9) - 14, '#ffb3c6', 11, 'center');
    }

    /* F-t 图象 */
    const zy = this.gy(0);
    line({x: -6.5, y: zy}, {x: 5.2, y: zy}, 'rgba(198,222,232,.45)', {w: 1.5});
    line({x: -6.5, y: zy}, {x: -6.5, y: this.gy(9)}, 'rgba(198,222,232,.45)', {w: 1.5});
    arrow({x: 4.8, y: zy}, {x: 5.2, y: zy}, 'rgba(198,222,232,.6)', {w: 1.2, head: 9});
    arrow({x: -6.5, y: this.gy(8.6)}, {x: -6.5, y: this.gy(9)}, 'rgba(198,222,232,.6)', {w: 1.2, head: 9});
    sans('t / s', X(5.2) - 4, Y(zy) + 15, 'rgba(170,198,210,.85)', 11, 'right');
    sans('F / N', X(-6.5) - 8, Y(this.gy(8.8)), 'rgba(170,198,210,.85)', 11, 'right');
    for (let t = 0; t <= 2.001; t += .5) {
      line({x: this.gx(t), y: zy}, {x: this.gx(t), y: zy - .07}, 'rgba(198,222,232,.4)', {w: 1});
      sans(f1(t), X(this.gx(t)), Y(zy) + 14, 'rgba(160,190,205,.7)', 10, 'center');
    }
    for (let F = 2; F <= 8; F += 2) {
      line({x: -6.5, y: this.gy(F)}, {x: -6.4, y: this.gy(F)}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(F), X(-6.5) - 9, Y(this.gy(F)), 'rgba(160,190,205,.7)', 10, 'right');
    }

    if (s.showArea && s.dur > .02) {
      poly([
        {x: this.gx(0), y: zy}, {x: this.gx(0), y: this.gy(s.F)},
        {x: this.gx(s.dur), y: this.gy(s.F)}, {x: this.gx(s.dur), y: zy}
      ], 'rgba(255,169,122,.16)', 'rgba(255,169,122,.5)', {w: 1.2});
      sans('面积 = 冲量', X((this.gx(0) + this.gx(s.dur)) / 2), Y(this.gy(s.F)) - 12,
        'rgba(255,196,160,.9)', 10.5, 'center');
    }
    line({x: this.gx(0), y: this.gy(s.F)}, {x: this.gx(s.dur), y: this.gy(s.F)}, '#ffa97a', {w: 3, glow: 8});
    if (s.t <= s.dur) dot({x: this.gx(s.t), y: this.gy(s.F)}, '#fff0e2', 5);

    sans('I = FΔt = ' + f1(s.F * s.dur) + ' N·s　　p = mv = ' + f2(s.m * v) + ' kg·m/s',
      X(-6.5), Y(1.55), 'rgba(255,208,176,.92)', 12.5, 'left');
  },
  hud() {
    const s = this.state, v = this.vAt(s.t);
    return [
      {k: '质量 m', v: f1(s.m) + ' kg'},
      {k: '冲量 I', v: f1(s.F * s.dur) + ' N·s', hi: true},
      {k: '末速度 v′', v: f1(this.vAt(s.dur)) + ' m/s'},
      {k: '动量 p', v: f2(s.m * v) + ' kg·m/s', hi: true},
      {k: '动量变化 Δp', v: f2(s.m * v - s.m * s.v0) + ' kg·m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '质量 m / kg', 1, 4, .5, s.m, v => f1(v), v => s.m = v);
    addSlider(el, '初速度 v₀ / (m/s)', 0, 2, .1, s.v0, v => f1(v), v => s.v0 = v);
    addSlider(el, '作用力 F / N', 1, 8, .5, s.F, v => f1(v), v => s.F = v);
    addSlider(el, '作用时间 Δt / s', .2, .9, .05, s.dur, v => v.toFixed(2), v => s.dur = v);
    addToggle(el, '显示冲量面积', s.showArea, v => s.showArea = v);
    addBtn(el, '重新计时', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 动量守恒（碰撞） ---------- */
MODULES.push({
  key: 'conserve', tab: '02', name: '动量守恒', en: 'CONSERVATION', blurb: '碰撞前后总量不变',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '改变两车质量与碰前速度，观察三根动量柱的总量始终不变',
  playable: true,
  state: {t: 0, playing: true, m1: 2, m2: 1, v1: 1.6, showBars: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.m1 = 2; s.m2 = 1; s.v1 = 1.6; s.showBars = true;
  },
  meta() {
    return {
      title: '系统不受外力，总动量保持不变',
      desc: '气垫导轨上两车相碰，碰撞时两车之间的作用力等大反向、同时产生。碰后 A 车变慢或倒退，B 车被推着前进，但两车动量的矢量和始终等于碰前的总动量。',
      formula: 'm<sub>1</sub>v<sub>1</sub> + m<sub>2</sub>v<sub>2</sub> = m<sub>1</sub>v<sub>1</sub>′ + m<sub>2</sub>v<sub>2</sub>′',
      note: '动量是矢量，<b>先规定正方向</b>再代入正负号。碰后总动量不变，但每一车的动量都发生了明显改变。'
    };
  },
  tc() {
    const s = this.state;
    return Math.max(.4, 4.56 / Math.max(.4, s.v1)) - .15;
  },
  post() {
    const s = this.state, v2 = 0;
    const u1 = ((s.m1 - s.m2) * s.v1 + 2 * s.m2 * v2) / (s.m1 + s.m2);
    const u2 = ((s.m2 - s.m1) * v2 + 2 * s.m1 * s.v1) / (s.m1 + s.m2);
    return {u1: u1, u2: u2};
  },
  pos() {
    const s = this.state, tc = this.tc(), q = this.post();
    const x10 = -5.8, x20 = .2;
    if (s.t < tc) return {a: x10 + s.v1 * s.t, b: x20, va: s.v1, vb: 0};
    const dt = s.t - tc;
    return {a: x10 + s.v1 * tc + q.u1 * dt, b: x20 + q.u2 * dt, va: q.u1, vb: q.u2};
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt * 1.1;
      if (s.t > 5) s.t = 0;
    }
    setFrame(.5, .56, 15);
    base();
    const p = this.pos(), tc = this.tc();

    rail(-6.9, 6.9, 2.3);
    sans('气垫导轨（摩擦可忽略）', X(-6.7), Y(2.85), 'rgba(160,190,205,.6)', 10.5, 'left');

    cart(p.a, 2.3, .62, '#6cb6ff', 'A');
    cart(p.b, 2.3, .62, '#5eead4', 'B');

    if (Math.abs(p.va) > .06) {
      const L1 = clamp(Math.abs(p.va) * .55, .3, 2.2) * (p.va > 0 ? 1 : -1);
      arrow({x: p.a, y: 1.22}, {x: p.a + L1, y: 1.22}, '#6cb6ff', {w: 2.6, head: 11});
      sans(f1(Math.abs(p.va)) + ' m/s', X(p.a + L1 / 2), Y(1.22) - 14, '#a8d0ff', 10.5);
    }
    if (Math.abs(p.vb) > .06) {
      const L2 = clamp(Math.abs(p.vb) * .55, .3, 2.2) * (p.vb > 0 ? 1 : -1);
      arrow({x: p.b, y: 1.22}, {x: p.b + L2, y: 1.22}, '#5eead4', {w: 2.6, head: 11});
      sans(f1(Math.abs(p.vb)) + ' m/s', X(p.b + L2 / 2), Y(1.22) - 14, '#8fe9d8', 10.5);
    }

    if (s.t > tc - .12 && s.t < tc + .22) {
      circleAt({x: (p.a + p.b) / 2, y: 2.3}, .55 + (s.t - tc + .12) * 2.2, null, 'rgba(255,255,255,.5)', {w: 1.4});
    }

    /* 动量柱 */
    const zx = -1.2, sc = .45;
    const p1 = s.m1 * p.va, p2 = s.m2 * p.vb, pt = p1 + p2;
    if (s.showBars) {
      line({x: zx, y: -2.75}, {x: zx, y: -.15}, 'rgba(198,222,232,.35)', {w: 1.2});
      barH(zx, -.5, p1 * sc, 'rgba(108,182,255,.28)', 'rgba(108,182,255,.85)');
      barH(zx, -1.4, p2 * sc, 'rgba(94,234,212,.28)', 'rgba(94,234,212,.85)');
      barH(zx, -2.3, pt * sc, 'rgba(255,197,107,.22)', 'rgba(255,197,107,.9)');
      sans('p₁（A）', X(-6.8), Y(-.5), '#9ecbff', 10.5, 'left');
      sans('p₂（B）', X(-6.8), Y(-1.4), '#8fe9d8', 10.5, 'left');
      sans('p 总', X(-6.8), Y(-2.3), '#ffd79a', 10.5, 'left');
      sans(f2(p1) + ' kg·m/s', X(6.4), Y(-.5), 'rgba(158,203,255,.85)', 10.5, 'right');
      sans(f2(p2) + ' kg·m/s', X(6.4), Y(-1.4), 'rgba(143,233,216,.85)', 10.5, 'right');
      sans(f2(pt) + ' kg·m/s', X(6.4), Y(-2.3), 'rgba(255,215,154,.95)', 10.5, 'right');
    }
    sans(s.t < tc ? '碰撞前' : '碰撞后', X(6.4), Y(1.9), 'rgba(180,210,220,.7)', 12, 'right');
  },
  hud() {
    const s = this.state, p = this.pos();
    const p1 = s.m1 * p.va, p2 = s.m2 * p.vb;
    return [
      {k: 'A 车动量', v: f2(p1) + ' kg·m/s'},
      {k: 'B 车动量', v: f2(p2) + ' kg·m/s'},
      {k: '总动量 p', v: f2(p1 + p2) + ' kg·m/s', hi: true},
      {k: 'A 车速度', v: f1(p.va) + ' m/s'},
      {k: 'B 车速度', v: f1(p.vb) + ' m/s', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, 'A 车质量 m₁ / kg', 1, 3, .5, s.m1, v => f1(v), v => { s.m1 = v; s.t = 0; });
    addSlider(el, 'B 车质量 m₂ / kg', 1, 3, .5, s.m2, v => f1(v), v => { s.m2 = v; s.t = 0; });
    addSlider(el, 'A 车初速度 v₁ / (m/s)', .8, 2.4, .1, s.v1, v => f1(v), v => { s.v1 = v; s.t = 0; });
    addToggle(el, '显示动量柱', s.showBars, v => s.showBars = v);
    addBtn(el, '重新碰撞', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 弹性与非弹性碰撞 ---------- */
MODULES.push({
  key: 'collide', tab: '03', name: '碰撞分类', en: 'COLLISIONS', blurb: '动能去哪了',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换碰撞类型，比较碰前与碰后的总动能',
  playable: true,
  state: {t: 0, playing: true, e: 1, m1: 2, m2: 2, showE: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.e = 1; s.m1 = 2; s.m2 = 2; s.showE = true;
  },
  meta() {
    return {
      title: '碰撞中动量一定守恒，动能不一定',
      desc: '两车以相同速率对撞。弹性碰撞后两车各自弹回，动能几乎不损失；完全非弹性碰撞后两车粘在一起，动能损失最大。切换碰撞类型，比较碰前碰后的动能柱。',
      formula: 'e = (v<sub>2</sub>′ − v<sub>1</sub>′)/(v<sub>1</sub> − v<sub>2</sub>)，e = 1 弹性，e = 0 完全非弹性',
      note: '动量是矢量，碰撞中<b>总能守恒</b>；动能是标量，非弹性碰撞中一部分转化为内能和声能。'
    };
  },
  tc() { return 3.05; },
  post() {
    const s = this.state, v1 = 1.7, v2 = -1.7;
    const P = s.m1 * v1 + s.m2 * v2, M = s.m1 + s.m2;
    const u1 = (P + s.m2 * s.e * (v2 - v1)) / M;
    const u2 = (P + s.m1 * s.e * (v1 - v2)) / M;
    return {u1: u1, u2: u2};
  },
  pos() {
    const s = this.state, tc = this.tc(), q = this.post();
    if (s.t < tc) return {a: -5.8 + 1.7 * s.t, b: 5.8 - 1.7 * s.t, va: 1.7, vb: -1.7};
    const dt = s.t - tc;
    if (s.e < .04) {
      const c = q.u1 * dt;
      return {a: -.62 + c, b: .62 + c, va: q.u1, vb: q.u2};
    }
    return {a: -.39 + q.u1 * dt, b: .39 + q.u2 * dt, va: q.u1, vb: q.u2};
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt * 1.05; if (s.t > 5.9) s.t = 0; }
    setFrame(.5, .56, 15);
    base();
    const p = this.pos();

    rail(-6.9, 6.9, 2.55);
    cart(p.a, 2.55, .62, '#b49cff', 'A');
    cart(p.b, 2.55, .62, '#ff8fab', 'B');
    if (Math.abs(p.va) > .06) {
      const L = clamp(Math.abs(p.va) * .5, .3, 1.9) * (p.va > 0 ? 1 : -1);
      arrow({x: p.a, y: 1.3}, {x: p.a + L, y: 1.3}, '#b49cff', {w: 2.4, head: 10});
      sans(f1(Math.abs(p.va)) + ' m/s', X(p.a + L / 2), Y(1.3) - 14, '#cabaff', 10);
    }
    if (Math.abs(p.vb) > .06) {
      const L = clamp(Math.abs(p.vb) * .5, .3, 1.9) * (p.vb > 0 ? 1 : -1);
      arrow({x: p.b, y: 1.3}, {x: p.b + L, y: 1.3}, '#ff8fab', {w: 2.4, head: 10});
      sans(f1(Math.abs(p.vb)) + ' m/s', X(p.b + L / 2), Y(1.3) - 14, '#ffb3c6', 10);
    }

    const names = ['弹性碰撞', '一般非弹性', '完全非弹性'];
    const idx = s.e > .85 ? 0 : s.e > .2 ? 1 : 2;
    sans('碰撞类型：' + names[idx], X(-6.6), Y(3.15), 'rgba(200,180,255,.9)', 12.5, 'left');

    /* 动能柱 */
    const E1 = .5 * s.m1 * 1.7 * 1.7 + .5 * s.m2 * 1.7 * 1.7;
    const E2 = .5 * s.m1 * p.va * p.va + .5 * s.m2 * p.vb * p.vb;
    const zx = -5.7, sc = .42;
    if (s.showE) {
      line({x: zx, y: -2.85}, {x: zx, y: -.15}, 'rgba(198,222,232,.35)', {w: 1.2});
      barH(zx, -.8, E1 * sc, 'rgba(180,156,255,.25)', 'rgba(180,156,255,.85)');
      barH(zx, -2.1, E2 * sc, 'rgba(255,143,171,.25)', 'rgba(255,143,171,.85)');
      sans('碰前总动能', X(zx) + 12, Y(-.45), '#cabaff', 10.5, 'left');
      sans(f1(E1) + ' J', X(zx) + 12, Y(-1.05), 'rgba(202,186,255,.8)', 10.5, 'left');
      sans('碰后总动能', X(zx) + 12, Y(-1.75), '#ffb3c6', 10.5, 'left');
      sans(f1(E2) + ' J', X(zx) + 12, Y(-2.35), 'rgba(255,179,198,.8)', 10.5, 'left');
      const loss = E1 - E2;
      sans('损失 ' + f1(loss) + ' J（' + f1(loss / Math.max(.01, E1) * 100) + '%）',
        X(4.2), Y(-.9), 'rgba(255,225,160,.9)', 12, 'center');
      sans(idx === 0 ? '动能几乎全部保留' : idx === 1 ? '一部分动能转化为内能' : '两车同速，损失最大',
        X(4.2), Y(-1.55), 'rgba(180,205,215,.75)', 11, 'center');
    }
  },
  hud() {
    const s = this.state, p = this.pos();
    const E1 = .5 * s.m1 * 1.7 * 1.7 + .5 * s.m2 * 1.7 * 1.7;
    const E2 = .5 * s.m1 * p.va * p.va + .5 * s.m2 * p.vb * p.vb;
    return [
      {k: '恢复系数 e', v: s.e.toFixed(2), hi: true},
      {k: '碰前动能', v: f1(E1) + ' J'},
      {k: '碰后动能', v: f1(E2) + ' J', hi: true},
      {k: '动能损失', v: f1(Math.max(0, E1 - E2)) + ' J'},
      {k: '系统总动量', v: f2(s.m1 * p.va + s.m2 * p.vb) + ' kg·m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    const seg = addSeg(el, ['弹性', '一般', '完全非弹'], s.e > .85 ? 0 : s.e > .2 ? 1 : 2, i => {
      s.e = i === 0 ? 1 : i === 1 ? .5 : 0;
      s.t = 0;
      seg.set(i);
    });
    addSlider(el, 'A 车质量 m₁ / kg', 1, 3, .5, s.m1, v => f1(v), v => { s.m1 = v; s.t = 0; });
    addSlider(el, 'B 车质量 m₂ / kg', 1, 3, .5, s.m2, v => f1(v), v => { s.m2 = v; s.t = 0; });
    addToggle(el, '显示动能柱', s.showE, v => s.showE = v);
    addBtn(el, '重新碰撞', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 反冲与火箭 ---------- */
MODULES.push({
  key: 'rocket', tab: '04', name: '反冲与火箭', en: 'ROCKET', blurb: '向后喷气向前飞',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '调节喷气速度与质量流量，看推力能否克服重力',
  playable: true,
  state: {t: 0, playing: true, u: 2400, q: 3, M0: 300, showJet: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = true; s.u = 2400; s.q = 3; s.M0 = 300; s.showJet = true;
  },
  meta() {
    return {
      title: '反冲：喷出的气体带走了动量',
      desc: '火箭向下高速喷出燃气，燃气获得向下的动量，火箭就获得等大向上的动量。喷气速度越大、每秒喷出的质量越多，推力越大；推力小于重力时火箭只能停在发射台上。',
      formula: 'F = u·q = u·Δm/Δt，M a = F − Mg',
      note: '真空中没有空气可"蹬"，火箭依然能加速，靠的是<b>动量守恒</b>而不是空气的反作用力。'
    };
  },
  thrust() { return this.state.u * this.state.q; },
  acc() {
    const s = this.state;
    return Math.max(0, this.thrust() / s.M0 - 9.8);
  },
  hAt(t) { return .5 * this.acc() * t * t; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt * 1.4; if (s.t > 2.5) s.t = 0; }
    setFrame(.5, .55, 14);
    base();

    const g = -1.95;
    ground(g, 'rgba(150,190,205,.5)');
    rect({x: -.85, y: g - .28}, {x: .85, y: g + .05}, 'rgba(120,140,160,.18)', 'rgba(170,200,215,.5)', {w: 1.2});
    sans('发射台', X(.95), Y(g - .05), 'rgba(160,190,205,.55)', 10, 'left');

    const SC = 1 / 20;
    const h = Math.min(4.1, this.hAt(s.t) * SC);
    const ry = g + .35 + h;
    const v = this.acc() * s.t;

    /* 尾焰 */
    if (s.showJet && s.t > 0) {
      const jet = clamp(this.thrust() / 9000, .15, 1);
      for (let k = 0; k < 12; k++) {
        const ph = ((s.t * 2.6 + k * .137) % 1);
        const yy = ry - .55 - ph * (.55 + jet * .6);
        const xx = Math.sin(k * 2.4 + s.t * 7) * .16 * ph * jet;
        circleAt({x: xx, y: yy}, .05 + .06 * (1 - ph), 'rgba(255,190,110,' + (0.5 * (1 - ph)).toFixed(2) + ')', null, {w: 0});
      }
      const flame = .5 + jet * .55;
      poly([{x: -.34, y: ry - .5}, {x: .34, y: ry - .5}, {x: 0, y: ry - .5 - flame}],
        'rgba(255,150,80,.28)', 'rgba(255,190,120,.9)', {w: 1.4});
      sans('燃气 u = ' + String(s.u) + ' m/s', X(1.15), Y(ry - .75), 'rgba(255,196,140,.85)', 10.5, 'left');
      arrow({x: .62, y: ry - .55}, {x: .62, y: ry - 1.15}, 'rgba(255,196,140,.75)', {w: 2, head: 9});
    }

    /* 箭体 */
    poly([{x: -.42, y: ry - .5}, {x: .42, y: ry - .5}, {x: .42, y: ry + .7}, {x: 0, y: ry + 1.05}, {x: -.42, y: ry + .7}],
      'rgba(24,36,50,.95)', '#ffc56b', {w: 1.8});
    circleAt({x: 0, y: ry + .35}, .16, 'rgba(120,200,255,.5)', 'rgba(180,225,255,.9)', {w: 1.2});
    if (v > .1) {
      arrow({x: .62, y: ry + .2}, {x: .62, y: ry + .2 + clamp(v * .045, .3, 2.2)}, '#5eead4', {w: 2.6, head: 11});
      sans('v = ' + f1(v) + ' m/s', X(1.0), Y(ry + .9 + clamp(v * .022, .1, 1)), '#8fe9d8', 11, 'left');
    }

    /* 数据板 */
    const F = this.thrust(), W = s.M0 * 9.8;
    sans('推力 F = u·q = ' + f1(F) + ' N', X(-6.4), Y(4.1), '#ffd79a', 12.5, 'left');
    sans('重力 Mg = ' + f1(W) + ' N', X(-6.4), Y(3.45), 'rgba(190,215,225,.85)', 12, 'left');
    sans(F > W ? '推力大于重力，火箭加速上升' : '推力不足，火箭停在台上',
      X(-6.4), Y(2.8), F > W ? 'rgba(143,233,216,.9)' : 'rgba(255,160,170,.9)', 11.5, 'left');
    if (F > W) {
      const barW = clamp(F / 13000, 0, 1) * 3.2;
      rect({x: -6.3, y: 1.5}, {x: -6.3 + barW, y: 1.8}, 'rgba(255,197,107,.28)', 'rgba(255,197,107,.8)', {w: 1});
      rect({x: -6.3, y: .95}, {x: -6.3 + clamp(W / 13000, 0, 1) * 3.2, y: 1.25}, 'rgba(108,182,255,.22)', 'rgba(108,182,255,.7)', {w: 1});
      sans('推力', X(-6.4), Y(1.65), 'rgba(255,215,154,.8)', 10, 'right');
      sans('重力', X(-6.4), Y(1.1), 'rgba(158,203,255,.8)', 10, 'right');
    }
    sans('高度 h = ' + f1(this.hAt(s.t)) + ' m', X(6.4), Y(2.6), 'rgba(180,210,220,.75)', 11, 'right');

    /* 高度标尺：每格 20 m */
    line({x: 3.15, y: g + .35}, {x: 3.15, y: g + 4.3}, 'rgba(255,255,255,.18)', {w: 1});
    for (let k = 0; k <= 4; k++) {
      const yk = g + .35 + k;
      line({x: 3.15, y: yk}, {x: 3.55, y: yk}, 'rgba(255,255,255,.25)', {w: 1});
      if (k) sans(String(k * 20), X(3.65), Y(yk), 'rgba(170,200,215,.6)', 9.5, 'left');
    }
    sans('m', X(3.65), Y(g + 4.3), 'rgba(170,200,215,.6)', 9.5, 'left');
  },
  hud() {
    const s = this.state, F = this.thrust();
    return [
      {k: '推力 F', v: f1(F) + ' N', hi: true},
      {k: '加速度 a', v: f1(this.acc()) + ' m/s²', hi: true},
      {k: '速度 v', v: f1(this.acc() * s.t) + ' m/s'},
      {k: '高度 h', v: f1(this.hAt(s.t)) + ' m'},
      {k: '每秒喷气', v: f1(s.q) + ' kg/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '喷气速度 u / (m/s)', 800, 2600, 50, s.u, v => String(Math.round(v)), v => s.u = v);
    addSlider(el, '质量流量 q / (kg/s)', 1, 4, .5, s.q, v => f1(v), v => s.q = v);
    addSlider(el, '火箭质量 M / kg', 250, 700, 10, s.M0, v => String(Math.round(v)), v => s.M0 = v);
    addToggle(el, '显示燃气喷流', s.showJet, v => s.showJet = v);
    addBtn(el, '重新点火', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 人船模型 ---------- */
MODULES.push({
  key: 'boat', tab: '05', name: '人船模型', en: 'MAN & BOAT', blurb: '质心一动不动',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '让人在船上走一个来回，盯住水面上那条质心竖线',
  playable: true,
  state: {p: 0, dir: 1, playing: true, mp: 60, mb: 150, L: 3.4, showCM: true},
  reset() {
    const s = this.state;
    s.p = 0; s.dir = 1; s.playing = true; s.mp = 60; s.mb = 150; s.L = 3.4; s.showCM = true;
  },
  meta() {
    return {
      title: '人走船退，系统质心不动',
      desc: '人站在船尾向船头走，船同时向后退。水平方向系统不受外力，总动量为零，质心位置保持不变。人质量越大、船越轻，船后退得越多；两者的位移与质量成反比。',
      formula: 'm s<sub>人</sub> = M s<sub>船</sub>，s<sub>人</sub> + s<sub>船</sub> = L',
      note: '用<b>质心不动</b>判断位移最方便：人相对船走 L，人实际前进 ML/(M+m)，船后退 mL/(M+m)。'
    };
  },
  Lrel() { return Math.max(.8, this.state.L - .9); },
  s1() { const s = this.state; return s.mb * this.Lrel() / (s.mp + s.mb); },
  s2() { const s = this.state; return -s.mp * this.Lrel() / (s.mp + s.mb); },
  xb0() { return .5; },
  cm() { const s = this.state; return (s.mp * (this.xb0() - this.Lrel() / 2) + s.mb * this.xb0()) / (s.mp + s.mb); },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.p += dt * .2 * s.dir;
      if (s.p > 1) { s.p = 1; s.dir = -1; }
      if (s.p < 0) { s.p = 0; s.dir = 1; }
    }
    setFrame(.5, .55, 15);
    base();

    const xb = this.xb0() + this.s2() * s.p;
    const xp = this.xb0() - this.Lrel() / 2 + this.s1() * s.p;
    const wl = -1.55;

    /* 水面 */
    for (let k = -7; k <= 7; k += .7) {
      line({x: k, y: wl}, {x: k + .34, y: wl + .06}, 'rgba(108,182,255,.28)', {w: 1.2});
    }
    line({x: -7.4, y: wl}, {x: 7.4, y: wl}, 'rgba(108,182,255,.22)', {w: 1});

    /* 码头 */
    rect({x: -7.2, y: wl - .55}, {x: -6.0, y: wl - .05}, 'rgba(120,140,160,.15)', 'rgba(170,200,215,.4)', {w: 1});
    sans('码头', X(-6.6), Y(wl - .85), 'rgba(160,190,205,.55)', 10);

    /* 船 */
    const b = s.L / 2;
    poly([{x: xb - b, y: wl + .38}, {x: xb + b, y: wl + .38},
      {x: xb + b * .82, y: wl - .42}, {x: xb - b * .82, y: wl - .42}],
      'rgba(30,50,66,.92)', '#5eead4', {w: 1.8});

    /* 人 */
    const py = wl + .38;
    circleAt({x: xp, y: py + 1.66}, .22, 'rgba(255,197,107,.85)', '#ffd79a', {w: 1.4});
    line({x: xp, y: py + 1.44}, {x: xp, y: py + .6}, 'rgba(255,197,107,.85)', {w: 3});
    line({x: xp - .28, y: py + .02}, {x: xp, y: py + .6}, 'rgba(255,197,107,.7)', {w: 2.4});
    line({x: xp + .28, y: py + .02}, {x: xp, y: py + .6}, 'rgba(255,197,107,.7)', {w: 2.4});
    line({x: xp - .26, y: py + 1.16}, {x: xp + .26, y: py + 1.16}, 'rgba(255,197,107,.8)', {w: 2.4});
    arrow({x: xp + .42, y: py + 1.66}, {x: xp + .42 + .7 * s.dir, y: py + 1.66}, 'rgba(255,215,154,.85)', {w: 2, head: 9});
    sans(f1(s.mp) + ' kg', X(xp), Y(py + 2.2), '#ffd79a', 10.5);
    sans(f1(s.mb) + ' kg', X(xb), Y(wl - .85), '#8fe9d8', 10.5);

    /* 位移标注 */
    const sx0 = this.xb0() - this.Lrel() / 2;
    line({x: sx0, y: py + 2.55}, {x: sx0 + this.s1() * s.p, y: py + 2.55}, 'rgba(255,197,107,.55)', {w: 1.4, dash: [5, 4]});
    arrow({x: sx0, y: py + 2.55}, {x: sx0 + this.s1() * s.p, y: py + 2.55}, '#ffc56b', {w: 1.6, head: 9});
    sans('人 ' + f1(this.s1() * s.p) + ' m', X(sx0 + this.s1() * s.p / 2), Y(py + 2.85), 'rgba(255,215,154,.9)', 10.5);

    const bx0 = this.xb0();
    arrow({x: bx0, y: wl - .95}, {x: bx0 + this.s2() * s.p, y: wl - .95}, '#5eead4', {w: 1.6, head: 9});
    sans('船 ' + f1(Math.abs(this.s2() * s.p)) + ' m', X(bx0 + this.s2() * s.p / 2), Y(wl - 1.25), 'rgba(143,233,216,.9)', 10.5);

    if (s.showCM) {
      const cm = this.cm();
      line({x: cm, y: -2.75}, {x: cm, y: 2.6}, 'rgba(255,255,255,.28)', {w: 1.2, dash: [6, 5]});
      dot({x: cm, y: 1.9}, '#ffffff', 4);
      sans('系统质心（不动）', X(cm), Y(2.25), 'rgba(230,240,245,.85)', 10.5);
    }
  },
  hud() {
    const s = this.state;
    return [
      {k: '人的位移', v: f1(this.s1() * s.p) + ' m', hi: true},
      {k: '船的位移', v: f1(Math.abs(this.s2() * s.p)) + ' m', hi: true},
      {k: '人的质量', v: f1(s.mp) + ' kg'},
      {k: '船的质量', v: f1(s.mb) + ' kg'},
      {k: '质心位移', v: '0.0 m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '人的质量 m / kg', 40, 90, 1, s.mp, v => String(Math.round(v)), v => s.mp = v);
    addSlider(el, '船的质量 M / kg', 80, 280, 5, s.mb, v => String(Math.round(v)), v => s.mb = v);
    addSlider(el, '船长 L / m', 2.4, 5, .1, s.L, v => f1(v), v => s.L = v);
    addToggle(el, '显示质心位置', s.showCM, v => s.showCM = v);
    addBtn(el, '人回到船尾', () => { s.p = 0; s.dir = 1; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
