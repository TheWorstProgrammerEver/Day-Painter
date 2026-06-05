import { expect, test } from '@playwright/test'
import { addTask, openPlanner, paintMorningBlock, taskItem, templateDeleteButton } from './plannerTestUtils'

test('saves a template and loads it without overwriting on cancel', async ({ page }) => {
  await openPlanner(page)
  await addTask(page, 'Deep work', 'Focused creation')
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt')
    await dialog.accept('Morning')
  })
  await page.getByRole('button', { name: 'Save template' }).click()
  await expect(page.getByRole('button', { name: 'Morning' })).toBeVisible()

  await taskItem(page, /Deep work/).click()
  await addTask(page, 'Admin', 'Small loose ends')

  const overwriteCancelled = new Promise<void>((resolve) => {
    page.once('dialog', async (prompt) => {
      expect(prompt.type()).toBe('prompt')

      page.once('dialog', async (confirm) => {
        expect(confirm.type()).toBe('confirm')
        await confirm.dismiss()
        resolve()
      })

      await prompt.accept('Morning')
    })
  })

  await page.getByRole('button', { name: 'Save template' }).click()
  await overwriteCancelled
  await page.getByRole('button', { name: 'Morning' }).click()

  await expect(taskItem(page, /Deep work/)).toHaveCount(1)
  await expect(taskItem(page, /Admin/)).toHaveCount(0)
  await expect(page.locator('article')).toContainText('Deep work')

  await page.getByRole('link', { name: /View/ }).click()
  await expect(page).toHaveURL('/view/Morning')
  await expect(page.getByRole('region', { name: 'Tasks' })).toHaveCount(0)
  await expect(page.locator('article')).toContainText('Deep work')
})

test('deletes a saved template from the context menu', async ({ page }) => {
  await openPlanner(page)
  await addTask(page, 'Deep work', 'Focused creation')

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt')
    await dialog.accept('Morning')
  })
  await page.getByRole('button', { name: 'Save template' }).click()

  await page.getByRole('button', { name: 'Morning' }).click({ button: 'right' })
  await expect(templateDeleteButton(page)).toBeVisible()
  await templateDeleteButton(page).click()

  await expect(page.getByRole('button', { name: 'Morning' })).toHaveCount(0)
  await expect(page.getByText('No templates saved.')).toBeVisible()
})
