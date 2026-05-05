"use client";

import { FadeUp } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { GraduationCap, Languages, FileCheck, Sparkles } from "lucide-react";

const services = {
  de: [
    {
      id: "pfa-placement",
      icon: GraduationCap,
      title: "s1Title",
      desc: "s1Desc",
      features: ["s1Feature1", "s1Feature2", "s1Feature3"],
      primary: true,
    },
    {
      id: "language-training",
      icon: Languages,
      title: "s2Title",
      desc: "s2Desc",
      features: ["s2Feature1", "s2Feature2", "s2Feature3"],
      primary: false,
    },
    {
      id: "visa-advisory",
      icon: FileCheck,
      title: "s3Title",
      desc: "s3Desc",
      features: ["s3Feature1", "s3Feature2", "s3Feature3"],
      primary: false,
    },
  ],
  en: [
    {
      id: "pfa-placement",
      icon: GraduationCap,
      title: "s1Title",
      desc: "s1Desc",
      features: ["s1Feature1", "s1Feature2", "s1Feature3"],
      primary: true,
    },
    {
      id: "language-training",
      icon: Languages,
      title: "s2Title",
      desc: "s2Desc",
      features: ["s2Feature1", "s2Feature2", "s2Feature3"],
      primary: false,
    },
    {
      id: "visa-advisory",
      icon: FileCheck,
      title: "s3Title",
      desc: "s3Desc",
      features: ["s3Feature1", "s3Feature2", "s3Feature3"],
      primary: false,
    },
  ],
};

export function Services() {
  const { lang } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;
  const serviceItems = lang === "de" ? services.de : services.en;

  const h2Parts = content.services.h2.split("{highlight}");
  const h2 = {
    before: h2Parts[0],
    highlight: h2Parts[1]?.replace("{/highlight}", ""),
    after: h2Parts[2]?.replace("{/highlight}", ""),
  };

  const isDe = lang === "de";

  return (
    <section id="leistungen" className="bg-[var(--cream)] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeUp>
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-secondary">
            {content.services.label}
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="mb-4 font-heading text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
            {h2.before}
            <span className="text-secondary">{h2.highlight}</span>
            {h2.after}
          </h2>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {content.services.p}
          </p>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeUp key={service.id} delay={0.2 + index * 0.1}>
                <div
                  className={`group relative flex h-full flex-col rounded-2xl border transition-all hover:border-secondary/30 ${
                    service.primary
                      ? "border-secondary/30 bg-white ring-1 ring-secondary/20"
                      : "border-gray-100 bg-gray-50/50"
                  }`}
                >
                  {service.primary && (
                    <div className="absolute -top-3 right-6 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      <span>{isDe ? "Hauptleistung" : "Main Service"}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 p-8">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl font-bold text-primary">
                      {content.services[service.title as keyof typeof content.services]}
                    </h3>

                    <p className="text-base leading-relaxed text-muted-foreground">
                      {content.services[service.desc as keyof typeof content.services]}
                    </p>

                    <div className="mt-2 flex flex-col gap-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-primary/80">
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span>{content.services[feature as keyof typeof content.services]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
