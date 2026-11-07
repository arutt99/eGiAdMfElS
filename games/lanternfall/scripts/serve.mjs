// Small static server used only for previewing during development.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, normalize } from 'node:path';

const port = +(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};
// Only the files the published game is made of.
const ALLOWED = new Set(['/index.html', '/SoundTest.html', '/icon.svg', '/icon-180.png', '/manifest.webmanifest']);

createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (path === '/') path = '/index.html';
    if (!ALLOWED.has(path)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const data = await readFile(new URL(`..${path}`, import.meta.url));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(port, '127.0.0.1', () => console.log(`http://localhost:${port}`));
