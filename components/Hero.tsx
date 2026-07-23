"use client";

import { FadeUp } from "./FadeUp";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { translations } from "./translations";
import { GraduationCap, Check, ArrowDown } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const content = translations.de.hero;

  const h1Match = content.h1.match(/^(.*?)\{highlight\}(.*?)\{\/highlight\}(.*)$/);
  const h1 = h1Match
    ? { before: h1Match[1], highlight: h1Match[2], after: h1Match[3] }
    : { before: content.h1, highlight: "", after: "" };

  return (
    <section
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-20"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 20% 100%, rgba(78,113,69,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(185,116,99,0.08) 0%, transparent 60%), #F4F1EC",
      }}
    >
      <div className="mx-auto flex flex-col-reverse gap-8 px-4 max-w-7xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <FadeUp immediate delay={0.15}>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {content.label}
            </span>
          </FadeUp>

          <FadeUp immediate delay={0.25}>
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] text-primary md:text-6xl lg:text-[64px]">
              {h1.before}
              <span style={{ color: "#7FA278" }}>{h1.highlight}</span>
              {h1.after}
            </h1>
          </FadeUp>

          <FadeUp immediate delay={0.3}>
            <p className="max-w-[460px] text-xl leading-snug text-[#3A4A42]">
              {content.tagline} {content.subtitle}
            </p>
          </FadeUp>

          <FadeUp immediate delay={0.35}>
            <blockquote className="max-w-[440px] rounded-r-2xl border-l-[3px] border-secondary bg-[rgba(234,240,233,0.6)] px-5 py-3.5 text-[15px] italic leading-relaxed text-accent backdrop-blur-sm">
              Unsere Talente treten ihren ersten Arbeitstag in einem fremden Land an, ohne einen Kredit abzahlen zu müssen. Kein Schuldenberg lastet auf ihnen, bevor sie überhaupt angekommen sind.
            </blockquote>
          </FadeUp>

          <FadeUp immediate delay={0.45}>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="#kontakt">
                <Button size="lg" className="rounded-full gap-2 bg-gradient-to-br from-primary to-[#2A6B5E] shadow-[0_8px_28px_rgba(25,70,60,0.32)]">
                  {content.cta}
                </Button>
              </Link>
              <Link href="#mission" className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                Unsere Mission
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={3} />
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="relative lg:w-1/2">
          <FadeUp immediate delay={0.3}>
            <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(25,70,60,0.22),0_8px_24px_rgba(25,70,60,0.12)] lg:max-w-xl">
              <Image
                src="/hero-photo.png"
                alt="Pflegekraft mit Patientin, Blick auf das Brandenburger Tor"
                fill
                className="object-cover"
                style={{ objectPosition: "50% 66.6%" }}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeUp>

          <FadeUp immediate delay={0.2}>
            <div className="absolute -bottom-2 left-[-32px] min-w-[180px] rounded-2xl border border-white/12 bg-[rgba(25,70,60,0.72)] px-7 py-5 shadow-[0_8px_32px_rgba(25,70,60,0.28),0_2px_8px_rgba(25,70,60,0.16)] backdrop-blur-xl lg:-bottom-2 lg:left-[-32px]">
              <div className="font-heading text-[28px] font-semibold leading-none text-white">
                {content.badge}
              </div>
              <div className="mt-1 text-xs text-[#A9C2A2]">Durchschnittliche Amortisierung</div>
            </div>
          </FadeUp>

          <FadeUp immediate delay={0.4}>
            <div className="absolute -right-5 top-2 rounded-2xl border border-white/70 bg-white/55 px-5 py-4 shadow-[0_8px_32px_rgba(25,70,60,0.28),0_2px_8px_rgba(25,70,60,0.16)] backdrop-blur-xl">
              <GraduationCap className="mb-1 h-[22px] w-[22px] text-primary" strokeWidth={1.8} />
              <div className="text-[13px] font-bold text-primary">467 Praxisstunden</div>
              <div className="mt-0.5 text-[11px] text-[#5A5A5A]">Caregiver Level 3, UN-akkreditiert</div>
            </div>
          </FadeUp>

          <FadeUp immediate delay={0.5}>
            <div className="absolute -right-9 top-[44%] rounded-[14px] border border-white/70 bg-white/55 px-4.5 py-3 shadow-[0_8px_32px_rgba(25,70,60,0.28),0_2px_8px_rgba(25,70,60,0.16)] backdrop-blur-xl">
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">Employer Pays Principle</div>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-accent">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                WHO-konform
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
