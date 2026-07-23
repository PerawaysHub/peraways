import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | PeraWays",
  description: "Datenschutzerklärung der PeraWays UG (haftungsbeschränkt)",
  robots: { index: true },
};

export default function Datenschutz() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="mb-8 font-heading text-4xl font-bold text-primary md:text-5xl">
          Datenschutzerklärung
        </h1>

        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">1. Einleitung und Verantwortlicher</h2>
            <p>
              Wir freuen uns über Ihren Besuch auf unserer Website. Der Schutz Ihrer personenbezogenen
              Daten ist uns ein wichtiges Anliegen. Im Folgenden informieren wir Sie gemäß den Vorgaben
              der Datenschutz-Grundverordnung (DSGVO) darüber, welche Daten wir erheben, wie wir sie
              nutzen und welche Rechte Ihnen zustehen.
            </p>
            <p className="font-medium text-primary">Verantwortlicher für die Datenverarbeitung auf dieser Website ist:</p>
            <address className="not-italic">
              PeraWays UG (haftungsbeschränkt) i.Gr.
              <br />
              <br />
              Vertreten durch:
              <br />
              Herrn Mario Narciso Pereira
              <br />
              Bödikersteig 1
              <br />
              13629 Berlin
              <br />
              <br />
              E-Mail für allgemeine Anfragen:{" "}
              <a href="mailto:team@peraways.de" className="text-secondary hover:underline">team@peraways.de</a>
              <br />
              E-Mail für Direktkontakt:{" "}
              <a href="mailto:team@peraways.de" className="text-secondary hover:underline">team@peraways.de</a>
            </address>
            <p className="text-xs text-muted-foreground">
              (Hinweis: Ein Datenschutzbeauftragter ist für unser Unternehmen gesetzlich nicht
              vorgeschrieben und daher nicht bestellt.)
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">2. Hosting der Website (Vercel)</h2>
            <p>
              Unsere Website wird bei dem Anbieter Vercel Inc. gehostet. Bei jedem Aufruf unserer
              Website erfasst das System automatisiert Daten (z. B. IP-Adresse, Browsertyp, Datum und
              Uhrzeit). Diese Daten sind technisch notwendig, um Ihnen unsere Website anzuzeigen und die
              Sicherheit der Systeme zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO). Mit dem
              Hostinganbieter haben wir einen Vertrag zur Auftragsverarbeitung (AVV) abgeschlossen.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">3. Kontaktaufnahme (Kontaktformular & E-Mail)</h2>
            <p>
              Wenn Sie über unser Kontaktformular oder per E-Mail Kontakt mit uns aufnehmen, werden die
              von Ihnen mitgeteilten Daten (wie Ihr Name, E-Mail-Adresse, Inhalt der Nachricht) von uns
              gespeichert, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. f DSGVO bzw. Art. 6 Abs. 1
              lit. b DSGVO bei vorvertraglichen Maßnahmen). Für unser E-Mail-Postfach und CRM (AppSheet)
              nutzen wir die sichere Infrastruktur von Google Workspace, mit denen ein AVV geschlossen wurde.
              Für die technische Zustellung der über das Kontaktformular gesendeten Nachrichten setzen wir
              zusätzlich den E-Mail-Versanddienst <strong>Resend</strong> (Resend Inc.) ein. Zur Verwaltung
              von Anfragen und Kandidatendaten nutzen wir außerdem <strong>Convex</strong> (Datenbank) und
              <strong> Clerk</strong> (Login für unser internes Team).
            </p>
            <p className="text-xs text-muted-foreground">
              [Bitte von Joseph bestätigen lassen: Standort der Datenverarbeitung bei Resend/Convex/Clerk
              und ob AVVs mit diesen Anbietern bestehen.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">4. Datenverarbeitung von Bewerbern und Talenten</h2>
            <p>
              Wenn Sie sich bei uns als Pflegefachassistenz-Talent bewerben oder wir Sie in unser
              Qualifizierungsprogramm aufnehmen, erheben wir spezifische Daten zur Erbringung unserer
              Vermittlungsdienstleistungen:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-primary">Welche Daten:</span> Identifizierungsdaten (Name, Passkopien,
                Geburtsurkunde), berufliche Informationen (Lebenslauf, Schulzeugnisse, Sprachzertifikate),
                behördliche Identifikatoren sowie – soweit gesetzlich vorgeschrieben (z. B. für das
                Visumverfahren) – Gesundheitsdaten (z. B. ärztliche Atteste, Masernschutz).
              </li>
              <li>
                <span className="font-medium text-primary">Zweck:</span> Qualifikationsprüfung, Begleitung der Ausbildung
                im Herkunftsland, Durchführung des beschleunigten Fachkräfteverfahrens
                (§ 81a AufenthG) und Vermittlung an deutsche Arbeitgeber (Pflegeeinrichtungen).
              </li>
              <li>
                <span className="font-medium text-primary">Rechtsgrundlage:</span> Die Verarbeitung ist für die Erfüllung
                (vor-)vertraglicher Maßnahmen zur Vermittlung erforderlich (Art. 6 Abs. 1 lit. b DSGVO).
                Die Verarbeitung besonderer Datenkategorien (Gesundheitsdaten) erfolgt auf Basis Ihrer
                ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO) oder zur Erfüllung arbeits- und
                sozialrechtlicher Pflichten (Art. 9 Abs. 2 lit. b DSGVO).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">5. Datenverarbeitung von Geschäftspartnern (Kunden / Träger)</h2>
            <p>
              Wenn Sie für ein Unternehmen arbeiten, mit dem wir Geschäfte tätigen oder anbahnen wollen
              (z. B. Pflegeeinrichtungen), verarbeiten wir Ihre Daten:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-primary">Welche Daten:</span> Kontaktdaten der Ansprechpartner
                (Name, E-Mail, Telefon), berufliche Position und vertragliche Informationen.
              </li>
              <li>
                <span className="font-medium text-primary">Zweck:</span> B2B-Leadgenerierung (Direktansprache),
                Vertragsanbahnung, Verwaltung des Vermittlungsvertrages und Rechnungsstellung.
              </li>
              <li>
                <span className="font-medium text-primary">Rechtsgrundlage:</span> Erfüllung eines Vertrages
                (Art. 6 Abs. 1 lit. b DSGVO) sowie unser berechtigtes Interesse an der
                Geschäftsentwicklung und dem Ausbau unseres Kundenstamms (Art. 6 Abs. 1 lit. f DSGVO).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">6. Weitergabe an Dritte und Datenübermittlung in Drittstaaten</h2>
            <p>
              Im Rahmen unserer Vermittlungstätigkeit geben wir personenbezogene Daten an folgende
              Dritte weiter:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-primary">Arbeitgeber:</span> Wir übermitteln Profile und Dokumente von
                Talenten an kooperierende Pflegeeinrichtungen in Deutschland zur Vertragsanbahnung.
              </li>
              <li>
                <span className="font-medium text-primary">Behörden:</span> Zur Beantragung von Visa und Aufenthaltstiteln
                übermitteln wir Daten an die zuständigen Auslandsvertretungen, das Landesamt für
                Einwanderung (LEA Berlin), die Bundesagentur für Arbeit und Anerkennungsstellen.
              </li>
              <li>
                <span className="font-medium text-primary">Drittlandübermittlung (Kenia):</span> Da PeraWays in enger
                Kooperation mit Bildungspartnern in Kenia (z. B. Gillian Sabatia Training College)
                arbeitet, können Daten dorthin übermittelt werden. Dies erfolgt zur Erfüllung des
                Vermittlungsvertrages mit dem Talent (Art. 49 Abs. 1 lit. b DSGVO) oder auf Basis
                entsprechender Garantien zum Datenschutzniveau.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">7. Cookies und Tracking</h2>
            <p>
              Unsere Website verwendet derzeit ausschließlich technisch notwendige Cookies, die für den
              fehlerfreien Betrieb der Seite unerlässlich sind (Art. 6 Abs. 1 lit. f DSGVO sowie § 25
              Abs. 2 TTDSG). Auf Analyse-Tools (wie Google Analytics) verzichten wir aktuell vollständig.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">8. Speicherdauer</h2>
            <p>Wir speichern Ihre Daten nur so lange, wie es für die genannten Zwecke erforderlich ist:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-primary">Bewerberdaten:</span> Werden nach Abschluss des
                Vermittlungsprozesses oder bei Absagen in der Regel nach 6 Monaten gelöscht, sofern Sie
                nicht in eine längere Speicherung eingewilligt haben.
              </li>
              <li>
                <span className="font-medium text-primary">Geschäftsdaten:</span> Rechnungs- und Vertragsdaten speichern
                wir gemäß den gesetzlichen Aufbewahrungsfristen (im Regelfall 6 bis 10 Jahre nach HGB
                und AO). B2B-Kontaktdaten für die Akquise werden gelöscht, sobald Sie Widerspruch
                einlegen oder kein geschäftliches Interesse mehr besteht.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">9. Ihre Rechte als betroffene Person</h2>
            <p>Unter den Voraussetzungen der DSGVO stehen Ihnen folgende Rechte zu:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO) – insbesondere gegen Direktwerbung.</li>
              <li>Widerruf von Einwilligungen – jederzeit mit Wirkung für die Zukunft.</li>
            </ul>
            <p>
              Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter{" "}
              <a href="mailto:team@peraways.de" className="text-secondary hover:underline">team@peraways.de</a>.
              Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren
              (Art. 77 DSGVO).
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
