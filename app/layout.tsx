import type { Metadata } from "next";
import { Sulphur_Point, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";

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
  title: "PeraWays | Ethical Nursing Recruitment from Kenya",
  description:
    "PeraWays builds the golden bridge between Nairobi and Berlin — for care facilities that need ready-to-work nurses from day 1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${sulphurPoint.variable} ${outfit.variable} min-h-full antialiased font-sans`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}