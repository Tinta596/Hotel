<template>
  <div class="container mt-4">
    <h2>Registrarse</h2>
    <form @submit.prevent="registrar">
      <div class="mb-3">
        <label>Nombre</label>
        <input v-model="nombre" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Contraseña</label>
        <input v-model="password" type="password" class="form-control" required minlength="6" />
      </div>
      <div class="mb-3">
        <label>Teléfono</label>
        <input v-model="telefono" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Dirección</label>
        <input v-model="direccion" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Rol</label>
        <select v-model="rol" class="form-control" required>
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
          <option value="trabajador">Trabajador</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit">Registrarse</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'

const nombre = ref('')
const email = ref('')
const password = ref('')
const telefono = ref('')
const direccion = ref('')
const rol = ref('cliente')

const router = useRouter()
const toast = useToast()
const store = useStore()

const registrar = async () => {
  try {
    const res = await api.post('/auth/register', {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      telefono: telefono.value,
      direccion: direccion.value,
      rol: rol.value
    })
    // Guardar token y usuario en el store/localStorage
    auth.login(res.data) // Ajusta según tu store
    toast.success('Registro exitoso')
    router.push('/') // O a donde quieras redirigir
  } catch (err) {
    toast.error(err.response?.data?.error || 'Error al registrar')
  }
}
</script>
