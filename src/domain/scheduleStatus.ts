import type { ScheduleBlockWithTask } from '../types'

const byStartTime = (left: ScheduleBlockWithTask, right: ScheduleBlockWithTask) =>
  left.block.startMinute - right.block.startMinute || left.block.endMinute - right.block.endMinute

const isCurrentBlock = ({ block }: ScheduleBlockWithTask, currentMinute: number) =>
  block.startMinute <= currentMinute && currentMinute < block.endMinute

const isNextBlock = ({ block }: ScheduleBlockWithTask, currentMinute: number) =>
  block.startMinute > currentMinute

export const getScheduleStatus = (blocks: ScheduleBlockWithTask[], currentMinute: number) => {
  const blocksByStartTime = [...blocks].sort(byStartTime)

  return {
    current: blocksByStartTime.find((block) => isCurrentBlock(block, currentMinute)),
    next: blocksByStartTime.find((block) => isNextBlock(block, currentMinute))
  }
}
