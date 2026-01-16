import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import { paiementService } from '../../services/paiementService'
import toast from 'react-hot-toast'
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export default function MesDocuments() {
  const { user } = useAuthStore()

  const { data: candidatData, isLoading } = useQuery({
    queryKey: ['my-candidat-docs'],
    queryFn: () => candidatService.getAll({ utilisateur_id: user?.id }),
  })

  const candidat = candidatData?.data?.[0]

  const handleDownloadFiche = async () => {
    if (!candidat?.enrolement?.id) return
    try {
      const blob = await enrolementService.downloadFiche(candidat.enrolement.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fiche_enrolement_${candidat.numero_dossier}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Téléchargement réussi')
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  const handleDownloadQuitus = async () => {
    const paiementValide = candidat?.paiements?.find(p => p.statut_paiement === 'valide')
    if (!paiementValide) return
    try {
      const blob = await paiementService.downloadQuitus(paiementValide.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quitus_${candidat.numero_dossier}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Téléchargement réussi')
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!candidat) {
    return (
      <div className="card text-center">
        <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun document disponible</h2>
        <p className="text-gray-600">Vous devez d'abord créer votre dossier d'enrôlement.</p>
      </div>
    )
  }

  const documents = [
    {
      id: 'fiche',
      title: 'Fiche d\'enrôlement',
      description: 'Document officiel avec QR Code de vérification',
      available: candidat.enrolement?.statut_enrolement === 'valide',
      onDownload: handleDownloadFiche,
    },
    {
      id: 'quitus',
      title: 'Quitus de paiement',
      description: 'Attestation de paiement des frais d\'enrôlement',
      available: candidat.paiements?.some(p => p.statut_paiement === 'valide'),
      onDownload: handleDownloadQuitus,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mes Documents</h1>

      {/* Info Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <DocumentTextIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800">Documents officiels</h3>
            <p className="text-blue-700 text-sm mt-1">
              Vos documents sont générés automatiquement après validation de votre dossier et de votre paiement.
              Chaque document contient un QR Code unique pour vérification.
            </p>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${doc.available ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <DocumentTextIcon className={`w-6 h-6 ${doc.available ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                {doc.available ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Disponible</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Non disponible</span>
                  </>
                )}
              </div>

              <button
                onClick={doc.onDownload}
                disabled={!doc.available}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  doc.available
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Info */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Informations du dossier</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Numéro de dossier</p>
            <p className="font-semibold text-gray-900">{candidat.numero_dossier || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Filière</p>
            <p className="font-semibold text-gray-900">{candidat.filiere?.nom || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut enrôlement</p>
            <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
              candidat.enrolement?.statut_enrolement === 'valide' ? 'bg-green-100 text-green-800' :
              candidat.enrolement?.statut_enrolement === 'rejete' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {candidat.enrolement?.statut_enrolement || 'En attente'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut paiement</p>
            <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
              candidat.paiements?.some(p => p.statut_paiement === 'valide') ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {candidat.paiements?.some(p => p.statut_paiement === 'valide') ? 'Payé' : 'En attente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
