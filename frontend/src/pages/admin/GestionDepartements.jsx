import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { departementService } from '../../services/departementService'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

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
      reset(dept)
    } else {
      reset({ nom: '', code: '', description: '' })
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

  const handleExport = async (deptId) => {
    try {
      const blob = await departementService.exportListe(deptId, 'pdf')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `liste_departement_${deptId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export réussi')
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Nouveau département
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Chargement...</div>
        ) : departements.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">Aucun département</div>
        ) : (
          departements.map((dept) => (
            <div key={dept.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {dept.code}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2">{dept.nom}</h3>
                  <p className="text-sm text-gray-500 mt-1">{dept.description || 'Aucune description'}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {dept.filieres_count || 0} filière(s)
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleExport(dept.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Exporter liste"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => openModal(dept)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Modifier"
                  >
                    <PencilIcon className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer ce département ?')) {
                        deleteMutation.mutate(dept.id)
                      }
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
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
                <label className="label">Code</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="ex: INFO"
                  {...register('code', { required: 'Requis' })}
                />
                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
              </div>
              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="ex: Informatique"
                  {...register('nom', { required: 'Requis' })}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Description du département..."
                  {...register('description')}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
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
