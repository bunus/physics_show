/* ============================================================
   选择性必修第二册 · 第 1 章 安培力与洛伦兹力
   ============================================================ */
(function () {

function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.replace('-', '−').replace(/0+$/, '').replace(/\.$/, '');
}
function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1).replace('-', '−');
}

function crosses(x0, x1, y0, y1, step, color) {
  for (let x = x0; x <= x1; x += step) {
    for (let y = y0; y <= y1; y += step) {
      line({x: x - .07, y: y - .07}, {x: x + .07, y: y + .07}, color, {w: 1.3});
      line({x: x - .07, y: y + .07}, {x: x + .07, y: y - .07}, color, {w: 1.3});
    }
  }
}

function dots(x0, x1, y0, y1, step, color) {
  for (let x = x0; x <= x1; x += step) {
    for (let y = y0; y <= y1; y += step) {
      dot({x: x, y: y}, color, 1.9);
    }
  }
}

/* ---------- 01 安培力的大小与方向 ---------- */
MODULES.push({
  key: 'ampere', tab: '01', name: '安培力', en: 'AMPERE FORCE', blurb: '通电导线的受力',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '调节电流、磁感应强度与导线长度，观察安培力的大小变化',
  state: {I: 4, B: .5, L: .6, dir: 1, showB: true},
  reset() { const s = this.state; s.I = 4; s.B = .5; s.L = .6; s.dir = 1; s.showB = true; },
  meta() {
    return {
      title: '安培力：通电导线在磁场中受力',
      desc: '把一段通电导线放进匀强磁场，导线会受到安培力。分别改变电流 I、磁感应强度 B 和导线在磁场中的长度 L，观察力的大小怎样随之改变；反转电流方向，安培力也随之反向。',
      formula: 'F = BIL（I ⊥ B）',
      note: '安培力<b>同时垂直于电流和磁场</b>。图中磁场垂直纸面向里，电流向右时导线受力向上；三者两两垂直。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const L = lim();
    if (s.showB) {
      crosses(-4.4, 4.5, -2.2, 2.0, .8, 'rgba(108,182,255,.38)');
      sans('× 表示磁场 B 垂直纸面向里', X(L.x0) + 18, Y(2.35), 'rgba(140,190,240,.78)', 11, 'left');
    }
    const half = s.L * 1.3, y0 = -.9;
    const F = s.B * s.I * s.L;
    line({x: -half, y: y0}, {x: half, y: y0}, 'rgba(238,246,252,.92)', {w: 6});
    line({x: -half, y: y0}, {x: half, y: y0}, 'rgba(94,234,212,.5)', {w: 2});
    arrow({x: -s.dir * .12, y: y0}, {x: s.dir * Math.min(1.15, half * .92), y: y0}, '#5eead4', {w: 3.2, head: 14});
    sans('I = ' + f1(s.I) + ' A', X(-s.dir * half * .55), Y(y0) - 16, 'rgba(126,236,214,.95)', 11.5);

    if (F > .04) {
      const len = Math.min(2.5, F * .26);
      arrow({x: 0, y: y0 + .3}, {x: 0, y: y0 + .3 + len}, '#ffc56b', {w: 3.2, head: 14, glow: 8});
      sans('F = ' + f1(F) + ' N', X(0) + 14, Y(y0 + .3 + len * .62), '#ffd79a', 12.5, 'left');
      rightAngle({x: 0, y: y0}, {x: -1, y: 0}, {x: 0, y: 1}, 14, 'rgba(255,199,107,.5)');
    } else {
      sans('F = 0', X(0), Y(y0 + .75), 'rgba(255,199,107,.6)', 12.5);
    }

    sans('导线长 L = ' + f1(s.L) + ' m（图中 1 m ≈ 1.3 格）', X(L.x0) + 18, Y(-2.45), 'rgba(175,205,215,.65)', 11, 'left');
    sans('B = ' + f2(s.B) + ' T', X(L.x1) - 18, Y(1.55), 'rgba(150,196,245,.85)', 12, 'right');
  },
  hud() {
    const s = this.state;
    const F = s.B * s.I * s.L;
    return [
      {k: '电流 I', v: f1(s.I) + ' A'},
      {k: '磁感应强度 B', v: f2(s.B) + ' T', hi: true},
      {k: '导线长度 L', v: f1(s.L) + ' m'},
      {k: '安培力 F', v: f1(F) + ' N', hi: true},
      {k: '受力方向', v: F > .04 ? '垂直纸面向外（向上）' : '不受力'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电流 I / A', 0, 10, .5, s.I, v => f1(v), v => s.I = v);
    addSlider(el, '磁感应强度 B / T', .1, 1, .05, s.B, v => f2(v), v => s.B = v);
    addSlider(el, '导线长度 L / m', .2, 1, .05, s.L, v => f1(v), v => s.L = v);
    addToggle(el, '显示磁场', s.showB, v => s.showB = v);
    addBtn(el, '反转电流方向', () => { s.dir = -s.dir; }, 'ghost');
  }
});

/* ---------- 02 左手定则 ---------- */
MODULES.push({
  key: 'lefthand', tab: '02', name: '左手定则', en: 'LEFT-HAND RULE', blurb: '三个方向两两垂直',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '转动导线改变 I 与 B 的夹角，观察安培力方向与大小的变化',
  state: {th: 90, dI: 1, dB: 1},
  reset() { const s = this.state; s.th = 90; s.dI = 1; s.dB = 1; },
  meta() {
    return {
      title: '左手定则：三个方向两两垂直',
      desc: '伸开左手，让磁感线穿入手心，四指指向电流方向，拇指所指就是安培力的方向。转动导线改变电流与磁场的夹角，可以看到安培力始终垂直于两者，大小随夹角按正弦规律变化。',
      formula: 'F = BIL sin θ（θ 为 I 与 B 的夹角）',
      note: '电流与磁场<b>平行</b>时 sin θ = 0，导线不受安培力；垂直时受力最大。改变电流或磁场方向，安培力随之反向。'
    };
  },
  P(x, y, z) {
    return {x: -.8 + x * .88 - z * .62, y: -.55 + y * .9 - x * .28 - z * .28};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const th = s.th * Math.PI / 180;
    const u = {x: Math.cos(th), y: 0, z: Math.sin(th)};

    for (let k = -1; k <= 1; k++) {
      const a = this.P(0, 0, k * .62), b = this.P(2.4 * s.dB, 0, k * .62);
      arrow(a, b, 'rgba(108,182,255,.62)', {w: 1.8, head: 10});
    }
    sans('B', X(2.5 * s.dB) - 4, Y(this.P(2.4 * s.dB, 0, 0).y) - 12, '#9ecbff', 17);

    const e1 = this.P(-u.x * 1.35, 0, -u.z * 1.35);
    const e2 = this.P(u.x * 1.35, 0, u.z * 1.35);
    line(e1, e2, 'rgba(240,248,255,.92)', {w: 5});
    line(e1, e2, 'rgba(94,234,212,.45)', {w: 2});
    const c = this.P(0, 0, 0);
    const a2 = this.P(u.x * .55 * s.dI, 0, u.z * .55 * s.dI);
    arrow(c, a2, '#5eead4', {w: 3, head: 13});
    sans('I', X(a2.x) + (u.x * s.dI > 0 ? 16 : -16), Y(a2.y) + 14, '#7ee9d6', 17);

    const sF = s.dI * s.dB * Math.sin(th);
    const len = 1.85 * Math.abs(Math.sin(th));
    if (len > .06) {
      const tip = this.P(0, (sF > 0 ? len : -len), 0);
      arrow(c, tip, '#ffc56b', {w: 3, head: 14, glow: 8});
      sans('F', X(tip.x) - 16, Y(tip.y) + (sF > 0 ? -2 : 16), '#ffd79a', 17);
    } else {
      sans('F = 0（I ∥ B）', X(c.x) + 24, Y(c.y) + 44, 'rgba(255,199,107,.8)', 11.5, 'left');
    }

    const arc = [];
    for (let i = 0; i <= 24; i++) {
      const a = th * i / 24;
      arc.push(this.P(.8 * Math.cos(a), 0, .8 * Math.sin(a)));
    }
    path(arc, 'rgba(255,255,255,.4)', {w: 1.3});
    const mid = this.P(.98 * Math.cos(th / 2), 0, .98 * Math.sin(th / 2));
    sans('θ = ' + f1(s.th) + '°', X(mid.x) - 6, Y(mid.y) + 14, 'rgba(210,230,240,.85)', 11.5);

    sans('磁感线穿入手心 → 四指指向电流 → 拇指指向安培力', X(-6.2), Y(3.05), 'rgba(180,210,225,.8)', 11.5, 'left');
    sans('F = BIL sin θ = ' + f1(4 * .6 * Math.abs(Math.sin(th))) + ' N（取 B = 0.5 T，I = 4 A，L = 0.6 m）',
      X(-6.2), Y(2.45), 'rgba(255,215,154,.8)', 11, 'left');
  },
  hud() {
    const s = this.state;
    const F = 4 * .6 * Math.abs(Math.sin(s.th * Math.PI / 180));
    const sF = s.dI * s.dB * Math.sin(s.th * Math.PI / 180);
    return [
      {k: '夹角 θ', v: f1(s.th) + '°', hi: true},
      {k: '安培力 F', v: f1(F) + ' N', hi: true},
      {k: '电流方向', v: s.dI > 0 ? '沿导线向外' : '沿导线向里'},
      {k: '磁场方向', v: s.dB > 0 ? '指向右下方' : '指向左上方'},
      {k: '受力方向', v: Math.abs(sF) < .02 ? '不受力' : (sF > 0 ? '竖直向上' : '竖直向下')}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, 'I 与 B 的夹角 θ / °', 0, 180, 5, s.th, v => f1(v), v => s.th = v);
    addToggle(el, '反转电流方向', s.dI < 0, v => s.dI = v ? -1 : 1);
    addToggle(el, '反转磁场方向', s.dB < 0, v => s.dB = v ? -1 : 1);
    addBtn(el, 'I ⊥ B（θ = 90°）', () => { s.th = 90; }, 'ghost');
  }
});

/* ---------- 03 洛伦兹力 ---------- */
MODULES.push({
  key: 'lorentz', tab: '03', name: '洛伦兹力', en: 'LORENTZ FORCE', blurb: '运动电荷的受力',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '调节速度与磁感应强度，观察洛伦兹力始终指向圆心',
  playable: true,
  state: {phi: -.8, playing: true, B: .8, v: 1, neg: false, showTrail: true},
  reset() { const s = this.state; s.phi = -.8; s.playing = true; s.B = .8; s.v = 1; s.neg = false; s.showTrail = true; },
  meta() {
    return {
      title: '洛伦兹力：让运动电荷转弯',
      desc: '运动电荷在磁场中受到洛伦兹力。调节速度与磁感应强度，观察带电粒子在垂直纸面向里的匀强磁场中做匀速圆周运动：速度沿切线方向，洛伦兹力始终指向圆心。',
      formula: 'F = qvB（v ⊥ B），r = mv/(qB)',
      note: '洛伦兹力<b>始终垂直于速度</b>，只改变速度方向、不做功，所以速率保持不变；磁场越强、速度越小，圆越紧凑。'
    };
  },
  draw(dt) {
    const s = this.state;
    const B = s.B;
    const rc = 1.04 * s.v / B;
    const R = rc * .9;
    if (s.playing) {
      s.phi += dt * 2.2 * (B / .8) * (s.neg ? -1 : 1);
      if (s.phi > 6.6) s.phi -= 12.56;
      if (s.phi < -6.6) s.phi += 12.56;
    }
    setFrame(.5, .55, 14);
    base();
    const L = lim();

    crosses(-5.2, 5.3, -2.9, 2.9, .95, 'rgba(140,160,255,.2)');
    sans('磁场垂直纸面向里', X(L.x0) + 18, Y(2.85), 'rgba(170,170,245,.7)', 11, 'left');

    circleAt({x: 0, y: 0}, R, null, 'rgba(180,156,255,.22)', {w: 1.2, dash: [5, 6]});

    const dir = s.neg ? -1 : 1;
    if (s.showTrail) {
      const trail = [];
      for (let i = 0; i <= 30; i++) {
        const a = s.phi - dir * 1.6 * (1 - i / 30);
        trail.push({x: R * Math.cos(a), y: R * Math.sin(a)});
      }
      path(trail, 'rgba(180,156,255,.75)', {w: 2.6, glow: 6});
    }

    const p = {x: R * Math.cos(s.phi), y: R * Math.sin(s.phi)};
    const vdir = {x: -Math.sin(s.phi) * dir, y: Math.cos(s.phi) * dir};
    const vlen = .55 + .85 * (s.v / 1.2);
    arrow(p, {x: p.x + vdir.x * vlen, y: p.y + vdir.y * vlen}, '#5eead4', {w: 2.8, head: 12, glow: 6});
    sans('v', X(p.x + vdir.x * vlen) + 12, Y(p.y + vdir.y * vlen) - 10, '#7ee9d6', 16);

    const flen = 1.9 * (s.v * B) / 1.44;
    const ux = R > .001 ? p.x / R : 0, uy = R > .001 ? p.y / R : 0;
    const fx = p.x - ux * flen, fy = p.y - uy * flen;
    arrow(p, {x: fx, y: fy}, '#ffc56b', {w: 2.8, head: 12, glow: 6});
    sans('F', X(fx) - 12, Y(fy) + 14, '#ffd79a', 16);

    dot(p, s.neg ? '#8fe0ff' : '#ff9ec4', 6.5);
    sans(s.neg ? '负电荷' : '正电荷', X(p.x), Y(p.y) + 22, s.neg ? 'rgba(150,220,255,.9)' : 'rgba(255,170,200,.95)', 11);

    sans('r = ' + f1(rc) + ' cm', X(L.x0) + 18, Y(-2.7), 'rgba(196,178,255,.85)', 12, 'left');
    sans('F = qvB 始终指向圆心', X(L.x1) - 18, Y(-2.7), 'rgba(175,205,215,.7)', 11, 'right');
  },
  hud() {
    const s = this.state;
    const rc = 1.04 * s.v / s.B;
    const F = 1.6e-19 * s.v * 1e6 * s.B;
    return [
      {k: '电荷量 q', v: (s.neg ? '−' : '+') + '1.6×10<sup>−19</sup> C'},
      {k: '速度 v', v: f2(s.v) + '×10<sup>6</sup> m/s', hi: true},
      {k: '磁感应强度 B', v: f2(s.B) + ' T'},
      {k: '洛伦兹力 F', v: f1(F * 1e13) + '×10<sup>−13</sup> N', hi: true},
      {k: '轨道半径 r', v: f1(rc) + ' cm'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '速度 v / (10⁶ m/s)', .6, 1.2, .02, s.v, v => f2(v), v => s.v = v);
    addSlider(el, '磁感应强度 B / T', .4, 1.2, .05, s.B, v => f2(v), v => s.B = v);
    addToggle(el, '负电荷', s.neg, v => s.neg = v);
    addToggle(el, '显示轨迹', s.showTrail, v => s.showTrail = v);
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 带电粒子在磁场中的圆周运动 ---------- */
MODULES.push({
  key: 'orbit', tab: '04', name: '圆周运动', en: 'CIRCULAR ORBIT', blurb: '半径与周期的规律',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变速度、磁场或粒子种类，比较半径与周期的变化',
  playable: true,
  state: {v: 1.5, B: .8, kind: 0, frac: 0, playing: true},
  reset() { const s = this.state; s.v = 1.5; s.B = .8; s.kind = 0; s.frac = 0; s.playing = true; },
  meta() {
    return {
      title: '垂直射入磁场：轨迹是一个圆',
      desc: '带电粒子垂直射入匀强磁场，洛伦兹力提供向心力，轨迹是圆。改变速度、磁感应强度或把质子换成 α 粒子，比较轨道半径与回旋周期的变化，体会周期与速度无关这一特点。',
      formula: 'r = mv/(qB)，T = 2πm/(qB)',
      note: '半径与速度成正比，周期却<b>只由比荷和磁场决定</b>。α 粒子的比荷是质子的一半，因此半径与周期都变为质子的 2 倍。'
    };
  },
  draw(dt) {
    const s = this.state;
    const km = s.kind === 1 ? 4 : 1;
    const kq = s.kind === 1 ? 2 : 1;
    const rc = 1.04 * s.v / s.B * (km / kq);
    const R = rc * .34;
    if (s.playing) {
      s.frac += dt / 2.4;
      if (s.frac > 1) s.frac -= 1;
    }
    setFrame(.5, .55, 14);
    base();
    const L = lim();

    rect({x: -4.4, y: -3}, {x: 6.3, y: 3.1}, 'rgba(150,140,255,.05)', null);
    crosses(-4.1, 6.1, -2.7, 2.9, .95, 'rgba(140,160,255,.22)');
    line({x: -4.4, y: -3.05}, {x: -4.4, y: 3.2}, 'rgba(200,225,240,.45)', {w: 1.6, dash: [7, 6]});
    sans('磁场边界', X(-4.4) - 10, Y(3.0), 'rgba(190,215,230,.7)', 11, 'right');
    sans('B 垂直纸面向里', X(1.4), Y(3.02), 'rgba(170,170,245,.7)', 11);

    const y0 = -2.5;
    const cy = y0 + R;
    const cx = -4.4;
    const arc = [];
    for (let i = 0; i <= 40; i++) {
      const a = -Math.PI / 2 + Math.PI * i / 40;
      arc.push({x: cx + R * Math.cos(a), y: cy + R * Math.sin(a)});
    }
    path(arc, 'rgba(255,197,107,.3)', {w: 1.6, dash: [6, 6]});

    const aNow = -Math.PI / 2 + Math.PI * s.frac;
    const head = [];
    for (let i = 0; i <= 30; i++) {
      const a = -Math.PI / 2 + Math.PI * s.frac * i / 30;
      head.push({x: cx + R * Math.cos(a), y: cy + R * Math.sin(a)});
    }
    path(head, '#ffc56b', {w: 2.8, glow: 7});

    const p = {x: cx + R * Math.cos(aNow), y: cy + R * Math.sin(aNow)};
    const vd = {x: -Math.sin(aNow), y: Math.cos(aNow)};
    arrow(p, {x: p.x + vd.x * 1.05, y: p.y + vd.y * 1.05}, '#5eead4', {w: 2.6, head: 12});
    sans('v', X(p.x + vd.x * 1.05) + 12, Y(p.y + vd.y * 1.05) - 10, '#7ee9d6', 15);
    arrow(p, {x: cx, y: cy}, '#ff8fab', {w: 2.2, head: 11, alpha: .85});
    sans('F', X((p.x + cx) / 2) + 14, Y((p.y + cy) / 2) - 8, '#ffb3c6', 14);

    dot(p, '#fff3d6', 6);
    line({x: cx, y: cy}, {x: cx + R, y: cy}, 'rgba(255,255,255,.22)', {w: 1.1, dash: [4, 5]});
    sans('r = ' + f1(rc) + ' cm', X(cx + R * .55), Y(cy) - 13, 'rgba(255,220,160,.85)', 11.5);

    dot({x: cx, y: y0}, '#ffc56b', 4);
    sans('入射点', X(cx) + 6, Y(y0) - 14, 'rgba(255,215,154,.8)', 10.5, 'left');
    sans(s.kind === 1 ? 'α 粒子（q = 2e，m = 4m_p）' : '质子（q = e，m = m_p）',
      X(L.x0) + 18, Y(-2.85), 'rgba(200,225,235,.8)', 11, 'left');
    sans('速率不变，只改变方向', X(L.x1) - 18, Y(-2.85), 'rgba(175,205,215,.65)', 11, 'right');
  },
  hud() {
    const s = this.state;
    const km = s.kind === 1 ? 4 : 1;
    const kq = s.kind === 1 ? 2 : 1;
    const rc = 1.04 * s.v / s.B * (km / kq);
    const T = 65.6 / s.B * (km / kq);
    return [
      {k: '速度 v', v: f2(s.v) + '×10<sup>6</sup> m/s', hi: true},
      {k: '磁感应强度 B', v: f2(s.B) + ' T'},
      {k: '轨道半径 r', v: f1(rc) + ' cm', hi: true},
      {k: '回旋周期 T', v: f1(T) + ' ns'},
      {k: '粒子', v: s.kind === 1 ? 'α 粒子' : '质子'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['质子', 'α 粒子'], s.kind, i => { s.kind = i; s.frac = 0; });
    addSlider(el, '速度 v / (10⁶ m/s)', 1, 2, .05, s.v, v => f2(v), v => { s.v = v; s.frac = 0; });
    addSlider(el, '磁感应强度 B / T', .6, 1.2, .05, s.B, v => f2(v), v => { s.B = v; s.frac = 0; });
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '重新入射', () => { s.frac = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 回旋加速器与速度选择器 ---------- */
MODULES.push({
  key: 'cyclotron', tab: '05', name: '回旋加速器', en: 'CYCLOTRON', blurb: '加速与选择',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '切换回旋加速器与速度选择器，观察粒子被加速与被筛选的过程',
  playable: true,
  state: {mode: 0, th: 0, sp: 0, playing: true, B: 1.2, U: 40, E: 4, showB: true},
  reset() { const s = this.state; s.mode = 0; s.th = 0; s.sp = 0; s.playing = true; s.B = 1.2; s.U = 40; s.E = 4; s.showB = true; },
  meta() {
    return {
      title: '回旋加速器与速度选择器',
      desc: '回旋加速器让粒子在两个 D 形盒之间反复被电场加速，在盒内做匀速圆周运动，半径越来越大而周期不变。切换到速度选择器，可以看到只有速度恰好等于 E/B 的粒子才能沿直线通过。',
      formula: 'f = qB/(2πm)，E<sub>k</sub> = q<sup>2</sup>B<sup>2</sup>R<sup>2</sup>/(2m)<br>速度选择器：v = E/B',
      note: '回旋周期与速度无关，这是能用<b>固定频率电压</b>反复加速的关键；速度选择器中电场力与洛伦兹力平衡，粒子才直线通过。'
    };
  },
  thMax() {
    const s = this.state;
    const N = Math.max(1.1, 160.9 * s.B * s.B / (2 * s.U));
    return 6.2832 * N;
  },
  draw(dt) {
    setFrame(.5, .55, 14);
    base();
    if (this.state.mode === 0) this.drawCyc(dt);
    else this.drawSel(dt);
  },
  drawCyc(dt) {
    const s = this.state;
    const Rm = 2.9, r0 = .35;
    const tm = this.thMax();
    const k = (Rm - r0) / tm;
    if (s.playing) {
      s.th += dt * 2.6;
      if (s.th > tm) s.th = 0;
    }
    const L = lim();

    for (let side = -1; side <= 1; side += 2) {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const a = (side > 0 ? -Math.PI / 2 : Math.PI / 2) + Math.PI * i / 40;
        pts.push({x: Math.cos(a) * 3.02, y: Math.sin(a) * 3.02});
      }
      poly(pts, 'rgba(108,182,255,.05)', 'rgba(150,200,240,.5)', {w: 1.6, close: true});
    }
    if (s.showB) dots(-2.7, 2.7, -2.7, 2.7, .9, 'rgba(140,190,245,.35)');
    line({x: -.09, y: -3.02}, {x: -.09, y: 3.02}, 'rgba(200,225,240,.4)', {w: 1.2});
    line({x: .09, y: -3.02}, {x: .09, y: 3.02}, 'rgba(200,225,240,.4)', {w: 1.2});
    sans('D₁', X(-2.3), Y(2.55), 'rgba(160,205,245,.75)', 12);
    sans('D₂', X(2.3), Y(2.55), 'rgba(160,205,245,.75)', 12);
    sans('加速间隙', X(0), Y(-3.15), 'rgba(255,199,107,.75)', 10.5);

    const path1 = [];
    for (let i = 0; i <= 120; i++) {
      const a = tm * i / 120;
      const rr = r0 + k * a;
      path1.push({x: rr * Math.cos(a), y: rr * Math.sin(a)});
    }
    path(path1, 'rgba(123,224,192,.22)', {w: 1.4, dash: [4, 5]});

    const trail = [];
    for (let i = 0; i <= 60; i++) {
      const a = s.th * i / 60;
      const rr = r0 + k * a;
      trail.push({x: rr * Math.cos(a), y: rr * Math.sin(a)});
    }
    path(trail, '#7be0c0', {w: 2.6, glow: 7});

    const rr = r0 + k * s.th;
    const p = {x: rr * Math.cos(s.th), y: rr * Math.sin(s.th)};
    dot(p, '#eafff8', 6);
    sans('粒子', X(p.x) + 14, Y(p.y) - 12, 'rgba(180,240,220,.9)', 10.5);

    const vm = 5.557 * s.B * rr;
    sans('r = ' + f1(rr * 2) + ' cm，v = ' + f2(vm) + '×10⁶ m/s',
      X(L.x0) + 18, Y(-3.35), 'rgba(180,240,220,.8)', 11, 'left');
    sans('周期不变：每半圈时间相同', X(L.x1) - 18, Y(-3.35), 'rgba(175,205,215,.65)', 11, 'right');
  },
  drawSel(dt) {
    const s = this.state;
    if (s.playing) {
      s.sp += dt * .38;
      if (s.sp > 1) s.sp -= 1;
    }
    const L = lim();
    rect({x: -5.2, y: 2.1}, {x: 5.2, y: 2.24}, 'rgba(255,143,171,.25)', 'rgba(255,143,171,.7)', {w: 1.2});
    rect({x: -5.2, y: -2.24}, {x: 5.2, y: -2.1}, 'rgba(108,182,255,.25)', 'rgba(108,182,255,.7)', {w: 1.2});
    sans('+ + + + +', X(-4.4), Y(2.18), 'rgba(255,180,195,.95)', 11, 'left');
    sans('− − − − −', X(-4.4), Y(-2.18), 'rgba(170,205,255,.95)', 11, 'left');
    for (let x = -4.6; x <= 4.7; x += .92) {
      arrow({x: x, y: 1.95}, {x: x, y: -1.95}, 'rgba(255,143,171,.32)', {w: 1.2, head: 7});
    }
    crosses(-4.8, 4.9, -1.7, 1.7, .9, 'rgba(140,160,255,.22)');
    sans('E 向下，B 垂直纸面向里', X(L.x0) + 18, Y(2.75), 'rgba(200,215,235,.75)', 11, 'left');

    const sets = [{k: .6, c: '#6cb6ff', t: 'v < E/B'}, {k: 1, c: '#7be0c0', t: 'v = E/B'}, {k: 1.4, c: '#ffc56b', t: 'v > E/B'}];
    for (let i = 0; i < sets.length; i++) {
      const g = sets[i];
      const a = (g.k - 1) * .17;
      const trail = [];
      for (let j = 0; j <= 40; j++) {
        const f = s.sp * j / 40;
        const xx = -5 + 10 * f;
        trail.push({x: xx, y: .55 + a * f * f * 9.5});
      }
      path(trail, g.c, {w: 2.2, alpha: .85, glow: 5});
      const xx = -5 + 10 * s.sp;
      const yy = .55 + a * s.sp * s.sp * 9.5;
      if (yy < 1.95 && yy > -1.95) dot({x: xx, y: yy}, g.c, 4.5);
      if (s.sp > .55) sans(g.t, X(xx) + 12, Y(yy), g.c, 10.5, 'left');
    }
    sans('出口', X(5.2) + 6, Y(0), 'rgba(190,215,230,.7)', 10.5, 'left');
    sans('E = ' + f1(s.E) + '×10⁵ V/m，B = ' + f2(s.B) + ' T',
      X(L.x0) + 18, Y(-2.75), 'rgba(190,215,230,.75)', 11, 'left');
    sans('只有电场力与洛伦兹力平衡的粒子才能直线通过', X(L.x1) - 18, Y(-2.75), 'rgba(175,205,215,.65)', 11, 'right');
  },
  hud() {
    const s = this.state;
    if (s.mode === 0) {
      const tm = this.thMax();
      const k = (2.9 - .35) / tm;
      const rr = .35 + k * s.th;
      const vm = 5.557 * s.B * rr;
      const Ek = .5 * 1.67e-27 * vm * vm * 1e12;
      return [
        {k: '磁感应强度 B', v: f2(s.B) + ' T', hi: true},
        {k: '加速电压 U', v: f1(s.U) + ' kV'},
        {k: '轨道半径 r', v: f1(rr * 2) + ' cm'},
        {k: '粒子速度 v', v: f2(vm) + '×10<sup>6</sup> m/s', hi: true},
        {k: '粒子动能', v: f2(Ek / 1.602e-13) + ' MeV'}
      ];
    }
    const v0 = s.E / s.B;
    return [
      {k: '电场强度 E', v: f1(s.E) + '×10<sup>5</sup> V/m', hi: true},
      {k: '磁感应强度 B', v: f2(s.B) + ' T'},
      {k: '选择速度 v₀', v: f2(v0) + '×10<sup>6</sup> m/s', hi: true},
      {k: '通过条件', v: 'v = E/B'},
      {k: '偏转规律', v: '快偏上，慢偏下'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['回旋加速器', '速度选择器'], s.mode, i => { s.mode = i; s.th = 0; s.sp = 0; });
    addSlider(el, '磁感应强度 B / T', .8, 1.6, .05, s.B, v => f2(v), v => { s.B = v; s.th = 0; });
    addSlider(el, '加速电压 U / kV', 20, 100, 5, s.U, v => f1(v), v => { s.U = v; s.th = 0; });
    addSlider(el, '电场强度 E / (10⁵ V/m)', 1, 8, .2, s.E, v => f1(v), v => s.E = v);
    addToggle(el, '显示磁感线', s.showB, v => s.showB = v);
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
