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
  const finalDisplay = `${prefix}${target.toLocaleString("de-DE")}${suffix}`;
  // Default to the real final value so it's never wrong if JS is slow, blocked, or the
  // in-view animation never fires — the count-up is a progressive enhancement on top of it.
  const [display, setDisplay] = useState(finalDisplay);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let count = 0;
      const inc = target / 60;
      const interval = setInterval(() => {
        count += inc;
        if (count >= target) {
          setDisplay(finalDisplay);
          clearInterval(interval);
        } else {
          setDisplay(`${prefix}${Math.floor(count).toLocaleString("de-DE")}${suffix}`);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, target, prefix, suffix, delay, finalDisplay]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
