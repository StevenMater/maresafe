import { useState, useRef } from "react"
import { Upload, Lightbulb } from "lucide-react"
import { Modal } from "../ui/Modal"
import { useTranslation } from "../../i18n/useTranslation"
import type { Language } from "../../types"

interface LoadDataModalProps {
  open: boolean
  onClose: () => void
  importJSON: (
    file: File,
  ) => Promise<{ success: boolean; lang: Language | null }>
}

export function LoadDataModal({
  open,
  onClose,
  importJSON,
}: LoadDataModalProps) {
  const { t, setLang } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(false)
    const result = await importJSON(file)
    if (result.success) {
      if (result.lang) setLang(result.lang)
      onClose()
    } else {
      setError(true)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  return (
    <Modal open={open} onClose={onClose} title={t("modal_load_title")}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-mid">{t("modal_load_body")}</p>
        <p className="flex items-start gap-1.5 text-xs text-lgray">
          <Lightbulb size={14} strokeWidth={1.5} className="shrink-0 mt-px" />
          {t("modal_load_tip")}
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full flex flex-col items-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isDragging
              ? "border-navy2 bg-navy2/5"
              : "border-[#a8c4e0] bg-[#f0f6ff] hover:border-navy2 hover:bg-navy2/5"
          }`}>
          <Upload size={24} strokeWidth={1.5} className="text-navy2" />
          <span className="text-sm text-mid text-center">
            {t("modal_load_drop")}
          </span>
        </button>

        {error && <p className="text-xs text-red">{t("modal_load_error")}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </Modal>
  )
}
