// Use local mock data only since MockAPI is not available
async function fetchLocalProducts() {
  const res = await fetch('/src/mock-data/products3d-mock.json');
  if (!res.ok) throw new Error('Local mock file not found');
  const data = await res.json();
  return data;
}

export const productService = {
  async getAllProducts() {
    try {
      return await fetchLocalProducts();
    } catch (err) {
      console.error('Failed to load local products mock', err);
      throw new Error('Error fetching products');
    }
  },

  async getProductById(id) {
    try {
      const products = await fetchLocalProducts();
      return products.find(p => p.id === id) || null;
    } catch (err) {
      console.error('Failed to load local products mock', err);
      throw new Error('Error fetching product');
    }
  },

  async createOrder(orderData) {
    // Using local OrderService for all orders
    throw new Error('Use local order service');
  }
};
