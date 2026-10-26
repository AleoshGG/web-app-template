"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Card, Link } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 sm:p-12">
      <main className="flex flex-col items-center w-full max-w-2xl gap-8">
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert h-6 w-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <span className="text-muted text-sm font-medium">+</span>
          <span className="text-xl font-bold tracking-tight text-accent">
            HeroUI v3
          </span>
        </div>

        <Card className="w-full">
          <Card.Header>
            <Card.Title className="text-2xl font-bold">
              web-app-template
            </Card.Title>
            <Card.Description>
              Plantilla moderna con Next.js 16, React 19, Tailwind CSS 4 y HeroUI v3
            </Card.Description>
          </Card.Header>

          <Card.Content className="space-y-4 text-sm text-muted">
            <p>
              Para comenzar, edita el archivo{" "}
              <code className="rounded bg-black/[.06] dark:bg-white/[.08] px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
                app/page.tsx
              </code>
              .
            </p>
            <p>
              HeroUI v3 se integra de forma nativa con Tailwind CSS 4 sin necesidad de un{" "}
              <code className="font-mono text-[0.9em] text-foreground">&lt;HeroUIProvider&gt;</code>{" "}
              en el layout raíz.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                onPress={() => setCount((prev) => prev + 1)}
              >
                HeroUI Button ({count} {count === 1 ? "click" : "clicks"})
              </Button>
              {count > 0 && (
                <Button
                  variant="tertiary"
                  size="sm"
                  onPress={() => setCount(0)}
                >
                  Reiniciar
                </Button>
              )}
            </div>
          </Card.Content>

          <Card.Footer className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <a
                className={buttonVariants({ variant: "outline", size: "sm" })}
                href="https://heroui.com/docs/react/getting-started/quick-start"
                target="_blank"
                rel="noopener noreferrer"
              >
                HeroUI Docs
              </a>
              <a
                className={buttonVariants({ variant: "ghost", size: "sm" })}
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js Docs
              </a>
            </div>

            <Link
              href="https://github.com/heroui-inc/heroui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
            >
              GitHub
              <Link.Icon />
            </Link>
          </Card.Footer>
        </Card>
      </main>
    </div>
  );
}
