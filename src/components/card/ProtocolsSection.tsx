import { useTranslation } from "../../i18n/useTranslation"
import s from "./CardPreview.module.css"

interface ProtocolsSectionProps {
  type: "fire" | "mob"
}

export function ProtocolsSection({ type }: ProtocolsSectionProps) {
  const { t, tArr } = useTranslation()

  const isMob = type === "mob"
  const steps = tArr(type)
  const headerClass = isMob
    ? `${s.sectionHeader} ${s.sectionHeaderMob}`
    : `${s.sectionHeader} ${s.sectionHeaderFire}`
  const tableClass = isMob ? `${s.protoRows} ${s.protoRowsMob}` : s.protoRows
  const badgeClass = isMob ? `${s.stepNumber} ${s.stepNumberMob}` : s.stepNumber

  return (
    <div>
      <div className={headerClass}>{t(isMob ? "card_mob" : "card_fire")}</div>
      <table className={tableClass}>
        <tbody>
          {steps.map((step, i) => (
            <tr key={i}>
              <td>
                <div className={s.protocolStep}>
                  <span className={badgeClass}>{i + 1}</span>
                  {step}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
