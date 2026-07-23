"use client";

import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { translations } from "./translations";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ROI() {
  const content = translations.de.investment;

  const stats = [
    { value: content.s1Value, label: content.s1Label },
    { value: content.s2Value, label: content.s2Label, accent: true },
    { value: content.s3Value, label: content.s3Label },
    { value: content.s4Value, label: content.s4Label },
  ];

  return (
    <section
      className="relative overflow-hidden bg-primary px-6 py-[88px]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(78,113,69,0.2) 0%, transparent 60%)",
      }}
    >
      <div className="relative z-10 mx-auto grid max-w-[1100px] gap-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <FadeUp>
            <span className="mb-6 inline-block rounded-full border border-secondary/30 bg-secondary/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              {content.label}
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mb-5 font-heading text-4xl font-semibold leading-tight text-white">
              {content.h2}
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mb-8 text-lg leading-relaxed text-white/85">{content.p}</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link href="#kontakt">
              <Button size="lg" className="rounded-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {content.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeUp>
        </div>

        <FadeUp delay={0.25}>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-7 text-center backdrop-blur-sm"
              >
                <span
                  className={`font-heading text-[28px] font-semibold ${
                    s.accent ? "text-secondary" : "text-white"
                  }`}
                >
                  {s.value}
                </span>
                <div className="mt-2 text-xs leading-tight text-[#A9C2A2]">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
