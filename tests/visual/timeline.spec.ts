import { expect, test } from '@playwright/test'
import { dragTimelineRange, openSeededPlanner, paintMorningBlock, taskItem, timelineDeleteButton } from './plannerTestUtils'

test('deletes one allocation from the timeline context menu', async ({ page }) => {
  await openSeededPlanner(page)
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)

  const block = page.locator('article')
  await expect(block).toHaveCount(1)
  await block.click({ button: 'right' })
  await expect(timelineDeleteButton(page)).toBeVisible()
  await timelineDeleteButton(page).click()

  await expect(page.locator('article')).toHaveCount(0)
})

test('paints a selected task over an existing allocation', async ({ page }) => {
  await openSeededPlanner(page)
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)
  await expect(page.locator('article')).toContainText('Deep work')
  await expect(page.evaluate(() => window.getSelection()?.toString() ?? '')).resolves.toBe('')

  await taskItem(page, /Admin/).click()
  await paintMorningBlock(page)

  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article')).toContainText('Admin')
})

test('clear task erases only the dragged chunks and splits allocations', async ({ page }) => {
  await openSeededPlanner(page)
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)

  await taskItem(page, /Clear task/).click()
  await dragTimelineRange(page, 0.2, 0.215)

  await expect(page.locator('article')).toHaveCount(2)
  await expect(page.locator('article').first()).toContainText('4:15 AM - 4:45 AM')
  await expect(page.locator('article').last()).toContainText('5:15 AM - 6:00 AM')
})
