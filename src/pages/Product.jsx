import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Product3DDetails from '../components/Product3DDetails';
import '../components/Product3DDetails.css';
import { productService } from '../services/productServiceFixed';

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
      
        const remote = await productService.getProductById(id).catch(() => null);
        if (remote) {
          setProduct(remote);
          return;
        }

        
        const response = await fetch('/src/assets/3d-products.json');
        const data = await response.json();
        const foundProduct = data.products.find(p => p.id === id);
        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{minHeight: '40vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:18, color:'var(--color-gray-600)'}}>Cargando producto...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (customizations) => {
    addToCart(product, { ...customizations, quantity });
  };

  return (
    <div className="container" style={{padding: '2rem 0'}}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(0, 1.5fr)',
        gap: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div className="product-image">
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 500,
              objectFit: 'contain',
              display: 'block',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
            }}
          />
        </div>
        
        <div className="product-info" style={{padding: '0 1rem'}}>
          <h1 style={{
            fontSize: '2rem',
            color: 'var(--color-primary)',
            marginBottom: '1rem'
          }}>{product.name}</h1>
          <p style={{
            color: 'var(--color-gray-600)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>{product.description}</p>
          
          <Product3DDetails product={product} />

          <div style={{marginTop: '2rem'}}>
            <div style={{display:'flex', gap: '1rem', alignItems:'center'}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{padding: '0.4rem 0.6rem', background:'#eee', borderRadius:6}}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))} style={{width:64, textAlign:'center', padding:'0.4rem', borderRadius:6, border:'1px solid var(--color-gray-300)'}} />
                <button onClick={() => setQuantity(q => q + 1)} style={{padding: '0.4rem 0.6rem', background:'#eee', borderRadius:6}}>+</button>
              </div>

              <Button
                onClick={() => handleAddToCart({
                  selectedMaterial: product.materials?.[0],
                  selectedColor: product.colors?.[0],
                  selectedInfill: product.infill?.[0]
                })}
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1.1rem',
                  backgroundColor: product.stock > 0 ? 'var(--color-primary)' : 'var(--color-gray-300)'
                }}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? `Agregar al carrito — ${quantity}` : 'Sin stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;