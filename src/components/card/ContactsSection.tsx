import type { CardData } from "../../types"
import { MAX_CONTACTS } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import { formatPhone } from "../../lib/format"
import s from "./CardPreview.module.css"

interface ContactsSectionProps {
  data: CardData
}

export function ContactsSection({ data }: ContactsSectionProps) {
  const { t } = useTranslation()

  const contactRows = Array.from({ length: MAX_CONTACTS }, (_, i) => {
    const c = data.contacts[i]

    return c?.label || c?.number ? c : null
  })

  return (
    <>
      {/* Contacts */}
      <div>
        <div className={s.sectionHeader}>{t("card_contacts")}</div>
        <table className={s.dataTable}>
          <tbody>
            {contactRows.map((c, i) => (
              <tr key={i}>
                <td style={{ width: "50%", fontWeight: c ? 700 : undefined }}>
                  {c?.label ?? ""}
                </td>
                <td className={s.tdAlignRight} style={{ width: "50%" }}>
                  {c ? formatPhone(c.country, c.number) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insurer */}
      <div>
        <div className={`${s.sectionHeader} ${s.sectionHeaderInsurer}`}>
          <span>{t("card_insurer")}</span>
          <span>—</span>
          <span>{data.insurerName || "—"}</span>
        </div>
        <table className={s.dataTable}>
          <tbody>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillInfo}`}>
                  {t("pill_info")}
                </span>
              </td>
              <td className={s.colDescription}>{t("f_policy")}</td>
              <td className={s.colNumber}>{data.policyNumber || "—"}</td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillUrgent}`}>
                  {t("pill_urgent")}
                </span>
              </td>
              <td className={s.colDescription}>{t("h_insurer_emergency")}</td>
              <td className={s.colNumber} style={{ color: "var(--c-orange)" }}>
                {formatPhone(
                  data.insurerEmergencyCountry,
                  data.insurerEmergencyNumber,
                )}
              </td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillInfo}`}>
                  {t("pill_info")}
                </span>
              </td>
              <td className={s.colDescription}>{t("h_insurer_office")}</td>
              <td className={s.colNumber}>
                {formatPhone(
                  data.insurerOfficeCountry,
                  data.insurerOfficeNumber,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Emergency numbers — static NL data */}
      <div>
        <div className={s.sectionHeader}>{t("card_numbers")}</div>
        <table className={s.dataTable}>
          <tbody>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillEmergency}`}>
                  {t("pill_emergency")}
                </span>
              </td>
              <td className={s.colDescription}>{t("h_cg")}</td>
              <td className={s.colNumber} style={{ color: "var(--color-red)" }}>
                0900-0111
              </td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillEmergency}`}>
                  {t("pill_emergency")}
                </span>
              </td>
              <td className={s.colDescription}>{t("h_112")}</td>
              <td className={s.colNumber} style={{ color: "var(--color-red)" }}>
                112
              </td>
            </tr>
            <tr>
              <td className={s.colBadge}>
                <span className={`${s.pill} ${s.pillMedical}`}>
                  {t("pill_medical")}
                </span>
              </td>
              <td className={s.colDescription}>{t("h_rmd")}</td>
              <td
                className={s.colNumber}
                style={{ color: "var(--color-green)" }}
              >
                +31 88 958 4020
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

// TODO: replace emergency numbers with local numbers based on sailing area
