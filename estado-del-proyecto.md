# Estado del proyecto

**Proyecto:** Auto Empire Taller — sitio web (propuesta)  
**Repositorio:** https://github.com/eduardothomas/autoempire-taller-web  
**Estándar adoptado:** software-development-standard v1.2  
**Plataforma:** GitHub

## Estado actual
Primera versión completa en `main`. PR abierto para publicar en GitHub Pages y tener el enlace para mostrarle a Joshua, el dueño del taller.

## Funcionalidades terminadas
- [x] Portada con estado abierto/cerrado en hora de Panamá
- [x] Tarifario de servicios que preselecciona el servicio en la orden
- [x] Sección de suspensión y 4x4
- [x] Orden de servicio con validación que abre WhatsApp con el mensaje armado
- [x] Calculadora de cambio de aceite
- [x] Galería, preguntas frecuentes, ubicación con mapa y contacto
- [x] Diseño responsive (escritorio y móvil) y fuentes servidas desde el sitio

## En desarrollo
- [ ] `feature/github-pages`: workflow de GitHub Pages y 404 compatible con subruta

## Decisiones importantes
- 2026-10-19 Sitio estático sin backend: las reservas van por WhatsApp para no tener costos ni datos personales guardados.
- 2026-10-19 Repo público y hosting en GitHub Pages para la demo: enlace inmediato y gratis, sin configurar otra cuenta. Cloudflare Workers queda como alternativa (`wrangler.jsonc`).
- 2026-10-19 Precios "desde" solo en servicios estándar; el resto se cotiza.
- 2026-10-19 `noindex` y aviso de propuesta mientras el taller no apruebe el contenido.

## Pruebas ejecutadas
- 2026-10-19 `npm test`: 31 pruebas pasaron.
- 2026-10-19 `npm run build`: build correcto, referencias y anclas verificadas.
- 2026-10-19 Sitio servido bajo `/autoempire-taller-web/` (simulando Pages): sin recursos rotos, fuentes cargadas y 404 con enlace correcto al inicio.
- 2026-10-19 Revisión visual con Playwright en 1440 px y 390 px; flujo de reserva probado (errores de validación, servicio preseleccionado y enlace de WhatsApp con el mensaje correcto). Sin scroll horizontal ni errores de consola. El mapa de Google no carga en el entorno de prueba; falta verlo en un navegador normal.

## Riesgos o bloqueos
- Horario, precios y algunos servicios son de ejemplo hasta que el taller los confirme (lista en el README).
- Fotos de baja resolución (capturas de Instagram).

## Pendientes y siguiente paso
- [ ] Eduardo: autorizar el PR de GitHub Pages; activar Settings → Pages → Source: GitHub Actions; compartir el enlace con Joshua.
- [ ] Confirmar datos con el taller y reemplazar fotos.
- [ ] Al cerrar la venta: quitar aviso de propuesta, `noindex` y bloqueo de `robots.txt`; dominio propio.
