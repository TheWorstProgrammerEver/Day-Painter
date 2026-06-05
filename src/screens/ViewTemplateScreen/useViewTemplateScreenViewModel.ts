import { useEffect, useMemo, useState } from 'react'
import { useAppDispatcher } from '../../components/AppDispatcherProvider/AppDispatcherProvider'
import { getChunkSizeFromAllocations, getTimelineChunks } from '../../domain/planner'
import { LoadPlannerTemplateQuery } from '../../data/templateRequests'
import { useCurrentMinute } from '../../hooks/useCurrentMinute'
import type { PlannerTemplate, ScheduleBlockWithTask } from '../../types'
import type { TimelinePlanner } from '../../components/Timeline/Timeline'

const noop = () => {}

const blocksWithTasksFromTemplate = (template: PlannerTemplate): ScheduleBlockWithTask[] => {
  const tasksById = new Map(template.tasks.map((task) => [task.id, task]))

  return template.scheduleBlocks.flatMap((block) => {
    const task = tasksById.get(block.taskId)
    return task ? [{ block, task }] : []
  })
}

export const useViewTemplateScreenViewModel = (templateName?: string) => {
  const currentMinute = useCurrentMinute()
  const dispatcher = useAppDispatcher()
  const [isLoading, setIsLoading] = useState(true)
  const [template, setTemplate] = useState<PlannerTemplate>()

  useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true)
      setTemplate(
        templateName ? await dispatcher.dispatch(new LoadPlannerTemplateQuery({ name: templateName })) : undefined
      )
      setIsLoading(false)
    }

    void loadTemplate()
  }, [dispatcher, templateName])

  const planner = useMemo<TimelinePlanner | undefined>(
    () => {
      if (!template) {
        return undefined
      }

      const chunkSize = getChunkSizeFromAllocations(template.scheduleBlocks)

      return {
        blocksWithTasks: blocksWithTasksFromTemplate(template),
        chunkSize,
        chunks: getTimelineChunks(chunkSize),
        currentMinute,
        deleteAllocation: noop,
        isClearSelected: false,
        paintRange: noop,
        selectedTask: undefined
      }
    },
    [currentMinute, template]
  )

  return { isLoading, planner }
}
