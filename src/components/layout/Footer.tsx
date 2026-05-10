import { useTranslation } from "../../i18n/useTranslation"
import { CURRENT_VERSION } from "../../types"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="font-mono text-xs text-lgray text-center py-2 px-6 border-t border-[#d0dbe8] bg-[#f4f7fa] tracking-wide leading-relaxed">
      <span className="inline-flex items-center gap-2">
        <span>
          {t("footer_made")}{" "}
          <span className="text-mid font-semibold">Steven de Lange</span>
        </span>
        <span>·</span>
        <span>v{CURRENT_VERSION}</span>
        <span>·</span>
        <span>2026</span>
      </span>
      <br />
      <span>{t("footer_feedback")} </span>
      <a
        href="mailto:stevenmater@gmail.com"
        className="text-mid no-underline hover:underline"
      >
        stevenmater@gmail.com
      </a>
    </footer>
  )
}
