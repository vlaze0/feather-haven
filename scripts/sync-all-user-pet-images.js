const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const petsSourceDir = 'D:\\pets';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Complete mapping of D:\pets files to bird codes
const petFilesMap = {
  'BDG-101': 'Draco-Budgie-294x300.webp',        // Normal Green
  'BDG-102': 'Yellowface Budgie.png',            // Yellowface
  'BDG-103': 'Clearwing Budgie.png',             // Clearwing
  'BDG-104': 'images (6).jpg',                  // Lutino
  'BDG-105': 'Albino.png',                      // Albino
  'BDG-106': 'Opaline Budgie.png',               // Opaline
  'BDG-107': 'Spangle Budgie.png',               // Spangle
  'BDG-108': 'Pied Budgie.png',                  // Pied
  'BDG-109': 'Cinnamon Budgie.png',              // Cinnamon
  'BDG-110': 'IMG_6903web-300x187.webp',        // Crested
  'BDG-111': 'images (5).jpg',                  // English Exhibition
  'BDG-112': 'rainbow.jpg',                     // Rainbow
  'BDG-113': 'images.jpg',                      // Sky Blue
  'BDG-114': 'IMG_7764web-300x228.webp',        // Cobalt Blue
  'BDG-115': 'images (5).jpg',                  // Mauve
  'BDG-116': 'images (4).jpg',                  // Violet
  'BDG-117': 'grey.png',                        // Grey
  'BDG-118': 'Greywing Budgie.png',             // Greywing
  'BDG-119': 'Dilute Budgie.png',               // Dilute
  'BDG-120': 'Goldenface Budgie.png',           // Goldenface
  'BDG-121': 'Texas Clearbody Budgie.png',       // Texas Clearbody
  'BDG-122': 'images (6).jpg',                  // Lacewing
};

async function syncImages() {
  console.log('📦 Syncing all user pet images from D:\\pets to public/images/birds/...');

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
  console.log('🔄 Updating SQLite dev.db records with user pet image paths...');
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
  console.log('🎉 Database successfully updated with all user pet images from D:\\pets!');
}

syncImages().catch((err) => {
  console.error('❌ Error syncing pet images:', err);
  process.exit(1);
});
