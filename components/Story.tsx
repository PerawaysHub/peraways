"use client";

import { FadeUp } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { Heart } from "lucide-react";

export function Story() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:items-center">
        <FadeUp>
          <div className="order-2 aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted lg:order-1">
            <div className="flex h-full items-center justify-center">
              <Heart className="w-16 h-16 text-muted-foreground/30" />
            </div>
          </div>
        </FadeUp>

        <div className="order-1 flex flex-col gap-3 lg:order-2">
          <FadeUp>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
              {content.story.label}
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
              {content.story.h2}
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-lg text-muted-foreground">{content.story.p}</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}