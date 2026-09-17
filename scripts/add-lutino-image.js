const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const srcFile = 'D:\\pets\\images (6).jpg';
const destFile = path.join(__dirname, '..', 'public', 'images', 'birds', 'bdg-104.jpg');

async function updateLutino() {
  console.log('📦 Copying Sunshine Lutino image images (6).jpg -> /images/birds/bdg-104.jpg...');

  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log('✅ Copied image to public/images/birds/bdg-104.jpg');

    const prisma = new PrismaClient();
    await prisma.bird.updateMany({
      where: { birdCode: 'BDG-104' },
      data: {
        images: JSON.stringify(['/images/birds/bdg-104.jpg']),
      },
    });

    await prisma.$disconnect();
    console.log('🎉 Sunshine Lutino Budgie (BDG-104) updated with user photo!');
  } else {
    console.error('❌ Source file D:\\pets\\images (6).jpg not found!');
  }
}

updateLutino().catch((err) => {
  console.error(err);
  process.exit(1);
});
