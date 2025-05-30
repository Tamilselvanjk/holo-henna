export const constructGoogleAuthUrl = () => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const params = {
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.REACT_APP_FRONTEND_URL}/profile`,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }

  const queryString = new URLSearchParams(params).toString()
  return `${baseUrl}?${queryString}`
}

export const initiateGoogleLogin = () => {
  const authUrl = constructGoogleAuthUrl()
  window.location.href = authUrl
}
