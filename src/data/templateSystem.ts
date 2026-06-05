import {
  DELETE_PLANNER_TEMPLATE,
  LIST_PLANNER_TEMPLATES,
  LOAD_PLANNER_TEMPLATE,
  SAVE_PLANNER_TEMPLATE
} from './templateRequests'
import type { RequestHandler, RequestHandlers } from './dispatch'
import type { PlannerTemplate } from '../types'

const STORAGE_KEY = 'day-painter.templates'

const readTemplates = (storage: Storage) => {
  const value = storage.getItem(STORAGE_KEY)

  if (!value) {
    return []
  }

  try {
    return JSON.parse(value) as PlannerTemplate[]
  } catch {
    return []
  }
}

const writeTemplates = (storage: Storage, templates: PlannerTemplate[]) =>
  storage.setItem(STORAGE_KEY, JSON.stringify(templates))

type TemplateOperation<TParams = unknown> = (
  context: {
    storage: Storage
    templates: PlannerTemplate[]
  },
  params: TParams
) => unknown

const operations = {
  [LIST_PLANNER_TEMPLATES]: ({ templates }) => templates,

  [LOAD_PLANNER_TEMPLATE]: ({ templates }, params) =>
    templates.find((template) => template.name === (params as { name: string }).name),

  [SAVE_PLANNER_TEMPLATE]: ({ storage, templates }, params) => {
    const template = params as PlannerTemplate
    const nextTemplates = [
      ...templates.filter((currentTemplate) => currentTemplate.name !== template.name),
      template
    ].sort((left, right) => left.name.localeCompare(right.name))

    writeTemplates(storage, nextTemplates)
    return template
  },

  [DELETE_PLANNER_TEMPLATE]: ({ storage, templates }, params) => {
    const name = (params as { name: string }).name

    writeTemplates(storage, templates.filter((template) => template.name !== name))
  }
} satisfies Record<string, TemplateOperation>

const createTemplateHandler = (storage: Storage, operation: TemplateOperation): RequestHandler =>
  (request) => operation({ storage, templates: readTemplates(storage) }, request.params)

export const createTemplateSystem = (storage: Storage): RequestHandlers =>
  Object.fromEntries(
    Object.entries(operations).map(([rpc, operation]) => [rpc, createTemplateHandler(storage, operation)])
  )
