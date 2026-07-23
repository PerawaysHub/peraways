"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { translations } from "./translations";
import { MapPin, Phone, Mail, Globe, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "#mission", label: "Mission" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#loesung", label: "Wie es funktioniert" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Footer() {
  const content = translations.de;

  return (
    <footer className="bg-primary">
      <div className="mx-auto max-w-7xl px-4">
        <div className="border-b border-white/10 py-12 lg:py-16">
          <FadeUp>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">
                  Bereit für Ihre erste Fachkraft?
                </h3>
                <p className="mt-1 text-white/60">
                  Kostenloses Erstgespräch — unverbindlich.
                </p>
              </div>
              <Link href="#kontakt">
                <Button size="lg" className="rounded-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  {content.footer.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <FadeUp>
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center ">
                <Image src="/logo.svg" alt="Peraways" width={28} height={28} className="w-7 h-7 brightness-0 invert" />
                <span className="text-xl font-bold text-white">
                  <span className="font-logo">Pera</span>
                  <span className="font-normal text-accent">ways</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-white/50">
                Wir verbinden Nakuru und Berlin, Schritt für Schritt und mit Substanz.
              </p>
              <div className="text-[13px] text-white/40">
                Bildung ermöglichen. Pflege stärken. Menschen verbinden.
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Navigation
              </h4>
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/50 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Kontakt
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="tel:+4915563362232" className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>0155 633 622 32</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:team@peraways.de" className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>team@peraways.de</span>
                  </a>
                </li>
                <li>
                  <a href="https://peraways.de" className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span>www.peraways.de</span>
                  </a>
                </li>
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Firmensitz
              </h4>
              <address className="flex flex-col gap-1 not-italic text-sm text-white/50">
                <span className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    PeraWays UG (haftungsbeschränkt)
                    <br />
                    Bödikersteig 1
                    <br />
                    13629 Berlin
                  </span>
                </span>
              </address>
              <div className="pt-2 text-xs text-white/35">
                <p>Amtsgericht Charlottenburg</p>
                <p>GF: Mario Narciso Pereira</p>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-xs text-white/35">{content.footer.copyright}</p>
          <div className="flex gap-4">
            <Link href="/impressum" className="text-xs text-white/35 hover:text-white/70 transition-colors">
              {content.footer.impressum}
            </Link>
            <Link href="/datenschutz" className="text-xs text-white/35 hover:text-white/70 transition-colors">
              {content.footer.datenschutz}
            </Link>
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
              <button className="text-xs text-white/35 hover:text-white/70 transition-colors cursor-pointer">
                CRM Login
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
