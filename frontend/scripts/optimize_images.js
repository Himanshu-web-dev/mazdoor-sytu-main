import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

async function optimizeImages() {
  console.log('Optimizing images in:', publicDir);

  // 1. Official Logo (resize to 160x160 with high quality webp, perfect for retina 38-80px display)
  const logoInput = path.join(publicDir, 'official-logo.png');
  const logoOutput = path.join(publicDir, 'official-logo.webp');
  if (fs.existsSync(logoInput)) {
    await sharp(logoInput)
      .resize(160, 160, { fit: 'inside' })
      .webp({ quality: 85, effort: 6 })
      .toFile(logoOutput);
    const inSize = fs.statSync(logoInput).size;
    const outSize = fs.statSync(logoOutput).size;
    console.log(`Logo: ${inSize} bytes -> ${outSize} bytes (Saved ${Math.round((1 - outSize / inSize) * 100)}%)`);
  }

  console.log('Image optimization complete!');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
