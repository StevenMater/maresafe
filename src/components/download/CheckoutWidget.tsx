import { useTranslation } from "../../i18n/useTranslation"

export function CheckoutWidget() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-white border border-[#d0dbe8] rounded-xl min-w-60 max-w-72">
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm text-mid">MareSafe</span>
        <span className="text-4xl font-bold text-dark">€2</span>
      </div>
      <button
        type="button"
        className="w-full bg-mob-blue hover:bg-navy2 text-white text-base font-semibold rounded-lg py-3 px-5 cursor-pointer transition-colors border-none">
        {t("btn_buy")}
      </button>
      <p className="text-xs text-mid m-0">{t("payment_methods")}</p>
      <div className="flex gap-1.5 items-center flex-wrap justify-center">
        <svg
          width="38"
          height="24"
          viewBox="0 0 38 24"
          aria-label="American Express">
          <rect width="38" height="24" rx="4" fill="#2E77BC" />
          <text
            x="19"
            y="16"
            textAnchor="middle"
            fontFamily="Arial,sans-serif"
            fontSize="9"
            fontWeight="700"
            fill="white"
            letterSpacing="0.5">
            AMEX
          </text>
        </svg>
        <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Mastercard">
          <rect width="38" height="24" rx="4" fill="#1a1a1a" />
          <circle cx="15" cy="12" r="7" fill="#EB001B" />
          <circle cx="23" cy="12" r="7" fill="#F79E1B" opacity="0.9" />
        </svg>
        <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Visa">
          <rect width="38" height="24" rx="4" fill="#1A1F71" />
          <text
            x="19"
            y="16.5"
            textAnchor="middle"
            fontFamily="Arial,sans-serif"
            fontSize="11"
            fontWeight="700"
            fontStyle="italic"
            fill="white">
            VISA
          </text>
        </svg>
        <svg width="52" height="24" viewBox="0 0 52 24" aria-label="Apple Pay">
          <rect width="52" height="24" rx="4" fill="#000" />
          <text
            x="26"
            y="16"
            textAnchor="middle"
            fontFamily="-apple-system,Arial,sans-serif"
            fontSize="9"
            fill="white">
            Apple Pay
          </text>
        </svg>
        <svg width="38" height="24" viewBox="0 0 38 24" aria-label="iDEAL">
          <rect
            width="38"
            height="24"
            rx="4"
            fill="white"
            stroke="#d0dbe8"
            strokeWidth="1"
          />
          <text
            x="19"
            y="16"
            textAnchor="middle"
            fontFamily="Arial,sans-serif"
            fontSize="10"
            fontWeight="700"
            fill="#CC0000">
            iDEAL
          </text>
        </svg>
      </div>
    </div>
  )
}
