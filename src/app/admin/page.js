'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

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
  const [menuData, setMenuData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // API 요청을 위한 헤더 생성 함수
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  useEffect(() => {
    // 로그인된 경우에만 메뉴 데이터 로딩
    if (isLoggedIn && token) {
      fetch('/api/menu', {
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          setMenuData(data);
          setDataLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching menu data:', error);
          setDataLoading(false);
        });
    } else {
      setDataLoading(false);
    }
  }, [isLoggedIn, token]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(menuData),
      });
      if (response.ok) {
        alert('메뉴 데이터가 성공적으로 저장되었습니다!');
        setSelectedCategory('');
        setSelectedItem('');
        setEditingItem(null);
      } else {
        alert('메뉴 데이터 저장에 실패했습니다.');
      }
    } catch (error) {
      alert('메뉴 데이터 저장에 실패했습니다.');
    }
    setSaving(false);
  };

  const addItemToServer = async (itemData) => {
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
          data: newItem,
        }),
      });

      if (response.ok) {
        // 성공 시 서버에서 최신 데이터 가져와서 동기화
        const res = await fetch('/api/menu', { headers: getAuthHeaders() });
        const data = await res.json();
        setMenuData(data);
        alert('항목이 성공적으로 추가되었습니다!');
      } else {
        // 실패 시 로컬 상태 롤백
        const res = await fetch('/api/menu', { headers: getAuthHeaders() });
        const data = await res.json();
        setMenuData(data);
        alert('항목 추가에 실패했습니다.');
      }
    } catch (error) {
      // 에러 시 로컬 상태 롤백
      const res = await fetch('/api/menu', { headers: getAuthHeaders() });
      const data = await res.json();
      setMenuData(data);
      alert('항목 추가에 실패했습니다.');
    }
  };

  const updateItemOnServer = async (categoryId, itemIndex, itemData) => {
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
      console.log('Sending PATCH request:', { action: 'update', categoryId, itemIndex, data: itemData });
      const response = await fetch('/api/menu', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'update',
          categoryId,
          itemIndex,
          data: itemData,
        }),
      });
      console.log('PATCH response status:', response.status);
      if (response.ok) {
        // 성공 시 서버에서 최신 데이터 가져와서 동기화
        const res = await fetch('/api/menu', { headers: getAuthHeaders() });
        const data = await res.json();
        console.log('Refreshed menu data:', data);
        setMenuData(data);
        alert('항목이 성공적으로 수정되었습니다!');
      } else {
        // 실패 시 로컬 상태 롤백
        const res = await fetch('/api/menu', { headers: getAuthHeaders() });
        const data = await res.json();
        setMenuData(data);
        alert('항목 수정에 실패했습니다.');
      }
    } catch (error) {
      // 에러 시 로컬 상태 롤백
      const res = await fetch('/api/menu', { headers: getAuthHeaders() });
      const data = await res.json();
      setMenuData(data);
      alert('항목 수정에 실패했습니다.');
    }
  };

  const deleteItemFromServer = async (categoryId, itemIndex) => {
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
        const res = await fetch('/api/menu', { headers: getAuthHeaders() });
        const data = await res.json();
        setMenuData(data);
        alert('항목이 성공적으로 삭제되었습니다!');
      } else {
        // 실패 시 로컬 상태 롤백
        const res = await fetch('/api/menu', { headers: getAuthHeaders() });
        const data = await res.json();
        setMenuData(data);
        alert('항목 삭제에 실패했습니다.');
      }
    } catch (error) {
      // 에러 시 로컬 상태 롤백
      const res = await fetch('/api/menu', { headers: getAuthHeaders() });
      const data = await res.json();
      setMenuData(data);
      alert('항목 삭제에 실패했습니다.');
    }
  };

  const addItem = () => {
    if (!selectedCategory) {
      alert('먼저 카테고리를 선택해주세요.');
      return;
    }
    const newItem = {
      image: '',
      title: '',
      ingredients: '',
      price: '',
      category: selectedCategory,
    };
    setEditingItem({ ...newItem, isNew: true });
    setSelectedItem('');
  };

  const editItem = () => {
    if (!selectedCategory || selectedItem === '' || !menuData) return;
    
    const catIndex = menuData.categories.findIndex(cat => cat.id === selectedCategory);
    const itemIndex = parseInt(selectedItem);
    
    if (catIndex >= 0 && itemIndex >= 0) {
      const item = menuData.categories[catIndex].items[itemIndex];
      setEditingItem({ ...item, catIndex, itemIndex });
    }
  };

  const saveItem = async () => {
    console.log('saveItem called, editingItem:', editingItem);
    if (!editingItem) {
      console.error('editingItem is null');
      alert('편집 중인 항목이 없습니다.');
      return;
    }
    if (editingItem.isNew) {
      await addItemToServer(editingItem);
    } else {
      // 저장 시점에 인덱스를 다시 계산 (안전하게)
      const categoryId = menuData.categories[editingItem.catIndex]?.id;
      if (!categoryId) {
        console.error('Invalid category index:', editingItem.catIndex);
        alert('카테고리를 찾을 수 없습니다.');
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
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!editingItem) {
        alert('먼저 편집할 메뉴 항목을 선택해주세요.');
        return;
      }
      try {
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
        } else {
          const errorData = await response.json();
          alert(`이미지 업로드 실패: ${errorData.error}`);
        }
      } catch (error) {
        alert('이미지 업로드 중 오류가 발생했습니다.');
      }
    }
  };

  if (dataLoading) {
    return <div className={styles.container}>Loading menu data...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
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
                setSelectedCategory(e.target.value);
                setSelectedItem('');
                setEditingItem(null);
              }}
              className={styles.select}
            >
              <option value="">-- 카테고리를 선택하세요 --</option>
              {menuData?.categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )) || []}
            </select>
          </div>
          
          {selectedCategory && (
            <div className={styles.dropdownGroup}>
              <label className={styles.label}>메뉴 항목 선택:</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className={styles.select}
              >
                <option value="">-- 항목을 선택하세요 --</option>
                {menuData.categories
                  .find(cat => cat.id === selectedCategory)
                  ?.items.map((item, itemIndex) => (
                    <option key={itemIndex} value={itemIndex}>
                      {item.title || '제목 없음'}
                    </option>
                  ))}
              </select>
            </div>
          )}
          
          {selectedCategory && selectedItem !== '' && (
            <div className={styles.actionButtons}>
              <button
                onClick={deleteItem}
                className={styles.deleteButton}
              >
                선택된 항목 삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightPanel}>
        {editingItem && (
          <div className={styles.editForm}>
            <h2 className={styles.formTitle}>{editingItem.isNew ? '새 항목 추가' : '항목 편집'}</h2>
            {editingItem.isNew && (
              <div className={styles.formGroup}>
                <label className={styles.label}>카테고리: </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className={styles.select}
                >
                  {menuData?.categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  )) || []}
                </select>
              </div>
            )}
            <div className={styles.formGroup}>
              <label className={styles.label}>제목: </label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
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
              />
              {editingItem.image && <img src={editingItem.image} alt="미리보기" className={styles.previewImage} />}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>재료: </label>
              <textarea
                value={editingItem.ingredients}
                onChange={(e) => setEditingItem({ ...editingItem, ingredients: e.target.value })}
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>가격: </label>
              <input
                type="text"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={saveItem}
                className={styles.saveItemButton}
              >
                항목 저장
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className={styles.cancelButton}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}