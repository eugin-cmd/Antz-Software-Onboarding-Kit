/* Antz Onboarding: renders the prospect-facing site from content.js (window.ANTZ_CONTENT).
   Content stays in data; this file only decides what to show and when. */
(function () {
  'use strict';

  const DATA = window.ANTZ_CONTENT;
  const app = document.getElementById('app');

  /* ---------- Presentation config (not content) ---------- */
  const AREA_LOOK = {
    records:    { photo: 'assets/photos/img-tasks.jpg',      glyph: 'chat' },
    animal:     { photo: 'assets/photos/img-movement.jpg',   glyph: 'pets' },
    medical:    { photo: 'assets/photos/img-hospital.jpg',   glyph: 'medical' },
    mortality:  { photo: 'assets/photos/img-chick.jpg',      glyph: 'egg' },
    operations: { photo: 'assets/photos/img-operations.jpg', glyph: 'report' }
  };
  const PHOTOS = {
    hero: 'assets/photos/tiger.jpg',
    spotlight: 'assets/photos/img-lemur.jpg',
    cta: 'assets/photos/img-enclosure.jpg',
    objective: 'assets/photos/img-conservation.jpg',
    /* The kit's slide-4 'welcome screen' is byte-identical to the Getting Started home screen, so the platform section uses this photo */
    platform: 'assets/photos/img-cta-new.jpg'
  };
  const SPOTLIGHT_ID = 'animal-transfer';
  /* Screens that already carry a device frame in the image itself */
  const PREFRAMED = /img-housing|app-welcome|p5-home/;

  /* Copy corrections for a client audience (see antz-learn/FINDINGS.md §1) */
  const OVERRIDES = {
    housing: { intro: 'The Housing module organises animal habitats across your sites, sections and enclosures, so every animal has a known place and every change is tracked. Access at each level is permission-based.' }
  };

  /* ---------- Helpers ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* House rule: no em-dashes in rendered copy */
  const tidy = (s) => String(s ?? '').replace(/\s*—\s*/g, ', ').replace(/\s+-\s+/g, ', ');
  const tidyTitle = (s) => String(s ?? '').replace(/\s*—\s*|\s+-\s+/g, ' · ').replace(/\s*\((App|Web)\)/, ' · $1');
  /* icons.js declares a top-level const, so it is a global binding, not a window property */
  const ICON_SET = typeof ICONS !== 'undefined' ? ICONS : {};
  /* True for mouse and trackpad pointers (used for hover-only effects) */
  const canHover = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
  const icon = (name) => ICON_SET[name] || ICON_SET.note || '';
  const SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const CLOSE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  /* ---------- Content model ---------- */
  const modules = DATA.modules.map((m) => {
    const o = OVERRIDES[m.id] || {};
    return { ...m, ...o, raw: o.intro || m.intro, title: tidyTitle(m.title), intro: tidy(o.intro || m.intro) };
  });
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  /* Prospects only see finished modules; foundations feed the home page instead */
  const visible = modules.filter((m) => m.status === 'complete' && m.track !== 'foundations');
  const areas = DATA.tracks
    .filter((t) => AREA_LOOK[t.id])
    .map((t) => ({ ...t, desc: tidy(t.desc), modules: visible.filter((m) => m.track === t.id), ...AREA_LOOK[t.id] }))
    .filter((a) => a.modules.length);
  const areaById = Object.fromEntries(areas.map((a) => [a.id, a]));

  const shotFor = (m, src) => m.shots.find((s) => s.src === src) || { src, device: 'phone', alt: '' };
  const deviceHTML = (shot) => {
    if (!shot) return '';
    const img = `<img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="lazy">`;
    if (shot.device === 'web') return `<div class="device device-web"><div class="bar"><i></i><i></i><i></i></div>${img}</div>`;
    if (shot.device === 'tablet') return `<div class="device device-tablet"><div class="screen">${img}</div></div>`;
    if (PREFRAMED.test(shot.src)) return `<div class="device device-framed">${img}</div>`;
    return `<div class="device device-phone"><div class="screen">${img}</div></div>`;
  };

  /* ---------- Home ---------- */
  /* ---------- Kit pages: the three "start here" sections, each on its own page ---------- */
  /* Content from content.json (Edition 01, pages 3 to 5) */
  const kitScreen = (m) => (m.shots[0] ? deviceHTML({ ...m.shots[0], device: m.shots[0].device || 'phone' }) : '');
  const KIT_PAGES = [
    { id: 'objective', module: 'objective-of-this-kit', eyebrow: 'Start here', more: 'Read the objective', photo: 'objective', pos: '50% 35%' },
    { id: 'platform', module: 'what-is-antz-systems', eyebrow: 'The platform', more: 'Learn about Antz', photo: 'platform', pos: '72% 50%' },
    { id: 'getting-started', module: 'getting-started', eyebrow: 'Onboarding flow', more: 'Start the guide' }
  ];
  const KIT_SECTIONS = {
    objective: () => {
      const objective = byId['objective-of-this-kit'];
      return `
      <section class="section kit-section" id="objective">
        <div class="container kit-split kit-photo-left">
          <figure class="kit-media kit-photo reveal">
            <img src="${PHOTOS.objective}" alt="A keeper feeding a small animal in its enclosure" loading="lazy">
          </figure>
          <div class="kit-copy reveal">
            <span class="eyebrow">Why we run this training</span>
            <h2 class="section-title">Objective of this kit</h2>
            <p class="section-lede">${esc(objective.intro)}</p>
            <div class="kit-cards two">
              ${objective.features.map((f) => `
                <article class="kit-card">
                  <span class="ic">${icon(f.icon)}</span>
                  <h3>${esc(f.title)}</h3>
                  <p>${esc(tidy(f.desc))}</p>
                </article>`).join('')}
            </div>
          </div>
        </div>
      </section>
`;
    },
    platform: () => {
      const about = byId['what-is-antz-systems'];
      return `
      <section class="section section-soft kit-section" id="why">
        <div class="container kit-split">
          <div class="kit-copy reveal">
            <span class="eyebrow">The platform</span>
            <h2 class="section-title">What is Antz Systems?</h2>
            <p class="section-lede">${esc(about.intro)}</p>
            <h3 class="kit-label">Why use this app</h3>
            <div class="kit-cards two compact">
              ${about.features.map((f) => `
                <article class="kit-card">
                  <span class="ic">${icon(f.icon)}</span>
                  <h3>${esc(f.title)}</h3>
                  <p>${esc(tidy(f.desc))}</p>
                </article>`).join('')}
            </div>
          </div>
          <figure class="kit-media kit-photo reveal">
            <img src="${PHOTOS.platform}" alt="A hand holding a phone showing the Antz Systems app" loading="lazy" style="object-position: 72% 50%">
          </figure>
        </div>
      </section>
`;
    },
    'getting-started': () => {
      const start = byId['getting-started'];
      const firstDay = [
        ['Sign in to your workspace', start.features[0].desc, 'signin'],
        ['Find your way around', start.features[1].desc, 'compass'],
        ['Set up your master data', start.features[3].desc, 'database'],
        ['Give everyone the right access', 'Create roles that match your organisation and switch permissions on module by module, so each person sees what their work needs.', 'access']
      ];
      return `
      <section class="section section-soft kit-section" id="first-day">
        <div class="container kit-split">
          <div class="kit-media kit-device reveal">${kitScreen(start)}</div>
          <div class="kit-copy reveal">
            <span class="eyebrow">Module 03 · Onboarding flow</span>
            <h2 class="section-title">Getting Started</h2>
            <p class="section-lede">${esc(start.intro)}</p>
            <h3 class="kit-label">Features</h3>
            <ul class="kit-list">
              ${start.features.map((f) => `
                <li><span class="ic">${icon(f.icon)}</span><span><b>${esc(f.title)}</b>${esc(tidy(f.desc))}</span></li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="container first-day">
          <div class="section-head reveal">
            <h3 class="section-title first-day-title">What your first day on Antz looks like</h3>
            <p class="section-lede">Four steps take your team from first login to everyday use.</p>
          </div>
          <ol class="timeline">
            ${firstDay.map(([t, d, ic], i) => `
              <li class="reveal"><span class="dot">${icon(ic)}</span><div><h3><span class="step-n">${i + 1}.</span> ${esc(t)}</h3><p>${esc(tidy(d))}</p></div></li>`).join('')}
          </ol>
        </div>
      </section>
`;
    }
  };

  function renderKit(id) {
    const k = KIT_PAGES.find((x) => x.id === id);
    if (!k) { location.hash = '#/'; return; }
    const i = KIT_PAGES.indexOf(k);
    const next = KIT_PAGES[i + 1] || null, prev = KIT_PAGES[i - 1] || null;
    const title = (x) => byId[x.module].title;
    const link = (x, dir) => x ? `
      <a class="mpager-link ${dir}" href="#/kit/${x.id}">
        <small>${dir === 'prev' ? 'Previous' : 'Next'}</small>
        <b>${dir === 'prev' ? '← ' : ''}${esc(title(x))}${dir === 'next' ? ' →' : ''}</b>
      </a>` : (dir === 'next' ? `
      <a class="mpager-link next" href="#/" data-scroll="index">
        <small>Next</small>
        <b>Explore the modules →</b>
      </a>` : '<span></span>');
    app.innerHTML = `
      <div class="kitpage${/section-soft/.test(KIT_SECTIONS[k.id]()) ? ' soft' : ''}">
        <nav class="container kit-tabs" aria-label="Start here">
          ${KIT_PAGES.map((x, j) => `<a class="msubtab mfilter" href="#/kit/${x.id}"${x === k ? ' aria-current="page"' : ''}><span class="n">0${j + 1}</span>${esc(title(x))}<svg class="drawn-border" aria-hidden="true"></svg></a>`).join('')}
        </nav>
        ${KIT_SECTIONS[k.id]()}
        <div class="container"><nav class="mpager" aria-label="Previous and next page">${link(prev, 'prev')}${link(next, 'next')}</nav></div>
      </div>`;
    sizeBorders();
    document.title = `${title(k)} · Antz Onboarding`;
  }

  function renderHome(returning) {
    const about = byId['what-is-antz-systems'];
    const spot = byId[SPOTLIGHT_ID];
    const faqs = [
      ['What is Antz?', about.intro],
      ['Does it work on phones and computers?', 'Yes. The mobile app covers work on the ground, such as notes, treatments, transfers and egg records. The web app covers desk work, such as the hospital system, nursery set-up, reports and pharmacy stock. Updates appear in real time on phone, tablet and desktop.'],
      ['Can we control who sees what?', 'Yes. Access is role-based. You create the roles your organisation uses, for example Zoologist, and turn permissions on module by module.'],
      ['We run more than one site. Does that work?', 'Antz keeps data from every site and department in one place. Housing is organised by site, section and enclosure, and moves between sites go through approval and a security check-out.'],
      ['How do we get started?', 'Book a walkthrough and we will show you Antz using examples from your own collection. Write to hello@antz.systems.']
    ];

    app.innerHTML = `
      <section class="hero">
        <div class="hero-media"><div class="hero-bg" style="background-image:url('${PHOTOS.hero}')"></div></div>
        <div class="container hero-inner">
          <h1>One platform for every animal in your care</h1>
          <p class="hero-sub">Records, daily operations and teamwork across all your sites. Take a five-minute look at how Antz works.</p>
          <div class="hero-search" role="search">
            <label class="search-field">
              ${SEARCH_SVG}
              <span class="sr-only">Search modules and features</span>
              <input id="q" type="search" autocomplete="off" placeholder="" aria-controls="q-results" aria-expanded="false">
              <span class="ph" aria-hidden="true">Search <span class="ph-rot"></span></span>
              <button class="search-clear" type="button" aria-label="Clear search">${CLOSE_SVG}</button>
            </label>
            <div class="search-results" id="q-results" role="listbox"></div>
          </div>
          <div class="hero-chips">
            ${areas.map((a, i) => `<button class="chip" type="button" data-area="${a.id}" style="--i:${i}">${icon(a.glyph)}${esc(a.label)}<svg class="drawn-border" aria-hidden="true"></svg></button>`).join('')}
          </div>
          <p class="hero-meta"><span>${icon('areas')}${areas.length} areas of work</span><span class="hero-meta-sep" aria-hidden="true">·</span><span>${icon('devices')}Mobile and web</span></p>
        </div>
      </section>

      <section class="bento-section" aria-label="Start here">
        <div class="container bento">
          ${KIT_PAGES.map((k) => {
            const m = byId[k.module];
            return `
            <a class="bento-card bento-${k.id} reveal" href="#/kit/${k.id}">
              <span class="bento-copy">
                <span class="eyebrow">${esc(k.eyebrow)}</span>
                <span class="bento-title">${esc(m.title)}</span>
                <span class="bento-text">${esc(m.intro)}</span>
                <span class="bento-more">${esc(k.more)} ${ARROW}</span>
              </span>
              ${k.id === 'getting-started'
                ? `<span class="bento-phone" aria-hidden="true">${kitScreen(m)}</span>`
                : `<span class="bento-media" style="background-image:url('${PHOTOS[k.photo]}')${k.pos ? `;background-position:${k.pos}` : ''}" aria-hidden="true"></span>`}
            </a>`;
          }).join('')}
        </div>
      </section>

      <section class="section modules-section" id="index">
        <div class="container">
          <div class="modules-head reveal">
            <div>
              <span class="eyebrow">What&rsquo;s Inside</span>
              <h2 class="section-title">Explore the modules</h2>
            </div>
            <p class="section-lede">Tap any card to see what the module does and preview its screens, right here.</p>
          </div>
          ${modulesHTML()}
        </div>
      </section>

      <section class="section" id="spotlight">
        <div class="container spotlight">
          <div class="reveal">
            <span class="tag-new">Featured workflow</span>
            <h2>${esc(spot.title)}</h2>
            <p class="lede">${esc(spot.intro)}</p>
            ${stepsHTML(spot, 'spot')}
            <a class="link-arrow" href="#/m/${spot.id}">See ${esc(spot.title)} in detail ${ARROW}</a>
          </div>
          <div class="stage">
            <div class="stage-blob" style="background-image:url('${PHOTOS.spotlight}')"></div>
            <div class="stage-device" id="spot-device"></div>
          </div>
        </div>
      </section>


      <section class="cta">
        <div class="cta-bg" style="background-image:url('${PHOTOS.cta}')"></div>
        <div class="container">
          <div class="cta-inner reveal">
            <h2>See Antz with your own collection</h2>
            <p>A 30-minute walkthrough, built around the species, sites and teams you already manage.</p>
            <div class="actions">
              <a class="btn btn-primary" href="mailto:hello@antz.systems?subject=Antz%20walkthrough">Book a walkthrough</a>
              <button class="btn btn-light" type="button" data-scroll="index">Back to the modules</button>
            </div>
            <p class="or">Or write to <b>hello@antz.systems</b></p>
          </div>
        </div>
      </section>

      <section class="section" id="faq">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">FAQ</span>
            <h2 class="section-title">Questions teams ask first</h2>
          </div>
          <div class="faq">
            ${faqs.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}</summary><p class="answer">${esc(a)}</p></details>`).join('')}
          </div>
        </div>
      </section>`;

    bindParallax();
    bindSteps(spot, 'spot', document.getElementById('spot-device'));
    bindModules(!!returning);
    bindSearch();
    app.querySelectorAll('.chip[data-area]').forEach((c) =>
      c.addEventListener('click', () => { filterArea(c.dataset.area); scrollToId('index'); }));
  }

  /* ---------- Module cards: grouped by area, open in place ---------- */
  const AREA_TINT = { records: 'butter', animal: 'coral', medical: 'teal', mortality: 'sky', operations: 'leaf' };
  /* Outline gradients: the area's line colour, melting into a deeper tone of its complementary hue (matches the panel backgrounds) */
  const OUTLINE_GRADS = {
    butter: ['#C49424', '#8C80D6'], coral: ['#D2704F', '#3AA89E'], teal: ['#349E86', '#DE876A'],
    sky: ['#468DAE', '#D6964A'], leaf: ['#34A95E', '#AE78BE']
  };
  /* One short line per card, derived from the intro until real taglines exist */
  const summary = (m) => {
    let t = m.raw
      .replace(/^On the (app|web console),\s*/i, '')
      .replace(/^The web companion to [^—]+—\s*/, '')
      .replace(/^The web companion\s+/, '')
      .replace(/^The\s+.*?\b(module|feature)\s+(is\s+(designed to|a|the)\s+)?/i, '');
    t = tidy(t.split(/\s—\s|\.\s/)[0]).replace(/[.,]\s*$/, '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const numberOf = Object.fromEntries(areas.flatMap((a) => a.modules).map((m, i) => [m.id, String(i + 1).padStart(2, '0')]));
  /* Brand icons from References/icons */
  const BRAND_ICONS = ['announcement', 'collections', 'communication', 'compliance', 'diet', 'egg', 'housing', 'lab_research', 'medical', 'necropsy', 'pharmacy', 'users'];
  const MODULE_ICON = {
    'notes-module': 'communication', 'user-management': 'users', collection: 'collections', housing: 'housing',
    'medical-records': 'medical', 'hospital-information-management-system-app': 'medical', 'hospital-information-management-system-web': 'medical',
    necropsy: 'necropsy', 'egg-management-app': 'egg', 'egg-management-web': 'egg', announcement: 'announcement',
    lab: 'lab_research', diet: 'diet', 'pharmacy-app': 'pharmacy', 'pharmacy-web': 'pharmacy', compliance: 'compliance',
    /* Added to match: Material Symbols Outlined, weight 600, same 50px framing as the set above */
    'animal-management': 'cruelty_free', 'tags-hub': 'sell', 'animal-transfer': 'local_shipping', approvals: 'approval',
    'missing-escaped-animal': 'crisis_alert', 'symptoms-clinical-assessment-prescription': 'stethoscope',
    'administer-medicine': 'medication_liquid', vaccination: 'vaccines', deworming: 'pest_control', supplements: 'nutrition',
    mortality: 'heart_minus', 'fetal-death': 'heart_broken', 'helpdesk-module': 'support_agent', security: 'verified_user',
    'reports-app': 'analytics', 'reports-web': 'summarize'
  };
  const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  /* Every module has an icon now; the fallback only covers modules added later */
  const iconOf = (m) => MODULE_ICON[m.id] || BRAND_ICONS[hash(m.id) % BRAND_ICONS.length];
  /* Two photos, cropped and mirrored six ways so neighbouring cards differ */
  const PHOTO_VARIANTS = [
    { src: 'collections_bg', pos: '30% 40%', flip: 1 },
    { src: 'housing_bg', pos: '46% 26%', flip: 1 },
    { src: 'collections_bg', pos: '62% 72%', flip: -1 },
    { src: 'housing_bg', pos: '80% 62%', flip: -1 },
    { src: 'collections_bg', pos: '18% 24%', flip: -1 },
    { src: 'housing_bg', pos: '12% 45%', flip: 1 }
  ];
  /* Module photos from References/icon_backgrounds/card images (web copies in assets/cards).
     Modules without their own photo fall back to a PHOTO_VARIANTS crop. */
  const CARD_PHOTOS = new Set(['notes-module', 'user-management', 'housing', 'animal-transfer', 'approvals', 'missing-escaped-animal',
    'medical-records', 'symptoms-clinical-assessment-prescription', 'administer-medicine', 'vaccination', 'deworming', 'supplements',
    'hospital-information-management-system-app', 'hospital-information-management-system-web', 'mortality', 'necropsy', 'fetal-death',
    'egg-management-app', 'egg-management-web', 'announcement', 'helpdesk-module', 'security', 'reports-app', 'reports-web', 'lab', 'diet',
    'pharmacy-app', 'pharmacy-web', 'compliance']);
  const CARD_PHOTO_POS = { announcement: '50% 22%', 'user-management': '50% 40%', 'fetal-death': '50% 45%' };
  const photoIndex = Object.fromEntries(areas.flatMap((a) => a.modules).map((m, i) => [m.id, i]));
  const thumbHTML = (m) => {
    const v = CARD_PHOTOS.has(m.id)
      ? { url: `assets/cards/${m.id}.jpg`, pos: CARD_PHOTO_POS[m.id] || '50% 50%', flip: 1 }
      : (({ src, pos, flip }) => ({ url: `assets/icon-bg/${src}.jpg`, pos, flip }))(PHOTO_VARIANTS[photoIndex[m.id] % PHOTO_VARIANTS.length]);
    return `<span class="mcard-thumb">
      <span class="mcard-bg" style="background-image:url('${v.url}');background-position:${v.pos};--flip:${v.flip}"></span>
      <img class="mcard-icon" src="assets/icons/${iconOf(m)}_icon.svg" alt="">
      <span class="mcard-num">${numberOf[m.id]}</span>
    </span>`;
  };
  /* Hover border: one path that starts at the bottom-left corner and closes there */
  const borderPath = (w, h, r, i = 2) => {
    const R = Math.max(r - i, 0), L = i, T = i, Rt = w - i, B = h - i;
    return `M${L},${B - R} V${T + R} A${R},${R} 0 0 1 ${L + R},${T} H${Rt - R} A${R},${R} 0 0 1 ${Rt},${T + R} V${B - R} A${R},${R} 0 0 1 ${Rt - R},${B} H${L + R} A${R},${R} 0 0 1 ${L},${B - R} Z`;
  };

  /* Module card: a link to the module's own page */
  const mcardHTML = (m) => `
    <article class="mcard" data-id="${m.id}">
      <a class="mcard-face" href="#/m/${m.id}">
        ${thumbHTML(m)}
        <span class="mcard-body">
          <span class="mcard-title">${esc(m.title)}</span>
          <span class="mcard-sum">${esc(summary(m))}</span>
          <span class="mcard-foot"><span>${m.features.length} features</span><span class="mcard-plus" aria-hidden="true"></span></span>
        </span>
        <svg class="drawn-border" aria-hidden="true"></svg>
      </a>
    </article>`;

  function modulesHTML() {
    const total = areas.reduce((t, a) => t + a.modules.length, 0);
    return `
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        ${Object.entries(OUTLINE_GRADS).map(([k, [a, b]]) => `<linearGradient id="line-${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".3" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join('')}
      </defs></svg>
      <div class="mfilters" role="toolbar" aria-label="Filter modules by area">
        <button class="mfilter" type="button" data-area="all" aria-pressed="true">All <span>${total}</span><svg class="drawn-border" aria-hidden="true"></svg></button>
        ${areas.map((a) => `<button class="mfilter" type="button" data-area="${a.id}" aria-pressed="false">${icon(a.glyph)}${esc(a.label)} <span>${a.modules.length}</span><svg class="drawn-border" aria-hidden="true"></svg></button>`).join('')}
      </div>
      <div class="mgroups">
        ${areas.map((a) => `
          <section class="mgroup tint-${AREA_TINT[a.id]}" data-area="${a.id}" aria-labelledby="mg-${a.id}">
            <header class="mgroup-head">
              <span class="ic">${icon(a.glyph)}</span>
              <h3 id="mg-${a.id}">${esc(a.label)}</h3>
              <span class="count">${a.modules.length} modules</span>
            </header>
            <div class="mgrid">${a.modules.map(mcardHTML).join('')}</div>
          </section>`).join('')}
      </div>`;
  }

  let pageTeardown = null;
  const narrow = () => matchMedia('(max-width: 760px)').matches;

  function filterArea(id) {
    app.querySelectorAll('.mfilter').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.area === id)));
    app.querySelectorAll('.mgroup').forEach((g) => { g.hidden = id !== 'all' && g.dataset.area !== id; });
    /* Replay the entrance for groups on screen; groups off screen (e.g. filtered from the banner) reveal when scrolled to */
    if (DEAL_ENABLED && !reducedMotion()) app.querySelectorAll('.mgroup:not([hidden])').forEach((g) => {
      const r = g.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { if (dealObserver) dealObserver.unobserve(g); dealGroup(g); }
      else if (dealObserver && g.querySelector('.mcard.pending')) dealObserver.observe(g);
    });
  }

  /* Module page: pick a feature to see its screen. On desktop the device stays beside the title;
     on phones it moves under the selected feature. The choice is kept in the URL so the link can be shared. */
  function bindFeatures(root, m, start = 0) {
    const inner = root.querySelector('.mpanel-inner');
    const stage = root.querySelector('.mpanel-stage');
    const feats = [...root.querySelectorAll('.mfeat')];
    const current = () => feats.findIndex((b) => b.getAttribute('aria-pressed') === 'true');
    const select = (i, fromUser) => {
      feats.forEach((b, j) => { b.setAttribute('aria-pressed', String(i === j)); b.parentElement.classList.toggle('on', i === j); });
      if (fromUser) history.replaceState(null, '', `#/m/${m.id}/${i}`);
      if (!stage) return;
      const f = m.features[i];
      const src = f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src);
      const holder = stage.querySelector('.mpanel-device');
      const shot = src ? shotFor(m, src) : null;
      const cur = holder.firstElementChild;
      const kind = shot ? deviceHTML(shot).match(/class="device ([\w-]+)/)[1] : '';
      if (cur && shot && cur.classList.contains(kind)) {
        /* Same device: swap the screen and replay the rise, so every feature selection feels the same */
        const img = cur.querySelector('img');
        img.src = shot.src; img.alt = shot.alt || '';
        cur.classList.remove('rise'); void cur.offsetWidth; cur.classList.add('rise');
      } else {
        /* First view (or a different device): the device rises from below and settles */
        holder.innerHTML = shot ? deviceHTML(shot) : '';
        if (holder.firstElementChild) holder.firstElementChild.classList.add('rise');
      }
      stage.querySelector('.cap').textContent = tidyTitle(f.title);
      /* On phones the screen goes under the tapped feature, where the eye already is */
      if (narrow()) {
        const row = feats[i].parentElement;
        if (stage.parentElement !== row) {
          keepInPlace(row, () => row.append(stage));
          const dev = holder.firstElementChild;
          if (dev) { dev.classList.remove('rise'); void dev.offsetWidth; dev.classList.add('rise'); }
        }
      } else if (stage.parentElement !== inner) inner.append(stage);
    };
    feats.forEach((b, i) => {
      b.addEventListener('click', () => select(i, true));
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + feats.length) % feats.length;
        feats[n].focus(); select(n, true);
      });
    });
    if (stage) bindGalleryTrigger(stage, m, current);
    select(Math.min(start, feats.length - 1));

    /* Re-place the device when the layout changes */
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => select(current()), 120); };
    window.addEventListener('resize', onResize);
    pageTeardown = () => { window.removeEventListener('resize', onResize); pageTeardown = null; };
  }

  /* Drawn border with feathered ends, shared by module cards and filter chips.
     FEATHER_LAYERS copies of the path are stacked; layer j starts j steps later and ends j steps
     earlier, with opacity 1/(N-j), so opacity ramps linearly from 0 to 1 over the feather length
     at both the starting end and the travelling end. The feather closes to zero as the loop completes. */
  const FEATHER_LAYERS = 16;
  const DRAW_MS = 1250, UNDRAW_MS = 650;
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const borderState = new WeakMap();

  function paintBorder(el, p) {
    const st = borderState.get(el);
    if (!st || !st.len) return;
    /* Fully drawn: use a solid closed stroke so the start and end join without a dash seam */
    if (p >= 0.999) { st.paths.forEach((path) => { path.setAttribute('stroke-dasharray', 'none'); path.setAttribute('stroke-dashoffset', '0'); }); return; }
    const f = Math.min(st.feather / st.len, p / 2) * Math.min(1, (1 - p) / 0.08);
    st.paths.forEach((path, j) => {
      const inset = (f * j) / FEATHER_LAYERS;
      path.setAttribute('stroke-dasharray', `${Math.max(p - 2 * inset, 0)} 2`);
      path.setAttribute('stroke-dashoffset', `${-inset}`);
    });
  }
  function animateBorder(el) {
    const st = borderState.get(el);
    if (!st) return;
    const target = st.isOn() ? 1 : 0;
    if (st.target === target && (st.raf || st.p === target)) return;
    st.target = target;
    cancelAnimationFrame(st.raf);
    if (reducedMotion()) { st.p = target; paintBorder(el, st.p); st.raf = 0; return; }
    const from = st.p, dur = (target ? st.drawMs : st.undrawMs) * Math.abs(target - from);
    const t0 = performance.now();
    const step = (now) => {
      const t = dur ? Math.min((now - t0) / dur, 1) : 1;
      st.p = from + (target - from) * easeInOut(t);
      paintBorder(el, st.p);
      st.raf = t < 1 ? requestAnimationFrame(step) : 0;
    };
    st.raf = requestAnimationFrame(step);
  }

  /* opts.over: draw on top of the element's own border (chips) instead of inside it (cards) */
  function fitBorder(el, opts) {
    const cs = getComputedStyle(el);
    const bw = parseFloat(cs.borderTopWidth) || 0;
    const w = opts.over ? el.offsetWidth : el.clientWidth;
    const h = opts.over ? el.offsetHeight : el.clientHeight;
    if (!w || !h) return;
    const outerR = parseFloat(cs.borderTopLeftRadius) || 0;
    const r = Math.min(opts.over ? outerR : outerR - bw, h / 2, w / 2);
    const svg = el.querySelector('.drawn-border');
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.style.left = svg.style.top = opts.over ? `${-bw}px` : '0px';
    /* stroke may depend on screen size; bleed widens it past the clipped edge so no background shows at rounded corners */
    const stroke = typeof opts.stroke === 'function' ? opts.stroke() : opts.stroke;
    const sw = stroke + (opts.bleed || 0), inset = stroke / 2 - (opts.bleed || 0) / 2;
    const d = opts.path ? opts.path(w, h, r, inset) : borderPath(w, h, r, inset);
    let st = borderState.get(el);
    if (!st) {
      svg.innerHTML = Array.from({ length: FEATHER_LAYERS }, (_, j) =>
        `<path pathLength="1" stroke-width="${sw}" stroke-dasharray="0 2" stroke-opacity="${(1 / (FEATHER_LAYERS - j)).toFixed(4)}"/>`).join('');
      st = { p: 0, target: 0, raf: 0, paths: [...svg.children], feather: opts.feather, drawMs: opts.drawMs || DRAW_MS, undrawMs: opts.undrawMs || UNDRAW_MS, isOn: opts.isOn };
      borderState.set(el, st);
      if (!opts.noHover) ['pointerenter', 'pointerleave', 'focus', 'blur'].forEach((ev) => el.addEventListener(ev, () => animateBorder(el)));
    }
    st.paths.forEach((path) => { path.setAttribute('d', d); path.setAttribute('stroke-width', sw); });
    st.len = st.paths[0].getTotalLength();
    paintBorder(el, st.p);
  }

  /* 1.4px on every screen size */
  const CARD_BORDER = { stroke: () => 1.4, bleed: 1, feather: 64, isOn: null };
  const CHIP_BORDER = { stroke: 1, feather: 28, over: true, drawMs: 900, undrawMs: 500 };
  let borderObserver = null;
  function sizeBorders() {
    if (borderObserver) borderObserver.disconnect();
    const targets = [
      ...[...app.querySelectorAll('.mcard-face')].map((el) => [el, { ...CARD_BORDER,
        isOn: () => (el.matches(':hover') && canHover()) || el.matches(':focus-visible') }]),
      ...[...app.querySelectorAll('.mfilter, .hero-chips .chip')].map((el) => [el, { ...CHIP_BORDER,
        isOn: () => el.matches(':hover') || el.matches(':focus-visible') }])
    ];
    const optsOf = new Map(targets);
    targets.forEach(([el, o]) => fitBorder(el, o));
    if ('ResizeObserver' in window) {
      borderObserver = new ResizeObserver((entries) => entries.forEach((e) => fitBorder(e.target, optsOf.get(e.target))));
      targets.forEach(([el]) => borderObserver.observe(el));
    }
  }
  
  /* Card entrance, played once per area as it first scrolls into view.
     Cards in a group below the fold wait (hidden) until the group scrolls into view. */
  /* Soft rise: each card fades up 12px, staggered left to right */
  const DEAL_ENABLED = true;
  const DEAL_STEP_MS = 40, DEAL_MAX_STEPS = 10;
  let dealObserver = null;
  function dealGroup(group) {
    [...group.querySelectorAll('.mcard')].forEach((card, i) => {
      card.style.setProperty('--deal-delay', `${Math.min(i, DEAL_MAX_STEPS) * DEAL_STEP_MS}ms`);
      card.classList.remove('deal', 'pending'); void card.offsetWidth;
      card.classList.add('deal');
      card.addEventListener('animationend', function done(e) {
        if (e.target !== card) return;
        card.removeEventListener('animationend', done);
        card.classList.remove('deal');
      });
    });
  }
  function setupDealing(skip) {
    if (dealObserver) dealObserver.disconnect();
    if (!DEAL_ENABLED || skip || reducedMotion() || !('IntersectionObserver' in window)) return;
    dealObserver = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      dealObserver.unobserve(en.target);
      dealGroup(en.target);
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    app.querySelectorAll('.mgroup').forEach((g) => {
      g.querySelectorAll('.mcard').forEach((c) => c.classList.add('pending'));
      dealObserver.observe(g);
    });
  }

  /* Publish the sticky filter bar's height so pinned content can sit below it */
  let filtersObserver = null;
  function trackFilterBar() {
    const bar = app.querySelector('.mfilters');
    if (!bar) return;
    const set = () => document.documentElement.style.setProperty('--mfilters-h', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    set();
    if (filtersObserver) filtersObserver.disconnect();
    if ('ResizeObserver' in window) { filtersObserver = new ResizeObserver(set); filtersObserver.observe(bar); }
  }

  function bindModules(returning) {
    trackFilterBar();
    sizeBorders();
    setupDealing(returning);
    app.querySelectorAll('.mfilter').forEach((b) => b.addEventListener('click', () => filterArea(b.dataset.area)));
  }

  /* ---------- Click-driven feature steps with a device preview ---------- */
  function stepsHTML(m, key) {
    return `<ol class="steps" role="tablist" aria-label="${esc(m.title)} features">
      ${m.features.map((f, i) => `
        <li class="step" role="tab" tabindex="${i === 0 ? 0 : -1}" data-key="${key}" data-i="${i}" aria-selected="${i === 0}">
          <span class="n">${i + 1}</span>
          <div><h3>${esc(f.title)}</h3><p>${esc(tidy(f.desc))}</p></div>
        </li>`).join('')}
    </ol>`;
  }
  /* Keep an element's position on screen steady while content above it changes */
  const keepInPlace = (el, change) => {
    const before = el.getBoundingClientRect().top;
    change();
    const diff = el.getBoundingClientRect().top - before;
    if (Math.abs(diff) > 1) window.scrollBy(0, diff);
  };

  function bindSteps(m, key, stage, start = 0, caption) {
    const steps = [...app.querySelectorAll(`.step[data-key="${key}"]`)];
    /* On phones the device (with its frame and caption) moves under the selected step */
    const wrap = stage && (stage.closest('.mod-stage') || stage.closest('.stage'));
    const home = wrap && { parent: wrap.parentElement, next: wrap.nextSibling };
    const place = (i) => {
      if (!wrap) return;
      if (narrow()) { if (wrap.parentElement !== steps[i]) steps[i].append(wrap); }
      else if (wrap.parentElement !== home.parent) home.parent.insertBefore(wrap, home.next);
    };
    let current = -1;
    const show = (i, fromUser) => {
      steps.forEach((s, j) => { s.setAttribute('aria-selected', String(i === j)); s.tabIndex = i === j ? 0 : -1; });
      const f = m.features[i];
      const src = f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src);
      if (stage) stage.innerHTML = src ? deviceHTML(shotFor(m, src)) : '';
      if (caption) caption.textContent = f.title;
      if (fromUser && narrow()) keepInPlace(steps[i], () => place(i)); else place(i);
      current = i;
    };
    if (wrap) {
      let t;
      window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { if (wrap.isConnected && current >= 0) place(current); }, 150); });
    }
    steps.forEach((s, i) => {
      /* Taps on the device inside the step open the gallery instead of re-selecting */
      s.addEventListener('click', (e) => { if (wrap && wrap.contains(e.target)) return; if (i !== current) show(i, true); });
      s.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, true); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + steps.length) % steps.length;
          steps[n].focus(); show(n, true);
        }
      });
    });
    if (stage) bindGalleryTrigger(stage, m, () => steps.findIndex((x) => x.getAttribute('aria-selected') === 'true'));
    show(Math.min(start, steps.length - 1));
  }

  /* ---------- Module page ---------- */
  /* Module page tabs: one tab per area, each with a photo from one of its modules,
     and under it one tab per module in the current area */
  const allModules = areas.flatMap((a) => a.modules);
  const areaPhoto = Object.fromEntries(areas.map((a) => {
    const rep = a.modules.find((x) => CARD_PHOTOS.has(x.id)) || a.modules[0];
    return [a.id, { url: `assets/cards/${rep.id}.jpg`, pos: CARD_PHOTO_POS[rep.id] || '50% 50%', icon: iconOf(rep) }];
  }));
  /* Module chips look and behave like the home page's filter chips (.mfilter): rise and drawn border on hover,
     gradient fill sweeping in when selected. mark = false renders none selected, so the fill can sweep in after. */
  const subTabsHTML = (cur, mark = true) => areaById[cur.track].modules.map((x) => `
    <a class="msubtab mfilter" href="#/m/${x.id}"${mark && x === cur ? ' aria-current="page"' : ''}><span class="n">${numberOf[x.id]}</span>${esc(x.title)}<svg class="drawn-border" aria-hidden="true"></svg></a>`).join('');
  const markSubTab = (sub, cur) => sub.querySelectorAll('.msubtab').forEach((x) => {
    if (x.getAttribute('href') === `#/m/${cur.id}`) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current');
  });
  const moduleTabsHTML = (cur) => `
    <nav class="mtabs" aria-label="Module areas and modules">
      <div class="mtabs-areas">${areas.map((a) => {
        const ph = areaPhoto[a.id];
        const here = a.id === cur.track;
        return `
        <a class="mtab tint-${AREA_TINT[a.id]}" href="#/m/${here ? cur.id : a.modules[0].id}"${here ? ' aria-current="true"' : ''}>
          <span class="mtab-thumb" style="background-image:url('${ph.url}');background-position:${ph.pos}"><img src="assets/icons/${ph.icon}_icon.svg" alt=""></span>
          <span class="mtab-text"><b>${esc(a.label)}</b><small>${a.modules.length} modules</small></span>
        </a>`;
      }).join('')}
        <span class="mtab-ind" aria-hidden="true"></span>
      </div>
      <div class="msubtabs" data-area="${cur.track}">${subTabsHTML(cur)}</div>
    </nav>`;

  /* Tab rows that scroll sideways fade the edge where more tabs are hidden, and a mouse wheel scrolls them */
  const bindTabRow = (row) => {
    const edges = () => {
      row.classList.toggle('more-l', row.scrollLeft > 2);
      row.classList.toggle('more-r', row.scrollLeft < row.scrollWidth - row.clientWidth - 2);
    };
    row.addEventListener('scroll', edges, { passive: true });
    row.addEventListener('wheel', (e) => {
      if (row.scrollWidth <= row.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      row.scrollLeft += e.deltaY;
    }, { passive: false });
    row._edges = edges;
  };
  /* Bring a row's current tab to the middle (sideways only, so the page itself never moves) */
  const centreTab = (row, smooth) => {
    const cur = row.querySelector('[aria-current]');
    if (!cur || row.scrollWidth <= row.clientWidth) { row._edges(); return; }
    row.scrollTo({ left: cur.offsetLeft - (row.clientWidth - cur.offsetWidth) / 2, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
    row._edges();
  };
  /* The selected-tab outline is one element that glides and resizes between tabs, taking on each area's colour */
  const placeIndicator = (nav, animate) => {
    const ind = nav.querySelector('.mtab-ind'), tab = nav.querySelector('.mtab[aria-current]');
    if (!ind || !tab) return;
    ind.classList.toggle('still', !animate);
    ind.style.setProperty('--edge', getComputedStyle(tab).getPropertyValue('--edge'));
    ind.style.width = `${tab.offsetWidth}px`;
    ind.style.height = `${tab.offsetHeight}px`;
    ind.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
    if (!animate) { void ind.offsetWidth; ind.classList.remove('still'); }
  };
  /* Point the (kept) tab bar at the current module; animate says whether things glide or snap */
  function syncTabs(nav, cur, animate) {
    nav.querySelectorAll('.mtab').forEach((t, i) => {
      const a = areas[i], here = a.id === cur.track;
      t.setAttribute('href', `#/m/${here ? cur.id : a.modules[0].id}`);
      if (here) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    const sub = nav.querySelector('.msubtabs');
    const sweep = animate && !reducedMotion();
    if (sub.dataset.area !== cur.track) {
      sub.dataset.area = cur.track;
      sub.innerHTML = subTabsHTML(cur, !sweep);
      sub.scrollLeft = 0;
      /* New area: its chips fade up, then the current one fills */
      if (sweep) {
        sub.classList.remove('swap'); void sub.offsetWidth; sub.classList.add('swap');
        setTimeout(() => { if (sub.isConnected) markSubTab(sub, cur); }, 220);
      }
    } else markSubTab(sub, cur);
    sizeBorders();
    const rows = [nav.querySelector('.mtabs-areas'), sub];
    if (!nav._bound) {
      nav._bound = true;
      rows.forEach(bindTabRow);
      /* Web fonts or a new width can change tab sizes: follow without animating */
      if ('ResizeObserver' in window) new ResizeObserver(() => { placeIndicator(nav, false); rows.forEach((r) => r._edges()); }).observe(nav);
    }
    placeIndicator(nav, animate);
    rows.forEach((r) => centreTab(r, animate));
  }

  function renderModule(id, featureIndex) {
    const m = byId[id];
    if (!m || !visible.includes(m)) { location.hash = '#/'; return; }
    const area = areaById[m.track];
    const tint = AREA_TINT[m.track];
    /* Previous / next run through every module in order, crossing into the next area at the end of one */
    const k = allModules.indexOf(m);
    const prev = allModules[k - 1], next = allModules[k + 1];
    const pagerLink = (x, dir) => x ? `
      <a class="mpager-link ${dir}" href="#/m/${x.id}">
        <small>${dir === 'prev' ? 'Previous' : 'Next'}${x.track !== m.track ? ` · ${esc(areaById[x.track].label)}` : ''}</small>
        <b>${dir === 'prev' ? '← ' : ''}${esc(x.title)}${dir === 'next' ? ' →' : ''}</b>
      </a>` : '<span></span>';
    const hasShots = m.features.some((f) => f.shot) || m.shots.length > 0;

    const html = `
      <section class="mpage tint-${tint}">
        <div class="container">
          ${moduleTabsHTML(m)}
          <span class="mpanel-area">${icon(area.glyph)}${esc(area.label)} · ${numberOf[m.id]}</span>
          <div class="mpanel-inner${hasShots ? '' : ' no-stage'}">
            <div class="mpanel-info">
              <h1 class="mpanel-title"><span class="mpanel-icon"><img src="assets/icons/${iconOf(m)}_icon.svg" alt=""></span>${esc(m.title)}</h1>
              <p class="mpanel-intro">${esc(m.intro)}</p>
              <ol class="mfeats" aria-label="Features">
                ${m.features.map((f, i) => `
                  <li class="mfeat-row">
                    <button class="mfeat" type="button" data-i="${i}" aria-pressed="false">
                      <span class="n">${i + 1}</span>
                      <span class="t"><b>${esc(tidyTitle(f.title))}</b><small>${esc(tidy(f.desc))}</small></span>
                    </button>
                  </li>`).join('')}
              </ol>
              <p class="mpanel-hint">${hasShots ? (canHover() ? 'Click a feature to preview its screen' : 'Tap a feature to preview its screen') : 'Screens for this module are coming soon'}</p>
            </div>
            ${hasShots ? '<div class="mpanel-stage"><div class="mpanel-device"></div><p class="cap"></p><p class="zoom-hint">Tap the screen to zoom</p></div>' : ''}
          </div>
          <nav class="mpager" aria-label="Previous and next module">${pagerLink(prev, 'prev')}${pagerLink(next, 'next')}</nav>
        </div>
      </section>`;

    /* Coming from another module page: keep the live page and its tab bar, so the selected tab glides
       to its new place and the area colours blend; only the content under the tabs is replaced */
    const page = app.querySelector('.mpage');
    const kept = page && page.querySelector('.mtabs');
    if (kept) {
      const tpl = document.createElement('template');
      tpl.innerHTML = html;
      const next = tpl.content.querySelector('.mpage');
      const box = page.querySelector(':scope > .container');
      page.className = next.className;
      [...box.children].forEach((c) => { if (c !== kept) c.remove(); });
      [...next.querySelector(':scope > .container').children].forEach((c) => {
        if (c.classList.contains('mtabs')) return;
        if (!reducedMotion()) c.classList.add('swap-in');
        box.append(c);
      });
      syncTabs(kept, m, true);
    } else {
      app.innerHTML = html;
      syncTabs(app.querySelector('.mtabs'), m, false);
    }
    bindFeatures(app.querySelector('.mpage'), m, featureIndex || 0);
    document.title = `${m.title} · Antz Onboarding`;
  }

  /* ---------- Search ---------- */
  const index = visible.flatMap((m) => [
    { m, i: 0, title: m.title, text: m.intro, kind: 'Module' },
    ...m.features.map((f, i) => ({ m, i, title: f.title, text: f.desc, kind: m.title }))
  ]);
  function bindSearch() {
    const q = document.getElementById('q');
    const box = document.getElementById('q-results');
    const clear = app.querySelector('.search-clear');
    let active = -1;
    const hl = (s, term) => esc(s).replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
    const close = () => { box.classList.remove('show'); q.setAttribute('aria-expanded', 'false'); active = -1; };
    const run = () => {
      const term = q.value.trim().toLowerCase();
      clear.classList.toggle('show', !!term);
      if (term.length < 2) return close();
      const hits = index
        .map((r) => {
          const t = r.title.toLowerCase(), x = r.text.toLowerCase();
          const score = t.startsWith(term) ? 3 : t.includes(term) ? 2 : x.includes(term) ? 1 : 0;
          return { ...r, score: score + (r.kind === 'Module' && score ? .5 : 0) };
        })
        .filter((r) => r.score)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      box.innerHTML = (hits.length ? '<div class="sr-head">Top results</div>' : '') + (hits.length
        ? hits.map((r) => `<a role="option" href="#/m/${r.m.id}/${r.i}"><div class="r-title">${hl(r.title, term)}</div><div class="r-meta">${esc(r.kind === 'Module' ? areaById[r.m.track].label : r.kind)}</div></a>`).join('')
        : `<div class="empty">No matches for “${esc(q.value)}”. Try “animal”, “egg” or “report”.</div>`);
      box.classList.add('show'); q.setAttribute('aria-expanded', 'true'); active = -1;
    };
    q.addEventListener('input', run);
    q.addEventListener('focus', run);
    q.addEventListener('keydown', (e) => {
      const items = [...box.querySelectorAll('a')];
      if (e.key === 'Escape') return close();
      if (!items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle('active', i === active));
      }
      if (e.key === 'Enter') { e.preventDefault(); (items[active] || items[0]).click(); }
    });
    clear.addEventListener('click', () => { q.value = ''; run(); q.focus(); });
    rotatePlaceholder(q);
    document.addEventListener('click', (e) => { if (!e.target.closest('.hero-search')) close(); });
  }

  /* Hero parallax: the photo drifts slower than the page, content rides over it */
  let parallaxOff = null;
  function bindParallax() {
    if (parallaxOff) parallaxOff();
    const hero = app.querySelector('.hero');
    const bg = hero && hero.querySelector('.hero-bg');
    const inner = hero && hero.querySelector('.hero-inner');
    if (!bg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = hero.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);
      bg.style.transform = `translate3d(0, ${(y * 0.45).toFixed(1)}px, 0)`;
      inner.style.opacity = String(Math.max(0, 1 - y / (h * 1.3)).toFixed(3));
      inner.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    parallaxOff = () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); parallaxOff = null; };
    update();
  }

  /* Rotating placeholder: every visible module, each followed by one of its tasks */
  let phTimer = null;
  function rotatePlaceholder(q) {
    clearInterval(phTimer);
    const field = q.closest('.search-field');
    const rot = field.querySelector('.ph-rot');
    const GENERIC = /filter|search|edit|delet|listing|overview|status|view/i;
    const names = visible.flatMap((m) => {
      const task = m.features.find((f) => !GENERIC.test(f.title) && /\s/.test(f.title.trim()) && f.title.toLowerCase() !== m.title.toLowerCase());
      return task ? [m.title, tidyTitle(task.title)] : [m.title];
    });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    rot.textContent = names[0];
    const sync = () => field.classList.toggle('ph-hidden', !!q.value || document.activeElement === q);
    ['input', 'focus', 'blur'].forEach((ev) => q.addEventListener(ev, sync));
    phTimer = setInterval(() => {
      if (!document.body.contains(rot)) return clearInterval(phTimer);
      if (field.classList.contains('ph-hidden')) return;
      i = (i + 1) % names.length;
      if (reduced) { rot.textContent = names[i]; return; }
      rot.classList.add('out');
      setTimeout(() => {
        rot.textContent = names[i];
        rot.classList.remove('out');
        rot.classList.add('enter');
        void rot.offsetWidth;
        rot.classList.remove('enter');
      }, 260);
    }, 2400);
  }

  /* ---------- Screenshot gallery (phones only) ----------
     Tap a device screen to open every screen of that module full-screen:
     swipe between screens, pinch or double-tap to zoom, drag to pan, swipe down or ✕ to close. */
  const ZOOM_MAX = 4, ZOOM_TAP = 2.5;
  function gallerySlides(m) {
    const seen = new Map();
    const slides = [];
    m.features.forEach((f, i) => {
      const src = f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src);
      if (!src) return;
      if (!seen.has(src)) { seen.set(src, slides.length); slides.push({ src, title: tidyTitle(f.title), desc: tidy(f.desc), alt: shotFor(m, src).alt || f.title }); }
    });
    const featureToSlide = m.features.map((f, i) => seen.get(f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src)) ?? 0);
    return { slides, featureToSlide };
  }
  function bindGalleryTrigger(stage, m, currentFeature) {
    stage.addEventListener('click', (e) => {
      if (!narrow() || !e.target.closest('.device')) return;
      const { slides, featureToSlide } = gallerySlides(m);
      if (slides.length) openGallery(m, slides, featureToSlide[Math.max(0, currentFeature())] || 0, e.target.closest('.device'));
    });
  }

  function openGallery(m, slides, start, returnFocusTo) {
    const g = document.createElement('div');
    g.className = 'gallery';
    g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-label', `${m.title} screens`);
    g.innerHTML = `
      <div class="g-top">
        <span class="g-count" aria-live="polite"></span>
        <span class="g-title">${esc(m.title)}</span>
        <button class="g-close" type="button" aria-label="Close gallery">${CLOSE_SVG}</button>
      </div>
      <div class="g-stage"><div class="g-track"><img class="g-img" alt="" draggable="false"></div></div>
      <div class="g-info"><b class="g-ft"></b><p class="g-fd"></p></div>
      <div class="g-dots">${slides.map((_, i) => `<button type="button" aria-label="Screen ${i + 1}" data-i="${i}"></button>`).join('')}</div>
      <p class="g-hint">Pinch or double-tap to zoom · Swipe to browse</p>`;
    document.body.append(g);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const stageEl = g.querySelector('.g-stage'), track = g.querySelector('.g-track'), img = g.querySelector('.g-img');
    const dots = [...g.querySelectorAll('.g-dots button')];
    let idx = start, scale = 1, tx = 0, ty = 0, baseW = 0, baseH = 0;
    const apply = (anim) => {
      img.style.transition = anim ? 'transform .28s cubic-bezier(.22,.8,.24,1)' : 'none';
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };
    const clampPan = () => {
      const r = stageEl.getBoundingClientRect();
      const mx = Math.max(0, (baseW * scale - r.width) / 2), my = Math.max(0, (baseH * scale - r.height) / 2);
      tx = Math.max(-mx, Math.min(mx, tx)); ty = Math.max(-my, Math.min(my, ty));
    };
    const measure = () => { const s = scale; img.style.transform = 'none'; const b = img.getBoundingClientRect(); baseW = b.width; baseH = b.height; img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`; };
    const resetZoom = (anim) => { scale = 1; tx = 0; ty = 0; apply(anim); g.classList.remove('zoomed'); };
    const go = (i, dir = 0) => {
      idx = (i + slides.length) % slides.length;
      const sl = slides[idx];
      resetZoom(false);
      track.style.transition = 'none';
      track.style.transform = dir ? `translateX(${dir * 40}px)` : 'none';
      track.style.opacity = dir ? '0' : '1';
      img.src = sl.src; img.alt = sl.alt;
      g.querySelector('.g-count').textContent = `${idx + 1} / ${slides.length}`;
      g.querySelector('.g-ft').textContent = sl.title;
      g.querySelector('.g-fd').textContent = sl.desc;
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === idx)));
      requestAnimationFrame(() => {
        track.style.transition = 'transform .32s cubic-bezier(.22,.8,.24,1), opacity .25s ease';
        track.style.transform = 'none'; track.style.opacity = '1';
      });
      [idx + 1, idx - 1].forEach((j) => { const n = slides[(j + slides.length) % slides.length]; if (n) new Image().src = n.src; });
    };
    img.addEventListener('load', measure);

    /* Gestures */
    const pts = new Map();
    let pinch = null, drag = null, lastTap = 0;
    const toStage = (x, y) => { const r = stageEl.getBoundingClientRect(); return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 }; };
    stageEl.addEventListener('pointerdown', (e) => {
      stageEl.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const mid = toStage((a.x + b.x) / 2, (a.y + b.y) / 2);
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: scale, u: { x: (mid.x - tx) / scale, y: (mid.y - ty) / scale } };
        drag = null;
      } else if (pts.size === 1) {
        drag = { x: e.clientX, y: e.clientY, tx, ty, t: Date.now(), moved: false };
      }
    });
    stageEl.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size >= 2) {
        const [a, b] = [...pts.values()];
        const mid = toStage((a.x + b.x) / 2, (a.y + b.y) / 2);
        scale = Math.max(1, Math.min(ZOOM_MAX, pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
        tx = mid.x - pinch.u.x * scale; ty = mid.y - pinch.u.y * scale;
        clampPan(); apply(false); g.classList.toggle('zoomed', scale > 1.01);
      } else if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
        if (scale > 1.01) { tx = drag.tx + dx; ty = drag.ty + dy; clampPan(); apply(false); }
        else if (Math.abs(dy) > Math.abs(dx) && dy > 0) { track.style.transition = 'none'; track.style.transform = `translateY(${dy}px)`; track.style.opacity = String(Math.max(.3, 1 - dy / 400)); }
        else { track.style.transition = 'none'; track.style.transform = `translateX(${dx}px)`; }
      }
    });
    const end = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pinch) {
        if (pts.size < 2) { pinch = null; if (scale < 1.05) resetZoom(true); const p = [...pts.values()][0]; if (p) drag = { x: p.x, y: p.y, tx, ty, t: Date.now(), moved: true }; }
        return;
      }
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y, quick = Date.now() - drag.t < 280;
      const d = drag; drag = null;
      if (!d.moved && quick) {
        /* Tap: a second tap within 300ms toggles zoom at that point */
        const now = Date.now();
        if (now - lastTap < 300) {
          lastTap = 0;
          if (scale > 1.01) resetZoom(true);
          else { const p = toStage(e.clientX, e.clientY); scale = ZOOM_TAP; tx = -p.x * (scale - 1); ty = -p.y * (scale - 1); clampPan(); apply(true); g.classList.add('zoomed'); }
        } else lastTap = now;
        return;
      }
      if (scale > 1.01) return;
      track.style.transition = 'transform .28s cubic-bezier(.22,.8,.24,1), opacity .2s ease';
      if (dy > 110 && Math.abs(dy) > Math.abs(dx)) return close();
      if (dx < -60 && slides.length > 1) return go(idx + 1, 1);
      if (dx > 60 && slides.length > 1) return go(idx - 1, -1);
      track.style.transform = 'none'; track.style.opacity = '1';
    };
    stageEl.addEventListener('pointerup', end);
    stageEl.addEventListener('pointercancel', end);

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(idx + 1, 1);
      if (e.key === 'ArrowLeft') go(idx - 1, -1);
    };
    document.addEventListener('keydown', onKey);
    dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.i, +d.dataset.i > idx ? 1 : -1)));
    function close() {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      g.classList.add('out');
      setTimeout(() => g.remove(), 220);
      if (returnFocusTo && returnFocusTo.focus) returnFocusTo.focus({ preventScroll: true });
    }
    g.querySelector('.g-close').addEventListener('click', close);
    go(start);
    requestAnimationFrame(() => g.classList.add('in'));
    g.querySelector('.g-close').focus({ preventScroll: true });
  }

  /* ---------- Routing, scrolling, reveal ---------- */
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  let pendingScroll = null;
  let onHome = false, homeY = 0, goTop = false;
  function route() {
    const [, name, id, f] = location.hash.split('/');
    closeNav();
    if (pageTeardown) pageTeardown();
    if ((name === 'm' || name === 'kit') && id) {
      if (onHome) homeY = window.scrollY;
      onHome = false;
      if (parallaxOff) parallaxOff();
      if (name === 'kit') renderKit(id); else renderModule(id, Number(f) || 0);
      window.scrollTo(0, 0);
    } else {
      document.title = 'Antz Onboarding';
      const cameBack = !onHome && !goTop && !pendingScroll && homeY;
      renderHome(cameBack);
      onHome = true;
      if (pendingScroll) { const sid = pendingScroll; requestAnimationFrame(() => scrollToId(sid)); pendingScroll = null; }
      else if (cameBack) { document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')); window.scrollTo(0, homeY); }
      else window.scrollTo(0, 0);
      goTop = false;
    }
    syncHeader();
    observeReveal();
  }
  function observeReveal() {
    const els = app.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* The logo and "Home" crumb mean "start over": top of page, nothing open */
  document.addEventListener('click', (e) => { if (e.target.closest('a[href="#/"]:not([data-scroll])')) goTop = true; });

  /* Links marked data-scroll go to a home-page section, from any page */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-scroll]');
    if (!a) return;
    e.preventDefault();
    const id = a.dataset.scroll;
    if (document.getElementById(id)) { closeNav(); scrollToId(id); }
    else { pendingScroll = id; location.hash = '#/'; }
  });

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); syncHeader(); }
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open));
    syncHeader();
  });

  /* Transparent header: clear at the top, glass once scrolled, white while over the hero photo.
     An open mobile menu always uses the light glass so its dropdown reads as one piece. */
  const header = document.querySelector('.site-header');
  function syncHeader() {
    const hero = app.querySelector('.hero');
    const menuOpen = nav.classList.contains('open');
    const y = window.scrollY;
    const overHero = !!hero && y < hero.offsetHeight - header.offsetHeight;
    header.classList.toggle('scrolled', menuOpen || y > 4);
    header.classList.toggle('menu-open', menuOpen);
    header.classList.toggle('on-dark', overHero && !menuOpen);
  }
  let headerTick = false;
  const onHeaderScroll = () => { if (!headerTick) { headerTick = true; requestAnimationFrame(() => { headerTick = false; syncHeader(); }); } };
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  window.addEventListener('resize', onHeaderScroll);

  window.addEventListener('hashchange', route);
  route();
})();
