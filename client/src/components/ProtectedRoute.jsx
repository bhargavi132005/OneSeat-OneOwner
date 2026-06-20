import { Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, isAuthenticated, loading }) {
  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
