# Estado del proyecto

**Proyecto:** Auto Empire Taller — sitio web (propuesta)  
**Repositorio:** https://github.com/eduardothomas/autoempire-taller-web  
**Estándar adoptado:** software-development-standard v1.2  
**Plataforma:** GitHub

## Estado actual
Primera versión completa para mostrarle al dueño del taller. Falta conectar el repo a Cloudflare Workers para tener un enlace público.

## Funcionalidades terminadas
- [x] Portada con estado abierto/cerrado en hora de Panamá
- [x] Tarifario de servicios que preselecciona el servicio en la orden
- [x] Sección de suspensión y 4x4
- [x] Orden de servicio con validación que abre WhatsApp con el mensaje armado
- [x] Calculadora de cambio de aceite
- [x] Galería, preguntas frecuentes, ubicación con mapa y contacto
- [x] Diseño responsive (escritorio y móvil) y fuentes servidas desde el sitio

## En desarrollo
- [ ] Ninguno

## Decisiones importantes
- 2026-10-19 Sitio estático sin backend: las reservas van por WhatsApp para no tener costos ni datos personales guardados.
- 2026-10-19 Hosting en Cloudflare Workers (predeterminado del estándar); repo privado.
- 2026-10-19 Precios "desde" solo en servicios estándar; el resto se cotiza.
- 2026-10-19 `noindex` y aviso de propuesta mientras el taller no apruebe el contenido.

## Pruebas ejecutadas
- 2026-10-19 `npm test`: 31 pruebas pasaron.
- 2026-10-19 `npm run build`: build correcto, referencias y anclas verificadas.
- 2026-10-19 Revisión visual con Playwright en 1440 px y 390 px; flujo de reserva probado (errores de validación, servicio preseleccionado y enlace de WhatsApp con el mensaje correcto). Sin scroll horizontal ni errores de consola. El mapa de Google no carga en el entorno de prueba; falta verlo en un navegador normal.

## Riesgos o bloqueos
- Horario, precios y algunos servicios son de ejemplo hasta que el taller los confirme (lista en el README).
- Fotos de baja resolución (capturas de Instagram).

## Pendientes y siguiente paso
- [ ] Eduardo: conectar el repo en Cloudflare → Workers & Pages y compartir el enlace con el taller.
- [ ] Confirmar datos con el taller y reemplazar fotos.
- [ ] Al cerrar la venta: quitar aviso de propuesta, `noindex` y bloqueo de `robots.txt`; dominio propio.
