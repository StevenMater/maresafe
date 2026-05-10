import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { TranslationProvider } from "./i18n/useTranslation.ts"
import { CardPreview } from "./components/card/CardPreview.tsx"
import { fromWorkerFormData, parseRenderLang } from "./lib/renderMode.ts"
import type { CardData, Language } from "./types/index.ts"

declare global {
  interface Window {
    __RENDER_MODE__?: boolean
    __CARD_DATA__?: Record<string, unknown>
  }
}

function CardRenderView({ data, lang }: { data: CardData; lang: Language }) {
  useEffect(() => {
    document.body.style.cssText = "margin:0;padding:0;background:white;"
    const ready = document.createElement("div")
    ready.id = "render-ready"
    ready.style.display = "none"
    document.body.appendChild(ready)
  }, [])

  return (
    <TranslationProvider initialLang={lang}>
      <CardPreview data={data} showWatermark={false} />
    </TranslationProvider>
  )
}

if (window.__RENDER_MODE__ && window.__CARD_DATA__) {
  const raw = window.__CARD_DATA__
  const cardData = fromWorkerFormData(raw)
  const lang = parseRenderLang(raw)

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <CardRenderView data={cardData} lang={lang} />
    </StrictMode>,
  )
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
