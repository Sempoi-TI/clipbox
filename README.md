# ClipBox

Una PWA moderna para organizar, guardar y buscar snippets de texto/código. Construida con [Astro](https://astro.build).

## ✨ Características

- 🔐 **Login y registro**: Autenticación por email/contraseña (cada usuario ve solo sus snippets)
- 📝 **Gestión de snippets**: Crea, edita, fija y elimina tus snippets
- 🔢 **Orden por usuario**: Ordena por `order_number` (contador independiente por usuario)
- 🔍 **Búsqueda y filtros**: Filtra por contenido, categoría y etiquetas
- 🌓 **Tema claro/oscuro**: Toggle disponible en la app y en la pantalla de acceso
- 📤 **Exportar JSON**: Exportación de la biblioteca desde la interfaz
- 📱 **PWA instalable**: Instalación en móvil/escritorio, manifest, iconos y soporte offline básico

## 🚀 Estructura del Proyecto

La estructura del proyecto es la siguiente:

```
/
├── public/
│   ├── manifest.webmanifest       # Manifest de la PWA
│   ├── sw.js                      # Service worker (cache estático + offline fallback)
│   ├── offline.html               # Página fallback offline
│   ├── apple-touch-icon.png       # Icono iOS
│   ├── icons/                     # Iconos Android/desktop
│   └── snippets.json              # Archivo de ejemplo (no es la fuente principal en producción)
├── src/
│   ├── assets/                    # Recursos estáticos
│   ├── components/
│   │   ├── Header.astro           # Encabezado de la aplicación
│   │   ├── SearchFilter.astro     # Componente de búsqueda y filtrado
│   │   ├── SnippetCardTemplate.astro  # Plantilla de tarjeta de snippet
│   │   └── SnippetForm.astro      # Formulario para crear/editar snippets
│   ├── layouts/
│   │   └── Layout.astro           # Layout principal
│   ├── pages/
│   │   └── index.astro            # Página de inicio
│   └── scripts/
│       └── supabase-client.ts     # Cliente del backend (Auth + DB)
├── astro.config.mjs               # Configuración de Astro
├── tsconfig.json                  # Configuración de TypeScript
└── package.json                   # Dependencias del proyecto
```

Para más información sobre la estructura de un proyecto Astro, consulta la [guía sobre estructura de proyectos](https://docs.astro.build/en/basics/project-structure/).

## 🧩 Backend y datos

La app usa:

- **Auth**: email/contraseña
- **Base de datos**: tabla `public.snippets` con RLS y separación por `user_id`

### Variables de entorno

Crea un `.env` (o usa el sistema de variables del despliegue) con:

```bash
PUBLIC_SUPABASE_URL="https://TU-PROYECTO.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="TU_ANON_KEY"
```

### Esquema recomendado (SQL)

Ejecuta esto en `Supabase > SQL Editor`:

```sql
create extension if not exists pgcrypto;

drop table if exists public.snippets cascade;

create table public.snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_number integer not null,
  text text not null,
  description text,
  tags text[] not null default '{}',
  category text not null default 'Code',
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index snippets_user_id_idx
  on public.snippets (user_id);

create index snippets_user_order_idx
  on public.snippets (user_id, order_number);

alter table public.snippets enable row level security;

create policy "users can read own snippets"
on public.snippets
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can insert own snippets"
on public.snippets
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update own snippets"
on public.snippets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete own snippets"
on public.snippets
for delete
to authenticated
using (auth.uid() = user_id);
```

### Evitar `order_number` duplicado por usuario (opcional, recomendado)

```sql
alter table public.snippets
add constraint snippets_user_order_unique
unique (user_id, order_number);
```

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
- `public/offline.html`: fallback offline para navegación
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

### Tema (claro/oscuro)

- El tema se guarda en `localStorage` bajo la clave `clipbox_theme`.
- El toggle de tema está disponible en:
  - el header (dentro de la app)
  - la pantalla de login/registro (antes de entrar)

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
