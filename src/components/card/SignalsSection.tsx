import type { StringTranslationKey } from "../../i18n/locales/index"
import { useTranslation } from "../../i18n/useTranslation"
import s from "./CardPreview.module.css"

type SignalBeat = "L" | "S" | "XS"

const SIGNALS: { key: StringTranslationKey; pattern: SignalBeat[] }[] = [
  { key: "signal_attention", pattern: ["L"] },
  { key: "signal_distress", pattern: ["L", "L", "L", "L", "L", "L"] },
  { key: "signal_collision", pattern: ["XS", "XS", "XS", "XS", "XS", "XS"] },
  { key: "signal_keep_clear", pattern: ["S", "L"] },
  { key: "signal_astern", pattern: ["S", "S", "S"] },
  { key: "signal_crossing", pattern: ["L", "L", "L"] },
  { key: "signal_turn_port", pattern: ["S", "S"] },
  { key: "signal_turn_stbd", pattern: ["S"] },
  { key: "signal_around_port", pattern: ["L", "S", "S"] },
  { key: "signal_around_stbd", pattern: ["L", "S"] },
  { key: "signal_overtake_port", pattern: ["L", "L", "S", "S"] },
  { key: "signal_overtake_stbd", pattern: ["L", "L", "S"] },
  { key: "signal_enter_port", pattern: ["L", "L", "L", "S", "S"] },
  { key: "signal_enter_stbd", pattern: ["L", "L", "L", "S"] },
]

function SignalShape({ beat }: { beat: SignalBeat }) {
  if (beat === "L") return <span className={s.gL} />
  if (beat === "S") return <span className={s.gS} />

  return <span className={s.gXS} />
}

export function SignalsSection() {
  const { t } = useTranslation()

  return (
    <div>
      <div className={s.signalLegend}>
        <span>{t("card_signals")}</span>
        <span className={s.legendSeparator}>|</span>
        <span className={s.legendItem}>
          <span className={s.symbolLong} />
          {t("sig_l")}
        </span>
        <span className={s.legendSeparator}>|</span>
        <span className={s.legendItem}>
          <span className={s.symbolShort} />
          {t("sig_s")}
        </span>
        <span className={s.legendSeparator}>|</span>
        <span className={s.legendItem}>
          <span className={s.symbolVeryShort} />
          {t("sig_xs")}
        </span>
      </div>
      <div className={s.signalGrid}>
        {SIGNALS.map(({ key, pattern }, i) => {
          const rowIndex = Math.floor(i / 2)
          const isAlt = rowIndex % 2 === 0

          return (
            <div
              key={key}
              className={`${s.signalRow} ${isAlt ? s.signalRowAlt : s.signalRowDefault}`}
            >
              <div className={s.signalPattern}>
                {pattern.map((beat, j) => (
                  <SignalShape key={j} beat={beat} />
                ))}
              </div>
              <span className={s.signalDescription}>
                {t(key as StringTranslationKey)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
