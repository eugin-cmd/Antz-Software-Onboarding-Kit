# Translation review notes

Machine translations (by Claude), awaiting review by native speakers. When a language has been reviewed,
set `"reviewed": true` in its `meta` and run `python3 lang/build.py`; the review note then stops showing for it.

## Questions about the English source (raised by every translator)
- **"Pending Necropsy / Administration / Allocation"** (Getting Started): does "Administration" mean giving medicine, or administrative paperwork? The description says "administrative documentation", while the home-screen card suggests medicine. Most translators chose medicine.
- **Pharmacy · Web, "Masters (racks & shelves)"**: what do "salts", "drivers" and "manage escrow with dispute resolution" mean in this module?

Points the translator flagged for a reviewer, by language:

## zh · Simplified Chinese
1. "Pending Administration" (Getting Started, Administer Medicine) translated as 待给药 (medicine to be given); one feature text reads it as administrative paperwork (待行政处理). Confirm which is meant.
2. Terms used throughout: Housing 场舍, Site 场馆, Section 区域, Enclosure 展区. 展区 leans towards public display areas; a zoo reviewer may prefer 圈舍 or 笼舍.
3. "Collection" (the animal collection) as 动物收藏; alternatives 动物藏品, 馆藏动物.
4. search.none example words 动物, 蛋, 报告; the Egg module is 蛋类管理 (alternatives 禽蛋, 卵).
5. Common species names in screenshot descriptions translated (e.g. Southern Cassowary 双垂鹤鸵); site and place names kept in English; "peacock hind" read as 雌孔雀 (peahen).

## ru · Russian
1. "Mortality" as «Падёж» throughout (standard zoo/veterinary register); some institutions prefer «Смертность».
2. Egg "Nursery" as «инкубаторная», "hatchery" as «выводковая»; local terms may differ.
3. "Security check-in / out" as «пропуск / выпуск службой безопасности»: a little heavy.
4. "Pending Administration" as «Ожидает введения» (medicine); may mean paperwork in Getting Started.
5. "drivers" in the pharmacy masters list as «водители»; unclear in the English source.

