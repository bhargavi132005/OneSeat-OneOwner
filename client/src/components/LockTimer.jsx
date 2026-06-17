import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatTimeRemaining } from '../utils/helpers'
import { LOCK_EXPIRY_TIME } from '../utils/constants'

export default function LockTimer({ lockTime }) {
  const [secondsRemaining, setSecondsRemaining] = useState(LOCK_EXPIRY_TIME * 60)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const lockTimeMs = new Date(lockTime).getTime()
      const expiryMs = LOCK_EXPIRY_TIME * 60 * 1000
      const remaining = Math.max(0, Math.ceil((expiryMs - (now - lockTimeMs)) / 1000))

      setSecondsRemaining(remaining)
      setIsWarning(remaining < 60)

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockTime])

  const percentage = (secondsRemaining / (LOCK_EXPIRY_TIME * 60)) * 100

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-4">
        {/* Circular Progress */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isWarning ? '#EF4444' : '#7C3AED'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 45}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage / 100)}` }}
            transition={{ duration: 1, ease: 'linear' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`text-center ${isWarning ? 'text-red-500' : 'text-purple-400'}`}
          >
            <div className="text-2xl font-bold">{formatTimeRemaining(secondsRemaining)}</div>
            <div className="text-xs text-gray-400">Lock expires</div>
          </motion.div>
        </div>
      </div>

      {/* Warning message */}
      {isWarning && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 text-center font-semibold mt-2"
        >
          ⚠️ Seats will be released soon!
        </motion.p>
      )}
    </div>
  )
}
