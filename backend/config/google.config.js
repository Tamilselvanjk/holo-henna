export const GOOGLE_CONFIG = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
  scope: 'email profile openid',
  response_type: 'code',
  access_type: 'offline',
  prompt: 'select_account'
};

export const GOOGLE_ENDPOINTS = {
  auth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://oauth2.googleapis.com/token'
};
