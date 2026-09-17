import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const categorySlug = searchParams.get('category')?.trim();
    const featured = searchParams.get('featured') === 'true';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { suitableFor: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categorySlug && categorySlug !== 'ALL') {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUserFromReq(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin permissions required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      categoryId,
      brand,
      suitableFor,
      packageWeight,
      ingredients,
      dimensions,
      material,
      price,
      discountPrice,
      stock,
      description,
      isFeatured,
      images, // array of URL strings
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Product name, category, and price are required.' }, { status: 400 });
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(Math.random() * 1000);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        categoryId,
        brand: brand ? brand.trim() : null,
        suitableFor: suitableFor ? suitableFor.trim() : null,
        packageWeight: packageWeight ? packageWeight.trim() : null,
        ingredients: ingredients ? ingredients.trim() : null,
        dimensions: dimensions ? dimensions.trim() : null,
        material: material ? material.trim() : null,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: stock !== undefined ? parseInt(stock) : 10,
        description: description || '',
        isFeatured: isFeatured || false,
        images: {
          create: Array.isArray(images)
            ? images.map((url: string, idx: number) => ({
                url,
                isPrimary: idx === 0,
              }))
            : [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}
