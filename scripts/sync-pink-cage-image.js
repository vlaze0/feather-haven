const fs = require('fs');
const path = require('path');

const src = 'D:\\pets\\Acce\\cage\\2 feet pinnk metal cage.jpg';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const dest = path.join(targetDir, 'cage_2ft_pink.jpg');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Copied 2 feet pink metal cage image to /images/products/cage_2ft_pink.jpg');
} else {
  console.warn('⚠️ Source file missing:', src);
}
