import api from './api'

export const candidatService = {
  async getAll(params = {}) {
    const response = await api.get('/candidats', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/candidats/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/candidats', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/candidats/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/candidats/${id}`)
    return response.data
  },

  async search(criteria) {
    const response = await api.post('/candidats/search', criteria)
    return response.data
  },

  async getStats() {
    const response = await api.get('/candidats/stats/stats')
    return response.data
  },

  async changeStatus(id, status) {
    const response = await api.patch(`/candidats/${id}/status`, { statut: status })
    return response.data
  },

  async export(format = 'csv') {
    const response = await api.get('/candidats/export/export', { 
      params: { format },
      responseType: 'blob'
    })
    return response.data
  },
}
