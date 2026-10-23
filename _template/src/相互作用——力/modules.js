/* ============================================================
   必修第一册 · 第 3 章 相互作用——力
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

function block(x, y, w, h, color) {
  rect({x: x - w / 2, y: y - h / 2}, {x: x + w / 2, y: y + h / 2},
    'rgba(24,32,52,.94)', color, {w: 1.8});
}

/* ---------- 01 重力与重心 ---------- */
MODULES.push({
  key: 'weight', tab: '01', name: '重力与重心', en: 'GRAVITY', blurb: '重心与稳度',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '拖动方块改变重心位置，看它是否还落在支撑面内',
  state: {m: 5, cx: 0, showG: true, showPlumb: true},
  reset() { const s = this.state; s.m = 5; s.cx = 0; s.showG = true; s.showPlumb = true; },
  meta() {
    return {
      title: '重力作用在重心，稳度取决于支撑面',
      desc: '物体各部分都受重力，效果上可以看作集中在重心。把方块在支架上左右移动，重力作用线一旦越出支撑面，重力就产生翻转的力矩，物体倾倒。质量越大，重力越大，但重心位置不变。',
      formula: 'G = mg，g ≈ 9.8 N/kg',
      note: '重心<b>不一定在物体上</b>，例如均匀圆环的重心在圆心。支撑面越大、重心越低，物体越稳定。'
    };
  },
  G() { return this.state.m * 9.8; },
  draw() {
    const s = this.state;
    setFrame(.5, .52, 13);
    base();

    const top = -.5, half = 1.3;
    poly([{x: -half, y: top}, {x: half, y: top}, {x: .75, y: -2.6}, {x: -.75, y: -2.6}],
      'rgba(120,150,190,.12)', 'rgba(170,200,225,.5)', {w: 1.6});
    sans('支撑面', X(0), Y(-2.95), 'rgba(170,198,210,.7)', 11);
    line({x: -half, y: top}, {x: half, y: top}, s.showPlumb ? 'rgba(180,156,255,.9)' : 'rgba(180,156,255,.4)', {w: 2.2});

    const bw = 3.2, bh = 1.1, cy = top + bh / 2;
    block(s.cx, cy, bw, bh, 'rgba(180,156,255,.85)');
    dot({x: s.cx, y: cy}, '#ffd79a', 5);
    sans('重心 C', X(s.cx), Y(cy + .78), '#ffd79a', 11);

    const stable = Math.abs(s.cx) <= half;
    if (s.showPlumb) {
      line({x: s.cx, y: cy}, {x: s.cx, y: -3.0},
        stable ? 'rgba(180,156,255,.55)' : 'rgba(255,143,171,.9)', {w: 1.4, dash: [5, 5]});
    }
    if (s.showG) {
      const len = clamp(this.G() * .012, .6, 2.2);
      arrow({x: s.cx, y: cy}, {x: s.cx, y: cy - len}, '#ff8fab', {w: 3, head: 13});
      sans('G = ' + f1(this.G()) + ' N', X(s.cx) + 14, Y(cy - len * .55), '#ffb3c6', 12, 'left');
    }
    const nLen = clamp(this.G() * .012, .6, 2.2);
    arrow({x: 0, y: top - .02}, {x: 0, y: top + nLen * .7}, '#5eead4', {w: 2.4, head: 11});
    sans('N', X(0) - 12, Y(top + nLen * .45), '#8fe9d8', 12, 'right');

    sans(stable ? '重力作用线落在支撑面内：稳定' : '重力作用线越出支撑面：将翻倒',
      X(-5.7), Y(3.6), stable ? 'rgba(190,215,225,.85)' : 'rgba(255,143,171,.95)', 12, 'left');
    sans('m = ' + f1(s.m) + ' kg', X(3.8), Y(2.75), '#d9ceff', 13, 'left');
    sans('G = mg = ' + f1(this.G()) + ' N', X(3.8), Y(2.2), '#ffb3c6', 13, 'left');
    sans('重心偏移 ' + f1(Math.abs(s.cx) * 10) + ' cm', X(3.8), Y(1.6), 'rgba(190,215,225,.85)', 11.5, 'left');
    sans('支撑面半宽 13 cm', X(3.8), Y(1.1), 'rgba(190,215,225,.85)', 11.5, 'left');
    sans('拖动重心圆点平移方块', X(3.8), Y(.5), 'rgba(160,200,210,.65)', 10.5, 'left');

    const barW = 2.2;
    rect({x: 3.8, y: -2.4}, {x: 3.8 + barW, y: -2.1}, 'rgba(255,255,255,.05)', 'rgba(170,200,225,.3)', {w: 1});
    const frac = clamp(Math.abs(s.cx) / half, 0, 1);
    rect({x: 3.8, y: -2.4}, {x: 3.8 + barW * frac, y: -2.1},
      stable ? 'rgba(94,234,212,.55)' : 'rgba(255,143,171,.7)', null, {w: 0});
    sans('稳度', X(3.75), Y(-2.25), 'rgba(180,205,215,.75)', 10.5, 'right');
  },
  handles() { return [{id: 'c', x: this.state.cx, y: -.5 + 1.1 / 2}]; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.cx = clamp(q.x, -1.8, 1.8);
  },
  hud() {
    const s = this.state;
    return [
      {k: '质量 m', v: f1(s.m) + ' kg'},
      {k: '重力 G', v: f1(this.G()) + ' N', hi: true},
      {k: '重心偏移', v: f1(s.cx * 10) + ' cm', hi: true},
      {k: '支撑面半宽', v: f1(13) + ' cm'},
      {k: '稳定情况', v: Math.abs(s.cx) <= 1.3 ? '稳定' : '翻倒'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '质量 m / kg', .5, 20, .5, s.m, v => f1(v), v => s.m = v);
    addToggle(el, '显示重力矢量', s.showG, v => s.showG = v);
    addToggle(el, '显示重心垂线', s.showPlumb, v => s.showPlumb = v);
    addBtn(el, '重心回到中线', () => { s.cx = 0; }, 'ghost');
  }
});

/* ---------- 02 弹力与胡克定律 ---------- */
MODULES.push({
  key: 'hooke', tab: '02', name: '弹力', en: "HOOKE'S LAW", blurb: '形变产生弹力',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '拖动滑块改变弹簧形变量，比较不同劲度系数下的弹力',
  state: {xd: .05, k: 80, showF: true, showGraph: true},
  reset() { const s = this.state; s.xd = .05; s.k = 80; s.showF = true; s.showGraph = true; },
  meta() {
    return {
      title: '弹力的大小由形变量决定',
      desc: '弹簧被拉长（或压缩）后要恢复原状，对与之接触的物体产生弹力，方向总是指向恢复原状的方向。实验表明，弹性限度内弹力与形变量成正比，比值就是劲度系数 k。',
      formula: 'F = kx',
      note: 'x 是<b>形变量</b>，不是弹簧总长度。k 由弹簧本身决定，单位 N/m，k 越大弹簧越硬。'
    };
  },
  F() { return this.state.k * this.state.xd; },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 13);
    base();
    ground(-1.1, 'rgba(150,190,205,.4)');

    const wall = -5.4, L0 = 2.4, left = wall + L0 + s.xd * 10;
    rect({x: wall - .35, y: -1.1}, {x: wall, y: 1.6}, 'rgba(120,150,190,.18)', 'rgba(170,200,225,.55)', {w: 1.4});
    for (let yy = -1.0; yy < 1.6; yy += .35) {
      line({x: wall - .35, y: yy}, {x: wall - .08, y: yy + .18}, 'rgba(170,200,225,.4)', {w: 1});
    }
    sans('墙', X(wall - .2), Y(1.9), 'rgba(170,198,210,.75)', 11);

    spring({x: wall, y: .25}, {x: left, y: .25}, 12, '#5eead4', {amp: .17, w: 2});
    line({x: wall, y: .25}, {x: wall + .25, y: .25}, 'rgba(94,234,212,.9)', {w: 2});

    block(left + .45, .25, .9, 1.1, 'rgba(94,234,212,.85)');
    sans('滑块', X(left + .45), Y(.25), '#062018', 11.5);

    const F = this.F();
    if (s.showF && F > .2) {
      const len = clamp(F * .05, .25, 2.1);
      arrow({x: left + .45, y: .95}, {x: left + .45 - len, y: .95}, '#ff8fab', {w: 2.8, head: 12});
      sans('F = ' + f1(F) + ' N', X(left + .45 - len * .5), Y(1.25), '#ffb3c6', 11.5);
    }

    line({x: wall, y: -.45}, {x: left, y: -.45}, 'rgba(198,222,232,.3)', {w: 1, dash: [4, 4]});
    line({x: wall, y: -.3}, {x: wall, y: -.6}, 'rgba(198,222,232,.5)', {w: 1.2});
    line({x: left, y: -.3}, {x: left, y: -.6}, 'rgba(198,222,232,.5)', {w: 1.2});
    sans('x = ' + f1(s.xd * 100) + ' cm', X((wall + left) / 2), Y(-.75), '#9ecbff', 11.5);

    if (s.showGraph) {
      const gx0 = 2.7, gx1 = 5.9, gy0 = -2.5, gy1 = 2.5;
      const mapX = x => gx0 + (x / .15) * (gx1 - gx0);
      const mapY = q => gy0 + (q / 40) * (gy1 - gy0);
      axisBox(gx0, gx1, gy0, gy1, 'x / m', 'F / N');
      for (let xx = 0; xx <= .15; xx += .05) {
        const wx = mapX(xx);
        line({x: wx, y: gy0}, {x: wx, y: gy0 - .08}, 'rgba(198,222,232,.35)', {w: 1});
        sans(f2(xx), X(wx), Y(gy0) + 14, 'rgba(160,190,205,.7)', 9.5);
      }
      for (let q = 0; q <= 40; q += 10) {
        const wy = mapY(q);
        line({x: gx0 - .1, y: wy}, {x: gx0, y: wy}, 'rgba(198,222,232,.32)', {w: 1});
        sans(String(q), X(gx0) - 8, Y(wy), 'rgba(160,190,205,.7)', 9.5, 'right');
      }
      line({x: mapX(0), y: mapY(0)}, {x: mapX(.15), y: mapY(s.k * .15)}, 'rgba(94,234,212,.35)', {w: 1.4, dash: [5, 5]});
      line({x: mapX(0), y: mapY(0)}, {x: mapX(s.xd), y: mapY(F)}, 'rgba(94,234,212,.95)', {w: 2.6, glow: 7});
      dot({x: mapX(s.xd), y: mapY(F)}, '#eafff8', 5.4);
      segLabel({x: mapX(0), y: mapY(0)}, {x: mapX(.15), y: mapY(s.k * .15)},
        '斜率 = k', 'rgba(255,215,150,.95)', .7, 18, 11.5);
    }

    math('F = kx', X(-4.4), Y(2.65), '#b8fff0', 18, 'left');
    sans('k = ' + f1(s.k) + ' N/m', X(-4.4), Y(1.95), '#8fe9d8', 13, 'left');
    sans('x = ' + f1(s.xd * 100) + ' cm = ' + f2(s.xd) + ' m', X(-4.4), Y(1.35), 'rgba(190,225,230,.9)', 11.5, 'left');
    sans('F = ' + f1(F) + ' N', X(-4.4), Y(.8), '#ffd79a', 14, 'left');
    sans('弹力方向总是指向恢复原状的方向', X(-4.4), Y(-1.7), 'rgba(160,200,210,.68)', 10.5, 'left');
  },
  handles() {
    return [{id: 'b', x: -5.4 + 2.4 + this.state.xd * 10 + .45, y: .25}];
  },
  drag(id, p) {
    const q = clampPt(p);
    this.state.xd = clamp((q.x - .45 + 3.0) / 10, 0, .15);
  },
  hud() {
    const s = this.state;
    return [
      {k: '形变量 x', v: f1(s.xd * 100) + ' cm', hi: true},
      {k: '弹力 F', v: f1(this.F()) + ' N', hi: true},
      {k: '劲度系数 k', v: f1(s.k) + ' N/m'},
      {k: '弹性势能', v: f2(.5 * s.k * s.xd * s.xd) + ' J'},
      {k: '弹簧原长', v: '24.0 cm'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '劲度系数 k / (N/m)', 20, 200, 5, s.k, v => f1(v), v => s.k = v);
    addToggle(el, '显示弹力矢量', s.showF, v => s.showF = v);
    addToggle(el, '显示 F–x 图象', s.showGraph, v => s.showGraph = v);
    addBtn(el, '恢复原长', () => { s.xd = 0; }, 'ghost');
  }
});

