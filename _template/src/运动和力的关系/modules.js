/* ============================================================
   必修第一册 · 第 4 章 运动和力的关系
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

function cart(x, y, color, label, w) {
  const hw = (w || 1.3) / 2;
  rect({x: x - hw, y: y - .16}, {x: x + hw, y: y + .26}, 'rgba(12,24,38,.94)', color, {w: 1.7});
  circleAt({x: x - hw * .55, y: y - .17}, .12, '#08111c', color, {w: 1.3});
  circleAt({x: x + hw * .55, y: y - .17}, .12, '#08111c', color, {w: 1.3});
  if (label) sans(label, X(x), Y(y + .62), color, 11.5);
}

/* ---------- 01 牛顿第一定律与惯性 ---------- */
MODULES.push({
  key: 'inertia', tab: '01', name: '惯性与定律', en: "NEWTON'S FIRST LAW", blurb: '力不是维持运动',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '把动摩擦因数调到 0，小车将一直运动下去',
  playable: true,
  state: {x: -5.2, v: 6, v0: 6, mu: .08, t: 0, s: 0, playing: true, showV: true, ideal: false},
  reset() {
    const s = this.state;
    s.x = -5.2; s.v = 6; s.v0 = 6; s.mu = .08; s.t = 0; s.s = 0;
    s.playing = true; s.showV = true; s.ideal = false;
  },
  meta() {
    return {
      title: '力不是维持运动的原因',
      desc: '给小车一个初速度后不再推它，地面越光滑，速度减小得越慢。把摩擦完全去掉，小车将保持原来的速度一直运动下去——这就是牛顿第一定律所描述的理想情况。',
      formula: '一切物体总保持匀速直线运动状态或静止状态',
      note: '惯性是物体的固有属性，<b>只与质量有关</b>；力是改变运动状态的原因，不是维持运动的原因。'
    };
  },
  acc() { return this.state.ideal ? 0 : -this.state.mu * 9.8; },
  draw(dt) {
    const s = this.state, a = this.acc();
    if (s.playing) {
      s.t += dt;
      s.v = Math.max(0, s.v + a * dt);
      const dx = s.v * dt;
      s.x += dx;
      s.s += dx;
      if (s.x > 5.4) s.x = -5.6;
    }
    setFrame(.5, .55, 13);
    base();

    const gy = -.9;
    ground(gy, 'rgba(150,190,205,.5)');
    if (!s.ideal && s.mu > .01) {
      for (let k = -5.7; k < 6; k += .42) {
        line({x: k, y: gy}, {x: k + .16, y: gy + .1 + s.mu * .3}, 'rgba(150,190,205,.24)', {w: 1});
      }
    }
    for (let d = 0; d <= 10; d += 2) {
      const wx = -5.6 + d;
      if (wx < 5.9) {
        line({x: wx, y: gy}, {x: wx, y: gy - .16}, 'rgba(198,222,232,.3)', {w: 1});
        sans(d + ' m', X(wx), Y(gy - .42), 'rgba(160,190,205,.55)', 9);
      }
    }

    cart(s.x, gy, '#ffc56b', '');
    if (s.showV && s.v > .05) {
      arrow({x: s.x, y: gy + .75}, {x: s.x + s.v * .22, y: gy + .75}, '#6cb6ff', {w: 2.8, head: 12});
      sans('v = ' + f1(s.v) + ' m/s', X(s.x + s.v * .11), Y(gy + 1.1), '#9ecbff', 11.5);
    }
    if (s.v > .05) {
      const fl = clamp(s.mu * 9.8 * 8, .3, 1.5);
      if (!s.ideal && s.mu > .01) {
        arrow({x: s.x - .25, y: gy - .05}, {x: s.x - .25 - fl, y: gy - .05}, '#ff8fab', {w: 2.4, head: 11});
        if (s.x - .55 - fl > -6.1) sans('f', X(s.x - .55 - fl / 2), Y(gy - .34), '#ffb3c6', 11);
      }
    }

    sans(s.ideal ? '理想光滑面：速度保持不变' : '有摩擦：速度均匀减小',
      X(-5.7), Y(3.55), s.ideal ? 'rgba(126,236,214,.95)' : 'rgba(255,215,150,.9)', 12.5, 'left');
    math('a = −μg', X(-5.7), Y(2.8), '#ffe0a8', 17, 'left');
    sans('μ = ' + f2(s.ideal ? 0 : s.mu), X(3.3), Y(2.6), '#ffd79a', 13, 'left');
    sans('a = ' + f1(a) + ' m/s²', X(3.3), Y(2.0), '#ffb3c6', 13, 'left');
    sans('v = ' + f1(s.v) + ' m/s', X(3.3), Y(1.4), '#9ecbff', 13, 'left');
    sans('滑行距离 ' + f1(s.s) + ' m', X(3.3), Y(.85), 'rgba(205,225,235,.9)', 12, 'left');
    sans('若 μ = 0，小车永远匀速前进', X(3.3), Y(.15), 'rgba(160,200,210,.68)', 10.5, 'left');
  },
  hud() {
    const s = this.state, a = this.acc();
    return [
      {k: '速度 v', v: f1(s.v) + ' m/s', hi: true},
      {k: '加速度 a', v: f1(a) + ' m/s²', hi: true},
      {k: '已滑行', v: f1(s.s) + ' m'},
      {k: '动摩擦因数', v: f2(s.ideal ? 0 : s.mu)},
      {k: '时间 t', v: f1(s.t) + ' s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初速度 v₀ / (m/s)', 2, 10, .5, s.v0, v => f1(v), v => { s.v0 = v; });
    addSlider(el, '动摩擦因数 μ', 0, .5, .01, s.mu, v => f2(v), v => s.mu = v);
    addToggle(el, '理想光滑面（μ = 0）', s.ideal, v => s.ideal = v);
    addToggle(el, '显示速度矢量', s.showV, v => s.showV = v);
    addBtn(el, '重新出发', () => {
      s.x = -5.2; s.v = s.v0; s.t = 0; s.s = 0;
    }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 牛顿第二定律 ---------- */
MODULES.push({
  key: 'second', tab: '02', name: '牛顿第二定律', en: "NEWTON'S SECOND LAW", blurb: 'a 与 F、m 的关系',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '保持质量不变增大拉力，比较 a–F 图线斜率的变化',
  playable: true,
  state: {F: 8, m: 2, t: 0, v: 0, x: -5.2, playing: true, showA: true, showGraph: true},
  reset() { const s = this.state; s.F = 8; s.m = 2; s.t = 0; s.v = 0; s.x = -5.2; s.playing = true; s.showA = true; s.showGraph = true; },
  meta() {
    return {
      title: '加速度与合外力成正比、与质量成反比',
      desc: '在光滑水平面上，小车受到的水平拉力就是合外力。保持质量不变，拉力越大加速度越大；保持拉力不变，质量越大加速度越小。a–F 图线是一条过原点的直线，斜率等于 1/m。',
      formula: 'F = ma，a = F/m',
      note: 'F 是<b>合外力</b>，方向与加速度方向一致。质量是惯性大小的量度，同一力下质量越大越难改变运动状态。'
    };
  },
  acc() { return this.state.F / this.state.m; },
  draw(dt) {
    const s = this.state, a = this.acc();
    if (s.playing) {
      s.t += dt;
      s.v += a * dt * .8;
      s.x += s.v * dt * .8;
      if (s.x > 5.3) { s.x = -5.3; s.v = 0; s.t = 0; }
    }
    setFrame(.5, .55, 13);
    base();

    const gy = 1.55;
    ground(gy, 'rgba(150,190,205,.45)');
    sans('光滑水平面', X(-5.5), Y(gy - .35), 'rgba(160,200,210,.6)', 10, 'left');
    cart(s.x, gy, '#6cb6ff', '');

    if (s.F > .1) {
      arrow({x: s.x + .55, y: gy + .5}, {x: s.x + .55 + Math.min(2.4, s.F * .12), y: gy + .5}, '#ff8fab', {w: 2.8, head: 12});
      sans('F = ' + f1(s.F) + ' N', X(s.x + .55), Y(gy + .85), '#ffb3c6', 11.5);
    }
    if (s.showA && a > .05) {
      arrow({x: s.x, y: gy + .95}, {x: s.x + Math.min(2.2, a * .2), y: gy + .95}, '#ffc56b', {w: 2.6, head: 11});
      sans('a = ' + f1(a) + ' m/s²', X(s.x), Y(gy + 1.3), '#ffd79a', 11.5);
    }
    if (s.v > .05) {
      arrow({x: s.x, y: gy + .18}, {x: s.x + Math.min(1.8, s.v * .16), y: gy + .18}, '#5eead4', {w: 2.2, head: 10});
      sans('v = ' + f1(s.v), X(s.x), Y(gy - .02), '#8fe9d8', 10.5);
    }

    if (s.showGraph) {
      const gx0 = -3.6, gx1 = 2.6, gy0 = -2.85, gy1 = .35;
      const mapX = q => gx0 + (q / 20) * (gx1 - gx0);
      const mapY = q => gy0 + (q / 10) * (gy1 - gy0);
      axisBox(gx0, gx1, gy0, gy1, 'F / N', 'a / (m/s²)');
      for (let q = 0; q <= 20; q += 5) {
        const wx = mapX(q);
        line({x: wx, y: gy0}, {x: wx, y: gy0 - .07}, 'rgba(198,222,232,.32)', {w: 1});
        if (q > 0) sans(String(q), X(wx), Y(gy0) + 13, 'rgba(160,190,205,.65)', 9.5);
      }
      for (let q = 0; q <= 10; q += 2) {
        const wy = mapY(q);
        line({x: gx0 - .1, y: wy}, {x: gx0, y: wy}, 'rgba(198,222,232,.3)', {w: 1});
        sans(String(q), X(gx0) - 8, Y(wy), 'rgba(160,190,205,.65)', 9.5, 'right');
      }
      line({x: gx0, y: gy0}, {x: mapX(20), y: mapY(20 / s.m)}, 'rgba(108,182,255,.45)', {w: 1.4, dash: [5, 5]});
      line({x: gx0, y: gy0}, {x: mapX(Math.min(20, 10 * s.m)), y: mapY(Math.min(10, 20 / s.m))},
        'rgba(108,182,255,.95)', {w: 2.6, glow: 7});
      dot({x: mapX(s.F), y: mapY(Math.min(10, a))}, '#eaf4ff', 5.4);
      sans('斜率 = 1/m = ' + f2(1 / s.m), X(gx1), Y(gy1) + 16, 'rgba(150,235,215,.9)', 11, 'right');
    }

    math('F = ma', X(3.0), Y(2.55), '#cfe8ff', 17, 'left');
    sans('m = ' + f1(s.m) + ' kg', X(3.0), Y(1.95), 'rgba(205,225,235,.9)', 12.5, 'left');
    sans('F = ' + f1(s.F) + ' N', X(3.0), Y(1.4), '#ffb3c6', 12.5, 'left');
    sans('a = ' + f1(a) + ' m/s²', X(3.0), Y(.8), '#ffd79a', 14, 'left');
    sans('v = ' + f1(s.v) + ' m/s', X(3.0), Y(.2), '#8fe9d8', 12, 'left');
    sans('改变 m，图线斜率随之改变', X(3.0), Y(-.55), 'rgba(160,200,210,.68)', 10.5, 'left');
  },
  hud() {
    const s = this.state, a = this.acc();
    return [
      {k: '拉力 F', v: f1(s.F) + ' N', hi: true},
      {k: '质量 m', v: f1(s.m) + ' kg'},
      {k: '加速度 a', v: f1(a) + ' m/s²', hi: true},
      {k: '速度 v', v: f1(s.v) + ' m/s'},
      {k: '位移 x', v: f1(s.x + 5.2) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '水平拉力 F / N', 0, 20, .5, s.F, v => f1(v), v => s.F = v);
    addSlider(el, '小车质量 m / kg', 1, 10, .5, s.m, v => f1(v), v => s.m = v);
    addToggle(el, '显示加速度矢量', s.showA, v => s.showA = v);
    addToggle(el, '显示 a–F 图象', s.showGraph, v => s.showGraph = v);
    addBtn(el, '重新开始', () => { s.x = -5.3; s.v = 0; s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 牛顿第三定律 ---------- */
MODULES.push({
  key: 'third', tab: '03', name: '牛顿第三定律', en: "NEWTON'S THIRD LAW", blurb: '作用力与反作用力',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '改变两车质量，作用力始终等大反向，加速度却不同',
  playable: true,
  state: {t: 0, playing: false, m1: 2, m2: 3, F: 12, x1: -1, x2: 1, v1: 0, v2: 0, showPair: true, showV: true, hold: 0},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = false; s.m1 = 2; s.m2 = 3; s.F = 12;
    s.x1 = -1; s.x2 = 1; s.v1 = 0; s.v2 = 0; s.showPair = true; s.showV = true; s.hold = 0;
  },
  meta() {
    return {
      title: '作用力与反作用力等大反向',
      desc: '两辆小车之间夹着被压缩的弹簧，松手后两车同时被推开。弹簧对两车的力大小相等、方向相反、作用在同一直线上，但质量大的车加速度小、速度变化慢，所以运动状态不同。',
      formula: 'F<sub>12</sub> = −F<sub>21</sub>',
      note: '作用力与反作用力<b>同时产生、同时消失</b>，分别作用在两个物体上，不能相互抵消。'
    };
  },
  acc1() { return this.state.F / this.state.m1; },
  acc2() { return this.state.F / this.state.m2; },
  draw(dt) {
    const s = this.state, contact = s.t < .45;
    if (s.playing) {
      s.t += dt;
      if (contact) {
        s.v1 -= this.acc1() * dt;
        s.v2 += this.acc2() * dt;
      }
      s.x1 += s.v1 * dt;
      s.x2 += s.v2 * dt;
      if (s.x1 < -5.4 || s.x2 > 5.4) {
        s.hold += dt;
        if (s.hold > .8) { s.x1 = -1; s.x2 = 1; s.v1 = 0; s.v2 = 0; s.t = 0; s.hold = 0; }
      }
    }
    setFrame(.5, .55, 13);
    base();

    const gy = -.1;
    ground(gy, 'rgba(150,190,205,.5)');
    sans('光滑水平面', X(-5.6), Y(gy - .4), 'rgba(160,200,210,.6)', 10, 'left');

    if (s.x2 - s.x1 < 3.2) {
      spring({x: s.x1 + .55, y: gy + .3}, {x: s.x2 - .55, y: gy + .3}, 10, '#b49cff', {amp: .1, w: 2});
    }
    cart(s.x1, gy, '#5eead4', 'A  ' + f1(s.m1) + ' kg', 1.1);
    cart(s.x2, gy, '#ffc56b', 'B  ' + f1(s.m2) + ' kg', 1.1);

    if (s.showPair && contact) {
      const len = clamp(s.F * .07, .6, 2.2);
      arrow({x: s.x1 - .55, y: gy + .55}, {x: s.x1 - .55 - len, y: gy + .55}, '#ff8fab', {w: 3, head: 12});
      arrow({x: s.x2 + .55, y: gy + .55}, {x: s.x2 + .55 + len, y: gy + .55}, '#ff8fab', {w: 3, head: 12});
      sans('F₁₂ = ' + f1(s.F) + ' N', X(s.x1 - .55 - len / 2), Y(gy + .9), '#ffb3c6', 11);
      sans('F₂₁ = ' + f1(s.F) + ' N', X(s.x2 + .55 + len / 2), Y(gy + .9), '#ffb3c6', 11);
      line({x: s.x1, y: gy - .55}, {x: s.x2, y: gy - .55}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 4]});
      sans('同一直线', X((s.x1 + s.x2) / 2), Y(gy - .78), 'rgba(190,215,225,.55)', 10);
    } else if (s.showPair) {
      sans('弹簧已分离：两车各自匀速', X(0), Y(gy + .9), 'rgba(190,215,225,.7)', 11.5);
    }

    if (s.showV) {
      if (Math.abs(s.v1) > .05) {
        arrow({x: s.x1, y: gy + 1.4}, {x: s.x1 - Math.min(2, Math.abs(s.v1) * .15), y: gy + 1.4}, '#5eead4', {w: 2.4, head: 11});
        sans('v_A = ' + f1(Math.abs(s.v1)), X(s.x1 - .5), Y(gy + 1.7), '#8fe9d8', 10.5);
      }
      if (Math.abs(s.v2) > .05) {
        arrow({x: s.x2, y: gy + 1.4}, {x: s.x2 + Math.min(2, Math.abs(s.v2) * .15), y: gy + 1.4}, '#ffc56b', {w: 2.4, head: 11});
        sans('v_B = ' + f1(Math.abs(s.v2)), X(s.x2 + .5), Y(gy + 1.7), '#ffd79a', 10.5);
      }
    }

    math('F₁₂ = −F₂₁', X(-5.6), Y(3.6), '#ffc9d8', 17, 'left');
    sans('a_A = F/m_A = ' + f1(this.acc1()) + ' m/s²', X(2.5), Y(2.9), '#8fe9d8', 12, 'left');
    sans('a_B = F/m_B = ' + f1(this.acc2()) + ' m/s²', X(2.5), Y(2.35), '#ffd79a', 12, 'left');
    sans('力的大小相同，加速度与质量成反比', X(2.5), Y(1.7), 'rgba(190,215,225,.75)', 10.5, 'left');
    sans(s.t === 0 && !s.playing ? '点击「松手」释放弹簧' : contact ? '弹簧正在推开两车' : '分离后各自匀速运动',
      X(2.5), Y(1.15), 'rgba(160,200,210,.68)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: 'A 受力', v: f1(s.t < .45 ? s.F : 0) + ' N'},
      {k: 'B 受力', v: f1(s.t < .45 ? s.F : 0) + ' N', hi: true},
      {k: 'A 加速度', v: f1(s.t < .45 ? this.acc1() : 0) + ' m/s²', hi: true},
      {k: 'B 加速度', v: f1(s.t < .45 ? this.acc2() : 0) + ' m/s²'},
      {k: 'A 速度', v: f1(Math.abs(s.v1)) + ' m/s'},
      {k: 'B 速度', v: f1(Math.abs(s.v2)) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, 'A 车质量 m_A / kg', 1, 6, .5, s.m1, v => f1(v), v => s.m1 = v);
    addSlider(el, 'B 车质量 m_B / kg', 1, 6, .5, s.m2, v => f1(v), v => s.m2 = v);
    addSlider(el, '相互作用力 F / N', 4, 24, 1, s.F, v => f1(v), v => s.F = v);
    addToggle(el, '显示相互作用力', s.showPair, v => s.showPair = v);
    addToggle(el, '显示速度矢量', s.showV, v => s.showV = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 松手' }
});

/* ---------- 04 超重与失重 ---------- */
MODULES.push({
  key: 'weightless', tab: '04', name: '超重与失重', en: 'APPARENT WEIGHT', blurb: '电梯里的视重',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '调节电梯加速度，比较台秤示数与物体重力',
  playable: true,
  state: {m: 50, a: 2, y: 0, v: 2, t: 0, playing: true, showN: true, showG: true},
  reset() { const s = this.state; s.m = 50; s.a = 2; s.y = 0; s.v = 2; s.t = 0; s.playing = true; s.showN = true; s.showG = true; },
  meta() {
    return {
      title: '超重与失重看的是加速度方向',
      desc: '电梯里的台秤示数等于物体受到的支持力。加速度向上时，支持力大于重力，出现超重；加速度向下时，支持力小于重力，出现失重；自由下落时示数为零，即完全失重。',
      formula: 'N = m(g + a)，G = mg',
      note: '超重、失重时物体<b>重力并没有改变</b>，改变的只是台秤的示数。加速度向下且等于 g 时示数为零。'
    };
  },
  N() { return this.state.m * (9.8 + this.state.a); },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      s.y += s.v * dt * .55;
      s.v += s.a * dt * .55;
      if (s.y > 1.5 || s.y < -1.5) { s.y = 0; s.v = 2; s.t = 0; }
    }
    setFrame(.5, .55, 13);
    base();

    line({x: -2.3, y: -3.05}, {x: -2.3, y: 3.3}, 'rgba(150,190,205,.4)', {w: 2});
    line({x: 2.3, y: -3.05}, {x: 2.3, y: 3.3}, 'rgba(150,190,205,.4)', {w: 2});
    for (let yy = -2.9; yy < 3.3; yy += .5) {
      line({x: -2.3, y: yy}, {x: -2.6, y: yy}, 'rgba(150,190,205,.2)', {w: 1});
      line({x: 2.3, y: yy}, {x: 2.6, y: yy}, 'rgba(150,190,205,.2)', {w: 1});
    }
    sans('电梯井', X(-2.55), Y(3.55), 'rgba(160,200,210,.6)', 10, 'right');

    const cy = s.y, hw = 1.35, hh = 1.0;
    rect({x: -hw, y: cy - hh}, {x: hw, y: cy + hh}, 'rgba(20,32,48,.55)', 'rgba(150,200,220,.65)', {w: 2});
    line({x: 0, y: cy + hh}, {x: 0, y: cy + hh + .35}, 'rgba(170,205,225,.6)', {w: 1.6});
    sans('电梯', X(0), Y(cy + hh + .6), 'rgba(180,210,225,.7)', 10.5);

    const sy = cy - hh + .12;
    rect({x: -.85, y: sy}, {x: .85, y: sy + .16}, 'rgba(120,150,190,.25)', 'rgba(180,210,230,.6)', {w: 1.2});
    const by = sy + .16 + .5;
    rect({x: -.62, y: by - .5}, {x: .62, y: by + .5}, 'rgba(94,234,212,.16)', '#5eead4', {w: 1.8});
    sans(s.m + ' kg', X(0), Y(by), '#eafff8', 11.5);

    const N = this.N(), G = s.m * 9.8;
    if (s.showN && N > .5) {
      arrow({x: .95, y: by - .2}, {x: .95, y: by - .2 + clamp(N * .012, .2, 1.5)}, '#ff8fab', {w: 2.6, head: 11});
      sans('N', X(1.15), Y(by + .3), '#ffb3c6', 12, 'left');
    }
    if (s.showG) {
      arrow({x: -.95, y: by - .2}, {x: -.95, y: by - .2 - clamp(G * .012, .2, 1.5)}, '#ffc56b', {w: 2.6, head: 11});
      sans('G', X(-1.15), Y(by - .75), '#ffd79a', 12, 'right');
    }

    const state = s.a > .15 ? '超重' : s.a < -.15 ? (Math.abs(s.a + 9.8) < .3 ? '完全失重' : '失重') : '正常';
    const col = s.a > .15 ? '#ff8fab' : s.a < -.15 ? '#5eead4' : 'rgba(200,220,230,.9)';
    rect({x: 2.9, y: 2.0}, {x: 5.9, y: 3.1}, 'rgba(255,255,255,.03)', 'rgba(170,200,225,.3)', {w: 1.2});
    sans('台秤示数', X(3.05), Y(2.8), 'rgba(180,205,220,.8)', 11, 'left');
    sans(f1(Math.max(0, N)) + ' N', X(3.05), Y(2.28), col, 20, 'left');

    math('N = m(g + a)', X(2.9), Y(1.25), '#c8f7e8', 15, 'left');
    sans('G = mg = ' + f1(G) + ' N', X(2.9), Y(.6), '#ffd79a', 12.5, 'left');
    sans('a = ' + f1(s.a) + ' m/s²', X(2.9), Y(.05), 'rgba(205,225,235,.9)', 12.5, 'left');
    sans('状态：' + state, X(2.9), Y(-.62), col, 15, 'left');
    sans('N/G = ' + f2(Math.max(0, N) / Math.max(1, G)), X(2.9), Y(-1.2), 'rgba(180,210,225,.8)', 11.5, 'left');
    sans(Math.abs(s.a) < .15 ? 'a = 0：示数等于重力' : s.a > 0 ? 'a 向上：支持力大于重力' : 'a 向下：支持力小于重力',
      X(2.9), Y(-1.9), 'rgba(160,200,210,.68)', 10.5, 'left');
  },
  hud() {
    const s = this.state, N = Math.max(0, this.N()), G = s.m * 9.8;
    return [
      {k: '加速度 a', v: f1(s.a) + ' m/s²', hi: true},
      {k: '台秤示数 N', v: f1(N) + ' N', hi: true},
      {k: '重力 G', v: f1(G) + ' N'},
      {k: '视重比 N/G', v: f2(N / Math.max(1, G))},
      {k: '状态', v: s.a > .15 ? '超重' : s.a < -.15 ? '失重' : '正常'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电梯加速度 a / (m/s²)', -12, 12, .2, s.a, v => f1(v), v => s.a = v);
    addSlider(el, '物体质量 m / kg', 10, 80, 5, s.m, v => f1(v), v => s.m = v);
    addToggle(el, '显示支持力矢量', s.showN, v => s.showN = v);
    addToggle(el, '显示重力矢量', s.showG, v => s.showG = v);
    addBtn(el, '完全失重（a = −g）', () => { s.a = -9.8; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 连接体与传送带 ---------- */
MODULES.push({
  key: 'belt', tab: '05', name: '连接体与传送带', en: 'SYSTEM & BELT', blurb: '整体法与隔离法',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变悬挂物质量与动摩擦因数，比较整体法与隔离法得到的 a 与 T',
  playable: true,
  state: {t: 0, playing: true, m1: 2, m2: 3, mu: .3, vb: 2, showF: true, s: 0, v: 0},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.m1 = 2; s.m2 = 3; s.mu = .3; s.vb = 2; s.showF = true; s.s = 0; s.v = 0; },
  meta() {
    return {
      title: '连接体：先用整体法求加速度，再隔离求张力',
      desc: '物块 A 放在向左运动的传送带上，通过定滑轮与悬挂物块 B 相连。把 A、B 看作整体可求加速度，再隔离任一物体就能求出绳的张力。传送带速度只影响相对滑动，不改变滑动摩擦力的大小。',
      formula: 'a = (m<sub>B</sub>g − μm<sub>A</sub>g)/(m<sub>A</sub> + m<sub>B</sub>)，T = m<sub>A</sub>a + μm<sub>A</sub>g',
      note: '整体法只关心中间绳的<b>内力</b>不出现；要求张力必须隔离。μ 足够大时系统保持静止。'
    };
  },
  acc() {
    const s = this.state;
    return Math.max(0, (s.m2 * 9.8 - s.mu * s.m1 * 9.8) / (s.m1 + s.m2));
  },
  T() {
    const s = this.state;
    return s.m1 * this.acc() + s.mu * s.m1 * 9.8;
  },
  draw(dt) {
    const s = this.state, a = this.acc();
    if (s.playing) {
      s.t += dt;
      if (a > 0) {
        s.v = a * s.t;
        s.s = .5 * a * s.t * s.t;
        if (s.s > 1.35) { s.t = 0; s.s = 0; s.v = 0; }
      }
    }
    setFrame(.5, .52, 13);
    base();

    const topY = .4, botY = -.3, x0 = -5.4, x1 = 1.6;
    line({x: x0, y: topY}, {x: x1, y: topY}, 'rgba(180,156,255,.75)', {w: 3});
    line({x: x0, y: botY}, {x: x1, y: botY}, 'rgba(180,156,255,.55)', {w: 3});
    circleAt({x: x0, y: (topY + botY) / 2}, .35, 'rgba(120,150,190,.15)', 'rgba(180,156,255,.7)', {w: 1.6});
    circleAt({x: x1, y: (topY + botY) / 2}, .35, 'rgba(120,150,190,.15)', 'rgba(180,156,255,.7)', {w: 1.6});

    const len = x1 - x0;
    const off = (s.vb * s.t) % len;
    for (let k = 0; k < 22; k++) {
      let wx = x0 + ((k * .8 - off) % len + len) % len;
      line({x: wx, y: topY - .1}, {x: wx, y: topY + .1}, 'rgba(220,210,255,.45)', {w: 1.2});
      let wx2 = x0 + ((k * .8 + off) % len + len) % len;
      line({x: wx2, y: botY - .1}, {x: wx2, y: botY + .1}, 'rgba(220,210,255,.28)', {w: 1.2});
    }
    sans('传送带向左运动 v_带 = ' + f1(s.vb) + ' m/s', X(x0 + .4), Y(botY - .55), 'rgba(190,180,240,.85)', 11, 'left');

    const bx = -4.6 + s.s;
    const by = topY + .45;
    rect({x: bx - .55, y: topY}, {x: bx + .55, y: by + .35}, 'rgba(30,40,64,.95)', '#b49cff', {w: 1.8});
    sans('A', X(bx), Y(by + .05), '#e6ddff', 12);

    const px = x1, py = topY + .62;
    line({x: bx + .55, y: topY + .3}, {x: px, y: topY + .3}, 'rgba(210,225,235,.7)', {w: 1.2});
    circleAt({x: px, y: py}, .22, '#0d1626', '#b49cff', {w: 1.6});
    const hangX = px + .3;
    line({x: px, y: py}, {x: hangX, y: py}, 'rgba(210,225,235,.7)', {w: 1.2});
    line({x: hangX, y: py}, {x: hangX, y: -1.0 - s.s}, 'rgba(210,225,235,.7)', {w: 1.2});
    const m2y = -1.35 - s.s;
    rect({x: hangX - .3, y: m2y - .3}, {x: hangX + .3, y: m2y + .3}, 'rgba(30,40,64,.95)', '#ffc56b', {w: 1.8});
    sans('B', X(hangX), Y(m2y), '#ffe6b8', 12);

    if (s.showF) {
      const fLen = clamp(s.mu * s.m1 * 9.8 * .06, .2, 1.4);
      const tLen = clamp(this.T() * .045, .2, 1.6);
      if (a > 0) {
        arrow({x: bx - .55, y: by + .1}, {x: bx - .55 - fLen, y: by + .1}, '#ff8fab', {w: 2.4, head: 11});
        sans('f = ' + f1(s.mu * s.m1 * 9.8) + ' N', X(bx - .55 - fLen / 2), Y(by + .4), '#ffb3c6', 10.5);
      }
      arrow({x: bx + .55, y: by + .1}, {x: bx + .55 + tLen, y: by + .1}, '#5eead4', {w: 2.4, head: 11});
      sans('T = ' + f1(this.T()) + ' N', X(bx + .55 + tLen / 2), Y(by + .4), '#8fe9d8', 10.5);
    }

    math('a = (m_Bg − μm_Ag)/(m_A + m_B)', X(-5.7), Y(3.7), '#ded6ff', 14, 'left');
    sans('a = ' + f1(a) + ' m/s²', X(2.6), Y(2.9), '#ffd79a', 13, 'left');
    sans('T = ' + f1(this.T()) + ' N', X(2.6), Y(2.35), '#8fe9d8', 13, 'left');
    sans('f = ' + f1(s.mu * s.m1 * 9.8) + ' N', X(2.6), Y(1.8), '#ffb3c6', 12, 'left');
    sans('s = ' + f2(s.s) + ' m，v = ' + f1(s.v) + ' m/s', X(2.6), Y(1.2), 'rgba(205,225,235,.9)', 11.5, 'left');
    sans(a > 0 ? 'A 相对带向右滑动，f 向左' : '摩擦力足够大，系统保持静止',
      X(2.6), Y(.5), 'rgba(160,200,210,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state, a = this.acc(), T = this.T();
    return [
      {k: '加速度 a', v: f1(a) + ' m/s²', hi: true},
      {k: '绳张力 T', v: f1(T) + ' N', hi: true},
      {k: '摩擦力 f', v: f1(s.mu * s.m1 * 9.8) + ' N'},
      {k: 'A 的位移', v: f2(s.s) + ' m'},
      {k: '传送带速度', v: f1(s.vb) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, 'A 的质量 m_A / kg', 1, 6, .5, s.m1, v => f1(v), v => { s.m1 = v; s.t = 0; s.s = 0; s.v = 0; });
    addSlider(el, 'B 的质量 m_B / kg', 1, 6, .5, s.m2, v => f1(v), v => { s.m2 = v; s.t = 0; s.s = 0; s.v = 0; });
    addSlider(el, '动摩擦因数 μ', 0, .6, .02, s.mu, v => f2(v), v => { s.mu = v; s.t = 0; s.s = 0; s.v = 0; });
    addSlider(el, '传送带速度 v_带 / (m/s)', 0, 6, .5, s.vb, v => f1(v), v => s.vb = v);
    addToggle(el, '显示摩擦力与张力', s.showF, v => s.showF = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
