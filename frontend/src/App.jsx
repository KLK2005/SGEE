import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Chatbot from './components/Chatbot'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import OAuthCallback from './pages/auth/OAuthCallback'

// Public Pages
import Home from './pages/public/Home'
import VerifyQrCode from './pages/public/VerifyQrCode'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import Enrolement from './pages/student/Enrolement'
import DossierValide from './pages/student/DossierValide'
import MesPaiements from './pages/student/MesPaiements'
import MesDocuments from './pages/student/MesDocuments'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import GestionCandidats from './pages/admin/GestionCandidats'
import GestionFilieres from './pages/admin/GestionFilieres'
import GestionDepartements from './pages/admin/GestionDepartements'
import GestionEcoles from './pages/admin/GestionEcoles'
import GestionCentresExamen from './pages/admin/GestionCentresExamen'
import GestionCentresDepot from './pages/admin/GestionCentresDepot'
import GestionPaiements from './pages/admin/GestionPaiements'
import GestionDocuments from './pages/admin/GestionDocuments'
import Statistiques from './pages/admin/Statistiques'
import GestionUtilisateurs from './pages/admin/GestionUtilisateurs'
import GestionRoles from './pages/admin/GestionRoles'

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
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<VerifyQrCode />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<OAuthCallback />} />

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
          <Route path="dossier-valide" element={<DossierValide />} />
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
          <Route path="ecoles" element={<GestionEcoles />} />
          <Route path="centres-examen" element={<GestionCentresExamen />} />
          <Route path="centres-depot" element={<GestionCentresDepot />} />
          <Route path="paiements" element={<GestionPaiements />} />
          <Route path="documents" element={<GestionDocuments />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="utilisateurs" element={<GestionUtilisateurs />} />
          <Route path="roles" element={<GestionRoles />} />
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

      {/* Chatbot disponible partout */}
      <Chatbot />
    </>
  )
}

export default App
