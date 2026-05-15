# MareSafe v2 — Agent Instructions

## Project Overview

Maritime emergency card generator. Users fill in vessel/crew details, preview an
A4 card, pay €2 via Stripe, receive a download code by email, then download a
PDF. SPA deployed to GitHub Pages. Cloudflare Worker handles Stripe checkout,
webhook fulfillment (code generation + email), and PDF rendering via
Browserless.

**Worker lives at `worker/` inside this repo** — D1 database, no KV. Schema at
`worker/schema.sql`. Deploy with `wrangler deploy` from `worker/`.

### OLD APP

`../maritime-emergency-card/` — the old app. **Read-only** for reference (e.g.
checking prior field limits, behaviour, or copy). **Never write or modify it.**
All active development happens inside `/Users/steven/Development/maresafe/`
only.

---

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v4** — utility classes only, no Styled Components
- `clsx` + `tailwind-merge` — conditional class composition
- **Lucide React** — icons (24×24, `strokeWidth={1.5}` default)
- No router — single page app
- GitHub Pages deployment via GitHub Actions (build to `dist/`)

---

## Absolute Rules

### Translations

Every user-facing string must exist in **all four languages: nl, en, fr, de**.

- Dynamic text: `t('key')` in component
- New keys added to ALL four language objects before task is done
- Never hardcode English strings in JSX
- Exceptions (do not translate): VHF channel numbers, internationally
  standardised signal descriptions, the brand name "MareSafe"
- Use `/add-translation` for the full procedure

### Icons

Use **Lucide React** only — `import { IconName } from 'lucide-react'`. No emoji
in UI. No CDN icon fonts. No SVG files for UI icons. Size to context:
`size={14}` for buttons, `size={20}` for section headers, `size={32}` for
decorative.

### Commits

Never commit unless the user explicitly says so. Use conventional commit format.
Never push.

### No over-engineering

Do not add abstractions, error handling, or features beyond what is asked. Three
similar JSX blocks beats a premature abstraction. No comments unless the WHY is
non-obvious.

### Human-readable naming

All variables, functions, and CSS classes must be descriptive enough to
understand without context. Avoid abbreviations (`fmtDim`, `c25`, `gL`,
`secHdr`), single-letter variables outside map/reduce callbacks, and terse
shorthand (`storedLang`, `saveNow`). A reader should be able to understand what
something does from its name alone — `formatDimension`, `sectionHeader`,
`beatLong`, `savedLanguage` are all preferable to their short forms.

### Reusable components

Before building a new input, select, button, or modal — check
`src/components/ui/` first. Every generic UI primitive lives there. Do not
create one-off wrappers.

---

## Component Architecture

```
src/
├── main.tsx                  # React root, render gate check
├── App.tsx                   # Root layout, state: verifiedCode + tokensRemaining
├── i18n/
│   ├── locales/              # en.json, nl.json, fr.json, de.json
│   └── useTranslation.ts     # Hook: t(key), tPlural(key, n), currentLang
├── components/
│   ├── ui/                   # Reusable primitives — use these everywhere
│   │   ├── Select.tsx        # single AND multi via `multiple` prop
│   │   ├── Modal.tsx
│   │   └── Tooltip.tsx
│   ├── layout/
│   │   ├── Header.tsx        # lang selector
│   │   ├── SaveLoadBar.tsx   # save/load/clear action buttons
│   │   └── Footer.tsx
│   ├── card/                 # A4 card preview — pixel-exact, NO Tailwind inside
│   │   ├── CardPreview.tsx   # 794×1123px, zoom-scaled, PREVIEW watermark
│   │   └── ...               # TitleBar, ContactsGrid, SignalsSection, etc.
│   ├── editor/               # Form panel
│   │   ├── EditorPanel.tsx   # lock overlay when no valid code
│   │   ├── VesselSection.tsx
│   │   ├── ContactsSection.tsx
│   │   └── InsurerSection.tsx
│   ├── download/
│   │   ├── CheckoutWidget.tsx  # ① Buy — €2 price + Stripe button
│   │   ├── CodeCheckWidget.tsx # ② Activate — code input + verify
│   │   └── DownloadSection.tsx # ④⑤ Language select + download (inside EditorPanel)
│   └── modals/
│       ├── InfoModal.tsx
│       └── LoadDataModal.tsx
├── hooks/
│   ├── useFormData.ts        # All card data state, localStorage persistence
│   ├── useCardScale.ts       # ResizeObserver zoom scale for card preview
│   └── useCheckout.ts        # startCheckout() — POST to worker, redirect
├── lib/
│   ├── worker.ts             # WORKER_BASE + all fetch calls (never fetch directly)
│   └── cn.ts                 # clsx + tailwind-merge helper
└── types/
    └── index.ts              # CardData, Language, Contact, etc.

worker/                       # Cloudflare Worker — D1, no KV
├── src/index.js
├── schema.sql                # D1 schema: download_codes, download_uses, rate_limits
└── wrangler.toml
```

---

## Card Preview — Critical Detail

Card is pixel-exact A4 (794×1123px) — **no Tailwind inside the card**. Use
`CardPreview.module.css` or inline styles. Tailwind's responsive utilities break
fixed-dimension layout.

`PREVIEW` watermark visible until user has valid download code. Clip to card
boundary (`overflow: hidden` on container).

In render mode (PDF generation), card renders without watermark, editor, or
header. See `/render-mode` for the full pattern.

---

## Worker Integration

All worker calls in `src/lib/worker.ts`. Never call `fetch` directly in
components. Worker source at `worker/src/index.js`.

```ts
const WORKER_BASE = "https://maresafe-worker.maresafe.workers.dev"

export async function createCheckoutSession(origin: string): Promise<string>
export async function verifyCode(
  code: string,
): Promise<{ valid: boolean; tokens: number | "unlimited" }>
export async function generatePdf(params: {
  code
  formData
  languages
  lang
}): Promise<Blob>
```

Endpoints:

- `POST /create-checkout-session` — `{ origin }` → `{ url }`
- `POST /check-code` — `{ code }` → `{ valid, tokens: number | "unlimited" }`
- `POST /generate-pdf` — `{ code, formData, languages, area, lang }` → ZIP blob
- `POST /admin/codes` — `{ masterCode }` → `{ codes[] }` (admin only)
- `POST /create-code` — `{ masterCode, email, uses?, unlimited? }` → `{ code }`
  (admin only)
- `POST /revoke-code` — `{ masterCode, code }` → `{ ok }` (admin only)

---

## Design Tokens

```ts
colors: {
  navy: '#1b3a5c',
  navy2: '#2c5282',
  red: '#a93226',
  amber: '#a07000',
  green: '#1e6b3c',
  mid: '#444444',
  lgray: '#aaaaaa',
  'mob-blue': '#1a7fc4',
  'brand-red': '#6b1212',
}
```

Font: system-ui stack. Mono:
`ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`.

---

## What NOT to Build

- No authentication
- No user accounts
- No multiple card templates
- No admin UI (admin lives in the worker's `/admin` endpoint)
- No analytics

Scope: fill form → preview card → buy → enter code → download PDF.
