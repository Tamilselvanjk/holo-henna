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
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify({
          ...orderData,
          updateStock: true
        })
      });

      // Get response text first
      const text = await response.text();
      
      // Check if response is empty
      if (!text) {
        throw new Error('Server returned empty response');
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON Parse Error:', e, 'Response Text:', text);
        throw new Error('Invalid JSON response from server');
      }

      // Check response status
      if (!response.ok) {
        throw new Error(data?.message || `HTTP error! status: ${response.status}`);
      }

      // Validate response data
      if (!data || (!data.data && !data.success)) {
        throw new Error('Invalid response format from server');
      }

      return {
        success: true,
        data: data.data || data
      };

    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
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

