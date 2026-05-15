import type { CardData } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import { Input } from "../ui/Input"
import { PhoneInput } from "../ui/PhoneInput"
import type { CountryCode } from "../../types"

interface InsurerSectionProps {
  data: CardData
  setField: (key: keyof Omit<CardData, "contacts">, value: string) => void
}

export function InsurerSection({ data, setField }: InsurerSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="pt-3 pb-3.5 px-6 last:border-b-0">
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-navy mb-2.5 pb-1.25 border-b border-[#eef3f8]">
        {t("sec_insurer")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
        <Input
          label={t("f_insurer_name")}
          tooltip={t("tip_f_insurer_name")}
          value={data.insurerName}
          onChange={(e) => setField("insurerName", e.target.value)}
          maxLength={15}
        />
        <Input
          label={t("f_policy")}
          tooltip={t("tip_f_policy")}
          value={data.policyNumber}
          onChange={(e) => setField("policyNumber", e.target.value)}
          maxLength={25}
        />
        <PhoneInput
          label={t("f_insurer_emergency")}
          value={{
            country: data.insurerEmergencyCountry as CountryCode,
            number: data.insurerEmergencyNumber,
          }}
          onChange={({ country, number }) => {
            setField("insurerEmergencyCountry", country)
            setField("insurerEmergencyNumber", number)
          }}
        />
        <PhoneInput
          label={t("f_insurer_office")}
          value={{
            country: data.insurerOfficeCountry as CountryCode,
            number: data.insurerOfficeNumber,
          }}
          onChange={({ country, number }) => {
            setField("insurerOfficeCountry", country)
            setField("insurerOfficeNumber", number)
          }}
        />
      </div>
    </section>
  )
}
