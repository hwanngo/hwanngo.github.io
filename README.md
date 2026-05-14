# My Portfolio Site

Personal portfolio of myself.  
Built with React 19 + Vite, fully internationalized (EN / VI), content driven by JSON files, deployed to GitHub Pages via GitHub Actions.

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
   - [Avatar & Images](#8-avatar--images)
   - [Certificates](#9-certificates)
   - [Awards](#10-awards)
6. [Translations](#translations)
   - [Editing existing translations](#editing-existing-translations)
   - [Adding a new language](#adding-a-new-language)
7. [Theme & Design Tokens](#theme--design-tokens)
8. [Deploying to GitHub Pages](#deploying-to-github-pages)
   - [First-time setup](#first-time-setup)
   - [Deploying an update](#deploying-an-update)
9. [Running Tests](#running-tests)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Functional Components + Hooks) |
| Language | TypeScript 6 (strict mode) |
| Build Tool | Vite 8 + SWC |
| Styling | Tailwind CSS 3.4 + CSS variables (warm palette tokens) |
| State | Zustand 5 with `persist` middleware (localStorage) |
| i18n | react-i18next 15 + i18next-http-backend |
| Fonts | Lora (headings) + DM Sans (body) via Google Fonts |
| Package Manager | pnpm 9.15 |
| Deployment | GitHub Pages via GitHub Actions |

---

## Project Structure

```
hwanngo.github.io/
├── public/
│   ├── assets/
│   │   ├── images/              # avatar, client logos, favicon
│   │   ├── certificates/        # certificate PDFs grouped by issuer
│   │   ├── awards/              # award PDFs grouped by org
│   │   └── {Name}-Resume.pdf    # resume PDF — filename derives from profile.legalName || profile.name (spaces become hyphens)
│   └── locales/
│       ├── en-US/
│       │   └── translation.json # all English UI strings + content text
│       └── vi-VN/
│           └── translation.json # Vietnamese (add more locales here)
├── src/
│   ├── data/                    # language-agnostic structured data
│   │   ├── profile.json         # name, legalName, email, phone, location, quote, social, formspreeId
│   │   ├── experience.json      # jobs: id, period, tech tags
│   │   ├── education.json       # degrees: id, period
│   │   ├── projects.json        # id, category, tech tags, status, cvShow
│   │   ├── clients.json         # id, website href, logo path, alt text
│   │   ├── skills.json          # skill categories with tag arrays (optional url)
│   │   ├── certificates.json    # id, issuer, show, cvShow, date, url, order, file
│   │   └── awards.json          # id, issuer, year, date, url, order, file
│   ├── components/
│   │   ├── Sidebar.tsx          # avatar, name, contacts, resume download
│   │   ├── NavBar.tsx           # tab switcher, language dropdown, theme toggle
│   │   ├── TimelineItem.tsx     # collapsible timeline row (used in Resume)
│   │   ├── Tag.tsx              # pill tag chip
│   │   ├── BulletItem.tsx       # checkmark bullet point
│   │   └── Icon.tsx             # inline SVG icon set
│   ├── pages/
│   │   ├── About.tsx            # bio, "What I'm doing" cards, Clients
│   │   ├── Resume.tsx           # Education + Experience + Skills + Certs + Awards
│   │   ├── Portfolio.tsx        # filterable project cards
│   │   └── Contact.tsx          # contact info cards + Formspree form
│   ├── store/
│   │   └── useAppStore.ts       # Zustand: theme + language (both persisted)
│   ├── i18n.ts                  # react-i18next init
│   ├── App.tsx                  # layout shell: Sidebar + NavBar + page router
│   ├── main.tsx                 # React root
│   ├── types.ts                 # shared TypeScript interfaces
│   └── index.css                # CSS variable tokens + Tailwind directives
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD: build + deploy to GitHub Pages
├── index.html                   # Vite entry point
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Local Development

**Prerequisites:** Node.js 20+, pnpm 9.15+

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload)
pnpm dev
# → http://localhost:5173

# Type-check + production build
pnpm build

# Preview the production build locally
pnpm preview
# → http://localhost:4173

# Run tests
pnpm test
```

---

## Content Architecture

Content is split into two layers that are kept separate on purpose:

| Layer | Location | What goes here |
|---|---|---|
| **Structured data** | `src/data/*.json` | IDs, dates, URLs, image paths, tech tag arrays — things that never change between languages |
| **Translated text** | `public/locales/{lang}/translation.json` | Every human-readable string: titles, descriptions, bullet points, UI labels |

The two layers are linked by **ID keys**. Each entry in a data file has an `id` field. Components call `t('section.{id}.field')` to look up the matching text in the active locale file.

**Example:** an experience entry with `"id": "vmo"` in `experience.json` is displayed using `t('experience.vmo.title')` and `t('experience.vmo.bullets', { returnObjects: true })` from the locale file.

This means:
- Adding a new language = add one translation file, zero data file changes.
- Reordering entries = reorder the data file, zero translation file changes.

---

## How to Update Content

### 1. Personal Info & Social Links

**File:** `src/data/profile.json`

```jsonc
{
  "name": "Display Name",                    // shown in the sidebar
  "legalName": "Full Legal Name",            // optional — used for the resume PDF filename: "{legalName}-Resume.pdf" (spaces → hyphens). Falls back to `name`.
  "nickname": "Nickname",
  "avatar": "/assets/images/my-avatar.png",  // path relative to public/
  "email": "you@example.com",
  "phone": "+84 ...",                        // optional — when set, a Phone row appears in the sidebar
  "location": "City, Country",
  "quote": "Short one-line tagline.",        // optional — rendered in italic serif under the role labels
  "social": [
    { "id": "linkedin", "icon": "linkedin", "href": "https://linkedin.com/in/yourprofile", "label": "LinkedIn" },
    { "id": "github",   "icon": "github",   "href": "https://github.com/yourusername",    "label": "GitHub"   }
  ],
  "formspreeId": "yourformid"  // from formspree.io — powers the contact form
}
```

The `icon` value must match a key in `src/components/Icon.tsx`. Available icons: `mail`, `phone`, `location`, `linkedin`, `github`, `external`, `send`, `data`, `code`, `check`, `calendar`, `edu`, `brief`, `tools`, `sun`, `moon`, `download`, `paper`, `cert`, `award`, `chevrondown`, `chevronup`, `menu`, `close`.

---

### 2. Work Experience

Adding a new job requires changes to **two files**: the data file and every locale file.

**Step 1 — `src/data/experience.json`** (add at the top, most recent first):

```jsonc
[
  {
    "id": "mycompany",                    // unique slug — must match the key in locale files
    "period": "Apr 2025 – Present",       // English period — used as fallback for all locales
    "tags": ["Python", "AWS", "Kafka"]    // tech pills shown on the timeline card
  },
  // ... existing entries below
]
```

**Step 2 — `public/locales/en-US/translation.json`** (under the `"experience"` key):

```jsonc
"experience": {
  "mycompany": {
    "title": "Senior Data Engineer — My Company Ltd.",
    "location": "United States",          // optional — shown under the title
    "period": "Apr 2025 – Present",       // optional per-locale period; falls back to experience.json `period`
    "bullets": [
      "First bullet point describing your responsibility or achievement.",
      "Second bullet point.",
      "Third bullet point."
    ]
  }
}
```

**Step 3 — `public/locales/vi-VN/translation.json`** (translated values + localised period):

```jsonc
"experience": {
  "mycompany": {
    "title": "Kỹ sư Dữ liệu Cấp cao — My Company Ltd.",
    "location": "United States",
    "period": "04/2025 – Hiện tại",       // optional — overrides the data file period for this locale
    "bullets": [
      "Mô tả trách nhiệm hoặc thành tích.",
      "Điểm thứ hai.",
      "Điểm thứ ba."
    ]
  }
}
```

> The `id` in the data file must **exactly** match the key in the locale files.
>
> The `period` in `experience.json` is the English fallback shown for any locale that does not define its own `period`. Add a `"period"` field to a locale entry to display a localised date string for that language (e.g. `"04/2025 – Hiện tại"` for Vietnamese). If the period contains only years (e.g. `"2016 – 2021"`) it is language-neutral and does not need overriding.

---

### 3. Education

**Step 1 — `src/data/education.json`:**

```jsonc
[
  {
    "id": "myuniversity",   // unique slug
    "period": "2020 – 2024"
  }
]
```

**Step 2 — Both locale files** under the `"education"` key:

```jsonc
// en-US/translation.json
"education": {
  "myuniversity": {
    "institution": "University of Example",
    "degree": "Master's Degree in Computer Science",  // optional
    "location": "United States",                       // optional
    "bullets": [
      "Master's Degree in Computer Science.",
      "Thesis: Distributed Stream Processing at Scale."
    ]
  }
}

// vi-VN/translation.json — add "period" only if the dates need localising
"education": {
  "myuniversity": {
    "institution": "Trường Đại học Ví dụ",
    "period": "2020 – 2024",   // optional — omit if year-only and already language-neutral
    "bullets": [
      "Cử nhân Khoa học Máy tính.",
      "Luận văn: Xử lý luồng phân tán."
    ]
  }
}
```

---

### 4. Projects

**Step 1 — `src/data/projects.json`:**

```jsonc
[
  {
    "id": "myProject",                  // unique slug
    "category": "dataEngineering",      // "dataEngineering" | "softwareEngineering" | "personal"
    "tags": ["Python", "Spark", "AWS"], // tech pills on the card
    "status": "professional",           // "professional" or "personal"
    "cvShow": true                      // optional — include this project in resume PDF exports
  }
]
```

Valid `category` values control which filter button shows the card on the Portfolio page:
- `"dataEngineering"` — shows under **Data Engineering** filter
- `"softwareEngineering"` — shows under **Software Engineering** filter
- `"personal"` — shows under **Personal** filter

**Step 2 — Both locale files** under the `"projects"` key:

```jsonc
"projects": {
  "myProject": {
    "title": "Real-Time Analytics Pipeline",
    "desc": "Built a streaming pipeline processing 10M events/day using Spark Structured Streaming and AWS Kinesis, reducing end-to-end latency from 15 minutes to under 30 seconds."
  }
}
```

---

### 5. Clients

**Step 1 — Copy the logo image to `public/assets/images/`.**

**Step 2 — `src/data/clients.json`:**

```jsonc
[
  {
    "id": "acme",
    "href": "https://www.acme.com/",
    "logo": "/assets/images/client_acme.png",
    "alt": "ACME Corporation"
  }
]
```

Logo images are displayed at `max-height: 44px`. A transparent PNG or SVG on a white/transparent background works best. No translation file changes needed — the `alt` text lives in the data file.

---

### 6. Skills

**File:** `src/data/skills.json`

Each object represents one category row on the Resume page. The `id` is used to look up the category heading in the locale file; the `tags` array is the list of pill chips (displayed as-is, not translated).

```jsonc
[
  { "id": "programming",     "tags": ["Python", "SQL", "Java"] },
  { "id": "dataEngineering", "tags": ["ETL/ELT", "Apache Airflow", "dbt", "Airbyte"] },
  { "id": "databases",       "tags": ["Snowflake", "BigQuery", "PostgreSQL", "MySQL"] },
  { "id": "cloudInfra",      "tags": ["AWS", "GCP", "Azure", "Terraform"] },
  { "id": "biAnalytics",     "tags": ["Metabase", "Tableau", "Dashboarding"] },
  { "id": "practices",       "tags": ["Observability", "Analytics Engineering", "CI/CD"] },
  { "id": "spokenLanguages", "tags": ["English – C2 Proficient (CEFR)"], "url": "https://cert.example.com" }
]
```

`url` is optional — when present, the category heading becomes a link (handy for proof of language certificates).

To add a tag, just add it to the `tags` array. To add a **new category**, also add its heading to both locale files under `"skills"`:

```jsonc
// en-US/translation.json
"skills": {
  "programming":     "Programming",
  "dataEngineering": "Data Engineering",
  "databases":       "Databases & Warehousing",
  "cloudInfra":      "Cloud & Infrastructure",
  "biAnalytics":     "BI & Analytics",
  "practices":       "Practices & Automation",
  "spokenLanguages": "Languages",
  "newCategory":     "My New Category"  // ← add heading here
}
```

---

### 7. Resume PDF

The sidebar's **Download Resume** button links to `/assets/{Name}-Resume.pdf`, where `{Name}` is `profile.legalName` (falling back to `profile.name`) with spaces replaced by hyphens. For example, with `"legalName": "Hoan Ngo"` the expected filename is `Hoan-Ngo-Resume.pdf`.

```bash
cp /path/to/your/Resume.pdf "public/assets/Hoan-Ngo-Resume.pdf"
```

The button is visible by default. The link label comes from the `ui.downloadResume` translation key — edit both locale files to change the text.

---

### 8. Avatar & Images

Replace `public/assets/images/my-avatar.png` with your photo. The avatar is displayed as a circle at **88 × 88 px**; a square-cropped image at 200 × 200 px or larger works best.

---

### 9. Certificates

Certificates are stored as PDFs under `public/assets/certificates/` and listed in `src/data/certificates.json`. The `show` field controls whether a certificate appears on the Resume page — the PDF file is always kept regardless.

**Step 1 — Copy the PDF to the appropriate subfolder:**

```
public/assets/certificates/
├── amazon/      # AWS official certifications
├── boomi/
├── coursera/    # Coursera course completions
│   ├── amazon/
│   ├── google/
│   ├── microsoft/
│   └── talend/
├── google/
├── ibm/
├── linkedin/
└── microsoft/
```

Use kebab-case filenames: `my-certificate-name.pdf`

**Step 2 — Add an entry to `src/data/certificates.json`:**

```jsonc
{
  "id": "my-certificate-name",
  "issuer": "amazon",
  "show": true,
  "cvShow": true,                          // optional — include in resume PDF exports
  "date": "2025-05",                       // optional, "YYYY-MM" — rendered as "May 2025" and used for sort order (newest first)
  "url": "https://credentials.example.com/abc",  // optional credential link — used by the "View" button when set
  "order": 1,                              // optional — manual override; lower numbers sort first
  "file": "/assets/certificates/amazon/my-certificate-name.pdf"
}
```

- `id` — kebab-case slug, must match the key you add in Step 3
- `issuer` — one of: `amazon`, `boomi`, `coursera`, `google`, `ibm`, `linkedin`, `microsoft`
- `show` — `true` to display on the page, `false` to hide (PDF stays in assets)
- `cvShow` — `true` to include in resume PDF exports (independent of the on-page `show`)
- `date` — optional ISO `YYYY-MM`. When set, the entry sorts newest-first and shows a formatted month label
- `url` — optional credential link; when present, the cert title and **View** button point here instead of `file`
- `order` — optional sort override. If **any** entry in the issuer group has `order`, the group is sorted by `order` ascending instead of by date
- `file` — path relative to `public/` (always required as the fallback link)

**To hide a certificate without deleting it**, just set `"show": false`. The entire issuer group disappears automatically when all its certs are hidden.

**Step 3 — Add the display title to both locale files** under the `"certificates"` key:

```jsonc
// en-US/translation.json  AND  vi-VN/translation.json
"certificates": {
  "my-certificate-name": "My Certificate Display Name"
}
```

Certificate titles are proper nouns so they are kept identical in both locale files.

> If you skip Step 3 the page will show the raw key (e.g. `certificates.my-certificate-name`) as a fallback. Always add the translation entry.

---

### 10. Awards

Awards are stored as PDFs under `public/assets/awards/` and listed in `src/data/awards.json`.

**Step 1 — Copy the PDF:**

```
public/assets/awards/
└── {org-slug}/    # e.g. vmo/
    └── my-award.pdf
```

Use kebab-case filenames.

**Step 2 — Add an entry to `src/data/awards.json`:**

```jsonc
{
  "id": "my-award-slug",
  "issuer": "vmo",
  "year": "2024",
  "date": "2024-12",                       // optional, "YYYY-MM" — overrides `year` for display when set
  "url": "https://example.com/award",      // optional — used by the "View" button when set
  "order": 1,                              // optional — manual sort override
  "file": "/assets/awards/vmo/my-award.pdf"
}
```

- `id` — kebab-case slug, must match the key added in Step 3
- `issuer` — organisation slug (used only internally, not displayed)
- `year` — displayed next to the issuer label when `date` is not set
- `date` — optional ISO `YYYY-MM`; takes precedence over `year` for display and is used for newest-first sort
- `url` — optional credential link; the **View** button prefers `url` over `file`
- `order` — optional manual sort override (lower first)
- `file` — path relative to `public/` (always required as the fallback link)

**Step 3 — Add translations to both locale files** under the `"awards"` key:

```jsonc
// en-US/translation.json
"awards": {
  "my-award-slug": {
    "title": "Employee of the Year 2024",
    "issuerLabel": "My Company Ltd."
  }
}

// vi-VN/translation.json
"awards": {
  "my-award-slug": {
    "title": "Employee of the Year 2024",
    "issuerLabel": "My Company Ltd."
  }
}
```

---

## Translations

### Editing existing translations

All human-readable strings live in:

```
public/locales/
├── en-US/translation.json
└── vi-VN/translation.json
```

The top-level structure of each file:

```jsonc
{
  "nav":          { "about": "About", "resume": "Resume", ... },
  "sidebar":      { "dataEngineer": "Data Engineer", "softwareEngineer": "Software Engineer" },
  "ui":           { "downloadResume": "Download Resume", "showDetails": "Show details", ... },
  "about":        { "title": "About me", "bio": "...", "services": { ... } },
  "resume":       { "title": "Resume", "education": "Education", "certifications": "Certifications", "awards": "Awards & Recognition", ... },
  "certIssuers":  { "amazon": "Amazon Web Services", "google": "Google", "ibm": "IBM", ... },
  "skills":       { "programming": "Programming", "dataEngineering": "Data Engineering", "databases": "Databases & Warehousing", "cloudInfra": "Cloud & Infrastructure", "biAnalytics": "BI & Analytics", "practices": "Practices & Automation", "spokenLanguages": "Languages" },
  "portfolio":    { "title": "Portfolio", "filters": { ... } },
  "contact":      { "title": "Contact", "email": "Email", "phone": "Phone", "location": "Location", "validation": { ... } },
  "education":    { "{id}": { "institution": "...", "degree": "...(optional)", "location": "...(optional)", "bullets": [...] } },
  "experience":   { "{id}": { "title": "...", "location": "...(optional)", "period": "...(optional, overrides data file)", "bullets": [...] } },
  "certificates": { "{id}": "Display Name" },
  "awards":       { "{id}": { "title": "...", "issuerLabel": "..." } },
  "projects":     { "{id}": { "title": "...", "desc": "..." } }
}
```

> Only edit the **values** (right side of `:`). Changing a key will break the lookup.

---

### Adding a new language

**Step 1 — Create the locale file:**

```bash
mkdir -p public/locales/fr-FR
cp public/locales/en-US/translation.json public/locales/fr-FR/translation.json
# Translate all values in public/locales/fr-FR/translation.json
```

**Step 2 — Add the type to `src/types.ts`:**

```ts
// Before:
export type Language = 'en-US' | 'vi-VN'

// After:
export type Language = 'en-US' | 'vi-VN' | 'fr-FR'
```

**Step 3 — Add it to the dropdown in `src/components/NavBar.tsx`:**

```ts
const LANGUAGES: { code: Language; label: string; fullName: string }[] = [
  { code: 'en-US', label: 'EN', fullName: 'English (US)' },
  { code: 'vi-VN', label: 'VI', fullName: 'Tiếng Việt' },
  { code: 'fr-FR', label: 'FR', fullName: 'Français' },  // ← add this line
]
```

No other code changes required. The i18next HTTP backend will automatically load `/locales/fr-FR/translation.json` when the user selects French.

---

## Theme & Design Tokens

All colours are CSS custom properties defined in `src/index.css`. To adjust the palette, edit the values in that file:

```css
:root {                        /* light theme */
  --accent:       #c96442;     /* terracotta — buttons, links, active states */
  --bg:           #f5f4ed;     /* page background */
  --bg-card:      #faf9f5;     /* card and sidebar background */
  --fg:           #141413;     /* primary text */
  --fg-2:         #5e5d59;     /* secondary text */
  --fg-3:         #87867f;     /* muted text, uppercase labels */
  --border:       #e8e6dc;
  --tag-bg:       #ede9df;     /* pill chip background */
}

[data-theme="dark"] {          /* dark theme — overrides the same tokens */
  --accent:  #d97757;
  --bg:      #141413;
  /* ... */
}
```

Fonts are controlled by two variables:

```css
:root {
  --font-serif: 'Lora', Georgia, serif;             /* headings */
  --font-sans:  'DM Sans', system-ui, sans-serif;   /* body text */
}
```

To swap a font: update the variable here **and** the Google Fonts `<link>` in `index.html`.

---

## Deploying to GitHub Pages

### First-time setup

1. **Create the repository on GitHub** named exactly `{yourusername}.github.io`.

2. **Add the remote and push:**

```bash
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

3. **Enable GitHub Pages** in repository settings:
   - Go to **Settings → Pages**
   - Under *Build and deployment*, set **Source** to **GitHub Actions**
   - Click **Save**

4. The push in step 2 triggers the workflow automatically. Monitor it at:  
   `https://github.com/yourusername/yourusername.github.io/actions`

Once the workflow passes, the site is live at `https://yourusername.github.io`.

---

### Deploying an update

Every push to `main` triggers an automatic build and deploy:

```
git push → GitHub Actions: pnpm install → pnpm build → upload dist/ → deploy
```

Deployment completes in **2–3 minutes**. The full update workflow is:

```bash
# 1. Make your changes
#    e.g. edit src/data/experience.json and public/locales/*/translation.json

# 2. Verify the build passes locally first
pnpm build

# 3. Commit with a descriptive message
git add src/data/experience.json
git add public/locales/en-US/translation.json
git add public/locales/vi-VN/translation.json
git commit -m "content: add Senior Data Engineer role at MyCompany"

# 4. Push — deployment is fully automatic from here
git push
```

Check the live deployment at:  
`https://github.com/yourusername/yourusername.github.io/actions`

**To trigger a deployment without a code change** (e.g. after updating the PDF):

Go to **Actions → Deploy to GitHub Pages → Run workflow → Run workflow**.

---

## Running Tests

```bash
pnpm test
```

Tests use [Vitest](https://vitest.dev/) with jsdom. The current suite covers the Zustand store (`src/store/__tests__/useAppStore.test.ts`). Test files live in `__tests__/` subdirectories next to the code they cover.
