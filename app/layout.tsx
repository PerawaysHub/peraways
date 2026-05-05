import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Script from "next/script";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://peraways.com";
const siteUrlDe = "https://peraways.de";
const siteUrlEn = "https://peraways.com";
const title = "PeraWays | PFA-Azubis aus Kenia vermitteln – Ethisch & Schnell";
const description =
  "Vermittlung von Pflegefachassistenz-Auszubildenden (PFA) aus Kenia nach §16a AufenthG. Schuldenfreie Einreise, B1-Deutsch vor Anreise, 20h/Woche ab Ankunft. ROI in 90 Tagen.";
const keywords =
  "Pflegekräfte aus Kenia, PFA Azubi Vermittlung, Pflegepersonal rekrutieren, §16a AufenthG, Pflegefachassistenz, LEA Berlin, Pflegekräfte finden, nursing recruitment Kenya, nursing staff Germany, PFA trainee placement, healthcare staffing, debt-free relocation, §16a visa";
const twitterHandle = "@peraways";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | PeraWays",
  },
  description,
  keywords,
  authors: [{ name: "PeraWays" }],
  creator: "PeraWays",
  publisher: "PeraWays",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "PeraWays",
    title,
    description,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PeraWays – PFA-Azubis aus Kenia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/opengraph-image`],
    creator: twitterHandle,
    site: twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "de-DE": siteUrlDe,
      "en-US": siteUrlEn,
    },
  },
  category: "healthcare recruitment",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#19463C",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrlDe}/#organization`,
      name: "PeraWays",
      url: siteUrlDe,
      sameAs: [siteUrlEn],
      logo: `${siteUrlDe}/logo.svg`,
      description: "Ethical nursing recruitment from Kenya — PFA trainees under §16a AufenthG.",
      foundingDate: "2024",
      areaServed: ["DE", "AT", "CH"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          availableLanguage: ["German", "English"],
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${siteUrlDe}/#service`,
      name: "PFA-Azubi-Vermittlung",
      provider: { "@id": `${siteUrlDe}/#organization` },
      serviceType: "Pflegekräfte-Rekrutierung",
      category: "Healthcare Staffing",
      description: "Vermittlung von Pflegefachassistenz-Auszubildenden (PFA) aus Kenia nach §16a AufenthG.",
      areaServed: "Germany",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "PeraWays Leistungen",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "PFA-Azubi-Vermittlung",
              description: "Vermittlung von PFA-Auszubildenden aus Kenia mit LEA Fast-Lane Verfahren.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "B1 Sprachtraining",
              description: "10-monatiges Intensivprogramm in Kenia mit Goethe-Zertifikat.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Visa & LEA Beratung",
              description: "Entscheidungsreife Akten gemäß §81a AufenthG.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrlDe}/#website`,
      name: "PeraWays",
      url: siteUrlDe,
      publisher: { "@id": `${siteUrlDe}/#organization` },
      inLanguage: ["de-DE", "en-US"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} min-h-full antialiased font-sans`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
