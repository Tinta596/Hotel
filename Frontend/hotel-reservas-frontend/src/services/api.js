// services/api.js
import axios from 'axios';

// ✅ Crear instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Interceptor para incluir el token automáticamente en cada solicitud
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// ✅ Exportar la instancia
export default api;