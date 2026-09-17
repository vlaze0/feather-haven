import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const productRaw = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      category: true,
      images: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!productRaw) {
    notFound();
  }

  const product = {
    ...productRaw,
    createdAt: productRaw.createdAt.toISOString(),
  };

  // Fetch related products in same category
  const relatedProductsRaw = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true, images: true },
    take: 4,
  });

  const relatedProducts = relatedProductsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
