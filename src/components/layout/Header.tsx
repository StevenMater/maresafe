import { useTranslation } from "../../i18n/useTranslation"
import { Select } from "../ui/Select"
import type { Language } from "../../types"
import logo from "../../assets/logo.svg"

const LANG_OPTIONS = [
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
]

export function Header() {
  const { lang, setLang, t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 flex-wrap py-2.5 px-6 bg-navy shrink-0">
      <div className="flex items-center gap-3">
        <img src={logo} alt="MareSafe" className="h-8 w-8 shrink-0" />
        <div className="flex flex-col gap-px">
          <h1 className="font-mono text-2xl font-semibold tracking-wider uppercase text-[#a8c4e0] leading-none m-0 flex items-center">
            Mare<span className="text-white">Safe</span>
          </h1>
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#a8c4e0]/60 leading-tight">
            {t("product_name")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Select
          variant="ghost"
          value={lang}
          onChange={(value) => setLang(value as Language)}
          options={LANG_OPTIONS}
        />
        <button
          type="button"
          aria-label="Info"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/12 border border-white/20 text-white text-sm font-bold leading-none p-0 cursor-pointer hover:bg-white/24 transition-colors shrink-0"
        >
          i
        </button>
      </div>
    </header>
  )
}
