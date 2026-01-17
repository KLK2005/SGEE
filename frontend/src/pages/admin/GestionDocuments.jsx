import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

export default function GestionDocuments() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data: documentsData, isLoading } = useQuery({
    queryKey: ['admin-documents', statusFilter, typeFilter],
    queryFn: async () => {
      const response = await api.get('/candidats', { 
        params: { per_page: 100 } 
      })
      const candidats = response.data.data
      const allDocs = []
      candidats.forEach(c => {
        if (c.documents) {
          c.documents.forEach(doc => {
            allDocs.push({ ...doc, candidat: c })
          })
        }
      })
      return allDocs
    },
  })

  const documents = (documentsData || []).filter(doc => {
    if (statusFilter && doc.statut_verification !== statusFilter) return false
    if (typeFilter && doc.type_document !== typeFilter) return false
    return true
  })

  const validateMutation = useMutation({
    mutationFn: (id) => api.post(`/documents/${id}/validate`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-documents'])
      toast.success('Document validé')
      setSelectedDoc(null)
    },
    onError: () => toast.error('Erreur lors de la validation'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, motif }) => api.post(`/documents/${id}/reject`, { motif_rejet: motif }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-documents'])
      toast.success('Document rejeté')
      setSelectedDoc(null)
      setRejectReason('')
    },
    onError: () => toast.error('Erreur lors du rejet'),
  })

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Veuillez indiquer un motif de rejet')
      return
    }
    rejectMutation.mutate({ id: selectedDoc.id, motif: rejectReason })
  }

  const getStatusBadge = (status) => {
    const styles = {
      valide: 'bg-green-100 text-green-800',
      rejete: 'bg-red-100 text-red-800',
      en_attente: 'bg-yellow-100 text-yellow-800',
    }
    const labels = {
      valide: 'Validé',
      rejete: 'Rejeté',
      en_attente: 'En attente',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getTypeLabel = (type) => {
    const labels = {
      photo_identite: 'Photo d\'identité',
      acte_naissance: 'Acte de naissance',
      diplome: 'Diplôme',
      certificat_nationalite: 'Certificat de nationalité',
      autre: 'Autre',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Documents</h1>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
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
          <select
            className="input-field w-full md:w-48"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="photo_identite">Photo d'identité</option>
            <option value="acte_naissance">Acte de naissance</option>
            <option value="diplome">Diplôme</option>
            <option value="certificat_nationalite">Certificat de nationalité</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-600">Total</p>
          <p className="text-2xl font-bold text-blue-700">{documents.length}</p>
        </div>
        <div className="card bg-yellow-50">
          <p className="text-sm text-yellow-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-700">
            {documents.filter(d => d.statut_verification === 'en_attente').length}
          </p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600">Validés</p>
          <p className="text-2xl font-bold text-green-700">
            {documents.filter(d => d.statut_verification === 'valide').length}
          </p>
        </div>
        <div className="card bg-red-50">
          <p className="text-sm text-red-600">Rejetés</p>
          <p className="text-2xl font-bold text-red-700">
            {documents.filter(d => d.statut_verification === 'rejete').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Candidat</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date upload</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">Aucun document trouvé</td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {doc.candidat?.nom} {doc.candidat?.prenom}
                      </p>
                      <p className="text-sm text-gray-500">{doc.candidat?.numero_dossier}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{getTypeLabel(doc.type_document)}</td>
                    <td className="py-3 px-4">{getStatusBadge(doc.statut_verification)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {doc.date_upload ? new Date(doc.date_upload).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Voir"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        {doc.statut_verification === 'en_attente' && (
                          <>
                            <button
                              onClick={() => validateMutation.mutate(doc.id)}
                              className="p-2 hover:bg-green-100 rounded-lg"
                              title="Valider"
                            >
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDoc(doc)
                                setRejectReason('')
                              }}
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

      {/* Detail/Reject Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document - {getTypeLabel(selectedDoc.type_document)}</h3>
              {getStatusBadge(selectedDoc.statut_verification)}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Candidat</p>
                  <p className="font-medium">
                    {selectedDoc.candidat?.nom} {selectedDoc.candidat?.prenom}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° Dossier</p>
                  <p className="font-medium">{selectedDoc.candidat?.numero_dossier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type de document</p>
                  <p className="font-medium">{getTypeLabel(selectedDoc.type_document)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date d'upload</p>
                  <p className="font-medium">
                    {selectedDoc.date_upload ? new Date(selectedDoc.date_upload).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
              </div>

              {/* Document preview */}
              {selectedDoc.fichier && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Aperçu du document</p>
                  <a
                    href={`http://127.0.0.1:8000/storage/${selectedDoc.fichier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    Ouvrir le document
                  </a>
                </div>
              )}

              {/* Reject reason */}
              {selectedDoc.statut_verification === 'rejete' && selectedDoc.motif_rejet && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">Motif de rejet</p>
                  <p className="text-red-600">{selectedDoc.motif_rejet}</p>
                </div>
              )}

              {/* Reject form */}
              {selectedDoc.statut_verification === 'en_attente' && (
                <div className="pt-4 border-t">
                  <label className="label">Motif de rejet (optionnel)</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Indiquez la raison du rejet..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}

              {/* Actions */}
              {selectedDoc.statut_verification === 'en_attente' && (
                <div className="pt-4 border-t flex gap-3">
                  <button
                    onClick={() => validateMutation.mutate(selectedDoc.id)}
                    className="btn-primary flex items-center gap-2"
                    disabled={validateMutation.isPending}
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Valider
                  </button>
                  <button
                    onClick={handleReject}
                    className="btn-secondary text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                    disabled={rejectMutation.isPending}
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button onClick={() => { setSelectedDoc(null); setRejectReason('') }} className="btn-secondary">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
