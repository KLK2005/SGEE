import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CreditCardIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShieldCheckIcon,
  SquaresPlusIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const studentNavItems = [
  { name: 'Tableau de bord', href: '/etudiant', icon: HomeIcon },
  { name: 'Mon Enrôlement', href: '/etudiant/enrolement', icon: AcademicCapIcon },
  { name: 'Mes Paiements', href: '/etudiant/paiements', icon: CreditCardIcon },
  { name: 'Mes Documents', href: '/etudiant/documents', icon: DocumentTextIcon },
]

const adminNavItems = [
  { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
  { name: 'Candidats', href: '/admin/candidats', icon: UserGroupIcon },
  { name: 'Filières', href: '/admin/filieres', icon: AcademicCapIcon },
  { name: 'Départements', href: '/admin/departements', icon: BuildingOfficeIcon },
  { name: 'Écoles', href: '/admin/ecoles', icon: BuildingLibraryIcon },
  { name: 'Centres Examen', href: '/admin/centres-examen', icon: ClipboardDocumentListIcon },
  { name: 'Centres Dépôt', href: '/admin/centres-depot', icon: CheckCircleIcon },
  { name: 'Paiements', href: '/admin/paiements', icon: CreditCardIcon },
  { name: 'Documents', href: '/admin/documents', icon: DocumentTextIcon },
  { name: 'Statistiques', href: '/admin/statistiques', icon: ChartBarIcon },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: UserIcon },
  { name: 'Rôles', href: '/admin/roles', icon: ShieldCheckIcon },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const userRole = user?.role?.nom_role || user?.role?.nom
  const isAdmin = userRole === 'admin'
  const navItems = isAdmin ? adminNavItems : studentNavItems

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-gradient-to-b from-blue-600 via-blue-700 to-purple-700 shadow-2xl transform transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/20">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black text-lg shadow-lg">S</span>
            <span className="tracking-wide">SGEE</span>
          </h1>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-6 space-y-2.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {navItems.map((item, index) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin' || item.href === '/etudiant'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group animate-fadeInUp ${
                  isActive
                    ? 'bg-white text-blue-700 font-bold shadow-lg'
                    : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-gradient-to-b from-transparent to-black/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-white hover:bg-red-500 rounded-xl transition-all duration-300 font-semibold group"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-blue-50/90 to-purple-50/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
          <div className="flex items-center justify-between h-20 px-8">
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-6 ml-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">
                  {user?.nom} {user?.prenom}
                </p>
                <p className="text-xs text-gray-500 capitalize font-medium">{user?.role?.nom}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
