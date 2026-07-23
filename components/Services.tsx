"use client";

import { FadeUp } from "./FadeUp";
import { translations } from "./translations";
import { Check } from "lucide-react";
import Image from "next/image";

const services = [
  {
    id: "pfa-placement",
    image: "/leistung-talent.jpg",
    alt: "Talent in der Pflegepraxis",
    title: "s1Title",
    desc: "s1Desc",
    features: ["s1Feature1", "s1Feature2", "s1Feature3"],
    primary: true,
  },
  {
    id: "language-training",
    image: "/leistung-sprachtraining.jpg",
    alt: "Deutschkurs am GSTC",
    title: "s2Title",
    desc: "s2Desc",
    features: ["s2Feature1", "s2Feature2", "s2Feature3"],
    primary: false,
  },
  {
    id: "visa-advisory",
    image: "/leistung-visa.jpg",
    alt: "Berlin / Behörden-Motiv",
    title: "s3Title",
    desc: "s3Desc",
    features: ["s3Feature1", "s3Feature2", "s3Feature3"],
    primary: false,
  },
];

export function Services() {
  const content = translations.de.services;

  const h2Parts = content.h2.split("{highlight}");
  const h2 = {
    before: h2Parts[0],
    highlight: h2Parts[1]?.replace("{/highlight}", ""),
    after: h2Parts[2]?.replace("{/highlight}", ""),
  };

  return (
    <section id="leistungen" className="relative bg-[var(--cream)] px-6 py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(78,113,69,0.07) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto mb-16 max-w-2xl text-center">
        <FadeUp>
          <span className="mb-5 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
            {content.label}
          </span>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="mb-4 font-heading text-4xl font-semibold text-primary md:text-5xl">
            {h2.before}
            <span className="text-secondary">{h2.highlight}</span>
            {h2.after}
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="text-lg leading-relaxed text-[#3A4A42]">{content.p}</p>
        </FadeUp>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-7 md:grid-cols-3">
        {services.map((service, index) => (
          <FadeUp key={service.id} delay={0.2 + index * 0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_rgba(25,70,60,0.08)]">
              <div className="relative aspect-video">
                <Image src={service.image} alt={service.alt} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-secondary">
                  {service.primary ? "Hauptleistung" : "Inklusive"}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-primary">
                  {content[service.title as keyof typeof content]}
                </h3>
                <p className="mb-5 text-[15px] leading-relaxed text-[#3A4A42]">
                  {content[service.desc as keyof typeof content]}
                </p>
                <div className="mt-auto flex flex-col gap-2">
                  {service.features.map((feature) => (
                    <span key={feature} className="flex items-center gap-1.5 text-[13px] font-semibold text-accent">
                      <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                      {content[feature as keyof typeof content]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
