import styles from './TemplateList.module.scss'
import type { SyntheticEvent } from 'react'

export type TemplateMenu = {
  name: string
  x: number
  y: number
}

type TemplateContextMenuProps = {
  menu: TemplateMenu
  onDeleteTemplate: () => void
}

const stopMenuEvent = (event: SyntheticEvent) => event.stopPropagation()

export const TemplateContextMenu = ({ menu, onDeleteTemplate }: TemplateContextMenuProps) => (
  <div
    className={styles.contextMenu}
    onClick={stopMenuEvent}
    onContextMenu={stopMenuEvent}
    onPointerDown={stopMenuEvent}
    style={{ left: menu.x, top: menu.y }}
  >
    <button autoFocus onClick={onDeleteTemplate} type="button">
      Delete
    </button>
  </div>
)
