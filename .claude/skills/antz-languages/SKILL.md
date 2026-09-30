---
name: antz-languages
description: Manage the Antz Onboarding Guide's translations (antz-onboard/lang). Covers adding or removing a language, re-translating after the English text changes, running the blind back-translation quality check, building the native-speaker review workbooks, and importing a reviewed workbook. Use this whenever the user mentions languages, translations, localisation, a specific language (French, Hindi, Polish…), the language menu, the "machine-translated" note, review spreadsheets, or edits English text in i18n.js or content.json that the other languages will then need, even if they don't say "translation".
---

# Antz Onboarding Guide · languages

The site (`antz-onboard/`) is a static page for Antz **users** (zoo and animal-care staff), not prospects.
English is the source and the default. Each other language is one JSON file that mirrors the English one.

## How it fits together
| File | Role |
|---|---|
| `antz-onboard/i18n.js` | `LANGS` (code, native name, optional `dir: 'rtl'`, optional Google Font) and `UI_EN`, the English interface text |
| `antz-onboard/content.json` / `content.js` | English module content |
| `antz-onboard/lang/extract.js` | writes `lang/en.json` from the two above (run `node lang/extract.js` inside `antz-onboard/`) |
| `antz-onboard/lang/<code>.json` | a translation, with the same keys as en.json, plus `meta` (`reviewed: false` shows the review note) |
| `antz-onboard/lang/build.py` | validates every `<code>.json` against en.json and writes the `<code>.js` the site loads |
| `antz-onboard/lang/TRANSLATING.md` | translation rules (the translator agent reads them) |
| `antz-onboard/lang/REVIEW-NOTES.md` | per-language doubts for reviewers, plus open questions about the English source |
| `audit/translation-review/` | back-translation check (`samples/`, `back/`, `check/`, `BACK-TRANSLATE.md`, `CHECK.md`) and review workbooks (`make_workbooks.py`, `import_review.py`, `workbooks/`) |

Helper scripts live in this skill's `scripts/` folder (run them from the repo root):
- `sample.py <codes…>` writes `samples/<code>.json`, the same ~110 keys as `samples/en.json`.
- `en_changes.py [git-rev] --out <file>` lists the English strings added, changed or removed since a commit, and writes them out for translators.
- `sweep.js <codes…>` is a browser smoke test on desktop and phone.

The translator agent is `.claude/agents/antz-translator.md` (`subagent_type: "antz-translator"`). Spawn one
per language, all in one message and in the background, so a many-language job runs in parallel. Tell each
one which job it has: *new language*, *update from changes file*, or *apply fixes*. The agent edits only
its own `<code>.json`; you own i18n.js, REVIEW-NOTES.md and everything else, which avoids write conflicts.

## Testing (after any language change)
1. Start the local server if it isn't running: `cd antz-onboard && python3 serve.py 8080` (in the background).
2. Make sure puppeteer-core is available in the session scratchpad: `npm i --prefix <scratchpad>/shot puppeteer-core@23`
   (skip if `<scratchpad>/shot/node_modules/puppeteer-core` exists). The sweep uses the installed Chrome app.
3. `NODE_PATH=<scratchpad>/shot/node_modules node .claude/skills/antz-languages/scripts/sweep.js <codes…>`
   Every line should read `OK`. `rawKeys` means a `t('…')` key has no text in English (add it to `UI_EN`).
   `phoneOverflow` usually means a long translated label; look at the page at 390px. `carcassHits:0` means
   English search terms broke.
4. For a new script or a right-to-left language, also take a screenshot of the home page and a module page
   at 1440px and 390px, and look at them: font rendering, the header label, tab row edges, arrows.

## Shipping
Only when the user asks ("push"):
1. Bump the cache version in `antz-onboard/index.html` so browsers fetch the new files:
   `sed -i '' -E "s/\?v=[0-9]+/?v=$(date +%s)/g" antz-onboard/index.html`
2. Commit with a plain-English message, then push to `main` (Vercel deploys automatically). If a push stalls:
   `GIT_SSH_COMMAND="ssh -o ConnectTimeout=15 -o ServerAliveInterval=10 -o ServerAliveCountMax=3" git push origin main`
3. Check it live: `https://antz-software-onboarding-kit.vercel.app/?lang=<code>`.
Keep the language count in `antz-onboard/README.md` ("## Languages") in step with `LANGS`.

---

## Workflow: add a language
1. **Register it** in `LANGS` in `i18n.js`, in the order the menu should show it, using the language's own
   name (e.g. `{ code: 'ko', name: '한국어', font: 'Noto+Sans+KR:wght@400;500;700;800' }`). Use ISO 639-1 codes.
   - A script that Inter doesn't cover (CJK, Indic, Arabic, Thai, Hebrew…) needs a Noto `font`, and its family
     name goes into the `body` font-family list near the top of `styles.css`.
   - Right-to-left (Arabic, Hebrew, Persian, Urdu): add `dir: 'rtl'`. The `[dir=rtl]` CSS block at the end of
     `styles.css` and the `RTL` flag in `app.js` already handle layout, arrows and swipes; test them anyway.
   - Tall scripts may need a line-height tweak like `[lang="hi"] .brand-label`.
