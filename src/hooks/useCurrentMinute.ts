import { useEffect, useState } from 'react'
import { getCurrentMinute } from '../utils/time'

export const useCurrentMinute = () => {
  const [currentMinute, setCurrentMinute] = useState(getCurrentMinute)

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentMinute(getCurrentMinute()), 30_000)

    return () => window.clearInterval(timer)
  }, [])

  return currentMinute
}
