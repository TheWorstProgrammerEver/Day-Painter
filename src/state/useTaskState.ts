import { useCallback, useMemo, useState } from 'react'
import { createTask, getTaskColour, updateTask } from '../domain/planner'
import type { Task, TaskDraft } from '../types'

export const CLEAR_TOOL_ID = 'clear-task'

export const useTaskState = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string>()

  const tasksById = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks])
  const selectedTask = selectedTaskId && selectedTaskId !== CLEAR_TOOL_ID ? tasksById.get(selectedTaskId) : undefined
  const isClearSelected = selectedTaskId === CLEAR_TOOL_ID
  const nextTaskColour = getTaskColour(tasks.length)

  const addTask = useCallback((draft: TaskDraft) => {
    const task = createTask(draft)

    setTasks((currentTasks) => [...currentTasks, task])
    setSelectedTaskId(task.id)
  }, [])

  const selectTask = useCallback((taskId: string) => setSelectedTaskId(taskId), [])

  const selectClearTool = useCallback(() => setSelectedTaskId(CLEAR_TOOL_ID), [])

  const saveTask = useCallback(
    (taskId: string, draft: TaskDraft) => setTasks((currentTasks) => updateTask(currentTasks, taskId, draft)),
    []
  )

  const removeTask = useCallback((taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    setSelectedTaskId((currentTaskId) => (currentTaskId === taskId ? undefined : currentTaskId))
  }, [])

  const replaceTasks = useCallback((nextTasks: Task[]) => {
    setTasks(nextTasks)
    setSelectedTaskId(undefined)
  }, [])

  return {
    addTask,
    isClearSelected,
    nextTaskColour,
    removeTask,
    replaceTasks,
    saveTask,
    selectClearTool,
    selectTask,
    selectedTask,
    selectedTaskId,
    tasks,
    tasksById
  }
}
