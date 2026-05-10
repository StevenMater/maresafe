import { useEffect, useRef, useId, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "../../lib/cn"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ")

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement

    const panel = panelRef.current
    if (panel) {
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      focusable[0]?.focus()
    }

    return () => {
      ;(previousFocusRef.current as HTMLElement | null)?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab") return

      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md mx-4 bg-white rounded-lg shadow-xl",
          "flex flex-col max-h-[90vh]",
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-lgray/20">
            <h2 id={titleId} className="text-sm font-semibold text-mid">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-lgray hover:text-mid hover:bg-lgray/10 transition-colors"
              aria-label="Close"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 p-4">{children}</div>
      </div>
    </>,
    document.body,
  )
}
