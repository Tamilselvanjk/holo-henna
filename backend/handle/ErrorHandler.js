export const handleAuthError = (error) => {
  console.error('Auth Error:', error)

  if (error.response) {
    console.error('Server Response:', error.response.data)
    return error.response.data.message || 'Authentication failed'
  } else if (error.request) {
    console.error('No Response Received')
    return 'Unable to reach authentication service'
  } else {
    console.error('Request Error:', error.message)
    return error.message || 'Authentication failed'
  }
}

export const isNetworkError = (error) => {
  return !error.response && error.request
}
