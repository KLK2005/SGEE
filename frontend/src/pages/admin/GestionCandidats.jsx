import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import { filiereService } from '../../services/filiereService'
import CandidatDetailModal from '../../components/CandidatDetailModal'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  TableCellsIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function GestionCandidats() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filiereFilter, setFiliereFilter] = useState('')
  const [selectedCandidat, setSelectedCandidat] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({})

  const { data: candidatsData, isLoading, error } = useQuery({
    queryKey: ['admin-candidats', search, statusFilter, filiereFilter],
    queryFn: async () => {
      console.log('🔍 Fetching candidats with params:', { search, statut_candidat: statusFilter, filiere_id: filiereFilter })
      const result = await candidatService.getAll({ 
        search, 
        statut_candidat: statusFilter,
        filiere_id: filiereFilter 
      })
      console.log('✅ Candidats received:', result)
      return result
    },
    onError: (err) => {
      console.error('❌ Error fetching candidats:', err)
      toast.error('Erreur lors du chargement des candidats')
    }
  })

  const { data: filieresData } = useQuery({
    queryKey: ['filieres-list'],
    queryFn: () => filiereService.getAll(),
  })

  const candidats = candidatsData?.data || []
  const filieres = filieresData?.data || []

  console.log('📊 Candidats count:', candidats.length)

  const validateMutation = useMutation({
    mutationFn: (enrolementId) => enrolementService.validate(enrolementId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Enrôlement validé')
      setShowDetailModal(false)
      setSelectedCandidat(null)
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erreur'),
  })

  const rejectMutation = useMutation({
    mutationFn: (enrolementId) => enrolementService.reject(enrolementId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Enrôlement rejeté')
      setShowDetailModal(false)
      setSelectedCandidat(null)
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Erreur'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => candidatService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Candidat mis à jour')
      setEditMode(false)
      setShowDetailModal(false)
      setSelectedCandidat(null)
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => candidatService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-candidats'])
      toast.success('Candidat supprimé')
      setShowDetailModal(false)
      setSelectedCandidat(null)
    },
    onError: () => toast.error('Erreur lors de la suppression'),
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
      toast.error('Erreur téléchargement', { id: 'dl-fiche' })
    }
  }

  const handleExportCsv = async () => {
    try {
      toast.loading('Export en cours...', { id: 'export' })
      const blob = await candidatService.exportCsv({
        filiere_id: filiereFilter,
        statut: statusFilter,
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `candidats_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export réussi', { id: 'export' })
    } catch (error) {
      toast.error('Erreur export', { id: 'export' })
    }
  }

  const openEdit = (candidat) => {
    setSelectedCandidat(candidat)
    setEditData({
      nom: candidat.nom,
      prenom: candidat.prenom,
      telephone: candidat.telephone,
      email: candidat.email,
      date_naissance: candidat.date_naissance,
      lieu_naissance: candidat.lieu_naissance,
      nationalite: candidat.nationalite,
      sexe: candidat.sexe,
      filiere_id: candidat.filiere_id,
      adresse_complete: candidat.adresse_complete,
      ville: candidat.ville,
      quartier: candidat.quartier,
      pays: candidat.pays,
      dernier_diplome: candidat.dernier_diplome,
      etablissement_origine: candidat.etablissement_origine,
      niveau_etude: candidat.niveau_etude,
      serie_bac: candidat.serie_bac,
      mention_bac: candidat.mention_bac,
      annee_obtention: candidat.annee_obtention,
    })
    setEditMode(true)
  }

  const handleUpdate = () => {
    updateMutation.mutate({ id: selectedCandidat.id, data: editData })
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
      valide: 'Validé', rejete: 'Rejeté', en_attente: 'En attente',
      en_cours: 'En cours', nouveau: 'Nouveau',
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
        <button onClick={handleExportCsv} className="btn-secondary flex items-center gap-2">
          <TableCellsIcon className="w-5 h-5" />
          Exporter Excel
        </button>
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
          <select
            className="input-field w-full md:w-48"
            value={filiereFilter}
            onChange={(e) => setFiliereFilter(e.target.value)}
          >
            <option value="">Toutes les filières</option>
            {filieres.map(f => (
              <option key={f.id} value={f.id}>{f.nom_filiere}</option>
            ))}
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
                  <td colSpan="6" className="py-8 text-center">
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
                      <p className="font-medium text-gray-900">{candidat.nom} {candidat.prenom}</p>
                      <p className="text-sm text-gray-500">{candidat.email || candidat.telephone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{candidat.filiere?.nom_filiere || '-'}</td>
                    <td className="py-3 px-4">{getStatusBadge(candidat)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {candidat.created_at ? new Date(candidat.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedCandidat(candidat); setShowDetailModal(true); setEditMode(false) }}
                          className="p-2 hover:bg-gray-100 rounded-lg" title="Voir détails">
                          <EyeIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <button onClick={() => openEdit(candidat)}
                          className="p-2 hover:bg-blue-100 rounded-lg" title="Modifier">
                          <PencilIcon className="w-5 h-5 text-blue-600" />
                        </button>
                        <button onClick={() => {
                          if (confirm('Supprimer ce candidat ?')) deleteMutation.mutate(candidat.id)
                        }} className="p-2 hover:bg-red-100 rounded-lg" title="Supprimer">
                          <TrashIcon className="w-5 h-5 text-red-600" />
                        </button>
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
      {showDetailModal && selectedCandidat && (
        <CandidatDetailModal
          candidat={selectedCandidat}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedCandidat(null)
          }}
          onValidate={(enrolementId) => validateMutation.mutate(enrolementId)}
          onReject={(enrolementId) => rejectMutation.mutate(enrolementId)}
          onDownloadFiche={handleDownloadFiche}
        />
      )}

      {/* Edit Modal */}
      {editMode && selectedCandidat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Modifier le candidat</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom</label>
                  <input type="text" className="input-field" value={editData.nom}
                    onChange={(e) => setEditData({...editData, nom: e.target.value})} />
                </div>
                <div>
                  <label className="label">Prénom</label>
                  <input type="text" className="input-field" value={editData.prenom}
                    onChange={(e) => setEditData({...editData, prenom: e.target.value})} />
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input type="text" className="input-field" value={editData.telephone || ''}
                    onChange={(e) => setEditData({...editData, telephone: e.target.value})} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input-field" value={editData.email || ''}
                    onChange={(e) => setEditData({...editData, email: e.target.value})} />
                </div>
                <div>
                  <label className="label">Date de naissance</label>
                  <input type="date" className="input-field" value={editData.date_naissance || ''}
                    onChange={(e) => setEditData({...editData, date_naissance: e.target.value})} />
                </div>
                <div>
                  <label className="label">Lieu de naissance</label>
                  <input type="text" className="input-field" value={editData.lieu_naissance || ''}
                    onChange={(e) => setEditData({...editData, lieu_naissance: e.target.value})} />
                </div>
                <div>
                  <label className="label">Nationalité</label>
                  <input type="text" className="input-field" value={editData.nationalite || ''}
                    onChange={(e) => setEditData({...editData, nationalite: e.target.value})} />
                </div>
                <div>
                  <label className="label">Filière</label>
                  <select className="input-field" value={editData.filiere_id || ''}
                    onChange={(e) => setEditData({...editData, filiere_id: e.target.value})}>
                    <option value="">Sélectionner</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.nom_filiere}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => { setEditMode(false); setSelectedCandidat(null) }} className="btn-secondary">Annuler</button>
              <button onClick={handleUpdate} className="btn-primary" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
