import { describe, expect, it } from 'vitest'
import { deleteTask, getTaskColour, TASK_COLOURS, updateTask } from '../../../src/domain/tasks'

describe('TASK_COLOURS', () => {
  it('provides at least 10 distinct default task colours', () => {
    expect(TASK_COLOURS.length).toBeGreaterThanOrEqual(10)
    expect(new Set(TASK_COLOURS).size).toBe(TASK_COLOURS.length)
  })

  it('cycles task colours after the palette is exhausted', () => {
    expect(getTaskColour(TASK_COLOURS.length)).toBe(TASK_COLOURS[0])
  })
})

describe('updateTask', () => {
  it('updates task details and colour without changing its id', () => {
    const tasks = [
      { id: 'deep-work', title: 'Deep work', description: 'Focus', colour: '#111111' },
      { id: 'admin', title: 'Admin', colour: '#222222' }
    ]

    expect(updateTask(tasks, 'deep-work', { title: 'Writing', description: '', colour: '#333333' })).toEqual([
      { id: 'deep-work', title: 'Writing', colour: '#333333' },
      { id: 'admin', title: 'Admin', colour: '#222222' }
    ])
  })
})

describe('deleteTask', () => {
  it('removes the task and only its allocations', () => {
    const tasks = [
      { id: 'deep-work', title: 'Deep work', colour: '#111111' },
      { id: 'admin', title: 'Admin', colour: '#222222' }
    ]
    const blocks = [
      { id: 'block-a', taskId: 'deep-work', startMinute: 540, endMinute: 600 },
      { id: 'block-b', taskId: 'admin', startMinute: 600, endMinute: 660 }
    ]

    expect(deleteTask(tasks, blocks, 'deep-work')).toEqual({
      tasks: [{ id: 'admin', title: 'Admin', colour: '#222222' }],
      blocks: [{ id: 'block-b', taskId: 'admin', startMinute: 600, endMinute: 660 }]
    })
  })
})
