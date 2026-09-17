const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\pets\\finches';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const finchMap = [
  { birdCode: 'FNC-503', variety: 'Java Sparrow', filename: 'Java Sparrow Java Finch.png', dest: 'fnc_java_sparrow.png' },
  { birdCode: 'FNC-504', variety: 'Owl Finch', filename: 'Owl Finch Double-barred Finch.png', dest: 'fnc_owl_finch.png' },
  { birdCode: 'FNC-505', variety: 'White Finch', filename: 'white finch.jpg', dest: 'fnc_white_finch.jpg' },
];

async function syncFinches() {
  console.log('📦 Syncing 3 Finch user images from D:\\pets\\finches to public/images/birds/...');

  for (const item of finchMap) {
    const src = path.join(sourceDir, item.filename);
    const dest = path.join(targetDir, item.dest);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ Copied: ${item.filename} -> /images/birds/${item.dest}`);
    } else {
      console.warn(`  ⚠️ File missing: ${item.filename}`);
    }
  }

  console.log('🎉 Finch image files synced successfully!');
}

syncFinches().catch(console.error);
