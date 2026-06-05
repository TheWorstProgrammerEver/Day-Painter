import { describe, expect, it } from 'vitest'
import { deleteScheduleBlock, paintScheduleRange } from '../../../src/domain/schedule'
import { createIdFactory } from '../utils/createIdFactory'

describe('paintScheduleRange', () => {
  it('creates a block for the painted range', () => {
    expect(
      paintScheduleRange({
        blocks: [],
        chunkSize: 15,
        createId: createIdFactory(),
        startMinute: 540,
        endMinute: 570,
        taskId: 'deep-work'
      })
    ).toEqual([
      {
        id: 'created-1',
        taskId: 'deep-work',
        startMinute: 540,
        endMinute: 585
      }
    ])
  })

  it('merges overlapping and touching blocks for the same task', () => {
    const blocks = [
      { id: 'existing-a', taskId: 'deep-work', startMinute: 540, endMinute: 585 },
      { id: 'existing-b', taskId: 'deep-work', startMinute: 585, endMinute: 615 }
    ]

    expect(
      paintScheduleRange({
        blocks,
        chunkSize: 15,
        createId: createIdFactory(),
        startMinute: 600,
        endMinute: 555,
        taskId: 'deep-work'
      })
    ).toEqual([
      {
        id: 'created-1',
        taskId: 'deep-work',
        startMinute: 540,
        endMinute: 615
      }
    ])
  })

  it('splits a different task when painting through its middle', () => {
    const blocks = [{ id: 'admin-block', taskId: 'admin', startMinute: 540, endMinute: 660 }]

    expect(
      paintScheduleRange({
        blocks,
        chunkSize: 30,
        createId: createIdFactory(),
        startMinute: 570,
        endMinute: 600,
        taskId: 'deep-work'
      })
    ).toEqual([
      { id: 'created-1', taskId: 'admin', startMinute: 540, endMinute: 570 },
      { id: 'created-2', taskId: 'admin', startMinute: 630, endMinute: 660 },
      { id: 'created-3', taskId: 'deep-work', startMinute: 570, endMinute: 630 }
    ])
  })
})

describe('deleteScheduleBlock', () => {
  it('removes only the matching allocation', () => {
    const blocks = [
      { id: 'deep-work-morning', taskId: 'deep-work', startMinute: 540, endMinute: 600 },
      { id: 'deep-work-afternoon', taskId: 'deep-work', startMinute: 780, endMinute: 840 },
      { id: 'admin', taskId: 'admin', startMinute: 600, endMinute: 660 }
    ]

    expect(deleteScheduleBlock(blocks, 'deep-work-morning')).toEqual([
      { id: 'deep-work-afternoon', taskId: 'deep-work', startMinute: 780, endMinute: 840 },
      { id: 'admin', taskId: 'admin', startMinute: 600, endMinute: 660 }
    ])
  })
})
