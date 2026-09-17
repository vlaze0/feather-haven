const fs = require('fs');
const path = require('path');

const src1 = 'D:\\pets\\Helicopter Budgie.png';
const src2 = 'D:\\pets\\Helicopter Budgie(green).png';

const targetDir = path.join(__dirname, '..', 'public', 'images', 'birds');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const dest1 = path.join(targetDir, 'hagoromo_1.png');
const dest2 = path.join(targetDir, 'hagoromo_2.png');

if (fs.existsSync(src1)) {
  fs.copyFileSync(src1, dest1);
  console.log('✅ Copied Helicopter Budgie.png -> /images/birds/hagoromo_1.png');
} else {
  console.warn('⚠️ Source 1 not found:', src1);
}

if (fs.existsSync(src2)) {
  fs.copyFileSync(src2, dest2);
  console.log('✅ Copied Helicopter Budgie(green).png -> /images/birds/hagoromo_2.png');
} else {
  console.warn('⚠️ Source 2 not found:', src2);
}
