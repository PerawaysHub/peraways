"use client";

import { FadeUp } from "./FadeUp";
import { translations } from "./translations";
import { Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const dotColor: Record<string, string> = {
  primary: "#19463C",
  accent: "#4E7145",
  secondary: "#B97463",
};

export function Timeline() {
  const content = translations.de.timeline;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [line, setLine] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      const dots = dotRefs.current.filter((d): d is HTMLDivElement => d !== null);
      if (!container || dots.length < 2) return;
      // getBoundingClientRect (not offsetTop) because framer-motion applies
      // a transform to each card's wrapper, which makes that wrapper the
      // offsetParent and breaks offsetTop-based math.
      const containerTop = container.getBoundingClientRect().top;
      const firstRect = dots[0].getBoundingClientRect();
      const lastRect = dots[dots.length - 1].getBoundingClientRect();
      const top = firstRect.top - containerTop + firstRect.height / 2;
      const bottom = lastRect.top - containerTop + lastRect.height / 2;
      if (bottom <= top) return;
      setLine({ top, height: bottom - top });
    }

    measure();

    // Re-measure whenever the container's layout actually changes (fonts
    // loading, images loading, responsive reflow) instead of guessing a
    // fixed delay.
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  return (
    <section id="timeline" className="bg-[var(--cream)] px-6 py-20 lg:py-24">
      <FadeUp>
        <span className="mx-auto mb-5 block w-fit rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          {content.label}
        </span>
      </FadeUp>
      <FadeUp delay={0.1}>
        <h2 className="mb-16 text-center font-heading text-4xl font-semibold text-primary">
          {content.h2}
        </h2>
      </FadeUp>

      <div ref={containerRef} className="relative mx-auto flex max-w-[720px] flex-col">
        {line && (
          <div
            className="absolute left-[129px] z-0 w-0.5 rounded-full"
            style={{
              top: line.top,
              height: line.height,
              background: "linear-gradient(to bottom, #19463C, #4E7145, #B97463, #19463C, #4E7145)",
            }}
          />
        )}

        {content.steps.map((step, i) => (
          <FadeUp key={step.title} delay={0.15 + i * 0.08}>
            <div
              className={`mb-4 flex items-start gap-7 rounded-2xl p-6 lg:p-7 ${
                step.highlight
                  ? "border border-secondary/20 bg-gradient-to-br from-[#FDF1EE] to-[#FAE8E3]"
                  : "bg-white"
              }`}
            >
              <div className="min-w-[60px] whitespace-pre-line pt-1.5 text-right text-[11px] font-bold leading-tight tracking-wide text-secondary">
                {step.month}
              </div>
              <div
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="relative z-10 mt-0.5 h-7 w-7 shrink-0 rounded-full"
                style={{
                  background: dotColor[step.dot],
                  boxShadow: `0 0 0 4px ${dotColor[step.dot]}26`,
                }}
              />
              <div>
                <div
                  className={`mb-1.5 flex items-center gap-1.5 text-[17px] font-bold ${
                    step.highlight ? "text-secondary" : "text-primary"
                  }`}
                >
                  {step.highlight && <Plane className="h-4 w-4" strokeWidth={1.8} />}
                  {step.title}
                </div>
                <div className="text-sm leading-relaxed text-[#5A5A5A]">{step.desc}</div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
