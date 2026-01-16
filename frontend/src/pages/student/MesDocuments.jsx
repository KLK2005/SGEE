import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import { paiementService } from '../../services/paiementService'
import { documentService } from '../../services/documentService'
import toast from 'react-hot-toast'
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  CloudArrowUpIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function MesDocuments() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(null)

  const { data: candidatData, isLoading, refetch } = useQuery({
    queryKey: ['my-candidat-docs'],
    queryFn: () => candidatService.getAll({ utilisateur_id: user?.id }),
  })

  const candidat = candidatData?.data?.[0]

  // Fetch documents for candidat
  const { data: documentsData } = useQuery({
    queryKey: ['my-documents', candidat?.id],
    queryFn: () => documentService.getByCandidat(candidat.id),
    enabled: !!candidat?.id,
  })

  const uploadedDocs = documentsData?.data || []

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

  const handleUploadDocument = async (typeDocument, file) => {
    if (!candidat?.id || !file) return
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 5MB)')
      return
    }

    setUploading(typeDocument)
    try {
      await documentService.upload(candidat.id, typeDocument, file)
      toast.success('Document uploadé avec succès')
      queryClient.invalidateQueries(['my-documents'])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteDocument = async (docId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return
    
    try {
      await documentService.delete(docId)
      toast.success('Document supprimé')
      queryClient.invalidateQueries(['my-documents'])
    } catch (error) {
      toast.error('Erreur lors de la suppression')
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

  const officialDocuments = [
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

  const documentTypes = [
    { key: 'photo_identite', label: 'Photo d\'identité' },
    { key: 'acte_naissance', label: 'Acte de naissance' },
    { key: 'diplome', label: 'Diplôme ou attestation' },
    { key: 'certificat_nationalite', label: 'Certificat de nationalité' },
  ]

  const getDocumentByType = (type) => uploadedDocs.find(d => d.type_document === type)

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
            </p>
          </div>
        </div>
      </div>

      {/* Official Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {officialDocuments.map((doc) => (
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

      {/* Uploaded Documents Section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Documents téléversés</h2>
        <div className="space-y-3">
          {documentTypes.map((docType) => {
            const uploadedDoc = getDocumentByType(docType.key)
            return (
              <div key={docType.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className={`w-5 h-5 ${uploadedDoc ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-700">{docType.label}</p>
                    {uploadedDoc && (
                      <p className="text-xs text-gray-500">
                        Statut: {uploadedDoc.statut_verification === 'valide' ? 'Validé' : 
                                uploadedDoc.statut_verification === 'rejete' ? 'Rejeté' : 'En attente'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {uploadedDoc ? (
                    <>
                      <a 
                        href={uploadedDoc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Voir
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(uploadedDoc.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer">
                      <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded ${
                        uploading === docType.key 
                          ? 'bg-gray-200 text-gray-500' 
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}>
                        {uploading === docType.key ? (
                          'Upload...'
                        ) : (
                          <>
                            <CloudArrowUpIcon className="w-4 h-4" />
                            Ajouter
                          </>
                        )}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        disabled={uploading === docType.key}
                        onChange={(e) => handleUploadDocument(docType.key, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>
            )
          })}
        </div>
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
            <p className="font-semibold text-gray-900">{candidat.filiere?.nom_filiere || candidat.filiere?.nom || '-'}</p>
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
