import { AlertTriangle } from "lucide-react"
import { useTranslation } from "../../i18n/useTranslation"
import { toPhonetic } from "../../lib/format"
import s from "./CardPreview.module.css"

interface CallsSectionProps {
  vesselName: string
  callSign: string
}

export function CallsSection({ vesselName, callSign }: CallsSectionProps) {
  const { t } = useTranslation()

  const name = vesselName || "—"
  const phonetic = callSign ? toPhonetic(callSign) : "—"

  return (
    <div>
      <div className={`${s.sectionHeader} ${s.sectionHeaderEmergencyCalls}`}>
        <span>{t("card_calls")}</span>
        <span
          className={s.callsLangNote}
          style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
        >
          <AlertTriangle size={8} strokeWidth={2} />
          {t("calls_english_note")}
        </span>
      </div>
      <div className={s.callsGrid}>
        {/* MAYDAY */}
        <div className={s.call}>
          <div className={`${s.callHdr} ${s.callHdrMayday}`}>
            <span className={s.signalLbl}>MAYDAY</span>
            <span className={s.whenLbl}>{t("mayday_when")}</span>
          </div>
          <div className={`${s.callBody} ${s.callBodyMaydayBg}`}>
            <div className={`${s.callLineBoldRed} ${s.callWords}`}>
              <span>MAYDAY</span>
              <span>MAYDAY</span>
              <span>MAYDAY</span>
            </div>
            <div className={`${s.callLine} ${s.callWords}`}>
              <span>This is {name}</span>
              <span className={s.callHint}>{t("call_repeat_3")}</span>
            </div>
            <div className={s.callLine}>{phonetic}</div>
            <div className={`${s.callLineBoldRed} ${s.callWords}`}>
              <span>MAYDAY</span>
              <span>—</span>
              <span>{name}</span>
            </div>
            <div className={s.callLine}>{phonetic}</div>
            <div className={`${s.callLine} ${s.callWords}`}>
              <span>Position</span>
              <span className={s.callHint}>{t("call_pos")}</span>
            </div>
            <div className={`${s.callLine} ${s.callHint}`}>
              {t("call_mayday_sit")}
            </div>
            <div className={`${s.callLine} ${s.callWords}`}>
              <span className={s.callHint}>{t("call_pob")}</span>
              <span>—</span>
              <span>OVER</span>
            </div>
          </div>
        </div>

        {/* PAN PAN */}
        <div className={s.call}>
          <div className={`${s.callHdr} ${s.callHdrPanpan}`}>
            <span className={s.signalLbl}>PAN PAN</span>
            <span className={s.whenLbl}>{t("panpan_when")}</span>
          </div>
          <div className={`${s.callBody} ${s.callBodyPanpanBg}`}>
            <div className={`${s.callLineBoldOrange} ${s.callWords}`}>
              <span>PAN PAN</span>
              <span>PAN PAN</span>
              <span>PAN PAN</span>
            </div>
            <div className={`${s.callLine} ${s.callWords}`}>
              <span>This is {name}</span>
              <span className={s.callHint}>{t("call_repeat_3")}</span>
            </div>
            <div className={s.callLine}>{phonetic}</div>
            <div className={`${s.callLineBoldOrange} ${s.callWords}`}>
              <span>PAN PAN</span>
              <span>—</span>
              <span>{name}</span>
            </div>
            <div className={s.callLine}>{phonetic}</div>
            <div className={`${s.callLine} ${s.callWords}`}>
              <span>Position</span>
              <span className={s.callHint}>{t("call_pos")}</span>
            </div>
            <div className={`${s.callLine} ${s.callHint}`}>
              {t("call_panpan_sit")}
            </div>
            <div className={`${s.callLine} ${s.callWords}`}>
              <span className={s.callHint}>{t("call_pob")}</span>
              <span>—</span>
              <span>OVER</span>
            </div>
          </div>
        </div>
      </div>
      <div className={s.callNote}>{t("call_note")}</div>
    </div>
  )
}
