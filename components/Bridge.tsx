"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { 
  HandHeart, 
  Zap, 
  GraduationCap, 
  Languages, 
  Clock, 
  Home 
} from "lucide-react";

const icons = [
  HandHeart,
  Zap,
  GraduationCap,
  Languages,
  Clock,
  Home,
];

export function Bridge() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const features = [
    { title: content.bridge.f1Title, desc: content.bridge.f1Desc },
    { title: content.bridge.f2Title, desc: content.bridge.f2Desc },
    { title: content.bridge.f3Title, desc: content.bridge.f3Desc },
    { title: content.bridge.f4Title, desc: content.bridge.f4Desc },
    { title: content.bridge.f5Title, desc: content.bridge.f5Desc },
    { title: content.bridge.f6Title, desc: content.bridge.f6Desc },
  ];

  return (
    <section id="loesung" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeUp>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            {content.bridge.label}
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="mb-8 font-heading text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
            {content.bridge.h2}
          </h2>
        </FadeUp>

        <StaggerContainer className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <StaggerItem key={feature.title}>
                <Card className="h-full border border-transparent bg-gray-50 transition-all hover:border-primary/20">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Icon className="w-5 h-5 shrink-0 text-secondary" />
                    <div>
                      <h3 className="text-sm font-bold text-primary">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
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