<template>
  <ul class="navbar-nav ms-auto">
    <!-- Sin login -->
    <li class="nav-item" v-if="!isLoggedIn">
      <router-link class="nav-link" to="/login">Login</router-link>
    </li>
    <li class="nav-item" v-if="!isLoggedIn">
      <router-link class="nav-link" to="/register">Registrarse</router-link>
    </li>

    <!-- Usuario Normal -->
    <template v-if="isLoggedIn && userRole === 'usuario'">
      <li class="nav-item">
        <router-link class="nav-link" to="/habitaciones">Habitaciones</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/reservas">Mis Reservas</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/servicios">Servicios</router-link>
      </li>
    </template>

    <!-- Trabajador -->
    <template v-if="isLoggedIn && userRole === 'trabajador'">
      <li class="nav-item">
        <router-link class="nav-link" to="/dashboard-trabajador">Panel Trabajador</router-link>
      </li>
    </template>

    <!-- Administrador -->
    <template v-if="isLoggedIn && userRole === 'admin'">
      <li class="nav-item">
        <router-link class="nav-link" to="/admin">Panel Admin</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/usuarios">Usuarios</router-link>
      </li>
    </template>

    <!-- Cerrar sesión -->
    <li class="nav-item" v-if="isLoggedIn">
      <button class="btn btn-link nav-link" @click="logout">Cerrar sesión</button>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => !!store.state.token);
    const userRole = computed(() => store.state.usuario?.rol || '');

    const logout = () => {
      store.commit('logout'); // ✅ corregido aquí
      router.push('/login');
    };

    return {
      isLoggedIn,
      userRole,
      logout,
    };
  },
};
</script>