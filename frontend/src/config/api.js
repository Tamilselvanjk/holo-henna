const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  baseURL: isDevelopment 
    ? 'http://localhost:3000/api/v1'
    : 'https://holo-henna-frontend.onrender.com/api/v1',
  endpoints: {
    orders: '/orders',
    createOrder: '/orders/create'
  }
}

export const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  };

  try {
    console.log('Making request to:', url);
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    
    const text = await response.text();
    console.log('Response text:', text);

    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
