import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { centreDepotService } from '../../services/centreDepotService';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function GestionCentresDepot() {
  const [showModal, setShowModal] = useState(false);
  const [editingCentre, setEditingCentre] = useState(null);
  const [formData, setFormData] = useState({
    nom_centre: '',
    code_centre: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    horaires: '',
    services: '',
    actif: true,
  });

  const queryClient = useQueryClient();

  const { data: centresData, isLoading } = useQuery({
    queryKey: ['centres-depot'],
    queryFn: centreDepotService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: centreDepotService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['centres-depot']);
      toast.success('Centre de dépôt créé avec succès');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => centreDepotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['centres-depot']);
      toast.success('Centre de dépôt mis à jour avec succès');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: centreDepotService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['centres-depot']);
      toast.success('Centre de dépôt supprimé avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCentre) {
      updateMutation.mutate({ id: editingCentre.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (centre) => {
    setEditingCentre(centre);
    setFormData(centre);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce centre de dépôt ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCentre(null);
    setFormData({
      nom_centre: '',
      code_centre: '',
      adresse: '',
      ville: '',
      telephone: '',
      email: '',
      horaires: '',
      services: '',
      actif: true,
    });
  };

  const centres = centresData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Centres de Dépôt
          </h1>
          <p className="text-gray-600 mt-1">Gérez les centres de dépôt de documents</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nouveau Centre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Centres</p>
              <p className="text-2xl font-bold text-gray-900">{centres.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <MapPinIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Centres Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {centres.filter(c => c.actif).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <MapPinIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Villes Couvertes</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(centres.map(c => c.ville)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-700">Code</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">Nom du Centre</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">Ville</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">Horaires</th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">Statut</th>
                <th className="text-right py-4 px-4 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {centres.map((centre) => (
                <tr key={centre.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm">{centre.code_centre}</td>
                  <td className="py-4 px-4 font-semibold">{centre.nom_centre}</td>
                  <td className="py-4 px-4">{centre.ville}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{centre.horaires || 'Non spécifié'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      centre.actif
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {centre.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(centre)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(centre.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {centres.length === 0 && (
            <div className="text-center py-12">
              <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun centre de dépôt enregistré</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCentre ? 'Modifier le Centre' : 'Nouveau Centre de Dépôt'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom du Centre *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.nom_centre}
                    onChange={(e) => setFormData({ ...formData, nom_centre: e.target.value })}
                    placeholder="Centre de Dépôt Principal"
                  />
                </div>

                <div>
                  <label className="label">Code Centre *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.code_centre}
                    onChange={(e) => setFormData({ ...formData, code_centre: e.target.value })}
                    placeholder="CD001"
                  />
                </div>
              </div>

              <div>
                <label className="label">Adresse *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="123 Avenue de l'Indépendance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ville *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Douala"
                  />
                </div>

                <div>
                  <label className="label">Téléphone</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="centre@example.com"
                />
              </div>

              <div>
                <label className="label">Horaires d'ouverture</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.horaires}
                  onChange={(e) => setFormData({ ...formData, horaires: e.target.value })}
                  placeholder="Lun-Ven 8h-17h, Sam 8h-12h"
                />
              </div>

              <div>
                <label className="label">Services disponibles</label>
                <textarea
                  className="input-field"
                  rows="3"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  placeholder="Dépôt de documents, Photocopies, Scan..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="actif" className="text-sm font-medium text-gray-700">
                  Centre actif
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn-primary flex-1"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Enregistrement...'
                    : editingCentre
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
