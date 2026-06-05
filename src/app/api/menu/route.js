import jwt from 'jsonwebtoken';
import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'ko'];

// Unified, single source of truth. Replaces the old per-locale
// menuData-en.json / menuData-ko.json pair (kept only as migration backups).
const UNIFIED_KEY = 'menuData.json';
const LEGACY_KEY = (locale) => `menuData-${locale}.json`;

if (!JWT_SECRET || !BLOB_TOKEN) {
  throw new Error('Missing required environment variables: JWT_SECRET or BLOB_READ_WRITE_TOKEN');
}

const getSafeLocale = (locale) => (SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE);

/* ─── shape helpers ─── */

// Read one localized value out of either a {ko,en} object or a bare string.
const pickLocale = (value, locale) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value[DEFAULT_LOCALE] || Object.values(value).find(Boolean) || '';
};

// Normalize any localized field into a full {en, ko} object.
const toLocalized = (value) => ({
  en: pickLocale(value, 'en'),
  ko: pickLocale(value, 'ko'),
});

// Guarantee every category/item has the unified shape (and a stable id).
const ensureShape = (data) => {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: toLocalized(category.name),
      description: toLocalized(category.description),
      items: (Array.isArray(category.items) ? category.items : []).map((item, index) => ({
        id: item.id || `${category.id}__${index}`,
        image: item.image || '',
        price: item.price || '',
        title: toLocalized(item.title),
        ingredients: toLocalized(item.ingredients),
      })),
    })),
  };
};

// Project the unified data down to the flat, single-locale shape the public
// site (MenuSection) consumes: localized fields collapse to plain strings.
const projectLocale = (data, locale) => ({
  categories: data.categories.map((category) => ({
    id: category.id,
    name: pickLocale(category.name, locale),
    description: pickLocale(category.description, locale),
    items: category.items.map((item) => ({
      id: item.id,
      image: item.image || '',
      title: pickLocale(item.title, locale),
      ingredients: pickLocale(item.ingredients, locale),
      price: item.price || '',
    })),
  })),
});

/* ─── blob I/O ─── */

const readBlobJson = (blobs, pathname) => {
  const blob = blobs.find((b) => b.pathname === pathname);
  if (!blob) return null;
  return fetch(blob.url).then((r) => (r.ok ? r.json() : null));
};

// Merge legacy per-locale files by array index — the original pairing rule —
// assigning deterministic ids so a missing unified file still works (and the
// next admin write transparently migrates it to menuData.json).
const mergeLegacy = (enData, koData) => {
  const enCats = enData?.categories || [];
  const koCats = koData?.categories || [];
  const koById = new Map(koCats.map((c) => [c.id, c]));
  const enById = new Map(enCats.map((c) => [c.id, c]));
  const orderedIds = [
    ...enCats.map((c) => c.id),
    ...koCats.filter((c) => !enById.has(c.id)).map((c) => c.id),
  ];

  return ensureShape({
    categories: orderedIds.map((id) => {
      const enCat = enById.get(id) || {};
      const koCat = koById.get(id) || {};
      const enItems = enCat.items || [];
      const koItems = koCat.items || [];
      const max = Math.max(enItems.length, koItems.length);
      return {
        id,
        name: { en: enCat.name || '', ko: koCat.name || '' },
        description: { en: enCat.description || '', ko: koCat.description || '' },
        items: Array.from({ length: max }).map((_, i) => {
          const e = enItems[i] || {};
          const k = koItems[i] || {};
          return {
            id: `${id}__${i}`,
            image: e.image || k.image || '',
            price: e.price || k.price || '',
            title: { en: e.title || '', ko: k.title || '' },
            ingredients: { en: e.ingredients || '', ko: k.ingredients || '' },
          };
        }),
      };
    }),
  });
};

const loadUnifiedData = async () => {
  try {
    const { blobs } = await list({ token: BLOB_TOKEN });
    const unified = await readBlobJson(blobs, UNIFIED_KEY);
    if (unified) return ensureShape(unified);

    // Pre-migration fallback: build from the legacy locale files on the fly.
    const [en, ko] = await Promise.all([
      readBlobJson(blobs, LEGACY_KEY('en')),
      readBlobJson(blobs, LEGACY_KEY('ko')),
    ]);
    if (en || ko) return mergeLegacy(en, ko);

    return { categories: [] };
  } catch (error) {
    console.error('Failed to load menu data from Blob:', error);
    return { categories: [] };
  }
};

// put with addRandomSuffix: false overwrites the existing blob atomically.
const saveUnifiedData = async (data) => {
  await put(UNIFIED_KEY, JSON.stringify(ensureShape(data), null, 2), {
    token: BLOB_TOKEN,
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
};

const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return jwt.verify(authHeader.substring(7), JWT_SECRET);
  } catch {
    return null;
  }
};

/* ─── handlers ─── */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await loadUnifiedData();

    // Admin needs the full unified data (both locales + item ids); always fresh.
    if (searchParams.get('format') === 'full') {
      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    // Public site: single-locale projection, cached.
    const locale = getSafeLocale(searchParams.get('locale') || DEFAULT_LOCALE);
    return new NextResponse(JSON.stringify(projectLocale(data, locale)), {
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

// Bulk replace with a full unified document.
export async function POST(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!Array.isArray(body?.categories)) {
      return NextResponse.json({ error: 'Invalid payload: categories[] required' }, { status: 400 });
    }
    await saveUnifiedData(body);
    return NextResponse.json({ message: 'Menu data updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu data' }, { status: 500 });
  }
}

// Single-item operations, addressed by stable category/item ids.
export async function PATCH(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, categoryId, itemId, data } = await request.json();
    const menu = await loadUnifiedData();
    const category = menu.categories.find((c) => c.id === categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (action === 'add') {
      const newItem = {
        id: randomUUID(),
        image: data?.image || '',
        price: data?.price || '',
        title: toLocalized(data?.title),
        ingredients: toLocalized(data?.ingredients),
      };
      category.items.push(newItem);
      await saveUnifiedData(menu);
      return NextResponse.json({ message: 'Item added', itemId: newItem.id });
    }

    if (action === 'update') {
      const item = category.items.find((it) => it.id === itemId);
      if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      if (data?.image !== undefined) item.image = data.image;
      if (data?.price !== undefined) item.price = data.price;
      if (data?.title !== undefined) item.title = toLocalized(data.title);
      if (data?.ingredients !== undefined) item.ingredients = toLocalized(data.ingredients);
      await saveUnifiedData(menu);
      return NextResponse.json({ message: 'Item updated' });
    }

    if (action === 'delete') {
      const index = category.items.findIndex((it) => it.id === itemId);
      if (index < 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      const [removed] = category.items.splice(index, 1);
      if (removed?.image && removed.image.startsWith('https://')) {
        try {
          await del(removed.image, { token: BLOB_TOKEN });
        } catch (error) {
          console.error('Vercel Blob 이미지 파일 삭제 실패:', error);
        }
      }
      await saveUnifiedData(menu);
      return NextResponse.json({ message: 'Item deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu data' }, { status: 500 });
  }
}
