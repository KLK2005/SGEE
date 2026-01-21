import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrolementService } from '../../services/enrolementService'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

export default function GestionEnrolements() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedEnrolement, setSelectedEnrolement] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { data: enrolementsData, isLoading } = useQuery({
    queryKey: ['admin-enrolements', search, statusFilter],
    queryFn: async () => {
      const params = {}
      if (statusFilter) params.statut_enrolement = statusFilter
      const result = await enrolementService.getAll(params)
      return result
    },
  })

  const enrolements = enrolementsData?.data || []

  const validateMutation = useMutation({
    mutationFn: (enrolementId) => enrolementService.validate(enrolementId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-enrolements'])
      toast.success('Enrôlement validé')
      setShowDetailModal(false)
      setSelectedEnrolement(null)
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erreur'),
  })

  const rejectMutation = useMutation({
    mutationFn: (enrolementId) => enrolementService.reject(enrolementId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-enrolements'])
      toast.success('Enrôlement rejeté')
      setShowDetailModal(false)
      setSelectedEnrolement(null)
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erreur'),
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valide':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✓ Validé</span>
      case 'rejete':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">✗ Rejeté</span>
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">⏳ En attente</span>
    }
  }

  const filteredEnrolements = enrolements.filter(e => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      e.candidat?.nom?.toLowerCase().includes(searchLower) ||
      e.candidat?.prenom?.toLowerCase().includes(searchLower) ||
      e.candidat?.numero_dossier?.toLowerCase().includes(searchLower) ||
      e.candidat?.email?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Enrôlements</h1>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-primary-600">{enrolements.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Rechercher</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, prénom, email, numéro dossier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('')
              }}
              className="btn-secondary w-full"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Enrolements Table */}
      <div className="card overflow-hidden">
        {filteredEnrolements.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun enrôlement trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Candidat</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">École</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Filière</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Niveau</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEnrolements.map((enrolement) => (
                  <tr key={enrolement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {enrolement.candidat?.prenom} {enrolement.candidat?.nom}
                        </p>
                        <p className="text-sm text-gray-500">{enrolement.candidat?.numero_dossier}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BuildingLibraryIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900">{enrolement.ecole?.nom_ecole || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-900">{enrolement.filiere?.nom_filiere || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{enrolement.niveau || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enrolement.statut_enrolement)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(enrolement.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedEnrolement(enrolement)
                          setShowDetailModal(true)
                        }}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEnrolement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Détails de l'Enrôlement</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Candidat Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  Informations du Candidat
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Numéro de dossier</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.candidat?.numero_dossier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-semibold text-gray-900">
                      {selectedEnrolement.candidat?.prenom} {selectedEnrolement.candidat?.nom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.candidat?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.candidat?.telephone}</p>
                  </div>
                </div>
              </div>

              {/* Enrollment Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                  Informations d'Enrôlement
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">École</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.ecole?.nom_ecole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Département</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.departement?.nom_departement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Filière</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.filiere?.nom_filiere}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Niveau</p>
                    <p className="font-semibold text-gray-900">{selectedEnrolement.niveau}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date d'enrôlement</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedEnrolement.date_enrolement).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    {getStatusBadge(selectedEnrolement.statut_enrolement)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedEnrolement.statut_enrolement === 'en_attente' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => validateMutation.mutate(selectedEnrolement.id)}
                    disabled={validateMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Valider
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(selectedEnrolement.id)}
                    disabled={rejectMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
