import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// 임시로 하드코딩된 값으로 테스트
const JWT_SECRET = '6eda224dd3eebb51e826073d61762ca4a2e32d5609781565039b6d2dabebfd5b';
const ADMIN_PASSWORD_HASH = '$2b$10$vSrRyuT7KLCy8kfJle15Ye6lXjrf5qAS.8eAXHtWi9xmJsYJLmOgK';

console.log('Using hardcoded values for testing');

export async function POST(request) {
  try {
    // 환경변수 확인
    if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
      console.error('Missing environment variables: JWT_SECRET or ADMIN_PASSWORD_HASH');
      return new Response(JSON.stringify({
        error: 'Server configuration error',
        details: process.env.NODE_ENV === 'development' ? 'Missing JWT_SECRET or ADMIN_PASSWORD_HASH' : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { password } = await request.json();

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Login attempt with password:', password);
    console.log('Stored hash:', ADMIN_PASSWORD_HASH);

    // 해시된 비밀번호와 비교
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    console.log('Password validation result:', isValidPassword);

    if (isValidPassword) {
      // JWT 토큰 생성
      const token = jwt.sign(
        { role: 'admin', exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }, // 24시간 유효
        JWT_SECRET
      );

      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Invalid password attempt');
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}