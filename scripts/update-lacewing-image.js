const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const srcFile = 'D:\\pets\\Sunshine Lacewing Yellow Budgie.png';
const destFile = path.join(__dirname, '..', 'public', 'images', 'birds', 'bdg-122.png');

async function updateLacewing() {
  console.log('📦 Copying Sunshine Lacewing image Sunshine Lacewing Yellow Budgie.png -> /images/birds/bdg-122.png...');

  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log('✅ Copied image to public/images/birds/bdg-122.png');

    const prisma = new PrismaClient();
    await prisma.bird.updateMany({
      where: { birdCode: 'BDG-122' },
      data: {
        images: JSON.stringify(['/images/birds/bdg-122.png']),
      },
    });

    await prisma.$disconnect();
    console.log('🎉 Sunshine Lacewing Yellow Budgie (BDG-122) updated with user photo!');
  } else {
    console.error('❌ Source file not found:', srcFile);
  }
}

updateLacewing().catch((err) => {
  console.error(err);
  process.exit(1);
});
