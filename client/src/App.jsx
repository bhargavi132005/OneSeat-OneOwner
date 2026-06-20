import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext, AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import Events from './pages/Events'
import Checkout from './pages/Checkout'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import CommandPalette from './components/CommandPalette'
import LoadingSpinner from './components/LoadingSpinner'
import { useContext } from 'react'

function AppRoutes() {
  const { isAuthenticated, loading } = useContext(AuthContext) || {}

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events" element={<Events />} />
          
          <Route
            path="/checkout"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CommandPalette />
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App