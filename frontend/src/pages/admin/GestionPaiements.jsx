import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paiementService } from '../../services/paiementService'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

export default function GestionPaiements() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPaiement, setSelectedPaiement] = useState(null)

  const { data: paiementsData, isLoading } = useQuery({
    queryKey: ['admin-paiements', statusFilter],
    queryFn: () => paiementService.getAll({ statut: statusFilter }),
  })

  const paiements = paiementsData?.data || []

  const validateMutation = useMutation({
    mutationFn: paiementService.validate,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-paiements'])
      toast.success('Paiement validé')
      setSelectedPaiement(null)
    },
    onError: () => toast.error('Erreur lors de la validation'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => paiementService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-paiements'])
      toast.success('Paiement mis à jour')
      setSelectedPaiement(null)
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const handleDownloadQuitus = async (paiementId) => {
    try {
      toast.loading('Téléchargement...', { id: 'dl-quitus' })
      const blob = await paiementService.downloadQuitus(paiementId)
      if (blob.size === 0) throw new Error('Fichier vide')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `quitus_${paiementId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Téléchargé', { id: 'dl-quitus' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement', { id: 'dl-quitus' })
    }
  }

  const stats = {
    total: paiements.length,
    valides: paiements.filter(p => p.statut_paiement === 'valide').length,
    en_attente: paiements.filter(p => p.statut_paiement === 'en_attente').length,
    montant_total: paiements.filter(p => p.statut_paiement === 'valide').reduce((sum, p) => sum + (p.montant || 0), 0),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Validés</p>
          <p className="text-2xl font-bold text-green-600">{stats.valides}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.en_attente}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Montant total</p>
          <p className="text-2xl font-bold text-primary-600">{stats.montant_total.toLocaleString()} FCFA</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
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

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Candidat</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Montant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mode</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-500">Chargement...</td></tr>
              ) : paiements.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-500">Aucun paiement</td></tr>
              ) : (
                paiements.map((paiement) => (
                  <tr key={paiement.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {paiement.candidat?.nom} {paiement.candidat?.prenom}
                        </p>
                        <p className="text-sm text-gray-500">{paiement.candidat?.numero_dossier}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {paiement.montant?.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4 text-gray-600 capitalize">{paiement.mode_paiement}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        paiement.statut_paiement === 'valide' ? 'bg-green-100 text-green-800' :
                        paiement.statut_paiement === 'rejete' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {paiement.statut_paiement === 'valide' ? 'Validé' :
                         paiement.statut_paiement === 'rejete' ? 'Rejeté' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPaiement(paiement)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Voir détails"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        {paiement.statut_paiement === 'en_attente' && (
                          <>
                            <button
                              onClick={() => validateMutation.mutate(paiement.id)}
                              className="p-2 hover:bg-green-100 rounded-lg"
                              title="Valider"
                            >
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: paiement.id, data: { statut_paiement: 'rejete' } })}
                              className="p-2 hover:bg-red-100 rounded-lg"
                              title="Rejeter"
                            >
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            </button>
                          </>
                        )}
                        {paiement.statut_paiement === 'valide' && (
                          <button
                            onClick={() => handleDownloadQuitus(paiement.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Télécharger quitus"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5 text-primary-600" />
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
      {selectedPaiement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Détails du paiement</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Candidat</p>
                  <p className="font-medium">{selectedPaiement.candidat?.nom} {selectedPaiement.candidat?.prenom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° Dossier</p>
                  <p className="font-medium">{selectedPaiement.candidat?.numero_dossier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="font-medium">{selectedPaiement.montant?.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mode de paiement</p>
                  <p className="font-medium capitalize">{selectedPaiement.mode_paiement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedPaiement.date_paiement).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Référence</p>
                  <p className="font-medium">{selectedPaiement.reference || '-'}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setSelectedPaiement(null)} className="btn-secondary">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
