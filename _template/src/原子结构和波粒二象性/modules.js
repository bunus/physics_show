/* ============================================================
   选择性必修第三册 · 第 4 章 原子结构和波粒二象性
   01 α 粒子散射  02 氢原子能级与光谱  03 光电效应
   04 康普顿散射  05 德布罗意波
   ============================================================ */
(function () {

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
const H = 6.63e-34, C = 3.0e8, EV = 1.6e-19, ME = 9.11e-31, E = 1.6e-19;

function f1(v) {
  return (Math.abs(v) < 5e-2 ? 0 : v).toFixed(1);
}
function f2(v) {
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}
function axisBox(x0, x1, y0, y1, xlab, ylab) {
  line({x: x0, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.40)', {w: 1.4});
  line({x: x0, y: y0}, {x: x0, y: y1}, 'rgba(198,222,232,.40)', {w: 1.4});
  arrow({x: x1 - .35, y: y0}, {x: x1, y: y0}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  arrow({x: x0, y: y1 - .35}, {x: x0, y: y1}, 'rgba(198,222,232,.55)', {w: 1.2, head: 9});
  if (xlab) sans(xlab, X(x1) - 2, Y(y0) + 32, 'rgba(170,198,210,.85)', 11.5, 'right');
  if (ylab) sans(ylab, X(x0) - 6, Y(y1) - 8, 'rgba(170,198,210,.85)', 11.5, 'left');
}
function wave(a, b, color, amp, cyc, ph) {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const s = Math.sin((t * cyc + (ph || 0)) * Math.PI * 2) * amp;
    pts.push({x: a.x + dx * t + nx * s, y: a.y + dy * t + ny * s});
  }
  path(pts, color, {w: 1.7});
}
function wlColor(w) {
  let r = 0, g = 0, b = 0;
  if (w < 380) { r = 120; g = 40; b = 200; }
  else if (w < 440) { r = 380 - w; b = 255; }
  else if (w < 490) { g = w - 440; b = 255; }
  else if (w < 510) { g = 255; b = 510 - w; }
  else if (w < 580) { r = w - 510; g = 255; }
  else if (w < 645) { r = 255; g = 645 - w; }
  else if (w < 720) { r = 255; g = 0; b = 0; }
  else { r = 140; g = 20; b = 30; }
  const m = Math.max(r, g, b) || 1;
  const k = 235 / m;
  return 'rgb(' + Math.round(r * k) + ',' + Math.round(g * k) + ',' + Math.round(b * k) + ')';
}

/* ---------- 01 α 粒子散射 ---------- */
MODULES.push({
  key: 'rutherford', tab: '01', name: 'α 粒子散射', en: 'RUTHERFORD', blurb: '少数粒子大角度偏转',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '绝大多数 α 粒子直穿而过，极少数靠近原子核的发生了大角度偏转',
  playable: true,
  state: {t: 0, ph: 0, cap: 16, playing: true, ps: [], n: 0, big: 0, last: 0, showCloud: true, seed: 3},
  reset() {
    const s = this.state;
    s.t = 0; s.ph = 0; s.cap = 16; s.playing = true; s.ps = []; s.n = 0; s.big = 0; s.last = 0; s.showCloud = true; s.seed = 3;
  },
  rnd() {
    const s = this.state;
    s.seed = (s.seed * 16807) % 2147483647;
    if (s.seed <= 0) s.seed += 2147483646;
    return s.seed / 2147483647;
  },
  meta() {
    return {
      title: '绝大多数 α 粒子直穿，极少数被弹回',
      desc: 'α 粒子轰击金箔时，绝大多数几乎沿原方向穿过，只有极少数发生大角度偏转甚至被反弹回来。这说明原子的正电荷和几乎全部质量集中在一个很小的核里，原子内部十分空旷。',
      formula: '核式结构：r<sub>核</sub> ≈ 10<sup>−15</sup> m，r<sub>原子</sub> ≈ 10<sup>−10</sup> m',
      note: '注意粒子数目的对比：<b>大角度偏转的只是极少数</b>。若原子是实心球，所有粒子都会被挡住或明显偏转。'
    };
  },
  makePath(b) {
    const k = 1.8, v0 = 6;
    let x = -7.4, y = b, vx = v0, vy = 0;
    const pts = [{x: x, y: y}];
    for (let i = 0; i < 2200; i++) {
      const r2 = x * x + y * y;
      const r = Math.sqrt(r2);
      const sp = Math.sqrt(vx * vx + vy * vy);
      const h = Math.min(.004, .028 * r / Math.max(.6, sp));
      const ca = k / (r2 * r);
      vx += ca * x * h; vy += ca * y * h;
      x += vx * h; y += vy * h;
      if (i % 5 === 0) pts.push({x: x, y: y});
      if (x > 7.8 || Math.abs(y) > 5.4) break;
      if (i > 40 && x < -7.6) break;
    }
    const th = Math.abs(Math.atan2(vy, vx)) * 180 / Math.PI;
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return {pts: pts, th: th, len: len};
  },
  spawn() {
    const s = this.state;
    let b;
    if (this.rnd() < .22) b = (this.rnd() - .5) * .5;
    else b = (this.rnd() - .5) * 6.6;
    if (Math.abs(b) < .035) b = (b < 0 ? -1 : 1) * (.022 + this.rnd() * .03);
    const p = this.makePath(b);
    s.ps.push({b: b, pts: p.pts, th: p.th, len: p.len, prog: 0});
    s.n++;
    s.last = p.th;
    if (p.th > 90) s.big++;
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      if (s.t > .5) { s.t = 0; this.spawn(); }
      for (let i = s.ps.length - 1; i >= 0; i--) {
        const p = s.ps[i];
        p.prog += dt * 5.5 / Math.max(.6, p.len);
        if (p.prog > 1.1) s.ps.splice(i, 1);
      }
      while (s.ps.length > s.cap) s.ps.shift();
    }
    setFrame(.5, .55, 15);
    base();

    if (s.showCloud) {
      circleAt({x: 0, y: 0}, 2.3, 'rgba(108,182,255,.05)', 'rgba(150,200,235,.18)', {w: 1, dash: [4, 8]});
      sans('原子的电子云（示意）', X(0), Y(-2.55), 'rgba(150,195,225,.45)', 10);
    }
    s.ph += .04;
    const pulse = .5 + .5 * Math.sin(s.ph);
    circleAt({x: 0, y: 0}, .1, 'rgba(255,197,107,.85)', '#ffd79a', {w: 1.6, glow: 12});
    circleAt({x: 0, y: 0}, .28 + .1 * pulse, null, 'rgba(255,197,107,.35)', {w: 1.2});
    sans('金原子核', X(.16), Y(-.42), '#ffd79a', 10.5, 'left');

    for (let i = 0; i < s.ps.length; i++) {
      const p = s.ps[i];
      const n = Math.max(2, Math.floor(p.pts.length * Math.min(1, p.prog)));
      const seg = p.pts.slice(0, n);
      const big = p.th > 90;
      path(seg, big ? 'rgba(255,143,171,.85)' : 'rgba(108,182,255,.5)', {w: big ? 2.2 : 1.5});
      const head = seg[seg.length - 1];
      if (p.prog < 1) dot(head, big ? '#ffd0dc' : '#dbeaff', 3.6);
    }

    arrow({x: -6.7, y: -3.2}, {x: -5.7, y: -3.2}, '#6cb6ff', {w: 2, head: 9});
    sans('α 粒子束', X(-5.5), Y(-3.2), 'rgba(160,205,245,.85)', 10.5, 'left');
    sans('累计入射 ' + s.n + ' 个，大角度偏转 ' + s.big + ' 个',
      X(-6.6), Y(3.5), 'rgba(200,225,238,.9)', 11.5, 'left');
    sans('轨迹中的偏转已放大，实际只有约 1/8000 被弹回',
      X(-6.6), Y(3.0), 'rgba(160,190,205,.65)', 10, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '累计入射粒子', v: s.n + ' 个', hi: true},
      {k: '大角度偏转数', v: s.big + ' 个', hi: true},
      {k: '最近粒子偏转角', v: f1(s.last) + '°'},
      {k: '原子核电荷数', v: '79（金）'},
      {k: '大角度比例', v: s.n ? f2(s.big / s.n * 100) + ' %' : '0 %'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '入射粒子数上限', 4, 16, 1, 16, v => v.toFixed(0), v => s.cap = v);
    addToggle(el, '显示电子云范围', s.showCloud, v => s.showCloud = v);
    addToggle(el, '自动发射粒子', s.playing, v => s.playing = v);
    addBtn(el, '清空并重发', () => { s.ps = []; s.n = 0; s.big = 0; s.t = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 氢原子能级与光谱 ---------- */
MODULES.push({
  key: 'hydrogen', tab: '02', name: '氢原子光谱', en: 'HYDROGEN SPECTRUM', blurb: '跃迁发出光子',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '选择跃迁的两个能级，看放出光子的能量与谱线颜色怎样对应',
  state: {ni: 3, nf: 2, playing: true, t: 0, showSpec: true},
  reset() { const s = this.state; s.ni = 3; s.nf = 2; s.playing = true; s.t = 0; s.showSpec = true; },
  meta() {
    return {
      title: '能级跃迁决定谱线的颜色',
      desc: '氢原子只能处于一系列分立的能级。电子从高能级跃迁到低能级时放出一个光子，光子能量等于两能级之差，因此光谱是一组分立的线，而不是连续的彩带。',
      formula: 'hν = E<sub>n</sub> − E<sub>m</sub>，E<sub>n</sub> = −13.6/n² eV',
      note: '比较 3→2 与 4→2 两条谱线：<b>能级差越大，光子能量越大、波长越短</b>。巴耳末系落在可见光区。'
    };
  },
  En(n) { return -13.6 / (n * n); },
  dE() { return this.En(this.state.ni) - this.En(this.state.nf); },
  wl() { return 1240 / Math.max(.05, this.dE()); },
  gy(e) { return -3.0 + (e + 14) / 14 * 6.2; },
  draw(dt) {
    const s = this.state;
    if (s.playing) { s.t += dt; if (s.t > 2.4) s.t = 0; }
    setFrame(.5, .55, 16);
    base();

    /* --- 左：能级图 --- */
    const x0 = -6.6, x1 = -2.2;
    line({x: x0 - .35, y: this.gy(-14)}, {x: x0 - .35, y: this.gy(0) + .2}, 'rgba(198,222,232,.4)', {w: 1.3});
    for (let n = 1; n <= 5; n++) {
      const y = this.gy(this.En(n));
      const w = 1.4 + .52 * (5 - n);
      line({x: x0, y: y}, {x: x0 + w, y: y}, n === s.nf ? '#ffd79a' : n === s.ni ? '#cbb8ff' : 'rgba(190,215,235,.55)', {w: n === s.ni || n === s.nf ? 3 : 2});
      sans('n=' + n, X(x0 - .3), Y(y), 'rgba(180,205,225,.75)', 10, 'right');
      if (n <= 2) sans(f1(this.En(n)) + ' eV', X(x1 - .05), Y(y), 'rgba(170,198,215,.75)', 9.5, 'right');
    }
    line({x: x0, y: this.gy(0)}, {x: x1, y: this.gy(0)}, 'rgba(200,225,235,.3)', {w: 1, dash: [4, 5]});
    sans('E = 0（电离）', X(x1), Y(this.gy(0)) + 14, 'rgba(170,198,215,.55)', 9.5, 'right');

    const ya = this.gy(this.En(s.ni)), yb = this.gy(this.En(s.nf));
    const mx = (x0 + x1) / 2 + .3;
    arrow({x: mx, y: ya}, {x: mx, y: yb}, '#ffc56b', {w: 2.6, head: 12});
    const ph = (s.t / 2.4) % 1;
    circleAt({x: mx, y: ya + (yb - ya) * ph}, .11, 'rgba(255,236,190,.95)', null);
    segLabel({x: mx - .2, y: ya}, {x: mx - .2, y: yb}, 'ΔE = ' + f2(this.dE()) + ' eV', 'rgba(255,215,154,.95)', .5, 48, 10.5);

    /* --- 右：光谱 --- */
    if (s.showSpec) {
      const sx0 = .3, sx1 = 6.6, sy = 1.0, sh = 1.5;
      sans('可见光谱', X(sx0), Y(sy + sh / 2 + .55), 'rgba(200,225,238,.85)', 11.5, 'left');
      for (let i = 0; i <= 74; i++) {
        const wl = 380 + i * 5;
        const xx = sx0 + (wl - 380) / 370 * (sx1 - sx0);
        line({x: xx, y: sy - sh / 2}, {x: xx, y: sy + sh / 2}, wlColor(wl), {w: 2.2, alpha: .55});
      }
      rect({x: sx0, y: sy - sh / 2}, {x: sx1, y: sy + sh / 2}, null, 'rgba(210,232,240,.35)', {w: 1.2});
      sans('400 nm', X(sx0), Y(sy - sh / 2 - .28), 'rgba(170,198,210,.65)', 9.5);
      sans('700 nm', X(sx1), Y(sy - sh / 2 - .28), 'rgba(170,198,210,.65)', 9.5);

      const wl = this.wl();
      const cx2 = sx0 + clamp((wl - 380) / 370, 0, 1) * (sx1 - sx0);
      if (wl >= 380 && wl <= 750) {
        line({x: cx2, y: sy - sh / 2 - .18}, {x: cx2, y: sy + sh / 2 + .18}, '#ffffff', {w: 2.6, glow: 12});
        sans('λ = ' + f1(wl) + ' nm', X(cx2), Y(sy + sh / 2 + .42), '#ffe3b0', 10.5);
      } else {
        sans('λ = ' + f1(wl) + ' nm（' + (wl < 380 ? '紫外线' : '红外线') + '）',
          X((sx0 + sx1) / 2), Y(sy + sh / 2 + .5), '#cbb8ff', 10.5);
      }
      const bal = [656.3, 486.1, 434.0, 410.2];
      for (let i = 0; i < bal.length; i++) {
        const bx = sx0 + (bal[i] - 380) / 370 * (sx1 - sx0);
        line({x: bx, y: sy - sh / 2}, {x: bx, y: sy + sh / 2}, '#ffffff', {w: 1.6, alpha: .55});
      }
      sans('白色细线：巴耳末系 4 条可见谱线', X((sx0 + sx1) / 2), Y(sy - sh / 2 - .7), 'rgba(180,205,220,.65)', 10);

      const lv = [this.En(3) - this.En(2), this.En(4) - this.En(2), this.En(5) - this.En(2), this.En(6) - this.En(2)];
      sans('能级差 (eV)', X(sx0), Y(-1.5), 'rgba(190,220,235,.85)', 11, 'left');
      for (let i = 0; i < 4; i++) {
        sans((i + 3) + '→2：' + f2(lv[i]) + ' eV → ' + f1(1240 / lv[i]) + ' nm',
          X(sx0), Y(-2.0 - i * .42), 'rgba(170,200,220,.75)', 10, 'left');
      }
    }
    sans('跃迁 ' + s.ni + ' → ' + s.nf, X(x0), Y(3.6), 'rgba(210,230,242,.9)', 12, 'left');
  },
  hud() {
    const dE = this.dE(), wl = this.wl();
    return [
      {k: '跃迁', v: this.state.ni + ' → ' + this.state.nf, hi: true},
      {k: '能量差 ΔE', v: f2(dE) + ' eV', hi: true},
      {k: '光子频率 ν', v: f2(dE * EV / H / 1e14) + '×10¹⁴ Hz'},
      {k: '光子波长 λ', v: f1(wl) + ' nm'},
      {k: '谱线区域', v: wl < 380 ? '紫外线' : wl > 750 ? '红外线' : '可见光'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '初能级 n', 2, 5, 1, s.ni, v => v.toFixed(0), v => { s.ni = v; if (s.nf >= v) s.nf = v - 1; });
    addSlider(el, '末能级 m', 1, 4, 1, s.nf, v => v.toFixed(0), v => { s.nf = Math.min(v, s.ni - 1); });
    addToggle(el, '显示可见光谱', s.showSpec, v => s.showSpec = v);
    addToggle(el, '光子在能级间移动', s.playing, v => s.playing = v);
    addBtn(el, '巴耳末系 3→2', () => { s.ni = 3; s.nf = 2; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 03 光电效应 ---------- */
MODULES.push({
  key: 'photoelectric', tab: '03', name: '光电效应', en: 'PHOTOELECTRIC', blurb: '频率决定能否逸出',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '只有入射光频率超过截止频率，才有光电子逸出；增大光强只增加数目',
  playable: true,
  state: {nu: 8, I: 5, metal: 0, playing: true, t: 0, els: []},
  reset() { const s = this.state; s.nu = 8; s.I = 5; s.metal = 0; s.playing = true; s.t = 0; s.els = []; },
  meta() {
    return {
      title: '频率不够，再强的光也打不出电子',
      desc: '光照射金属表面，电子吸收一个光子的能量后逸出。只有当光子能量 hν 大于逸出功 W 时电子才能逸出，多余的能量变成最大初动能。增大光强只增加光子数目，不改变单个电子的能量。',
      formula: 'E<sub>k</sub> = hν − W，ν<sub>c</sub> = W/h',
      note: '图线的<b>斜率是普朗克常量</b>，横轴截距是截止频率，纵轴截距的绝对值是逸出功，与材料有关。'
    };
  },
  W() { return [2.29, 4.30, 6.35][this.state.metal]; },
  Ek() { return this.state.nu * 0.4136 - this.W(); },
  gx(nu) { return -.9 + nu / 15 * 7.4; },
  gy(e) { return -2.8 + (e + 2) / 8.6 * 5.6; },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.t += dt;
      if (this.Ek() > 0 && s.t > .45) {
        s.t = 0;
        for (let i = 0; i < Math.round(s.I / 2.5); i++) {
          s.els.push({x: -4.5, y: (Math.random() - .5) * 1.2, vx: 1.3 + Math.random() * 1.1, vy: (Math.random() - .5) * .8, a: 1});
        }
      }
      for (let i = s.els.length - 1; i >= 0; i--) {
        const e = s.els[i];
        e.x += e.vx * dt; e.y += e.vy * dt; e.a -= dt * .35;
        if (e.x > -1.3 || e.a <= 0) s.els.splice(i, 1);
      }
    }
    setFrame(.5, .55, 16);
    base();

    /* --- 左：金属板与光束 --- */
    const plate = -4.9;
    rect({x: plate, y: -1.6}, {x: plate + .28, y: 1.6}, 'rgba(200,215,225,.18)', '#c8d8e4', {w: 1.5});
    sans('金属板', X(plate + .14), Y(-1.95), 'rgba(200,220,232,.8)', 10.5);
    for (let i = 0; i < 4; i++) {
      const yy = -1.0 + i * .7;
      wave({x: -7.2, y: yy}, {x: plate - .1, y: yy}, 'rgba(255,197,107,.65)', .09, 3.2, s.t * 2);
    }
    arrow({x: -7.2, y: 1.9}, {x: -5.2, y: 1.9}, '#ffc56b', {w: 2, head: 10});
    sans('入射光 ν = ' + f1(s.nu) + '×10¹⁴ Hz', X(-7.1), Y(2.3), 'rgba(255,215,154,.9)', 11, 'left');

    for (let i = 0; i < s.els.length; i++) {
      const e = s.els[i];
      circleAt({x: e.x, y: e.y}, .09, 'rgba(123,224,192,' + f2(Math.max(0, e.a)) + ')', null);
    }
    if (this.Ek() > 0) sans('光电子', X(-3.4), Y(1.6), 'rgba(150,240,215,.85)', 10.5);
    else sans('无光电子逸出', X(-3.4), Y(1.6), 'rgba(255,143,171,.9)', 10.5);

    /* --- 右：Ek-ν 图 --- */
    axisBox(this.gx(0), this.gx(15), this.gy(-2), this.gy(6.6), 'ν / (10¹⁴ Hz)', 'Eₖ / eV');
    line({x: this.gx(0), y: this.gy(0)}, {x: this.gx(15), y: this.gy(0)}, 'rgba(198,222,232,.40)', {w: 1.2});
    for (let n = 0; n <= 15; n += 3) {
      line({x: this.gx(n), y: this.gy(0) - .07}, {x: this.gx(n), y: this.gy(0) + .07}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(n), X(this.gx(n)), Y(this.gy(0)) + 15, 'rgba(160,190,205,.72)', 9.5);
    }
    for (let e2 = -2; e2 <= 6; e2 += 2) {
      if (e2 === 0) continue;
      line({x: this.gx(0) - .08, y: this.gy(e2)}, {x: this.gx(0), y: this.gy(e2)}, 'rgba(198,222,232,.35)', {w: 1});
      sans(String(e2), X(this.gx(0)) - 7, Y(this.gy(e2)), 'rgba(160,190,205,.72)', 9.5, 'right');
    }
    const W = this.W(), nuc = W / 0.4136;
    const gl = [];
    for (let n = 0; n <= 15; n += .2) gl.push({x: this.gx(n), y: this.gy(n * .4136 - W)});
    path(gl, '#ffc56b', {w: 2.6, glow: 8});
    sans('−W', X(this.gx(0)) + 8, Y(this.gy(-W)) + 12, 'rgba(255,180,200,.8)', 10, 'left');
    dot({x: this.gx(0), y: this.gy(-W)}, '#ffd0dc', 3.6);
    sans('νc = ' + f1(nuc) + '×10¹⁴ Hz', X(this.gx(nuc)) + 10, Y(this.gy(0)) + 34, 'rgba(255,160,185,.9)', 9.5, 'left');
    dot({x: this.gx(nuc), y: this.gy(0)}, '#ffd0dc', 4);
    dot({x: this.gx(s.nu), y: this.gy(Math.max(0, this.Ek()))}, '#fff6e2', 5.4);
    handle({x: this.gx(s.nu), y: this.gy(Math.max(0, this.Ek()))}, '#ffc56b', hoverId === 'nu');
    sans('斜率 = h', X(this.gx(11.6)), Y(this.gy(3.1)), 'rgba(255,215,154,.85)', 10.5, 'left');
  },
  handles() { return [{id: 'nu', x: this.gx(this.state.nu), y: this.gy(Math.max(0, this.Ek()))}]; },
  drag(id, p) {
    const q = clampPt(p);
    this.state.nu = clamp((q.x - this.gx(0)) / (this.gx(1) - this.gx(0)), 1, 15);
  },
  hud() {
    const Ek = this.Ek();
    return [
      {k: '入射频率 ν', v: f1(this.state.nu) + '×10¹⁴ Hz', hi: true},
      {k: '光子能量 hν', v: f2(this.state.nu * .4136) + ' eV'},
      {k: '逸出功 W', v: f2(this.W()) + ' eV'},
      {k: '最大初动能', v: Ek > 0 ? f2(Ek) + ' eV' : '0 eV（不能逸出）', hi: true},
      {k: '遏止电压 Uc', v: f1(Math.max(0, Ek)) + ' V'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '入射光频率 ν / (10¹⁴ Hz)', 1, 15, .1, s.nu, v => f1(v), v => s.nu = v);
    addSlider(el, '光强（相对值）', 1, 10, .5, s.I, v => f1(v), v => s.I = v);
    addSeg(el, ['钠', '锌', '铂'], s.metal, i => { s.metal = i; s.els = []; });
    addToggle(el, '持续发射光电子', s.playing, v => s.playing = v);
    addBtn(el, '频率调到截止频率', () => { s.nu = this.W() / .4136; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 康普顿散射 ---------- */
MODULES.push({
  key: 'compton', tab: '04', name: '康普顿散射', en: 'COMPTON SCATTERING', blurb: '光子撞电子变长',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '改变散射角，看散射光子的波长怎样变长、电子获得多少动能',
  state: {th: 60, lam0: 71, playing: true, t: 0, showVec: true},
  reset() { const s = this.state; s.th = 60; s.lam0 = 71; s.playing = true; s.t = 0; s.showVec = true; },
  meta() {
    return {
      title: '光子与电子碰撞后波长变长',
      desc: 'X 射线光子与静止电子发生碰撞，把一部分能量和动量传给电子，散射后光子能量变小、波长变长。散射角越大，波长增加得越多，这就是康普顿效应，证明光子具有动量。',
      formula: 'Δλ = (h/m<sub>e</sub>c)(1 − cos θ) = 2.43(1 − cos θ) pm',
      note: '波长变化量<b>只与散射角有关</b>，与入射波长无关。θ = 180° 时 Δλ 最大，为 4.86 pm。'
    };
  },
  dlam() { return 2.43 * (1 - Math.cos(this.state.th * Math.PI / 180)); },
  lam1() { return this.state.lam0 + this.dlam(); },
  E0() { return 1239.8 / this.state.lam0; },
  E1() { return 1239.8 / this.lam1(); },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    setFrame(.5, .55, 15);
    base();
    const th = s.th * Math.PI / 180;
    const ox = -1.6, oy = -.1;

    /* --- 入射光子 --- */
    wave({x: -7.4, y: oy}, {x: ox - .35, y: oy}, 'rgba(123,224,192,.85)', .11, 5, s.t * .8);
    arrow({x: -5.4, y: oy + .55}, {x: -4.2, y: oy + .55}, '#7be0c0', {w: 2, head: 9});
    sans('入射光子 λ₀ = ' + f1(s.lam0) + ' pm', X(-7.3), Y(oy + .95), 'rgba(150,240,215,.9)', 11, 'left');

    /* --- 散射光子 --- */
    const ex = ox + Math.cos(th) * 5.6, ey = oy + Math.sin(th) * 5.6;
    wave({x: ox + .4, y: oy}, {x: ex, y: ey}, 'rgba(255,197,107,.9)', .11, 5, s.t * .8);
    arrow({x: ox + 2.6, y: oy + Math.sin(th) * 2.6 + .42}, {x: ox + 3.5, y: oy + Math.sin(th) * 3.5 + .42}, '#ffc56b', {w: 2, head: 9});
    const lx = ox + Math.cos(th) * 3.7, ly = oy + Math.sin(th) * 3.7 + .45;
    sans('散射光子 λ′ = ' + f2(this.lam1()) + ' pm', X(lx), Y(ly), 'rgba(255,215,154,.9)', 10.5,
      Math.cos(th) < .2 ? 'right' : 'left');

    /* --- 电子反冲 --- */
    const phi = Math.atan(1 / ((1 + this.E0() / 511) * Math.tan(th / 2) + 1e-6));
    const eang = -phi;
    const elx = ox + Math.cos(phi) * 3.2, ely = oy - Math.sin(phi) * 3.2;
    arrow({x: ox, y: oy}, {x: elx, y: ely}, '#6cb6ff', {w: 2.6, head: 12});
    sans('反冲电子', X(elx) - 8, Y(ely) - 16, 'rgba(150,200,255,.9)', 10.5, 'right');

    circleAt({x: ox, y: oy}, .16, 'rgba(108,182,255,.35)', '#9ecbff', {w: 1.6});
    dot({x: ox, y: oy}, '#e6f2ff', 2.6);
    angleArc({x: ox, y: oy}, 0, th, 58, 'rgba(255,215,154,.6)', '', 12);
    sans('θ = ' + f1(s.th) + '°', X(ox + .55), Y(oy - .45), '#ffe3b0', 11.5, 'left');
    if (s.showVec) {
      line({x: ox, y: oy}, {x: ox + 2.2, y: oy}, 'rgba(123,224,192,.35)', {w: 1.2, dash: [4, 4]});
      line({x: ox, y: oy}, {x: ox + Math.cos(phi) * 2.0, y: oy - Math.sin(phi) * 2.0}, 'rgba(108,182,255,.35)', {w: 1.2, dash: [4, 4]});
    }

    /* --- 右侧数据 --- */
    const bx = 3.0, by = -.2;
    sans('能量守恒', X(bx), Y(by), 'rgba(200,228,238,.9)', 11.5, 'left');
    sans('hν₀ = ' + f2(this.E0()) + ' keV', X(bx), Y(by - .5), 'rgba(150,240,215,.9)', 10.5, 'left');
    sans("hν′ = " + f2(this.E1()) + ' keV', X(bx), Y(by - .95), 'rgba(255,215,154,.9)', 10.5, 'left');
    sans('Eₖ = ' + f2(this.E0() - this.E1()) + ' keV', X(bx), Y(by - 1.4), 'rgba(150,200,255,.9)', 10.5, 'left');
    line({x: bx, y: by - 1.72}, {x: bx + 4.2, y: by - 1.72}, 'rgba(255,255,255,.10)', {w: 1});
    sans('Δλ = ' + f2(this.dlam()) + ' pm', X(bx), Y(by - 2.05), '#ffe3b0', 11, 'left');
    sans('λc = 2.43 pm（电子康普顿波长）', X(bx), Y(by - 2.5), 'rgba(170,200,215,.7)', 9.5, 'left');
    sans('θ 越大，λ 增加越多', X(bx), Y(by - 2.92), 'rgba(170,200,215,.7)', 9.5, 'left');
  },
  hud() {
    return [
      {k: '入射波长 λ₀', v: f1(this.state.lam0) + ' pm', hi: true},
      {k: '散射角 θ', v: f1(this.state.th) + '°'},
      {k: '波长变化 Δλ', v: f2(this.dlam()) + ' pm', hi: true},
      {k: '散射波长 λ′', v: f2(this.lam1()) + ' pm'},
      {k: '电子动能 Eₖ', v: f2(this.E0() - this.E1()) + ' keV'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '散射角 θ / °', 0, 180, 1, s.th, v => f1(v), v => s.th = v);
    addSlider(el, '入射波长 λ₀ / pm', 40, 120, 1, s.lam0, v => f1(v), v => s.lam0 = v);
    addToggle(el, '显示动量方向辅助线', s.showVec, v => s.showVec = v);
    addToggle(el, '光子波动动画', s.playing, v => s.playing = v);
    addBtn(el, 'θ = 90°', () => { s.th = 90; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 05 德布罗意波 ---------- */
MODULES.push({
  key: 'debroglie', tab: '05', name: '德布罗意波', en: 'DE BROGLIE WAVE', blurb: '电子也能衍射',
  accent: '#9ad0ff', rgb: '154,208,255',
  hint: '提高加速电压，电子动量变大、波长变短，衍射环随之收缩',
  playable: true,
  state: {U: 1000, playing: true, t: 0, showRings: true, showBeam: true},
  reset() { const s = this.state; s.U = 1000; s.playing = true; s.t = 0; s.showRings = true; s.showBeam = true; },
  meta() {
    return {
      title: '电子也有波长：物质波',
      desc: '电子经电场加速后具有确定的动量，德布罗意认为它对应一列波，波长 λ = h/p。加速电压越高，动量越大，波长越短。电子束穿过晶体后出现衍射环，证实了物质波的存在。',
      formula: 'λ = h/p，p = √(2m<sub>e</sub>eU)',
      note: '衍射环半径与波长成正比：<b>电压越高，环越小</b>。宏观物体波长极小，观察不到波动性。'
    };
  },
  p() { return Math.sqrt(2 * ME * E * this.state.U); },
  lam() { return H / this.p(); },
  draw(dt) {
    const s = this.state;
    if (s.playing) s.t += dt;
    setFrame(.5, .55, 15);
    base();
    const lam = this.lam();

    /* --- 电子枪 --- */
    rect({x: -7.2, y: -.75}, {x: -5.6, y: .75}, 'rgba(154,208,255,.10)', 'rgba(170,210,240,.45)', {w: 1.4});
    sans('电子枪', X(-6.4), Y(1.05), 'rgba(200,225,240,.85)', 10.5);
    for (let i = 0; i < 3; i++) {
      const yy = -.4 + i * .4;
      circleAt({x: -7.0 + ((s.t * 1.2 + i * .3) % 1.2), y: yy}, .06, 'rgba(154,208,255,.8)', null);
    }
    line({x: -5.6, y: -.55}, {x: -5.0, y: -.55}, '#ffc56b', {w: 1.6});
    line({x: -5.6, y: .55}, {x: -5.0, y: .55}, '#ffc56b', {w: 1.6});
    sans('U = ' + this.state.U.toFixed(0) + ' V', X(-5.3), Y(-.95), '#ffd79a', 10.5);

    /* --- 电子束 --- */
    wave({x: -4.9, y: 0}, {x: -.4, y: 0}, 'rgba(154,208,255,.75)', .1, 6, s.t * 1.5);
    arrow({x: -4.2, y: .45}, {x: -3.2, y: .45}, '#9ad0ff', {w: 1.8, head: 9});
    sans('电子束', X(-4.1), Y(.8), 'rgba(170,210,245,.8)', 10);

    /* --- 晶体 --- */
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        circleAt({x: -.2 + c * .26, y: -.55 + r * .34}, .07, 'rgba(255,197,107,.55)', null);
      }
    }
    line({x: .55, y: -1.0}, {x: .55, y: 1.0}, 'rgba(255,197,107,.35)', {w: 1, dash: [4, 5]});
    sans('晶体（光栅）', X(-.05), Y(-1.35), 'rgba(255,215,154,.8)', 10);

    /* --- 右侧荧光屏 --- */
    const sx0 = 1.8, sx1 = 7.2, sy0 = -2.8, sy1 = 2.8;
    rect({x: sx0, y: sy0}, {x: sx1, y: sy1}, 'rgba(10,24,38,.75)', 'rgba(170,205,225,.35)', {w: 1.4});
    const cx = (sx0 + sx1) / 2, cy = 0;
    if (s.showRings) {
      const base2 = 46 * (lam * 1e9) / 1;
      for (let k = 1; k <= 3; k++) {
        const r = clamp(base2 * k * .55, .2, 2.7);
        circleAt({x: cx, y: cy}, r, null, 'rgba(154,208,255,' + (0.85 - k * .18).toFixed(2) + ')', {w: 1.8, glow: 6});
      }
      dot({x: cx, y: cy}, 'rgba(230,244,255,.9)', 3);
      sans('衍射环', X(cx), Y(sy0 + .3), 'rgba(180,215,235,.8)', 10);
    } else {
      dot({x: cx, y: cy}, 'rgba(230,244,255,.85)', 3.4);
      sans('只看到亮点（粒子性）', X(cx), Y(sy0 + .3), 'rgba(180,215,235,.7)', 10);
    }
    if (s.showBeam) {
      line({x: .55, y: 0}, {x: sx0, y: 0}, 'rgba(255,255,255,.10)', {w: 1, dash: [5, 6]});
    }

    sans('λ = ' + f1(lam * 1e12) + ' pm', X(-7.2), Y(3.5), 'rgba(210,232,246,.95)', 13, 'left');
    sans('动量 p = ' + f2(this.p() / 1e-23) + '×10⁻²³ kg·m/s', X(-7.2), Y(2.95), 'rgba(180,210,230,.85)', 11, 'left');
    sans('电压升高 → 波长变短 → 环变小', X(-7.2), Y(-2.75), 'rgba(170,200,215,.7)', 10.5, 'left');
    if (!s.showRings) sans('关掉波动图像：电子只落在一个点上',
      X(cx), Y(sy1 + .45), 'rgba(255,170,195,.85)', 10.5);
  },
  hud() {
    const lam = this.lam();
    return [
      {k: '加速电压 U', v: this.state.U.toFixed(0) + ' V', hi: true},
      {k: '动量 p', v: f2(this.p() / 1e-23) + '×10⁻²³ kg·m/s'},
      {k: '德布罗意波长', v: f1(lam * 1e12) + ' pm', hi: true},
      {k: '电子速度', v: f2(this.p() / ME / 1e6) + '×10⁶ m/s'},
      {k: '波长/原子间距', v: f2(lam * 1e9 / .2) + ' 倍'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '加速电压 U / V', 100, 5000, 50, s.U, v => v.toFixed(0), v => s.U = v);
    addToggle(el, '显示衍射环（波动性）', s.showRings, v => s.showRings = v);
    addToggle(el, '显示电子束轨迹', s.showBeam, v => s.showBeam = v);
    addToggle(el, '波动动画', s.playing, v => s.playing = v);
    addBtn(el, '回到 1000 V', () => { s.U = 1000; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
