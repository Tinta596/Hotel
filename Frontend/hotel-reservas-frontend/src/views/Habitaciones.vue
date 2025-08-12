<template>
  <div class="container mt-4">
    <h2>Habitaciones disponibles</h2>

<<<<<<< HEAD
    <div v-if="habitaciones.length" class="row">
      <div v-for="h in habitaciones" :key="h.id" class="col-md-4 mb-4">
        <div class="card">
          <img
            :src="h.imagen_url ? h.imagen_url : miHabitacionImg"
            class="card-img-top"
            @error="e => e.target.src = miHabitacionImg"
          />
          <div class="card-body">
            <h5>Habitación {{ h.numero }}</h5>
            <p>{{ h.tipo_nombre }}</p>
            <p class="fw-bold text-success">Costo: ${{ h.precio_base || 0 }}</p>
            <router-link
              class="btn btn-info mt-2"
              :to="{ name: 'DetalleHabitacion', params: { id: h.id } }"
            >
              Ver detalle
            </router-link>
    <!-- MODAL DETALLE HABITACIÓN -->
    <!-- Ahora el detalle se muestra en la vista DetalleHabitacion.vue -->
=======
    <div class="row" v-if="habitaciones.length">
      <div v-for="h in habitaciones" :key="h.id" class="col-md-4 mb-4">
        <div class="card">
          <img :src="h.imagen_url" class="card-img-top" />
          <div class="card-body">
            <h5>Habitación {{ h.numero }}</h5>
            <p>{{ h.tipo_nombre }} - ${{ h.precio_base }}</p>
            <button class="btn btn-primary" @click="abrirReserva(h)">Reservar</button>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
          </div>
        </div>
      </div>
    </div>

<<<<<<< HEAD
    <div v-else>
      <p>No hay habitaciones disponibles en este momento.</p>
    </div>

=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    <!-- FORMULARIO MODAL -->
    <div v-if="habitacionSeleccionada" class="modal">
      <div class="modal-content">
        <h4>Reservar habitación {{ habitacionSeleccionada.numero }}</h4>

        <label>Check-in:</label>
        <input type="date" v-model="checkin" class="form-control" />
        <label>Check-out:</label>
        <input type="date" v-model="checkout" class="form-control" />

        <label>Plan:</label>
        <select v-model="planSeleccionado" class="form-control">
          <option :value="null">Sin plan</option>
<<<<<<< HEAD
          <option v-for="plan in planes" :key="plan.id" :value="plan.id">
            {{ plan.nombre }} (+${{ plan.precio_adicional }})
          </option>
        </select>

        <label class="mt-2">Servicios:</label>
=======
          <option v-for="plan in planes" :key="plan.id" :value="plan.id">{{ plan.nombre }} (+${{ plan.precio_adicional }})</option>
        </select>

        <label>Servicios:</label>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
        <div v-for="servicio in servicios" :key="servicio.id">
          <input type="checkbox" :value="servicio.id" v-model="serviciosSeleccionados" />
          {{ servicio.nombre }}
        </div>

<<<<<<< HEAD
        <div class="mt-3">
          <button class="btn btn-success me-2" @click="confirmarReserva">Confirmar</button>
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
        </div>
=======
        <button class="btn btn-success mt-2" @click="confirmarReserva">Confirmar</button>
        <button class="btn btn-secondary mt-2" @click="cerrarModal">Cancelar</button>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';
<<<<<<< HEAD
import miHabitacionImg from '../assets/images/inside-101.png';
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a

export default {
  setup() {
    const toast = useToast();
    const habitaciones = ref([]);
<<<<<<< HEAD
    const habitacionDetalle = ref(null);
    const verDetalle = (habitacion) => {
      habitacionDetalle.value = habitacion;
    };

    const cerrarDetalle = () => {
      habitacionDetalle.value = null;
    };
    const servicios = ref([]);
    const planes = ref([]);
    
=======
    const servicios = ref([]);
    const planes = ref([]);

>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    const habitacionSeleccionada = ref(null);
    const serviciosSeleccionados = ref([]);
    const planSeleccionado = ref(null);
    const checkin = ref('');
    const checkout = ref('');

    const cargarHabitaciones = async () => {
<<<<<<< HEAD
      try {
        const res = await api.get('/habitaciones/disponibles');
        habitaciones.value = res.data;
      } catch (err) {
        toast.error('Error al cargar habitaciones');
      }
    };

    const cargarOpciones = async () => {
      try {
        servicios.value = (await api.get('/servicios')).data;
        planes.value = (await api.get('/planes')).data;
      } catch {
        toast.error('Error al cargar opciones');
      }
=======
      const res = await api.get('/habitaciones/disponibles');
      habitaciones.value = res.data;
    };

    const cargarOpciones = async () => {
      servicios.value = (await api.get('/servicios')).data;
      planes.value = (await api.get('/planes')).data;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    };

    const abrirReserva = (habitacion) => {
      habitacionSeleccionada.value = habitacion;
      const hoy = new Date();
      checkin.value = hoy.toISOString().split('T')[0];
      const manana = new Date();
      manana.setDate(hoy.getDate() + 1);
      checkout.value = manana.toISOString().split('T')[0];
      serviciosSeleccionados.value = [];
      planSeleccionado.value = null;
    };

    const cerrarModal = () => {
      habitacionSeleccionada.value = null;
    };

    const confirmarReserva = async () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
<<<<<<< HEAD
      if (!usuario) {
        toast.error('Debes iniciar sesión para reservar');
        return;
      }

      if (new Date(checkin.value) >= new Date(checkout.value)) {
        toast.warning('La fecha de salida debe ser posterior a la de entrada');
        return;
      }
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a

      try {
        await api.post('/reservas/reservar', {
          habitacion_id: habitacionSeleccionada.value.id,
          usuario_id: usuario.id,
          fecha_checkin: checkin.value,
          fecha_checkout: checkout.value,
          numero_huespedes: 1,
          plan_id: planSeleccionado.value,
          servicios: serviciosSeleccionados.value
        });

        toast.success('Reserva realizada correctamente');
        cerrarModal();
        cargarHabitaciones();
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error al reservar');
      }
    };

    onMounted(() => {
      cargarHabitaciones();
      cargarOpciones();
    });

    return {
      habitaciones,
      habitacionSeleccionada,
      checkin,
      checkout,
      servicios,
      planes,
      serviciosSeleccionados,
      planSeleccionado,
      abrirReserva,
      cerrarModal,
<<<<<<< HEAD
      confirmarReserva,
      miHabitacionImg,
      habitacionDetalle,
      verDetalle,
      cerrarDetalle
=======
      confirmarReserva
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    };
  }
};
</script>

<style>
.modal {
  position: fixed;
<<<<<<< HEAD
  top: 0; left: 0; width: 100%; height: 100%;
=======
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
<<<<<<< HEAD
  z-index: 1000;
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
}
.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
<<<<<<< HEAD
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
=======
  border-radius: 8px;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
}
</style>