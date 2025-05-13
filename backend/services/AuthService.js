const mockUsers = [{ email: 'test@example.com', password: 'test123' }]

const AuthService = {
  login: async (credentials) => {
    try {
      const user = mockUsers.find((u) => u.email === credentials.email)
      if (user && user.password === credentials.password) {
        const userData = { email: user.email, token: 'mock-jwt-token' }
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true, user: userData }
      }
      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  },

  loginWithGoogle: async (code) => {
    try {
      // In production, exchange code for token with backend
      const userData = { email: 'google@example.com', token: code }
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: 'Google login failed' }
    }
  },

  logout: () => {
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch {
      return null
    }
  },
}

export default AuthService
