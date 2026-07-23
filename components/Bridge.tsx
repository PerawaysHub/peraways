"use client";

import { FadeUp } from "./FadeUp";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const features = [
  {
    number: "01",
    title: "Ethisch",
    desc: "Die Reise- und Transferkosten trägt das Nakuru County vor. Kein Talent zahlt einen Cent. Kein Vorschuss für Sie.",
    modalTitle: "Ethisch, weil sie es verdienen.",
    modalText:
      "Wir folgen konsequent dem Employer Pays Principle der WHO. Die Reise- und Transferkosten der Talente werden durch das Nakuru County vorfinanziert. Ihr Azubi zahlt für seinen Bildungsweg nichts, weder Agenturgebühren noch eine Rückzahlungsklausel im Arbeitsvertrag. Und Sie treten erst dann in Vorleistung, wenn Ihr Azubi seinen ersten dokumentierten Arbeitstag bei Ihnen hatte.",
    tags: [
      "WHO Employer Pays Principle",
      "Nakuru County Vorfinanzierung",
      "Kein Vorschuss für den Träger",
      "Schuldenfreie Einreise garantiert",
    ],
  },
  {
    number: "02",
    title: "Schnell",
    desc: "LEA Fast-Lane nach § 81a. Entscheidungsreife Akten. Botschaftstermin Nairobi in Wochen statt Monaten.",
    modalTitle: "Schnell, weil wir das System von innen kennen.",
    modalText:
      "Unser Gründer hat selbst beim Landesamt für Einwanderung Berlin gearbeitet. Diese Erfahrung nutzen wir für Sie. Das beschleunigte Fachkräfteverfahren nach § 81a AufenthG ermöglicht eine Vorabzustimmung durch das LEA, noch bevor das Talent zur Deutschen Botschaft in Nairobi fährt. Wir reichen unsere Akten erst ein, wenn sie vollständig entscheidungsreif sind. Das erspart Ihnen Rückfrageschleifen.",
    tags: [
      "§ 81a AufenthG Vorabzustimmung",
      "LEA-Insider-Expertise",
      "Botschaftstermin Nairobi in Wochen",
      "Keine Vorrangprüfung",
    ],
  },
  {
    number: "03",
    title: "Qualifiziert",
    desc: "467 dokumentierte Praxisstunden. NITA Caregiver Level 3. UN-akkreditiertes GSTC.",
    modalTitle: "467 Stunden, die Ihr Team spüren wird.",
    modalText:
      "Am Gillian Sabatia Training College in Nakuru absolvieren unsere Talente eine zehnmonatige Intensivausbildung, darunter 467 klinische Praxisstunden nach NITA-Standard, Caregiver Level 3. Hygiene, Vitalzeichenmessung, Mobilisation und Grundpflege werden dokumentiert und zertifiziert. Das GSTC ist UN-akkreditiert. Wenn ein Talent bei Ihnen anfängt, kennt es die Grundlagen der Pflege bereits.",
    tags: [
      "467 dokumentierte Praxisstunden",
      "NITA Caregiver Level 3",
      "UN-akkreditiertes GSTC",
      "Grundpflege und Vitalzeichen",
    ],
  },
  {
    number: "04",
    title: "Grundlegende Deutschkenntnisse",
    desc: "B1-Zertifikat vor Einreise. Parallel zur klinischen Ausbildung. Kein separater Kurs für Sie.",
    modalTitle: "B1 Deutsch, mitgebracht aus Nakuru.",
    modalText:
      "Das Deutschtraining läuft parallel zur klinischen Ausbildung am GSTC in Nakuru, ohne separaten Kurs und ohne zusätzlichen Aufwand für Sie. Bei Einreise verfügen alle Talente über das ÖSD-Zertifikat B1. In der Vorschaltphase führen sie den BAMF-Berufssprachkurs B2 fort. So kann Ihr neues Teammitglied vom ersten Tag an kommunizieren.",
    tags: [
      "ÖSD B1-Zertifikat bei Einreise",
      "Simultantraining zur klinischen Ausbildung",
      "BAMF-Sprachkurs B2 in der Vorschaltphase",
      "Visumkonform nach § 16a AufenthG",
    ],
  },
  {
    number: "05",
    title: "Sofort arbeitsbereit",
    desc: "§ 16a AufenthG erlaubt 20h/Woche als Pflegehilfskraft. Entlastung ab dem ersten Arbeitstag.",
    modalTitle: "Ab dem ersten Tag ein Teil Ihres Teams.",
    modalText:
      "Nach § 16a Abs. 3 AufenthG darf ein Talent in der Vorschaltphase bis zu 20 Stunden pro Woche als Pflegehilfskraft arbeiten. Und das bis zu 6 Monate vor dem offiziellen Ausbildungsstart. In dieser Zeit lernt Ihr neues Teammitglied Ihre Einrichtung kennen, Ihre Abläufe, Ihre Kolleginnen und Kollegen. Schon während dieser Vorschaltphase beginnt sich das Honorar zu amortisieren, deutlich vor dem offiziellen Ausbildungsstart.",
    tags: [
      "§ 16a Abs. 3 AufenthG (20h/Woche)",
      "Bis zu 6 Monate Vorschaltphase",
      "ROI startet vor Ausbildungsbeginn",
      "Team-Integration ab Tag 1",
    ],
  },
  {
    number: "06",
    title: "Wohnraum",
    desc: "Wir arbeiten ausschließlich mit Trägern, die Wohnraum bereitstellen. Teil unserer gemeinsamen Verantwortung.",
    modalTitle: "Wohnraum als Partnerschaftsbeitrag.",
    modalText:
      "PeraWays arbeitet ausschließlich mit Trägern zusammen, die Wohnraum für die Talente bereitstellen. Uns geht es dabei um eine einfache Überzeugung: Wer in einer fremden Stadt ankommen will, braucht zuerst einen sicheren Ort zum Leben. Erst dann kann sich ein Talent auf die Arbeit konzentrieren und bleibt langfristig im Team. Für die ersten Wochen bieten wir auch kurzzeitige Übergangslösungen an.",
    tags: [
      "Wohnraum als Pflichtbestandteil der Kooperation",
      "Mindestgröße 12 qm möbliert",
      "Unterstützung bei Wohnraumlösung",
      "Stabilität als Grundlage für Bindung",
    ],
  },
];

