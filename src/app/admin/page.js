'use client';

import { useState, useEffect, useRef } from 'react';
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

  const statusTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const updateEditingField = (field, value) => {
    setEditingItem((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateEditingLocalizedField = (field, locale, value) => {
    setEditingItem((prev) => ({
      ...prev,
      [field]: { ...normalizeLocalizedField(prev?.[field]), [locale]: value },
    }));
    setHasUnsavedChanges(true);
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
    try {
      const { ok, json } = await patchMenu({ action: 'update', categoryId, itemId, data: payload });
      await refreshMenu();
      if (ok) showStatus('success', '항목이 수정되었습니다.');
      else showStatus('error', json.error || '항목 수정에 실패했습니다.');
    } catch {
      showStatus('error', '항목 수정에 실패했습니다.');
    }
    setPendingAction(null);
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

  const addItem = () => {
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
    const payload = buildItemPayload(editingItem);
    if (editingItem.isNew) {
      const category = editingItem.category;
      const { ok, newId } = await addItemToServer(category, payload);
      // Stay in flow: keep the category and select the newly added item by id.
      if (ok && newId) {
        setSelectedCategory(category);
        setSelectedItem(newId);
      }
    } else {
      await updateItemOnServer(editingItem.categoryId, editingItem.id, payload);
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
    await deleteItemFromServer(selectedCategory, selectedItem);
    setSelectedItem('');
    setEditingItem(null);
    setHasUnsavedChanges(false);
    setMobileView('list');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setSelectedItem('');
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
                <label className={styles.label}>카테고리</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedItem('');
                    setEditingItem(null);
                    setItemSearch('');
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
                  <ul className={styles.itemList}>
                    {filteredItems.map((item) => (
                      <li key={item.id}>
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
                      </li>
                    ))}
                  </ul>
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

              {/* Korean */}
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

              {/* English */}
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
