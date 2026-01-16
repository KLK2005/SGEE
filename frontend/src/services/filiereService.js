import api from './api'

export const filiereService = {
  async getAll(params = {}) {
    const response = await api.get('/filieres', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/filieres/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/filieres', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/filieres/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/filieres/${id}`)
    return response.data
  },

  async exportListe(id, format = 'pdf') {
    const response = await api.get(`/filieres/${id}/export-liste`, {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  },
}
