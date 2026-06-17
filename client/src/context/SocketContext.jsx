import { createContext, useEffect, useState, useRef, useContext } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext'

export const SocketContext = createContext()

export function SocketProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext)
  const socketRef = useRef(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [seatUpdates, setSeatUpdates] = useState({})

  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect()
      return
    }

    const socket = io('http://localhost:5000', {
      withCredentials: true, // This is crucial for HttpOnly cookie auth
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setSocketConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    // Seat events
    socket.on('seat:locked', (data) => {
      setSeatUpdates(prev => ({
        ...prev,
        [data.seatId]: { status: 'locked', userId: data.lockedBy, timestamp: Date.now() }
      }))
    })

    socket.on('seat:available', (data) => {
      setSeatUpdates(prev => ({
        ...prev,
        [data.seatId]: { status: 'available', userId: null, timestamp: Date.now() }
      }))
    })

    socket.on('seat:booked', (data) => {
      setSeatUpdates(prev => ({
        ...prev,
        [data.seatId]: { status: 'booked', userId: data.userId, timestamp: Date.now() }
      }))
    })

    return () => {
      socket.disconnect()
    }
  }, [isAuthenticated])

  const lockSeat = (seatId) => {
    socketRef.current?.emit('lock_seat', { seatId })
  }

  const joinEvent = (eventId) => {
    socketRef.current?.emit('join_event', { eventId })
  }

  const releaseSeat = (seatId) => {
    socketRef.current?.emit('release_seat', { seatId })
  }

  const bookSeats = (seatIds) => {
    socketRef.current?.emit('book_seats', { seatIds })
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        socketConnected,
        seatUpdates,
        lockSeat,
        releaseSeat,
        bookSeats,
        joinEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
