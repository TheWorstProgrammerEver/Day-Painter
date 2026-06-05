import { useMemo, useRef } from 'react'
import { CurrentTimeMarker } from './CurrentTimeMarker/CurrentTimeMarker'
import { TimelineBlock } from './TimelineBlock/TimelineBlock'
import { TimelineContextMenu } from './TimelineContextMenu/TimelineContextMenu'
import { TimelineGrid } from './TimelineGrid/TimelineGrid'
import { timelineStyle } from './timelineLayout'
import styles from './Timeline.module.scss'
import { useTimelineContextMenu } from './useTimelineContextMenu'
import { useTimelineDrag } from './useTimelineDrag'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'
import type { ScheduleBlockWithTask } from '../../types'
import type { TimelineChunk } from '../../domain/planner'

export type TimelinePlanner = Pick<
  EditorScreenViewModel,
  'chunkSize' | 'currentMinute' | 'deleteAllocation' | 'isClearSelected' | 'paintRange' | 'selectedTask'
> & {
  blocksWithTasks: ScheduleBlockWithTask[]
  chunks: TimelineChunk[]
}

type TimelineProps = {
  planner: TimelinePlanner
  readOnly?: boolean
}

export const Timeline = ({ planner, readOnly = false }: TimelineProps) => {
  const timelineRef = useRef<HTMLElement | null>(null)
  const canPaint = !readOnly && (Boolean(planner.selectedTask) || planner.isClearSelected)
  const blocksByStartTime = useMemo(
    () =>
      [...planner.blocksWithTasks].sort(
        (left, right) =>
          left.block.startMinute - right.block.startMinute ||
          left.block.endMinute - right.block.endMinute ||
          left.task.title.localeCompare(right.task.title)
      ),
    [planner.blocksWithTasks]
  )
  const drag = useTimelineDrag({
    canPaint,
    chunkSize: planner.chunkSize,
    onPaintRange: planner.paintRange,
    readOnly,
    timelineRef
  })
  const menu = useTimelineContextMenu(timelineRef, planner.deleteAllocation)

  return (
    <figure
      className={styles.timeline}
      ref={timelineRef}
      style={timelineStyle(planner.chunkSize)}
      onPointerDown={drag.handlePointerDown}
      onPointerMove={drag.handlePointerMove}
      onPointerUp={drag.handlePointerUp}
      onPointerCancel={drag.handlePointerUp}
    >
      <figcaption className={styles.timelineSummary}>
        Day timeline. Timeline from midnight to midnight.
        {readOnly
          ? ' Saved allocations are listed here.'
          : ' Use the task palette to choose a task, then drag over the visual timeline to paint time. Saved allocations can be deleted from their delete buttons.'}
      </figcaption>

      <TimelineGrid chunks={planner.chunks} chunkSize={planner.chunkSize} />

      {blocksByStartTime.map(({ block, task }) => (
        <TimelineBlock
          block={block}
          key={block.id}
          onDelete={readOnly ? undefined : () => planner.deleteAllocation(block.id)}
          onOpenMenu={readOnly ? undefined : menu.openContextMenu}
          task={task}
        />
      ))}

      {!readOnly && menu.contextMenu ? (
        <TimelineContextMenu contextMenu={menu.contextMenu} onDeleteBlock={menu.deleteBlockFromMenu} />
      ) : null}

      <CurrentTimeMarker currentMinute={planner.currentMinute} />
    </figure>
  )
}
