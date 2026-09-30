# Blind back-translation

You receive a JSON file of short texts from a website that teaches zoo and animal-care staff to use the "Antz" software.
Translate each value into plain English, as literally as reads naturally, so a reviewer can see exactly what the text says.

Rules:
- Work ONLY from the file you are given. Do NOT open, search for or read any other file (in particular nothing named en.json, nothing in a folder named lang, and no other language's sample). The check is only useful if you have not seen the original English.
- Keep the same keys. Output a JSON object {key: english_back_translation}.
- Keep placeholders such as {x} {n} {i} {q} {email} exactly as they are.
- Do not improve or correct the text; if a phrase is odd or ambiguous, translate what it says and add " [?]" at the end.
- Output valid UTF-8 JSON only.
