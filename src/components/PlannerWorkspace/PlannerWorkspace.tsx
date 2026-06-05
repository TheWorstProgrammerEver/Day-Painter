import { Timeline } from '../Timeline/Timeline'
import styles from './PlannerWorkspace.module.scss'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'

type PlannerWorkspaceProps = {
  planner: EditorScreenViewModel
}

export const PlannerWorkspace = ({ planner }: PlannerWorkspaceProps) => (
  <section className={styles.section} aria-labelledby="timeline-heading">
    <header className={styles.header}>
      <div>
        <h2 id="timeline-heading">Timeline</h2>
        <p>Select a task and drag over the day.</p>
      </div>

      {planner.isClearSelected ? (
        <p className={styles.activeTask}>
          <strong>Clearing painted time</strong>
        </p>
      ) : null}

      {planner.selectedTask ? (
        <p className={styles.activeTask}>
          <span>
            Painting <strong>{planner.selectedTask.title}</strong>
          </span>
        </p>
      ) : null}
    </header>

    <Timeline planner={planner} />
  </section>
)
