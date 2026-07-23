"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}

export function CountUp({ target, prefix = "", suffix = "", delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let count = 0;
      const inc = target / 60;
      const interval = setInterval(() => {
        count += inc;
        if (count >= target) {
          setDisplay(`${prefix}${target.toLocaleString("de-DE")}${suffix}`);
          clearInterval(interval);
        } else {
          setDisplay(`${prefix}${Math.floor(count).toLocaleString("de-DE")}${suffix}`);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, target, prefix, suffix, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
