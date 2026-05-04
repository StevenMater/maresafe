import type { ReactNode } from "react"
import { cn } from "../../lib/cn"

interface BadgeProps {
  variant: "emergency" | "urgent" | "medical" | "info"
  children: ReactNode
  className?: string
}

const variantClasses = {
  emergency: "bg-red/10 text-red border border-red/30",
  urgent: "bg-amber/10 text-amber border border-amber/30",
  medical: "bg-green/10 text-green border border-green/30",
  info: "bg-navy/10 text-navy border border-navy/30",
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
