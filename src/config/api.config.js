export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

export const API_ENDPOINTS = {
  GOOGLE_AUTH: '/auth/google',
  GOOGLE_CALLBACK: '/auth/google/callback',
  PROFILE: '/auth/profile',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout'
}
