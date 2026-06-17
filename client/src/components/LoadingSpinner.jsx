import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="p-4 rounded-full"
      >
        <Loader size={48} className="text-purple-500" />
      </motion.div>
    </motion.div>
  )
}
