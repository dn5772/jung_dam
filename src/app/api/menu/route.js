import jwt from 'jsonwebtoken';
import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'ko'];

if (!JWT_SECRET || !BLOB_TOKEN) {
  throw new Error('Missing required environment variables: JWT_SECRET or BLOB_READ_WRITE_TOKEN');
}

const getSafeLocale = (locale) => (SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE);

const getMenuDataKey = (locale) => `menuData-${getSafeLocale(locale)}.json`;

const loadMenuData = async (locale = DEFAULT_LOCALE) => {
  try {
    const { blobs } = await list({ token: BLOB_TOKEN });
    const menuDataKey = getMenuDataKey(locale);
    const menuDataBlob = blobs.find(blob => blob.pathname === menuDataKey);

    if (menuDataBlob) {
      const response = await fetch(menuDataBlob.url);
      if (response.ok) {
        return await response.json();
      }
    }

    return { categories: [] };
  } catch (error) {
    console.error('Failed to load menu data from Blob:', error);
    return { categories: [] };
  }
};

// put with addRandomSuffix: false overwrites existing blob atomically — no delete needed
const saveMenuData = async (locale, data) => {
  try {
    const menuDataKey = getMenuDataKey(locale);
    await put(menuDataKey, JSON.stringify(data, null, 2), {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error('Failed to save menu data to Blob:', error);
    throw error;
  }
};

const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = getSafeLocale(searchParams.get('locale') || DEFAULT_LOCALE);
    const data = await loadMenuData(locale);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read menu data' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { en, ko } = await request.json();
    if (!en || !ko) {
      return NextResponse.json({ error: 'Invalid payload: en/ko required' }, { status: 400 });
    }

    await Promise.all([saveMenuData('en', en), saveMenuData('ko', ko)]);
    return NextResponse.json({ message: 'Menu data updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu data' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, categoryId, itemIndex, data } = await request.json();
    const [enData, koData] = await Promise.all([loadMenuData('en'), loadMenuData('ko')]);

    if (action === 'add') {
      const enIdx = enData.categories.findIndex(cat => cat.id === categoryId);
      const koIdx = koData.categories.findIndex(cat => cat.id === categoryId);
      if (enIdx >= 0 && koIdx >= 0 && data?.en && data?.ko) {
        enData.categories[enIdx].items.push(data.en);
        koData.categories[koIdx].items.push(data.ko);
      }
    } else if (action === 'update') {
      const enIdx = enData.categories.findIndex(cat => cat.id === categoryId);
      const koIdx = koData.categories.findIndex(cat => cat.id === categoryId);
      if (enIdx >= 0 && koIdx >= 0 && itemIndex >= 0 && data?.en && data?.ko) {
        enData.categories[enIdx].items[itemIndex] = {
          ...enData.categories[enIdx].items[itemIndex],
          ...data.en,
        };
        koData.categories[koIdx].items[itemIndex] = {
          ...koData.categories[koIdx].items[itemIndex],
          ...data.ko,
        };
      }
    } else if (action === 'delete') {
      const enIdx = enData.categories.findIndex(cat => cat.id === categoryId);
      const koIdx = koData.categories.findIndex(cat => cat.id === categoryId);
      if (enIdx >= 0 && koIdx >= 0 && itemIndex >= 0) {
        const itemToDelete = enData.categories[enIdx].items[itemIndex];

        if (itemToDelete?.image && itemToDelete.image.startsWith('https://')) {
          try {
            await del(itemToDelete.image, { token: BLOB_TOKEN });
          } catch (error) {
            console.error('Vercel Blob 이미지 파일 삭제 실패:', error);
          }
        }

        enData.categories[enIdx].items.splice(itemIndex, 1);
        koData.categories[koIdx].items.splice(itemIndex, 1);
      }
    }

    await Promise.all([saveMenuData('en', enData), saveMenuData('ko', koData)]);
    return NextResponse.json({ message: 'Menu data updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu data' }, { status: 500 });
  }
}
