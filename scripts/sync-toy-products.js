const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sourceDir = 'D:\\pets\\Acce\\toys';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Map of source images to both original name and clean name in public
const toyImages = [
  { src: 'chewing swing.jpg', files: ['chewing swing.jpg', 'toy_chewing_swing.jpg'] },
  { src: 'Dswing.png', files: ['Dswing.png', 'toy_dswing.png'] },
  { src: 'swing.jpg', files: ['swing.jpg', 'toy_two_tier_rope_swing.jpg'] },
  { src: 'swinging.jpg', files: ['swinging.jpg', 'toy_budgie_wooden_swing.jpg'] },
  { src: 'wooden ladder.jpg', files: ['wooden ladder.jpg', 'toy_wooden_ladder_bridge.jpg'] },
];

for (const item of toyImages) {
  const srcPath = path.join(sourceDir, item.src);
  if (fs.existsSync(srcPath)) {
    for (const destFile of item.files) {
      const destPath = path.join(targetDir, destFile);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${item.src} -> /images/products/${destFile}`);
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

  // Define the 5 real toys & swings products
  const toys = [
    {
      name: 'Natural Wooden Chewing Activity Swing & Shredding Toy',
      slug: 'natural-wooden-chewing-activity-swing-shredding-toy',
      categoryId: accessoriesCat.id,
      brand: 'ChirpJoy Natural',
      suitableFor: 'Lovebirds, Cockatiels, Conures, Parakeets & Parrots',
      dimensions: '12 x 10 inches',
      material: 'Natural Hardwood Branches, Wood Slices, Colored Chewing Blocks & Loofah Rings',
      price: 499,
      discountPrice: 399,
      stock: 35,
      isFeatured: true,
      description: 'Multi-functional activity swing featuring natural hardwood branch perches, colorful wood chew blocks, rattan balls, loofah shredding rings, and bells. Encourages healthy beak trimming and satisfies natural chewing and foraging instincts.',
      images: ['/images/products/toy_chewing_swing.jpg'],
    },
    {
      name: 'Arch Wooden Bead Bell Swing with Natural Perch (D-Swing)',
      slug: 'arch-wooden-bead-bell-swing-d-swing',
      categoryId: accessoriesCat.id,
      brand: 'ChirpJoy',
      suitableFor: 'Budgies, Lovebirds, Finches, Canaries & Small Birds',
      dimensions: '8 x 6 inches',
      material: 'Natural Bark Tree Branch Perch, Non-Toxic Colored Wooden Beads, Chime Bells',
      price: 199,
      discountPrice: 149,
      stock: 50,
      isFeatured: true,
      description: 'Classic arch-shaped D-swing crafted with a textured natural bark perch bar, colorful wooden beads, and pleasant chime bells. Perfect for budgies and lovebirds to swing, roost, and exercise foot grip.',
      images: ['/images/products/toy_dswing.png'],
    },
    {
      name: '2-Tier Natural Wood Branch Hanging Rope Perch Swing',
      slug: '2-tier-natural-wood-branch-hanging-rope-perch-swing',
      categoryId: accessoriesCat.id,
      brand: 'AviaryCraft',
      suitableFor: 'Budgies, Cockatiels, Conures & Parrots',
      dimensions: '18 x 8 inches',
      material: 'Natural Hardwood Branch Perches & 100% Organic Cotton Rope with Metal Hanging Carabiner',
      price: 399,
      discountPrice: 299,
      stock: 30,
      isFeatured: true,
      description: 'Two-tier vertical climbing and resting swing crafted with rustic natural branch perches and durable organic cotton rope. Accommodates multiple birds simultaneously and offers great acrobatic exercise.',
      images: ['/images/products/toy_two_tier_rope_swing.jpg'],
    },
    {
      name: 'Wide Budgie & Parakeet Wooden Perch Swing with Colorful Beads',
      slug: 'wide-budgie-parakeet-wooden-perch-swing-colorful-beads',
      categoryId: accessoriesCat.id,
      brand: 'ChirpJoy',
      suitableFor: 'Budgies, Parakeets, Lovebirds & Finches (Flock Friendly)',
      dimensions: '10 x 8 inches',
      material: 'Smooth Natural Wood Perch Dowel, Vibrant Wooden Beads & Dual Metal Cage Hooks',
      price: 249,
      discountPrice: 189,
      stock: 45,
      isFeatured: true,
      description: 'Wide flock-friendly horizontal swing featuring colorful bead suspension bars and dual heavy-duty cage hooks. Wide enough for up to 4 budgies to swing, socialize, and perch together comfortably.',
      images: ['/images/products/toy_budgie_wooden_swing.jpg'],
    },
    {
      name: 'Suspended Wooden Ladder Platform Swing with Metal Chains',
      slug: 'suspended-wooden-ladder-platform-swing-metal-chains',
      categoryId: accessoriesCat.id,
      brand: 'ChirpJoy',
      suitableFor: 'Budgies, Lovebirds, Cockatiels & Small Pets',
      dimensions: '8 x 6 x 8 inches',
      material: 'Natural Wood Ladder Rungs, Colorful Spacer Beads, Rust-Resistant Hanging Chains',
      price: 279,
      discountPrice: 219,
      stock: 40,
      isFeatured: true,
      description: 'Four-chain suspended wooden ladder bridge and platform swing. Provides a fun horizontal climbing, swinging, and perching surface decorated with colorful beads to stimulate agility and balance.',
      images: ['/images/products/toy_wooden_ladder_bridge.jpg'],
    },
  ];

  // Remove old generic placeholder toys if they exist
  const oldSlugs = [
    'interactive-wooden-ladder-bell-swing',
    'colorful-chewing-block-wooden-toy-tower',
  ];
  for (const slug of oldSlugs) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.cartItem.deleteMany({ where: { productId: existing.id } });
      await prisma.orderItem.deleteMany({ where: { productId: existing.id } });
      await prisma.wishlistItem.deleteMany({ where: { productId: existing.id } });
      await prisma.review.deleteMany({ where: { productId: existing.id } });
      await prisma.product.delete({ where: { slug } });
      console.log(`🗑️ Removed old placeholder product: ${slug}`);
    }
  }

  // Upsert the 5 new toys & swings
  for (const toy of toys) {
    const images = toy.images;
    const data = { ...toy };
    delete data.images;

    const existingProduct = await prisma.product.findUnique({
      where: { slug: toy.slug },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { slug: toy.slug },
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
      console.log(`🔄 Updated product: ${toy.name}`);
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

  console.log('🎉 Successfully synced all 5 Toys & Swings products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
