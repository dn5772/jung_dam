'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

const DEFAULT_LOCALE = 'ko';
const DISPLAY_LOCALE = 'ko';
const SUPPORTED_LOCALES = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
];

const normalizeLocalizedField = (value) => {
  if (!value) return { [DEFAULT_LOCALE]: '' };
  if (typeof value === 'string') return { [DEFAULT_LOCALE]: value };
  if (typeof value === 'object') return value;
  return { [DEFAULT_LOCALE]: '' };
};

const normalizeMenuData = (data) => {
  if (!data || !Array.isArray(data.categories)) {
    return { categories: [] };
  }

  return {
    ...data,
    categories: data.categories.map((category) => ({
      ...category,
      items: Array.isArray(category.items)
        ? category.items.map((item) => ({
            ...item,
            title: normalizeLocalizedField(item.title),
            ingredients: normalizeLocalizedField(item.ingredients),
          }))
        : [],
    })),
  };
};

const mergeLocalizedMenuData = (enData, koData) => {
  const enCategories = enData?.categories || [];
  const koCategories = koData?.categories || [];
  const koById = new Map(koCategories.map((category) => [category.id, category]));
  const enById = new Map(enCategories.map((category) => [category.id, category]));
  const baseCategories = enCategories.length ? enCategories : koCategories;

  const mergedCategories = baseCategories.map((baseCategory) => {
    const enCategory = enById.get(baseCategory.id) || {};
    const koCategory = koById.get(baseCategory.id) || {};
    const enItems = enCategory.items || [];
    const koItems = koCategory.items || [];
    const maxItems = Math.max(enItems.length, koItems.length);

    return {
      id: baseCategory.id,
      name: {
        en: enCategory.name || '',
        ko: koCategory.name || '',
      },
      description: {
        en: enCategory.description || '',
        ko: koCategory.description || '',
      },
      items: Array.from({ length: maxItems }).map((_, index) => {
        const enItem = enItems[index] || {};
        const koItem = koItems[index] || {};
        return {
          image: enItem.image || koItem.image || '',
          title: {
            en: enItem.title || '',
            ko: koItem.title || '',
          },
          ingredients: {
            en: enItem.ingredients || '',
            ko: koItem.ingredients || '',
          },
          price: enItem.price || koItem.price || '',
        };
      }),
    };
  });

  return normalizeMenuData({ categories: mergedCategories });
};

const getLocalizedValue = (value, locale) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return (
      value[locale] ||
      value[DEFAULT_LOCALE] ||
      Object.values(value).find((entry) => entry) ||
      ''
    );
  }
  return '';
};

// 간단한 인증 상태 관리
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      // 토큰 유효성 간단 검증 (실제로는 서버에 검증 요청)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setToken(storedToken);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error, details: errorData.details };
      }
    } catch (error) {
      return { success: false, error: '네트워크 오류', details: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, isLoading, login, logout, token };
};

