"use client";

import { FadeUp } from "./FadeUp";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const h1Parts = content.hero.h1.split("{highlight}");
  const h1 = {
    before: h1Parts[0],
    highlight: h1Parts[1]?.replace("{/highlight}", ""),
    after: h1Parts[2]?.replace("{/highlight}", ""),
  };

  return (
    <section className="relative min-h-screen bg-primary pt-24 pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-5 order-2 lg:order-1">
          <FadeUp delay={0.15}>
            <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              {content.hero.label}
            </span>
          </FadeUp>

          <FadeUp delay={0.25}>
            <h1 className="font-heading text-5xl font-bold leading-[1.05] text-white md:text-6xl lg:text-7xl">
              {h1.before}
              <span className="text-secondary">{h1.highlight}</span>
              {h1.after}
            </h1>
          </FadeUp>

          <FadeUp delay={0.35}>
            <p className="max-w-md text-lg text-white/80">
              {content.hero.subtitle}
            </p>
          </FadeUp>

          <FadeUp delay={0.45}>
            <Link href="#kontakt">
              <Button size="lg" className="rounded-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {content.hero.cta}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </FadeUp>
        </div>

        <div className="relative order-1 lg:order-2">
          <FadeUp delay={0.3}>
            <div className="relative aspect-4/5 lg:aspect-square w-full h-full max-w-lg mx-auto">
              <Image
                src="/hero.svg"
                alt="PeraWays - Ethical Nursing Recruitment"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="absolute -right-2 lg:-right-4 -bottom-2 lg:-bottom-4 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground shadow-lg">
              {content.hero.badge}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}