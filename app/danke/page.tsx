import Link from "next/link";
import { CheckCircle } from "lucide-react";

const content = {
  de: {
    title: "Vielen Dank!",
    text: "Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen. Bei dringenden Fragen erreichen Sie uns auch direkt unter",
    cta: "Zurück zur Startseite",
  },
  en: {
    title: "Thank you!",
    text: "We have received your request and will get back to you within 24 hours. For urgent matters, please contact us directly at",
    cta: "Back to home",
  },
};

export default async function Danke(props: { searchParams?: Promise<{ lang?: string }> }) {
  const searchParams = await props.searchParams;
  const lang = searchParams?.lang === "en" ? "en" : "de";
  const t = content[lang];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
          <CheckCircle className="h-10 w-10 text-secondary" />
        </div>

        <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-4 text-lg text-white/70">
          {t.text}{" "}
          <a href="mailto:kontakt@peraways.de" className="text-secondary hover:underline">
            kontakt@peraways.de
          </a>
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
        >
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
