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
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/dashboard-trabajador',
    name: 'DashboardTrabajador',
    component: () => import('../views/TrabajadorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['trabajador'] }
  },
  {
    path: '/habitaciones/:id',
    name: 'DetalleHabitacion',
    component: DetalleHabitacion,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // 🔐 Verificar si necesita autenticación
  if (to.meta.requiresAuth && (!token || !usuario)) {
    return next('/login');
  }

  // 🔐 Verificar roles específicos si están definidos
  if (to.meta.roles && (!usuario || !to.meta.roles.includes(usuario.rol))) {
    return next('/');
  }

  // 🚫 Redirigir si ya está logueado e intenta entrar a login/register
  if ((to.path === '/login' || to.path === '/register') && token && usuario) {
    return next('/');
  }

  next();
});

export default router;
