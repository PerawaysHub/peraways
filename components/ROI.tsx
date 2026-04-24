"use client";

import { FadeUp } from "./FadeUp";
import { Card, CardContent } from "@/components/ui/card";

export function ROI() {
  return (
    <section id="roi" className="bg-[var(--cream)] py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <FadeUp>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              ROI-Turbo
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
              Amortisation in unter 90 Tagen.
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">
              PeraWays-Talente amortisieren ihre Vermittlungskosten in unter 90
              Tagen — durch sofortige Dienstplanung und den Wegfall teurer
              Leiharbeit. Kein anderes Modell erzielt diesen Return so schnell
              und planbar.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Card className="border-0 bg-secondary">
              <CardContent className="p-8">
                <h3 className="mb-4 text-xl font-bold text-secondary-foreground">
                  Die 20h-Arbeitsoption (§16a Abs. 3 AufenthG)
                </h3>
                <p className="text-secondary-foreground/90 text-lg">
                  Unsere Talente reisen 2 Monate vor Ausbildungsstart ein und
                  dürfen sofort 20 Stunden/Woche als Pflegehelfer arbeiten.
                  Rechtssicher. Ohne Wartezeit.
                </p>
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        <FadeUp delay={0.2}>
          <div className="aspect-[5/4] overflow-hidden rounded-3xl border border-border bg-muted">
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">Placeholder Image 500×400</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}