#!/usr/bin/env node
/**
 * 영어/한글 메뉴 데이터 검증 스크립트
 * 두 파일의 구조가 일치하는지 확인합니다.
 * 사용: node scripts/validate-menu-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let errorCount = 0;
let warningCount = 0;

function error(msg) {
  console.error(`❌ ${msg}`);
  errorCount++;
}

function warning(msg) {
  console.warn(`⚠️  ${msg}`);
  warningCount++;
}

function success(msg) {
  console.log(`✅ ${msg}`);
}

async function validateMenuData() {
  try {
    const backupDir = path.join(__dirname, '../backup');
    const enPath = path.join(backupDir, 'menuData-en-backup-2026-02-02.json');
    const koPath = path.join(backupDir, 'menuData-ko.json');

    if (!fs.existsSync(enPath)) {
      error(`${enPath}을(를) 찾을 수 없습니다.`);
      process.exit(1);
    }

    if (!fs.existsSync(koPath)) {
      error(`${koPath}을(를) 찾을 수 없습니다.`);
      process.exit(1);
    }

    console.log('\n📋 메뉴 데이터 검증 시작...\n');

    // JSON 파일 로드
    let enData, koData;
    try {
      enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      success('영어 메뉴 JSON 문법 검증 완료');
    } catch (e) {
      error(`영어 메뉴 JSON 파싱 오류: ${e.message}`);
      process.exit(1);
    }

    try {
      koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));
      success('한글 메뉴 JSON 문법 검증 완료');
    } catch (e) {
      error(`한글 메뉴 JSON 파싱 오류: ${e.message}`);
      process.exit(1);
    }

    // 카테고리 수 확인
    if (enData.categories.length !== koData.categories.length) {
      error(
        `카테고리 개수 불일치: 영어 ${enData.categories.length}개 vs 한글 ${koData.categories.length}개`
      );
    } else {
      success(`카테고리 개수 일치: ${enData.categories.length}개`);
    }

    // 각 카테고리 검증
    console.log('\n📂 카테고리별 검증:\n');
    
    for (let i = 0; i < Math.max(enData.categories.length, koData.categories.length); i++) {
      const enCat = enData.categories[i];
      const koCat = koData.categories[i];

      if (!enCat) {
        error(`  [${i}] 영어 카테고리가 없습니다 (한글: ${koCat.name})`);
        continue;
      }

      if (!koCat) {
        error(`  [${i}] 한글 카테고리가 없습니다 (영어: ${enCat.name})`);
        continue;
      }

      // 카테고리 ID 확인
      if (enCat.id !== koCat.id) {
        error(`  [${i}] 카테고리 ID 불일치: "${enCat.id}" vs "${koCat.id}"`);
      }

      // 항목 개수 확인
      const enItemCount = enCat.items?.length || 0;
      const koItemCount = koCat.items?.length || 0;

      if (enItemCount !== koItemCount) {
        error(
          `  [${i}] ${enCat.name}: 항목 개수 불일치 (영어 ${enItemCount}개 vs 한글 ${koItemCount}개)`
        );
      } else {
        success(`  [${i}] ${enCat.name}: ${enItemCount}개 항목 일치`);
      }

      // 각 항목 검증
      for (let j = 0; j < Math.max(enItemCount, koItemCount); j++) {
        const enItem = enCat.items?.[j];
        const koItem = koCat.items?.[j];

        if (!enItem) {
          error(`    [${i}-${j}] 영어 항목이 없습니다`);
          continue;
        }

        if (!koItem) {
          error(`    [${i}-${j}] 한글 항목이 없습니다`);
          continue;
        }

        // 이미지 URL 확인 (동일해야 함)
        if (enItem.image !== koItem.image) {
          error(`    [${i}-${j}] 이미지 URL 불일치: "${enItem.image}" vs "${koItem.image}"`);
        }

        // 가격 확인 (동일해야 함)
        if (enItem.price !== koItem.price) {
          error(`    [${i}-${j}] 가격 불일치: "${enItem.price}" vs "${koItem.price}"`);
        }

        // 필수 필드 확인
        if (!enItem.title) error(`    [${i}-${j}] 영어 제목이 없습니다`);
        if (!koItem.title) error(`    [${i}-${j}] 한글 제목이 없습니다`);
        if (!enItem.ingredients) error(`    [${i}-${j}] 영어 재료 설명이 없습니다`);
        if (!koItem.ingredients) error(`    [${i}-${j}] 한글 재료 설명이 없습니다`);

        // 영어/한글 번역 확인
        if (enItem.title === koItem.title && enItem.title) {
          warning(`    [${i}-${j}] 제목 번역 누락: "${enItem.title}"`);
        }
        if (enItem.ingredients === koItem.ingredients && enItem.ingredients) {
          warning(`    [${i}-${j}] 재료 설명 번역 누락: "${enItem.ingredients}"`);
        }
      }
    }

    // 요약
    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 검증 결과:`);
    console.log(`  ✅ 에러: ${errorCount}개`);
    console.log(`  ⚠️  경고: ${warningCount}개\n`);

    if (errorCount === 0 && warningCount === 0) {
      console.log('🎉 모든 검증을 통과했습니다!\n');
      process.exit(0);
    } else if (errorCount === 0) {
      console.log('⚠️  경고는 있지만 진행할 수 있습니다.\n');
      process.exit(0);
    } else {
      console.log('❌ 검증 실패. 위의 에러를 수정해주세요.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

validateMenuData();
