"use client";

import { FadeUp } from "./FadeUp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function Form() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="kontakt" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-xl px-4">
        <FadeUp>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            {content.form.label}
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="mb-3 font-heading text-3xl font-bold text-primary md:text-4xl">
            {content.form.h2}
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mb-6 text-muted-foreground">{content.form.p}</p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="text"
              name="name"
              placeholder={content.form.namePlaceholder}
              value={formData.name}
              onChange={handleChange}
              className="h-11 rounded-lg"
              required
            />
            <Input
              type="email"
              name="email"
              placeholder={content.form.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              className="h-11 rounded-lg"
              required
            />
            <Input
              type="tel"
              name="phone"
              placeholder={content.form.phonePlaceholder}
              value={formData.phone}
              onChange={handleChange}
              className="h-11 rounded-lg"
              required
            />
            <Textarea
              name="message"
              placeholder={content.form.messagePlaceholder}
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="rounded-lg"
            />
            <Button type="submit" size="lg" className="rounded-full gap-2">
              {content.form.submit}
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </FadeUp>

        <FadeUp delay={0.4}>
          <p className="mt-3 text-xs text-muted-foreground">{content.form.privacy}</p>
        </FadeUp>
      </div>
    </section>
  );
}