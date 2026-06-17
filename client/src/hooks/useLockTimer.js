import { useState, useEffect, useCallback } from 'react'
import { LOCK_EXPIRY_TIME } from '../utils/constants'

export function useLockTimer(initialTime = null) {
  const [secondsRemaining, setSecondsRemaining] = useState(LOCK_EXPIRY_TIME * 60)
  const [isExpired, setIsExpired] = useState(false)
  const [isWarning, setIsWarning] = useState(false)
  const [lockTime, setLockTime] = useState(initialTime || new Date())

  const start = useCallback((startTime = null) => {
    setLockTime(startTime || new Date())
    setIsExpired(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const lockTimeMs = new Date(lockTime).getTime()
      const expiryMs = LOCK_EXPIRY_TIME * 60 * 1000
      const remaining = Math.max(0, Math.ceil((expiryMs - (now - lockTimeMs)) / 1000))

      setSecondsRemaining(remaining)
      setIsWarning(remaining < 60 && remaining > 0)

      if (remaining === 0) {
        setIsExpired(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockTime])

  const getPercentage = () => (secondsRemaining / (LOCK_EXPIRY_TIME * 60)) * 100

  return {
    secondsRemaining,
    isExpired,
    isWarning,
    getPercentage,
    start,
  }
}
