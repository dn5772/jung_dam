import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'menu');

    // menu 폴더가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 폴더가 이미 존재하는 경우 무시
    }

    // 파일 저장
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // 웹에서 접근 가능한 경로 반환
    const imageUrl = `/menu/${filename}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: '파일 업로드에 실패했습니다' }, { status: 500 });
  }
}