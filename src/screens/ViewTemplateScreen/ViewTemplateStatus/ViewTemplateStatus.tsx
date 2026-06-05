import styles from './ViewTemplateStatus.module.scss'

type ViewTemplateStatusProps = {
  appName: string
  status: string
  templateName: string
}

export const ViewTemplateStatus = ({ appName, status, templateName }: ViewTemplateStatusProps) => (
  <main className={styles.status}>
    <div className={styles.panel}>
      <p>{appName}</p>
      <h1>{templateName}</h1>
      <span>{status}</span>
    </div>
  </main>
)
