import type { Metadata } from "next";
import { Sulphur_Point, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sulphurPoint = Sulphur_Point({
  weight: ["400", "700"],
  variable: "--font-sulphur",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeraWays | Ethisches Pflegekräfte-Recruiting aus Kenia",
  description:
    "PeraWays baut die Goldene Brücke zwischen Nairobi und Berlin — für Pflegeeinrichtungen, die planbare, rechtssichere Fachkräfte ab Tag 1 brauchen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body
        className={`${sulphurPoint.variable} ${outfit.variable} min-h-full antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}