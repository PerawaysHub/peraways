import type { Metadata } from "next";
import { Fraunces, Libre_Franklin, Sulphur_Point, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import { CookieConsent } from "@/components/CookieConsent";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";

const fraunces = Fraunces({
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  subsets: ["latin"],
});

const libreFranklin = Libre_Franklin({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  subsets: ["latin"],
});

// Used only for the "PeraWays" logo lockup in the CRM sidebar — kept
// separate from --font-heading/--font-outfit above (those are the
// site-wide body/heading fonts and must not be swapped by accident).
const sulphurPoint = Sulphur_Point({
  weight: ["400", "700"],
  variable: "--font-logo-pera",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: ["400", "700", "800"],
  variable: "--font-logo-ways",
  subsets: ["latin"],
});

const siteUrl = "https://peraways.de";
const siteUrlDe = "https://peraways.de";
const title = "PeraWays | PFA-Azubis aus Kenia vermitteln – Ethisch & Schnell";
const description =
  "Vermittlung von Pflegefachassistenz-Auszubildenden (PFA) aus Kenia  nach § 16a AufenthG. Schuldenfreie Einreise, B1-Deutsch vor Anreise, 20h/Woche ab Ankunft. ROI in 90 Tagen.";
const keywords =
  "Pflegekräfte aus Kenia, PFA Azubi Vermittlung, Pflegepersonal rekrutieren, § 16a AufenthG, Pflegefachassistenz, LEA Berlin, Pflegekräfte finden, nursing recruitment Kenya, nursing staff Germany, PFA trainee placement, healthcare staffing, debt-free relocation, § 16a visa";
const twitterHandle = "@peraways";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | PeraWays",
  },
  description,
  keywords,
  authors: [{ name: "Peraways" }],
  creator: "Peraways",
  publisher: "Peraways",
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
    },
  },
  category: "healthcare recruitment",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PeraWays",
  },
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
      logo: `${siteUrlDe}/logo.svg`,
      description: "Ethical nursing recruitment from Kenya — PFA trainees under § 16a AufenthG.",
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
      description: "Vermittlung von Pflegefachassistenz-Auszubildenden (PFA) aus Kenia nach § 16a AufenthG.",
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
              description: "Entscheidungsreife Akten gemäß § 81a AufenthG.",
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
          className={`${fraunces.variable} ${libreFranklin.variable} ${sulphurPoint.variable} ${outfit.variable} min-h-full antialiased font-sans`}
          >
          <ClerkProvider>
            <ConvexClientProvider>
           <LanguageProvider>
             <TooltipProvider>
              {children}
              <Analytics />
              <CookieConsent />
             </TooltipProvider>
           </LanguageProvider>
            </ConvexClientProvider>
          </ClerkProvider>
        </body>
    </html>
  );
}
