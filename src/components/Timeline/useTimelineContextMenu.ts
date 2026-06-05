import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent, RefObject } from 'react'

export type TimelineContextMenuState = {
  blockId: string
  x: number
  y: number
}

export const useTimelineContextMenu = (
  timelineRef: RefObject<HTMLElement | null>,
  onDeleteBlock: (blockId: string) => void
) => {
  const [contextMenu, setContextMenu] = useState<TimelineContextMenuState | null>(null)
  const closeContextMenu = useCallback(() => setContextMenu(null), [])

  useEffect(() => {
    if (!contextMenu) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContextMenu()
      }
    }

    window.addEventListener('click', closeContextMenu)
    window.addEventListener('contextmenu', closeContextMenu)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('click', closeContextMenu)
      window.removeEventListener('contextmenu', closeContextMenu)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [closeContextMenu, contextMenu])

  const openContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>, blockId: string) => {
      event.preventDefault()
      event.stopPropagation()

      const timeline = timelineRef.current

      if (!timeline) {
        return
      }

      const { left, top } = timeline.getBoundingClientRect()
      setContextMenu({
        blockId,
        x: event.clientX - left,
        y: event.clientY - top
      })
    },
    [timelineRef]
  )

  const deleteBlockFromMenu = useCallback(() => {
    if (!contextMenu) {
      return
    }

    onDeleteBlock(contextMenu.blockId)
    closeContextMenu()
  }, [closeContextMenu, contextMenu, onDeleteBlock])

  return { closeContextMenu, contextMenu, deleteBlockFromMenu, openContextMenu }
}
