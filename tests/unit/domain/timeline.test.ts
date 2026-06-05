import { describe, expect, it } from 'vitest'
import { getChunkSizeFromAllocations, getTimelineChunks } from '../../../src/domain/timeline'

const block = (duration: number, index = 0) => {
  const startMinute = 480 + index * 120

  return {
    id: `block-${index}`,
    taskId: `task-${index}`,
    startMinute,
    endMinute: startMinute + duration
  }
}

const blocks = (...durations: number[]) => durations.map((duration, index) => block(duration, index))

describe('getTimelineChunks', () => {
  it('divides the day into the selected chunk size', () => {
    const chunks = getTimelineChunks(30)

    expect(chunks).toHaveLength(48)
    expect(chunks[0]).toEqual({ start: 0, end: 30 })
    expect(chunks.at(-1)).toEqual({ start: 1410, end: 1440 })
  })
})

describe('getChunkSizeFromAllocations', () => {
  it('uses 30 minutes when there are no allocations', () => {
    expect(getChunkSizeFromAllocations([])).toBe(30)
  })

  it.each([
    [15, 15],
    [30, 30],
    [60, 60],
    [15, 75],
    [30, 90],
    [15, 105],
    [60, 120]
  ])('uses %i minutes for a %i minute allocation', (expectedChunkSize, duration) => {
    expect(getChunkSizeFromAllocations(blocks(duration))).toBe(expectedChunkSize)
  })

  it('uses the allocation duration rather than forcing boundary alignment', () => {
    expect(
      getChunkSizeFromAllocations([
        { id: 'morning', taskId: 'focus', startMinute: 495, endMinute: 525 }
      ])
    ).toBe(30)
  })

  it.each([
    [60, [60, 120, 180]],
    [30, [60, 90, 150]],
    [15, [60, 90, 105]],
    [15, [15, 30, 60]]
  ])('uses %i minutes for allocation durations %j', (expectedChunkSize, durations) => {
    expect(getChunkSizeFromAllocations(blocks(...durations))).toBe(expectedChunkSize)
  })
})