2. **Translate**: spawn `antz-translator` with *new language `<code>`* (one agent per language).
3. **Build and check**: `cd antz-onboard && python3 lang/build.py` must end with no problems.
4. **Review notes**: paste each agent's points into `lang/REVIEW-NOTES.md` as `## <code> · <Name>` with a
   numbered list (make_workbooks.py parses exactly that shape).
5. **Workbook support**: add the code and English name to `NAMES` in `audit/translation-review/make_workbooks.py`.
6. Run the **quality check** below for the new language(s). It is worth it: it caught a real error in Estonian.
7. **Test** (above), then update the README count, and ship when asked.

## Workflow: English text changed
Run this when someone edits `UI_EN` in i18n.js or content.json, or adds a module, feature or screenshot.
1. `cd antz-onboard && node lang/extract.js`
2. `python3 .claude/skills/antz-languages/scripts/en_changes.py --out <scratchpad>/en-changes.json`
   (compares with the last commit; pass a git revision to compare with an older point).
   Removed keys need no translation: build.py ignores extra keys, but delete them from each `<code>.json` to keep things tidy.
3. If anything was added or changed, spawn one `antz-translator` per language (every code in `LANGS` except `en`)
   with *update from changes file*, giving it the path to that file. For one or two short strings you can
   translate them yourself instead, following TRANSLATING.md.
4. `python3 lang/build.py`, then the sweep for all languages.
5. Changed strings are unreviewed again. Say so to the user, and regenerate the workbooks if reviewers are active.

## Workflow: quality check (blind back-translation)
Why: a second translator, who never sees the English, turns a sample back into English; comparing that with the
original shows where meaning drifted. It only works if the back-translator truly can't see en.json.
1. `python3 .claude/skills/antz-languages/scripts/sample.py <codes…>`
2. Back-translate: for each code, spawn a **general-purpose** agent with `model: "sonnet"` (a different
   model from the translator, so its mistakes aren't shared). Give it the text of `audit/translation-review/BACK-TRANSLATE.md`,
   the path `audit/translation-review/samples/<code>.json`, and tell it to write `audit/translation-review/back/<code>.json`.
   Do not use antz-translator here, because it reads en.json.
3. Compare: spawn agents (several languages each is fine) with `audit/translation-review/CHECK.md`. Each writes `check/<code>.json`.
4. Read every "Meaning differs" entry yourself against the translation. Some are back-translation noise (in the
   Latvian run, the one flagged error turned out not to be one). Fix the real ones in `<code>.json` and rebuild.
   Recurring "Minor difference" themes (a term that varies) belong in REVIEW-NOTES.md as a reviewer question.
5. Report to the user in plain words: strings checked, real errors found and fixed, themes for reviewers.

## Workflow: review workbooks for native speakers
1. `python3 audit/translation-review/make_workbooks.py` writes one `.xlsx` per language to `audit/translation-review/workbooks/`,
   with every string, the back-translation, check results, yellow Status/Correction/Comment columns, a
   "Flagged by translator" sheet from REVIEW-NOTES.md and a Progress formula (computed when opened).
2. To hand them over: `cd audit/translation-review/workbooks && zip -q ../Antz-Guide-Translation-Review-all.zip *.xlsx`,
   and copy the zip or single files to `~/Downloads` for the user. They open in Excel and upload to Google Sheets unchanged.

## Workflow: import a reviewed workbook
1. `python3 audit/translation-review/import_review.py <path/to/…Review-<code>-….xlsx>` applies rows with Status "Fix"
   and a Corrected translation, then rebuilds. A Google Sheets download (File › Download › .xlsx) works too, as long as
   the file name still contains `Review-<code>-`.
2. Read the summary it prints. If rows are marked "Unsure", or there are comments or answers on the "Flagged" sheet,
   read those yourself (with openpyxl) and act on them: a terminology decision there usually applies across the
   whole file, which is an *apply fixes* job for antz-translator.
3. Only when the reviewer has been through every row, run it again with `--reviewed`. This sets
   `meta.reviewed: true`, which removes the machine-translation note for that language. Ask the user first if
   progress shows rows still not reviewed.
4. Sweep that language, then ship when asked.

## Workflow: remove a language
Delete its `LANGS` entry, `lang/<code>.json`, `lang/<code>.js`, its REVIEW-NOTES section, its `NAMES` entry and its
review files (`samples/`, `back/`, `check/`, `workbooks/`). Drop its font from the styles.css stack if no other
language uses it. Visitors who had chosen it fall back to English automatically, because unknown saved codes are ignored.
Update the README count, run the sweep on a couple of languages, and ship when asked.
