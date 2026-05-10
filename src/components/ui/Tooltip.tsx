import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/cn"

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

const TOOLTIP_WIDTH = 192
const VIEWPORT_PADDING = 8
const ARROW_SIZE = 8
const GAP = 6

interface TooltipPosition {
  top: number
  left: number
  arrowLeft: number
  above: boolean
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<TooltipPosition | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleScroll() {
      setOpen(false)
    }
    document.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("scroll", handleScroll, true)
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open])

  function handleToggle() {
    if (!open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      const triggerCenter = rect.left + rect.width / 2
      const idealLeft = triggerCenter - TOOLTIP_WIDTH / 2
      const clampedLeft = Math.max(
        VIEWPORT_PADDING,
        Math.min(idealLeft, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING),
      )
      const above = rect.bottom + 80 > window.innerHeight
      setPosition({
        above,
        left: clampedLeft,
        arrowLeft: triggerCenter - clampedLeft,
        top: above
          ? rect.top - GAP - ARROW_SIZE
          : rect.bottom + GAP,
      })
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
      {open && position && createPortal(
        <span
          role="tooltip"
          style={{
            position: "fixed",
            top: position.above ? undefined : position.top,
            bottom: position.above ? window.innerHeight - position.top : undefined,
            left: position.left,
            width: TOOLTIP_WIDTH,
          }}
          className="z-9999 px-2 py-1.5 bg-navy text-white text-xs rounded leading-snug pointer-events-none"
        >
          {content}
          <span
            style={{ left: position.arrowLeft }}
            className={cn(
              "absolute -translate-x-1/2 border-4 border-transparent",
              position.above ? "top-full border-t-navy" : "bottom-full border-b-navy",
            )}
          />
        </span>,
        document.body,
      )}
    </span>
  )
}
