import type { CountryCode } from "libphonenumber-js"
export type { CountryCode }

export const LANGUAGES = ["nl", "en", "fr", "de"] as const
export type Language = (typeof LANGUAGES)[number]

export interface Contact {
  label: string
  country: CountryCode
  number: string
}

export interface CardData {
  vesselName: string
  type: string
  eni: string
  length: string
  width: string
  draft: string
  airDraft: string
  altLength: string
  altAirDraft: string
  callSign: string
  atis: string
  mmsi: string
  insurerName: string
  policyNumber: string
  insurerEmergencyCountry: CountryCode
  insurerEmergencyNumber: string
  insurerOfficeCountry: CountryCode
  insurerOfficeNumber: string
  contacts: Contact[]
}

export interface CodeStatus {
  valid: boolean
  tokens: number | "unlimited"
}

export const SUPPORTED_COUNTRIES: CountryCode[] = [
  "NL",
  "BE",
  "DE",
  "FR",
  "GB",
  "US",
  "DK",
  "NO",
  "SE",
]

export const DEFAULT_COUNTRY: CountryCode = "NL"
export const MAX_CONTACTS = 9
export const STORAGE_KEY = "maresafe_card"
export const CURRENT_VERSION = "1.0"
