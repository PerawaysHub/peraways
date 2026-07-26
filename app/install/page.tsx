"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { SignInButton } from "@clerk/nextjs"
import { Share, MoreVertical, PlusSquare, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/LanguageContext"

type Platform = "ios" | "android" | "other"

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other"
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return "ios"
  if (/Android/.test(ua)) return "android"
  return "other"
}

export default function InstallPage() {
  const { t } = useLanguage()
  const [platform, setPlatform] = useState<Platform | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client UA sniff, no external system to subscribe to
    setPlatform(detectPlatform())
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#F7EDE9] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image src="/logo-full.png" alt="PeraWays" width={180} height={48} priority />
        </div>

        <div className="rounded-3xl border border-white/85 bg-white/80 p-8 shadow-[0_16px_48px_rgba(25,70,60,0.10)] backdrop-blur-xl">
          <h1 className="mb-2 font-heading text-2xl font-semibold text-primary">
            {t("PeraWays People als App installieren", "Install PeraWays People as an app")}
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-[#3A4A42]">
            {t(
              "So legst du das Dashboard als Icon auf deinem Homescreen ab – öffnet sich dann wie eine echte App, ganz ohne App Store.",
              "This adds the dashboard as an icon on your home screen — it then opens like a real app, no app store needed."
            )}
          </p>

          {platform !== "android" && (
            <div className={platform !== "ios" ? "mb-6" : ""}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
                {t("iPhone / iPad (Safari)", "iPhone / iPad (Safari)")}
              </h2>
              <ol className="space-y-3 text-sm text-[#3A4A42]">
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                  <span>{t("Melde dich unten an und öffne das Dashboard.", "Sign in below and open the dashboard.")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {t("Tippe unten in Safari auf", "Tap the")} <Share className="inline size-4 text-primary" /> {t("(Teilen).", "(Share) icon in Safari.")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                  <span>{t('Wähle „Zum Home-Bildschirm" und bestätige.', 'Choose "Add to Home Screen" and confirm.')}</span>
                </li>
              </ol>
            </div>
          )}

          {platform !== "ios" && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-secondary">
                {t("Android (Chrome)", "Android (Chrome)")}
              </h2>
              <ol className="space-y-3 text-sm text-[#3A4A42]">
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                  <span>{t("Melde dich unten an und öffne das Dashboard.", "Sign in below and open the dashboard.")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {t("Tippe oben rechts auf", "Tap the")} <MoreVertical className="inline size-4 text-primary" /> {t("(Menü).", "(menu) icon top-right.")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {t('Wähle „App installieren" bzw.', 'Choose "Install app" or')} <PlusSquare className="inline size-4 text-primary" /> {t('„Zum Startbildschirm hinzufügen".', '"Add to Home screen".')}
                  </span>
                </li>
              </ol>
            </div>
          )}

          <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-[#2A6B5E] px-6 py-3 text-sm font-semibold text-white shadow-sm">
              {t("Jetzt anmelden & Dashboard öffnen", "Sign in & open dashboard")}
              <ArrowRight className="size-4" />
            </button>
          </SignInButton>
        </div>
      </div>
    </main>
  )
}
