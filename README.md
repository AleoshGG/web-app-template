# web-app-template

Plantilla de aplicación web ligera y rápida con **Next.js 16 · React 19 · HeroUI v3 · Tailwind CSS 4 · Railway**.

Diseñada para ser minimalista, rápida de construir e independiente de capas de datos por defecto.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / SSR | Next.js 16 (App Router) |
| Runtime | React 19 |
| Componentes UI | HeroUI v3 (`@heroui/react`) |
| Estilos | Tailwind CSS 4 (`@heroui/styles`) |
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

## Componentes UI con HeroUI v3

Esta plantilla incluye **HeroUI v3** preconfigurado de forma nativa para Tailwind CSS 4 y React 19.

### Puntos clave de HeroUI v3
- **Sin necesidad de `<HeroUIProvider>`:** En HeroUI v3 no se requiere envolver la aplicación en un proveedor de contexto (`<HeroUIProvider>`), evitando overhead innecesario en tiempo de ejecución. La librería funciona directamente a través de CSS mediante `@import "@heroui/styles";` en `app/globals.css`.
- **Componentes Compuestos (Compound Components):** Los componentes complejos se estructuran mediante composición con dot-notation (ej. `<Card><Card.Header><Card.Title>...</Card.Title></Card.Header></Card>`).
- **Variantes Semánticas:** Uso de variantes semánticas adaptables al tema (`primary`, `secondary`, `tertiary`, `danger`, `outline`, `ghost`).
- **Eventos accesibles:** Se recomienda usar `onPress` en lugar de `onClick` en componentes interactivos para una mejor accesibilidad táctil y de teclado (React Aria).

### Ejemplo de uso

```tsx
"use client";

import { Button, Card } from "@heroui/react";

export function ExampleCard() {
  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title>Título de la tarjeta</Card.Title>
        <Card.Description>Descripción del componente</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm text-muted">Contenido de ejemplo.</p>
      </Card.Content>
      <Card.Footer className="flex gap-2">
        <Button variant="primary" onPress={() => console.log("Presionado")}>
          Aceptar
        </Button>
        <Button variant="outline">Cancelar</Button>
      </Card.Footer>
    </Card>
  );
}
```

### Gestión de Temas (Claro / Oscuro)

HeroUI v3 utiliza variables CSS basadas en el espacio de color `oklch`. El template soporta por defecto la preferencia del sistema operativo (`prefers-color-scheme: dark`) y selectores de tema nativos:

- **Modo Claro:** `:root` o `data-theme="light"` / clase `.light`
- **Modo Oscuro:** Preferencia del sistema o `data-theme="dark"` / clase `.dark`

Para alternar temas interactivamente mediante un selector en el cliente, puedes instalar `next-themes` y utilizar un `ThemeProvider` cliente estándar.

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
