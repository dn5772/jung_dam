'use client';

import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './page.module.css';

const DEFAULT_LOCALE = 'ko';
const SUPPORTED_LOCALES = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
];

/* ─── helpers ─── */

const normalizeLocalizedField = (value) => {
  if (!value) return { ko: '', en: '' };
  if (typeof value === 'string') return { ko: value, en: '' };
  if (typeof value === 'object') return { ko: value.ko || '', en: value.en || '', ...value };
  return { ko: '', en: '' };
};

const getLocalizedValue = (value, locale) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[locale] || value[DEFAULT_LOCALE] || Object.values(value).find(Boolean) || '';
  }
  return '';
};

const stripDollar = (price) => (price || '').replace(/^\$\s*/, '');
const addDollar = (price) => {
  const s = stripDollar(price);
  return s ? `$${s}` : '';
};

/* ─── useAuth hook ─── */

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setToken(storedToken);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch {
        localStorage.removeItem('adminToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        const err = await response.json();
        return { success: false, error: err.error };
      }
    } catch {
      return { success: false, error: '네트워크 오류' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, isLoading, login, logout, token };
};

/* ─── LoginForm ─── */

const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await onLogin(password);
    setLoading(false);
    if (!result.success) setError(result.error || '로그인 실패');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Jung Dam 관리자</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="관리자 비밀번호 입력"
              autoFocus
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─── Sortable list row (shared drag-handle wrapper) ─── */

const SortableRow = ({ id, disabled, className, handleClassName, handleLabel, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 2 : undefined,
  };
  return (
    <li ref={setNodeRef} style={style} className={className}>
      {!disabled && (
        <button
          type="button"
          className={handleClassName}
          aria-label={handleLabel}
          {...attributes}
          {...listeners}
        >
          <i className="bi bi-grip-vertical" />
        </button>
      )}
      {children}
    </li>
  );
};

/* ─── Category manager (add / rename / delete / reorder) ─── */

const toCategoryDraft = (c) => ({
  id: c.id,
  name: normalizeLocalizedField(c.name),
  description: normalizeLocalizedField(c.description),
});

