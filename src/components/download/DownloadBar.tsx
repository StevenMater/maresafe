import { useState, useId } from "react"
import { X, Check, Download } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { Select } from "../ui/Select"
import { cn } from "../../lib/cn"
import type { Language } from "../../types"

const LANGUAGE_OPTIONS = [
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
]

export function DownloadBar() {
  const { t } = useTranslation()
  const codeInputId = useId()
  const [codeValue, setCodeValue] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([])

  function clearCode() {
    setCodeValue("")
    setIsVerified(false)
    setSelectedLanguages([])
  }

  function verifyCode() {
    // stub — real verification via useCodeVerification hook in future step
  }

  return (
    <div className="px-6 py-3 border-b border-[#d0dbe8]">
      <p className="text-base text-center font-extrabold text-mid mb-3">
        {t("download_tagline")}
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
              onChange={(e) => setCodeValue(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") verifyCode()
              }}
              className="h-full min-w-36 pr-13 rounded-sm border-[1.5px] border-[#a8c4e0] bg-[#f0f6ff] px-2.5 font-mono text-sm uppercase text-dark placeholder:text-lgray focus:outline-none focus:border-navy2 focus:shadow-[0_0_0_3px_rgba(44,82,130,0.15)] transition-[border-color]"
            />
            <div className="absolute right-1.5 flex items-center gap-0.5">
              <button
                type="button"
                onClick={clearCode}
                tabIndex={-1}
                aria-label="Clear code"
                className="flex items-center justify-center w-5 h-5 rounded border-none bg-transparent text-mid cursor-pointer p-0 hover:bg-[#d0dbe8] hover:text-dark transition-colors">
                <X size={12} />
              </button>
              <button
                type="button"
                onClick={verifyCode}
                tabIndex={-1}
                aria-label="Verify code"
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded border-none bg-transparent cursor-pointer p-0 transition-colors",
                  isVerified
                    ? "text-green"
                    : "text-mid hover:bg-green/15 hover:text-green",
                )}>
                <Check size={12} />
              </button>
            </div>
          </div>
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
            value={selectedLanguages}
            options={LANGUAGE_OPTIONS}
            onChange={(values) => setSelectedLanguages(values as Language[])}
            placeholder="—"
            className="w-35"
          />
        </div>

        {/* ③ Download */}
        <div
          className={cn(
            "flex flex-col gap-1.5",
            (!isVerified || selectedLanguages.length === 0) && "opacity-40",
          )}>
          <span className="text-xs text-mid flex items-center gap-1 whitespace-nowrap">
            <span className="text-base font-bold text-navy2">③ </span>
            {t("step_download")}
          </span>
          <button
            type="button"
            disabled={!isVerified || selectedLanguages.length === 0}
            className="inline-flex items-center justify-center gap-1.75 w-full bg-[#2a9d5c] hover:bg-[#228a4f] text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Download size={14} />
            {t("btn_download")}
          </button>
        </div>
      </div>
    </div>
  )
}
