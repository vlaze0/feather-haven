const fs = require('fs');
const path = require('path');

const src = 'D:\\pets\\Acce\\cage\\meduium cage.png';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const dest = path.join(targetDir, 'cage_medium_30x18x24.png');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Copied medium cage image to /images/products/cage_medium_30x18x24.png');
} else {
  console.warn('⚠️ Source file missing:', src);
}
