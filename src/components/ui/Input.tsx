import { useId, type InputHTMLAttributes, type KeyboardEvent } from "react"
import { cn } from "../../lib/cn"
import { Tooltip } from "./Tooltip"

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  error?: string
  suffix?: string
  numeric?: boolean
  decimal?: boolean
  tooltip?: string
}

const PASSTHROUGH_KEYS = new Set([
  "Backspace", "Delete", "Tab", "Escape", "Enter",
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Home", "End",
])

function filterNumeric(e: KeyboardEvent<HTMLInputElement>) {
  if (PASSTHROUGH_KEYS.has(e.key)) return
  if (e.ctrlKey || e.metaKey) return
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

function filterDecimal(e: KeyboardEvent<HTMLInputElement>) {
  if (PASSTHROUGH_KEYS.has(e.key)) return
  if (e.ctrlKey || e.metaKey) return

  if (e.key === "." || e.key === ",") {
    const input = e.currentTarget
    if (input.value.includes(".")) { e.preventDefault(); return }
    if (e.key === ",") {
      e.preventDefault()
      const start = input.selectionStart ?? input.value.length
      const end = input.selectionEnd ?? input.value.length
      const newVal = input.value.slice(0, start) + "." + input.value.slice(end)
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
      setter?.call(input, newVal)
      input.dispatchEvent(new Event("input", { bubbles: true }))
      requestAnimationFrame(() => input.setSelectionRange(start + 1, start + 1))
    }
    return
  }

  if (/^\d$/.test(e.key)) {
    const input = e.currentTarget
    const dotIndex = input.value.indexOf(".")
    if (dotIndex !== -1) {
      const ss = input.selectionStart ?? input.value.length
      const se = input.selectionEnd ?? input.value.length
      if (ss > dotIndex) {
        const afterDot = input.value.slice(dotIndex + 1)
        const selectedInDecimal = input.value.slice(Math.max(ss, dotIndex + 1), se)
        if (afterDot.length - selectedInDecimal.length >= 2) e.preventDefault()
      }
    }
    return
  }

  e.preventDefault()
}

export function Input({
  label,
  error,
  suffix,
  numeric,
  decimal,
  tooltip,
  className,
  onKeyDown,
  id: idProp,
  ...props
}: InputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (numeric) filterNumeric(e)
    else if (decimal) filterDecimal(e)
    onKeyDown?.(e)
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <div className="flex items-center gap-1">
          <label htmlFor={id} className="text-sm font-medium text-mid">
            {label}
          </label>
          {tooltip && (
            <Tooltip content={tooltip}>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-lgray/30 text-mid text-xs font-medium leading-none">
                ?
              </span>
            </Tooltip>
          )}
        </div>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          inputMode={numeric || decimal ? "decimal" : undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded border border-lgray/50 bg-white px-3 py-1.5 text-sm text-mid",
            "placeholder:text-lgray",
            "focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red focus:ring-red/30 focus:border-red",
            suffix && "pr-10",
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-sm text-lgray">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span className="text-xs text-red">{error}</span>
      )}
    </div>
  )
}
