import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { paiementService } from '../../services/paiementService'
import toast from 'react-hot-toast'
import {
  CreditCardIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export default function MesPaiements() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [preuvePaiement, setPreuvePaiement] = useState(null)
  const [montant, setMontant] = useState(50000)
  const [modePaiement, setModePaiement] = useState('mobile_money')

  // Fetch mon candidat
  const { data: candidatResponse, isLoading: loadingCandidat } = useQuery({
    queryKey: ['mon-candidat-paiements'],
    queryFn: async () => (await api.get('/mon-candidat')).data,
  })

  // Fetch mes paiements
  const { data: paiementsResponse, isLoading: loadingPaiements } = useQuery({
    queryKey: ['mes-paiements'],
    queryFn: async () => (await api.get('/mes-paiements')).data,
  })

  const candidat = candidatResponse?.data
  const paiements = paiementsResponse?.data || []

  const createPaiementMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData()
      formData.append('candidat_id', data.candidat_id)
      formData.append('enrolement_id', data.enrolement_id)
      formData.append('montant', data.montant)
      formData.append('mode_paiement', data.mode_paiement)
      formData.append('date_paiement', new Date().toISOString().split('T')[0])
      if (data.preuve_paiement) {
        formData.append('preuve_paiement', data.preuve_paiement)
      }
      return (await api.post('/paiements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mes-paiements'])
      queryClient.invalidateQueries(['mon-candidat-paiements'])
      toast.success('Paiement soumis avec succès!')
      setShowModal(false)
      setPreuvePaiement(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la soumission')
    },
  })

  const handleSubmitPaiement = () => {
    if (!candidat) return

    createPaiementMutation.mutate({
      candidat_id: candidat.id,
      enrolement_id: candidat.enrolement?.id,
      montant: montant,
      mode_paiement: modePaiement,
      preuve_paiement: preuvePaiement,
    })
  }

  const handleDownloadQuitus = async (paiementId) => {
    try {
      toast.loading('Téléchargement en cours...', { id: 'download-quitus' })
      const blob = await paiementService.downloadQuitus(paiementId)
      
      if (blob.size === 0) {
        throw new Error('Fichier vide')
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `quitus_${paiementId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Téléchargement réussi', { id: 'download-quitus' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error(error.response?.data?.message || 'Erreur lors du téléchargement', { id: 'download-quitus' })
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

  const hasPaiementValide = paiements.some(p => p.statut_paiement === 'valide')
  const hasPaiementEnAttente = paiements.some(p => p.statut_paiement === 'en_attente')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes Paiements</h1>
        {candidat.enrolement && !hasPaiementValide && !hasPaiementEnAttente && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
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

      {/* Candidat Info */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Informations du dossier</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Numéro de dossier</p>
            <p className="font-semibold">{candidat.numero_dossier}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nom complet</p>
            <p className="font-semibold">{candidat.nom} {candidat.prenom}</p>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Historique des paiements</h2>
        
        {paiements.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun paiement enregistré</p>
            {!candidat.enrolement && (
              <p className="text-sm text-orange-600 mt-2">
                Vous devez d'abord soumettre votre enrôlement
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paiements.map((paiement) => (
              <div key={paiement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    paiement.statut_paiement === 'valide' ? 'bg-green-100' :
                    paiement.statut_paiement === 'rejete' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {paiement.statut_paiement === 'valide' ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    ) : paiement.statut_paiement === 'rejete' ? (
                      <XCircleIcon className="w-6 h-6 text-red-600" />
                    ) : (
                      <ClockIcon className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {Number(paiement.montant).toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-gray-500">
                      {paiement.date_paiement ? new Date(paiement.date_paiement).toLocaleDateString('fr-FR') : '-'}
                      {' • '}{paiement.mode_paiement?.replace('_', ' ')}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Soumettre un paiement</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Montant (FCFA)</label>
                <input
                  type="number"
                  className="input-field"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Mode de paiement</label>
                <select
                  className="input-field"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                >
                  <option value="mobile_money">Mobile Money</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="espece">Espèces</option>
                </select>
              </div>

              <div>
                <label className="label">Preuve de paiement (optionnel)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <label className="cursor-pointer">
                    <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
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
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Annuler
              </button>
              <button
                onClick={handleSubmitPaiement}
                disabled={createPaiementMutation.isPending}
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
