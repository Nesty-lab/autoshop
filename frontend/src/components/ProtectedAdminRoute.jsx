import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  return children
}
