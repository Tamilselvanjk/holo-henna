const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://holo-henna.onrender.com/api/v1'
  : process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

class OrderService {
  static async createOrder(orderData) {
    // Validate order data
    if (!orderData || typeof orderData !== 'object') {
      throw new Error('Invalid order data');
    }

    // Ensure orderItems is an array with valid items
    if (!Array.isArray(orderData.orderItems) || orderData.orderItems.length === 0) {
      throw new Error('Order items are required');
    }

    // Clean and validate the order data
    const cleanOrderData = {
      orderItems: orderData.orderItems.map(item => ({
        product: item.product,
        quantity: Number(item.quantity),
        price: Number(item.price)
      })),
      shippingAddress: orderData.shippingAddress,
      totalAmount: Number(orderData.totalAmount),
      paymentMethod: orderData.paymentMethod,
      paymentDetails: orderData.paymentDetails
    };

    const maxRetries = 3;
    let attempt = 0;
   

    // Check server availability first
    const isAvailable = await this.isServerAvailable();
    if (!isAvailable) {
      throw new Error('Server is not available. Please try again later.');
    }

    while (attempt < maxRetries) {
      try {
        console.log(`Creating order - attempt ${attempt + 1}`);
        
        const response = await fetch(`${BASE_URL}/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            
          },
          body: JSON.stringify(cleanOrderData),
          credentials: 'include',
          mode: 'cors'
        });

        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 503 || response.status === 502) {
            attempt++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw new Error(data.message || `Order creation failed: ${response.status}`);
        }

        console.log('Order created successfully:', data);
        return data;
      } catch (error) {
        console.error('Order creation attempt failed:', error);
        
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError')) {
          if (attempt === maxRetries - 1) {
            throw new Error('Server connection failed. Please check your internet connection.');
          }
          attempt++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        throw error;
      }
    }

  }

  static async isServerAvailable() {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }
}

export { OrderService };