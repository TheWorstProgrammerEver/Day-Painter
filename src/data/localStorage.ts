import type { StorageMechanism } from './storageMechanisms'

const canUseStorage = (storage: Storage) => {
  const key = 'day-painter.storage-test'

  try {
    storage.setItem(key, key)
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

const getLocalStorage = () => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export const localStorageMechanism: StorageMechanism = {
  createStorage: () => getLocalStorage() as Storage,
  isAvailable: () => {
    const storage = getLocalStorage()
    return storage ? canUseStorage(storage) : false
  },
  name: 'localStorage'
}
