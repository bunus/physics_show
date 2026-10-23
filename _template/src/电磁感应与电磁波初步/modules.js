/* ============================================================
   必修第三册 · 第 5 章 电磁感应与电磁波初步
   ============================================================ */
(function () {

const MU0 = 4 * Math.PI * 1e-7;

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function f3(v) {
  const s = (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function ellipse(cx, cy, rx, ry, n) {
  const pts = [];
  const m = n || 44;
  for (let i = 0; i <= m; i++) {
    const a = i / m * Math.PI * 2;
    pts.push({x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry});
  }
  return pts;
}

/* ---------- 01 磁场与磁感线 ---------- */
MODULES.push({
  key: 'magnet', tab: '01', name: '磁场与磁感线', en: 'MAGNETIC FIELD', blurb: '磁体周围的场',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '拖动小磁针，观察各点磁场方向与磁感线形状',
  state: {strength: 1, probe: {x: .4, y: 2.0}, showNeedle: true, showLines: true},
  reset() {
    const s = this.state;
    s.strength = 1; s.probe = {x: .4, y: 2.0}; s.showNeedle = true; s.showLines = true;
  },
  meta() {
    return {
      title: '磁体周围存在磁场，用磁感线描述',
      desc: '磁体周围存在磁场，小磁针 N 极所指的方向就是该点的磁场方向。拖动小磁针在磁体周围移动，观察各点磁场方向的变化与磁感线的形状，理解磁感线从 N 极出发、回到 S 极。',
      formula: '<b>B</b> 的方向 = 小磁针 N 极受力方向',
      note: '磁感线是<b>闭合曲线</b>：磁体外部从 N 极到 S 极，内部从 S 极回到 N 极。磁感线越密，磁场越强。'
    };
  },
  fieldAt(x, y) {
    const poles = [{x: -1.15, y: 0, q: 1}, {x: 1.15, y: 0, q: -1}];
    let bx = 0, by = 0;
    for (let i = 0; i < poles.length; i++) {
      const dx = x - poles[i].x, dy = y - poles[i].y;
      let r2 = dx * dx + dy * dy;
      if (r2 < .04) r2 = .04;
      const f = poles[i].q / (r2 * Math.sqrt(r2));
      bx += f * dx; by += f * dy;
    }
    return {x: bx * this.state.strength, y: by * this.state.strength};
  },
  trace(x, y) {
    const pts = [{x: x, y: y}];
    for (let k = 0; k < 260; k++) {
      const b = this.fieldAt(x, y);
      const m = Math.hypot(b.x, b.y);
      if (!isFinite(m) || m < 1e-9) break;
      x += .085 * b.x / m;
      y += .085 * b.y / m;
      pts.push({x: x, y: y});
      const L = lim();
      if (x < L.x0 - .05 || x > L.x1 + .05 || y < L.y0 - .05 || y > L.y1 + .05) break;
      if (Math.hypot(x - 1.15, y) < .24) break;
    }
    return pts;
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();

    if (s.showLines) {
      for (let i = 0; i < 14; i++) {
        const a = i / 14 * Math.PI * 2;
        const x0 = -1.15 + Math.cos(a) * .42, y0 = Math.sin(a) * .42;
        if (Math.abs(x0) < 1.55 && Math.abs(y0) < .36) continue;
        const pts = this.trace(x0, y0);
        if (pts.length < 3) continue;
        path(pts, 'rgba(108,182,255,.42)', {w: 1.4});
        for (let k = 22; k < pts.length - 4; k += 34) {
          arrow(pts[k], pts[k + 3], 'rgba(150,200,255,.75)', {w: 1, head: 6});
        }
      }
    }

    rect({x: -1.55, y: -.32}, {x: 0, y: .32}, 'rgba(255,143,107,.35)', 'rgba(255,143,107,.8)', {w: 1.5});
    rect({x: 0, y: -.32}, {x: 1.55, y: .32}, 'rgba(108,182,255,.3)', 'rgba(108,182,255,.8)', {w: 1.5});
    sans('N', X(-.78), Y(0), '#ffd0bd', 17);
    sans('S', X(.78), Y(0), '#c3dcff', 17);
    sans('条形磁体', X(0), Y(-.85), 'rgba(190,215,225,.6)', 10.5);

    const P = s.probe;
    const b = this.fieldAt(P.x, P.y);
    const mag = Math.hypot(b.x, b.y);
    const len = clamp(.3 + mag * 3.4, .3, 1.5);
    if (mag > 1e-6) {
      arrow(P, {x: P.x + b.x / mag * len, y: P.y + b.y / mag * len}, '#ffd166', {w: 2.6, head: 12});
      sans('B', X(P.x + b.x / mag * len) + 10, Y(P.y + b.y / mag * len) - 6, '#ffe0a0', 13, 'left');
    }

    if (s.showNeedle) {
      circleAt(P, .32, 'rgba(11,24,40,.75)', 'rgba(220,235,240,.45)', {w: 1.3});
      const ang = Math.atan2(b.y, b.x);
      const nx = Math.cos(ang) * .28, ny = Math.sin(ang) * .28;
      line({x: P.x - nx, y: P.y - ny}, {x: P.x + nx, y: P.y + ny}, '#dfe9ee', {w: 2.4});
      arrow({x: P.x, y: P.y}, {x: P.x + nx, y: P.y + ny}, '#ff8f6b', {w: 2.4, head: 8});
      sans('N', X(P.x + nx * 1.6), Y(P.y + ny * 1.6), '#ffb3a0', 9);
    }
    handle(P, '#ffd166', hoverId === 'P');

    sans('拖动小磁针改变位置', X(lim().x0) + 8, Y(3.8), 'rgba(180,210,220,.55)', 10, 'left');
    sans('B = ' + f1(mag * 18) + ' mT', X(lim().x1) - 10, Y(3.3), '#ffe0a0', 14, 'right');
  },
  handles() { return [{id: 'P', x: this.state.probe.x, y: this.state.probe.y}]; },
  drag(id, p) { this.state.probe = clampPt(p); },
  hud() {
    const s = this.state;
    const b = this.fieldAt(s.probe.x, s.probe.y);
    const mag = Math.hypot(b.x, b.y);
    const ang = Math.atan2(b.y, b.x) * 180 / Math.PI;
    return [
      {k: '磁感应强度 B', v: f1(mag * 18) + ' mT', hi: true},
      {k: '磁场方向', v: f1(Math.abs(ang)) + '°'},
      {k: '距 N 极', v: f1(Math.hypot(s.probe.x + 1.15, s.probe.y) * .1) + ' m'},
      {k: '磁体强度', v: s.strength.toFixed(1) + ' 倍', hi: true},
      {k: '磁场描述', v: '磁感线疏密'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '磁体强度 / 倍', .4, 2, .1, s.strength, v => f1(v), v => s.strength = v);
    addToggle(el, '显示小磁针', s.showNeedle, v => s.showNeedle = v);
    addToggle(el, '显示磁感线', s.showLines, v => s.showLines = v);
    addBtn(el, '磁针回到上方', () => { s.probe = {x: .4, y: 2.0}; }, 'ghost');
  }
});

/* ---------- 02 安培定则 ---------- */
MODULES.push({
  key: 'ampere', tab: '02', name: '安培定则', en: 'AMPERE RULE', blurb: '右手判断方向',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换直导线、环形电流与螺线管，用右手判断磁场方向',
  playable: true,
  state: {mode: 0, I: 5, r: 5, reverse: false, phase: 0, playing: true, showLines: true},
  reset() {
    const s = this.state;
    s.mode = 0; s.I = 5; s.r = 5; s.reverse = false; s.phase = 0; s.playing = true; s.showLines = true;
  },
  meta() {
    return {
      title: '安培定则：右手判断磁场方向',
      desc: '直线电流的磁场是以导线为轴的同心圆，环形电流和通电螺线管的磁场方向都可以用右手判断。切换三种情况，改变电流大小与方向，观察磁感线形状和磁感应强度的变化。',
      formula: '直线：B = μ<sub>0</sub>I/(2πr)；螺线管：B = μ<sub>0</sub>nI',
      note: '右手握住导线，<b>拇指指向电流方向</b>，四指弯曲的方向就是磁感线的环绕方向。电流反向，磁场方向也反向。'
    };
  },
  bval() {
    const s = this.state;
    const I = s.I, r = s.r / 100;
    if (s.mode === 0) return MU0 * I / (2 * Math.PI * r);
    if (s.mode === 1) return MU0 * I / (2 * r);
    return MU0 * 200 * I / r;
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.phase += dt * 1.2;
    setFrame(.5, .55, 14);
    base();
    const dir = s.reverse ? -1 : 1;

    if (s.mode === 0) {
      const rr = s.r / 5;
      if (s.showLines) {
        for (let k = 1; k <= 3; k++) {
          const R = rr * k / 3 * 1.0 + .4;
          const pts = ellipse(0, 0, R, R, 60);
          path(pts, 'rgba(180,156,255,.45)', {w: 1.4});
          for (let q = 0; q < 4; q++) {
            const a = q / 4 * Math.PI * 2 + s.phase * .2;
            const a2 = a + .18 * dir;
            arrow({x: Math.cos(a) * R, y: Math.sin(a) * R},
              {x: Math.cos(a2) * R, y: Math.sin(a2) * R}, 'rgba(205,190,255,.8)', {w: 1.2, head: 7});
          }
          for (let q = 0; q < 6; q++) {
            const a = q / 6 * Math.PI * 2 + s.phase;
            dot({x: Math.cos(a) * R, y: Math.sin(a) * R}, 'rgba(180,156,255,.7)', 2.2);
          }
        }
      }
      circleAt({x: 0, y: 0}, .24, 'rgba(255,178,122,.25)', '#ffb27a', {w: 2});
      sans(s.reverse ? '×' : '·', X(0), Y(0) + 1, '#ffd0bd', 20);
      sans(s.reverse ? '电流垂直纸面向里' : '电流垂直纸面向外', X(0), Y(2.9), '#ffd0bd', 12);

      const P = {x: rr, y: 0};
      line({x: 0, y: 0}, P, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      dot(P, '#ffd166', 4.5);
      arrow(P, {x: P.x, y: P.y + .75 * dir}, '#ffd166', {w: 2.4, head: 10});
      sans('B', X(P.x) + 12, Y(P.y + .75 * dir), '#ffe0a0', 13, 'left');
      sans('r = ' + f1(s.r) + ' cm', X(rr / 2), Y(-.28), 'rgba(210,228,236,.75)', 11);
      sans('右手握导线：拇指指电流，四指绕向即 B 的方向', X(0), Y(-3.3), 'rgba(190,215,225,.7)', 11);
    } else if (s.mode === 1) {
      const R = s.r / 5 * .7 + .8;
      const loop = ellipse(0, 0, R, R * .32, 56);
      path(loop, '#b49cff', {w: 2.6, glow: 6});
      for (let q = 0; q < 8; q++) {
        const a = q / 8 * Math.PI * 2 + s.phase * .5;
        dot({x: Math.cos(a) * R, y: Math.sin(a) * R * .32}, 'rgba(205,190,255,.85)', 2.6);
      }
      arrow({x: -R, y: 0}, {x: -R + .3, y: -.16 * dir}, '#c8baff', {w: 1.8, head: 8});
      arrow({x: R, y: 0}, {x: R - .3, y: .16 * dir}, '#c8baff', {w: 1.8, head: 8});
      if (s.showLines) {
        for (let i = -1; i <= 1; i++) {
          const y = i * .55;
          arrow({x: -4.4, y: y}, {x: 4.4, y: y}, 'rgba(180,156,255,.5)', {w: 1.3, head: 8});
        }
      }
      dot({x: 0, y: 0}, '#ffd166', 5);
      sans('B', X(.35), Y(.55), '#ffe0a0', 14, 'left');
      sans('环形电流：右手四指顺电流，拇指指环内磁场', X(0), Y(-2.7), 'rgba(190,215,225,.7)', 11);
      sans('半径 R = ' + f1(s.r) + ' cm', X(0), Y(-3.15), 'rgba(190,215,225,.55)', 10.5);
    } else {
      for (let i = 0; i < 8; i++) {
        const x = -2.8 + i * .8;
        const pts = ellipse(x, 0, .2, .85, 26);
        path(pts, 'rgba(180,156,255,.55)', {w: 1.6});
      }
      if (s.showLines) {
        for (let i = -1; i <= 1; i++) {
          const y = i * .42;
          arrow({x: -2.4, y: y}, {x: 2.4, y: y}, 'rgba(255,209,102,.65)', {w: 1.6, head: 9});
        }
      }
      sans('S', X(-3.15), Y(.1), '#c3dcff', 13);
      sans('N', X(3.15), Y(.1), '#ffd0bd', 13);
      sans('通电螺线管：右手握螺线管，拇指指 N 极', X(0), Y(-2.7), 'rgba(190,215,225,.7)', 11);
      sans('内部磁场近似匀强', X(0), Y(-3.15), 'rgba(190,215,225,.55)', 10.5);
    }

    const b = this.bval();
    let txt;
    if (s.mode === 0) txt = 'B = ' + f1(b * 1e6) + ' μT';
    else if (s.mode === 1) txt = 'B = ' + f1(b * 1e6) + ' μT';
    else txt = 'B = ' + f1(b * 1e3) + ' mT';
    sans(txt, X(lim().x0) + 8, Y(3.75), '#ffe0a0', 14, 'left');
    sans('I = ' + f1(s.I) + ' A' + (s.reverse ? '（反向）' : ''), X(lim().x0) + 8, Y(3.2), 'rgba(126,236,214,.85)', 11.5, 'left');
  },
  hud() {
    const s = this.state;
    const b = this.bval();
    const unit = s.mode === 2 ? ' mT' : ' μT';
    const sc = s.mode === 2 ? 1e3 : 1e6;
    const geo = s.mode === 0 ? '距离 r' : s.mode === 1 ? '半径 R' : '管长 L';
    return [
      {k: '电流 I', v: f1(s.I) + ' A', hi: true},
      {k: geo, v: f1(s.r) + ' cm'},
      {k: '磁感应强度 B', v: f1(b * sc) + unit, hi: true},
      {k: '电流方向', v: s.reverse ? '反向' : '正向'},
      {k: '判断方法', v: '安培定则'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['直导线', '环形', '螺线管'], s.mode, i => { s.mode = i; s.phase = 0; });
    addSlider(el, '电流 I / A', 1, 10, .5, s.I, v => f1(v), v => s.I = v);
    addSlider(el, '尺寸 r / cm', 2, 10, .5, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '电流反向', s.reverse, v => s.reverse = v);
    addToggle(el, '显示磁感线', s.showLines, v => s.showLines = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 磁通量 ---------- */
MODULES.push({
  key: 'flux', tab: '03', name: '磁通量', en: 'MAGNETIC FLUX', blurb: '穿过线圈的多少',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '转动线圈，观察有效面积与磁通量的变化',
  playable: true,
  state: {B: .5, S: .04, th: 0, playing: false, showN: true},
  reset() { const s = this.state; s.B = .5; s.S = .04; s.th = 0; s.playing = false; s.showN = true; this.sl = null; },
  meta() {
    return {
      title: '磁通量 Φ = BS cosθ',
      desc: '磁通量表示穿过某个面的磁感线条数，等于磁感应强度、面积与两者夹角余弦的乘积。转动线圈改变夹角，观察它在垂直于磁场方向上的投影面积与磁通量怎样变化，注意 θ 是法线与磁场方向的夹角。',
      formula: 'Φ = BS cosθ，单位：Wb',
      note: '线圈平面<b>垂直于磁场</b>时 Φ 最大；平面与磁场平行时 Φ = 0。磁通量是标量，但有正负之分。'
    };
  },
  flux() { return this.state.B * this.state.S * Math.cos(this.state.th); },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.th += dt * .8;
      if (s.th > Math.PI / 2) s.th = 0;
      if (this.sl) this.sl.set(s.th * 180 / Math.PI, false);
    }
    setFrame(.5, .55, 14);
    base();

    for (let i = 0; i < 9; i++) {
      const y = -2.16 + i * .54;
      arrow({x: -6.4, y: y}, {x: 6.4, y: y}, 'rgba(108,182,255,.28)', {w: 1.1, head: 6});
    }
    sans('匀强磁场 B', X(-6.2), Y(2.75), 'rgba(160,200,255,.85)', 11.5, 'left');

    const a = 1.55 * Math.cos(s.th), d = .55 * Math.sin(s.th);
    const quad = [{x: -a - d, y: 1.5}, {x: a - d, y: 1.5}, {x: a + d, y: -1.5}, {x: -a + d, y: -1.5}];
    poly(quad, 'rgba(94,234,212,.12)', 'rgba(94,234,212,.85)', {w: 2.2});

    if (s.showN) {
      const nx = Math.cos(s.th), ny = Math.sin(s.th) * .42;
      arrow({x: 0, y: 0}, {x: nx * 1.9, y: ny * 1.9}, '#ffd166', {w: 2.4, head: 11});
      sans('n', X(nx * 1.9) + 12, Y(ny * 1.9) - 6, '#ffe0a0', 14, 'left');
    }
    angleArc({x: 0, y: 0}, 0, s.th, 44, 'rgba(255,209,102,.7)', '', 11);
    sans('θ = ' + f1(s.th * 180 / Math.PI) + '°', X(0) + 52, Y(0) + 22, 'rgba(255,220,150,.9)', 11.5);

    const proj = 3 * Math.abs(Math.cos(s.th));
    line({x: -proj / 2, y: -2.05}, {x: proj / 2, y: -2.05}, 'rgba(255,209,102,.6)', {w: 3});
    sans('垂直磁场方向上的投影宽度', X(0), Y(-2.4), 'rgba(200,225,235,.65)', 10.5);

    sans('Φ = ' + f2(this.flux() * 1000) + ' mWb', X(4.7), Y(2.75), '#8fe9d8', 15, 'right');
    sans('S⊥ = S cosθ', X(4.7), Y(2.2), 'rgba(190,215,225,.7)', 11, 'right');
  },
  hud() {
    const s = this.state;
    return [
      {k: '磁感应强度 B', v: f2(s.B) + ' T'},
      {k: '线圈面积 S', v: f2(s.S * 10000) + ' cm²'},
      {k: '法线与 B 夹角 θ', v: f1(s.th * 180 / Math.PI) + '°', hi: true},
      {k: '磁通量 Φ', v: f2(this.flux() * 1000) + ' mWb', hi: true},
      {k: '有效面积 S⊥', v: f3(s.S * Math.abs(Math.cos(s.th))) + ' m²'}
    ];
  },
  panel(el) {
    const s = this.state;
    this.sl = addSlider(el, '法线与 B 的夹角 θ / °', 0, 90, 1, s.th * 180 / Math.PI,
      v => v.toFixed(0), v => s.th = v * Math.PI / 180);
    addSlider(el, '磁感应强度 B / T', .1, 1, .05, s.B, v => f2(v), v => s.B = v);
    addSlider(el, '线圈面积 S / cm²', 200, 1000, 50, s.S * 10000, v => v.toFixed(0), v => s.S = v / 10000);
    addToggle(el, '显示法线 n', s.showN, v => s.showN = v);
    addToggle(el, '自动转动线圈', s.playing, v => s.playing = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 电磁感应现象 ---------- */
MODULES.push({
  key: 'induction', tab: '04', name: '电磁感应', en: 'INDUCTION', blurb: '磁生电',
  accent: '#ff8f6b', rgb: '255,143,107',
  hint: '让磁体靠近或远离线圈，观察感应电流的方向与大小',
  playable: true,
  state: {t: 0, playing: true, B: .6, sp: 1, showDir: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.B = .6; s.sp = 1; s.showDir = true; },
  meta() {
    return {
      title: '穿过线圈的磁通量变化产生感应电流',
      desc: '把条形磁体靠近或远离线圈，穿过线圈的磁通量发生变化，线圈中就会产生感应电流。改变磁体强弱与运动快慢，观察电流表指针的偏转方向与幅度，理解感应电动势与磁通量变化率有关。',
      formula: 'E = −ΔΦ/Δt（法拉第电磁感应定律）',
      note: '磁体<b>静止</b>时 Φ 不变，即使磁场很强也没有感应电流；运动越快，Φ 变化越快，感应电动势越大。'
    };
  },
  fluxAt(x) {
    const s = this.state;
    return s.B * .05 / Math.pow(1 + Math.pow((x + 1.95) / 1.15, 2), 1.5);
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    setFrame(.5, .55, 14);
    base();
    const xm = .75 + 1.55 * Math.cos(s.t * s.sp);
    const vm = -1.55 * s.sp * Math.sin(s.t * s.sp);
    const phi = this.fluxAt(xm);
    const dphi = (this.fluxAt(xm + .01) - this.fluxAt(xm - .01)) / .02 * vm;
    const emf = -dphi;

    const cx = -1.95;
    for (let k = 0; k < 3; k++) {
      const pts = ellipse(cx, 0, .26 + k * .1, 1.1 + k * .16, 48);
      path(pts, 'rgba(255,143,107,.55)', {w: 1.6});
    }
    sans('线圈', X(cx), Y(-1.75), 'rgba(255,179,160,.8)', 11);

    if (s.showDir && Math.abs(emf) > 1e-4) {
      const up = emf > 0;
      const yy = 1.25;
      arrow({x: cx + (up ? .42 : -.42), y: yy}, {x: cx + (up ? -.42 : .42), y: yy},
        '#ffd166', {w: 2, head: 9});
      sans('感应电流', X(cx), Y(1.75), 'rgba(255,220,150,.85)', 10.5);
    }

    const x0 = xm - .55;
    rect({x: x0, y: -.3}, {x: x0 + .55, y: .3}, 'rgba(255,143,107,.4)', 'rgba(255,143,107,.85)', {w: 1.5});
    rect({x: x0 + .55, y: -.3}, {x: x0 + 1.1, y: .3}, 'rgba(108,182,255,.35)', 'rgba(108,182,255,.85)', {w: 1.5});
    sans('N', X(x0 + .27), Y(0), '#ffd0bd', 14);
    sans('S', X(x0 + .83), Y(0), '#c3dcff', 14);
    if (Math.abs(vm) > .05) {
      const d = vm > 0 ? 1 : -1;
      arrow({x: xm, y: .7}, {x: xm + d * .75, y: .7}, '#8fe9d8', {w: 2, head: 9});
      sans('v', X(xm + d * .9), Y(.7), '#8fe9d8', 12, 'left');
    }

    circleAt({x: 4.4, y: 1.85}, .68, 'rgba(11,24,40,.92)', 'rgba(200,225,235,.5)', {w: 1.4});
    const na = clamp(emf * 26, -1.15, 1.15);
    line({x: 4.4, y: 1.85}, {x: 4.4 + Math.sin(na) * .55, y: 1.85 - Math.cos(na) * .55}, '#ffd166', {w: 2.2});
    sans('G', X(4.4), Y(1.85) + 26, 'rgba(200,225,235,.8)', 11);
    sans('电流表', X(4.4), Y(1.1), 'rgba(200,225,235,.6)', 10);

    sans('Φ = ' + f2(phi * 1000) + ' mWb', X(-4.8), Y(2.8), 'rgba(160,200,255,.9)', 12, 'left');
    sans('E = ' + f3(Math.abs(emf)) + ' V', X(-4.8), Y(2.2), '#8fe9d8', 12, 'left');
    sans('磁体速度 ' + f1(Math.abs(vm)) + ' m/s', X(-4.8), Y(1.6), 'rgba(190,215,225,.7)', 11, 'left');
  },
  hud() {
    const s = this.state;
    const xm = .75 + 1.55 * Math.cos(s.t * s.sp);
    const vm = -1.55 * s.sp * Math.sin(s.t * s.sp);
    const phi = this.fluxAt(xm);
    const dphi = (this.fluxAt(xm + .01) - this.fluxAt(xm - .01)) / .02 * vm;
    const emf = Math.abs(dphi);
    return [
      {k: '磁通量 Φ', v: f2(phi * 1000) + ' mWb', hi: true},
      {k: '感应电动势', v: f3(emf) + ' V', hi: true},
      {k: '磁体速度', v: f1(Math.abs(vm)) + ' m/s'},
      {k: '感应电流', v: f1(emf / 1 * 1000) + ' mA'},
      {k: '磁体位置', v: f1(xm) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '磁体磁感应强度 B / T', .2, 1.2, .05, s.B, v => f2(v), v => s.B = v);
    addSlider(el, '运动快慢 / 倍', .4, 1.8, .1, s.sp, v => f1(v), v => s.sp = v);
    addToggle(el, '显示感应电流方向', s.showDir, v => s.showDir = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '磁体回到最右端', () => { s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 麦克斯韦电磁场与电磁波 ---------- */
MODULES.push({
  key: 'emwave', tab: '05', name: '电磁波', en: 'EM WAVE', blurb: 'E 与 B 结伴传播',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '调节频率，观察电场与磁场互相垂直并向前传播',
  playable: true,
  state: {t: 0, playing: true, f: 100, showE: true, showB: true},
  reset() { const s = this.state; s.t = 0; s.playing = true; s.f = 100; s.showE = true; s.showB = true; },
  meta() {
    return {
      title: '变化的电场和磁场形成电磁波',
      desc: '麦克斯韦指出，变化的磁场产生电场，变化的电场产生磁场，二者交替产生、由近及远传播，形成电磁波。观察电场与磁场互相垂直、都垂直于传播方向，改变频率时波长如何变化。',
      formula: 'c = λf，c ≈ 3.0 × 10<sup>8</sup> m/s',
      note: '电磁波是<b>横波</b>：E、B 与传播方向两两垂直。真空中所有电磁波的传播速度都等于光速，频率越高波长越短。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    setFrame(.5, .55, 14);
    base();
    const lam = 400 / s.f;
    const k = Math.PI * 2 / lam;
    const phase = s.t * 3.2;

    line({x: -6.3, y: 0}, {x: 6.3, y: 0}, 'rgba(190,215,225,.35)', {w: 1.2});
    arrow({x: 4.9, y: 3.35}, {x: 6.1, y: 3.35}, 'rgba(200,225,235,.65)', {w: 1.6, head: 9});
    sans('传播方向', X(5.5), Y(3.55), 'rgba(200,225,235,.7)', 10.5);

    const ptsE = [], ptsB = [];
    for (let x = -6; x <= 6.001; x += .2) {
      const ph = k * (x + 6) - phase;
      const ey = 1.45 * Math.sin(ph);
      ptsE.push({x: x, y: ey});
      ptsB.push({x: x + .55 * .9 * Math.sin(ph), y: .9 * .55 * Math.sin(ph)});
    }
    if (s.showE) {
      path(ptsE, 'rgba(255,143,107,.85)', {w: 2.2, glow: 6});
      for (let x = -6; x <= 6.001; x += .6) {
        const ey = 1.45 * Math.sin(k * (x + 6) - phase);
        arrow({x: x, y: 0}, {x: x, y: ey}, 'rgba(255,143,107,.55)', {w: 1.2, head: 6});
      }
      sans('E', X(-5.7), Y(1.35), '#ffb3a0', 14);
    }
    if (s.showB) {
      path(ptsB, 'rgba(108,182,255,.85)', {w: 2.2, glow: 6});
      for (let x = -6; x <= 6.001; x += .6) {
        const b = .9 * Math.sin(k * (x + 6) - phase);
        arrow({x: x, y: 0}, {x: x + .55 * b, y: .55 * b}, 'rgba(108,182,255,.55)', {w: 1.2, head: 6});
      }
      sans('B', X(-5.1), Y(-.95), '#a8d0ff', 14);
    }
    sans('E ⊥ B ⊥ 传播方向', X(0), Y(-2.3), 'rgba(190,215,225,.7)', 12);
    sans('λ = ' + f1(300 / s.f) + ' m', X(4.6), Y(1.3), '#8fe9d8', 13, 'right');
    sans('f = ' + s.f.toFixed(0) + ' MHz', X(4.6), Y(.75), 'rgba(190,215,225,.8)', 11.5, 'right');
  },
  hud() {
    const s = this.state;
    return [
      {k: '频率 f', v: s.f.toFixed(0) + ' MHz', hi: true},
      {k: '波长 λ', v: f1(300 / s.f) + ' m', hi: true},
      {k: '周期 T', v: f2(1000 / s.f) + ' ns'},
      {k: '波速 c', v: '3.0×10⁸ m/s'},
      {k: '波的类型', v: '横波'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '频率 f / MHz', 50, 200, 5, s.f, v => v.toFixed(0), v => s.f = v);
    addToggle(el, '显示电场 E', s.showE, v => s.showE = v);
    addToggle(el, '显示磁场 B', s.showB, v => s.showB = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
