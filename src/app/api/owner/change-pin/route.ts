import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq, comparePassword, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = getSessionUserFromReq(req);
    const body = await req.json();
    const { currentPin, newPin } = body;

    if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
      return NextResponse.json(
        { error: 'New PIN/password must be at least 4 characters.' },
        { status: 400 }
      );
    }

    // Find the admin/owner account
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'Owner account not found in database.' }, { status: 404 });
    }

    // If a session exists and is admin, or verify current PIN
    if (session && session.role === 'ADMIN') {
      if (currentPin) {
        const isMatch = await comparePassword(currentPin, adminUser.passwordHash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Current PIN/password is incorrect.' }, { status: 400 });
        }
      }
    } else {
      // Must verify current PIN if not authenticated
      if (!currentPin) {
        return NextResponse.json(
          { error: 'Current PIN is required to authorize the change.' },
          { status: 401 }
        );
      }
      const isMatch = await comparePassword(currentPin, adminUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current PIN/password is incorrect.' }, { status: 401 });
      }
    }

    // Hash and update the new PIN
    const newHash = await hashPassword(newPin.trim());
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { passwordHash: newHash },
    });

    // Also store a timestamp in siteSettings for audit
    try {
      await prisma.siteSetting.upsert({
        where: { key: 'owner_pin_updated_at' },
        update: { value: new Date().toISOString() },
        create: { key: 'owner_pin_updated_at', value: new Date().toISOString() },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Owner Portal PIN updated successfully! You can now use your new PIN to log in.',
    });
  } catch (error: any) {
    console.error('Error changing owner PIN:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update owner PIN.' },
      { status: 500 }
    );
  }
}
