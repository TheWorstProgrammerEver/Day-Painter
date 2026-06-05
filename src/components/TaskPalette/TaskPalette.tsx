import styles from './TaskPalette.module.scss'
import { formatAllocatedMinutes } from '../../domain/taskAllocationSummary'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'

type TaskPaletteProps = {
  planner: EditorScreenViewModel
}

type PaletteOptionProps = {
  allocationSummary?: string
  colour?: string
  description?: string
  onSelect: () => void
  selected: boolean
  title: string
  variant?: 'clear' | 'task'
}

const PaletteOption = ({
  allocationSummary,
  colour,
  description,
  onSelect,
  selected,
  title,
  variant = 'task'
}: PaletteOptionProps) => (
  <label className={selected ? styles.selectedTask : styles.task}>
    <input
      checked={selected}
      className={styles.radio}
      name="paint-tool"
      onChange={() => undefined}
      onClick={onSelect}
      type="radio"
    />
    <span
      className={variant === 'clear' ? styles.clearSwatch : styles.swatch}
      style={colour ? { backgroundColor: colour } : undefined}
      aria-hidden="true"
    />
    <span>
      <span className={styles.taskHeader}>
        <strong>{title}</strong>
        {allocationSummary ? <small>{allocationSummary}</small> : null}
      </span>
      {description ? <small>{description}</small> : null}
    </span>
  </label>
)

export const TaskPalette = ({
  planner
}: TaskPaletteProps) => (
  <div>
    {planner.tasks.length === 0 ? <p className={styles.emptyState}>No tasks defined.</p> : null}

    {planner.tasks.length > 0 ? (
      <ul className={styles.taskList}>
        <li>
          <PaletteOption
            description="Erase painted chunks"
            onSelect={planner.selectClearTool}
            selected={planner.isClearSelected}
            title="Clear task"
            variant="clear"
          />
        </li>

        {planner.tasks.map((task) => (
          <li key={task.id}>
            <PaletteOption
              allocationSummary={formatAllocatedMinutes(planner.taskAllocationMinutes.get(task.id) ?? 0)}
              colour={task.colour}
              description={task.description}
              onSelect={() => planner.selectTask(task.id)}
              selected={task.id === planner.selectedTaskId}
              title={task.title}
            />
          </li>
        ))}
      </ul>
    ) : null}
  </div>
)
