import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import RegisterAdmin from '../views/RegisterAdmin.vue';
import RegisterWorker from '../views/RegisterWorker.vue';
import Reservas from '../views/Reservas.vue';
import Habitaciones from '../views/Habitaciones.vue';
import Servicios from '../views/Servicios.vue';
import AdminDashboard from '../pages/Dashboard.vue';
import DetalleHabitacion from '../views/DetalleHabitacion.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', redirect: '/' },
  { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },
  {
    path: '/register/trabajador',
    name: 'RegisterWorker',
    component: RegisterWorker,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/register/admin',
    name: 'RegisterAdmin',
    component: RegisterAdmin,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
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
  { path: '/dashboard-admin', redirect: '/admin' },
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
  },
  {
    path: '/trabajador/habitaciones/:id',
    name: 'DetalleHabitacionTrabajador',
    component: DetalleHabitacion,
    meta: { requiresAuth: true, roles: ['trabajador'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const getSession = () => {
  const token = localStorage.getItem('token');
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem('usuario'));
  } catch (error) {
    localStorage.removeItem('usuario');
  }

  return { token, usuario };
};

const routeByRole = usuario => {
  if (usuario?.rol === 'admin') return '/admin';
  if (usuario?.rol === 'trabajador') return '/dashboard-trabajador';
  return '/';
};

router.beforeEach((to, from, next) => {
  const { token, usuario } = getSession();

  if (to.meta.requiresAuth && (!token || !usuario)) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  if (to.meta.roles && (!usuario || !to.meta.roles.includes(usuario.rol))) {
    return next(routeByRole(usuario));
  }

  if (to.meta.guestOnly && token && usuario) {
    return next(routeByRole(usuario));
  }

  next();
});

export default router;
