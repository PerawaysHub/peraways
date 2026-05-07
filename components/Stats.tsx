"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { TrendingUp, Award, Calendar, Zap, Circle } from "lucide-react";

const icons = [TrendingUp, Award, Calendar, Zap];

export function Stats() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const stats = [
    { value: content.stats.s1Value, suffix: content.stats.s1Suffix, label: content.stats.s1Label, desc: content.stats.s1Desc },
    { value: content.stats.s2Value, suffix: content.stats.s2Suffix, label: content.stats.s2Label, desc: content.stats.s2Desc },
    { value: content.stats.s3Value, suffix: content.stats.s3Suffix, label: content.stats.s3Label, desc: content.stats.s3Desc },
    { value: content.stats.s4Value, suffix: content.stats.s4Suffix, label: content.stats.s4Label, desc: content.stats.s4Desc },
  ];

  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Circle className="h-[600px] w-[600px] text-secondary/5" strokeWidth={0.5} />
      </div>
      <div className="absolute right-[-100px] top-[-100px]">
        <Circle className="h-[300px] w-[300px] text-secondary/5" strokeWidth={0.5} />
      </div>
      
      <div className="relative mx-auto max-w-6xl px-6">
        <FadeUp>
          <h2 className="mb-4 text-center font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {content.stats.h2}
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.1}>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-white/70">
            {content.stats.subtitle}
          </p>
        </FadeUp>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <StaggerItem key={stat.label}>
                <div className="group relative flex h-full min-h-70 flex-col rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="absolute left-1/2 -top-5 -translate-x-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <Icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-3">
                    <span className="font-heading text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                      {stat.value}
                    </span>
                    <span className="ml-1 text-2xl font-medium text-secondary">{stat.suffix}</span>
                  </div>
                  
                  <div className="mb-2 text-lg font-bold text-white">{stat.label}</div>
                  
                  <p className="text-sm text-white/60">{stat.desc}</p>
                  
                  {/* Bottom line accent */}
                  <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-secondary transition-all duration-500 group-hover:w-16" />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}