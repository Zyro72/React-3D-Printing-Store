import { useState } from 'react';
import PropTypes from 'prop-types';

const Product3DDetails = ({ product }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedInfill, setSelectedInfill] = useState(product.infill[0]);

  const calculateFinalPrice = () => {
    // Factor de multiplicación según el material
    const materialFactors = {
      'PLA': 1,
      'PETG': 1.2,
      'ABS': 1.1,
      'PLA+': 1.15
    };

    // Factor de multiplicación según el relleno
    const infillFactors = {
      '20%': 1,
      '50%': 1.3,
      '80%': 1.6
    };

    const materialFactor = materialFactors[selectedMaterial] || 1;
    const infillFactor = infillFactors[selectedInfill] || 1;

    return (product.price * materialFactor * infillFactor).toFixed(2);
  };

  return (
    <div className="product-3d-details">
      <div className="product-specs">
        <h3>Especificaciones Técnicas</h3>
        <p>Dimensiones: {product.dimensions.width}mm x {product.dimensions.height}mm x {product.dimensions.depth}mm</p>
        <p>Peso aproximado: {product.weight}g</p>
        <p>Tiempo estimado de impresión: {product.printTime}h</p>
      </div>

      <div className="product-customization">
        <h3>Personalización</h3>
        
        <div className="customization-option">
          <label>Material:</label>
          <select 
            value={selectedMaterial} 
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            {product.materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div className="customization-option">
          <label>Color:</label>
          <select 
            value={selectedColor} 
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {product.colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className="customization-option">
          <label>Densidad de relleno:</label>
          <select 
            value={selectedInfill} 
            onChange={(e) => setSelectedInfill(e.target.value)}
          >
            {product.infill.map(infill => (
              <option key={infill} value={infill}>{infill}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="price-calculation">
        <h3>Precio Final</h3>
        <p className="final-price">$ {calculateFinalPrice()}</p>
        <small>*El precio puede variar según las opciones seleccionadas</small>
      </div>
    </div>
  );
};

Product3DDetails.propTypes = {
  product: PropTypes.shape({
    dimensions: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      depth: PropTypes.number
    }),
    weight: PropTypes.number,
    printTime: PropTypes.string,
    materials: PropTypes.arrayOf(PropTypes.string),
    colors: PropTypes.arrayOf(PropTypes.string),
    infill: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number
  }).isRequired
};

export default Product3DDetails;