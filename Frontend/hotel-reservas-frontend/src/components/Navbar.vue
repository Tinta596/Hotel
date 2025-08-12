<template>
  <div>
    <!-- Botón hamburguesa y título -->
    <div class="navbar-header">
      <div class="menu-icon-circle">
        <button class="menu-btn" @click="menuAbierto = !menuAbierto">
          <span class="icon">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </span>
        </button>
      </div>
      <span class="navbar-title">Menú principal</span>
    </div>

    <!-- Sidebar -->
    <transition name="slide">
      <nav v-if="menuAbierto" class="sidebar" @click.self="menuAbierto = false">
        <ul>
          <li v-if="!isLoggedIn">
            <router-link to="/login" @click="menuAbierto = false">Login</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register" @click="menuAbierto = false">Registrarse</router-link>
          </li>
          <template v-if="isLoggedIn && userRole === 'usuario'">
            <li><router-link to="/habitaciones" @click="menuAbierto = false">Habitaciones</router-link></li>
            <li><router-link to="/reservas" @click="menuAbierto = false">Mis Reservas</router-link></li>
            <li><router-link to="/servicios" @click="menuAbierto = false">Servicios</router-link></li>
          </template>
          <template v-if="isLoggedIn && userRole === 'trabajador'">
            <li><router-link to="/dashboard-trabajador" @click="menuAbierto = false">Panel Trabajador</router-link></li>
          </template>
          <template v-if="isLoggedIn && userRole === 'admin'">
            <li><router-link to="/admin" @click="menuAbierto = false">Panel Admin</router-link></li>
            <li><router-link to="/usuarios" @click="menuAbierto = false">Usuarios</router-link></li>
          </template>
          <li v-if="isLoggedIn">
            <button class="btn btn-link nav-link" @click="logout">Cerrar sesión</button>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const menuAbierto = ref(false)

const isLoggedIn = computed(() => !!store.state.token)
const userRole = computed(() => store.state.usuario?.rol || '')

const logout = () => {
  store.commit('logout')
  menuAbierto.value = false
  router.push('/login')
}
</script>

<style scoped>
.navbar-header {
  display: flex;
  align-items: center;
  background: #003366;
  color: #fff;
  padding: 10px 20px;
}
/* Círculo verde para el icono */
.menu-icon-circle {
  background: #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}
.menu-btn {
  background: transparent;
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}
.icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 22px;
  width: 22px;
}
.bar {
  display: block;
  width: 22px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
  margin-bottom: 4px;
}
.bar:last-child {
  margin-bottom: 0;
}
.navbar-title {
  font-size: 1.2rem;
  font-weight: bold;
}
.sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 220px;
  background: linear-gradient(135deg, #3ec6ff, #00e6ff 80%);
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 30px 10px 10px 20px;
  z-index: 2000;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  margin-bottom: 18px;
}
.sidebar a, .sidebar button {
  color: #003366;
  font-size: 1.1rem;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>
