import { describe, expect, it } from 'vitest'
import { getScheduleStatus } from '../../../src/domain/scheduleStatus'
import type { ScheduleBlockWithTask } from '../../../src/types'

const block = (id: string, title: string, startMinute: number, endMinute: number): ScheduleBlockWithTask => ({
  block: { id, taskId: id, startMinute, endMinute },
  task: { id, title, colour: '#ff0000' }
})

describe('getScheduleStatus', () => {
  it('finds the current and next allocations from sorted blocks', () => {
    const status = getScheduleStatus(
      [
        block('focus', 'Focus', 540, 600),
        block('admin', 'Admin', 630, 660)
      ],
      570
    )

    expect(status.current?.task.title).toBe('Focus')
    expect(status.next?.task.title).toBe('Admin')
  })

  it('finds the next allocation when the current time is unallocated', () => {
    const status = getScheduleStatus([block('gym', 'Gym', 990, 1050)], 900)

    expect(status.current).toBeUndefined()
    expect(status.next?.task.title).toBe('Gym')
  })

  it('sorts allocations before choosing status blocks', () => {
    const status = getScheduleStatus(
      [
        block('gym', 'Gym', 990, 1050),
        block('focus', 'Focus', 540, 600),
        block('admin', 'Admin', 630, 660)
      ],
      601
    )

    expect(status.current).toBeUndefined()
    expect(status.next?.task.title).toBe('Admin')
  })

  it('has no next allocation after the final block starts', () => {
    const status = getScheduleStatus([block('focus', 'Focus', 540, 600)], 570)

    expect(status.current?.task.title).toBe('Focus')
    expect(status.next).toBeUndefined()
  })
})
