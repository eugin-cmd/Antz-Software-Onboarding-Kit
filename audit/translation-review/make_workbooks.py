"""Build one review workbook per language: every string of the guide with its English original, the
translation, the blind back-translation and check result (for the sampled strings), and columns for the
reviewer. Run from the repo root:  python3 audit/translation-review/make_workbooks.py
Reviewed files are read back by import_review.py."""
import json, os, re
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = os.path.dirname(os.path.abspath(__file__))
LANG = os.path.join(ROOT, '..', '..', 'antz-onboard', 'lang')
OUT = os.path.join(ROOT, 'workbooks')
NAMES = {'es': 'Spanish', 'fr': 'French', 'de': 'German', 'pt': 'Portuguese', 'cs': 'Czech', 'pl': 'Polish', 'lt': 'Lithuanian',
         'lv': 'Latvian', 'et': 'Estonian', 'ru': 'Russian', 'ar': 'Arabic', 'hi': 'Hindi', 'zh': 'Chinese (Simplified)',
         'ja': 'Japanese', 'id': 'Indonesian', 'sw': 'Swahili'}
PAGE = {'brand': 'Header', 'nav': 'Header menu', 'meta': 'Search engines', 'footer': 'Footer', 'lang': 'Language menu and note',
        'hero': 'Home · banner', 'search': 'Search', 'start': 'Home · start-here cards', 'kit': 'Start-here pages',
        'day': 'Getting Started · first day', 'modules': 'Home · modules', 'spot': 'Home · featured workflow',
        'cta': 'Home · help section', 'faq': 'Home · FAQ', 'pager': 'Previous / next links', 'mod': 'Module pages',
        'win': 'Feature window', 'gal': 'Phone screen viewer'}
FIELD = {'title': 'title', 'intro': 'introduction', 'summary': 'one-line summary on its card', 'desc': 'description',
         'alt': 'screenshot description (read aloud to blind users)'}
ARIAL = 'Arial'
HEAD = PatternFill('solid', fgColor='1F515B')
INPUT = PatternFill('solid', fgColor='FFF7D6')
SAMPLE = PatternFill('solid', fgColor='EEF7F2')
WARN = PatternFill('solid', fgColor='FDECEA')
THIN = Side(style='thin', color='D5DDD9')


def rows_for(en, tr):
    """(where, key, english, translation) for every string, in page order"""
    out = []
    for k, v in en['ui'].items():
        out.append((PAGE.get(k.split('.')[0], 'Interface'), f'ui.{k}', v, tr['ui'].get(k, '')))
    for tid, t in en['tracks'].items():
        for f in ('label', 'desc'):
            out.append(('Area names', f'track.{tid}.{f}', t[f], tr['tracks'].get(tid, {}).get(f, '')))
    for mid, m in en['modules'].items():
        tm = tr['modules'].get(mid, {})
        name = re.sub(r'\s*—\s*', ' · ', m['title'])
        for f in ('title', 'intro', 'summary'):
            if f in m:
                out.append((f'Module · {name}', f'm.{mid}.{f}', m[f], tm.get(f, '')))
        for i, fe in enumerate(m['features']):
            tf = (tm.get('features') or [{}] * (i + 1))[i] if i < len(tm.get('features', [])) else {}
            for f in ('title', 'desc', 'alt'):
                if fe.get(f):
                    out.append((f'Module · {name} · feature {i + 1}', f'm.{mid}.f{i + 1}.{f}', fe[f], tf.get(f, '')))
        for src, alt in (m.get('shots') or {}).items():
            out.append((f'Module · {name}', f'm.{mid}.shot.{src}', alt, (tm.get('shots') or {}).get(src, '')))
    return out


def sample_key(key):
    """Keys used by the back-translation sample (ui.x, m.id.title, m.id.fN.desc)"""
    return key


def style_header(ws, cols):
    for c, (title, width) in enumerate(cols, 1):
        cell = ws.cell(row=1, column=c, value=title)
        cell.font = Font(name=ARIAL, bold=True, color='FFFFFF', size=10)
        cell.fill = HEAD
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = width
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = 'E2'


