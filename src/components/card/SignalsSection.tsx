import { useTranslation } from "../../i18n/useTranslation"
import { SIGNAL_PATTERNS, type SignalBeat } from "../../lib/format"
import s from "./CardPreview.module.css"

function SignalShape({ beat }: { beat: SignalBeat }) {
  if (beat === "L") return <span className={s.gL} />
  if (beat === "S") return <span className={s.gS} />

  return <span className={s.gXS} />
}

export function SignalsSection() {
  const { t, tArr } = useTranslation()
  const signals = tArr("signals")

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
        {signals.map((desc, i) => {
          const rowIndex = Math.floor(i / 2)
          const isAlt = rowIndex % 2 === 0

          return (
            <div
              key={i}
              className={`${s.signalRow} ${isAlt ? s.signalRowAlt : s.signalRowDefault}`}
            >
              <div className={s.signalPattern}>
                {SIGNAL_PATTERNS[i]?.map((beat, j) => (
                  <SignalShape key={j} beat={beat} />
                ))}
              </div>
              <span className={s.signalDescription}>{desc}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
