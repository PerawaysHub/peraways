"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { translations } from "./translations";

export function Gstc() {
  const content = translations.de.gstc;

  const stats = [
    { value: content.s1Value, label: content.s1Label, sub: content.s1Sub },
    { value: content.s2Value, label: content.s2Label, sub: content.s2Sub },
    { value: content.s3Value, label: content.s3Label, sub: content.s3Sub },
    { value: content.s4Value, label: content.s4Label, sub: content.s4Sub },
  ];

  return (
    <section id="gstc" className="relative overflow-hidden bg-[var(--surface)] px-6 py-20 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(25,70,60,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10">
        <FadeUp>
          <span className="mb-5 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
            {content.label}
          </span>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="mb-3 font-heading text-4xl font-semibold text-primary">{content.h2}</h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="mx-auto mb-14 max-w-xl text-lg leading-relaxed text-[#3A4A42]">
            {content.p}
          </p>
        </FadeUp>

        <StaggerContainer className="mx-auto grid max-w-3xl grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl bg-white p-7 shadow-[0_8px_28px_rgba(25,70,60,0.08)]">
                <div className="font-heading text-4xl font-semibold leading-none text-primary">
                  {s.value}
                </div>
                <div className="mt-2 text-[13px] leading-tight text-[#5A5A5A]">
                  {s.label}
                  <br />
                  <span className="font-semibold text-accent">{s.sub}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
