import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const birdId = searchParams.get('birdId');
    const productId = searchParams.get('productId');
    const all = searchParams.get('all') === 'true';

    const user = getSessionUserFromReq(req);
    const isAdmin = user?.role === 'ADMIN';

    const where: any = {};
    if (!isAdmin || !all) {
      where.isApproved = true;
    }
    if (birdId) where.birdId = birdId;
    if (productId) where.productId = productId;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        bird: { select: { name: true, birdCode: true } },
        product: { select: { name: true } },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUserFromReq(req);
    const { customerName, rating, comment, birdId, productId } = await req.json();

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ error: 'Name, rating, and review comment are required.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId: user ? user.id : null,
        customerName: customerName.trim(),
        rating: parseInt(rating),
        comment: comment.trim(),
        birdId: birdId || null,
        productId: productId || null,
        isApproved: user?.role === 'ADMIN', // Auto-approve if posted by admin
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: user?.role === 'ADMIN' ? 'Review published.' : 'Thank you! Your review has been submitted for admin approval.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getSessionUserFromReq(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { reviewId, isApproved } = await req.json();

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review approval status.' }, { status: 500 });
  }
}
