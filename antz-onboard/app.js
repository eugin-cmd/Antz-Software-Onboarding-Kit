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
  /* Mouse and trackpad users preview features on hover; touch users tap */
  const canHover = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
  const HOVER_DELAY = 120;
  function hoverSelect(items, current, select) {
    let t;
    items.forEach((el, i) => {
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || !canHover()) return;
        clearTimeout(t);
        t = setTimeout(() => { if (current() !== i) select(i); }, HOVER_DELAY);
      });
      el.addEventListener('pointerleave', () => clearTimeout(t));
    });
  }
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
  const moduleIcon = (m) => icon(AREA_LOOK[m.track] && m.glyph === 'note' ? AREA_LOOK[m.track].glyph : m.glyph);

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
  function renderHome() {
    const about = byId['what-is-antz-systems'];
    const start = byId['getting-started'];
    const spot = byId[SPOTLIGHT_ID];
    const objective = byId['objective-of-this-kit'];
    const firstDay = [
      ['Sign in to your workspace', start.features[0].desc],
      ['Find your way around', start.features[1].desc],
      ['Set up your master data', start.features[3].desc],
      ['Give everyone the right access', 'Create roles that match your organisation and switch permissions on module by module, so each person sees what their work needs.']
    ];
    /* Kit sections: content from content.json (Edition 01, pages 3 to 5) */
    const kitScreen = (m) => (m.shots[0] ? deviceHTML({ ...m.shots[0], device: m.shots[0].device || 'phone' }) : '');
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
            ${areas.map((a) => `<button class="chip" type="button" data-area="${a.id}">${icon(a.glyph)}${esc(a.label)}</button>`).join('')}
          </div>
          <p class="hero-meta">${areas.length} areas of work · Mobile and web</p>
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
            ${firstDay.map(([t, d], i) => `
              <li class="reveal"><span class="dot">${i + 1}</span><div><h3>${esc(t)}</h3><p>${esc(tidy(d))}</p></div></li>`).join('')}
          </ol>
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
    bindModules();
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
  /* Open-panel outline: same route as the cards, with the arrow folded into the top edge at cx */
  /* Arrow size: 17px on desktop, 13px on phones where the gap to the card is smaller; 9px corner radius */
  const NOTCH_R = 9;
  const notchSize = () => (narrow() ? 13 : 17);
  /* The arrow as path commands along the panel's top edge (y = T), with a 9px radius at the tip and at both joins */
  const notchSegment = (cx, T) => {
    const NOTCH_W = notchSize(), NOTCH_H = notchSize();
    const pts = [[cx - NOTCH_W, T], [cx, T - NOTCH_H], [cx + NOTCH_W, T]];
    const prevOf = [[cx - NOTCH_W - 100, T], pts[0], pts[1]], nextOf = [pts[1], pts[2], [cx + NOTCH_W + 100, T]];
    const sweeps = [0, 1, 0];
    return pts.map((P, k) => {
      const a = [prevOf[k][0] - P[0], prevOf[k][1] - P[1]], b = [nextOf[k][0] - P[0], nextOf[k][1] - P[1]];
      const la = Math.hypot(...a), lb = Math.hypot(...b);
      const ua = [a[0] / la, a[1] / la], ub = [b[0] / lb, b[1] / lb];
      const ang = Math.acos(Math.max(-1, Math.min(1, ua[0] * ub[0] + ua[1] * ub[1])));
      const t = NOTCH_R / Math.tan(ang / 2);
      const q0 = [P[0] + ua[0] * t, P[1] + ua[1] * t], q1 = [P[0] + ub[0] * t, P[1] + ub[1] * t];
      return `L${q0[0].toFixed(2)},${q0[1].toFixed(2)} A${NOTCH_R},${NOTCH_R} 0 0 ${sweeps[k]} ${q1[0].toFixed(2)},${q1[1].toFixed(2)}`;
    }).join(' ');
  };
  const panelPath = (w, h, r, i, cx) => {
    const R = Math.max(r - i, 0), L = i, T = i, Rt = w - i, B = h - i;
    /* Starts at the top-left corner, so the draw begins on screen, next to the open card */
    return `M${L},${T + R} A${R},${R} 0 0 1 ${L + R},${T} ${notchSegment(cx, T)} H${Rt - R} A${R},${R} 0 0 1 ${Rt},${T + R} V${B - R} A${R},${R} 0 0 1 ${Rt - R},${B} H${L + R} A${R},${R} 0 0 1 ${L},${B - R} Z`;
  };
  /* Filled arrow in the panel colour; reaches 3px below the edge to hide the panel's resting 1px border there */
  const notchFill = (cx, T, NOTCH_W = notchSize()) => `M${cx - NOTCH_W - 12},${T + 3} L${cx - NOTCH_W - 12},${T} ${notchSegment(cx, T)} L${cx + NOTCH_W + 12},${T} L${cx + NOTCH_W + 12},${T + 3} Z`;
  /* Hover border: one path that starts at the bottom-left corner and closes there */
  const borderPath = (w, h, r, i = 2) => {
    const R = Math.max(r - i, 0), L = i, T = i, Rt = w - i, B = h - i;
    return `M${L},${B - R} V${T + R} A${R},${R} 0 0 1 ${L + R},${T} H${Rt - R} A${R},${R} 0 0 1 ${Rt},${T + R} V${B - R} A${R},${R} 0 0 1 ${Rt - R},${B} H${L + R} A${R},${R} 0 0 1 ${L},${B - R} Z`;
  };

  function modulesHTML() {
    const total = areas.reduce((t, a) => t + a.modules.length, 0);
    return `
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        <linearGradient id="mcard-grad" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#37BD69"/><stop offset="1" stop-color="#00D6C9"/></linearGradient>
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
            <div class="mgrid">${a.modules.map((m) => `
              <article class="mcard" data-id="${m.id}">
                <button class="mcard-face" type="button" aria-expanded="false" aria-controls="mpanel">
                  ${thumbHTML(m)}
                  <span class="mcard-body">
                    <span class="mcard-title">${esc(m.title)}</span>
                    <span class="mcard-sum">${esc(summary(m))}</span>
                    <span class="mcard-foot"><span>${m.features.length} features</span><span class="mcard-plus" aria-hidden="true"></span></span>
                  </span>
                  <svg class="drawn-border" aria-hidden="true"></svg>
                </button>
              </article>`).join('')}
            </div>
          </section>`).join('')}
      </div>`;
  }

  let openCardId = null;
  let panelTeardown = null;
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
    const openCard = openCardId && app.querySelector(`.mcard[data-id="${openCardId}"]`);
    if (openCard && openCard.closest('.mgroup').hidden) closeCard();
  }

  /* The panel sits after the last card on the clicked card's row, so nothing jumps */
  function rowEnd(card) {
    const cards = [...card.parentElement.querySelectorAll(':scope > .mcard')];
    const top = card.offsetTop;
    return cards.filter((c) => c.offsetTop === top).pop() || card;
  }

  /* animate: the panel's border un-draws, then the panel folds away. Switching cards closes instantly. */
  function closeCard(focusBack, animate = false) {
    const panel = document.getElementById('mpanel');
    const card = openCardId && app.querySelector(`.mcard[data-id="${openCardId}"]`);
    if (card) { card.classList.remove('active'); card.querySelector('.mcard-face').setAttribute('aria-expanded', 'false'); refreshBorder(card); }
    if (panel && animate && !reducedMotion()) {
      panel.removeAttribute('id');
      panel.classList.add('closing');
      animateBorder(panel);
      /* Shrink back into the card while the outline un-draws */
      panel.classList.remove('enter');
      void panel.offsetWidth;
      panel.classList.add('leave');
      panel.addEventListener('animationend', (e) => { if (e.target === panel) panel.remove(); });
      setTimeout(() => panel.remove(), 600);
    } else if (panel) panel.remove();
    if (panelTeardown) panelTeardown();
    if (focusBack && card) card.querySelector('.mcard-face').focus();
    openCardId = null;
  }

  function openCard(card, { instant = false, feature = 0 } = {}) {
    const m = byId[card.dataset.id];
    const area = areaById[m.track];
    if (openCardId) closeCard();
    openCardId = m.id;
    card.classList.add('active');
    card.querySelector('.mcard-face').setAttribute('aria-expanded', 'true');
    refreshBorder(card);

    const panel = document.createElement('div');
    panel.className = `mpanel tint-${AREA_TINT[m.track]}${instant ? '' : ' enter'}`;
    panel.id = 'mpanel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', `${m.title} details`);
    const hasShots = m.features.some((f) => f.shot);
    panel.innerHTML = `
      <svg class="drawn-border" aria-hidden="true"></svg>
      <div class="mpanel-inner${hasShots ? '' : ' no-stage'}">
        <button class="mpanel-close" type="button" aria-label="Close ${esc(m.title)}">${CLOSE_SVG}</button>
        <div class="mpanel-info">
          <span class="mpanel-area">${icon(area.glyph)}${esc(area.label)} · ${numberOf[m.id]}</span>
          <h3>${esc(m.title)}</h3>
          <p class="mpanel-intro">${esc(m.intro)}</p>
          <ol class="mfeats" aria-label="Features">
            ${m.features.map((f, i) => `
              <li class="mfeat-row">
                <button class="mfeat" type="button" data-i="${i}" aria-pressed="false">
                  <span class="n">${i + 1}</span>
                  <span class="t"><b>${esc(tidyTitle(f.title))}</b><small>${esc(tidy(f.desc))}</small></span>
                </button>
                <a class="mfeat-go" href="#/m/${m.id}/${i}" aria-label="Open ${esc(tidyTitle(f.title))} in the full tour">${ARROW}</a>
              </li>`).join('')}
          </ol>
          <div class="mpanel-actions">
            <a class="btn btn-primary" href="#/m/${m.id}">Open the full tour</a>
            <span class="hint">${hasShots ? (canHover() ? 'Hover over a feature to preview its screen' : 'Tap a feature to preview its screen') : 'Screens for this module are coming soon'}</span>
          </div>
        </div>
        ${hasShots ? '<div class="mpanel-stage"><div class="mpanel-device"></div><p class="cap"></p><p class="zoom-hint">Tap the screen to zoom</p></div>' : ''}
      </div>`;

    rowEnd(card).after(panel);

    /* 2px drawn outline around the panel and its arrow, pointing at the open card */
    const notchX = () => {
      const pr = panel.getBoundingClientRect(), cr = card.getBoundingClientRect();
      return Math.round(Math.max(48, Math.min(pr.width - 48, cr.left + cr.width / 2 - pr.left)));
    };
    const PANEL_BORDER = { stroke: 2, feather: 64, over: true, noHover: true, drawMs: DRAW_MS, undrawMs: 550,
      isOn: () => panel.isConnected && !panel.classList.contains('closing'),
      path: (w, h, r, i) => panelPath(w, h, r, i, notchX()) };
    const fitPanel = () => {
      const nx = notchX();
      panel.style.setProperty('--notch-x', `${nx}px`);
      /* Radius that reaches the panel's farthest corner from the blow-out point */
      panel.style.setProperty('--blow-r', `${Math.ceil(Math.hypot(Math.max(nx, panel.offsetWidth - nx), panel.offsetHeight + 14)) + 4}px`);
      fitBorder(panel, PANEL_BORDER);
      const svg = panel.querySelector(':scope > .drawn-border');
      let fill = svg.querySelector('.notch-fill');
      if (!fill) { fill = document.createElementNS('http://www.w3.org/2000/svg', 'path'); fill.setAttribute('class', 'notch-fill'); svg.prepend(fill); }
      fill.setAttribute('d', notchFill(nx, 1));
    };
    fitPanel();
    if (instant || reducedMotion()) { const st = borderState.get(panel); if (st) { st.p = st.target = 1; paintBorder(panel, 1); } }
    else animateBorder(panel);
    const panelRO = 'ResizeObserver' in window ? new ResizeObserver(fitPanel) : null;
    if (panelRO) panelRO.observe(panel);

    const stage = panel.querySelector('.mpanel-stage');
    const feats = [...panel.querySelectorAll('.mfeat')];
    const select = (i) => {
      feats.forEach((b, j) => { b.setAttribute('aria-pressed', String(i === j)); b.parentElement.classList.toggle('on', i === j); });
      if (!stage) return;
      const f = m.features[i];
      const src = f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src);
      const holder = stage.querySelector('.mpanel-device');
      const shot = src ? shotFor(m, src) : null;
      const current = holder.firstElementChild;
      const kind = shot ? deviceHTML(shot).match(/class="device ([\w-]+)/)[1] : '';
      if (current && shot && current.classList.contains(kind)) {
        /* Same device: swap the screen and replay the rise, so every feature selection feels the same */
        const img = current.querySelector('img');
        img.src = shot.src; img.alt = shot.alt || '';
        current.classList.remove('rise'); void current.offsetWidth; current.classList.add('rise');
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
      } else if (stage.parentElement !== panel.querySelector('.mpanel-inner')) panel.querySelector('.mpanel-inner').append(stage);
    };
    hoverSelect(feats.map((b) => b.parentElement), () => feats.findIndex((b) => b.getAttribute('aria-pressed') === 'true'), select);
    feats.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + feats.length) % feats.length;
        feats[n].focus(); select(n);
      });
    });
    panel.querySelector('.mpanel-close').addEventListener('click', () => closeCard(true, true));
    if (stage) bindGalleryTrigger(stage, m, () => feats.findIndex((b) => b.getAttribute('aria-pressed') === 'true'));
    select(Math.min(feature, feats.length - 1));

    /* Keep the panel under the right row when the layout changes */
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => { rowEnd(card).after(panel); select(feats.findIndex((b) => b.getAttribute('aria-pressed') === 'true')); fitPanel(); }, 120); };
    const onKey = (e) => { if (e.key === 'Escape') closeCard(true, true); };
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKey);
    panelTeardown = () => { window.removeEventListener('resize', onResize); document.removeEventListener('keydown', onKey); if (panelRO) panelRO.disconnect(); panelTeardown = null; };

    if (!instant) {
      requestAnimationFrame(() => {
        const header = document.querySelector('.site-header').offsetHeight;
        const cardTop = card.getBoundingClientRect().top - header - 16;
        const overflow = panel.getBoundingClientRect().bottom - innerHeight + 24;
        /* Scroll just enough to show the panel, but never push the card off the top */
        const by = cardTop < 0 ? cardTop : Math.min(Math.max(overflow, 0), cardTop);
        if (by) window.scrollBy({ top: by, behavior: 'smooth' });
      });
    }
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
        /* Touch screens have no hover: there the border draws when the card is tapped open */
        isOn: () => (el.matches(':hover') && canHover()) || el.matches(':focus-visible') || el.closest('.mcard').classList.contains('active') }]),
      ...[...app.querySelectorAll('.mfilter')].map((el) => [el, { ...CHIP_BORDER,
        isOn: () => el.matches(':hover') || el.matches(':focus-visible') }])
    ];
    const optsOf = new Map(targets);
    targets.forEach(([el, o]) => fitBorder(el, o));
    if ('ResizeObserver' in window) {
      borderObserver = new ResizeObserver((entries) => entries.forEach((e) => fitBorder(e.target, optsOf.get(e.target))));
      targets.forEach(([el]) => borderObserver.observe(el));
    }
  }
  const refreshBorder = (card) => card && animateBorder(card.querySelector('.mcard-face'));

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

  function bindModules() {
    sizeBorders();
    setupDealing(!!openCardId);
    app.querySelectorAll('.mfilter').forEach((b) => b.addEventListener('click', () => filterArea(b.dataset.area)));
    app.querySelectorAll('.mcard-face').forEach((face) => face.addEventListener('click', () => {
      const card = face.closest('.mcard');
      if (openCardId === card.dataset.id) closeCard(false, true); else openCard(card);
    }));
    /* Coming back from a module page: reopen the card the visitor had open */
    const again = openCardId && app.querySelector(`.mcard[data-id="${openCardId}"]`);
    openCardId = null;
    if (again) openCard(again, { instant: true });
  }

  const cardHTML = (m) => `
    <a class="module-card" href="#/m/${m.id}">
      <span class="ic">${moduleIcon(m)}</span>
      <span>
        <h4>${esc(m.title)}</h4>
        <p>${esc(m.intro)}</p>
        <span class="meta">${m.features.length} features</span>
      </span>
    </a>`;

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
    hoverSelect(steps, () => steps.findIndex((x) => x.getAttribute('aria-selected') === 'true'), show);
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
  function renderModule(id, featureIndex) {
    const m = byId[id];
    if (!m || !visible.includes(m)) { location.hash = '#/'; return; }
    const area = areaById[m.track];
    const siblings = area.modules;
    const idx = siblings.indexOf(m);
    const prev = siblings[idx - 1], next = siblings[idx + 1];
    const hasShots = m.features.some((f) => f.shot) || m.shots.length;
    const others = siblings.filter((s) => s !== m).slice(0, 3);

    app.innerHTML = `
      <section class="mod-hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="#/">Home</a><span>›</span>
            <a href="#/" data-scroll="index">${esc(area.label)}</a><span>›</span>
            <span aria-current="page">${esc(m.title)}</span>
          </nav>
          <div class="mod-head">
            <span class="ic">${moduleIcon(m)}</span>
            <div>
              <h1>${esc(m.title)}</h1>
              <p class="mod-intro">${esc(m.intro)}</p>
              <div class="mod-facts">
                <span class="fact">${esc(area.label)}</span>
                <span class="fact">${m.features.length} features</span>
                ${hasShots ? `<span class="fact">${canHover() ? 'Hover over' : 'Tap'} a feature to see the screen</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container">
        ${hasShots ? `
          <div class="mod-body">
            <div>${stepsHTML(m, 'mod')}</div>
            <div class="mod-stage"><div id="mod-device"></div><p class="caption" id="mod-caption"></p><p class="zoom-hint">Tap the screen to zoom</p></div>
          </div>` : `
          <div class="feature-cards">
            ${m.features.map((f) => `<article class="value-card"><div class="ic">${icon(f.icon)}</div><h3>${esc(f.title)}</h3><p>${esc(tidy(f.desc))}</p></article>`).join('')}
          </div>`}
      </div>

      <section class="mod-more section-soft">
        <div class="container">
          <h2>More in ${esc(area.label)}</h2>
          <div class="module-grid">${others.map(cardHTML).join('')}</div>
          <div class="mod-pager">
            ${prev ? `<a class="btn btn-ghost" href="#/m/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
            ${next ? `<a class="btn btn-ghost" href="#/m/${next.id}">${esc(next.title)} →</a>` : `<a class="btn btn-primary" href="mailto:hello@antz.systems?subject=Antz%20walkthrough">Book a walkthrough</a>`}
          </div>
        </div>
      </section>`;

    if (hasShots) bindSteps(m, 'mod', document.getElementById('mod-device'), featureIndex || 0, document.getElementById('mod-caption'));
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
    if (name === 'm' && id) {
      if (onHome) homeY = window.scrollY;
      onHome = false;
      if (parallaxOff) parallaxOff();
      if (panelTeardown) panelTeardown();
      renderModule(id, Number(f) || 0);
      window.scrollTo(0, 0);
    } else {
      document.title = 'Antz Onboarding';
      const cameBack = !onHome && !goTop && !pendingScroll && homeY;
      if (!cameBack) openCardId = null;
      renderHome();
      onHome = true;
      if (pendingScroll) { const sid = pendingScroll; requestAnimationFrame(() => scrollToId(sid)); pendingScroll = null; }
      else if (cameBack) { document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')); window.scrollTo(0, homeY); }
      else window.scrollTo(0, 0);
      goTop = false;
    }
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
  function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open));
  });

  window.addEventListener('hashchange', route);
  route();
})();
