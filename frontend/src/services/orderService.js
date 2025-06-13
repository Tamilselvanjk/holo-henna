const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/v1'
    : 'https://holo-henna-frontend.onrender.com/api/v1'

export class OrderService {
  static async createOrder(orderData) {
    try {
      console.log('Creating order:', orderData);

      const response = await fetch(`${BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify({
          ...orderData,
          updateStock: true // Add flag to update stock
        })
      });

      const text = await response.text();
      

      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order');
      }

      return {
        success: true,
        data: data.data
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

