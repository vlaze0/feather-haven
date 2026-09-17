const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const petsSourceDir = 'D:\\pets';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Precise mapping of D:\pets files to our database bird codes & variety slugs
const petFilesMap = {
  'BDG-101': 'Draco-Budgie-294x300.webp', // Classic Wild Type Green Budgie
  'BDG-102': 'images.jpg',                 // Yellow-Face Sky Blue Parakeet
  'BDG-103': 'IMG_7764web-300x228.webp',   // Clearwing Cobalt Budgie
  'BDG-105': 'images (1).jpg',             // Albino Snow White Budgie Pearl
  'BDG-106': 'budgie-guide-varieties-and-types-colours-my-little-cutie-whatsapp-image-2019-12-01-at-53357-pm_e31a8a84.jpg', // Opaline
  'BDG-107': 'images (3).jpg',             // Golden Spangle Olive Budgie
  'BDG-108': 'images (4).jpg',             // Harlequin Recessive Pied Budgie
  'BDG-110': 'IMG_6903web-300x187.webp',   // Crested Budgie
  'BDG-111': 'images (5).jpg',             // Jumbo English Exhibition Budgie
  'BDG-112': 'images (2).jpg',             // Pastel Rainbow Mutation Budgerigar
};

async function copyAndSeed() {
  console.log('📦 Copying user pet images from D:\\pets to public/images/birds/...');

  const copiedPathsMap = {};

  for (const [birdCode, filename] of Object.entries(petFilesMap)) {
    const srcFile = path.join(petsSourceDir, filename);
    const ext = path.extname(filename);
    const destFilename = `${birdCode.toLowerCase()}${ext}`;
    const destFile = path.join(targetDir, destFilename);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      const publicPath = `/images/birds/${destFilename}`;
      copiedPathsMap[birdCode] = publicPath;
      console.log(`  ✅ Copied D:\\pets\\${filename} -> ${publicPath}`);
    } else {
      console.warn(`  ⚠️ File not found: D:\\pets\\${filename}`);
    }
  }

  // Update Database records
  console.log('🔄 Updating database records with user pet image paths...');
  const prisma = new PrismaClient();

  for (const [birdCode, imagePath] of Object.entries(copiedPathsMap)) {
    await prisma.bird.updateMany({
      where: { birdCode },
      data: {
        images: JSON.stringify([imagePath]),
      },
    });
  }

  await prisma.$disconnect();
  console.log('🎉 Database successfully updated with D:\\pets user images!');
}

copyAndSeed().catch((err) => {
  console.error('❌ Error copying user pet images:', err);
  process.exit(1);
});
