"use client";

import { FadeUp } from "./FadeUp";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { Send, Loader2 } from "lucide-react";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "YOUR_APPS_SCRIPT_URL";

export function Form() {
  const { lang } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const mountTime = useRef(Date.now());
  const honeyRef = useRef<HTMLInputElement>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://peraways.de";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot: silently reject if bot filled hidden field
    if (honeyRef.current?.value) {
      window.location.href = `${origin}/danke?lang=${lang}`;
      return;
    }

    // Time check: reject if submitted too fast (< 3s, likely a bot)
    if (Date.now() - mountTime.current < 3000) {
      window.location.href = `${origin}/danke?lang=${lang}`;
      return;
    }

    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("lang", lang);
    data.set("_origin", origin);
    data.set("_honey", honeyRef.current?.value || "");

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });

      window.location.href = `${origin}/danke?lang=${lang}`;
    } catch {
      setError(content.form.formError);
      setSubmitting(false);
    }
  }

  return (
    <section id="kontakt" className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3 items-start">
          <FadeUp>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-secondary">
              {content.form.label}
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-heading text-4xl font-bold text-primary md:text-5xl">
              {content.form.h2}
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-4 text-lg text-muted-foreground">{content.form.p}</p>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="text"
                name="Name"
                placeholder={content.form.namePlaceholder}
                className="h-12 rounded-lg"
                required
              />
              <Input
                type="email"
                name="Email"
                placeholder={content.form.emailPlaceholder}
                className="h-12 rounded-lg"
                required
              />
            </div>

            <Input
              type="tel"
              name="Telefon"
              placeholder={content.form.phonePlaceholder}
              className="h-12 rounded-lg"
            />

            <Textarea
              name="Nachricht"
              placeholder={content.form.messagePlaceholder}
              rows={4}
              className="rounded-lg"
              required
            />

            <input
              ref={honeyRef}
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full rounded-full gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {content.form.submit}
            </Button>
          </form>
        </FadeUp>

        <FadeUp delay={0.4}>
          <p className="text-xs text-muted-foreground">{content.form.privacy}</p>
        </FadeUp>
      </div>
    </section>
  );
}
