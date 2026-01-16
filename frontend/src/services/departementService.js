import api from './api'

export const departementService = {
  async getAll(params = {}) {
    const response = await api.get('/departements', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/departements/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/departements', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/departements/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/departements/${id}`)
    return response.data
  },

  async exportListe(id, format = 'pdf') {
    const response = await api.get(`/departements/${id}/export-liste`, {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  },
}
