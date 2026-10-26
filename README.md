# web-app-template

Plantilla de aplicación web ligera y rápida con **Next.js 16 · Tailwind CSS 4 · Railway**.

Diseñada para ser minimalista, rápida de construir e independiente de capas de datos por defecto.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / SSR | Next.js 16 (App Router) |
| Runtime | React 19 |
| Estilos | Tailwind CSS 4 |
| Package manager | pnpm 11 |
| Despliegue | Railway via Dockerfile (standalone output) |
| Persistencia / Base de datos | *Opcional* (ver [`GuideLines.md`](GuideLines.md)) |

---

## Inicio rápido

### 1. Variables de entorno (opcional)

```bash
cp .env.example .env
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Iniciar en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Persistencia de Datos (Opcional)

Esta plantilla **no incluye base de datos por defecto** para mantener la imagen Docker ligera y los tiempos de compilación al mínimo.

Si tu aplicación necesita persistencia de datos (PostgreSQL + Prisma ORM):
- Consulta [`GuideLines.md`](GuideLines.md) para la guía paso a paso sobre cómo instalar dependencias, configurar el schema, inicializar el cliente tipado, inyectar `DATABASE_URL` y adaptar el `Dockerfile`.

---

## Despliegue en Railway

1. Crea un nuevo proyecto en [Railway](https://railway.com).
2. Conecta tu repositorio. Railway detectará [`railway.json`](railway.json) y utilizará el [`Dockerfile`](Dockerfile) automáticamente.
3. El build ejecuta `next build` y genera la imagen ligera de producción usando el **standalone output** de Next.js.

### Variables de entorno en Railway

| Variable | Descripción | Obligatoria |
|---|---|:---:|
| `NEXT_PUBLIC_APP_URL` | URL pública de la aplicación (ej. `https://mi-app.railway.app`) | Recomendada |
| `DATABASE_URL` | Cadena de conexión PostgreSQL (solo si agregas base de datos) | Opcional |

---

## Estructura relevante

```
├── app/                        # Rutas y páginas de Next.js (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/                     # Archivos estáticos
├── Dockerfile                  # Multi-stage build optimizado para Railway
├── railway.json                # Configuración de despliegue en Railway
├── next.config.ts              # Configuración de Next.js (output: standalone)
├── GuideLines.md               # Guía de arquitectura y persistencia de datos
└── .env.example                # Plantilla de variables de entorno
```
