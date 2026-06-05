export const MINUTES_IN_DAY = 24 * 60

export const formatMinutes = (totalMinutes: number) => {
  const normalizedMinutes = totalMinutes % MINUTES_IN_DAY
  const hours = Math.floor(normalizedMinutes / 60)
  const minutes = normalizedMinutes % 60
  const hour12 = hours % 12 || 12
  const period = hours < 12 ? 'AM' : 'PM'

  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
}

export const formatTimeAttribute = (totalMinutes: number) => {
  const normalizedMinutes = totalMinutes % MINUTES_IN_DAY
  const hours = Math.floor(normalizedMinutes / 60)
  const minutes = normalizedMinutes % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const getCurrentMinute = (date = new Date()) => date.getHours() * 60 + date.getMinutes()

export const clampMinute = (minute: number) => Math.min(MINUTES_IN_DAY, Math.max(0, minute))
