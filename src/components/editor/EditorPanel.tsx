import { Lock } from "lucide-react"
import { cn } from "../../lib/cn"
import { useTranslation } from "../../i18n/useTranslation"
import { DownloadSection } from "../download/DownloadSection"
import { SaveLoadBar } from "../download/SaveLoadBar"
import { VesselSection } from "./VesselSection"
import { ContactsSection } from "./ContactsSection"
import { InsurerSection } from "./InsurerSection"
import type { CardData, Contact, Language } from "../../types"

interface EditorPanelProps {
  data: CardData
  lang: Language
  setField: (key: keyof Omit<CardData, "contacts">, value: string) => void
  addContact: () => void
  removeContact: (index: number) => void
  updateContact: (index: number, patch: Partial<Contact>) => void
  importJSON: (
    file: File,
  ) => Promise<{ success: boolean; lang: Language | null }>
  clearAll: () => void
  verifiedCode: string | null
  tokensRemaining: number | "unlimited" | null
  onTokensConsumed: (remaining: number) => void
}

export function EditorPanel({
  data,
  lang,
  setField,
  addContact,
  removeContact,
  updateContact,
  importJSON,
  clearAll,
  verifiedCode,
  tokensRemaining,
  onTokensConsumed,
}: EditorPanelProps) {
  const { t } = useTranslation()
  const isLocked = !verifiedCode

  return (
    <div className="w-full pb-2">
      <div className="relative">
        <div
          className={cn(
            "bg-white border border-[#d0dbe8] rounded-lg overflow-hidden",
            isLocked && "blur-sm",
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-3 border-b border-[#eef3f8]">
            <div className="flex items-center gap-1 text-xs text-mid">
              <span className="text-base font-bold text-navy2">③ </span>
              <span>{t("step_form")}</span>
            </div>
            <SaveLoadBar importJSON={importJSON} clearAll={clearAll} />
          </div>
          <VesselSection data={data} setField={setField} />
          <ContactsSection
            data={data}
            addContact={addContact}
            removeContact={removeContact}
            updateContact={updateContact}
            setNotes={(v) => setField("notes", v)}
          />
          <InsurerSection data={data} setField={setField} />
          <DownloadSection
            code={verifiedCode ?? ""}
            tokensRemaining={tokensRemaining ?? 0}
            formData={data}
            lang={lang}
            onTokensConsumed={onTokensConsumed}
          />
        </div>
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-35 gap-2 cursor-not-allowed">
            <Lock size={24} className="text-navy2" />
            <p className="text-base font-bold text-navy2 text-center px-6">
              {t("form_locked_hint")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
