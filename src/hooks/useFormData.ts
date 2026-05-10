import { useState, useCallback } from "react"
import type { CardData, Contact, CountryCode, Language } from "../types"
import {
  DEFAULT_COUNTRY,
  LANGUAGES,
  MAX_CONTACTS,
  STORAGE_KEY,
  SUPPORTED_COUNTRIES,
  CURRENT_VERSION,
} from "../types"

export const EMPTY_FORM: CardData = {
  vesselName: "",
  type: "",
  eni: "",
  length: "",
  width: "",
  draft: "",
  airDraft: "",
  altLength: "",
  altAirDraft: "",
  callSign: "",
  atis: "",
  mmsi: "",
  insurerName: "",
  policyNumber: "",
  insurerEmergencyCountry: DEFAULT_COUNTRY,
  insurerEmergencyNumber: "",
  insurerOfficeCountry: DEFAULT_COUNTRY,
  insurerOfficeNumber: "",
  contacts: [{ label: "", country: DEFAULT_COUNTRY, number: "" }],
}

interface FormState {
  data: CardData
  outdated: boolean
  savedLanguage: Language | null
  formCollapsed: boolean
  seenInfo: boolean
}

type RawData = Record<string, unknown>

function isValidCountry(c: unknown): c is CountryCode {
  return typeof c === "string" && (SUPPORTED_COUNTRIES as string[]).includes(c)
}

function toContact(c: RawData): Contact {
  return {
    label: typeof c.label === "string" ? c.label : "",
    country: isValidCountry(c.country) ? c.country : DEFAULT_COUNTRY,
    number: typeof c.number === "string" ? c.number : "",
  }
}

function parseStoredData(raw: RawData): {
  data: CardData
  lang: Language | null
} {
  if (raw._maresafe !== true) throw new Error("invalid")

  const str = (v: unknown): string => (typeof v === "string" ? v : "")
  const rawLang = raw.lang
  const lang: Language | null =
    typeof rawLang === "string" &&
    (LANGUAGES as readonly string[]).includes(rawLang)
      ? (rawLang as Language)
      : null

  return {
    lang,
    data: {
      vesselName: str(raw.vesselName),
      type: str(raw.type),
      eni: str(raw.eni),
      length: str(raw.length),
      width: str(raw.width),
      draft: str(raw.draft),
      airDraft: str(raw.airDraft),
      altLength: str(raw.altLength),
      altAirDraft: str(raw.altAirDraft),
      callSign: str(raw.callSign),
      atis: str(raw.atis),
      mmsi: str(raw.mmsi),
      insurerName: str(raw.insurerName),
      policyNumber: str(raw.policyNumber),
      insurerEmergencyCountry: isValidCountry(raw.insurerEmergencyCountry)
        ? raw.insurerEmergencyCountry
        : DEFAULT_COUNTRY,
      insurerEmergencyNumber: str(raw.insurerEmergencyNumber),
      insurerOfficeCountry: isValidCountry(raw.insurerOfficeCountry)
        ? raw.insurerOfficeCountry
        : DEFAULT_COUNTRY,
      insurerOfficeNumber: str(raw.insurerOfficeNumber),
      contacts: (() => {
        const parsed = Array.isArray(raw.contacts)
          ? (raw.contacts as RawData[])
              .filter((c) => c.label || c.number)
              .map(toContact)
          : []
        return parsed.length > 0 ? parsed : EMPTY_FORM.contacts
      })(),
    },
  }
}

function loadFromStorage(): FormState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as RawData
      const { data, lang } = parseStoredData(parsed.formData as RawData)
      return {
        data,
        outdated: false,
        savedLanguage: lang,
        formCollapsed: parsed.formCollapsed !== false,
        seenInfo: parsed.seenInfo === true,
      }
    }
  } catch {
    // corrupted / foreign data — start fresh
  }
  return {
    data: EMPTY_FORM,
    outdated: false,
    savedLanguage: null,
    formCollapsed: true,
    seenInfo: false,
  }
}

function saveToStorage(state: FormState, lang: Language): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        seenInfo: state.seenInfo,
        formCollapsed: state.formCollapsed,
        formData: {
          _maresafe: true,
          version: CURRENT_VERSION,
          lang,
          ...state.data,
        },
      }),
    )
  } catch {
    // ignore
  }
}

