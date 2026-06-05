import { createCommandType, createQueryType } from './dispatch'
import type { PlannerTemplate } from '../types'

export const LIST_PLANNER_TEMPLATES = 'planner_templates.list'
export const LOAD_PLANNER_TEMPLATE = 'planner_templates.load'
export const SAVE_PLANNER_TEMPLATE = 'planner_templates.save'
export const DELETE_PLANNER_TEMPLATE = 'planner_templates.delete'

export const ListPlannerTemplatesQuery = createQueryType(LIST_PLANNER_TEMPLATES)<PlannerTemplate[]>()

export const LoadPlannerTemplateQuery = createQueryType(LOAD_PLANNER_TEMPLATE)<
  PlannerTemplate | undefined,
  { name: string }
>()

export const SavePlannerTemplateCommand = createCommandType(SAVE_PLANNER_TEMPLATE)<
  PlannerTemplate,
  PlannerTemplate
>()

export const DeletePlannerTemplateCommand = createCommandType(DELETE_PLANNER_TEMPLATE)<void, { name: string }>()
