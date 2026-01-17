import api from './api';

export const centreExamenService = {
  getAll: async () => {
    const response = await api.get('/centres-examen');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/centres-examen/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/centres-examen', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/centres-examen/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/centres-examen/${id}`);
    return response.data;
  },
};
