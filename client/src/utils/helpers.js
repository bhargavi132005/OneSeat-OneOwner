import { CONVENIENCE_FEE_PERCENTAGE, TAX_PERCENTAGE } from './constants'

/**
 * Format currency value
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Format time remaining
 */
export const formatTimeRemaining = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Calculate total price with taxes and fees
 */
export const calculateTotalPrice = (subtotal, quantity = 1) => {
  const total = subtotal * quantity
  const convenienceFee = Math.round(total * (CONVENIENCE_FEE_PERCENTAGE / 100))
  const tax = Math.round(total * (TAX_PERCENTAGE / 100))
  const finalTotal = total + convenienceFee + tax

  return {
    subtotal: total,
    convenienceFee,
    tax,
    total: finalTotal,
  }
}

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

/**
 * Generate random color
 */
export const getRandomColor = () => {
  const colors = ['#7C3AED', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}

/**
 * Get seat label from row and column
 */
export const getSeatLabel = (row, col) => {
  return `${row}${col}`
}

/**
 * Get initial from name
 */
export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generate booking reference
 */
export const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'BK'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if time is within lock expiry
 */
export const isWithinLockTime = (lockTime, expiryMinutes) => {
  const now = Date.now()
  const lockTimeMs = new Date(lockTime).getTime()
  const expiryMs = expiryMinutes * 60 * 1000
  return now - lockTimeMs < expiryMs
}

/**
 * Get time until expiry in seconds
 */
export const getTimeUntilExpiry = (lockTime, expiryMinutes) => {
  const now = Date.now()
  const lockTimeMs = new Date(lockTime).getTime()
  const expiryMs = expiryMinutes * 60 * 1000
  const remaining = expiryMs - (now - lockTimeMs)
  return Math.max(0, Math.ceil(remaining / 1000))
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{10})$/)
  if (!match) return phone
  return `${match[1].substring(0, 5)}-${match[1].substring(5)}`
}

/**
 * Get browser timezone
 */
export const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Convert to UTC
 */
export const toUTC = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
}

/**
 * Get distance between two dates in days
 */
export const getDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getDate() === checkDate.getDate()
  )
}

/**
 * Check if date is in future
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date()
}
