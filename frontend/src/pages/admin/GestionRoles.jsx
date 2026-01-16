import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const roleService = {
  getAll: async () => (await api.get('/roles')).data,
  create: async (data) => (await api.post('/roles', data)).data,
  update: async (id, data) => (await api.put(`/roles/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/roles/${id}`)).data,
}

export default function GestionRoles() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: roleService.getAll,
  })

  const roles = rolesData?.data || []

  const createMutation = useMutation({
    mutationFn: roleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-roles'])
      toast.success('Rôle créé')
      closeModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => roleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-roles'])
      toast.success('Rôle mis à jour')
      closeModal()
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: roleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-roles'])
      toast.success('Rôle supprimé')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur lors de la suppression'),
  })

  const openModal = (role = null) => {
    setEditingRole(role)
    reset(role || { nom_role: '', description: '' })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRole(null)
    reset()
  }

  const onSubmit = (data) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Rôles</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Nouveau rôle
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rôle</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Utilisateurs</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan="4" className="py-8 text-center text-gray-500">Chargement...</td></tr>
            ) : roles.length === 0 ? (
              <tr><td colSpan="4" className="py-8 text-center text-gray-500">Aucun rôle trouvé</td></tr>
            ) : roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      role.nom_role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      <ShieldCheckIcon className={`w-5 h-5 ${
                        role.nom_role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <span className="font-medium capitalize">{role.nom_role}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{role.description || '-'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {role.utilisateurs_count || 0} utilisateur(s)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(role)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <PencilIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => confirm('Supprimer ce rôle ?') && deleteMutation.mutate(role.id)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                      disabled={role.nom_role === 'admin' || role.nom_role === 'etudiant'}
                    >
                      <TrashIcon className={`w-5 h-5 ${
                        role.nom_role === 'admin' || role.nom_role === 'etudiant' 
                          ? 'text-gray-300' 
                          : 'text-red-600'
                      }`} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">{editingRole ? 'Modifier' : 'Nouveau'} rôle</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Nom du rôle</label>
                <input 
                  className="input-field" 
                  {...register('nom_role', { required: 'Requis' })} 
                  placeholder="ex: gestionnaire"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea 
                  className="input-field" 
                  rows="3"
                  {...register('description')} 
                  placeholder="Description du rôle..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" className="btn-primary flex-1">{editingRole ? 'Mettre à jour' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
