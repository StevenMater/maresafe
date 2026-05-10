import {
  parsePhoneNumber,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js"
import type { Language } from "../types"

export type SignalBeat = "L" | "S" | "XS"

export const SIGNAL_PATTERNS: SignalBeat[][] = [
  ["L"],
  ["L", "L", "L", "L", "L", "L"],
  ["XS", "XS", "XS", "XS", "XS", "XS"],
  ["S", "L"],
  ["S"],
  ["S", "S"],
  ["S", "S", "S"],
  ["L", "L", "L"],
  ["L", "S"],
  ["L", "S", "S"],
  ["L", "L", "S"],
  ["L", "L", "S", "S"],
  ["L", "L", "L", "S"],
  ["L", "L", "L", "S", "S"],
]

const NATO: Record<string, string> = {
  A: "Alfa",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliett",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
  0: "Zero",
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Niner",
}

export function toPhonetic(s: string): string {
  return s
    .toUpperCase()
    .split("")
    .map((c) => NATO[c] ?? c)
    .join(" ")
}

export function formatMMSI(v: string): string {
  const d = (v || "").replace(/\D/g, "")
  if (d.length !== 9) return v || "—"
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
}

export function formatENI(v: string): string {
  const d = (v || "").replace(/\D/g, "")
  if (d.length !== 8) return v || "—"
  return `${d.slice(0, 4)} ${d.slice(4)}`
}

export function formatATIS(v: string): string {
  const d = (v || "").replace(/\D/g, "")
  if (d.length === 9) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
  if (d.length === 10) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
  return v || "—"
}

export function countryFlag(country: CountryCode): string {
  return [...country.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join("")
}

export function countryDialCode(country: CountryCode): string {
  return `+${getCountryCallingCode(country)}`
}

export function formatPhone(country: CountryCode, number: string): string {
  const n = number.trim()
  if (!n) return "—"
  try {
    const parsed = parsePhoneNumber(n, country)
    if (parsed?.isValid()) return parsed.formatInternational()
  } catch {
    // unparseable — fall through to raw fallback
  }
  return `+${getCountryCallingCode(country)} ${n.replace(/^0+/, "")}`.trim()
}

export function fmtMeasurement(v: string): string {
  const n = parseFloat(String(v).replace(",", "."))
  return isNaN(n) ? "0,00" : n.toFixed(2).replace(".", ",")
}

export function fmtOptional(v: string): string | null {
  const n = parseFloat(String(v).replace(",", "."))
  return v && v.trim() && !isNaN(n) && n > 0
    ? n.toFixed(2).replace(".", ",")
    : null
}

export function formatCardDate(lang: Language): string {
  return new Date().toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
