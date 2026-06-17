import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function EventCard({ event }) {
  if (!event) return null

  const {
    _id,
    title,
    venue,
    date,
    category,
    startingPrice,
    image,
    seatsRemaining = 45,
  } = event

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card-glass overflow-hidden group cursor-pointer"
    >
      <Link to={`/events/${_id}`}>
        {/* Image Container */}
        <div className="relative h-40 overflow-hidden">
          <motion.img
            src={image || 'https://via.placeholder.com/400x240?text=Event'}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-bold text-white">
            {category}
          </div>

          {/* Seats Remaining */}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-gray-300">
            {seatsRemaining} seats left
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {title}
          </h3>

          {/* Venue */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-400 line-clamp-2">{venue}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">{formatDate(date)}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-4" />

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Starting from</p>
              <p className="text-lg font-bold text-purple-400">
                {formatCurrency(startingPrice)}
              </p>
            </div>
            <motion.div
              whileHover={{ x: 4 }}
              className="p-2 bg-purple-600/20 rounded-full text-purple-400 group-hover:bg-purple-600/40 transition-all"
            >
              <ChevronRight size={20} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
