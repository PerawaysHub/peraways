"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { TrendingDown, Users, Clock } from "lucide-react";

const icons = [TrendingDown, Users, Clock];

export function Problem() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const stats = [
    { number: content.problem.stat1Number, title: content.problem.stat1Title, desc: content.problem.stat1Desc },
    { number: content.problem.stat2Number, title: content.problem.stat2Title, desc: content.problem.stat2Desc },
    { number: content.problem.stat3Number, title: content.problem.stat3Title, desc: content.problem.stat3Desc },
  ];

  return (
    <section id="problem" className="bg-[var(--cream)] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeUp>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            {content.problem.label}
          </span>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h2 className="mb-10 font-heading text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
            {content.problem.h2.split("{highlight}")[0]}
            <span className="text-secondary">{content.problem.h2.split("{highlight}")[1]?.replace("{/highlight}", "")}</span>
          </h2>
        </FadeUp>

        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <StaggerItem key={stat.title}>
                <Card className="h-full border border-transparent bg-white transition-all hover:border-primary/20">
                  <CardContent className="flex flex-col p-5">
                    <Icon className="mb-3 w-8 h-8 text-secondary" />
                    <span className="mb-1 font-heading text-3xl font-bold text-secondary">
                      {stat.number}
                    </span>
                    <h3 className="mb-1 text-base font-bold text-primary">{stat.title}</h3>
                    <p className="text-sm text-muted-foreground">{stat.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}