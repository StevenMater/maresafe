import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useFormData } from "../../hooks/useFormData"
import { useTranslation } from "../../i18n/useTranslation"
import { cn } from "../../lib/cn"
import { DownloadBar } from "../download/DownloadBar"
import { SaveLoadBar } from "../download/SaveLoadBar"
import { VesselSection } from "./VesselSection"
import { ContactsSection } from "./ContactsSection"
import { InsurerSection } from "./InsurerSection"

const MAX_FORM_WIDTH = "calc(794px * 1.5)"

export function EditorPanel() {
  const { data, setField, addContact, removeContact, updateContact } =
    useFormData()
  const { t } = useTranslation()
  const [isFormCollapsed, setIsFormCollapsed] = useState(false)

  return (
    <div
      className="w-full flex flex-col items-center gap-2 pb-2"
      style={{ maxWidth: MAX_FORM_WIDTH }}>
      {/* Download action bar */}
      <div className="w-full bg-white border border-[#d0dbe8] rounded-lg overflow-hidden">
        <DownloadBar />
      </div>

      {/* Form toggle — centered pill button */}
      <button
        type="button"
        onClick={() => setIsFormCollapsed(!isFormCollapsed)}
        aria-expanded={!isFormCollapsed}
        className="flex items-center gap-2 bg-navy2 hover:bg-navy text-white text-xs font-semibold rounded-md px-4 py-1.75 border-none cursor-pointer transition-colors">
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isFormCollapsed && "rotate-180",
          )}
        />
        {t("form_toggle_label")}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isFormCollapsed && "rotate-180",
          )}
        />
      </button>

      {/* Collapsible form sections */}
      <div
        className={cn(
          "w-full overflow-hidden transition-[max-height] ease-in-out duration-400",
          isFormCollapsed ? "max-h-0" : "max-h-1250",
        )}>
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
          <SaveLoadBar />
        </div>
      </div>
    </div>
  )
}
