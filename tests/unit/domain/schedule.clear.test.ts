import { describe, expect, it } from 'vitest'
import { clearScheduleRange } from '../../../src/domain/schedule'
import { createIdFactory } from '../utils/createIdFactory'

describe('clearScheduleRange', () => {
  it('trims painted time from the start of an allocation', () => {
    expect(
      clearScheduleRange({
        blocks: [{ id: 'block', taskId: 'deep-work', startMinute: 540, endMinute: 660 }],
        chunkSize: 30,
        createId: createIdFactory(),
        startMinute: 540,
        endMinute: 570
      })
    ).toEqual([{ id: 'created-1', taskId: 'deep-work', startMinute: 600, endMinute: 660 }])
  })

  it('trims painted time from the end of an allocation', () => {
    expect(
      clearScheduleRange({
        blocks: [{ id: 'block', taskId: 'deep-work', startMinute: 540, endMinute: 660 }],
        chunkSize: 30,
        createId: createIdFactory(),
        startMinute: 600,
        endMinute: 630
      })
    ).toEqual([{ id: 'created-1', taskId: 'deep-work', startMinute: 540, endMinute: 600 }])
  })

  it('splits an allocation when painted time is cleared from the middle', () => {
    expect(
      clearScheduleRange({
        blocks: [{ id: 'block', taskId: 'deep-work', startMinute: 540, endMinute: 660 }],
        chunkSize: 30,
        createId: createIdFactory(),
        startMinute: 570,
        endMinute: 600
      })
    ).toEqual([
      { id: 'created-1', taskId: 'deep-work', startMinute: 540, endMinute: 570 },
      { id: 'created-2', taskId: 'deep-work', startMinute: 630, endMinute: 660 }
    ])
  })
})
