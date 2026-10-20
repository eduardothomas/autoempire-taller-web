# Auto Empire Taller — sitio web

Página web propuesta para Auto Empire Taller (El Ingenio, Panamá): servicios con precios de referencia, sección de suspensión y 4x4, reservas que llegan al WhatsApp del taller, calculadora de cambio de aceite y ubicación.

## Inicio rápido

**Requisitos:** Node 22

```bash
git clone https://github.com/eduardothomas/autoempire-taller-web.git
cd autoempire-taller-web
npm install
npm run dev
```

Se abre en: http://localhost:5173

## Accesos

| Qué | Enlace | Se actualiza |
|---|---|---|
| Producción | Aún no publicado (pendiente conectar a Cloudflare Workers) | Al fusionar a `main` (con aprobación) |
| QA | No aplica | — |
| Previews de PR | Pendiente: `<rama>-autoempire-taller-web.<cuenta>.workers.dev` cuando se conecte Cloudflare | En cada rama o PR |
| Actions | https://github.com/eduardothomas/autoempire-taller-web/actions | En cada push a `main` y en cada PR |
| Repositorio | https://github.com/eduardothomas/autoempire-taller-web | — |
| Panel de hosting | Pendiente: Cloudflare → Workers & Pages | — |

## Contenido del proyecto

```
public/            Sitio estático (lo que se publica)
  index.html       Página única con todas las secciones
  404.html         Página de no encontrado
  css/estilos.css  Estilos y paleta (elevador rojo, concreto, orden en papel carbón)
  js/logica.js     Lógica pura: WhatsApp, validación de la orden, horario, calculadora
  js/app.js        Conecta la lógica con la página (sin frameworks)
  img/             Logo y fotos tomadas del Instagram del taller
  fonts/           Barlow y Barlow Condensed (licencia SIL OFL, servidas desde el sitio)
  robots.txt       Bloquea buscadores mientras es propuesta
scripts/
  build.mjs        Copia public/ a dist/ y falla si hay archivos o anclas rotas
  servidor.mjs     Servidor local sin dependencias
tests/             Pruebas de la lógica (Vitest)
wrangler.jsonc     Configuración de Cloudflare Workers (archivos estáticos)
```

Secciones de la página:

- **Portada:** propuesta de valor, botones de reserva y WhatsApp, estado abierto/cerrado en hora de Panamá.
- **Servicios y precios:** tarifario con precio "desde" en servicios estándar y "según el trabajo" en los demás. Cada fila preselecciona el servicio en la orden.
- **Suspensión y 4x4:** la especialidad del taller (Rancho, levantamientos, pickups).
- **Cómo funciona:** los 4 pasos de la cita.
- **Reserva tu cita:** orden de servicio que valida los datos y abre WhatsApp con el mensaje armado al número 6258-9348. Incluye la calculadora de cambio de aceite.
- **Del taller:** galería con enlace a Instagram.
- **Preguntas frecuentes** y **Cómo llegar** (dirección, horario, mapa, contacto).

### Datos por confirmar con el taller antes de publicar

- Horario real (está en `public/js/logica.js` → `TALLER.horario` y en la tabla de "Cómo llegar").
- Precios "desde" de aceite ($45), escáner ($25) y aire acondicionado ($45).
- Que instalan suspensiones Rancho y qué aseguradoras manejan.
- Alcance del trámite de placa (revisado, calcomanía, traspasos).
- Ubicación exacta del mapa: reemplazar el iframe por el de "Compartir → Insertar mapa" de su ficha de Google.
- Fotos en mejor resolución (las actuales vienen de capturas de Instagram).
- Al publicar: quitar el aviso de propuesta, la etiqueta `noindex` y el `Disallow` de `robots.txt`; poner la URL final en `og:image` y en el JSON-LD.

## Pruebas y build

```bash
npm test        # Vitest: lógica de reserva, teléfono, fechas, horario y calculadora
npm run build   # Genera dist/ y verifica referencias, anclas y JSON-LD
npm run preview # Sirve dist/ en http://localhost:5173
```

## Despliegue

- Hosting: Cloudflare Workers con archivos estáticos (`wrangler.jsonc`).
- Conexión (la hace Eduardo): Cloudflare → Workers & Pages → Create → Import a repository → este repo. Build command `npm run build`, deploy command `npx wrangler deploy`.
- Producción se publica al fusionar a `main` con autorización de Eduardo.
- Dominio propio (opcional): se agrega desde el panel de Cloudflare cuando el taller lo compre.

## Flujo de cambios

Ramas de trabajo y PR según el Estándar de Desarrollo de Software de Eduardo (v1.2). Detalles para agentes en `AGENTS.md`.

## Volver a una versión estable

Revertir el commit en `main` (`git revert <sha>` y PR), o en Cloudflare → el Worker → Deployments → elegir la versión anterior → Rollback.
