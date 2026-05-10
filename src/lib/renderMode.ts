import type { CardData, CountryCode, Language } from "../types"
import { DEFAULT_COUNTRY, LANGUAGES, SUPPORTED_COUNTRIES } from "../types"
import { EMPTY_FORM } from "../hooks/useFormData"

const DIAL_TO_COUNTRY: Record<string, CountryCode> = {
  "+31": "NL",
  "+32": "BE",
  "+49": "DE",
  "+33": "FR",
  "+44": "GB",
  "+1": "US",
  "+45": "DK",
  "+47": "NO",
  "+46": "SE",
}

function toCountry(dial: unknown): CountryCode {
  const country = typeof dial === "string" ? DIAL_TO_COUNTRY[dial] : undefined
  return country ?? DEFAULT_COUNTRY
}

function isValidCountry(c: unknown): c is CountryCode {
  return typeof c === "string" && (SUPPORTED_COUNTRIES as string[]).includes(c)
}

type RawData = Record<string, unknown>

export function fromWorkerFormData(raw: RawData): CardData {
  const str = (v: unknown): string => (typeof v === "string" ? v : "")

  return {
    vesselName: str(raw.name),
    type: str(raw.type),
    eni: str(raw.eni),
    length: str(raw.length),
    width: str(raw.width),
    draft: str(raw.draft),
    headway: str(raw.headway),
    altLength: str(raw.altLength),
    altWidth: str(raw.altWidth),
    altDraft: str(raw.altDraft),
    altHeadway: str(raw.altHeadway),
    callSign: str(raw.callSign),
    homePort: str(raw.homePort),
    atis: str(raw.atis),
    mmsi: str(raw.mmsi),
    insurerName: str(raw.insurerName),
    policyNumber: str(raw.policyNumber),
    insurerEmergencyCountry: isValidCountry(raw.insurerEmergencyCountry)
      ? raw.insurerEmergencyCountry
      : toCountry(raw.insurerEmergencyDialCode),
    insurerEmergencyNumber: str(raw.insurerEmergencyNumber),
    insurerOfficeCountry: isValidCountry(raw.insurerOfficeCountry)
      ? raw.insurerOfficeCountry
      : toCountry(raw.insurerOfficeDialCode),
    insurerOfficeNumber: str(raw.insurerOfficeNumber),
    contacts: (() => {
      const parsed = Array.isArray(raw.contacts)
        ? (raw.contacts as RawData[])
            .filter((c) => c.label || c.number)
            .map((c) => ({
              label: str(c.label),
              country: isValidCountry(c.country)
                ? c.country
                : toCountry(c.dialCode),
              number: str(c.number),
            }))
        : []
      return parsed.length > 0 ? parsed : EMPTY_FORM.contacts
    })(),
  }
}

export function parseRenderLang(raw: RawData): Language {
  const lang = raw.lang
  return typeof lang === "string" &&
    (LANGUAGES as readonly string[]).includes(lang)
    ? (lang as Language)
    : "nl"
}
