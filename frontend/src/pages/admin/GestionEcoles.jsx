import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ecoleService } from '../../services/ecoleService';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

export default function GestionEcoles() {
  const [showModal, setShowModal] = useState(false);
  const [editingEcole, setEditingEcole] = useState(null);
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
  });

  const queryClient = useQueryClient();

  const { data: ecolesData, isLoading } = useQuery({
    queryKey: ['ecoles'],
    queryFn: ecoleService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ecoleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['ecoles']);
      toast.success('École créée avec succès');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ecoleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ecoles']);
      toast.success('École mise à jour avec succès');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ecoleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['ecoles']);
      toast.success('École supprimée avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEcole) {
      updateMutation.mutate({ id: editingEcole.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (ecole) => {
    setEditingEcole(ecole);
    setFormData(ecole);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette école ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEcole(null);
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
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const ecoles = ecolesData?.data || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Écoles
          </h1>
          <p className="text-gray-600 mt-1">Gérez les établissements scolaires</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nouvelle École
        </button>
      </div>

      {/* Liste des écoles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ecoles.map((ecole) => (
          <div key={ecole.id} className="card hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BuildingLibraryIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{ecole.nom_ecole}</h3>
                  <p className="text-sm text-gray-500">{ecole.code_ecole}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ecole.actif
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {ecole.actif ? 'Actif' : 'Inactif'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {ecole.type_ecole && (
                <p>
                  <span className="font-medium">Type:</span> {ecole.type_ecole}
                </p>
              )}
              {ecole.ville && (
                <p>
                  <span className="font-medium">Ville:</span> {ecole.ville}
                </p>
              )}
              {ecole.telephone && (
                <p>
                  <span className="font-medium">Tél:</span> {ecole.telephone}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(ecole)}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(ecole.id)}
                className="btn-danger flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {ecoles.length === 0 && (
        <div className="card text-center py-12">
          <BuildingLibraryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune école enregistrée</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4"
          >
            Ajouter la première école
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEcole ? 'Modifier l\'école' : 'Nouvelle école'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom de l'école *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.nom_ecole}
                    onChange={(e) =>
                      setFormData({ ...formData, nom_ecole: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Code école *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.code_ecole}
                    onChange={(e) =>
                      setFormData({ ...formData, code_ecole: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type d'école</label>
                  <select
                    className="input-field"
                    value={formData.type_ecole}
                    onChange={(e) =>
                      setFormData({ ...formData, type_ecole: e.target.value })
                    }
                  >
                    <option value="">Sélectionner</option>
                    <option value="Publique">Publique</option>
                    <option value="Privée">Privée</option>
                    <option value="Confessionnelle">Confessionnelle</option>
                  </select>
                </div>

                <div>
                  <label className="label">Ville</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.ville}
                    onChange={(e) =>
                      setFormData({ ...formData, ville: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label">Adresse</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.adresse}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Téléphone</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input-field"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) =>
                    setFormData({ ...formData, actif: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="actif" className="text-sm font-medium text-gray-700">
                  École active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Enregistrement...'
                    : editingEcole
                    ? 'Mettre à jour'
                    : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
