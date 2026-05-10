import { X } from "lucide-react"
import { Modal } from "../ui/Modal"
import { Select } from "../ui/Select"
import { BrandTitle } from "../layout/BrandTitle"
import { useTranslation } from "../../i18n/useTranslation"
import type { Language } from "../../types"

const LANG_OPTIONS = [
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
]

interface InfoModalProps {
  open: boolean
  onClose: () => void
}

export function InfoModal({ open, onClose }: InfoModalProps) {
  const { lang, setLang } = useTranslation()

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

      <p className="text-sm text-mid leading-relaxed">
        {/* TODO: replace text */}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </Modal>
  )
}
