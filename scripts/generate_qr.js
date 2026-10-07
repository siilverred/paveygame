import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const VERCEL_URL = 'https://game-eosin-omega-76.vercel.app/';
const outputDir = path.resolve('public');

async function generate() {
  console.log('Generating QR code for:', VERCEL_URL);

  // 1. Generate SVG with High Error Correction (level H allows center logo overlay)
  const svgString = await QRCode.toString(VERCEL_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#172A8C', // Pavey Brand Deep Blue
      light: '#FFFFFF',
    },
  });

  const svgPath = path.join(outputDir, 'qr-game.svg');
  fs.writeFileSync(svgPath, svgString);
  console.log('Saved SVG to:', svgPath);

  // 2. Generate High-Res PNG (1024px) for booth posters / mobile scan
  const pngPath = path.join(outputDir, 'qr-game.png');
  await QRCode.toFile(pngPath, VERCEL_URL, {
    type: 'png',
    errorCorrectionLevel: 'H',
    width: 1024,
    margin: 2,
    color: {
      dark: '#172A8C',
      light: '#FFFFFF',
    },
  });
  console.log('Saved PNG to:', pngPath);
}

generate().catch(console.error);
