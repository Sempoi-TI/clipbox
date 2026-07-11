# Clipbox

ClipBox es una app para organizar, guardar, buscar y reutilizar snippets de texto o código.

Hoy el proyecto tiene dos capas:

- `Astro` como frontend y capa de UI
- `Tauri` como contenedor desktop y acceso nativo al sistema

Esto significa que puedes seguir construyendo la mayor parte de la app como antes, pero ahora tienes soporte desktop real para portapapeles, archivos locales, persistencia JSON y empaquetado para macOS y Windows.

## ✨ Características

- Búsqueda y filtrado de snippets
- Creación, edición y borrado de snippets
- Snippets pineados
- Variables en snippets con placeholders tipo `{{nombre}}`
- Vista `grid` y `list`
- Importación y exportación de datasets JSON
- Persistencia local en desktop con `Tauri`
- Build de app desktop para macOS con `.app` y `.dmg`
- Build de app desktop para Windows con instaladores `.exe` (`NSIS`) y `.msi`

## 🚀 Estructura del Proyecto

```text
/
├── public/
│   ├── snippets.json
│   ├── snippets-apti.json
│   └── snippets-ncif.json
├── src/
│   ├── assets/
│   │   └── clipbox-icon.svg       # Fuente única del icono web + desktop
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── scripts/
│       └── tauri-bridge.ts        # Bridge frontend -> runtime Tauri
├── src-tauri/
│   ├── capabilities/              # Permisos desktop
│   ├── icons/                     # Iconos nativos generados por Tauri
│   ├── src/                       # Código Rust / comandos nativos
│   ├── Cargo.toml
│   └── tauri.conf.json
├── astro.config.mjs
├── package.json
└── README.md
```

## 📦 Requisitos

- Node.js `>= 22.12.0`
- npm
- Rust + Cargo
- En macOS: Xcode Command Line Tools
- En Windows: Microsoft Visual Studio C++ Build Tools

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
| :-- | :-- |
| `npm install` | Instala dependencias del frontend |
| `npm run dev` | Inicia la app web con Astro |
| `npm run build` | Genera el build web en `dist/` |
| `npm run preview` | Sirve el build web localmente |
| `npm run desktop:dev` | Inicia la app desktop con Tauri usando Astro como frontend |
| `npm run desktop:build:debug` | Genera una build desktop debug (`.app` y `.dmg`) |
| `npm run desktop:build` | Genera una build desktop release (`.app` y `.dmg`) |
| `npm run desktop:build:macos` | Genera el bundle desktop de macOS (`.app` y `.dmg`) |
| `npm run desktop:build:windows` | Genera los instaladores de Windows (`NSIS .exe` y `.msi`) |
| `npm run desktop:icons` | Regenera los iconos nativos de Tauri desde `src/assets/clipbox-icon.svg` |
| `astro dev --background` | Inicia Astro en background |
| `astro dev status` | Revisa el estado del servidor background |
| `astro dev logs` | Muestra logs del servidor background |
| `astro dev stop` | Detiene el servidor background |

## 🛠️ Guía práctica de desarrollo

### Cómo pensar la app ahora

- `Astro` sigue siendo la UI principal
- `Tauri` solo entra cuando necesitas capacidades nativas del sistema
- La mayoría de nuevas features visuales se siguen haciendo igual que antes

### Cuándo seguir trabajando solo con Astro

Usa `Astro` normalmente si la feature es de:

- UI o layout
- formularios y modales
- filtros y búsquedas
- vista `grid/list`
- tooltips, animaciones y estilos
- lógica de presentación
- componentes nuevos

Ejemplos:

- nueva card de snippet
- nuevos filtros
- agrupación por categorías
- nuevo modal de edición
- mejoras visuales de la interfaz

### Cuándo usar Tauri

Usa `Tauri` si la feature necesita hablar con el sistema operativo:

- portapapeles nativo
- abrir o guardar archivos reales
- persistencia local de escritorio
- notificaciones del sistema
- atajos globales
- menú nativo
- bandeja del sistema
- acceso a filesystem o base de datos local

### Regla simple

- Si vive en la interfaz: hazlo en `Astro`
- Si necesita capacidades del sistema: hazlo con `Tauri`

### Flujo recomendado de trabajo

1. Diseña primero la feature en la UI
2. Decide si necesita integración nativa
3. Si no la necesita, resuélvela solo en frontend
4. Si la necesita, divide la feature así:

- UI en `Astro`
- helper o bridge en `src/scripts/tauri-bridge.ts`
- plugin o comando nativo en `src-tauri/`

### Qué comando usar durante el desarrollo

- `npm run dev`
  Usa este comando si estás iterando UI rápida, estilos, layouts o lógica web.

- `npm run desktop:dev`
  Usa este comando si la feature toca clipboard, filesystem, persistencia local, diálogos nativos o cualquier comportamiento desktop.

### Recomendación práctica

- Para cambios puramente visuales: empieza con `npm run dev`
- Antes de cerrar una feature que toque capacidades nativas: valida con `npm run desktop:dev`

