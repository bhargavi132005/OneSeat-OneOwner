import { Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, isAuthenticated }) {
  if (isAuthenticated === undefined) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
