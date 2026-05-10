import { useState, useEffect, useId } from "react"
import { X, Check, Download } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { Select } from "../ui/Select"
import { cn } from "../../lib/cn"
import { verifyCode as checkCode, generatePdf } from "../../lib/worker"
import type { CardData, Language } from "../../types"

const LANGUAGE_OPTIONS = [
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
]

interface DownloadBarProps {
  formData: CardData
  lang: Language
  onValidCodeChange: (valid: boolean) => void
}

type VerifyState = "idle" | "checking" | "valid" | "invalid" | "error"

interface Feedback {
  text: string
  className: string
}

export function DownloadBar({
  formData,
  lang,
  onValidCodeChange,
}: DownloadBarProps) {
  const { t, tPlural } = useTranslation()
  const codeInputId = useId()

  const [codeValue, setCodeValue] = useState("")
  const [validCode, setValidCode] = useState<string | null>(null)
  const [verifyState, setVerifyState] = useState<VerifyState>("idle")
  const [tokensRemaining, setTokensRemaining] = useState<
    number | "unlimited" | null
  >(null)
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([lang])
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    setSelectedLanguages([lang])
  }, [lang])
  const [downloadFeedback, setDownloadFeedback] = useState<Feedback | null>(
    null,
  )

  const isVerified = verifyState === "valid" && validCode !== null
  const maxLanguages =
    tokensRemaining === "unlimited" || tokensRemaining === null
      ? undefined
      : tokensRemaining

  function clearCode() {
    setCodeValue("")
    setValidCode(null)
    setVerifyState("idle")
    setTokensRemaining(null)
    setSelectedLanguages([lang])
    setDownloadFeedback(null)
    onValidCodeChange(false)
  }

  async function handleVerify() {
    const code = codeValue.trim()
    if (!code || verifyState === "checking") return
    setVerifyState("checking")
    setValidCode(null)
    setDownloadFeedback(null)
    try {
      const status = await checkCode(code)
      if (status.valid) {
        setValidCode(code)
        setTokensRemaining(status.tokens)
        setVerifyState("valid")
        onValidCodeChange(true)
        if (typeof status.tokens === "number") {
          const cap = status.tokens as number
          setSelectedLanguages((prev) => {
            const capped = prev.slice(0, cap)
            return capped.length > 0 ? capped : [lang]
          })
        }
      } else {
        setVerifyState("invalid")
        onValidCodeChange(false)
      }
    } catch {
      setVerifyState("error")
    }
  }

  async function handleDownload() {
    if (!validCode || selectedLanguages.length === 0 || isDownloading) return
    setIsDownloading(true)
    setDownloadFeedback({ text: t("pdf_loading"), className: "text-mid" })
    try {
      const blob = await generatePdf({
        code: validCode,
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
      if (typeof tokensRemaining === "number") {
        const remaining = tokensRemaining - selectedLanguages.length
        if (remaining <= 0) {
          setTokensRemaining(0)
          setValidCode(null)
          setVerifyState("idle")
          onValidCodeChange(false)
          setDownloadFeedback({
            text: t("code_uses_depleted"),
            className: "text-mid",
          })
        } else {
          setTokensRemaining(remaining)
        }
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

  function getCodeFeedback(): Feedback | null {
    switch (verifyState) {
      case "checking":
        return { text: "…", className: "text-mid" }
      case "valid": {
        if (tokensRemaining === 0)
          return { text: t("code_uses_depleted"), className: "text-mid" }
        const text =
          tokensRemaining === "unlimited"
            ? t("code_uses_unlimited")
            : tPlural("code_uses_remaining", tokensRemaining ?? 0)
        return { text: "✓ " + text, className: "text-green" }
      }
      case "invalid":
        return { text: t("code_invalid"), className: "text-red" }
      case "error":
        return { text: t("pdf_error"), className: "text-red" }
      default:
        return null
    }
  }

  const codeFeedback = getCodeFeedback()
  const downloadDisabled =
    !isVerified || selectedLanguages.length === 0 || isDownloading

  return (
    <div className="px-6 py-3 border-b border-[#d0dbe8]">
      <p className="text-base text-center font-extrabold text-mid mb-1">
        {t("download_tagline")}
      </p>
      <p className="text-xs text-center text-lgray mb-3">
        {t("download_subtagline")}
      </p>

      <div className="flex w-full gap-5 items-start justify-around flex-wrap">
        {/* ① Code */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-mid flex items-center gap-1 whitespace-nowrap">
            <span className="text-base font-bold text-navy2">① </span>
            {t("step_code")}
          </span>
          <div className="relative flex items-center h-8">
            <input
              id={codeInputId}
              type="text"
              maxLength={32}
              value={codeValue}
              placeholder={t("placeholder_code")}
              onChange={(e) => {
                setCodeValue(e.target.value.toUpperCase())
                if (verifyState !== "idle") {
                  setVerifyState("idle")
                  setValidCode(null)
                  setTokensRemaining(null)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify()
              }}
              className="h-full min-w-80 pr-13 rounded-sm border border-[#a8c4e0] bg-[#f0f6ff] px-2.5 font-mono text-sm uppercase text-dark placeholder:text-lgray focus:outline-none focus:border-navy2 focus:shadow-[0_0_0_3px_rgba(44,82,130,0.15)] transition-[border-color]"
            />
            <div className="absolute right-1.5 flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleVerify}
                disabled={!codeValue.trim() || verifyState === "checking"}
                tabIndex={-1}
                aria-label="Verify code"
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  isVerified
                    ? "text-green"
                    : "text-mid hover:bg-green/15 hover:text-green",
                )}>
                <Check size={12} />
              </button>
              <button
                type="button"
                onClick={clearCode}
                tabIndex={-1}
                aria-label="Clear code"
                className="flex items-center justify-center w-5 h-5 rounded border-none bg-transparent text-mid cursor-pointer p-0 hover:bg-[#d0dbe8] hover:text-dark transition-colors">
                <X size={12} />
              </button>
            </div>
          </div>
          {codeFeedback && (
            <span className={cn("text-xs", codeFeedback.className)}>
              {codeFeedback.text}
            </span>
          )}
        </div>

        {/* ② Languages */}
        <div
          className={cn(
            "flex flex-col gap-1.5",
            !isVerified && "opacity-40 pointer-events-none",
          )}>
          <span className="text-xs text-mid flex items-center gap-1 whitespace-nowrap">
            <span className="text-base font-bold text-navy2">② </span>
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
            className="w-35"
          />
        </div>

        {/* ③ Download */}
        <div
          className={cn(
            "flex flex-col gap-1.5",
            downloadDisabled && "opacity-40",
          )}>
          <span className="text-xs text-mid flex items-center gap-1 whitespace-nowrap">
            <span className="text-base font-bold text-navy2">③ </span>
            {t("step_download")}
          </span>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadDisabled}
            className="inline-flex items-center justify-center gap-1.75 w-full bg-[#2a9d5c] hover:bg-[#228a4f] text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
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
