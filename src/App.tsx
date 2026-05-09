import { useEffect, useRef } from "react"
import { TranslationProvider, useTranslation } from "./i18n/useTranslation"
import { useFormData } from "./hooks/useFormData"
import { useCardScale } from "./hooks/useCardScale"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { CardPreview } from "./components/card/CardPreview"
import { CheckoutWidget } from "./components/download/CheckoutWidget"
import { EditorPanel } from "./components/editor/EditorPanel"

function AppContent() {
  const { lang, setLang } = useTranslation()
  const { data, savedLanguage, save } = useFormData()
  const cardRowRef = useRef<HTMLDivElement>(null)
  const cardScale = useCardScale(cardRowRef)

  useEffect(() => {
    if (savedLanguage && savedLanguage !== lang) setLang(savedLanguage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    save(lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, lang])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto bg-[#f4f7fa]">
        <div
          ref={cardRowRef}
          className="flex flex-wrap justify-center items-start gap-6 px-4 pt-5"
        >
          <div style={cardScale < 1 ? { zoom: cardScale } : undefined}>
            <CardPreview data={data} showWatermark={true} />
          </div>
          <CheckoutWidget />
        </div>
        <div className="flex justify-center px-4 pt-4 pb-2">
          <EditorPanel />
        </div>
        <Footer />
      </div>
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
