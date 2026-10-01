/* Antz Onboarding: renders the prospect-facing site from content.js (window.ANTZ_CONTENT).
   Content stays in data; this file only decides what to show and when. */
(function () {
  'use strict';

  const DATA = window.ANTZ_CONTENT;
  const app = document.getElementById('app');

  /* ---------- Language (see i18n.js) ---------- */
  const LANG = window.ANTZ_LANG || 'en';
  const PACK = window.ANTZ_I18N || {};
  const UI = window.ANTZ_UI_EN || {};
  /* Interface text in the current language, falling back to English; {name} is filled from vars */
  const t = (key, vars = {}) => String((PACK.ui && PACK.ui[key]) || UI[key] || key).replace(/\{(\w+)\}/g, (_, n) => (vars[n] ?? ''));
  const RTL = document.documentElement.dir === 'rtl';

  /* ---------- Presentation config (not content) ---------- */
  const AREA_LOOK = {
    records:    { photo: 'assets/photos/img-tasks.jpg',      glyph: 'chat' },
    animal:     { photo: 'assets/photos/img-movement.jpg',   glyph: 'pets' },
    medical:    { photo: 'assets/photos/img-hospital.jpg',   glyph: 'medical' },
    mortality:  { photo: 'assets/photos/img-chick.jpg',      glyph: 'egg' },
    operations: { photo: 'assets/photos/img-operations.jpg', glyph: 'report' }
  };
  /* Home banner photos, shown in turn (the tiger first); x/y is the part of each photo to keep in view,
     c its key colour (the animal's own, not the background), which washes over the change to it */
  const BANNERS = [
    ['tiger-home', '70%', '30%', '#C8702A'],
    ['macaw', '45%', '35%', '#C8201E'],
    ['wolf', '50%', '35%', '#7A7A74'],
    ['chameleon', '60%', '40%', '#4E9A2E'],
    ['lion', '65%', '58%', '#C77A34'],
    ['lorikeet', '52%', '35%', '#2A4FB8'],
    ['rhino', '60%', '40%', '#A8957A'],
    ['golden-pheasant', '60%', '35%', '#E3A21A'],
    ['koala', '50%', '30%', '#8C8F94'],
    ['mambas', '50%', '50%', '#5BC22A'],
    ['fox', '30%', '72%', '#D0743A'],
    ['bald-eagle', '55%', '40%', '#D9A02A'],
    ['zebra-stripes', '50%', '45%', '#6E6E6E'],
    ['red-panda', '45%', '45%', '#B8482A'],
    ['forest-lizard', '55%', '40%', '#C7A04A'],
    ['bear', '55%', '40%', '#8E5A30'],
    ['flamingo', '65%', '40%', '#E07A94'],
    ['jaguar', '45%', '40%', '#B8863A'],
    ['starling', '30%', '32%', '#1E7BB0'],
    ['alpaca', '55%', '58%', '#CDB89A'],
    ['python', '55%', '50%', '#5AA82A'],
    ['tiger-face', '50%', '40%', '#C4692A'],
    ['pigeon', '55%', '30%', '#3B4FC4'],
    ['okapi', '55%', '40%', '#7A3A22'],
    ['otter', '45%', '68%', '#7A6452'],
    ['giraffe', '45%', '68%', '#C8843A'],
    ['iguana', '55%', '45%', '#5E6B4A'],
    ['fawn', '55%', '40%', '#C87A40'],
    ['heron', '60%', '22%', '#8A4A3A'],
    ['baboon', '50%', '32%', '#C07468'],
    ['chameleon-2', '40%', '45%', '#3E9A34'],
    ['impala', '45%', '35%', '#C89A5A'],
    ['art-tiger', '50%', '45%', '#2E5A2A'],
    ['mouflon', '40%', '40%', '#7A4A2E'],
    ['langur-baby', '50%', '35%', '#C9B89A'],
    ['elks', '50%', '45%', '#7A4A30'],
    ['duck', '45%', '22%', '#6E9A3A'],
    ['tusks', '55%', '30%', '#8A7667'],
    ['grey-wolf', '50%', '35%', '#8A7458'],
    ['stag', '45%', '45%', '#8A6A48'],
    ['koala-sleeping', '55%', '35%', '#8E9496'],
    ['llama', '55%', '30%', '#7A5A44'],
    ['zebras', '50%', '62%', '#6E7F9A'],
    ['tiger-portrait', '35%', '40%', '#B86A2A'],
    ['deer', '45%', '35%', '#9A7048']
  ].map(([f, x, y, c]) => ({ name: f, x, y, c }));
  /* Banner photos are WebP: 1920px wide for larger screens, 1400px for phones (where the photo is a band across the top) */
  const bannerSrc = (b) => `assets/photos/banner-${b.name}${matchMedia('(max-width: 760px)').matches ? '-sm' : ''}.webp`;
  const BANNER_EVERY = 9000;
  /* The feature window's animal wash uses the same photos: which way each animal looks (r/l, or f for straight at the
     camera) and where its face sits across and down the photo (0 to 1; given for the face close-ups).
     Animals looking left are mirrored so every one looks into the panel. */
  const FACING = {
    'tiger-home': ['l', 0.55], 'macaw': ['r', 0.65, 0.4], 'wolf': ['f', 0.5, 0.45], 'chameleon': ['f', 0.55, 0.45],
    'lion': ['r', 0.62, 0.33], 'lorikeet': ['r', 0.6, 0.4], 'rhino': ['l', 0.35, 0.42], 'golden-pheasant': ['r', 0.6, 0.45],
    'koala': ['f', 0.6, 0.3], 'mambas': ['l', 0.45], 'fox': ['l', 0.35, 0.62], 'bald-eagle': ['l', 0.45, 0.45],
    'zebra-stripes': ['l', 0.3], 'red-panda': ['l', 0.45, 0.45], 'forest-lizard': ['l', 0.4], 'bear': ['f', 0.55, 0.45],
    'flamingo': ['r', 0.72, 0.4], 'jaguar': ['f', 0.45, 0.5], 'starling': ['l', 0.3], 'alpaca': ['r', 0.62, 0.45],
    'python': ['f', 0.55], 'tiger-face': ['f', 0.5, 0.5], 'pigeon': ['r', 0.6, 0.4], 'okapi': ['l', 0.3],
    'otter': ['l', 0.35, 0.65], 'giraffe': ['l', 0.4, 0.6], 'iguana': ['r', 0.6],
    'fawn': ['f', 0.5, 0.45], 'heron': ['r', 0.65], 'baboon': ['f', 0.5, 0.5], 'chameleon-2': ['l', 0.35, 0.5],
    'impala': ['f', 0.4], 'art-tiger': ['f', 0.5], 'mouflon': ['r', 0.55, 0.45], 'langur-baby': ['f', 0.45, 0.45],
    'elks': ['f', 0.5], 'duck': ['f', 0.47, 0.22], 'tusks': ['f', 0.5], 'grey-wolf': ['f', 0.5, 0.3],
    'stag': ['r', 0.55], 'koala-sleeping': ['r', 0.6], 'llama': ['f', 0.5, 0.35], 'zebras': ['f', 0.5],
    'tiger-portrait': ['l', 0.3, 0.5], 'deer': ['r', 0.6, 0.45]
  };
  /* The photos that are close-ups of a face: only these go into the feature window */
  const FACES = new Set(['lion', 'golden-pheasant', 'bald-eagle', 'tiger-face', 'fox', 'macaw', 'chameleon', 'jaguar', 'otter', 'fawn', 'alpaca', 'mouflon', 'giraffe', 'bear', 'baboon', 'red-panda', 'wolf', 'llama', 'lorikeet', 'pigeon', 'chameleon-2', 'deer', 'langur-baby', 'rhino', 'flamingo']);
  /* A different animal for each feature of a module: the face close-ups in an order of their own for that module (seeded by its id) */
  const animalsFor = (m) => {
    let h = 2166136261;
    for (const ch of m.id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
    const list = BANNERS.filter((b) => FACES.has(b.name));
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    return list;
  };
  /* Put an animal into the feature window's wash: a band along the bottom (from just under the text, at most 340px tall),
     the photo scaled to 1.38 times the band's height, placed so the face sits a quarter of the way in from the left and
     just below the band's middle, looking into the panel. Positions are worked out from the photo's own size once it has loaded. */
  const setAnimal = (el, b, textBottom) => {
    const [look, fx, fy = .45] = FACING[b.name] || ['f', .5];
    const flip = look === 'l';
    const src = bannerSrc(b);
    const img = new Image();
    img.onload = () => {
      if (!el.isConnected) return;
      const P = el.clientWidth, h = el.clientHeight;
      const top = Math.max(textBottom + 24, h - 340), H = h - top;
      const bh = H * 1.38, bw = bh * (img.naturalWidth / img.naturalHeight);
      /* In a mirrored band the photo's left edge ends up on the right, so the face is placed from the other side */
      const want = flip ? P * .75 : P * .25;
      const x = Math.min(0, Math.max(P - bw, want - fx * bw));
      /* The face a little below the middle of the band */
      const y = Math.min(0, Math.max(H - bh, H * .55 - fy * bh));
      el.style.setProperty('--wash-top', `${Math.round(top)}px`);
      el.style.setProperty('--area-photo', `url('${src}')`);
      el.style.setProperty('--area-photo-size', `${Math.round(bw)}px ${Math.round(bh)}px`);
      el.style.setProperty('--area-photo-pos', `${Math.round(x)}px ${Math.round(y)}px`);
      el.style.setProperty('--area-flip', flip ? '-1' : '1');
      el.style.setProperty('--area-fade', flip ? 'to left' : 'to right');
      el.classList.remove('animal-in'); void el.offsetWidth; el.classList.add('animal-in');
    };
    img.src = src;
  };
  /* Banner rotation runs on one clock for the whole visit (kept in sessionStorage, so reloads carry on too):
     every 9 s is the next photo's turn, whether or not the home page is showing. Coming back to the home page
     shows the photo whose turn it is and carries on from there, rather than starting again from the tiger. */
  let bannerStart = 0;
  const bannerSlot = () => {
    if (!bannerStart) {
      try { bannerStart = Number(sessionStorage.getItem('antz-banner-start')) || 0; } catch (e) { /* storage blocked */ }
      if (!bannerStart) {
        bannerStart = Date.now();
        try { sessionStorage.setItem('antz-banner-start', String(bannerStart)); } catch (e) { /* keep it in memory only */ }
      }
    }
    return Math.floor((Date.now() - bannerStart) / BANNER_EVERY);
  };
  const bannerNow = () => BANNERS[bannerSlot() % BANNERS.length];
  const PHOTOS = {
    hero: 'assets/photos/tiger.jpg',
    spotlight: 'assets/photos/img-lemur.jpg',
    cta: 'assets/photos/img-enclosure.jpg',
    objective: 'assets/photos/img-conservation.jpg',
    /* The kit's slide-4 'welcome screen' is byte-identical to the Getting Started home screen, so the platform section uses this photo */
    platform: 'assets/photos/img-cta-new.jpg'
  };
  /* Featured workflow: one everyday module, picked at random on each page load (kept while the visitor moves
     around, so returning home does not swap it). `shot` is the feature whose screen is clearest as the picture
     (no pop-up dimming it). Modules whose screens are stand-ins or dimmed are left out. */
  const FEATURED = [
    { id: 'animal-transfer', shot: 1 }, { id: 'medical-records', shot: 1 }, { id: 'vaccination', shot: 2 },
    { id: 'housing', shot: 0 }, { id: 'animal-management', shot: 2 }, { id: 'mortality', shot: 1 },
    { id: 'egg-management-app', shot: 0 }, { id: 'approvals', shot: 0 }, { id: 'missing-escaped-animal', shot: 0 },
    { id: 'announcement', shot: 1 }, { id: 'tags-hub', shot: 0 }
  ];
  const FEATURE_PICK = FEATURED[Math.floor(Math.random() * FEATURED.length)];
  /* Screens that already carry a device frame in the image itself */

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
  /* Banner titles: one span per letter, so a ripple can run through the title when it appears (as on the
     LSET Foundation site). Words stay whole so a line never breaks inside one. Scripts whose letters join up
     (Arabic, Devanagari) or have no spaces between words are left as plain text: splitting them would break
     the shaping, and the holographic fill still applies. The spans are hidden; the h1 carries the real text. */
  const WAVE_OK = /^[\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}\p{N}\p{P}\p{Zs}\p{S}]*$/u;
  const waveTitle = (text) => {
    if (!WAVE_OK.test(text)) return esc(text);
    let i = 0;
    return `<span class="wave" aria-hidden="true">${text.split(' ').map((w) =>
      `<span class="wave-word">${[...w].map((ch) => `<span class="wave-ch" style="--i:${i++}">${esc(ch)}</span>`).join('')}</span>`).join(' ')}</span>`;
  };
  const heroTitle = (text) => `<h1 class="holo" aria-label="${esc(text)}">${waveTitle(text)}</h1>`;
  const SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const CLOSE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  /* The search cue ("Search {x}") with the rotating word where {x} sits in this language */
  const cueHTML = () => {
    const [before, after = ''] = t('search.cue', { x: '{x}' }).split('{x}');
    return `<span class="ph" aria-hidden="true">${esc(before)}<span class="ph-rot"></span>${esc(after)}</span>`;
  };

  /* ---------- Content model ---------- */
  /* Each module in the current language: translated title, intro, summary, feature text and screen
     descriptions laid over the English. enTitle keeps the name used in the app itself. */
  const modules = DATA.modules.map((m) => {
    const o = OVERRIDES[m.id] || {};
    const tr = (PACK.modules || {})[m.id] || {};
    const features = m.features.map((f, i) => {
      const tf = (tr.features || [])[i] || {};
      return { ...f, enTitle: f.title, title: tf.title || f.title, desc: tf.desc || f.desc, alt: tf.alt || f.alt };
    });
    const shots = (m.shots || []).map((sh) => ({ ...sh, alt: (tr.shots || {})[sh.src] || sh.alt }));
    return { ...m, ...o, features, shots, raw: o.intro || m.intro, enTitle: tidyTitle(m.title), sum: tr.summary,
      title: tidyTitle(tr.title || m.title), intro: tidy(tr.intro || o.intro || m.intro) };
  });
  const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
  /* Prospects only see finished modules; foundations feed the home page instead */
  const visible = modules.filter((m) => m.status === 'complete' && m.track !== 'foundations');
  const areas = DATA.tracks
    .filter((t) => AREA_LOOK[t.id])
    .map((a) => {
      const tr = (PACK.tracks || {})[a.id] || {};
      return { ...a, label: tr.label || a.label, desc: tidy(tr.desc || a.desc), modules: visible.filter((m) => m.track === a.id), ...AREA_LOOK[a.id] };
    })
    .filter((a) => a.modules.length);
  const areaById = Object.fromEntries(areas.map((a) => [a.id, a]));

  const shotFor = (m, src) => m.shots.find((s) => s.src === src) || { src, device: 'phone', alt: '' };
  const deviceHTML = (shot) => {
    if (!shot) return '';
    const img = `<img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="lazy">`;
    if (shot.device === 'web') return `<div class="device device-web"><div class="bar"><i></i><i></i><i></i></div>${img}</div>`;
    if (shot.device === 'tablet') return `<div class="device device-tablet"><div class="screen">${img}</div></div>`;
    /* Every phone screen gets the same green frame, drawn in CSS (the frames once baked into some captures are cropped off) */
    return `<div class="device device-phone"><div class="screen">${img}</div></div>`;
  };

  /* ---------- Home ---------- */
  /* ---------- Kit pages: the three "start here" sections, each on its own page ---------- */
  /* Content from content.json (Edition 01, pages 3 to 5) */
  const kitScreen = (m) => (m.shots[0] ? deviceHTML({ ...m.shots[0], device: m.shots[0].device || 'phone' }) : '');
  const KIT_PAGES = [
    { id: 'objective', module: 'objective-of-this-kit', eyebrow: t('kit.objective.eyebrow'), more: t('kit.objective.more'), photo: 'objective', pos: '50% 35%' },
    { id: 'platform', module: 'what-is-antz-systems', eyebrow: t('kit.platform.eyebrow'), more: t('kit.platform.more'), photo: 'platform', pos: '72% 50%' },
    { id: 'getting-started', module: 'getting-started', eyebrow: t('kit.start.eyebrow'), more: t('kit.start.more') }
  ];
  const KIT_SECTIONS = {
    objective: () => {
      const objective = byId['objective-of-this-kit'];
      return `
      <section class="section kit-section" id="objective">
        <div class="container kit-split kit-photo-left">
          <figure class="kit-media kit-photo reveal">
            <img src="${PHOTOS.objective}" alt="${esc(t('kit.objective.photo'))}" loading="lazy">
          </figure>
          <div class="kit-copy reveal">
            <span class="eyebrow">${esc(t('kit.objective.kicker'))}</span>
            <h2 class="section-title">${esc(objective.title)}</h2>
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
            <span class="eyebrow">${esc(t('kit.platform.eyebrow'))}</span>
            <h2 class="section-title">${esc(about.title)}</h2>
            <p class="section-lede">${esc(about.intro)}</p>
            <h3 class="kit-label">${esc(t('kit.platform.why'))}</h3>
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
            <img src="${PHOTOS.platform}" alt="${esc(t('kit.platform.photo'))}" loading="lazy" style="object-position: 72% 50%">
          </figure>
        </div>
      </section>
`;
    },
    'getting-started': () => {
      const start = byId['getting-started'];
      const firstDay = [
        [t('day.1'), start.features[0].desc, 'signin'],
        [t('day.2'), start.features[1].desc, 'compass'],
        [t('day.3'), start.features[3].desc, 'database'],
        [t('day.4'), t('day.4.desc'), 'access']
      ];
      return `
      <section class="section section-soft kit-section" id="first-day">
        <div class="container kit-split">
          <div class="kit-media kit-device reveal">${kitScreen(start)}</div>
          <div class="kit-copy reveal">
            <span class="eyebrow">${esc(t('kit.start.eyebrow'))}</span>
            <h2 class="section-title">${esc(start.title)}</h2>
            <p class="section-lede">${esc(start.intro)}</p>
            ${GUIDE_LINKS && GUIDES['getting-started'] ? `<a class="guide-more" href="#/guide/getting-started"><span><b>${esc(t('guide.more'))}</b><small>${esc(t('guide.moreNote'))}</small></span>${ARROW}</a>` : ''}
            <h3 class="kit-label">${esc(t('kit.start.features'))}</h3>
            <ul class="kit-list">
              ${start.features.map((f) => `
                <li><span class="ic">${icon(f.icon)}</span><span><b>${esc(f.title)}</b>${esc(tidy(f.desc))}</span></li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="container first-day">
          <div class="section-head reveal">
            <h3 class="section-title first-day-title">${esc(t('day.title'))}</h3>
            <p class="section-lede">${esc(t('day.lede'))}</p>
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

  /* The kit page shown last, so moving between kit pages can play the chip fill sweep like the home chips */
  let lastKit = null;
  function renderKit(id) {
    const k = KIT_PAGES.find((x) => x.id === id);
    if (!k) { location.hash = '#/'; return; }
    const i = KIT_PAGES.indexOf(k);
    const next = KIT_PAGES[i + 1] || null, prev = KIT_PAGES[i - 1] || null;
    const title = (x) => byId[x.module].title;
    const kitPhoto = (x) => x.photo ? { url: PHOTOS[x.photo], pos: x.pos } : { url: (byId[x.module].shots[0] || {}).src || PHOTOS.hero, pos: '50% 12%' };
    const link = (x, dir) => x
      ? pagerHTML(dir, { href: `#/kit/${x.id}`, label: dir === 'prev' ? t('pager.prev') : t('pager.next'), title: title(x), ...kitPhoto(x) })
      : (dir === 'next'
        ? pagerHTML('next', { href: '#/', attrs: ' data-scroll="index"', label: t('pager.next'), title: t('pager.modules'), url: PHOTOS.hero, pos: '60% 30%' })
        : '<span></span>');
    /* Coming from another kit page: start with that page's chip filled, then hand the fill over,
       so it drains from the old chip and sweeps into the new one */
    const from = KIT_PAGES.find((x) => x.id === lastKit);
    const sweep = !!from && from !== k && !reducedMotion();
    lastKit = k.id;
    app.innerHTML = `
      <div class="kitpage${/section-soft/.test(KIT_SECTIONS[k.id]()) ? ' soft' : ''}">
        <nav class="container kit-tabs" aria-label="${esc(t('start.label'))}">
          ${KIT_PAGES.map((x, j) => `<a class="msubtab mfilter kit-tab" href="#/kit/${x.id}"${x === (sweep ? from : k) ? ' aria-current="page"' : ''}><span class="n">0${j + 1}</span>${esc(title(x))}<svg class="drawn-border" aria-hidden="true"></svg></a>`).join('')}
        </nav>
        ${KIT_SECTIONS[k.id]()}
        <div class="container"><nav class="mpager" aria-label="${esc(t('pager.pages'))}">${link(prev, 'prev')}${link(next, 'next')}</nav></div>
      </div>`;
    sizeBorders();
    if (sweep) {
      const tabs = [...app.querySelectorAll('.kit-tab')];
      requestAnimationFrame(() => requestAnimationFrame(() => tabs.forEach((t, j) => {
        if (KIT_PAGES[j] === k) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
      })));
    }
    document.title = `${title(k)} · ${t('brand.title')}`;
  }

  /* ---------- Guide pages: a kit's full walkthrough (guide.js), linked from its summary page ---------- */
  /* A banner like the home page's, then the kit's parts as cards; each card opens its screens in the gallery */
  const GUIDES = window.ANTZ_GUIDES || {};
  /* Guide pages stay unlinked (reachable only by their #/guide/ address) until every kit has one */
  const GUIDE_LINKS = false;
  function renderGuide(id) {
    const g = GUIDES[id];
    if (!g) { location.hash = '#/'; return; }
    const srcOf = (s) => `assets/guide/${id}/${s.src}.webp`;
    const count = (n) => (n === 1 ? t('guide.screen1') : t('guide.screens', { n }));
    /* Every set of screens on the page, shaped like a module (one feature per screen), so it opens in the
       same feature window (desktop) and feature sheet (phones) as the module pages, in the guide's colours */
    areaById.guide = { id: 'guide', label: g.title, glyph: 'note', modules: [] };
    const sets = [];
    const addSet = (key, title, ic, shots) => sets.push({
      id: `guide-${id}-${key}`, track: 'guide', title,
      features: shots.map((s) => ({ title: s.title, desc: s.desc, icon: s.icon || ic, shot: srcOf(s) })),
      shots: shots.map((s) => ({ src: srcOf(s), alt: s.title, device: 'phone' }))
    }) - 1;

    /* At a glance: the module pages' feature cards, each opening its screen */
    const glanceHTML = (gl) => {
      const set = addSet('glance', gl.title, 'home', gl.shots);
      return `
        <div class="gfeats reveal">
          <h3 class="gfeats-title">${esc(gl.title)}</h3>
          <p class="gfeats-lede">${esc(gl.desc)}</p>
          <ol class="mfeats">${gl.shots.map((s, i) => `
            <li class="mfeat-row">
              <button class="mfeat" type="button" data-set="${set}" data-i="${i}">
                <span class="n" aria-hidden="true">${icon(s.icon)}</span>
                <span class="t"><b>${esc(s.title)}</b><small>${esc(s.desc)}</small></span>
                <span class="mfeat-open" aria-hidden="true">${EXPAND_SVG}</span>
              </button>
              <svg class="drawn-border" aria-hidden="true"></svg>
            </li>`).join('')}
          </ol>
        </div>`;
    };
    const cardHTML = (c, n) => {
      const set = addSet(c.id, c.title, c.icon, c.shots);
      return `
        <button class="mcard-face gcard" type="button" data-set="${set}" data-i="0">
          <span class="gcard-thumb"${c.peek ? ` style="--peek:${c.peek}"` : ''}>${deviceHTML({ src: srcOf(c.shots[c.thumb || 0]), alt: '', device: 'phone' })}</span>
          <span class="gcard-body">
            <span class="gcard-top"><span class="gcard-ic" aria-hidden="true">${icon(c.icon)}</span><span class="gcard-n">${String(n).padStart(2, '0')}</span></span>
            <b>${esc(c.title)}</b>
            <span class="gcard-desc">${esc(c.desc)}</span>
            <span class="gcard-foot">${esc(count(c.shots.length))} ${ARROW}</span>
          </span>
          <svg class="drawn-border" aria-hidden="true"></svg>
        </button>`;
    };
    const actionsHTML = (qa) => {
      const set = addSet('quick', qa.overview.title, 'add', [qa.overview, ...qa.shots]);
      return `
        <div class="gqa reveal">
          <button class="gqa-stage" type="button" data-set="${set}" data-i="0" aria-label="${esc(t('guide.view'))}: ${esc(qa.overview.title)}">
            ${deviceHTML({ src: srcOf(qa.overview), alt: '', device: 'phone' })}
          </button>
          <div class="gqa-side">
            <h3>${esc(qa.overview.title)}</h3>
            <p>${esc(qa.overview.desc)} ${esc(t('guide.qaHint'))}.</p>
            <ul class="gqa-grid">${qa.shots.map((s, i) => `
              <li><button type="button" data-set="${set}" data-i="${i + 1}"><b>${esc(s.title)}</b><small>${esc(s.desc)}</small></button></li>`).join('')}
            </ul>
          </div>
        </div>`;
    };
    let n = 0;
    const partsHTML = g.parts.map((p, pi) => `
      <section class="section guide-part${pi % 2 ? ' section-soft' : ''}" id="g-${p.id}">
        <div class="container">
          <div class="guide-head reveal">
            <span class="eyebrow">${esc(p.label)}</span>
            <h2 class="section-title">${esc(p.title)}</h2>
            <p class="section-lede">${esc(p.lede)}</p>
          </div>
          ${p.glance ? glanceHTML(p.glance) : ''}
          ${p.cards ? `<div class="ggrid reveal" data-n="${p.cards.length}">${p.cards.map((c) => cardHTML(c, ++n)).join('')}</div>` : ''}
          ${p.actions ? actionsHTML(p.actions) : ''}
        </div>
      </section>`).join('');
    const back = g.back && KIT_PAGES.find((x) => x.id === g.back);

    app.innerHTML = `
      <div class="guidepage tint-guide">
        <section class="hero guide-hero">
          <div class="hero-media"><div class="hero-slides">${((b) => `<div class="hero-bg" style="background-image:url('${bannerSrc(b)}');--x:${b.x};--y:${b.y}"></div>`)(bannerNow())}</div></div>
          <div class="container hero-inner">
            <span class="guide-kicker">${esc(g.kicker)}</span>
            ${heroTitle(g.title)}
            <p class="hero-sub">${esc(g.sub)}</p>
            <ul class="guide-aud">${g.audience.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
            <nav class="hero-chips guide-jump" aria-label="${esc(t('guide.jump'))}">
              ${g.parts.map((p, i) => `<button class="chip" type="button" data-jump="g-${p.id}" style="--i:${i}"><span class="n">0${i + 1}</span>${esc(p.title)}<svg class="drawn-border" aria-hidden="true"></svg></button>`).join('')}
            </nav>
          </div>
        </section>
        ${partsHTML}
        <section class="section guide-close" id="g-close">
          <div class="container">
            <div class="guide-head reveal">
              <span class="eyebrow">${esc(g.close.label)}</span>
              <h2 class="section-title">${esc(g.close.title)}</h2>
              <p class="section-lede">${esc(g.close.lede)}</p>
            </div>
            <ol class="gclose">${g.close.items.map((x, i) => `
              <li class="reveal"><span class="n">0${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></li>`).join('')}
            </ol>
            <nav class="mpager" aria-label="${esc(t('pager.pages'))}">
              ${back ? pagerHTML('prev', { href: `#/kit/${back.id}`, label: t('guide.summary'), title: byId[back.module].title, url: (byId[back.module].shots[0] || {}).src || PHOTOS.hero, pos: '50% 12%' }) : '<span></span>'}
              ${pagerHTML('next', { href: '#/', attrs: ' data-scroll="index"', label: t('pager.next'), title: t('pager.modules'), url: PHOTOS.hero, pos: '60% 30%' })}
            </nav>
          </div>
        </section>
      </div>`;

    const page = app.querySelector('.guidepage');
    page.addEventListener('click', (e) => {
      const jump = e.target.closest('[data-jump]');
      if (jump) { scrollToId(jump.dataset.jump); return; }
      const b = e.target.closest('[data-set]');
      if (!b) return;
      const r = b.getBoundingClientRect();
      (narrow() ? openFeatureSheet : openFeatureWindow)(sets[+b.dataset.set], +b.dataset.i || 0, {
        origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
        close: () => b.focus({ preventScroll: true }), returnFocusTo: b
      });
    });
    sizeBorders();
    bindParallax();
    document.title = `${g.title} · ${t('brand.title')}`;
  }

  function renderHome(returning) {
    const about = byId['what-is-antz-systems'];
    const spot = byId[FEATURE_PICK.id];
    /* One of the workflow's screens, shown in full as a still, decorative picture beside the list */
    const spotSrc = (spot.features[FEATURE_PICK.shot] && spot.features[FEATURE_PICK.shot].shot) || (spot.features.find((f) => f.shot) || {}).shot || (spot.shots[0] && spot.shots[0].src);
    const spotShot = spotSrc ? shotFor(spot, spotSrc) : null;
    const faqs = [
      [t('faq.q1'), about.intro],
      [t('faq.q2'), t('faq.a2')],
      [t('faq.q3'), t('faq.a3')],
      [t('faq.q4'), t('faq.a4')],
      [t('faq.q5'), t('faq.a5')]
    ];

    app.innerHTML = `
      <section class="hero">
        <div class="hero-media"><div class="hero-slides">${((b) => `<div class="hero-bg" style="background-image:url('${bannerSrc(b)}');--x:${b.x};--y:${b.y}"></div>`)(bannerNow())}</div></div>
        <div class="container hero-inner">
          ${heroTitle(t('hero.title'))}
          <p class="hero-sub">${esc(t('hero.sub'))}</p>
          <div class="hero-search" role="search">
            <label class="search-field">
              ${SEARCH_SVG}
              <span class="sr-only">${esc(t('search.label'))}</span>
              <input id="q" type="search" autocomplete="off" placeholder="" aria-controls="q-results" aria-expanded="false">
              ${cueHTML()}
              <button class="search-clear" type="button" aria-label="${esc(t('search.clear'))}">${CLOSE_SVG}</button>
            </label>
            <div class="search-results" id="q-results" role="listbox"></div>
          </div>
          <div class="hero-chips">
            ${areas.map((a, i) => `<button class="chip" type="button" data-area="${a.id}" style="--i:${i}">${icon(a.glyph)}${esc(a.label)}<svg class="drawn-border" aria-hidden="true"></svg></button>`).join('')}
          </div>
          <p class="hero-meta"><span>${icon('areas')}${esc(t('hero.areas', { n: areas.length }))}</span><span class="hero-meta-sep" aria-hidden="true">·</span><span>${icon('devices')}${esc(t('hero.devices'))}</span></p>
        </div>
      </section>

      <section class="bento-section" aria-label="${esc(t('start.label'))}">
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
              <span class="eyebrow">${esc(t('modules.eyebrow'))}</span>
              <h2 class="section-title">${esc(t('modules.title'))}</h2>
            </div>
            <p class="section-lede">${esc(t('modules.lede'))}</p>
          </div>
          ${modulesHTML()}
        </div>
      </section>

      <section class="section" id="spotlight">
        <div class="container spotlight">
          <div class="reveal">
            <span class="tag-new">${esc(t('spot.tag'))}</span>
            <h2>${esc(spot.title)}</h2>
            <p class="lede">${esc(spot.intro)}</p>
            <div class="spot-feats tint-${AREA_TINT[spot.track]}">${featureListHTML(spot, true)}</div>
            <a class="link-arrow" href="#/m/${spot.id}">${esc(t('spot.link', { x: spot.title }))} ${ARROW}</a>
          </div>
          <div class="stage tint-${AREA_TINT[spot.track]}" aria-hidden="true">
            <div class="stage-device">${spotShot ? deviceHTML(spotShot) : ''}</div>
          </div>
        </div>
      </section>


      <section class="cta">
        <div class="cta-bg" style="background-image:url('${PHOTOS.cta}')"></div>
        <div class="container">
          <div class="cta-inner reveal">
            <h2 data-depth="1">${esc(t('cta.title'))}</h2>
            <p data-depth="0.7">${esc(t('cta.text'))}</p>
            <div class="actions" data-depth="0.45">
              <button class="btn btn-primary" type="button" data-scroll="index">${esc(t('cta.back'))}</button>
            </div>
            <p class="or" data-depth="0.3">${esc(t('cta.or', { email: '\u0000' })).replace('\u0000', '<b>hello@antz.systems</b>')}</p>
          </div>
        </div>
      </section>

      <section class="section" id="faq">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">${esc(t('faq.eyebrow'))}</span>
            <h2 class="section-title">${esc(t('faq.title'))}</h2>
          </div>
          <div class="faq">
            ${faqs.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}</summary><p class="answer">${esc(a)}</p></details>`).join('')}
          </div>
        </div>
      </section>`;

    bindParallax();
    bindSpotFeatures(app.querySelector('.spot-feats'), spot);
    bindModules(!!returning);
    bindSearch();
    app.querySelectorAll('.chip[data-area]').forEach((c) =>
      c.addEventListener('click', () => { filterArea(c.dataset.area); scrollToId('index'); }));
  }

  /* ---------- Module cards: grouped by area, open in place ---------- */
  const AREA_TINT = { records: 'records', animal: 'animal', medical: 'medical', mortality: 'mortality', operations: 'operations', guide: 'guide' };
  /* Outline gradients: the area's line colour, melting into a deeper tone of its complementary hue (matches the panel backgrounds) */
  const OUTLINE_GRADS = {
    records: ['#2FA864', '#E06C78'], animal: ['#D39B10', '#17A8A0'], medical: ['#4DB3A6', '#C8BC6A'],
    mortality: ['#D6920E', '#DD5F6B'], operations: ['#2C94BC', '#DD647D']
  };
  /* One short line per card, derived from the intro until real taglines exist */
  const summary = (m) => {
    if (m.sum) return m.sum;
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
  const photoOf = (m) => CARD_PHOTOS.has(m.id)
    ? { url: `assets/cards/${m.id}.jpg`, pos: CARD_PHOTO_POS[m.id] || '50% 50%', flip: 1 }
    : (({ src, pos, flip }) => ({ url: `assets/icon-bg/${src}.jpg`, pos, flip }))(PHOTO_VARIANTS[photoIndex[m.id] % PHOTO_VARIANTS.length]);
  /* Previous / next link: a round thumbnail of that page with the arrow on it, then its label and title */
  const pagerArrow = (dir) => (dir === "prev" ? CHEV_L : CHEV_R);
  const pagerHTML = (dir, { href, label, title, url, pos = '50% 50%', attrs = '' }) => `
    <a class="mpager-link ${dir}" href="${href}"${attrs}>
      <span class="mpager-thumb" style="background-image:url('${url}');background-position:${pos}"><span class="mpager-arrow" aria-hidden="true">${pagerArrow(dir)}</span></span>
      <span class="mpager-text"><small>${label}</small><b>${esc(title)}</b></span>
    </a>`;
  const thumbHTML = (m) => {
    const v = photoOf(m);
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
          <span class="mcard-foot"><span>${esc(t('modules.features', { n: m.features.length }))}</span><span class="mcard-plus" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>
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
      <div class="mfilters" role="toolbar" aria-label="${esc(t('modules.filter'))}">
        <button class="mfilter" type="button" data-area="all" aria-pressed="true">${esc(t('modules.all'))} <span>${total}</span><svg class="drawn-border" aria-hidden="true"></svg></button>
        ${areas.map((a) => `<button class="mfilter" type="button" data-area="${a.id}" aria-pressed="false">${icon(a.glyph)}${esc(a.label)} <span>${a.modules.length}</span><svg class="drawn-border" aria-hidden="true"></svg></button>`).join('')}
      </div>
      <div class="mgroups">
        ${areas.map((a) => `
          <section class="mgroup tint-${AREA_TINT[a.id]}" data-area="${a.id}" aria-labelledby="mg-${a.id}">
            <header class="mgroup-head">
              <span class="ic">${icon(a.glyph)}</span>
              <h3 id="mg-${a.id}">${esc(a.label)}</h3>
              <span class="count">${esc(t('modules.count', { n: a.modules.length }))}</span>
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
  function bindFeatures(root, m, start = 0, openNow = false) {
    const inner = root.querySelector('.mpanel-inner');
    const stage = root.querySelector('.mpanel-stage');
    const feats = [...root.querySelectorAll('.mfeat')];
    const current = () => feats.findIndex((b) => b.getAttribute('aria-pressed') === 'true');
    const mark = (i) => feats.forEach((b, j) => { b.setAttribute('aria-pressed', String(i === j)); b.parentElement.classList.toggle('on', i === j); });
    /* Desktop and laptop: a feature's screen opens in a window with arrows either side */
    /* The window grows out from the feature's open icon (or the row itself) */
    const originOf = (i) => {
      const el = feats[i].querySelector('.mfeat-open') || feats[i];
      const r = el.getBoundingClientRect();
      return r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
    };
    /* Desktop: the centred window with side arrows. Phones: the full-screen sheet. */
    const openWindow = (i) => (narrow() ? openFeatureSheet : openFeatureWindow)(m, i, {
      origin: originOf(i),
      step: (j) => { mark(j); history.replaceState(null, '', `#/m/${m.id}/${j}`); },
      close: (j) => { history.replaceState(null, '', `#/m/${m.id}`); feats[j].focus({ preventScroll: true }); }
    });
    const select = (i, fromUser) => {
      mark(i);
      if (fromUser) history.replaceState(null, '', `#/m/${m.id}/${i}`);
      if (!stage) return;
      if (fromUser) { openWindow(i); return; }
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
        /* Arrow keys move through the list; on desktop Enter opens the window */
        feats[n].focus(); mark(n);
      });
    });
    if (stage) bindGalleryTrigger(stage, m, current);
    select(Math.min(start, feats.length - 1));
    /* A link to a feature (#/m/<id>/<n>) opens its window straight away on desktop */
    if (openNow && stage) openWindow(Math.min(start, feats.length - 1));

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
    /* Unrounded sizes: offsetHeight rounds a 76.3px tab down to 76, leaving a sliver of fill below the line */
    const bx = opts.over ? 0 : bw + (parseFloat(cs.borderRightWidth) || 0);
    const by = opts.over ? 0 : bw + (parseFloat(cs.borderBottomWidth) || 0);
    const w = parseFloat(cs.width) - bx;
    const h = parseFloat(cs.height) - by;
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
      if (!opts.noHover) ['pointerenter', 'pointerleave', 'focus', 'blur', 'focusin', 'focusout'].forEach((ev) => el.addEventListener(ev, () => animateBorder(el)));
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
      /* Feature rows on module pages draw the same border as the home cards, in the area colour */
      ...[...app.querySelectorAll('.mfeat-row')].map((el) => [el, { ...CARD_BORDER, stroke: 1, bleed: 0, over: true,
        /* Hover, or keyboard focus on its button (a mouse click leaves focus behind, which must not keep it drawn) */
        isOn: () => (el.matches(':hover') && canHover()) || !!el.querySelector(':focus-visible') }]),
      /* Area tabs on module pages: the home chips' drawn border, in each area's colour (not on the selected tab) */
      ...[...app.querySelectorAll('.mtab')].map((el) => [el, { ...CHIP_BORDER, feather: 40,
        isOn: () => !el.hasAttribute('aria-current') && ((el.matches(':hover') && canHover()) || el.matches(':focus-visible')) }]),
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
  const PIN_CHEVRON = '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const subTabsHTML = (cur, mark = true) => areaById[cur.track].modules.map((x) => `
    <a class="msubtab mfilter" href="#/m/${x.id}"${mark && x === cur ? ' aria-current="page"' : ''}><span class="ic" style="--ic:url('assets/icons/${iconOf(x)}_icon.svg')" aria-hidden="true"></span>${esc(x.title)}<svg class="drawn-border" aria-hidden="true"></svg></a>`).join('');
  const markSubTab = (sub, cur) => sub.querySelectorAll('.msubtab').forEach((x) => {
    if (x.getAttribute('href') === `#/m/${cur.id}`) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current');
  });
  const moduleTabsHTML = (cur) => `
    <nav class="mtabs" aria-label="${esc(t('mod.tabs'))}">
      <div class="mtabs-areas">${areas.map((a) => {
        const ph = areaPhoto[a.id];
        const here = a.id === cur.track;
        return `
        <a class="mtab tint-${AREA_TINT[a.id]}" href="#/m/${here ? cur.id : a.modules[0].id}"${here ? ' aria-current="true"' : ''}>
          <span class="mtab-thumb" style="background-image:url('${ph.url}');background-position:${ph.pos}"><img src="assets/icons/${ph.icon}_icon.svg" alt=""></span>
          <span class="mtab-text"><b>${esc(a.label)}</b><small>${esc(t('modules.count', { n: a.modules.length }))}</small></span>
          <svg class="drawn-border" aria-hidden="true"></svg>
        </a>`;
      }).join('')}
        <span class="mtab-ind" aria-hidden="true"><i class="mtab-line"></i><i class="mtab-bar"></i></span>
      </div>
      <div class="msubtabs" data-area="${cur.track}">${subTabsHTML(cur)}</div>
      <div class="mpin" inert>
        <div class="container mpin-row">
          <div class="mpin-area">
            <button class="mpin-areabtn" type="button" aria-haspopup="true" aria-expanded="false"><span class="dot"></span><b></b>${PIN_CHEVRON}</button>
            <div class="mpin-menu" hidden>${areas.map((a) => `
              <a class="tint-${AREA_TINT[a.id]}" href="#/m/${a.modules[0].id}" data-area="${a.id}"><span class="dot"></span>${esc(a.label)}<small>${a.modules.length}</small></a>`).join('')}
            </div>
          </div>
          <div class="msubtabs mpin-chips"></div>
        </div>
      </div>
    </nav>`;

  /* Tab rows that scroll sideways fade the edge where more tabs are hidden, and a mouse wheel scrolls them */
  const bindTabRow = (row) => {
    const edges = () => {
      /* In right-to-left pages scrolling starts at the right edge and scrollLeft runs negative */
      const max = row.scrollWidth - row.clientWidth, pos = RTL ? max + row.scrollLeft : row.scrollLeft;
      row.classList.toggle('more-l', pos > 2);
      row.classList.toggle('more-r', pos < max - 2);
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
    const off = cur.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
    row.scrollTo({ left: off - (row.clientWidth - cur.offsetWidth) / 2, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
    row._edges();
  };
  /* The selected-tab outline is one element that glides and resizes between tabs, taking on each area's colour */
  /* The selected-tab outline: when a different tab becomes active (or on first view) it moves there and
     traces itself in, from the bottom curves up both sides to meet across the top. Resizes just follow. */
  const placeIndicator = (nav) => {
    const ind = nav.querySelector('.mtab-ind'), tab = nav.querySelector('.mtab[aria-current]');
    if (!ind || !tab) return;
    const fresh = ind._tab !== tab, from = ind._tab;
    ind._tab = tab;
    /* Moving from another tab: the outline glides across, then its top bar forms. First view: it traces itself in. */
    const glide = fresh && from && from.isConnected && !reducedMotion();
    if (glide) {
      ind.classList.remove('still', 'draw', 'glide'); void ind.offsetWidth;
      const ts = getComputedStyle(tab);
      ind.style.setProperty('--edge', ts.getPropertyValue('--edge'));
      ind.style.setProperty('--edge2', ts.getPropertyValue('--edge2'));
      ind.style.width = `${tab.offsetWidth}px`;
      ind.style.height = `${tab.offsetHeight}px`;
      ind.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
      ind.classList.add('glide');
      ind._gliding = performance.now() + 700;
      return;
    }
    /* A resize while it is still travelling only retargets it; snapping would cut the glide short */
    const moving = !fresh && performance.now() < (ind._gliding || 0);
    if (!moving) ind.classList.add('still');
    const ts = getComputedStyle(tab);
    ind.style.setProperty('--edge', ts.getPropertyValue('--edge'));
    ind.style.setProperty('--edge2', ts.getPropertyValue('--edge2'));
    ind.style.width = `${tab.offsetWidth}px`;
    ind.style.height = `${tab.offsetHeight}px`;
    ind.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
    if (moving) return;
    void ind.offsetWidth;
    ind.classList.remove('still');
    if (fresh && !reducedMotion()) { ind.classList.remove('draw', 'glide'); void ind.offsetWidth; ind.classList.add('draw'); }
  };
  /* Point the (kept) tab bar at the current module; animate says whether things glide or snap */
  function syncTabs(nav, cur, animate) {
    nav.querySelectorAll('.mtab').forEach((t, i) => {
      const a = areas[i], here = a.id === cur.track;
      t.setAttribute('href', `#/m/${here ? cur.id : a.modules[0].id}`);
      if (here) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    const sweep = animate && !reducedMotion();
    const full = nav.querySelector(':scope > .msubtabs');
    const pin = nav.querySelector('.mpin'), pinChips = pin.querySelector('.mpin-chips');
    [full, pinChips].forEach((sub) => {
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
    });
    pin.querySelector('.mpin-areabtn b').textContent = areaById[cur.track].label;
    pin.querySelectorAll('.mpin-menu a').forEach((a) => {
      const here = a.dataset.area === cur.track;
      a.setAttribute('href', `#/m/${here ? cur.id : areaById[a.dataset.area].modules[0].id}`);
      if (here) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    sizeBorders();
    /* A tab that just became selected drops its hover border; the one left behind can draw again */
    nav.querySelectorAll('.mtab').forEach(animateBorder);
    const rows = [nav.querySelector('.mtabs-areas'), full];
    if (!nav._bound) {
      nav._bound = true;
      [...rows, pinChips].forEach(bindTabRow);
      /* Web fonts or a new width can change tab sizes: follow without animating */
      if ('ResizeObserver' in window) new ResizeObserver(() => { placeIndicator(nav); rows.forEach((r) => r._edges()); }).observe(nav);
      bindPin(nav, full, pin, pinChips);
    }
    placeIndicator(nav);
    rows.forEach((r) => centreTab(r, animate));
    if (pin.classList.contains('on')) centreTab(pinChips, animate);
  }

  /* Pinned bar: once the module chips scroll up under the header, a slim copy (area pill + module chips)
     slides in below it; the area pill opens a small menu for switching area */
  function bindPin(nav, full, pin, pinChips) {
    const btn = pin.querySelector('.mpin-areabtn'), menu = pin.querySelector('.mpin-menu');
    const setMenu = (open) => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    pin.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });
    pin.addEventListener('focusout', (e) => { if (!pin.querySelector('.mpin-area').contains(e.relatedTarget)) setMenu(false); });
    pin._closeMenu = () => setMenu(false);
    if (!('IntersectionObserver' in window)) return;
    const top = () => document.querySelector('.site-header').offsetHeight;
    let io;
    const watch = () => {
      if (io) io.disconnect();
      io = new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < top();
        if (show === pin.classList.contains('on')) return;
        pin.classList.toggle('on', show);
        pin.inert = !show;
        if (show) centreTab(pinChips, false); else setMenu(false);
      }, { rootMargin: `-${top()}px 0px 0px 0px` });
      io.observe(full);
    };
    watch();
    window.addEventListener('resize', () => { if (nav.isConnected) watch(); });
  }
  /* A click anywhere else closes an open area menu */
  document.addEventListener('click', (e) => {
    const pin = document.querySelector('.mpin');
    if (pin && pin._closeMenu && !e.target.closest('.mpin-area')) pin._closeMenu();
  });

  /* A module's features as a list: icon, title, description and an "open" mark. Used on module pages
     and for the featured workflow on the home page. */
  const featureListHTML = (m, hasShots) => `
    <ol class="mfeats" aria-label="${esc(t('mod.features'))}">
      ${m.features.map((f, i) => `
        <li class="mfeat-row">
          <button class="mfeat" type="button" data-i="${i}" aria-pressed="false">
            <span class="n" aria-hidden="true">${icon(f.icon)}</span>
            <span class="t"><b>${esc(tidyTitle(f.title))}</b><small>${esc(tidy(f.desc))}</small></span>
            ${hasShots ? `<span class="mfeat-open" aria-hidden="true">${EXPAND_SVG}</span>` : ''}
          </button>
          <svg class="drawn-border" aria-hidden="true"></svg>
        </li>`).join('')}
    </ol>`;

  /* Home page featured workflow: its feature rows open the same window (desktop) or sheet (phones)
     as a module page, without changing the address */
  function bindSpotFeatures(root, m) {
    const feats = [...root.querySelectorAll('.mfeat')];
    const mark = (i) => feats.forEach((b, j) => { b.setAttribute('aria-pressed', String(i === j)); b.parentElement.classList.toggle('on', i === j); });
    const originOf = (i) => { const r = (feats[i].querySelector('.mfeat-open') || feats[i]).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    const open = (i) => (narrow() ? openFeatureSheet : openFeatureWindow)(m, i, {
      origin: originOf(i),
      step: (j) => mark(j),
      close: (j) => feats[j].focus({ preventScroll: true })
    });
    feats.forEach((b, i) => {
      b.addEventListener('click', () => { mark(i); open(i); });
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + feats.length) % feats.length;
        feats[n].focus(); mark(n);
      });
    });
    mark(0);
  }

  function renderModule(id, featureIndex, openFeature = false) {
    const m = byId[id];
    if (!m || !visible.includes(m)) { location.hash = '#/'; return; }
    const area = areaById[m.track];
    const tint = AREA_TINT[m.track];
    /* Previous / next run through every module in order, crossing into the next area at the end of one */
    const k = allModules.indexOf(m);
    const prev = allModules[k - 1], next = allModules[k + 1];
    const pagerLink = (x, dir) => x ? pagerHTML(dir, {
      href: `#/m/${x.id}`, title: x.title, ...photoOf(x),
      label: `${dir === 'prev' ? t('pager.prev') : t('pager.next')}${x.track !== m.track ? ` · ${esc(areaById[x.track].label)}` : ''}`
    }) : '<span></span>';
    const hasShots = m.features.some((f) => f.shot) || m.shots.length > 0;

    const html = `
      <section class="mpage tint-${tint}">
        <div class="container">
          ${moduleTabsHTML(m)}
          <span class="mpanel-area">${icon(area.glyph)}${esc(area.label)} · ${numberOf[m.id]}</span>
          <div class="mpanel-inner${hasShots ? '' : ' no-stage'}">
            <div class="mpanel-info">
              <h1 class="mpanel-title"><span class="mpanel-icon"><img src="assets/icons/${iconOf(m)}_icon.svg" alt=""></span>${esc(m.title)}</h1>
              ${LANG !== 'en' && m.enTitle !== m.title ? `<p class="mpanel-inapp">${esc(t('lang.inApp', { x: m.enTitle }))}</p>` : ''}
              <p class="mpanel-intro">${esc(m.intro)}</p>
              ${featureListHTML(m, hasShots)}
              <p class="mpanel-hint">${esc(hasShots ? (canHover() ? t('mod.hintClick') : t('mod.hintTap')) : t('mod.soon'))}</p>
            </div>
            ${hasShots ? `<div class="mpanel-stage"><div class="mpanel-device"></div><p class="cap"></p><p class="zoom-hint">${esc(t('mod.zoom'))}</p></div>` : ''}
          </div>
          <nav class="mpager" aria-label="${esc(t('pager.moduleNav'))}">${pagerLink(prev, 'prev')}${pagerLink(next, 'next')}</nav>
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
      const newArea = page.className.replace(/\s*area-swap/, '') !== next.className;
      page.className = next.className;
      /* New area: the background gradient swings round to the new colours (restarted on every change) */
      if (newArea && !reducedMotion()) { void page.offsetWidth; page.classList.add('area-swap'); }
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
    bindFeatures(app.querySelector('.mpage'), m, featureIndex || 0, openFeature);
    document.title = `${m.title} · ${t('brand.title')}`;
  }

  /* ---------- Search ---------- */
  const index = visible.flatMap((m) => [
    { m, i: 0, title: m.title, text: m.intro, en: `${m.enTitle} ${m.raw}`, kind: 'Module' },
    ...m.features.map((f, i) => ({ m, i, title: f.title, text: f.desc, en: f.enTitle, kind: m.title }))
  ]);
  /* One search box: an input, its results list and a clear button. `outside` is the element a click must
     fall outside of to close the list (the hero), or null when the list always shows (the header panel). */
  function searchBox(q, box, clear, outside) {
    let active = -1;
    const hl = (s, term) => esc(s).replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
    const close = () => { if (outside) box.classList.remove('show'); q.setAttribute('aria-expanded', 'false'); active = -1; };
    const run = () => {
      const term = q.value.trim().toLowerCase();
      clear.classList.toggle('show', !!term);
      if (term.length < 2) {
        if (!outside) box.innerHTML = `<div class="empty">${esc(t('search.short'))}</div>`;
        return close();
      }
      const hits = index
        .map((r) => {
          /* The English names from the app also match, so a term seen on screen always finds its feature */
          const tl = r.title.toLowerCase(), x = r.text.toLowerCase(), en = (r.en || '').toLowerCase();
          const score = tl.startsWith(term) ? 3 : tl.includes(term) ? 2 : x.includes(term) || en.includes(term) ? 1 : 0;
          return { ...r, score: score + (r.kind === 'Module' && score ? .5 : 0) };
        })
        .filter((r) => r.score)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      box.innerHTML = (hits.length ? `<div class="sr-head">${esc(t('search.top'))}</div>` : '') + (hits.length
        ? hits.map((r) => `<a role="option" href="#/m/${r.m.id}/${r.i}"><div class="r-title">${hl(r.title, term)}</div><div class="r-meta">${esc(r.kind === 'Module' ? areaById[r.m.track].label : r.kind)}</div></a>`).join('')
        : `<div class="empty">${esc(t('search.none', { q: q.value }))}</div>`);
      box.classList.add('show'); q.setAttribute('aria-expanded', 'true'); active = -1;
    };
    q.addEventListener('input', run);
    q.addEventListener('focus', run);
    q.addEventListener('keydown', (e) => {
      const items = [...box.querySelectorAll('a')];
      if (e.key === 'Escape' && outside) return close();
      if (!items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle('active', i === active));
      }
      if (e.key === 'Enter') { e.preventDefault(); (items[active] || items[0]).click(); }
    });
    clear.addEventListener('click', () => { q.value = ''; run(); q.focus(); });
    if (outside) document.addEventListener('click', (e) => { if (!e.target.closest(outside)) close(); });
    return run;
  }
  function bindSearch() {
    const q = document.getElementById('q');
    searchBox(q, document.getElementById('q-results'), app.querySelector('.search-clear'), '.hero-search');
    rotatePlaceholder(q);
  }

  /* Header search: the search icon in the menu bar opens a search panel on any page (also "/" or Ctrl/Cmd + K) */
  const qs = document.createElement('div');
  qs.className = 'qs';
  qs.hidden = true;
  qs.innerHTML = `
    <div class="qs-backdrop" data-close></div>
    <div class="qs-panel" role="dialog" aria-modal="true" aria-label="${esc(t('nav.search'))}">
      <div class="search-field">
        ${SEARCH_SVG}
        <label class="sr-only" for="qs-input">${esc(t('search.label'))}</label>
        <input id="qs-input" type="search" autocomplete="off" placeholder="" aria-controls="qs-results" aria-expanded="false">
        ${cueHTML()}
        <button class="search-clear" type="button" aria-label="${esc(t('search.clear'))}">${CLOSE_SVG}</button>
        <button class="qs-close" type="button" data-close>Esc</button>
      </div>
      <div class="search-results show" id="qs-results" role="listbox"></div>
    </div>`;
  document.body.append(qs);
  const qsInput = qs.querySelector('#qs-input');
  const qsRun = searchBox(qsInput, qs.querySelector('#qs-results'), qs.querySelector('.search-clear'), null);
  rotatePlaceholder(qsInput, { keepOnFocus: true });
  const searchBtn = document.querySelector('.nav-search');
  let qsReturn = null;
  const openSearch = () => {
    if (!qs.hidden) return;
    closeNav();
    qsReturn = document.activeElement;
    qs.hidden = false;
    document.body.classList.add('qs-open');
    requestAnimationFrame(() => qs.classList.add('in'));
    qsInput.value = ''; qsRun(); qsInput.dispatchEvent(new Event('input'));
    qsInput.focus();
  };
  const closeSearch = (restore = true) => {
    if (qs.hidden) return;
    qs.classList.remove('in');
    qs.hidden = true;
    document.body.classList.remove('qs-open');
    if (restore && qsReturn && qsReturn.focus) qsReturn.focus({ preventScroll: true });
  };
  searchBtn.addEventListener('click', openSearch);
  qs.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeSearch();
    else if (e.target.closest('#qs-results a')) closeSearch(false);
  });
  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest && e.target.closest('input, textarea, [contenteditable]');
    if (e.key === 'Escape' && !qs.hidden) { e.preventDefault(); closeSearch(); }
    else if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      if (document.querySelector('.fwin, .gallery')) return;
      e.preventDefault(); openSearch();
    }
  });

  /* Hero parallax: the photo drifts slower than the page, content rides over it */
  let parallaxOff = null;
  function bindParallax() {
    if (parallaxOff) parallaxOff();
    const hero = app.querySelector('.hero');
    const bg = hero && hero.querySelector('.hero-slides');
    const inner = hero && hero.querySelector('.hero-inner');
    if (!bg) return;
    const stopBanners = rotateBanners(bg);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { parallaxOff = () => { stopBanners(); parallaxOff = null; }; return; }
    let ticking = false;
    const cta = app.querySelector('.cta');
    const layers = cta ? [...cta.querySelectorAll('[data-depth]')] : [];
    const update = () => {
      ticking = false;
      const h = hero.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);
      bg.style.transform = `translate3d(0, ${(y * 0.45).toFixed(1)}px, 0)`;
      inner.style.opacity = String(Math.max(0, 1 - y / (h * 1.3)).toFixed(3));
      inner.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
      /* "Stuck on a task?": each line drifts at its own depth as the band crosses the screen */
      if (cta) {
        const r = cta.getBoundingClientRect(), vh = window.innerHeight;
        if (r.bottom > 0 && r.top < vh) {
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          layers.forEach((el) => { el.style.transform = `translate3d(0, ${(p * el.dataset.depth * 60).toFixed(1)}px, 0)`; });
        }
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    parallaxOff = () => { stopBanners(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); parallaxOff = null; };
    update();
  }
  /* At each turn (next photo loaded first): the current photo blurs while a wash of the next photo's key colour
     rises over it; the next photo then appears through the wash, still soft, and sharpens as the wash clears.
     Returns a stop function. */
  function rotateBanners(box) {
    let shown = bannerSlot() % BANNERS.length, timer = 0;
    const schedule = () => {
      const wait = BANNER_EVERY - ((Date.now() - bannerStart) % BANNER_EVERY);
      timer = setTimeout(turn, wait + 30);
    };
    const turn = () => {
      if (!box.isConnected) return;
      schedule();
      const i = bannerSlot() % BANNERS.length;
      if (document.hidden || i === shown) return;
      const b = BANNERS[i];
      const img = new Image();
      img.onload = () => {
        if (!box.isConnected) return;
        shown = i;
        box.querySelectorAll('.hero-wash').forEach((w) => w.remove());
        const old = box.querySelectorAll('.hero-bg');
        const el = document.createElement('div');
        el.className = 'hero-bg morph';
        el.style.cssText = `background-image:url('${bannerSrc(b)}');--x:${b.x};--y:${b.y}`;
        const wash = document.createElement('div');
        wash.className = 'hero-wash';
        wash.style.setProperty('--wash', b.c);
        box.append(el, wash);
        old.forEach((o) => { o.classList.remove('enter', 'morph'); o.classList.add('blur-out'); });
        el.addEventListener('animationend', () => { old.forEach((o) => o.remove()); wash.remove(); el.classList.remove('morph'); }, { once: true });
      };
      img.src = bannerSrc(b);
    };
    /* Back on the home page with a photo not yet loaded: it fades in once it arrives, rather than popping in */
    const first = box.querySelector('.hero-bg'), probe = new Image();
    probe.src = bannerSrc(BANNERS[shown]);
    if (first && !probe.complete) {
      first.style.opacity = '0';
      probe.onload = () => { first.style.opacity = ''; first.classList.add('enter'); first.addEventListener('animationend', () => first.classList.remove('enter'), { once: true }); };
    }
    schedule();
    return () => clearTimeout(timer);
  }

  /* Rotating placeholder: every visible module, each followed by one of its tasks */
  /* keepOnFocus: the cue keeps rotating while the (empty) box has focus, as in the header search panel */
  function rotatePlaceholder(q, { keepOnFocus = false } = {}) {
    const field = q.closest('.search-field');
    clearInterval(field._phTimer);
    const rot = field.querySelector('.ph-rot');
    const GENERIC = /filter|search|edit|delet|listing|overview|status|view/i;
    const names = visible.flatMap((m) => {
      const task = m.features.find((f) => !GENERIC.test(f.title) && /\s/.test(f.title.trim()) && f.title.toLowerCase() !== m.title.toLowerCase());
      return task ? [m.title, tidyTitle(task.title)] : [m.title];
    });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    rot.textContent = names[0];
    const sync = () => field.classList.toggle('ph-hidden', !!q.value || (!keepOnFocus && document.activeElement === q));
    ['input', 'focus', 'blur'].forEach((ev) => q.addEventListener(ev, sync));
    sync();
    field._phTimer = setInterval(() => {
      if (!document.body.contains(rot)) return clearInterval(field._phTimer);
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
  /* ---------- Feature window (desktop and laptop) ----------
     One feature at a time: its screen beside its title and description, with arrows either side
     stepping through the module's features. Left/right keys step, Esc or a click outside closes. */
  const EXPAND_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
  const CHEV_L = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  const CHEV_R = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  let closeFeatureWindow = null;
  function openFeatureWindow(m, start, { step, close, origin } = {}) {
    if (closeFeatureWindow) closeFeatureWindow(true);
    const area = areaById[m.track];
    const n = m.features.length;
    const shotOf = (i) => {
      const f = m.features[i];
      const src = f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src);
      return src ? shotFor(m, src) : null;
    };
    const w = document.createElement('div');
    w.className = `fwin tint-${AREA_TINT[m.track]}`;
    w.innerHTML = `
      <div class="fwin-backdrop" data-close></div>
      <button class="fwin-arrow prev" type="button" aria-label="${esc(t('win.prev'))}">${CHEV_L}</button>
      <div class="fwin-card" role="dialog" aria-modal="true" aria-labelledby="fwin-title">
        <button class="fwin-close" type="button" data-close aria-label="${esc(t('win.close'))}">${CLOSE_SVG}</button>
        <div class="fwin-stage"><div class="fwin-device"></div></div>
        <div class="fwin-info">
          <span class="mpanel-area">${icon(area.glyph)}${esc(area.label)} · ${esc(m.title)}</span>
          <div class="fwin-text">
            <div class="fwin-head"><span class="fwin-ic" aria-hidden="true"></span><p class="fwin-count" aria-live="polite"></p></div>
            <h2 class="fwin-title" id="fwin-title"></h2><p class="fwin-desc"></p>
          </div>
          <div class="fwin-dots">${m.features.map((f, i) => `<button type="button" data-i="${i}" aria-label="${esc(tidyTitle(f.title))}"></button>`).join('')}</div>
        </div>
      </div>
      <button class="fwin-arrow next" type="button" aria-label="${esc(t('win.next'))}">${CHEV_R}</button>`;
    document.body.append(w);
    document.body.classList.add('fwin-open');
    const dev = w.querySelector('.fwin-device'), text = w.querySelector('.fwin-text');
    const prev = w.querySelector('.fwin-arrow.prev'), next = w.querySelector('.fwin-arrow.next');
    const dots = [...w.querySelectorAll('.fwin-dots button')];
    const animals = animalsFor(m);
    let idx = -1;
    const go = (i, dir = 0) => {
      if (i < 0 || i >= n || i === idx) return;
      idx = i;
      const f = m.features[i], shot = shotOf(i);
      w.querySelector('.fwin-count').textContent = t('win.count', { i: i + 1, n });
      w.querySelector('.fwin-ic').innerHTML = icon(f.icon);
      w.querySelector('.fwin-title').textContent = tidyTitle(f.title);
      w.querySelector('.fwin-desc').textContent = tidy(f.desc);
      /* The wash starts a little below the text, however long this feature's description is */
      setAnimal(w.querySelector('.fwin-info'), animals[i % animals.length], text.offsetTop + text.offsetHeight);
      dev.innerHTML = shot ? deviceHTML(shot) : `<p class="fwin-empty">${esc(t('win.soon'))}</p>`;
      /* The screen slides in from the side being moved to; the text fades up */
      [dev, text].forEach((el) => { el.classList.remove('in-l', 'in-r', 'in-up'); void el.offsetWidth; });
      dev.classList.add(dir > 0 ? 'in-r' : dir < 0 ? 'in-l' : 'in-up');
      text.classList.add('in-up');
      const had = document.activeElement;
      prev.disabled = i === 0; next.disabled = i === n - 1;
      /* An arrow that just became disabled drops focus; hand it to the other arrow */
      if (had && had.disabled) (had === next ? prev : next).focus({ preventScroll: true });
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
      [i - 1, i + 1].forEach((j) => { const s2 = j >= 0 && j < n && shotOf(j); if (s2) new Image().src = s2.src; });
      if (step) step(i);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); shut(); }
      /* In right-to-left reading, the next feature is to the left */
      else if (e.key === (RTL ? 'ArrowLeft' : 'ArrowRight')) { e.preventDefault(); go(idx + 1, 1); }
      else if (e.key === (RTL ? 'ArrowRight' : 'ArrowLeft')) { e.preventDefault(); go(idx - 1, -1); }
      else if (e.key === 'Tab') {
        /* Keep focus inside the window */
        const f = [...w.querySelectorAll('button:not([disabled])')];
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    const shut = (instant) => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('fwin-open');
      closeFeatureWindow = null;
      if (instant || reducedMotion()) w.remove();
      else { w.classList.remove('in'); w.classList.add('out'); setTimeout(() => w.remove(), 460); }
      if (!instant && close) close(idx);
    };
    closeFeatureWindow = shut;
    document.addEventListener('keydown', onKey);
    prev.addEventListener('click', () => go(idx - 1, -1));
    next.addEventListener('click', () => go(idx + 1, 1));
    dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.i, +d.dataset.i > idx ? 1 : -1)));
    w.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) shut(); });
    go(start);
    /* Radial opening: a circle grows from the clicked feature until it covers the whole card */
    const card = w.querySelector('.fwin-card');
    const cr = card.getBoundingClientRect();
    const o = origin || { x: cr.left + cr.width / 2, y: cr.top + cr.height / 2 };
    const ox = o.x - cr.left, oy = o.y - cr.top;
    const r = Math.ceil(Math.max(Math.hypot(ox, oy), Math.hypot(cr.width - ox, oy), Math.hypot(ox, cr.height - oy), Math.hypot(cr.width - ox, cr.height - oy)));
    /* Place the starting point without animating to it, so the circle really starts at the feature */
    card.style.transition = 'none';
    card.style.setProperty('--ox', `${Math.round(ox)}px`);
    card.style.setProperty('--oy', `${Math.round(oy)}px`);
    card.style.setProperty('--r', `${r}px`);
    void card.offsetWidth;
    card.style.transition = '';
    requestAnimationFrame(() => w.classList.add('in'));
    w.querySelector('.fwin-close').focus({ preventScroll: true });
  }

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

  /* Full-screen screen viewer. With opts.sheet it is the phone version of the feature window: one slide per
     feature with its icon and text, arrows as well as swipes, the area colours, and a radial opening. */
  function openGallery(m, slides, start, returnFocusTo, opts = {}) {
    const sheet = !!opts.sheet;
    const g = document.createElement('div');
    g.className = sheet ? `gallery sheet tint-${AREA_TINT[m.track]}` : 'gallery';
    g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-label', t('gal.label', { x: m.title }));
    g.innerHTML = `
      <div class="g-top">
        <span class="g-count" aria-live="polite"></span>
        <span class="g-title">${sheet ? `${esc(areaById[m.track].label)} · ` : ''}${esc(m.title)}</span>
        <button class="g-close" type="button" aria-label="${esc(t('gal.close'))}">${CLOSE_SVG}</button>
      </div>
      <div class="g-stage"><div class="g-track"><span class="g-frame"><img class="g-img" alt="" draggable="false"></span></div></div>
      <div class="g-info"><div class="g-head"><span class="g-ic" aria-hidden="true"></span><span class="g-fcount"></span></div><b class="g-ft"></b><p class="g-fd"></p></div>
      <div class="g-nav">
        <button class="g-arrow g-prev" type="button" aria-label="${esc(t('win.prev'))}">${CHEV_L}</button>
        <div class="g-dots">${slides.map((sl, i) => `<button type="button" aria-label="${esc(sl.title || t('gal.screen', { i: i + 1 }))}" data-i="${i}"></button>`).join('')}</div>
        <button class="g-arrow g-next" type="button" aria-label="${esc(t('win.next'))}">${CHEV_R}</button>
      </div>
      <p class="g-hint">${esc(t('gal.hint'))}</p>`;
    document.body.append(g);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const stageEl = g.querySelector('.g-stage'), track = g.querySelector('.g-track'), img = g.querySelector('.g-img');
    const dots = [...g.querySelectorAll('.g-dots button')];
    let idx = start, scale = 1, tx = 0, ty = 0, baseW = 0, baseH = 0, cx = 0, cy = 0;
    /* What zooms: in the sheet the whole phone, bezel and all; in the plain gallery the bare screen */
    const zt = sheet ? img.parentNode : img;
    const apply = (anim) => {
      zt.style.transition = anim ? 'transform .28s cubic-bezier(.22,.8,.24,1)' : 'none';
      zt.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };
    /* Size and resting centre (from the stage centre) of the zoomed element; the sheet sits it near the top */
    const measure = () => {
      const b = zt.getBoundingClientRect(), r = stageEl.getBoundingClientRect();
      baseW = b.width / scale; baseH = b.height / scale;
      cx = b.left + b.width / 2 - tx - (r.left + r.width / 2); cy = b.top + b.height / 2 - ty - (r.top + r.height / 2);
    };
    /* Pan only as far as keeps the stage covered, and always allow the resting place */
    const clampPan = () => {
      const r = stageEl.getBoundingClientRect();
      const mx = Math.max(0, (baseW * scale - r.width) / 2), my = Math.max(0, (baseH * scale - r.height) / 2);
      tx = Math.max(Math.min(0, -mx - cx), Math.min(Math.max(0, mx - cx), tx));
      ty = Math.max(Math.min(0, -my - cy), Math.min(Math.max(0, my - cy), ty));
    };
    const resetZoom = (anim) => { scale = 1; tx = 0; ty = 0; apply(anim); g.classList.remove('zoomed'); };
    const go = (i, dir = 0) => {
      /* The feature sheet stops at the first and last feature; the plain gallery wraps round */
      if (sheet && (i < 0 || i >= slides.length)) {
        track.style.transition = 'transform .28s cubic-bezier(.22,.8,.24,1), opacity .2s ease';
        track.style.transform = 'none'; track.style.opacity = '1';
        return;
      }
      idx = (i + slides.length) % slides.length;
      const sl = slides[idx];
      resetZoom(false);
      track.style.transition = 'none';
      track.style.transform = dir ? `translateX(${dir * (RTL ? -40 : 40)}px)` : 'none';
      track.style.opacity = dir ? '0' : '1';
      img.src = sl.src; img.alt = sl.alt;
      /* Phone and tablet screens sit in the area-coloured bezel (sheet only); web screens stay bare */
      img.parentNode.classList.toggle('web', sl.device === 'web');
      g.querySelector('.g-count').textContent = `${idx + 1} / ${slides.length}`;
      g.querySelector('.g-ft').textContent = sl.title;
      g.querySelector('.g-fd').textContent = sl.desc;
      if (sheet) {
        g.querySelector('.g-ic').innerHTML = icon(sl.icon);
        g.querySelector('.g-fcount').textContent = t('win.count', { i: idx + 1, n: slides.length });
        g.querySelector('.g-prev').disabled = idx === 0;
        g.querySelector('.g-next').disabled = idx === slides.length - 1;
        const info = g.querySelector('.g-info');
        info.classList.remove('in-up'); void info.offsetWidth; info.classList.add('in-up');
        fitSheet();
        if (opts.step) opts.step(idx);
      }
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === idx)));
      requestAnimationFrame(() => {
        track.style.transition = 'transform .32s cubic-bezier(.22,.8,.24,1), opacity .25s ease';
        track.style.transform = 'none'; track.style.opacity = '1';
      });
      [idx + 1, idx - 1].forEach((j) => { const n = slides[(j + slides.length) % slides.length]; if (n) new Image().src = n.src; });
    };
    img.addEventListener('load', measure);
    /* Sheet: fit the screen inside the space its area actually has, with room above and below */
    const fitSheet = () => {
      if (!sheet) return;
      requestAnimationFrame(() => { img.style.maxHeight = `${Math.max(160, stageEl.clientHeight - 18 - 34 - 14)}px`; });
    };
    if (sheet) window.addEventListener('resize', fitSheet);

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
        measure();
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: scale, u: { x: (mid.x - cx - tx) / scale, y: (mid.y - cy - ty) / scale } };
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
        tx = mid.x - cx - pinch.u.x * scale; ty = mid.y - cy - pinch.u.y * scale;
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
          else { measure(); const p = toStage(e.clientX, e.clientY); scale = ZOOM_TAP; tx = -(p.x - cx) * (scale - 1); ty = -(p.y - cy) * (scale - 1); clampPan(); apply(true); g.classList.add('zoomed'); }
        } else lastTap = now;
        return;
      }
      if (scale > 1.01) return;
      track.style.transition = 'transform .28s cubic-bezier(.22,.8,.24,1), opacity .2s ease';
      if (dy > 110 && Math.abs(dy) > Math.abs(dx)) return close();
      const fwd = RTL ? -dx : dx;
      if (fwd < -60 && slides.length > 1) return go(idx + 1, 1);
      if (fwd > 60 && slides.length > 1) return go(idx - 1, -1);
      track.style.transform = 'none'; track.style.opacity = '1';
    };
    stageEl.addEventListener('pointerup', end);
    stageEl.addEventListener('pointercancel', end);

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === (RTL ? 'ArrowLeft' : 'ArrowRight')) go(idx + 1, 1);
      if (e.key === (RTL ? 'ArrowRight' : 'ArrowLeft')) go(idx - 1, -1);
    };
    document.addEventListener('keydown', onKey);
    dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.i, +d.dataset.i > idx ? 1 : -1)));
    g.querySelector('.g-prev').addEventListener('click', () => go(idx - 1, -1));
    g.querySelector('.g-next').addEventListener('click', () => go(idx + 1, 1));
    function close() {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      g.classList.remove('in');
      g.classList.add('out');
      setTimeout(() => g.remove(), sheet ? 420 : 220);
      if (opts.close) opts.close(idx);
      if (returnFocusTo && returnFocusTo.focus) returnFocusTo.focus({ preventScroll: true });
    }
    g.querySelector('.g-close').addEventListener('click', close);
    go(start);
    if (sheet) {
      /* Radial opening from the tapped feature, as on desktop */
      const o = opts.origin || { x: innerWidth / 2, y: innerHeight / 2 };
      const r = Math.ceil(Math.max(Math.hypot(o.x, o.y), Math.hypot(innerWidth - o.x, o.y), Math.hypot(o.x, innerHeight - o.y), Math.hypot(innerWidth - o.x, innerHeight - o.y)));
      g.style.transition = 'none';
      g.style.setProperty('--ox', `${Math.round(o.x)}px`); g.style.setProperty('--oy', `${Math.round(o.y)}px`); g.style.setProperty('--r', `${r}px`);
      void g.offsetWidth;
      g.style.transition = '';
    }
    requestAnimationFrame(() => g.classList.add('in'));
    g.querySelector('.g-close').focus({ preventScroll: true });
  }
  /* Phones: a feature's screen and details open in the full-screen sheet */
  function openFeatureSheet(m, start, { origin, step, close, returnFocusTo } = {}) {
    const slides = m.features.map((f, i) => {
      const src = f.shot || (m.shots[i] && m.shots[i].src) || (m.shots[0] && m.shots[0].src);
      const shot = src ? shotFor(m, src) : null;
      return { src: src || '', alt: (shot && shot.alt) || f.title, title: tidyTitle(f.title), desc: tidy(f.desc), icon: f.icon, device: shot && shot.device };
    });
    openGallery(m, slides, start, returnFocusTo, { sheet: true, origin, step, close });
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
    if (closeFeatureWindow) closeFeatureWindow(true);
    if (pageTeardown) pageTeardown();
    if ((name === 'm' || name === 'kit' || name === 'guide') && id) {
      if (onHome) homeY = window.scrollY;
      onHome = false;
      if (parallaxOff) parallaxOff();
      if (name === 'kit') renderKit(id);
      else if (name === 'guide') { lastKit = null; renderGuide(id); }
      else { lastKit = null; renderModule(id, Number(f) || 0, f !== undefined && f !== ''); }
      window.scrollTo(0, 0);
    } else {
      document.title = t('brand.title');
      const cameBack = !onHome && !goTop && !pendingScroll && homeY;
      lastKit = null;
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

  /* ---------- Language: page shell text, the switcher and the review note ---------- */
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  /* The iris button repaints its label from data-text, so it follows the translated label */
  document.querySelectorAll('.btn-cta[data-text]').forEach((el) => { el.dataset.text = el.textContent.trim(); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-title]').forEach((el) => el.setAttribute('title', t(el.dataset.i18nTitle)));
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
  const LANGS = window.ANTZ_LANGS || [{ code: 'en', name: 'English' }];
  /* Switching saves the choice and reloads at the same place; the page is then built in the new language */
  const setLang = (code) => {
    try { localStorage.setItem('antz-lang', code); } catch (e) { /* blocked: the URL still carries it */ }
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    if (code !== 'en') url.searchParams.set('lang', code);
    /* Set the address, then reload: a change only after # would not reload the page by itself */
    history.replaceState(null, '', url.toString());
    location.reload();
  };
  const langBox = document.querySelector('.nav-lang');
  if (langBox) {
    const btn = langBox.querySelector('.nav-lang-btn'), menu = langBox.querySelector('.nav-lang-menu');
    langBox.querySelector('.nav-lang-code').textContent = LANG.toUpperCase();
    menu.innerHTML = LANGS.map((l) => `<button type="button" role="menuitemradio" aria-checked="${l.code === LANG}" data-lang="${l.code}"><span lang="${l.code}" dir="${l.dir || 'ltr'}">${esc(l.name)}</span><small>${l.code.toUpperCase()}</small></button>`).join('')
      + (LANG !== 'en' ? `<p class="nav-lang-note">${esc(t('lang.note'))}</p>` : '');
    /* Opening: unhide, centre the circle on the globe button, then let the class grow it (see .nav-lang-menu).
       Closing: shrink it back, then hide once the circle has gone. */
    let hideTimer = 0;
    const setMenu = (open) => {
      clearTimeout(hideTimer);
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        menu.hidden = false;
        const b = btn.getBoundingClientRect(), m = menu.getBoundingClientRect();
        const ox = b.left + b.width / 2 - m.left, oy = b.top + b.height / 2 - m.top;
        const far = Math.max(...[[0, 0], [m.width, 0], [0, m.height], [m.width, m.height]].map(([x, y]) => Math.hypot(x - ox, y - oy)));
        menu.style.transition = 'none';   /* move the closed circle onto the button without animating it there */
        menu.style.setProperty('--ox', `${ox.toFixed(1)}px`);
        menu.style.setProperty('--oy', `${oy.toFixed(1)}px`);
        menu.style.setProperty('--or', `${Math.ceil(far + 48)}px`);
        void menu.offsetWidth;
        menu.style.transition = '';
        langBox.classList.add('open');
      } else {
        langBox.classList.remove('open');
        hideTimer = setTimeout(() => { menu.hidden = true; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
      }
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!langBox.classList.contains('open')); if (langBox.classList.contains('open')) (menu.querySelector('[aria-checked="true"]') || menu.firstElementChild).focus(); });
    menu.addEventListener('click', (e) => { const b = e.target.closest('[data-lang]'); if (b) { setMenu(false); if (b.dataset.lang !== LANG) setLang(b.dataset.lang); } });
    menu.addEventListener('keydown', (e) => {
      const items = [...menu.querySelectorAll('[data-lang]')], i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
      if (e.key === 'Escape') { setMenu(false); btn.focus(); }
    });
    document.addEventListener('click', (e) => { if (langBox.classList.contains('open') && !e.target.closest('.nav-lang')) setMenu(false); });
  }
  /* Machine translations say so until a native speaker has reviewed them (dismissed per language) */
  const reviewed = !!(PACK.meta && PACK.meta.reviewed);
  let noteGone = false;
  try { noteGone = localStorage.getItem(`antz-lang-note-${LANG}`) === '1'; } catch (e) { /* ignore */ }
  if (LANG !== 'en' && !reviewed && !noteGone) {
    const note = document.createElement('div');
    note.className = 'lang-toast';
    note.setAttribute('role', 'status');
    note.innerHTML = `<p>${esc(t('lang.note'))}</p><button type="button" class="lang-toast-en" lang="en">${esc(UI['lang.english'])}</button><button type="button" class="lang-toast-x" aria-label="${esc(t('lang.dismiss'))}">${CLOSE_SVG}</button>`;
    document.body.append(note);
    note.querySelector('.lang-toast-en').addEventListener('click', () => setLang('en'));
    /* It steps aside once the reader starts scrolling, so it never covers what they are reading */
    const onScrollNote = () => { if (window.scrollY > 240) { note.classList.add('away'); window.removeEventListener('scroll', onScrollNote); setTimeout(() => note.remove(), 400); } };
    window.addEventListener('scroll', onScrollNote, { passive: true });
    note.querySelector('.lang-toast-x').addEventListener('click', () => {
      try { localStorage.setItem(`antz-lang-note-${LANG}`, '1'); } catch (e) { /* ignore */ }
      note.remove();
    });
  }

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
