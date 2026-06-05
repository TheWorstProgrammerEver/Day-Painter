import { useEffect, useState } from 'react'
import styles from './TaskForm.module.scss'
import type { FormEvent } from 'react'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'
import type { TaskDraft } from '../../types'

type TaskFormProps = {
  planner: EditorScreenViewModel
}

export const TaskForm = ({ planner }: TaskFormProps) => {
  const [draftTask, setDraftTask] = useState<TaskDraft>({
    colour: planner.nextTaskColour,
    description: '',
    title: ''
  })

  useEffect(() => {
    setDraftTask(
      planner.selectedTask
        ? {
            colour: planner.selectedTask.colour,
            description: planner.selectedTask.description ?? '',
            title: planner.selectedTask.title
          }
        : {
            colour: planner.nextTaskColour,
            description: '',
            title: ''
          }
    )
  }, [planner.nextTaskColour, planner.selectedTask])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = draftTask.title.trim()
    if (!title) {
      return
    }

    const taskDraft = { ...draftTask, title }

    if (planner.selectedTask) {
      planner.saveTask(planner.selectedTask.id, taskDraft)
      return
    }

    planner.addTask(taskDraft)
  }

  const handleDelete = () => {
    if (planner.selectedTask) {
      planner.removeTask(planner.selectedTask.id)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Colour
        <input
          className={styles.colour}
          type="color"
          value={draftTask.colour}
          onChange={(event) => setDraftTask({ ...draftTask, colour: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        Title
        <input
          className={styles.control}
          value={draftTask.title}
          onChange={(event) => setDraftTask({ ...draftTask, title: event.target.value })}
          placeholder="Walk, write, workout..."
          required
        />
      </label>
      <label className={styles.field}>
        Description
        <textarea
          className={styles.control}
          value={draftTask.description}
          onChange={(event) => setDraftTask({ ...draftTask, description: event.target.value })}
          placeholder="Optional context"
          rows={3}
        />
      </label>
      <div className={styles.actions}>
        <button type="submit">{planner.selectedTask ? 'Save changes' : 'Add task'}</button>
        {planner.selectedTask ? <button onClick={handleDelete} type="button">Delete</button> : null}
      </div>
    </form>
  )
}
