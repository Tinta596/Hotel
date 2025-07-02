<template>
  <div class="container mt-4">
    <h2>Mis Reservas</h2>

    <div v-if="reservas.length">
      <div v-for="reserva in reservas" :key="reserva.id" class="card mb-3 p-3">
        <p><strong>Habitación:</strong> {{ reserva.habitacion_numero }} ({{ reserva.tipo_habitacion }})</p>
        <p><strong>Check-in:</strong> {{ reserva.fecha_checkin }}</p>
        <p><strong>Check-out:</strong> {{ reserva.fecha_checkout }}</p>
        <p><strong>Estado:</strong> {{ reserva.estado }}</p>

        <div v-if="reserva.estado === 'confirmada' || reserva.estado === 'pendiente'">
          <button class="btn btn-sm btn-warning me-2" @click="editar(reserva)">Actualizar fecha</button>
          <button class="btn btn-sm btn-danger" @click="cancelar(reserva.id)">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No tienes reservas activas.</p>
    </div>

    <!-- Formulario de edición -->
    <div v-if="reservaEditando" class="modal">
      <div class="modal-content">
        <h5>Actualizar fechas</h5>
        <label>Check-in:</label>
        <input type="date" v-model="nuevaCheckin" class="form-control" />
        <label>Check-out:</label>
        <input type="date" v-model="nuevaCheckout" class="form-control" />

        <button class="btn btn-success mt-2" @click="guardarFecha">Guardar</button>
        <button class="btn btn-secondary mt-2" @click="cancelarEdicion">Cancelar</button>
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
    const reservas = ref([]);
    const toast = useToast();

    const reservaEditando = ref(null);
    const nuevaCheckin = ref('');
    const nuevaCheckout = ref('');

    const cargarReservas = async () => {
      try {
        const res = await api.get('/reservas');
        reservas.value = res.data;
      } catch (err) {
        toast.error('Error al cargar reservas');
      }
    };

    const cancelar = async (id) => {
      try {
        await api.put(`/reservas/${id}/cancelar`);
        toast.success('Reserva cancelada');
        cargarReservas();
      } catch {
        toast.error('No se pudo cancelar');
      }
    };

    const editar = (reserva) => {
      reservaEditando.value = reserva;
      nuevaCheckin.value = reserva.fecha_checkin;
      nuevaCheckout.value = reserva.fecha_checkout;
    };

    const cancelarEdicion = () => {
      reservaEditando.value = null;
    };

    const guardarFecha = async () => {
      try {
        await api.put(`/reservas/${reservaEditando.value.id}/actualizar-fechas`, {
          fecha_checkin: nuevaCheckin.value,
          fecha_checkout: nuevaCheckout.value
        });
        toast.success('Fechas actualizadas');
        reservaEditando.value = null;
        cargarReservas();
      } catch {
        toast.error('Error al actualizar fechas');
      }
    };

    onMounted(cargarReservas);

    return {
      reservas,
      cancelar,
      editar,
      reservaEditando,
      nuevaCheckin,
      nuevaCheckout,
      guardarFecha,
      cancelarEdicion
    };
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
}
</style>