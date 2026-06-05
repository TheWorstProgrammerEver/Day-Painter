export type Task = {
  id: string
  title: string
  description?: string
  colour: string
}

export type TaskDraft = {
  colour: string
  description: string
  title: string
}

export type ScheduleBlock = {
  id: string
  taskId: string
  startMinute: number
  endMinute: number
}

export type ScheduleBlockWithTask = {
  block: ScheduleBlock
  task: Task
}

export type PlannerTemplate = {
  name: string
  scheduleBlocks: ScheduleBlock[]
  tasks: Task[]
}
