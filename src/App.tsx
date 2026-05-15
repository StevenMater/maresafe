import { useEffect, useRef, useState } from "react"
import { TranslationProvider, useTranslation } from "./i18n/useTranslation"
import { useFormData } from "./hooks/useFormData"
import { useCardScale } from "./hooks/useCardScale"
import { getDemoData } from "./lib/demoData"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { NotificationBanner } from "./components/layout/NotificationBanner"
import { CardPreview } from "./components/card/CardPreview"
import { CheckoutWidget } from "./components/download/CheckoutWidget"
import { CodeCheckWidget } from "./components/download/CodeCheckWidget"
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
    seenInfo,
    markSeen,
  } = useFormData()
  const previewColRef = useRef<HTMLDivElement>(null)
  const cardScale = useCardScale(previewColRef)

  const [verifiedCode, setVerifiedCode] = useState<string | null>(null)
  const [tokensRemaining, setTokensRemaining] = useState<
    number | "unlimited" | null
  >(null)
  const hasValidCode = verifiedCode !== null

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
  }, [data, lang, seenInfo, save])

  function handleCodeVerified(code: string, tokens: number | "unlimited") {
    setVerifiedCode(code)
    setTokensRemaining(tokens)
  }

  function handleCodeCleared() {
    setVerifiedCode(null)
    setTokensRemaining(null)
  }

  function handleTokensConsumed(remaining: number) {
    setTokensRemaining(remaining)
  }

  const cardData = hasValidCode ? data : getDemoData(lang)

  return (
    <div className='flex flex-col min-h-screen bg-[#f4f7fa]'>
      <div className='sticky top-0 z-40'>
        <Header seenInfo={seenInfo} markSeen={markSeen} />
        {notification === "payment_success" && (
          <NotificationBanner
            variant='success'
            message={t("payment_success_body")}
            onDismiss={() => setNotification(null)}
          />
        )}
        {notification === "outdated" && (
          <NotificationBanner
            variant='warning'
            title={t("vw_title")}
            message={t("vw_body")}
            onDismiss={() => {
              dismissOutdated()
              setNotification(null)
            }}
          />
        )}
      </div>

      <div className='flex-1 px-4 pt-5 pb-2 flex flex-col gap-4'>
        {/* Hero */}
        <div className='text-center py-2'>
          <h1 className='text-2xl font-bold text-navy'>{t("info_title")}</h1>
          <p className='text-sm text-mid italic mt-1'>{t("info_slogan")}</p>
        </div>

        {/* Row 1: [① Buy] [② Activate] */}
        <div className='flex flex-col sm:flex-row gap-4 items-stretch justify-center'>
          <CheckoutWidget />

          <CodeCheckWidget
            onCodeVerified={handleCodeVerified}
            onCodeCleared={handleCodeCleared}
            tokensRemaining={tokensRemaining}
          />
        </div>

        {/* Row 2: [Preview] [③④⑤ Form + Download] */}
        <div className='flex flex-wrap gap-4 items-start justify-center mt-4'>
          <div
            ref={previewColRef}
            className='flex justify-center w-full xl:w-auto'
          >
            <div style={cardScale < 1 ? { zoom: cardScale } : undefined}>
              <CardPreview data={cardData} showWatermark={true} />
            </div>
          </div>
          <div className='flex-1 min-w-0 max-w-216'>
            <EditorPanel
              data={data}
              lang={lang}
              setField={setField}
              addContact={addContact}
              removeContact={removeContact}
              updateContact={updateContact}
              importJSON={importJSON}
              clearAll={clearAll}
              verifiedCode={verifiedCode}
              tokensRemaining={tokensRemaining}
              onTokensConsumed={handleTokensConsumed}
            />
          </div>
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
