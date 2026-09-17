import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const species = searchParams.get('species')?.trim();
    const status = searchParams.get('status')?.trim();
    const gender = searchParams.get('gender')?.trim();
    const color = searchParams.get('color')?.trim();
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { species: { contains: search } },
        { birdCode: { contains: search } },
        { color: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (species && species !== 'ALL') {
      where.species = { contains: species };
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (gender && gender !== 'ALL') {
      where.gender = gender;
    }

    if (color && color !== 'ALL') {
      where.color = { contains: color };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const birds = await prisma.bird.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ birds });
  } catch (error: any) {
    console.error('Error fetching birds:', error);
    return NextResponse.json({ error: 'Failed to fetch birds.' }, { status: 500 });
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
      birdCode,
      name,
      slug,
      species,
      color,
      age,
      gender,
      price,
      status,
      healthStatus,
      healthInfo,
      careLevel,
      dietRecommendation,
      temperament,
      description,
      images,
      isDeliveryAllowed,
    } = body;

    if (!birdCode || !name || !species || !price) {
      return NextResponse.json({ error: 'Bird code, name, species, and price are required.' }, { status: 400 });
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(Math.random() * 1000);

    const bird = await prisma.bird.create({
      data: {
        birdCode: birdCode.trim(),
        name: name.trim(),
        slug: generatedSlug,
        species: species.trim(),
        color: color ? color.trim() : 'Various',
        age: age ? age.trim() : 'Young',
        gender: gender ? gender.trim() : 'Unknown',
        price: parseFloat(price),
        status: status || 'AVAILABLE',
        healthStatus: healthStatus || 'Healthy',
        healthInfo: healthInfo || null,
        careLevel: careLevel || 'Beginner Friendly',
        dietRecommendation: dietRecommendation || null,
        temperament: temperament || null,
        description: description || '',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        isDeliveryAllowed: isDeliveryAllowed !== undefined ? isDeliveryAllowed : true,
      },
    });

    return NextResponse.json({ success: true, bird });
  } catch (error: any) {
    console.error('Error creating bird:', error);
    return NextResponse.json({ error: error.message || 'Failed to create bird.' }, { status: 500 });
  }
}
