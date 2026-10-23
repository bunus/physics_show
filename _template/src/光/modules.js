/* ============================================================
   选择性必修第一册 · 第 4 章 光
   01 折射定律与折射率  02 全反射与光导纤维  03 双缝干涉
   04 薄膜干涉与衍射    05 偏振
   ============================================================ */
(function () {

const PI2 = Math.PI * 2;

function f1(v) {
  const s = (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
  return s.replace('-', '−');
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.replace(/0+$/, '').replace(/\.$/, '').replace('-', '−');
}
function wlRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else { r = 1; }
  const c = v => Math.round(clamp(v, 0, 1) * 255);
  return [c(r), c(g), c(b)];
}
function wlCss(nm, a) {
  const c = wlRGB(nm);
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
}
function arcTag(c, mid, r, txt, color, size) {
  sans(txt, X(c.x + Math.cos(mid) * r), Y(c.y + Math.sin(mid) * r), color, size || 11);
}

/* ---------- 01 折射定律与折射率 ---------- */
MODULES.push({
  key: 'refract', tab: '01', name: '光的折射', en: 'REFRACTION', blurb: '偏折的规律',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '转动入射光线，比较入射角与折射角的正弦之比',
  state: {th: 45, n: 1.5, showReflect: true, showNormal: true},
  reset() { const s = this.state; s.th = 45; s.n = 1.5; s.showReflect = true; s.showNormal = true; },
  meta() {
    return {
      title: '入射角与折射角的正弦之比是常数',
      desc: '一束光从空气斜射入水或玻璃，在界面处改变方向。无论入射角怎样改变，入射角正弦与折射角正弦的比值始终等于这种介质的折射率，这就是折射定律。',
      formula: 'n = sin θ<sub>1</sub> / sin θ<sub>2</sub>，n = c / v',
      note: '光从空气进入介质时<b>靠近法线</b>；折射率越大，光线偏折越厉害，介质中光速越小。'
    };
  },
  th2() { return Math.asin(clamp(Math.sin(this.state.th * Math.PI / 180) / this.state.n, 0, 1)); },
  draw() {
    const s = this.state;
    setFrame(.5, .5, 15);
    base();

    rect({x: -7.4, y: -4.8}, {x: 7.4, y: .9}, 'rgba(108,182,255,.06)', null);
    line({x: -7.4, y: .9}, {x: 7.4, y: .9}, 'rgba(205,232,240,.7)', {w: 2});
    sans('空气 n₁ = 1.00', X(-7.3), Y(4.0), 'rgba(190,215,225,.8)', 11, 'left');
    sans('介质 n₂ = ' + f2(s.n), X(7.2), Y(-2.6), 'rgba(160,205,255,.9)', 11.5, 'right');

    if (s.showNormal) {
      line({x: 0, y: -2.7}, {x: 0, y: 4.4}, 'rgba(255,255,255,.3)', {w: 1.2, dash: [6, 5]});
      sans('法线', X(0) + 8, Y(4.25), 'rgba(200,220,230,.65)', 10, 'left');
    }

    const th1 = s.th * Math.PI / 180, th2 = this.th2();
    const L = 3.15, Y0 = .9;
    const A = {x: -Math.sin(th1) * L, y: Y0 + Math.cos(th1) * L};
    const B = {x: Math.sin(th2) * L, y: Y0 - Math.cos(th2) * L};
    const C = {x: Math.sin(th1) * L, y: Y0 + Math.cos(th1) * L};
    const O = {x: 0, y: Y0};

    arrow(A, O, '#5eead4', {w: 2.6, head: 12, glow: 6});
    arrow({x: O.x, y: O.y}, B, wlCss(520, 1), {w: 2.8, head: 12, glow: 6});
    if (s.showReflect) {
      arrow(O, C, 'rgba(255,197,107,.75)', {w: 1.8, head: 10, dash: [7, 5]});
      sans('反射光', X(C.x) + 12, Y(C.y) - 12, 'rgba(255,215,154,.7)', 10.5, 'left');
    }
    sans('入射光', X(A.x) - 12, Y(A.y) - 6, 'rgba(143,233,216,.9)', 11, 'right');

    const r1 = .8;
    angleArc(O, Math.PI / 2, Math.PI / 2 + th1, 74, 'rgba(94,234,212,.6)', '', 11);
    angleArc(O, -Math.PI / 2, -Math.PI / 2 + th2, 74, 'rgba(108,182,255,.65)', '', 11);
    arcTag(O, Math.PI / 2 + th1 / 2, r1 + .3, 'θ₁ = ' + f1(s.th) + '°', 'rgba(143,233,216,.95)', 11);
    arcTag(O, -Math.PI / 2 + th2 / 2, r1 + .3, 'θ₂ = ' + f1(th2 * 180 / Math.PI) + '°', 'rgba(158,203,255,.95)', 11);

    circleAt(O, .07, '#ffffff', null, {w: 0});
    sans('sin θ₁ / sin θ₂ = ' + f2(Math.sin(th1) / Math.max(.001, Math.sin(th2))) + '（保持不变）',
      X(-7.3), Y(-1.9), 'rgba(180,215,225,.85)', 12, 'left');
  },
  hud() {
    const s = this.state, th2 = this.th2() * 180 / Math.PI;
    return [
      {k: '入射角 θ₁', v: f1(s.th) + '°'},
      {k: '折射角 θ₂', v: f1(th2) + '°', hi: true},
      {k: '折射率 n', v: f2(s.n), hi: true},
      {k: '介质中光速', v: f2(3 / s.n) + '×10⁸ m/s'},
      {k: 'sinθ₁/sinθ₂', v: (Math.sin(s.th * Math.PI / 180) / Math.max(1e-3, Math.sin(this.th2()))).toFixed(2)}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '入射角 θ₁ / °', 0, 80, 1, s.th, v => String(Math.round(v)), v => s.th = v);
    addSlider(el, '折射率 n', 1, 2.4, .05, s.n, v => f2(v), v => s.n = v);
    addToggle(el, '显示反射光线', s.showReflect, v => s.showReflect = v);
    addToggle(el, '显示法线', s.showNormal, v => s.showNormal = v);
    addBtn(el, '换成水（n = 1.33）', () => { s.n = 1.33; }, 'ghost');
  }
});

/* ---------- 02 全反射与光导纤维 ---------- */
MODULES.push({
  key: 'tir', tab: '02', name: '全反射', en: 'TOTAL REFLECTION', blurb: '超过临界角就回头',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '增大入射角越过临界角，折射光线消失，只剩反射光',
  state: {mode: 0, th: 30, n: 1.5, showNormal: true},
  reset() { const s = this.state; s.mode = 0; s.th = 30; s.n = 1.5; s.showNormal = true; },
  meta() {
    return {
      title: '从光密介质射向光疏介质，可能全部反射',
      desc: '光从水或玻璃射向空气时，折射角总大于入射角。当入射角增大到某一角度，折射角恰好达到 90°，再增大就完全没有折射光，光全部返回原介质，这就是全反射。',
      formula: 'sin C = 1 / n，光导纤维靠全反射传光',
      note: '全反射的两个条件：<b>从光密到光疏</b>、<b>入射角大于临界角</b>，缺一不可。'
    };
  },
  crit() { return Math.asin(clamp(1 / this.state.n, 0, 1)); },
  draw() {
    const s = this.state;
    setFrame(.5, .5, 15);
    base();
    const th = s.th * Math.PI / 180, C = this.crit();

    if (s.mode === 0) {
      rect({x: -7.4, y: -4.8}, {x: 7.4, y: .55}, 'rgba(108,182,255,.12)', null);
      line({x: -7.4, y: .55}, {x: 7.4, y: .55}, 'rgba(205,232,240,.7)', {w: 2});
      sans('光疏介质（空气）n = 1.00', X(-7.3), Y(3.6), 'rgba(190,215,225,.75)', 10.5, 'left');
      sans('光密介质 n = ' + f2(s.n), X(-7.3), Y(-2.5), 'rgba(160,205,255,.85)', 10.5, 'left');

      if (s.showNormal) line({x: 0, y: -2.85}, {x: 0, y: 4.1}, 'rgba(255,255,255,.3)', {w: 1.2, dash: [6, 5]});

      const L = 2.95, O = {x: 0, y: .55};
      const A = {x: -Math.sin(th) * L, y: O.y - Math.cos(th) * L};
      const R = {x: Math.sin(th) * L, y: O.y - Math.cos(th) * L};
      const th2 = Math.asin(clamp(s.n * Math.sin(th), 0, 1));
      const T = {x: Math.sin(th2) * L, y: O.y + Math.cos(th2) * L};
      const tir = th >= C - 1e-4;

      arrow(A, O, '#6cb6ff', {w: 2.6, head: 12, glow: 6});
      arrow(O, R, tir ? '#ffc56b' : 'rgba(255,197,107,.45)', {w: tir ? 3 : 1.8, head: 11, glow: tir ? 8 : 0});
      if (!tir) {
        arrow(O, T, wlCss(500, .9), {w: 2.2, head: 11, alpha: .85});
        sans('折射光', X(T.x) + 12, Y(T.y) - 10, 'rgba(190,225,255,.8)', 10.5, 'left');
      }
      sans('反射光', X(R.x) + 12, Y(R.y) - 12, 'rgba(255,215,154,.85)', 10.5, 'left');

      /* 临界角方向 */
      const Cx = {x: -Math.sin(C) * L, y: O.y - Math.cos(C) * L};
      line(O, Cx, 'rgba(255,255,255,.18)', {w: 1.2, dash: [4, 6]});
      sans('临界角 C = ' + f1(C * 180 / Math.PI) + '°', X(Cx.x) - 8, Y(Cx.y) + 18,
        'rgba(210,230,240,.7)', 10.5, 'right');

      angleArc(O, -Math.PI / 2 - th, -Math.PI / 2, 74, 'rgba(108,182,255,.6)', '', 11);
      arcTag(O, -Math.PI / 2 - th / 2, 1.15, f1(s.th) + '°', 'rgba(158,203,255,.95)', 11);

      if (tir) {
        sans('入射角已大于临界角 → 发生全反射', X(0), Y(-3.15), 'rgba(255,215,154,.95)', 13);
      } else {
        sans('仍有折射光，折射角大于入射角', X(0), Y(-3.15), 'rgba(190,225,255,.85)', 12);
      }
    } else {
      /* 光导纤维 */
      const half = .9;
      rect({x: -6.6, y: -half - .5}, {x: 6.6, y: half + .5}, 'rgba(108,182,255,.05)', null);
      rect({x: -6.6, y: -half}, {x: 6.6, y: half}, 'rgba(160,220,255,.07)', null);
      line({x: -6.6, y: half}, {x: 6.6, y: half}, 'rgba(190,225,240,.55)', {w: 1.4});
      line({x: -6.6, y: -half}, {x: 6.6, y: -half}, 'rgba(190,225,240,.55)', {w: 1.4});
      sans('包层 n = 1.40', X(-6.5), Y(half + .35), 'rgba(150,190,215,.7)', 10, 'left');
      sans('纤芯 n = ' + f2(s.n), X(-6.5), Y(-half - .35), 'rgba(160,205,255,.85)', 10, 'left');

      const slope = 1 / Math.tan(th);
      const pts = [];
      let y = 0, dir = 1;
      for (let x = -6.6; x <= 6.6; x += .04) {
        y += dir * slope * .04;
        if (y > half) { y = 2 * half - y; dir = -1; }
        if (y < -half) { y = -2 * half - y; dir = 1; }
        pts.push({x: x, y: y});
      }
      const ok = th >= C - 1e-4;
      path(pts, ok ? '#5eead4' : 'rgba(255,143,171,.7)', {w: 2.4, glow: ok ? 8 : 0, dash: ok ? null : [6, 5]});

      sans('光在纤芯与包层的界面上不断全反射，沿弯曲的纤维前进',
        X(-6.6), Y(-2.3), 'rgba(180,215,225,.8)', 11, 'left');
      sans('入射角 ' + f1(s.th) + '°，临界角 ' + f1(C * 180 / Math.PI) + '°',
        X(-6.6), Y(-2.75), 'rgba(160,195,210,.7)', 11, 'left');
      sans(ok ? 'θ > C，全反射，光被"锁"在纤芯里' : 'θ < C，光会漏到包层，无法远距离传输',
        X(0), Y(2.3), ok ? 'rgba(143,233,216,.95)' : 'rgba(255,160,170,.95)', 12);
    }
  },
  hud() {
    const s = this.state, C = this.crit() * 180 / Math.PI;
    return [
      {k: '入射角 θ', v: f1(s.th) + '°', hi: true},
      {k: '临界角 C', v: f1(C) + '°', hi: true},
      {k: '折射率 n', v: f2(s.n)},
      {k: 'sin C', v: f2(1 / s.n)},
      {k: '介质中光速', v: f2(3 / s.n) + '×10⁸ m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    const seg = addSeg(el, ['全反射', '光导纤维'], s.mode, i => { s.mode = i; s.th = i === 0 ? 30 : 70; seg.set(i); });
    addSlider(el, '入射角 θ / °', 0, 85, 1, s.th, v => String(Math.round(v)), v => s.th = v);
    addSlider(el, '折射率 n', 1.2, 2.2, .05, s.n, v => f2(v), v => s.n = v);
    addToggle(el, '显示法线', s.showNormal, v => s.showNormal = v);
    addBtn(el, '调到临界角', () => { s.th = Math.round(this.crit() * 180 / Math.PI); }, 'ghost');
  }
});

/* ---------- 03 双缝干涉 ---------- */
MODULES.push({
  key: 'doubleslit', tab: '03', name: '双缝干涉', en: 'DOUBLE SLIT', blurb: '等间距的明暗条纹',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变波长、缝距与屏距，观察条纹间距怎样变化',
  state: {lam: 550, d: .2, L: 1, showRay: true},
  reset() { const s = this.state; s.lam = 550; s.d = .2; s.L = 1; s.showRay = true; },
  meta() {
    return {
      title: '双缝干涉出现等间距的明暗条纹',
      desc: '同一束光经过两条狭缝后分成两列相干光，在屏上叠加。路程差为波长整数倍处加强成亮纹，为半波长奇数倍处减弱成暗纹。条纹等间距，间距与波长、屏距成正比，与缝距成反比。',
      formula: 'Δx = L λ / d',
      note: '条纹间距<b>与波长成正比</b>：红光条纹比蓝光宽，这也是用双缝实验测波长的原理。'
    };
  },
  dxmm() { const s = this.state; return s.lam * s.L / Math.max(.02, s.d) * 1e-3; },
  draw() {
    const s = this.state;
    setFrame(.5, .5, 15);
    base();

    const dx = this.dxmm();
    const sx = -2.6, scx = 5.0, halfmm = 8, SC = .36;

    /* 双缝板 */
    rect({x: sx - .1, y: -3.2}, {x: sx + .1, y: -1.0}, 'rgba(150,180,195,.3)', 'rgba(180,205,220,.55)', {w: 1.2});
    rect({x: sx - .1, y: -.7}, {x: sx + .1, y: .7}, 'rgba(150,180,195,.3)', 'rgba(180,205,220,.55)', {w: 1.2});
    rect({x: sx - .1, y: 1.0}, {x: sx + .1, y: 3.2}, 'rgba(150,180,195,.3)', 'rgba(180,205,220,.55)', {w: 1.2});
    sans('双缝', X(sx), Y(3.45), 'rgba(180,210,225,.8)', 10.5);

    /* 入射光 */
    const col = wlCss(s.lam, .85);
    for (let k = -1; k <= 1; k++) {
      const yy = k * .85;
      line({x: -6.9, y: yy}, {x: sx - .12, y: yy}, col, {w: 1.6, alpha: .5});
    }
    sans('相干光', X(-6.8), Y(1.5), 'rgba(255,215,154,.8)', 10.5, 'left');

    /* 屏幕 */
    rect({x: scx, y: -3}, {x: scx + .22, y: 3}, 'rgba(10,18,28,.85)', 'rgba(190,220,235,.5)', {w: 1.2});

    /* 条纹 */
    const N = 150;
    for (let i = 0; i < N; i++) {
      const ymm = -halfmm + 2 * halfmm * (i + .5) / N;
      const I = Math.pow(Math.cos(Math.PI * ymm / dx), 2);
      const y = ymm * SC;
      const c = wlRGB(s.lam);
      rect({x: scx + .02, y: y - halfmm * SC / N * 1.05}, {x: scx + .2, y: y + halfmm * SC / N * 1.05},
        'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (.1 + .9 * I).toFixed(2) + ')', null);
    }

    /* 光路 */
    const yP = 1.6;
    if (s.showRay) {
      line({x: sx, y: .85}, {x: scx, y: yP}, 'rgba(255,255,255,.28)', {w: 1.1, dash: [5, 5]});
      line({x: sx, y: -.85}, {x: scx, y: yP}, 'rgba(255,255,255,.28)', {w: 1.1, dash: [5, 5]});
      dot({x: scx, y: yP}, '#ffffff', 3.5);
      sans('P', X(scx) + 14, Y(yP), 'rgba(235,245,250,.9)', 11, 'left');
    }

    /* 条纹间距标注 */
    const y0 = -1.55, y1 = y0 + dx * SC;
    if (dx * SC < 3) {
      line({x: 4.35, y: y0}, {x: 4.35, y: y1}, '#ffc56b', {w: 2});
      line({x: 4.2, y: y0}, {x: 4.5, y: y0}, '#ffc56b', {w: 1.4});
      line({x: 4.2, y: y1}, {x: 4.5, y: y1}, '#ffc56b', {w: 1.4});
      sans('Δx', X(4.15), Y((y0 + y1) / 2), 'rgba(255,215,154,.95)', 12, 'right');
    }

    sans('Δx = Lλ/d = ' + f2(dx) + ' mm', X(-6.9), Y(-2.35), '#ffd79a', 13, 'left');
    sans('λ = ' + String(Math.round(s.lam)) + ' nm　d = ' + f2(s.d) + ' mm　L = ' + f2(s.L) + ' m',
      X(-6.9), Y(-2.8), 'rgba(170,205,215,.8)', 11, 'left');
    sans('屏', X(scx) + 10, Y(3.3), 'rgba(170,200,215,.6)', 10, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '波长 λ', v: String(Math.round(s.lam)) + ' nm', hi: true},
      {k: '双缝间距 d', v: f2(s.d) + ' mm'},
      {k: '屏距 L', v: f2(s.L) + ' m'},
      {k: '条纹间距 Δx', v: f2(this.dxmm()) + ' mm', hi: true},
      {k: '条纹数（屏上）', v: String(Math.round(16 / Math.max(.1, this.dxmm()))) + ' 条'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '波长 λ / nm', 400, 700, 10, s.lam, v => String(Math.round(v)), v => s.lam = v);
    addSlider(el, '双缝间距 d / mm', .1, .5, .01, s.d, v => f2(v), v => s.d = v);
    addSlider(el, '屏距 L / m', .5, 2, .05, s.L, v => f2(v), v => s.L = v);
    addToggle(el, '显示两缝到 P 的光路', s.showRay, v => s.showRay = v);
    addBtn(el, '换成红光', () => { s.lam = 680; }, 'ghost');
  }
});

/* ---------- 04 薄膜干涉与衍射 ---------- */
MODULES.push({
  key: 'film', tab: '04', name: '薄膜与衍射', en: 'THIN FILM', blurb: '等厚条纹与绕射',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换薄膜干涉与单缝衍射，比较条纹的疏密变化',
  state: {mode: 0, lam: 550, b: 6, showCurve: true},
  reset() { const s = this.state; s.mode = 0; s.lam = 550; s.b = 6; s.showCurve = true; },
  meta() {
    return {
      title: '等厚处同色，缝窄时波向各方向散开',
      desc: '肥皂膜上下表面反射的光叠加，厚度相同的地方光程差相同，呈现同一条纹，厚度变化使条纹平行排列。光通过很窄的单缝时不再沿直线传播，而是散开到各方向，形成中央亮、两侧渐暗的衍射图样。',
      formula: '薄膜亮纹 2nd = (k+½)λ，单缝暗纹 b sin θ = kλ',
      note: '薄膜干涉是<b>反射光叠加</b>，衍射是<b>一列波自己绕开障碍</b>，两者条纹的成因不同。'
    };
  },
  draw() {
    const s = this.state;
    setFrame(.5, .5, 15);
    base();

    if (s.mode === 0) {
      /* 肥皂膜 */
      const x0 = -1.6, x1 = 1.6, yt = 2.8, yb = -2.3;
      const N = 150;
      const dOf = y => 220 + (yt - y) / (yt - yb) * 1900;
      for (let i = 0; i < N; i++) {
        const y = yt + (yb - yt) * (i + .5) / N;
        const d = dOf(y);
        const I = Math.pow(Math.sin(Math.PI * 2 * 1.33 * d / s.lam), 2);
        const c = wlRGB(s.lam);
        const hh = (yt - yb) / N * .62;
        rect({x: x0, y: y - hh}, {x: x1, y: y + hh},
          'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (.08 + .88 * I).toFixed(2) + ')', null);
      }
      line({x: x0, y: yt}, {x: x0, y: yb}, 'rgba(190,220,235,.5)', {w: 1.2});
      line({x: x1, y: yt}, {x: x1, y: yb}, 'rgba(190,220,235,.5)', {w: 1.2});

      for (let k = 0; k < 3; k++) {
        const ax = -1.2 + k * .6;
        arrow({x: ax, y: 3.95}, {x: ax, y: 2.95}, wlCss(560, .85), {w: 2.2, head: 10});
      }
      sans('白光', X(-1.7), Y(3.55), 'rgba(255,235,200,.85)', 10.5, 'right');

      sans('亮纹条件 2nd = (k + ½)λ　λ = ' + String(Math.round(s.lam)) + ' nm',
        X(-7.0), Y(3.85), 'rgba(255,215,154,.9)', 11.5, 'left');
      sans('上下表面的反射光叠加，厚度相同处颜色相同',
        X(-7.0), Y(3.35), 'rgba(200,225,235,.7)', 10.5, 'left');
      sans('膜厚向下均匀增大 → 条纹等间距排列', X(-7.0), Y(-2.7), 'rgba(180,215,225,.8)', 11.5, 'left');
      sans('厚度增大 →', X(1.85), Y(-1.0), 'rgba(160,195,210,.55)', 10, 'left');
      arrow({x: 1.85, y: -.4}, {x: 1.85, y: -1.9}, 'rgba(160,195,210,.35)', {w: 1.2, head: 8});
    } else {
      /* 单缝衍射 */
      const sx = -1.8, scr = 4.6;
      rect({x: sx - .12, y: -3.2}, {x: sx + .12, y: -1.0}, 'rgba(150,180,195,.32)', 'rgba(180,205,220,.55)', {w: 1.2});
      rect({x: sx - .12, y: 1.0}, {x: sx + .12, y: 3.2}, 'rgba(150,180,195,.32)', 'rgba(180,205,220,.55)', {w: 1.2});
      line({x: sx - .12, y: -1.0}, {x: sx + .12, y: -1.0}, 'rgba(255,197,107,.8)', {w: 2});
      line({x: sx - .12, y: 1.0}, {x: sx + .12, y: 1.0}, 'rgba(255,197,107,.8)', {w: 2});
      sans('缝宽 b = ' + f1(s.b) + ' μm', X(sx + .35), Y(1.35), 'rgba(255,215,154,.9)', 10.5, 'left');

      for (let k = 0; k < 8; k++) {
        const x = sx - .3 - k * .9;
        if (x < -7) break;
        line({x: x, y: -3.1}, {x: x, y: 3.1}, wlCss(s.lam, .3), {w: 1.3});
      }

      rect({x: scr, y: -3}, {x: scr + .24, y: 3}, 'rgba(10,18,28,.85)', 'rgba(190,220,235,.5)', {w: 1.2});

      const ratio = s.b * 1000 / s.lam;
      const NN = 140;
      for (let i = 0; i < NN; i++) {
        const sn = -0.75 + 1.5 * (i + .5) / NN;
        const beta = Math.PI * ratio * sn;
        const I = Math.abs(beta) < 1e-6 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
        const y = sn * 3.4;
        const c = wlRGB(s.lam);
        const hh = 8 / NN * .62;
        rect({x: scr + .02, y: y - hh}, {x: scr + .22, y: y + hh},
          'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (.06 + .94 * I).toFixed(2) + ')', null);
      }
      sans('屏', X(scr) + 12, Y(3.3), 'rgba(170,200,215,.6)', 10, 'left');

      if (s.showCurve) {
        const cv = [];
        for (let i = 0; i <= 120; i++) {
          const sn = -.75 + 1.5 * i / 120;
          const beta = Math.PI * ratio * sn;
          const I = Math.abs(beta) < 1e-6 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
          cv.push({x: 1.0 + I * 2.6, y: sn * 3.4});
        }
        path(cv, 'rgba(180,156,255,.8)', {w: 2});
        line({x: 1.0, y: -2.8}, {x: 1.0, y: 2.8}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 5]});
        sans('光强', X(1.0), Y(3.15), 'rgba(200,190,255,.7)', 10);
      }
      sans('中央明纹最亮最宽，两侧明纹迅速变暗', X(-7.0), Y(-2.7), 'rgba(180,215,225,.8)', 11, 'left');
      sans('b/λ = ' + f2(ratio) + '　缝越窄，衍射越明显', X(-7.0), Y(3.85), 'rgba(255,215,154,.9)', 11.5, 'left');
    }
  },
  hud() {
    const s = this.state;
    if (s.mode === 0) {
      return [
        {k: '波长 λ', v: String(Math.round(s.lam)) + ' nm', hi: true},
        {k: '薄膜折射率 n', v: '1.33'},
        {k: '膜厚范围', v: '220–2120 nm'},
        {k: '亮纹条件', v: '2nd = (k+½)λ', hi: true},
        {k: '条纹走向', v: '水平 · 等间距'}
      ];
    }
    const ratio = s.b * 1000 / s.lam;
    return [
      {k: '缝宽 b', v: f1(s.b) + ' μm', hi: true},
      {k: '波长 λ', v: String(Math.round(s.lam)) + ' nm'},
      {k: 'b/λ', v: f2(ratio)},
      {k: '中央明纹半角', v: f2(Math.asin(clamp(1 / ratio, 0, 1)) * 180 / Math.PI) + '°', hi: true},
      {k: '第一暗纹条件', v: 'b sinθ = λ'}
    ];
  },
  panel(el) {
    const s = this.state;
    const seg = addSeg(el, ['薄膜', '单缝衍射'], s.mode, i => { s.mode = i; seg.set(i); });
    addSlider(el, '波长 λ / nm', 400, 700, 10, s.lam, v => String(Math.round(v)), v => s.lam = v);
    addSlider(el, '缝宽 b / μm', 2, 14, .5, s.b, v => f1(v), v => s.b = v);
    addToggle(el, '显示光强曲线', s.showCurve, v => s.showCurve = v);
    addBtn(el, '换成绿光', () => { s.lam = 530; }, 'ghost');
  }
});

/* ---------- 05 光的偏振 ---------- */
MODULES.push({
  key: 'polarize', tab: '05', name: '光的偏振', en: 'POLARIZATION', blurb: '只让一个方向通过',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '转动检偏器，看透射光强按 cos²θ 变化',
  playable: true,
  state: {t: 0, playing: false, th: 30, dir: 1, showP2: true, showVec: true},
  reset() {
    const s = this.state;
    s.t = 0; s.playing = false; s.th = 30; s.dir = 1; s.showP2 = true; s.showVec = true;
  },
  meta() {
    return {
      title: '偏振片只让某一方向的光振动通过',
      desc: '自然光在各个方向上都有振动。通过第一块偏振片后，只剩沿透振方向振动的偏振光。再让它通过第二块偏振片，透射光强随两片透振方向夹角按余弦平方规律变化，夹角 90° 时完全变暗。',
      formula: 'I = I<sub>0</sub> cos<sup>2</sup>θ（马吕斯定律）',
      note: '转动检偏器时亮度<b>周期性变化但不为零</b>，说明光是横波；声波是纵波，不会出现这种现象。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.th += dt * 22 * s.dir;
      if (s.th > 90) { s.th = 90; s.dir = -1; }
      if (s.th < 0) { s.th = 0; s.dir = 1; }
    }
    setFrame(.5, .5, 15);
    base();

    const th = s.th * Math.PI / 180;
    const I = Math.pow(Math.cos(th), 2);
    const p1x = -3.4, p2x = .6, scrx = 5.2;

    line({x: -6.8, y: 0}, {x: 5.0, y: 0}, 'rgba(255,255,255,.12)', {w: 1});

    /* 起偏器 */
    const plate = (px, col) => {
      rect({x: px - .1, y: -1.9}, {x: px + .1, y: 1.9}, 'rgba(30,44,58,.85)', col, {w: 1.4});
    };
    plate(p1x, 'rgba(255,143,171,.75)');
    sans('起偏器 P₁', X(p1x), Y(-2.25), 'rgba(255,179,198,.85)', 10.5);
    arrow({x: p1x, y: 2.15}, {x: p1x, y: 2.75}, 'rgba(255,143,171,.9)', {w: 2, head: 9});

    /* 自然光：各方向振动 */
    if (s.showVec) {
      for (let k = 0; k < 6; k++) {
        const bx = -6.4 + k * .48;
        const ang = k * 1.05 + 0.3;
        const dx = Math.cos(ang) * .34, dy = Math.sin(ang) * .34;
        line({x: bx - dx, y: dy}, {x: bx + dx, y: -dy}, 'rgba(255,235,180,.55)', {w: 1.6});
      }
      sans('自然光', X(-6.4), Y(-1.2), 'rgba(255,225,175,.75)', 10.5);

      /* 线偏振光（竖直） */
      for (let k = 0; k < 8; k++) {
        const bx = p1x + .45 + k * .42;
        const a = .55 * Math.sin(k * 1.1 + s.t * 6);
        line({x: bx, y: -a}, {x: bx, y: a}, 'rgba(255,143,171,.55)', {w: 1.6});
      }
    }

    /* 检偏器 */
    if (s.showP2) {
      plate(p2x, 'rgba(108,182,255,.75)');
      sans('检偏器 P₂', X(p2x), Y(-2.25), 'rgba(158,203,255,.85)', 10.5);
      const ax = Math.sin(th) * 1.1, ay = Math.cos(th) * 1.1;
      arrow({x: p2x - ax, y: 2.45 - ay}, {x: p2x + ax, y: 2.45 + ay}, 'rgba(108,182,255,.9)', {w: 2.2, head: 9});
      sans('透振方向', X(p2x + .2), Y(3.6), 'rgba(158,203,255,.7)', 10, 'left');
    }

    /* 透射后 */
    if (s.showVec && s.showP2) {
      const amp = Math.cos(th) * .6;
      for (let k = 0; k < 8; k++) {
        const bx = p2x + .45 + k * .48;
        const a = amp * Math.sin(k * 1.1 + s.t * 6) * 1.2;
        const ux = Math.sin(th), uy = Math.cos(th);
        line({x: bx - ux * a, y: -uy * a}, {x: bx + ux * a, y: uy * a}, 'rgba(108,182,255,.75)', {w: 1.8});
      }
    }

    /* 屏 */
    rect({x: scrx, y: -1.4}, {x: scrx + .3, y: 1.4}, 'rgba(10,18,28,.9)', 'rgba(190,220,235,.45)', {w: 1.2});
    rect({x: scrx + .04, y: -1.3}, {x: scrx + .26, y: 1.3},
      'rgba(255,215,150,' + (.08 + .8 * I).toFixed(2) + ')', null);
    sans('屏', X(scrx + .15), Y(-1.7), 'rgba(180,210,225,.6)', 10);

    /* 夹角示意 */
    const cx = 4.0, cy = 3.0;
    line({x: cx, y: cy - .8}, {x: cx, y: cy + .8}, 'rgba(255,143,171,.8)', {w: 2});
    line({x: cx - Math.sin(th) * .8, y: cy - Math.cos(th) * .8}, {x: cx + Math.sin(th) * .8, y: cy + Math.cos(th) * .8},
      'rgba(108,182,255,.85)', {w: 2});
    angleArc({x: cx, y: cy}, Math.PI / 2, Math.PI / 2 - th, 40, 'rgba(255,255,255,.5)', '', 10);
    sans('θ = ' + f1(s.th) + '°', X(cx + .9), Y(cy - .35), 'rgba(220,235,245,.85)', 11, 'left');

    sans('I = I₀cos²θ = ' + f1(100 * I) + '% I₀', X(-6.8), Y(-2.72), 'rgba(255,215,154,.95)', 13, 'left');
    sans(s.th > 85 ? '两片透振方向垂直，光完全被挡住' : s.th < 5 ? '两片方向平行，光几乎全部通过' : '转动检偏器，亮度连续变化',
      X(-6.8), Y(3.35), 'rgba(180,215,225,.8)', 11.5, 'left');
  },
  hud() {
    const s = this.state, I = Math.pow(Math.cos(s.th * Math.PI / 180), 2);
    return [
      {k: '两片夹角 θ', v: f1(s.th) + '°', hi: true},
      {k: '入射光强 I₀', v: '100 %'},
      {k: '透射光强 I', v: f1(100 * I) + ' %', hi: true},
      {k: '透射比 I/I₀', v: f2(I)},
      {k: '振幅比 A/A₀', v: f2(Math.cos(s.th * Math.PI / 180))}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '两片夹角 θ / °', 0, 90, 1, s.th, v => String(Math.round(v)), v => s.th = v);
    addToggle(el, '显示检偏器 P₂', s.showP2, v => s.showP2 = v);
    addToggle(el, '显示光振动方向', s.showVec, v => s.showVec = v);
    addBtn(el, '转到 90°（全暗）', () => { s.th = 90; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 自动转动'; }
});

})();
