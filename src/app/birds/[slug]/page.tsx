import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BirdDetailClient from './BirdDetailClient';

export const revalidate = 0;

export default async function BirdDetailPage({ params }: { params: { slug: string } }) {
  const birdRaw = await prisma.bird.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }, { birdCode: params.slug }],
    },
    include: {
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!birdRaw) {
    notFound();
  }

  let parsedImages: string[] = [];
  try {
    parsedImages = typeof birdRaw.images === 'string' ? JSON.parse(birdRaw.images) : birdRaw.images;
  } catch (e) {
    parsedImages = [birdRaw.images];
  }

  const bird = {
    ...birdRaw,
    images: parsedImages,
    createdAt: birdRaw.createdAt.toISOString(),
  };

  // Fetch recommended products suitable for this bird category
  const recommendedProductsRaw = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true, images: true },
    take: 4,
  });

  const recommendedProducts = recommendedProductsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return <BirdDetailClient bird={bird as any} recommendedProducts={recommendedProducts as any} />;
}
