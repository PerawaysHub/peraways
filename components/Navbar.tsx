"use client";

import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navLinks = [
  { href: "#problem", label: "Das Problem" },
  { href: "#loesung", label: "Die Lösung" },
  { href: "#roi", label: "ROI" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setScrolled(y > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{
        borderColor: scrolled ? "rgba(0,0,0,0.08)" : "transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="PeraWays"
            width={36}
            height={36}
            className="w-8 h-8 md:w-9 md:h-9"
          />
          <span className="font-heading text-xl font-bold text-primary">PeraWays</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="#kontakt">
          <Button className="rounded-full">Erstgespräch vereinbaren</Button>
        </Link>
      </div>
    </motion.nav>
  );
}