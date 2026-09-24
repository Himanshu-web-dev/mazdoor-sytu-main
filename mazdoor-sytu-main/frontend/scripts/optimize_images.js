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

  // 2. Anandiben Patel Event Photo
  const eventInput = path.join(publicDir, 'anandiben-patel-event.jpg');
  const eventOutput = path.join(publicDir, 'anandiben-patel-event.webp');
  if (fs.existsSync(eventInput)) {
    await sharp(eventInput)
      .resize(900, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(eventOutput);
    const inSize = fs.statSync(eventInput).size;
    const outSize = fs.statSync(eventOutput).size;
    console.log(`Event photo: ${inSize} bytes -> ${outSize} bytes (Saved ${Math.round((1 - outSize / inSize) * 100)}%)`);
  }

  // 3. Team Portraits
  const portraits = [
    'founder-ceo-portrait.jpg',
    'cofounder-cmo-portrait.jpg',
    'director-cto-portrait.jpg'
  ];

  for (const file of portraits) {
    const pInput = path.join(publicDir, file);
    const pOutput = path.join(publicDir, file.replace('.jpg', '.webp'));
    if (fs.existsSync(pInput)) {
      await sharp(pInput)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 82, effort: 6 })
        .toFile(pOutput);
      const inSize = fs.statSync(pInput).size;
      const outSize = fs.statSync(pOutput).size;
      console.log(`${file}: ${inSize} bytes -> ${outSize} bytes (Saved ${Math.round((1 - outSize / inSize) * 100)}%)`);
    }
  }

  console.log('Image optimization complete!');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
