const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/v1'  // Updated port to match backend
  : 'https://holo-henna.onrender.com/api/v1'  // Updated to point to backend URL

export const BookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify(bookingData)
      })

      // Handle empty response
      if (response.status === 204) {
        return { success: true, message: 'Booking created successfully' }
      }

      // Try to parse JSON response
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch (error) {
          console.error('JSON parse error:', error)
          throw new Error('Invalid response from server')
        }
      } else {
        throw new Error('Invalid response format from server')
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create booking')
      }

      return data
    } catch (error) {
      console.error('Booking service error:', error)
      throw error
    }
  },

  validateBookingData: (data) => {
    const requiredFields = ['fullName', 'email', 'phone', 'service']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format')
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (!phoneRegex.test(data.phone)) {
      throw new Error('Invalid phone number format')
    }

    return true
  }
}