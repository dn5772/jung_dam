import jwt from 'jsonwebtoken';
import { put, del, list } from '@vercel/blob';

const JWT_SECRET = process.env.JWT_SECRET;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'ko'];

// 환경 변수 검증
if (!JWT_SECRET || !BLOB_TOKEN) {
  throw new Error('Missing required environment variables: JWT_SECRET or BLOB_READ_WRITE_TOKEN');
}

const getSafeLocale = (locale) => (SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE);

const getMenuDataKey = (locale) => `menuData-${getSafeLocale(locale)}.json`;

// 메뉴 데이터 초기 로드 함수 (Vercel Blob에서)
const loadMenuData = async (locale = DEFAULT_LOCALE) => {
  try {
    // Vercel Blob에서 모든 파일 목록 가져오기
    const { blobs } = await list({ token: BLOB_TOKEN });
    
    // 메뉴 데이터 파일 찾기
    const menuDataKey = getMenuDataKey(locale);
    const menuDataBlobs = blobs.filter(blob => blob.pathname === menuDataKey);

    if (menuDataBlobs.length > 0) {
      // 최신 버전의 파일 다운로드
      const response = await fetch(menuDataBlobs[0].url);
      if (response.ok) {
        return await response.json();
      }
    }

    // Blob에 데이터가 없으면 빈 데이터 반환
    return { categories: [] };
  } catch (error) {
    console.error('Failed to load menu data from Blob:', error);
    return { categories: [] };
  }
};

// 메뉴 데이터 저장 함수 (Vercel Blob에)
const saveMenuData = async (locale, data) => {
  try {
    const menuDataKey = getMenuDataKey(locale);

    // 기존 파일들을 삭제
    const { blobs } = await list({ token: BLOB_TOKEN });
    const existingBlobs = blobs.filter(blob => blob.pathname === menuDataKey);
    
    for (const blob of existingBlobs) {
      await del(blob.url, { token: BLOB_TOKEN });
    }

    // 새 데이터를 업로드
    await put(menuDataKey, JSON.stringify(data, null, 2), {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: 'application/json',
    });
  } catch (error) {
    console.error('Failed to save menu data to Blob:', error);
    throw error;
  }
};

// JWT 토큰 검증 함수
const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // "Bearer " 제거
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = getSafeLocale(searchParams.get('locale') || DEFAULT_LOCALE);
    const data = await loadMenuData(locale);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  // JWT 검증
  const user = verifyToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { en, ko } = await request.json();
    if (!en || !ko) {
      return new Response(JSON.stringify({ error: 'Invalid payload: en/ko required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await saveMenuData('en', en);
    await saveMenuData('ko', ko);
    return new Response(JSON.stringify({ message: 'Menu data updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request) {
  // JWT 검증
  const user = verifyToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { action, categoryId, itemIndex, data } = await request.json();
    const enData = await loadMenuData('en');
    const koData = await loadMenuData('ko');

    if (action === 'add') {
      const enCategoryIndex = enData.categories.findIndex(cat => cat.id === categoryId);
      const koCategoryIndex = koData.categories.findIndex(cat => cat.id === categoryId);
      if (enCategoryIndex >= 0 && koCategoryIndex >= 0 && data?.en && data?.ko) {
        enData.categories[enCategoryIndex].items.push(data.en);
        koData.categories[koCategoryIndex].items.push(data.ko);
      }
    } else if (action === 'update') {
      const enCategoryIndex = enData.categories.findIndex(cat => cat.id === categoryId);
      const koCategoryIndex = koData.categories.findIndex(cat => cat.id === categoryId);
      if (enCategoryIndex >= 0 && koCategoryIndex >= 0 && itemIndex >= 0 && data?.en && data?.ko) {
        enData.categories[enCategoryIndex].items[itemIndex] = {
          ...enData.categories[enCategoryIndex].items[itemIndex],
          ...data.en,
        };
        koData.categories[koCategoryIndex].items[itemIndex] = {
          ...koData.categories[koCategoryIndex].items[itemIndex],
          ...data.ko,
        };
      }
    } else if (action === 'delete') {
      const enCategoryIndex = enData.categories.findIndex(cat => cat.id === categoryId);
      const koCategoryIndex = koData.categories.findIndex(cat => cat.id === categoryId);
      if (enCategoryIndex >= 0 && koCategoryIndex >= 0 && itemIndex >= 0) {
        const itemToDelete = enData.categories[enCategoryIndex].items[itemIndex];

        if (itemToDelete?.image && itemToDelete.image.startsWith('https://')) {
          try {
            await del(itemToDelete.image, { token: BLOB_TOKEN });
          } catch (error) {
            console.error('Vercel Blob 이미지 파일 삭제 실패:', error);
          }
        }

        enData.categories[enCategoryIndex].items.splice(itemIndex, 1);
        koData.categories[koCategoryIndex].items.splice(itemIndex, 1);
      }
    }

    await saveMenuData('en', enData);
    await saveMenuData('ko', koData);
    return new Response(JSON.stringify({ message: 'Menu data updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}