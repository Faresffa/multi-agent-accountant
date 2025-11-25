import api from './api'

export const authService = {
  async signup(userData) {
    const response = await api.post('/api/auth/signup', userData)
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  async getMe() {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

