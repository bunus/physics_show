# 章节页开发指南（物理）

每个章节交付目录 `<章>/` 只保留三个文件：`index.html`、`README.md`、`preview.png`。

构建源文件统一放在 `_template/src/<章>/`：

- `meta.json`：页面标题与文案槽位；
- `modules.js`：本章 5 个交互情境（数组 push）。

构建脚本把 `_template/template.html`（布局、CSS、Canvas 引擎）与源文件合并成单文件 `<章>/index.html`。
**不要改 template.html，不要手写 index.html，不要改 build.py / portal.py。**

## meta.json

```json
{
  "h1": "运动的描述",
  "titleEn": "MOTION",
  "eyebrowEn": "Motion Lab",
  "eyebrowCn": "必修第一册 · 第 1 章",
  "catalogHint": "从参考系到加速度",
  "catalogSub": "五个情境 · 点击切换",
  "metaDesc": "运动的描述：参考系、位移与路程、速度、加速度的动态演示。"
}
```

`eyebrowCn` 写「册名 · 第 N 章」，`catalogHint` 不超过 10 字，`catalogSub` 固定「五个情境 · 点击切换」。

## modules.js 骨架

```js
/* ============================================================
   必修第一册 · 第 1 章 运动的描述
   ============================================================ */
(function () {

const SUB = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];

function f2(v) {                       // 数值格式化：去掉多余 0，负号用 −
  const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(2);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

MODULES.push({
  key: 'frame',            // 英文标识，本章内唯一
  tab: '01',               // 01..05
  name: '参考系',           // 左栏短名，≤ 6 字
  en: 'REFERENCE FRAME',   // 英文小字，大写
  blurb: '选谁做参照',      // 底部图鉴副标题，≤ 10 字
  accent: '#5eead4',       // 情境主题色
  rgb: '94,234,212',       // 上面的 RGB
  hint: '拖动小车，切换参考系',   // 画布左上提示
  playable: true,          // 需要播放/暂停时写
  state: {t: 0, playing: false, v: 2},
  reset() { this.state.t = 0; this.state.playing = false; this.state.v = 2; },
  anim(dt) { /* 可选：每帧推进物理量；draw 内部也可直接算 */ },
  meta() {
    return {
      title: '情境标题',
      desc: '60–120 字说明，可用 <b>…</b>。',
      formula: 'v = Δx/Δt',        // 可含 <br>、<sub>、<sup>
      note: '观察提示，可用 <i>…</i>。'
    };
  },
  handles() { return [{id: 'car', x: this.state.x, y: 0}]; },  // 可省略
  drag(id, p) { const q = clampPt(p); this.state.x = q.x; },   // 可省略
  draw(dt) {
    setFrame(.5, .55, 12);
    base();
    // ... 绘图
  },
  hud() { return [{k: '速度 v', v: '2.0 m/s', hi: true}]; },    // 3–6 项
  panel(el) {
    addSlider(el, '速度 v / (m/s)', 0, 6, .1, this.state.v, v => v.toFixed(1), v => this.state.v = v);
    addToggle(el, '显示速度矢量', true, v => this.state.showV = v);
    addBtn(el, '▶ 播放', () => this.togglePlay(), 'ghost');
  },
  togglePlay() { this.state.playing = !this.state.playing; },
  playLabel() { return this.state.playing ? '⏸ 暂停' : '▶ 播放'; }
});

/* ... 02 ~ 05 ... */

})();
```

## 必备约定

1. **恰好 5 个情境**，`tab` 依次 `'01'`–`'05'`，`key` 不重复，颜色尽量分散。
2. 每个情境都必须写 `reset()`、`meta()`、`draw(dt)`、`hud()`、`panel(el)`。
3. `panel(el)` 至少放 1 个滑块或分段按钮 + 1 个开关，让课堂能动手。
4. `hud()` 返回 3–6 条实时数据，**必须带单位**（m、s、m/s、N、J、V、A…）。
5. 需要动画的情境：`state.playing` + `togglePlay()` + `playable: true`；在 `draw(dt)` 里按 `dt` 推进（`this.state.t += dt`），**不要用 setInterval**。
6. 中文文案面向成都高中课堂：先现象、再规律、后公式；`note` 给出一句「看什么、为什么」。
7. 数值精度：长度 1 位小数、角度 1 位、比例 2 位；`fmt()` 已把负号换成 `−`。
8. 只用 Canvas 与系统字体，**禁止外链图片、字体、CDN、第三方库**。
9. 不要使用 `document` 全局选择器、不要写 `<script>`、不要操作 `#cv`；只通过引擎函数绘图。
10. 字符串统一用单引号；不要用反引号模板串（构建脚本会原样内联，避免与占位符冲突）。

