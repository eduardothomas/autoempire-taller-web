// Servidor estático mínimo para ver el sitio en local, sin dependencias.
// Uso: node scripts/servidor.mjs [carpeta]   (por defecto: public)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const raiz = resolve(process.argv[2] || 'public');
const puerto = Number(process.env.PORT) || 5173;
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let archivo = normalize(join(raiz, ruta));
  if (!archivo.startsWith(raiz)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(archivo)).isDirectory()) archivo = join(archivo, 'index.html');
    const cuerpo = await readFile(archivo);
    res.writeHead(200, { 'Content-Type': tipos[extname(archivo)] || 'application/octet-stream' });
    res.end(cuerpo);
  } catch {
    const noEncontrado = await readFile(join(raiz, '404.html')).catch(() => 'No encontrado');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(noEncontrado);
  }
}).listen(puerto, () => {
  console.log(`Sitio en http://localhost:${puerto} (sirviendo ${raiz})`);
});
