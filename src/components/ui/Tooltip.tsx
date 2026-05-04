import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [above, setAbove] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [open])

  function handleToggle() {
    if (!open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setAbove(rect.bottom + 80 > window.innerHeight)
    }
    setOpen((v) => !v)
  }

  return (
    <span ref={wrapperRef} className={cn("relative inline-flex", className)}>
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={handleToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleToggle()}
        className="cursor-pointer select-none"
      >
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute left-1/2 -translate-x-1/2 z-50 w-48 px-2 py-1.5",
            "bg-navy text-white text-xs rounded leading-snug pointer-events-none",
            above
              ? "bottom-full mb-1.5"
              : "top-full mt-1.5",
          )}
        >
          {content}
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
              above
                ? "top-full border-t-navy"
                : "bottom-full border-b-navy",
            )}
          />
        </span>
      )}
    </span>
  )
}
