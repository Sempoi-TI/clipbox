# Clipbox

Una aplicación web moderna para organizar, guardar y buscar snippets de código. Construida con [Astro](https://astro.build).

## ✨ Características

- 🔍 **Búsqueda inteligente**: Filtra snippets por nombre, descripción o contenido
- 📝 **Gestión de snippets**: Crea, edita y organiza tus snippets favoritos
- 📦 **Múltiples colecciones**: Soporta diferentes colecciones de snippets (APTI, NCIF, etc.)
- ⚡ **Rendimiento**: Construido con Astro para máxima velocidad
- 🎨 **Interfaz limpia**: Diseño intuitivo y responsive
- 📱 **PWA instalable**: Puede instalarse en móvil y escritorio con iconos, manifest y soporte offline básico

## 🚀 Estructura del Proyecto

La estructura del proyecto es la siguiente:

```
/
├── public/
│   ├── snippets.json              # Colección principal de snippets
│   ├── snippets-apti.json         # Snippets APTI
│   └── snippets-ncif.json         # Snippets NCIF
├── src/
│   ├── assets/                    # Recursos estáticos
│   ├── components/
│   │   ├── Header.astro           # Encabezado de la aplicación
│   │   ├── SearchFilter.astro     # Componente de búsqueda y filtrado
│   │   ├── SnippetCardTemplate.astro  # Plantilla de tarjeta de snippet
│   │   └── SnippetForm.astro      # Formulario para crear/editar snippets
│   ├── layouts/
│   │   └── Layout.astro           # Layout principal
│   └── pages/
│       └── index.astro            # Página de inicio
├── astro.config.mjs               # Configuración de Astro
├── tsconfig.json                  # Configuración de TypeScript
└── package.json                   # Dependencias del proyecto
```

Para más información sobre la estructura de un proyecto Astro, consulta la [guía sobre estructura de proyectos](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                            |
| :------------------------ | :------------------------------------------------ |
| `npm install`             | Instala las dependencias                          |
| `npm run dev`             | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`           | Construye para producción en `./dist/`            |
| `npm run preview`         | Vista previa del build local                      |
| `astro dev --background`  | Inicia servidor en modo background                |
| `astro dev stop`          | Detiene servidor en background                    |

## PWA

La aplicación incluye configuración PWA manual compatible con Astro 7:

- `public/manifest.webmanifest`: metadatos de instalación
- `public/sw.js`: service worker con cache estático y fallback offline
- `public/icons/`: iconos para Android/desktop
- `public/apple-touch-icon.png`: icono para iOS

Para que la instalación funcione correctamente en navegadores compatibles:

- Usa `https` en despliegue real
- Mantén accesibles `manifest.webmanifest` y `sw.js`
- Verifica en DevTools que el navegador detecta el manifest y el service worker

## 🛠️ Desarrollo

### Requisitos

- Node.js >= 22.12.0
- npm o pnpm

### Instalación

```bash
npm install
```

### Iniciar desarrollo

```bash
# Modo normal
npm run dev

# Modo background (recomendado)
astro dev --background
```

La aplicación estará disponible en `http://localhost:4321`

### Compilar para producción

```bash
npm run build
```

Los archivos compilados se guardarán en el directorio `dist/`.

## 📚 Más información

- [Documentación de Astro](https://docs.astro.build)
- [Guía de estructura de proyectos](https://docs.astro.build/en/basics/project-structure/)
- [Guía de componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Guía de enrutamiento y páginas dinámicas](https://docs.astro.build/en/guides/routing/)
