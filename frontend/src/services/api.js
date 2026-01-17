import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    console.log('🔑 Token présent:', !!token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Don't set Accept header for blob requests
    if (config.responseType === 'blob') {
      delete config.headers['Accept']
    }
    console.log('📤 Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.config.url, '- Status:', response.status)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.response?.data)
    // Don't redirect for blob requests that fail
    if (error.config?.responseType === 'blob') {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Logging out')
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
