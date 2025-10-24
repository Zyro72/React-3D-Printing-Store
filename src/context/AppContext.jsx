import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { productService } from '../services/productServiceFixed';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los productos');
      setLoading(false);
    }
  };

  const addToCart = (product, customizations = {}) => {
    const { selectedMaterial, selectedColor, selectedInfill, quantity = 1 } = customizations;

    setCart(currentCart => {
      // Buscar item existente con mismas personalizaciones
      const existingItemIndex = currentCart.findIndex(item => 
        item.id === product.id &&
        item.selectedMaterial === (selectedMaterial || product.materials?.[0]) &&
        item.selectedColor === (selectedColor || product.colors?.[0]) &&
        item.selectedInfill === (selectedInfill || product.infill?.[0])
      );

      if (existingItemIndex >= 0) {
        // Si existe, actualizamos la cantidad
        const newCart = [...currentCart];
        newCart[existingItemIndex].quantity += Number(quantity);
        return newCart;
      }

      // Si no existe, agregamos el nuevo item con las personalizaciones y un id único de carrito
      const cartItemId = `ci_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
      return [...currentCart, {
        cartItemId,
        ...product,
        selectedMaterial: selectedMaterial || product.materials?.[0],
        selectedColor: selectedColor || product.colors?.[0],
        selectedInfill: selectedInfill || product.infill?.[0],
        quantity: Number(quantity)
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(currentCart => currentCart.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCartItemQuantity = (cartItemId, quantity) => {
    setCart(currentCart => {
      const q = Number(quantity);
      if (isNaN(q)) return currentCart;
      if (q <= 0) {
        // remove item when quantity is 0 or less
        return currentCart.filter(item => item.cartItemId !== cartItemId);
      }
      return currentCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(0, q) } : item
      );
    });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;