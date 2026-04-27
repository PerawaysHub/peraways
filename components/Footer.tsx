"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { MapPin, Calendar } from "lucide-react";

export function Footer() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  return (
    <footer className="bg-primary py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <FadeUp>
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Peraways" width={28} height={28} className="w-7 h-7" />
              <span className="text-xl font-bold text-white">
                <span className="font-logo">Pera</span>
                <span className="font-normal text-accent">ways</span>
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{content.footer.location}</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{content.footer.batches}</span>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <Link href="#kontakt" className="block mb-8">
            <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {content.footer.cta}
            </Button>
          </Link>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/40">{content.footer.copyright}</p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-white/40 hover:text-white">
                {content.footer.impressum}
              </Link>
              <Link href="#" className="text-xs text-white/40 hover:text-white">
                {content.footer.datenschutz}
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </footer>
  );
}