const CategoryManager = ({ categories, patchMenu, refreshMenu, showStatus, onClose }) => {
  const [draft, setDraft] = useState(() => categories.map(toCategoryDraft));
  const [newName, setNewName] = useState({ ko: '', en: '' });
  const [busy, setBusy] = useState(false);

  const idKey = categories.map((c) => c.id).join(',');
  useEffect(() => {
    // Re-sync when the set/order of categories changes (add/delete/reorder),
    // but keep in-progress name edits while ids are unchanged.
    setDraft(categories.map(toCategoryDraft));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const setField = (id, field, locale, value) =>
    setDraft((d) => d.map((c) => (c.id === id ? { ...c, [field]: { ...c[field], [locale]: value } } : c)));

  const rowIsDirty = (row) => {
    const orig = categories.find((c) => c.id === row.id);
    return !orig || JSON.stringify(toCategoryDraft(orig)) !== JSON.stringify(row);
  };

  const persistRow = async (row) => {
    if (!rowIsDirty(row)) return;
    const { ok, json } = await patchMenu({
      action: 'updateCategory',
      categoryId: row.id,
      data: { name: row.name, description: row.description },
    });
    if (ok) { showStatus('success', '카테고리가 저장되었습니다.'); refreshMenu(); }
    else showStatus('error', json.error || '카테고리 저장에 실패했습니다.');
  };

  const addCategory = async () => {
    if (!newName.ko.trim() && !newName.en.trim()) {
      showStatus('info', '카테고리 이름을 입력하세요.');
      return;
    }
    setBusy(true);
    const { ok, json } = await patchMenu({
      action: 'addCategory',
      data: { name: newName, description: { ko: '', en: '' } },
    });
    if (ok) { showStatus('success', '카테고리가 추가되었습니다.'); setNewName({ ko: '', en: '' }); await refreshMenu(); }
    else showStatus('error', json.error || '카테고리 추가에 실패했습니다.');
    setBusy(false);
  };

  const deleteCategory = async (id) => {
    if (!confirm('이 카테고리와 그 안의 모든 항목이 삭제됩니다. 계속할까요?')) return;
    setBusy(true);
    const { ok, json } = await patchMenu({ action: 'deleteCategory', categoryId: id });
    if (ok) { showStatus('success', '카테고리가 삭제되었습니다.'); await refreshMenu(); }
    else showStatus('error', json.error || '카테고리 삭제에 실패했습니다.');
    setBusy(false);
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const ids = draft.map((c) => c.id);
    const newOrder = arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id));
    setDraft((d) => newOrder.map((id) => d.find((c) => c.id === id)));
    const { ok, json } = await patchMenu({ action: 'reorderCategories', data: { order: newOrder } });
    if (ok) refreshMenu();
    else { showStatus('error', json.error || '순서 변경에 실패했습니다.'); refreshMenu(); }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>카테고리 관리</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className={styles.modalBody}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <ul className={styles.categoryManagerList}>
                {draft.map((cat) => (
                  <SortableRow
                    key={cat.id}
                    id={cat.id}
                    className={styles.categoryCard}
                    handleClassName={styles.dragHandle}
                    handleLabel="카테고리 순서 변경"
                  >
                    <div className={styles.categoryCardFields}>
                      <input
                        className={styles.input}
                        value={cat.name.ko}
                        onChange={(e) => setField(cat.id, 'name', 'ko', e.target.value)}
                        onBlur={() => persistRow(cat)}
                        placeholder="이름 (한국어)"
                      />
                      <input
                        className={styles.input}
                        value={cat.name.en}
                        onChange={(e) => setField(cat.id, 'name', 'en', e.target.value)}
                        onBlur={() => persistRow(cat)}
                        placeholder="Name (English)"
                      />
                      <input
                        className={styles.input}
                        value={cat.description.ko}
                        onChange={(e) => setField(cat.id, 'description', 'ko', e.target.value)}
                        onBlur={() => persistRow(cat)}
                        placeholder="설명 (한국어, 선택)"
                      />
                      <input
                        className={styles.input}
                        value={cat.description.en}
                        onChange={(e) => setField(cat.id, 'description', 'en', e.target.value)}
                        onBlur={() => persistRow(cat)}
                        placeholder="Description (English, optional)"
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => deleteCategory(cat.id)}
                      disabled={busy}
                    >
                      삭제
                    </button>
                  </SortableRow>
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          {draft.length === 0 && (
            <div className={styles.emptyList}>카테고리가 없습니다. 아래에서 추가하세요.</div>
          )}

          <div className={styles.categoryAddRow}>
            <input
              className={styles.input}
              value={newName.ko}
              onChange={(e) => setNewName((n) => ({ ...n, ko: e.target.value }))}
              placeholder="새 카테고리 (한국어)"
            />
            <input
              className={styles.input}
              value={newName.en}
              onChange={(e) => setNewName((n) => ({ ...n, en: e.target.value }))}
              placeholder="New category (English)"
            />
            <button className={styles.addButton} onClick={addCategory} disabled={busy}>
              + 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── AdminPage ─── */

export default function AdminPage() {
  const { isLoggedIn, isLoading, login, logout, token } = useAuth();

  const [menuData, setMenuData] = useState({ categories: [] });
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [status, setStatus] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [mobileView, setMobileView] = useState('list');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const statusTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  // Image-orphan tracking for the current edit session:
  // uploadsRef = blobs uploaded but not yet persisted; loadedImageRef = the
  // image already persisted for the item being edited.
  const uploadsRef = useRef([]);
  const loadedImageRef = useRef('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Single source of truth: the API returns the unified document directly
  // (both locales + stable item ids), so no client-side merge is needed.
  const fetchMenuData = async () => {
    const res = await fetch('/api/menu?format=full', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load menu data');
    return res.json();
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatus(null), 3500);
  };

  // Best-effort blob deletion (fire-and-forget).
  const deleteImageBlob = (url) => {
    if (!url || !url.startsWith('https://')) return;
    fetch('/api/upload', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url }),
    }).catch(() => {});
  };

  // Drop any images uploaded this session that were never saved.
  const discardSessionUploads = () => {
    uploadsRef.current.forEach(deleteImageBlob);
    uploadsRef.current = [];
  };

  const clearFieldError = (field) =>
    setValidationErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const updateEditingField = (field, value) => {
    setEditingItem((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    clearFieldError(field);
  };

  const updateEditingLocalizedField = (field, locale, value) => {
    setEditingItem((prev) => ({
      ...prev,
      [field]: { ...normalizeLocalizedField(prev?.[field]), [locale]: value },
    }));
    setHasUnsavedChanges(true);
    clearFieldError(field);
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchMenuData()
        .then((data) => { setMenuData(data); setDataLoading(false); })
        .catch(() => {
          showStatus('error', '메뉴 데이터를 불러오지 못했습니다.');
          setDataLoading(false);
        });
    } else {
      setDataLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => () => {
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
  }, []);

  // Guard against losing unsaved edits on tab close / refresh.
  // In-app navigation no longer blocks with confirm(); the dirty badge is the cue.
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (selectedCategory && selectedItem) {
      editItem();
    } else if (!editingItem?.isNew) {
      // Don't clear a freshly opened "new item" form (it has no selection yet).
      setEditingItem(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedItem]);

  // If the selected category disappears (e.g. deleted in the category manager),
  // drop the stale selection so the list/editor don't point at nothing.
  useEffect(() => {
    if (selectedCategory && !menuData.categories.some((c) => c.id === selectedCategory)) {
      setSelectedCategory('');
      setSelectedItem('');
      setEditingItem(null);
    }
  }, [menuData, selectedCategory]);

  if (isLoading) return <div className={styles.loginContainer}><p>로딩 중...</p></div>;
  if (!isLoggedIn) return <LoginForm onLogin={login} />;
  if (dataLoading) return <div className={styles.loginContainer}><p>메뉴 데이터 로딩 중...</p></div>;

  const currentCategory = menuData?.categories?.find((c) => c.id === selectedCategory);
  const filteredItems = (currentCategory?.items || []).filter((item) => {
    const q = itemSearch.trim().toLowerCase();
    if (!q) return true;
    const titles = item.title && typeof item.title === 'object'
      ? Object.values(item.title).join(' ')
      : (item.title || '');
    return `${titles} ${item.price || ''}`.toLowerCase().includes(q);
  });

  // The unified item shape sent to the API (single price, localized text objects).
  const buildItemPayload = (item) => ({
    image: item.image || '',
    price: addDollar(item.price),
    title: normalizeLocalizedField(item.title),
    ingredients: normalizeLocalizedField(item.ingredients),
  });

  // All mutations re-read the unified document afterwards (the API is the single
  // source of truth) instead of patching local state in place.
  const patchMenu = async (body) => {
    const res = await fetch('/api/menu', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, json };
  };

  const refreshMenu = async () => {
    try {
      setMenuData(await fetchMenuData());
    } catch {
      /* keep current data; the failing action already surfaced an error */
    }
  };

  const addItemToServer = async (categoryId, payload) => {
    setPendingAction('add');
    let result = { ok: false, newId: null };
    try {
      const { ok, json } = await patchMenu({ action: 'add', categoryId, data: payload });
      await refreshMenu();
      if (ok) { showStatus('success', '항목이 추가되었습니다.'); result = { ok: true, newId: json.itemId }; }
      else showStatus('error', json.error || '항목 추가에 실패했습니다.');
    } catch {
      showStatus('error', '항목 추가에 실패했습니다.');
    }
    setPendingAction(null);
    return result;
  };

  const updateItemOnServer = async (categoryId, itemId, payload) => {
    setPendingAction('update');
    let ok = false;
    try {
      const result = await patchMenu({ action: 'update', categoryId, itemId, data: payload });
      ok = result.ok;
      await refreshMenu();
      if (ok) showStatus('success', '항목이 수정되었습니다.');
      else showStatus('error', result.json.error || '항목 수정에 실패했습니다.');
    } catch {
      showStatus('error', '항목 수정에 실패했습니다.');
    }
    setPendingAction(null);
    return ok;
  };

  const deleteItemFromServer = async (categoryId, itemId) => {
    setPendingAction('delete');
    try {
      const { ok, json } = await patchMenu({ action: 'delete', categoryId, itemId });
      await refreshMenu();
      if (ok) showStatus('success', '항목이 삭제되었습니다.');
      else showStatus('error', json.error || '항목 삭제에 실패했습니다.');
    } catch {
      showStatus('error', '항목 삭제에 실패했습니다.');
    }
    setPendingAction(null);
  };

  const reorderItemsOnServer = async (categoryId, order) => {
    const { ok, json } = await patchMenu({ action: 'reorderItems', categoryId, data: { order } });
    if (!ok) { showStatus('error', json.error || '순서 변경에 실패했습니다.'); await refreshMenu(); }
  };

  // Drag-reorder within the currently selected category (disabled while searching).
  const handleItemDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || !currentCategory) return;
    const ids = currentCategory.items.map((it) => it.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const newOrder = arrayMove(ids, oldIndex, newIndex);
    // Optimistic local reorder, then persist.
    setMenuData((prev) => ({
      categories: prev.categories.map((c) =>
        c.id === currentCategory.id
          ? { ...c, items: newOrder.map((id) => c.items.find((it) => it.id === id)) }
          : c,
      ),
    }));
    reorderItemsOnServer(currentCategory.id, newOrder);
  };

  // Title (at least one locale) and price are required.
  const validateItem = (item) => {
    const errors = {};
    const koTitle = (item.title?.ko || '').trim();
    const enTitle = (item.title?.en || '').trim();
    if (!koTitle && !enTitle) errors.title = '메뉴 이름을 입력하세요 (한국어 또는 영어).';
    if (!String(item.price ?? '').trim()) errors.price = '가격을 입력하세요.';
    return errors;
  };

  const addItem = () => {
    discardSessionUploads();
    setValidationErrors({});
    loadedImageRef.current = '';
    const emptyLocalized = SUPPORTED_LOCALES.reduce((acc, l) => { acc[l.id] = ''; return acc; }, {});
    setEditingItem({
      image: '',
      title: { ...emptyLocalized },
      ingredients: { ...emptyLocalized },
      price: '',
      category: selectedCategory || menuData?.categories?.[0]?.id || '',
      isNew: true,
    });
    setSelectedItem('');
    setHasUnsavedChanges(false);
    setMobileView('edit');
  };

  const editItem = () => {
    if (!selectedCategory || !selectedItem || !menuData) return;
    const category = menuData.categories.find((c) => c.id === selectedCategory);
    const item = category?.items.find((it) => it.id === selectedItem);
    if (item) {
      discardSessionUploads();
      setValidationErrors({});
      loadedImageRef.current = item.image || '';
      setEditingItem({
        id: item.id,
        image: item.image || '',
        title: normalizeLocalizedField(item.title),
        ingredients: normalizeLocalizedField(item.ingredients),
        price: stripDollar(item.price),
        categoryId: selectedCategory,
      });
      setHasUnsavedChanges(false);
    }
  };

  const saveItem = async () => {
    if (!editingItem) { showStatus('info', '편집 중인 항목이 없습니다.'); return; }
    const errors = validateItem(editingItem);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      showStatus('error', '필수 항목을 확인해주세요.');
      return;
    }
    setValidationErrors({});
    const payload = buildItemPayload(editingItem);
    const previousImage = loadedImageRef.current;
    if (editingItem.isNew) {
      const category = editingItem.category;
      const { ok, newId } = await addItemToServer(category, payload);
      if (!ok) return;
      // The uploaded image (if any) is now persisted; stop tracking it.
      uploadsRef.current = [];
      loadedImageRef.current = payload.image;
      // Stay in flow: keep the category and select the newly added item by id.
      if (newId) {
        setSelectedCategory(category);
        setSelectedItem(newId);
      }
    } else {
      const ok = await updateItemOnServer(editingItem.categoryId, editingItem.id, payload);
      if (!ok) return;
      // The image was replaced — delete the old persisted blob.
      if (previousImage && previousImage !== payload.image) {
        deleteImageBlob(previousImage);
      }
      uploadsRef.current = [];
      loadedImageRef.current = payload.image;
      // Selection is unchanged, so editingItem already reflects the saved values.
    }
    // Keep the category/item selected; just clear the dirty flag and, on mobile,
    // slide back to the list so the next item is one tap away.
    setHasUnsavedChanges(false);
    setMobileView('list');
  };

  const deleteItem = async () => {
    if (!selectedCategory || !selectedItem) return;
    if (!confirm('이 항목을 삭제하시겠습니까?')) return;
    discardSessionUploads();
    await deleteItemFromServer(selectedCategory, selectedItem);
    setSelectedItem('');
    setEditingItem(null);
    setValidationErrors({});
    setHasUnsavedChanges(false);
    setMobileView('list');
  };

  const cancelEdit = () => {
    discardSessionUploads();
    setEditingItem(null);
    setSelectedItem('');
    setValidationErrors({});
    setHasUnsavedChanges(false);
    setMobileView('list');
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!editingItem) { showStatus('info', '먼저 편집할 항목을 선택해주세요.'); return; }
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        // A previous unsaved upload (if any) is now superseded — delete it.
        discardSessionUploads();
        uploadsRef.current = [data.imageUrl];
        setEditingItem((prev) => ({ ...prev, image: data.imageUrl }));
        setHasUnsavedChanges(true);
        showStatus('success', '이미지 업로드 완료');
      } else {
        const err = await res.json();
        showStatus('error', `업로드 실패: ${err.error}`);
      }
    } catch {
      showStatus('error', '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {status && (
        <div className={`${styles.toast} ${styles[`toast${status.type}`]}`}>
          {status.message}
        </div>
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={menuData?.categories || []}
          patchMenu={patchMenu}
          refreshMenu={refreshMenu}
          showStatus={showStatus}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      <div className={`${styles.slideWrapper} ${mobileView === 'edit' ? styles.slideWrapperEdit : ''}`}>

        {/* ── LEFT PANEL: 목록 ── */}
        <div className={styles.leftPanel}>
          <div className={styles.mobileHeader}>
            <span className={styles.mobileHeaderTitle}>메뉴 관리</span>
            <button onClick={logout} className={styles.logoutButton}>로그아웃</button>
          </div>

          <div className={styles.header}>
            <h1 className={styles.title}>메뉴 관리</h1>
            <button onClick={logout} className={styles.logoutButton}>로그아웃</button>
          </div>

          <div className={styles.listContent}>
            <div className={styles.selectionGroup}>
              <div className={styles.dropdownGroup}>
                <div className={styles.dropdownLabelRow}>
                  <label className={styles.label}>카테고리</label>
                  <button
                    type="button"
                    className={styles.manageButton}
                    onClick={() => setShowCategoryManager(true)}
                  >
                    <i className="bi bi-gear" /> 관리
                  </button>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    discardSessionUploads();
                    setSelectedCategory(e.target.value);
                    setSelectedItem('');
                    setEditingItem(null);
                    setItemSearch('');
                    setValidationErrors({});
                    setHasUnsavedChanges(false);
                  }}
                  className={styles.select}
                >
                  <option value="">-- 카테고리 선택 --</option>
                  {menuData?.categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getLocalizedValue(cat.name, DEFAULT_LOCALE) || cat.id}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory ? (
                <div className={styles.itemListSection}>
                  <div className={styles.listHeader}>
                    <span className={styles.listTitle}>메뉴 항목</span>
                    <span className={styles.listCount}>{currentCategory?.items?.length || 0}개</span>
                  </div>
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    placeholder="이름 또는 가격 검색"
                    className={styles.searchInput}
                  />
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
                    <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                      <ul className={styles.itemList}>
                        {filteredItems.map((item) => (
                          <SortableRow
                            key={item.id}
                            id={item.id}
                            disabled={!!itemSearch.trim()}
                            className={styles.sortableItemRow}
                            handleClassName={styles.dragHandle}
                            handleLabel="항목 순서 변경"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedItem(item.id);
                                setHasUnsavedChanges(false);
                                setMobileView('edit');
                              }}
                              className={`${styles.itemButton} ${selectedItem === item.id ? styles.itemButtonActive : ''}`}
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
                          </SortableRow>
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                  {filteredItems.length === 0 && (
                    <div className={styles.emptyList}>항목이 없습니다.</div>
                  )}
                </div>
              ) : (
                <div className={styles.emptyList} style={{ marginTop: 12 }}>
                  카테고리를 선택하면 항목 목록이 표시됩니다.
                </div>
              )}
            </div>
          </div>

          <div className={styles.addButtonFixed}>
            <button onClick={addItem} className={styles.addButton}>
              + 새 항목 추가
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: 편집 ── */}
        <div className={styles.rightPanel}>
          <div className={styles.mobileHeader}>
            <button className={styles.backButton} onClick={cancelEdit}>
              ← 목록
            </button>
            <span className={styles.mobileHeaderTitle}>
              {hasUnsavedChanges && <span className={styles.dirtyDot} aria-label="저장되지 않음" />}
              {editingItem?.isNew
                ? '새 항목 추가'
                : (getLocalizedValue(editingItem?.title, DEFAULT_LOCALE) || '항목 편집')}
            </span>
            {editingItem && !editingItem.isNew && (
              <button
                onClick={deleteItem}
                className={styles.deleteButton}
                disabled={pendingAction === 'delete'}
              >
                {pendingAction === 'delete' ? '...' : '삭제'}
              </button>
            )}
          </div>

          {editingItem ? (
            <div className={styles.editForm}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle} style={{ margin: 0 }}>
                  {editingItem.isNew
                    ? '새 항목 추가'
                    : (getLocalizedValue(editingItem.title, DEFAULT_LOCALE) || '항목 편집')}
                </h2>
                {hasUnsavedChanges && (
                  <span className={styles.dirtyBadge}>
                    <span className={styles.dirtyDot} />저장되지 않음
                  </span>
                )}
              </div>

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
                        {getLocalizedValue(cat.name, DEFAULT_LOCALE) || cat.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Image */}
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
                <div className={`${styles.priceInputWrapper} ${validationErrors.price ? styles.inputError : ''}`}>
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
                {validationErrors.price && <div className={styles.fieldError}>{validationErrors.price}</div>}
              </div>

              {/* Korean */}
              <div className={`${styles.localeSection} ${styles.localeSectionKo}`}>
                <div className={styles.localeSectionHeader}>🇰🇷 한국어</div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>메뉴 이름</label>
                  <input
                    type="text"
                    value={editingItem.title?.ko || ''}
                    onChange={(e) => updateEditingLocalizedField('title', 'ko', e.target.value)}
                    className={`${styles.input} ${validationErrors.title ? styles.inputError : ''}`}
                    placeholder="메뉴 이름 (한국어)"
                  />
                  {validationErrors.title && <div className={styles.fieldError}>{validationErrors.title}</div>}
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

              {/* English */}
              <div className={`${styles.localeSection} ${styles.localeSectionEn}`}>
                <div className={styles.localeSectionHeader}>🇺🇸 English</div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Menu Name</label>
                  <input
                    type="text"
                    value={editingItem.title?.en || ''}
                    onChange={(e) => updateEditingLocalizedField('title', 'en', e.target.value)}
                    className={`${styles.input} ${validationErrors.title ? styles.inputError : ''}`}
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

              {/* Desktop buttons */}
              <div className={styles.buttonGroup}>
                <button
                  onClick={saveItem}
                  className={styles.saveItemButton}
                  disabled={pendingAction === 'add' || pendingAction === 'update'}
                >
                  {pendingAction === 'add' || pendingAction === 'update' ? '저장 중...' : '저장'}
                </button>
                <button onClick={cancelEdit} className={styles.cancelButton}>취소</button>
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

              {/* Mobile sticky bottom */}
              <div className={styles.stickyBottomBar}>
                <button
                  onClick={saveItem}
                  className={styles.saveItemButton}
                  disabled={pendingAction === 'add' || pendingAction === 'update'}
                >
                  {pendingAction === 'add' || pendingAction === 'update' ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={cancelEdit}
                  className={styles.cancelButton}
                  style={{ flex: 'none', padding: '12px 18px' }}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>항목을 선택하세요</h3>
              <p>목록에서 항목을 선택하거나 새 항목을 추가하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
