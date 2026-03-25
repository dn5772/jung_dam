import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function POST(request) {
  if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
    console.error('Missing environment variables: JWT_SECRET or ADMIN_PASSWORD_HASH');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (isValidPassword) {
      const token = jwt.sign(
        { role: 'admin', exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) },
        JWT_SECRET
      );
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
