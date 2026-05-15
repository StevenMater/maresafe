import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { Select } from "../ui/Select"
import { cn } from "../../lib/cn"
import { generatePdf } from "../../lib/worker"
import type { CardData, Language } from "../../types"

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
]

interface DownloadSectionProps {
  code: string
  tokensRemaining: number | "unlimited"
  formData: CardData
  lang: Language
  onTokensConsumed: (remaining: number) => void
}

interface Feedback {
  text: string
  className: string
}

export function DownloadSection({
  code,
  tokensRemaining,
  formData,
  lang,
  onTokensConsumed,
}: DownloadSectionProps) {
  const { t, tPlural } = useTranslation()
  const [remainingDownloads, setRemainingDownloads] = useState<
    number | "unlimited"
  >(tokensRemaining)
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([lang])
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadFeedback, setDownloadFeedback] = useState<Feedback | null>(
    null,
  )

  useEffect(() => {
    setSelectedLanguages([lang])
  }, [lang])

  useEffect(() => {
    setRemainingDownloads(tokensRemaining)
  }, [tokensRemaining])

  const maxLanguages =
    remainingDownloads === "unlimited" ? undefined : (remainingDownloads as number)

  async function handleDownload() {
    if (selectedLanguages.length === 0 || isDownloading) return
    setIsDownloading(true)
    setDownloadFeedback({ text: t("pdf_loading"), className: "text-mid" })
    try {
      const blob = await generatePdf({
        code,
        formData,
        languages: selectedLanguages,
        lang,
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      const vesselPart = formData.vesselName ? ` - ${formData.vesselName}` : ""
      anchor.download = `MareSafe${vesselPart} - Netherlands.zip`
      anchor.click()
      URL.revokeObjectURL(url)
      setDownloadFeedback({ text: t("pdf_success"), className: "text-green" })
      if (typeof remainingDownloads === "number") {
        const next = Math.max(0, remainingDownloads - selectedLanguages.length)
        setRemainingDownloads(next)
        onTokensConsumed(next)
      }
    } catch (err) {
      const status = (err as { status?: number }).status
      const errorText =
        status === 403
          ? t("pdf_error_403")
          : status === 503
            ? t("pdf_error_503")
            : t("pdf_error")
      setDownloadFeedback({ text: errorText, className: "text-red" })
    } finally {
      setIsDownloading(false)
    }
  }

  const tokensEmpty = remainingDownloads === 0
  const downloadDisabled = !code || tokensEmpty || selectedLanguages.length === 0 || isDownloading

  const remainingText =
    remainingDownloads === "unlimited"
      ? t("code_uses_unlimited")
      : tPlural("code_uses_remaining", remainingDownloads)
  const costText = tPlural("download_will_use", selectedLanguages.length)

  return (
    <div className="pt-3 pb-3.5 px-6 border-t border-[#d0dbe8]">
      <div className="flex flex-col sm:flex-row w-full gap-5 items-start sm:items-center sm:justify-around">
        {/* ④ Languages */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-mid flex items-center gap-1 whitespace-nowrap">
            <span className="text-base font-bold text-navy2">④ </span>
            {t("step_languages")}
          </span>
          <Select
            multiple
            max={maxLanguages}
            value={selectedLanguages}
            options={LANGUAGE_OPTIONS}
            onChange={(values) => {
              const next = values as Language[]
              if (next.length > 0) setSelectedLanguages(next)
            }}
            placeholder="—"
            className="w-full sm:w-35"
            disabled={tokensEmpty}
          />
        </div>

        {/* Info */}
        {code && (
          <div className="flex flex-col items-center gap-0.5 text-xs text-center">
            <span className={remainingDownloads === 0 ? "text-red font-medium" : "text-green font-medium"}>
              {remainingDownloads === 0 ? "✗" : "✓"} {remainingText}
            </span>
            {selectedLanguages.length > 0 && remainingDownloads !== "unlimited" && remainingDownloads > 0 && (
              <span className="text-mid">{costText}</span>
            )}
          </div>
        )}

        {/* ⑤ Download */}
        <div
          className={cn(
            "flex flex-col gap-1.5 w-full sm:w-auto",
            downloadDisabled && "opacity-40",
          )}
        >
          <span className="text-xs text-mid flex items-center gap-1 whitespace-nowrap">
            <span className="text-base font-bold text-navy2">⑤ </span>
            {t("step_download")}
          </span>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadDisabled}
            className="inline-flex items-center justify-center gap-1.75 w-full bg-[#2a9d5c] hover:bg-[#228a4f] text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            {isDownloading ? "…" : t("btn_download")}
          </button>
          {downloadFeedback && (
            <span className={cn("text-xs", downloadFeedback.className)}>
              {downloadFeedback.text}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
