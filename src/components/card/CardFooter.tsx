import { useTranslation } from "../../i18n/useTranslation"
import s from "./CardPreview.module.css"

export function CardFooter() {
  const { t } = useTranslation()

  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })

  return (
    <div className={s.cardFooter}>
      {t("footer_text").replace("{date}", date)}
    </div>
  )
}
