import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline'

export default function DossierValide() {
  const { user } = useAuthStore()

  // Fetch mon enrôlement et candidat
  const { data: enrolementData, isLoading: loadingEnrolement } = useQuery({
    queryKey: ['mon-enrolement'],
    queryFn: async () => (await api.get('/mon-enrolement')).data,
  })

  const candidat = enrolementData?.candidat
  const enrolement = enrolementData?.data

  const handleDownloadDossier = async () => {
    if (!enrolement?.id) {
      toast.error('Aucun enrôlement trouvé')
      return
    }

    try {
      toast.loading('Génération du PDF...', { id: 'download-dossier' })
      
      const response = await api.get(`/enrolements/${enrolement.id}/download-fiche`, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dossier_${candidat?.numero_dossier || 'candidat'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Téléchargement réussi', { id: 'download-dossier' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement', { id: 'download-dossier' })
    }
  }

  if (loadingEnrolement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Si pas d'enrôlement ou pas validé
  if (!enrolement || enrolement.statut_enrolement !== 'valide') {
    return (
      <div className="card text-center py-12">
        <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Dossier non validé
        </h3>
        <p className="text-gray-600">
          Votre dossier n'a pas encore été validé par l'administration.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mon Dossier Validé</h1>
        <button
          onClick={handleDownloadDossier}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Télécharger le PDF
        </button>
      </div>

      {/* Success Banner */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="flex items-center gap-4">
          <CheckCircleIcon className="w-12 h-12 text-green-600 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-green-900">Dossier Validé ✓</h2>
            <p className="text-green-700 mt-1">
              Votre dossier d'enrôlement a été validé par l'administration. Vous pouvez maintenant télécharger votre attestation officielle.
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidat Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <IdentificationIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Informations Personnelles</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase">Numéro de Dossier</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{candidat?.numero_dossier}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-semibold text-gray-900">{candidat?.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-semibold text-gray-900">{candidat?.prenom}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date de naissance</p>
                <p className="font-semibold text-gray-900">
                  {candidat?.date_naissance ? new Date(candidat.date_naissance).toLocaleDateString('fr-FR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sexe</p>
                <p className="font-semibold text-gray-900">{candidat?.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nationalité</p>
              <p className="font-semibold text-gray-900">{candidat?.nationalite}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-semibold text-gray-900">{candidat?.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900 truncate">{candidat?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolement Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <AcademicCapIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Informations d'Enrôlement</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase">École</p>
              <p className="text-xl font-bold text-purple-600 mt-1">
                {enrolement?.candidat?.filiere?.ecole?.nom_ecole || 'Non spécifiée'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p className="font-semibold text-gray-900">
                {enrolement?.candidat?.filiere?.departement?.nom_departement || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Filière</p>
              <p className="font-semibold text-gray-900">
                {enrolement?.candidat?.filiere?.nom_filiere || '-'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Niveau</p>
                <p className="font-semibold text-gray-900">{enrolement?.niveau || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Validé
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date de validation</p>
              <p className="font-semibold text-gray-900">
                {enrolement?.updated_at ? new Date(enrolement.updated_at).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* School Info Card */}
      {enrolement?.candidat?.filiere?.ecole && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <BuildingLibraryIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Détails de l'École</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolement.candidat.filiere.ecole.logo_url && (
              <div className="flex justify-center">
                <img
                  src={enrolement.candidat.filiere.ecole.logo_url}
                  alt={enrolement.candidat.filiere.ecole.nom_ecole}
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nom de l'école</p>
                <p className="font-semibold text-gray-900">{enrolement.candidat.filiere.ecole.nom_ecole}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-semibold text-gray-900">{enrolement.candidat.filiere.ecole.type_ecole}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ville</p>
                  <p className="font-semibold text-gray-900">{enrolement.candidat.filiere.ecole.ville}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold text-gray-900">{enrolement.candidat.filiere.ecole.telephone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900 truncate">{enrolement.candidat.filiere.ecole.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Info */}
      <div className="card bg-amber-50 border-2 border-amber-200">
        <div className="flex items-start gap-4">
          <DocumentTextIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-900">À propos du PDF</h3>
            <ul className="text-amber-800 text-sm mt-2 space-y-1">
              <li>✓ Contient votre numéro de dossier unique</li>
              <li>✓ Inclut un code QR pour vérification</li>
              <li>✓ Affiche le nom de votre école d'inscription</li>
              <li>✓ Document officiel signé numériquement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
