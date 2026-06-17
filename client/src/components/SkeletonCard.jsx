import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-xl glass-effect overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg mb-4 animate-shimmer" />

      {/* Title skeleton */}
      <div className="h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded mb-3 w-3/4 animate-shimmer" />

      {/* Text skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-full animate-shimmer" />
        <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-5/6 animate-shimmer" />
      </div>

      {/* Price skeleton */}
      <div className="h-5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-1/3 animate-shimmer" />
    </motion.div>
  )
}
