const fs = require('fs');
const path = require('path');

const src = 'D:\\pets\\Acce\\cage\\customised cage.jpg';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const dest = path.join(targetDir, 'cage_customised_aviary.jpg');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Copied customised cage photo to /images/products/cage_customised_aviary.jpg');
} else {
  console.warn('⚠️ Source file missing:', src);
}
