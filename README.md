# hwanngo.github.io

Source of [hwanngo.github.io](https://hwanngo.github.io), the portfolio and resume site of Hoan Ngo (Jason), Data Engineer and Software Engineer in Hanoi, Vietnam.

Built with React 19, TypeScript and Vite, available in English and Vietnamese, with all content kept in JSON files and deployed to GitHub Pages via GitHub Actions. The same data also feeds the LaTeX resume PDF built in the [hwanngo/resume](https://github.com/hwanngo/resume) repo.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Content Architecture](#content-architecture)
5. [How to Update Content](#how-to-update-content)
   - [Personal Info & Social Links](#1-personal-info--social-links)
   - [Work Experience](#2-work-experience)
   - [Education](#3-education)
   - [Projects](#4-projects)
   - [Clients](#5-clients)
   - [Skills](#6-skills)
   - [Resume PDF](#7-resume-pdf)
   - [Avatar, Images & Link Preview](#8-avatar-images--link-preview)
   - [Certificates](#9-certificates)
   - [Awards](#10-awards)
6. [Translations](#translations)
   - [Editing existing translations](#editing-existing-translations)
   - [Adding a new language](#adding-a-new-language)
7. [Theme & Design Tokens](#theme--design-tokens)
8. [Deploying to GitHub Pages](#deploying-to-github-pages)
9. [Running Tests](#running-tests)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (function components + hooks) |
| Language | TypeScript 6 (strict mode) |
| Build Tool | Vite 8 + SWC |
| Styling | Inline styles on CSS variable tokens; Tailwind CSS 4 is loaded only for its preflight reset |
| State | Zustand 5 with `persist` middleware (localStorage) |
| i18n | i18next 26 + react-i18next 17 + i18next-http-backend |
| Fonts | Lora (headings) + DM Sans (body) via Google Fonts |
| Tests | Vitest 4 + jsdom |
| Package Manager | pnpm 9.15 |
| Deployment | GitHub Pages via GitHub Actions |

---

## Project Structure

```
hwanngo.github.io/
├── public/
│   ├── assets/
│   │   ├── images/              # avatar, client logos, favicons, site.webmanifest
│   │   ├── certificates/        # certificate PDFs grouped by issuer
│   │   ├── awards/              # award PDFs grouped by organisation
│   │   ├── {Name}-Resume.pdf    # Data Engineer resume PDF (see "Resume PDF" below)
│   │   └── {Name}-Software-Engineer-Resume.pdf
│   ├── locales/
│   │   ├── en-US/translation.json   # English UI strings + content text (also read by the CV build)
│   │   └── vi-VN/translation.json   # Vietnamese
│   ├── og-image.png             # 1200x630 link-preview card (og:image / twitter:image)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── data/                    # language-agnostic structured data
│   │   ├── profile.json         # name, legalName, email, phone, location, quote, social, formspreeId
│   │   ├── experience.json      # jobs: id, period, tech tags
│   │   ├── education.json       # degrees: id, period
│   │   ├── projects.json        # id, category, tags, status, show, cvShow, url
│   │   ├── clients.json         # id, website href, logo path, alt text
│   │   ├── skills.json          # skill categories with tag arrays (optional url)
│   │   ├── certificates.json    # id, issuer, show, cvShow, date, url, order, file
│   │   └── awards.json          # id, issuer, year, date, url, order, file
│   ├── components/
│   │   ├── Sidebar.tsx          # avatar, name (h1), roles, contacts, resume download; also the mobile drawer
│   │   ├── NavBar.tsx           # tab switcher, language menu, theme toggle
│   │   ├── TimelineItem.tsx     # collapsible timeline row with location / domains subtitles
│   │   ├── Tag.tsx              # pill tag chip
│   │   ├── BulletItem.tsx       # checkmark bullet point
│   │   └── Icon.tsx             # inline SVG icon set
│   ├── pages/
│   │   ├── About.tsx            # bio, "What I do" cards, Clients
│   │   ├── Resume.tsx           # Experience, Skills, Education, Certifications, Awards
│   │   ├── Portfolio.tsx        # filterable project cards
│   │   └── Contact.tsx          # contact cards + Formspree form
│   ├── store/useAppStore.ts     # Zustand: theme + language (both persisted)
│   ├── resumeUrl.ts             # builds the resume PDF path from profile.json
│   ├── i18n.ts                  # i18next init
│   ├── App.tsx                  # layout shell, hash routing (#about, #resume, #portfolio, #contact)
│   ├── main.tsx                 # React root + loading fallback
│   ├── types.ts                 # shared TypeScript interfaces
│   └── index.css                # design tokens + Tailwind preflight
├── .github/workflows/deploy.yml # build + deploy to GitHub Pages, then trigger the CV rebuild
├── index.html                   # Vite entry: meta, Open Graph, JSON-LD
├── postcss.config.js
├── vite.config.ts
└── package.json
```

---

## Local Development

**Prerequisites:** Node.js 20+, pnpm 9.15+

```bash
pnpm install     # install dependencies
pnpm dev         # dev server with hot reload, http://localhost:5173
pnpm build       # type-check + production build into dist/
pnpm preview     # serve the production build, http://localhost:4173
pnpm test        # run the test suite
```

---

## Content Architecture

Content is split into two layers that are kept separate on purpose:

| Layer | Location | What goes here |
|---|---|---|
| **Structured data** | `src/data/*.json` | IDs, dates, URLs, image paths, tech tag arrays: things that do not change between languages |
| **Translated text** | `public/locales/{lang}/translation.json` | Every human-readable string: titles, descriptions, bullet points, UI labels |

The two layers are linked by **ID keys**. Each entry in a data file has an `id`, and components call `t('section.{id}.field')` to look up the matching text in the active locale.

**Example:** the experience entry `"id": "vmo"` in `experience.json` is displayed with `t('experience.vmo.title')`, `t('experience.vmo.bullets', { returnObjects: true })` and so on.

So:
- Adding a language = adding one translation file, with no data file changes.
- Reordering entries = reordering the data file, with no translation file changes.

> **The CV build reads `src/data/*.json` and `public/locales/en-US/translation.json`.** Keep existing keys and shapes stable; add new optional fields rather than renaming or removing ones the CV uses.

---

## How to Update Content

### 1. Personal Info & Social Links

**File:** `src/data/profile.json`

```jsonc
{
  "name": "Display Name",                    // shown in the sidebar, header and footer
  "legalName": "Full Legal Name",            // optional: used for the resume PDF filename and the CV header
  "nickname": "Nickname",
  "avatar": "/assets/images/my-avatar.png",  // path relative to public/
  "email": "you@example.com",
  "phone": "+84 ...",                        // optional: when set, a Phone row appears in the sidebar
  "location": "City, Country",
  "quote": "Short one-line tagline.",        // optional: shown in italic serif under the role labels
  "social": [
    { "id": "linkedin", "icon": "linkedin", "href": "https://linkedin.com/in/yourprofile", "label": "LinkedIn" },
    { "id": "github",   "icon": "github",   "href": "https://github.com/yourusername",    "label": "GitHub"   }
  ],
  "formspreeId": "yourformid"                // from formspree.io: powers the contact form
}
```

`quote` and `location` can be translated per locale with the optional `sidebar.quote` and `sidebar.location` keys; when a locale does not define them, the `profile.json` values are shown.

The `icon` value must match a key in `src/components/Icon.tsx`. Available icons: `mail`, `phone`, `location`, `linkedin`, `github`, `external`, `send`, `data`, `code`, `check`, `calendar`, `edu`, `brief`, `tools`, `sun`, `moon`, `download`, `paper`, `cert`, `award`, `chevrondown`, `chevronup`, `menu`, `close`.

---

### 2. Work Experience

Adding a job means editing the data file and every locale file.

**Step 1: `src/data/experience.json`** (most recent first; the first two entries start expanded):

```jsonc
[
  {
    "id": "mycompany",                // unique slug, must match the key in the locale files
    "period": "Apr 2025 – Present",   // English period, the fallback for every locale
    "tags": ["Python", "AWS", "Kafka"] // tech tags (kept as data; not rendered on the site)
  }
]
```

**Step 2: `public/locales/en-US/translation.json`** (under `"experience"`):

```jsonc
"experience": {
  "mycompany": {
    "title": "Senior Data Engineer - My Company Ltd.",  // "Role - Company": the CV splits on " - "
    "location": "Remote · US-based company",           // optional: muted line under the title
    "period": "Apr 2025 – Present",                    // optional: overrides the data file period
    "domains": "Fintech, Payments · Client: Singapore", // optional: muted "Domains: ..." line under the title
    "bullets": [
      "First achievement or responsibility.",
      "Second bullet."
    ],
    "cvBullets": ["Shorter bullet for the PDF."]       // optional: the CV uses these instead of bullets
  }
}
```

**Step 3: `public/locales/vi-VN/translation.json`** (translated values and a localised period):

```jsonc
"experience": {
  "mycompany": {
    "title": "Kỹ sư Dữ liệu Cấp cao - My Company Ltd.",
    "location": "Làm việc từ xa · Công ty tại Mỹ",
    "period": "04/2025 – Hiện tại",
    "domains": "Fintech, Thanh toán · Khách hàng: Singapore",
    "bullets": ["Mô tả trách nhiệm hoặc thành tích.", "Điểm thứ hai."]
  }
}
```

> Put the business domains in `domains`, not as the first bullet. (The CV still drops a leading `"Domains: ..."` bullet for older content.)

---

### 3. Education

**Step 1: `src/data/education.json`**

```jsonc
[
  { "id": "myuniversity", "period": "2020 – 2024" }
]
```

**Step 2: both locale files**, under `"education"`:

```jsonc
// en-US/translation.json
"education": {
  "myuniversity": {
    "institution": "University of Example",
    "degree": "Bachelor of Science in Computer Science", // used by the CV
    "location": "Vietnam",                               // optional: muted line under the institution
    "bullets": ["Bachelor of Science in Computer Science.", "Coursework focus: ..."],
    "cvBullets": ["Coursework focus: ..."]               // optional: the CV uses these instead of bullets
  }
}
```

Add `"period"` in a locale only when the dates need localising; year-only periods are language neutral.

---

### 4. Projects

**Step 1: `src/data/projects.json`**

```jsonc
[
  {
    "id": "myProject",                    // unique slug
    "category": "dataEngineering",        // "dataEngineering" | "softwareEngineering" (drives the filter buttons)
    "tags": ["Python", "Spark", "AWS"],   // tech pills on the card
    "status": "personal",                 // "professional" | "personal" (badge on the card)
    "show": true,                         // false hides it on the site
    "cvShow": true,                       // optional: include in the resume PDF; when omitted the CV follows `show`
    "url": "https://github.com/you/repo"  // optional: adds a "View code" link
  }
]
```

Filter buttons only appear when more than one category is visible.

**Step 2: both locale files**, under `"projects"`:

```jsonc
"projects": {
  "myProject": {
    "title": "Real-Time Analytics Pipeline",
    "subtitle": "Personal Project · Python, Spark",  // used by the CV
    "period": "2025 – Present",                      // optional: kept as data, not shown on the card or in the CV
    "desc": "One or two sentences shown on the portfolio card.",
    "bullets": ["Detail used by the CV."],
    "cvBullets": ["Shorter CV bullet."]              // optional: the CV uses these instead of bullets
  }
}
```

---

### 5. Clients

**Step 1:** copy the logo to `public/assets/images/`. Use a tightly cropped, transparent PNG (or SVG) about 240 px wide; logos are displayed 40 px tall on a light tile in both themes.

**Step 2: `src/data/clients.json`**

```jsonc
[
  { "id": "acme", "href": "https://www.acme.com/", "logo": "/assets/images/client_acme.png", "alt": "ACME Corporation" }
]
```

No translation changes are needed; the `alt` text lives in the data file.

---

### 6. Skills

**File:** `src/data/skills.json`

Each object is one category row on the Resume tab. The `id` looks up the heading under `"skills"` in the locale files; `tags` are shown as-is (not translated).

```jsonc
[
  { "id": "programming",         "tags": ["Python", "SQL", "Java", "JavaScript/TypeScript"] },
  { "id": "dataEngineering",     "tags": ["ETL/ELT", "Apache Airflow", "Airbyte", "dbt"] },
  { "id": "databases",           "tags": ["Snowflake", "BigQuery", "PostgreSQL"] },
  { "id": "cloudInfra",          "tags": ["AWS", "GCP", "Azure", "OpenTofu/Terraform"] },
  { "id": "aiLlm",               "tags": ["OpenAI & Anthropic APIs", "prompt engineering"] },
  { "id": "softwareEngineering", "tags": ["REST APIs", "FastAPI", "React"] },
  { "id": "biAnalytics",         "tags": ["Metabase", "Tableau"] },
  { "id": "spokenLanguages",     "tags": ["English - C2 Proficient (CEFR)"], "url": "https://cert.efset.org/..." }
]
```

`url` is optional: when present, the category's tags link to it (handy for a language certificate).

To add a **new category**, also add its heading to both locale files:

```jsonc
"skills": {
  "programming": "Programming",
  "dataEngineering": "Data Engineering",
  "databases": "Databases & Warehousing",
  "cloudInfra": "Cloud & Infrastructure",
  "aiLlm": "AI & LLM",
  "softwareEngineering": "Software Engineering",
  "biAnalytics": "BI & Analytics",
  "spokenLanguages": "Languages",
  "newCategory": "My New Category"
}
```

---

### 7. Resume PDF

Two PDFs are published: `/assets/{Name}-Resume.pdf` (Data Engineer) and `/assets/{Name}-Software-Engineer-Resume.pdf` (Software Engineer). The **Download Resume** buttons (hidden for now: `SHOW_RESUME_DOWNLOAD` in `src/resumeUrl.ts`) link to the first one, where `{Name}` is `profile.legalName` (falling back to `profile.name`) with spaces replaced by hyphens. With `"legalName": "Cong Hoan Ngo"` the file is `public/assets/Cong-Hoan-Ngo-Resume.pdf`.

The PDFs are generated from this repo's data by [hwanngo/resume](https://github.com/hwanngo/resume) (the SE summary is `about.bioSe` in `en-US/translation.json`, used only by the PDF): every deploy triggers a CV rebuild, which commits the refreshed PDFs back here with `[skip-resume-rebuild]` in the message so the two repos do not loop. To replace it by hand:

```bash
cp /path/to/Resume.pdf "public/assets/Cong-Hoan-Ngo-Resume.pdf"
```

The button label comes from the `ui.downloadResume` key in each locale.

Every customization behind the PDFs (variants, ATS layout, which site keys the CV reads, secrets) is listed in `CUSTOMIZATIONS.md` in [hwanngo/resume](https://github.com/hwanngo/resume).

---

### 8. Avatar, Images & Link Preview

Replace `public/assets/images/my-avatar.png` to change the avatar (shown as an 88 × 88 px circle; a square image of 200 × 200 px or more works best).

Link previews (LinkedIn, Zalo, Slack, X) use `public/og-image.png`, a 1200 × 630 card referenced from `index.html` (`og:image`, `twitter:image`). Regenerate it when the name or roles change, and keep the `og:image:alt` text in sync.

---

### 9. Certificates

Certificates are PDFs under `public/assets/certificates/` listed in `src/data/certificates.json`.

**Step 1: copy the PDF** into the issuer folder (`amazon/`, `boomi/`, `coursera/{amazon,google,microsoft,talend}/`, `google/`, `ibm/`, `linkedin/`, `microsoft/`) with a kebab-case filename.

**Step 2: add an entry to `src/data/certificates.json`:**

```jsonc
{
  "id": "my-certificate-name",
  "issuer": "amazon",
  "show": true,                                   // display on the Resume tab
  "cvShow": true,                                 // optional: include in the resume PDF (independent of show)
  "date": "2025-05",                              // optional "YYYY-MM": shown as "May 2025", sorts newest first
  "url": "https://credentials.example.com/abc",   // optional credential link, preferred over file
  "order": 1,                                     // optional manual sort (lower first)
  "file": "/assets/certificates/amazon/my-certificate-name.pdf"
}
```

- `issuer`: one of `amazon`, `boomi`, `coursera`, `google`, `ibm`, `linkedin`, `microsoft`.
- If **any** entry in an issuer group has `order`, the group sorts by `order` instead of by date.
- `file` is the fallback link when `url` is empty (and the CV links to the hosted file in that case).
- To hide a certificate without deleting it, set `"show": false`. An issuer group disappears when all its certificates are hidden.

**Step 3: add the display title to both locale files** under `"certificates"` (titles are proper nouns, so they are identical in both). A missing title shows the raw key.

---

### 10. Awards

Awards are PDFs under `public/assets/awards/{org-slug}/` listed in `src/data/awards.json`:

```jsonc
{
  "id": "my-award-slug",
  "issuer": "vmo",                          // organisation slug (internal)
  "year": "2024",                           // shown when date is not set
  "date": "2024-12",                        // optional "YYYY-MM": shown instead of year, sorts newest first
  "url": "https://example.com/award",       // optional, preferred over file for the "View" link
  "order": 1,                               // optional manual sort
  "file": "/assets/awards/vmo/my-award.pdf"
}
```

Then add `title`, `subtitle`, `issuer` and `issuerLabel` under `"awards"."{id}"` in both locale files.

---

## Translations

### Editing existing translations

All human-readable strings live in `public/locales/en-US/translation.json` and `public/locales/vi-VN/translation.json`. Top-level structure:

```jsonc
{
  "nav":          { "about": "About", "resume": "Resume", "portfolio": "Portfolio", "contact": "Contact" },
  "sidebar":      { "dataEngineer": "Data Engineer", "softwareEngineer": "Software Engineer", "quote": "(optional)", "location": "(optional)" },
  "ui":           { "downloadResume": "Download Resume", "view": "View", "toggleTheme": "Toggle theme", ... },
  "about":        { "title": "About me", "bio": "...", "whatIDo": "What I do", "services": { ... } },
  "resume":       { "title": "Resume", "experience": "Experience", "skills": "Skills", "education": "Education", "certifications": "...", "awards": "...", "domains": "Domains" },
  "certIssuers":  { "amazon": "Amazon Web Services", ... },
  "skills":       { "programming": "Programming", "aiLlm": "AI & LLM", ... },
  "portfolio":    { "title": "Portfolio", "all": "All", "filters": { ... } },
  "contact":      { "title": "Contact", "email": "Email", "location": "Location", "validation": { ... } },
  "footer":       { "copyright": "© {{year}} {{name}} · {{location}}" },
  "education":    { "{id}": { "institution": "...", "degree": "...", "location": "...", "bullets": [...], "cvBullets": [...] } },
  "experience":   { "{id}": { "title": "Role - Company", "location": "...", "period": "...", "domains": "...", "bullets": [...], "cvBullets": [...] } },
  "certificates": { "{id}": "Display Name" },
  "awards":       { "{id}": { "title": "...", "subtitle": "...", "issuer": "...", "issuerLabel": "..." } },
  "projects":     { "{id}": { "title": "...", "subtitle": "...", "period": "...", "desc": "...", "bullets": [...], "cvBullets": [...] } }
}
```

> Only edit the **values**. Changing a key breaks the lookup (and possibly the CV build).

### Adding a new language

1. Copy `public/locales/en-US/translation.json` to `public/locales/{code}/translation.json` and translate the values.
2. Add the code to the `Language` type in `src/types.ts`.
3. Add it to `LANGUAGES` in `src/components/NavBar.tsx`:

```ts
{ code: 'fr-FR', label: 'FR', fullName: 'Français' },
```

The HTTP backend loads `/locales/{code}/translation.json` when the language is selected.

---

## Theme & Design Tokens

All colours are CSS custom properties in `src/index.css`, with `[data-theme="dark"]` overriding the same tokens. On a first visit the theme follows the OS setting; after that the visitor's choice is persisted.

```css
:root {
  --accent:       #c96442;  /* decorative brand colour: icons, rings, borders */
  --accent-text:  #a64f30;  /* accent for small text (4.5:1 on light surfaces) */
  --accent-solid: #a64f30;  /* filled buttons with --on-accent text */
  --bg:           #f5f4ed;  /* page background */
  --bg-card:      #faf9f5;  /* cards and sidebar */
  --fg:           #141413;  /* primary text */
  --fg-2:         #5e5d59;  /* secondary text */
  --fg-3:         #686761;  /* muted text, uppercase labels */
  --border:       #e8e6dc;
  --tag-bg:       #ede9df;  /* pill chip background */
  --logo-bg:      #ffffff;  /* client logo tile */
}
```

Keep text tokens at WCAG AA (4.5:1) against `--bg`, `--bg-card` and `--tag-bg` in both themes. Fonts are set by `--font-serif` (Lora) and `--font-sans` (DM Sans); to swap a font, update the variable and the Google Fonts `<link>` in `index.html`.

---

## Deploying to GitHub Pages

Every push to `main` runs `.github/workflows/deploy.yml`:

```
git push → pnpm install → pnpm build → upload dist/ → deploy to Pages → trigger the CV rebuild
```

To deploy without a code change, use **Actions → Deploy to GitHub Pages → Run workflow**.

First-time setup for a fork: name the repository `{username}.github.io`, push it, and set **Settings → Pages → Source** to **GitHub Actions**. The CV rebuild step only runs when a `RESUME_REPO_TOKEN` secret is configured.

---

## Running Tests

```bash
pnpm test
```

Tests use [Vitest](https://vitest.dev/) with jsdom and live in `__tests__/` folders next to the code they cover. The suite currently covers the Zustand store, including the OS theme detection.
