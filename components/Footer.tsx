"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import { translations } from "./translations";

const navLinks = [
  { href: "#mission", label: "Mission" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#loesung", label: "Wie es funktioniert" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Footer() {
  const content = translations.de;

  return (
    <footer style={{ background: "#0F2820" }} className="px-6 pb-9 pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 border-b border-white/[0.08] pb-12 sm:grid-cols-3">
        <div>
          <Link href="/" className="mb-5 flex items-center">
            <Image
              src="/logo-full-white.png"
              alt="Peraways"
              width={993}
              height={225}
              className="h-9 w-auto"
            />
          </Link>
          <p className="mb-6 max-w-[300px] text-[15px] leading-relaxed text-[#7FA278]">
            Wir verbinden Nakuru und Berlin, Schritt für Schritt und mit Substanz.
          </p>
          <div className="text-[13px] text-[#4A6B48]">
            Bildung ermöglichen. Pflege stärken. Menschen verbinden.
          </div>
        </div>

        <div>
          <div className="mb-5 text-xs font-bold uppercase tracking-wider text-[#4A6B48]">
            Navigation
          </div>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-[#C9D9C5] no-underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-5 text-xs font-bold uppercase tracking-wider text-[#4A6B48]">
            Kontakt
          </div>
          <div className="flex flex-col gap-3">
            <a href="tel:+4915563362232" className="text-sm text-[#C9D9C5] no-underline">
              0155 633 622 32
            </a>
            <a href="mailto:team@peraways.de" className="text-sm text-[#C9D9C5] no-underline">
              team@peraways.de
            </a>
            <div className="mt-1 text-[13px] leading-relaxed text-[#4A6B48]">
              PeraWays UG (haftungsbeschränkt)
              <br />
              Bödikersteig 1 · 13629 Berlin
              <br />
              GF: Mario Narciso Pereira
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 pt-7 sm:flex-row">
        <div className="text-[13px] text-[#3A5A38]">{content.footer.copyright}</div>
        <div className="flex gap-6">
          <Link href="/impressum" className="text-[13px] text-[#3A5A38] no-underline">
            {content.footer.impressum}
          </Link>
          <Link href="/datenschutz" className="text-[13px] text-[#3A5A38] no-underline">
            {content.footer.datenschutz}
          </Link>
          <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
            <button className="cursor-pointer text-[13px] text-[#3A5A38]">CRM Login</button>
          </SignInButton>
        </div>
      </div>
    </footer>
  );
}
