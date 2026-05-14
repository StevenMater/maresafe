import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { TranslationProvider } from "./i18n/useTranslation.ts"
import { CardPreview } from "./components/card/CardPreview.tsx"
import { fromWorkerFormData, parseRenderLang } from "./lib/renderMode.ts"
import type { CardData, Language } from "./types/index.ts"

function CardRenderView({ data, lang }: { data: CardData; lang: Language }) {
  useEffect(() => {
    document.body.style.cssText = "margin:0;padding:0;background:white;"
  }, [])

  return (
    <TranslationProvider initialLang={lang}>
      <CardPreview data={data} showWatermark={false} />
      <div id="render-ready" style={{ display: "none" }} />
    </TranslationProvider>
  )
}

function getRenderData(): { data: CardData; lang: Language } | null {
  const hash = window.location.hash
  if (!hash.startsWith("#__render__=")) return null
  try {
    const raw = JSON.parse(
      decodeURIComponent(hash.slice("#__render__=".length)),
    ) as Record<string, unknown>
    return { data: fromWorkerFormData(raw), lang: parseRenderLang(raw) }
  } catch {
    return null
  }
}

const renderData = getRenderData()

if (renderData) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <CardRenderView data={renderData.data} lang={renderData.lang} />
    </StrictMode>,
  )
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
