import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'

export default function QRModal({ booking, onClose }) {

  const handleDownload = () => {
    if (!booking.qrCode) return;
    const link = document.createElement('a');
    link.href = booking.qrCode;
    link.download = `ticket-${booking.bookingRef}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="max-w-md w-full card-glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Your Ticket</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={20} className="text-gray-400" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Event Details */}
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Event</p>
              <h3 className="text-lg font-bold text-white mb-2">{booking.eventTitle}</h3>
              <p className="text-sm text-gray-400">{booking.venue}</p>
            </div>

            {/* Booking Reference */}
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Booking Reference</p>
              <p className="text-lg font-mono font-bold text-purple-400">{booking.bookingRef}</p>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center p-4 bg-white rounded-lg">
              {booking.qrCode ? (
                <img src={booking.qrCode} alt={`QR code for booking ${booking.bookingRef}`} className="w-48 h-48" />
              ) : <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500">QR Not Available</div>}
            </div>

            {/* Seats */}
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your Seats</p>
              <p className="text-lg font-bold text-white">{booking.seats.join(', ')}</p>
            </div>

            {/* Download Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-glow transition-all"
            >
              <Download size={20} />
              Download Ticket
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
