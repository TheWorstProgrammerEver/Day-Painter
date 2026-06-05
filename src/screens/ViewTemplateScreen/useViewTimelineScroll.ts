import { useCallback, useEffect, useRef } from 'react'
import { MINUTES_IN_DAY } from '../../utils/time'

const getCurrentMinuteTop = (timeline: Element, currentMinute: number) =>
  (currentMinute / MINUTES_IN_DAY) * timeline.scrollHeight

const clampScrollTop = (scrollTop: number, container: HTMLElement) =>
  Math.max(0, Math.min(container.scrollHeight - container.clientHeight, scrollTop))

export const useViewTimelineScroll = (currentMinute: number, isReady: boolean, scrollKey: string) => {
  const currentMinuteRef = useRef(currentMinute)
  const timelineWrapRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    currentMinuteRef.current = currentMinute
  }, [currentMinute])

  const scrollToCurrentTime = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = timelineWrapRef.current
    const timeline = container?.querySelector('figure')

    if (!container || !timeline) {
      return
    }

    const centeredScrollTop = getCurrentMinuteTop(timeline, currentMinuteRef.current) - container.clientHeight / 2

    container.scrollTo({
      behavior,
      top: clampScrollTop(centeredScrollTop, container)
    })
  }, [])

  useEffect(() => {
    if (!isReady) {
      return undefined
    }

    const frame = window.requestAnimationFrame(() => scrollToCurrentTime('auto'))

    return () => window.cancelAnimationFrame(frame)
  }, [isReady, scrollKey, scrollToCurrentTime])

  return { scrollToCurrentTime, timelineWrapRef }
}
