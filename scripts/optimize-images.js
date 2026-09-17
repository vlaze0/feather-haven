const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, '..', 'public', 'images', 'birds'),
  path.join(__dirname, '..', 'public', 'images', 'products'),
];

async function optimizeFolder(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await optimizeFolder(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

    // Only process files larger than 150KB
    if (stat.size < 150 * 1024) continue;

    try {
      const originalSizeMB = (stat.size / 1024 / 1024).toFixed(2);
      const buffer = fs.readFileSync(fullPath);

      let pipeline = sharp(buffer).resize({
        width: 800,
        height: 800,
        fit: 'inside',
        withoutEnlargement: true,
      });

      let outputBuffer;
      if (ext === '.png') {
        outputBuffer = await pipeline
          .png({ quality: 82, compressionLevel: 9, effort: 8 })
          .toBuffer();
      } else if (ext === '.webp') {
        outputBuffer = await pipeline
          .webp({ quality: 82 })
          .toBuffer();
      } else {
        outputBuffer = await pipeline
          .jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toBuffer();
      }

      // If compressed size is smaller, overwrite
      if (outputBuffer.length < stat.size) {
        fs.writeFileSync(fullPath, outputBuffer);
        const newSizeKB = (outputBuffer.length / 1024).toFixed(1);
        console.log(`Optimized ${file}: ${originalSizeMB} MB -> ${newSizeKB} KB (${Math.round((1 - outputBuffer.length / stat.size) * 100)}% smaller)`);
      }
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err.message);
    }
  }
}

async function run() {
  console.log('🚀 Starting image optimization with Sharp...');
  for (const dir of targetDirs) {
    await optimizeFolder(dir);
  }
  console.log('✅ Image optimization complete!');
}

run();
