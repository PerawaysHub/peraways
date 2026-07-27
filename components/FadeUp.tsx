"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

/**
 * Framer Motion's IntersectionObserver-based useInView can miss the correct
 * reading during an abrupt viewport change (e.g. a mobile orientation flip
 * right after a scroll), leaving a "once: true" element permanently stuck at
 * opacity 0 even though it's clearly on screen. This is a fallback: on the
 * next resize, manually check the element's actual position and force it
 * visible if it's genuinely in the viewport. No-op once already shown.
 */
function useResizeRecovery(ref: RefObject<HTMLElement | null>, alreadyShown: boolean) {
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    if (alreadyShown) return;
    const recheck = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setForceShow(true);
      }
    };
    window.addEventListener("resize", recheck);
    window.addEventListener("orientationchange", recheck);
    return () => {
      window.removeEventListener("resize", recheck);
      window.removeEventListener("orientationchange", recheck);
    };
  }, [alreadyShown, ref]);

  return forceShow;
}

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /**
   * Skip the "scroll into view" gate and just animate on mount. Use this
   * for above-the-fold content (e.g. inside Hero) that's already visible
   * on first load - otherwise the -100px intersection margin can keep it
   * invisible until the user scrolls, since there's nothing to scroll
   * into view from.
   */
  immediate?: boolean;
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export function FadeUp({ children, delay = 0, className = "", immediate = false }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const recovered = useResizeRecovery(ref, immediate || isInView);
  const show = immediate || isInView || recovered;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={fadeUpVariants}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const recovered = useResizeRecovery(ref, isInView);
  const show = isInView || recovered;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div 
      variants={staggerItem} 
      className={className}
      layout
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function FadeIn({ children, className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const recovered = useResizeRecovery(ref, isInView);
  const show = isInView || recovered;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={fadeInVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}