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

const DEFAULT_CURRENCY = '$';

// Prices are stored bare (no symbol). Strip a leading currency symbol from any
// legacy value so e.g. "$12.00" becomes "12.00" while "시가"/"Market" survive.
const stripCurrency = (price) => String(price || '').replace(/^\s*[$₩€£¥]\s*/, '').trim();

// Render a bare price for display: numeric values get the currency symbol
// prefixed; non-numeric literals (e.g. "시가") are shown as-is.
const formatPrice = (price, currency) => {
  const s = stripCurrency(price);
  if (!s) return '';
  return /^[\d]/.test(s) ? `${currency}${s}` : s;
};

// Guarantee the unified shape (stable ids, localized fields, bare prices,
// a currency setting).
const ensureShape = (data) => {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  return {
    currency: (typeof data?.currency === 'string' && data.currency) ? data.currency : DEFAULT_CURRENCY,
    categories: categories.map((category) => ({
      id: category.id,
      name: toLocalized(category.name),
      description: toLocalized(category.description),
      items: (Array.isArray(category.items) ? category.items : []).map((item, index) => ({
        id: item.id || `${category.id}__${index}`,
        image: item.image || '',
        price: stripCurrency(item.price),
        title: toLocalized(item.title),
        ingredients: toLocalized(item.ingredients),
      })),
    })),
  };
};

// Project the unified data down to the flat, single-locale shape the public
// site (MenuSection) consumes: localized fields collapse to plain strings and
// the price is rendered with the configured currency symbol.
const projectLocale = (data, locale) => ({
  currency: data.currency,
  categories: data.categories.map((category) => ({
    id: category.id,
    name: pickLocale(category.name, locale),
    description: pickLocale(category.description, locale),
    items: category.items.map((item) => ({
      id: item.id,
      image: item.image || '',
      title: pickLocale(item.title, locale),
      ingredients: pickLocale(item.ingredients, locale),
      price: formatPrice(item.price, data.currency),
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

// Single category/item operations, addressed by stable ids.
export async function PATCH(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, categoryId, itemId, data } = await request.json();
    const menu = await loadUnifiedData();
    const findCategory = (id) => menu.categories.find((c) => c.id === id);
    const notFound = (what) => NextResponse.json({ error: `${what} not found` }, { status: 404 });

    // Reorder a list of {id} objects to match the given id order; any ids not
    // listed are appended in their existing order (defensive).
    const reorderById = (list, order) => {
      const safeOrder = Array.isArray(order) ? order : [];
      const byId = new Map(list.map((el) => [el.id, el]));
      const result = safeOrder.map((id) => byId.get(id)).filter(Boolean);
      for (const el of list) if (!safeOrder.includes(el.id)) result.push(el);
      return result;
    };

    switch (action) {
      /* ── item actions ── */
      case 'add': {
        const category = findCategory(categoryId);
        if (!category) return notFound('Category');
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

      case 'update': {
        const category = findCategory(categoryId);
        if (!category) return notFound('Category');
        const item = category.items.find((it) => it.id === itemId);
        if (!item) return notFound('Item');
        if (data?.image !== undefined) item.image = data.image;
        if (data?.price !== undefined) item.price = data.price;
        if (data?.title !== undefined) item.title = toLocalized(data.title);
        if (data?.ingredients !== undefined) item.ingredients = toLocalized(data.ingredients);
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Item updated' });
      }

      case 'delete': {
        const category = findCategory(categoryId);
        if (!category) return notFound('Category');
        const index = category.items.findIndex((it) => it.id === itemId);
        if (index < 0) return notFound('Item');
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

      case 'reorderItems': {
        const category = findCategory(categoryId);
        if (!category) return notFound('Category');
        category.items = reorderById(category.items, data?.order);
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Items reordered' });
      }

      /* ── category actions ── */
      case 'addCategory': {
        const newCategory = {
          id: randomUUID(),
          name: toLocalized(data?.name),
          description: toLocalized(data?.description),
          items: [],
        };
        menu.categories.push(newCategory);
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Category added', categoryId: newCategory.id });
      }

      case 'updateCategory': {
        const category = findCategory(categoryId);
        if (!category) return notFound('Category');
        if (data?.name !== undefined) category.name = toLocalized(data.name);
        if (data?.description !== undefined) category.description = toLocalized(data.description);
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Category updated' });
      }

      case 'deleteCategory': {
        const index = menu.categories.findIndex((c) => c.id === categoryId);
        if (index < 0) return notFound('Category');
        const [removed] = menu.categories.splice(index, 1);
        const urls = (removed.items || [])
          .map((it) => it.image)
          .filter((u) => u && u.startsWith('https://'));
        if (urls.length) {
          try {
            await del(urls, { token: BLOB_TOKEN });
          } catch (error) {
            console.error('Vercel Blob 이미지 파일 삭제 실패:', error);
          }
        }
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Category deleted' });
      }

      case 'reorderCategories': {
        menu.categories = reorderById(menu.categories, data?.order);
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Categories reordered' });
      }

      /* ── document settings ── */
      case 'updateSettings': {
        if (typeof data?.currency === 'string') {
          menu.currency = data.currency.trim() || DEFAULT_CURRENCY;
        }
        await saveUnifiedData(menu);
        return NextResponse.json({ message: 'Settings updated' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu data' }, { status: 500 });
  }
}
