import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserFromReq } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getSessionUserFromReq(req);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
