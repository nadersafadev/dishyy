const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generatePWAAssets() {
  const publicDir = path.join(process.cwd(), 'public');
  const sourceIcon = path.join(publicDir, 'favicon.svg');

  try {
    const sourceBuffer = await fs.readFile(sourceIcon);

    // Generate PNG icons in different sizes
    const sizes = [192, 512];
    for (const size of sizes) {
      await sharp(sourceBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}.png`));
      console.log(`✓ Generated ${size}x${size} icon`);
    }

    console.log('✓ All PWA assets generated successfully');
  } catch (error) {
    console.error('Error generating PWA assets:', error);
    process.exit(1);
  }
}

generatePWAAssets();
