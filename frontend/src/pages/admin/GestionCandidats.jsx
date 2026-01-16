import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

export default function GestionCandidats() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedCandidat, setSelectedCandidat] = useState(null)

  const { data: candidatsData, isLoading } = useQuery({
    queryKey: ['admin-candidats', search, statusFilter],
    queryFn: () => candidatService.getAll({ search, statut: statusFilter }),
  })

  const candidats = candidatsData?.data || []

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => candidatService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Statut mis à jour')
      setSelectedCandidat(null)
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const handleExport = async (format) => {
    try {
      const blob = await candidatService.export(format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `candidats.${format}`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export réussi')
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    }
  }

  const handleDownloadFiche = async (enrolementId) => {
    try {
      const blob = await enrolementService.downloadFiche(enrolementId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fiche_enrolement.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Candidats</h1>
        <div className="flex gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-primary flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export PDF
          </button>
        </div>
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
            <option value="en_attente">En attente</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
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
                  <td colSpan="6" className="py-8 text-center text-gray-500">Chargement...</td>
                </tr>
              ) : candidats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">Aucun candidat trouvé</td>
                </tr>
              ) : (
                candidats.map((candidat) => (
                  <tr key={candidat.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{candidat.numero_dossier}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{candidat.nom} {candidat.prenom}</p>
                        <p className="text-sm text-gray-500">{candidat.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{candidat.filiere?.nom_filiere || candidat.filiere?.nom || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidat.statut_candidat === 'valide' ? 'bg-green-100 text-green-800' :
                        candidat.statut_candidat === 'rejete' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {candidat.statut_candidat === 'valide' ? 'Validé' :
                         candidat.statut_candidat === 'rejete' ? 'Rejeté' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(candidat.created_at).toLocaleDateString('fr-FR')}
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
                        {candidat.statut_candidat === 'en_attente' && (
                          <>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: candidat.id, status: 'valide' })}
                              className="p-2 hover:bg-green-100 rounded-lg"
                              title="Valider"
                            >
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: candidat.id, status: 'rejete' })}
                              className="p-2 hover:bg-red-100 rounded-lg"
                              title="Rejeter"
                            >
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            </button>
                          </>
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
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Détails du candidat</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{selectedCandidat.nom} {selectedCandidat.prenom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° Dossier</p>
                  <p className="font-medium">{selectedCandidat.numero_dossier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">{selectedCandidat.date_naissance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lieu de naissance</p>
                  <p className="font-medium">{selectedCandidat.lieu_naissance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{selectedCandidat.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Filière</p>
                  <p className="font-medium">{selectedCandidat.filiere?.nom}</p>
                </div>
              </div>

              {selectedCandidat.enrolement && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleDownloadFiche(selectedCandidat.enrolement.id)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Télécharger la fiche
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
