import { useCallback, useMemo, useState } from 'react'
import { getTimelineChunks } from '../../domain/planner'
import { getTaskAllocationMinutes } from '../../domain/taskAllocationSummary'
import type { TimeChunkSize } from '../../domain/planner'
import { useCurrentMinute } from '../../hooks/useCurrentMinute'
import { useScheduleState } from '../../state/useScheduleState'
import { useTemplateState } from '../../state/useTemplateState'
import { useTaskState } from '../../state/useTaskState'

export const useEditorScreenViewModel = () => {
  const [chunkSize, setChunkSize] = useState<TimeChunkSize>(30)
  const currentMinute = useCurrentMinute()
  const taskState = useTaskState()
  const { removeTask: removeTaskFromList, tasksById, ...taskView } = taskState
  const chunks = useMemo(() => getTimelineChunks(chunkSize), [chunkSize])
  const scheduleState = useScheduleState({
    chunkSize,
    isClearSelected: taskState.isClearSelected,
    selectedTask: taskState.selectedTask,
    tasksById
  })
  const { removeTaskAllocations, replaceScheduleBlocks, scheduleBlocks, ...scheduleView } = scheduleState
  const taskAllocationMinutes = useMemo(() => getTaskAllocationMinutes(scheduleBlocks), [scheduleBlocks])
  const templateState = useTemplateState({
    replaceScheduleBlocks,
    replaceTasks: taskState.replaceTasks,
    scheduleBlocks,
    tasks: taskState.tasks
  })

  const removeTask = useCallback(
    (taskId: string) => {
      removeTaskFromList(taskId)
      removeTaskAllocations(taskId)
    },
    [removeTaskAllocations, removeTaskFromList]
  )

  return {
    ...taskView,
    ...scheduleView,
    ...templateState,
    chunks,
    chunkSize,
    currentMinute,
    removeTask,
    setChunkSize,
    taskAllocationMinutes
  }
}

export type EditorScreenViewModel = ReturnType<typeof useEditorScreenViewModel>
