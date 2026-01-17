import api from './api';

export const ecoleService = {
  // Récupérer toutes les écoles
  getAll: async () => {
    const response = await api.get('/ecoles');
    return response.data;
  },

  // Récupérer une école par ID
  getById: async (id) => {
    const response = await api.get(`/ecoles/${id}`);
    return response.data;
  },

  // Créer une nouvelle école
  create: async (data) => {
    const response = await api.post('/ecoles', data);
    return response.data;
  },

  // Mettre à jour une école
  update: async (id, data) => {
    const response = await api.put(`/ecoles/${id}`, data);
    return response.data;
  },

  // Supprimer une école
  delete: async (id) => {
    const response = await api.delete(`/ecoles/${id}`);
    return response.data;
  },
};
