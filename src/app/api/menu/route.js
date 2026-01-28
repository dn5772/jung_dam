import jwt from 'jsonwebtoken';
import { put, del, list } from '@vercel/blob';

const JWT_SECRET = process.env.JWT_SECRET;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const MENU_DATA_KEY = 'menuData-en.json'; // 영어 버전 메뉴 데이터

// 환경 변수 검증
if (!JWT_SECRET || !BLOB_TOKEN) {
  throw new Error('Missing required environment variables: JWT_SECRET or BLOB_READ_WRITE_TOKEN');
}

// 메뉴 데이터 초기 로드 함수 (Vercel Blob에서)
const loadMenuData = async () => {
  try {
    // Vercel Blob에서 모든 파일 목록 가져오기
    const { blobs } = await list({ token: BLOB_TOKEN });
    
    // 메뉴 데이터 파일 찾기
    const menuDataBlobs = blobs.filter(blob => blob.pathname === MENU_DATA_KEY);

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
const saveMenuData = async (data) => {
  try {
    // 기존 파일들을 삭제
    const { blobs } = await list({ token: BLOB_TOKEN });
    const existingBlobs = blobs.filter(blob => blob.pathname === MENU_DATA_KEY);
    
    for (const blob of existingBlobs) {
      await del(blob.url, { token: BLOB_TOKEN });
    }

    // 새 데이터를 업로드
    await put(MENU_DATA_KEY, JSON.stringify(data, null, 2), {
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
    const data = await loadMenuData();
    return new Response(JSON.stringify(data), {
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
    const newData = await request.json();
    await saveMenuData(newData);
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
    const currentData = await loadMenuData();

    if (action === 'add') {
      // 새 아이템 추가
      const categoryIndex = currentData.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex >= 0) {
        currentData.categories[categoryIndex].items.push(data);
      }
    } else if (action === 'update') {
      // 아이템 업데이트
      console.log('Update action received:', { categoryId, itemIndex, data });
      const categoryIndex = currentData.categories.findIndex(cat => cat.id === categoryId);
      console.log('Category index found:', categoryIndex);
      if (categoryIndex >= 0 && itemIndex >= 0) {
        const beforeUpdate = currentData.categories[categoryIndex].items[itemIndex];
        console.log('Before update:', beforeUpdate);
        currentData.categories[categoryIndex].items[itemIndex] = {
          ...currentData.categories[categoryIndex].items[itemIndex],
          ...data
        };
        const afterUpdate = currentData.categories[categoryIndex].items[itemIndex];
        console.log('After update:', afterUpdate);
      } else {
        console.log('Invalid category index or item index:', { categoryIndex, itemIndex });
      }
    } else if (action === 'delete') {
      // 아이템 삭제 및 이미지 파일 삭제
      const categoryIndex = currentData.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex >= 0 && itemIndex >= 0) {
        const itemToDelete = currentData.categories[categoryIndex].items[itemIndex];

        // Vercel Blob 이미지 파일이 있으면 삭제
        if (itemToDelete.image && itemToDelete.image.startsWith('https://')) {
          try {
            await del(itemToDelete.image, { token: BLOB_TOKEN });
            console.log(`Vercel Blob 이미지 파일 삭제됨: ${itemToDelete.image}`);
          } catch (error) {
            console.error('Vercel Blob 이미지 파일 삭제 실패:', error);
            // 이미지 삭제 실패해도 메뉴 데이터는 삭제 진행
          }
        }

        // 메뉴 데이터에서 항목 삭제
        currentData.categories[categoryIndex].items.splice(itemIndex, 1);
      }
    }

    await saveMenuData(currentData);
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