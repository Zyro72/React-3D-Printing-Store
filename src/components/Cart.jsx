import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Button from './ui/Button';
import OrderService from '../services/orderService';

const Cart = () => {
  const orderService = new OrderService();
  const { cart, removeFromCart, clearCart, updateCartItemQuantity } = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const calculateItemTotal = (item) => {
    // Factores de multiplicación según el material
    const materialFactors = {
      'PLA': 1,
      'PETG': 1.2,
      'ABS': 1.1,
      'PLA+': 1.15
    };

    // Factores de multiplicación según el relleno
    const infillFactors = {
      '20%': 1,
      '50%': 1.3,
      '80%': 1.6
    };

    const materialFactor = materialFactors[item.selectedMaterial] || 1;
    const infillFactor = infillFactors[item.selectedInfill] || 1;

    return (item.price * materialFactor * infillFactor);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (calculateItemTotal(item) * (item.quantity || 1)), 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: calculateItemTotal(item),
          customizations: {
            material: item.selectedMaterial,
            color: item.selectedColor,
            infill: item.selectedInfill
          }
        })),
        totalAmount: calculateTotal(),
        orderDate: new Date().toISOString()
      };

      const savedOrder = orderService.saveOrder(orderData);
      setOrderStatus({ type: 'success', message: `Orden creada con éxito! ID: ${savedOrder.id}` });
      clearCart();
    } catch (error) {
      setOrderStatus({ type: 'error', message: 'Error al procesar la orden' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{minHeight: '40vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:18, color:'var(--color-gray-600)'}}>El carrito está vacío</p>
          <p style={{color:'var(--color-gray-600)'}}>Agrega productos desde el catálogo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      
      {orderStatus && (
        <div className={`p-4 mb-4 rounded ${orderStatus.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          {orderStatus.message}
        </div>
      )}

      <div className="space-y-4">
        {cart.map((item) => {
          const isExpanded = !!expandedItems[item.cartItemId];
          return (
            <div key={item.cartItemId} className="border p-4 rounded-lg shadow-sm" style={{background:'white'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}} onClick={() => setExpandedItems(e => ({...e, [item.cartItemId]: !e[item.cartItemId]}))}>
                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div style={{width:36, height:36, borderRadius:6, background:'var(--color-gray-100)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>{item.quantity}</div>
                  <div>
                    <div style={{fontWeight:700}}>{item.name}</div>
                    <div style={{fontSize:13, color:'var(--color-gray-600)'}}>
                      Material: {item.selectedMaterial} • Color: {item.selectedColor} • Relleno: {item.selectedInfill}
                    </div>
                  </div>
                </div>

                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div style={{fontWeight:700}}>${ (calculateItemTotal(item) * item.quantity).toFixed(2) }</div>
                  <div style={{fontSize:18, color:'var(--color-primary)'}}>{isExpanded ? '▾' : '▸'}</div>
                </div>
              </div>

              {isExpanded && (
                <div style={{display:'flex', flexDirection:'column', gap:16, marginTop:12, borderTop:'1px solid var(--color-gray-200)', paddingTop:12}} onClick={(e) => e.stopPropagation()}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                    <div style={{flex:1}}>
                      <p style={{margin:0, fontWeight:600}}>Detalles de impresión</p>
                      <div style={{color:'var(--color-gray-600)', marginTop:8}}>
                        <p style={{margin:0}}>Material: {item.selectedMaterial}</p>
                        <p style={{margin:0}}>Color: {item.selectedColor}</p>
                        <p style={{margin:0}}>Relleno: {item.selectedInfill}</p>
                        <p style={{margin:0}}>Precio unitario: ${ calculateItemTotal(item).toFixed(2) }</p>
                      </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8}}>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <button onClick={() => updateCartItemQuantity(item.cartItemId, Math.max(0, item.quantity - 1))} style={{padding:'0.3rem 0.6rem',borderRadius:6,background:'#eee'}}>−</button>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={(e) => updateCartItemQuantity(item.cartItemId, Math.max(0, Number(e.target.value || 0)))}
                          style={{width:64, textAlign:'center', padding:'0.25rem', borderRadius:6, border:'1px solid var(--color-gray-300)'}}
                        />
                        <button onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)} style={{padding:'0.3rem 0.6rem',borderRadius:6,background:'#eee'}}>+</button>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex', justifyContent:'flex-end'}} onClick={(e) => e.stopPropagation()}>
                    <Button onClick={() => removeFromCart(item.cartItemId)} style={{background:'#d9534f'}}>Eliminar</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-xl">Total:</span>
          <span className="font-bold text-xl">$ {calculateTotal().toFixed(2)}</span>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button onClick={clearCart} className="bg-gray-500 hover:bg-gray-600">
            Vaciar Carrito
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="bg-green-500 hover:bg-green-600"
          >
            {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;