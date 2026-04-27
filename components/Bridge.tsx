"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { 
  Heart, 
  Clock, 
  GraduationCap, 
  Languages, 
  Briefcase, 
  Home,
  ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const icons = [
  Heart,
  Clock,
  GraduationCap,
  Languages,
  Briefcase,
  Home,
];

const iconsEN = [
  { icon: Heart, title: "Ethical", desc: "No recruitment fees. Debt-free relocation for all talent." },
  { icon: Clock, title: "Fast", desc: "LEA Fast-Lane process under §81a. Decision-ready files in weeks." },
  { icon: GraduationCap, title: "Qualified", desc: "467 documented practice hours. NITA Level 3 certified." },
  { icon: Languages, title: "Language Ready", desc: "B1 German training completed before arrival." },
  { icon: Briefcase, title: "Work Immediately", desc: "§16a permits 20h/week work from day 1 in Germany." },
  { icon: Home, title: "Housing Provided", desc: "We partner with employers who offer accommodation." },
];

const iconsDE = [
  { icon: Heart, title: "Ethisch", desc: "Keine Vermittlungsgebühren. Schuldenfreie Einreise für alle Talente." },
  { icon: Clock, title: "Schnell", desc: "LEA Fast-Lane Verfahren nach §81a. Entscheidungsreife Akten in wenigen Wochen." },
  { icon: GraduationCap, title: "Qualifiziert", desc: "467 dokumentierte Praxisstunden. NITA Level 3 zertifiziert." },
  { icon: Languages, title: " grundlegende Deutschkenntnisse ", desc: "B1 Deutsch VOR Anreise abgeschlossen." },
  { icon: Briefcase, title: "Sofort arbeitsbereit", desc: "§16a erlaubt 20h/Woche Arbeit ab Tag 1 in Deutschland." },
  { icon: Home, title: "Wohnung inklusive", desc: "Wir arbeiten mit Arbeitgebern, die Wohnungen anbieten." },
];

export function Bridge() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;
  const features = lang === "de" ? iconsDE : iconsEN;

  return (
    <section id="loesung" className="bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeUp>
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-secondary">
            {content.bridge.label}
          </span>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h2 className="mb-16 font-heading text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
            {content.bridge.h2}
          </h2>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeUp key={feature.title} delay={0.2 + index * 0.1}>
                <Dialog>
                  <DialogTrigger render={<div className="group relative flex h-full min-h-[340px] cursor-pointer flex-col rounded-2xl border border-gray-100 bg-gray-50/50 p-8 transition-all hover:border-secondary/30 hover:bg-gray-100">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    
                    <div className="absolute right-6 top-8 text-4xl font-bold text-secondary/20">
                      0{index + 1}
                    </div>
                    
                    <h3 className="mb-3 text-2xl font-bold text-primary">
                      {feature.title}
                    </h3>
                    
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                    
                    <div className="mt-auto flex items-center text-sm font-medium text-secondary">
                      <span className="flex items-center">
                        Learn more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>} />
                  
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{feature.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}