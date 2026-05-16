import type { CardData, Contact, CountryCode } from "../../types"
import { MAX_CONTACTS } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import { Input } from "../ui/Input"
import { PhoneInput } from "../ui/PhoneInput"

interface ContactsSectionProps {
  data: CardData
  addContact: () => void
  removeContact: (index: number) => void
  updateContact: (index: number, patch: Partial<Contact>) => void
  setNotes: (value: string) => void
}

export function ContactsSection({
  data,
  addContact,
  removeContact,
  updateContact,
  setNotes,
}: ContactsSectionProps) {
  const { t } = useTranslation()

  const contacts = data.contacts
  const hasEmpty = contacts.some((c) => !c.label && !c.number)
  const canAdd = contacts.length < MAX_CONTACTS && !hasEmpty
  const isSingleEmpty =
    contacts.length === 1 && !contacts[0].label && !contacts[0].number

  return (
    <section className="pt-3 pb-3.5 px-6 border-b border-[#d0dbe8]">
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-navy mb-2.5 pb-1.25 border-b border-[#eef3f8]">
        {t("sec_contacts")}
      </h2>

      <div className="flex flex-col gap-3 mb-2">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <div className="flex-1 min-w-0">
              <Input
                placeholder={t("contact_label_placeholder")}
                value={contact.label}
                onChange={(e) =>
                  updateContact(index, { label: e.target.value })
                }
                maxLength={35}
              />
            </div>
            <div className="flex-1 min-w-0">
              <PhoneInput
                value={{
                  country: contact.country as CountryCode,
                  number: contact.number,
                }}
                onChange={({ country, number }) =>
                  updateContact(index, { country, number })
                }
              />
            </div>
            {!isSingleEmpty && (
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-lgray hover:text-red border-none bg-transparent cursor-pointer px-1 text-sm leading-none self-end pb-2.25"
                aria-label={t("btn_remove_contact")}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addContact}
        disabled={!canAdd}
        className="bg-[#eef3f8] border border-[#a8c4e0] rounded text-xs font-semibold text-navy2 px-3 py-1.25 cursor-pointer hover:bg-[#d6e4f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t("btn_add_contact")}
      </button>

      <hr className="my-3 border-0 border-t border-[#d0dbe8]" />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="notes-textarea"
          className="text-xs font-semibold tracking-wider uppercase text-navy2 leading-none"
        >
          {t("sec_notes")}
        </label>
        <textarea
          id="notes-textarea"
          className="w-full resize-none rounded border border-[#a8c4e0] bg-[#f0f6ff] px-3 py-2 font-mono text-sm text-dark placeholder:text-lgray focus:outline-none focus:border-navy2 focus:shadow-[0_0_0_3px_rgba(44,82,130,0.15)] transition-[border-color]"
          rows={4}
          maxLength={300}
          placeholder={t("notes_placeholder")}
          value={data.notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </section>
  )
}