def build(code, en, notes):
    tr = json.load(open(os.path.join(LANG, f'{code}.json'), encoding='utf-8'))
    back = {}
    p = os.path.join(ROOT, 'back', f'{code}.json')
    if os.path.exists(p):
        back = json.load(open(p, encoding='utf-8'))
    check = {}
    p = os.path.join(ROOT, 'check', f'{code}.json')
    if os.path.exists(p):
        check = json.load(open(p, encoding='utf-8'))

    wb = Workbook()
    # --- How to review
    how = wb.active
    how.title = 'How to review'
    how.column_dimensions['A'].width = 26
    how.column_dimensions['B'].width = 100
    lines = [
        (f'Antz Onboarding Guide · {NAMES[code]} translation review', None),
        ('', None),
        ('What this is', f'Every piece of text in the guide, in English and in {NAMES[code]}. The {NAMES[code]} text was machine-translated '
                         '(Claude) and has not been checked by a native speaker yet. Please read it as a zoo or animal-care colleague would.'),
        ('Where to work', 'Sheet "Strings". Fill in only the yellow columns: Status, Corrected translation, Comment.'),
        ('Status', 'OK = correct and natural.  Fix = wrong or unnatural; write your version in "Corrected translation".  '
                   'Unsure = you are not certain; explain in "Comment".'),
        ('Placeholders', 'Keep {x}, {n}, {i}, {q} and {email} exactly as they are; the site fills them in (for example {n} becomes a number).'),
        ('Leave in English', 'Antz, Antz Systems, hello@antz.systems, IDs such as AID 425990, person and site names, scientific species names.'),
        ('Back-translation', 'For about 110 sampled strings, a separate translator turned the text back into English without seeing the original. '
                             'If "Back-translation" says something different from "English", the meaning may have drifted: check those first. '
                             'Rows with a check result are shaded red.'),
        ('Terms to settle', 'Sheet "Flagged by translator" lists the words the translator was unsure of. Deciding these once fixes them everywhere.'),
        ('Where it shows', 'Open https://antz-software-onboarding-kit.vercel.app/?lang=' + code + ' to see the text in place.'),
        ('When you are done', 'Send the file back. The corrections are applied automatically and the language is then marked as reviewed.'),
        ('', None),
        ('Example row', 'See row 2 of "Strings" filled in below as a sample; it is only an example and is not imported.'),
    ]
    for r, (a, b) in enumerate(lines, 1):
        how.cell(row=r, column=1, value=a).font = Font(name=ARIAL, bold=(r == 1 or b is not None), size=13 if r == 1 else 10)
        if b:
            c = how.cell(row=r, column=2, value=b)
            c.font = Font(name=ARIAL, size=10)
            c.alignment = Alignment(wrap_text=True, vertical='top')
            how.row_dimensions[r].height = max(15, 15 * (len(b) // 95 + 1))

    # --- Strings
    ws = wb.create_sheet('Strings')
    cols = [('Where on the site', 30), ('Key (do not edit)', 22), ('English (original)', 48), (f'{NAMES[code]} (current)', 48),
            ('Back-translation to English (sample only)', 42), ('Check result', 34),
            ('Status', 11), ('Corrected translation', 44), ('Comment', 34)]
    style_header(ws, cols)
    ex = ['Example · Home · banner', 'EXAMPLE', 'Mobile and web', '(the current translation)', '', '',
          'Fix', '(your better wording here)', 'The usual term for web app in our zoo is …']
    for c, v in enumerate(ex, 1):
        cell = ws.cell(row=2, column=c, value=v)
        cell.font = Font(name=ARIAL, size=9, italic=True, color='7A8684')
        cell.alignment = Alignment(wrap_text=True, vertical='top')
    r = 3
    for where, key, e, t in rows_for(en, tr):
        b = back.get(key, '')
        chk = check.get(key)
        vals = [where, key, e, t, b, (f"{chk['verdict']}: {chk['note']}" if chk else ('Same meaning' if b else '')), '', '', '']
        for c, v in enumerate(vals, 1):
            cell = ws.cell(row=r, column=c, value=v)
            cell.font = Font(name=ARIAL, size=10, color='7A8684' if c == 2 else '0E1715')
            cell.alignment = Alignment(wrap_text=True, vertical='top')
            cell.border = Border(bottom=THIN)
            if c >= 7:
                cell.fill = INPUT
            elif chk and c in (4, 5, 6):
                cell.fill = WARN
            elif b and c in (5, 6):
                cell.fill = SAMPLE
        r += 1
    last = r - 1
    dv = DataValidation(type='list', formula1='"OK,Fix,Unsure"', allow_blank=True)
    dv.error, dv.errorTitle = 'Choose OK, Fix or Unsure', 'Status'
    ws.add_data_validation(dv)
    dv.add(f'G3:G{last}')
    ws.auto_filter.ref = f'A1:I{last}'
    # progress line under the header of the how-to sheet: formulas so it updates as the reviewer works
    how.cell(row=len(lines) + 2, column=1, value='Progress').font = Font(name=ARIAL, bold=True, size=10)
    how.cell(row=len(lines) + 2, column=2,
             value=f'=COUNTIF(Strings!G3:G{last},"OK")&" OK · "&COUNTIF(Strings!G3:G{last},"Fix")&" to fix · "&COUNTIF(Strings!G3:G{last},"Unsure")&" unsure · "&COUNTBLANK(Strings!G3:G{last})&" not reviewed yet (of {last - 2})"').font = Font(name=ARIAL, size=10)

    # --- Flagged by translator
    fl = wb.create_sheet('Flagged by translator')
    style_header(fl, [('#', 5), ('What the translator was unsure about', 110), ('Your decision', 60)])
    fl.freeze_panes = 'A2'
    for i, n in enumerate(notes.get(code, []), 1):
        fl.cell(row=i + 1, column=1, value=i).font = Font(name=ARIAL, size=10)
        c = fl.cell(row=i + 1, column=2, value=n)
        c.font = Font(name=ARIAL, size=10)
        c.alignment = Alignment(wrap_text=True, vertical='top')
        d = fl.cell(row=i + 1, column=3)
        d.fill = INPUT
        d.alignment = Alignment(wrap_text=True, vertical='top')
    base = len(notes.get(code, [])) + 3
    fl.cell(row=base, column=2, value='Questions about the English (please answer if you know):').font = Font(name=ARIAL, bold=True, size=10)
    for j, q in enumerate(notes.get('_source', []), 1):
        c = fl.cell(row=base + j, column=2, value=q)
        c.font = Font(name=ARIAL, size=10)
        c.alignment = Alignment(wrap_text=True, vertical='top')
        fl.cell(row=base + j, column=3).fill = INPUT

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f'Antz-Guide-Translation-Review-{code}-{NAMES[code].split(" ")[0]}.xlsx')
    wb.save(path)
    return path, last - 2, sum(1 for k in back), len(check)


def parse_notes():
    txt = open(os.path.join(LANG, 'REVIEW-NOTES.md'), encoding='utf-8').read()
    notes, cur = {}, None
    src = re.search(r'## Questions about the English source.*?\n(.*?)\n\n', txt, re.S)
    notes['_source'] = [re.sub(r'\*\*', '', l.strip('- ').strip()) for l in (src.group(1).splitlines() if src else []) if l.strip()]
    for line in txt.splitlines():
        m = re.match(r'## (\w\w) ·', line)
        if m:
            cur = m.group(1); notes[cur] = []; continue
        m = re.match(r'\d+\.\s+(.*)', line)
        if cur and m:
            notes[cur].append(m.group(1))
    return notes


if __name__ == '__main__':
    en = json.load(open(os.path.join(LANG, 'en.json'), encoding='utf-8'))
    notes = parse_notes()
    for code in NAMES:
        path, n, nb, nc = build(code, en, notes)
        print(f'{code}: {n} strings, {nb} back-translated, {nc} flagged by the check -> {os.path.relpath(path)}')
