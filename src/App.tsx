import { useEffect } from "react"
import { TranslationProvider, useTranslation } from "./i18n/useTranslation"
import { useFormData } from "./hooks/useFormData"

function AppContent() {
  const { lang, setLang } = useTranslation()
  const { data, storedLang, saveNow } = useFormData()

  useEffect(() => {
    if (storedLang && storedLang !== lang) setLang(storedLang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveNow(lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, lang])

  return (
    <div className="min-h-screen bg-white text-mid font-sans">
      {/* MareSafe layout — vessel: {data.vesselName} */}
    </div>
  )
}

export default function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  )
}
