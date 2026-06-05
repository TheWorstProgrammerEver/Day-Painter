import { describe, expect, it } from 'vitest'
import { createDispatcher } from '../../../src/data/dispatch'
import { createInMemoryStorage } from '../../../src/data/inMemoryStorage'
import { createTemplateSystem } from '../../../src/data/templateSystem'
import {
  DeletePlannerTemplateCommand,
  ListPlannerTemplatesQuery,
  LoadPlannerTemplateQuery,
  SavePlannerTemplateCommand
} from '../../../src/data/templateRequests'
import type { PlannerTemplate } from '../../../src/types'

const template = (name: string, title: string): PlannerTemplate => ({
  name,
  scheduleBlocks: [{ id: `${name}-block`, taskId: `${name}-task`, startMinute: 540, endMinute: 600 }],
  tasks: [{ id: `${name}-task`, title, colour: '#111111' }]
})

describe('createTemplateSystem', () => {
  it('saves, lists, loads, and overwrites planner templates by name', async () => {
    const { dispatch } = createDispatcher(createTemplateSystem(createInMemoryStorage()))

    await dispatch(new SavePlannerTemplateCommand(template('Morning', 'Deep work')))
    await dispatch(new SavePlannerTemplateCommand(template('Admin', 'Admin')))
    await dispatch(new SavePlannerTemplateCommand(template('Morning', 'Writing')))

    const templates = await dispatch(new ListPlannerTemplatesQuery())
    const loadedTemplate = await dispatch(new LoadPlannerTemplateQuery({ name: 'Morning' }))

    expect(templates.map((savedTemplate) => savedTemplate.name)).toEqual(['Admin', 'Morning'])
    expect(loadedTemplate?.tasks).toEqual([{ id: 'Morning-task', title: 'Writing', colour: '#111111' }])
  })

  it('deletes planner templates by name', async () => {
    const { dispatch } = createDispatcher(createTemplateSystem(createInMemoryStorage()))

    await dispatch(new SavePlannerTemplateCommand(template('Morning', 'Deep work')))
    await dispatch(new SavePlannerTemplateCommand(template('Admin', 'Admin')))
    await dispatch(new DeletePlannerTemplateCommand({ name: 'Morning' }))

    const templates = await dispatch(new ListPlannerTemplatesQuery())
    const deletedTemplate = await dispatch(new LoadPlannerTemplateQuery({ name: 'Morning' }))

    expect(templates.map((savedTemplate) => savedTemplate.name)).toEqual(['Admin'])
    expect(deletedTemplate).toBeUndefined()
  })
})
