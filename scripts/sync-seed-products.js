const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Copy images
const seedSrc = path.join('D:', 'pets', 'Acce', 'seed', 'AvigrainBudgieMix.jpg');
const seedMixSrc = path.join(
  'D:',
  'pets',
  'Acce',
  'seed_mix',
  '2-9-bird-11-15-types-of-seed-mix-for-budgies-cocktails-and-original-imafd82qn4kxfz7z.webp'
);

if (fs.existsSync(seedSrc)) {
  fs.copyFileSync(seedSrc, path.join(targetDir, 'AvigrainBudgieMix.jpg'));
  fs.copyFileSync(seedSrc, path.join(targetDir, 'seed_avigrain_budgie_mix.jpg'));
  console.log('✅ Copied AvigrainBudgieMix.jpg');
} else {
  console.warn('⚠️ seedSrc not found:', seedSrc);
}

if (fs.existsSync(seedMixSrc)) {
  fs.copyFileSync(
    seedMixSrc,
    path.join(
      targetDir,
      '2-9-bird-11-15-types-of-seed-mix-for-budgies-cocktails-and-original-imafd82qn4kxfz7z.webp'
    )
  );
  fs.copyFileSync(seedMixSrc, path.join(targetDir, 'seed_mix_11_15_grains.webp'));
  console.log('✅ Copied seed_mix image');
} else {
  console.warn('⚠️ seedMixSrc not found:', seedMixSrc);
}

async function main() {
  const foodCat = await prisma.category.findUnique({
    where: { slug: 'food' },
  });

  if (!foodCat) {
    console.error('❌ Food category not found!');
    return;
  }

  // Remove old food placeholders
  const oldFoodSlugs = [
    'royal-budgie-master-seed-blend-1kg',
    'golden-spray-millet-harvest-treats-250g',
    'high-protein-fortified-aviary-pellets-500g',
  ];

  for (const slug of oldFoodSlugs) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.cartItem.deleteMany({ where: { productId: existing.id } });
      await prisma.orderItem.deleteMany({ where: { productId: existing.id } });
      await prisma.wishlistItem.deleteMany({ where: { productId: existing.id } });
      await prisma.review.deleteMany({ where: { productId: existing.id } });
      await prisma.product.delete({ where: { slug } });
      console.log(`🗑️ Removed old food placeholder: ${slug}`);
    }
  }

  // Create or update the 2 new verified products
  const products = [
    {
      name: 'Avigrain Budgie Grain & Seed Diet (1kg)',
      slug: 'avigrain-budgie-grain-seed-diet-1kg',
      categoryId: foodCat.id,
      brand: 'Avigrain',
      suitableFor: 'Budgies, Small Parakeets, Lovebirds & Finches',
      packageWeight: '1 kg',
      ingredients: 'Cleaned French White Millet, Panorama Millet, Panicum, Plain Canary Seed & Red Millet',
      dimensions: '1kg Sealed Barrier Pouch',
      material: '100% Natural Selected Grains',
      price: 299,
      discountPrice: 249,
      stock: 50,
      isFeatured: true,
      description: 'Premium Australian Avigrain style seed blend, triple-cleaned and dust-extracted. High in wholesome natural energy and essential carbs for daily pet bird vitality.',
      images: ['/images/products/seed_avigrain_budgie_mix.jpg'],
    },
    {
      name: '11-in-1 Fortified Multi-Seed Mix for Budgies & Cockatiels (1kg)',
      slug: '11-in-1-fortified-multi-seed-mix-budgies-cockatiels-1kg',
      categoryId: foodCat.id,
      brand: 'Avian Gourmet',
      suitableFor: 'Budgies, Cockatiels, Lovebirds, Conures & Parrots',
      packageWeight: '1 kg',
      ingredients: '11-15 Grains including Striped Sunflower Seeds, Safflower, Whole Oat Groats, Red Millet, Yellow Millet, Flaxseed, Buckwheat & Canary Seed',
      dimensions: '1kg Heavy Moisture-Lock Pouch',
      material: '11 to 15 Whole Seed & Grain Varieties',
      price: 399,
      discountPrice: 329,
      stock: 45,
      isFeatured: true,
      description: 'Specialty fortified multi-seed mix blend combining 11 to 15 diverse grains, sunflower seeds, and groats. Packed with healthy fats, fatty acids, and proteins to support feather luster and overall plumage health.',
      images: ['/images/products/seed_mix_11_15_grains.webp'],
    },
  ];

  for (const prod of products) {
    const images = prod.images;
    const data = { ...prod };
    delete data.images;

    const existingProduct = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { slug: prod.slug },
        data,
      });
      await prisma.productImage.deleteMany({
        where: { productId: existingProduct.id },
      });
      await prisma.productImage.createMany({
        data: images.map((url, idx) => ({
          productId: existingProduct.id,
          url,
          isPrimary: idx === 0,
        })),
      });
      console.log(`🔄 Updated product: ${prod.name}`);
    } else {
      const created = await prisma.product.create({
        data: {
          ...data,
          images: {
            create: images.map((url, idx) => ({
              url,
              isPrimary: idx === 0,
            })),
          },
        },
      });
      console.log(`✨ Created product: ${created.name}`);
    }
  }

  // Update Category image to the real seed mix image
  await prisma.category.update({
    where: { slug: 'food' },
    data: {
      image: '/images/products/seed_mix_11_15_grains.webp',
      description: 'Authentic wholesome bird seeds (seed) and fortified 11-in-1 grain blends (seed_mix).',
    },
  });

  console.log('🎉 Successfully synced bird food products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
