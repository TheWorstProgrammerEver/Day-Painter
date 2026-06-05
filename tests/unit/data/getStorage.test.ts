import { describe, expect, it } from 'vitest'
import { createInMemoryStorage } from '../../../src/data/inMemoryStorage'
import { chooseStorage } from '../../../src/data/getStorage'
import type { StorageMechanism } from '../../../src/data/storageMechanisms'

const mechanism = (name: string, isAvailable: boolean): StorageMechanism => {
  const storage = createInMemoryStorage()
  storage.setItem('mechanism', name)

  return {
    createStorage: () => storage,
    isAvailable: () => isAvailable,
    name
  }
}

describe('chooseStorage', () => {
  it('uses the first available persistence mechanism', () => {
    const storage = chooseStorage([
      mechanism('unavailable', false),
      mechanism('available', true),
      mechanism('fallback', true)
    ])

    expect(storage.getItem('mechanism')).toBe('available')
  })

  it('falls back to in-memory storage when nothing is available', () => {
    const storage = chooseStorage([mechanism('unavailable', false)])

    storage.setItem('template', 'saved')

    expect(storage.getItem('template')).toBe('saved')
  })
})
