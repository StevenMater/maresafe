import {
  useState,
  useRef,
  useEffect,
  useId,
  type ReactNode,
  type KeyboardEvent,
} from "react"
import { ChevronDown, Check, Search } from "lucide-react"
import { cn } from "../../lib/cn"

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
  const { label, error, placeholder, disabled, className, options, id: idProp } = props
  const generatedId = useId()
  const id = idProp ?? generatedId

  const [open, setOpen] = useState(false)
  const [above, setAbove] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [query, setQuery] = useState("")

  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredOptions = query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()) ||
        o.flag?.includes(query)
      )
    : options

  useEffect(() => {
    if (!open) { setQuery(""); return }
    requestAnimationFrame(() => searchRef.current?.focus())
  }, [open])

  useEffect(() => {
    setFocusedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const item = listRef.current?.children[focusedIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: "nearest" })
  }, [open, focusedIndex])

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
      setAbove(rect.bottom + 260 > window.innerHeight)
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
      } else {
        if (props.max === undefined || current.length < props.max) {
          props.onChange([...current, value])
        }
      }
    } else {
      props.onChange(value)
      setOpen(false)
    }
  }

  function isDisabledOption(value: string): boolean {
    if (!props.multiple) return false
    if (props.max === undefined) return false
    return props.value.length >= props.max && !props.value.includes(value)
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDropdown() }
    if (e.key === "Escape") setOpen(false)
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) openDropdown() }
    if (e.key === "ArrowUp") { e.preventDefault() }
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") { close(); return }
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
  const singleSelected = !props.multiple ? options.find((o) => o.value === props.value) : undefined
  const showPlaceholder = props.multiple ? props.value.length === 0 : !props.value

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-mid">
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
            "w-full flex items-center gap-2 px-3 py-1.5 rounded border text-sm text-left",
            "border-lgray/50 bg-white transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red focus:ring-red/30 focus:border-red",
            open && "border-navy ring-2 ring-navy/30",
          )}
        >
          {props.multiple ? (
            showPlaceholder ? (
              <span className="flex-1 truncate text-lgray">{placeholder}</span>
            ) : (
              <span className="flex items-center gap-1 flex-1 min-w-0">
                {selectedOpts.slice(0, MAX_FLAGS).map((opt) => (
                  <span key={opt.value} title={opt.label} className="shrink-0 text-base leading-none">
                    {opt.flag ?? opt.label.slice(0, 2)}
                  </span>
                ))}
                {selectedOpts.length > MAX_FLAGS && (
                  <span className="text-xs text-lgray shrink-0">+{selectedOpts.length - MAX_FLAGS}</span>
                )}
              </span>
            )
          ) : (
            <>
              {singleSelected?.flag && <span className="shrink-0">{singleSelected.flag}</span>}
              <span className={cn("flex-1 truncate", showPlaceholder && "text-lgray")}>
                {singleSelected?.label ?? placeholder}
              </span>
            </>
          )}
          <ChevronDown
            size={14}
            strokeWidth={1.5}
            className={cn("shrink-0 text-lgray transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div
            className={cn(
              "absolute left-0 right-0 z-50 bg-white border border-navy/20 rounded shadow-lg",
              above ? "bottom-full mb-1" : "top-full mt-1",
            )}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-lgray/20">
              <Search size={12} strokeWidth={1.5} className="shrink-0 text-lgray" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search…"
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
                <li className="px-3 py-2 text-sm text-lgray">No results</li>
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
                        <Check size={12} strokeWidth={2} className="ml-auto shrink-0 text-navy" />
                      )}
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red">{error}</span>}
    </div>
  )
}
