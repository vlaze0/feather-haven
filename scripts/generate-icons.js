const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create a high-res SVG icon for Feather Haven: Emerald rounded square with bird silhouette
function getSvg(size) {
  const padding = size * 0.15;
  const radius = size * 0.22;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#059669" />
        <stop offset="100%" stop-color="#0d9488" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="${size * 0.03}" stdDeviation="${size * 0.04}" flood-opacity="0.25" />
      </filter>
    </defs>
    <!-- Background rounded rect -->
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#grad)" />
    
    <!-- Bird Icon centered -->
    <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size * 0.025})" fill="white" filter="url(#shadow)">
      <!-- Lucide Bird vector path -->
      <path d="M16 7h.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="m20 7 2 .5-2 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 18v3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 17.75V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 18a6 6 0 0 0 3.84-10.61" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  `;
}

async function makeIcons() {
  const publicDir = path.join(__dirname, '..', 'public');

  for (const size of [192, 512]) {
    const svg = Buffer.from(getSvg(size));
    const outPath = path.join(publicDir, `icon-${size}.png`);
    await sharp(svg).png().toFile(outPath);
    console.log(`Generated ${outPath}`);
  }
}

makeIcons().catch(console.error);
