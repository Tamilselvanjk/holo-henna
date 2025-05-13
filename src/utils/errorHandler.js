export const handleAuthError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Authentication failed'
  }
  return error.message || 'An error occurred'
}
