import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function GestionEcoles() {
  const [ecoles, setEcoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nom_ecole: '',
    code_ecole: '',
    type_ecole: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    description: '',
    actif: true,
  })

  useEffect(() => {
    fetchEcoles()
  }, [])

  const fetchEcoles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/ecoles')
      setEcoles(response.data.data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des écoles')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/ecoles/${editingId}`, formData)
        toast.success('École mise à jour avec succès')
      } else {
        await api.post('/ecoles', formData)
        toast.success('École créée avec succès')
      }
      setFormData({
        nom_ecole: '',
        code_ecole: '',
        type_ecole: '',
        adresse: '',
        ville: '',
        telephone: '',
        email: '',
        description: '',
        actif: true,
      })
      setShowForm(false)
      setEditingId(null)
      fetchEcoles()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération')
    }
  }

  const handleEdit = (ecole) => {
    setFormData(ecole)
    setEditingId(ecole.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette école?')) {
      try {
        await api.delete(`/ecoles/${id}`)
        toast.success('École supprimée avec succès')
        fetchEcoles()
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Écoles</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              nom_ecole: '',
              code_ecole: '',
              type_ecole: '',
              adresse: '',
              ville: '',
              telephone: '',
              email: '',
              description: '',
              actif: true,
            })
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter une école
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Modifier' : 'Ajouter'} une école</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nom de l'école</label>
                <input
                  type="text"
                  value={formData.nom_ecole}
                  onChange={(e) => setFormData({ ...formData, nom_ecole: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Code</label>
                <input
                  type="text"
                  value={formData.code_ecole}
                  onChange={(e) => setFormData({ ...formData, code_ecole: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Type</label>
                <input
                  type="text"
                  value={formData.type_ecole}
                  onChange={(e) => setFormData({ ...formData, type_ecole: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Ville</label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="label">Adresse</label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ecoles.map((ecole) => (
          <div key={ecole.id} className="card hover:shadow-lg transition-shadow">
            {ecole.logo_url && (
              <div className="mb-4 flex justify-center">
                <img
                  src={ecole.logo_url}
                  alt={ecole.nom_ecole}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{ecole.nom_ecole}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Code:</span> {ecole.code_ecole}
            </p>
            {ecole.type_ecole && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Type:</span> {ecole.type_ecole}
              </p>
            )}
            {ecole.ville && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Ville:</span> {ecole.ville}
              </p>
            )}
            {ecole.telephone && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Tél:</span> {ecole.telephone}
              </p>
            )}
            {ecole.email && (
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Email:</span> {ecole.email}
              </p>
            )}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleEdit(ecole)}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(ecole.id)}
                className="flex-1 btn-danger flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
