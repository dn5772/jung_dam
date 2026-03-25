# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack at http://localhost:3000
npm run build      # Production build with Turbopack
npm run lint       # Run ESLint
npm run migrate    # Migrate menu data to Vercel Blob
npm run check-blob # Check Vercel Blob file status
```

No test runner is configured. There are no test files in this project.

## Environment Variables

Required in `.env`:
```
JWT_SECRET=...
ADMIN_PASSWORD_HASH=...   # bcrypt hash
BLOB_READ_WRITE_TOKEN=... # Vercel Blob token
```

## Architecture

**Stack**: Next.js 15 App Router + React 19 + JavaScript (no TypeScript despite README claim). Deployed on Vercel.

**Data storage**: Menu data lives entirely in Vercel Blob as two JSON files — `menuData-en.json` and `menuData-ko.json`. There is no database. All reads/writes go through `src/app/api/menu/route.js`.

**Localization**: Two supported locales: `en` and `ko`. The `LanguageContext` (`src/contexts/LanguageContext.js`) stores the active locale in `localStorage` and falls back to browser language detection. Default is Korean (`ko`).

- The public-facing `MenuSection` fetches `/api/menu?locale=<locale>` and re-fetches on locale change.
- The admin panel stores items with localized fields as `{ en: "...", ko: "..." }` objects (see `mergeLocalizedMenuData` in `src/app/admin/page.js`).
- The API's `POST /api/menu` expects `{ en: {...}, ko: {...} }` to update both locale files atomically.

**Admin panel** (`/admin`): Protected by JWT auth (`POST /api/auth/login` returns a Bearer token). The page manages categories and menu items with drag-and-drop reordering (DnD Kit). Edits merge `en`/`ko` localized data before saving. Images are uploaded via `POST /api/upload` to Vercel Blob and deleted via the Blob URL when items are removed.

**Page structure** (`src/app/page.js`): Single-page app rendered as a client component (`'use client'`). Uses `export const dynamic = 'force-dynamic'` to prevent static caching. All page sections are React components in `src/components/`.

**Styling**: Bootstrap 5 + CSS Modules + a custom `main.css` based on the "Yummy" BootstrapMade template. Third-party UI libraries (GLightbox, AOS, Swiper) are initialized client-side — GLightbox is dynamically imported inside `MenuSection` after menu data loads.

**Scripts**: `src/app/layout.js` loads Bootstrap JS and `purecounter_vanilla.js` via Next.js `<Script>` with `strategy="afterInteractive"`. `YummyScripts` handles AOS, mobile nav, and scroll behaviors.
