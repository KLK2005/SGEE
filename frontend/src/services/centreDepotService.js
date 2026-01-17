import api from './api';

export const centreDepotService = {
  getAll: async () => {
    const response = await api.get('/centres-depot');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/centres-depot/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/centres-depot', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/centres-depot/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/centres-depot/${id}`);
    return response.data;
  },
};
