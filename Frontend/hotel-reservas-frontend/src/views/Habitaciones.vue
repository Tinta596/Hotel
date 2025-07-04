<template>
  <div class="container mt-4">
    <h2>Habitaciones disponibles</h2>

    <div class="row" v-if="habitaciones.length">
      <div v-for="h in habitaciones" :key="h.id" class="col-md-4 mb-4">
        <div class="card">
          <img :src="h.imagen_url" class="card-img-top" />
          <div class="card-body">
            <h5>Habitación {{ h.numero }}</h5>
            <p>{{ h.tipo_nombre }} - ${{ h.precio_base }}</p>
            <button class="btn btn-primary" @click="abrirReserva(h)">Reservar</button>
          </div>
        </div>
      </div>
    </div>

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
          <option v-for="plan in planes" :key="plan.id" :value="plan.id">{{ plan.nombre }} (+${{ plan.precio_adicional }})</option>
        </select>

        <label>Servicios:</label>
        <div v-for="servicio in servicios" :key="servicio.id">
          <input type="checkbox" :value="servicio.id" v-model="serviciosSeleccionados" />
          {{ servicio.nombre }}
        </div>

        <button class="btn btn-success mt-2" @click="confirmarReserva">Confirmar</button>
        <button class="btn btn-secondary mt-2" @click="cerrarModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const toast = useToast();
    const habitaciones = ref([]);
    const servicios = ref([]);
    const planes = ref([]);

    const habitacionSeleccionada = ref(null);
    const serviciosSeleccionados = ref([]);
    const planSeleccionado = ref(null);
    const checkin = ref('');
    const checkout = ref('');

    const cargarHabitaciones = async () => {
      const res = await api.get('/habitaciones/disponibles');
      habitaciones.value = res.data;
    };

    const cargarOpciones = async () => {
      servicios.value = (await api.get('/servicios')).data;
      planes.value = (await api.get('/planes')).data;
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
      confirmarReserva
    };
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
}
</style>