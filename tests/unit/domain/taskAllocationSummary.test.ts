import { describe, expect, it } from 'vitest'
import { formatAllocatedMinutes, getTaskAllocationMinutes } from '../../../src/domain/taskAllocationSummary'

describe('task allocation summary', () => {
  it('groups allocated minutes by task', () => {
    const minutesByTask = getTaskAllocationMinutes([
      { id: 'a', taskId: 'deep-work', startMinute: 60, endMinute: 90 },
      { id: 'b', taskId: 'admin', startMinute: 120, endMinute: 135 },
      { id: 'c', taskId: 'deep-work', startMinute: 180, endMinute: 240 }
    ])

    expect(minutesByTask.get('deep-work')).toBe(90)
    expect(minutesByTask.get('admin')).toBe(15)
  })

  it.each([
    [0, '0m'],
    [15, '15m'],
    [60, '1h'],
    [75, '1h 15m']
  ])('formats %s minutes as %s', (minutes, summary) => {
    expect(formatAllocatedMinutes(minutes)).toBe(summary)
  })
})
