import type { CardData, CodeStatus, CountryCode, Language } from "../types"

const WORKER_BASE = "https://maresafe-worker.maresafe.workers.dev"

const COUNTRY_TO_DIAL: Partial<Record<CountryCode, string>> = {
  NL: "+31",
  BE: "+32",
  DE: "+49",
  FR: "+33",
  GB: "+44",
  US: "+1",
  DK: "+45",
  NO: "+47",
  SE: "+46",
}
const DEFAULT_DIAL = "+31"

function dial(country: CountryCode): string {
  return COUNTRY_TO_DIAL[country] ?? DEFAULT_DIAL
}

function toWorkerFormData(data: CardData, lang: Language) {
  return {
    _maresafe: true,
    version: "1.0",
    lang,
    name: data.vesselName,
    type: data.type,
    eni: data.eni,
    length: data.length,
    width: data.width,
    draft: data.draft,
    headway: data.headway,
    altLength: data.altLength,
    altHeadway: data.altHeadway,
    callSign: data.callSign,
    atis: data.atis,
    mmsi: data.mmsi,
    insurerName: data.insurerName,
    policyNumber: data.policyNumber,
    insurerEmergencyDialCode: dial(data.insurerEmergencyCountry),
    insurerEmergencyNumber: data.insurerEmergencyNumber,
    insurerOfficeDialCode: dial(data.insurerOfficeCountry),
    insurerOfficeNumber: data.insurerOfficeNumber,
    contacts: data.contacts
      .filter((c) => c.label || c.number)
      .map((c) => ({
        label: c.label,
        dialCode: dial(c.country),
        number: c.number,
      })),
  }
}

export async function createCheckoutSession(origin: string): Promise<string> {
  const res = await fetch(`${WORKER_BASE}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin }),
  })
  const { url, error } = (await res.json()) as { url?: string; error?: string }
  if (!url) throw new Error(error ?? "No checkout URL")
  return url
}

export async function verifyCode(code: string): Promise<CodeStatus> {
  const res = await fetch(`${WORKER_BASE}/check-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })
  return res.json() as Promise<CodeStatus>
}

export interface GeneratePdfParams {
  code: string
  formData: CardData
  languages: Language[]
  lang: Language
}

export async function generatePdf(params: GeneratePdfParams): Promise<Blob> {
  const res = await fetch(`${WORKER_BASE}/generate-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: params.code,
      languages: params.languages,
      area: "netherlands",
      lang: params.lang,
      formData: toWorkerFormData(params.formData, params.lang),
    }),
  })
  if (!res.ok) {
    const err = new Error(`PDF generation failed: ${res.status}`)
    ;(err as Error & { status: number }).status = res.status
    throw err
  }
  return res.blob()
}
