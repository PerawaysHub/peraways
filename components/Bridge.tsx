"use client";

import { FadeUp, StaggerContainer, StaggerItem } from "./FadeUp";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";
import { 
  Heart, 
  Clock, 
  GraduationCap, 
  Languages, 
  Briefcase, 
  Home,
  ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const icons = [
  Heart,
  Clock,
  GraduationCap,
  Languages,
  Briefcase,
  Home,
];

const iconsEN = [
  { icon: Heart, title: "Ethical", desc: "No recruitment fees. Debt-free relocation for all talent.", detail: "We consistently apply the 'Employer Pays Principle' following the ethical WHO code. By financing the preparation, our talents relocate completely debt-free. This creates exceptional loyalty and binds motivated personnel to your facility long-term." },
  { icon: Clock, title: "Fast", desc: "LEA Fast-Lane process under § 81a. Decision-ready files in weeks.", detail: "Thanks to insider expertise at LEA Berlin, we deliver 100% decision-ready files under § 81a AufenthG. The German-Kenyan migration agreement also eliminates priority checks. This saves valuable time and guarantees legally secure, precise planning." },
  { icon: GraduationCap, title: "Qualified", desc: "467 documented practice hours. NITA Level 3 certified.", detail: "Our talents are clinically pre-qualified: They bring 467 documented practice hours and the Caregiver Level 3 certificate. With this solid foundation, they are perfectly prepared to start the 18-month PFA training immediately." },
  { icon: Languages, title: "Language Ready", desc: "B1 German training completed before arrival.", detail: "Language preparation is a core pillar of our 'Golden P-Bridge'. Our talents complete a 10-month intensive training in Kenya, aiming to securely reach B1 level before entry. This ensures smooth communication in daily care from day one." },
  { icon: Briefcase, title: "Work Immediately", desc: "§ 16a permits 20h/week work from day 1 in Germany.", detail: "Benefit from day one: Our talents arrive two months before training starts and can immediately work 20 hours/week as nursing assistants (§ 16a Abs. 3 AufenthG). This lead time significantly relieves your teams and enables relaxed onboarding before the first school day." },
  { icon: Home, title: "Housing Provided", desc: "We partner with employers who offer accommodation.", detail: "Housing is the critical success factor for visa approval. By providing accommodation, the mathematical subsistence guarantee under § 2 Abs. 3 AufenthG is legally secured. We work exclusively with partners who can lay this important foundation for their new specialists." },
];

const iconsDE = [
  { icon: Heart, title: "Ethisch", desc: "Keine Vermittlungsgebühren. Schuldenfreie Einreise für alle Talente.", detail: "Wir setzen konsequent auf das 'Employer Pays Principle' nach dem ethischen WHO-Kodex. Da Sie die Vorbereitung finanzieren, reisen unsere Talente völlig schuldenfrei ein. Dies schafft eine außergewöhnlich hohe Loyalität und bindet motiviertes Fachpersonal langfristig an Ihr Haus." },
  { icon: Clock, title: "Schnell", desc: "LEA Fast-Lane Verfahren nach § 81a. Entscheidungsreife Akten in wenigen Wochen.", detail: "Dank Insider-Expertise zum LEA Berlin liefern wir zu 100 % entscheidungsreife Akten gemäß § 81a AufenthG. Durch das deutsch-kenianische Migrationsabkommen entfällt zudem die Vorrangprüfung. Das spart wertvolle Zeit und garantiert Ihnen eine rechtssichere, präzise Planung." },
  { icon: GraduationCap, title: "Qualifiziert", desc: "467 dokumentierte Praxisstunden. NITA Level 3 zertifiziert.", detail: "Unsere Talente sind klinisch vorqualifiziert: Sie bringen 467 dokumentierte Praxisstunden sowie das Caregiver-Level-3-Zertifikat mit. Mit diesem soliden Fundament sind sie bestens vorbereitet, um sofort fachkundig in die 18-monatige PFA-Ausbildung zu starten." },
  { icon: Languages, title: "Grundlegende Deutschkenntnisse", desc: "B1 Deutsch VOR Anreise abgeschlossen.", detail: "Die sprachliche Vorbereitung ist ein Kernpfeiler der 'Goldenen P-Brücke'. Unsere Talente absolvieren in Kenia ein 10-monatiges Intensivtraining mit dem Ziel, das B1-Niveau bereits vor der Einreise sicher abzuschließen. Dies gewährleistet eine reibungslose Kommunikation im Pflegealltag von Beginn an." },
  { icon: Briefcase, title: "Sofort arbeitsbereit", desc: "§ 16a erlaubt 20h/Woche Arbeit ab Tag 1 in Deutschland.", detail: "Profitieren Sie ab Tag eins: Unsere Talente landen zwei Monate vor Ausbildungsstart und dürfen direkt 20 Std./Woche als Pflegehelfer unterstützen (§ 16a Abs. 3 AufenthG). Dieser Vorlauf entlastet Ihre Teams spürbar und ermöglicht ein entspanntes Onboarding vor dem ersten Schultag." },
  { icon: Home, title: "Wohnraum", desc: "Wir arbeiten bevorzugt mit Arbeitgebern welche Wohnraum anbieten oder aktiv bei der Suche unterstützen.", detail: "Für das Visum ist ein Mietvertrag erforderlich. Dank des 20/20-Modells trägt das Talent die Miete ab dem ersten Tag selbst. Ob Ihr Haus Wohnraum bereitstellt und direkt mit dem Talent abrechnet oder wir gemeinsam eine externe Lösung organisieren: Wir koordinieren beides in Absprache." },
];

export function Bridge() {
  const { lang, t } = useLanguage();
  const content = lang === "de" ? translations.de : translations.en;
  const features = lang === "de" ? iconsDE : iconsEN;

  return (
    <section id="loesung" className="bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeUp>
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-secondary">
            {content.bridge.label}
          </span>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h2 className="mb-16 font-heading text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
            {content.bridge.h2}
          </h2>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeUp key={feature.title} delay={0.2 + index * 0.1}>
                <Dialog>
                  <DialogTrigger render={<div className="group relative flex h-full min-h-[340px] cursor-pointer flex-col rounded-2xl border border-gray-100 bg-gray-50/50 p-8 transition-all hover:border-secondary/30 hover:bg-gray-100">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    
                    <div className="absolute right-6 top-8 text-4xl font-bold text-secondary/20">
                      0{index + 1}
                    </div>
                    
                    <h3 className="mb-3 text-2xl font-bold text-primary">
                      {feature.title}
                    </h3>
                    
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                    
                    <div className="mt-auto flex items-center text-sm font-medium text-secondary">
                      <span className="flex items-center">
                        Learn more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>} nativeButton={false} />
                  
                  <DialogContent className="sm:max-w-lg overflow-hidden p-6">
                    <div className="flex items-center w-full justify-between gap-4 bg-linear-to-br from-primary/5 to-secondary/5 p-6 pb-4">
                      {/* <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                        <span className="text-sm font-bold">0{index + 1}</span>
                      </div> */}
                      <DialogTitle className="text-2xl font-bold text-primary">
                        {feature.title}
                      </DialogTitle>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      
                    </div>
                    <DialogDescription className="px-6 pb-6 text-base leading-relaxed text-muted-foreground">
                      {feature.detail}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}