"""What changed in the English source since a git revision (default: the last commit).
Run after `node lang/extract.js`. Prints added / changed / removed keys and writes the new English text of
added + changed keys to <out> (default: scratch en-changes.json) for the translators.
  python3 .claude/skills/antz-languages/scripts/en_changes.py [git-rev] [--out path.json]"""
import argparse, json, os, subprocess
from flat import LANG, REPO, flatten

ap = argparse.ArgumentParser()
ap.add_argument('rev', nargs='?', default='HEAD')
ap.add_argument('--out', default='en-changes.json')
a = ap.parse_args()
rev, out = a.rev, a.out
old_txt = subprocess.run(['git', 'show', f'{rev}:antz-onboard/lang/en.json'], cwd=REPO, capture_output=True, text=True)
if old_txt.returncode:
    raise SystemExit(old_txt.stderr.strip())
old = flatten(json.loads(old_txt.stdout))
new = flatten(json.load(open(os.path.join(LANG, 'en.json'), encoding='utf-8')))
added = [k for k in new if k not in old]
changed = [k for k in new if k in old and new[k] != old[k]]
removed = [k for k in old if k not in new]
for name, ks in (('added', added), ('changed', changed), ('removed', removed)):
    print(f'{name}: {len(ks)}')
    for k in ks:
        print('   ', k, '|', (new.get(k) or old.get(k))[:90])
json.dump({k: new[k] for k in added + changed}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'-> {out}  ({len(added) + len(changed)} strings to translate)')
