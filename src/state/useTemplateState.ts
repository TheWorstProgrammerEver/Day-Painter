import { useCallback, useEffect, useState } from 'react'
import { useAppDispatcher } from '../components/AppDispatcherProvider/AppDispatcherProvider'
import {
  DeletePlannerTemplateCommand,
  ListPlannerTemplatesQuery,
  LoadPlannerTemplateQuery,
  SavePlannerTemplateCommand
} from '../data/templateRequests'
import type { PlannerTemplate, ScheduleBlock, Task } from '../types'

type UseTemplateStateOptions = {
  replaceScheduleBlocks: (blocks: ScheduleBlock[]) => void
  replaceTasks: (tasks: Task[]) => void
  scheduleBlocks: ScheduleBlock[]
  tasks: Task[]
}

const cloneTemplate = (template: PlannerTemplate) => JSON.parse(JSON.stringify(template)) as PlannerTemplate

export const useTemplateState = ({
  replaceScheduleBlocks,
  replaceTasks,
  scheduleBlocks,
  tasks
}: UseTemplateStateOptions) => {
  const dispatcher = useAppDispatcher()
  const [templates, setTemplates] = useState<PlannerTemplate[]>([])

  const refreshTemplates = useCallback(async () => {
    setTemplates(await dispatcher.dispatch(new ListPlannerTemplatesQuery()))
  }, [dispatcher])

  useEffect(() => {
    void refreshTemplates()
  }, [refreshTemplates])

  const saveTemplate = useCallback(
    async (name: string) => {
      await dispatcher.dispatch(
        new SavePlannerTemplateCommand(cloneTemplate({ name, scheduleBlocks, tasks }))
      )
      await refreshTemplates()
    },
    [dispatcher, refreshTemplates, scheduleBlocks, tasks]
  )

  const loadTemplate = useCallback(
    async (name: string) => {
      const template = await dispatcher.dispatch(new LoadPlannerTemplateQuery({ name }))

      if (template) {
        replaceTasks(template.tasks)
        replaceScheduleBlocks(template.scheduleBlocks)
      }
    },
    [dispatcher, replaceScheduleBlocks, replaceTasks]
  )

  const deleteTemplate = useCallback(
    async (name: string) => {
      await dispatcher.dispatch(new DeletePlannerTemplateCommand({ name }))
      await refreshTemplates()
    },
    [dispatcher, refreshTemplates]
  )

  return {
    deleteTemplate,
    loadTemplate,
    saveTemplate,
    templates
  }
}
