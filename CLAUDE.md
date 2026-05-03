# MareSafe v2 — Agent Instructions

## Project Overview

Maritime emergency card generator. Users fill in vessel/crew details, preview an A4 card, pay €2 via Stripe, receive a download code by email, then download a PDF. SPA deployed to GitHub Pages. Cloudflare Worker handles Stripe checkout, webhook fulfillment (code generation + email), and PDF rendering via Browserless.

Ground-up React rewrite of an existing vanilla JS app. The Cloudflare Worker (`../maritime-emergency-card/worker/`) is **unchanged** — do not touch it. Original app at `../maritime-emergency-card/` — read for reference (translations, card logic, field structure).

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
- Exceptions (do not translate): VHF channel numbers, internationally standardised signal descriptions, the brand name "MareSafe"
- Use `/add-translation` for the full procedure

### Icons
Use **Lucide React** only — `import { IconName } from 'lucide-react'`.
No emoji in UI. No CDN icon fonts. No SVG files for UI icons.
Size to context: `size={14}` for buttons, `size={20}` for section headers, `size={32}` for decorative.

### Commits
Never commit unless the user explicitly says so. Use conventional commit format. Never push.

### No over-engineering
Do not add abstractions, error handling, or features beyond what is asked.
Three similar JSX blocks beats a premature abstraction.
No comments unless the WHY is non-obvious.

### Reusable components
Before building a new input, select, button, or modal — check `src/components/ui/` first.
Every generic UI primitive lives there. Do not create one-off wrappers.

---

## Component Architecture

```
src/
├── main.tsx                  # React root, render gate check
├── App.tsx                   # Root layout, providers
├── i18n/
│   ├── translations.ts       # All 4 language objects, typed
│   └── useTranslation.ts     # Hook: t(key), currentLang, setLang
├── components/
│   ├── ui/                   # Reusable primitives — use these everywhere
│   │   ├── Button.tsx        # variant: primary|secondary|ghost, size: sm|md|lg
│   │   ├── Input.tsx         # text, tel, number — label, error, maxLength
│   │   ├── Select.tsx        # single AND multi via `multiple` prop
│   │   ├── Modal.tsx         # headless, handles backdrop + focus trap
│   │   ├── Badge.tsx
│   │   └── Tooltip.tsx
│   ├── layout/
│   │   ├── Header.tsx        # lang selector, save/load buttons
│   │   └── PaymentSuccessBanner.tsx
│   ├── card/                 # A4 card preview — pixel-exact, not Tailwind
│   │   ├── CardPreview.tsx   # 794×1123px container, PREVIEW watermark
│   │   ├── TitleBar.tsx
│   │   ├── ContactsGrid.tsx
│   │   ├── SignalsSection.tsx # VHF signal chart (generated, not static)
│   │   └── CardFooter.tsx
│   ├── editor/               # Right panel — the form
│   │   ├── EditorPanel.tsx
│   │   ├── VesselSection.tsx
│   │   ├── ContactsSection.tsx
│   │   └── EmergencySection.tsx
│   ├── download/
│   │   ├── DownloadBar.tsx   # Code entry + verify + download button
│   │   └── CheckoutWidget.tsx # €2 price, Buy button, payment icons
│   └── modals/
│       ├── LoadDataModal.tsx
│       └── TipModal.tsx
├── hooks/
│   ├── useFormData.ts        # All card data state, localStorage persistence
│   ├── useCodeVerification.ts
│   └── useCheckout.ts        # startCheckout() — POST to worker, redirect
├── lib/
│   ├── worker.ts             # WORKER_BASE constant + all fetch calls
│   ├── pdf.ts                # Trigger PDF download via worker
│   └── signals.ts            # VHF signal generation logic (port from old app)
└── types/
    └── index.ts              # FormData, Language, Contact, etc.
```

---

## Card Preview — Critical Detail

Card is pixel-exact A4 (794×1123px) — **no Tailwind inside the card**. Use `CardPreview.module.css` or inline styles. Tailwind's responsive utilities break fixed-dimension layout.

`PREVIEW` watermark visible until user has valid download code. Clip to card boundary (`overflow: hidden` on container).

In render mode (PDF generation), card renders without watermark, editor, or header. See `/render-mode` for the full pattern.

---

## Worker Integration

All worker calls in `src/lib/worker.ts`. Never call `fetch` directly in components.

```ts
const WORKER_BASE = 'https://maresafe-worker.maresafe.workers.dev'

export async function createCheckoutSession(origin: string): Promise<string>
export async function verifyCode(code: string): Promise<CodeStatus>
export async function generatePdf(formData: FormData, lang: Language): Promise<Blob>
```

Endpoints:
- `POST /create-checkout-session` — `{ origin }` → `{ url }`
- `POST /check-code` — `{ code }` → `{ valid, tokens_remaining, status }`
- `POST /generate-pdf` — `{ cardData, lang, code }` → binary PDF

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

Font: system-ui stack. Mono: `ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`.

---

## What NOT to Build

- No authentication
- No user accounts
- No multiple card templates
- No admin UI (admin lives in the worker's `/admin` endpoint)
- No analytics

Scope: fill form → preview card → buy → enter code → download PDF.
