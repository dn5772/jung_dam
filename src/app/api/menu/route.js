import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const filePath = path.join(process.cwd(), 'src/data/menuData.json');

// JWT 토큰 검증 함수
const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // "Bearer " 제거
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  // JWT 검증
//   const user = verifyToken(request);
//   if (!user) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
//       status: 401,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  // JWT 검증
  const user = verifyToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const newData = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    return new Response(JSON.stringify({ message: 'Menu data updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request) {
  // JWT 검증
  const user = verifyToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { action, categoryId, itemIndex, data } = await request.json();
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (action === 'add') {
      // 새 아이템 추가
      const categoryIndex = currentData.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex >= 0) {
        currentData.categories[categoryIndex].items.push(data);
      }
    } else if (action === 'update') {
      // 아이템 업데이트
      const categoryIndex = currentData.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex >= 0 && itemIndex >= 0) {
        currentData.categories[categoryIndex].items[itemIndex] = {
          ...currentData.categories[categoryIndex].items[itemIndex],
          ...data
        };
      }
    } else if (action === 'delete') {
      // 아이템 삭제 및 이미지 파일 삭제
      const categoryIndex = currentData.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex >= 0 && itemIndex >= 0) {
        const itemToDelete = currentData.categories[categoryIndex].items[itemIndex];

        // 이미지 파일이 있으면 삭제
        if (itemToDelete.image && itemToDelete.image.startsWith('/img/menu/')) {
          try {
            const imagePath = path.join(process.cwd(), 'public', itemToDelete.image);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(`이미지 파일 삭제됨: ${imagePath}`);
            }
          } catch (error) {
            console.error('이미지 파일 삭제 실패:', error);
            // 이미지 삭제 실패해도 메뉴 데이터는 삭제 진행
          }
        }

        // 메뉴 데이터에서 항목 삭제
        currentData.categories[categoryIndex].items.splice(itemIndex, 1);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
    return new Response(JSON.stringify({ message: 'Menu data updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update menu data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}