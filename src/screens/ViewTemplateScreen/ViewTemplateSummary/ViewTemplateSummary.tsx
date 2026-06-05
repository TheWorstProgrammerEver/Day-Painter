import { formatMinutes } from '../../../utils/time'
import styles from './ViewTemplateSummary.module.scss'
import type { ScheduleBlockWithTask } from '../../../types'

type ViewTemplateSummaryProps = {
  current?: ScheduleBlockWithTask
  next?: ScheduleBlockWithTask
}

const currentText = (current?: ScheduleBlockWithTask) =>
  current ? `${current.task.title} until ${formatMinutes(current.block.endMinute)}` : 'Unallocated'

const nextText = (next?: ScheduleBlockWithTask) =>
  next ? `${next.task.title} at ${formatMinutes(next.block.startMinute)}` : 'Nothing scheduled'

export const ViewTemplateSummary = ({ current, next }: ViewTemplateSummaryProps) => (
  <section className={styles.summary} aria-label="Schedule summary">
    <p>
      <span>Now:</span>
      {currentText(current)}
    </p>
    <p>
      <span>Next:</span>
      {nextText(next)}
    </p>
  </section>
)
