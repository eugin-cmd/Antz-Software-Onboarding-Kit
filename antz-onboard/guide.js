/* Full guides: one per kit, laid out from its source deck (References/Kit Details).
   Each guide is a banner, then parts; a part holds cards, and each card opens its screens in the gallery.
   A screen's src is a file name in assets/guide/<guide id>/ (WebP, extension left off).
   On a card, thumb picks which screen its picture uses (default the first) and peek (0 to 1) how far down it looks.
   English only for now: other languages show this text until it is translated. */
window.ANTZ_GUIDES = {
  'getting-started': {
    source: '03_Getting started · Getting Started Kit',
    title: 'Getting Started',
    kicker: 'Antz Systems · Onboarding',
    sub: 'Your first walkthrough of the Antz app: the home screen, the quick-action shortcuts, navigation and your own profile. Everything you need to find your way around on day one.',
    audience: ['Keepers', 'Veterinarians', 'Caretakers', 'Curators', 'New starters'],
    back: 'getting-started',
    parts: [
      {
        id: 'home',
        label: 'Part 01 · Where you land',
        title: 'The home screen',
        lede: 'The first thing you see every time you open Antz. Search, insights, what is pending, the media feed and the navigation bar give you the state of your site at a glance.',
        /* The at-a-glance overview: a wide card whose numbered surfaces each open their own screen */
        glance: {
          title: 'Home at a glance',
          desc: 'Your home screen pulls the whole day into one view. Pick a surface to see it on the phone; each one is covered in its own card below.',
          shots: [
            { src: 'home-top', icon: 'focus', title: 'Profile, Search, QR, Focus Hub & Notifications', desc: 'Everything at the top of the home screen: open your profile, search or scan to find any enclosure or animal, jump to bookmarked favourites and check alerts.' },
            { src: 'home-pending', icon: 'priority', title: 'Pending To-Do', desc: 'What needs your attention: animal audit score, allocations, necropsy and administration.' },
            { src: 'home-insights', icon: 'report', title: 'Key Insights', desc: 'Natality, mortality and new arrivals for this month.' },
            { src: 'home-media', icon: 'announce', title: 'Media Feed', desc: 'Announcements and notes, with images and documents attached.' },
            { src: 'home-nav', icon: 'home', title: 'Navigation Bar', desc: 'Home, Menu, Help Desk, Notes and Chat, always one tap away.' },
            { src: 'home-quick', icon: 'add', title: 'Quick Actions', desc: 'A shortcut menu for the actions and workflows you use most.' }
          ]
        },
        cards: [
          {
            id: 'search', title: 'Search, QR Scanner & Focus Hub', icon: 'focus',
            desc: 'The fastest way to reach anything, all from the top of the home screen.',
            shots: [
              { src: 'search', title: 'Search bar', desc: 'Find any animal, enclosure, note or record by name or ID.' },
              { src: 'qr', title: 'QR Scanner', desc: 'Scan an enclosure or animal tag to open its record instantly.' },
              { src: 'focus', title: 'Focus Hub', desc: 'Mark animals and enclosures as favourites, and bookmark notes, medical records and lab requests.' },
              { src: 'notif', title: 'Notifications', desc: 'Stay on top of alerts, approvals and updates as they happen.' }
            ]
          },
          {
            id: 'pending', title: 'Pending To-Do', icon: 'priority',
            desc: 'Counts of animals and records still waiting on you. Every pending type follows the same three steps: home count, site-wise breakdown, then the module with the site filter applied.',
            shots: [
              { src: 'pending-audit', title: 'Animal Audit score', desc: 'Audit the animal count in every enclosure periodically.' },
              { src: 'pending-admin', title: 'Pending Administration', desc: 'Medical administration processes yet to be completed.' },
              { src: 'pending-necropsy', title: 'Total Pending Necropsy', desc: 'Necropsies pending across all sites and stages.' },
              { src: 'pending-allocation', title: 'Pending Allocations', desc: 'Animals received at sites, awaiting enclosure allocation.' }
            ]
          },
          {
            id: 'insights', title: 'Key Insights', icon: 'report', peek: 0.25,
            desc: 'A live pulse of your site: births, losses and arrivals, for today, yesterday or this month.',
            shots: [
              { src: 'insights', title: 'Key Insights', desc: 'Natality shows new births across your sites, Mortality the deaths logged, and View All opens the full breakdown and history.' }
            ]
          },
          {
            id: 'feed', title: 'Media Feed', icon: 'announce', peek: 0.7,
            desc: 'Notes and announcements from across the organisation, with the photos, videos and documents attached to them.',
            shots: [
              { src: 'home-media', title: 'Announcements', desc: 'General announcements for the wider team, and important ones flagged so they surface first.' },
              { src: 'feed', title: 'Notes & attachments', desc: 'Time-stamped observations from colleagues, with photos, videos and documents that open right inside the feed.' }
            ]
          },
          {
            id: 'nav', title: 'Navigation Bar', icon: 'home', thumb: 1,
            desc: 'Pinned to the bottom of every screen: five destinations always one tap away, plus the green + for quick actions.',
            shots: [
              { src: 'nav-home', title: 'Home', desc: 'Pending to-do, Key Insights and the media feed.' },
              { src: 'nav-menu', title: 'Menu', desc: 'Every module available to you, in one grid.' },
              { src: 'nav-helpdesk', title: 'Help Desk', desc: 'Create, approve or reject, and fulfil requests.' },
              { src: 'nav-notes', title: 'Notes', desc: 'Daily animal, enclosure and operations updates.' },
              { src: 'nav-chat', title: 'Chat', desc: 'Message teammates one to one or in groups, with a badge for unread.' }
            ]
          }
        ]
      },
      {
        id: 'profile',
        label: 'Part 02 · Setup',
        title: 'Your profile & settings',
        lede: 'Your account, set up your way: who you are, what you can access, your activity and files, and the small controls that keep the account yours.',
        cards: [
          {
            id: 'profile', title: 'My Profile', icon: 'users',
            desc: 'Everything tied to your account, across a row of tabs.',
            shots: [
              { src: 'profile-about', title: 'About', desc: 'Staff ID, designation and department.' },
              { src: 'profile-permissions', title: 'Permissions', desc: 'Role-based and module access.' },
              { src: 'profile-education', title: 'Education', desc: 'Institute, course, year and marks.' },
              { src: 'profile-idproofs', title: 'ID Proofs', desc: 'Identity documents and attachments.' },
              { src: 'profile-work', title: 'Work Experience', desc: 'Previous company, role and dates.' },
              { src: 'profile-devices', title: 'Devices', desc: 'Signed-in devices and when each was last active.' },
              { src: 'profile-journal', title: 'Journal', desc: 'Your day-by-day activity timeline.' },
              { src: 'profile-incharge', title: 'In charge of', desc: 'Animals you are responsible for, and the keeper history timeline.' }
            ]
          },
          {
            id: 'journal', title: 'Journal & Media', icon: 'note',
            desc: 'Two personal spaces: a record of what you did, and a library of what you uploaded.',
            shots: [
              { src: 'journal', title: 'My Journal', desc: 'A day-by-day record of activities and logins, in order, with timestamps.' },
              { src: 'media', title: 'My Media', desc: 'Images, videos, PDFs, documents and sheets you have uploaded, in one library.' }
            ]
          },
          {
            id: 'settings', title: 'My Settings', icon: 'shield',
            desc: 'Manage your security and privacy: change your PIN or password, or hide stats on shared screens.',
            shots: [
              { src: 'settings', title: 'My Settings', desc: 'Change PIN, change password, and Hide Stats to keep figures off the screen when others are looking on.' }
            ]
          },
          {
            id: 'language', title: 'Language & Logout', icon: 'chat', peek: 0.45,
            desc: 'Switch the app to the language you are most comfortable in, and log out securely when your shift ends.',
            shots: [
              { src: 'menu-lang', title: 'The profile menu', desc: 'Find Change Language in the side menu. Logout, at the bottom, ends your session so the device is safe to hand on.' },
              { src: 'lang-dialog', title: 'Select Language', desc: 'Pick from twelve languages; the whole app switches straight away.' }
            ]
          }
        ]
      },
      {
        id: 'quick',
        label: 'Part 03 · The green + button',
        title: 'Quick actions',
        lede: 'Tap the green + and a sheet of shortcuts slides up: every record, note, medical entry and transfer you will create on a shift, started from one place, wherever you are in the app.',
        /* One overview screen, then one tile per shortcut; every tile opens the same gallery at its own screen */
        actions: {
          overview: { src: 'quick-actions', title: 'The Quick Actions sheet', desc: 'Sixteen shortcuts in all, split across three screens of the sheet.' },
          shots: [
            { src: 'qa-site', title: '+ Site', desc: 'Register a new facility or location.' },
            { src: 'qa-section', title: '+ Section', desc: 'Create a section within a site.' },
            { src: 'qa-enclosure', title: '+ Enclosure', desc: 'Create an enclosure under a section.' },
            { src: 'qa-accession', title: '+ Accession', desc: 'Add a single animal, a batch or a group to an enclosure.' },
            { src: 'qa-master', title: 'Master', desc: 'Foundational data setup.' },
            { src: 'qa-user', title: '+ User', desc: 'Create a user account and set its access.' },
            { src: 'qa-note', title: '+ Note', desc: 'Log a quick observation.' },
            { src: 'qa-request', title: '+ Request', desc: 'Raise a help desk request.' },
            { src: 'qa-announcement', title: 'Announcement', desc: 'Broadcast an update to sites, roles or users.' },
            { src: 'qa-medical', title: '+ Medical', desc: 'Create single, batch and group records, direct or scheduled.' },
            { src: 'qa-dispense', title: 'Dispense Medicine', desc: 'Issue prescribed medicines to vets.' },
            { src: 'qa-hospitalize', title: '+ Hospitalize', desc: 'Raise a request to hospitalise an animal for treatment.' },
            { src: 'qa-transfer', title: 'Transfer Animal', desc: 'In-house, inter-site and external transfers.' },
            { src: 'qa-missing', title: '+ Missing / Escaped', desc: 'Log a critical incident.' },
            { src: 'qa-fetaldeath', title: '+ Fetal Death', desc: 'Record offspring loss.' },
            { src: 'qa-addeggs', title: '+ Add Eggs', desc: 'Log eggs for incubation tracking.' }
          ]
        }
      }
    ],
    close: {
      label: 'By the end of this guide',
      title: 'You are up and running',
      lede: 'Four things mark the end of getting started, each one something you can now do on your own.',
      items: [
        { title: 'Get in & oriented', desc: 'Log in to your workspace and read the home screen at a glance: insights, what is pending, and the latest from your team.' },
        { title: 'Move with confidence', desc: 'Use search, the Focus Hub and the navigation bar to reach any record or module in a couple of taps.' },
        { title: 'Take your first actions', desc: 'Add records, log notes, raise medical entries and start transfers from the quick actions behind the + button.' },
        { title: 'Make it yours', desc: 'Set up your profile, manage your journal and media, choose your language, and understand the permissions behind your role.' }
      ]
    }
  }
};
