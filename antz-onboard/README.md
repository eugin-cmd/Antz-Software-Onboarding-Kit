# Antz Onboarding (prospect edition, v0.1)

A web version of the onboarding kit for prospective clients. Open `index.html`
in a browser, or run `python3 serve.py` and visit http://localhost:8080/ (the
server sends no-cache headers, so a refresh always shows the latest files).
No build step is needed.

## Files

| File | Role |
|---|---|
| `index.html` | Page shell: header, footer, script tags |
| `i18n.js` | Language list, the English interface text, and the loader that picks the language |
| `lang/` | Translations: `en.json` (source), `<code>.json` per language, generated `<code>.js`, `build.py`, `TRANSLATING.md`, `REVIEW-NOTES.md` |
| `styles.css` | All styles. Tokens come from the Figma `MD3_Antz` variables |
| `app.js` | Renders the home page and module pages from content, plus search and routing |
| `content.json` | Module content, copied from `antz-learn/v-notion/content.json` |
| `content.js` | `content.json` wrapped as a script so the page opens from disk |
| `icons.js` | Icon set, copied from `antz-learn/v-notion/icons.js` |
| `serve.py` | Local preview server with caching switched off |
| `assets/shots/` | Product screenshots used in the feature previews |
| `assets/cards/` | Web-sized module photos for the cards (originals in References/icon_backgrounds/card images) |
| `assets/icons/` | White module icons (Material Symbols Outlined style, 50px) |
| `assets/photos/`, `assets/icon-bg/` | Hero, section and fallback photos |
| `assets/thumbs/` | Small screen thumbnails |

After you edit `content.json`, regenerate `content.js`:

```sh
(printf 'window.ANTZ_CONTENT = '; cat content.json; printf ';\n') > content.js
```

## Choices made for a prospect audience

- The home page stays short: hero with search and area chips, six reasons to
  choose Antz, one featured workflow (Animal Transfer), areas as tabs, a
  four-step first day, a call to action and an FAQ.
- Detail is one click down. Each module page lists its features, and
  selecting a feature shows its real screen.
- Hidden: the Foundations track, which is internal kit framing, and modules
  marked `needs-content` (Chat, Focus Hub).
- No total module count is printed, because the canonical count (D6) is
  still undecided. Per-area counts come from the data.
- The Housing intro is rewritten so it no longer claims three levels
  (see `antz-learn/FINDINGS.md` §1).
- No em-dashes in rendered copy. `app.js` rewrites them at render time.

## Languages

The guide is available in 13 languages; English is the default. Visitors choose one from the globe menu in
the header. The choice is remembered, and `?lang=fr` in a link opens that language directly. Arabic reads
right to left. The app screenshots stay in English (they show the app as it is), so translated module pages
also give the module's English name ("In the app: …") and search matches English terms as well.

Translations were made by machine (Claude) and are awaiting review; until a language is reviewed, its pages
show a small note saying so. To work on translations:

1. English text lives in `i18n.js` (interface) and `content.json` (modules). After changing either, run
   `node lang/extract.js` to regenerate `lang/en.json`, then translate the new or changed strings.
2. Edit `lang/<code>.json` (rules in `lang/TRANSLATING.md`; open questions per language in `lang/REVIEW-NOTES.md`).
3. Run `python3 lang/build.py`. It checks every file against `en.json` (missing keys, placeholders) and
   writes the `lang/<code>.js` files the site loads.
4. When a native speaker has reviewed a language, set `"reviewed": true` in its `meta` and rebuild.
