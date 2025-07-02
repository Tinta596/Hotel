import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Reservas from '../views/Reservas.vue';
import Habitaciones from '../views/Habitaciones.vue';
import Servicios from '../views/Servicios.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import DetalleHabitacion from '../views/DetalleHabitacion.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/habitaciones',
    name: 'Habitaciones',
    component: Habitaciones,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservas',
    name: 'Reservas',
    component: Reservas,
    meta: { requiresAuth: true }
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: Servicios,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard-trabajador',
    name: 'DashboardTrabajador',
    component: () => import('../views/TrabajadorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['trabajador'] }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/trabajador/habitaciones/:id',
    name: 'DetalleHabitacion',
    component: DetalleHabitacion,
    meta: { requiresAuth: true, roles: ['trabajador'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ✅ Middleware global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Bloquea rutas protegidas sin login
  if (to.meta.requiresAuth && (!token || !usuario)) {
    return next('/login');
  }

  // Verifica rol si es requerido
  if (to.meta.roles && !to.meta.roles.includes(usuario?.rol)) {
    return next('/');
  }

  // Si va a /login y ya está autenticado
  if (to.path === '/login' && token && usuario) {
    if (usuario.rol === 'admin') return next('/admin');
    if (usuario.rol === 'trabajador') return next('/dashboard-trabajador');
  }

  next();
});

export default router;