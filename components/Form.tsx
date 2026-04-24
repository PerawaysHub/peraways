"use client";

import { FadeUp } from "./FadeUp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="kontakt" className="bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-2xl px-6">
        <FadeUp>
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
            Kontakt
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="mb-6 font-heading text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
            Batches im Mai & November — Sichern Sie sich Ihr Kontingent.
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mb-12 text-xl text-muted-foreground">
            Die Plätze sind begrenzt. Wir melden uns innerhalb von 24 Stunden.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
                className="h-14 rounded-2xl"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="E-Mail-Adresse *"
                value={formData.email}
                onChange={handleChange}
                className="h-14 rounded-2xl"
                required
              />
            </div>

            <div>
              <Input
                type="tel"
                name="phone"
                placeholder="Telefonnummer *"
                value={formData.phone}
                onChange={handleChange}
                className="h-14 rounded-2xl"
                required
              />
            </div>

            <div>
              <Textarea
                name="message"
                placeholder="Nachricht (optional)"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="rounded-2xl"
              />
            </div>

            <Button type="submit" size="lg" className="rounded-full text-base">
              Anfrage senden →
            </Button>
          </form>
        </FadeUp>

        <FadeUp delay={0.4}>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            🔒 Ihre Daten werden vertraulich behandelt und nicht an Dritte
            weitergegeben.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}