import type { CardData } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import { formatENI, formatATIS, formatMMSI } from "../../lib/format"
import s from "./CardPreview.module.css"

function formatDimension(v: string): string {
  const n = parseFloat(v.replace(",", "."))

  return isNaN(n) ? "0,00" : n.toFixed(2).replace(".", ",")
}

function formatDimensionIfSet(v: string): string | null {
  const n = parseFloat(v.replace(",", "."))

  return v && v.trim() && !isNaN(n) && n > 0
    ? n.toFixed(2).replace(".", ",")
    : null
}

interface ShipSectionProps {
  data: CardData
}

export function ShipSection({ data }: ShipSectionProps) {
  const { t } = useTranslation()

  const altLen = formatDimensionIfSet(data.altLength)
  const altAir = formatDimensionIfSet(data.altAirDraft)

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
              <td className={s.colLabel}>{t("f_eni")}</td>
              <td className={s.colValue}>{formatENI(data.eni)}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_callsign")}</td>
              <td className={s.colValue}>{data.callSign || "—"}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>ATIS</td>
              <td className={s.colValue}>{formatATIS(data.atis)}</td>
            </tr>
            <tr>
              <td className={s.colLabel}>MMSI</td>
              <td className={s.colValue}>{formatMMSI(data.mmsi)}</td>
            </tr>
            <tr className={s.spacerRow}>
              <td colSpan={2} />
            </tr>
            <tr className={s.separatorRow}>
              <td className={s.colLabel}>
                {t("f_length")}
                {altLen && (
                  <span className={s.altValueSeparator}>
                    {" "}
                    | {t("f_alt_length")}
                  </span>
                )}
              </td>
              <td className={s.colValue}>
                {formatDimension(data.length)} m
                {altLen && (
                  <span className={s.altValueSeparator}> | {altLen} m</span>
                )}
              </td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_width")}</td>
              <td className={s.colValue}>{formatDimension(data.width)} m</td>
            </tr>
            <tr>
              <td className={s.colLabel}>{t("f_draft")}</td>
              <td className={s.colValue}>{formatDimension(data.draft)} m</td>
            </tr>
            <tr>
              <td className={s.colLabel}>
                {t("f_airdraft")}
                {altAir && (
                  <span className={s.altValueSeparator}>
                    {" "}
                    | {t("f_alt_airdraft")}
                  </span>
                )}
              </td>
              <td className={s.colValue}>
                {formatDimension(data.airDraft)} m
                {altAir && (
                  <span className={s.altValueSeparator}> | {altAir} m</span>
                )}
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
