// Small static server used only for previewing during development. Players open Lanternfall.html directly.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = +(process.env.PORT || 4173);
createServer(async (req, res) => {
  try {
    const page = req.url.startsWith('/SoundTest') ? 'SoundTest.html' : 'Lanternfall.html';
    const data = await readFile(new URL(`../${page}`, import.meta.url));
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(port, '127.0.0.1', () => console.log(`http://localhost:${port}`));
