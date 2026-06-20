/* ============================================================
   FUTUREMINDS v2 â€” app.js
   JSON-driven multi-page renderer.
   Loads window.FM_BUNDLE (file://) or fetches /data/*.json (served).
   ============================================================ */
(function () {
  "use strict";
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA_FILES = ['site', 'home', 'about', 'programmes', 'pathways', 'impact', 'partners', 'overseas', 'gallery', 'testimonials'];

  /* ---------- ICONS ---------- */
  var ICONS = {
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    badge: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>'
  };
  function icon(name, size) {
    return '<svg width="' + (size || 24) + '" height="' + (size || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- DATA LOADING ---------- */
  function loadData() {
    if (window.FM_BUNDLE) return Promise.resolve(window.FM_BUNDLE);
    var out = {};
    return Promise.all(DATA_FILES.map(function (f) {
      return fetch('data/' + f + '.json').then(function (r) { return r.json(); }).then(function (j) { out[f] = j; }).catch(function () { out[f] = {}; });
    })).then(function () { return out; });
  }

  function currentPage() {
    return document.body.dataset.page || (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  }

  /* ---------- CHROME ---------- */
  function brandFallbackSVG() {
    return '<span class="brand-fallback" style="display:none"><svg class="brand-mark" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#c99b0d" stroke-width="1.4" opacity="0.5"/><path d="M24 6c6 6 6 30 0 36M24 6c-6 6-6 30 0 36" stroke="#c99b0d" stroke-width="1.2" opacity="0.7"/><path d="M8 24h32M11 15h26M11 33h26" stroke="#c99b0d" stroke-width="1.2" opacity="0.5"/><circle cx="24" cy="24" r="5" fill="#c99b0d"/></svg><span class="brand-name">Future<b>minds</b></span></span>';
  }
  function renderNav(site) {
    var page = currentPage();
    function norm(p) { return (p === 'index' || p === '') ? 'home' : p; }
    var cur = norm(page);
    var links = site.nav.map(function (n) {
      var linkId = norm(n.href.replace('.html', ''));
      var active = linkId === cur ? ' active' : '';
      return '<a href="' + n.href + '" class="' + active.trim() + '">' + esc(n.label) + '</a>';
    }).join('');
    var brandInner = '<img src="' + site.brand.logo + '" alt="' + esc(site.brand.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' + brandFallbackSVG();
    return '<nav class="nav" id="nav"><div class="nav-inner">' +
      '<a href="index.html" class="brand" aria-label="' + esc(site.brand.name) + ' home">' + brandInner + '</a>' +
      '<div class="nav-links" id="navLinks">' + links + '</div>' +
      '<div class="nav-right">' +
      '<a href="' + site.navCta.href + '" class="btn btn-gold">' + esc(site.navCta.label) + '</a>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div></div></nav>';
  }
  function renderFooter(site) {
    var f = site.footer;
    var cols = f.columns.map(function (c) {
      return '<div class="footer-col"><h5>' + esc(c.title) + '</h5>' + c.links.map(function (l) { return '<a href="' + l.href + '">' + esc(l.label) + '</a>'; }).join('') + '</div>';
    }).join('');
    var socials = site.socials.map(function (s) {
      return '<a href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' + icon(s.icon, 18) + '</a>';
    }).join('');
    var brand = '<a href="index.html" class="brand" style="display:inline-flex"><span class="brand-fallback" style="display:flex"><svg class="brand-mark" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#c99b0d" stroke-width="1.4" opacity="0.5"/><path d="M24 6c6 6 6 30 0 36M24 6c-6 6-6 30 0 36" stroke="#c99b0d" stroke-width="1.2" opacity="0.7"/><path d="M8 24h32M11 15h26M11 33h26" stroke="#c99b0d" stroke-width="1.2" opacity="0.5"/><circle cx="24" cy="24" r="5" fill="#c99b0d"/></svg><span class="brand-name">Future<b>minds</b></span></span></a>';
    return '<footer class="footer"><div class="container">' +
      '<div class="footer-top"><div class="footer-brand">' + brand +
      '<p>' + esc(f.blurb) + '</p><div class="footer-socials">' + socials + '</div></div>' + cols + '</div>' +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' ' + esc(site.brand.name) + '. All rights reserved. Â· Bengaluru, India</span><span>' + esc(f.accreditations) + '</span></div>' +
      '</div></footer>';
  }
  function renderChrome(site) {
    var navMount = document.getElementById('site-nav');
    var footMount = document.getElementById('site-footer');
    if (navMount) navMount.innerHTML = renderNav(site);
    if (footMount) footMount.innerHTML = renderFooter(site);
    var wa = document.createElement('a');
    wa.className = 'whatsapp-fab'; wa.href = 'https://wa.me/' + site.contact.whatsapp; wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<svg width="27" height="27" viewBox="0 0 24 24" fill="#fff"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.728-.979zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
    document.body.appendChild(wa);
  }

  /* ---------- SHARED BUILDERS ---------- */
  function sectionHead(eyebrow, title, intro, center) {
    return '<div class="section-head' + (center ? ' center' : '') + ' reveal">' +
      (eyebrow ? '<span class="eyebrow' + (center ? ' center' : '') + '">' + esc(eyebrow) + '</span>' : '') +
      '<h2>' + esc(title) + '</h2>' + (intro ? '<p>' + esc(intro) + '</p>' : '') + '</div>';
  }
  function pageHero(h, crumb) {
    return '<header class="page-hero"><div class="glow"></div><div class="container"><div class="page-hero-inner reveal">' +
      '<div class="crumbs"><a href="index.html">Home</a> / ' + esc(crumb || h.title) + '</div>' +
      '<span class="eyebrow">' + esc(h.eyebrow) + '</span><h1>' + esc(h.title) + '</h1><p>' + esc(h.subtitle) + '</p>' +
      '</div></div></header>';
  }
  function trustBlock(t) {
    var chips = t.chips.map(function (c) { return '<div class="trust-chip">' + esc(c.name) + ' <small>' + esc(c.note) + '</small></div>'; }).join('');
    var metrics = t.metrics.map(function (m) {
      var inner = (m.count != null) ? 'data-count="' + m.count + '" data-suffix="' + (m.suffix || '') + '">0' : '>' + esc(m.text);
      return '<div class="m"><b class="num" ' + inner + '</b><span>' + esc(m.label) + '</span></div>';
    }).join('');
    return '<section class="trust"><div class="container"><p class="trust-label">' + esc(t.label) + '</p><div class="trust-logos">' + chips + '</div><div class="trust-metrics">' + metrics + '</div></div></section>';
  }
  function pillarsBlock(p) {
    var cards = p.items.map(function (it) {
      return '<div class="pillar reveal"><div class="pi">' + icon(it.icon) + '</div><h4>' + esc(it.title) + '</h4><p>' + esc(it.text) + '</p><div class="stat"><span class="num">' + esc(it.stat) + '</span><small>' + esc(it.statLabel) + '</small></div></div>';
    }).join('');
    return '<section class="section" id="pillars"><div class="container">' + sectionHead(p.eyebrow, p.title, p.intro) + '<div class="grid-4">' + cards + '</div></div></section>';
  }
  function ctaBand(site) {
    return '<section class="section"><div class="container"><div class="cta-band reveal">' +
      '<h2>Ready to build a future-ready institution?</h2>' +
      '<p>Partner with Futureminds to design employability, faculty development and capability frameworks tailored to your institution.</p>' +
      '<div class="cta-row"><a href="' + site.ctas.partner.href + '" class="btn btn-gold">' + esc(site.ctas.partner.label) + ' <span class="arrow">&rarr;</span></a>' +
      '<a href="' + site.ctas.discuss.href + '" class="btn btn-ghost">' + esc(site.ctas.discuss.label) + '</a></div></div></div></section>';
  }
  function transformBlock(fut) {
    var rows = fut.transforms.map(function (tr) { return '<div class="transform-card reveal"><span class="from">' + esc(tr.from) + '</span><span class="ar">&rarr;</span><span class="to">' + esc(tr.to) + '</span></div>'; }).join('');
    return '<section class="section ink"><div class="container">' + sectionHead(fut.eyebrow, fut.title, fut.intro, true) + '<div class="transform-row">' + rows + '</div></div></section>';
  }
  function eeeBlock(eee) {
    var orbs = ['o1', 'o2', 'o3'].map(function (o, i) { var p = eee.pillars[i]; return '<div class="eee-orb ' + o + '"><div class="oi">' + icon(p.icon, 22) + '</div><b>' + esc(p.label) + '</b></div>'; }).join('');
    var models = eee.models.map(function (m) { return '<div class="m"><div class="mi">' + icon(m.icon) + '</div><div><h4>' + esc(m.title) + '</h4><p>' + esc(m.text) + '</p></div></div>'; }).join('');
    return '<section class="section paper" id="eee"><div class="container">' + sectionHead(eee.eyebrow, eee.title, eee.intro) +
      '<div class="eee-stage"><div class="eee-visual reveal"><div class="eee-ring"></div><div class="eee-ring r2"></div><div class="eee-ring r3"></div><div class="eee-core"><b>EEE</b><span>Framework</span></div>' + orbs + '</div>' +
      '<div class="eee-models reveal">' + models + '</div></div></div></section>';
  }
  function programmesBlock(list, title) {
    var cards = list.map(function (pr) {
      var out = pr.outcomes.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('');
      return '<div class="prog-card reveal"><div class="top"></div><div class="pico">' + icon(pr.icon, 40) + '</div><h4>' + esc(pr.title) + '</h4><p>' + esc(pr.text) + '</p><ul class="outcomes">' + out + '</ul></div>';
    }).join('');
    return '<section class="section" id="programmes"><div class="container">' + (title ? sectionHead('Programmes', title) : '') + '<div class="grid-3">' + cards + '</div></div></section>';
  }
  function testimonialsBlock(t) {
    var tabs = t.categories.map(function (c, i) { return '<button class="testi-tab' + (i === 0 ? ' active' : '') + '" data-ti="' + i + '">' + esc(c.name) + '</button>'; }).join('');
    return '<section class="section paper" id="testimonials"><div class="container">' + sectionHead(t.eyebrow, t.title, t.intro) +
      '<div class="testi-tabs" id="testiTabs">' + tabs + '</div><div class="testi-track" id="testiTrack"></div>' +
      '<div class="testi-nav"><button id="tPrev" aria-label="Previous">&larr;</button><button id="tNext" aria-label="Next">&rarr;</button></div></div></section>';
  }
  function homeHero(home, site) {
    var h = home.hero;
    var stats = h.stats.map(function (s, i) { return (i ? '<div class="sep"></div>' : '') + '<div class="item"><b class="num">' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>'; }).join('');
    return '<header class="hero" id="top"><div class="hero-glow g1"></div><div class="hero-glow g2"></div><canvas id="hero-canvas"></canvas><div class="hero-grid"></div>' +
      '<div class="hero-inner"><div class="hero-content"><span class="hero-badge"><span class="dot"></span>' + esc(h.badge) + '</span>' +
      '<h1>' + esc(h.titleLead) + ' <span class="accent">' + esc(h.titleAccent) + '</span> ' + esc(h.titleTail) + '</h1>' +
      '<p class="hero-sub">' + esc(h.subtitle) + '</p><div class="hero-stats">' + stats + '</div>' +
      '<div class="hero-cta"><a href="' + site.ctas.explore.href + '" class="btn btn-gold">' + esc(site.ctas.explore.label) + ' <span class="arrow">&rarr;</span></a>' +
      '<a href="' + site.ctas.partner.href + '" class="btn btn-ghost">' + esc(site.ctas.partner.label) + '</a>' +
      '<a href="' + site.ctas.discuss.href + '" class="btn btn-ghost">' + esc(site.ctas.discuss.label) + '</a></div>' +
      '</div></div><div class="hero-scroll"><span>Scroll</span><span class="line"></span></div></header>';
  }
  function pathwaysInteractive(pw, withHead) {
    var head = withHead ? sectionHead(pw.hero.eyebrow, pw.hero.title, pw.hero.subtitle) : sectionHead('Career Pathways', 'Explore Pathways by Discipline', 'Click a domain to see how we map curriculum to evolving careers.');
    return '<section class="section ink" id="pathways"><div class="container">' + head +
      '<div class="pathways-wrap"><div class="domain-list" id="domainList"></div><div class="domain-panel" id="domainPanel"><div class="pglow"></div></div></div></div></section>';
  }
  function initPathways(domains) {
    var list = document.getElementById('domainList'), panel = document.getElementById('domainPanel');
    if (!list || !panel) return;
    function render(i) {
      var dm = domains[i];
      var flow = dm.flow.map(function (f, k) { return '<span class="path-node"><span class="b"></span>' + esc(f) + '</span>' + (k < dm.flow.length - 1 ? '<span class="path-arrow">&rarr;</span>' : ''); }).join('');
      panel.innerHTML = '<div class="pglow"></div><div class="domain-fade"><span class="ptag">' + esc(dm.tag) + '</span><h3>' + esc(dm.name) + '</h3><p>' + esc(dm.desc) + '</p><div class="path-flow">' + flow + '</div></div>';
    }
    domains.forEach(function (dm, i) {
      var b = document.createElement('button');
      b.className = 'domain-btn' + (i === 0 ? ' active' : '');
      b.innerHTML = '<span>' + esc(dm.name) + '</span><span class="n">0' + (i + 1) + '</span>';
      b.addEventListener('click', function () { list.querySelectorAll('.domain-btn').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); render(i); });
      list.appendChild(b);
    });
    render(0);
  }
  function initTestimonials(t) {
    var tabs = document.getElementById('testiTabs'), track = document.getElementById('testiTrack');
    if (!tabs || !track) return;
    function render(ci) {
      track.innerHTML = t.categories[ci].items.map(function (it) {
        return '<div class="testi-card"><div class="quote">' + esc(it.quote) + '</div><div class="testi-meta"><div class="av">' + esc(it.name.charAt(0)) + '</div><div><b>' + esc(it.name) + '</b><span>' + esc(it.role) + '</span></div></div></div>';
      }).join('');
    }
    tabs.querySelectorAll('.testi-tab').forEach(function (b) { b.addEventListener('click', function () { tabs.querySelectorAll('.testi-tab').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); render(+b.dataset.ti); }); });
    render(0);
    var n = document.getElementById('tNext'), p = document.getElementById('tPrev');
    if (n) n.addEventListener('click', function () { track.scrollBy({ left: 440, behavior: 'smooth' }); });
    if (p) p.addEventListener('click', function () { track.scrollBy({ left: -440, behavior: 'smooth' }); });
  }
  function chartSVG(chart) {
    var W = 900, H = 300, pad = 40, vals = chart.values, max = Math.max.apply(null, vals) * 1.07;
    function x(i) { return pad + i * (W - pad * 2) / (vals.length - 1); }
    function y(v) { return H - pad - (v / max) * (H - pad * 2); }
    var line = '', grid = '', dots = '';
    vals.forEach(function (v, i) { line += (i ? 'L' : 'M') + x(i) + ' ' + y(v) + ' '; });
    var area = 'M' + x(0) + ' ' + (H - pad) + ' ' + vals.map(function (v, i) { return 'L' + x(i) + ' ' + y(v); }).join(' ') + ' L' + x(vals.length - 1) + ' ' + (H - pad) + ' Z';
    chart.labels.forEach(function (lb, i) { grid += '<line x1="' + x(i) + '" y1="' + pad + '" x2="' + x(i) + '" y2="' + (H - pad) + '" stroke="rgba(255,255,255,.06)"/><text x="' + x(i) + '" y="' + (H - pad + 22) + '" fill="rgba(255,255,255,.5)" font-size="12" text-anchor="middle" font-family="Verdana">' + esc(lb) + '</text>'; });
    vals.forEach(function (v, i) { dots += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="5" fill="#c99b0d" stroke="#0a1f35" stroke-width="2"/>'; });
    return '<svg id="growthChart" viewBox="0 0 900 300" width="100%" preserveAspectRatio="xMidYMid meet" aria-label="Growth chart"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99b0d" stop-opacity=".35"/><stop offset="1" stop-color="#c99b0d" stop-opacity="0"/></linearGradient></defs>' + grid + '<path d="' + area + '" fill="url(#ga)"/><path class="gline" d="' + line + '" fill="none" stroke="#c99b0d" stroke-width="3" stroke-linecap="round"/>' + dots + '</svg>';
  }
  function animateChart() {
    try {
      var svg = document.getElementById('growthChart'); if (!svg || REDUCED) return;
      var path = svg.querySelector('.gline'); if (!path || typeof path.getTotalLength !== 'function') return;
      var len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      if (!('IntersectionObserver' in window)) { path.style.strokeDashoffset = 0; return; }
      new IntersectionObserver(function (es, ob) { es.forEach(function (e) { if (e.isIntersecting) { path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)'; path.style.strokeDashoffset = 0; ob.disconnect(); } }); }, { threshold: .3 }).observe(svg);
    } catch (e) { /* non-critical */ }
  }
  function worldSVG() {
    var lands = [[90, 90, 70], [150, 150, 55], [250, 110, 55], [300, 170, 40], [360, 120, 55], [420, 180, 35], [200, 90, 40]];
    var html = '';
    for (var i = 0; i < 320; i++) { var xr = Math.random() * 500, yr = Math.random() * 250, on = false; lands.forEach(function (l) { if (Math.hypot(xr - l[0], yr - l[1]) < l[2]) on = true; }); if (on) html += '<circle cx="' + xr.toFixed(1) + '" cy="' + yr.toFixed(1) + '" r="1.5" fill="rgba(255,255,255,.32)"/>'; }
    var hub = [330, 150], targets = [[110, 90], [360, 80], [260, 60], [420, 170]];
    targets.forEach(function (t) { var mx = (hub[0] + t[0]) / 2, my = Math.min(hub[1], t[1]) - 40; html += '<path d="M' + hub[0] + ' ' + hub[1] + ' Q' + mx + ' ' + my + ' ' + t[0] + ' ' + t[1] + '" fill="none" stroke="#c99b0d" stroke-width="1" opacity=".55"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="3" fill="#c99b0d"/>'; });
    html += '<circle cx="' + hub[0] + '" cy="' + hub[1] + '" r="6" fill="#c99b0d"/><circle cx="' + hub[0] + '" cy="' + hub[1] + '" r="11" fill="none" stroke="#c99b0d" opacity=".5"><animate attributeName="r" values="6;16;6" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0;.6" dur="2.6s" repeatCount="indefinite"/></circle>';
    return '<svg viewBox="0 0 500 250" width="100%" aria-label="Global reach map">' + html + '</svg>';
  }
  function indiaSVG() {
    var path = 'M120 20 L150 35 L160 60 L150 80 L165 95 L160 120 L175 130 L160 160 L150 155 L145 185 L130 230 L115 255 L105 220 L95 200 L80 175 L70 150 L55 130 L60 100 L80 95 L75 70 L95 55 L100 35 Z';
    return '<svg viewBox="0 0 240 280" width="100%" aria-label="India map, Bengaluru highlighted"><path d="' + path + '" fill="rgba(201,155,13,.12)" stroke="rgba(201,155,13,.5)" stroke-width="1.5"/>' +
      '<circle cx="108" cy="205" r="5" fill="#c99b0d"/><circle cx="108" cy="205" r="10" fill="none" stroke="#c99b0d" opacity=".6"><animate attributeName="r" values="5;15;5" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0;.7" dur="2.4s" repeatCount="indefinite"/></circle>' +
      '<text x="118" y="208" fill="#f5ecc7" font-size="11" font-family="Verdana" font-weight="700">Bengaluru HQ</text>' +
      '<circle cx="125" cy="225" r="3" fill="rgba(255,255,255,.5)"/><circle cx="118" cy="190" r="3" fill="rgba(255,255,255,.5)"/><circle cx="100" cy="175" r="3" fill="rgba(255,255,255,.5)"/></svg>';
  }
  function galleryBlock(g) {
    var filters = g.filters.map(function (f, i) { return '<button class="gallery-filter' + (i === 0 ? ' active' : '') + '" data-f="' + esc(f) + '">' + esc(f) + '</button>'; }).join('');
    return '<section class="section"><div class="container">' + sectionHead(g.hero.eyebrow, g.hero.title, g.hero.subtitle, true) +
      '<div class="gallery-filters" id="galFilters">' + filters + '</div><div class="gallery" id="galGrid"></div></div></section>';
  }
  function initGallery(g) {
    var grid = document.getElementById('galGrid'), filters = document.getElementById('galFilters');
    if (!grid) return;
    function render(f) {
      grid.innerHTML = g.tiles.filter(function (t) { return f === 'All' || t.category === f; }).map(function (t) {
        return '<div class="tile ' + (t.size || '') + '"><div><small>' + esc(t.category) + '</small><span>' + esc(t.title) + '</span></div></div>';
      }).join('');
    }
    if (filters) filters.querySelectorAll('.gallery-filter').forEach(function (b) { b.addEventListener('click', function () { filters.querySelectorAll('.gallery-filter').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); render(b.dataset.f); }); });
    render('All');
  }
  function contactBlock(site) {
    var c = site.contact;
    return '<section class="section ink" id="contact"><div class="container"><div class="contact-grid">' +
      '<div class="contact-info reveal"><span class="eyebrow">Let\'s Build Together</span><h2 style="font-size:clamp(1.9rem,3.4vw,2.8rem);margin:14px 0 24px;color:#fff">Request an Institutional Discussion</h2>' +
      '<div class="ci"><div class="ic">' + icon('pin') + '</div><div><b>Headquarters</b><span>' + esc(c.address) + '</span></div></div>' +
      '<div class="ci"><div class="ic">' + icon('mail') + '</div><div><b>Email</b><span><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></span></div></div>' +
      '<div class="ci"><div class="ic">' + icon('phone') + '</div><div><b>General</b><span><a href="tel:' + c.phoneGeneral.replace(/\s/g, '') + '">' + esc(c.phoneGeneral) + '</a></span></div></div>' +
      '<div class="ci"><div class="ic">' + icon('building') + '</div><div><b>For Universities / Colleges</b><span><a href="tel:' + c.phoneInstitutions.replace(/\s/g, '') + '">' + esc(c.phoneInstitutions) + '</a></span></div></div>' +
      '<div class="india-map">' + indiaSVG() + '</div></div>' +
      '<form class="contact-form reveal" id="contactForm"><h3>Start a Conversation</h3><p class="sub">For Vice Chancellors, Registrars, Principals, IQAC coordinators and government bodies.</p>' +
      '<div class="form-row"><div class="field"><label>Full Name</label><input type="text" required placeholder="Dr. / Prof. Name"></div><div class="field"><label>Designation</label><input type="text" placeholder="VC / Registrar / Principal"></div></div>' +
      '<div class="form-row"><div class="field"><label>Institution</label><input type="text" required placeholder="University / College"></div><div class="field"><label>Email</label><input type="email" required placeholder="name@institution.edu"></div></div>' +
      '<div class="field"><label>Area of Interest</label><select><option>EEE Framework Implementation</option><option>Faculty Development Programmes</option><option>Student Capability Building</option><option>Institutional Transformation</option><option>Overseas Career Readiness</option><option>University Partnership / MoU</option></select></div>' +
      '<div class="field"><label>Message</label><textarea placeholder="Tell us about your institution goals..."></textarea></div>' +
      '<div class="form-actions"><button type="submit" class="btn btn-gold">Request Discussion <span class="arrow">&rarr;</span></button><a href="' + site.ctas.brochure.href + '" class="btn btn-ink">Download Brochure</a></div>' +
      '<p class="form-ok">Thank you &mdash; our partnerships team will be in touch shortly.</p></form></div></div></section>';
  }

  /* ---------- PAGE COMPOSERS ---------- */
  var PAGES = {
    home: function (d) {
      return homeHero(d.home, d.site) + trustBlock(d.home.trust) + transformBlock(d.home.future) + pillarsBlock(d.home.pillars) + pathwaysInteractive(d.pathways, false) + testimonialsBlock(d.testimonials) + ctaBand(d.site);
    },
    about: function (d) {
      var a = d.about;
      var tl = a.timeline.map(function (t) { return '<div class="tl-item"><div class="tl-era">' + esc(t.era) + '</div><h4>' + esc(t.title) + '</h4><p>' + esc(t.text) + '</p></div>'; }).join('');
      var beliefs = a.philosophy.beliefs.map(function (b) { return '<li>' + icon('check', 22) + '<span>' + esc(b) + '</span></li>'; }).join('');
      var integ = a.philosophy.integrates.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('');
      var trad = a.approach.traditional, fm = a.approach.futureminds;
      var xIcon = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#8C99B0" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>';
      var ckIcon = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#c99b0d" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>';
      var tradPoints = trad.points.map(function (p) { return '<li>' + xIcon + esc(p) + '</li>'; }).join('');
      var fmPoints = fm.points.map(function (p) { return '<li>' + ckIcon + esc(p) + '</li>'; }).join('');
      return pageHero(a.hero, 'About') +
        '<section class="section paper"><div class="container"><div class="about-grid"><div class="lead reveal"><span class="eyebrow">About Futureminds</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.7rem);margin:14px 0 20px">' + esc(a.lead.title) + '</h2>' +
        a.lead.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        '<p class="pull">' + esc(a.lead.pull) + '</p><div style="margin-top:24px"><a href="impact.html" class="btn btn-ink">See the Impact <span class="arrow">&rarr;</span></a></div></div><div class="timeline reveal">' + tl + '</div></div></div></section>' +
        '<section class="section" id="philosophy"><div class="container">' + sectionHead(a.philosophy.eyebrow, a.philosophy.title) + '<div class="belief-grid"><ul class="belief-list reveal">' + beliefs + '</ul><div class="reveal"><p style="color:#5A6B85;margin-bottom:16px;font-weight:700">We integrate:</p><div class="chip-cloud">' + integ + '</div></div></div></div></section>' +
        '<section class="section paper" id="approach"><div class="container">' + sectionHead(a.approach.eyebrow, a.approach.title, a.approach.intro, true) +
        '<div class="compare reveal"><div class="compare-col trad"><span class="tag">' + esc(trad.title) + '</span><h4>' + esc(trad.subtitle) + '</h4><ul>' + tradPoints + '</ul></div><div class="compare-vs"><span>vs</span></div><div class="compare-col fm"><span class="tag">' + esc(fm.title) + '</span><h4>' + esc(fm.subtitle) + '</h4><ul>' + fmPoints + '</ul></div></div></div></section>' +
        ctaBand(d.site);
    },
    programmes: function (d) { var p = d.programmes; return pageHero(p.hero, 'Programmes') + eeeBlock(p.eee) + programmesBlock(p.programmes, 'All Programmes') + ctaBand(d.site); },
    'career-pathways': function (d) {
      var pw = d.pathways;
      var benefits = pw.benefits.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('');
      return pageHero(pw.hero, 'Career Pathways') +
        '<section class="section paper"><div class="container"><div class="cta-band reveal"><h2>"' + esc(pw.shift.from) + '" &rarr; "' + esc(pw.shift.to) + '"</h2><p>This approach makes learning more contextual, future-oriented, meaningful and institutionally relevant.</p><div class="cta-row chip-cloud" style="justify-content:center">' + benefits + '</div></div></div></section>' +
        pathwaysInteractive(pw, true) + ctaBand(d.site);
    },
    impact: function (d) {
      var im = d.impact;
      var cards = im.metrics.map(function (m) { return '<div class="impact-card reveal"><b class="num" data-count="' + m.count + '" data-suffix="' + (m.suffix || '') + '">0</b><span>' + esc(m.label) + '</span></div>'; }).join('');
      var hi = im.highlights.map(function (h) { return '<div class="pillar reveal"><div class="pi">' + icon(h.icon) + '</div><h4>' + esc(h.title) + '</h4><p>' + esc(h.text) + '</p></div>'; }).join('');
      return pageHero(im.hero, 'Impact') +
        '<section class="section ink"><div class="container"><div class="impact-grid">' + cards + '</div><div class="impact-chart reveal"><h3>' + esc(im.chart.title) + '</h3><p>' + esc(im.chart.note) + '</p>' + chartSVG(im.chart) + '</div></div></section>' +
        '<section class="section"><div class="container">' + sectionHead('What Drives It', 'Built on Partnership & Policy Alignment') + '<div class="grid-3">' + hi + '</div></div></section>' + ctaBand(d.site);
    },
    partners: function (d) {
      var pn = d.partners;
      var cells = pn.partners.map(function (p) { return '<div class="client-cell"><b>' + esc(p.name) + '</b><small>' + esc(p.full) + '</small><span class="rel">' + esc(p.relation) + '</span></div>'; }).join('');
      var stmts = pn.statements.map(function (s) { return '<li>' + icon('check', 22) + '<span>' + esc(s) + '</span></li>'; }).join('');
      return pageHero(pn.hero, 'Partners') +
        '<section class="section"><div class="container"><div class="client-wall reveal">' + cells + '</div></div></section>' +
        '<section class="section paper"><div class="container">' + sectionHead('Credibility', 'Trust & Accreditation', null, true) + '<ul class="statement-list reveal">' + stmts + '</ul></div></section>' + ctaBand(d.site);
    },
    overseas: function (d) {
      var ov = d.overseas;
      var feats = ov.features.map(function (f) { return '<div class="feat reveal"><div class="fi">' + icon(f.icon) + '</div><b>' + esc(f.title) + '</b><span>' + esc(f.text) + '</span></div>'; }).join('');
      var outs = ov.outcomes.map(function (o) { return '<span>' + esc(o) + '</span>'; }).join('');
      return pageHero(ov.hero, 'Overseas') +
        '<section class="section ink"><div class="container"><div class="overseas-grid"><div class="reveal"><span class="eyebrow">Global Career Readiness</span><h2 style="font-size:clamp(1.8rem,3.2vw,2.6rem);margin:14px 0 18px;color:#fff">A Bridge to International Opportunity</h2><p style="color:rgba(255,255,255,.74);margin-bottom:18px">' + esc(ov.positioning) + '</p><div class="overseas-feats">' + feats + '</div></div>' +
        '<div class="world-card reveal">' + worldSVG() + '<div class="chip-cloud" style="margin-top:18px;justify-content:center">' + outs + '</div></div></div></div></section>' + ctaBand(d.site);
    },
    gallery: function (d) { return pageHero(d.gallery.hero, 'Gallery') + galleryBlock(d.gallery) + ctaBand(d.site); },
    contact: function (d) {
      return '<header class="page-hero" style="padding-bottom:30px"><div class="glow"></div><div class="container"><div class="page-hero-inner reveal"><div class="crumbs"><a href="index.html">Home</a> / Contact</div><span class="eyebrow">Contact</span><h1>Let\'s Shape Future-Ready Institutions Together</h1><p>' + esc(d.site.contact.mapNote) + '</p></div></div></header>' + contactBlock(d.site);
    }
  };

  /* ---------- WIRING ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
    if (REDUCED) { el.textContent = target + suffix; return; }
    var dur = 1500, start = performance.now();
    function tick(now) { var p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(target * e) + suffix; if (p < 1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }
  function wire(d, page) {
    var nav = document.getElementById('nav');
    function setScrolled() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40 || !document.querySelector('.hero')); }
    setScrolled(); window.addEventListener('scroll', setScrolled, { passive: true });
    var tg = document.getElementById('navToggle'), nl = document.getElementById('navLinks');
    if (tg && nl) { tg.addEventListener('click', function () { nl.classList.toggle('open'); }); nl.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nl.classList.remove('open'); }); }); }

    var revs = document.querySelectorAll('.reveal');
    if (REDUCED || !('IntersectionObserver' in window)) { revs.forEach(function (r) { r.classList.add('in'); }); }
    else { var io = new IntersectionObserver(function (es, ob) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ob.unobserve(e.target); } }); }, { threshold: .12 }); revs.forEach(function (r) { io.observe(r); }); }

    document.querySelectorAll('[data-count]').forEach(function (el) {
      if ('IntersectionObserver' in window) { var io2 = new IntersectionObserver(function (es, ob) { es.forEach(function (e) { if (e.isIntersecting) { animateCount(el); ob.disconnect(); } }); }, { threshold: .6 }); io2.observe(el); }
      else animateCount(el);
    });

    if (page === 'home') { if (window.initHero3D) window.initHero3D(); initPathways(d.pathways.domains); initTestimonials(d.testimonials); }
    if (page === 'career-pathways') initPathways(d.pathways.domains);
    if (page === 'impact') animateChart();
    if (page === 'gallery') initGallery(d.gallery);
    if (page === 'contact') { var f = document.getElementById('contactForm'); if (f) f.addEventListener('submit', function (e) { e.preventDefault(); f.querySelector('.form-ok').style.display = 'block'; f.reset(); }); }
  }

  /* ---------- BOOT ---------- */
  document.body.classList.remove('no-js');
  loadData().then(function (d) {
    var site = d.site || {};
    renderChrome(site);
    var page = currentPage();
    var composer = PAGES[page] || PAGES.home;
    var main = document.getElementById('page-main');
    if (main) main.innerHTML = composer(d);
    try { wire(d, PAGES[page] ? page : 'home'); } catch (e) { console.error('wire error:', e); }
  }).catch(function (err) {
    console.error('Futureminds load error:', err);
    var main = document.getElementById('page-main');
    if (main) main.innerHTML = '<div class="container" style="padding:160px 0;text-align:center"><h2>Content could not be loaded</h2><p>Ensure data/bundle.js is present, or run via a local server (see README).</p></div>';
  });
})();
