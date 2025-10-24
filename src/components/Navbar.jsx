import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          textDecoration: 'none'
        }}>3D Print Store</Link>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          
          <Link to="/cart" style={{color: 'white', textDecoration: 'none'}}>Carrito</Link>
          <Link to="/orders" style={{color: 'white', textDecoration: 'none'}}>Pedidos</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
