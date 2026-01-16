import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore()
  const userRole = user?.role?.nom_role || user?.role?.nom

  if (isAuthenticated) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/etudiant'} replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SGEE</h1>
          <p className="text-primary-200">Système de Gestion d'Enrôlement des Étudiants</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
