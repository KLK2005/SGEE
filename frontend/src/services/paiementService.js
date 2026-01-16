import api from './api'

export const paiementService = {
  async getAll(params = {}) {
    const response = await api.get('/paiements', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/paiements/${id}`)
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
    
    const response = await api.post('/paiements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/paiements/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/paiements/${id}`)
    return response.data
  },

  async validate(id) {
    const response = await api.post(`/paiements/${id}/validate`)
    return response.data
  },

  async downloadQuitus(id) {
    const response = await api.get(`/paiements/${id}/download-quitus`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf,*/*'
      }
    })
    return new Blob([response.data], { type: 'application/pdf' })
  },
}
