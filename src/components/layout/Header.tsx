import { useState } from "react"
import { useTranslation } from "../../i18n/useTranslation"
import { Select } from "../ui/Select"
import { BrandTitle } from "./BrandTitle"
import { InfoModal } from "../modals/InfoModal"
import type { Language } from "../../types"

const LANG_OPTIONS = [
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
]

interface HeaderProps {
  seenInfo: boolean
  markSeen: () => void
}

export function Header({ seenInfo, markSeen }: HeaderProps) {
  const { lang, setLang, t } = useTranslation()
  const [showInfo, setShowInfo] = useState(!seenInfo)

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-4 py-2.5 px-6 bg-navy shrink-0">
        <BrandTitle />
        <div className="flex items-center gap-2 ml-auto">
          <Select
            variant="ghost"
            value={lang}
            onChange={(value) => setLang(value as Language)}
            options={LANG_OPTIONS}
          />
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label={t("tip_info_btn")}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white/12 border border-white/20 text-white text-sm font-bold leading-none p-0 cursor-pointer hover:bg-white/24 transition-colors shrink-0">
            ?
          </button>
        </div>
      </header>

      <InfoModal
        open={showInfo}
        onClose={() => {
          setShowInfo(false)
          markSeen()
        }}
      />
    </>
  )
}
