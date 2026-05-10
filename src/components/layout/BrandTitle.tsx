import { useTranslation } from "../../i18n/useTranslation"
import logo from "../../assets/logo.svg"

export function BrandTitle() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 min-w-0">
      <img src={logo} alt="MareSafe" className="h-8 w-8 shrink-0" />
      <div className="flex flex-col gap-px min-w-0">
        <span className="hidden sm:flex font-mono text-2xl font-semibold tracking-wider uppercase text-[#a8c4e0] leading-none items-center">
          Mare<span className="text-white">Safe</span>
        </span>
        <span className="flex sm:hidden font-mono text-2xl font-semibold tracking-wider uppercase leading-none items-center">
          <span className="text-[#a8c4e0]">M</span>
          <span className="text-white">S</span>
        </span>
        <span className="hidden sm:block font-mono text-xs font-semibold tracking-wider uppercase text-[#a8c4e0]/60 leading-tight">
          {t("product_name")}
        </span>
      </div>
    </div>
  )
}
