const PROD_URL = 'https://holo-henna.onrender.com/api/v1';
const DEV_URL = 'http://localhost:5000/api/v1'; // Changed from 3000 to 5000

class OrderService {
  static async createOrder(orderData) {
    let baseUrl = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL;
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${baseUrl}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Order creation failed: ${response.status}`);
        }
        return data;
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed:`, error);

        // If local server fails, try production URL
        if (error.message.includes('Failed to fetch') && baseUrl !== PROD_URL) {
          baseUrl = PROD_URL;
          continue;
        }

        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}

export { OrderService };