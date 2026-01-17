import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import {
  AcademicCapIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

const StatusBadge = ({ status }) => {
  const styles = {
    valide: 'bg-green-100 text-green-800',
    en_attente: 'bg-yellow-100 text-yellow-800',
    rejete: 'bg-red-100 text-red-800',
    nouveau: 'bg-blue-100 text-blue-800',
    en_cours: 'bg-yellow-100 text-yellow-800',
  }
  
  const labels = {
    valide: 'Validé',
    en_attente: 'En attente',
    rejete: 'Rejeté',
    nouveau: 'Nouveau',
    en_cours: 'En cours',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.en_attente}`}>
      {labels[status] || status || 'En attente'}
    </span>
  )
}

export default function StudentDashboard() {
  const { user } = useAuthStore()

  const { data: candidatResponse, isLoading } = useQuery({
    queryKey: ['mon-candidat-dashboard'],
    queryFn: async () => (await api.get('/mon-candidat')).data,
  })

  const candidat = candidatResponse?.data

  const quickActions = [
    {
      title: 'Mon Enrôlement',
      description: candidat ? 'Voir mon dossier' : 'Commencer mon enrôlement',
      icon: AcademicCapIcon,
      href: '/etudiant/enrolement',
      color: 'bg-blue-500',
    },
    {
      title: 'Mes Paiements',
      description: 'Gérer mes paiements',
      icon: CreditCardIcon,
      href: '/etudiant/paiements',
      color: 'bg-green-500',
    },
    {
      title: 'Mes Documents',
      description: 'Télécharger mes documents',
      icon: DocumentTextIcon,
      href: '/etudiant/documents',
      color: 'bg-purple-500',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="card glass-effect card-shimmer">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenue, {user?.prenom} {user?.nom} ! 👋
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Gérez votre enrôlement et suivez l'état de votre dossier en temps réel.
        </p>
      </div>

      {/* Status Overview */}
      {candidat && (
        <div className="card animate-fadeInUp">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            État de mon dossier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transition-all hover:shadow-md">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Candidature</p>
                <StatusBadge status={candidat.statut_candidat} />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 transition-all hover:shadow-md">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CreditCardIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Paiement</p>
                <StatusBadge status={candidat.paiements?.[0]?.statut_paiement} />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 transition-all hover:shadow-md">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Enrôlement</p>
                <StatusBadge status={candidat.enrolement?.statut_enrolement} />
              </div>
            </div>
          </div>

          {candidat.numero_dossier && (
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <p className="text-sm text-white font-medium opacity-90">Numéro de dossier</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-wide">{candidat.numero_dossier}</p>
            </div>
          )}

          {candidat.filiere && (
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Filière sélectionnée</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{candidat.filiere.nom_filiere}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={action.href}
            to={action.href}
            className="card hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{action.description}</p>
            <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Accéder</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Instructions */}
      {!candidat && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 animate-fadeInUp">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <ExclamationCircleIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-yellow-900">Commencez votre enrôlement</h3>
              <p className="text-yellow-800 mt-2">
                Vous n'avez pas encore de dossier. Cliquez sur "Mon Enrôlement" pour démarrer votre inscription.
              </p>
              <Link 
                to="/etudiant/enrolement" 
                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Démarrer maintenant
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
