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
<<<<<<< HEAD

=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
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
<<<<<<< HEAD
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    path: '/dashboard-trabajador',
    name: 'DashboardTrabajador',
    component: () => import('../views/TrabajadorDashboard.vue'),
    meta: { requiresAuth: true, roles: ['trabajador'] }
  },
  {
<<<<<<< HEAD
    path: '/habitaciones/:id',
    name: 'DetalleHabitacion',
    component: DetalleHabitacion,
    meta: { requiresAuth: true }
=======
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
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

<<<<<<< HEAD
=======
// ✅ Middleware global
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

<<<<<<< HEAD
  // 🔐 Verificar si necesita autenticación
=======
  // Bloquea rutas protegidas sin login
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  if (to.meta.requiresAuth && (!token || !usuario)) {
    return next('/login');
  }

<<<<<<< HEAD
  // 🔐 Verificar roles específicos si están definidos
  if (to.meta.roles && (!usuario || !to.meta.roles.includes(usuario.rol))) {
    return next('/');
  }

  // 🚫 Redirigir si ya está logueado e intenta entrar a login/register
  if ((to.path === '/login' || to.path === '/register') && token && usuario) {
    return next('/');
=======
  // Verifica rol si es requerido
  if (to.meta.roles && !to.meta.roles.includes(usuario?.rol)) {
    return next('/');
  }

  // Si va a /login y ya está autenticado
  if (to.path === '/login' && token && usuario) {
    if (usuario.rol === 'admin') return next('/admin');
    if (usuario.rol === 'trabajador') return next('/dashboard-trabajador');
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  }

  next();
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
