"use client";

import { FadeUp } from "./FadeUp";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
  {
    icon: "📉",
    title: "Chronischer Fachkräftemangel",
    description:
      "Berliner Pflegeeinrichtungen und Kliniken kämpfen täglich mit offenen Stellen, die einfach nicht besetzt werden können.",
  },
  {
    icon: "💸",
    title: "Über 8.000 € Mehrkosten",
    description:
      "Monatlich pro unbesetzter Stelle durch teure Leiharbeit und Überstunden des bestehenden Teams.",
  },
  {
    icon: "✅",
    title: "Die Lösung",
    description:
      "Planbare, rechtssichere Fachkräfte-Pipeline ab Tag 1. Keine Wartelisten, keine Kompromisse.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="bg-[var(--cream)] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp>
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            Das Problem
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="mb-20 font-heading text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
            Unbesetzte Stellen kosten Sie über 8.000 € pro Monat.
          </h2>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem, index) => (
            <FadeUp key={problem.title} delay={0.2 + index * 0.1}>
              <Card className="h-full border-2 border-transparent bg-white transition-all hover:border-primary/20">
                <CardContent className="flex flex-col p-8">
                  <span className="mb-6 text-4xl">{problem.icon}</span>
                  <h3 className="mb-4 text-xl font-bold text-primary">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}