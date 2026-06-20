import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Ticket, Calendar, MapPin, Download, Eye } from 'lucide-react'
import api from '../services/api'
import QRModal from '../components/QRModal'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/bookings/my')
      setBookings(response.data)
    } catch (err) {
      setError('Failed to load bookings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking)
    setShowQRModal(true)
  }

  const handleDownloadTicket = (booking) => {
    // This would typically generate a PDF
    console.log('Download ticket:', booking)
  }

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12">My Bookings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchBookings} />
  }

  if (bookings.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12">My Bookings</h1>
          <EmptyState
            title="No Bookings Yet"
            description="You haven't made any bookings. Start exploring events and reserve your seats now!"
            action={{
              label: 'Browse Events',
              onClick: () => window.location.href = '/',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-12"
        >
          My Bookings
        </motion.h1>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="card-glass rounded-xl overflow-hidden group cursor-pointer"
            >
              {/* Card Header */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600">
                {booking.eventImage ? (
                  <motion.img
                    src={booking.eventImage}
                    alt={booking.eventTitle}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 1.2 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-blue-600/50 flex items-center justify-center"
                  >
                    <Ticket size={64} className="text-white/30" />
                  </motion.div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-600/80 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                  Confirmed
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Event Title */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {booking.eventTitle}
                </h3>

                {/* Venue */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400 line-clamp-2">{booking.venue}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400">{new Date(booking.eventDate).toLocaleDateString()}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* Booking Details */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
                  <p className="text-sm font-mono font-bold text-purple-400">{booking.bookingRef}</p>
                </div>

                {/* Seats */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map(seat => (
                      <span
                        key={seat}
                        className="px-2 py-1 bg-purple-600/20 border border-purple-500 rounded text-xs text-purple-300 font-mono"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-purple-400">₹{booking.totalAmount}</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewTicket(booking)}
                    className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    <Eye size={16} />
                    View Ticket
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadTicket(booking)}
                    className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    <Download size={16} />
                    Download
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && selectedBooking && (
        <QRModal
          booking={selectedBooking}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  )
}