import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { paiementService } from '../../services/paiementService'
import { candidatService } from '../../services/candidatService'
import toast from 'react-hot-toast'
import {
  CreditCardIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function MesPaiements() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [preuvePaiement, setPreuvePaiement] = useState(null)

  const { data: candidatData, isLoading: loadingCandidat } = useQuery({
    queryKey: ['my-candidat-paiement'],
    queryFn: () => candidatService.getAll({ utilisateur_id: user?.id }),
  })

  const candidat = candidatData?.data?.[0]

  const { data: paiementsData, isLoading: loadingPaiements } = useQuery({
    queryKey: ['my-paiements', candidat?.id],
    queryFn: () => paiementService.getAll({ candidat_id: candidat?.id }),
    enabled: !!candidat?.id,
  })

  const paiements = paiementsData?.data || []

  const createPaiementMutation = useMutation({
    mutationFn: paiementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-paiements'])
      toast.success('Preuve de paiement soumise !')
      setShowUploadModal(false)
      setPreuvePaiement(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la soumission')
    },
  })

  const handleSubmitPaiement = () => {
    if (!preuvePaiement || !candidat) return

    createPaiementMutation.mutate({
      candidat_id: candidat.id,
      enrolement_id: candidat.enrolement?.id,
      montant: 50000, // Montant fixe ou à récupérer
      mode_paiement: 'virement',
      preuve_paiement: preuvePaiement,
    })
  }

  const handleDownloadQuitus = async (paiementId) => {
    try {
      const blob = await paiementService.downloadQuitus(paiementId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quitus_${paiementId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  if (loadingCandidat || loadingPaiements) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!candidat) {
    return (
      <div className="card text-center">
        <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun dossier trouvé</h2>
        <p className="text-gray-600">Vous devez d'abord créer votre dossier d'enrôlement.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes Paiements</h1>
        {candidat.enrolement && !paiements.some(p => p.statut_paiement === 'valide') && (
          <button onClick={() => setShowUploadModal(true)} className="btn-primary">
            Soumettre un paiement
          </button>
        )}
      </div>

      {/* Payment Info Card */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100">Frais d'enrôlement</p>
            <p className="text-3xl font-bold mt-1">50 000 FCFA</p>
          </div>
          <CreditCardIcon className="w-16 h-16 text-primary-300" />
        </div>
      </div>

      {/* Payments List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Historique des paiements</h2>
        
        {paiements.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun paiement enregistré</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paiements.map((paiement) => (
              <div
                key={paiement.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    paiement.statut_paiement === 'valide' ? 'bg-green-100' :
                    paiement.statut_paiement === 'rejete' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {paiement.statut_paiement === 'valide' ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    ) : (
                      <ClockIcon className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {paiement.montant?.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    paiement.statut_paiement === 'valide' ? 'bg-green-100 text-green-800' :
                    paiement.statut_paiement === 'rejete' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {paiement.statut_paiement === 'valide' ? 'Validé' :
                     paiement.statut_paiement === 'rejete' ? 'Rejeté' : 'En attente'}
                  </span>

                  {paiement.statut_paiement === 'valide' && (
                    <button
                      onClick={() => handleDownloadQuitus(paiement.id)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Quitus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Soumettre une preuve de paiement</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <label className="cursor-pointer">
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  {preuvePaiement ? preuvePaiement.name : 'Cliquez pour téléverser'}
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => setPreuvePaiement(e.target.files[0])}
                />
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitPaiement}
                disabled={!preuvePaiement || createPaiementMutation.isPending}
                className="btn-primary flex-1"
              >
                {createPaiementMutation.isPending ? 'Envoi...' : 'Soumettre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
