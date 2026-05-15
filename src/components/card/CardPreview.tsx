import type { CardData } from "../../types"
import { useTranslation } from "../../i18n/useTranslation"
import s from "./CardPreview.module.css"
import { TitleBar } from "./TitleBar"
import { ShipSection } from "./ShipSection"
import { ContactsSection } from "./ContactsSection"
import { CallsSection } from "./CallsSection"
import { ProtocolsSection } from "./ProtocolsSection"
import { SignalsSection } from "./SignalsSection"
import { CardFooter } from "./CardFooter"

interface CardPreviewProps {
  data: CardData
  showWatermark: boolean
  hideBorder?: boolean
}

export function CardPreview({ data, showWatermark, hideBorder }: CardPreviewProps) {
  const { t } = useTranslation()

  return (
    <div className={s.card} style={hideBorder ? { border: "none", borderRadius: 0 } : undefined}>
      {showWatermark && (
        <div className={s.watermark} aria-hidden="true">
          PREVIEW
        </div>
      )}

      <TitleBar
        vesselName={data.vesselName}
        cardTitle={t("card_title")}
        subtitle={t("card_subtitle")}
        locationLabel={t("location_label")}
        locationName={t("location_name")}
        locationFlag={t("location_flag")}
      />

      <div className={s.content}>
        <div className={s.cols}>
          <div className={s.leftCol}>
            <ShipSection data={data} />
          </div>
          <div className={s.rightCol}>
            <ContactsSection data={data} />
          </div>
        </div>

        <CallsSection vesselName={data.vesselName} callSign={data.callSign} />

        <div className={s.cols}>
          <ProtocolsSection type="fire" />
          <ProtocolsSection type="mob" />
        </div>

        <SignalsSection />
      </div>

      <CardFooter />
    </div>
  )
}
