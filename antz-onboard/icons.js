/* icon set — extracted from data.js so content and chrome stay separate */
const ICONS = {
  /* references the <symbol> in index.html — geometry is stored once, not per row */
  antzmark: '<svg viewBox="0 0 51.6065 55.9995" fill="currentColor"><use href="#antz-mark"/></svg>',
  add:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  edit:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>',
  priority: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3L12 3z"/><path d="M12 9v4M12 16v.5"/></svg>',
  link:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1"/></svg>',
  eye:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  bell:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6z"/><path d="M10 20a2 2 0 004 0"/></svg>',
  filter:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 5h18l-7 8v6l-4-2v-4L3 5z"/></svg>',
  species:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>',
  manage:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="16" r="3"/></svg>',
  batch:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10h8M8 14h5"/></svg>',
  pets:     '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="5.5" cy="10" rx="2" ry="2.6"/><ellipse cx="9.5" cy="6.5" rx="2" ry="2.7"/><ellipse cx="14.5" cy="6.5" rx="2" ry="2.7"/><ellipse cx="18.5" cy="10" rx="2" ry="2.6"/><path d="M12 13c3.2 0 5.5 2.2 5.5 4.4 0 1.7-1.4 2.6-3.2 2.6h-4.6c-1.8 0-3.2-.9-3.2-2.6C6.5 15.2 8.8 13 12 13z"/></svg>',
  /* Housing: barn/enclosure with fence rails (Figma "Subtract") */
  home:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6L2.6 8.2V21h18.8V8.2L12 2.6zm-5.6 8.6h11.2v1.9H6.4v-1.9zm0 3.6h11.2v1.9H6.4v-1.9zm0 3.6h11.2v1.9H6.4v-1.9z"/></svg>',
  /* Medical: cross inside the enclosure silhouette */
  medical:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6L2.6 8.2V21h18.8V8.2L12 2.6zm1.5 7.1v2.6h2.6v2.6h-2.6v2.6h-2.6v-2.6H8.3v-2.6h2.6V9.7h2.6z"/></svg>',
  note:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h11l4 4v14H5V3zm3 6h8v2H8V9zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>',
  users:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.6 2.9-6.1 6.5-6.1s6.5 2.5 6.5 6.1H2.5z"/><circle cx="17.5" cy="9.5" r="2.6"/><path d="M17.5 14c2.8 0 4.5 1.9 4.5 4.4h-4.1c0-1.7-.6-3.2-1.6-4.3.4-.1.8-.1 1.2-.1z"/></svg>',
  chat:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v13H8l-5 4V4zm4 4h10v2H7V8zm0 4h7v2H7v-2z"/></svg>',
  tag:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.6 2.6L21 12l-9 9-9.4-9.4V2.6h9zM7.4 8.4a1.9 1.9 0 100-3.8 1.9 1.9 0 000 3.8z"/></svg>',
  transfer: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l-5 5 5 5v-3.5h8v-3H7V5zm10 4v3.5H9v3h8V19l5-5-5-5z"/></svg>',
  approve:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 3.6v5.6c0 5-3.4 9.4-8 10.8-4.6-1.4-8-5.8-8-10.8V5.6L12 2zm-1.2 14.4l6-6-1.8-1.8-4.2 4.2-2-2L7 12.6l3.8 3.8z"/></svg>',
  alert:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.4L22.4 21H1.6L12 2.4zm-1.3 6.4v5.6h2.6V8.8h-2.6zm0 7.2v2.5h2.6V16h-2.6z"/></svg>',
  medicine: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.6 3h8.8a2 2 0 012 2v1.6H5.6V5a2 2 0 012-2zM5.6 8.6h12.8V19a2 2 0 01-2 2H7.6a2 2 0 01-2-2V8.6zm5.1 2.6v2.4H8.3v2.6h2.4v2.4h2.6v-2.4h2.4v-2.6h-2.4v-2.4h-2.6z"/></svg>',
  vaccine:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 1.8l4.7 4.7-1.8 1.8-1-1-2.4 2.4 1.6 1.6-1.8 1.8-1.6-1.6-7.3 7.3L2 21l2.2-5.9 7.3-7.3-1.6-1.6 1.8-1.8 1.6 1.6 2.4-2.4-1-1 1.8-1.8z"/></svg>',
  focus:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6.5A5.5 5.5 0 1012 17.5 5.5 5.5 0 0012 6.5zm0 2.6a2.9 2.9 0 110 5.8 2.9 2.9 0 010-5.8zM11 1.6h2v3.2h-2V1.6zm0 17.6h2v3.2h-2v-3.2zM1.6 11h3.2v2H1.6v-2zm17.6 0h3.2v2h-3.2v-2z"/></svg>',
  egg:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.9 0 7 5.6 7 10.1 0 5-3.1 9.5-7 9.5s-7-4.5-7-9.5c0-4.5 3.1-10.1 7-10.1z"/></svg>',
  announce: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9.6h4l8-5.2v15.2l-8-5.2H3V9.6zm14.6 2.4c0-1.7-.8-3.2-2-4.1v8.2c1.2-.9 2-2.4 2-4.1zm1 -7.4A8.6 8.6 0 0122 12a8.6 8.6 0 01-3.4 7.4l-1.2-1.6A6.6 6.6 0 0020 12a6.6 6.6 0 00-2.6-5.8l1.2-1.6z"/></svg>',
  help:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2a9.8 9.8 0 100 19.6 9.8 9.8 0 000-19.6zm.1 15.4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm2.3-6.4c-.7.7-1.2 1.2-1.2 2.2h-2.3c0-1.8.8-2.7 1.6-3.5.6-.6 1-1 1-1.7a1.5 1.5 0 00-3 0H8.2a3.8 3.8 0 117.6 0c0 1.3-.7 2-1.4 2.7z"/></svg>',
  shield:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 3.6v5.6c0 5-3.4 9.4-8 10.8-4.6-1.4-8-5.8-8-10.8V5.6L12 2zm0 4.6a2.6 2.6 0 00-2.6 2.6v1.2H8.6v5.4h6.8v-5.4h-.8V9.2A2.6 2.6 0 0012 6.6zm0 1.8c.5 0 .9.4.9.8v1.2h-1.8V9.2c0-.4.4-.8.9-.8z"/></svg>',
  report:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16v18H4V3zm3 12h2.4v3H7v-3zm4.3-5h2.4v8h-2.4v-8zm4.3-3H18v11h-2.4V7z"/></svg>',
  lab:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 2.4h5.2v2h-1v5.1l4.9 9.1a2 2 0 01-1.8 3H7.3a2 2 0 01-1.8-3l4.9-9.1V4.4h-1v-2zm2 2v5.6l-1.6 3h4.4l-1.6-3V4.4h-1.2z"/></svg>',
  diet:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.8 2.4v7.2a2.8 2.8 0 002 2.7V21.6h2V12.3a2.8 2.8 0 002-2.7V2.4h-1.6v6.4h-1.2V2.4H8.4v6.4H7.2V2.4H6.8zm10 0c-1.8 0-3.2 2.7-3.2 6 0 2.6.9 4.8 2.2 5.6v7.6h2V2.4h-1z"/></svg>'
};

ICONS._listen = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2a4 4 0 00-4 4v2a4 4 0 008 0V6a4 4 0 00-4-4z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 9v0a5 5 0 0010 0M8 13.5V15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
