// services/api.js
import axios from 'axios';

<<<<<<< HEAD
const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

api.interceptors.request.use((config) => {
=======
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
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
<<<<<<< HEAD
});

=======
}, error => {
  return Promise.reject(error);
});

// ✅ Exportar la instancia
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
export default api;