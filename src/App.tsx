import { useEffect, useRef, useState } from "react"
import { TranslationProvider, useTranslation } from "./i18n/useTranslation"
import { useFormData } from "./hooks/useFormData"
import { useCardScale } from "./hooks/useCardScale"
import { DEMO_DATA } from "./lib/demoData"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { CardPreview } from "./components/card/CardPreview"
import { CheckoutWidget } from "./components/download/CheckoutWidget"
import { EditorPanel } from "./components/editor/EditorPanel"

function AppContent() {
  const { lang, setLang } = useTranslation()
  const {
    data,
    savedLanguage,
    save,
    setField,
    addContact,
    removeContact,
    updateContact,
    importJSON,
    clearAll,
    formCollapsed,
    setFormCollapsed,
    seenInfo,
    markSeen,
  } = useFormData()
  const cardRowRef = useRef<HTMLDivElement>(null)
  const cardScale = useCardScale(cardRowRef)
  const [hasValidCode, setHasValidCode] = useState(false)

  useEffect(() => {
    if (savedLanguage && savedLanguage !== lang) setLang(savedLanguage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    save(lang)
  }, [data, lang, formCollapsed, seenInfo, save])

  const cardData = hasValidCode ? data : DEMO_DATA

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header seenInfo={seenInfo} markSeen={markSeen} />
      <div className="flex-1 overflow-y-auto bg-[#f4f7fa]">
        <div
          ref={cardRowRef}
          className="flex flex-wrap justify-center items-center gap-6 px-4 pt-5">
          <div style={cardScale < 1 ? { zoom: cardScale } : undefined}>
            <CardPreview data={cardData} showWatermark={true} />
          </div>
          <CheckoutWidget />
        </div>
        <div className="flex justify-center px-4 pt-4 pb-2">
          <EditorPanel
            data={data}
            lang={lang}
            setField={setField}
            addContact={addContact}
            removeContact={removeContact}
            updateContact={updateContact}
            importJSON={importJSON}
            clearAll={clearAll}
            formCollapsed={formCollapsed}
            setFormCollapsed={setFormCollapsed}
            onValidCodeChange={setHasValidCode}
          />
        </div>
      </div>
      <Footer />
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
