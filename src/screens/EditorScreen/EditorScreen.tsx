import styles from './EditorScreen.module.scss'
import { PlannerSidebar } from '../../components/PlannerSidebar/PlannerSidebar'
import { PlannerWorkspace } from '../../components/PlannerWorkspace/PlannerWorkspace'
import { useEditorScreenViewModel } from './useEditorScreenViewModel'

export const EditorScreen = () => {
  const planner = useEditorScreenViewModel()

  return (
    <main className={styles.shell}>
      <PlannerSidebar
        appName={window.config?.appName ?? 'Day Painter'}
        buildVersion={window.config?.buildVersion}
        environment={window.config?.environment ?? 'local'}
        planner={planner}
      />
      <PlannerWorkspace planner={planner} />
    </main>
  )
}
