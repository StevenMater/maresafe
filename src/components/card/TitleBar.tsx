import logo from "../../assets/logo.svg"
import s from "./CardPreview.module.css"

interface TitleBarProps {
  vesselName: string
  cardTitle: string
  subtitle: string
  locationLabel: string
  locationName: string
  locationFlag: string
}

export function TitleBar({
  vesselName,
  cardTitle,
  subtitle,
  locationLabel,
  locationName,
  locationFlag,
}: TitleBarProps) {
  return (
    <div className={s.titleBar}>
      <div className={s.titleLeft}>
        <img src={logo} className={s.cardLogo} alt="MareSafe" />
        <div className={s.titleText}>
          <div className={s.vesselName}>{vesselName.toUpperCase() || "—"}</div>
          <div className={s.cardTitleText}>{cardTitle}</div>
        </div>
      </div>
      <div className={s.titleRight}>
        <small>{subtitle}</small>
        <small>
          {locationLabel}: {locationName} {locationFlag}
        </small>
      </div>
    </div>
  )
}
