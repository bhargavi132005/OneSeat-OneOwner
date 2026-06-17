import { motion } from 'framer-motion'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader, CheckCircle } from 'lucide-react'
import api from '../services/api'
import LockTimer from '../components/LockTimer'
import SuccessModal from '../components/SuccessModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatCurrency, calculateTotalPrice, generateBookingRef } from '../utils/helpers'
import { AuthContext } from '../context/AuthContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext) || {}
  
  const [event, setEvent] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatLabels, setSeatLabels] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [booking, setBooking] = useState(null)
  const [lockTime, setLockTime] = useState(null)

  useEffect(() => {
    const eventId = sessionStorage.getItem('eventId')
    const storedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]')
    
    if (!eventId || storedSeats.length === 0) {
      navigate('/') // Go home if checkout is accessed directly
      return
    }

    setSelectedSeats(storedSeats)
    setLockTime(new Date())
    fetchEventAndSeatDetails(eventId, storedSeats)
  }, [navigate])

  const fetchEventAndSeatDetails = async (eventId, storedSeats) => {
    try {
      const [eventRes, seatsRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/seats`),
      ]);
      setEvent(eventRes.data);
      const selectedSeatObjects = seatsRes.data.filter(s => storedSeats.includes(s._id));
      setSeatLabels(selectedSeatObjects.map(s => s.label).join(', '));
    } catch (err) {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmBooking = async () => {
    if (processing) return

    try {
      setProcessing(true)
      setError(null)

      const response = await api.post('/bookings/confirm', {
        eventId: event._id,
        seatIds: selectedSeats,
      })

      const confirmedBooking = response.data.booking;

      const successData = {
        bookingRef: confirmedBooking.bookingRef,
        eventTitle: event.title,
        venue: event.venue,
        seats: response.data.seatLabels,
        totalAmount: pricing.total,
        qrCode: confirmedBooking.qrCode,
      }

      setBooking(successData)
      setSuccess(true)

      // Clear session data
      sessionStorage.removeItem('eventId');
      sessionStorage.removeItem('selectedSeats');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!event || selectedSeats.length === 0) {
    return <LoadingSpinner />
  }

  const pricing = calculateTotalPrice(event.startingPrice, selectedSeats.length)

  return (
    <div>
      {success && booking && (
        <SuccessModal
          booking={booking}
          onClose={() => navigate('/')}
        />
      )}

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-12 text-center"
          >
            Checkout
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Event Summary */}
              <motion.div
                whileHover={{ y: -4 }}
                className="card-glass rounded-xl p-6"
              >
                <h2 className="font-bold text-white mb-4">Event Details</h2>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Event</span>
                    <span className="font-semibold text-white">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue</span>
                    <span className="font-semibold text-white">{event.venue}</span>
                  </div>
                </div>
              </motion.div>

              {/* Booking Summary */}
              <motion.div
                whileHover={{ y: -4 }}
                className="card-glass rounded-xl p-6"
              >
                <h2 className="font-bold text-white mb-4">Booking Summary</h2>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Seats</span>
                    <span className="font-mono text-white">{seatLabels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span className="font-semibold text-white">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Seat</span>
                    <span className="font-semibold text-white">{formatCurrency(event.startingPrice)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                whileHover={{ y: -4 }}
                className="card-glass rounded-xl p-6"
              >
                <h2 className="font-bold text-white mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {['Credit Card', 'Debit Card', 'UPI', 'Net Banking'].map(method => (
                    <motion.label
                      key={method}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-all"
                    >
                      <input type="radio" name="payment" defaultChecked={method === 'Credit Card'} />
                      <span className="text-gray-300">{method}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Confirm Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmBooking}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-bold hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {processing ? (
                  <>
                    <Loader size={24} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle size={24} />
                    Confirm Booking
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 h-fit"
            >
              <div className="card-glass rounded-xl p-6 space-y-6">
                {/* Timer */}
                {lockTime && (
                  <div className="flex justify-center">
                    <LockTimer lockTime={lockTime} />
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white mb-4">Price Summary</h3>
                  
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Convenience Fee</span>
                    <span>{formatCurrency(pricing.convenienceFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Taxes & Charges</span>
                    <span>{formatCurrency(pricing.tax)}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 my-3" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-purple-400">
                      {formatCurrency(pricing.total)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs text-blue-300">
                    ✓ 100% Secure Payment
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    ✓ Money-back guarantee
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}