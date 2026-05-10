import { Check, AlertTriangle, X } from "lucide-react"

interface NotificationBannerProps {
  variant: "success" | "warning"
  title?: string
  message: string
  onDismiss: () => void
}

const variantStyles = {
  success: {
    bg: "#1e6b3c",
    border: "#155a30",
    Icon: Check,
  },
  warning: {
    bg: "#c45f00",
    border: "#9a4a00",
    Icon: AlertTriangle,
  },
}

export function NotificationBanner({
  variant,
  title,
  message,
  onDismiss,
}: NotificationBannerProps) {
  const { bg, border, Icon } = variantStyles[variant]

  return (
    <div
      style={{ background: bg, borderBottom: `3px solid ${border}` }}
      className="flex items-center gap-3 px-6 py-2.5">
      <Icon size={18} strokeWidth={2} className="text-white shrink-0" />
      <div className="flex-1 text-xs text-white leading-snug">
        {title && (
          <div className="font-mono font-semibold uppercase tracking-wider text-white/70 text-[10px] mb-0.5">
            {title}
          </div>
        )}
        {message}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-white/60 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss">
        <X size={18} strokeWidth={2} />
      </button>
    </div>
  )
}
