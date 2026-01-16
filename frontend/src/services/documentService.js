import api from './api'

export const documentService = {
  async upload(candidatId, typeDocument, file) {
    const formData = new FormData()
    formData.append('candidat_id', candidatId)
    formData.append('type_document', typeDocument)
    formData.append('fichier', file)
    
    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async getByCandidat(candidatId) {
    const response = await api.get(`/documents/candidat/${candidatId}`)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  },
}
