import type { Language } from "../../types"
import en from "./en.json"
import nl from "./nl.json"
import fr from "./fr.json"
import de from "./de.json"

export type TranslationShape = typeof en

export type StringTranslationKey = {
  [K in keyof TranslationShape]: TranslationShape[K] extends string ? K : never
}[keyof TranslationShape]

export type ArrayTranslationKey = {
  [K in keyof TranslationShape]: TranslationShape[K] extends string[]
    ? K
    : never
}[keyof TranslationShape]

export type PluralTranslationKey = {
  [K in keyof TranslationShape]: TranslationShape[K] extends {
    one: string
    other: string
  }
    ? K
    : never
}[keyof TranslationShape]

// tsc error here if nl/fr/de.json is missing any key present in en.json
const translations: Record<Language, TranslationShape> = { en, nl, fr, de }
export default translations
