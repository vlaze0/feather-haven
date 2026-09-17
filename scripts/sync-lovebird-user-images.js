const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const sourceDir = 'D:\\pets\\love birds';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 17 Lovebird Varieties with exact matching files in D:\pets\love birds
const lovebirdsMap = [
  { birdCode: 'LVB-201', variety: 'Peach-faced', filename: 'Peach-faced Lovebird.png', dest: 'lvb_peach_faced.png' },
  { birdCode: 'LVB-202', variety: 'Fischer’s', filename: 'Fischer’s Lovebird.png', dest: 'lvb_fischers.png' },
  { birdCode: 'LVB-203', variety: 'Masked', filename: 'Masked Lovebird.png', dest: 'lvb_masked.png' },
  { birdCode: 'LVB-205', variety: 'Lutino', filename: 'Lutino Lovebird.png', dest: 'lvb_lutino.png' },
  { birdCode: 'LVB-206', variety: 'Albino', filename: 'Albino Lovebird.png', dest: 'lvb_albino.png' },
  { birdCode: 'LVB-207', variety: 'Creamino', filename: 'Creamino Lovebird.png', dest: 'lvb_creamino.png' },
  { birdCode: 'LVB-208', variety: 'Blue', filename: 'Blue Lovebird.png', dest: 'lvb_blue.png' },
  { birdCode: 'LVB-209', variety: 'Cobalt Blue', filename: 'Cobalt Blue Lovebird.png', dest: 'lvb_cobalt_blue.png' },
  { birdCode: 'LVB-210', variety: 'Violet', filename: 'Violet Lovebird.png', dest: 'lvb_violet.png' },
  { birdCode: 'LVB-212', variety: 'Pied', filename: 'Pied Lovebird.png', dest: 'lvb_pied.png' },
  { birdCode: 'LVB-213', variety: 'Opaline', filename: 'Opaline Lovebird.png', dest: 'lvb_opaline.png' },
  { birdCode: 'LVB-214', variety: 'Cinnamon', filename: 'Cinnamon Lovebird.png', dest: 'lvb_cinnamon.png' },
  { birdCode: 'LVB-215', variety: 'Seagreen', filename: 'Seagreen Lovebird.png', dest: 'lvb_seagreen.png' },
  { birdCode: 'LVB-216', variety: 'Turquoise', filename: 'Turquoise Lovebird.png', dest: 'lvb_turquoise.png' },
  { birdCode: 'LVB-217', variety: 'Whiteface', filename: 'Whiteface Lovebird.png', dest: 'lvb_whiteface.png' },
  { birdCode: 'LVB-218', variety: 'Orange-face', filename: 'Orange-face Lovebird.png', dest: 'lvb_orange_face.png' },
  { birdCode: 'LVB-220', variety: 'Yellow-faced', filename: 'Yellow-faced Lovebird.png', dest: 'lvb_yellow_faced.png' },
];

async function syncLovebirds() {
  console.log('📦 Syncing 17 Lovebird user images from D:\\pets\\love birds to public/images/birds/...');

  for (const item of lovebirdsMap) {
    const src = path.join(sourceDir, item.filename);
    const dest = path.join(targetDir, item.dest);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ Copied: ${item.filename} -> /images/birds/${item.dest}`);
    } else {
      console.warn(`  ⚠️ File missing: ${item.filename}`);
    }
  }

  console.log('🎉 Lovebird image files synced successfully!');
}

syncLovebirds().catch(console.error);
