const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class OrderService {
  static async createOrder(orderData) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`Attempting to create order - attempt ${attempt + 1}`);
        
        const response = await fetch(`${BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(orderData),
          credentials: 'include',
        });

        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 503 || response.status === 502) {
            // Server unavailable, retry
            attempt++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
      } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          if (attempt === maxRetries - 1) {
            throw new Error('Backend server is not responding. Please try again later.');
          }
          attempt++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        console.error('Order creation error:', error);
        throw error;
      }
    }
  }

  static isServerAvailable() {
    return fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.ok)
    .catch(() => false);
  }
}

export { OrderService };