"""Write audit/translation-review/samples/<code>.json: the same ~110 keys as samples/en.json, in <code>.
This file is what the blind back-translator gets (it must never see en.json).
  python3 .claude/skills/antz-languages/scripts/sample.py pl lt      (one or more language codes)"""
import json, os, sys
from flat import REVIEW, flatten, load

keys = list(json.load(open(os.path.join(REVIEW, 'samples', 'en.json'), encoding='utf-8')))
for code in sys.argv[1:] or sys.exit(__doc__):
    flat = flatten(load(code))
    missing = [k for k in keys if k not in flat]
    out = {k: flat[k] for k in keys if k in flat}
    json.dump(out, open(os.path.join(REVIEW, 'samples', f'{code}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{code}: {len(out)} strings -> samples/{code}.json' + (f'  (missing: {", ".join(missing)})' if missing else ''))
