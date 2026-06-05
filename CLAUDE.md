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

**Data storage**: Menu data lives entirely in Vercel Blob as a single unified JSON file — `menuData.json`. There is no database. All reads/writes go through `src/app/api/menu/route.js`. Each category and item has a stable `id`; localized text is stored inline as `{ en, ko }` objects, and shared fields (`image`, `price`) are stored once per item. Prices are stored bare (no symbol); a document-level `currency` setting (default `$`) is prepended to numeric prices when `GET` projects to a locale (non-numeric literals like `시가` are shown as-is). The admin sets the currency via the "카테고리 관리" modal (`PATCH` `updateSettings`). The legacy per-locale files (`menuData-en.json` / `menuData-ko.json`) are kept only as migration backups; run `npm run migrate-unify` once to produce `menuData.json` from them (the API also merges them on the fly if the unified file is missing).

**Localization**: Two supported locales: `en` and `ko`. The `LanguageContext` (`src/contexts/LanguageContext.js`) stores the active locale in `localStorage` and falls back to browser language detection. Default is Korean (`ko`).

- The public-facing `MenuSection` fetches `/api/menu?locale=<locale>` and re-fetches on locale change. `GET` projects the unified data down to that single locale (localized fields collapse to plain strings), so the public contract is unchanged.
- The admin panel fetches `/api/menu?format=full` (the whole unified document, uncached) and edits items in place by `id`.
- Mutations go through `PATCH /api/menu` with `{ action: 'add' | 'update' | 'delete', categoryId, itemId, data }`, addressing items by stable id. `POST /api/menu` bulk-replaces with a full `{ categories }` document.

**Admin panel** (`/admin`): Protected by JWT auth (`POST /api/auth/login` returns a Bearer token). Manages menu items per category (left list / right edit panel, with a mobile slide layout). Selecting/saving keeps your place in the list; unsaved edits are shown via a dirty badge plus a `beforeunload` guard rather than blocking `confirm()` prompts. Saving validates that an item has a title (at least one locale) and a price. Images are uploaded via `POST /api/upload` to Vercel Blob and deleted via `DELETE /api/upload` (by URL) when an item is removed, when an image is replaced, or when an uploaded image is abandoned without saving; whole-category deletes also clean up their items' images server-side. Items drag-reorder within a category (`@dnd-kit/*`, disabled while searching); a "카테고리 관리" modal handles category add/rename/delete/reorder. Reordering is persisted via `PATCH` `reorderItems` / `reorderCategories` actions (id-order lists); category CRUD via `addCategory` / `updateCategory` / `deleteCategory`.

**Page structure** (`src/app/page.js`): Single-page app rendered as a client component (`'use client'`). Uses `export const dynamic = 'force-dynamic'` to prevent static caching. All page sections are React components in `src/components/`.

**Styling**: Bootstrap 5 + CSS Modules + a custom `main.css` based on the "Yummy" BootstrapMade template. Third-party UI libraries (GLightbox, AOS, Swiper) are initialized client-side — GLightbox is dynamically imported inside `MenuSection` after menu data loads.

**Scripts**: `src/app/layout.js` loads Bootstrap JS and `purecounter_vanilla.js` via Next.js `<Script>` with `strategy="afterInteractive"`. `YummyScripts` handles AOS, mobile nav, and scroll behaviors.
