const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api/v1'
  : 'https://holo-henna-frontend.onrender.com/api/v1';

export class OrderService {
  static async createOrder(orderData) {
    try {
      const response = await fetch(`${BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...orderData,
          updateStock: true
        })
      });

      // Log the raw response for debugging
      console.log('Raw response:', response);

      // Check status first
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get response text
      const text = await response.text();
      console.log('Response text:', text);

      // Parse only if we have content
      const data = text ? JSON.parse(text) : null;

      if (!data) {
        throw new Error('Empty response from server');
      }

      return {
        success: true,
        data: data.data || data
      };

    } catch (error) {
      console.error('Order creation failed:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  }

  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Order fetch failed:', error);
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      return {
        success: true,
        orders: Array.isArray(data.orders) ? data.orders : []
      };
    } catch (error) {
      console.error('Orders fetch failed:', error);
      return {
        success: false,
        message: error.message,
        orders: []
      };
    }
  }
}
    
  


