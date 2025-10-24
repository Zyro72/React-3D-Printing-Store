// Configuración para diferentes entornos
const config = {
  development: {
    apiUrl: 'https://68faad86ef8b2e621e809ada.mockapi.io/products3d/', // Reemplaza esto con tu URL de MockAPI
    imageBaseUrl: 'https://your-image-storage.com',
    modelBaseUrl: 'https://your-3d-model-storage.com'
  },
  production: {
    apiUrl: 'https://your-production-api.com',
    imageBaseUrl: 'https://your-production-image-storage.com',
    modelBaseUrl: 'https://your-production-3d-model-storage.com'
  }
};

const environment = import.meta.env.MODE || 'development';

export default {
  ...config[environment],
  endpoints: {
    products: '/products3d',
    /*orders: '/orders',
    customModels: '/custom-models'*/
  }
};