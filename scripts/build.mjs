// Build: copia public/ a dist/ y verifica que el sitio no tenga referencias rotas.
// Falla (código 1) si falta un archivo local referenciado o si el JSON-LD no es válido.
import { cp, readFile, rm, access } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGEN = 'public';
const DESTINO = 'dist';
const errores = [];

const html = await readFile(join(ORIGEN, 'index.html'), 'utf8');

// 1. Archivos locales referenciados en src/href
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
const locales = refs.filter((r) => !/^(https?:|mailto:|tel:|#|data:)/.test(r));
for (const ref of new Set(locales)) {
  try {
    await access(join(ORIGEN, ref.split(/[?#]/)[0]));
  } catch {
    errores.push(`Falta el archivo referenciado: ${ref}`);
  }
}

// 2. Anclas internas que apuntan a ids existentes
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const ancla of new Set(refs.filter((r) => r.startsWith('#') && r.length > 1))) {
  if (!ids.has(ancla.slice(1))) errores.push(`Ancla sin destino: ${ancla}`);
}

// 3. Datos estructurados válidos
for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try {
    JSON.parse(json);
  } catch (e) {
    errores.push(`JSON-LD inválido: ${e.message}`);
  }
}

if (errores.length) {
  console.error(errores.map((e) => `✗ ${e}`).join('\n'));
  process.exit(1);
}

await rm(DESTINO, { recursive: true, force: true });
await cp(ORIGEN, DESTINO, { recursive: true });
console.log(`✓ Build listo en ${DESTINO}/ (${locales.length} referencias locales verificadas, ${ids.size} ids)`);
