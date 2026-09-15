// Local preview only. Production needs only the static files listed below.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/gloser.js': ['gloser.js', 'text/javascript; charset=utf-8'],
  '/lagring.js': ['lagring.js', 'text/javascript; charset=utf-8'],
  '/gloseoving.svg': ['gloseoving.svg', 'image/svg+xml'],
  '/logo-symbol.svg': ['logo-symbol.svg', 'image/svg+xml']
};
const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const file = files[(req.url || '/').split('?')[0]];
  if (!file) { res.writeHead(404).end('Ikke funnet'); return; }
  try {
    const body = await readFile(new URL(file[0], import.meta.url));
    res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500).end('Kunne ikke lese filen.');
  }
});
server.listen(5173, '127.0.0.1', () => console.log('Gloseøving: http://127.0.0.1:5173'));
