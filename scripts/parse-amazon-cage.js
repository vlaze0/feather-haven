const fs = require('fs');
const path = require('path');

const contentPath = path.join('C:', 'Users', 'HP', '.gemini', 'antigravity', 'brain', '81ee2328-371b-4ac7-bbff-4932c739d220', '.system_generated', 'steps', '897', 'content.md');

if (fs.existsSync(contentPath)) {
  const html = fs.readFileSync(contentPath, 'utf8');
  
  // Extract Title
  const titleMatch = html.match(/<span id="productTitle"[^>]*>([\s\S]*?)<\/span>/i);
  if (titleMatch) {
    console.log('📌 Title:', titleMatch[1].trim());
  } else {
    const metaTitle = html.match(/<title>([\s\S]*?)<\/title>/i);
    console.log('📌 Meta Title:', metaTitle ? metaTitle[1].trim() : 'Not found');
  }

  // Extract Price
  const priceMatch = html.match(/class="a-price-whole">([\s\S]*?)<\/span>/i);
  if (priceMatch) {
    console.log('💰 Price:', priceMatch[1].trim());
  }

  // Extract Bullet points
  const bulletMatches = html.match(/<span class="a-list-item">([\s\S]*?)<\/span>/g);
  if (bulletMatches) {
    console.log('📝 Sample bullets:');
    bulletMatches.slice(0, 10).forEach(b => {
      const text = b.replace(/<[^>]+>/g, '').trim();
      if (text.length > 5 && !text.includes('Amazon') && !text.includes('javascript')) {
        console.log('  -', text);
      }
    });
  }
}
