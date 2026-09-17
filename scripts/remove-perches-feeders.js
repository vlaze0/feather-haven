const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slugs = [
    'natural-grapevine-wooden-perch-set-of-2',
    'spill-proof-clear-seed-feeder-box',
    'automatic-gravity-bird-water-drinker-fountain',
  ];

  for (const slug of slugs) {
    const item = await prisma.product.findUnique({ where: { slug } });
    if (item) {
      await prisma.productImage.deleteMany({ where: { productId: item.id } });
      await prisma.cartItem.deleteMany({ where: { productId: item.id } });
      await prisma.orderItem.deleteMany({ where: { productId: item.id } });
      await prisma.wishlistItem.deleteMany({ where: { productId: item.id } });
      await prisma.review.deleteMany({ where: { productId: item.id } });
      await prisma.product.delete({ where: { slug } });
      console.log(`🗑️ Successfully deleted placeholder product: ${slug}`);
    } else {
      console.log(`ℹ️ Product ${slug} not found or already deleted.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
