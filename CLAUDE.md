@AGENTS.md

## Específico de Claude
- Para revisar la interfaz, tomar capturas en escritorio (1440 px) y móvil (390 px) con Playwright contra `npm run dev`.
- En sesiones en la nube, Chromium necesita `--proxy-server=https=<HTTPS_PROXY sin http://>` y `--proxy-bypass-list=<-loopback>` para cargar localhost; wa.me no carga ahí, así que se verifica el enlace generado en lugar de la página de WhatsApp.
