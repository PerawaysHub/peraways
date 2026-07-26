import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"

export type AnschreibenData = {
  name: string
  geburtsdatum: string
  passnummer: string
  herkunftsland: string
  traegerName: string
  traegerAdresse: string
  ausbildungsbeginn: string
  datum: string
}

const GREEN_DARK = "#19463C"
const GREEN_LIGHT = "#56A476"
const GREY = "#8A8A8A"
const TEXT = "#1A1A1A"

const styles = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingBottom: 104,
    paddingLeft: 60,
    paddingRight: 56,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: TEXT,
    lineHeight: 1.3,
  },
  sideBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: GREEN_DARK,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcon: {
    width: 22,
    height: 22,
    marginRight: 7,
  },
  headerWordmark: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
  },
  headerTagline: {
    fontSize: 6,
    letterSpacing: 2,
    color: GREY,
    marginTop: 3,
  },
  block: {
    marginBottom: 4,
  },
  gap: {
    marginBottom: 12,
  },
  smallGap: {
    marginBottom: 7,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletMark: {
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 34,
    left: 60,
    right: 56,
    paddingTop: 10,
    borderTopWidth: 0.75,
    borderTopColor: "#DDDDDD",
    flexDirection: "row",
  },
  footerCol: {
    flex: 1,
  },
  footerHeading: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.6,
    color: GREEN_DARK,
    marginBottom: 3,
  },
  footerLine: {
    fontSize: 8,
    color: GREY,
    lineHeight: 1.35,
  },
  footerIcon: {
    width: 20,
    height: 20,
    opacity: 0.3,
    marginBottom: 3,
  },
})

export function AnschreibenDocument({
  data,
  logoIcon,
}: {
  data: AnschreibenData
  logoIcon: Buffer
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sideBar} fixed />

        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img */}
          <Image src={logoIcon} style={styles.headerIcon} />
          <View>
            <Text style={styles.headerWordmark}>
              <Text style={{ color: GREEN_DARK }}>Pera</Text>
              <Text style={{ color: GREEN_LIGHT }}>ways</Text>
            </Text>
            <Text style={styles.headerTagline}>BEYOND BORDERS</Text>
          </View>
        </View>

        <View style={styles.gap}>
          <Text style={styles.block}>PeraWays UG (haftungsbeschränkt) i.Gr.</Text>
          <Text style={styles.block}>Bödikersteig 1</Text>
          <Text style={styles.block}>13629 Berlin</Text>
        </View>

        <View style={styles.gap}>
          <Text style={styles.block}>Landesamt für Einwanderung Berlin</Text>
          <Text style={styles.block}>Referat Fachkräfteeinwanderung / §81a-Verfahren</Text>
          <Text style={styles.block}>Friedrich-Krause-Ufer 24</Text>
          <Text style={styles.block}>13353 Berlin</Text>
        </View>

        <Text style={styles.gap}>Berlin, {data.datum}</Text>

        <View style={styles.gap}>
          <Text style={[styles.bold, styles.block]}>
            Antrag auf Durchführung des beschleunigten Fachkräfteverfahrens gemäß § 81a AufenthG
          </Text>
          <Text style={[styles.bold, styles.smallGap]}>
            (Aufenthaltszweck gemäß § 16a AufenthG, Berufsausbildung)
          </Text>
          <Text>
            Talent: {data.name}, geb. {data.geburtsdatum}, Reisepass-Nr. {data.passnummer} ({data.herkunftsland})
          </Text>
        </View>

        <Text style={styles.paragraph}>Sehr geehrte Damen und Herren,</Text>

        <Text style={styles.paragraph}>
          hiermit beantragen wir als bevollmächtigter Vertreter des Ausbildungsbetriebs die Durchführung des
          beschleunigten Fachkräfteverfahrens nach § 81a AufenthG für die oben genannte Person.
        </Text>

        <Text style={styles.paragraph}>
          {data.name} hat mit {data.traegerName}, {data.traegerAdresse}, einen Ausbildungsvertrag zur
          Pflegefachassistenz gemäß Pflegefachassistenzgesetz Berlin (PflFAG) abgeschlossen. Vorgesehener
          Ausbildungsbeginn ist der {data.ausbildungsbeginn}.
        </Text>

        <Text style={styles.smallGap}>Die vollständige Antragsakte ist diesem Schreiben beigefügt und umfasst:</Text>

        <View style={styles.smallGap}>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>Ausbildungsvertrag sowie Zusatzvereinbarung zum §81a-Verfahren</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>Vollmacht zur behördlichen Vertretung</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>
              Reisepass, Schulabschlusszeugnis (mit beeidigter Übersetzung), Geburtsurkunde, Sprachnachweis Deutsch
              B1 (ÖSD-Zertifikat), Lebenslauf, NITA-Praxisnachweis
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>Nachweise zu Wohnraum und Wirtschaftlichkeitsberechnung</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Die staatliche Verfahrensgebühr in Höhe von 411,00 € wird durch den Arbeitgeber übernommen.
        </Text>

        <Text style={styles.paragraph}>
          Für Rückfragen stehe ich als bevollmächtigter Vertreter jederzeit zur Verfügung.
        </Text>

        <Text style={{ marginTop: 4, marginBottom: 20 }}>Mit freundlichen Grüßen</Text>

        <View>
          <Text style={styles.block}>Mario Narciso Pereira</Text>
          <Text style={styles.block}>PeraWays UG (haftungsbeschränkt) i.Gr. – Bevollmächtigter Vertreter</Text>
          <Text style={styles.block}>team@peraways.de</Text>
        </View>

        <View style={styles.footer} fixed>
          <View style={styles.footerCol}>
            <Text style={styles.footerHeading}>FIRMENSITZ</Text>
            <Text style={styles.footerLine}>Peraways UG haftungsbeschränkt</Text>
            <Text style={styles.footerLine}>Bödikersteig 1</Text>
            <Text style={styles.footerLine}>13629 Berlin</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerHeading}>KONTAKT</Text>
            <Text style={styles.footerLine}>Mobil: 0155 633 622 32</Text>
            <Text style={styles.footerLine}>E-Mail: kontakt@peraways.de</Text>
            <Text style={styles.footerLine}>Web: www.peraways.de</Text>
          </View>
          <View style={styles.footerCol}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img */}
            <Image src={logoIcon} style={styles.footerIcon} />
            <Text style={styles.footerHeading}>REGISTERDATEN</Text>
            <Text style={styles.footerLine}>Sitz der Gesellschaft: Berlin</Text>
            <Text style={styles.footerLine}>Amtsgericht Charlottenburg</Text>
            <Text style={styles.footerLine}>GF: Mario Pereira</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
