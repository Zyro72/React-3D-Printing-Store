class OrderService {
  constructor() {
    this.storageKey = 'print3d_orders';
  }

  generateOrderId() {
    return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getOrders() {
    try {
      const orders = localStorage.getItem(this.storageKey);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  saveOrder(orderData) {
    try {
      const orders = this.getOrders();
      const newOrder = {
        id: this.generateOrderId(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      orders.push(newOrder);
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
      return newOrder;
    } catch (error) {
      console.error('Error saving order:', error);
      throw new Error('No se pudo guardar la orden');
    }
  }

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId);
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Orden no encontrada');
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    return orders[orderIndex];
  }

  clearOrders() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      return [];
    } catch (error) {
      console.error('Error clearing orders:', error);
      throw new Error('No se pudieron borrar las órdenes');
    }
  }

  removeOrder(orderId) {
    try {
      const orders = this.getOrders();
      const filtered = orders.filter(o => o.id !== orderId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      console.error('Error removing order:', error);
      throw new Error('No se pudo eliminar la orden');
    }
  }
}

export default OrderService;