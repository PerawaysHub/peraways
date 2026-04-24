"use client";

import { FadeUp } from "./FadeUp";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { PiggyBank } from "lucide-react";

export function ROI() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  return (
    <section id="roi" className="bg-[var(--cream)] py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-3">
          <FadeUp>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              {content.roi.label}
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
              {content.roi.h2.split("{highlight}")[0]}
              <span className="text-secondary">{content.roi.h2.split("{highlight}")[1]?.replace("{/highlight}", "")}</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Card className="border-0 bg-secondary">
              <CardContent className="flex items-center gap-3 p-4">
                <PiggyBank className="w-6 h-6 shrink-0 text-secondary-foreground" />
                <p className="text-secondary-foreground font-medium text-sm">
                  {content.roi.card}
                </p>
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        <FadeUp delay={0.2}>
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            <div className="flex h-full items-center justify-center">
              <PiggyBank className="w-16 h-16 text-muted-foreground/30" />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}