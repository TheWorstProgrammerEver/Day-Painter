import { expect, test } from '@playwright/test'
import { nowMarker, openSeededPlanner, paintMorningBlock } from './plannerTestUtils'

test('default planner in light mode', async ({ page }) => {
  await openSeededPlanner(page, 'light')

  await expect(page).toHaveScreenshot('default-light.png', {
    mask: [page.locator(nowMarker)]
  })
})

test('default planner in dark mode', async ({ page }) => {
  await openSeededPlanner(page, 'dark')

  await expect(page).toHaveScreenshot('default-dark.png', {
    mask: [page.locator(nowMarker)]
  })
})

test('painted timeline state', async ({ page }) => {
  await openSeededPlanner(page)
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)

  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article')).toContainText('Deep work')
  await expect(page).toHaveScreenshot('painted-timeline.png', {
    mask: [page.locator(nowMarker)]
  })
})
