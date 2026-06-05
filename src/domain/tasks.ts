import { createId } from '../utils/createId'
import type { ScheduleBlock, Task, TaskDraft } from '../types'

export const TASK_COLOURS = [
  '#5e81ac',
  '#a3be8c',
  '#d08770',
  '#b48ead',
  '#ebcb8b',
  '#88c0d0',
  '#bf616a',
  '#8fbcbb',
  '#c0a36e',
  '#81a1c1'
] as const

const normalizeTaskDraft = ({ colour, description, title }: TaskDraft) => ({
  title,
  description: description.trim() || undefined,
  colour
})

export const getTaskColour = (taskIndex: number) => TASK_COLOURS[taskIndex % TASK_COLOURS.length]

export const createTask = (draft: TaskDraft) => ({
  id: createId(),
  ...normalizeTaskDraft(draft)
})

export const updateTask = (tasks: Task[], taskId: string, draft: TaskDraft) =>
  tasks.map((task) => (task.id === taskId ? { ...task, ...normalizeTaskDraft(draft) } : task))

export const deleteTask = (tasks: Task[], blocks: ScheduleBlock[], taskId: string) => ({
  tasks: tasks.filter((task) => task.id !== taskId),
  blocks: blocks.filter((block) => block.taskId !== taskId)
})
