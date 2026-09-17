const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\pets\\Cockatiel';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const cockatielMap = [
  { birdCode: 'CKT-301', variety: 'Lutino', filename: 'Lutino Cockatiel.png', dest: 'ckt_lutino.png' },
  { birdCode: 'CKT-302', variety: 'Normal Grey', filename: 'Normal Grey Cockatiel.png', dest: 'ckt_normal_grey.png' },
  { birdCode: 'CKT-303', variety: 'Pearl', filename: 'Pearl Cockatiel.png', dest: 'ckt_pearl.png' },
  { birdCode: 'CKT-304', variety: 'Pied', filename: 'Pied Cockatiel.png', dest: 'ckt_pied.png' },
  { birdCode: 'CKT-305', variety: 'Albino Whiteface', filename: 'Albino Whiteface Lutino Cockatiel.png', dest: 'ckt_albino_whiteface.png' },
];

async function syncCockatiels() {
  console.log('📦 Syncing 5 Cockatiel user images from D:\\pets\\Cockatiel to public/images/birds/...');

  for (const item of cockatielMap) {
    const src = path.join(sourceDir, item.filename);
    const dest = path.join(targetDir, item.dest);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ Copied: ${item.filename} -> /images/birds/${item.dest}`);
    } else {
      console.warn(`  ⚠️ File missing: ${item.filename}`);
    }
  }

  console.log('🎉 Cockatiel image files synced successfully!');
}

syncCockatiels().catch(console.error);
