import { FolderOpen, Trash2 } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"

export function SaveLoadBar() {
  const { t } = useTranslation()

  return (
    <div className="w-full flex justify-end gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.75 bg-navy2 hover:bg-navy text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors">
        <FolderOpen size={14} />
        {t("btn_load")}
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.75 bg-red hover:bg-red/80 text-white text-xs font-bold rounded py-2 px-4 border-none cursor-pointer transition-colors">
        <Trash2 size={14} />
        {t("btn_clear")}
      </button>
    </div>
  )
}
