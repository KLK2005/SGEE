import api from './api'

export const statistiqueService = {
  async getDashboard() {
    const response = await api.get('/statistiques/dashboard')
    return response.data
  },

  async getEvolution(days = 30) {
    const response = await api.get('/statistiques/evolution', { params: { days } })
    return response.data
  },

  async getParFiliere() {
    const response = await api.get('/statistiques/par-filiere')
    return response.data
  },

  async getParDepartement() {
    const response = await api.get('/statistiques/par-departement')
    return response.data
  },

  async getPaiements() {
    const response = await api.get('/statistiques/paiements')
    return response.data
  },
}
