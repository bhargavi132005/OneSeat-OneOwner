import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SuccessModal({ booking, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="max-w-md w-full card-glass rounded-2xl overflow-hidden"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={20} className="text-gray-400" />
          </motion.button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-6 flex justify-center"
            >
              <CheckCircle size={64} className="text-green-500" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Booking Confirmed!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 mb-6"
            >
              Your seats are now reserved
            </motion.p>

            {/* Booking Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 rounded-lg p-4 mb-6 space-y-3 text-left"
            >
              <div className="flex justify-between">
                <span className="text-gray-400">Booking ID</span>
                <span className="text-white font-mono font-bold">{booking.bookingRef}</span>
              </div>
              <div className="border-t border-white/10" />
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-bold text-lg">₹{booking.totalAmount}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Link to="/bookings" onClick={onClose}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-bold hover:shadow-glow transition-all"
                >
                  View My Bookings
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                Close
              </motion.button>
            </motion.div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-500 mt-6"
            >
              A confirmation email has been sent to your registered email address
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
