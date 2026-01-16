import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline'

const utilisateurService = {
  getAll: async () => (await api.get('/utilisateurs')).data,
  create: async (data) => (await api.post('/utilisateurs', data)).data,
  update: async (id, data) => (await api.put(`/utilisateurs/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/utilisateurs/${id}`)).data,
}

const roleService = {
  getAll: async () => (await api.get('/roles')).data,
}

export default function GestionUtilisateurs() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-utilisateurs'],
    queryFn: utilisateurService.getAll,
  })

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getAll,
  })

  const users = usersData?.data || []
  const roles = rolesData?.data || []

  const createMutation = useMutation({
    mutationFn: utilisateurService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-utilisateurs'])
      toast.success('Utilisateur créé')
      closeModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => utilisateurService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-utilisateurs'])
      toast.success('Utilisateur mis à jour')
      closeModal()
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: utilisateurService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-utilisateurs'])
      toast.success('Utilisateur supprimé')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const openModal = (user = null) => {
    setEditingUser(user)
    reset(user || { nom: '', prenom: '', email: '', password: '', role_id: '' })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    reset()
  }

  const onSubmit = (data) => {
    if (editingUser) {
      const { password, ...rest } = data
      updateMutation.mutate({ id: editingUser.id, data: password ? data : rest })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Utilisateur</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rôle</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan="4" className="py-8 text-center text-gray-500">Chargement...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-medium">{user.nom} {user.prenom}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role?.nom === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role?.nom || 'N/A'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(user)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <PencilIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => confirm('Supprimer ?') && deleteMutation.mutate(user.id)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5 text-red-600" />
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
            <h3 className="text-lg font-semibold mb-4">{editingUser ? 'Modifier' : 'Nouvel'} utilisateur</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom</label>
                  <input className="input-field" {...register('nom', { required: 'Requis' })} />
                </div>
                <div>
                  <label className="label">Prénom</label>
                  <input className="input-field" {...register('prenom', { required: 'Requis' })} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" {...register('email', { required: 'Requis' })} />
              </div>
              <div>
                <label className="label">Mot de passe {editingUser && '(laisser vide pour ne pas changer)'}</label>
                <input type="password" className="input-field" {...register('password', { required: !editingUser })} />
              </div>
              <div>
                <label className="label">Rôle</label>
                <select className="input-field" {...register('role_id', { required: 'Requis' })}>
                  <option value="">Sélectionner</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" className="btn-primary flex-1">{editingUser ? 'Mettre à jour' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
