import { useEffect, useRef, useState } from "react"
import { TranslationProvider, useTranslation } from "./i18n/useTranslation"
import { useFormData } from "./hooks/useFormData"
import { useCardScale } from "./hooks/useCardScale"
import { DEMO_DATA } from "./lib/demoData"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { NotificationBanner } from "./components/layout/NotificationBanner"
import { CardPreview } from "./components/card/CardPreview"
import { CheckoutWidget } from "./components/download/CheckoutWidget"
import { EditorPanel } from "./components/editor/EditorPanel"

function AppContent() {
  const { t, lang, setLang } = useTranslation()
  const {
    data,
    outdated,
    savedLanguage,
    save,
    setField,
    addContact,
    removeContact,
    updateContact,
    importJSON,
    clearAll,
    dismissOutdated,
    formCollapsed,
    setFormCollapsed,
    seenInfo,
    markSeen,
  } = useFormData()
  const cardRowRef = useRef<HTMLDivElement>(null)
  const cardScale = useCardScale(cardRowRef)
  const [hasValidCode, setHasValidCode] = useState(false)
  const [notification, setNotification] = useState<
    "payment_success" | "outdated" | null
  >(null)

  useEffect(() => {
    if (savedLanguage && savedLanguage !== lang) setLang(savedLanguage)
    if (
      new URLSearchParams(window.location.search).get("payment") === "success"
    ) {
      setNotification("payment_success")
      window.history.replaceState({}, "", window.location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (outdated) setNotification("outdated")
  }, [outdated])

  useEffect(() => {
    save(lang)
  }, [data, lang, formCollapsed, seenInfo, save])

  const cardData = hasValidCode ? data : DEMO_DATA

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fa]">
      <div className="sticky top-0 z-40">
        <Header seenInfo={seenInfo} markSeen={markSeen} />
        {notification === "payment_success" && (
          <NotificationBanner
            variant="success"
            message={t("payment_success_body")}
            onDismiss={() => setNotification(null)}
          />
        )}
        {notification === "outdated" && (
          <NotificationBanner
            variant="warning"
            title={t("vw_title")}
            message={t("vw_body")}
            onDismiss={() => {
              dismissOutdated()
              setNotification(null)
            }}
          />
        )}
      </div>

      <div className="flex-1">
        <div
          ref={cardRowRef}
          className="flex flex-wrap justify-center items-center gap-6 px-4 pt-5"
        >
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
