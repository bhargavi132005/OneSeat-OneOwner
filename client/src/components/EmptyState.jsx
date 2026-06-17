import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-96 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-6"
      >
        <Inbox size={64} className="text-purple-500/50" />
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
