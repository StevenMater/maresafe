import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  createElement,
} from "react"
import type { Language } from "../types"
import { LANGUAGES, STORAGE_KEY } from "../types"
import translations, {
  type StringTranslationKey,
  type ArrayTranslationKey,
  type PluralTranslationKey,
} from "./locales/index"

function getInitialLang(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Record<string, unknown>
      const lang = data.lang
      if (
        typeof lang === "string" &&
        (LANGUAGES as readonly string[]).includes(lang)
      ) {
        return lang as Language
      }
    }
  } catch {
    // ignore localStorage errors
  }
  return "en"
}

interface TranslationContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: (key: StringTranslationKey) => string
  tArr: (key: ArrayTranslationKey) => string[]
  tPlural: (key: PluralTranslationKey, count: number) => string
}

const TranslationContext = createContext<TranslationContextValue | null>(null)

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [lang, setLangState] = useState<Language>(getInitialLang)

  function setLang(l: Language) {
    setLangState(l)
    document.documentElement.lang = l
  }

  function t(key: StringTranslationKey): string {
    return translations[lang][key] as string
  }

  function tArr(key: ArrayTranslationKey): string[] {
    return translations[lang][key] as string[]
  }

  function tPlural(key: PluralTranslationKey, count: number): string {
    const forms = translations[lang][key] as { one: string; other: string }
    const rule = new Intl.PluralRules(lang).select(count)
    const template = rule === "one" ? forms.one : forms.other
    return template.replace("{n}", String(count))
  }

  return createElement(
    TranslationContext.Provider,
    { value: { lang, setLang, t, tArr, tPlural } },
    children,
  )
}

export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext)
  if (!ctx)
    throw new Error("useTranslation must be used within TranslationProvider")
  return ctx
}
