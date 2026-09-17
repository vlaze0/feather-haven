const fs = require('fs');
const path = require('path');

const src = 'D:\\pets\\Acce\\cage\\travel-bird-cage-1000x1000.jpg';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const dest = path.join(targetDir, 'cage_pink_travel_1ft.jpg');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Copied pink travel cage image to /images/products/cage_pink_travel_1ft.jpg');
} else {
  console.warn('⚠️ Source file missing:', src);
}
