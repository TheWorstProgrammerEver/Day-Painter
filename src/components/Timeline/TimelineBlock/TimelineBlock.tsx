import styles from '../Timeline.module.scss'
import { blockStyle } from '../timelineLayout'
import { formatMinutes } from '../../../utils/time'
import type { MouseEvent, SyntheticEvent } from 'react'
import type { ScheduleBlockWithTask } from '../../../types'

type TimelineBlockProps = ScheduleBlockWithTask & {
  onDelete?: () => void
  onOpenMenu?: (event: MouseEvent<HTMLElement>, blockId: string) => void
}

const stopDeleteEvent = (event: SyntheticEvent<HTMLButtonElement>) => event.stopPropagation()

export const TimelineBlock = ({ block, onDelete, onOpenMenu, task }: TimelineBlockProps) => (
  <article
    className={styles.block}
    onContextMenu={onOpenMenu ? (event) => onOpenMenu(event, block.id) : undefined}
    style={blockStyle(block, task.colour)}
  >
    <strong>{task.title}</strong>
    <span>
      {formatMinutes(block.startMinute)} - {formatMinutes(block.endMinute)}
    </span>
    {onDelete ? (
      <button
        className={styles.blockAction}
        onClick={(event) => {
          stopDeleteEvent(event)
          onDelete()
        }}
        onPointerDown={stopDeleteEvent}
        type="button"
      >
        Delete
        <span>
          {' '}
          {task.title} allocation from {formatMinutes(block.startMinute)} to {formatMinutes(block.endMinute)}
        </span>
      </button>
    ) : null}
  </article>
)
