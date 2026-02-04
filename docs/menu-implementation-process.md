# 메뉴 다국어 시스템 구현 프로세스

## 개요
Vercel Blob에 영어/한글 메뉴를 별도 파일로 저장하고, 관리자가 두 언어를 동시에 관리할 수 있는 시스템을 구현합니다.

**참고 문서:** [menu-localization.md](./menu-localization.md)

---

## Phase 1: 데이터 준비 및 마이그레이션
**목표:** 기존 데이터를 로케일별 파일로 분리  
**예상 시간:** 2-3시간

### 1.1 현재 데이터 백업
- [ ] Vercel Blob에서 기존 `menuData-en.json` 다운로드
- [ ] 로컬에 백업 저장 (`backup/menuData-en-backup-YYYYMMDD.json`)

### 1.2 한글 버전 생성
- [ ] `menuData-ko.json` 파일 생성
- [ ] 영어 버전을 복사해서 기본 구조 유지
- [ ] 한글 번역 입력
  - `name`: 카테고리 이름
  - `description`: 카테고리 설명
  - `title`: 메뉴 제목
  - `ingredients`: 재료 설명
- [ ] `price`는 동일하게 유지 (공통 필드)
- [ ] `image` URL은 동일하게 유지 (공통 필드)

### 1.3 데이터 검증
검증 스크립트 작성 (`scripts/menu/validate-menu-data.js`):
- [ ] 두 파일의 `categoryId`가 동일한지 확인
- [ ] 각 카테고리의 `items` 개수가 동일한지 확인
- [ ] `itemIndex` 순서가 일치하는지 확인
- [ ] `image` URL이 모두 동일한지 확인
- [ ] 필수 필드 누락 검사
- [ ] JSON 문법 오류 검사

**검증 스크립트 예시:**
```javascript
const fs = require('fs');

const enData = JSON.parse(fs.readFileSync('./menuData-en.json', 'utf8'));
const koData = JSON.parse(fs.readFileSync('./menuData-ko.json', 'utf8'));

// 카테고리 수 확인
console.assert(enData.categories.length === koData.categories.length, 
  'Category count mismatch');

// 각 카테고리 검증
enData.categories.forEach((enCat, idx) => {
  const koCat = koData.categories[idx];
  console.assert(enCat.id === koCat.id, 
    `Category ID mismatch at index ${idx}`);
  console.assert(enCat.items.length === koCat.items.length, 
    `Item count mismatch in category ${enCat.id}`);
  
  // 각 항목 검증
  enCat.items.forEach((enItem, itemIdx) => {
    const koItem = koCat.items[itemIdx];
    console.assert(enItem.image === koItem.image, 
      `Image mismatch at ${enCat.id}[${itemIdx}]`);
    console.assert(enItem.price === koItem.price, 
      `Price mismatch at ${enCat.id}[${itemIdx}]`);
  });
});

console.log('✅ Validation complete!');
```

### 1.4 Blob에 업로드
- [ ] Vercel CLI 설치 확인: `npm i -g vercel`
- [ ] 환경 변수 확인: `BLOB_READ_WRITE_TOKEN`
- [ ] `menuData-en.json` 업로드
- [ ] `menuData-ko.json` 업로드
- [ ] 업로드 성공 확인 (Vercel Dashboard)

**업로드 스크립트 예시:**
```javascript
import { put } from '@vercel/blob';

const enData = fs.readFileSync('./menuData-en.json', 'utf8');
const koData = fs.readFileSync('./menuData-ko.json', 'utf8');

await put('menuData-en.json', enData, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN
});

await put('menuData-ko.json', koData, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN
});
```

---

## Phase 2: API 수정
**목표:** 로케일별 파일을 처리하는 API 구현  
**예상 시간:** 4-6시간

### 2.1 GET /api/menu 수정
파일: `src/app/api/menu/route.js`

**변경사항:**
- [ ] locale 쿼리 파라미터 처리 추가
- [ ] 파일명 동적 생성: `menuData-{locale}.json`
- [ ] 기본값 설정: `locale = 'en'`
- [ ] 유효하지 않은 locale 처리
- [ ] 에러 처리 (파일 없을 경우 빈 데이터 반환)

