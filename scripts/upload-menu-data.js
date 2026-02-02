#!/usr/bin/env node
/**
 * menuData-en.json과 menuData-ko.json을 Vercel Blob에 업로드
 * 사용: node scripts/upload-menu-data.js
 */

import { put, del, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다.');
  process.exit(1);
}

async function uploadMenuData() {
  try {
    const backupDir = path.join(__dirname, '../backup');
    const enFile = path.join(backupDir, 'menuData-en-backup-2026-02-02.json');
    const koFile = path.join(backupDir, 'menuData-ko.json');

    if (!fs.existsSync(enFile)) {
      console.error(`❌ ${enFile}이 없습니다.`);
      process.exit(1);
    }

    if (!fs.existsSync(koFile)) {
      console.error(`❌ ${koFile}이 없습니다.`);
      process.exit(1);
    }

    console.log('🗑️  기존 파일 삭제 중...');
    const { blobs } = await list({ token: BLOB_TOKEN });
    const oldBlobs = blobs.filter(blob => 
      blob.pathname === 'menuData-en.json' || blob.pathname === 'menuData-ko.json'
    );

    for (const blob of oldBlobs) {
      await del(blob.url, { token: BLOB_TOKEN });
      console.log(`  ✅ 삭제: ${blob.pathname}`);
    }

    console.log('\n📤 새 파일 업로드 중...');
    
    // 영어 파일 업로드
    const enData = fs.readFileSync(enFile, 'utf8');
    await put('menuData-en.json', enData, {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: 'application/json',
    });
    console.log('  ✅ menuData-en.json 업로드 완료');

    // 한글 파일 업로드
    const koData = fs.readFileSync(koFile, 'utf8');
    await put('menuData-ko.json', koData, {
      token: BLOB_TOKEN,
      access: 'public',
      contentType: 'application/json',
    });
    console.log('  ✅ menuData-ko.json 업로드 완료');

    console.log('\n✅ 모든 파일이 정상적으로 업로드되었습니다!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadMenuData();
