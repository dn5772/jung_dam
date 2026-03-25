import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import jwt from 'jsonwebtoken';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7);
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export async function POST(request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다' }, { status: 400 });
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 4.5MB 이하여야 합니다' }, { status: 400 });
    }

    const timestamp = Date.now();
    const filename = `menu/${timestamp}_${file.name}`;

    const blob = await put(filename, file, {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ imageUrl: blob.url });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: '파일 업로드에 실패했습니다' }, { status: 500 });
  }
}
