import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

export default function GestionCandidats() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedCandidat, setSelectedCandidat] = useState(null)

  const { data: candidatsData, isLoading } = useQuery({
    queryKey: ['admin-candidats', search, statusFilter],
    queryFn: () => candidatService.getAll({ search, statut_candidat: statusFilter }),
  })

  const candidats = candidatsData?.data || []

  // Mutation pour valider l'enrôlement
  const validateEnrolementMutation = useMutation({
    mutationFn: (enrolementId) => enrolementService.validate(enrolementId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Enrôlement validé avec succès')
      setSelectedCandidat(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la validation')
    },
  })

  // Mutation pour rejeter l'enrôlement
  const rejectEnrolementMutation = useMutation({
    mutationFn: (enrolementId) => enrolementService.reject(enrolementId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Enrôlement rejeté')
      setSelectedCandidat(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors du rejet')
    },
  })

  const handleDownloadFiche = async (enrolementId) => {
    try {
      toast.loading('Téléchargement...', { id: 'dl-fiche' })
      const blob = await enrolementService.downloadFiche(enrolementId)
      if (blob.size === 0) throw new Error('Fichier vide')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `fiche_enrolement.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Téléchargé', { id: 'dl-fiche' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement', { id: 'dl-fiche' })
    }
  }

  const getStatusBadge = (candidat) => {
    const status = candidat.enrolement?.statut_enrolement || candidat.statut_candidat || 'nouveau'
    const styles = {
      valide: 'bg-green-100 text-green-800',
      rejete: 'bg-red-100 text-red-800',
      en_attente: 'bg-yellow-100 text-yellow-800',
      en_cours: 'bg-blue-100 text-blue-800',
      nouveau: 'bg-gray-100 text-gray-800',
    }
    const labels = {
      valide: 'Validé',
      rejete: 'Rejeté',
      en_attente: 'En attente',
      en_cours: 'En cours',
      nouveau: 'Nouveau',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.nouveau}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Candidats</h1>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, numéro..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="en_cours">En cours</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-600">Total</p>
          <p className="text-2xl font-bold text-blue-700">{candidats.length}</p>
        </div>
        <div className="card bg-yellow-50">
          <p className="text-sm text-yellow-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-700">
            {candidats.filter(c => c.enrolement?.statut_enrolement === 'en_attente').length}
          </p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600">Validés</p>
          <p className="text-2xl font-bold text-green-700">
            {candidats.filter(c => c.enrolement?.statut_enrolement === 'valide').length}
          </p>
        </div>
        <div className="card bg-red-50">
          <p className="text-sm text-red-600">Rejetés</p>
          <p className="text-2xl font-bold text-red-700">
            {candidats.filter(c => c.enrolement?.statut_enrolement === 'rejete').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">N° Dossier</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom complet</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Filière</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : candidats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">Aucun candidat trouvé</td>
                </tr>
              ) : (
                candidats.map((candidat) => (
                  <tr key={candidat.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{candidat.numero_dossier || '-'}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{candidat.nom} {candidat.prenom}</p>
                        <p className="text-sm text-gray-500">{candidat.email || candidat.telephone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {candidat.filiere?.nom_filiere || candidat.filiere?.nom || '-'}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(candidat)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {candidat.created_at ? new Date(candidat.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCandidat(candidat)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Voir détails"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        {candidat.enrolement && candidat.enrolement.statut_enrolement === 'en_attente' && (
                          <>
                            <button
                              onClick={() => validateEnrolementMutation.mutate(candidat.enrolement.id)}
                              className="p-2 hover:bg-green-100 rounded-lg"
                              title="Valider l'enrôlement"
                              disabled={validateEnrolementMutation.isPending}
                            >
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => rejectEnrolementMutation.mutate(candidat.enrolement.id)}
                              className="p-2 hover:bg-red-100 rounded-lg"
                              title="Rejeter l'enrôlement"
                              disabled={rejectEnrolementMutation.isPending}
                            >
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            </button>
                          </>
                        )}
                        {candidat.enrolement && (
                          <button
                            onClick={() => handleDownloadFiche(candidat.enrolement.id)}
                            className="p-2 hover:bg-blue-100 rounded-lg"
                            title="Télécharger la fiche"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5 text-blue-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCandidat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Détails du candidat</h3>
              {getStatusBadge(selectedCandidat)}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{selectedCandidat.nom} {selectedCandidat.prenom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° Dossier</p>
                  <p className="font-medium">{selectedCandidat.numero_dossier || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">{selectedCandidat.date_naissance || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lieu de naissance</p>
                  <p className="font-medium">{selectedCandidat.lieu_naissance || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{selectedCandidat.telephone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedCandidat.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Filière</p>
                  <p className="font-medium">{selectedCandidat.filiere?.nom_filiere || selectedCandidat.filiere?.nom || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationalité</p>
                  <p className="font-medium">{selectedCandidat.nationalite || '-'}</p>
                </div>
              </div>

              {/* Documents */}
              {selectedCandidat.documents && selectedCandidat.documents.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Documents téléversés</h4>
                  <div className="space-y-2">
                    {selectedCandidat.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-sm">{doc.type_document}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          doc.statut_verification === 'valide' ? 'bg-green-100 text-green-700' :
                          doc.statut_verification === 'rejete' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.statut_verification}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedCandidat.enrolement && selectedCandidat.enrolement.statut_enrolement === 'en_attente' && (
                <div className="pt-4 border-t flex gap-3">
                  <button
                    onClick={() => validateEnrolementMutation.mutate(selectedCandidat.enrolement.id)}
                    className="btn-primary flex items-center gap-2"
                    disabled={validateEnrolementMutation.isPending}
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Valider l'enrôlement
                  </button>
                  <button
                    onClick={() => rejectEnrolementMutation.mutate(selectedCandidat.enrolement.id)}
                    className="btn-secondary text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                    disabled={rejectEnrolementMutation.isPending}
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Rejeter
                  </button>
                </div>
              )}

              {selectedCandidat.enrolement && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleDownloadFiche(selectedCandidat.enrolement.id)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Télécharger la fiche d'enrôlement
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button onClick={() => setSelectedCandidat(null)} className="btn-secondary">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
