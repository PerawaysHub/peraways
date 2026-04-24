"use client";

import { FadeUp } from "./FadeUp";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="flex flex-col gap-8">
          <FadeUp delay={0.1}>
            <span className="inline-flex w-fit rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              Berlin × Nairobi
            </span>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="font-heading text-6xl font-bold leading-[1.1] text-primary md:text-7xl lg:text-8xl">
              Planbare
              <br />
              Fachkräfte.
              <br />
              <span className="text-secondary">Ethisch.</span> Rechtssicher. Ab Tag 1.
            </h1>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">
              Wir bauen die Goldene P-Brücke zwischen Nairobi und Berlin — für
              Pflegeeinrichtungen, die keine weiteren Versprechen, sondern eine echte
              Pipeline brauchen.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-wrap gap-4">
              <Link href="#kontakt">
                <Button size="lg" className="rounded-full text-base px-8">
                  Erstgespräch vereinbaren
                </Button>
              </Link>
              <Link href="#problem">
                <Button variant="ghost" size="lg" className="rounded-full text-base">
                  Mehr erfahren ↓
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">Placeholder Image 800×600</span>
            </div>
          </div>
          <div className="absolute -right-4 top-4 rounded-2xl bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground shadow-sm">
            ROI &lt; 90 Tage
          </div>
        </div>
      </div>
    </section>
  );
}