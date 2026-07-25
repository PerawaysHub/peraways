"use client"

import { Clock } from "lucide-react"

export default function PendingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="flex size-12 items-center justify-center bg-amber-50 mb-4">
        <Clock className="size-6 text-amber-600" />
      </span>
      <p className="font-heading text-base font-bold text-gray-900">Zugang wartet auf Freischaltung</p>
      <p className="text-sm text-gray-500 mt-1 max-w-md">
        Dein Konto wurde erstellt. Ein Admin muss dich noch freischalten — sobald das erledigt ist,
        hast du automatisch Zugriff auf das Dashboard.
      </p>
    </div>
  )
}
