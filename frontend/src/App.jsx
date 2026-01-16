import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Public Pages
import Home from './pages/public/Home'
import VerifyQrCode from './pages/public/VerifyQrCode'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import Enrolement from './pages/student/Enrolement'
import MesPaiements from './pages/student/MesPaiements'
import MesDocuments from './pages/student/MesDocuments'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import GestionCandidats from './pages/admin/GestionCandidats'
import GestionFilieres from './pages/admin/GestionFilieres'
import GestionDepartements from './pages/admin/GestionDepartements'
import GestionPaiements from './pages/admin/GestionPaiements'
import Statistiques from './pages/admin/Statistiques'
import GestionUtilisateurs from './pages/admin/GestionUtilisateurs'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  const userRole = user?.role?.nom_role || user?.role?.nom
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  const { isAuthenticated, user } = useAuthStore()
  const userRole = user?.role?.nom_role || user?.role?.nom

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/verify" element={<VerifyQrCode />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/etudiant"
        element={
          <ProtectedRoute allowedRoles={['etudiant']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="enrolement" element={<Enrolement />} />
        <Route path="paiements" element={<MesPaiements />} />
        <Route path="documents" element={<MesDocuments />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="candidats" element={<GestionCandidats />} />
        <Route path="filieres" element={<GestionFilieres />} />
        <Route path="departements" element={<GestionDepartements />} />
        <Route path="paiements" element={<GestionPaiements />} />
        <Route path="statistiques" element={<Statistiques />} />
        <Route path="utilisateurs" element={<GestionUtilisateurs />} />
      </Route>

      {/* Dashboard redirect for authenticated users */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate to={userRole === 'admin' ? '/admin' : '/etudiant'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
