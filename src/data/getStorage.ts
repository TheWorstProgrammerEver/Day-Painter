import { createInMemoryStorage } from './inMemoryStorage'
import { preferredStorageMechanismsInPriorityOrder } from './storageMechanisms'
import type { StorageMechanism } from './storageMechanisms'

export const chooseStorage = (
  mechanisms: StorageMechanism[] = preferredStorageMechanismsInPriorityOrder
) => mechanisms.find((mechanism) => mechanism.isAvailable())?.createStorage() ?? createInMemoryStorage()

export const getStorage = () => chooseStorage()
