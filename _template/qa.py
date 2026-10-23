#!/usr/bin/env python3
# 构建全部章节并做运行时自检（Node DOM 桩）
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, '_template', 'build.py')
SMOKE = os.path.join(ROOT, '_template', 'smoke.js')
data = json.load(open(os.path.join(ROOT, '_template', 'manifest.json'), encoding='utf-8'))

ok = fail = 0
bad = []
for book in data['books']:
    for ch in book['chapters']:
        name = ch['dir']
        out = os.path.join(ROOT, name)
        os.makedirs(out, exist_ok=True)
        r = subprocess.run([sys.executable, BUILD, name], capture_output=True, text=True)
        page = os.path.join(out, 'index.html')
        if not os.path.exists(page):
            fail += 1; bad.append((name, 'build failed: ' + (r.stderr or r.stdout).strip()[:160])); continue
        s = subprocess.run(['node', SMOKE, page], capture_output=True, text=True)
        if 'ALL OK' in s.stdout:
            ok += 1
            print('OK  ', name)
        else:
            fail += 1
            msg = (s.stdout or s.stderr).strip().replace('\n', ' | ')
            bad.append((name, msg[:220]))
            print('FAIL', name, '->', msg[:160])

print('----')
print('ok', ok, 'fail', fail)
for n, m in bad:
    print(' -', n, ':', m)
sys.exit(1 if fail else 0)
