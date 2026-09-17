import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Role, UserSession } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'feather-haven-super-secret-jwt-key-2026';
const TOKEN_COOKIE_NAME = 'fh_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwtToken(user: UserSession): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJwtToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwtToken(token);
}

export function getSessionUserFromReq(req: NextRequest): UserSession | null {
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwtToken(token);
}

export { TOKEN_COOKIE_NAME };
