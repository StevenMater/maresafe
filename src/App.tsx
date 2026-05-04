import { useEffect } from "react"
import { TranslationProvider, useTranslation } from "./i18n/useTranslation"
import { useFormData } from "./hooks/useFormData"
import { CardPreview } from "./components/card/CardPreview"

function AppContent() {
  const { lang, setLang } = useTranslation()
  const { data, savedLanguage, save } = useFormData()

  useEffect(() => {
    if (savedLanguage && savedLanguage !== lang) setLang(savedLanguage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    save(lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, lang])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <CardPreview data={data} showWatermark={true} />
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
