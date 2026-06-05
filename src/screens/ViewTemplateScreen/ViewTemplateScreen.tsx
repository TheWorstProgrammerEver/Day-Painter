import { useParams } from 'react-router-dom'
import { Timeline } from '../../components/Timeline/Timeline'
import { getScheduleStatus } from '../../domain/planner'
import styles from './ViewTemplateScreen.module.scss'
import { useViewTemplateScreenViewModel } from './useViewTemplateScreenViewModel'
import { useViewTimelineScroll } from './useViewTimelineScroll'
import { ViewTemplateStatus } from './ViewTemplateStatus/ViewTemplateStatus'
import { ViewTemplateSummary } from './ViewTemplateSummary/ViewTemplateSummary'

export const ViewTemplateScreen = () => {
  const { templateName } = useParams()
  const { isLoading, planner } = useViewTemplateScreenViewModel(templateName)
  const appName = window.config?.appName ?? 'Day Painter'
  const displayName = templateName ?? 'Template'
  const { scrollToCurrentTime, timelineWrapRef } = useViewTimelineScroll(
    planner?.currentMinute ?? 0,
    Boolean(planner),
    displayName
  )
  const scheduleStatus = planner ? getScheduleStatus(planner.blocksWithTasks, planner.currentMinute) : undefined

  if (isLoading) {
    return <ViewTemplateStatus appName={appName} status="Loading template..." templateName={displayName} />
  }

  if (!planner) {
    return <ViewTemplateStatus appName={appName} status="Template not found." templateName={displayName} />
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <p>{appName}</p>
          <h1>{displayName}</h1>
        </div>
        <ViewTemplateSummary current={scheduleStatus?.current} next={scheduleStatus?.next} />
        <div className={styles.headerActions}>
          <p className={styles.viewMode}>Read-only template</p>
          <button
            className={styles.nowButton}
            onClick={() => scrollToCurrentTime()}
            type="button"
          >
            Now
          </button>
        </div>
      </header>

      <section className={styles.timelineWrap} ref={timelineWrapRef} aria-label={`${displayName} timeline`}>
        <Timeline planner={planner} readOnly />
      </section>
    </main>
  )
}
