import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, Search, Home, Ticket, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext) || {}

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const commands = [
    { label: 'Home', icon: Home, fn: () => navigate('/') },
    { label: 'My Bookings', icon: Ticket, fn: () => navigate('/bookings'), hidden: !user },
    { label: 'Logout', icon: LogOut, fn: logout, hidden: !user },
  ]

  const filtered = commands.filter(cmd =>
    !cmd.hidden && cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-50"
          >
            <div className="card-glass rounded-xl overflow-hidden shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search size={20} className="text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none"
                />
                <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-400">
                  ESC
                </span>
              </div>

              {/* Commands List */}
              <motion.div className="max-h-64 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon
                    return (
                      <motion.button
                        key={cmd.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          cmd.fn?.()
                          setIsOpen(false)
                          setSearch('')
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                      >
                        <Icon size={18} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">{cmd.label}</span>
                      </motion.button>
                    )
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No commands found
                  </div>
                )}
              </motion.div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/10 text-xs text-gray-500 flex items-center justify-between">
                <span>Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close</span>
                <Command size={16} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
