import styles from './PlannerControls.module.scss'
import { CHUNK_OPTIONS } from '../../domain/planner'
import type { TimeChunkSize } from '../../domain/planner'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'

type PlannerControlsProps = {
  planner: EditorScreenViewModel
}

export const PlannerControls = ({ planner }: PlannerControlsProps) => (
  <fieldset className={styles.controls}>
    <legend className={styles.legend}>Planner controls</legend>

    <label className={styles.field}>
      Time chunks
      <select
        value={planner.chunkSize}
        onChange={(event) => planner.setChunkSize(Number(event.target.value) as TimeChunkSize)}
      >
        {CHUNK_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option === 60 ? '1 hour' : `${option} minutes`}
          </option>
        ))}
      </select>
    </label>
  </fieldset>
)
