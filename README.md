# web-app-template

Plantilla de aplicación web con **Next.js 16 · Prisma ORM 8 · PostgreSQL · Railway**.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / SSR | Next.js 16 (App Router) |
| Base de datos | PostgreSQL ≥ 15 |
| ORM | Prisma ORM 8 (PSL, postgres adapter) |
| Estilos | Tailwind CSS 4 |
| Package manager | pnpm 11 |
| Despliegue | Railway via Dockerfile |

## Inicio rápido

### 1. Variables de entorno

```bash
cp .env.example .env
# Edita .env con tu DATABASE_URL
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Crear tablas en la base de datos

```bash
pnpm db:push          # Aplica el schema a la DB (primera vez / dev)
```

### 4. Iniciar en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Prisma ORM

El schema de datos vive en [`src/prisma/contract.prisma`](src/prisma/contract.prisma).  
El cliente tipado se importa desde [`src/prisma/db.ts`](src/prisma/db.ts):

```ts
import { db } from '@/src/prisma/db';

const users = await db.orm.public.User.all();
```

### Comandos útiles

```bash
pnpm contract:emit    # Regenera contract.json y contract.d.ts tras editar el schema
pnpm db:push          # Crea / sincroniza las tablas en la DB (dev)
pnpm db:migrate       # Aplica migraciones en producción
```

> Consulta [`prisma-8.md`](prisma-8.md) para una referencia completa de Prisma ORM 8.

---

## Despliegue en Railway

1. Crea un nuevo proyecto en [Railway](https://railway.com).
2. Agrega un plugin de **PostgreSQL** — Railway inyecta `DATABASE_URL` automáticamente.
3. Conecta el repositorio. Railway detectará el [`railway.json`](railway.json) y usará el [`Dockerfile`](Dockerfile).
4. El build corre `prisma contract emit && next build`; la imagen resultante usa el **standalone output** de Next.js.

### Variables de entorno requeridas en Railway

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (auto-inyectada por el plugin) |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (ej. `https://mi-app.railway.app`) |

---

## Estructura relevante

```
├── app/                        # Rutas de Next.js (App Router)
├── src/
│   └── prisma/
│       ├── contract.prisma     # Schema de datos (editar aquí)
│       ├── contract.json       # Compilado (generado)
│       ├── contract.d.ts       # Tipos (generado)
│       └── db.ts               # Cliente Prisma
├── prisma.config.ts            # Config del CLI de Prisma
├── next.config.ts              # Config de Next.js (output: standalone)
├── Dockerfile                  # Multi-stage build para Railway
├── railway.json                # Config de despliegue Railway
└── .env.example                # Plantilla de variables de entorno
```
