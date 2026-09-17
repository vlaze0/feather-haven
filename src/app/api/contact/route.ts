import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, subject, message } = await req.json();

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: 'Name, phone, email, and message are required.' }, { status: 400 });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subject: subject ? subject.trim() : 'General Enquiry',
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true, contactMsg });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit contact enquiry.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getSessionUserFromReq(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact messages.' }, { status: 500 });
  }
}
