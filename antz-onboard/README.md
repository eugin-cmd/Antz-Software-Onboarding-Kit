# Antz Onboarding (prospect edition, v0.1)

A web version of the onboarding kit for prospective clients. Open `index.html`
in a browser, or run `python3 serve.py` and visit http://localhost:8080/ (the
server sends no-cache headers, so a refresh always shows the latest files).
No build step is needed.

## Files

| File | Role |
|---|---|
| `index.html` | Page shell: header, footer, script tags |
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
