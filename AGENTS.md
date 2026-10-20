# AGENTS.md — Auto Empire Taller (sitio web)

Este proyecto aplica el Estándar de Desarrollo de Software de Eduardo **v1.2** (`eduardothomas/software-development-standard`). Plataforma: **GitHub**.

## Arquitectura
Sitio estático de una página, sin frameworks ni backend. HTML + CSS + JavaScript en módulos ES dentro de `public/`. `scripts/build.mjs` copia a `dist/` y valida; Cloudflare Workers sirve `dist/` como archivos estáticos (`wrangler.jsonc`).

- `public/js/logica.js`: funciones puras (sin DOM). Toda regla nueva va aquí y con prueba en `tests/`.
- `public/js/app.js`: solo conecta la lógica con el DOM.
- Fuentes Barlow servidas desde `public/fonts/` (no usar Google Fonts).

## Comandos
- Instalar: `npm install`
- Correr: `npm run dev` (http://localhost:5173)
- Pruebas: `npm test`
- Build: `npm run build`

## Reglas de negocio
- Las reservas no se guardan en ningún servidor: se arma un mensaje y se abre `https://wa.me/50762589348?text=...`.
- Validación de la orden: nombre, teléfono panameño de 7 u 8 dígitos (acepta prefijo 507), marca y modelo, servicio y día. El día no puede ser pasado ni un día sin horario (domingo).
- Horario y abierto/cerrado se calculan en `America/Panama`. El horario actual es **de ejemplo** hasta que el taller lo confirme.
- Intervalos de la calculadora: convencional 5,000 km, semisintético 7,500 km, sintético 10,000 km.
- Precios: "desde" solo en servicios estándar; el resto "según el trabajo". Son de ejemplo hasta que el taller los confirme.

## Flujo de Git
- Rama base: `main`. Ramas `feature/*`, `fix/*`, `docs/*`, `hotfix/*` en español.
- Todo cambio entra por PR con pruebas y build ejecutados de verdad.
- No fusionar a producción ni desplegar sin autorización de Eduardo.

## Decisiones y particularidades
- Es una propuesta comercial para el dueño del taller: mantener el aviso de propuesta, `noindex` y `robots.txt` bloqueando hasta que Eduardo indique que se publica en serio.
- No inventar reseñas ni testimonios. Si se agregan, deben ser reales (por ejemplo, de Google).
- Las fotos vienen del Instagram del taller; reemplazarlas por originales cuando el taller las entregue.
- Paleta y tipografía están explicadas al inicio de `public/css/estilos.css`. La "orden de servicio" en papel carbón es el elemento distintivo; no agregar animaciones decorativas en otras secciones.
