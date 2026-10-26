# Guía de Arquitectura y Convenciones (GuideLines)

Este documento centraliza las convenciones, recomendaciones y guías de extensión técnica para los proyectos derivados de `web-app-template`.

El núcleo de esta plantilla está diseñado deliberadamente para ser **ligero, rápido de construir y desacoplado**, sin presuponer un motor de base de datos específico. Cuando tu aplicación requiera persistencia de datos, sigue las pautas descritas en esta sección.

---

## 1. Persistencia de Datos

### Recomendación de ORM: Prisma

Si tu proyecto necesita interactuar con una base de datos relacional (recomendamos **PostgreSQL ≥ 15**), la herramienta recomendada es **Prisma ORM**.

Prisma proporciona:
- Tipado estricto extremo a extremo sincronizado con tu esquema de base de datos.
- Sistema de migraciones declarativo y reproducible.
- Excelente interoperabilidad con TypeScript y el modelo Server Components / Route Handlers de Next.js.

---

### Paso a paso: Instalación y Configuración

#### 1. Instalar dependencias

Ejecuta el siguiente comando para agregar el cliente de Prisma en dependencias y la CLI en herramientas de desarrollo:

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

#### 2. Inicializar Prisma

Inicializa la configuración de Prisma configurando PostgreSQL como proveedor:

```bash
pnpx prisma init --datasource-provider postgresql
```

Esto creará:
- Un directorio `prisma/` con el archivo `schema.prisma`.
- Añadirá la variable `DATABASE_URL` en tu archivo `.env`.

---

### Ejemplo de Schema (`prisma/schema.prisma`)

A continuación se muestra un ejemplo conciso para comenzar:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### Cliente Prisma para Next.js (Patrón Singleton)

En Next.js (App Router), el mecanismo de Hot Module Replacement (HMR) durante desarrollo puede recrear instancias del cliente en cada recarga de módulo, saturando el pool de conexiones de PostgreSQL.

Crea el archivo `lib/prisma.ts` con el siguiente patrón singleton seguro:

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Para usarlo en Server Components, Server Actions o Route Handlers:

```typescript
// app/users/page.tsx (Server Component)
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany();
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name} ({u.email})</li>
      ))}
    </ul>
  );
}
```

---

### Variables de Entorno (`DATABASE_URL`)

La variable `DATABASE_URL` define la cadena de conexión a PostgreSQL. Su estructura general es:

```text
postgresql://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE_BD?schema=public
```

#### En Desarrollo Local
1. Copia o edita `.env`:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mi_base_de_datos"
   ```
2. Aplica cambios al esquema local con:
   ```bash
   pnpm prisma db push
   ```

#### En Railway (Producción)
1. En tu proyecto de Railway, haz clic en **+ New** > **Database** > **Add PostgreSQL**.
2. Railway genera automáticamente una base de datos administrada y expone la variable `DATABASE_URL` en el servicio del plugin.
3. Conecta la variable a tu servicio web:
   - Si creaste el servicio dentro del mismo proyecto, Railway permite referenciarla con `${{Postgres.DATABASE_URL}}` o vincularla directamente en la pestaña **Variables** del servicio.
4. **Importante sobre Connection Pooling**:
   - Si utilizas Transaction Pooling (p. ej. Supabase / PgBouncer), necesitarás dos variables: una URL directa (`DIRECT_URL`) para migraciones y una URL con pooler (`DATABASE_URL`) para las consultas de la aplicación. En Railway PostgreSQL estándar directo, `DATABASE_URL` se utiliza para ambos propósitos.

---

### Scripts recomendados en `package.json`

Agrega a la sección `scripts` de `package.json` los comandos operativos de base de datos:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy",
    "db:studio": "prisma studio"
  }
}
```

> [!TIP]
> Al incluir `prisma generate &&` antes de `next build`, aseguras que el cliente tipado siempre esté generado antes de compilar TypeScript y Next.js.

---

### Reintegración en el `Dockerfile`

Cuando incorpores Prisma a tu proyecto, ajusta el `Dockerfile` en las siguientes secciones:

#### 1. Stage `builder`
Asegúrate de copiar el directorio `prisma/` antes de generar el cliente y compilar:

```dockerfile
# ─── Stage 2: builder ───
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar los tipos de Prisma
RUN pnpm prisma generate

# Compilar Next.js en modo standalone
RUN pnpm run build
```

#### 2. Stage `runner`
En Next.js standalone mode, el bundle copia automáticamente las dependencias requeridas en `.next/standalone/node_modules`. Si tu flujo ejecuta migraciones al iniciar el contenedor (por ejemplo, `prisma migrate deploy`), copia la CLI y el schema al contenedor de ejecución:

```dockerfile
# ─── Stage 3: runner ───
WORKDIR /app

# Copiar el schema de Prisma si planeas ejecutar migraciones en el contenedor
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Si ejecutas migraciones antes de iniciar server.js:
# CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
CMD ["node", "server.js"]
```

> [!NOTE]
> En entornos de producción como Railway, la mejor práctica recomendada es ejecutar `prisma migrate deploy` en una fase de despliegue previa (**Release Command** / **Deploy Command**) para evitar que múltiples réplicas del contenedor ejecuten migraciones simultáneamente.
