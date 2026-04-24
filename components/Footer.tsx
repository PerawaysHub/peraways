"use client";

import Link from "next/link";
import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-10 md:grid-cols-3">
          <FadeUp>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="PeraWays"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h3 className="font-heading text-2xl font-bold text-white">PeraWays</h3>
              </div>
              <p className="text-white/70">Beyond Borders.</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-white">Standort</h4>
              <p className="text-white/70">Berlin — Ihr Partner vor Ort</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-white">Kontakt</h4>
              <p className="text-white/70">Erstgespräch vereinbaren</p>
              <p className="text-white/70">Batches Mai & November</p>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <div className="mb-12">
            <Link href="#kontakt" className="block">
              <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Jetzt Erstgespräch vereinbaren
              </Button>
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-sm text-white/50">© 2025 PeraWays GmbH</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-white/50 hover:text-white">
                Impressum
              </Link>
              <Link href="#" className="text-sm text-white/50 hover:text-white">
                Datenschutz
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </footer>
  );
}