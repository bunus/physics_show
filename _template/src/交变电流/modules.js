/* ============================================================
   选择性必修第二册 · 第 3 章 交变电流
   ============================================================ */
(function () {

function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.replace('-', '−').replace(/0+$/, '').replace(/\.$/, '');
}
function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1).replace('-', '−');
}

function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .4, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .4}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 4, Y(y0) + 15, 'rgba(170,198,210,.85)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) + 10, 'rgba(170,198,210,.85)', 11, 'right');
}

function lamp(x, y, bright, label) {
  const g = Math.min(1, Math.max(0, bright));
  circleAt({x: x, y: y}, .34, 'rgba(255,226,150,' + (0.08 + g * .85).toFixed(2) + ')', 'rgba(255,220,150,.8)', {w: 1.4});
  if (g > .35) {
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      line({x: x + Math.cos(a) * .48, y: y + Math.sin(a) * .48},
        {x: x + Math.cos(a) * (.62 + g * .18), y: y + Math.sin(a) * (.62 + g * .18)},
        'rgba(255,226,150,' + (g * .55).toFixed(2) + ')', {w: 1.4});
    }
  }
  if (label) sans(label, X(x), Y(y - .8), 'rgba(210,225,235,.75)', 10.5);
}

/* ---------- 01 交流电的产生 ---------- */
MODULES.push({
  key: 'gen', tab: '01', name: '交流的产生', en: 'AC GENERATOR', blurb: '线圈转动生出电',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '观察线圈转动时磁通量与感应电动势的相位关系',
  playable: true,
  state: {th: 0, playing: true, B: .6, w: 2, N: 100, showFlux: true},
  reset() { const s = this.state; s.th = 0; s.playing = true; s.B = .6; s.w = 2; s.N = 100; s.showFlux = true; },
  meta() {
    return {
      title: '线圈在磁场中转动，产生交变电流',
      desc: '矩形线圈在匀强磁场中匀速转动，穿过它的磁通量按余弦规律变化，感应电动势按正弦规律变化。线圈平面与磁场垂直时磁通量最大而电动势为零；转到与磁场平行时磁通量为零、电动势最大。',
      formula: 'e = E<sub>m</sub>sin ωt，E<sub>m</sub> = NBAω',
      note: '注意<b>磁通量最大时电动势为零</b>：电动势取决于磁通量的变化率，而不是磁通量本身。电流方向每个周期改变两次。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.th += dt * s.w;
      if (s.th > 6.2832) s.th -= 6.2832;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const cx = -3.3, cy = .3, a = 1.5, S = 1.2;

    for (let k = -2; k <= 2; k++) {
      const y = k * 1.15 + .1;
      arrow({x: -6.3, y: y}, {x: -.7, y: y}, 'rgba(108,182,255,.4)', {w: 1.6, head: 9});
    }
    sans('B', X(-.8), Y(2.4), 'rgba(150,196,245,.85)', 15);
    sans('匀强磁场', X(-6.3), Y(2.65), 'rgba(150,196,245,.6)', 10.5, 'left');

    const ux = -Math.sin(s.th), uy = Math.cos(s.th);
    const e1 = {x: cx - ux * a, y: cy - uy * a};
    const e2 = {x: cx + ux * a, y: cy + uy * a};
    line(e1, e2, 'rgba(240,248,255,.95)', {w: 6});
    line(e1, e2, 'rgba(94,234,212,.55)', {w: 2.4});
    dot(e1, '#5eead4', 4.5);
    dot(e2, '#5eead4', 4.5);
    dot({x: cx, y: cy}, 'rgba(180,200,220,.6)', 3);

    if (s.showFlux) {
      const dir = Math.cos(s.th) >= 0 ? 1 : -1;
      arrow({x: cx, y: cy}, {x: cx + Math.cos(s.th) * dir * 1.0, y: cy + Math.sin(s.th) * dir * 1.0},
        'rgba(255,197,107,.85)', {w: 2, head: 10, dash: [5, 4]});
      sans('Φ', X(cx + Math.cos(s.th) * dir * 1.2), Y(cy + Math.sin(s.th) * dir * 1.2) - 10, 'rgba(255,215,154,.9)', 13);
    }

    const Em = s.N * s.B * S * s.w;
    const e = Em * Math.sin(s.th);
    lamp(-5.4, -2.0, Math.abs(e) / 260, '小灯泡');
    if (Math.abs(e) > Em * .04) {
      const dir = e > 0 ? 1 : -1;
      arrow({x: cx - ux * .45 * dir, y: cy - uy * .45 * dir}, {x: cx + ux * .45 * dir, y: cy + uy * .45 * dir},
        '#7be0c0', {w: 2.2, head: 11, alpha: .9});
    }

    const gx0 = 1.1, gx1 = 6.4;
    axisBox(gx0, gx1, -1.9, 1.9, 't', 'e');
    line({x: gx0, y: 0}, {x: gx1, y: 0}, 'rgba(198,222,232,.35)', {w: 1.2});
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const th = i / 160 * 6.2832;
      pts.push({x: gx0 + (th / 6.2832) * (gx1 - gx0), y: 1.55 * Math.sin(th)});
    }
    path(pts, 'rgba(123,224,192,.85)', {w: 2.2, glow: 5});
    line({x: gx0, y: 1.55}, {x: gx1, y: 1.55}, 'rgba(255,197,107,.3)', {w: 1, dash: [5, 5]});
    sans('Em', X(gx0) - 6, Y(1.55), 'rgba(255,215,154,.8)', 11, 'right');
    sans('e-t 图象（一个周期）', X(gx0) + 6, Y(1.78), 'rgba(180,240,220,.8)', 10.5, 'left');

    const nowX = gx0 + (s.th / 6.2832) * (gx1 - gx0);
    dot({x: nowX, y: 1.55 * Math.sin(s.th)}, '#eafff8', 4.5);
    line({x: nowX, y: -1.9}, {x: nowX, y: 1.9}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});

    sans('线圈平面与磁场' + (Math.abs(Math.sin(s.th)) < .15 ? '垂直：Φ 最大、e = 0' : Math.abs(Math.cos(s.th)) < .15 ? '平行：Φ = 0、e 最大' : '斜交'),
      X(L.x0) + 16, Y(-2.95), 'rgba(180,210,225,.75)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const Em = s.N * s.B * 1.2 * s.w;
    const e = Em * Math.sin(s.th);
    return [
      {k: '线圈转角 θ', v: f1(s.th * 180 / Math.PI) + '°'},
      {k: '磁通量 Φ', v: f2(s.B * 1.2 * Math.cos(s.th)) + ' Wb'},
      {k: '电动势 e', v: f1(e) + ' V', hi: true},
      {k: '峰值 Em', v: f1(Em) + ' V'},
      {k: '角速度 ω', v: f2(s.w) + ' rad/s', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '磁感应强度 B / T', .2, 1, .05, s.B, v => f2(v), v => s.B = v);
    addSlider(el, '角速度 ω / (rad/s)', .8, 6, .2, s.w, v => f2(v), v => s.w = v);
    addSlider(el, '线圈匝数 N', 50, 200, 10, s.N, v => String(Math.round(v)), v => s.N = v);
    addToggle(el, '显示磁通量方向', s.showFlux, v => s.showFlux = v);
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 峰值与有效值 ---------- */
MODULES.push({
  key: 'rms', tab: '02', name: '峰值与有效值', en: 'PEAK & RMS', blurb: '有效值怎么算',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '比较正弦交流电的峰值与有效值，理解有效值的定义',
  playable: true,
  state: {t: 0, playing: true, Um: 12, f: 2, showRms: true, showP: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.Um = 12; s.f = 2; s.showRms = true; s.showP = true; },
  meta() {
    return {
      title: '峰值是有效值的 √2 倍',
      desc: '正弦交流电的电压在峰值和零之间往复变化。把交流电与直流电分别加在相同电阻上，若相同时间内产生的热量相同，这个直流电的电压就叫交流电的有效值。正弦交流电满足 U = Um/√2。',
      formula: 'U = U<sub>m</sub>/√2 ≈ 0.707U<sub>m</sub>，I = I<sub>m</sub>/√2',
      note: '电表的读数、用电器的额定值都是<b>有效值</b>；只有考虑电容器耐压时才用峰值。有效值由电流的热效应定义。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt * .6;
      if (s.t > 2) s.t -= 2;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const gx0 = -5.6, gx1 = 5.6, scale = .085;

    line({x: gx0, y: 0}, {x: gx1, y: 0}, 'rgba(198,222,232,.42)', {w: 1.4});
    arrow({x: gx1 - .4, y: 0}, {x: gx1, y: 0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
    sans('t', X(gx1) - 4, Y(0) + 16, 'rgba(170,198,210,.85)', 11, 'right');
    sans('u / V', X(gx0) + 4, Y(2.4), 'rgba(170,198,210,.85)', 11, 'left');

    const ph = s.t * 6.2832;
    const pts = [];
    for (let i = 0; i <= 220; i++) {
      const a = ph + i / 220 * 12.566;
      pts.push({x: gx0 + (i / 220) * (gx1 - gx0), y: s.Um * scale * Math.sin(a)});
    }
    path(pts, '#6cb6ff', {w: 2.6, glow: 7});

    const up = s.Um * scale, ur = s.Um / Math.SQRT2 * scale;
    line({x: gx0, y: up}, {x: gx1, y: up}, 'rgba(255,197,107,.7)', {w: 1.2, dash: [7, 5]});
    line({x: gx0, y: -up}, {x: gx1, y: -up}, 'rgba(255,197,107,.4)', {w: 1, dash: [7, 5]});
    sans('峰值 Um = ' + f1(s.Um) + ' V', X(gx0) + 8, Y(up) - 12, 'rgba(255,215,154,.9)', 11, 'left');

    if (s.showRms) {
      line({x: gx0, y: ur}, {x: gx1, y: ur}, 'rgba(94,234,212,.85)', {w: 1.6, dash: [6, 4]});
      line({x: gx0, y: -ur}, {x: gx1, y: -ur}, 'rgba(94,234,212,.5)', {w: 1.2, dash: [6, 4]});
      sans('有效值 U = ' + f1(s.Um / Math.SQRT2) + ' V', X(gx0) + 8, Y(ur) + 15, 'rgba(126,236,214,.95)', 11, 'left');
      arrow({x: 4.4, y: 0}, {x: 4.4, y: ur}, 'rgba(94,234,212,.7)', {w: 1.4, head: 8});
    }

    const uNow = s.Um * Math.sin(ph);
    dot({x: gx0 + .02, y: uNow * scale}, '#eaf4ff', 4);

    if (s.showP) {
      const bx = 3.4, by = -2.5;
      sans('发热功率', X(bx) - .4, Y(by + .55), 'rgba(190,215,230,.8)', 10.5, 'left');
      rect({x: bx, y: by - .35}, {x: bx + 2.4, y: by - .1}, 'rgba(255,255,255,.07)', null);
      rect({x: bx, y: by - .35}, {x: bx + 2.4 * Math.min(1, (s.Um * s.Um / (2 * 10)) / 30), y: by - .1},
        'rgba(108,182,255,.8)', null);
      sans('P = U²/R = ' + f1(s.Um * s.Um / (2 * 10)) + ' W（R = 10 Ω）', X(bx), Y(by - .75),
        'rgba(160,200,240,.85)', 10.5, 'left');
    }

    sans('一个周期 T = ' + f2(1 / s.f) + ' s，频率 f = ' + f1(s.f) + ' Hz', X(L.x0) + 16, Y(2.9),
      'rgba(175,205,215,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '峰值 Um', v: f1(s.Um) + ' V', hi: true},
      {k: '有效值 U', v: f1(s.Um / Math.SQRT2) + ' V', hi: true},
      {k: '频率 f', v: f1(s.f) + ' Hz'},
      {k: '周期 T', v: f2(1 / s.f) + ' s'},
      {k: '角频率 ω', v: f1(6.2832 * s.f) + ' rad/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '峰值 Um / V', 5, 20, .5, s.Um, v => f1(v), v => s.Um = v);
    addSlider(el, '频率 f / Hz', 1, 5, .2, s.f, v => f1(v), v => s.f = v);
    addToggle(el, '显示有效值', s.showRms, v => s.showRms = v);
    addToggle(el, '显示发热功率', s.showP, v => s.showP = v);
    addBtn(el, '暂停波形', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 变压器 ---------- */
MODULES.push({
  key: 'transformer', tab: '03', name: '变压器', en: 'TRANSFORMER', blurb: '靠互感改变电压',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '改变原副线圈匝数，观察副线圈电压与电流的变化',
  playable: true,
  state: {ph: 0, playing: true, n1: 400, n2: 200, U1: 20, R: 20},
  reset() { const s = this.state; s.ph = 0; s.playing = true; s.n1 = 400; s.n2 = 200; s.U1 = 20; s.R = 20; },
  meta() {
    return {
      title: '变压器：匝数比决定电压比',
      desc: '原线圈接交流电源，铁芯中交变的磁通量同时穿过副线圈，在副线圈中产生感应电动势。副线圈匝数比原线圈少时降压，多时升压；电压比等于匝数比，而电流比与匝数比相反。',
      formula: 'U<sub>1</sub>/U<sub>2</sub> = n<sub>1</sub>/n<sub>2</sub>，I<sub>1</sub>/I<sub>2</sub> = n<sub>2</sub>/n<sub>1</sub>',
      note: '理想变压器<b>不改变功率</b>：P<sub>1</sub> = P<sub>2</sub>。升压时电流变小，降压时电流变大，这正是远距离输电采用高压的原因。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.ph += dt * 1.6;
      if (s.ph > 12.566) s.ph -= 12.566;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();

    const x0 = -1.5, x1 = 2.5, y0 = -2.1, y1 = 2.1, t = .3;
    rect({x: x0 - t, y: y0 - t}, {x: x0, y: y1 + t}, 'rgba(150,170,190,.2)', 'rgba(180,200,220,.55)', {w: 1.2});
    rect({x: x1, y: y0 - t}, {x: x1 + t, y: y1 + t}, 'rgba(150,170,190,.2)', 'rgba(180,200,220,.55)', {w: 1.2});
    rect({x: x0 - t, y: y1}, {x: x1 + t, y: y1 + t}, 'rgba(150,170,190,.2)', 'rgba(180,200,220,.55)', {w: 1.2});
    rect({x: x0 - t, y: y0 - t}, {x: x1 + t, y: y0}, 'rgba(150,170,190,.2)', 'rgba(180,200,220,.55)', {w: 1.2});
    sans('铁芯', X(.5), Y(y1 + .55), 'rgba(180,200,220,.7)', 10.5);

    spring({x: x0 - .02, y: 1.15}, {x: x0 - .02, y: -1.15}, 8, '#ffc56b', {amp: .22, w: 2});
    spring({x: x1 + .02, y: 1.15}, {x: x1 + .02, y: -1.15}, 8, '#5eead4', {amp: .22, w: 2});
    sans('n₁ = ' + Math.round(s.n1), X(x0 - .55), Y(-1.65), 'rgba(255,215,154,.9)', 11);
    sans('n₂ = ' + Math.round(s.n2), X(x1 + .55), Y(-1.65), 'rgba(126,236,214,.9)', 11);

    for (let k = 0; k < 6; k++) {
      const u = (s.ph / 6.2832 + k / 6) % 1;
      const per = 2 * ((x1 - x0) + (y1 - y0));
      let d = u * per, px, py;
      if (d < x1 - x0) { px = x0 + d; py = y1; }
      else if (d < (x1 - x0) + (y1 - y0)) { px = x1; py = y1 - (d - (x1 - x0)); }
      else if (d < 2 * (x1 - x0) + (y1 - y0)) { px = x1 - (d - (x1 - x0) - (y1 - y0)); py = y0; }
      else { px = x0; py = y0 + (d - 2 * (x1 - x0) - (y1 - y0)); }
      dot({x: px, y: py}, 'rgba(180,156,255,.5)', 2.6);
    }

    line({x: x0 - .02, y: 1.15}, {x: -4.9, y: 1.15}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0 - .02, y: -1.15}, {x: -4.9, y: -1.15}, 'rgba(215,232,242,.8)', {w: 2});
    circleAt({x: -5.2, y: 0}, .42, 'rgba(12,22,36,.95)', 'rgba(255,197,107,.8)', {w: 1.6});
    math('~', X(-5.2), Y(.02), '#ffd79a', 20);
    line({x: -5.2, y: .42}, {x: -5.2, y: 1.15}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: -5.2, y: -.42}, {x: -5.2, y: -1.15}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: -5.2, y: 1.15}, {x: -4.9, y: 1.15}, 'rgba(215,232,242,.8)', {w: 2});
    sans('U₁ = ' + f1(s.U1) + ' V', X(-5.2), Y(1.65), 'rgba(255,215,154,.85)', 10.5);

    const U2 = s.U1 * s.n2 / s.n1;
    const I2 = U2 / s.R;
    line({x: x1 + .02, y: 1.15}, {x: 5.4, y: 1.15}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x1 + .02, y: -1.15}, {x: 5.4, y: -1.15}, 'rgba(215,232,242,.8)', {w: 2});
    rect({x: 5.2, y: -.55}, {x: 5.62, y: .55}, 'rgba(12,22,36,.95)', 'rgba(94,234,212,.8)', {w: 1.6});
    line({x: 5.4, y: .55}, {x: 5.4, y: 1.15}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: 5.4, y: -.55}, {x: 5.4, y: -1.15}, 'rgba(215,232,242,.8)', {w: 2});
    sans('R', X(5.4), Y(0), '#7ee9d6', 12);
    sans('U₂ = ' + f1(U2) + ' V', X(5.4), Y(1.65), 'rgba(126,236,214,.9)', 10.5);

    sans(s.n2 > s.n1 ? '升压变压器' : s.n2 < s.n1 ? '降压变压器' : '匝数相同，电压不变',
      X(L.x0) + 18, Y(2.85), 'rgba(196,178,255,.9)', 12, 'left');
    sans('U₂ = U₁·n₂/n₁', X(L.x1) - 18, Y(2.85), 'rgba(180,210,225,.7)', 10.5, 'right');
    sans('铁芯中交变的磁通量把能量从原线圈传到副线圈', X(L.x0) + 18, Y(-2.85),
      'rgba(175,205,215,.6)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const U2 = s.U1 * s.n2 / s.n1;
    const I2 = U2 / s.R;
    return [
      {k: '匝数 n₁ : n₂', v: Math.round(s.n1) + ' : ' + Math.round(s.n2), hi: true},
      {k: '原线圈 U₁', v: f1(s.U1) + ' V'},
      {k: '副线圈 U₂', v: f1(U2) + ' V', hi: true},
      {k: '副线圈电流 I₂', v: f2(I2 * 1000) + ' mA'},
      {k: '输出功率 P', v: f1(U2 * I2) + ' W'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '原线圈匝数 n₁', 100, 800, 20, s.n1, v => String(Math.round(v)), v => s.n1 = v);
    addSlider(el, '副线圈匝数 n₂', 100, 800, 20, s.n2, v => String(Math.round(v)), v => s.n2 = v);
    addSlider(el, '输入电压 U₁ / V', 5, 36, 1, s.U1, v => f1(v), v => s.U1 = v);
    addSlider(el, '负载电阻 R / Ω', 5, 50, 1, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '磁通量流动', s.playing, v => s.playing = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 远距离输电 ---------- */
MODULES.push({
  key: 'grid', tab: '04', name: '远距离输电', en: 'POWER GRID', blurb: '高压为什么省电',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变输电电压，观察线路损耗比例的变化',
  state: {P: 100, U: 10, R: 10, showLoss: true},
  reset() { const s = this.state; s.P = 100; s.U = 10; s.R = 10; s.showLoss = true; },
  meta() {
    return {
      title: '远距离输电：升高电压才能减小损耗',
      desc: '发电站输出的功率一定时，输电电压越高，导线中的电流越小。导线发热功率 P损 = I²R 与电流的平方成正比，所以高压输电可以大幅减少线路损耗，到达用户端再降压使用。',
      formula: 'I = P/U，P<sub>损</sub> = I<sup>2</sup>R = P<sup>2</sup>R/U<sup>2</sup>',
      note: '损耗与电压的<b>平方成反比</b>：电压升高到 10 倍，损耗降到 1/100。这就是采用高压输电的根本原因。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const I = s.P * 1000 / (s.U * 1000);
    const Ploss = I * I * s.R;

    const yb = 1.3;
    const box = (x, w, label, col) => {
      rect({x: x, y: yb - .45}, {x: x + w, y: yb + .45}, 'rgba(12,24,38,.9)', col, {w: 1.4});
      sans(label, X(x + w / 2), Y(yb), 'rgba(220,235,245,.92)', 10.5);
    };
    box(-6.1, 1.3, '发电机', 'rgba(255,197,107,.7)');
    box(-4.3, 1.15, '升压', 'rgba(180,156,255,.7)');
    box(3.15, 1.15, '降压', 'rgba(180,156,255,.7)');
    box(4.75, 1.35, '用户', 'rgba(94,234,212,.7)');

    arrow({x: -4.75, y: yb}, {x: -4.35, y: yb}, 'rgba(200,220,235,.5)', {w: 1.6, head: 8});
    arrow({x: -3.1, y: yb}, {x: 3.1, y: yb}, 'rgba(200,220,235,.35)', {w: 1.4, head: 8});
    arrow({x: 4.35, y: yb}, {x: 4.7, y: yb}, 'rgba(200,220,235,.5)', {w: 1.6, head: 8});

    line({x: -3.15, y: yb + .28}, {x: 3.15, y: yb + .28}, '#ff8fab', {w: Math.max(1.2, Math.min(6, I / 8))});
    line({x: -3.15, y: yb - .28}, {x: 3.15, y: yb - .28}, '#ff8fab', {w: Math.max(1.2, Math.min(6, I / 8))});
    sans('输电线 R = ' + f1(s.R) + ' Ω', X(0), Y(yb + .62), 'rgba(255,179,198,.85)', 10.5);
    sans('I = ' + f1(I) + ' A', X(0), Y(yb - .62), 'rgba(255,179,198,.8)', 10.5);

    sans('U = ' + f1(s.U) + ' kV', X(-3.65), Y(yb + .95), 'rgba(255,215,154,.9)', 11);
    sans('P = ' + f1(s.P) + ' kW', X(-5.45), Y(yb + .95), 'rgba(255,215,154,.9)', 11);

    const rate = Ploss / (s.P * 1000);
    const bx = -2.2, bw = 4.2;
    if (s.showLoss) {
      sans('线路损耗功率 P损 = I²R', X(bx), Y(-.05), 'rgba(200,220,235,.85)', 11, 'left');
      rect({x: bx, y: -.55}, {x: bx + bw, y: -.2}, 'rgba(255,255,255,.07)', 'rgba(200,220,235,.2)', {w: 1});
      rect({x: bx, y: -.55}, {x: bx + bw * Math.min(1, rate), y: -.2}, rate > .5 ? '#ff6b81' : '#ffc56b', null);
      sans(f1(Ploss / 1000) + ' kW（占 ' + f1(rate * 100) + '%）', X(bx + bw) + 10, Y(-.38),
        rate > .5 ? 'rgba(255,140,160,.95)' : 'rgba(255,215,154,.95)', 11, 'left');
    }

    const alt = s.P * s.P * s.R / (s.U * s.U * 100);
    sans('若电压提高 10 倍：损耗 ' + f1(alt) + ' kW（降为 1/100）',
      X(bx), Y(-1.25), 'rgba(126,236,214,.8)', 10.5, 'left');

    const userP = s.P - Ploss / 1000;
    sans('用户得到 ' + f1(userP) + ' kW', X(bx), Y(-1.85), 'rgba(190,215,230,.8)', 10.5, 'left');
    sans('输送功率一定时，电压越高、电流越小', X(L.x0) + 16, Y(-2.95), 'rgba(175,205,215,.6)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const I = s.P * 1000 / (s.U * 1000);
    const Ploss = I * I * s.R;
    return [
      {k: '输送功率 P', v: f1(s.P) + ' kW'},
      {k: '输电电压 U', v: f1(s.U) + ' kV', hi: true},
      {k: '输电电流 I', v: f1(I) + ' A', hi: true},
      {k: '线路损耗 P损', v: f1(Ploss / 1000) + ' kW'},
      {k: '损耗比例', v: f1(Ploss / (s.P * 1000) * 100) + ' %'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '输送功率 P / kW', 20, 200, 5, s.P, v => f1(v), v => s.P = v);
    addSlider(el, '输电电压 U / kV', 2, 20, .5, s.U, v => f1(v), v => s.U = v);
    addSlider(el, '线路电阻 R / Ω', 2, 20, .5, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '显示损耗功率条', s.showLoss, v => s.showLoss = v);
    addBtn(el, '改用 20 kV 高压', () => { s.U = 20; }, 'ghost');
    addBtn(el, '改用 2 kV 低压', () => { s.U = 2; }, 'ghost');
  }
});

/* ---------- 05 电感与电容对交流的影响 ---------- */
MODULES.push({
  key: 'reactance', tab: '05', name: '感抗与容抗', en: 'REACTANCE', blurb: '谁通交流谁阻',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '改变频率，比较电感支路与电容支路中灯泡的亮度',
  state: {f: 50, L: .5, C: 10, showX: true},
  reset() { const s = this.state; s.f = 50; s.L = .5; s.C = 10; s.showX = true; },
  meta() {
    return {
      title: '电感“阻交流”，电容“通交流”',
      desc: '把电感和电容分别接入交流电路，频率越高，感抗 X_L = 2πfL 越大，电感支路的灯泡越暗；容抗 X_C = 1/(2πfC) 越小，电容支路的灯泡越亮。频率降低时现象正好相反。',
      formula: 'X<sub>L</sub> = 2πfL，X<sub>C</sub> = 1/(2πfC)',
      note: '电感<b>通直流、阻交流，通低频、阻高频</b>；电容则相反。两者都不消耗电能，只改变电流与电压的相位关系。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const U = 10;
    const XL = 6.2832 * s.f * s.L;
    const XC = 1 / (6.2832 * s.f * s.C * 1e-6);
    const IL = U / XL, IC = U / XC;

    const x0 = -5.2, x1 = -.5, yt = 1.7, yb2 = -1.7;
    line({x: x0, y: yt}, {x: x1, y: yt}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yb2}, {x: x1, y: yb2}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yt}, {x: x0, y: yb2}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x1, y: yt}, {x: x1, y: yb2}, 'rgba(215,232,242,.8)', {w: 2});
    circleAt({x: x0, y: 0}, .42, 'rgba(12,22,36,.95)', 'rgba(255,197,107,.8)', {w: 1.6});
    math('~', X(x0), Y(.02), '#ffd79a', 20);
    sans('10 V 交流', X(x0), Y(-2.55), 'rgba(255,215,154,.85)', 10.5);

    spring({x: -3.6, y: yt}, {x: -2.4, y: yt}, 6, '#b49cff', {amp: .2, w: 2});
    sans('L = ' + f2(s.L) + ' H', X(-3.0), Y(yt + .45), 'rgba(196,178,255,.9)', 10.5);
    lamp(-1.05, yt, IL / .7, '');
    sans('i₁ = ' + f1(IL * 1000) + ' mA', X(-1.05), Y(yt + .58), 'rgba(126,236,214,.85)', 10);

    line({x: -3.62, y: yb2 - .22}, {x: -3.62, y: yb2 + .22}, '#5eead4', {w: 2.6});
    line({x: -3.38, y: yb2 - .22}, {x: -3.38, y: yb2 + .22}, '#5eead4', {w: 2.6});
    line({x: -3.6, y: yb2}, {x: -3.62, y: yb2}, '#5eead4', {w: 2});
    line({x: -3.38, y: yb2}, {x: -2.4, y: yb2}, '#5eead4', {w: 2});
    sans('C = ' + f1(s.C) + ' μF', X(-3.0), Y(yb2 - .45), 'rgba(126,236,214,.9)', 10.5);
    lamp(-1.05, yb2, IC / .7, '');
    sans('i₂ = ' + f1(IC * 1000) + ' mA', X(-1.05), Y(yb2 - .58), 'rgba(126,236,214,.85)', 10);

    sans('电感支路', X(-4.6), Y(yt + .45), 'rgba(196,178,255,.85)', 10.5, 'left');
    sans('电容支路', X(-4.6), Y(yb2 - .45), 'rgba(94,234,212,.85)', 10.5, 'left');

    if (s.showX) {
      const bx = 1.1, bw = 4.4;
      const mk = (yy, label, val, unit, ratio, col) => {
        sans(label, X(bx), Y(yy), col, 10.5, 'left');
        sans(val + ' ' + unit, X(bx + bw), Y(yy), col, 10.5, 'right');
        rect({x: bx, y: yy - .42}, {x: bx + bw, y: yy - .18}, 'rgba(255,255,255,.07)', null);
        rect({x: bx, y: yy - .42}, {x: bx + bw * Math.min(1, ratio), y: yy - .18}, col, null);
      };
      sans('感抗与容抗（对数刻度）', X(bx), Y(2.75), 'rgba(190,215,230,.8)', 11, 'left');
      mk(1.95, '感抗 X_L', f1(XL), 'Ω', Math.log10(XL) / 5, 'rgba(180,156,255,.85)');
      mk(.35, '容抗 X_C', f1(XC), 'Ω', Math.log10(XC) / 5, 'rgba(94,234,212,.85)');
      sans('X_L = 2πfL', X(bx), Y(-1.25), 'rgba(180,210,225,.7)', 10.5, 'left');
      sans('X_C = 1/(2πfC)', X(bx), Y(-1.8), 'rgba(180,210,225,.7)', 10.5, 'left');
      sans('f = ' + Math.round(s.f) + ' Hz', X(bx), Y(-2.4), 'rgba(255,215,154,.85)', 11, 'left');
    }
    sans('频率越高：电感越“挡”，电容越“通”', X(L.x0) + 16, Y(-3.05), 'rgba(175,205,215,.65)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const XL = 6.2832 * s.f * s.L;
    const XC = 1 / (6.2832 * s.f * s.C * 1e-6);
    return [
      {k: '频率 f', v: Math.round(s.f) + ' Hz', hi: true},
      {k: '感抗 X_L', v: f1(XL) + ' Ω'},
      {k: '容抗 X_C', v: f1(XC) + ' Ω'},
      {k: '电感支路电流', v: f1(10 / XL * 1000) + ' mA', hi: true},
      {k: '电容支路电流', v: f1(10 / XC * 1000) + ' mA'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '频率 f / Hz', 10, 1000, 10, s.f, v => String(Math.round(v)), v => s.f = v);
    addSlider(el, '自感系数 L / H', .1, 1, .05, s.L, v => f2(v), v => s.L = v);
    addSlider(el, '电容 C / μF', 1, 30, 1, s.C, v => f1(v), v => s.C = v);
    addToggle(el, '显示感抗容抗', s.showX, v => s.showX = v);
    addBtn(el, '50 Hz（市电）', () => { s.f = 50; }, 'ghost');
  }
});

})();
