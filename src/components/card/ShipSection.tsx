import type { CardData } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import { formatENI, formatATIS, formatMMSI } from "../../lib/format"
import s from "./CardPreview.module.css"

function formatDimension(v: string): string {
  const n = parseFloat(v.replace(",", "."))

  return isNaN(n) ? "0,00" : n.toFixed(2).replace(".", ",")
}

function formatDimensionIfSet(v: string | undefined): string | null {
  if (!v) return null
  const n = parseFloat(v.replace(",", "."))

  return v.trim() && !isNaN(n) && n > 0
    ? n.toFixed(2).replace(".", ",")
    : null
}

interface ShipSectionProps {
  data: CardData
}

export function ShipSection({ data }: ShipSectionProps) {
  const { t } = useTranslation()

  const altLen = formatDimensionIfSet(data.altLength)
  const altWidth = formatDimensionIfSet(data.altWidth)
  const altDraft = formatDimensionIfSet(data.altDraft)
  const altAir = formatDimensionIfSet(data.altHeadway)

  return (
    <>
      {/* Vessel details */}
      <div>
        <div className={s.sectionHeader}>{t("card_ship")}</div>
        <table className={s.dataTable}>
          <tbody>
            <tr>
              <td className={s.colLabel}>{t("f_name")}</td>
              <td className={s.colValue}>{data.vesselName || "—"}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_type")}</td>
              <td className={s.colValue}>{data.type || "—"}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_homeport")}</td>
              <td className={s.colValue}>{data.homePort || "—"}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_eni")}</td>
              <td className={s.colValue}>{formatENI(data.eni)}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_callsign")}</td>
              <td className={s.colValue}>{data.callSign || "—"}</td>
            </tr>
            <tr className={s.separatorRow}>
              <td className={s.colLabel}>ATIS</td>
              <td className={s.colValue}>{formatATIS(data.atis)}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>MMSI</td>
              <td className={s.colValue}>{formatMMSI(data.mmsi)}</td>
            </tr>
            {/* TODO: Sailing area / country profile feature
                Replace hardcoded `atis` + `mmsi` with 4 generic identifier slots (id1–id4).
                A country profile defines which slots are active (2–4 max), their labels,
                input type (numeric/text), and maxLength. Card renders only active slots.
                Form shows only active inputs. Everything else on the card is unchanged.
                Example profiles:
                  NL inland:   id1=ATIS(10), id2=MMSI(9)
                  BE inland:   id1=Vlootregistratie, id2=MMSI(9)
                  FR coastal:  id1=Immatriculation, id2=MMSI(9), id3=Indicatif VHF
                If a 5th slot ever becomes needed, tackle it then. */}
            <tr className={s.separatorRow}>
              <td className={s.colLabel}>
                {t("f_length")}
                {altLen && <span className={s.altValueSeparator}> | alt.</span>}
              </td>
              <td className={s.colValue}>
                {formatDimension(data.length)} m
                {altLen && <span className={s.altValueSeparator}> | {altLen} m</span>}
              </td>
            </tr>
            <tr>
              <td className={s.colLabel}>
                {t("f_width")}
                {altWidth && <span className={s.altValueSeparator}> | alt.</span>}
              </td>
              <td className={s.colValue}>
                {formatDimension(data.width)} m
                {altWidth && <span className={s.altValueSeparator}> | {altWidth} m</span>}
              </td>
            </tr>
            <tr>
              <td className={s.colLabel}>
                {t("f_draft")}
                {altDraft && <span className={s.altValueSeparator}> | alt.</span>}
              </td>
              <td className={s.colValue}>
                {formatDimension(data.draft)} m
                {altDraft && <span className={s.altValueSeparator}> | {altDraft} m</span>}
              </td>
            </tr>
            <tr>
              <td className={s.colLabel}>
                {t("f_headway")}
                {altAir && <span className={s.altValueSeparator}> | alt.</span>}
              </td>
              <td className={s.colValue}>
                {formatDimension(data.headway)} m
                {altAir && <span className={s.altValueSeparator}> | {altAir} m</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Emergency channels (VHF) — static NL data */}
      <div>
        <div className={s.sectionHeader}>{t("card_channels")}</div>
        <table className={s.dataTable}>
          <tbody>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillEmergency}`}>
                  {t("pill_emergency")}
                </span>
              </td>
              <td className={s.colDescription}>{t("k_inland")}</td>
              <td className={s.colNumber} style={{ color: "var(--color-red)" }}>
                Blokkanaal / 10
              </td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillEmergency}`}>
                  {t("pill_emergency")}
                </span>
              </td>
              <td className={s.colDescription}>{t("k_open")}</td>
              <td className={s.colNumber} style={{ color: "var(--color-red)" }}>
                16
              </td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillInfo}`}>
                  {t("pill_info")}
                </span>
              </td>
              <td className={s.colDescription}>{t("k_ijssel")}</td>
              <td className={s.colNumber}>1</td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillUrgent}`}>
                  {t("pill_urgent")}
                </span>
              </td>
              <td className={s.colDescription}>{t("k_rws")}</td>
              <td className={s.colNumber} style={{ color: "var(--c-orange)" }}>
                23 / 83
              </td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillUrgent}`}>
                  {t("pill_urgent")}
                </span>
              </td>
              <td className={s.colDescription}>{t("k_cg")}</td>
              <td className={s.colNumber} style={{ color: "var(--c-orange)" }}>
                67
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
