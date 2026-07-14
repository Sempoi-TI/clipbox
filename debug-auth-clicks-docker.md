# Debug Session: auth-clicks-docker

Status: [OPEN]

## Síntomas

- En el despliegue actual, al hacer click en `Crear cuenta` no cambia el formulario.
- Al hacer click en el botón de cambio de tema en la pantalla de acceso no sucede nada.

## Alcance

- Pantalla inicial de autenticación en `src/pages/index.astro`.
- Posible diferencia entre entorno local y despliegue/contenedor.

## Hipótesis Iniciales

1. Los listeners de click no se están registrando en producción por timing de hidratación o del script inline.
2. Alguna capa visual está interceptando los clicks sobre tabs o botón de tema.
3. El script falla antes de `wireAuthEvents()` por un error de inicialización no visible.
4. El DOM renderizado en producción no coincide con los selectores usados por el script.
5. Existe una diferencia entre el entorno local y el contenedor que altera el orden de ejecución del script.

## Evidencia

- `pre-fix` en navegador sobre `http://localhost:900`:
  - `init started`
  - `binding auth events`
  - `showAuthMode called` con `mode=login`
  - click en `Crear cuenta` dispara `auth mode button clicked`
  - click en el toggle de tema dispara `theme toggle clicked` y luego `applyTheme called`
- Conclusión parcial: el build actual sí registra listeners y sí ejecuta los handlers.
- Hallazgo adicional: `public/sw.js` usaba `cache-first` para assets del mismo origen y mantenía `CACHE_NAME = clipbox-static-v1`, lo que puede dejar bundles JS viejos activos tras redeploy.

## Análisis

- Hipótesis 1: rechazada para el build actual.
- Hipótesis 2: rechazada para el build actual.
- Hipótesis 3: rechazada para el build actual.
- Hipótesis 4: rechazada para el build actual.
- Hipótesis 5: parcialmente válida, pero la diferencia observada apunta a caché persistente del service worker en despliegue, no al binding del DOM.

## Fix aplicado

1. Se incrementó el nombre de caché a `clipbox-static-v2`.
2. Los bundles estáticos (`/_astro`, scripts, estilos, fuentes) pasaron a estrategia `network-first`.
3. El precache quedó reservado a shell/offline/iconos.

## Verificación

- `npm run build`: OK tras el fix.
- Sin diagnósticos en `public/sw.js`.

## Plan

1. Instrumentar puntos de entrada del script y eventos click.
2. Reproducir en el entorno desplegado.
3. Analizar logs y confirmar/descartar hipótesis.
4. Aplicar un fix mínimo.
5. Verificar con evidencia post-fix.
