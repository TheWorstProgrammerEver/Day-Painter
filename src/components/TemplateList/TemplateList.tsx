import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TemplateContextMenu } from './TemplateContextMenu'
import styles from './TemplateList.module.scss'
import type { TemplateMenu } from './TemplateContextMenu'
import type { MouseEvent } from 'react'
import type { EditorScreenViewModel } from '../../screens/EditorScreen/useEditorScreenViewModel'

type TemplateListProps = {
  planner: EditorScreenViewModel
}

export const TemplateList = ({ planner }: TemplateListProps) => {
  const [templateMenu, setTemplateMenu] = useState<TemplateMenu>()

  useEffect(() => {
    if (!templateMenu) {
      return
    }

    const closeMenu = () => setTemplateMenu(undefined)
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    window.addEventListener('click', closeMenu)
    window.addEventListener('contextmenu', closeMenu)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('click', closeMenu)
      window.removeEventListener('contextmenu', closeMenu)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [templateMenu])

  const handleSaveTemplate = async () => {
    const name = window.prompt('Template name')?.trim()

    if (!name) {
      return
    }

    const exists = planner.templates.some((template) => template.name === name)
    if (exists && !window.confirm(`Overwrite template "${name}"?`)) {
      return
    }

    await planner.saveTemplate(name)
  }

  const openTemplateMenu = (event: MouseEvent<HTMLElement>, name: string) => {
    event.preventDefault()
    event.stopPropagation()
    setTemplateMenu({ name, x: event.clientX, y: event.clientY })
  }

  const deleteTemplateFromMenu = async () => {
    if (templateMenu) {
      await planner.deleteTemplate(templateMenu.name)
      setTemplateMenu(undefined)
    }
  }

  return (
    <section className={styles.templates} aria-labelledby="templates-heading">
      <div className={styles.header}>
        <h2 id="templates-heading">Templates</h2>
        <button onClick={handleSaveTemplate} type="button">
          Save <span className={styles.saveQualifier}>template</span>
        </button>
      </div>

      {planner.templates.length === 0 ? <p className={styles.emptyState}>No templates saved.</p> : null}

      {planner.templates.length > 0 ? (
        <ul className={styles.templateList}>
          {planner.templates.map((template) => (
            <li
              className={styles.templateRow}
              key={template.name}
              onContextMenu={(event) => openTemplateMenu(event, template.name)}
            >
              <button onClick={() => void planner.loadTemplate(template.name)} type="button">
                {template.name}
              </button>
              <Link to={`/view/${encodeURIComponent(template.name)}`}>
                View <span className={styles.viewQualifier}>{template.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {templateMenu ? (
        <TemplateContextMenu
          menu={templateMenu}
          onDeleteTemplate={() => void deleteTemplateFromMenu()}
        />
      ) : null}
    </section>
  )
}
