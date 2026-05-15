import { useState } from "react"
import { FolderOpen, Trash2 } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { Modal } from "../ui/Modal"
import { LoadDataModal } from "../modals/LoadDataModal"
import type { Language } from "../../types"

interface SaveLoadBarProps {
  importJSON: (
    file: File,
  ) => Promise<{ success: boolean; lang: Language | null }>
  clearAll: () => void
}

export function SaveLoadBar({ importJSON, clearAll }: SaveLoadBarProps) {
  const { t } = useTranslation()
  const [showLoad, setShowLoad] = useState(false)
  const [showClear, setShowClear] = useState(false)

  return (
    <>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setShowLoad(true)}
          className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.75 bg-navy2 hover:bg-navy text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors"
        >
          <FolderOpen size={14} />
          {t("btn_load")}
        </button>
        <button
          type="button"
          onClick={() => setShowClear(true)}
          className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.75 bg-red hover:bg-red/80 text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors"
        >
          <Trash2 size={14} />
          {t("btn_clear")}
        </button>
      </div>

      <LoadDataModal
        open={showLoad}
        onClose={() => setShowLoad(false)}
        importJSON={importJSON}
      />

      <Modal
        open={showClear}
        onClose={() => setShowClear(false)}
        title={t("modal_clear_title")}
      >
        <p className="text-sm text-mid mb-4">{t("modal_clear_body")}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowClear(false)}
            className="px-4 py-1.75 text-sm text-mid bg-transparent border border-[#a8c4e0] rounded cursor-pointer hover:bg-lgray/10 transition-colors"
          >
            {t("modal_clear_cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              clearAll()
              setShowClear(false)
            }}
            className="px-4 py-1.75 text-sm font-semibold text-white bg-red hover:bg-red/80 border-none rounded cursor-pointer transition-colors"
          >
            {t("modal_clear_confirm")}
          </button>
        </div>
      </Modal>
    </>
  )
}
