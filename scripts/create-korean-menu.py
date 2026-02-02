#!/usr/bin/env python3
"""
영어 메뉴를 한글로 변환하여 menuData-ko.json 생성
"""

import json
import sys
from pathlib import Path

# 번역 딕셔너리
translations = {
    # 카테고리
    'Dak-galbi': '닭갈비',
    'Tteokbokki': '떡볶이',
    'Main dishes': '메인 요리',
    'Stir-Fried': '볶음 요리',
    'Soup & Stew': '국&찜',
    'Stone Pot': '돌솥 요리',
    'Fried': '튀김 요리',
    'Appetizers': '전채 요리',
    
    # 카테고리 설명
    'Korean stir-fried chicken cooked with vegetables and rice cakes.': '야채와 떡볶이로 코팅된 한국식 닭을 볶은 요리입니다.',
    'Chewy rice cakes simmered in a sweet and spicy Korean chili sauce.': '매콤한 한국식 고추 소스에 졸인 쫄깃한 떡.',
    'Hearty Korean dishes perfect for sharing.': '나누기에 완벽한 푸짐한 한국식 요리.',
    'Stir-fried dishes with bold Korean flavors.': '강렬한 한국 풍미의 볶음 요리.',
    'Traditional Korean soups and stews.': '전통 한국식 국과 찜 요리.',
    'Rice served in a heated stone pot.': '데운 돌솥에 담긴 쌀 요리.',
    'Golden, crispy fried Korean dishes.': '황금색으로 바삭한 튀김 한국식 요리.',
    'Light appetizers and side dishes.': '가벼운 전채와 반찬.',
    
    # 메뉴 항목들
    'Original Dak-galbi': '오리지날 닭갈비',
    'Spicy stir-fried chicken with vegetables and rice cakes.': '야채와 떡볶이를 곁들인 매콤한 닭 볶음.',
    'Cheese Dak-galbi': '치즈 닭갈비',
    'Spicy chicken stir-fry topped with melted cheese.': '녹인 치즈를 얹은 매콤한 닭 볶음.',
    'Salt-Grilled Dak-galbi': '소금구이 닭갈비',
    'Chicken stir-fried with sesame oil and salt marinade.': '참기름과 소금 양념으로 볶은 닭.',
    'Creamy Dak-galbi': '크리미 닭갈비',
    'Tender chicken and vegetables in a rich gochujang Alfredo sauce.': '풍부한 고추장 알프레도 소스의 부드러운 닭과 야채.',
    'Original Tteokbokki': '오리지날 떡볶이',
    'Rice cakes cooked in a sweet and spicy sauce.': '달콤하고 매운 소스에 익힌 떡.',
    'Beef Brisket Tteokbokki': '소 안심 떡볶이',
    'Tteokbokki topped with sliced beef brisket.': '소 안심 슬라이스를 얹은 떡볶이.',
    'Donkatsu Tteokbokki': '돈까스 떡볶이',
    'Tteokbokki served with crispy pork cutlet.': '바삭한 돈까스와 함께 제공되는 떡볶이.',
    'Rose Tteokbokki': '로즈 떡볶이',
    'Creamy rose-style sauce with rice cakes.': '크리미 로즈 스타일 소스의 떡.',
    'Army Stew (Budae Jjigae)': '부대찌개',
    'Spicy stew with spam, sausage, cheese, and ramen noodles.': '스팸, 소시지, 치즈, 라면을 곁들인 매운 찌개.',
    'Seafood Soft Tofu Hotpot': '해산물 순두부 전골',
    'Hotpot with seafood, soft tofu, and vegetables.': '해산물, 순두부, 야채가 들어간 전골.',
    'Soy Braised Chicken (Jjimdak)': '닭 조림',
    'Chicken braised in a savory soy-based sauce.': '짭짤한 간장 소스에 조린 닭.',
    'Spicy Braised Chicken': '매운 닭 조림',
    'Chicken braised in a spicy sauce with vegetables.': '야채를 곁들인 매운 소스에 조린 닭.',
    'Fish Cake Hotpot': '오뎅 전골',
    'Fish cake hotpot with seafood in a deep broth.': '깊은 국물의 해산물을 곁들인 오뎅 전골.',
    'Spicy Pork Bone Stew': '돼지뼈 매운 찌개',
    'Spicy pork bone stew with vegetables.': '야채를 곁들인 돼지뼈 매운 찌개.',
    'Spicy Beef Tripe Stew': '곱창 매운 찌개',
    'Tender beef tripe cooked in a spicy broth.': '매운 국물에 익힌 부드러운 소 곱창.',
}

def translate(text):
    """텍스트 번역, 없으면 원문 반환"""
    return translations.get(text, text)

def main():
    backup_dir = Path(__file__).parent.parent / 'backup'
    en_file = backup_dir / 'menuData-en-backup-2026-02-02.json'
    ko_file = backup_dir / 'menuData-ko.json'
    
    if not en_file.exists():
        print(f'❌ {en_file}이 없습니다.')
        sys.exit(1)
    
    print(f'📖 {en_file} 읽는 중...')
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    # 한글 버전 생성
    ko_data = {
        'categories': []
    }
    
    for category in en_data['categories']:
        ko_cat = {
            'id': category['id'],
            'name': translate(category['name']),
            'description': translate(category['description']),
            'items': []
        }
        
        for item in category.get('items', []):
            ko_item = {
                'image': item['image'],
                'title': translate(item['title']),
                'ingredients': translate(item['ingredients']),
                'price': item['price']
            }
            ko_cat['items'].append(ko_item)
        
        ko_data['categories'].append(ko_cat)
    
    # 파일에 저장
    print(f'💾 {ko_file}에 저장 중...')
    with open(ko_file, 'w', encoding='utf-8') as f:
        json.dump(ko_data, f, ensure_ascii=False, indent=2)
    
    print(f'✅ 한글 버전 저장 완료: {ko_file}')
    print(f'📊 카테고리: {len(ko_data["categories"])}개')
    
    for idx, cat in enumerate(ko_data['categories'], 1):
        print(f'  {idx}. {cat["name"]} ({len(cat["items"])}개 항목)')

if __name__ == '__main__':
    main()