/* ---------- 03 摩擦力 ---------- */
MODULES.push({
  key: 'fric', tab: '03', name: '摩擦力', en: 'FRICTION', blurb: '静与动的分界',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '增大拉力，观察摩擦力先随拉力增大、后突然减小并保持不变',
  state: {F: 4, m: 4, mu: .4, showF: true, showGraph: true},
  reset() { const s = this.state; s.F = 4; s.m = 4; s.mu = .4; s.showF = true; s.showGraph = true; },
  meta() {
    return {
      title: '静摩擦有上限，滑动摩擦近似恒定',
      desc: '用力推箱子，箱子不动时静摩擦力总与推力等大反向；推力超过最大静摩擦力后箱子开始滑动，此后摩擦力变为滑动摩擦力，大小由动摩擦因数与正压力决定，与推力无关。',
      formula: 'f<sub>m</sub> = μ<sub>s</sub>N，f = μ<sub>k</sub>N，N = mg',
      note: '静摩擦力大小由<b>平衡条件</b>决定，不能用 f = μN 直接算；最大静摩擦力略大于滑动摩擦力。'
    };
  },
  N() { return this.state.m * 9.8; },
  fmax() { return this.state.mu * this.N(); },
  fk() { return .8 * this.state.mu * this.N(); },
  fnow() { return this.state.F <= this.fmax() ? this.state.F : this.fk(); },
  draw() {
    const s = this.state;
    setFrame(.5, .52, 13);
    base();

    const gy = -.7, bx = -3.5, bw = 1.8, bh = 1.2;
    ground(gy, 'rgba(150,190,205,.5)');
    if (s.mu > .02) {
      for (let k = -5.4; k < -.9; k += .45) {
        const hgt = .12 + s.mu * .35;
        line({x: k, y: gy}, {x: k + .18, y: gy + hgt}, 'rgba(150,190,205,.28)', {w: 1});
      }
    }
    block(bx, gy + bh / 2, bw, bh, '#ffd79a');

    const F = s.F, f = this.fnow();
    const moving = F > this.fmax();

    if (s.showF) {
      const lf = clamp(F * .045, 0, 2.2);
      arrow({x: bx + bw / 2, y: gy + .55}, {x: bx + bw / 2 + lf, y: gy + .55}, '#ff8fab', {w: 2.8, head: 12});
      sans('F = ' + f1(F) + ' N', X(bx + bw / 2 + lf / 2), Y(gy + .95), '#ffb3c6', 11.5);
      if (f > .2) {
        const lfr = clamp(f * .045, .2, 2.2);
        arrow({x: bx - bw / 2, y: gy + .3}, {x: bx - bw / 2 - lfr, y: gy + .3}, '#5eead4', {w: 2.8, head: 12});
        sans('f = ' + f1(f) + ' N', X(bx - bw / 2 - lfr / 2), Y(gy + .62), '#8fe9d8', 11.5);
      }
      arrow({x: bx, y: gy + bh / 2}, {x: bx, y: gy + bh / 2 - 1.1}, '#b49cff', {w: 2.2, head: 10});
      arrow({x: bx + .7, y: gy}, {x: bx + .7, y: gy + 1.1}, '#7be0c0', {w: 2.2, head: 10});
      sans('G', X(bx - .25), Y(gy + bh / 2 - .8), '#c7b6ff', 11, 'right');
      sans('N', X(bx + .95), Y(gy + .55), '#7be0c0', 11, 'left');
    }

    sans(moving ? '已滑动：摩擦力保持不变' : '静止：静摩擦力与拉力平衡',
      X(-5.6), Y(3.55), moving ? 'rgba(255,197,107,.95)' : 'rgba(190,225,235,.9)', 12, 'left');

    if (s.showGraph) {
      const gx0 = 1.2, gx1 = 5.9, gy0 = -2.5, gy1 = 2.4;
      const mapX = q => gx0 + (q / 40) * (gx1 - gx0);
      const mapY = q => gy0 + (q / 40) * (gy1 - gy0);
      axisBox(gx0, gx1, gy0, gy1, 'F / N', 'f / N');
      line({x: mapX(0), y: mapY(0)}, {x: mapX(this.fmax()), y: mapY(this.fmax())},
        'rgba(255,197,107,.55)', {w: 1.6, dash: [5, 4]});
      line({x: mapX(this.fmax()), y: mapY(this.fk())}, {x: mapX(40), y: mapY(this.fk())},
        'rgba(94,234,212,.85)', {w: 2.2});
      sans('f = μN', X(mapX(29)), Y(mapY(this.fk())) - 16, 'rgba(140,240,220,.9)', 11);
      dot({x: mapX(Math.min(F, 40)), y: mapY(f)}, '#fff1cf', 5.4);
      line({x: mapX(this.fmax()), y: gy0}, {x: mapX(this.fmax()), y: gy1},
        'rgba(255,255,255,.16)', {w: 1, dash: [3, 4]});
      sans('最大静摩擦', X(mapX(this.fmax())) + 6, Y(gy1) + 12, 'rgba(255,215,150,.8)', 10, 'left');
    }

    math('f ≤ f_m = μ_sN', X(-5.6), Y(2.75), '#ffe0a8', 15, 'left');
    sans('N = mg = ' + f1(this.N()) + ' N', X(-5.6), Y(2.05), 'rgba(190,225,235,.9)', 11.5, 'left');
    sans('最大静摩擦 ' + f1(this.fmax()) + ' N', X(-5.6), Y(1.5), 'rgba(255,215,150,.9)', 11.5, 'left');
    sans('滑动摩擦 ' + f1(this.fk()) + ' N', X(-5.6), Y(1.0), 'rgba(140,240,220,.9)', 11.5, 'left');
    sans('加速度 a = ' + f1(moving ? (F - this.fk()) / s.m : 0) + ' m/s²',
      X(-5.6), Y(.45), 'rgba(255,143,171,.9)', 12, 'left');
  },
  hud() {
    const f = this.fnow(), moving = this.state.F > this.fmax();
    return [
      {k: '正压力 N', v: f1(this.N()) + ' N'},
      {k: '最大静摩擦', v: f1(this.fmax()) + ' N', hi: true},
      {k: '摩擦力 f', v: f1(f) + ' N', hi: true},
      {k: '加速度 a', v: f1(moving ? (this.state.F - this.fk()) / this.state.m : 0) + ' m/s²'},
      {k: '运动状态', v: moving ? '滑动' : '静止'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '水平拉力 F / N', 0, 40, .5, s.F, v => f1(v), v => s.F = v);
    addSlider(el, '质量 m / kg', 2, 6, .5, s.m, v => f1(v), v => s.m = v);
    addSlider(el, '动摩擦因数 μ', .1, .5, .02, s.mu, v => f2(v), v => s.mu = v);
    addToggle(el, '显示各力矢量', s.showF, v => s.showF = v);
    addToggle(el, '显示 f–F 图象', s.showGraph, v => s.showGraph = v);
  }
});

/* ---------- 04 力的合成与分解 ---------- */
MODULES.push({
  key: 'compose', tab: '04', name: '力的合成', en: 'VECTOR SUM', blurb: '平行四边形',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '改变两个分力的大小与夹角，看合力怎样变化',
  state: {F1: 30, F2: 40, th: 60, showPara: true, showComp: false},
  reset() { const s = this.state; s.F1 = 30; s.F2 = 40; s.th = 60; s.showPara = true; s.showComp = false; },
  meta() {
    return {
      title: '两个分力可以用平行四边形合成',
      desc: '以两个分力为邻边作平行四边形，对角线就表示合力的大小和方向。改变两个力的大小与夹角，观察合力随夹角增大而减小；夹角为 0° 时最大，180° 时最小。',
      formula: 'F = √(F<sub>1</sub><sup>2</sup> + F<sub>2</sub><sup>2</sup> + 2F<sub>1</sub>F<sub>2</sub>cosθ)',
      note: '合力不是简单相加，只有<b>同向</b>时才等于 F₁ + F₂。分解是合成的逆运算，按需要选择方向。'
    };
  },
  R() {
    const s = this.state, th = s.th * Math.PI / 180;
    return Math.sqrt(s.F1 * s.F1 + s.F2 * s.F2 + 2 * s.F1 * s.F2 * Math.cos(th));
  },
  phi() {
    const s = this.state, th = s.th * Math.PI / 180;
    const y = s.F2 * Math.sin(th), x = s.F1 + s.F2 * Math.cos(th);
    return Math.atan2(y, x) * 180 / Math.PI;
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 13);
    base();
    const ox = -3.0, oy = -2.2, k = 1 / 16;
    const th = s.th * Math.PI / 180;
    const p1 = {x: ox + s.F1 * k, y: oy};
    const p2 = {x: ox + s.F2 * k * Math.cos(th), y: oy + s.F2 * k * Math.sin(th)};
    const pr = {x: p1.x + p2.x - ox, y: p1.y + p2.y - oy};

    if (s.showPara) {
      line(p1, pr, 'rgba(255,255,255,.28)', {w: 1.4, dash: [5, 5]});
      line(p2, pr, 'rgba(255,255,255,.28)', {w: 1.4, dash: [5, 5]});
    }
    if (s.showComp) {
      line(pr, {x: pr.x, y: oy}, 'rgba(255,197,107,.5)', {w: 1.2, dash: [4, 4]});
      line(pr, {x: ox, y: pr.y}, 'rgba(255,197,107,.5)', {w: 1.2, dash: [4, 4]});
      sans('R_y', X(ox) - 10, Y(pr.y), 'rgba(255,215,150,.75)', 10, 'right');
      sans('R_x', X(pr.x), Y(oy) - 12, 'rgba(255,215,150,.75)', 10);
    }

    arrow({x: ox, y: oy}, p1, '#ffc56b', {w: 3, head: 13});
    arrow({x: ox, y: oy}, p2, '#5eead4', {w: 3, head: 13});
    arrow({x: ox, y: oy}, pr, '#ff8fab', {w: 3.2, head: 14});
    vlabel({x: ox, y: oy}, p1, 'F₁', '#ffd79a', 18, 16);
    vlabel({x: ox, y: oy}, p2, 'F₂', '#8fe9d8', 18, 16);
    vlabel({x: ox, y: oy}, pr, 'F', '#ffb3c6', 20, 18);

    if (s.th > 3) angleArc({x: ox, y: oy}, 0, th, 52, 'rgba(255,255,255,.4)', '', 12);
    sans('θ = ' + f1(s.th) + '°', X(ox + .55 * Math.cos(th / 2)), Y(oy + .55 * Math.sin(th / 2)), 'rgba(210,230,240,.8)', 11.5);

    const R = this.R();
    math('F = √(F₁² + F₂² + 2F₁F₂cosθ)', X(-5.6), Y(3.6), '#cfe8ff', 14, 'left');
    sans('F₁ = ' + f1(s.F1) + ' N', X(3.0), Y(2.85), '#ffd79a', 12.5, 'left');
    sans('F₂ = ' + f1(s.F2) + ' N', X(3.0), Y(2.3), '#8fe9d8', 12.5, 'left');
    sans('夹角 θ = ' + f1(s.th) + '°', X(3.0), Y(1.75), 'rgba(205,225,235,.9)', 12.5, 'left');
    sans('合力 F = ' + f1(R) + ' N', X(3.0), Y(1.1), '#ffb3c6', 15, 'left');
    sans('与 F₁ 夹角 ' + f1(this.phi()) + '°', X(3.0), Y(.5), 'rgba(255,190,210,.85)', 11.5, 'left');
    sans(s.th < 5 ? '同向：F = F₁ + F₂' : s.th > 175 ? '反向：F = |F₁ − F₂|' : '夹角越大，合力越小',
      X(3.0), Y(-.35), 'rgba(170,205,220,.72)', 10.5, 'left');

    const bx = 3.0, bw = 2.6;
    rect({x: bx, y: -1.55}, {x: bx + bw, y: -1.15}, 'rgba(255,255,255,.04)', 'rgba(170,200,225,.28)', {w: 1});
    const frac = clamp(R / 70, 0, 1);
    rect({x: bx, y: -1.55}, {x: bx + bw * frac, y: -1.15}, 'rgba(255,143,171,.5)', null, {w: 0});
    sans('0', X(bx), Y(-1.78), 'rgba(160,190,205,.65)', 9.5);
    sans('70 N', X(bx + bw), Y(-1.78), 'rgba(160,190,205,.65)', 9.5);
  },
  hud() {
    const s = this.state;
    return [
      {k: '分力 F₁', v: f1(s.F1) + ' N'},
      {k: '分力 F₂', v: f1(s.F2) + ' N'},
      {k: '夹角 θ', v: f1(s.th) + '°', hi: true},
      {k: '合力 F', v: f1(this.R()) + ' N', hi: true},
      {k: '合力方向', v: f1(this.phi()) + '°'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '分力 F₁ / N', 0, 60, 1, s.F1, v => f1(v), v => s.F1 = v);
    addSlider(el, '分力 F₂ / N', 0, 60, 1, s.F2, v => f1(v), v => s.F2 = v);
    addSlider(el, '夹角 θ / °', 0, 180, 5, s.th, v => f1(v), v => s.th = v);
    addToggle(el, '显示平行四边形', s.showPara, v => s.showPara = v);
    addToggle(el, '显示正交分解', s.showComp, v => s.showComp = v);
  }
});

/* ---------- 05 共点力平衡 ---------- */
MODULES.push({
  key: 'balance', tab: '05', name: '共点力平衡', en: 'EQUILIBRIUM', blurb: '三力汇交',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '左右移动悬挂点，观察两段绳的拉力如何重新分配',
  state: {m: 5, a1: 1.6, a2: 1.6, showT: true, showAng: true},
  reset() { const s = this.state; s.m = 5; s.a1 = 1.6; s.a2 = 1.6; s.showT = true; s.showAng = true; },
  meta() {
    return {
      title: '三个共点力平衡时合力为零',
      desc: '吊灯受重力与两段绳的拉力，三个力共点且合力为零。把悬挂点左右移动，两绳与竖直方向的夹角改变，拉力随之重新分配：绳越接近水平，拉力越大。',
      formula: 'T<sub>1</sub>sinθ<sub>1</sub> = T<sub>2</sub>sinθ<sub>2</sub>，T<sub>1</sub>cosθ<sub>1</sub> + T<sub>2</sub>cosθ<sub>2</sub> = G',
      note: '用<b>正交分解</b>列方程最稳妥。两绳夹角越大，单根绳的拉力越大，所以吊灯不能挂得太「平」。'
    };
  },
  G() { return this.state.m * 9.8; },
  th1() { return Math.atan2(this.state.a1, 2.5); },
  th2() { return Math.atan2(this.state.a2, 2.5); },
  T1() {
    const t1 = this.th1(), t2 = this.th2();
    return Math.sin(t2) * this.G() / Math.sin(t1 + t2);
  },
  T2() {
    const t1 = this.th1(), t2 = this.th2();
    return Math.sin(t1) * this.G() / Math.sin(t1 + t2);
  },
  draw() {
    const s = this.state, G = this.G(), T1 = this.T1(), T2 = this.T2();
    setFrame(.5, .55, 13);
    base();

    const cy = 2.75, knot = {x: 0, y: .55};
    ground(cy, 'rgba(150,190,205,.45)');
    sans('天花板', X(-5.5), Y(cy + .3), 'rgba(170,198,210,.7)', 10.5, 'left');

    const A = {x: -s.a1, y: cy}, B = {x: s.a2, y: cy};
    line(A, knot, '#9ad0ff', {w: 2.2});
    line(B, knot, '#9ad0ff', {w: 2.2});
    circleAt(A, .1, '#0a1220', '#9ad0ff', {w: 1.6});
    circleAt(B, .1, '#0a1220', '#9ad0ff', {w: 1.6});
    dot(knot, '#e8f6ff', 5);

    line({x: 0, y: knot.y}, {x: 0, y: -.3}, 'rgba(154,208,255,.8)', {w: 1.8});
    circleAt({x: 0, y: -.72}, .34, 'rgba(255,197,107,.16)', '#ffc56b', {w: 2});
    sans('G', X(0), Y(-.72), '#ffd79a', 13);

    arrow({x: 0, y: -.72}, {x: 0, y: -.72 - clamp(G * .022, .8, 2.0)}, '#ff8fab', {w: 3, head: 13});
    sans('G = ' + f1(G) + ' N', X(.18), Y(-1.75), '#ffb3c6', 11.5, 'left');

    if (s.showT) {
      const u1 = {x: A.x - knot.x, y: A.y - knot.y}, l1 = Math.hypot(u1.x, u1.y);
      const u2 = {x: B.x - knot.x, y: B.y - knot.y}, l2 = Math.hypot(u2.x, u2.y);
      const k1 = clamp(T1 * .022, .3, 1.9), k2 = clamp(T2 * .022, .3, 1.9);
      arrow(knot, {x: knot.x + u1.x / l1 * k1, y: knot.y + u1.y / l1 * k1}, '#5eead4', {w: 2.8, head: 12});
      arrow(knot, {x: knot.x + u2.x / l2 * k2, y: knot.y + u2.y / l2 * k2}, '#7be0c0', {w: 2.8, head: 12});
      sans('T₁ = ' + f1(T1) + ' N', X(knot.x + u1.x / l1 * (k1 + .35)), Y(knot.y + u1.y / l1 * (k1 + .35)), '#8fe9d8', 11.5);
      sans('T₂ = ' + f1(T2) + ' N', X(knot.x + u2.x / l2 * (k2 + .35)), Y(knot.y + u2.y / l2 * (k2 + .35)), '#8fe9d8', 11.5);
    }

    if (s.showAng) {
      angleArc(knot, Math.PI / 2, Math.PI / 2 + this.th1(), 44, 'rgba(255,215,150,.5)', '', 11);
      angleArc(knot, Math.PI / 2, Math.PI / 2 - this.th2(), 44, 'rgba(255,215,150,.5)', '', 11);
      sans('θ₁ = ' + f1(this.th1() * 180 / Math.PI) + '°', X(-1.05), Y(1.55), 'rgba(255,215,150,.85)', 10.5);
      sans('θ₂ = ' + f1(this.th2() * 180 / Math.PI) + '°', X(1.05), Y(1.55), 'rgba(255,215,150,.85)', 10.5);
    }

    math('T₁sinθ₁ = T₂sinθ₂', X(-5.6), Y(3.55), '#c8f7e8', 14, 'left');
    sans('T₁ = ' + f1(T1) + ' N', X(2.7), Y(-2.95), '#8fe9d8', 12, 'left');
    sans('T₂ = ' + f1(T2) + ' N', X(2.7), Y(-2.45), '#8fe9d8', 12, 'left');
    sans('合力 ' + f1(Math.abs(T1 * Math.sin(this.th1()) - T2 * Math.sin(this.th2()))) + ' N ≈ 0',
      X(2.7), Y(-1.95), 'rgba(255,215,150,.85)', 11, 'left');
    sans('绳越平，拉力越大', X(2.7), Y(-1.45), 'rgba(160,200,210,.68)', 10.5, 'left');
  },
  hud() {
    const t1 = this.th1() * 180 / Math.PI, t2 = this.th2() * 180 / Math.PI;
    return [
      {k: '重力 G', v: f1(this.G()) + ' N', hi: true},
      {k: '绳 1 拉力', v: f1(this.T1()) + ' N', hi: true},
      {k: '绳 2 拉力', v: f1(this.T2()) + ' N'},
      {k: 'θ₁', v: f1(t1) + '°'},
      {k: 'θ₂', v: f1(t2) + '°'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '吊灯质量 m / kg', 1, 20, .5, s.m, v => f1(v), v => s.m = v);
    addSlider(el, '左悬挂点偏移 / m', .4, 3.2, .1, s.a1, v => f1(v), v => s.a1 = v);
    addSlider(el, '右悬挂点偏移 / m', .4, 3.2, .1, s.a2, v => f1(v), v => s.a2 = v);
    addToggle(el, '显示张力矢量', s.showT, v => s.showT = v);
    addToggle(el, '显示角度标注', s.showAng, v => s.showAng = v);
  }
});

})();
