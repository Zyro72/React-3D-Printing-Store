import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Products = () => {
  const { products, loading } = useContext(AppContext);

  if (loading) return <div style={{padding:20}}>Cargando productos...</div>;

  return (
    <div className="container" style={{padding: '2rem 0'}}>
      <h2 style={{
        color: 'var(--color-primary)',
        fontSize: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>Catálogo de productos</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {products.map((p, idx) => (
          <div key={p.id ?? idx} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}>
            <img
              src={p.thumbnailUrl}
              alt={p.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 200,
                objectFit: 'cover',
                display: 'block',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <h4 style={{
              margin: '0.5rem 0',
              color: 'var(--color-primary)',
              fontSize: '1.25rem'
            }}>{p.name}</h4>
            <p style={{
              color: 'var(--color-gray-600)',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              margin: '0.5rem 0'
            }}>${p.price}</p>
            <Link to={`/product/${p.id}`} style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}>Ver producto</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
