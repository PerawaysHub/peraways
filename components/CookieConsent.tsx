"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "./LanguageContext"

const STORAGE_KEY = "peraways-cookie-consent"

type Consent = "accepted" | "declined" | null

export function CookieConsent() {
  const { t } = useLanguage()
  const [consent, setConsent] = useState<Consent>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Consent | null
    setConsent(stored)
    if (!stored) {
      setTimeout(() => setVisible(true), 400)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setConsent("accepted")
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined")
    setConsent("declined")
    setVisible(false)
  }

  if (consent !== null || !visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1200px] border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {t("Cookie-Hinweis", "Cookie Notice")}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t(
                "Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. Mit Klick auf „Akzeptieren“ stimmst du der Verwendung zu.",
                "This website uses cookies to improve your experience. By clicking “Accept”, you consent to their use."
              )}{' '}
              <Link href="/datenschutz" className="underline hover:text-primary transition-colors">
                {t("Mehr erfahren", "Learn more")}
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 transition-all"
            >
              {t("Ablehnen", "Decline")}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-all"
            >
              {t("Akzeptieren", "Accept")}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="flex items-center justify-center size-8 text-gray-400 hover:text-gray-600 transition-colors -mr-1"
              aria-label={t("Schließen", "Close")}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