**구현 예시:**
```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  // locale 검증
  const validLocales = ['en', 'ko'];
  const safeLocale = validLocales.includes(locale) ? locale : 'en';
  
  const fileName = `menuData-${safeLocale}.json`;
  
  try {
    const { blobs } = await list({ token: BLOB_TOKEN });
    const menuBlob = blobs.find(blob => blob.pathname === fileName);
    
    if (menuBlob) {
      const response = await fetch(menuBlob.url);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        },
      });
    }
    
    return new Response(JSON.stringify({ categories: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

**테스트:**
- [ ] `GET /api/menu` (기본 영어)
- [ ] `GET /api/menu?locale=en`
- [ ] `GET /api/menu?locale=ko`
- [ ] `GET /api/menu?locale=invalid` (영어로 폴백)

### 2.2 POST /api/menu 수정
**변경사항:**
- [ ] 요청 본문에서 `en`/`ko` 구조 파싱
- [ ] 양쪽 파일 동시 저장
- [ ] 트랜잭션 처리 (하나 실패 시 둘 다 롤백)
- [ ] 기존 파일 삭제 후 새 파일 저장

**구현 예시:**
```javascript
export async function POST(request) {
  const user = verifyToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { en, ko } = await request.json();
    
    // 기존 파일 삭제
    const { blobs } = await list({ token: BLOB_TOKEN });
    const existingBlobs = blobs.filter(blob => 
      blob.pathname === 'menuData-en.json' || blob.pathname === 'menuData-ko.json'
    );
    
    for (const blob of existingBlobs) {
      await del(blob.url, { token: BLOB_TOKEN });
    }
    
    // 새 파일 저장
    await put('menuData-en.json', JSON.stringify(en, null, 2), {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: 'application/json',
    });
    
    await put('menuData-ko.json', JSON.stringify(ko, null, 2), {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: 'application/json',
    });
    
    return new Response(JSON.stringify({ message: 'Menu data updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to save menu data:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

**테스트:**
- [ ] 전체 메뉴 저장
- [ ] 양쪽 파일 정상 저장 확인
- [ ] 인증 실패 테스트
- [ ] 잘못된 데이터 형식 테스트

### 2.3 PATCH /api/menu 수정
**변경사항:**
- [ ] 양쪽 파일 로드
- [ ] action에 따라 변경사항 적용 (add/update/delete)
- [ ] 양쪽 파일 동시 저장
- [ ] 이미지 삭제 시 Blob에서 이미지도 삭제

**구현 예시:**
```javascript
export async function PATCH(request) {
  const user = verifyToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { action, categoryId, itemIndex, data } = await request.json();
    
    // 양쪽 파일 로드
    const enData = await loadMenuData('en');
    const koData = await loadMenuData('ko');
    
    if (action === 'add') {
      const enCatIdx = enData.categories.findIndex(cat => cat.id === categoryId);
      const koCatIdx = koData.categories.findIndex(cat => cat.id === categoryId);
      
      if (enCatIdx >= 0 && koCatIdx >= 0) {
        enData.categories[enCatIdx].items.push(data.en);
        koData.categories[koCatIdx].items.push(data.ko);
      }
    } else if (action === 'update') {
      const enCatIdx = enData.categories.findIndex(cat => cat.id === categoryId);
      const koCatIdx = koData.categories.findIndex(cat => cat.id === categoryId);
      
      if (enCatIdx >= 0 && koCatIdx >= 0 && itemIndex >= 0) {
        enData.categories[enCatIdx].items[itemIndex] = {
          ...enData.categories[enCatIdx].items[itemIndex],
          ...data.en
        };
        koData.categories[koCatIdx].items[itemIndex] = {
          ...koData.categories[koCatIdx].items[itemIndex],
          ...data.ko
        };
      }
    } else if (action === 'delete') {
      const enCatIdx = enData.categories.findIndex(cat => cat.id === categoryId);
      const koCatIdx = koData.categories.findIndex(cat => cat.id === categoryId);
      
      if (enCatIdx >= 0 && koCatIdx >= 0 && itemIndex >= 0) {
        const itemToDelete = enData.categories[enCatIdx].items[itemIndex];
        
        // 이미지 삭제
        if (itemToDelete.image && itemToDelete.image.startsWith('https://')) {
          try {
            await del(itemToDelete.image, { token: BLOB_TOKEN });
          } catch (error) {
            console.error('Failed to delete image:', error);
          }
        }
        
        enData.categories[enCatIdx].items.splice(itemIndex, 1);
        koData.categories[koCatIdx].items.splice(itemIndex, 1);
      }
    }
    
    // 양쪽 파일 저장
    await saveMenuData('en', enData);
    await saveMenuData('ko', koData);
    
    return new Response(JSON.stringify({ message: 'Menu data updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update menu data:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

**테스트:**
- [ ] 항목 추가 (양쪽 언어)
- [ ] 항목 수정 (양쪽 언어)
- [ ] 항목 삭제 (양쪽 파일에서 제거 확인)
- [ ] 이미지 삭제 확인

---

## Phase 3: 관리자 UI 수정
**목표:** 두 언어를 동시에 관리할 수 있는 UI 구현  
**예상 시간:** 6-8시간

### 3.1 상수 및 유틸리티 수정
파일: `src/app/admin/page.js`

**기존:**
```javascript
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = [
  { id: 'en', label: 'English' },
  { id: 'ko', label: '한국어' },
];
```

**변경**
기본을 언어를 한국어로 변경

### 3.2 데이터 정규화 함수 수정
현재는 다국어 객체 형태로 정규화하고 있지만, 실제로는 **저장할 때만** 양쪽 언어로 분리해야 합니다.

**변경사항:**
- [ ] `normalizeLocalizedField` 유지 (관리자 UI에서는 객체로 관리)
- [ ] `normalizeMenuData` 유지
- [ ] **저장 시 변환 함수** 추가

**새로운 함수 추가:**
```javascript
const convertToLocaleSpecific = (menuData) => {
  return {
    en: {
      categories: menuData.categories.map(cat => ({
        id: cat.id,
        name: getLocalizedValue(cat.name, 'en'),
        description: getLocalizedValue(cat.description, 'en'),
        items: cat.items.map(item => ({
          image: item.image,
          title: getLocalizedValue(item.title, 'en'),
          ingredients: getLocalizedValue(item.ingredients, 'en'),
          price: item.price,
        })),
      })),
    },
    ko: {
      categories: menuData.categories.map(cat => ({
        id: cat.id,
        name: getLocalizedValue(cat.name, 'ko'),
        description: getLocalizedValue(cat.description, 'ko'),
        items: cat.items.map(item => ({
          image: item.image,
          title: getLocalizedValue(item.title, 'ko'),
          ingredients: getLocalizedValue(item.ingredients, 'ko'),
          price: item.price,
        })),
      })),
    },
  };
};
```

### 3.3 저장 로직 수정

#### handleSave 수정
```javascript
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
```

#### addItemToServer 수정
```javascript
const addItemToServer = async (itemData) => {
  setPendingAction('add');
  
  const newItemData = {
    en: {
      image: itemData.image,
      title: getLocalizedValue(itemData.title, 'en'),
      ingredients: getLocalizedValue(itemData.ingredients, 'en'),
      price: itemData.price,
    },
    ko: {
      image: itemData.image,
      title: getLocalizedValue(itemData.title, 'ko'),
      ingredients: getLocalizedValue(itemData.ingredients, 'ko'),
      price: itemData.price,
    },
  };

  try {
    const response = await fetch('/api/menu', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'add',
        categoryId: itemData.category,
        data: newItemData,
      }),
    });

    if (response.ok) {
      const res = await fetch('/api/menu', { headers: getAuthHeaders() });
      const data = await res.json();
      setMenuData(normalizeMenuData(data));
      showStatus('success', '항목이 성공적으로 추가되었습니다.');
    } else {
      showStatus('error', '항목 추가에 실패했습니다.');
    }
  } catch (error) {
    showStatus('error', '항목 추가에 실패했습니다.');
  }
  setPendingAction(null);
};
```

#### updateItemOnServer 수정
```javascript
const updateItemOnServer = async (categoryId, itemIndex, itemData) => {
  setPendingAction('update');
  
  const updateData = {
    en: {
      ...(itemData.image !== undefined && { image: itemData.image }),
      ...(itemData.title !== undefined && { title: getLocalizedValue(itemData.title, 'en') }),
      ...(itemData.ingredients !== undefined && { ingredients: getLocalizedValue(itemData.ingredients, 'en') }),
      ...(itemData.price !== undefined && { price: itemData.price }),
    },
    ko: {
      ...(itemData.image !== undefined && { image: itemData.image }),
      ...(itemData.title !== undefined && { title: getLocalizedValue(itemData.title, 'ko') }),
      ...(itemData.ingredients !== undefined && { ingredients: getLocalizedValue(itemData.ingredients, 'ko') }),
      ...(itemData.price !== undefined && { price: itemData.price }),
    },
  };

  try {
    const response = await fetch('/api/menu', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'update',
        categoryId,
        itemIndex,
        data: updateData,
      }),
    });
    
    if (response.ok) {
      const res = await fetch('/api/menu', { headers: getAuthHeaders() });
      const data = await res.json();
      setMenuData(normalizeMenuData(data));
      showStatus('success', '항목이 성공적으로 수정되었습니다.');
    } else {
      showStatus('error', '항목 수정에 실패했습니다.');
    }
  } catch (error) {
    showStatus('error', '항목 수정에 실패했습니다.');
  }
  setPendingAction(null);
};
```

### 3.4 UI 테스트
- [ ] 언어 탭 전환 확인
- [ ] 영어 입력 후 한글 탭으로 전환, 영어 값 유지 확인
- [ ] 새 항목 추가 (양쪽 언어 입력)
- [ ] 기존 항목 수정 (양쪽 언어 수정)
- [ ] 저장 후 양쪽 파일 확인

---

## Phase 4: 프론트엔드 메뉴 표시 수정
**목표:** 사용자에게 브라우저 언어에 맞는 메뉴 표시  
**예상 시간:** 2-3시간

### 4.1 MenuSection 컴포넌트 수정
파일: `src/components/MenuSection.js`

**현재 상태 확인:**
- [ ] 이미 locale 감지 로직이 있는지 확인
- [ ] getLocalizedValue 함수가 있는지 확인

**수정 필요 사항:**
```javascript
export default function MenuSection() {
  const [menuData, setMenuData] = useState({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    // 브라우저 언어 감지
    const browserLocale = typeof navigator !== 'undefined' && navigator.language
      ? navigator.language.slice(0, 2)
      : 'en';
    const safeLocale = ['en', 'ko'].includes(browserLocale) ? browserLocale : 'en';
    setCurrentLocale(safeLocale);
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`/api/menu?locale=${currentLocale}`);
        if (response.ok) {
          const data = await response.json();
          setMenuData(data);
        }
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
        setMenuData({ categories: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [currentLocale]);

  // 나머지 코드는 그대로 유지
  // data.title, data.ingredients는 이제 문자열이므로 
  // getLocalizedValue 호출 제거 필요
}
```

**중요:** 이제 API에서 단일 언어 데이터를 받으므로 `getLocalizedValue` 함수 호출 제거

### 4.2 데이터 표시 수정
```javascript
// 기존 (다국어 객체)
<h4>{getLocalizedValue(item.title, currentLocale)}</h4>

// 변경 (단일 문자열)
<h4>{item.title}</h4>
```

### 4.3 테스트
- [ ] 브라우저 언어가 영어일 때 영어 메뉴 표시
- [ ] 브라우저 언어가 한국어일 때 한글 메뉴 표시
- [ ] 지원하지 않는 언어는 영어로 폴백

---

## Phase 5: 통합 테스트
**목표:** 전체 플로우가 정상 작동하는지 확인  
**예상 시간:** 3-4시간

### 5.1 End-to-End 테스트 시나리오

#### 시나리오 1: 새 메뉴 추가
1. [ ] 관리자 로그인
2. [ ] 카테고리 선택
3. [ ] "새 항목 추가" 클릭
4. [ ] English 탭에서 입력:
   - Title: "Test Item"
   - Ingredients: "Test ingredients"
   - Price: "$10"
5. [ ] 한국어 탭에서 입력:
   - Title: "테스트 항목"
   - Ingredients: "테스트 재료"
6. [ ] 이미지 업로드
7. [ ] "항목 저장" 클릭
8. [ ] 프론트엔드에서 영어 메뉴 확인
9. [ ] 프론트엔드에서 한글 메뉴 확인

#### 시나리오 2: 메뉴 수정
1. [ ] 관리자에서 기존 항목 선택
2. [ ] English 탭에서 제목 수정
3. [ ] 한국어 탭에서 제목 수정
4. [ ] "항목 저장" 클릭
5. [ ] 프론트엔드에서 변경사항 확인

#### 시나리오 3: 메뉴 삭제
1. [ ] 관리자에서 항목 선택
2. [ ] "항목 삭제" 클릭
3. [ ] 확인 대화상자에서 확인
4. [ ] 프론트엔드에서 삭제 확인
5. [ ] Blob에서 이미지도 삭제되었는지 확인

### 5.2 에러 시나리오 테스트

#### 네트워크 오류
- [ ] 관리자 저장 중 네트워크 차단 → 에러 메시지 확인
- [ ] 프론트엔드 로딩 중 네트워크 차단 → 빈 메뉴 표시 확인

#### 인증 오류
- [ ] 만료된 토큰으로 저장 시도 → 401 에러
- [ ] 토큰 없이 저장 시도 → 401 에러

#### 데이터 오류
- [ ] 잘못된 categoryId로 추가 → 에러 처리
- [ ] 존재하지 않는 itemIndex로 수정 → 에러 처리

### 5.3 성능 테스트
- [ ] API 응답 시간 측정 (Chrome DevTools Network 탭)
  - GET /api/menu?locale=en: < 500ms 목표
  - GET /api/menu?locale=ko: < 500ms 목표
- [ ] 페이로드 크기 확인
  - 영어: ~XX KB
  - 한글: ~XX KB
- [ ] CDN 캐시 헤더 확인
  - `Cache-Control` 존재 확인
  - `s-maxage=60` 확인

---

## Phase 6: 배포 및 모니터링
**목표:** 프로덕션 환경에 안전하게 배포  
**예상 시간:** 1-2시간

### 6.1 배포 전 체크리스트
- [ ] 환경 변수 확인 (Vercel Dashboard)
  - `JWT_SECRET`
  - `BLOB_READ_WRITE_TOKEN`
  - `ADMIN_PASSWORD_HASH`
- [ ] Blob에 프로덕션 데이터 준비
  - `menuData-en.json`
  - `menuData-ko.json`
- [ ] 백업 생성 및 다운로드
- [ ] Git 커밋 및 푸시
  ```bash
  git add .
  git commit -m "feat: implement multi-locale menu system"
  git push origin main
  ```

### 6.2 단계적 배포

#### Preview 배포
1. [ ] Vercel에서 자동 Preview 배포 확인
2. [ ] Preview URL 접속
3. [ ] 메뉴 조회 테스트 (영어/한글)
4. [ ] 관리자 로그인 테스트
5. [ ] 메뉴 수정 테스트

#### Production 배포
1. [ ] Vercel Dashboard에서 "Promote to Production" 클릭
2. [ ] 또는 `main` 브랜치로 머지
3. [ ] 배포 로그 확인

### 6.3 배포 후 검증
- [ ] Production URL에서 메뉴 조회 (영어)
- [ ] Production URL에서 메뉴 조회 (한글)
- [ ] 관리자 로그인
- [ ] 테스트 항목 추가
- [ ] 테스트 항목 수정
- [ ] 테스트 항목 삭제
- [ ] CDN 캐시 작동 확인 (Response Headers)

### 6.4 모니터링 설정

#### Vercel Analytics
- [ ] Vercel Dashboard > Analytics 활성화
- [ ] 주요 지표 확인:
  - Page Views
  - API Response Time
  - Error Rate

#### Blob 사용량
- [ ] Vercel Dashboard > Storage > Blob
- [ ] 사용량 모니터링
- [ ] 한도 확인

#### 로그 모니터링
```javascript
// API에 로깅 추가
console.log(`[MENU] GET request - locale: ${locale}`);
console.log(`[MENU] PATCH request - action: ${action}, category: ${categoryId}`);
```

---

## 추가 개선 사항 (선택적)

### 관리자 UX 개선

#### 번역 누락 경고
```javascript
const checkTranslationCompleteness = (item) => {
  const enComplete = item.title.en && item.ingredients.en;
  const koComplete = item.title.ko && item.ingredients.ko;
  
  if (!enComplete || !koComplete) {
    return {
      warning: true,
      message: `번역 누락: ${!enComplete ? 'English' : ''} ${!koComplete ? '한국어' : ''}`
    };
  }
  return { warning: false };
};
```

#### 일괄 복사 기능
- [ ] "영어를 한글로 복사" 버튼 추가
- [ ] "한글을 영어로 복사" 버튼 추가

#### 변경 이력
- [ ] 각 저장마다 타임스탬프 추가
- [ ] Blob에 `menuData-en-history-{timestamp}.json` 저장

### 성능 최적화

#### 이미지 최적화
- [ ] Next.js Image 컴포넌트 사용
- [ ] WebP 변환
- [ ] 리사이징 (예: 800x600)

#### Lazy Loading
```javascript
<img src={item.image} alt={item.title} loading="lazy" />
```

### 확장성

#### 언어 추가
```javascript
const SUPPORTED_LOCALES = [
  { id: 'en', label: 'English' },
  { id: 'ko', label: '한국어' },
  { id: 'ja', label: '日本語' },
  { id: 'zh', label: '中文' },
];
```

#### 카테고리 관리
- [ ] 카테고리 추가/수정/삭제 UI
- [ ] 카테고리 순서 변경 (드래그앤드롭)

---

## 예상 소요 시간 요약

| Phase | 작업 내용 | 예상 시간 |
|-------|----------|----------|
| Phase 1 | 데이터 준비 및 마이그레이션 | 2-3시간 |
| Phase 2 | API 수정 | 4-6시간 |
| Phase 3 | 관리자 UI 수정 | 6-8시간 |
| Phase 4 | 프론트엔드 수정 | 2-3시간 |
| Phase 5 | 통합 테스트 | 3-4시간 |
| Phase 6 | 배포 및 모니터링 | 1-2시간 |
| **총계** | | **18-26시간** |

---

## 위험 요소 및 대응 방안

### 1. 데이터 불일치
**위험:** 영어/한글 파일의 categoryId나 itemIndex가 어긋남

**대응:**
- 저장 시 검증 로직 추가
- 정기적인 일관성 체크 스크립트 실행
- 불일치 발견 시 자동 알림

### 2. 번역 누락
**위험:** 한쪽 언어만 입력되고 다른 쪽은 비어있음

**대응:**
- 필수 필드 검증 (저장 전)
- 번역 누락 경고 표시
- 기본값 폴백 (영어 → 한글)

### 3. 배포 중 장애
**위험:** 새 버전 배포 중 기존 메뉴가 안 보임

**대응:**
- Preview 환경에서 충분히 검증
- Blob 백업 유지
- 빠른 롤백 가능하도록 준비 (`git revert`)
- Blue-Green 배포 전략

### 4. 성능 저하
**위험:** 파일 수가 늘어나면서 응답 시간 증가

**대응:**
- CDN 캐시 적극 활용
- ETag 기반 재검증
- 모니터링 지표 설정 (응답 시간 알림)
- 필요시 Redis 캐싱 추가

### 5. 보안 이슈
**위험:** 관리자 토큰 노출, 무단 수정

**대응:**
- JWT 토큰 만료 시간 설정 (24시간)
- HTTPS 강제
- CORS 정책 엄격히 설정
- 관리자 활동 로그 기록

---

## 체크리스트 요약

### 필수 작업
- [ ] Phase 1 완료: 데이터 준비
- [ ] Phase 2 완료: API 수정
- [ ] Phase 3 완료: 관리자 UI
- [ ] Phase 4 완료: 프론트엔드
- [ ] Phase 5 완료: 통합 테스트
- [ ] Phase 6 완료: 배포

### 선택 작업
- [ ] 번역 누락 경고
- [ ] 일괄 번역 도구
- [ ] 변경 이력 추적
- [ ] 이미지 최적화
- [ ] 추가 언어 지원

---

## 참고 자료
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [menu-localization.md](./menu-localization.md) - 전체 시스템 설계 문서
