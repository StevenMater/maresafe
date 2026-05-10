import { useState, useEffect, type RefObject } from "react"

const CARD_WIDTH = 794
const CARD_HEIGHT = 1123

export function useCardScale(
  containerRef: RefObject<HTMLElement | null>,
): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      const availableWidth = element.clientWidth
      const portrait = window.innerHeight > window.innerWidth
      const computed = Math.min(
        availableWidth >= CARD_WIDTH ? 1 : availableWidth / CARD_WIDTH,
        (window.innerHeight * (portrait ? 0.5 : 0.8)) / CARD_HEIGHT,
      )
      setScale(computed)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [containerRef])

  return scale
}
