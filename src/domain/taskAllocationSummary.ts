import type { ScheduleBlock } from '../types'

export const getTaskAllocationMinutes = (scheduleBlocks: ScheduleBlock[]) =>
  scheduleBlocks.reduce((minutesByTaskId, block) => {
    const minutes = block.endMinute - block.startMinute
    const currentMinutes = minutesByTaskId.get(block.taskId) ?? 0

    minutesByTaskId.set(block.taskId, currentMinutes + minutes)
    return minutesByTaskId
  }, new Map<string, number>())

export const formatAllocatedMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const parts = [
    hours > 0 ? `${hours}h` : '',
    remainingMinutes > 0 ? `${remainingMinutes}m` : ''
  ].filter(Boolean)

  return parts.join(' ') || '0m'
}
