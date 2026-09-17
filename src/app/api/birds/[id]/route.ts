import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const bird = await prisma.bird.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { birdCode: id }],
      },
      include: {
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!bird) {
      return NextResponse.json({ error: 'Bird not found.' }, { status: 404 });
    }

    return NextResponse.json({ bird });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch bird details.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getSessionUserFromReq(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin permissions required.' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    if (body.images && typeof body.images !== 'string') {
      body.images = JSON.stringify(body.images);
    }
    if (body.price) {
      body.price = parseFloat(body.price);
    }

    const updatedBird = await prisma.bird.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, bird: updatedBird });
  } catch (error: any) {
    console.error('Error updating bird:', error);
    return NextResponse.json({ error: 'Failed to update bird.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getSessionUserFromReq(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin permissions required.' }, { status: 403 });
    }

    const { id } = params;
    await prisma.bird.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Bird deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete bird.' }, { status: 500 });
  }
}
