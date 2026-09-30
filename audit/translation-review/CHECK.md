# Compare original English with the blind back-translation

For each language you are given, read `samples/en.json` (original English) and `back/<code>.json` (a translation of the
<code> text back into English by someone who never saw the original). Keys match.

For every key, decide whether the translation (as seen through the back-translation) keeps the original meaning:
- "same": same meaning. Wording differences, word order, synonyms, a more or less formal register, and small grammar
  changes are all fine. Placeholders like {x} {n} must be kept. Most entries should be "same".
- "minor": meaning is basically kept, but a detail is lost, added or slightly shifted (e.g. "site" became "location",
  a list item dropped, a term that a zoo would not use), or the back-translator marked it "[?]".
- "differs": the meaning changed in a way that could mislead a user (wrong action, wrong term, opposite sense,
  missing key information).

Remember that back-translation itself adds noise: only flag what is likely wrong in the translation, not the
back-translator's style.

Write `check/<code>.json` containing ONLY the entries that are "minor" or "differs":
{ "<key>": { "verdict": "Minor difference" | "Meaning differs", "note": "<one short sentence saying what shifted>" } }
Use {} if nothing is flagged. Valid UTF-8 JSON only. Read no files other than those named here.
