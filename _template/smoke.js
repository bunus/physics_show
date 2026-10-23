// 用极简 DOM 桩在 Node 中执行章节页脚本，捕获运行时错误
const fs = require('fs');
const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.log('NO SCRIPT'); process.exit(1); }

function ctxStub() {
  const noop = () => {};
  const o = {
    canvas: {width: 1600, height: 900},
    measureText: () => ({width: 20}),
    createLinearGradient: () => ({addColorStop: noop}),
    createRadialGradient: () => ({addColorStop: noop}),
  };
  return new Proxy(o, {
    get(t, k) {
      if (k in t) return t[k];
      return noop;
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}

class El {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this.children = [];
    this.style = {setProperty() {}, removeProperty() {}};
    this.classList = {toggle() {}, add() {}, remove() {}, contains() { return false; }};
    this.dataset = {};
    this._html = '';
    this.textContent = '';
    this.value = '0';
    this.checked = false;
  }
  set innerHTML(v) { this._html = v; }
  get innerHTML() { return this._html; }
  appendChild(c) { this.children.push(c); return c; }
  append(...cs) { cs.forEach(c => this.children.push(c)); }
  addEventListener() {}
  removeEventListener() {}
  setPointerCapture() {}
  getContext() { return ctxStub(); }
  getBoundingClientRect() { return {left: 0, top: 0, width: 1200, height: 800, right: 1200, bottom: 800}; }
  querySelector() { return new El('div'); }
  focus() {}
}

const cache = {};
global.document = {
  documentElement: new El('html'),
  body: new El('body'),
  createElement: t => new El(t),
  querySelector: s => (cache[s] = cache[s] || new El('div')),
  addEventListener() {},
  fullscreenElement: null,
  exitFullscreen() {},
};
global.window = {
  addEventListener() {},
  devicePixelRatio: 1,
  innerWidth: 1600,
  innerHeight: 950,
  ResizeObserver: class { observe() {} },
};
global.ResizeObserver = global.window.ResizeObserver;
global.performance = {now: () => 0};
global.requestAnimationFrame = () => 0;

try {
  // 直接 eval，脚本内是 'use strict' + const/let 顶层声明
  const code = process.env.SKIP_ACT ? m[1].replace('activate(0);', '') : m[1];
  (0, eval)(code + '\n;globalThis.__M = typeof MODULES !== "undefined" ? MODULES : null;');
} catch (e) {
  console.log('RUNTIME ERROR:', e.message);
  console.log((e.stack || '').split('\n').slice(1, 4).join('\n'));
  process.exit(2);
}
const mods = global.__M || (typeof MODULES === 'undefined' ? null : MODULES);
if (!mods) { console.log('MODULES missing'); process.exit(3); }
console.log('modules:', mods.length);
if (mods.length !== 5) console.log('WARN 情境数不是 5');
const tabs = mods.map(m => m.tab).join(',');
if (tabs !== '01,02,03,04,05') console.log('WARN tab 序列:', tabs);
const keys = new Set(mods.map(m => m.key));
if (keys.size !== mods.length) console.log('WARN key 重复');
let bad = 0;
mods.forEach((mod, i) => {
  const need = ['reset', 'meta', 'draw', 'hud', 'panel'];
  const miss = need.filter(k => typeof mod[k] !== 'function');
  if (miss.length) { console.log('#' + (i + 1), mod.key, 'missing', miss.join(',')); bad++; return; }
  try {
    mod.reset();
    const meta = mod.meta();
    if (!meta || !meta.title || !meta.formula || !meta.desc || !meta.note) console.log('#' + (i + 1), mod.key, 'meta fields incomplete');
    else if (meta.desc.length < 40 || meta.desc.length > 220) console.log('#' + (i + 1), mod.key, 'desc length', meta.desc.length);
    mod.handles && mod.handles();
    mod.draw(0.016);
    mod.draw(0.016);
    const hud = mod.hud();
    if (!Array.isArray(hud) || hud.length < 3 || hud.length > 6) console.log('#' + (i + 1), mod.key, 'hud rows', hud && hud.length);
    else if (hud.some(r => !r.k || r.v == null || String(r.v).length < 2)) console.log('#' + (i + 1), mod.key, 'hud row 字段缺失');
    mod.panel(new El('div'));
    if (typeof mod.togglePlay === 'function') { mod.togglePlay(); mod.draw(0.016); }
  } catch (e) {
    console.log('#' + (i + 1), mod.key, 'ERROR:', e.message);
    bad++;
  }
});
console.log(bad ? 'FAIL ' + bad : 'ALL OK');
process.exit(bad ? 4 : 0);
