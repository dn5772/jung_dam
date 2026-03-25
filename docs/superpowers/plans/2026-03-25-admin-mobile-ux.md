# Admin Mobile UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the admin page for mobile-first UX with slide-transition navigation, side-by-side KO/EN form sections, and $ price prefix.

**Architecture:** Two-file change only (`page.js` + `page.module.css`). On mobile (<900px) the list and edit panels become two full-screen views inside a 200%-wide slide wrapper controlled by `mobileView` state. Desktop layout unchanged.

**Tech Stack:** Next.js 15, React 19, CSS Modules

---

## File Map

| File | Change |
|------|--------|
| `src/app/admin/page.js` | State changes, layout restructure, form redesign |
| `src/app/admin/page.module.css` | Full mobile style overhaul |

---

### Task 1: CSS — Mobile slide infrastructure + global style cleanup

**Files:**
- Modify: `src/app/admin/page.module.css`

- [ ] **Step 1: Replace the entire mobile media query block**

Find and replace the `@media (max-width: 900px)` and `@media (max-width: 600px)` blocks with:

```css
/* ── Mobile slide infrastructure ── */
@media (max-width: 899px) {
  .mobileMenuToggle { display: none !important; }

  .container {
    overflow: hidden;
    padding: 0;
    gap: 0;
    display: block;
  }

  .slideWrapper {
    display: flex;
    width: 200%;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    align-items: flex-start;
  }

  .slideWrapperEdit {
    transform: translateX(-50%);
  }

  .leftPanel {
    position: static !important;
    left: auto !important;
    width: 50% !important;
    max-width: none !important;
    height: auto !important;
    min-height: 100dvh;
    box-shadow: none !important;
    padding: 0 0 80px 0;
    overflow-y: auto;
  }

  .rightPanel {
    width: 50% !important;
    min-height: 100dvh;
    padding: 0 0 80px 0;
  }
}
```

- [ ] **Step 2: Add mobile header styles**

Append after the media query above:

```css
.mobileHeader {
  display: none;
}

@media (max-width: 899px) {
  .mobileHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 10;
    gap: 12px;
  }

  .mobileHeaderTitle {
    font-size: 1.1em;
    font-weight: 700;
    color: #111827;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .backButton {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #2563eb;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 0;
    white-space: nowrap;
  }

  /* Desktop header hidden on mobile */
  .header { display: none; }

  /* Show desktop header only on desktop */
}

@media (min-width: 900px) {
  .mobileHeader { display: none; }
  .backButton { display: none; }
}
```

- [ ] **Step 3: Add sticky bottom bar for mobile**

```css
.stickyBottomBar {
  display: none;
}

@media (max-width: 899px) {
  .stickyBottomBar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 16px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    gap: 10px;
    z-index: 10;
  }

  /* Hide the inline button group on mobile (replaced by sticky bar) */
  .buttonGroup { display: none; }
}

@media (min-width: 900px) {
  .buttonGroup { display: flex; }
}
```

- [ ] **Step 4: Add desktop list panel padding**

```css
@media (min-width: 900px) {
  .leftPanel {
    padding: 20px;
    max-width: 360px;
  }

  .rightPanel {
    padding: 20px;
    flex: 1;
  }

  .container {
    padding: 20px;
  }
}
```

---

### Task 2: CSS — Edit form card styles (KO/EN sections, image area, price prefix)

**Files:**
- Modify: `src/app/admin/page.module.css`

- [ ] **Step 1: Add KO/EN section card styles**

```css
/* ── Locale section cards ── */
.localeSection {
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.localeSectionKo {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
}

.localeSectionEn {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.localeSectionHeader {
  font-size: 0.85em;
  font-weight: 700;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 2: Add image upload area styles**

```css
/* ── Image upload area ── */
.imageUploadArea {
  width: 100%;
  min-height: 160px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
  background: #fafafa;
}

.imageUploadArea:hover {
  border-color: #2563eb;
  background: #f0f7ff;
}

.imageUploadPreview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  border-radius: 10px;
}

.imageUploadOverlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.85em;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 10px;
}

.imageUploadArea:hover .imageUploadOverlay {
  opacity: 1;
}

.imageUploadPlaceholder {
  text-align: center;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
}

.imageUploadPlaceholder i {
  font-size: 2em;
  color: #d1d5db;
}

.imageSpinnerOverlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 0.9em;
  color: #2563eb;
  gap: 8px;
}

.hiddenFileInput {
  display: none;
}
```

- [ ] **Step 3: Add $ prefix price input styles**

```css
/* ── Price input with $ prefix ── */
.priceInputWrapper {
  display: flex;
  align-items: stretch;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.pricePrefix {
  padding: 12px 14px;
  background: #f3f4f6;
  border-right: 1px solid #ccc;
  font-weight: 700;
  color: #374151;
  font-size: 1em;
  display: flex;
  align-items: center;
  user-select: none;
}

.priceInputInner {
  flex: 1;
  padding: 12px;
  border: none;
  font-size: 1em;
  outline: none;
  background: transparent;
  width: 0; /* flex will expand it */
}
```

- [ ] **Step 4: Add toast (bottom-center) styles and remove old statusMessage usage**

```css
/* ── Toast notification ── */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  font-size: 0.95em;
  pointer-events: none;
  animation: toastIn 0.25s ease;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.toastsuccess { background: #16a34a; color: #fff; }
.toasterror   { background: #dc2626; color: #fff; }
.toastinfo    { background: #2563eb; color: #fff; }
```

- [ ] **Step 5: Add item card thumbnail styles**

```css
/* ── Item card thumbnail ── */
.itemThumbnail {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.itemThumbnailPlaceholder {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: #f3f4f6;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  font-size: 1.3em;
}
```

- [ ] **Step 6: Add mobile list panel padding**

```css
@media (max-width: 899px) {
  .listContent {
    padding: 16px;
  }

  .addButtonFixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 50vw; /* left panel = 50% of slideWrapper = 100vw */
    padding: 10px 16px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    z-index: 10;
  }

  .addButtonFixed button {
    width: 100%;
    margin: 0;
  }
}

@media (min-width: 900px) {
  .listContent { padding: 0; }
  .addButtonFixed { position: static; padding: 0; background: none; border: none; }
  .addButtonFixed button { margin-bottom: 20px; }
}
```

---

### Task 3: JS — State changes + mobile navigation structure

**Files:**
- Modify: `src/app/admin/page.js`

- [ ] **Step 1: Update state declarations**

In `AdminPage`, make these state changes:

```js
// ADD:
const [mobileView, setMobileView] = useState('list');

// REMOVE these (no longer needed):
// const [activeLocale, setActiveLocale] = useState(DEFAULT_LOCALE);
// const [panelVisible, setPanelVisible] = useState(false);
```

Remove `activeLocale` from state and all `setActiveLocale` calls. Remove `panelVisible` and `setPanelVisible`.

- [ ] **Step 2: Update item selection to trigger mobile navigation**

In the item list `<button onClick>` handler, add `setMobileView('edit')`:

```js
onClick={() => {
  if (!confirmDiscardChanges()) return;
  setSelectedItem(String(index));
  setHasUnsavedChanges(false);
  setMobileView('edit');   // ← add this
}}
```

In `addItem()`, add at the end:
```js
setMobileView('edit');
```

- [ ] **Step 3: After save/cancel, return to list on mobile**

In `saveItem()`, after the final `setSelectedItem('')`:
```js
setMobileView('list');
```

In the cancel button `onClick`:
```js
onClick={() => {
  if (!confirmDiscardChanges()) return;
  setEditingItem(null);
  setSelectedItem('');
  setHasUnsavedChanges(false);
  setMobileView('list');   // ← add this
}}
```

In `deleteItem()`, after `setEditingItem(null)`:
```js
setMobileView('list');
```

- [ ] **Step 4: Replace container/panel JSX structure**

Replace the outer `<div className={styles.container}>` structure:

```jsx
<div className={styles.container}>
  {/* Toast */}
  {status && (
    <div className={`${styles.toast} ${styles[`toast${status.type}`]}`}>
      {status.message}
    </div>
  )}

  <div className={`${styles.slideWrapper} ${mobileView === 'edit' ? styles.slideWrapperEdit : ''}`}>
    {/* LEFT PANEL */}
    <div className={styles.leftPanel}>
      {/* Mobile header — list view */}
      <div className={styles.mobileHeader}>
        <span className={styles.mobileHeaderTitle}>메뉴 관리</span>
        <button onClick={logout} className={styles.logoutButton}>로그아웃</button>
      </div>

      {/* Desktop header */}
      <div className={styles.header}>
        <h1 className={styles.title}>메뉴 관리</h1>
        <button onClick={logout} className={styles.logoutButton}>로그아웃</button>
      </div>

      <div className={styles.listContent}>
        {/* ... category selector, search, item list ... */}
      </div>

      <div className={styles.addButtonFixed}>
        <button onClick={addItem} className={styles.addButton}>+ 새 항목 추가</button>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className={styles.rightPanel}>
      {/* Mobile header — edit view */}
      <div className={styles.mobileHeader}>
        <button className={styles.backButton} onClick={() => {
          if (!confirmDiscardChanges()) return;
          setMobileView('list');
          setEditingItem(null);
          setSelectedItem('');
          setHasUnsavedChanges(false);
        }}>
          ← 목록
        </button>
        <span className={styles.mobileHeaderTitle}>
          {editingItem?.isNew ? '새 항목 추가' : (getLocalizedValue(editingItem?.title, DEFAULT_LOCALE) || '항목 편집')}
        </span>
        {editingItem && !editingItem.isNew && (
          <button onClick={deleteItem} className={styles.deleteButton} disabled={pendingAction === 'delete'}>
            {pendingAction === 'delete' ? '...' : '삭제'}
          </button>
        )}
      </div>

      {/* edit form goes here */}
    </div>
  </div>
</div>
```

Move all existing left-panel content (category selector, search, item list) into `<div className={styles.listContent}>`. Remove the `mobileMenuToggle` button entirely.

---

### Task 4: JS — Edit form restructure (no locale tabs, KO+EN sections, image area, $ price)

**Files:**
- Modify: `src/app/admin/page.js`

- [ ] **Step 1: Add price helper functions** (at the top of AdminPage component, before the hooks)

```js
const stripDollar = (price) => (price || '').replace(/^\$\s*/, '');
const addDollar = (price) => {
  const stripped = stripDollar(price);
  return stripped ? `$${stripped}` : '';
};
```

- [ ] **Step 2: Update `editItem()` to strip $ from price**

In the `editItem` function, where `setEditingItem` is called, add price stripping:

```js
setEditingItem({
  ...item,
  title: normalizeLocalizedField(item.title),
  ingredients: normalizeLocalizedField(item.ingredients),
  price: stripDollar(item.price),   // ← strip $ for input display
  catIndex,
  itemIndex,
});
```

- [ ] **Step 3: Update `addItem()` to strip $ from empty price**

In the `addItem` function, the newItem already has `price: ''` so no change needed.

- [ ] **Step 4: Update `buildLocalizedItemPayload` to add $**

```js
const buildLocalizedItemPayload = (item) => ({
  en: {
    image: item.image,
    title: getLocalizedValue(item.title, 'en'),
    ingredients: getLocalizedValue(item.ingredients, 'en'),
    price: addDollar(item.price),   // ← add $ when saving
  },
  ko: {
    image: item.image,
    title: getLocalizedValue(item.title, 'ko'),
    ingredients: getLocalizedValue(item.ingredients, 'ko'),
    price: addDollar(item.price),
  },
});
```

Also update `convertToLocaleSpecific` the same way:
```js
price: addDollar(item.price),
```

- [ ] **Step 5: Add hidden file input ref**

```js
const fileInputRef = useRef(null);
```

Update `handleImageUpload` to accept a file directly (we'll call it from a click handler):

```js
const handleImageUpload = async (file) => {
  if (!file) return;
  if (!editingItem) {
    showStatus('info', '먼저 편집할 항목을 선택해주세요.');
    return;
  }
  try {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      setEditingItem({ ...editingItem, image: data.imageUrl });
      setHasUnsavedChanges(true);
      showStatus('success', '이미지 업로드 완료');
    } else {
      const errorData = await response.json();
      showStatus('error', `업로드 실패: ${errorData.error}`);
    }
  } catch {
    showStatus('error', '이미지 업로드 중 오류가 발생했습니다.');
  } finally {
    setImageUploading(false);
  }
};
```

- [ ] **Step 6: Replace editForm JSX**

Replace the entire `.editForm` div content with the new layout:

```jsx
{editingItem && (
  <div className={styles.editForm}>
    {/* Category selector (new items only) */}
    {editingItem.isNew && (
      <div className={styles.formGroup}>
        <label className={styles.label}>카테고리</label>
        <select
          value={editingItem.category}
          onChange={(e) => updateEditingField('category', e.target.value)}
          className={styles.select}
        >
          {menuData?.categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {getLocalizedValue(cat.name, DEFAULT_LOCALE) || cat.name}
            </option>
          )) || []}
        </select>
      </div>
    )}

    {/* Image upload */}
    <div className={styles.formGroup}>
      <label className={styles.label}>이미지</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenFileInput}
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
      <div
        className={styles.imageUploadArea}
        onClick={() => !imageUploading && fileInputRef.current?.click()}
      >
        {editingItem.image && (
          <img src={editingItem.image} alt="미리보기" className={styles.imageUploadPreview} />
        )}
        {editingItem.image && !imageUploading && (
          <div className={styles.imageUploadOverlay}>
            <i className="bi bi-camera"></i>
            <span>이미지 교체</span>
          </div>
        )}
        {!editingItem.image && !imageUploading && (
          <div className={styles.imageUploadPlaceholder}>
            <i className="bi bi-image"></i>
            <span>클릭하여 이미지 업로드</span>
          </div>
        )}
        {imageUploading && (
          <div className={styles.imageSpinnerOverlay}>
            <i className="bi bi-arrow-repeat"></i> 업로드 중...
          </div>
        )}
      </div>
    </div>

    {/* Price */}
    <div className={styles.formGroup}>
      <label className={styles.label}>가격</label>
      <div className={styles.priceInputWrapper}>
        <span className={styles.pricePrefix}>$</span>
        <input
          type="text"
          inputMode="decimal"
          value={editingItem.price || ''}
          onChange={(e) => updateEditingField('price', e.target.value)}
          className={styles.priceInputInner}
          placeholder="0.00"
        />
      </div>
    </div>

    {/* Korean section */}
    <div className={`${styles.localeSection} ${styles.localeSectionKo}`}>
      <div className={styles.localeSectionHeader}>🇰🇷 한국어</div>
      <div className={styles.formGroup}>
        <label className={styles.label}>메뉴 이름</label>
        <input
          type="text"
          value={editingItem.title?.ko || ''}
          onChange={(e) => updateEditingLocalizedField('title', 'ko', e.target.value)}
          className={styles.input}
          placeholder="메뉴 이름 (한국어)"
        />
      </div>
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <label className={styles.label}>재료 설명</label>
        <textarea
          value={editingItem.ingredients?.ko || ''}
          onChange={(e) => updateEditingLocalizedField('ingredients', 'ko', e.target.value)}
          className={styles.textarea}
          placeholder="재료 설명 (한국어)"
        />
      </div>
    </div>

    {/* English section */}
    <div className={`${styles.localeSection} ${styles.localeSectionEn}`}>
      <div className={styles.localeSectionHeader}>🇺🇸 English</div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Menu Name</label>
        <input
          type="text"
          value={editingItem.title?.en || ''}
          onChange={(e) => updateEditingLocalizedField('title', 'en', e.target.value)}
          className={styles.input}
          placeholder="Menu name (English)"
        />
      </div>
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <label className={styles.label}>Ingredients</label>
        <textarea
          value={editingItem.ingredients?.en || ''}
          onChange={(e) => updateEditingLocalizedField('ingredients', 'en', e.target.value)}
          className={styles.textarea}
          placeholder="Ingredients (English)"
        />
      </div>
    </div>

    {/* Desktop button group (mobile uses sticky bar) */}
    <div className={styles.buttonGroup}>
      <button
        onClick={saveItem}
        className={styles.saveItemButton}
        disabled={pendingAction === 'add' || pendingAction === 'update'}
      >
        {pendingAction === 'add' || pendingAction === 'update' ? '저장 중...' : '저장'}
      </button>
      <button
        onClick={() => {
          if (!confirmDiscardChanges()) return;
          setEditingItem(null);
          setSelectedItem('');
          setHasUnsavedChanges(false);
          setMobileView('list');
        }}
        className={styles.cancelButton}
      >
        취소
      </button>
      {!editingItem.isNew && (
        <button
          onClick={deleteItem}
          className={styles.deleteButton}
          disabled={pendingAction === 'delete'}
        >
          {pendingAction === 'delete' ? '삭제 중...' : '항목 삭제'}
        </button>
      )}
    </div>

    {/* Mobile sticky bottom bar */}
    <div className={styles.stickyBottomBar}>
      <button
        onClick={saveItem}
        className={styles.saveItemButton}
        disabled={pendingAction === 'add' || pendingAction === 'update'}
      >
        {pendingAction === 'add' || pendingAction === 'update' ? '저장 중...' : '저장'}
      </button>
      <button
        onClick={() => {
          if (!confirmDiscardChanges()) return;
          setEditingItem(null);
          setSelectedItem('');
          setHasUnsavedChanges(false);
          setMobileView('list');
        }}
        className={styles.cancelButton}
        style={{ flex: 'none', minWidth: 'auto', padding: '12px 16px' }}
      >
        취소
      </button>
    </div>
  </div>
)}

