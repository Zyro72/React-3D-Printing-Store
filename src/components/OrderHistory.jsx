import { useState, useEffect } from 'react';
import OrderService from '../services/orderService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const orderService = new OrderService();

  useEffect(() => {
    const loadOrders = () => {
      const userOrders = orderService.getOrders();
      setOrders(userOrders);
    };

    loadOrders();
    window.addEventListener('storage', loadOrders);

    return () => {
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const handleClearAll = () => {
    if (!orders.length) return;
    const ok = window.confirm('¿Eliminar todos los pedidos? Esta acción no se puede deshacer.');
    if (!ok) return;
    orderService.clearOrders();
    setOrders([]);
    setSelectedOrderId(null);
  };

  const toggleSelect = (orderId) => {
    setSelectedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="container" style={{padding: '2rem 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem'}}>
          <h2 style={{fontSize: '1.5rem', color: 'var(--color-primary)'}}>Historial de Pedidos</h2>
        </div>
        <p style={{color:'var(--color-gray-600)'}}>No hay pedidos realizados aún.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{padding: '2rem 0'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem'}}>
        <h2 style={{fontSize: '1.5rem', color: 'var(--color-primary)'}}>Historial de Pedidos</h2>
        <div>
          <button onClick={handleClearAll} style={{background:'#d9534f', color:'white', padding:'0.5rem 0.8rem', borderRadius:6}}>
            Borrar todos
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1rem'}}>
        {orders.map(order => {
          const isSelected = selectedOrderId === order.id;
          
          return (
            <div key={order.id} style={{
              background:'white', 
              borderRadius:8, 
              padding:12, 
              boxShadow:'0 2px 6px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease-in-out',
              maxHeight: isSelected ? '1000px' : '80px',
              overflow: 'hidden'
            }}>
              <div style={{
                display:'flex', 
                justifyContent:'space-between', 
                alignItems:'center',
                cursor:'pointer',
                minHeight: '56px'
              }} onClick={() => toggleSelect(order.id)}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight:700}}>Pedido #{order.id}</div>
                  <div style={{fontSize:12, color:'var(--color-gray-600)'}}>Fecha: {formatDate(order.orderDate)}</div>
                </div>

                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:700}}>${order.totalAmount.toFixed(2)}</div>
                    <div style={{fontSize:12, color:'var(--color-gray-600)'}}>{order.status}</div>
                  </div>
                  <div style={{
                    fontSize:18, 
                    color:'var(--color-primary)',
                    transform: isSelected ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.3s ease-in-out'
                  }}>▾</div>
                </div>
              </div>

              <div style={{
                marginTop: 12,
                borderTop: '1px solid var(--color-gray-200)',
                paddingTop: 12,
                opacity: isSelected ? 1 : 0,
                transform: isSelected ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
              }}>
                <h4 style={{margin:0, marginBottom:8}}>Productos</h4>
                <ul style={{listStyle:'none', padding:0, margin:0}}>
                  {order.items.map((item, idx) => (
                    <li key={idx} style={{padding:'8px 0', borderBottom: '1px solid var(--color-gray-100)'}}>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div>
                          <div style={{fontWeight:600}}>{item.name}</div>
                          <div style={{fontSize:13, color:'var(--color-gray-600)'}}>
                            Material: {item.customizations.material} • Color: {item.customizations.color} • Relleno: {item.customizations.infill}
                          </div>
                          <div style={{fontSize:13, color:'var(--color-gray-600)'}}>Cantidad: {item.quantity || 1}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div>${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div style={{
                  display:'flex', 
                  justifyContent:'flex-end', 
                  marginTop:16,
                  opacity: isSelected ? 1 : 0,
                  transform: isSelected ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
                }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const ok = window.confirm('¿Deshacer este pedido? Esta acción no se puede revertir.');
                      if (!ok) return;
                      orderService.removeOrder(order.id);
                      const newOrders = orderService.getOrders();
                      setOrders(newOrders);
                      setSelectedOrderId(null);
                    }} 
                    style={{
                      background:'#d9534f', 
                      color:'white', 
                      padding:'0.5rem 1rem', 
                      borderRadius:6, 
                      minWidth:'140px',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Deshacer pedido
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;