# Admin Page Mobile UX Redesign

**Date:** 2026-03-25
**Status:** Approved

## Goals

- Mobile-first admin UX for Korean restaurant staff
- Korean/English fields visible simultaneously (no tab switching)
- $ prefix default on price input
- Remove confusing dual-save pattern

## Layout Architecture

### Desktop (≥900px)
Unchanged: left list panel + right edit panel side by side.

### Mobile (<900px)
Two full-screen "views" controlled by a `mobileView` state (`'list' | 'edit'`), transitioning with CSS `transform: translateX`.

- Floating FAB button removed entirely
- Sticky top header changes per view:
  - List view: "메뉴 관리" title + 로그아웃 button
  - Edit view: "← 목록" back button + item title + 삭제 button (existing items only)
- Save button sticky at bottom of edit view on mobile

## Edit Form Layout

Order (top to bottom):

1. **이미지** — full-width clickable upload area; shows thumbnail when image exists; upload spinner overlays the area
2. **가격** — text input with fixed `$` prefix
3. **🇰🇷 한국어 섹션** — distinct background card
   - 제목 (KO)
   - 재료 설명 (KO, textarea)
4. **🇺🇸 English 섹션** — distinct background card
   - Title (EN)
   - Ingredients (EN, textarea)

No locale tabs. Both languages always visible, scroll to reach English section.

## Save Flow Simplification

- **Remove** "모든 변경사항 저장" (full POST) button — confusing alongside per-item PATCH
- Keep only "저장" per item (PATCH)
- New item flow: 새 항목 추가 → category pre-selected from current selection

## List Panel Improvements

- Item cards show small thumbnail if image exists
- "새 항목 추가" button fixed at bottom of list panel
- Toast notifications moved to bottom-center (thumb-reachable on mobile)

## Files Changed

- `src/app/admin/page.js` — state, layout, form restructure
- `src/app/admin/page.module.css` — mobile slide transition, new card styles, $ prefix, toast position
