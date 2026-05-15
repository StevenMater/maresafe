import { useState, useEffect, type RefObject } from "react"

export const CARD_WIDTH = 794
export const CARD_HEIGHT = 1123

export function useCardScale(
  containerRef: RefObject<HTMLElement | null>,
): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      const availableWidth = element.clientWidth
      const scaleFromWidth = availableWidth >= CARD_WIDTH ? 1 : availableWidth / CARD_WIDTH
      const scaleFromHeight = (window.innerHeight * 0.9) / CARD_HEIGHT
      setScale(Math.min(scaleFromWidth, scaleFromHeight, 1))
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [containerRef])

  return scale
}
