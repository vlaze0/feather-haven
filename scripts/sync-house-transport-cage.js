const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\pets\\Acce\\cage';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const cageFiles = [
  { src: 'birds-cages-1000x1000.webp', dest: 'cage_transport_house.webp' },
  { src: 'customised cage.jpg', dest: 'cage_customised_aviary.jpg' },
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
