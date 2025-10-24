import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Home = () => {
  const { products, loading } = useContext(AppContext);

  if (loading) return <div style={{padding:20}}>Cargando...</div>;

  return (
    <div style={{padding:20}}>
      <h2>Bienvenido a la tienda de impresión 3D</h2>
      <p>Productos destacados</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginTop:16}}>
        {products.slice(0,6).map(p => (
          <div key={p.id} style={{border:'1px solid #eee', padding:12, borderRadius:6}}>
            <img src={p.thumbnailUrl} alt={p.name} style={{width:'100%',height:120,objectFit:'cover'}} />
            <h4 style={{margin:'8px 0'}}>{p.name}</h4>
            <p style={{color:'#666'}}>${p.price}</p>
            <Link to={`/product/${p.id}`}>Ver producto</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
