import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

async function buildSingleFile() {
  console.log('Building standalone single-file HTML...');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found. Run npm run build first.');
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Find and inline CSS
  const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
  if (cssMatch) {
    const cssRelPath = cssMatch[1].replace(/^\//, '');
    const cssFullPath = path.join(distDir, cssRelPath);
    if (fs.existsSync(cssFullPath)) {
      const cssContent = fs.readFileSync(cssFullPath, 'utf8');
      html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
      console.log('Inlined CSS:', cssRelPath);
    }
  }

  // 2. Find and inline JS
  const jsMatch = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
  if (jsMatch) {
    const jsRelPath = jsMatch[1].replace(/^\//, '');
    const jsFullPath = path.join(distDir, jsRelPath);
    if (fs.existsSync(jsFullPath)) {
      let jsContent = fs.readFileSync(jsFullPath, 'utf8');
      
      // Replace absolute asset paths in JS with base64 data URIs
      const mascotPath = path.join(distDir, 'mascot.svg');
      if (fs.existsSync(mascotPath)) {
        const mascotBase64 = 'data:image/svg+xml;base64,' + fs.readFileSync(mascotPath).toString('base64');
        jsContent = jsContent.replaceAll('"/mascot.svg"', `"${mascotBase64}"`);
        jsContent = jsContent.replaceAll("'/mascot.svg'", `'${mascotBase64}'`);
      }

      const faviconPath = path.join(distDir, 'favicon.svg');
      if (fs.existsSync(faviconPath)) {
        const faviconBase64 = 'data:image/svg+xml;base64,' + fs.readFileSync(faviconPath).toString('base64');
        jsContent = jsContent.replaceAll('"/favicon.svg"', `"${faviconBase64}"`);
        jsContent = jsContent.replaceAll("'/favicon.svg'", `'${faviconBase64}'`);
      }

      html = html.replace(jsMatch[0], `<script type="module">\n${jsContent}\n</script>`);
      console.log('Inlined JS:', jsRelPath);
    }
  }

  const outPath = path.join(distDir, 'pavey-game-offline.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('SUCCESS! Standalone single-file HTML saved to:', outPath);
}

buildSingleFile().catch(console.error);
