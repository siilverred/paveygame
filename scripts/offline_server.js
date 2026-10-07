import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import QRCode from 'qrcode';

const PORT = 5174;
const distDir = path.resolve('dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
};

// Find local IPv4 address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const localUrl = `http://${localIp}:${PORT}/`;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(distDir, reqPath);

  // If path doesn't exist, fallback to index.html (SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', async () => {
  console.log('\n======================================================');
  console.log('🚀 PAVEY OFFLINE WI-FI SERVER ACTIVE! (ZERO INTERNET)');
  console.log('======================================================\n');
  console.log(`📡 URL Lokal Game: ${localUrl}`);
  console.log('\n📱 CARA PENGUNJUNG/HP LAIN MAIN TANPA INTERNET:');
  console.log('1. Nyalakan Hotspot Pribadi di Laptop/HP Anda (Tanpa kuota internet).');
  console.log('2. Sambungkan Wi-Fi HP pengunjung ke Hotspot Anda.');
  console.log(`3. Di browser HP pengunjung, buka: ${localUrl}`);
  console.log('   ATAU scan QR code di bawah ini:\n');

  try {
    const qrTerminal = await QRCode.toString(localUrl, { type: 'terminal', small: true });
    console.log(qrTerminal);
  } catch (e) {
    // ignore
  }

  console.log('\nGame siap dimainkan 100% offline oleh device mana pun!');
  console.log('Tekan Ctrl+C untuk menghentikan server.\n');
});
