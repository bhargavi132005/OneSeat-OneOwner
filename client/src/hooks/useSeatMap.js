import { useState, useCallback, useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import api from '../services/api'

export function useSeatMap(eventId) {
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { seatUpdates } = useContext(SocketContext) || {}

  // Fetch seats
  const fetchSeats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/seats/event/${eventId}`)
      setSeats(response.data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching seats:', err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  // Update seats from socket updates
  useEffect(() => {
    if (seatUpdates && Object.keys(seatUpdates).length > 0) {
      setSeats(prev => prev.map(seat => ({
        ...seat,
        status: seatUpdates[seat.seatId]?.status || seat.status
      })))
    }
  }, [seatUpdates])

  // Select/deselect seat
  const toggleSeat = useCallback((seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId)
      } else {
        return [...prev, seatId]
      }
    })
  }, [])

  // Lock seat
  const lockSeat = useCallback(async (seatId) => {
    try {
      await api.post(`/seats/${seatId}/lock`, { eventId })
    } catch (err) {
      console.error('Error locking seat:', err)
    }
  }, [eventId])

  // Release seat
  const releaseSeat = useCallback(async (seatId) => {
    try {
      await api.post(`/seats/${seatId}/release`, { eventId })
    } catch (err) {
      console.error('Error releasing seat:', err)
    }
  }, [eventId])

  // Clear selected seats
  const clearSelected = useCallback(() => {
    setSelectedSeats([])
  }, [])

  useEffect(() => {
    if (eventId) {
      fetchSeats()
    }
  }, [eventId, fetchSeats])

  return {
    seats,
    selectedSeats,
    loading,
    error,
    toggleSeat,
    lockSeat,
    releaseSeat,
    clearSelected,
    refetch: fetchSeats,
  }
}
