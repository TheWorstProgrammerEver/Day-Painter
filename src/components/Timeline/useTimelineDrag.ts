import { useCallback, useRef } from 'react'
import { MINUTES_IN_DAY } from '../../utils/time'
import type { PointerEvent, RefObject } from 'react'

type UseTimelineDragOptions = {
  canPaint: boolean
  chunkSize: number
  onPaintRange: (startMinute: number, endMinute: number) => void
  readOnly?: boolean
  timelineRef: RefObject<HTMLElement | null>
}

export const useTimelineDrag = ({
  canPaint,
  chunkSize,
  onPaintRange,
  readOnly = false,
  timelineRef
}: UseTimelineDragOptions) => {
  const dragStartMinute = useRef<number | null>(null)

  const minuteFromPointer = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const timeline = timelineRef.current

      if (!timeline) {
        return 0
      }

      const { top, height } = timeline.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (event.clientY - top) / height))
      const minute = Math.floor((ratio * MINUTES_IN_DAY) / chunkSize) * chunkSize

      return Math.min(MINUTES_IN_DAY - chunkSize, minute)
    },
    [chunkSize, timelineRef]
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0 || readOnly || !canPaint) {
        return
      }

      event.currentTarget.setPointerCapture(event.pointerId)

      const minute = minuteFromPointer(event)
      dragStartMinute.current = minute
      onPaintRange(minute, minute)
    },
    [canPaint, minuteFromPointer, onPaintRange, readOnly]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (dragStartMinute.current === null || readOnly) {
        return
      }

      onPaintRange(dragStartMinute.current, minuteFromPointer(event))
    },
    [minuteFromPointer, onPaintRange, readOnly]
  )

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (dragStartMinute.current !== null) {
        onPaintRange(dragStartMinute.current, minuteFromPointer(event))
      }

      dragStartMinute.current = null
    },
    [minuteFromPointer, onPaintRange]
  )

  return { handlePointerDown, handlePointerMove, handlePointerUp }
}
