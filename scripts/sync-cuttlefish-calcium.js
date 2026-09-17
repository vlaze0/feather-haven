const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sourceDir = 'D:\\pets\\Acce\\cattle fish and calcium';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const items = [
  {
    src: 'calcium-for-birds-500x500.webp',
    dests: ['calcium-for-birds-500x500.webp', 'cuttlefish_bone_natural.webp'],
  },
  {
    src: 'hanging-calcium-block-for-pet-birds-essential-mineral-supplement.jpg',
    dests: [
      'hanging-calcium-block-for-pet-birds-essential-mineral-supplement.jpg',
      'hanging_calcium_mineral_block.jpg',
    ],
  },
];

for (const item of items) {
  const srcPath = path.join(sourceDir, item.src);
  if (fs.existsSync(srcPath)) {
    for (const dest of item.dests) {
      const destPath = path.join(targetDir, dest);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${item.src} -> /images/products/${dest}`);
    }
  } else {
    console.warn(`⚠️ Source file not found: ${srcPath}`);
  }
}

async function main() {
  const accessoriesCat = await prisma.category.findUnique({
    where: { slug: 'accessories' },
  });

  if (!accessoriesCat) {
    console.error('❌ Accessories category not found!');
    return;
  }

  const products = [
    {
      name: 'Pure Natural Cuttlefish Bone for Birds (Pack of 4)',
      slug: 'pure-natural-cuttlefish-bone-for-birds-pack-of-4',
      categoryId: accessoriesCat.id,
      brand: 'FeatherNourish Natural',
      suitableFor: 'Budgies, Cockatiels, Lovebirds, Finches, Canaries & Parrots',
      packageWeight: '4 Whole Natural Cuttlefish Bones with Metal Holders',
      ingredients: '100% Pure Natural Sun-Dried Cuttlefish Bone (Organic Calcium & Minerals)',
      dimensions: '6 to 8 inches each',
      material: '100% Organic Cuttlefish Bone',
      price: 199,
      discountPrice: 149,
      stock: 60,
      isFeatured: true,
      description: '100% natural, sun-dried pure cuttlefish bones. An essential organic source of bio-available calcium, phosphorus, and trace minerals for eggshell formation, strong bones, and healthy natural beak trimming.',
      images: ['/images/products/cuttlefish_bone_natural.webp'],
    },
    {
      name: 'Hanging Mineral Calcium Block for Pet Birds with Cage Clip',
      slug: 'hanging-mineral-calcium-block-for-pet-birds-cage-clip',
      categoryId: accessoriesCat.id,
      brand: 'FeatherNourish',
      suitableFor: 'Budgies, Lovebirds, Cockatiels, Finches & Small Pet Birds',
      packageWeight: '120g Molded Calcium Cup',
      ingredients: 'Calcium Carbonate, Shell Grit, Essential Trace Minerals & Natural Binder',
      dimensions: '3 x 3 x 2.5 inches with Hanging Clip',
      material: 'Mineral Calcium Block with Cage Bar Clip',
      price: 149,
      discountPrice: 99,
      stock: 50,
      isFeatured: true,
      description: 'Fluted hanging calcium and mineral supplement block with built-in attachment hook for easy cage bar mounting. Enriched with calcium, minerals, and grit for healthy beak conditioning and vitality.',
      images: ['/images/products/hanging_calcium_mineral_block.jpg'],
    },
  ];

  // Remove old generic cuttlefish placeholder if it exists
  const oldPlaceholderSlug = 'pure-cuttlefish-calcium-bone-pack-of-3';
  const oldProd = await prisma.product.findUnique({
    where: { slug: oldPlaceholderSlug },
  });
  if (oldProd) {
    await prisma.productImage.deleteMany({ where: { productId: oldProd.id } });
    await prisma.cartItem.deleteMany({ where: { productId: oldProd.id } });
    await prisma.orderItem.deleteMany({ where: { productId: oldProd.id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: oldProd.id } });
    await prisma.review.deleteMany({ where: { productId: oldProd.id } });
    await prisma.product.delete({ where: { slug: oldPlaceholderSlug } });
    console.log(`🗑️ Removed old placeholder product: ${oldPlaceholderSlug}`);
  }

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

  console.log('🎉 Successfully synced Cuttlefish & Calcium products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