export function Bridge() {
  return (
    <section id="loesung" className="relative overflow-hidden bg-[var(--surface)] py-24">
      <div
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5"
        style={{ transform: "translate(150px, -150px)" }}
      />
      <div className="relative z-10 mx-auto mb-16 max-w-2xl text-center">
        <FadeUp>
          <span className="mb-5 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
            So funktioniert&apos;s
          </span>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="font-heading text-4xl font-semibold leading-tight text-primary">
            Warum PeraWays
            <br />
            der richtige Partner ist.
          </h2>
        </FadeUp>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1080px] grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
        {features.map((feature, index) => (
          <FadeUp key={feature.title} delay={0.15 + index * 0.05}>
            <Dialog>
              <DialogTrigger
                render={
                  <div className="card-3d flex h-full cursor-pointer flex-col rounded-2xl bg-white p-7">
                    <div className="mb-2.5 font-heading text-lg font-semibold text-secondary">
                      {feature.number}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-primary">{feature.title}</h3>
                    <p className="mb-3 text-sm leading-relaxed text-[#3A4A42]">{feature.desc}</p>
                    <span className="text-[13px] font-semibold text-secondary">Mehr erfahren →</span>
                  </div>
                }
                nativeButton={false}
              />

              <DialogContent
                className="sm:max-w-lg overflow-hidden p-6"
                overlayClassName="bg-[rgba(15,40,32,0.7)] backdrop-blur-sm"
              >
                <DialogTitle className="font-heading text-2xl font-semibold text-primary">
                  {feature.modalTitle}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed text-[#3A4A42]">
                  {feature.modalText}
                </DialogDescription>
                <div className="flex flex-col gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-2 text-sm text-primary/80">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {tag}
                    </span>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
