import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum | PeraWays",
  description: "Angaben gemäß § 5 TMG",
  robots: {
    index: true,
  },
};

export default function Impressum() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="mb-8 font-heading text-4xl font-bold text-primary md:text-5xl">
          Impressum
        </h1>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">Firmensitz</h2>
            <address className="not-italic leading-relaxed">
              PeraWays UG (haftungsbeschränkt)
              <br />
              Bödikersteig 1
              <br />
              13629 Berlin
            </address>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">Kontakt</h2>
            <div className="leading-relaxed">
              <p>
                Mobil:{" "}
                <a href="tel:+4915563362232" className="text-secondary hover:underline">
                  0155 633 622 32
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a href="mailto:kontakt@peraways.de" className="text-secondary hover:underline">
                  kontakt@peraways.de
                </a>
              </p>
              <p>
                Web:{" "}
                <a href="https://peraways.de" className="text-secondary hover:underline">
                  www.peraways.de
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">Registerdaten</h2>
            <div className="leading-relaxed">
              <p>Sitz der Gesellschaft: Berlin</p>
              <p>Amtsgericht Charlottenburg</p>
              <p>Geschäftsführer: Mario Pereira</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">Haftungsausschluss</h2>
            <p className="text-sm leading-relaxed">
              Die Inhalte unserer Webseiten wurden mit größtmöglicher Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr
              übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary">Datenschutz</h2>
            <p className="text-sm leading-relaxed">
              Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten
              möglich. Die Erhebung personenbezogener Daten erfolgt nur auf freiwilliger Basis und
              ausschließlich für den angegebenen Zweck.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
