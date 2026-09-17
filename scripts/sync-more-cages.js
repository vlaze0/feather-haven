const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\pets\\Acce\\cage';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const cageFiles = [
  { src: 'small_cage.png', dest: 'cage_small_18x12x15.png' },
  { src: 'stainless steel.jpg', dest: 'cage_stainless_steel.jpg' },
];

for (const item of cageFiles) {
  const srcPath = path.join(sourceDir, item.src);
  const destPath = path.join(targetDir, item.dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${item.src} -> /images/products/${item.dest}`);
  } else {
    console.warn(`⚠️ File missing: ${item.src}`);
  }
}
