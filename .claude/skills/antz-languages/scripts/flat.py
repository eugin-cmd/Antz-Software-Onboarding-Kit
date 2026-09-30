"""Flatten a lang/<code>.json into the keys used by the review tooling:
ui.<key> · track.<id>.<label|desc> · m.<id>.<title|intro|summary> · m.<id>.f<N>.<title|desc|alt> · m.<id>.shot.<src>
(the same keys as audit/translation-review/import_review.py and the workbooks)."""
import json, os

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
LANG = os.path.join(REPO, 'antz-onboard', 'lang')
REVIEW = os.path.join(REPO, 'audit', 'translation-review')


def flatten(d):
    out = {}
    for k, v in d.get('ui', {}).items():
        out[f'ui.{k}'] = v
    for tid, t in d.get('tracks', {}).items():
        for f, v in t.items():
            out[f'track.{tid}.{f}'] = v
    for mid, m in d.get('modules', {}).items():
        for f in ('title', 'intro', 'summary'):
            if f in m:
                out[f'm.{mid}.{f}'] = m[f]
        for i, fe in enumerate(m.get('features', []), 1):
            for f in ('title', 'desc', 'alt'):
                if fe.get(f):
                    out[f'm.{mid}.f{i}.{f}'] = fe[f]
        for src, alt in (m.get('shots') or {}).items():
            out[f'm.{mid}.shot.{src}'] = alt
    return out


def load(code):
    return json.load(open(os.path.join(LANG, f'{code}.json'), encoding='utf-8'))
