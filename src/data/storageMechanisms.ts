import { createInMemoryStorage } from './inMemoryStorage'
import { localStorageMechanism } from './localStorage'

export type StorageMechanism = {
  createStorage: () => Storage
  isAvailable: () => boolean
  name: string
}

export const inMemoryStorageMechanism: StorageMechanism = {
  createStorage: createInMemoryStorage,
  isAvailable: () => true,
  name: 'inMemory'
}

export const preferredStorageMechanismsInPriorityOrder = [
  localStorageMechanism,
  inMemoryStorageMechanism
]