## 坐标与绘图 API

世界坐标 → 屏幕坐标由 `setFrame` 决定。常用可见范围约 x∈[-6,6]、y∈[-4,4]；建议 `setFrame(0.5, 0.55, 12)` 或按内容取 10–18 的跨度。
物理量映射到世界坐标时，请在本章里固定比例（例如 1 世界单位 = 2 m），并在 hud 中给出真实数值。

| 函数 | 说明 |
| --- | --- |
| `setFrame(cx, cy, span)` | 设原点位置（画布比例）与横向跨度；每帧开头调用 |
| `base()` | 画网格 |
| `X(x)` / `Y(y)` | 世界坐标转屏幕坐标 |
| `lim()` | 当前可见世界范围 `{x0,x1,y0,y1}` |
| `clampPt(p)` | 把世界坐标夹到可见范围内 |
| `arrow(a, b, color, opt)` | 矢量箭头；opt: `{w, head, dash, alpha, glow}` |
| `line(a, b, color, opt)` | 线段；opt: `{w, dash, alpha}` |
| `path(pts, color, opt)` | 折线 / 轨迹；opt: `{w, dash, alpha, glow, fill, close, fillOnly}` |
| `poly(pts, fill, stroke, opt)` | 闭合多边形 |
| `rect(a, b, fill, stroke, opt)` | 轴对齐矩形（a、b 为对角） |
| `circleAt(c, r, fill, stroke, opt)` | 圆，r 为世界单位 |
| `spring(a, b, coils, color, opt)` | 弹簧；opt: `{amp, w}` |
| `ground(y, color, opt)` | 地面线 + 阴影斜线 |
| `dot(p, color, r)` | 发光圆点（质点、小球） |
| `handle(p, color, active)` | 可拖动端点 |
| `math(txt, x, y, color, size, align, baseline)` | 数学斜体文字（**屏幕坐标**） |
| `sans(txt, x, y, color, size, align, baseline)` | 普通文字（屏幕坐标） |
| `vlabel(a, b, txt, color, off, size)` | 沿矢量中点法向放标签 |
| `segLabel(a, b, txt, color, frac, off, size)` | 线段 frac 处的普通文字 |
| `segMath(a, b, txt, color, frac, off, size)` | 同上，数学斜体 |
| `angleArc(c, th1, th2, r, color, txt, size)` | 角弧（弧度，逆时针为正） |
| `rightAngle(center, u, v, s, color)` | 直角小方块 |
| `fmt(v, d)` | 数字转字符串（负号 −，默认 2 位） |

控件构造（只能用在 `panel(el)` 内）：

| 函数 | 说明 |
| --- | --- |
| `addSlider(parent, label, min, max, step, value, format, onInput)` | 返回 `{input, set(v, fire)}`；format 把数值转成显示文本 |
| `addToggle(parent, label, value, onChange)` | 开关 |
| `addBtn(parent, label, fn, 'ghost')` | 按钮，默认主色；传 `'ghost'` 为次要样式 |
| `addSeg(parent, items, activeIndex, onPick)` | 分段选择器，items 为 3 个短标签 |

## 交互动效建议

- 运动类：小车 / 小球用 `dot` 或 `circleAt`，速度、加速度用 `arrow`；轨迹用 `path` 保存历史点（每帧 push，最多 400 点）。
- 受力类：物体画成 `rect` 或 `circleAt`，各力从同一点出发画不同颜色箭头，长度按同一比例尺。
- 图象类：横纵轴用 `line` + `arrow`，刻度用 `sans`；曲线用 `path` 采样。
- 场与电路：电场线 / 磁感线用 `path` 画曲线并加箭头；电路用 `line` 画折线，元件用 `rect` + 文字。
- 光学：光线用 `line` + 箭头，法线用虚线，界面用 `line`，角度用 `angleArc`。

## 参考样例

`_template/src/运动的描述/modules.js` 是本章范例，结构、密度、文案风格以它为准。

## 自检

```bash
node --check _template/src/<章>/modules.js    # 语法
python3 _template/build.py <章>               # 生成 index.html
```
