import api from './api'

export const enrolementService = {
  async getAll(params = {}) {
    const response = await api.get('/enrolements', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/enrolements/${id}`)
    return response.data
  },

  async create(data) {
    // Handle both FormData and regular objects
    const isFormData = data instanceof FormData
    
    const config = isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    
    const response = await api.post('/enrolements', data, config)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/enrolements/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/enrolements/${id}`)
    return response.data
  },

  async downloadFiche(id) {
    const response = await api.get(`/enrolements/${id}/download-fiche`, {
      responseType: 'blob'
    })
    return response.data
  },

  async validate(id) {
    const response = await api.post(`/enrolements/${id}/validate`)
    return response.data
  },

  async reject(id) {
    const response = await api.post(`/enrolements/${id}/reject`)
    return response.data
  },
}
