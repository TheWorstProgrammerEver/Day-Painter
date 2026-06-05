import { expect, test } from '@playwright/test'
import { nowMarker, screenshotTime } from './plannerTestUtils'

const seedTemplate = {
  name: 'Morning',
  scheduleBlocks: [
    { id: 'focus-block', taskId: 'focus-task', startMinute: 480, endMinute: 600 },
    { id: 'gym-block', taskId: 'gym-task', startMinute: 660, endMinute: 720 }
  ],
  tasks: [
    { id: 'focus-task', title: 'Focus block', colour: '#ff0000' },
    { id: 'gym-task', title: 'Gym', colour: '#3b82f6' }
  ]
}

test('view route loads a saved template as a read-only timeline', async ({ page }) => {
  await page.clock.setFixedTime(screenshotTime)
  await page.addInitScript((template) => {
    localStorage.setItem('day-painter.templates', JSON.stringify([template]))
  }, seedTemplate)

  await page.goto('/view/Morning')

  await expect(page.getByRole('heading', { name: 'Morning' })).toBeVisible()
  await expect(page.getByText('Read-only template')).toBeVisible()
  await expect(page.getByRole('figure', { name: /Day timeline/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Now' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Schedule summary' })).toContainText('Focus block until 10:00 AM')
  await expect(page.getByRole('region', { name: 'Schedule summary' })).toContainText('Gym at 11:00 AM')
  await expect(page.locator('article').filter({ hasText: 'Focus block' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Tasks' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Save template' })).toHaveCount(0)

  await page.locator('article').filter({ hasText: 'Focus block' }).click({ button: 'right' })
  await expect(page.getByRole('button', { exact: true, name: 'Delete' })).toHaveCount(0)
})

test('view route starts near now and can jump back to now', async ({ page }) => {
  await page.clock.setFixedTime(screenshotTime)
  await page.addInitScript((template) => {
    localStorage.setItem('day-painter.templates', JSON.stringify([template]))
  }, seedTemplate)

  await page.goto('/view/Morning')
  const timelineRegion = page.getByRole('region', { name: 'Morning timeline' })

  await expect.poll(() => timelineRegion.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await timelineRegion.evaluate((element) => element.scrollTo({ top: 0 }))
  await expect.poll(() => timelineRegion.evaluate((element) => element.scrollTop)).toBe(0)

  await page.getByRole('button', { name: 'Now' }).click()
  await expect.poll(() => timelineRegion.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
})

test('view route timeline screenshot is stable for a saved template', async ({ page }) => {
  await page.clock.setFixedTime(screenshotTime)
  await page.addInitScript((template) => {
    localStorage.setItem('day-painter.templates', JSON.stringify([template]))
  }, seedTemplate)

  await page.goto('/view/Morning')
  await expect(page.getByRole('heading', { name: 'Morning' })).toBeVisible()
  await expect(page.locator('article').filter({ hasText: 'Focus block' })).toBeVisible()
  await expect
    .poll(() => page.getByRole('region', { name: 'Morning timeline' }).evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0)
  await expect(page).toHaveScreenshot('view-morning-template.png', {
    mask: [page.locator(nowMarker)]
  })
})
