"use client";

import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { Send } from "lucide-react";

export function Form() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  return (
    <section id="kontakt" className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3 items-start ">
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
          <form
            action="https://formsubmit.co/kontakt@peraways.de"
            method="POST"
            className="flex flex-col gap-3"
          >
            <input type="hidden" name="_subject" value="Neue Kontaktanfrage — PeraWays" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="text" name="_honey" style={{ display: "none" }} />

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

            <Button type="submit" size="lg" className="mt-2 w-full rounded-full gap-2">
              {content.form.submit}
              <Send className="w-4 h-4" />
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