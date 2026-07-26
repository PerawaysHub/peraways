"use client";

import { FadeUp } from "./FadeUp";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { translations } from "./translations";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Send, Loader2, Lock, Mail, Phone } from "lucide-react";

export function Form() {
  const content = translations.de.form;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const mountTime = useRef(Date.now());
  const honeyRef = useRef<HTMLInputElement>(null);
  const submitContact = useMutation(api.contact.submit);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://peraways.de";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (honeyRef.current?.value) {
      window.location.href = `${origin}/danke`;
      return;
    }

    if (Date.now() - mountTime.current < 3000) {
      window.location.href = `${origin}/danke`;
      return;
    }

    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("Name") as string) || "";
    const einrichtung = (formData.get("Einrichtung") as string) || "";
    const email = (formData.get("Email") as string) || "";
    const telefon = (formData.get("Telefon") as string) || "";
    const nachricht = (formData.get("Nachricht") as string) || "";

    try {
      await submitContact({ name, email, telefon, einrichtung, nachricht, lang: "de" });

      window.location.href = `${origin}/danke`;
    } catch {
      setError(content.formError);
      setSubmitting(false);
    }
  }

  return (
    <section id="kontakt" className="relative overflow-hidden bg-[#F7EDE9] px-6 py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-secondary/10" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          <FadeUp>
            <span className="mb-6 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              {content.label}
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="mb-5 font-heading text-4xl font-semibold leading-tight text-primary">
              {content.h2}
            </h2>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="mb-8 max-w-sm text-lg leading-relaxed text-[#3A4A42]">{content.p}</p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mb-10 flex items-center gap-2.5 text-sm font-semibold text-accent">
              <Lock className="h-4 w-4" strokeWidth={1.8} />
              {content.privacyNote}
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div className="flex flex-col gap-4">
              <a href="mailto:team@peraways.de" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                  <Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5A5A]">
                    {content.emailLabel}
                  </div>
                  <div className="text-[15px] font-semibold text-primary">{content.email}</div>
                </div>
              </a>
              <a href="tel:+4915563362232" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                  <Phone className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5A5A]">
                    {content.phoneLabel}
                  </div>
                  <div className="text-[15px] font-semibold text-primary">{content.phone}</div>
                </div>
              </a>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-3xl border border-white/85 bg-white/75 p-10 shadow-[0_16px_48px_rgba(25,70,60,0.10)] backdrop-blur-xl"
          >
            <h3 className="text-xl font-semibold text-primary">15 Minuten reichen.</h3>
            <p className="-mt-2 text-sm text-[#3A4A42]">
              In 15 Minuten merken wir beide, ob wir zueinander passen. Ohne Verkaufsdruck, denn wir nehmen Pflege genauso ernst wie Sie.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="text" name="Name" placeholder="Name" className="h-12 rounded-xl" required />
              <Input type="text" name="Einrichtung" placeholder="Einrichtung" className="h-12 rounded-xl" required />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="email" name="Email" placeholder="E-Mail" className="h-12 rounded-xl" required />
              <Input type="tel" name="Telefon" placeholder="Telefon (optional)" className="h-12 rounded-xl" />
            </div>

            <Textarea name="Nachricht" placeholder="Nachricht (optional)" rows={3} className="rounded-xl" />

            <input
              ref={honeyRef}
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full rounded-full gap-2 bg-gradient-to-br from-primary to-[#2A6B5E]"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Erstgespräch anfragen
            </Button>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
