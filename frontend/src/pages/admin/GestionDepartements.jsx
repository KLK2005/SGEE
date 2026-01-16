import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { departementService } from '../../services/departementService'
import toast from 'react-hot-toast'
import { 
  PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon, 
  TableCellsIcon, DocumentTextIcon, BuildingOfficeIcon 
} from '@heroicons/react/24/outline'

export default function GestionDepartements() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: departementsData, isLoading } = useQuery({
    queryKey: ['admin-departements'],
    queryFn: () => departementService.getAll(),
  })

  const departements = departementsData?.data || []

  const createMutation = useMutation({
    mutationFn: departementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-departements'])
      toast.success('Département créé')
      closeModal()
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => departementService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-departements'])
      toast.success('Département mis à jour')
      closeModal()
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: departementService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-departements'])
      toast.success('Département supprimé')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const openModal = (dept = null) => {
    setEditingDept(dept)
    if (dept) {
      reset({ nom_departement: dept.nom_departement, description: dept.description })
    } else {
      reset({ nom_departement: '', description: '' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingDept(null)
    reset()
  }

  const onSubmit = (data) => {
    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleExportPdf = async (deptId, deptName) => {
    try {
      toast.loading('Génération PDF...', { id: 'export-pdf' })
      const blob = await departementService.exportListePdf(deptId)
      if (blob.size === 0) throw new Error('Fichier vide')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `liste_${deptName.replace(/\s+/g, '_')}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('PDF téléchargé', { id: 'export-pdf' })
    } catch (error) {
      toast.error('Erreur export PDF', { id: 'export-pdf' })
    }
  }

  const handleExportCsv = async (deptId, deptName) => {
    try {
      toast.loading('Export CSV...', { id: 'export-csv' })
      const blob = await departementService.exportListeCsv(deptId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `candidats_${deptName.replace(/\s+/g, '_')}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('CSV téléchargé', { id: 'export-csv' })
    } catch (error) {
      toast.error('Erreur export CSV', { id: 'export-csv' })
    }
  }

  const handleExportAllCsv = async () => {
    try {
      toast.loading('Export...', { id: 'export-all' })
      const blob = await departementService.exportAllCsv()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `departements_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export réussi', { id: 'export-all' })
    } catch (error) {
      toast.error('Erreur export', { id: 'export-all' })
    }
  }

  const totalCandidats = departements.reduce((sum, d) => {
    const count = d.filieres?.reduce((s, f) => s + (f.candidats_count || 0), 0) || 0
    return sum + count
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
        <div className="flex gap-2">
          <button onClick={handleExportAllCsv} className="btn-secondary flex items-center gap-2">
            <TableCellsIcon className="w-5 h-5" />
            Exporter Excel
          </button>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-primary-50">
          <div className="flex items-center gap-3">
            <BuildingOfficeIcon className="w-10 h-10 text-primary-600" />
            <div>
              <p className="text-sm text-primary-600">Total Départements</p>
              <p className="text-2xl font-bold text-primary-700">{departements.length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-600">Total Filières</p>
          <p className="text-2xl font-bold text-blue-700">
            {departements.reduce((sum, d) => sum + (d.filieres?.length || 0), 0)}
          </p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600">Total Candidats</p>
          <p className="text-2xl font-bold text-green-700">{totalCandidats}</p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : departements.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">Aucun département</div>
        ) : (
          departements.map((dept) => {
            const filieresCount = dept.filieres?.length || 0
            const candidatsCount = dept.filieres?.reduce((s, f) => s + (f.candidats_count || 0), 0) || 0
            
            return (
              <div key={dept.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{dept.nom_departement}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {dept.description || 'Aucune description'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <span className="font-semibold">{filieresCount}</span>
                    <span className="text-gray-500">filière(s)</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <span className="font-semibold">{candidatsCount}</span>
                    <span className="text-gray-500">candidat(s)</span>
                  </div>
                </div>

                {/* Filières list */}
                {dept.filieres?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Filières:</p>
                    <div className="flex flex-wrap gap-1">
                      {dept.filieres.slice(0, 3).map(f => (
                        <span key={f.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {f.nom_filiere}
                        </span>
                      ))}
                      {dept.filieres.length > 3 && (
                        <span className="text-xs text-gray-500">+{dept.filieres.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t flex items-center justify-end gap-1">
                  <button onClick={() => handleExportPdf(dept.id, dept.nom_departement)}
                    className="p-2 hover:bg-red-100 rounded-lg" title="Export PDF">
                    <DocumentTextIcon className="w-4 h-4 text-red-600" />
                  </button>
                  <button onClick={() => handleExportCsv(dept.id, dept.nom_departement)}
                    className="p-2 hover:bg-green-100 rounded-lg" title="Export Excel">
                    <TableCellsIcon className="w-4 h-4 text-green-600" />
                  </button>
                  <button onClick={() => openModal(dept)}
                    className="p-2 hover:bg-blue-100 rounded-lg" title="Modifier">
                    <PencilIcon className="w-4 h-4 text-blue-600" />
                  </button>
                  <button onClick={() => {
                    if (confirm('Supprimer ce département ?')) deleteMutation.mutate(dept.id)
                  }} className="p-2 hover:bg-red-100 rounded-lg" title="Supprimer">
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingDept ? 'Modifier le département' : 'Nouveau département'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Nom du département</label>
                <input type="text" className="input-field" placeholder="ex: Sciences et Technologies"
                  {...register('nom_departement', { required: 'Requis' })} />
                {errors.nom_departement && <p className="text-red-500 text-sm mt-1">{errors.nom_departement.message}</p>}
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
                  {editingDept ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
