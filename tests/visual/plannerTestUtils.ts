import type { Page } from '@playwright/test'

export const nowMarker = 'time[datetime]'
export const screenshotTime = new Date('2026-06-03T09:52:00')

const defaultTasks = [
  {
    title: 'Deep work',
    description: 'Focused creation or problem-solving.'
  },
  {
    title: 'Admin',
    description: 'Email, scheduling, small loose ends.'
  }
]

export const addTask = async (page: Page, title: string, description: string, colour?: string) => {
  if (await page.getByRole('button', { name: 'Add task' }).count() === 0) {
    await taskItem(page, /Clear task/).click()
  }

  if (colour) {
    await page.getByLabel('Colour').fill(colour)
  }

  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Description').fill(description)
  await page.getByRole('button', { name: 'Add task' }).click()
}

export const taskOption = (page: Page, name: string | RegExp) =>
  page.getByRole('region', { name: 'Tasks' }).getByRole('radio', { name })

export const taskItem = (page: Page, name: string | RegExp) =>
  page.getByRole('region', { name: 'Tasks' }).locator('label').filter({ hasText: name })

export const timelineDeleteButton = (page: Page) =>
  page.getByRole('region', { name: 'Timeline' }).getByRole('button', { exact: true, name: 'Delete' })

export const templateDeleteButton = (page: Page) =>
  page.getByRole('region', { name: 'Templates' }).getByRole('button', { exact: true, name: 'Delete' })

export const seedDefaultTasks = async (page: Page) => {
  await addTask(page, defaultTasks[0].title, defaultTasks[0].description)
  await addTask(page, defaultTasks[1].title, defaultTasks[1].description)
  await taskItem(page, /Deep work/).click()
}

export const openPlanner = async (page: Page, colorScheme: 'dark' | 'light' = 'light') => {
  await page.emulateMedia({ colorScheme })
  await page.clock.setFixedTime(screenshotTime)
  await page.addInitScript(() => localStorage.clear())
  await page.goto('/')
}

export const openSeededPlanner = async (page: Page, colorScheme: 'dark' | 'light' = 'light') => {
  await openPlanner(page, colorScheme)
  await seedDefaultTasks(page)
}

export const paintMorningBlock = (page: Page) => dragTimelineRange(page, 0.18, 0.24)

export const dragTimelineRange = async (page: Page, startRatio: number, endRatio: number) => {
  const timeline = page.getByRole('figure', { name: /Day timeline/ })
  const box = await timeline.boundingBox()

  if (!box) {
    throw new Error('Timeline is not visible')
  }

  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * startRatio)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * endRatio)
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * ((startRatio + endRatio) / 2))
  await page.mouse.up()
}
