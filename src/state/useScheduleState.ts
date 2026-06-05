import { useCallback, useMemo, useState } from 'react'
import { clearScheduleRange, deleteScheduleBlock, paintScheduleRange } from '../domain/planner'
import { createId } from '../utils/createId'
import type { TimeChunkSize } from '../domain/planner'
import type { ScheduleBlock, Task } from '../types'

type UseScheduleStateOptions = {
  chunkSize: TimeChunkSize
  isClearSelected: boolean
  selectedTask?: Task
  tasksById: Map<string, Task>
}

export const useScheduleState = ({
  chunkSize,
  isClearSelected,
  selectedTask,
  tasksById
}: UseScheduleStateOptions) => {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([])

  const blocksWithTasks = useMemo(
    () =>
      scheduleBlocks.flatMap((block) => {
        const task = tasksById.get(block.taskId)
        return task ? [{ block, task }] : []
      }),
    [scheduleBlocks, tasksById]
  )

  const paintRange = useCallback(
    (startMinute: number, endMinute: number) => {
      if (isClearSelected) {
        setScheduleBlocks((blocks) => clearScheduleRange({ blocks, chunkSize, createId, endMinute, startMinute }))
        return
      }

      if (selectedTask) {
        setScheduleBlocks((blocks) =>
          paintScheduleRange({ blocks, chunkSize, createId, endMinute, startMinute, taskId: selectedTask.id })
        )
      }
    },
    [chunkSize, isClearSelected, selectedTask]
  )

  const deleteAllocation = useCallback(
    (blockId: string) => setScheduleBlocks((blocks) => deleteScheduleBlock(blocks, blockId)),
    []
  )

  const removeTaskAllocations = useCallback(
    (taskId: string) => setScheduleBlocks((blocks) => blocks.filter((block) => block.taskId !== taskId)),
    []
  )

  const replaceScheduleBlocks = useCallback((nextBlocks: ScheduleBlock[]) => setScheduleBlocks(nextBlocks), [])

  return {
    blocksWithTasks,
    deleteAllocation,
    paintRange,
    replaceScheduleBlocks,
    scheduleBlocks,
    removeTaskAllocations
  }
}
