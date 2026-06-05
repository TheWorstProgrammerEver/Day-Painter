import styles from '../Timeline.module.scss'
import { chunkStyle } from '../timelineLayout'
import { formatMinutes } from '../../../utils/time'
import type { TimelineChunk } from '../../../domain/planner'

type TimelineGridProps = {
  chunkSize: number
  chunks: TimelineChunk[]
}

export const TimelineGrid = ({ chunkSize, chunks }: TimelineGridProps) =>
  chunks.map((chunk) => (
    <div
      aria-hidden="true"
      className={styles.chunk}
      data-label={formatMinutes(chunk.start)}
      key={chunk.start}
      style={chunkStyle(chunkSize)}
    />
  ))
