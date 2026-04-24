"use client";

import { FadeUp } from "./FadeUp";
import { useRef, useEffect, useState } from "react";
import { useInView, useSpring, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setCount(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 90, suffix: " Tage", label: "Amortisation", sublabel: "Schnellster ROI im Marktvergleich" },
  { value: 467, suffix: " Std.", label: "Klinische Praxis", sublabel: "Dokumentiert, Level 3 zertifiziert" },
  { value: 10, suffix: " Monate", label: "Intensivtraining", sublabel: "Sprache & Praxis vor Anreise" },
  { value: 20, suffix: "h", label: "Sofort-Arbeitsoption", sublabel: "Pro Woche ab dem ersten Tag" },
];

function StatBlock({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  return (
    <FadeUp delay={index * 0.1}>
      <Card className="bg-white/10 border-0 backdrop-blur-sm">
        <CardContent className="flex flex-col p-8 text-center">
          <span className="mb-2 font-heading text-5xl font-bold text-white">
            <CountUp value={stat.value} />
            <span className="text-2xl">{stat.suffix}</span>
          </span>
          <span className="mb-1 text-lg font-bold text-white">{stat.label}</span>
          <span className="text-sm text-white/70">{stat.sublabel}</span>
        </CardContent>
      </Card>
    </FadeUp>
  );
}

export function Stats() {
  return (
    <section className="bg-primary py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <FadeUp>
          <h2 className="mb-20 text-center font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Die Zahlen sprechen für sich.
          </h2>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatBlock key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}