"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const show = immediate || isInView;

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}