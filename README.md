# Futureminds — Website v2

A premium, multi-page institutional website for **Futureminds**.
Navy + gold brand · **Verdana** typography throughout · JSON-driven content · vanilla HTML/CSS/JS (no build step required).

---

## 1. How to view it

### Option A — Just open it (easiest)
Double-click **`index.html`**. The site reads its content from **`data/bundle.js`** (a pre-generated bundle of all the JSON), so it works straight from the file system with no server.

### Option B — Run a local server (recommended for development)
Serving the folder lets the pages read the individual `data/*.json` files directly (and is closer to production):

```bash
# from inside the futureminds-v2 folder
python -m http.server 8000
# then open http://localhost:8000
```
or
```bash
npx serve .
```

Either way, every page works the same.

---

## 2. Folder structure

```
futureminds-v2/
├── index.html            Home (cinematic hero + 3D knowledge sphere)
├── about.html            About, evolution timeline, philosophy, approach
├── programmes.html       EEE framework + all programmes
├── career-pathways.html  Interactive discipline → career pathways
├── impact.html           Animated metrics + growth chart
├── partners.html         Accreditations & partner wall (VTU, AICTE, KSOU, KHEC, Burlington)
├── overseas.html         Global career readiness (CEFR / OET)
├── gallery.html          Filterable masonry gallery
├── contact.html          Enquiry form + Bengaluru map + WhatsApp
│
├── assets/
│   ├── css/styles.css    All styling (Verdana, navy+gold, responsive, glass)
│   ├── js/app.js         The engine: loads data, builds nav/footer + every page
│   ├── js/hero3d.js      Three.js knowledge sphere (home hero only)
│   └── img/
│       ├── logo.svg      ← REPLACE with your logo (see §4)
│       └── favicon.svg
│
├── data/                 ← ALL CONTENT LIVES HERE (edit these)
│   ├── site.json         Brand, nav, footer, contact, socials, CTAs
│   ├── home.json         Hero, trust bar, pillars, transforms
│   ├── about.json        Timeline, philosophy, approach
│   ├── programmes.json   EEE framework + programme cards
│   ├── pathways.json     Career-pathway domains
│   ├── impact.json       Metrics + growth-chart data
│   ├── partners.json     Partners + accreditation statements
│   ├── overseas.json     Overseas readiness features
│   ├── gallery.json      Gallery tiles
│   ├── testimonials.json Testimonials by audience
│   └── bundle.js         AUTO-GENERATED (do not edit by hand)
│
├── build-bundle.js       Regenerates data/bundle.js from the JSON files
└── README.md
```

---

## 3. Editing content

All text, stats, links, programmes, testimonials, etc. live in the **`data/*.json`** files. No HTML editing needed.

After you change any JSON file, regenerate the offline bundle so the double-click method stays in sync:

```bash
node build-bundle.js
```

(If you only ever run via a local server — Option B — you can skip this step, because the pages fetch the JSON directly. The bundle only matters for opening files directly.)

---

## 4. Adding your logo

1. Drop your logo file into `assets/img/` (SVG or PNG, ideally ~40px tall, transparent background, light/white version since the nav is dark navy).
2. In **`data/site.json`**, set `brand.logo` to its path, e.g.:
   ```json
   "logo": "assets/img/your-logo.png"
   ```
3. Re-run `node build-bundle.js` (if using the double-click method).

If the logo file is missing or fails to load, the site automatically falls back to a built-in "Futureminds" wordmark, so nothing ever breaks.

---

## 5. Design system

| Token | Value | Use |
|---|---|---|
| Ink (navy) | `#0B1E3F` | Headlines, nav, footer |
| Deep | `#102A56` | Dark sections, cards |
| Gold | `#C8A24B` | CTAs, accents, highlights |
| Paper | `#FAF7F1` | Alternating section backgrounds |
| Mute | `#5A6B85` | Body / secondary text |

- **Typography:** Verdana across the entire site (system font — fast, no web-font load).
- **Motion:** scroll-reveal (IntersectionObserver), animated counters, animated growth chart, Three.js hero sphere. All respect `prefers-reduced-motion`.
- **Responsive:** desktop → tablet → mobile, with a hamburger menu under 760px.

---

## 6. Notes

- Content positioning is the new Futureminds direction (education, employability, faculty development, institutional transformation). Real contact details and social links are pulled from the existing futureminds.co.in.
- The contact form is front-end only (shows a success message). To make it send email, point the `<form>` at your backend or a service like Formspree in `assets/js/app.js` (`contactBlock`).
- Three.js loads from a CDN on the home page; if offline, the hero simply shows its gradient background and everything else still works.
- Designed and built to be handed to a developer or dropped onto any static host (Netlify, Vercel, GitHub Pages, S3, or traditional hosting).
