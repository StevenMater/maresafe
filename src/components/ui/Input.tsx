import { useId, useRef, useState, type InputHTMLAttributes, type ChangeEvent, type FocusEvent } from "react"
import { cn } from "../../lib/cn"
import { Tooltip } from "./Tooltip"
import { useTranslation } from "../../i18n/useTranslation"

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  error?: string
  suffix?: string
  numeric?: boolean
  decimal?: boolean
  tooltip?: string
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

function cleanNumeric(value: string, maxLength: number): string {
  const digits = value.replace(/\D/g, "")
  return maxLength > 0 ? digits.slice(0, maxLength) : digits
}

function cleanDecimal(value: string): string {
  let result = ""
  let hasDot = false
  for (const char of value.replace(",", ".")) {
    if (/\d/.test(char)) result += char
    else if (char === "." && !hasDot) { result += char; hasDot = true }
  }
  const dotIdx = result.indexOf(".")
  if (dotIdx === -1) return result.slice(0, 3)
  return result.slice(0, dotIdx).slice(0, 3) + "." + result.slice(dotIdx + 1).slice(0, 2)
}

export function Input({
  label,
  error,
  suffix,
  numeric,
  decimal,
  tooltip,
  className,
  onChange,
  onBlur,
  value,
  id: idProp,
  ...props
}: InputProps) {
  const { t } = useTranslation()
  const generatedId = useId()
  const id = idProp ?? generatedId
  const [inputWarning, setInputWarning] = useState<string | null>(null)
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showWarning(message: string) {
    setInputWarning(message)
    if (warningTimer.current) clearTimeout(warningTimer.current)
    warningTimer.current = setTimeout(() => setInputWarning(null), 3000)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const current = String(value ?? "")

    if (numeric) {
      const cleaned = cleanNumeric(raw, e.target.maxLength)
      if (cleaned !== raw) {
        showWarning(t("input_warning_numeric"))
        setNativeValue(e.target, current)
        return
      }
    } else if (decimal) {
      const normalized = raw.replace(",", ".")
      const cleaned = cleanDecimal(raw)
      if (cleaned !== normalized) {
        showWarning(t("input_warning_decimal"))
        setNativeValue(e.target, current)
        return
      }
      if (normalized !== raw) {
        setNativeValue(e.target, cleaned)
        return
      }
    }
    onChange?.(e)
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    if (decimal) {
      const val = e.currentTarget.value
      if (val && val !== ".") {
        const decimals = val.includes(".") ? val.split(".")[1] : null
        const formatted =
          decimals === null ? val + ".00"
          : decimals.length === 0 ? val + "00"
          : decimals.length === 1 ? val + "0"
          : val
        if (formatted !== val) setNativeValue(e.currentTarget, formatted)
      }
    }
    onBlur?.(e)
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <div className="flex items-baseline gap-1.25">
          <label
            htmlFor={id}
            className="text-xs font-semibold tracking-wider uppercase text-navy2 leading-none"
          >
            {label}
          </label>
          {tooltip && (
            <Tooltip content={tooltip}>
              <span className="inline-flex items-center justify-center w-3.75 h-3.75 rounded-full bg-navy/8 border border-navy/35 text-navy2 text-xs font-bold leading-none cursor-pointer select-none hover:bg-navy/16 hover:border-navy/55 transition-colors">
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
          value={value}
          inputMode={numeric ? "numeric" : decimal ? "decimal" : undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "w-full rounded border border-[#a8c4e0] bg-[#f0f6ff] px-2.5 py-1.75",
            "font-mono text-sm text-dark placeholder:text-lgray",
            "focus:outline-none focus:border-navy2 focus:shadow-[0_0_0_3px_rgba(44,82,130,0.15)]",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-[border-color]",
            error && "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(169,50,38,0.15)]",
            suffix && "pr-10",
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2.5 text-xs font-mono text-lgray">
            {suffix}
          </span>
        )}
      </div>
      {inputWarning && <span className="text-xs text-red">{inputWarning}</span>}
      {error && <span className="text-xs text-red">{error}</span>}
    </div>
  )
}
