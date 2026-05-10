import { ChevronDown } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { cn } from "../../lib/cn"
import { DownloadBar } from "../download/DownloadBar"
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
  formCollapsed: boolean
  setFormCollapsed: (collapsed: boolean) => void
  onValidCodeChange: (valid: boolean) => void
}

const MAX_FORM_WIDTH = "calc(794px * 1.5)"

export function EditorPanel({
  data,
  lang,
  setField,
  addContact,
  removeContact,
  updateContact,
  importJSON,
  clearAll,
  formCollapsed,
  setFormCollapsed,
  onValidCodeChange,
}: EditorPanelProps) {
  const { t } = useTranslation()

  return (
    <div
      className="w-full flex flex-col items-center gap-2 pb-2"
      style={{ maxWidth: MAX_FORM_WIDTH }}
    >
      {/* Download action bar */}
      <div className="w-full bg-white border border-[#d0dbe8] rounded-lg">
        <DownloadBar
          formData={data}
          lang={lang}
          onValidCodeChange={onValidCodeChange}
        />
      </div>

      {/* Form toggle — centered pill button */}
      <button
        type="button"
        onClick={() => setFormCollapsed(!formCollapsed)}
        aria-expanded={!formCollapsed}
        className="flex items-center gap-2 bg-navy2 hover:bg-navy text-white text-xs font-semibold rounded-md px-4 py-1.75 border-none cursor-pointer transition-colors"
      >
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            formCollapsed && "rotate-180",
          )}
        />
        {t("form_toggle_label")}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            formCollapsed && "rotate-180",
          )}
        />
      </button>

      {/* Collapsible form sections */}
      <div
        className={cn(
          "w-full overflow-hidden transition-[max-height] ease-in-out duration-400",
          formCollapsed ? "max-h-0" : "max-h-1250",
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="bg-white border border-[#d0dbe8] rounded-lg overflow-hidden">
            <VesselSection data={data} setField={setField} />
            <ContactsSection
              data={data}
              addContact={addContact}
              removeContact={removeContact}
              updateContact={updateContact}
            />
            <InsurerSection data={data} setField={setField} />
          </div>
          <SaveLoadBar importJSON={importJSON} clearAll={clearAll} />
        </div>
      </div>
    </div>
  )
}
