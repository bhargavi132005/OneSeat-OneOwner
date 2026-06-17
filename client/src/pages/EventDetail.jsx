import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { MapPin, Calendar, Users, ChevronLeft, ShoppingCart } from 'lucide-react'
import api from '../services/api'
import SeatMap from '../components/SeatMap'
import LockTimer from '../components/LockTimer'
import ErrorState from '../components/ErrorState'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatCurrency, formatDate, calculateTotalPrice } from '../utils/helpers'
import { AuthContext } from '../context/AuthContext'
import { SocketContext } from '../context/SocketContext'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useContext(AuthContext) || {}
  const { releaseSeat, joinEvent, seatUpdates } = useContext(SocketContext) || {}
  
  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([]) // Changed back to array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lockTime, setLockTime] = useState(null)
  const [isLocking, setIsLocking] = useState(false)

  useEffect(() => {
    fetchEventDetail()
    if (joinEvent) joinEvent(id)
  }, [id])

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      const eventResponse = await api.get(`/events/${id}`)
      setEvent(eventResponse.data)
      
      const seatsResponse = await api.get(`/events/${id}/seats`)
      setSeats(seatsResponse.data)
    } catch (err) {
      setError('Failed to load event details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Logic updated for up to 2 seats selection
  const handleSeatSelect = async (seatId) => {
    if (isLocking) return; // Prevent multiple requests
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    const seatToSelect = seats.find(s => s._id === seatId);
    if (seatToSelect && seatToSelect.status !== 'available' && !seatToSelect.lockedByMe) {
      alert("Seat is not available for selection.");
      return;
    }

    setIsLocking(true);

    // Case 1: Deselecting the currently selected seat
    if (selectedSeats.includes(seatId)) {
      try {
        if (releaseSeat) releaseSeat(seatId);
        setSelectedSeats(prev => {
          const newSeats = prev.filter(id => id !== seatId);
          if (newSeats.length === 0) setLockTime(null);
          return newSeats;
        });
      } catch (err) {
        console.error("Failed to release seat:", err);
      } finally {
        setIsLocking(false);
      }
      return;
    }

    // Case 2: Selecting a new seat
    if (selectedSeats.length >= 2) {
      alert("You can only lock up to 2 seats per event.");
      setIsLocking(false);
      return;
    }

    try {
      // Acquire lock for the new seat via HTTP
      const response = await api.post(`/seats/${seatId}/lock`, { eventId: id });
      
      setSelectedSeats(prev => {
        if (prev.length === 0) setLockTime(new Date()); // Start timer on first lock
        return [...prev, seatId];
      });
    } catch (err) {
      alert(err.response?.data?.message || "Could not select this seat.");
    } finally {
      setIsLocking(false);
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } }); // Redirect back after login
      return
    }
    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.')
      return
    }

    // Store in session storage for checkout page
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats))
    sessionStorage.setItem('eventId', id)
    navigate('/checkout')
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchEventDetail} />
  if (!event) return <ErrorState message="Event not found" />
  
  // Merge live socket updates into the seat list
  const displaySeats = seats.map(seat => {
    const update = seatUpdates[seat._id];
    if (update) {
      return {
        ...seat,
        status: update.status,
        lockedByMe: update.status === 'locked' && update.userId === user?._id
      };
    }
    return seat;
  });

  const pricing = calculateTotalPrice(event.startingPrice, selectedSeats.length)

  return (
    <div>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 overflow-hidden"
      >
        <img
          src={event.image || 'https://via.placeholder.com/1200x400?text=Event'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40 transition-all z-10"
        >
          <ChevronLeft size={24} />
        </motion.button>

        {/* Title Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              {event.venue}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              {formatDate(event.date)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Seat Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <SeatMap
              seats={displaySeats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </motion.div>

          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 h-fit card-glass rounded-xl p-6"
          >
            {/* Lock Timer */}
            {lockTime && selectedSeats.length > 0 && (
              <div className="mb-8">
                <LockTimer lockTime={lockTime} />
              </div>
            )}

            {/* Selected Seats */}
            <div className="mb-6">
              <h3 className="font-bold text-white mb-3">Selected Seats</h3>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSeats.map(seatId => (
                    <motion.span
                      key={seatId}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-purple-600/30 border border-purple-500 rounded-lg text-sm text-purple-300 font-mono"
                    >
                      {seats.find(s => s._id === seatId)?.label || seatId}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No seats selected</p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-6" />

            {/* Pricing */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({selectedSeats.length}x)</span>
                <span>{formatCurrency(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Convenience Fee</span>
                <span>{formatCurrency(pricing.convenienceFee)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxes & Charges</span>
                <span>{formatCurrency(pricing.tax)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-purple-400">
                  {formatCurrency(pricing.total)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckout}
              disabled={selectedSeats.length === 0}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-bold hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Proceed to Checkout
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Seats will be automatically released after 5 minutes
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}