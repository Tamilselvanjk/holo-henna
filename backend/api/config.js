export const API_BASE_URL = 'http://localhost:5000'

export const GOOGLE_CONFIG = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: 'http://localhost:3001/auth/google/callback',
  scope: 'email profile openid',
  response_type: 'code',
}

export const AUTH_ENDPOINTS = {
  GOOGLE_CALLBACK: '/api/auth/google/callback',
  GET_PROFILE: '/api/auth/profile',
  VERIFY_TOKEN: '/api/auth/verify',
}

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PROFILE: '/profile',
  CART: '/cart',
}
