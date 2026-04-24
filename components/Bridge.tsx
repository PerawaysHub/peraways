"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    number: "01",
    title: "Ethische Mission",
    description:
      "Employer Pays Principle — schuldenfreie Einreise, maximale Loyalität",
  },
  {
    number: "02",
    title: "Behörden-Expertise",
    description:
      "LEA-Insiderwissen + Fast-Lane §81a — entscheidungsreife Akten",
  },
  {
    number: "03",
    title: "Stipendien-Modell",
    description:
      "Finanzielle Förderung stärkt die Bindung an den Träger",
  },
  {
    number: "04",
    title: "Klinische Vorqualifikation",
    description:
      "467 dokumentierte Praxisstunden (NITA Level 3) — „Ready-to-Work\"",
  },
  {
    number: "05",
    title: "Simultan-Training",
    description:
      "10 Monate Intensivvorbereitung: Sprache B1 + klinische Praxis",
  },
  {
    number: "06",
    title: "Logistik-Sicherheit",
    description:
      "Fokus auf Träger mit Wohnraum — Visum mathematisch abgesichert",
  },
];

export function Bridge() {
  return (
    <section id="loesung" className="bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp>
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            Die Goldene P-Brücke
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="mb-20 font-heading text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
            Sechs Pfeiler für Ihren Erfolg
          </h2>
        </FadeUp>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.number}>
              <Card className="h-full border-2 border-transparent bg-gray-50 transition-all hover:-translate-y-1 hover:border-primary/20">
                <CardContent className="p-8">
                  <span className="mb-4 text-xs font-bold text-secondary">
                    {pillar.number}
                  </span>
                  <h3 className="mb-3 text-xl font-bold text-primary">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}