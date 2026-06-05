import { createDispatcher } from './dispatch'
import { getStorage } from './getStorage'
import { createTemplateSystem } from './templateSystem'

export const createAppDispatcher = () => {
  const storage = getStorage()
  const templateSystem = createTemplateSystem(storage)

  return createDispatcher({
    ...templateSystem
  })
}

export type AppDispatcher = ReturnType<typeof createAppDispatcher>
