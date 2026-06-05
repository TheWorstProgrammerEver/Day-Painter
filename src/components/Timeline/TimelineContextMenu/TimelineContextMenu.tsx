import styles from './TimelineContextMenu.module.scss'
import type { SyntheticEvent } from 'react'
import type { TimelineContextMenuState } from '../useTimelineContextMenu'

type TimelineContextMenuProps = {
  contextMenu: TimelineContextMenuState
  onDeleteBlock: () => void
}

const stopMenuEvent = (event: SyntheticEvent) => event.stopPropagation()

export const TimelineContextMenu = ({ contextMenu, onDeleteBlock }: TimelineContextMenuProps) => (
  <div
    className={styles.contextMenu}
    onClick={stopMenuEvent}
    onContextMenu={stopMenuEvent}
    onPointerDown={stopMenuEvent}
    style={{ left: contextMenu.x, top: contextMenu.y }}
  >
    <button autoFocus onClick={onDeleteBlock} type="button">
      Delete
    </button>
  </div>
)