## ja · Japanese
1. Housing 飼育施設, enclosure 獣舎 throughout; some zoos say 展示場 or 飼育舎.
2. Diet module 給餌, with 食餌 for the diets themselves.
3. Egg "Nursery" 育雛室 (育児室 would suit mammal nurseries).
4. "Pending … Administration" read as drug administration (投与); description suggests paperwork.
5. Area count changed to 業務エリア：{n} (the translator's suggestion; 〜つ reads oddly with two-digit numbers).

## es · Spanish
1. "nursery" as «sala de cría»; "create rooms" also uses «salas», which may confuse.
2. "site" as «sede», "enclosure" as «recinto»: match against any Spanish app labels.
3. Pharmacy web: "salts" «principios activos», "drivers" «controladores», "manage escrow" «depósito en garantía»; the English source is unclear.
4. "Helpdesk" «mesa de ayuda»; "Allow Exit/Entry" «Permitir salida/entrada»; "Security Checkout Cleared" «Salida de seguridad autorizada» (on-screen labels).
5. Species common names in screenshot descriptions translated; consider keeping the English names shown on screen.

## pt · Portuguese (Brazil)
1. "site" as «unidade» throughout (alternatives local, instalação).
2. "Role" as «perfil» (alternatives função, cargo).
3. "Tags Hub" as «Central de Etiquetas»; staff may know the English name.
4. "Security check-in / out" as «Entrada / saída pela segurança»; not an established term.
5. Pharmacy web "manage escrow" and "drivers": meaning in the product unclear.

## fr · French
1. "Skipped" as «Sauté/Sautées» in treatment tabs; «Non administré» or «Ignoré» may fit better.
2. "Tags Hub" «Centre des étiquettes», "Helpdesk Module" «Module Assistance»: keep English if the app does.
3. "Security Checkout" «Sortie sécurité»; "Security check-in / out" is long as a title.
4. gal.label reordered to «Écrans : {x}».
5. "Masters (racks & shelves)" «Données de référence (rayonnages et étagères)»; "manage escrow" «gérez le séquestre»: meaning unclear.

## id · Indonesian
1. "Housing" as «Penempatan», "section" as «seksi» («kandang» is already used for enclosure); "site" as «lokasi».
2. "Nursery" sometimes «ruang pembesaran (nursery)», sometimes «nursery»: local usage varies.
3. "Pending … Administration" read as giving medicine (Pemberian).
4. On-screen English labels left untranslated in screenshot descriptions so they match the app.
5. Pharmacy web "salts" «zat aktif», "drivers" «penggerak»: unclear source.

## cs · Czech
1. search.none example "report" as «přehled» (also the Reports module, «Přehledy»); «zpráva» used for downloadable, discharge and necropsy reports.
2. "Site" «areál», "Section" «sekce»; «pracoviště» or «lokalita» may match Czech zoo usage better.
3. "Pending Administration" as «podání» (medicine).
4. "Carcass" as «kadáver» (usual veterinary term).
5. Pharmacy web "salts" «účinné látky», "drivers" «faktory».

## de · German
1. Module title separators kept as in the source ("Eierverwaltung — App"); the site shows them as " · ".
2. "Diet" as «Futter» (module and area), «Futterplan» for a diet plan; alternative «Ernährung».
3. "Nursery" as «Aufzuchtstation»; «Kunstbrut» / «Naturbrut» for artificial and natural incubation.
4. "Pending Administration" as «Ausstehende Verabreichung(en)» (medicine).
5. "manage escrow with dispute resolution" as «Treuhandbestände mit Klärung von Unstimmigkeiten verwalten»: meaning unclear.

## ar · Arabic
1. "Collection" as «المجموعة الحيوانية»; may be long for a tab (alternative «المجموعة»).
2. "Pending … Administration" read as giving medicine («الإعطاء المعلّق»).
3. Species common names in screenshot descriptions translated; site and enclosure names kept in English.
4. Pharmacy "drivers" and "salts" translated literally («المحرّكات», «الأملاح»).
5. "manage escrow with dispute resolution" as «إدارة الضمان مع حل النزاعات»: may need a pharmacy term.

## hi · Hindi
1. Some titles give Hindi and the transliterated English together, e.g. «मृत्यु (मॉर्टैलिटी)», «डीवर्मिंग (कृमिनाशन)»; staff may prefer one.
2. «दवा देना (एडमिनिस्टर)» keeps the on-screen label in brackets.
3. faq.a5 keeps "Getting Started" in brackets although the page name is translated elsewhere.
4. win.count uses «फ़ीचर {i} / {n}»; nav.faq uses the full «अक्सर पूछे जाने वाले प्रश्न».

## sw · Swahili
1. "Enclosure" as «kizimba/vizimba» (can sound like a cage; «boma» for large paddocks).
2. "Necropsy" as «Uchunguzi wa Mzoga (Necropsy)»; vets may just say necropsy/postmortem.
3. "Site" «kituo/vituo», "Section" «sehemu»; staff may prefer the English "site".
4. Lab statuses "Haemolysed" and "Clotted" need a vet's check.
5. Pharmacy "drivers" «madereva», "salts" «chumvi za dawa» (literal); "Escrow" left in English.

## pl · Polish
1. "Housing" «Pomieszczenia dla zwierząt», "enclosure" «wybieg» (usually outdoor; «zagroda» or «pomieszczenie» may fit some places).
2. Egg "Nursery" «odchowalnia» (alternatives «odchowalnia piskląt», «wychowalnia»).
3. "Security check-in / out" «Kontrola wjazdu / wyjazdu przez ochronę»: free rendering.
4. "Pending Administration" as medicine («oczekujące podania leków»).
5. search.cue and spot.link use a colon («Szukaj: {x}», «Szczegóły: {x}») to avoid case agreement; a little stiff.

## lt · Lithuanian
1. Housing «Laikymo vietos»; enclosure «aptvaras», mortality «gaištamumas», carcass «gaišena», necropsy «skrodimas», deworming «dehelmintizacija».
2. "Administer" / "Pending Administration" as «skyrimas» (medicine); staff may expect «vaistų davimas / sušvirkštimas».
3. Egg "Nursery" «inkubatorinė» (alternative «jauniklių auginykla»).
4. Pharmacy "drivers" «vairuotojai»: source unclear.
5. "Abnormal shedding" «nenormalus šėrimasis» (fur); «nėrimasis» if reptile skin shedding.

## et · Estonian
1. "Pending … Administration" as medicine («manustamine»).
2. Egg "nursery" «kasvandus» (alternatives «poegade kasvatusruum», «haudejaam»).
3. search.cue «Otsi: {x}» and gal.label «Ekraanivaated: {x}» use a colon to avoid case endings.
4. "Masters (racks & shelves)" «Põhiandmed (riiulid ja riiulikohad)»; "drivers" «toimeained»: source unclear.
5. "Reports - App" kept with a hyphen; the site shows it as " · App".

## lv · Latvian
1. "Carcass" «līķis» (e.g. «Līķu pārvietošana»); alternatives «dzīvnieka līķis», «kautķermenis».
2. Egg "Nursery" «audzētava», "Housing" «izmitināšana»: check against Latvian zoo usage.
3. "Site" «vieta» throughout; «objekts» or «teritorija» may be more idiomatic.
4. "Pending Administration" «gaidošā ievadīšana» (medicine); could be misread as data entry.
5. Pharmacy "escrow" «rezervētie krājumi (escrow)»: a guess.
