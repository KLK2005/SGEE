import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { filiereService } from '../../services/filiereService'
import { departementService } from '../../services/departementService'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, TableCellsIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function GestionFilieres() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingFiliere, setEditingFiliere] = useState(null)
  const [deptFilter, setDeptFilter] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: filieresData, isLoading } = useQuery({
    queryKey: ['admin-filieres'],
    queryFn: () => filiereService.getAll(),
  })

  const { data: departementsData } = useQuery({
    queryKey: ['departements'],
    queryFn: () => departementService.getAll(),
  })

  const allFilieres = filieresData?.data || []
  const departements = departementsData?.data || []
  
  const filieres = deptFilter 
    ? allFilieres.filter(f => f.departement_id == deptFilter)
    : allFilieres

  const createMutation = useMutation({
    mutationFn: filiereService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-filieres'])
      toast.success('Filière créée')
      closeModal()
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => filiereService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-filieres'])
      toast.success('Filière mise à jour')
      closeModal()
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: filiereService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-filieres'])
      toast.success('Filière supprimée')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const openModal = (filiere = null) => {
    setEditingFiliere(filiere)
    if (filiere) {
      reset({
        nom_filiere: filiere.nom_filiere,
        niveau: filiere.niveau,
        description: filiere.description,
        departement_id: filiere.departement_id,
      })
    } else {
      reset({ nom_filiere: '', niveau: 'Licence', description: '', departement_id: '' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingFiliere(null)
    reset()
  }

  const onSubmit = (data) => {
    if (editingFiliere) {
      updateMutation.mutate({ id: editingFiliere.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleExportCsv = async () => {
    try {
      toast.loading('Export...', { id: 'export' })
      const blob = await filiereService.exportCsv({ departement_id: deptFilter })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `filieres_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export réussi', { id: 'export' })
    } catch (error) {
      toast.error('Erreur export', { id: 'export' })
    }
  }

  const totalCandidats = filieres.reduce((sum, f) => sum + (f.candidats_count || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Filières</h1>
        <div className="flex gap-2">
          <button onClick={handleExportCsv} className="btn-secondary flex items-center gap-2">
            <TableCellsIcon className="w-5 h-5" />
            Exporter Excel
          </button>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Nouvelle
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-primary-50">
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="w-10 h-10 text-primary-600" />
            <div>
              <p className="text-sm text-primary-600">Total Filières</p>
              <p className="text-2xl font-bold text-primary-700">{filieres.length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600">Total Candidats</p>
          <p className="text-2xl font-bold text-green-700">{totalCandidats}</p>
        </div>
        <div className="card">
          <label className="label">Filtrer par département</label>
          <select className="input-field" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">Tous les départements</option>
            {departements.map((d) => (
              <option key={d.id} value={d.id}>{d.nom_departement}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Niveau</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Candidats</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan="5" className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </td></tr>
              ) : filieres.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Aucune filière</td></tr>
              ) : (
                filieres.map((filiere) => (
                  <tr key={filiere.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{filiere.nom_filiere}</p>
                      {filiere.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{filiere.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {filiere.departement?.nom_departement || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {filiere.niveau || 'Licence'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">{filiere.candidats_count || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal(filiere)}
                          className="p-2 hover:bg-blue-100 rounded-lg" title="Modifier">
                          <PencilIcon className="w-5 h-5 text-blue-600" />
                        </button>
                        <button onClick={() => {
                          if (confirm('Supprimer cette filière ?')) deleteMutation.mutate(filiere.id)
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingFiliere ? 'Modifier la filière' : 'Nouvelle filière'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Nom de la filière</label>
                <input type="text" className="input-field" placeholder="ex: Informatique"
                  {...register('nom_filiere', { required: 'Requis' })} />
                {errors.nom_filiere && <p className="text-red-500 text-sm mt-1">{errors.nom_filiere.message}</p>}
              </div>
              <div>
                <label className="label">Département</label>
                <select className="input-field" {...register('departement_id', { required: 'Requis' })}>
                  <option value="">Sélectionner</option>
                  {departements.map((d) => (
                    <option key={d.id} value={d.id}>{d.nom_departement}</option>
                  ))}
                </select>
                {errors.departement_id && <p className="text-red-500 text-sm mt-1">{errors.departement_id.message}</p>}
              </div>
              <div>
                <label className="label">Niveau</label>
                <select className="input-field" {...register('niveau')}>
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                  <option value="Doctorat">Doctorat</option>
                  <option value="BTS">BTS</option>
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field" rows="3" placeholder="Description..."
                  {...register('description')} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" className="btn-primary flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingFiliere ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
