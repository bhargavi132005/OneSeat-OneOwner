// Color system
export const COLORS = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#8B5CF6',
  secondary: '#8B5CF6',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#0F172A',
  surface: '#111827',
  card: '#1E293B',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#334155',
}

// Seat statuses
export const SEAT_STATUS = {
  AVAILABLE: 'available',
  LOCKED: 'locked',
  BOOKED: 'booked',
  SELECTED: 'selected',
}

// Lock expiry time (in minutes)
export const LOCK_EXPIRY_TIME = 5

// Theatre layout
export const THEATRE_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
export const THEATRE_COLS = 12

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',

  // Events
  GET_EVENTS: '/events',
  GET_EVENT_DETAIL: '/events/:id',
  SEARCH_EVENTS: '/events/search',

  // Seats
  GET_SEATS: '/seats/event/:eventId',
  LOCK_SEAT: '/seats/lock',
  RELEASE_SEAT: '/seats/release',

  // Bookings
  CREATE_BOOKING: '/bookings',
  GET_MY_BOOKINGS: '/bookings/my',
  GET_BOOKING_DETAIL: '/bookings/:id',
  DOWNLOAD_TICKET: '/bookings/:id/ticket',
}

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  VERY_SLOW: 500,
}

// Event categories
export const EVENT_CATEGORIES = [
  { id: 'concert', label: 'Concerts', icon: '🎵' },
  { id: 'theatre', label: 'Theatre', icon: '🎭' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'movie', label: 'Movies', icon: '🎬' },
  { id: 'comedy', label: 'Comedy', icon: '😂' },
]

// Price tiers
export const PRICE_TIERS = {
  STANDARD: 500,
  PREMIUM: 1000,
  VIP: 2000,
}

// Convenience fee percentage
export const CONVENIENCE_FEE_PERCENTAGE = 2

// Tax percentage
export const TAX_PERCENTAGE = 5
