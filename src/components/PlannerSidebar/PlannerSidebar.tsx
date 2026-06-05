import { PlannerControls } from '../PlannerControls/PlannerControls'
import styles from './PlannerSidebar.module.scss'
import { TaskForm } from '../TaskForm/TaskForm'
import { TaskPalette } from '../TaskPalette/TaskPalette'
import { TemplateList } from '../TemplateList/TemplateList'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'

type PlannerSidebarProps = {
  appName: string
  buildVersion?: string
  environment: string
  planner: EditorScreenViewModel
}

export const PlannerSidebar = ({ appName, buildVersion, environment, planner }: PlannerSidebarProps) => (
  <section className={styles.panel} aria-labelledby="tasks-heading">
    <div className={styles.sidebarContent}>
      <header className={styles.brand}>
        <h1>{appName}</h1>
      </header>

      <PlannerControls planner={planner} />

      <TemplateList planner={planner} />

      <h2 id="tasks-heading">Tasks</h2>
      <TaskPalette planner={planner} />

      <TaskForm planner={planner} />
    </div>

    <footer className={styles.sidebarMeta}>
      <span>{environment}</span>
      {buildVersion ? <span>Build {buildVersion}</span> : null}
    </footer>
  </section>
)
