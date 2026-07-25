import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysUntil(ts?: number): number | null {
  if (!ts) return null
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.ceil((ts - Date.now()) / msPerDay)
}

export function probezeitEnde(ersterArbeitstag?: number): number | undefined {
  if (!ersterArbeitstag) return undefined
  const d = new Date(ersterArbeitstag)
  d.setMonth(d.getMonth() + 4)
  return d.getTime()
}

export function terminUrgency(
  datum: number,
  status: "Offen" | "Erledigt"
): "ueberfaellig" | "bald" | "neutral" {
  if (status !== "Offen") return "neutral"
  const days = daysUntil(datum)
  if (days === null) return "neutral"
  if (days < 0) return "ueberfaellig"
  if (days <= 3) return "bald"
  return "neutral"
}
