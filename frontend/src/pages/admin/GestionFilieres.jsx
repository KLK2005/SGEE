import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { filiereService } from '../../services/filiereService'
import { departementService } from '../../services/departementService'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function GestionFilieres() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingFiliere, setEditingFiliere] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: filieresData, isLoading } = useQuery({
    queryKey: ['admin-filieres'],
    queryFn: () => filiereService.getAll(),
  })

  const { data: departementsData } = useQuery({
    queryKey: ['departements'],
    queryFn: () => departementService.getAll(),
  })

  const filieres = filieresData?.data || []
  const departements = departementsData?.data || []

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
      reset(filiere)
    } else {
      reset({ nom: '', code: '', description: '', departement_id: '' })
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

  const handleExport = async (filiereId) => {
    try {
      const blob = await filiereService.exportListe(filiereId, 'pdf')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `liste_filiere_${filiereId}.pdf`
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Filières</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Nouvelle filière
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Candidats</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Chargement...</td></tr>
              ) : filieres.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Aucune filière</td></tr>
              ) : (
                filieres.map((filiere) => (
                  <tr key={filiere.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{filiere.code}</td>
                    <td className="py-3 px-4 text-gray-900">{filiere.nom}</td>
                    <td className="py-3 px-4 text-gray-600">{filiere.departement?.nom || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{filiere.candidats_count || 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleExport(filiere.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Exporter liste"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                          onClick={() => openModal(filiere)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Modifier"
                        >
                          <PencilIcon className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cette filière ?')) {
                              deleteMutation.mutate(filiere.id)
                            }
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg"
                          title="Supprimer"
                        >
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
                <label className="label">Code</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('code', { required: 'Requis' })}
                />
                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
              </div>
              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('nom', { required: 'Requis' })}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
              </div>
              <div>
                <label className="label">Département</label>
                <select className="input-field" {...register('departement_id', { required: 'Requis' })}>
                  <option value="">Sélectionner</option>
                  {departements.map((d) => (
                    <option key={d.id} value={d.id}>{d.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field" rows="3" {...register('description')} />
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
