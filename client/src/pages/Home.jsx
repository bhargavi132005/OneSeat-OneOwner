import { motion } from 'framer-motion'
import { ArrowRight, Zap, Clock, Shield, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'
import EventCard from '../components/EventCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Booking',
      description: 'Lock your favorite seats in real time with instant confirmation',
    },
    {
      icon: Clock,
      title: 'Instant Confirmation',
      description: 'Get your booking confirmed within seconds with QR tickets',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'All payments are encrypted and secure with multiple options',
    },
  ]

  const stats = [
    { label: '500+', description: 'Events' },
    { label: '100K+', description: 'Tickets Sold' },
    { label: '50', description: 'Cities' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8 }}
            className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 10 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
              Book the Best Seats Before They're Gone
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Reserve premium seats in real time for concerts, movies, theatre, sports, and live events.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#events"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-glow transition-all"
              >
                Browse Events
                <ArrowRight size={24} />
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-purple-400 mb-2">{stat.label}</h3>
                <p className="text-gray-400">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 gradient-text"
          >
            Why Choose OneSeat?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="card-glass rounded-xl p-8 text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="inline-block mb-4 p-4 bg-purple-600/20 rounded-lg"
                  >
                    <Icon size={32} className="text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 gradient-text"
          >
            Featured Events
          </motion.h2>

          {error ? (
            <ErrorState message={error} onRetry={fetchEvents} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading
                ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : events.slice(0, 8).map((event, i) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}