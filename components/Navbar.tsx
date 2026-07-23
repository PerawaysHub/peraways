"use client";

import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "#mission", label: "Mission" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#loesung", label: "Wie es funktioniert" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setScrolled(y > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#F4F1EC]/[0.82] backdrop-blur-2xl border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{
        borderColor: scrolled ? "rgba(25,70,60,0.10)" : "transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Peraways"
            width={32}
            height={32}
            loading="eager"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-primary">
            <span className="font-logo">Pera</span>
            <span className="text-accent font-normal">ways</span>
          </span>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
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

        <div className="flex items-center gap-3">
          <Link href="#kontakt" className="hidden sm:block">
            <Button size="sm" className="rounded-full gap-2 bg-gradient-to-br from-primary to-[#2A6B5E]">
              Erstgespräch vereinbaren
            </Button>
          </Link>

          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t bg-[#F4F1EC] px-4 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link href="#kontakt" onClick={() => setMenuOpen(false)}>
              <Button className="w-full rounded-full">Erstgespräch vereinbaren</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
