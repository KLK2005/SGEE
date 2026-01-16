import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { candidatService } from '../../services/candidatService'
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
  }
  
  const labels = {
    valide: 'Validé',
    en_attente: 'En attente',
    rejete: 'Rejeté',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.en_attente}`}>
      {labels[status] || status}
    </span>
  )
}

export default function StudentDashboard() {
  const { user } = useAuthStore()

  const { data: candidatData, isLoading } = useQuery({
    queryKey: ['candidat-profile'],
    queryFn: () => candidatService.getAll({ utilisateur_id: user?.id }),
  })

  const candidat = candidatData?.data?.[0]

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.prenom} {user?.nom} !
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez votre enrôlement et suivez l'état de votre dossier.
        </p>
      </div>

      {/* Status Overview */}
      {candidat && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">État de mon dossier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut candidature</p>
                <StatusBadge status={candidat.statut_candidat} />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paiement</p>
                <StatusBadge status={candidat.paiement?.statut_paiement || 'en_attente'} />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrôlement</p>
                <StatusBadge status={candidat.enrolement?.statut_enrolement || 'en_attente'} />
              </div>
            </div>
          </div>

          {candidat.numero_dossier && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600">Numéro de dossier</p>
              <p className="text-xl font-bold text-primary-700">{candidat.numero_dossier}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className="card hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Instructions */}
      {!candidat && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <ExclamationCircleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">Commencez votre enrôlement</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Vous n'avez pas encore de dossier d'enrôlement. Cliquez sur "Mon Enrôlement" pour commencer le processus.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
