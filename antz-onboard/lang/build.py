"""Check every lang/<code>.json against lang/en.json and write lang/<code>.js for the site.
Run: python3 lang/build.py   (from antz-onboard/)"""
import json, re, os, sys
here = os.path.dirname(os.path.abspath(__file__))
en = json.load(open(os.path.join(here, 'en.json'), encoding='utf-8'))
PH = re.compile(r'\{\w+\}')
problems = {}
def walk(a, b, path, out):
    if isinstance(a, dict):
        if not isinstance(b, dict): out.append(f'{path}: not an object'); return
        for k, v in a.items():
            if k not in b: out.append(f'{path}.{k}: missing'); continue
            walk(v, b[k], f'{path}.{k}', out)
    elif isinstance(a, list):
        if not isinstance(b, list) or len(a) != len(b): out.append(f'{path}: list length'); return
        for i, (x, y) in enumerate(zip(a, b)): walk(x, y, f'{path}[{i}]', out)
    elif isinstance(a, str):
        if not isinstance(b, str): out.append(f'{path}: not text'); return
        if a.strip() and not b.strip(): out.append(f'{path}: empty')
        if sorted(PH.findall(a)) != sorted(PH.findall(b)): out.append(f'{path}: placeholders {PH.findall(a)} vs {PH.findall(b)}')
built = []
for f in sorted(os.listdir(here)):
    if not f.endswith('.json') or f == 'en.json': continue
    code = f[:-5]
    try: tr = json.load(open(os.path.join(here, f), encoding='utf-8'))
    except Exception as e: problems[code] = [f'invalid JSON: {e}']; continue
    out = []
    for key in ('ui', 'tracks', 'modules'): walk(en[key], tr.get(key, {}), key, out)
    if out: problems[code] = out
    with open(os.path.join(here, code + '.js'), 'w', encoding='utf-8') as w:
        w.write('/* Generated from ' + f + ' by lang/build.py. Edit the JSON, then run the build again. */\n')
        w.write('window.ANTZ_I18N = ' + json.dumps(tr, ensure_ascii=False, separators=(',', ':')) + ';\n')
    built.append(code)
print('built:', ' '.join(built) or 'none')
for code, out in problems.items():
    print(f'{code}: {len(out)} problem(s)'); [print('   ', o) for o in out[:12]]
sys.exit(1 if problems else 0)
