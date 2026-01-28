import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다' }, { status: 400 });
    }

    // 파일 크기 제한 (4.5MB)
    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 4.5MB 이하여야 합니다' }, { status: 400 });
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const filename = `menu/${timestamp}_${file.name}`;

    // Vercel Blob에 파일 업로드
    const blob = await put(filename, file, {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: file.type,
    });

    // Blob URL 반환
    const imageUrl = blob.url;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: '파일 업로드에 실패했습니다' }, { status: 500 });
  }
}