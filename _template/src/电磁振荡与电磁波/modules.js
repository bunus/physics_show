/* ============================================================
   选择性必修第二册 · 第 4 章 电磁振荡与电磁波
   ============================================================ */
(function () {

function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.replace('-', '−').replace(/0+$/, '').replace(/\.$/, '');
}
function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1).replace('-', '−');
}

function sup(n) {
  const d = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const t = String(n);
  let out = '';
  for (let i = 0; i < t.length; i++) out += t[i] === '-' ? '⁻' : d[+t[i]];
  return out;
}

function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.42)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.42)', {w: 1.4});
  arrow({x: x1 - .4, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .4}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 4, Y(y0) + 15, 'rgba(170,198,210,.85)', 11, 'right');
  if (ylab) sans(ylab, X(x0) - 8, Y(y1) + 10, 'rgba(170,198,210,.85)', 11, 'right');
}

function bar(x, y, w, h, frac, col) {
  rect({x: x, y: y}, {x: x + w, y: y + h}, 'rgba(255,255,255,.06)', 'rgba(200,220,235,.18)', {w: 1});
  rect({x: x, y: y}, {x: x + w * Math.min(1, Math.max(0, frac)), y: y + h}, col, null);
}

/* ---------- 01 LC 振荡电路 ---------- */
MODULES.push({
  key: 'lc', tab: '01', name: 'LC 振荡', en: 'LC CIRCUIT', blurb: '电场能与磁场能',
  accent: '#5eead4', rgb: '94,234,212',
  hint: '观察电容器放电、充电过程中电场能与磁场能的相互转化',
  playable: true,
  state: {ph: 0, playing: true, L: .2, C: 20, showE: true},
  reset() { const s = this.state; s.ph = 0; s.playing = true; s.L = .2; s.C = 20; s.showE = true; },
  meta() {
    return {
      title: 'LC 振荡电路：电场能与磁场能此消彼长',
      desc: '电容器放电时，电荷量减少、电流增大，电场能转化为线圈的磁场能；电流最大时电场能为零。随后线圈的自感电动势继续维持电流给电容器反向充电，如此往复形成电磁振荡。',
      formula: 'T = 2π√(LC)，q = Q<sub>m</sub>cos ωt，i = I<sub>m</sub>sin ωt',
      note: '振荡过程中<b>电场能与磁场能之和保持不变</b>（无阻尼时）。增大 L 或 C 都会使周期变长、频率变低。'
    };
  },
  draw(dt) {
    const s = this.state;
    const simW = 4.8 / Math.sqrt(s.L * s.C);
    if (s.playing) {
      s.ph += dt * simW;
      if (s.ph > 6.2832) s.ph -= 6.2832;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const q = Math.cos(s.ph), i = Math.sin(s.ph);

    const xL = -5.6, xR = -1.4, yT = 1.7, yB = -1.7;
    line({x: xL, y: yT}, {x: xR, y: yT}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xL, y: yB}, {x: xR, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xL, y: yT}, {x: xL, y: .32}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xL, y: -.32}, {x: xL, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xR, y: yT}, {x: xR, y: .8}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xR, y: -.8}, {x: xR, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    spring({x: xR, y: .8}, {x: xR, y: -.8}, 6, '#b49cff', {amp: .2, w: 2});

    line({x: xL - .55, y: .3}, {x: xL + .55, y: .3}, '#ffc56b', {w: 3.4});
    line({x: xL - .55, y: -.3}, {x: xL + .55, y: -.3}, '#ffc56b', {w: 3.4});
    const nq = Math.round(q * 6);
    for (let k = 0; k < Math.abs(nq); k++) {
      const px = xL - .38 + (k % 4) * .25, py = .3 + (nq > 0 ? .2 : -.2) * (1 + Math.floor(k / 4));
      sans(nq > 0 ? '+' : '−', X(px), Y(py), nq > 0 ? '#ff9ec4' : '#8fe0ff', 9);
    }
    sans('C', X(xL) - .75, Y(0), 'rgba(255,215,154,.9)', 13);
    sans('L', X(xR) + .4, Y(0), 'rgba(196,178,255,.9)', 13);

    if (Math.abs(q) > .05) {
      for (let k = 0; k < 3; k++) {
        arrow({x: xL - .5 + k * .5, y: .26}, {x: xL - .5 + k * .5, y: .26 - .5 * Math.sign(q)},
          'rgba(255,197,107,.4)', {w: 1.2, head: 7});
      }
    }

    if (Math.abs(i) > .05) {
      const cx = -3.5;
      arrow({x: cx - .35 * Math.sign(i), y: yT}, {x: cx + .35 * Math.sign(i), y: yT}, '#5eead4', {w: 2.4, head: 11});
      arrow({x: cx - .35 * Math.sign(i), y: yB}, {x: cx + .35 * Math.sign(i), y: yB}, '#5eead4', {w: 2.4, head: 11});
      sans('i', X(cx), Y(yT + .38), '#7ee9d6', 13);
    }

    const ec = q * q, el = i * i;
    if (s.showE) {
      bar(-5.9, -2.75, 2.0, .35, ec, 'rgba(255,197,107,.85)');
      sans('电场能 ' + f1(ec * 100) + '%', X(-5.9), Y(-2.35), 'rgba(255,215,154,.85)', 10, 'left');
      bar(-3.6, -2.75, 2.0, .35, el, 'rgba(180,156,255,.85)');
      sans('磁场能 ' + f1(el * 100) + '%', X(-3.6), Y(-2.35), 'rgba(196,178,255,.85)', 10, 'left');
    }

    const gx0 = .6, gx1 = 6.3, gy0 = -2.3, gy1 = 2.4;
    axisBox(gx0, gx1, gy0, gy1, 't', '');
    line({x: gx0, y: 0}, {x: gx1, y: 0}, 'rgba(198,222,232,.35)', {w: 1.2});
    const cq = [], ci = [];
    for (let k = 0; k <= 120; k++) {
      const a = k / 120 * 6.2832;
      cq.push({x: gx0 + (k / 120) * (gx1 - gx0), y: 1.7 * Math.cos(a)});
      ci.push({x: gx0 + (k / 120) * (gx1 - gx0), y: 1.7 * Math.sin(a)});
    }
    path(cq, 'rgba(255,197,107,.9)', {w: 2.2, glow: 5});
    path(ci, 'rgba(180,156,255,.9)', {w: 2.2, glow: 5});
    sans('q-t', X(gx1) - 6, Y(1.95), 'rgba(255,215,154,.85)', 10.5, 'right');
    sans('i-t', X(gx1) - 6, Y(-1.95), 'rgba(196,178,255,.85)', 10.5, 'right');
    const nx = gx0 + (s.ph / 6.2832) * (gx1 - gx0);
    dot({x: nx, y: 1.7 * Math.cos(s.ph)}, '#ffe9bd', 4.2);
    dot({x: nx, y: 1.7 * Math.sin(s.ph)}, '#c4b2ff', 4.2);
    line({x: nx, y: gy0}, {x: nx, y: gy1}, 'rgba(255,255,255,.14)', {w: 1, dash: [4, 5]});

    sans('q 与 i 相差四分之一周期：电荷最多时电流为零', X(L.x0) + 16, Y(2.95),
      'rgba(180,210,225,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const T = 6.2832 * Math.sqrt(s.L * s.C * 1e-6);
    return [
      {k: '周期 T', v: f2(T * 1000) + ' ms', hi: true},
      {k: '频率 f', v: f1(1 / T) + ' Hz', hi: true},
      {k: '自感系数 L', v: f2(s.L) + ' H'},
      {k: '电容 C', v: f1(s.C) + ' μF'},
      {k: '振荡相位', v: f1(s.ph * 180 / Math.PI) + '°'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '自感系数 L / H', .05, .5, .01, s.L, v => f2(v), v => s.L = v);
    addSlider(el, '电容 C / μF', 5, 50, 1, s.C, v => f1(v), v => s.C = v);
    addToggle(el, '自动振荡', s.playing, v => s.playing = v);
    addToggle(el, '显示能量条', s.showE, v => s.showE = v);
    addBtn(el, '回到电荷最多', () => { s.ph = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 电磁波的产生与传播 ---------- */
MODULES.push({
  key: 'emit', tab: '02', name: '电磁波', en: 'EM WAVE', blurb: 'E 与 B 结伴而行',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '观察天线中振荡的电荷如何在空间中激起相互垂直的电场与磁场',
  playable: true,
  state: {ph: 0, playing: true, f: 15, showB: true, amp: 1.2},
  reset() { const s = this.state; s.ph = 0; s.playing = true; s.f = 15; s.showB = true; s.amp = 1.2; },
  meta() {
    return {
      title: '电磁波：电场与磁场互相激发',
      desc: '天线中电荷上下振荡，周围产生变化的电场，变化的电场又激起变化的磁场，二者相互垂直、都垂直于传播方向，由近及远地传播出去，形成电磁波。电磁波在真空中以光速传播。',
      formula: 'c = λf = 3.0×10<sup>8</sup> m/s（真空）',
      note: 'E 与 B<b>同相位、互相垂直</b>，且都垂直于传播方向，所以电磁波是横波。频率越高，波长越短。'
    };
  },
  draw(dt) {
    const s = this.state;
    s.ph += dt * (s.playing ? 1 : 0);
    setFrame(.5, .55, 16);
    base();
    const L = lim();
    const lam = 10 / s.f * 6;
    const k = 6.2832 / lam;

    const ax = -5.6, axT = 1.4;
    line({x: ax, y: axT}, {x: ax, y: .12}, 'rgba(240,248,255,.9)', {w: 3.4});
    line({x: ax, y: -.12}, {x: ax, y: -axT}, 'rgba(240,248,255,.9)', {w: 3.4});
    const qq = Math.sin(s.ph * 2);
    dot({x: ax, y: axT}, qq > 0 ? '#ff9ec4' : '#8fe0ff', 4 + Math.abs(qq) * 2.5);
    dot({x: ax, y: -axT}, qq > 0 ? '#8fe0ff' : '#ff9ec4', 4 + Math.abs(qq) * 2.5);
    sans('天线', X(ax), Y(-1.75), 'rgba(200,220,235,.8)', 10.5);
    sans('电荷上下振荡', X(ax), Y(1.95), 'rgba(255,170,200,.85)', 10.5);

    const ptsE = [], ptsB = [];
    for (let xx = ax + .3; xx <= 6.4; xx += .05) {
      const ph = k * (xx - ax) - s.ph * 2;
      const env = Math.min(1, (xx - ax) / 1.6);
      ptsE.push({x: xx, y: s.amp * env * Math.sin(ph)});
      const zb = s.amp * .62 * env * Math.sin(ph);
      ptsB.push({x: xx + zb * .5, y: -zb * .9});
    }
    path(ptsE, 'rgba(255,143,171,.9)', {w: 2.4, glow: 6});
    if (s.showB) path(ptsB, 'rgba(108,182,255,.85)', {w: 2.2, glow: 5});

    for (let xx = ax + 1.0; xx <= 6.2; xx += .9) {
      const ph = k * (xx - ax) - s.ph * 2;
      const env = Math.min(1, (xx - ax) / 1.6);
      const ey = s.amp * env * Math.sin(ph);
      if (Math.abs(ey) > .12) arrow({x: xx, y: 0}, {x: xx, y: ey}, 'rgba(255,143,171,.55)', {w: 1.4, head: 8});
      if (s.showB) {
        const zb = s.amp * .62 * env * Math.sin(ph);
        if (Math.abs(zb) > .1) arrow({x: xx, y: 0}, {x: xx + zb * .5, y: -zb * .9}, 'rgba(108,182,255,.5)', {w: 1.3, head: 8});
      }
    }

    arrow({x: ax + .6, y: -2.5}, {x: 5.6, y: -2.5}, '#5eead4', {w: 2.2, head: 11});
    sans('传播方向', X(3.0), Y(-2.85), 'rgba(126,236,214,.9)', 11);
    sans('E', X(4.6), Y(1.25), 'rgba(255,170,200,.95)', 16);
    if (s.showB) sans('B', X(5.3), Y(-.75), 'rgba(150,196,245,.95)', 16);
    sans('λ = ' + f1(3e8 / (s.f * 1e6)) + ' m', X(L.x0) + 16, Y(2.9), 'rgba(180,210,225,.75)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const lam = 3e8 / (s.f * 1e6);
    return [
      {k: '频率 f', v: f1(s.f) + ' MHz', hi: true},
      {k: '波长 λ', v: f1(lam) + ' m', hi: true},
      {k: '周期 T', v: f2(1e9 / (s.f * 1e6)) + ' ns'},
      {k: '波速 c', v: '3.0×10<sup>8</sup> m/s'},
      {k: '波的类型', v: '横波'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '振荡频率 f / MHz', 5, 30, 1, s.f, v => f1(v), v => s.f = v);
    addSlider(el, '电场振幅', .4, 1.8, .1, s.amp, v => f1(v), v => s.amp = v);
    addToggle(el, '显示磁场 B', s.showB, v => s.showB = v);
    addToggle(el, '自动播放', s.playing, v => s.playing = v);
    addBtn(el, '冻结', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 电磁波谱 ---------- */
MODULES.push({
  key: 'spectrum', tab: '03', name: '电磁波谱', en: 'SPECTRUM', blurb: '按波长排排队',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '拖动滑块改变波长，看看它落在电磁波谱的哪一段',
  state: {lg: -6.25, showName: true},
  reset() { const s = this.state; s.lg = -6.25; s.showName = true; },
  meta() {
    return {
      title: '电磁波谱：波长从长到短排成一列',
      desc: '无线电波、红外线、可见光、紫外线、X 射线、γ 射线都是电磁波，只是频率和波长不同。波长越短，频率越高，光子能量越大。可见光只占电磁波谱中极窄的一段。',
      formula: 'c = λf，λ 越短则 f 越高',
      note: '各种电磁波在真空中的<b>传播速度相同</b>，都是 3.0×10<sup>8</sup> m/s。波长与频率成反比，所以谱图常用对数坐标。'
    };
  },
  X(l) { return -5.8 + (4 - l) / 18 * 11.6; },
  lamText(l) {
    const v = Math.pow(10, l);
    if (v >= 1) return f1(v) + ' m';
    if (v >= 1e-2) return f1(v * 100) + ' cm';
    if (v >= 1e-6) return f1(v * 1e6) + ' μm';
    if (v >= 1e-9) return f1(v * 1e9) + ' nm';
    return f2(v * 1e12) + ' pm';
  },
  bandName(l) {
    if (l > -3) return '无线电波';
    if (l > -6.1) return '红外线';
    if (l > -6.4) return '可见光';
    if (l > -8) return '紫外线';
    if (l > -11) return 'X 射线';
    return 'γ 射线';
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const bands = [
      {n: '无线电波', a: 4, b: -3, c: 'rgba(108,182,255,.45)', y: -.25},
      {n: '红外线', a: -3, b: -6.1, c: 'rgba(255,143,107,.5)', y: -.75},
      {n: '可见光', a: -6.1, b: -6.4, c: 'rgba(123,224,192,.75)', y: -1.3},
      {n: '紫外线', a: -6.4, b: -8, c: 'rgba(180,156,255,.5)', y: -1.85},
      {n: 'X 射线', a: -8, b: -11, c: 'rgba(94,234,212,.45)', y: -2.4},
      {n: 'γ 射线', a: -11, b: -14, c: 'rgba(255,197,107,.55)', y: -2.95}
    ];

    for (let i = 0; i < bands.length; i++) {
      const b = bands[i];
      const xa = this.X(b.a), xb = this.X(b.b);
      rect({x: xb, y: .2}, {x: xa, y: .95}, b.c, 'rgba(220,235,245,.35)', {w: 1});
      const cx = (xa + xb) / 2;
      line({x: cx, y: .15}, {x: cx, y: b.y + .18}, 'rgba(180,205,220,.35)', {w: 1, dash: [3, 3]});
      if (s.showName) sans(b.n, X(cx), Y(b.y), 'rgba(215,232,242,.9)', i === 2 ? 10.5 : 11);
    }

    const vi0 = this.X(-6.1), vi1 = this.X(-6.4);
    const cols = ['#ff5f6d', '#ffa14a', '#ffe45e', '#63e07a', '#4bb8ff', '#8b6bff'];
    for (let i = 0; i < 6; i++) {
      const w = (vi1 - vi0) / 6;
      rect({x: vi0 + i * w, y: .28}, {x: vi0 + (i + 1) * w, y: .87}, cols[i], null);
    }

    for (let e = 4; e >= -14; e -= 2) {
      const xx = this.X(e);
      line({x: xx, y: .1}, {x: xx, y: -.02}, 'rgba(198,222,232,.4)', {w: 1});
      sans(e === 0 ? '1' : '10' + sup(e), X(xx), Y(1.25), 'rgba(160,190,205,.6)', 9.5);
    }
    sans('波长 λ / m（对数坐标）', X(L.x0) + 16, Y(1.62), 'rgba(170,198,210,.8)', 11, 'left');

    const mk = this.X(s.lg);
    line({x: mk, y: -.05}, {x: mk, y: 1.5}, '#ffc56b', {w: 2, dash: [5, 4]});
    dot({x: mk, y: .58}, '#ffe9bd', 6);

    const lam = Math.pow(10, s.lg);
    const fr = 3e8 / lam;
    const fTxt = fr >= 1e12 ? f2(fr / 1e12) + ' THz' : fr >= 1e9 ? f2(fr / 1e9) + ' GHz' : fr >= 1e6 ? f1(fr / 1e6) + ' MHz' : f1(fr / 1e3) + ' kHz';
    sans('λ = ' + this.lamText(s.lg), X(L.x0) + 16, Y(2.92), '#ffd79a', 15, 'left');
    sans(this.bandName(s.lg) + ' · f = ' + fTxt, X(L.x0) + 16, Y(2.35), 'rgba(255,215,154,.85)', 11, 'left');
    const note = this.bandName(s.lg) === '无线电波' ? '广播、电视、移动通信' :
      this.bandName(s.lg) === '红外线' ? '遥控器、热成像、遥感' :
      this.bandName(s.lg) === '可见光' ? '人眼可见，红橙黄绿蓝靛紫' :
      this.bandName(s.lg) === '紫外线' ? '杀菌消毒、防伪、促进合成维生素 D' :
      this.bandName(s.lg) === 'X 射线' ? '医学透视、晶体结构分析' : '肿瘤放疗、工业探伤';
    sans(note, X(L.x1) - 16, Y(2.92), 'rgba(190,215,230,.85)', 11.5, 'right');
  },
  hud() {
    const s = this.state;
    const lam = Math.pow(10, s.lg);
    const fr = 3e8 / lam;
    return [
      {k: '波长 λ', v: this.lamText(s.lg), hi: true},
      {k: '频率 f', v: fr >= 1e12 ? f2(fr / 1e12) + ' THz' : fr >= 1e9 ? f2(fr / 1e9) + ' GHz' : f1(fr / 1e6) + ' MHz', hi: true},
      {k: '所属波段', v: this.bandName(s.lg)},
      {k: '传播速度', v: '3.0×10<sup>8</sup> m/s'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '波长（对数）/ m', 0, 100, 1, (4 - s.lg) / 18 * 100,
      v => '10' + sup(Math.round(4 - v / 100 * 18)) + ' m', v => s.lg = 4 - v / 100 * 18);
    addBtn(el, '跳到可见光', () => { s.lg = -6.25; }, 'ghost');
    addBtn(el, '跳到无线电波', () => { s.lg = 1; }, 'ghost');
    addToggle(el, '显示波段名称', s.showName, v => s.showName = v);
  }
});

/* ---------- 04 无线电波的发射与接收 ---------- */
MODULES.push({
  key: 'radio', tab: '04', name: '发射与接收', en: 'TUNING', blurb: '电谐振选台',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '调节接收电路的电容，使它的固有频率与发射频率相同',
  state: {C: 100, ftx: 1.0, showCurve: true},
  reset() { const s = this.state; s.C = 100; s.ftx = 1.0; s.showCurve = true; },
  meta() {
    return {
      title: '电谐振：调台就是调频率',
      desc: '发射台用 LC 振荡电路产生高频电流，通过天线辐射电磁波。接收端也有一套 LC 电路，改变电容就能改变它的固有频率；当固有频率与某电台频率相同时发生电谐振，该频率的信号最强。',
      formula: 'f = 1/(2π√(LC))，谐振时 f<sub>接</sub> = f<sub>发</sub>',
      note: '收音机选台旋钮改变的就是<b>可变电容</b>：电容变小，固有频率变高。失谐时信号明显减弱，这就是“串台”消失的原因。'
    };
  },
  frx(C) {
    return 1 / (6.2832 * Math.sqrt(200e-6 * C * 1e-12)) / 1e6;
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const f = this.frx(s.C);
    const S = 1 / (1 + Math.pow((f - s.ftx) / .09, 2));

    const txX = -5.2, rxX = 1.8;
    line({x: txX, y: -.9}, {x: txX, y: .9}, 'rgba(240,248,255,.9)', {w: 3.4});
    line({x: rxX, y: -.9}, {x: rxX, y: .9}, 'rgba(240,248,255,.9)', {w: 3.4});
    sans('发射天线', X(txX), Y(-1.3), 'rgba(255,170,200,.85)', 10.5);
    sans('接收天线', X(rxX), Y(-1.3), 'rgba(126,236,214,.85)', 10.5);

    for (let i = 0; i < 4; i++) {
      const rr = .8 + i * .75;
      const pts = [];
      for (let k = -10; k <= 10; k++) {
        const a = k / 10 * 1.1;
        pts.push({x: txX + Math.cos(a) * rr, y: Math.sin(a) * rr * 1.05});
      }
      path(pts, 'rgba(255,197,107,' + (0.28 - i * .05).toFixed(2) + ')', {w: 1.4});
    }
    sans('f发 = ' + f2(s.ftx) + ' MHz', X(txX), Y(1.35), 'rgba(255,215,154,.9)', 11);

    circleAt({x: rxX, y: 1.9}, .16 + S * .14, 'rgba(123,224,192,' + (0.2 + S * .6).toFixed(2) + ')', 'rgba(123,224,192,.8)', {w: 1.4});

    const lx = 3.6, ly = 1.6;
    line({x: rxX, y: .9}, {x: lx, y: .9}, 'rgba(215,232,242,.7)', {w: 1.6});
    spring({x: lx, y: 1.05}, {x: lx, y: 2.3}, 5, '#b49cff', {amp: .16, w: 1.8});
    sans('L = 200 μH', X(lx + .62), Y(1.7), 'rgba(196,178,255,.85)', 10);

    const cy2 = .35;
    line({x: lx, y: .9}, {x: lx, y: cy2 + .18}, 'rgba(215,232,242,.7)', {w: 1.6});
    line({x: lx - .4, y: cy2 + .18}, {x: lx + .4, y: cy2 + .18}, '#5eead4', {w: 3});
    line({x: lx - .4, y: cy2 - .18}, {x: lx + .4, y: cy2 - .18}, '#5eead4', {w: 3});
    line({x: lx, y: cy2 - .18}, {x: lx, y: -.6}, 'rgba(215,232,242,.7)', {w: 1.6});
    sans('C = ' + Math.round(s.C) + ' pF', X(lx + .75), Y(cy2), 'rgba(126,236,214,.9)', 10);

    bar(-2.0, 2.35, 3.0, .42, S, 'rgba(123,224,192,.85)');
    sans('接收信号强度 ' + f1(S * 100) + '%', X(-2.0), Y(3.05), S > .7 ? 'rgba(126,236,214,.95)' : 'rgba(190,215,230,.8)', 11, 'left');
    sans('f接 = ' + f2(f) + ' MHz', X(1.2), Y(3.05), 'rgba(255,215,154,.9)', 11, 'left');

    if (s.showCurve) {
      const gx0 = -2.6, gx1 = 6.0, gy0 = -2.8, gy1 = -1.0;
      axisBox(gx0, gx1, gy0, gy1, 'C / pF', '');
      const pts = [];
      for (let i = 0; i <= 100; i++) {
        const cc = 20 + i / 100 * 180;
        const ff = this.frx(cc);
        const ss = 1 / (1 + Math.pow((ff - s.ftx) / .09, 2));
        pts.push({x: gx0 + i / 100 * (gx1 - gx0), y: gy0 + ss * (gy1 - gy0) * .92 + .06});
      }
      path(pts, 'rgba(255,197,107,.85)', {w: 2.2, glow: 5});
      const mx = gx0 + (s.C - 20) / 180 * (gx1 - gx0);
      const my = gy0 + S * (gy1 - gy0) * .92 + .06;
      dot({x: mx, y: my}, '#fff3d6', 4.5);
      line({x: mx, y: gy0}, {x: mx, y: gy1}, 'rgba(255,255,255,.16)', {w: 1, dash: [4, 5]});
      sans('谐振曲线', X(gx1) - 6, Y(gy1 - .12), 'rgba(255,215,154,.75)', 10, 'right');
    }

    sans(S > .7 ? '已谐振：信号最强，成功选台' : '失谐：固有频率与电台频率不同，信号很弱',
      X(L.x0) + 16, Y(-3.1), S > .7 ? 'rgba(126,236,214,.9)' : 'rgba(190,215,230,.7)', 11, 'left');
  },
  hud() {
    const s = this.state;
    const f = this.frx(s.C);
    const S = 1 / (1 + Math.pow((f - s.ftx) / .09, 2));
    return [
      {k: '发射频率', v: f2(s.ftx) + ' MHz'},
      {k: '接收固有频率', v: f2(f) + ' MHz', hi: true},
      {k: '可变电容 C', v: Math.round(s.C) + ' pF'},
      {k: '信号强度', v: f1(S * 100) + ' %', hi: true},
      {k: '状态', v: S > .7 ? '发生电谐振' : '失谐'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '可变电容 C / pF', 20, 200, 2, s.C, v => String(Math.round(v)), v => s.C = v);
    addSlider(el, '电台频率 / MHz', .8, 1.4, .02, s.ftx, v => f2(v), v => s.ftx = v);
    addToggle(el, '显示谐振曲线', s.showCurve, v => s.showCurve = v);
    addBtn(el, '自动调谐到电台', () => { s.C = Math.min(200, Math.max(20, 126.65 / (s.ftx * s.ftx))); }, 'ghost');
  }
});

/* ---------- 05 电磁波的应用：调制 ---------- */
MODULES.push({
  key: 'mod', tab: '05', name: '调制与解调', en: 'MODULATION', blurb: '把声音装上车',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '观察音频信号怎样改变高频载波的振幅',
  playable: true,
  state: {ph: 0, playing: true, fm: 1, fc: 12, m: .6, showEnv: true},
  reset() { const s = this.state; s.ph = 0; s.playing = true; s.fm = 1; s.fc = 12; s.m = .6; s.showEnv = true; },
  meta() {
    return {
      title: '调制：让电磁波把声音带出去',
      desc: '声音信号频率很低，不能直接有效地辐射。把它“装载”到高频载波上，使载波的振幅随音频信号变化，这叫调幅。接收端再把音频信号从已调波中还原出来，就是解调。',
      formula: 'u = (1 + m·sin 2πf<sub>m</sub>t)·sin 2πf<sub>c</sub>t',
      note: '载波频率必须<b>远高于</b>音频频率，天线才能有效辐射。调制度 m 越大，声音越大，但 m 超过 1 会失真。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.ph += dt * 1.2;
      if (s.ph > 100) s.ph -= 100;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const gx0 = -5.6, gx1 = 5.6;

    const wave = (cy, amp, fn, col, label) => {
      line({x: gx0, y: cy}, {x: gx1, y: cy}, 'rgba(198,222,232,.18)', {w: 1});
      const pts = [];
      for (let i = 0; i <= 240; i++) {
        const u = i / 240;
        pts.push({x: gx0 + u * (gx1 - gx0), y: cy + fn(u) * amp});
      }
      path(pts, col, {w: 2, glow: 5});
      sans(label, X(gx0) + 4, Y(cy + amp + .32), col, 10.5, 'left');
    };

    wave(2.05, .62, u => Math.sin(6.2832 * s.fm * u - s.ph * s.fm), 'rgba(255,143,107,.9)', '音频信号（低频）');
    wave(.35, .62, u => Math.sin(6.2832 * s.fc * u - s.ph * s.fc), 'rgba(108,182,255,.9)', '高频载波');
    wave(-1.75, .58, u => (1 + s.m * Math.sin(6.2832 * s.fm * u - s.ph * s.fm)) * Math.sin(6.2832 * s.fc * u - s.ph * s.fc),
      'rgba(123,224,192,.95)', '调幅波（已调信号）');

    if (s.showEnv) {
      const pts2 = [];
      for (let i = 0; i <= 160; i++) {
        const u = i / 160;
        pts2.push({x: gx0 + u * (gx1 - gx0), y: -1.75 + .58 * (1 + s.m * Math.sin(6.2832 * s.fm * u - s.ph * s.fm))});
      }
      path(pts2, 'rgba(255,197,107,.45)', {w: 1.2, dash: [5, 5]});
      const pts3 = pts2.map(q => ({x: q.x, y: -1.75 - (q.y + 1.75)}));
      path(pts3, 'rgba(255,197,107,.45)', {w: 1.2, dash: [5, 5]});
    }

    sans('包络线的起伏就是声音的信息', X(L.x0) + 16, Y(-3.05), 'rgba(180,210,225,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '载波频率', v: f1(s.fc * 100) + ' kHz', hi: true},
      {k: '音频频率', v: f1(s.fm * 100) + ' Hz'},
      {k: '调制度 m', v: f2(s.m), hi: true},
      {k: '信号带宽', v: f1(s.fm * 200) + ' Hz'},
      {k: '调制方式', v: '调幅（AM）'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '音频频率 f_m', .3, 3, .1, s.fm, v => f1(v * 100) + ' Hz', v => s.fm = v);
    addSlider(el, '载波频率 f_c', 6, 16, 1, s.fc, v => f1(v * 100) + ' kHz', v => s.fc = v);
    addSlider(el, '调制度 m', 0, 1, .05, s.m, v => f2(v), v => s.m = v);
    addToggle(el, '显示包络线', s.showEnv, v => s.showEnv = v);
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
