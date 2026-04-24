"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { TrendingUp, Award, Calendar, Zap } from "lucide-react";

const icons = [TrendingUp, Award, Calendar, Zap];

export function Stats() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const stats = [
    { value: content.stats.s1Value, suffix: content.stats.s1Suffix, label: content.stats.s1Label },
    { value: content.stats.s2Value, suffix: content.stats.s2Suffix, label: content.stats.s2Label },
    { value: content.stats.s3Value, suffix: content.stats.s3Suffix, label: content.stats.s3Label },
    { value: content.stats.s4Value, suffix: content.stats.s4Suffix, label: content.stats.s4Label },
  ];

  return (
    <section className="bg-primary py-14 lg:py-18">
      <div className="mx-auto max-w-7xl px-4">
        <FadeUp>
          <h2 className="mb-6 text-center font-heading text-2xl font-bold text-white md:text-3xl">
            {content.stats.h2}
          </h2>
        </FadeUp>

        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <StaggerItem key={stat.label}>
                <div className="flex flex-col items-center rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                  <Icon className="mb-2 w-6 h-6 text-white/70" />
                  <span className="font-heading text-3xl font-bold text-white md:text-4xl">
                    {stat.value}
                    {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                  </span>
                  <span className="text-sm text-white/70">{stat.label}</span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}