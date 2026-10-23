/* ============================================================
   选择性必修第二册 · 第 5 章 传感器
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

function meter(x, y, txt, col) {
  circleAt({x: x, y: y}, .38, 'rgba(10,18,30,.95)', col, {w: 1.6});
  sans(txt, X(x), Y(y), col, 12);
}

function source(x, y, label) {
  line({x: x - .2, y: y - .3}, {x: x - .2, y: y + .3}, 'rgba(158,203,255,.95)', {w: 3});
  line({x: x + .1, y: y - .5}, {x: x + .1, y: y + .5}, 'rgba(158,203,255,.95)', {w: 3});
  sans(label, X(x) - .7, Y(y), 'rgba(158,203,255,.85)', 10.5, 'right');
}

/* ---------- 01 热敏电阻 ---------- */
MODULES.push({
  key: 'thermistor', tab: '01', name: '热敏电阻', en: 'THERMISTOR', blurb: '温度变成电压',
  accent: '#ff8fab', rgb: '255,143,171',
  hint: '升高温度，观察热敏电阻的阻值与输出电压怎样变化',
  playable: true,
  state: {T: 25, R0: 10, playing: false, showG: true},
  reset() { const s = this.state; s.T = 25; s.R0 = 10; s.playing = false; s.showG = true; },
  meta() {
    return {
      title: '热敏电阻：把温度变成电信号',
      desc: '负温度系数热敏电阻的阻值随温度升高而明显减小。把它与定值电阻串联接在电源上，温度变化时它两端的电压随之改变，这样就把温度这个非电学量转换成了便于测量的电压。',
      formula: 'R<sub>t</sub> = R<sub>0</sub>e<sup>B(1/T − 1/T<sub>0</sub>)</sup>，U = ER<sub>t</sub>/(R + R<sub>t</sub>)',
      note: '温度升高时<b>阻值减小、分得的电压减小</b>。热敏电阻灵敏度高，常用于温度测量与温控电路。'
    };
  },
  RT(T) {
    return 20 * Math.exp(-(T - 20) / 30);
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.T += dt * 12;
      if (s.T > 100) s.T = 0;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const Rt = this.RT(s.T);
    const U = 5 * Rt / (s.R0 + Rt);

    const x0 = -6.0, x1 = -2.2, yT = 1.3, yB = -1.3;
    line({x: x0, y: yT}, {x: x1, y: yT}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yB}, {x: x1, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yT}, {x: x0, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    source(x0, 0, '5 V');

    rect({x: -4.6, y: yT - .18}, {x: -3.7, y: yT + .18}, 'rgba(15,26,40,.95)', 'rgba(255,197,107,.8)', {w: 1.4});
    sans('R = ' + f1(s.R0) + ' kΩ', X(-4.15), Y(yT + .52), 'rgba(255,215,154,.85)', 10);

    line({x: x1, y: yT}, {x: x1, y: .5}, 'rgba(215,232,242,.8)', {w: 2});
    rect({x: x1 - .28, y: -.5}, {x: x1 + .28, y: .5}, 'rgba(255,143,171,.15)', 'rgba(255,143,171,.9)', {w: 1.6});
    line({x: x1 - .34, y: -.62}, {x: x1 + .34, y: .62}, 'rgba(255,143,171,.9)', {w: 1.6});
    line({x: x1, y: -.5}, {x: x1, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    sans('R t', X(x1) + .55, Y(.1), 'rgba(255,170,200,.95)', 11);
    sans(f1(Rt) + ' kΩ', X(x1) + .55, Y(-.3), 'rgba(255,170,200,.75)', 10);

    meter(x1 + 1.3, 0, 'V', 'rgba(94,234,212,.9)');
    line({x: x1 + .28, y: .6}, {x: x1 + 1.3, y: .38}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    line({x: x1 + .28, y: -.6}, {x: x1 + 1.3, y: -.38}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    sans('U = ' + f2(U) + ' V', X(x1 + 1.3), Y(.6), 'rgba(126,236,214,.95)', 12);

    const gx0 = .4, gx1 = 6.2, gy0 = -2.4, gy1 = 2.4;
    if (s.showG) {
      axisBox(gx0, gx1, gy0, gy1, 'T / °C', 'R / kΩ');
      const pts = [];
      for (let i = 0; i <= 100; i++) {
        const T = i;
        pts.push({x: gx0 + (T / 100) * (gx1 - gx0), y: gy0 + (Math.min(40, this.RT(T)) / 40) * (gy1 - gy0)});
      }
      path(pts, 'rgba(255,143,171,.9)', {w: 2.4, glow: 6});
      for (let T = 0; T <= 100; T += 20) {
        const xx = gx0 + (T / 100) * (gx1 - gx0);
        line({x: xx, y: gy0}, {x: xx, y: gy0 - .08}, 'rgba(198,222,232,.4)', {w: 1});
        sans(String(T), X(xx), Y(gy0) + 14, 'rgba(160,190,205,.7)', 9.5);
      }
      const nx = gx0 + (s.T / 100) * (gx1 - gx0);
      const ny = gy0 + (Math.min(40, Rt) / 40) * (gy1 - gy0);
      dot({x: nx, y: ny}, '#fff0f4', 5);
      line({x: nx, y: gy0}, {x: nx, y: ny}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      line({x: gx0, y: ny}, {x: nx, y: ny}, 'rgba(255,255,255,.2)', {w: 1, dash: [4, 4]});
      sans('R-t 曲线（负温度系数）', X(gx0) + 6, Y(gy1) - .2, 'rgba(255,170,200,.85)', 10.5, 'left');
    }

    sans('温度升高 → 阻值减小 → 输出电压减小', X(L.x0) + 16, Y(-2.95), 'rgba(180,210,225,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const Rt = this.RT(s.T);
    return [
      {k: '温度 T', v: f1(s.T) + ' °C', hi: true},
      {k: '热敏电阻 R t', v: f1(Rt) + ' kΩ'},
      {k: '定值电阻 R', v: f1(s.R0) + ' kΩ'},
      {k: '输出电压 U', v: f2(5 * Rt / (s.R0 + Rt)) + ' V', hi: true},
      {k: '电路电流 I', v: f2(5 / (s.R0 + Rt)) + ' mA'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '温度 T / °C', 0, 100, 1, s.T, v => f1(v), v => s.T = v);
    addSlider(el, '定值电阻 R / kΩ', 5, 20, 1, s.R0, v => f1(v), v => s.R0 = v);
    addToggle(el, '自动升温', s.playing, v => s.playing = v);
    addToggle(el, '显示 R-t 曲线', s.showG, v => s.showG = v);
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 02 光敏电阻 ---------- */
MODULES.push({
  key: 'ldr', tab: '02', name: '光敏电阻', en: 'PHOTORESISTOR', blurb: '光照强弱变电阻',
  accent: '#ffc56b', rgb: '255,197,107',
  hint: '改变光照强度，观察光敏电阻的阻值与输出电压',
  state: {E: 300, R0: 10, showG: true},
  reset() { const s = this.state; s.E = 300; s.R0 = 10; s.showG = true; },
  meta() {
    return {
      title: '光敏电阻：把光照变成电信号',
      desc: '光敏电阻受到光照时，内部载流子增多，阻值明显减小；光照越强，阻值越小。把它接入分压电路，输出电压就随光照强弱而改变，可用于路灯自动开关、照度计等装置。',
      formula: '光照增强 → R 减小 → U = ER/(R<sub>0</sub> + R) 减小',
      note: '光敏电阻的阻值对光<b>很敏感但并非线性</b>，通常只用来判断“有光/无光”或分档控制，而不是精确测光。'
    };
  },
  RE(E) {
    return 4 + 180 / (1 + E / 40);
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const R = this.RE(s.E);
    const U = 5 * R / (s.R0 + R);

    const x0 = -6.0, x1 = -2.0, yT = 1.3, yB = -1.3;
    line({x: x0, y: yT}, {x: x1, y: yT}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yB}, {x: x1, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yT}, {x: x0, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    source(x0, 0, '5 V');

    rect({x: -4.7, y: yT - .18}, {x: -3.8, y: yT + .18}, 'rgba(15,26,40,.95)', 'rgba(255,197,107,.8)', {w: 1.4});
    sans('R = ' + f1(s.R0) + ' kΩ', X(-4.25), Y(yT + .52), 'rgba(255,215,154,.85)', 10);

    line({x: x1, y: yT}, {x: x1, y: .55}, 'rgba(215,232,242,.8)', {w: 2});
    circleAt({x: x1, y: 0}, .5, 'rgba(255,197,107,' + (0.1 + Math.min(1, s.E / 600) * .55).toFixed(2) + ')',
      'rgba(255,197,107,.9)', {w: 1.6});
    line({x: x1 - .22, y: .28}, {x: x1 + .22, y: -.28}, 'rgba(255,197,107,.8)', {w: 1.4});
    line({x: x1 - .22, y: -.28}, {x: x1 + .22, y: .28}, 'rgba(255,197,107,.8)', {w: 1.4});
    line({x: x1, y: -.5}, {x: x1, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    sans('R 光', X(x1) + .75, Y(.15), 'rgba(255,215,154,.95)', 11);
    sans(f1(R) + ' kΩ', X(x1) + .75, Y(-.28), 'rgba(255,215,154,.75)', 10);

    const lampX = x1 - 1.5, lampY = 2.0;
    circleAt({x: lampX, y: lampY}, .3, 'rgba(255,240,180,' + (0.15 + Math.min(1, s.E / 600) * .7).toFixed(2) + ')', 'rgba(255,220,150,.9)', {w: 1.4});
    for (let k = 0; k < 5; k++) {
      const a = -1.2 + k * .45;
      arrow({x: lampX + Math.cos(a) * .45, y: lampY + Math.sin(a) * .45},
        {x: lampX + Math.cos(a) * 1.0, y: lampY + Math.sin(a) * 1.0},
        'rgba(255,226,150,' + (0.25 + Math.min(1, s.E / 600) * .5).toFixed(2) + ')', {w: 1.4, head: 8});
    }
    sans('光照 ' + Math.round(s.E) + ' lx', X(lampX), Y(2.55), 'rgba(255,226,150,.85)', 10.5);

    meter(x1 + 1.55, 0, 'V', 'rgba(94,234,212,.9)');
    line({x: x1 + .5, y: .45}, {x: x1 + 1.55, y: .3}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    line({x: x1 + .5, y: -.45}, {x: x1 + 1.55, y: -.3}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    sans('U = ' + f2(U) + ' V', X(x1 + 1.55), Y(.6), 'rgba(126,236,214,.95)', 12);

    if (s.showG) {
      const gx0 = 2.9, gx1 = 6.3, gy0 = -2.4, gy1 = 2.0;
      axisBox(gx0, gx1, gy0, gy1, 'E / lx', 'R / kΩ');
      const pts = [];
      for (let i = 0; i <= 100; i++) {
        const E = i / 100 * 800;
        pts.push({x: gx0 + i / 100 * (gx1 - gx0), y: gy0 + (Math.min(190, this.RE(E)) / 190) * (gy1 - gy0)});
      }
      path(pts, 'rgba(255,197,107,.9)', {w: 2.2, glow: 5});
      const nx = gx0 + (s.E / 800) * (gx1 - gx0);
      const ny = gy0 + (Math.min(190, R) / 190) * (gy1 - gy0);
      dot({x: nx, y: ny}, '#fff6e2', 4.6);
      line({x: nx, y: gy0}, {x: nx, y: ny}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
      sans('R-E 曲线', X(gx0) + 6, Y(gy1) - .18, 'rgba(255,215,154,.8)', 10, 'left');
    }

    sans('光照越强，阻值越小，输出电压越低', X(L.x0) + 16, Y(-2.95), 'rgba(180,210,225,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const R = this.RE(s.E);
    return [
      {k: '光照强度 E', v: Math.round(s.E) + ' lx', hi: true},
      {k: '光敏电阻 R', v: f1(R) + ' kΩ'},
      {k: '定值电阻 R₀', v: f1(s.R0) + ' kΩ'},
      {k: '输出电压 U', v: f2(5 * R / (s.R0 + R)) + ' V', hi: true},
      {k: '相对亮度', v: f1(Math.min(100, s.E / 6)) + ' %'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '光照强度 E / lx', 0, 800, 10, s.E, v => String(Math.round(v)), v => s.E = v);
    addSlider(el, '定值电阻 R₀ / kΩ', 5, 20, 1, s.R0, v => f1(v), v => s.R0 = v);
    addToggle(el, '遮住光线', s.E < 5, v => { s.E = v ? 0 : 300; });
    addToggle(el, '显示 R-E 曲线', s.showG, v => s.showG = v);
    addBtn(el, '恢复光照 300 lx', () => { s.E = 300; }, 'ghost');
  }
});

/* ---------- 03 霍尔元件 ---------- */
MODULES.push({
  key: 'hall', tab: '03', name: '霍尔元件', en: 'HALL ELEMENT', blurb: '磁场变成电压',
  accent: '#6cb6ff', rgb: '108,182,255',
  hint: '改变电流与磁感应强度，观察霍尔电压的变化与极性',
  playable: true,
  state: {I: 10, B: .5, ph: 0, playing: true, elec: false},
  reset() { const s = this.state; s.I = 10; s.B = .5; s.ph = 0; s.playing = true; s.elec = false; },
  meta() {
    return {
      title: '霍尔元件：用磁场控制电压',
      desc: '电流通过处在磁场中的半导体薄片时，载流子受洛伦兹力向一侧偏转，在薄片两侧积累电荷形成横向电场，直到电场力与洛伦兹力平衡为止。此时两侧的电压叫霍尔电压。',
      formula: 'U<sub>H</sub> = kIB/d（k 为霍尔系数）',
      note: '霍尔电压与<b>电流和磁感应强度都成正比</b>。用电子导电时载流子带负电，两侧极性相反，这是判断半导体载流子类型的依据。'
    };
  },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.ph += dt * 1.4;
      if (s.ph > 1) s.ph -= 1;
    }
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const UH = 2.5 * s.I * s.B * (s.elec ? -1 : 1);

    rect({x: -3.8, y: -.8}, {x: 3.8, y: .8}, 'rgba(108,182,255,.09)', 'rgba(150,200,240,.7)', {w: 1.8});
    for (let x = -3.2; x <= 3.3; x += .8) {
      for (let y = -.45; y <= .5; y += .45) {
        line({x: x - .07, y: y - .07}, {x: x + .07, y: y + .07}, 'rgba(140,160,255,.32)', {w: 1.2});
        line({x: x - .07, y: y + .07}, {x: x + .07, y: y - .07}, 'rgba(140,160,255,.32)', {w: 1.2});
      }
    }
    sans('B 垂直纸面向里', X(0), Y(1.35), 'rgba(150,170,245,.75)', 10.5);

    arrow({x: -3.4, y: -.95}, {x: 3.4, y: -.95}, '#5eead4', {w: 2.4, head: 12});
    sans('I = ' + f1(s.I) + ' mA', X(0), Y(-1.35), 'rgba(126,236,214,.9)', 11);

    for (let k = 0; k < 7; k++) {
      const u = (s.ph + k / 7) % 1;
      const px = -3.6 + u * 7.2;
      const defl = (s.elec ? -1 : 1) * .45 * u;
      const py = -.15 + defl;
      dot({x: px, y: Math.max(-.62, Math.min(.62, py))}, s.elec ? '#8fe0ff' : '#ff9ec4', 4);
    }

    const topSign = UH > 0 ? '+' : '−';
    const botSign = UH > 0 ? '−' : '+';
    for (let k = 0; k < 5; k++) {
      sans(topSign, X(-2.8 + k * 1.4), Y(.95), UH > 0 ? '#ff9ec4' : '#8fe0ff', 12);
      sans(botSign, X(-2.8 + k * 1.4), Y(-.62), UH > 0 ? '#8fe0ff' : '#ff9ec4', 12);
    }

    line({x: 3.8, y: .55}, {x: 5.2, y: .55}, 'rgba(215,232,242,.7)', {w: 1.6});
    line({x: 3.8, y: -.55}, {x: 5.2, y: -.55}, 'rgba(215,232,242,.7)', {w: 1.6});
    meter(5.2, 0, 'V', 'rgba(255,197,107,.95)');
    sans('U_H = ' + f2(Math.abs(UH)) + ' mV', X(5.2), Y(.95), 'rgba(255,215,154,.95)', 12);

    sans('载流子受洛伦兹力向' + (s.elec ? '下' : '上') + '偏转，两侧出现电势差',
      X(L.x0) + 16, Y(-2.4), 'rgba(180,210,225,.7)', 10.5, 'left');
    sans(s.elec ? '电子导电：上极板为低电势' : '空穴（正电荷）导电：上极板为高电势',
      X(L.x0) + 16, Y(-2.95), 'rgba(175,205,215,.6)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    const UH = 2.5 * s.I * s.B;
    return [
      {k: '控制电流 I', v: f1(s.I) + ' mA', hi: true},
      {k: '磁感应强度 B', v: f2(s.B) + ' T'},
      {k: '霍尔电压 U_H', v: f2(UH) + ' mV', hi: true},
      {k: '载流子', v: s.elec ? '电子（负）' : '空穴（正）'},
      {k: '上极板极性', v: s.elec ? '低电势' : '高电势'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '控制电流 I / mA', 2, 20, 1, s.I, v => f1(v), v => s.I = v);
    addSlider(el, '磁感应强度 B / T', .1, 1, .05, s.B, v => f2(v), v => s.B = v);
    addToggle(el, '改用电子导电', s.elec, v => s.elec = v);
    addToggle(el, '载流子运动', s.playing, v => s.playing = v);
    addBtn(el, '复位', () => { s.ph = 0; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ---------- 04 传感器电路：分压与限流 ---------- */
MODULES.push({
  key: 'divider', tab: '04', name: '分压与限流', en: 'CIRCUIT MODE', blurb: '两种接法比一比',
  accent: '#b49cff', rgb: '180,156,255',
  hint: '切换两种接法，比较输出电压随传感器阻值变化的范围',
  state: {mode: 0, Rs: 10, R0: 10, U: 5, showG: true},
  reset() { const s = this.state; s.mode = 0; s.Rs = 10; s.R0 = 10; s.U = 5; s.showG = true; },
  meta() {
    return {
      title: '分压式与限流式：输出电压怎么取',
      desc: '传感器与定值电阻串联接在电源上，电流相同、电压按电阻分配。把输出端接在传感器两端（分压式）或接在定值电阻两端（限流式），输出电压随传感器阻值变化的范围和方向都不一样。',
      formula: '分压：U<sub>出</sub> = U·R<sub>s</sub>/(R<sub>0</sub>+R<sub>s</sub>)；限流：U<sub>出</sub> = U·R<sub>0</sub>/(R<sub>0</sub>+R<sub>s</sub>)',
      note: '分压式可以把电压从接近 0 连续调到接近电源电压，<b>调节范围大</b>；限流式接线简单，但范围小。'
    };
  },
  out(Rs) {
    const s = this.state;
    return s.mode === 0 ? s.U * Rs / (s.R0 + Rs) : s.U * s.R0 / (s.R0 + Rs);
  },
  draw() {
    const s = this.state;
    setFrame(.5, .55, 15);
    base();
    const L = lim();
    const Uo = this.out(s.Rs);

    const x0 = -5.9, xL = -3.6, xR = -1.4, yT = 1.4, yB = -1.4;
    line({x: x0, y: yT}, {x: xR, y: yT}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yB}, {x: xR, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yT}, {x: x0, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xL, y: yT}, {x: xL, y: .4}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xL, y: -.4}, {x: xL, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xR, y: yT}, {x: xR, y: .4}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: xR, y: -.4}, {x: xR, y: yB}, 'rgba(215,232,242,.8)', {w: 2});

    rect({x: xL - .32, y: -.4}, {x: xL + .32, y: .4}, 'rgba(15,26,40,.95)', 'rgba(255,197,107,.85)', {w: 1.5});
    sans(s.mode === 0 ? 'R t' : 'R₀', X(xL), Y(0), 'rgba(255,215,154,.95)', 10.5);
    rect({x: xR - .32, y: -.4}, {x: xR + .32, y: .4}, 'rgba(15,26,40,.95)', 'rgba(180,156,255,.85)', {w: 1.5});
    sans(s.mode === 0 ? 'R₀' : 'R t', X(xR), Y(0), 'rgba(196,178,255,.95)', 10.5);

    source(x0, 0, f1(s.U) + ' V');

    const tapY = s.mode === 0 ? 1.05 : -.95;
    meter(xR + 1.2, tapY, 'V', 'rgba(94,234,212,.9)');
    line({x: xR + .32, y: s.mode === 0 ? .3 : -.3}, {x: xR + 1.2, y: tapY - .3},
      'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    line({x: xR, y: s.mode === 0 ? yB : yT}, {x: xR + 1.2, y: tapY + (s.mode === 0 ? -.3 : .3)},
      'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    sans('U出 = ' + f2(Uo) + ' V', X(xR + 1.2), Y(tapY + .62), 'rgba(126,236,214,.95)', 12);
    sans(s.mode === 0 ? '输出取自传感器' : '输出取自定值电阻', X(xR + .1), Y(-1.85),
      'rgba(190,215,230,.75)', 10.5, 'left');

    if (!s.showG) { sans('分压与限流：两种取电压的方式', X(L.x0) + 16, Y(-2.95), 'rgba(180,210,225,.7)', 10.5, 'left'); return; }
    const gx0 = 1.4, gx1 = 6.2, gy0 = -2.0, gy1 = 2.4;
    axisBox(gx0, gx1, gy0, gy1, 'R t / kΩ', 'U 出 / V');
    const mapX = R => gx0 + (R / 50) * (gx1 - gx0);
    const mapY = v => gy0 + (v / s.U) * (gy1 - gy0);
    const p0 = [], p1 = [];
    for (let i = 0; i <= 100; i++) {
      const R = .5 + i / 100 * 49.5;
      p0.push({x: mapX(R), y: mapY(s.U * R / (s.R0 + R))});
      p1.push({x: mapX(R), y: mapY(s.U * s.R0 / (s.R0 + R))});
    }
    path(p0, s.mode === 0 ? 'rgba(255,143,171,.95)' : 'rgba(255,143,171,.3)', {w: 2.4, glow: s.mode === 0 ? 6 : 0});
    path(p1, s.mode === 1 ? 'rgba(180,156,255,.95)' : 'rgba(180,156,255,.3)', {w: 2.4, glow: s.mode === 1 ? 6 : 0});
    sans('分压式', X(gx1) - 6, Y(gy1) - .2, 'rgba(255,170,200,.8)', 10, 'right');
    sans('限流式', X(gx1) - 6, Y(gy1) - .62, 'rgba(196,178,255,.8)', 10, 'right');

    const nx = mapX(s.Rs), ny = mapY(Uo);
    dot({x: nx, y: ny}, '#ffffff', 4.6);
    line({x: nx, y: gy0}, {x: nx, y: ny}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});
    line({x: gx0, y: ny}, {x: nx, y: ny}, 'rgba(255,255,255,.18)', {w: 1, dash: [4, 4]});

    sans(s.mode === 0 ? '分压式：调节范围大' : '限流式：范围小但接线简单',
      X(L.x0) + 16, Y(-2.95), 'rgba(180,210,225,.7)', 10.5, 'left');
  },
  hud() {
    const s = this.state;
    return [
      {k: '接法', v: s.mode === 0 ? '分压式' : '限流式', hi: true},
      {k: '传感器阻值 R t', v: f1(s.Rs) + ' kΩ'},
      {k: '定值电阻 R₀', v: f1(s.R0) + ' kΩ'},
      {k: '输出电压 U出', v: f2(this.out(s.Rs)) + ' V', hi: true},
      {k: '电路电流', v: f2(s.U / (s.R0 + s.Rs)) + ' mA'}
    ];
  },
  panel(el) {
    const s = this.state;
    addSeg(el, ['分压式', '限流式'], s.mode, i => s.mode = i);
    addSlider(el, '传感器阻值 R t / kΩ', .5, 50, .5, s.Rs, v => f1(v), v => s.Rs = v);
    addSlider(el, '定值电阻 R₀ / kΩ', 5, 30, 1, s.R0, v => f1(v), v => s.R0 = v);
    addToggle(el, '显示输出曲线', s.showG, v => s.showG = v);
  }
});

/* ---------- 05 自动控制 ---------- */
MODULES.push({
  key: 'control', tab: '05', name: '自动控制', en: 'AUTO CONTROL', blurb: '温度高了就报警',
  accent: '#7be0c0', rgb: '123,224,192',
  hint: '调节设定温度，观察温度超过阈值时继电器如何接通风扇',
  playable: true,
  state: {T: 25, Tset: 60, playing: true, fan: 0, on: false, showBar: true},
  reset() { const s = this.state; s.T = 25; s.Tset = 60; s.playing = true; s.fan = 0; s.on = false; s.showBar = true; },
  meta() {
    return {
      title: '自动控制：传感器 + 继电器',
      desc: '热敏电阻把温度转换成电压，与设定值比较后由控制电路驱动继电器。温度超过设定值时继电器吸合，风扇（或报警器）通电工作；温度降下来后又自动断开，实现无人值守的控制。',
      formula: 'U<sub>t</sub> = ER<sub>t</sub>/(R<sub>0</sub>+R<sub>t</sub>)，U<sub>t</sub> < U<sub>设定</sub> 时继电器吸合',
      note: '传感器只负责<b>“感知”</b>，继电器负责“执行”。设定温度不同，对应的比较电压也不同，这就是温控器的旋钮在改变的东西。'
    };
  },
  RT(T) { return 20 * Math.exp(-(T - 20) / 30); },
  draw(dt) {
    const s = this.state;
    if (s.playing) {
      s.T += dt * 9;
      if (s.T > 105) s.T = 20;
    }
    const Rt = this.RT(s.T);
    const Ut = 5 * Rt / (10 + Rt);
    s.on = s.T > s.Tset;
    if (s.on) s.fan += dt * 9;

    setFrame(.5, .55, 15);
    base();
    const L = lim();

    const x0 = -6.1, x1 = -3.0, yT = 1.5, yB = -1.5;
    line({x: x0, y: yT}, {x: x1, y: yT}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yB}, {x: x1, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    line({x: x0, y: yT}, {x: x0, y: yB}, 'rgba(215,232,242,.8)', {w: 2});
    source(x0, 0, '5 V');

    line({x: -4.7, y: yT}, {x: -4.7, y: .42}, 'rgba(215,232,242,.8)', {w: 2});
    rect({x: -5.0, y: -.42}, {x: -4.4, y: .42}, 'rgba(255,143,171,.16)', 'rgba(255,143,171,.9)', {w: 1.5});
    line({x: -5.06, y: -.55}, {x: -4.34, y: .55}, 'rgba(255,143,171,.85)', {w: 1.5});
    sans('R t', X(-5.55), Y(0), 'rgba(255,170,200,.9)', 10.5);
    sans('温度传感器', X(-4.7), Y(-.85), 'rgba(255,170,200,.7)', 10);

    rect({x: -2.9, y: -.7}, {x: -1.5, y: .7}, 'rgba(15,26,40,.95)', 'rgba(180,156,255,.8)', {w: 1.5});
    sans('控制电路', X(-2.2), Y(.22), 'rgba(196,178,255,.95)', 10.5);
    sans('比较 U t 与 U 设', X(-2.2), Y(-.22), 'rgba(180,200,230,.7)', 8.5);
    arrow({x: x1, y: yT}, {x: -2.95, y: yT}, 'rgba(215,232,242,.8)', {w: 2, head: 9});
    arrow({x: x1, y: yB}, {x: -2.95, y: yB}, 'rgba(215,232,242,.8)', {w: 2, head: 9});

    const swX = -1.1;
    line({x: -1.5, y: 0}, {x: swX, y: 0}, 'rgba(215,232,242,.8)', {w: 2});
    const bladeEnd = s.on ? {x: swX + .55, y: .05} : {x: swX + .58, y: .55};
    line({x: swX, y: 0}, {x: bladeEnd.x, y: bladeEnd.y}, s.on ? '#7be0c0' : '#ff8fab', {w: 2.6});
    dot({x: swX, y: 0}, '#dbe9f2', 3.2);
    dot({x: swX + .6, y: 0}, '#dbe9f2', 3.2);
    line({x: swX + .6, y: 0}, {x: 1.6, y: 0}, 'rgba(215,232,242,.8)', {w: 2});

    const fx = 2.9, fy = 0;
    circleAt({x: fx, y: fy}, .9, 'rgba(123,224,192,' + (s.on ? .14 : .04) + ')', 'rgba(150,200,225,.5)', {w: 1.4});
    for (let k = 0; k < 4; k++) {
      const a = s.fan + k * Math.PI / 2;
      line({x: fx, y: fy}, {x: fx + Math.cos(a) * .8, y: fy + Math.sin(a) * .8},
        s.on ? 'rgba(123,224,192,.9)' : 'rgba(150,175,195,.45)', {w: 3});
    }
    dot({x: fx, y: fy}, s.on ? '#eafff8' : '#9fb3c4', 5);
    sans('风扇', X(fx), Y(-1.25), s.on ? 'rgba(126,236,214,.9)' : 'rgba(170,195,210,.6)', 10.5);
    if (s.on) {
      for (let k = 0; k < 3; k++) {
        path([{x: fx + 1.0, y: -.35 + k * .35}, {x: fx + 1.5, y: -.5 + k * .35}, {x: fx + 2.0, y: -.35 + k * .35}],
          'rgba(123,224,192,.5)', {w: 1.6});
      }
    }

    if (s.showBar) {
      const mx = -5.8, my = -2.9, mw = 11.0;
      sans('当前温度 ' + f1(s.T) + ' °C', X(mx), Y(my + .55), 'rgba(255,215,154,.9)', 10.5, 'left');
      rect({x: mx, y: my}, {x: mx + mw, y: my + .32}, 'rgba(255,255,255,.06)', 'rgba(200,220,235,.2)', {w: 1});
      rect({x: mx, y: my}, {x: mx + mw * (s.T / 105), y: my + .32}, s.on ? '#ff8fab' : '#5eead4', null);
      const tx = mx + mw * (s.Tset / 105);
      line({x: tx, y: my - .1}, {x: tx, y: my + .42}, '#ffc56b', {w: 2, dash: [4, 3]});
      sans('设定 ' + Math.round(s.Tset) + ' °C', X(tx), Y(my + .72), 'rgba(255,215,154,.95)', 10);
    }

    sans(s.on ? '温度超过设定值：继电器吸合，风扇启动' : '温度低于设定值：继电器断开，风扇停止',
      X(L.x0) + 16, Y(2.9), s.on ? 'rgba(255,170,200,.9)' : 'rgba(126,236,214,.85)', 11, 'left');
    sans('U t = ' + f2(Ut) + ' V', X(L.x1) - 16, Y(2.3), 'rgba(190,215,230,.75)', 10.5, 'right');
  },
  hud() {
    const s = this.state;
    const Rt = this.RT(s.T);
    return [
      {k: '当前温度', v: f1(s.T) + ' °C', hi: true},
      {k: '设定温度', v: Math.round(s.Tset) + ' °C'},
      {k: '热敏电阻', v: f1(Rt) + ' kΩ'},
      {k: '传感器电压 U t', v: f2(5 * Rt / (10 + Rt)) + ' V'},
      {k: '执行机构', v: s.on ? '风扇运转' : '停止', hi: true}
    ];
  },
  panel(el) {
    const s = this.state;
    addSlider(el, '设定温度 / °C', 40, 90, 1, s.Tset, v => String(Math.round(v)), v => s.Tset = v);
    addToggle(el, '自动升温', s.playing, v => s.playing = v);
    addToggle(el, '显示温度刻度条', s.showBar, v => s.showBar = v);
    addBtn(el, '重新从 20 °C 开始', () => { s.T = 20; }, 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

})();