{!editingItem && (
  <div className={styles.emptyState}>
    <h3>항목을 선택하세요</h3>
    <p>왼쪽 목록에서 항목을 선택하거나 새 항목을 추가하세요.</p>
  </div>
)}
```

---

### Task 5: JS — Remove save-all button, add thumbnails to item cards

**Files:**
- Modify: `src/app/admin/page.js`

- [ ] **Step 1: Remove `handleSave` function entirely**

Delete the entire `handleSave` async function (lines that do `POST /api/menu` with full data).

- [ ] **Step 2: Remove the save-all button from the left panel JSX**

Delete:
```jsx
<button onClick={handleSave} disabled={saving} className={styles.saveButton}>
  {saving ? '저장 중...' : '모든 변경사항 저장'}
</button>
```

Also remove `saving` and `setSaving` state and `setPendingAction('saveAll')` references.

- [ ] **Step 3: Update item cards to show thumbnail**

Replace the item list `<li>` / `<button>` content:

```jsx
{filteredItems.map(({ item, index }) => (
  <li key={`${index}-${item.image || 'item'}`}>
    <button
      type="button"
      onClick={() => {
        if (!confirmDiscardChanges()) return;
        setSelectedItem(String(index));
        setHasUnsavedChanges(false);
        setMobileView('edit');
      }}
      className={`${styles.itemButton} ${selectedItem === String(index) ? styles.itemButtonActive : ''}`}
    >
      {item.image ? (
        <img src={item.image} alt="" className={styles.itemThumbnail} />
      ) : (
        <div className={styles.itemThumbnailPlaceholder}>
          <i className="bi bi-image"></i>
        </div>
      )}
      <div className={styles.itemTitle}>
        {getLocalizedValue(item.title, DEFAULT_LOCALE) || '제목 없음'}
      </div>
      <div className={styles.itemMeta}>{item.price || '-'}</div>
    </button>
  </li>
))}
```

- [ ] **Step 4: Remove now-unused state variables**

Remove from state declarations:
- `saving`, `setSaving`
- `panelVisible`, `setPanelVisible`
- `activeLocale`, `setActiveLocale`

Remove from imports if `useRef` is now the only addition needed (it should already be imported).

---

### Task 6: Commit

- [ ] **Step 1: Verify on mobile (browser devtools)**

Run `npm run dev` and open Chrome DevTools → Toggle device toolbar → iPhone 14 Pro (390px).

Check:
- List view shows correctly with sticky header
- Tapping an item slides to edit view
- "← 목록" slides back
- KO + EN sections visible without tabs
- $ appears as prefix in price field
- Image upload area clickable, shows thumbnail
- Save/취소 buttons sticky at bottom
- Toast appears at bottom center

- [ ] **Step 2: Verify on desktop**

At ≥900px width:
- Left panel + right panel side by side
- No mobile headers visible
- Form shows KO + EN sections (no tabs)
- $ prefix on price
- Button group visible inline

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.js src/app/admin/page.module.css
git commit -m "feat: mobile-first admin UX with slide navigation and KO/EN form sections

- Replace floating FAB + drawer with CSS slide transition between list/edit views
- Add sticky top header per view (목록: title+logout, 편집: ←+item name+삭제)
- Remove locale tabs — Korean and English sections always visible simultaneously
- Add \$ prefix to price field; strip/add on load/save
- Replace file input with full-width clickable image upload area with thumbnail
- Add item card thumbnails in list panel
- Remove confusing 'save all' button — per-item PATCH is the only save path
- Sticky save/cancel bar at bottom of edit view on mobile
- Move notifications to bottom-center toast"
```
