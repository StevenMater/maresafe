import { useId, useState } from "react"
import { X, Check } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { cn } from "../../lib/cn"
import { verifyCode as checkCode } from "../../lib/worker"

interface CodeCheckWidgetProps {
  onCodeVerified: (code: string, tokens: number | "unlimited") => void
  onCodeCleared: () => void
  tokensRemaining?: number | "unlimited" | null
}

type VerifyState = "idle" | "checking" | "valid" | "invalid" | "error"

interface Feedback {
  text: string
  className: string
}

export function CodeCheckWidget({
  onCodeVerified,
  onCodeCleared,
  tokensRemaining: externalTokensRemaining,
}: CodeCheckWidgetProps) {
  const { t, tPlural } = useTranslation()
  const codeInputId = useId()

  const [codeValue, setCodeValue] = useState("")
  const [validCode, setValidCode] = useState<string | null>(null)
  const [verifyState, setVerifyState] = useState<VerifyState>("idle")
  const [tokensRemaining, setTokensRemaining] = useState<
    number | "unlimited" | null
  >(null)

  const isVerified = verifyState === "valid" && validCode !== null

  function clearCode() {
    setCodeValue("")
    setValidCode(null)
    setVerifyState("idle")
    setTokensRemaining(null)
    onCodeCleared()
  }

  async function handleVerify() {
    const code = codeValue.trim()
    if (!code || verifyState === "checking") return
    setVerifyState("checking")
    setValidCode(null)
    try {
      const status = await checkCode(code)
      if (status.valid) {
        setValidCode(code)
        setTokensRemaining(status.tokens)
        setVerifyState("valid")
        onCodeVerified(code, status.tokens)
      } else {
        setVerifyState("invalid")
      }
    } catch {
      setVerifyState("error")
    }
  }

  function getCodeFeedback(): Feedback | null {
    switch (verifyState) {
      case "checking":
        return { text: "…", className: "text-mid" }
      case "valid": {
        const count = externalTokensRemaining ?? tokensRemaining
        const text =
          count === "unlimited"
            ? t("code_uses_unlimited")
            : tPlural("code_uses_remaining", count ?? 0)
        const depleted = count === 0
        return {
          text: (depleted ? "✗ " : "✓ ") + text,
          className: depleted ? "text-red" : "text-green",
        }
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

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 w-full sm:flex-1 sm:max-w-108 bg-white border border-[#d0dbe8] rounded-lg">
      <span className="text-xs text-mid flex items-center gap-1">
        <span className="text-base font-bold text-navy2">② </span>
        {t("download_tagline")}
      </span>
      <div className="flex flex-col items-center gap-0">
        <span className="text-base font-bold text-dark text-center">
          {t("activate_title")}
        </span>
        <span className="text-xs text-mid text-center">
          {t("activate_subtitle")}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative flex items-center h-8">
          <input
            id={codeInputId}
            type="text"
            maxLength={32}
            value={codeValue}
            placeholder={t("placeholder_code")}
            onChange={(e) => {
              const next = e.target.value.toUpperCase()
              setCodeValue(next)
              if (validCode !== null) {
                setValidCode(null)
                setTokensRemaining(null)
                setVerifyState("idle")
                onCodeCleared()
              } else if (verifyState !== "idle") {
                setVerifyState("idle")
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleVerify()
            }}
            className="h-full w-full pr-13 rounded-sm border border-[#a8c4e0] bg-[#f0f6ff] px-2.5 font-mono text-sm uppercase text-dark placeholder:text-lgray focus:outline-none focus:border-navy2 focus:shadow-[0_0_0_3px_rgba(44,82,130,0.15)] transition-[border-color]"
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
              )}
            >
              <Check size={12} />
            </button>
            <button
              type="button"
              onClick={clearCode}
              tabIndex={-1}
              aria-label="Clear code"
              className="flex items-center justify-center w-5 h-5 rounded border-none bg-transparent text-mid cursor-pointer p-0 hover:bg-[#d0dbe8] hover:text-dark transition-colors"
            >
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
    </div>
  )
}
