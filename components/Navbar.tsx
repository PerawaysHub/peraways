"use client";

import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/components/translations";
import { Globe, Menu, X } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setScrolled(y > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navLinks = [
    { href: "#problem", label: t(translations.de.nav.problem, translations.en.nav.problem) },
    { href: "#loesung", label: t(translations.de.nav.loesung, translations.en.nav.loesung) },
    { href: "#roi", label: t(translations.de.nav.roi, translations.en.nav.roi) },
    { href: "#kontakt", label: t(translations.de.nav.kontakt, translations.en.nav.kontakt) },
  ];

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="PeraWays"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-primary">
            <span className="font-heading">Pera</span>
            <span className="text-accent font-normal">ways</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
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
          <button
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{lang}</span>
          </button>

          <Link href="#kontakt" className="hidden sm:block">
            <Button size="sm" className="rounded-full">
              {t(translations.de.nav.cta, translations.en.nav.cta)}
            </Button>
          </Link>

          <button
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
          className="border-t bg-white px-4 py-4 lg:hidden"
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
              <Button className="w-full rounded-full">
                {t(translations.de.nav.cta, translations.en.nav.cta)}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}