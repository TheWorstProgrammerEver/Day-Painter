import { MINUTES_IN_DAY } from '../../utils/time'
import type { CSSProperties } from 'react'
import type { ScheduleBlock } from '../../types'

const MIN_CHUNK_REM = 2.5
const percentOfDay = (minutes: number) => `${(minutes / MINUTES_IN_DAY) * 100}%`

export const blockStyle = (block: ScheduleBlock, colour: string) => ({
  top: percentOfDay(block.startMinute),
  height: percentOfDay(block.endMinute - block.startMinute),
  backgroundColor: colour
})

export const chunkStyle = (chunkSize: number) => ({
  height: percentOfDay(chunkSize)
})

export const timelineStyle = (chunkSize: number) =>
  ({
    '--timeline-min-chunk-height': `${MIN_CHUNK_REM}rem`,
    '--timeline-min-height': `${(MINUTES_IN_DAY / chunkSize) * MIN_CHUNK_REM}rem`
  }) as CSSProperties

export const nowStyle = (currentMinute: number) => ({
  top: percentOfDay(currentMinute)
})
