const MOCKAPI_BASE_URL = 'https://68faad86ef8b2e621e809ada.mockapi.io/products3d';

export const productService = {
  async getAllProducts() {
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}`);
      if (!response.ok) throw new Error('Error fetching products');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Error fetching product');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Error creating order');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
