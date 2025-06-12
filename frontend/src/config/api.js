const isDevelopment = process.env.NODE_ENV === 'development';

const BASE_URL = isDevelopment 
  ? 'http://localhost:3000/api/v1'
  : 'https://holo-henna-frontend.onrender.com/api/v1';

export const API_ENDPOINTS = {
  bookings: `${BASE_URL}/bookings`,
  products: `${BASE_URL}/products`,
  orders: `${BASE_URL}/orders`
};

export const apiRequest = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(endpoint, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
