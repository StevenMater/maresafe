import { useId } from "react"
import { cn } from "../../lib/cn"
import { Select } from "./Select"
import { Input } from "./Input"
import { countryFlag, countryDialCode } from "../../lib/format"
import { SUPPORTED_COUNTRIES } from "../../types"
import type { CountryCode } from "../../types"

export interface PhoneValue {
  country: CountryCode
  number: string
}

interface PhoneInputProps {
  value: PhoneValue
  onChange: (value: PhoneValue) => void
  label?: string
  error?: string
  className?: string
}

const COUNTRY_OPTIONS = SUPPORTED_COUNTRIES.map((code) => ({
  value: code,
  label: countryDialCode(code),
  flag: countryFlag(code),
}))

export function PhoneInput({ value, onChange, label, error, className }: PhoneInputProps) {
  const id = useId()

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-mid">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <Select
          options={COUNTRY_OPTIONS}
          value={value.country}
          onChange={(country) => onChange({ ...value, country: country as CountryCode })}
          className="w-28 shrink-0"
        />
        <Input
          id={id}
          value={value.number}
          onChange={(e) => onChange({ ...value, number: e.target.value })}
          placeholder="0612345678"
          numeric
          className="flex-1"
        />
      </div>
      {error && <span className="text-xs text-red">{error}</span>}
    </div>
  )
}
