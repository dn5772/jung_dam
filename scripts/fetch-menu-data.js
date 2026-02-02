#!/usr/bin/env node
/**
 * Vercel Blob에서 현재 메뉴 데이터를 다운로드하고 로컬에 저장
 * 사용: node scripts/fetch-menu-data.js
 */

import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

async function fetchMenuData() {
  try {
    console.log('📥 Vercel Blob에서 메뉴 데이터를 다운로드 중...');
    
    // Blob에서 파일 목록 조회
    const { blobs } = await list({ token: BLOB_TOKEN });
    const enBlob = blobs.find(blob => blob.pathname === 'menuData-en.json');
    
    if (!enBlob) {
      console.error('❌ Blob에서 menuData-en.json을 찾을 수 없습니다.');
      console.log('📋 현재 Blob의 파일 목록:');
      blobs.forEach(blob => console.log(`  - ${blob.pathname}`));
      process.exit(1);
    }

    // 파일 다운로드
    const response = await fetch(enBlob.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 로컬에 저장 (백업 폴더)
    const backupDir = path.join(__dirname, '../backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const backupPath = path.join(backupDir, `menuData-en-backup-${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ 백업 저장: ${backupPath}`);
    console.log(`📊 카테고리: ${data.categories?.length || 0}개`);
    
    if (data.categories) {
      data.categories.forEach((cat, idx) => {
        console.log(`  ${idx + 1}. ${cat.name} (${cat.items?.length || 0}개 항목)`);
      });
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fetchMenuData();
