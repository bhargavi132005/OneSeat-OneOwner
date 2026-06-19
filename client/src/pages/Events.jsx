import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import EventCard from '../components/EventCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/events')
      setEvents(response.data)
    } catch (err) {
      setError('Failed to load events')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(q.toLowerCase()) ||
    (e.venue || '').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 gradient-text"
      >
        Events
      </motion.h1>

      {error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : (q ? filtered : events).map((event, i) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
        </div>
      )}
    </div>
  )
}
