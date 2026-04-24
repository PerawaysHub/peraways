"use client";

import { FadeUp } from "./FadeUp";

export function Story() {
  return (
    <section className="bg-white py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <FadeUp>
          <div className="order-2 aspect-[5/4] overflow-hidden rounded-3xl border border-border bg-muted lg:order-1">
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">Placeholder Image 500×400</span>
            </div>
          </div>
        </FadeUp>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <FadeUp>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              Unsere Geschichte
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
              Pflege ist persönlich.
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">
              PeraWays wurde aus der persönlichen Erfahrung mit der
              Pflegebedürftigkeit der eigenen Mutter gegründet. Wir vermitteln nur
              Talente, denen wir auch unsere eigene Familie anvertrauen würden.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">
              Unsere einzigartige LEA-Behörden-Expertise überwindet bürokratische
              Hürden — für Sie und Ihre zukünftigen Mitarbeitenden.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}