const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\pets\\Acce\\nest';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const nestFiles = [
  { src: 'Handcrafted Jute Bird Nest for Cages, breeding,.jpg', dest: 'nest_handcrafted_jute.jpg' },
  { src: 'pots.jpg', dest: 'nest_clay_pots.jpg' },
];

for (const item of nestFiles) {
  const srcPath = path.join(sourceDir, item.src);
  const destPath = path.join(targetDir, item.dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${item.src} -> /images/products/${item.dest}`);
  } else {
    console.warn(`⚠️ File missing: ${item.src}`);
  }
}