## 💾 Persistencia y datos

- En modo desktop, la app usa un JSON local (`clipbox-storage.json`) dentro del directorio de datos de la app
- En modo web, mantiene fallbacks usando `localStorage`
- La importación y exportación de datasets usa diálogos nativos en desktop

## 🎨 Iconos

- La fuente única del icono es `src/assets/clipbox-icon.svg`
- El favicon web usa ese mismo SVG
- Los iconos nativos de `Tauri` se regeneran con:

```bash
npm run desktop:icons
```

Si cambias el icono, vuelve a correr ese comando antes de generar una nueva build desktop.

## 🚚 Distribución desktop

### Build para distribución

Para generar una release desktop local:

```bash
npm run desktop:build
```

Ese comando genera una build release y crea los bundles configurados en `Tauri`.

### Artefactos esperados en macOS

Después del build release, encontrarás archivos como estos:

```text
src-tauri/target/release/bundle/macos/ClipBox.app
src-tauri/target/release/bundle/dmg/ClipBox_1.0.0_aarch64.dmg
```

### Artefactos esperados en Windows

Después del build release en Windows, encontrarás archivos como estos:

```text
src-tauri/target/release/bundle/nsis/ClipBox_1.0.0_x64-setup.exe
src-tauri/target/release/bundle/msi/ClipBox_1.0.0_x64_en-US.msi
```

### Comandos por sistema operativo

- En `macOS`:

```bash
npm install
npm run build
npm run desktop:build:macos
```

- En `Windows`:

```bash
npm install
npm run build
npm run desktop:build:windows
```

Regla práctica: el instalador de cada sistema se construye en su propio sistema operativo, salvo que uses CI con runners por plataforma.

### Diferencia entre debug y release

- `npm run desktop:build:debug`
  Sirve para validar localmente, probar empaquetado y revisar artefactos rápido.

- `npm run desktop:build`
  Es la build pensada para distribuir.

## 🏷️ Cómo preparar una release

Antes de publicar una nueva versión:

1. Actualiza la versión en:
- `package.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
2. Regenera iconos si cambió el branding:
- `npm run desktop:icons`
3. Genera la build release:
- `npm run desktop:build`
4. Genera el instalador del sistema que vayas a publicar:
- En `macOS`: `npm run desktop:build:macos`
- En `Windows`: `npm run desktop:build:windows`
5. Verifica manualmente los artefactos generados

## 📤 Cómo subir la release desktop a GitHub

### Opción manual desde GitHub

1. Haz commit de tus cambios
2. Crea y sube un tag:

```bash
git add .
git commit -m "release: v1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

3. Entra a tu repositorio en GitHub
4. Abre `Releases`
5. Pulsa `Draft a new release`
6. Selecciona el tag `v1.0.1`
7. Pon título de release, por ejemplo `ClipBox v1.0.1`
8. En `Attach binaries`, adjunta el `.dmg` de macOS, el `.exe` de Windows y el `.msi`
9. Publica la release

### Archivo que normalmente subirías

En macOS, el archivo más práctico para compartir es:

```text
src-tauri/target/release/bundle/dmg/ClipBox_1.0.1_aarch64.dmg
```

También puedes adjuntar la `.app`, pero normalmente el `.dmg` es el artefacto más cómodo para distribución.

En Windows, el archivo más práctico para compartir es:

```text
src-tauri/target/release/bundle/nsis/ClipBox_1.0.1_x64-setup.exe
src-tauri/target/release/bundle/msi/ClipBox_1.0.1_x64_en-US.msi
```

### Recomendación

Para una primera distribución personal o interna:

- publica el `.dmg` en GitHub Releases
- publica también el `.exe` y el `.msi` de Windows si vas a distribuir en ambos sistemas
- añade notas cortas con cambios y fixes
- prueba la descarga desde una máquina limpia si es posible

### Opción automática con GitHub Actions

El proyecto ahora incluye el workflow:

```text
.github/workflows/release-desktop.yml
```

Ese workflow:

- se ejecuta al hacer push de un tag con formato `v*`
- genera en `macOS` los bundles `.app` y `.dmg`
- genera en `Windows` los instaladores `NSIS .exe` y `MSI`
- crea o actualiza automáticamente la GitHub Release del tag y adjunta los binarios

Flujo recomendado:

```bash
git add .
git commit -m "release: v1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

Después de subir el tag, GitHub Actions se encarga de compilar y publicar los assets automáticamente.

## ⚠️ Nota sobre firma y Gatekeeper

Si distribuyes la app fuera de tu máquina, macOS puede mostrar advertencias de seguridad si el binario no está firmado y notarizado.

Para distribución real a terceros, después conviene añadir:

- firma con Apple Developer ID
- notarización de Apple

Eso no es obligatorio para seguir desarrollando localmente, pero sí es recomendable para una release pública.

## 📚 Más información

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Tauri](https://v2.tauri.app)
- [Guía de componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Guía de rutas en Astro](https://docs.astro.build/en/guides/routing/)
