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
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] instanceof File) {
        formData.append(key, data[key])
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    
    const response = await api.post('/enrolements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
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

  async regenerateFiche(id) {
    const response = await api.post(`/enrolements/${id}/regenerate-fiche`)
    return response.data
  },
}
