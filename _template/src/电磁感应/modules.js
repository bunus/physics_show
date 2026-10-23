/* ============================================================
   选择性必修第二册 · 第 2 章 电磁感应
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

function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .4, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .4}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 4, Y(y0) + 15, 'rgba(170,198,210,.85)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) + 10, 'rgba(170,198,210,.85)', 11, 'right');
}

/* ---------- 01 楞次定律 ---------- */
MODULES.push({
  key: 'lenz', tab: '01', name: '楞次定律', en: 'LENZ LAW', blurb: '来拒去留',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '观察磁体靠近与远离线圈时，感应电流和感应磁场的方向',
  playable: true,
  state: {ph: 0, playing: true, sN: 1, showB: true, n: 200, speed: 1, dir: 1},
  reset() { const s = this.state; s.ph = 0; s.playing = true; s.sN = 1; s.showB = true; s.n = 200; s.speed = 1; s.dir = 1; },
  meta() {
    return {
      title: '楞次定律：感应电流总是“唱反调”',
      desc: '把条形磁体的 N 极移近线圈，穿过线圈的磁通量增大，感应电流产生的磁场阻碍这一增大；磁体远离时磁通量减小，感应电流又阻碍减小。移动磁极，观察电流方向的翻转。',
      formula: '感应电流的磁场总要阻碍引起它的磁通量的变化',
      note: '口诀<b>来拒去留</b>：靠近时线圈“推开”磁体，远离时又“拉住”磁体。判断方向时先看原磁场方向，再看磁通量是增还是减。'
    };
  },
  ring(a) {
    return {x: 1.9 - .5 * Math.sin(a), y: 1.35 * Math.cos(a) + .3 * Math.sin(a)};
  },
  phi(x) {
    return this.state.sN * 1.2 / (1 + Math.pow((1.9 - x) / 1.5, 2));
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.ph += dt * s.speed * .55;
      if (s.ph > 6.2832) s.ph -= 6.2832;
    }
    const x = -2.9 + 1.75 * Math.sin(s.ph);
    const vx = 1.75 * Math.cos(s.ph) * s.speed * .55;
    const sg = vx > .02 ? 1 : vx < -.02 ? -1 : 0;
    if (sg) s.dir = -s.sN * sg;

    setFrame(.5, .55, 14);
    base();
    const L = lim();

    for (let i = -1; i <= 1; i++) {
      line({x: x + .8, y: i * .42}, {x: 1.25, y: i * 1.05}, 'rgba(108,182,255,.28)', {w: 1.2, dash: [5, 5]});
    }

    rect({x: x - .85, y: -.34}, {x: x + .85, y: .34}, 'rgba(12,22,36,.9)', 'rgba(220,235,245,.5)', {w: 1.4});
    const right = s.sN > 0;
    rect({x: right ? x : x - .85, y: -.34}, {x: right ? x + .85 : x, y: .34},
      right ? 'rgba(255,110,130,.55)' : 'rgba(108,182,255,.45)', null);
    sans(s.sN > 0 ? 'N' : 'S', X(x + (s.sN > 0 ? .42 : -.42)), Y(0), '#f2f7fb', 15);
    sans(s.sN > 0 ? 'S' : 'N', X(x + (s.sN > 0 ? -.42 : .42)), Y(0), '#cfe3f2', 13);

    if (Math.abs(vx) > .02) {
      arrow({x: x, y: .75}, {x: x + Math.sign(vx) * 1.0, y: .75}, '#ffc56b', {w: 2.2, head: 11});
      sans(sg > 0 ? '靠近' : '远离', X(x + Math.sign(vx) * .55), Y(1.08), '#ffd79a', 11.5);
      arrow({x: x, y: -1.0}, {x: x - Math.sign(vx) * 1.0, y: -1.0}, '#ff8fab', {w: 2, head: 10, alpha: .8});
      sans(sg > 0 ? '斥力' : '引力', X(x - Math.sign(vx) * .62), Y(-1.35), 'rgba(255,179,198,.9)', 11);
    }

    const ringPts = [];
    for (let i = 0; i <= 60; i++) ringPts.push(this.ring(i / 60 * 6.2832));
    path(ringPts, 'rgba(108,182,255,.45)', {w: 1.4, dash: [4, 4]});
    const ringPts2 = [];
    for (let i = 0; i <= 60; i++) {
      const q = this.ring(i / 60 * 6.2832);
      ringPts2.push({x: q.x + .3, y: q.y});
    }
    path(ringPts2, '#6cb6ff', {w: 2.6, glow: 6});

    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + .5;
      const p0 = this.ring(a), p1 = this.ring(a + .12 * s.dir);
      arrow(p0, p1, '#5eead4', {w: 2.2, head: 11});
    }
    sans('线圈', X(1.9), Y(-1.95), 'rgba(160,205,245,.85)', 11.5);

    if (s.showB) {
      const b0 = {x: 1.9 - 1.05 * s.dir, y: 0}, b1 = {x: 1.9 + 1.05 * s.dir, y: 0};
      arrow(b0, b1, '#ffc56b', {w: 2.4, head: 12, dash: [6, 5]});
      sans('感应磁场 B′', X(1.9), Y(.55), 'rgba(255,215,154,.9)', 11.5);
    }

    sans('从右侧看：感应电流沿' + (s.dir > 0 ? '逆时针' : '顺时针') + '（沿青色箭头）',
      X(L.x0) + 18, Y(2.85), 'rgba(126,236,214,.85)', 11.5, 'left');
    sans('磁通量正在' + (sg > 0 ? '增大 → 感应磁场与原磁场反向' : sg < 0 ? '减小 → 感应磁场与原磁场同向' : '不变'),
      X(L.x0) + 18, Y(2.3), 'rgba(180,210,225,.75)', 11, 'left');
  },
  hud() {
    const s = this.state;
    const x = -2.9 + 1.75 * Math.sin(s.ph);
    const vx = 1.75 * Math.cos(s.ph) * s.speed * .55;
    const phi = this.phi(x);
    const dphi = (this.phi(x + vx * .02) - this.phi(x)) / .02;
    return [
      {k: '磁体运动', v: Math.abs(vx) < .02 ? '静止' : (vx > 0 ? '靠近线圈' : '远离线圈'), hi: true},
      {k: '磁通量 Φ', v: f2(phi) + ' Wb'},
      {k: '变化率 ΔΦ/Δt', v: f2(dphi) + ' Wb/s'},
      {k: '感应电动势 E', v: f1(Math.abs(dphi) * s.n) + ' V', hi: true},
      {k: '感应电流', v: s.dir > 0 ? '逆时针（图中）' : '顺时针（图中）'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '磁体往返速度 / (格/s)', .3, 2, .1, s.speed, v => f1(v), v => s.speed = v);
    addSlider(el, '线圈匝数 n', 50, 400, 10, s.n, v => String(Math.round(v)), v => s.n = v);
    addToggle(el, 'N 极朝向线圈', s.sN > 0, v => { s.sN = v ? 1 : -1; });
    addToggle(el, '显示感应磁场', s.showB, v => s.showB = v);
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 法拉第电磁感应定律 ---------- */
MODULES.push({
  key: 'faraday', tab: '02', name: '法拉第定律', en: 'FARADAY LAW', blurb: '磁通量变化率',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '观察 Φ-t 图象的斜率与感应电动势的对应关系',
  playable: true,
  state: {t: 0, playing: true, n: 200, k: .5},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.n = 200; s.k = .5; },
  meta() {
    return {
      title: '法拉第电磁感应定律：看磁通量变化得多快',
      desc: '线圈里的磁通量随时间先均匀增大、再均匀减小，图象是一条折线。折线的斜率就是磁通量的变化率，斜率越大、匝数越多，产生的感应电动势越大；磁通量反向变化时电动势也反向。',
      formula: 'E = nΔΦ/Δt（ΔΦ/Δt 为 Φ-t 图象的斜率）',
      note: '感应电动势的大小<b>只由磁通量的变化率决定</b>，与磁通量本身的大小无关。磁通量很大但不变时，电动势为零。'
    };
  },
  flux(t) {
    const k = this.state.k;
    return t < 2 ? k * t : k * (4 - t);
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt * .85;
      if (s.t > 4) s.t -= 4;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();

    const cx = -4.4, cy = .2, R = 1.5;
    circleAt({x: cx, y: cy}, R, 'rgba(108,182,255,.05)', 'rgba(150,200,240,.7)', {w: 2.2});
    circleAt({x: cx, y: cy}, R * .72, null, 'rgba(150,200,240,.35)', {w: 1.4});
    dot({x: cx, y: cy}, '#b49cff', 4);
    sans('n 匝线圈', X(cx), Y(cy - R - .38), 'rgba(180,200,245,.85)', 11.5);
    sans('Φ = ' + f2(this.flux(s.t)) + ' Wb', X(cx), Y(cy + R + .42), 'rgba(196,178,255,.95)', 12);

    const gx0 = -.9, gx1 = 6.2;
    const mapX = t => gx0 + (t / 4) * (gx1 - gx0);
    const pTop0 = .55, pTop1 = 2.7;
    const pBot0 = -2.85, pBot1 = -.55;
    const mapP = v => pTop0 + (v / 2.4) * (pTop1 - pTop0);
    const mapE = v => (pBot0 + pBot1) / 2 + (v / 260) * (pBot1 - pBot0) / 2;

    axisBox(gx0, gx1, pTop0, pTop1, '', '');
    axisBox(gx0, gx1, pBot0, pBot1, 't / s', 'E / V');
    sans('Φ / Wb', X(gx0) - 8, Y(pTop1) + 10, 'rgba(170,198,210,.85)', 11, 'right');
    sans('Φ-t 图象', X(gx0) + 8, Y(pTop1) - 12, 'rgba(196,178,255,.9)', 11.5, 'left');
    sans('E-t 图象', X(gx0) + 8, Y(pBot1) - 12, 'rgba(255,215,154,.9)', 11.5, 'left');

    const pPts = [], ePts = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80 * 4;
      pPts.push({x: mapX(t), y: mapP(this.flux(t))});
      const e = t < 2 ? -s.n * s.k : s.n * s.k;
      ePts.push({x: mapX(t), y: mapE(e)});
    }
    line({x: gx0, y: mapP(0)}, {x: gx1, y: mapP(0)}, 'rgba(198,222,232,.3)', {w: 1});
    line({x: gx0, y: mapE(0)}, {x: gx1, y: mapE(0)}, 'rgba(198,222,232,.3)', {w: 1});
    path(pPts.slice(0, 41), 'rgba(180,156,255,.9)', {w: 2.4, glow: 6});
    path(pPts.slice(40), 'rgba(180,156,255,.5)', {w: 2, dash: [5, 5]});
    path(ePts.slice(0, 41), 'rgba(255,197,107,.9)', {w: 2.2});
    path(ePts.slice(40), 'rgba(255,197,107,.5)', {w: 2, dash: [5, 5]});

    for (let t = 0; t <= 4; t++) {
      const wx = mapX(t);
      line({x: wx, y: pTop0}, {x: wx, y: pTop0 - .08}, 'rgba(198,222,232,.4)', {w: 1});
      sans(String(t), X(wx), Y(pTop0) + 14, 'rgba(160,190,205,.7)', 10);
    }

    const pNow = {x: mapX(s.t), y: mapP(this.flux(s.t))};
    dot(pNow, '#fff1ff', 5);
    line({x: pNow.x, y: pTop0}, {x: pNow.x, y: pTop1}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 5]});
    const eNow = mapE(s.t < 2 ? -s.n * s.k : s.n * s.k);
    dot({x: mapX(s.t), y: eNow}, '#ffe9bd', 4.5);

    const slope = s.t < 2 ? s.k : -s.k;
    sans('斜率 = ' + f2(slope) + ' Wb/s', X(gx1) - 6, Y(pTop1) - 12, 'rgba(196,178,255,.85)', 10.5, 'right');
    sans('E = nΔΦ/Δt = ' + f1(s.n * s.k) + ' V', X(gx1) - 6, Y(pBot1) - 12, 'rgba(255,215,154,.85)', 10.5, 'right');
    sans(s.t < 2 ? '磁通量增大，电动势为负方向' : '磁通量减小，电动势反向', X(L.x0) + 16, Y(-3.3), 'rgba(180,210,225,.7)', 11, 'left');
  },
  hud() {
    const s = this.state;
    const phi = this.flux(s.t);
    const slope = s.t < 2 ? s.k : -s.k;
    return [
      {k: '时刻 t', v: f1(s.t) + ' s'},
      {k: '磁通量 Φ', v: f2(phi) + ' Wb', hi: true},
      {k: 'ΔΦ/Δt', v: f2(slope) + ' Wb/s'},
      {k: '匝数 n', v: Math.round(s.n) + ' 匝'},
      {k: '感应电动势 E', v: f1(s.n * Math.abs(slope)) + ' V', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '匝数 n', 50, 300, 10, s.n, v => String(Math.round(v)), v => s.n = v);
    addSlider(el, '磁通变化率 k / (Wb/s)', .2, .8, .05, s.k, v => f2(v), v => s.k = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '回到 t = 0', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 导体棒切割磁感线 ---------- */
MODULES.push({
  key: 'cut', tab: '03', name: '切割磁感线', en: 'MOTIONAL EMF', blurb: '导体棒在磁场中运动',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '改变速度、磁感应强度与导轨间距，观察电动势、电流与安培力的变化',
  playable: true,
  state: {x: -3.9, playing: true, v: 1.5, B: .5, Lm: .6, R: 4},
  reset() { const s = this.state; s.x = -3.9; s.playing = true; s.v = 1.5; s.B = .5; s.Lm = .6; s.R = 4; },
  meta() {
    return {
      title: '导体棒切割磁感线：把机械能变成电能',
      desc: '导体棒在匀强磁场中沿导轨匀速滑动，切割磁感线产生感应电动势 E = BLv。闭合回路里出现感应电流，电流又反过来受到安培力，方向与运动方向相反，阻碍导体棒的运动。',
      formula: 'E = BLv，I = BLv/R，F = BIL = B<sup>2</sup>L<sup>2</sup>v/R',
      note: '安培力总是<b>阻碍相对运动</b>，所以维持匀速需要外力做功；外力的功率等于回路中的电功率 EI。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.x += dt * s.v * .9;
      if (s.x > 4.4) s.x = -4.2;
    }
    setFrame(.5, .55, 14);
    base();
    const L = lim();
    const h = s.Lm * 1.25;
    const E = s.B * s.Lm * s.v;
    const I = E / s.R;
    const F = s.B * I * s.Lm;

    crosses(-4.4, 5.4, -1.9, 1.9, .85, 'rgba(108,182,255,.3)');
    line({x: -4.4, y: h}, {x: 5.0, y: h}, 'rgba(215,232,242,.85)', {w: 2.4});
    line({x: -4.4, y: -h}, {x: 5.0, y: -h}, 'rgba(215,232,242,.85)', {w: 2.4});

    rect({x: -4.75, y: -.42}, {x: -4.28, y: .42}, 'rgba(15,26,40,.95)', 'rgba(255,197,107,.85)', {w: 1.6});
    sans('R', X(-4.52), Y(0), '#ffd79a', 12);
    line({x: -4.4, y: h}, {x: -4.4, y: .42}, 'rgba(215,232,242,.85)', {w: 2});
    line({x: -4.4, y: -.42}, {x: -4.4, y: -h}, 'rgba(215,232,242,.85)', {w: 2});

    if (I > .01) {
      const dx = s.x + 4.4;
      arrow({x: s.x, y: -.3 * h}, {x: s.x, y: .3 * h}, '#5eead4', {w: 2.4, head: 11});
      arrow({x: s.x - .4, y: h}, {x: s.x - Math.min(1.2, dx * .5), y: h}, '#5eead4', {w: 2.2, head: 10});
      arrow({x: -4.4 + .2, y: -h}, {x: -4.4 + Math.min(1.2, dx * .5), y: -h}, '#5eead4', {w: 2.2, head: 10});
    }

    line({x: s.x, y: -h}, {x: s.x, y: h}, 'rgba(240,248,255,.95)', {w: 5});
    line({x: s.x, y: -h}, {x: s.x, y: h}, 'rgba(94,234,212,.5)', {w: 2});

    if (F > .02) {
      arrow({x: s.x - .1, y: 0}, {x: s.x - .1 - Math.min(1.9, F * .5), y: 0}, '#ff8fab', {w: 2.6, head: 12});
      sans('F安 = ' + f2(F) + ' N', X(s.x - .9), Y(.3), '#ffb3c6', 11);
    }
    arrow({x: s.x + .12, y: -h - .45}, {x: s.x + .12 + s.v * .5, y: -h - .45}, '#ffc56b', {w: 2.2, head: 10});
    sans('v', X(s.x + .12 + s.v * .5) + 10, Y(-h - .45) - 8, '#ffd79a', 14);

    sans('B 垂直纸面向里', X(L.x0) + 16, Y(2.55), 'rgba(140,190,240,.75)', 11, 'left');
    sans('E = BLv = ' + f2(E) + ' V，I = ' + f2(I) + ' A', X(L.x1) - 16, Y(2.55), 'rgba(200,225,240,.85)', 11.5, 'right');
    sans('导轨间距 L = ' + f2(s.Lm) + ' m', X(L.x0) + 16, Y(-2.55), 'rgba(175,205,215,.7)', 11, 'left');
  },
  hud() {
    const s = this.state;
    const E = s.B * s.Lm * s.v;
    const I = E / s.R;
    const F = s.B * I * s.Lm;
    return [
      {k: '速度 v', v: f2(s.v) + ' m/s', hi: true},
      {k: '感应电动势 E', v: f2(E) + ' V', hi: true},
      {k: '感应电流 I', v: f2(I) + ' A'},
      {k: '安培力 F', v: f2(F) + ' N'},
      {k: '电功率 P', v: f2(E * I) + ' W'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '速度 v / (m/s)', .5, 3, .1, s.v, v => f2(v), v => s.v = v);
    addSlider(el, '磁感应强度 B / T', .1, 1, .05, s.B, v => f2(v), v => s.B = v);
    addSlider(el, '导轨间距 L / m', .3, 1, .05, s.Lm, v => f2(v), v => s.Lm = v);
    addSlider(el, '电阻 R / Ω', 1, 10, .5, s.R, v => f2(v), v => s.R = v);
    addToggle(el, '导体棒运动', s.playing, v => s.playing = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 自感与涡流 ---------- */
MODULES.push({
  key: 'selfind', tab: '04', name: '自感与涡流', en: 'SELF-INDUCTION', blurb: '电流不能突变',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '闭合与断开开关，观察灯泡亮度与电流变化的快慢',
  playable: true,
  state: {on: false, i: 0, L: .6, R: 4, time: 0, hist: [], di: 0, core: false, playing: true},
  playable: true,
  reset() {
    const s = this.state;
    s.on = false; s.i = 0; s.L = .6; s.R = 4; s.time = 0; s.hist = []; s.di = 0; s.core = false; s.playing = true;
  },
  meta() {
    return {
      title: '自感：线圈让电流“慢半拍”',
      desc: '闭合开关时，线圈中的电流逐渐增大，灯泡慢慢变亮；断开开关时，电流不会立刻消失，灯泡还会闪一下。线圈的自感电动势 E = LΔi/Δt 总是阻碍电流的变化。整块金属中的涡流也是同样的道理。',
      formula: 'E<sub>L</sub> = LΔi/Δt，τ = L/R',
      note: '自感电动势的大小由<b>自感系数 L 和电流变化率</b>共同决定：L 越大、电流变化越快，自感现象越明显。'
    };
  },
  draw(dt) {
    const s = this.state;
    const step = s.playing ? dt : 0;
    s.time += step;
    const tau = Math.max(.06, s.L / s.R * 1.4);
    const target = s.on ? 2 : 0;
    const before = s.i;
    s.i += (target - s.i) * Math.min(1, step / tau);
    if (Math.abs(s.i - target) < .004) s.i = target;
    s.di = (s.i - before) / Math.max(dt, .001);
    if (s.playing) {
      s.hist.push({t: s.time, i: s.i});
      while (s.hist.length > 2 && s.time - s.hist[0].t > 6) s.hist.shift();
    }

    setFrame(.5, .55, 14);
    base();
    const L = lim();
    const x0 = -6.0, x1 = -1.7, y0 = -1.5, y1 = 1.5;

    line({x: x0, y: y1}, {x: -4.3, y: y1}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: -3.8, y: y1}, {x: x1, y: y1}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x1, y: y0}, {x: x1, y: y1}, 'rgba(215,232,242,.8)', {w: 2});

    const gap = .5;
    const blade = s.on ? {x: -4.3 + gap, y: y1} : {x: -4.3 + gap * .82, y: y1 + .55};
    line({x: -4.3, y: y1}, {x: blade.x, y: blade.y}, '#ffc56b', {w: 3});
    dot({x: -4.3, y: y1}, '#ffd79a', 3);
    dot({x: -4.3 + gap, y: y1}, '#ffd79a', 3);
    sans('S', X(-4.05), Y(y1 + .42), 'rgba(255,215,154,.9)', 11);

    line({x: x0, y: -.22}, {x: x0, y: .22}, '#9ecbff', {w: 3});
    line({x: x0 - .16, y: -.45}, {x: x0 - .16, y: .45}, '#9ecbff', {w: 3});
    sans('电源', X(x0 - .55), Y(-.8), 'rgba(158,203,255,.85)', 11);

    spring({x: x1, y: .85}, {x: x1, y: -.85}, 7, '#b49cff', {amp: .16, w: 2});
    sans('L', X(x1) + .38, Y(.15), '#c4b2ff', 15);

    const glow = Math.min(1, s.i / 2);
    circleAt({x: -3.05, y: y0}, .34, 'rgba(255,225,150,' + (0.12 + glow * .8).toFixed(2) + ')', 'rgba(255,220,150,.85)', {w: 1.6});
    sans('灯泡', X(-3.05), Y(y0 - .62), 'rgba(200,220,235,.8)', 11);

    if (s.i > .05) {
      const dir = s.di > 0 ? 1 : -1;
      arrow({x: -1.9, y: .3 * dir}, {x: -1.9, y: -.3 * dir}, '#5eead4', {w: 2.2, head: 10});
      arrow({x: -3.05, y: y0}, {x: -3.05 + .45, y: y0}, '#5eead4', {w: 2.2, head: 10, alpha: .9});
      sans('i = ' + f2(s.i) + ' A', X(-3.05), Y(y0 - .95), 'rgba(126,236,214,.9)', 11);
    }

    const gx0 = .4, gx1 = 6.3, gy0 = 1.0, gy1 = 2.85;
    axisBox(gx0, gx1, gy0, gy1, 't / s', 'i / A');
    const mapT = t => gx1 - (s.time - t) * (gx1 - gx0) / 6;
    const mapI = v => gy0 + (v / 2.2) * (gy1 - gy0);
    const pts = s.hist.map(q => ({x: mapT(q.t), y: mapI(q.i)}));
    if (pts.length > 1) path(pts, '#ffc56b', {w: 2.2, glow: 6});
    line({x: gx0, y: mapI(2)}, {x: gx1, y: mapI(2)}, 'rgba(255,255,255,.12)', {w: 1, dash: [4, 5]});
    sans('稳态 2 A', X(gx1) - 4, Y(mapI(2)) - 10, 'rgba(200,220,235,.5)', 10, 'right');

    const ex0 = .4, ex1 = 6.3, ey0 = -2.95, ey1 = -.5;
    rect({x: ex0 + .3, y: ey1 - .55}, {x: ex1 - 1.2, y: ey0 + .3}, 'rgba(150,170,190,.12)', 'rgba(170,195,215,.45)', {w: 1.2});
    if (!s.core) {
      circleAt({x: ex0 + 1.9, y: (ey0 + ey1) / 2 - .1}, .42, null, 'rgba(255,197,107,.75)', {w: 1.6});
      circleAt({x: ex0 + 3.3, y: (ey0 + ey1) / 2 - .1}, .42, null, 'rgba(255,197,107,.75)', {w: 1.6});
    } else {
      for (let k = 0; k < 4; k++) {
        const xx = ex0 + .75 + k * .95;
        line({x: xx, y: ey1 - .5}, {x: xx, y: ey0 + .3}, 'rgba(200,215,230,.5)', {w: 1.2});
      }
      circleAt({x: ex0 + 1.6, y: (ey0 + ey1) / 2 - .1}, .16, null, 'rgba(255,197,107,.4)', {w: 1.2});
      circleAt({x: ex0 + 3.6, y: (ey0 + ey1) / 2 - .1}, .16, null, 'rgba(255,197,107,.4)', {w: 1.2});
    }
    sans(s.core ? '叠片铁芯：涡流被切断' : '整块金属：涡流很强', X(ex0 + .3), Y(ey1 - .72), s.core ? 'rgba(180,210,230,.75)' : 'rgba(255,215,154,.8)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const tau = Math.max(.06, s.L / s.R * 1.4);
    return [
      {k: '电流 i', v: f2(s.i) + ' A', hi: true},
      {k: '自感系数 L', v: f2(s.L) + ' H'},
      {k: '时间常数 τ', v: f2(tau) + ' s'},
      {k: '自感电动势 E', v: f2(Math.abs(s.di) * s.L) + ' V', hi: true},
      {k: '开关状态', v: s.on ? '闭合' : '断开'}
    ];
  },
  panel(el) {
    const s = this.state;
    addToggle(el, '闭合开关', s.on, v => {
      s.on = v;
      if (v) s.hist = [];
    });
    addSlider(el, '自感系数 L / H', .1, 1.2, .05, s.L, v => f2(v), v => s.L = v);
    addSlider(el, '电阻 R / Ω', 2, 10, .5, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '插入铁芯（L 增大）', s.core, v => {
      s.core = v;
      s.L = v ? Math.min(1.2, s.L * 2) : Math.max(.1, s.L / 2);
    });
    addBtn(el, '重置电流', () => { s.i = 0; s.hist = []; s.on = false; }, 'ghost');
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 电磁感应中的能量转化 ---------- */
MODULES.push({
  key: 'energy', tab: '05', name: '能量转化', en: 'ENERGY', blurb: '重力势能变电能',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '观察导体棒下落时速度、安培力与两种功率的变化',
  playable: true,
  state: {y: 2.4, v: 0, playing: true, B: 1, R: 1.2, m: .05},
  reset() { const s = this.state; s.y = 2.4; s.v = 0; s.playing = true; s.B = 1; s.R = 1.2; s.m = .05; },
  meta() {
    return {
      title: '电磁感应中的能量转化',
      desc: '导体棒在竖直导轨上由静止下落，切割磁感线产生感应电流。重力势能转化为电能，再在电阻上转化为内能。速度越大安培力越大，最终重力与安培力平衡，导体棒做匀速运动。',
      formula: 'mg = B<sup>2</sup>L<sup>2</sup>v/R，v<sub>m</sub> = mgR/(B<sup>2</sup>L<sup>2</sup>)',
      note: '稳定时<b>重力做功的功率等于电阻发热的功率</b>。电阻越小、磁场越强，安培力越大，最终速度越小。'
    };
  },
  draw(dt) {
    const s = this.state;
    const Lm = .5;
    const g = 9.8;
    if (s.playing) {
      const a = g - s.B * s.B * Lm * Lm * s.v / (s.m * s.R);
      s.v += a * dt;
      if (s.v < 0) s.v = 0;
      s.y -= s.v * dt * .22;
      if (s.y < -2.4) { s.y = 2.4; s.v = 0; }
    }
    setFrame(.5, .55, 14);
    base();
    const L = lim();

    crosses(-3.4, 3.4, -2.9, 2.9, .85, 'rgba(108,182,255,.26)');
    line({x: -2, y: 2.85}, {x: -2, y: -2.85}, 'rgba(215,232,242,.85)', {w: 2.4});
    line({x: 2, y: 2.85}, {x: 2, y: -2.85}, 'rgba(215,232,242,.85)', {w: 2.4});
    rect({x: -2.5, y: 2.5}, {x: 1.1, y: 2.86}, 'rgba(15,26,40,.95)', 'rgba(255,197,107,.8)', {w: 1.4});
    sans('R = ' + f2(s.R) + ' Ω', X(-.7), Y(2.68), '#ffd79a', 11);

    const E = s.B * Lm * s.v;
    const I = E / s.R;
    const F = s.B * I * Lm;

    if (I > .02) {
      arrow({x: -1.4, y: s.y + .3}, {x: 1.4, y: s.y + .3}, '#5eead4', {w: 2.2, head: 10, alpha: .75});
      arrow({x: 2, y: s.y + .45}, {x: 2, y: s.y + 1.15}, '#5eead4', {w: 2.6, head: 11, glow: 5});
      sans('i', X(1.55), Y(s.y + .3) - 12, '#7ee9d6', 13);
    }
    rect({x: -2, y: s.y - .09}, {x: 2, y: s.y + .09}, 'rgba(240,248,255,.95)', 'rgba(94,234,212,.7)', {w: 1.2});

    if (F > .01) {
      arrow({x: 0, y: s.y}, {x: 0, y: s.y + Math.min(1.8, F * 1.6)}, '#ff8fab', {w: 2.6, head: 12});
      sans('F安 = ' + f2(F) + ' N', X(0) + 12, Y(s.y + .9), '#ffb3c6', 11, 'left');
    }
    arrow({x: .8, y: s.y}, {x: .8, y: s.y - Math.min(1.6, s.v * .12 + .3)}, '#ffc56b', {w: 2.2, head: 10});
    sans('v = ' + f2(s.v) + ' m/s', X(.8) + 12, Y(s.y - .85), '#ffd79a', 11, 'left');

    const Pg = s.m * g * s.v, Pe = s.B * s.B * Lm * Lm * s.v * s.v / s.R;
    const Pmax = Math.max(.2, s.m * g * s.m * g * s.R / (s.B * s.B * .25));
    const bx = 3.9, bw = 1.5;
    sans('重力功率', X(bx), Y(2.5), 'rgba(255,197,107,.85)', 10.5, 'left');
    rect({x: bx, y: 2.15}, {x: bx + bw, y: 2.35}, 'rgba(255,255,255,.08)', null);
    rect({x: bx, y: 2.15}, {x: bx + bw * Math.min(1, Pg / Pmax), y: 2.35}, 'rgba(255,197,107,.8)', null);
    sans('电功率', X(bx), Y(1.7), 'rgba(94,234,212,.85)', 10.5, 'left');
    rect({x: bx, y: 1.35}, {x: bx + bw, y: 1.55}, 'rgba(255,255,255,.08)', null);
    rect({x: bx, y: 1.35}, {x: bx + bw * Math.min(1, Pe / Pmax), y: 1.55}, 'rgba(94,234,212,.8)', null);

    sans('B 垂直纸面向里', X(L.x0) + 16, Y(2.95), 'rgba(140,190,240,.7)', 10.5, 'left');
    sans('稳定时两功率相等', X(bx), Y(.95), 'rgba(180,210,225,.7)', 10.5, 'left');
    sans('v_m = ' + f2(s.m * 9.8 * s.R / (s.B * s.B * .25)) + ' m/s', X(bx), Y(.5), 'rgba(255,215,154,.8)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const Lm = .5;
    const Pg = s.m * 9.8 * s.v;
    const Pe = s.B * s.B * Lm * Lm * s.v * s.v / s.R;
    return [
      {k: '速度 v', v: f2(s.v) + ' m/s', hi: true},
      {k: '安培力 F', v: f2(s.B * s.B * Lm * Lm * s.v / s.R) + ' N'},
      {k: '重力功率', v: f2(Pg) + ' W'},
      {k: '电功率', v: f2(Pe) + ' W', hi: true},
      {k: '收尾速度', v: f2(s.m * 9.8 * s.R / (s.B * s.B * .25)) + ' m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '磁感应强度 B / T', .4, 1.4, .05, s.B, v => f2(v), v => { s.B = v; s.y = 2.4; s.v = 0; });
    addSlider(el, '电阻 R / Ω', .5, 3, .1, s.R, v => f2(v), v => { s.R = v; s.y = 2.4; s.v = 0; });
    addSlider(el, '导体棒质量 m / kg', .02, .1, .005, s.m, v => f2(v), v => { s.m = v; s.y = 2.4; s.v = 0; });
    addToggle(el, '释放导体棒', s.playing, v => s.playing = v);
    addBtn(el, '重新释放', () => { s.y = 2.4; s.v = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
