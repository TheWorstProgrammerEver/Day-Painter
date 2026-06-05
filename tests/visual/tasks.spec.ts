import { expect, test } from '@playwright/test'
import { addTask, openPlanner, openSeededPlanner, paintMorningBlock, taskItem } from './plannerTestUtils'

test('updates selected task details and reflects them on the timeline', async ({ page }) => {
  await openSeededPlanner(page)
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)
  await expect(page.locator('article')).toContainText('Deep work')

  await page.getByLabel('Title').fill('Writing')
  await page.getByLabel('Description').fill('Draft the first pass')
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.locator('article')).toContainText('Writing')
  await expect(taskItem(page, /Writing/)).toContainText('Draft the first pass')
})

test('custom task colour is applied to palette and timeline allocations', async ({ page }) => {
  await openPlanner(page)
  await addTask(page, 'Design', 'Choose visual direction', '#ff0000')
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)

  await expect(page.locator('article')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
  await expect(taskItem(page, /Design/).locator('span').first()).toHaveCSS(
    'background-color',
    'rgb(255, 0, 0)'
  )

  await page.getByLabel('Colour').fill('#00ff00')
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.locator('article')).toHaveCSS('background-color', 'rgb(0, 255, 0)')
  await expect(taskItem(page, /Design/).locator('span').first()).toHaveCSS(
    'background-color',
    'rgb(0, 255, 0)'
  )
})

test('task palette shows allocated time totals', async ({ page }) => {
  await openSeededPlanner(page)
  await expect(taskItem(page, /Deep work/)).toContainText('0m')

  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)

  await expect(taskItem(page, /Deep work/)).toContainText('1h 45m')
  await expect(taskItem(page, /Admin/)).toContainText('0m')
})

test('clear tool resets the task form and task delete removes its allocations', async ({ page }) => {
  await openSeededPlanner(page)
  await page.getByLabel('Time chunks').selectOption('15')
  await paintMorningBlock(page)
  await expect(page.locator('article')).toHaveCount(1)

  await taskItem(page, /Clear task/).click()
  await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible()
  await expect(page.getByLabel('Title')).toHaveValue('')

  await taskItem(page, /Deep work/).click()
  await page.locator('form').getByRole('button', { name: 'Delete' }).click()

  await expect(taskItem(page, /Deep work/)).toHaveCount(0)
  await expect(taskItem(page, /Admin/)).toHaveCount(1)
  await expect(page.locator('article')).toHaveCount(0)
})

test('shows an empty task list state before tasks are added', async ({ page }) => {
  await openPlanner(page)

  await expect(page.getByText('No tasks defined.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible()
  await expect(page.locator('article')).toHaveCount(0)
})
