"use client";

import { FadeUp } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import Image from "next/image";
import { BookOpen, ShieldCheck, Building2 } from "lucide-react";

export function Story() {
  const { lang } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const h2Parts = content.story.h2.split("{highlight}");
  const h2 = {
    before: h2Parts[0],
    highlight: h2Parts[1]?.replace("{/highlight}", ""),
  };

  const features = [
    { Icon: BookOpen, title: content.story.f1Title, desc: content.story.f1Desc },
    { Icon: ShieldCheck, title: content.story.f2Title, desc: content.story.f2Desc },
    { Icon: Building2, title: content.story.f3Title, desc: content.story.f3Desc },
  ];

  return (
    <section
      className="relative overflow-hidden py-20 lg:py-32"
      style={{
        background:
          "radial-gradient(ellipse 100% 80% at 0% 50%, rgba(25,70,60,0.96) 0%, rgba(19,49,41,0.98) 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-28 -top-28 h-[500px] w-[500px] rounded-full bg-secondary/10" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent/15" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <FadeUp>
          <div className="relative">
            <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
              <Image
                src="/partner-logo.png"
                alt="Partnerlogo: Gillian Sabatia Training College und PeraWays"
                width={400}
                height={400}
                className="w-[70%] object-contain"
              />
            </div>
            <div className="absolute left-1/2 -bottom-7 w-64 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/55 p-7 text-center shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">
                {content.story.badgeLabel}
              </div>
              <div className="text-lg font-bold leading-tight text-primary">
                {content.story.badgeName}
              </div>
              <div className="mt-1.5 text-sm text-[#5A5A5A]">
                {content.story.badgeLocation}
              </div>
            </div>
          </div>
        </FadeUp>

        <div className="mt-8 lg:mt-0">
          <FadeUp>
            <span className="mb-7 inline-block rounded-full border border-secondary/30 bg-secondary/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              {content.story.label}
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="mb-7 font-heading text-4xl font-semibold leading-[1.1] text-white lg:text-5xl">
              {h2.before}
              <span className="italic text-secondary">{h2.highlight}</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="mb-5 max-w-xl text-lg leading-relaxed text-white/90">
              {content.story.p1}
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/85">
              {content.story.p2}
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div className="grid grid-cols-3 gap-4">
              {features.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-sm"
                >
                  <Icon className="mx-auto mb-2 h-6 w-6 text-white" strokeWidth={1.8} />
                  <div className="text-[13px] font-bold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-tight text-white/60">{desc}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