// 로그인 컴포넌트
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

    if (result.success) {
      setError('');
    } else {
      setError(result.error + (result.details ? ` (${result.details})` : ''));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>관리자 로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="관리자 비밀번호 입력"
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

export default function AdminPage() {
  const { isLoggedIn, isLoading, login, logout, token } = useAuth();

  // 모든 훅을 최상위 레벨에서 호출 (로그인 상태와 관계없이)
  const [menuData, setMenuData] = useState({ categories: [] });
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [activeLocale, setActiveLocale] = useState(DEFAULT_LOCALE);
  const [status, setStatus] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const statusTimeoutRef = useRef(null);

  // API 요청을 위한 헤더 생성 함수
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const fetchLocalizedMenuData = async () => {
    const [enResponse, koResponse] = await Promise.all([
      fetch('/api/menu?locale=en', { headers: getAuthHeaders() }),
      fetch('/api/menu?locale=ko', { headers: getAuthHeaders() }),
    ]);

    const [enData, koData] = await Promise.all([
      enResponse.json(),
      koResponse.json(),
    ]);

    return mergeLocalizedMenuData(enData, koData);
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  const confirmDiscardChanges = () => {
    if (!hasUnsavedChanges) return true;
    return confirm('변경사항이 저장되지 않았습니다. 이동하면 변경사항이 사라집니다. 계속할까요?');
  };

  const updateEditingField = (field, value) => {
    setEditingItem((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const updateEditingLocalizedField = (field, locale, value) => {
    setEditingItem((prev) => ({
      ...prev,
      [field]: {
        ...normalizeLocalizedField(prev?.[field]),
        [locale]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    // 로그인된 경우에만 메뉴 데이터 로딩
    if (isLoggedIn && token) {
      fetchLocalizedMenuData()
        .then((data) => {
          setMenuData(data);
          setDataLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching menu data:', error);
          showStatus('error', '메뉴 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
          setDataLoading(false);
        });
    } else {
      setDataLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => () => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedItem !== '' && menuData) {
      editItem();
    } else {
      setEditingItem(null);
    }
  }, [selectedCategory, selectedItem, menuData]);

  if (isLoading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={login} />;
  }

  if (dataLoading) {
    return <div className={styles.container}>메뉴 데이터 로딩 중...</div>;
  }

  const currentCategory = menuData?.categories?.find((cat) => cat.id === selectedCategory);
  const filteredItems = currentCategory?.items
    ?.map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const query = itemSearch.trim().toLowerCase();
      if (!query) return true;
      const localizedTitle = getLocalizedValue(item.title, DISPLAY_LOCALE).toLowerCase();
      const allTitles = typeof item.title === 'object' ? Object.values(item.title).join(' ').toLowerCase() : '';
      const price = (item.price || '').toLowerCase();
      return `${localizedTitle} ${allTitles} ${price}`.includes(query);
    }) || [];

  const convertToLocaleSpecific = (data) => ({
    en: {
      categories: data.categories.map((category) => ({
        id: category.id,
        name: getLocalizedValue(category.name, 'en'),
        description: getLocalizedValue(category.description, 'en'),
        items: category.items.map((item) => ({
          image: item.image,
          title: getLocalizedValue(item.title, 'en'),
          ingredients: getLocalizedValue(item.ingredients, 'en'),
          price: item.price,
        })),
      })),
    },
    ko: {
      categories: data.categories.map((category) => ({
        id: category.id,
        name: getLocalizedValue(category.name, 'ko'),
        description: getLocalizedValue(category.description, 'ko'),
        items: category.items.map((item) => ({
          image: item.image,
          title: getLocalizedValue(item.title, 'ko'),
          ingredients: getLocalizedValue(item.ingredients, 'ko'),
          price: item.price,
        })),
      })),
    },
  });

  const buildLocalizedItemPayload = (item) => ({
    en: {
      image: item.image,
      title: getLocalizedValue(item.title, 'en'),
      ingredients: getLocalizedValue(item.ingredients, 'en'),
      price: item.price,
    },
    ko: {
      image: item.image,
      title: getLocalizedValue(item.title, 'ko'),
      ingredients: getLocalizedValue(item.ingredients, 'ko'),
      price: item.price,
    },
  });

  const handleSave = async () => {
    setSaving(true);
    setPendingAction('saveAll');
    try {
      const localeData = convertToLocaleSpecific(menuData);
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(localeData),
      });
      if (response.ok) {
        showStatus('success', '메뉴 데이터가 성공적으로 저장되었습니다.');
        setSelectedCategory('');
        setSelectedItem('');
        setEditingItem(null);
        setHasUnsavedChanges(false);
      } else {
        showStatus('error', '메뉴 데이터 저장에 실패했습니다.');
      }
    } catch (error) {
      showStatus('error', '메뉴 데이터 저장에 실패했습니다.');
    }
    setSaving(false);
    setPendingAction(null);
  };

  const addItemToServer = async (itemData) => {
    setPendingAction('add');
    // 낙관적 업데이트: 먼저 로컬 상태 업데이트
    const newItem = {
      image: itemData.image,
      title: itemData.title,
      ingredients: itemData.ingredients,
      price: itemData.price,
    };

    const updatedMenuData = { ...menuData };
    const categoryIndex = updatedMenuData.categories.findIndex(cat => cat.id === itemData.category);
    if (categoryIndex >= 0) {
      updatedMenuData.categories[categoryIndex].items.push(newItem);
      setMenuData(updatedMenuData);
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'add',
          categoryId: itemData.category,
          data: buildLocalizedItemPayload(newItem),
        }),
      });

      if (response.ok) {
        // 성공 시 서버에서 최신 데이터 가져와서 동기화
        const data = await fetchLocalizedMenuData();
        setMenuData(data);
        showStatus('success', '항목이 성공적으로 추가되었습니다.');
      } else {
        // 실패 시 로컬 상태 롤백
        const data = await fetchLocalizedMenuData();
        setMenuData(data);
        showStatus('error', '항목 추가에 실패했습니다.');
      }
    } catch (error) {
      // 에러 시 로컬 상태 롤백
      const data = await fetchLocalizedMenuData();
      setMenuData(data);
      showStatus('error', '항목 추가에 실패했습니다.');
    }
    setPendingAction(null);
  };

  const updateItemOnServer = async (categoryId, itemIndex, itemData) => {
    setPendingAction('update');
    // 낙관적 업데이트: 먼저 로컬 상태 업데이트
    const updatedMenuData = { ...menuData };
    const categoryIndex = updatedMenuData.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex >= 0 && itemIndex >= 0) {
      updatedMenuData.categories[categoryIndex].items[itemIndex] = {
        ...updatedMenuData.categories[categoryIndex].items[itemIndex],
        ...itemData
      };
      setMenuData(updatedMenuData);
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'update',
          categoryId,
          itemIndex,
          data: buildLocalizedItemPayload(itemData),
        }),
      });
      if (response.ok) {
        // 성공 시 서버에서 최신 데이터 가져와서 동기화
        const data = await fetchLocalizedMenuData();
        setMenuData(data);
        showStatus('success', '항목이 성공적으로 수정되었습니다.');
      } else {
        // 실패 시 로컬 상태 롤백
        const data = await fetchLocalizedMenuData();
        setMenuData(data);
        showStatus('error', '항목 수정에 실패했습니다.');
      }
    } catch (error) {
      // 에러 시 로컬 상태 롤백
      const data = await fetchLocalizedMenuData();
      setMenuData(data);
      showStatus('error', '항목 수정에 실패했습니다.');
    }
    setPendingAction(null);
  };

  const deleteItemFromServer = async (categoryId, itemIndex) => {
    setPendingAction('delete');
    // 낙관적 업데이트: 먼저 로컬 상태 업데이트
    const updatedMenuData = { ...menuData };
    const categoryIndex = updatedMenuData.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex >= 0 && itemIndex >= 0) {
      updatedMenuData.categories[categoryIndex].items.splice(itemIndex, 1);
      setMenuData(updatedMenuData);
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'delete',
          categoryId,
          itemIndex,
        }),
      });
      if (response.ok) {
        // 성공 시 서버에서 최신 데이터 가져와서 동기화
        const data = await fetchLocalizedMenuData();
        setMenuData(data);
        showStatus('success', '항목이 성공적으로 삭제되었습니다.');
      } else {
        // 실패 시 로컬 상태 롤백
        const data = await fetchLocalizedMenuData();
        setMenuData(data);
        showStatus('error', '항목 삭제에 실패했습니다.');
      }
    } catch (error) {
      // 에러 시 로컬 상태 롤백
      const data = await fetchLocalizedMenuData();
      setMenuData(data);
      showStatus('error', '항목 삭제에 실패했습니다.');
    }
    setPendingAction(null);
  };

  const addItem = () => {
    if (!confirmDiscardChanges()) return;
    if (!selectedCategory) {
      showStatus('info', '먼저 카테고리를 선택해주세요.');
      return;
    }
    const localizedEmpty = SUPPORTED_LOCALES.reduce((acc, locale) => {
      acc[locale.id] = '';
      return acc;
    }, {});
    const newItem = {
      image: '',
      title: localizedEmpty,
      ingredients: localizedEmpty,
      price: '',
      category: selectedCategory,
    };
    setEditingItem({ ...newItem, isNew: true });
    setSelectedItem('');
    setHasUnsavedChanges(false);
  };

  const editItem = () => {
    if (!selectedCategory || selectedItem === '' || !menuData) return;
    
    const catIndex = menuData.categories.findIndex(cat => cat.id === selectedCategory);
    const itemIndex = parseInt(selectedItem);
    
    if (catIndex >= 0 && itemIndex >= 0) {
      const item = menuData.categories[catIndex].items[itemIndex];
      setEditingItem({
        ...item,
        title: normalizeLocalizedField(item.title),
        ingredients: normalizeLocalizedField(item.ingredients),
        catIndex,
        itemIndex,
      });
      setHasUnsavedChanges(false);
    }
  };

  const saveItem = async () => {
    console.log('saveItem called, editingItem:', editingItem);
    if (!editingItem) {
      console.error('editingItem is null');
      showStatus('info', '편집 중인 항목이 없습니다.');
      return;
    }
    if (editingItem.isNew) {
      await addItemToServer(editingItem);
    } else {
      // 저장 시점에 인덱스를 다시 계산 (안전하게)
      const categoryId = menuData.categories[editingItem.catIndex]?.id;
      if (!categoryId) {
        console.error('Invalid category index:', editingItem.catIndex);
        showStatus('error', '카테고리를 찾을 수 없습니다.');
        return;
      }
      
      const itemIndex = editingItem.itemIndex;
      const itemData = {
        image: editingItem.image,
        title: editingItem.title,
        ingredients: editingItem.ingredients,
        price: editingItem.price,
      };
      console.log('Updating item:', { categoryId, itemIndex, itemData });
      await updateItemOnServer(categoryId, itemIndex, itemData);
    }
    setEditingItem(null);
    setSelectedCategory('');
    setSelectedItem('');
    setHasUnsavedChanges(false);
  };

  const deleteItem = async () => {
    if (!selectedCategory || selectedItem === '') return;
    
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      const catIndex = menuData.categories.findIndex(cat => cat.id === selectedCategory);
      const itemIndex = parseInt(selectedItem);
      
      if (catIndex >= 0 && itemIndex >= 0) {
        await deleteItemFromServer(selectedCategory, itemIndex);
        setSelectedItem('');
        setEditingItem(null);
        setHasUnsavedChanges(false);
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!editingItem) {
        showStatus('info', '먼저 편집할 메뉴 항목을 선택해주세요.');
        return;
      }
      try {
        setImageUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Image uploaded successfully:', data.imageUrl);
          setEditingItem({ ...editingItem, image: data.imageUrl });
          setHasUnsavedChanges(true);
          showStatus('success', '이미지 업로드가 완료되었습니다.');
        } else {
          const errorData = await response.json();
          showStatus('error', `이미지 업로드 실패: ${errorData.error}`);
        }
      } catch (error) {
        showStatus('error', '이미지 업로드 중 오류가 발생했습니다.');
      } finally {
        setImageUploading(false);
      }
    }
  };

  if (dataLoading) {
    return <div className={styles.container}>Loading menu data...</div>;
  }

  return (
    <div className={styles.container}>
      {status && (
        <div className={`${styles.statusMessage} ${styles[`status${status.type}`]}`}>
          {status.message}
        </div>
      )}
      <button 
        className={styles.mobileMenuToggle}
        onClick={() => setPanelVisible(!panelVisible)}
      >
        <i className={`bi ${panelVisible ? 'bi-x-lg' : 'bi-list'}`}></i>
        <span>{panelVisible ? '닫기' : '메뉴 선택'}</span>
      </button>
      <div className={`${styles.leftPanel} ${panelVisible ? styles.leftPanelVisible : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>메뉴 관리</h1>
          <button
            onClick={logout}
            className={styles.logoutButton}
          >
            로그아웃
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? '저장 중...' : '모든 변경사항 저장'}
        </button>
        <button
          onClick={addItem}
          className={styles.addButton}
        >
          새 항목 추가
        </button>
        
        <div className={styles.selectionGroup}>
          <div className={styles.dropdownGroup}>
            <label className={styles.label}>카테고리 선택:</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                if (!confirmDiscardChanges()) return;
                setSelectedCategory(e.target.value);
                setSelectedItem('');
                setEditingItem(null);
                setItemSearch('');
                setHasUnsavedChanges(false);
              }}
              className={styles.select}
            >
              <option value="">-- 카테고리를 선택하세요 --</option>
              {menuData?.categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {getLocalizedValue(category.name, DISPLAY_LOCALE) || category.name}
                </option>
              )) || []}
            </select>
          </div>

          {selectedCategory ? (
            <div className={styles.itemListSection}>
              <div className={styles.listHeader}>
                <div className={styles.listTitle}>메뉴 항목</div>
                <div className={styles.listCount}>{currentCategory?.items?.length || 0}개</div>
              </div>
              <input
                type="text"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                placeholder="이름 또는 가격 검색"
                className={styles.searchInput}
              />
              <ul className={styles.itemList}>
                {filteredItems.map(({ item, index }) => (
                  <li key={`${index}-${item.image || 'item'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirmDiscardChanges()) return;
                        setSelectedItem(String(index));
                        setHasUnsavedChanges(false);
                        setPanelVisible(false);
                      }}
                      className={`${styles.itemButton} ${selectedItem === String(index) ? styles.itemButtonActive : ''}`}
                    >
                      <div className={styles.itemTitle}>{getLocalizedValue(item.title, DISPLAY_LOCALE) || '제목 없음'}</div>
                      <div className={styles.itemMeta}>{item.price || '가격 미입력'}</div>
                    </button>
                  </li>
                ))}
              </ul>
              {filteredItems.length === 0 && (
                <div className={styles.emptyList}>해당 조건의 항목이 없습니다.</div>
              )}
            </div>
          ) : (
            <div className={styles.emptyList}>카테고리를 선택하면 항목 목록이 표시됩니다.</div>
          )}
        </div>
      </div>
      <div className={styles.rightPanel}>
        {editingItem && (
          <div className={styles.editForm}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>{editingItem.isNew ? '새 항목 추가' : '항목 편집'}</h2>
              {!editingItem.isNew && (
                <button
                  type="button"
                  onClick={deleteItem}
                  className={styles.deleteButton}
                  disabled={pendingAction === 'delete'}
                >
                  {pendingAction === 'delete' ? '삭제 중...' : '항목 삭제'}
                </button>
              )}
            </div>
            {editingItem.isNew && (
              <div className={styles.formGroup}>
                <label className={styles.label}>카테고리: </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => updateEditingField('category', e.target.value)}
                  className={styles.select}
                >
                  {menuData?.categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getLocalizedValue(cat.name, DISPLAY_LOCALE) || cat.name}
                    </option>
                  )) || []}
                </select>
              </div>
            )}
            <div className={styles.formGroup}>
              <label className={styles.label}>언어 선택:</label>
              <div className={styles.localeTabs}>
                {SUPPORTED_LOCALES.map((locale) => (
                  <button
                    key={locale.id}
                    type="button"
                    onClick={() => setActiveLocale(locale.id)}
                    className={`${styles.localeTab} ${activeLocale === locale.id ? styles.localeTabActive : ''}`}
                  >
                    {locale.label}
                  </button>
                ))}
              </div>
              <div className={styles.localeHint}>현재 입력 언어: {SUPPORTED_LOCALES.find((loc) => loc.id === activeLocale)?.label}</div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>제목: </label>
              <input
                type="text"
                value={editingItem.title?.[activeLocale] || ''}
                onChange={(e) => updateEditingLocalizedField('title', activeLocale, e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>이미지: </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.input}
                disabled={imageUploading}
              />
              {imageUploading && <div className={styles.uploadingHint}>이미지 업로드 중...</div>}
              {editingItem.image && <img src={editingItem.image} alt="미리보기" className={styles.previewImage} />}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>재료: </label>
              <textarea
                value={editingItem.ingredients?.[activeLocale] || ''}
                onChange={(e) => updateEditingLocalizedField('ingredients', activeLocale, e.target.value)}
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>가격: </label>
              <input
                type="text"
                value={editingItem.price || ''}
                onChange={(e) => updateEditingField('price', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={saveItem}
                className={styles.saveItemButton}
                disabled={pendingAction === 'add' || pendingAction === 'update'}
              >
                {pendingAction === 'add' || pendingAction === 'update' ? '저장 중...' : '항목 저장'}
              </button>
              <button
                onClick={() => {
                  if (!confirmDiscardChanges()) return;
                  setEditingItem(null);
                  setSelectedItem('');
                  setHasUnsavedChanges(false);
                }}
                className={styles.cancelButton}
              >
                취소
              </button>
            </div>
          </div>
        )}
        {!editingItem && (
          <div className={styles.emptyState}>
            <h3>편집할 항목을 선택하세요</h3>
            <p>왼쪽에서 카테고리를 선택한 뒤 항목을 선택하거나 새 항목을 추가하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}