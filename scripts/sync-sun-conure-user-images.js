const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\pets\\Sun Conure';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const conureMap = [
  { birdCode: 'SNC-401', variety: 'Normal', filename: 'Normal Sun Conure.png', dest: 'snc_normal.png' },
  { birdCode: 'SNC-402', variety: 'High Yellow', filename: 'High Yellow Sun Conure.png', dest: 'snc_high_yellow.png' },
  { birdCode: 'SNC-403', variety: 'Pied', filename: 'Pied Sun Conure.png', dest: 'snc_pied.png' },
  { birdCode: 'SNC-404', variety: 'White-beak Pied', filename: 'White-beak Pied Sun Conure.png', dest: 'snc_white_beak_pied.png' },
  { birdCode: 'SNC-405', variety: 'Yellow Pied', filename: 'Yellow Yellow Pied Sun Conure.png', dest: 'snc_yellow_pied.png' },
];

async function syncConures() {
  console.log('📦 Syncing 5 Sun Conure user images from D:\\pets\\Sun Conure to public/images/birds/...');

  for (const item of conureMap) {
    const src = path.join(sourceDir, item.filename);
    const dest = path.join(targetDir, item.dest);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ Copied: ${item.filename} -> /images/birds/${item.dest}`);
    } else {
      console.warn(`  ⚠️ File missing: ${item.filename}`);
    }
  }

  console.log('🎉 Sun Conure image files synced successfully!');
}

syncConures().catch(console.error);
