import styles from '../Timeline.module.scss'
import { nowStyle } from '../timelineLayout'
import { formatMinutes, formatTimeAttribute } from '../../../utils/time'

type CurrentTimeMarkerProps = {
  currentMinute: number
}

export const CurrentTimeMarker = ({ currentMinute }: CurrentTimeMarkerProps) => (
  <div className={styles.now} style={nowStyle(currentMinute)}>
    <time dateTime={formatTimeAttribute(currentMinute)}>
      <span className={styles.currentTimePrefix}>Current time </span>
      {formatMinutes(currentMinute)}
    </time>
  </div>
)
