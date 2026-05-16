import {
  useState,
  useRef,
  useEffect,
  useId,
  type ReactNode,
  type KeyboardEvent,
  type CSSProperties,
} from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check, Search } from "lucide-react"
import { cn } from "../../lib/cn"
import { useTranslation } from "../../i18n/useTranslation"

export interface SelectOption {
  value: string
  label: string
  flag?: string
  icon?: ReactNode
}

interface SelectBase {
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  options: SelectOption[]
  id?: string
  variant?: "field" | "ghost"
}

interface SingleSelectProps extends SelectBase {
  multiple?: false
  value: string
  onChange: (value: string) => void
}

interface MultiSelectProps extends SelectBase {
  multiple: true
  value: string[]
  onChange: (value: string[]) => void
  max?: number
}

type SelectProps = SingleSelectProps | MultiSelectProps

function OptionContent({ opt }: { opt: SelectOption }) {
  return (
    <span className="flex items-center gap-2 min-w-0">
      {opt.flag && <span className="shrink-0">{opt.flag}</span>}
      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
      <span className="truncate">{opt.label}</span>
    </span>
  )
}

const MAX_FLAGS = 4

export function Select(props: SelectProps) {
  const { t } = useTranslation()
  const {
    label,
    error,
    placeholder,
    disabled,
    className,
    options,
    id: idProp,
    variant = "field",
  } = props
  const generatedId = useId()
  const id = idProp ?? generatedId

  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [query, setQuery] = useState("")
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})

  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredOptions = query
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.flag?.includes(query),
      )
    : options

  useEffect(() => {
    if (!open) {
      setQuery("")
      return
    }
    requestAnimationFrame(() => searchRef.current?.focus())
  }, [open])

  useEffect(() => {
    setFocusedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const item = listRef.current?.children[focusedIndex] as
      | HTMLElement
      | undefined
    item?.scrollIntoView({ block: "nearest" })
  }, [open, focusedIndex])

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [open])

  function openDropdown() {
    if (disabled) return
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const openAbove = rect.bottom + 260 > window.innerHeight
      const anchorLeft = rect.left < window.innerWidth / 2
      setDropdownStyle({
        position: "fixed",
        zIndex: 9999,
        minWidth: rect.width,
        maxWidth: window.innerWidth - 16,
        ...(anchorLeft
          ? { left: Math.max(8, rect.left) }
          : { right: Math.max(8, window.innerWidth - rect.right) }),
        ...(openAbove
          ? { bottom: window.innerHeight - rect.top + 4 }
          : { top: rect.bottom + 4 }),
      })
      setFocusedIndex(0)
    }
    setOpen((v) => !v)
  }

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function isSelected(value: string): boolean {
    if (props.multiple) return props.value.includes(value)
    return props.value === value
  }

  function selectOption(value: string) {
    if (props.multiple) {
      const current = props.value
      if (current.includes(value)) {
        props.onChange(current.filter((v) => v !== value))
      } else if (props.max === undefined || current.length < props.max) {
        props.onChange([...current, value])
      } else if (props.max === 1) {
        props.onChange([value])
      }
    } else {
      props.onChange(value)
      setOpen(false)
    }
  }

  function isDisabledOption(value: string): boolean {
    if (!props.multiple) return false
    if (props.max === undefined || props.max === 1) return false
    return props.value.length >= props.max && !props.value.includes(value)
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openDropdown()
    }
    if (e.key === "Escape") setOpen(false)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!open) openDropdown()
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
    }
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      close()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedIndex((i) => Math.min(i + 1, filteredOptions.length - 1))
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedIndex((i) => Math.max(i - 1, 0))
    }
    if (e.key === "Enter") {
      e.preventDefault()
      const opt = filteredOptions[focusedIndex]
      if (opt && !isDisabledOption(opt.value)) selectOption(opt.value)
    }
  }

  const selectedOpts = props.multiple
    ? options.filter((o) => props.value.includes(o.value))
    : []
  const singleSelected = !props.multiple
    ? options.find((o) => o.value === props.value)
    : undefined
  const showPlaceholder = props.multiple
    ? props.value.length === 0
    : !props.value

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wider uppercase text-navy2"
        >
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={openDropdown}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex items-center gap-2 text-left transition-colors",
            "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
            variant === "field" && [
              "w-full h-9 px-2.5 py-1.75 rounded border border-[#a8c4e0] bg-[#f0f6ff]",
              "font-mono text-sm text-dark",
              "focus:border-navy2 focus:shadow-[0_0_0_3px_rgba(44,82,130,0.15)]",
              error && "border-red",
              open && "border-navy2 shadow-[0_0_0_3px_rgba(44,82,130,0.15)]",
            ],
            variant === "ghost" && [
              "px-1.5 py-1 rounded-md border-none bg-transparent text-white",
              "hover:bg-white/15",
              open && "bg-white/15",
            ],
          )}
        >
          {props.multiple ? (
            showPlaceholder ? (
              <span className="flex-1 truncate text-lgray">{placeholder}</span>
            ) : (
              <span className="flex items-center gap-1 flex-1 min-w-0">
                {selectedOpts.slice(0, MAX_FLAGS).map((opt) => (
                  <span
                    key={opt.value}
                    title={opt.label}
                    className="shrink-0 text-base leading-none"
                  >
                    {opt.flag ?? opt.label.slice(0, 2)}
                  </span>
                ))}
                {selectedOpts.length > MAX_FLAGS && (
                  <span className="text-xs text-lgray shrink-0">
                    +{selectedOpts.length - MAX_FLAGS}
                  </span>
                )}
              </span>
            )
          ) : (
            <>
              {singleSelected?.flag && (
                <span className="shrink-0">{singleSelected.flag}</span>
              )}
              <span
                className={cn(
                  "flex-1 truncate",
                  showPlaceholder && "text-lgray",
                )}
              >
                {singleSelected?.label ?? placeholder}
              </span>
            </>
          )}
          <ChevronDown
            size={14}
            strokeWidth={1.5}
            className={cn(
              "shrink-0 text-lgray transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              style={dropdownStyle}
              className="bg-white border border-navy/20 rounded shadow-lg"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-lgray/20">
                <Search
                  size={12}
                  strokeWidth={1.5}
                  className="shrink-0 text-lgray"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t("select_search")}
                  className="flex-1 text-sm outline-none placeholder:text-lgray bg-transparent"
                />
              </div>
              <ul
                ref={listRef}
                role="listbox"
                aria-multiselectable={props.multiple}
                className="max-h-48 overflow-y-auto py-1"
              >
                {filteredOptions.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-lgray">
                    {t("select_no_results")}
                  </li>
                ) : (
                  filteredOptions.map((opt, i) => {
                    const selected = isSelected(opt.value)
                    const optDisabled = isDisabledOption(opt.value)
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={selected}
                        aria-disabled={optDisabled}
                        onClick={() => !optDisabled && selectOption(opt.value)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer",
                          "hover:bg-navy/5",
                          i === focusedIndex && "bg-navy/10",
                          selected && "text-navy font-medium",
                          optDisabled && "opacity-40 cursor-not-allowed",
                        )}
                      >
                        <OptionContent opt={opt} />
                        {selected && (
                          <Check
                            size={12}
                            strokeWidth={2}
                            className="ml-auto shrink-0 text-navy"
                          />
                        )}
                      </li>
                    )
                  })
                )}
              </ul>
            </div>,
            document.body,
          )}
      </div>
      {error && <span className="text-xs text-red">{error}</span>}
    </div>
  )
}
