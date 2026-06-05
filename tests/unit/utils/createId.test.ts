import { describe, expect, it } from 'vitest'
import { createId } from '../../../src/utils/createId'

describe('createId', () => {
  it('uses randomUUID when available', () => {
    expect(createId({ randomUUID: () => 'native-id' })).toBe('native-id')
  })

  it('falls back to a v4 UUID from getRandomValues', () => {
    const cryptoSource = {
      getRandomValues: (values: Uint8Array<ArrayBuffer>) => values.fill(0)
    }

    expect(createId(cryptoSource)).toBe('00000000-0000-4000-8000-000000000000')
  })

  it('falls back when randomUUID throws', () => {
    const cryptoSource = {
      getRandomValues: (values: Uint8Array<ArrayBuffer>) => values.fill(255),
      randomUUID: () => {
        throw new Error('secure context required')
      }
    }

    expect(createId(cryptoSource)).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff')
  })
})
