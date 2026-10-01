/* Re-create lang/en.json (the translation source) from i18n.js and content.json.
   Run from antz-onboard/:  node lang/extract.js   then translate any new or changed strings and run lang/build.py */
const fs = require('fs');
global.window = {};
global.document = { documentElement: {}, currentScript: null, write() {} };
global.location = { search: '' };
global.localStorage = { getItem() { return null; }, setItem() {} };
eval(fs.readFileSync('i18n.js', 'utf8'));
const d = JSON.parse(fs.readFileSync('content.json', 'utf8'));
const tidy = (s) => String(s ?? '').replace(/\s*—\s*/g, ', ').replace(/\s+-\s+/g, ', ');
/* Keep in step with OVERRIDES in app.js */
const OVR = { housing: 'The Housing module organises animal habitats across your sites, sections and enclosures, so every animal has a known place and every change is tracked. Access at each level is permission-based.' };
const SUM = { 'chat-module': 'One-on-one and group messaging, media sharing and real-time notifications, kept securely inside the platform', 'focus-hub': 'Your favourite animals and enclosures and bookmarked records, in one place for quick access' };
const summary = (raw, id) => {
  if (SUM[id]) return SUM[id];
  let t = raw.replace(/^On the (app|web console),\s*/i, '').replace(/^The web companion to [^—]+—\s*/, '').replace(/^The web companion\s+/, '')
    .replace(/^The\s+.*?\b(module|feature)\s+(is\s+(designed to|a|the)\s+)?/i, '');
  t = tidy(t.split(/\s—\s|\.\s/)[0]).replace(/[.,]\s*$/, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const tracks = {};
d.tracks.filter((t) => t.id !== 'foundations').forEach((t) => { tracks[t.id] = { label: t.label, desc: tidy(t.desc) }; });
const modules = {};
d.modules.filter((m) => m.status !== 'needs-content').forEach((m) => {
  const intro = OVR[m.id] || m.intro;
  const o = { title: m.title, intro: tidy(intro) };
  if (m.track !== 'foundations') o.summary = summary(intro, m.id);
  o.features = m.features.map((f) => ({ title: f.title, desc: tidy(f.desc), alt: f.alt || '' }));
  const sh = {};
  (m.shots || []).forEach((s) => { if (s.alt && !m.features.some((f) => f.alt === s.alt)) sh[s.src] = s.alt; });
  if (Object.keys(sh).length) o.shots = sh;
  modules[m.id] = o;
});
fs.writeFileSync('lang/en.json', JSON.stringify({ meta: { lang: 'en', source: true }, ui: window.ANTZ_UI_EN, tracks, modules }, null, 1));
console.log('wrote lang/en.json:', Object.keys(modules).length, 'modules');
