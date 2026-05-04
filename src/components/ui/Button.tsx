import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "../../lib/cn"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  children?: ReactNode
}

const variantClasses = {
  primary: "bg-navy text-white hover:bg-navy2 active:bg-navy2",
  secondary: "border border-navy text-navy hover:bg-navy/10 active:bg-navy/15",
  ghost: "text-navy hover:bg-navy/10 active:bg-navy/15",
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
