import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mb-6"
      >
        <AlertCircle size={64} className="text-red-500" />
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-400 mb-8 max-w-md">{message || 'An unexpected error occurred. Please try again.'}</p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <RotateCcw size={20} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}