export interface UseFormDataReturn {
  data: CardData
  savedLanguage: Language | null
  setField: (key: keyof Omit<CardData, "contacts">, value: string) => void
  addContact: () => void
  removeContact: (index: number) => void
  updateContact: (index: number, patch: Partial<Contact>) => void
  clearAll: () => void
  exportJSON: (lang: Language) => void
  importJSON: (
    file: File,
  ) => Promise<{ success: boolean; lang: Language | null }>
  outdated: boolean
  dismissOutdated: () => void
  save: (lang: Language) => void
  formCollapsed: boolean
  setFormCollapsed: (collapsed: boolean) => void
  seenInfo: boolean
  markSeen: () => void
}

export function useFormData(): UseFormDataReturn {
  const [state, setState] = useState<FormState>(loadFromStorage)

  function setField(key: keyof Omit<CardData, "contacts">, value: string) {
    setState((s) => ({ ...s, data: { ...s.data, [key]: value } }))
  }

  function addContact() {
    setState((s) => {
      const { contacts } = s.data
      const hasEmpty = contacts.some((c) => !c.label && !c.number)

      if (contacts.length >= MAX_CONTACTS || hasEmpty) return s

      return {
        ...s,
        data: {
          ...s.data,
          contacts: [
            ...contacts,
            { label: "", country: DEFAULT_COUNTRY, number: "" },
          ],
        },
      }
    })
  }

  function removeContact(index: number) {
    setState((s) => {
      const contacts = [...s.data.contacts]

      if (contacts.length <= 1) {
        contacts[0] = { label: "", country: DEFAULT_COUNTRY, number: "" }
      } else {
        contacts.splice(index, 1)
      }

      return { ...s, data: { ...s.data, contacts } }
    })
  }

  function updateContact(index: number, patch: Partial<Contact>) {
    setState((s) => {
      const contacts = s.data.contacts.map((c, i) =>
        i === index ? { ...c, ...patch } : c,
      )

      return { ...s, data: { ...s.data, contacts } }
    })
  }

  function clearAll() {
    setState((s) => ({ ...s, data: EMPTY_FORM }))
  }

  function exportJSON(lang: Language) {
    const blob = new Blob(
      [
        JSON.stringify(
          { _maresafe: true, version: CURRENT_VERSION, lang, ...state.data },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    )
    const a = document.createElement("a")

    a.href = URL.createObjectURL(blob)
    a.download = `MareSafe - ${state.data.vesselName || "emergency-card"} - ${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function importJSON(
    file: File,
  ): Promise<{ success: boolean; lang: Language | null }> {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (ev) => {
        try {
          const raw = JSON.parse(ev.target!.result as string) as RawData
          const { data, lang } = parseStoredData(raw)

          setState((s) => ({
            ...s,
            data,
            outdated: false,
            savedLanguage: null,
          }))
          resolve({ success: true, lang })
        } catch {
          resolve({ success: false, lang: null })
        }
      }
      reader.onerror = () => resolve({ success: false, lang: null })
      reader.readAsText(file)
    })
  }

  function dismissOutdated() {
    setState((s) => ({ ...s, outdated: false }))
  }

  const save = useCallback(
    (lang: Language) => {
      saveToStorage(state, lang)
    },
    [state],
  )

  function setFormCollapsed(collapsed: boolean) {
    setState((s) => ({ ...s, formCollapsed: collapsed }))
  }

  function markSeen() {
    setState((s) => ({ ...s, seenInfo: true }))
  }

  const safeData = {
    ...state.data,
    contacts:
      state.data.contacts.length > 0
        ? state.data.contacts
        : [{ label: "", country: DEFAULT_COUNTRY, number: "" }],
  }

  return {
    data: safeData,
    savedLanguage: state.savedLanguage,
    setField,
    addContact,
    removeContact,
    updateContact,
    clearAll,
    exportJSON,
    importJSON,
    outdated: state.outdated,
    dismissOutdated,
    save,
    formCollapsed: state.formCollapsed,
    setFormCollapsed,
    seenInfo: state.seenInfo,
    markSeen,
  }
}
