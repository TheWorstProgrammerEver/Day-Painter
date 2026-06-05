import { MINUTES_IN_DAY } from '../utils/time'
import type { ScheduleBlock } from '../types'

export const CHUNK_OPTIONS = [15, 30, 60] as const

export type TimeChunkSize = (typeof CHUNK_OPTIONS)[number]

export type TimelineChunk = {
  start: number
  end: number
}

export const getTimelineChunks = (chunkSize: number) =>
  Array.from({ length: MINUTES_IN_DAY / chunkSize }, (_, index) => ({
    start: index * chunkSize,
    end: (index + 1) * chunkSize
  }))

const allocationDuration = (block: ScheduleBlock) => block.endMinute - block.startMinute

const canChunkAllocations = (blocks: ScheduleBlock[], chunkSize: TimeChunkSize) =>
  blocks.every((block) => allocationDuration(block) % chunkSize === 0)

export const getChunkSizeFromAllocations = (blocks: ScheduleBlock[]): TimeChunkSize => {
  if (blocks.length === 0) {
    return 30
  }

  return [...CHUNK_OPTIONS]
    .sort((left, right) => right - left)
    .find((chunkSize) => canChunkAllocations(blocks, chunkSize)) ?? 15
}
