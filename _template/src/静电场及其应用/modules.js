/* ============================================================
   必修第三册 · 第 1 章 静电场及其应用
   ============================================================ */
(function () {

const K = 9e9;

function f1(v) {
  const s = (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
  return s;
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function sci(v) {
  if (!isFinite(v)) return '—';
  const a = Math.abs(v);
  if (a >= 1000) return f1(v / 1000) + 'k';
  return f1(v);
}

/* 点电荷符号 */
function chargeAt(p, positive, r, label) {
  const c = positive ? '#ff8f6b' : '#6cb6ff';
  circleAt(p, r, positive ? 'rgba(255,143,107,.16)' : 'rgba(108,182,255,.16)', c, {w: 2});
  sans(positive ? '+' : '−', X(p.x), Y(p.y) + 1, c, 20, 'center');
  if (label) sans(label, X(p.x), Y(p.y + r + .26), c, 11.5);
}
function fieldDir(c, p) {
  const dx = p.x - c.x, dy = p.y - c.y;
  const r = Math.max(.12, Math.hypot(dx, dy));
  const sgn = c.q >= 0 ? 1 : -1;
  return {ux: sgn * dx / r, uy: sgn * dy / r, r};
}
function eMag(c, p) {
  const d = Math.max(.35, Math.hypot(p.x - c.x, p.y - c.y)) * .1;
  return K * Math.abs(c.q) * 1e-6 / (d * d);
}

/* ---------- 01 库仑定律 ---------- */
MODULES.push({
  key: 'coulomb', tab: '01', name: '库仑定律', en: 'COULOMB LAW', blurb: '电荷之间的力',
  accent: '#ff8f6b', rgb: '255,143,107',
  hint: '拖动右侧电荷改变间距，调节电荷量观察库仑力的大小与方向',
  state: {q1: 2, q2: 3, r: 12, showF: true, showRuler: true},
  reset() {
    const s = this.state;
    s.q1 = 2; s.q2 = 3; s.r = 12; s.showF = true; s.showRuler = true;
  },
  force() {
    const s = this.state;
    const rm = Math.max(.02, s.r / 100);
    return K * (s.q1 * 1e-6) * (s.q2 * 1e-6) / (rm * rm);
  },
  meta() {
    return {
      title: '真空中两个点电荷之间的库仑力',
      desc: '库仑力与两电荷量的乘积成正比，与它们距离的二次方成反比。拖动右侧电荷或调节滑块，观察力的大小和方向怎样变化；注意计算时距离要化成米，电荷量要化成库仑。',
      formula: 'F = k q<sub>1</sub>q<sub>2</sub> / r<sup>2</sup>',
      note: '同种电荷<b>相斥</b>、异种电荷<b>相吸</b>，两个力大小相等、方向相反。距离减半，库仑力变为原来的 4 倍。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .54, 14);
    base();
    const rw = s.r / 5;
    const A = {x: -rw / 2, y: .35}, B = {x: rw / 2, y: .35};
    const F = this.force();

    line({x: -6.6, y: .35}, {x: 6.6, y: .35}, 'rgba(190,215,225,.12)', {w: 1, dash: [5, 6]});
    if (s.showRuler) {
      const yR = -1.3;
      line({x: A.x, y: yR}, {x: B.x, y: yR}, 'rgba(190,215,225,.45)', {w: 1.2});
      line({x: A.x, y: yR - .16}, {x: A.x, y: yR + .16}, 'rgba(190,215,225,.45)', {w: 1.2});
      line({x: B.x, y: yR - .16}, {x: B.x, y: yR + .16}, 'rgba(190,215,225,.45)', {w: 1.2});
      segLabel({x: A.x, y: yR}, {x: B.x, y: yR}, 'r = ' + f1(s.r) + ' cm', 'rgba(200,224,232,.9)', .5, 16, 12.5);
    }

    chargeAt(A, true, .38, 'q₁ = ' + f1(s.q1) + ' μC');
    chargeAt(B, s.q2 >= 0, .38, 'q₂ = ' + f1(s.q2) + ' μC');

    if (s.showF) {
      const len = clamp(.5 + 1.4 * Math.sqrt(F / 6), .45, 2.1);
      const yF = .35;
      arrow({x: A.x - .44, y: yF}, {x: A.x - .44 - len, y: yF}, '#ffd166', {w: 2.6, head: 12});
      arrow({x: B.x + .44, y: yF}, {x: B.x + .44 + len, y: yF}, '#ffd166', {w: 2.6, head: 12});
      sans('F', X(A.x - .55 - len * .5), Y(yF) - 18, '#ffe0a0', 15);
      sans('F', X(B.x + .55 + len * .5), Y(yF) - 18, '#ffe0a0', 15);
      sans('同种电荷互相排斥', X(0), Y(yF) + 18, 'rgba(255,215,160,.55)', 10.5);
    }

    math('F = k q₁q₂ / r²', X(0), Y(3.35), 'rgba(255,220,190,.9)', 16);
    sans('k = 9.0 × 10⁹ N·m²/C²', X(0), Y(2.85), 'rgba(190,215,225,.6)', 10.5);
    sans('F = ' + f2(F) + ' N', X(L0x()), Y(2.2), '#ffd166', 15, 'left');
    sans('r 增大 → F 迅速减小', X(L0x()), Y(1.65), 'rgba(175,205,215,.6)', 10.5, 'left');
  },
  handles() {
    const rw = this.state.r / 5;
    return [{id: 'B', x: rw / 2, y: .35}];
  },
  drag(id, p) {
    const q = clampPt(p);
    this.state.r = clamp(10 * Math.abs(q.x), 4, 28);
  },
  hud() {
    const s = this.state, F = this.force();
    return [
      {k: '电荷量 q₁', v: f1(s.q1) + ' μC'},
      {k: '电荷量 q₂', v: f1(s.q2) + ' μC'},
      {k: '间距 r', v: f1(s.r) + ' cm', hi: true},
      {k: '库仑力 F', v: f2(F) + ' N', hi: true},
      {k: '相互作用', v: '斥力（同种）'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '电荷量 q₁ / μC', 1, 8, .5, s.q1, v => f1(v), v => s.q1 = v);
    addSlider(el, '电荷量 q₂ / μC', 1, 8, .5, s.q2, v => f1(v), v => s.q2 = v);
    addSlider(el, '间距 r / cm', 4, 28, 1, s.r, v => f1(v), v => s.r = v);
    addToggle(el, '显示库仑力箭头', s.showF, v => s.showF = v);
    addToggle(el, '显示距离标尺', s.showRuler, v => s.showRuler = v);
    addBtn(el, '恢复默认', () => { s.q1 = 2; s.q2 = 3; s.r = 12; }, 'ghost');
  }
});

function L0x() { return lim().x0 + .35; }

/* ---------- 02 电场强度与叠加 ---------- */
MODULES.push({
  key: 'field', tab: '02', name: '场强叠加', en: 'FIELD SUPERPOSITION', blurb: '矢量的合成',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '拖动试探点 P，观察两个场源电荷产生的场强如何合成',
  state: {Q1: 2, Q2: -2, P: {x: 0, y: 2.1}, showComp: true},
  reset() {
    const s = this.state;
    s.Q1 = 2; s.Q2 = -2; s.P = {x: 0, y: 2.1}; s.showComp = true;
  },
  meta() {
    return {
      title: '电场强度是矢量，可以叠加',
      desc: '空间中某点的电场强度由场源电荷决定，与是否放入试探电荷无关。把试探点拖到不同位置，分别画出两个场源电荷在该点产生的场强矢量，再用平行四边形定则合成，比较合场强的大小与方向。',
      formula: 'E = kQ/r<sup>2</sup>，<b>E</b> = <b>E</b><sub>1</sub> + <b>E</b><sub>2</sub>',
      note: '正电荷的场强<b>背离</b>场源，负电荷的场强<b>指向</b>场源。合场强不是大小相加，而要按平行四边形定则合成。'
    };
  },
  vec(c, P) {
    const d = fieldDir(c, P);
    return {x: d.ux, y: d.uy, r: d.r, E: eMag(c, P)};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const c1 = {x: -2.3, y: -.75, q: s.Q1};
    const c2 = {x: 2.3, y: -.75, q: s.Q2};
    const P = s.P;

    line({x: c1.x, y: c1.y}, {x: c2.x, y: c2.y}, 'rgba(190,215,225,.14)', {w: 1, dash: [5, 6]});
    chargeAt(c1, s.Q1 >= 0, .4, 'Q₁ = ' + f1(s.Q1) + ' μC');
    chargeAt(c2, s.Q2 >= 0, .4, 'Q₂ = ' + f1(s.Q2) + ' μC');

    const v1 = this.vec(c1, P), v2 = this.vec(c2, P);
    const ex = v1.x * v1.E + v2.x * v2.E;
    const ey = v1.y * v1.E + v2.y * v2.E;
    const er = Math.hypot(ex, ey);
    const gs = 1.55 / Math.max(v1.E, v2.E, er, 1);
    const p1 = {x: P.x + v1.x * v1.E * gs, y: P.y + v1.y * v1.E * gs};
    const p2 = {x: P.x + v2.x * v2.E * gs, y: P.y + v2.y * v2.E * gs};
    const pr = {x: P.x + ex * gs, y: P.y + ey * gs};

    if (s.showComp) {
      line(p1, pr, 'rgba(255,255,255,.22)', {w: 1, dash: [4, 4]});
      line(p2, pr, 'rgba(255,255,255,.22)', {w: 1, dash: [4, 4]});
      arrow(P, p1, '#6cb6ff', {w: 2.2, head: 11});
      arrow(P, p2, '#b49cff', {w: 2.2, head: 11});
      vlabel(P, p1, 'E₁', '#a8d0ff', 14, 14);
      vlabel(P, p2, 'E₂', '#c8baff', 14, 14);
    }
    arrow(P, pr, '#ffc56b', {w: 3, head: 14});
    vlabel(P, pr, 'E', '#ffd79a', 16, 16);

    dot(P, '#fff1cf', 5);
    handle(P, '#ffc56b', hoverId === 'P');
    sans('试探点 P', X(P.x) + 12, Y(P.y) - 14, 'rgba(255,235,200,.85)', 11, 'left');

    sans('E₁ = ' + f1(v1.E / 1000) + ' kN/C', X(lim().x0) + .35, Y(-2.9), '#a8d0ff', 11.5, 'left');
    sans('E₂ = ' + f1(v2.E / 1000) + ' kN/C', X(lim().x0) + .35, Y(-3.45), '#c8baff', 11.5, 'left');
    sans('E = ' + f1(er / 1000) + ' kN/C（矢量和）', X(lim().x0) + .35, Y(-4.0), '#ffd79a', 11.5, 'left');
    sans('1 格 = 10 cm', X(lim().x1) - .35, Y(-4.0), 'rgba(160,190,205,.5)', 10, 'right');
  },
  handles() { return [{id: 'P', x: this.state.P.x, y: this.state.P.y}]; },
  drag(id, p) { this.state.P = clampPt(p); },
  hud() {
    const s = this.state;
    const c1 = {x: -2.3, y: -.75, q: s.Q1}, c2 = {x: 2.3, y: -.75, q: s.Q2};
    const v1 = this.vec(c1, s.P), v2 = this.vec(c2, s.P);
    const ex = v1.x * v1.E + v2.x * v2.E, ey = v1.y * v1.E + v2.y * v2.E;
    const er = Math.hypot(ex, ey);
    const ang = Math.atan2(ey, ex) * 180 / Math.PI;
    return [
      {k: 'E₁', v: f1(v1.E / 1000) + ' kN/C'},
      {k: 'E₂', v: f1(v2.E / 1000) + ' kN/C'},
      {k: '合场强 E', v: f1(er / 1000) + ' kN/C', hi: true},
      {k: '方向', v: f1(Math.abs(ang)) + '°', hi: true},
      {k: '到 Q₁ 距离', v: f1(v1.r / 10) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, 'Q₁ / μC', -6, 6, 1, s.Q1, v => f1(v), v => s.Q1 = v);
    addSlider(el, 'Q₂ / μC', -6, 6, 1, s.Q2, v => f1(v), v => s.Q2 = v);
    addToggle(el, '显示分场强与平行四边形', s.showComp, v => s.showComp = v);
    addBtn(el, 'P 回到中垂线', () => { s.P = {x: 0, y: 2.1}; }, 'ghost');
  }
});

/* ---------- 03 电场线与场强分布 ---------- */
MODULES.push({
  key: 'lines', tab: '03', name: '电场线', en: 'FIELD LINES', blurb: '疏密即强弱',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换电荷配置，观察电场线的形状、疏密与切线方向',
  state: {mode: 1, n: 12, arrows: true, equi: false},
  reset() { const s = this.state; s.mode = 1; s.n = 12; s.arrows = true; s.equi = false; },
  charges() {
    const m = this.state.mode;
    if (m === 0) return [{x: 0, y: 0, q: 1}];
    if (m === 2) return [{x: -2, y: 0, q: 1}, {x: 2, y: 0, q: 1}];
    return [{x: -2, y: 0, q: 1}, {x: 2, y: 0, q: -1}];
  },
  fieldAt(x, y) {
    let ex = 0, ey = 0;
    const cs = this.charges();
    for (let i = 0; i < cs.length; i++) {
      const dx = x - cs[i].x, dy = y - cs[i].y;
      let r2 = dx * dx + dy * dy;
      if (r2 < .03) r2 = .03;
      const f = cs[i].q / (r2 * Math.sqrt(r2));
      ex += f * dx; ey += f * dy;
    }
    return {x: ex, y: ey};
  },
  trace(x, y, dir) {
    const pts = [{x: x, y: y}];
    for (let k = 0; k < 300; k++) {
      const e = this.fieldAt(x, y);
      const m = Math.hypot(e.x, e.y);
      if (!isFinite(m) || m < 1e-9) break;
      x += dir * .085 * e.x / m;
      y += dir * .085 * e.y / m;
      pts.push({x: x, y: y});
      const L = lim();
      if (x < L.x0 - .05 || x > L.x1 + .05 || y < L.y0 - .05 || y > L.y1 + .05) break;
      const cs = this.charges();
      let hit = false;
      for (let i = 0; i < cs.length; i++) {
        if (Math.hypot(x - cs[i].x, y - cs[i].y) < .2) hit = true;
      }
      if (hit) break;
    }
    return pts;
  },
  meta() {
    return {
      title: '电场线的疏密表示场强的强弱',
      desc: '电场线不是真实存在的曲线，而是形象描述电场的工具：线上每点的切线方向就是该点场强的方向，线越密的地方场强越大。切换单个电荷、等量异种与等量同种三种配置，比较电场线的形状与疏密。',
      formula: '切线方向 = <b>E</b> 的方向，疏密 ∝ E 的大小',
      note: '电场线从<b>正电荷</b>出发、终止于<b>负电荷</b>（或无穷远），任意两条电场线不相交，因为一点的场强只有一个方向。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .52, 15);
    base();
    const cs = this.charges();
    const color = s.mode === 2 ? 'rgba(255,197,107,.62)' : 'rgba(180,156,255,.62)';

    if (s.mode === 0 && s.equi) {
      for (let r = 1.1; r <= 3.6; r += 1.15) {
        const pts = [];
        for (let a = 0; a <= 64; a++) {
          const t = a / 64 * Math.PI * 2;
          pts.push({x: Math.cos(t) * r, y: Math.sin(t) * r});
        }
        path(pts, 'rgba(94,234,212,.35)', {w: 1, dash: [5, 5]});
      }
      sans('虚线为等势面', X(3.1), Y(-3.4), 'rgba(126,236,214,.75)', 10.5);
    }

    for (let i = 0; i < cs.length; i++) {
      const c = cs[i];
      if (c.q < 0) continue;
      for (let j = 0; j < s.n; j++) {
        const a = j / s.n * Math.PI * 2 + i * .17;
        const x0 = c.x + Math.cos(a) * .3, y0 = c.y + Math.sin(a) * .3;
        const pts = this.trace(x0, y0, c.q > 0 ? 1 : -1);
        if (pts.length < 3) continue;
        path(pts, color, {w: 1.5, glow: 3});
        if (s.arrows) {
          for (let k = 18; k < pts.length - 3; k += 26) {
            arrow(pts[k], pts[k + 3], s.mode === 2 ? 'rgba(255,220,150,.9)' : 'rgba(205,190,255,.9)', {w: 1.1, head: 6});
          }
        }
      }
    }
    for (let i = 0; i < cs.length; i++) {
      chargeAt(cs[i], cs[i].q > 0, .3, cs[i].q > 0 ? '+Q' : '−Q');
    }

    const names = ['单个正电荷', '等量异种电荷', '等量同种电荷'];
    sans(names[s.mode], X(lim().x0) + .4, Y(3.9), 'rgba(210,225,240,.9)', 13, 'left');
    if (s.mode === 2) sans('中点处场强为零', X(0), Y(-2.2), 'rgba(255,215,160,.8)', 11);
    if (s.mode === 1) sans('连线中点场强最大', X(0), Y(-2.2), 'rgba(200,190,255,.75)', 11);
  },
  hud() {
    const s = this.state;
    const e = this.fieldAt(0, 2.8);
    const mag = Math.hypot(e.x, e.y) * 900;
    const ang = Math.atan2(e.y, e.x) * 180 / Math.PI;
    return [
      {k: '配置', v: ['单电荷', '异种', '同种'][s.mode]},
      {k: '电场线条数', v: ((s.mode === 2 ? 2 : 1) * s.n) + ' 条'},
      {k: '探测点场强', v: f1(mag) + ' kN/C', hi: true},
      {k: '场强方向', v: f1(Math.abs(ang)) + '°'},
      {k: '场源电荷量', v: '1.0 μC', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['单电荷', '异种', '同种'], s.mode, i => s.mode = i);
    addSlider(el, '电场线密度 / 条', 6, 20, 1, s.n, v => v.toFixed(0), v => s.n = v);
    addToggle(el, '显示方向箭头', s.arrows, v => s.arrows = v);
    addToggle(el, '显示等势面（单电荷）', s.equi, v => s.equi = v);
    addBtn(el, '恢复默认', () => { s.mode = 1; s.n = 12; }, 'ghost');
  }
});

/* ---------- 04 静电感应与屏蔽 ---------- */
MODULES.push({
  key: 'shield', tab: '04', name: '静电屏蔽', en: 'ELECTROSTATIC SHIELD', blurb: '内部场强为零',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '调节外电场与金属罩半径，观察电荷重新分布和内部场强',
  state: {E0: 500, R: 1.7, closed: true, showQ: true},
  reset() { const s = this.state; s.E0 = 500; s.R = 1.7; s.closed = true; s.showQ = true; },
  meta() {
    return {
      title: '静电平衡与静电屏蔽',
      desc: '把金属罩放入外电场中，罩内自由电子在电场力作用下重新分布，直到内部合场强为零，导体达到静电平衡。调节外电场强度与金属罩半径，观察表面感应电荷的分布和内部场强的变化。',
      formula: 'E<sub>内</sub> = 0，σ<sub>max</sub> = 3ε<sub>0</sub>E<sub>0</sub>',
      note: '导体内部场强为零，<b>整个导体是等势体</b>；金属罩把外电场挡在外面，这就是静电屏蔽。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .52, 14);
    base();
    const R = s.R, cy = .1;

    const rows = [-2.48, -1.86, -1.24, -.62, 0, .62, 1.24, 1.86, 2.48];
    for (let i = 0; i < rows.length; i++) {
      const y = cy + rows[i];
      const dy = y - cy;
      const dx = Math.sqrt(Math.max(0, R * R - dy * dy));
      const inside = Math.abs(dy) < R - .05;
      if (s.closed && inside) {
        arrow({x: -6.5, y: y}, {x: -dx, y: y}, 'rgba(108,182,255,.62)', {w: 1.4, head: 9});
        arrow({x: dx, y: y}, {x: 6.5, y: y}, 'rgba(108,182,255,.62)', {w: 1.4, head: 9});
      } else {
        arrow({x: -6.5, y: y}, {x: 6.5, y: y}, 'rgba(108,182,255,.62)', {w: 1.4, head: 9});
      }
    }

    circleAt({x: 0, y: cy}, R, s.closed ? 'rgba(10,26,40,.92)' : 'rgba(10,26,40,.22)', 'rgba(120,235,214,.8)', {w: 3});
    circleAt({x: 0, y: cy}, R - .1, null, 'rgba(120,235,214,.18)', {w: 1});

    if (s.showQ) {
      for (let k = 0; k < 24; k++) {
        const a = k / 24 * Math.PI * 2;
        const d = Math.cos(a);
        if (Math.abs(d) < .28) continue;
        const pos = d > 0;
        sans(pos ? '+' : '−', X(Math.cos(a) * (R + .02)), Y(cy + Math.sin(a) * (R + .02)),
          pos ? '#ff8f6b' : '#6cb6ff', 9 + 7 * Math.abs(d));
      }
    }

    const probe = {x: 0, y: cy};
    dot(probe, s.closed ? '#5eead4' : '#ff8f6b', 5);
    if (s.closed) {
      sans('E内 = 0', X(0), Y(cy) - 20, '#7ef0dc', 13);
    } else {
      arrow({x: 0, y: cy}, {x: .9, y: cy}, '#ff8f6b', {w: 2.2, head: 10});
      sans('E内 ≠ 0', X(0), Y(cy) - 20, '#ff9f8a', 13);
    }
    sans('金属罩', X(0), Y(cy + R + .55), 'rgba(126,236,214,.85)', 11.5);
    sans('外电场 E₀', X(-6.1), Y(3.75), 'rgba(160,200,255,.85)', 11.5, 'left');
    sans('自由电子向左移动 → 左负右正', X(0), Y(-3.6), 'rgba(185,210,225,.6)', 10.5);
  },
  hud() {
    const s = this.state;
    const sigma = 3 * 8.854e-12 * s.E0 * 1e9;
    return [
      {k: '外电场 E₀', v: s.E0.toFixed(0) + ' N/C'},
      {k: '罩内场强', v: s.closed ? '0 N/C' : f1(s.E0) + ' N/C', hi: true},
      {k: '最大面电荷密度', v: f1(sigma) + ' nC/m²', hi: true},
      {k: '金属罩半径', v: f1(s.R) + ' m'},
      {k: '屏蔽效果', v: s.closed ? '完全屏蔽' : '无屏蔽'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '外电场 E₀ / (N/C)', 100, 800, 50, s.E0, v => v.toFixed(0), v => s.E0 = v);
    addSlider(el, '金属罩半径 R / m', 1.2, 2.2, .1, s.R, v => f1(v), v => s.R = v);
    addToggle(el, '金属罩封闭（静电屏蔽）', s.closed, v => s.closed = v);
    addToggle(el, '显示感应电荷', s.showQ, v => s.showQ = v);
  }
});

/* ---------- 05 带电体的平衡 ---------- */
MODULES.push({
  key: 'balance', tab: '05', name: '带电体平衡', en: 'EQUILIBRIUM', blurb: '三力平衡',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变电荷量与小球质量，观察悬线与竖直方向的夹角',
  state: {q: .6, Q: 2, m: 12, L: .5, show: true},
  reset() { const s = this.state; s.q = .6; s.Q = 2; s.m = 12; s.L = .5; s.show = true; },
  meta() {
    return {
      title: '带电小球的三力平衡',
      desc: '带电小球在重力、悬线拉力和库仑力共同作用下处于平衡。改变小球电荷量、固定电荷量或小球质量，观察悬线与竖直方向的夹角怎样变化，并用力的分解检验三力平衡的条件。',
      formula: 'tanθ = F<sub>库</sub> / (mg)，<b>T</b> + <b>G</b> + <b>F</b> = 0',
      note: '库仑力增大，悬线偏角变大；质量增大，偏角变小。三个力的作用线必<b>交于一点</b>。'
    };
  },
  angle() {
    const s = this.state;
    const Lw = 3 * s.L;
    const pivY = 2.5, fx = 2.1, fy = 1.1;
    const q = s.q * 1e-6, Q = s.Q * 1e-6, mg = s.m * 1e-3 * 9.8;
    const tor = th => {
      const bx = Lw * Math.sin(th), by = -Lw * Math.cos(th);
      const dx = fx - bx, dy = fy - (pivY + by);
      const rw = Math.max(.12, Math.hypot(dx, dy));
      const rm = rw / 3;
      const F = 9e9 * q * Q / (rm * rm);
      return bx * (F * dy / rw) - by * (F * dx / rw) - bx * mg;
    };
    let a = -.15, b = 1.3, fa = tor(a), fb = tor(b);
    if (fa * fb > 0) return fa > 0 ? b : a;
    for (let k = 0; k < 50; k++) {
      const m = (a + b) / 2, fm = tor(m);
      if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    return (a + b) / 2;
  },
  forces() {
    const s = this.state;
    const th = this.angle();
    const Lw = 3 * s.L, pivY = 2.5, fx = 2.1, fy = 1.1;
    const ball = {x: Lw * Math.sin(th), y: pivY - Lw * Math.cos(th)};
    const dx = fx - ball.x, dy = fy - ball.y;
    const rw = Math.max(.12, Math.hypot(dx, dy));
    const rm = rw / 3;
    const F = 9e9 * (s.q * 1e-6) * (s.Q * 1e-6) / (rm * rm);
    const ux = dx / rw, uy = dy / rw;
    const mg = s.m * 1e-3 * 9.8;
    const T = Math.hypot(F * ux, mg + F * uy);
    return {th, ball, rw, F, mg, T, ux, uy};
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 14);
    base();
    const d = this.forces();
    const piv = {x: 0, y: 2.5};

    line({x: -6.5, y: 2.62}, {x: 6.5, y: 2.62}, 'rgba(180,210,220,.55)', {w: 2});
    for (let x = -6.4; x < 6.5; x += .5) {
      line({x: x, y: 2.62}, {x: x - .12, y: 2.5}, 'rgba(180,210,220,.3)', {w: 1});
    }
    line(piv, d.ball, 'rgba(220,235,240,.75)', {w: 1.8});
    dot(piv, '#dfe9ee', 4);

    chargeAt(d.ball, true, .17, '');
    chargeAt({x: 2.1, y: 1.1}, false, .22, 'Q = −' + f1(s.Q) + ' μC');
    sans('q = ' + f1(s.q) + ' μC', X(d.ball.x) - 15, Y(d.ball.y) + 22, '#ffb08a', 11, 'right');

    const fs = 1.45 / Math.max(d.mg, d.F, d.T, .01);
    const G = {x: 0, y: -d.mg * fs};
    const Fv = {x: d.F * d.ux * fs, y: d.F * d.uy * fs};
    const T = {x: -d.T * d.ux * fs, y: -d.T * d.uy * fs};
    arrow(d.ball, {x: d.ball.x + G.x, y: d.ball.y + G.y}, '#ff8f6b', {w: 2.4, head: 11});
    arrow(d.ball, {x: d.ball.x + Fv.x, y: d.ball.y + Fv.y}, '#b49cff', {w: 2.4, head: 11});
    arrow(d.ball, {x: d.ball.x + T.x, y: d.ball.y + T.y}, '#5eead4', {w: 2.4, head: 11});
    sans('G', X(d.ball.x + G.x) - 12, Y(d.ball.y + G.y) + 8, '#ffb3a0', 12);
    sans('F', X(d.ball.x + Fv.x) + 12, Y(d.ball.y + Fv.y), '#c8baff', 12);
    sans('T', X(d.ball.x + T.x) - 12, Y(d.ball.y + T.y) - 8, '#7ef0dc', 12);

    if (s.show) {
      line({x: d.ball.x, y: d.ball.y}, {x: d.ball.x + Fv.x + T.x, y: d.ball.y + Fv.y + T.y},
        'rgba(255,255,255,.22)', {w: 1, dash: [4, 4]});
    }
    const ang = d.th * 180 / Math.PI;
    angleArc(piv, -Math.PI / 2, -Math.PI / 2 + d.th, 62, 'rgba(255,209,102,.8)', '', 12);
    sans(f1(Math.abs(ang)) + '°', X(piv.x) + 74, Y(piv.y) - 26, 'rgba(255,220,150,.9)', 12);
    sans('三力平衡：T + G + F = 0', X(lim().x0) + .35, Y(-3.5), 'rgba(190,215,225,.7)', 11, 'left');
  },
  hud() {
    const s = this.state, d = this.forces();
    return [
      {k: '偏角 θ', v: f1(Math.abs(d.th * 180 / Math.PI)) + '°', hi: true},
      {k: '库仑力 F', v: f2(d.F) + ' N', hi: true},
      {k: '重力 G', v: f2(d.mg) + ' N'},
      {k: '绳张力 T', v: f2(d.T) + ' N'},
      {k: '小球与 Q 距离', v: f1(d.rw / 3) + ' m'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '小球电荷量 q / μC', .1, 1.5, .1, s.q, v => f1(v), v => s.q = v);
    addSlider(el, '固定电荷量 |Q| / μC', .5, 3, .25, s.Q, v => f1(v), v => s.Q = v);
    addSlider(el, '小球质量 m / g', 6, 30, 1, s.m, v => v.toFixed(0), v => s.m = v);
    addToggle(el, '显示力的合成辅助线', s.show, v => s.show = v);
    addBtn(el, '恢复默认', () => { s.q = .6; s.Q = 2; s.m = 12; }, 'ghost');
  }
});

})();
