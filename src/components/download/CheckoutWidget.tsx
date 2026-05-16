import { useTranslation } from "../../i18n/useTranslation"
import { PAYMENT_LINK_URL } from "../../lib/worker"

export function CheckoutWidget() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-[#d0dbe8] rounded-xl w-full md:min-w-60 md:max-w-96">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-mid flex items-center gap-1">
          <span className="text-base font-bold text-navy2">① </span>
          {t("step_buy")}
        </span>
        <div className="flex flex-col items-center gap-0">
          <span className="text-base font-bold text-dark text-center">
            {t("checkout_download_code")}
          </span>
          <span className="text-xs text-mid">{t("token_explanation")}</span>
        </div>
      </div>
      <span className="text-xs text-lgray text-center">
        {t("code_stacking_note")}
      </span>
      <button
        type="button"
        onClick={() => {
          window.location.href = PAYMENT_LINK_URL
        }}
        className="w-full bg-mob-blue hover:bg-navy2 text-white text-base font-semibold rounded-lg py-3 px-5 cursor-pointer transition-colors border-none"
      >
        {t("btn_buy")} — €2
      </button>
      <p className="text-xs text-mid m-0">{t("payment_methods")}</p>
      <div className="flex gap-1.5 items-center flex-wrap justify-center">
        {/* PayPal */}
        <svg width="46" height="24" viewBox="0 0 46 24" aria-label="PayPal">
          <rect width="46" height="24" rx="4" fill="#003087" />
          <text
            x="23"
            y="16"
            textAnchor="middle"
            fontFamily="Arial,sans-serif"
            fontSize="9"
            fontWeight="700"
            fill="white"
            letterSpacing="0.5"
          >
            PayPal
          </text>
        </svg>
        {/* Mastercard */}
        <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Mastercard">
          <rect width="38" height="24" rx="4" fill="#1a1a1a" />
          <circle cx="15" cy="12" r="7" fill="#EB001B" />
          <circle cx="23" cy="12" r="7" fill="#F79E1B" opacity="0.9" />
        </svg>
        {/* Visa */}
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
            fill="white"
          >
            VISA
          </text>
        </svg>
        {/* Apple Pay */}
        <svg width="52" height="24" viewBox="0 0 52 24" aria-label="Apple Pay">
          <rect width="52" height="24" rx="4" fill="#000" />
          <text
            x="26"
            y="16"
            textAnchor="middle"
            fontFamily="-apple-system,Arial,sans-serif"
            fontSize="9"
            fill="white"
          >
            Apple Pay
          </text>
        </svg>
        {/* iDEAL */}
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
            fill="#CC0000"
          >
            iDEAL
          </text>
        </svg>
        <span className="text-xs text-mid">{t("payment_more")}</span>
      </div>
    </div>
  )
}
