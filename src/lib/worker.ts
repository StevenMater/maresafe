import type { CardData, CodeStatus, Language } from "../types"

const WORKER_BASE = "https://maresafe-worker.maresafe.workers.dev"

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
    body: JSON.stringify({ ...params, area: "netherlands" }), // TODO: change hardcoded country to sailing area select
  })
  if (!res.ok) {
    const err = new Error(`PDF generation failed: ${res.status}`)
    ;(err as Error & { status: number }).status = res.status
    throw err
  }
  return res.blob()
}
