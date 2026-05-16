import type { CardData } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import { Input } from "../ui/Input"

interface VesselSectionProps {
  data: CardData
  setField: (key: keyof Omit<CardData, "contacts">, value: string) => void
}

export function VesselSection({ data, setField }: VesselSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="pt-3 pb-3.5 px-6 border-b border-[#d0dbe8]">
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-navy mb-2.5 pb-1.25 border-b border-[#eef3f8]">
        {t("sec_ship")}
      </h2>

      {/* Vessel identity — 5 inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
        <Input
          label={t("f_name")}
          tooltip={t("tip_f_name")}
          value={data.vesselName}
          onChange={(e) => setField("vesselName", e.target.value)}
          maxLength={30}
        />
        <Input
          label={t("f_type")}
          tooltip={t("tip_f_type")}
          value={data.type}
          onChange={(e) => setField("type", e.target.value)}
          maxLength={30}
        />
        <Input
          label={t("f_homeport")}
          tooltip={t("tip_f_homeport")}
          value={data.homePort}
          onChange={(e) => setField("homePort", e.target.value)}
          maxLength={30}
        />
        <Input
          label={t("f_eni")}
          tooltip={t("tip_f_eni")}
          value={data.eni}
          onChange={(e) => setField("eni", e.target.value)}
          numeric
          maxLength={8}
        />
        <Input
          label={t("f_callsign")}
          tooltip={t("tip_f_callsign")}
          value={data.callSign}
          onChange={(e) => setField("callSign", e.target.value.toUpperCase())}
          maxLength={6}
        />
      </div>

      <hr className="my-3 border-0 border-t border-[#d0dbe8]" />

      {/* Registration numbers — 2–4 inputs (country profile, see TODO in ShipSection) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
        <Input
          label="ATIS"
          tooltip={t("tip_atis")}
          value={data.atis}
          onChange={(e) => setField("atis", e.target.value)}
          numeric
          maxLength={10}
        />
        <Input
          label="MMSI"
          tooltip={t("tip_mmsi")}
          value={data.mmsi}
          onChange={(e) => setField("mmsi", e.target.value)}
          numeric
          maxLength={9}
        />
      </div>

      <hr className="my-3 border-0 border-t border-[#d0dbe8]" />

      {/* Dimensions — 8 inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
        <Input
          label={t("f_length")}
          tooltip={t("tip_f_length")}
          value={data.length}
          onChange={(e) => setField("length", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_alt_length")}
          tooltip={t("tip_f_alt_length")}
          value={data.altLength}
          onChange={(e) => setField("altLength", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_width")}
          tooltip={t("tip_f_width")}
          value={data.width}
          onChange={(e) => setField("width", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_alt_width")}
          tooltip={t("tip_f_alt_width")}
          value={data.altWidth}
          onChange={(e) => setField("altWidth", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_draft")}
          tooltip={t("tip_f_draft")}
          value={data.draft}
          onChange={(e) => setField("draft", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_alt_draft")}
          tooltip={t("tip_f_alt_draft")}
          value={data.altDraft}
          onChange={(e) => setField("altDraft", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_headway")}
          tooltip={t("tip_f_headway")}
          value={data.headway}
          onChange={(e) => setField("headway", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
        <Input
          label={t("f_alt_headway")}
          tooltip={t("tip_f_alt_headway")}
          value={data.altHeadway}
          onChange={(e) => setField("altHeadway", e.target.value)}
          decimal
          suffix="m"
          maxLength={6}
        />
      </div>
    </section>
  )
}
