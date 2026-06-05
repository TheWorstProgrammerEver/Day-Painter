import type { ScheduleBlock } from '../types'
import { clampMinute } from '../utils/time'

type ScheduleRangeOptions = {
  blocks: ScheduleBlock[]
  chunkSize: number
  createId: () => string
  endMinute: number
  startMinute: number
}

type PaintScheduleRangeOptions = ScheduleRangeOptions & {
  taskId: string
}

const dragRange = ({ chunkSize, endMinute, startMinute }: ScheduleRangeOptions) => ({
  start: clampMinute(Math.min(startMinute, endMinute)),
  end: clampMinute(Math.max(startMinute, endMinute) + chunkSize)
})

const overlaps = (block: ScheduleBlock, start: number, end: number) =>
  block.endMinute > start && block.startMinute < end

const touches = (block: ScheduleBlock, start: number, end: number) =>
  block.endMinute === start || block.startMinute === end

const splitBlockAround = (block: ScheduleBlock, start: number, end: number, createId: () => string) => {
  const splitBlocks: ScheduleBlock[] = []

  if (block.startMinute < start) {
    splitBlocks.push({ ...block, id: createId(), endMinute: start })
  }

  if (block.endMinute > end) {
    splitBlocks.push({ ...block, id: createId(), startMinute: end })
  }

  return splitBlocks
}

export const deleteScheduleBlock = (blocks: ScheduleBlock[], blockId: string) =>
  blocks.filter((block) => block.id !== blockId)

export const clearScheduleRange = (options: ScheduleRangeOptions) => {
  const { blocks, createId } = options
  const { start, end } = dragRange(options)

  return blocks.flatMap((block) => (overlaps(block, start, end) ? splitBlockAround(block, start, end, createId) : [block]))
}

export const paintScheduleRange = (options: PaintScheduleRangeOptions) => {
  const { blocks, createId, taskId } = options
  const { start, end } = dragRange(options)
  let mergedStart = start
  let mergedEnd = end

  const preservedBlocks = blocks.flatMap((block) => {
    const isSameTask = block.taskId === taskId
    const overlapsRange = overlaps(block, start, end)

    if (isSameTask && (overlapsRange || touches(block, start, end))) {
      mergedStart = Math.min(mergedStart, block.startMinute)
      mergedEnd = Math.max(mergedEnd, block.endMinute)
      return []
    }

    return overlapsRange ? splitBlockAround(block, start, end, createId) : [block]
  })

  return [
    ...preservedBlocks,
    {
      id: createId(),
      taskId,
      startMinute: mergedStart,
      endMinute: mergedEnd
    }
  ]
}
