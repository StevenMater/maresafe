import { X } from "lucide-react"
import { Modal } from "../ui/Modal"
import { Select } from "../ui/Select"
import { BrandTitle } from "../layout/BrandTitle"
import { useTranslation } from "../../i18n/useTranslation"
import type { Language } from "../../types"

const STEPS = [
  "info_step_1",
  "info_step_2",
  "info_step_3",
  "info_step_4",
  "info_step_5",
] as const

const LANG_OPTIONS = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
]

interface InfoModalProps {
  open: boolean
  onClose: () => void
}

export function InfoModal({ open, onClose }: InfoModalProps) {
  const { t, lang, setLang } = useTranslation()

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl w-[90vw]">
      <div className="-mx-4 -mt-4 mb-4 bg-navy flex items-center justify-between gap-4 px-6 py-2.5 rounded-t-lg">
        <BrandTitle />
        <div className="flex items-center gap-2 shrink-0">
          <Select
            variant="ghost"
            value={lang}
            onChange={(value) => setLang(value as Language)}
            options={LANG_OPTIONS}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white/12 border border-white/20 text-white/70 p-0 cursor-pointer hover:bg-white/24 hover:text-white transition-colors shrink-0"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-navy">{t("info_title")}</h2>
          <p className="text-sm text-mid italic mt-0.5">{t("info_tagline")}</p>
        </div>
        <p className="text-sm text-mid leading-relaxed">{t("info_body")}</p>
        <div>
          <p className="text-xs font-bold text-navy2 uppercase tracking-wider mb-2">
            {t("info_how_title")}
          </p>
          <ol className="flex flex-col gap-1.5 list-none p-0 m-0">
            {STEPS.map((key, i) => (
              <li key={key} className="flex items-start gap-2 text-sm text-mid">
                <span className="text-base font-bold text-navy2 leading-tight shrink-0">
                  {"①②③④⑤"[i]}
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-xs text-mid">{t("info_ambition")}</p>
        <p className="text-sm font-bold text-navy2 italic">
          {t("info_slogan")}
        </p>
      </div>
    </Modal>
  )
}
