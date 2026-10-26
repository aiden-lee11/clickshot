import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png' };
const publicFiles = new Set(['/index.html', '/app.js', '/style.css', '/stage-two.css', '/plywood.css', '/mount-plan.md', '/plywood-mount-plan.md']);
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
const server = http.createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const pathname = path.posix.normalize(requested === '/' ? '/index.html' : requested);
    const threeAsset = pathname.startsWith('/node_modules/three/build/') || pathname.startsWith('/node_modules/three/examples/jsm/');
    if (!publicFiles.has(pathname) && !(threeAsset && pathname.endsWith('.js'))) {
      res.writeHead(404); return res.end('Not found');
    }
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.env.PORT || 4173), host, () => console.log(`Clickshot demo listening on http://${host}:${server.address().port}`));
