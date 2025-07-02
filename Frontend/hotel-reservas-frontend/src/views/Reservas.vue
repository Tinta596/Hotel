<template>
  <div class="container mt-4">
    <h2>Mis Reservas</h2>

    <!-- Formulario de nueva reserva -->
    <div class="card mb-4 p-3">
      <h5>Crear nueva reserva</h5>

      <div class="mb-2">
        <label>Habitación</label>
        <select v-model="nuevaReserva.habitacion_id" class="form-select">
          <option :value="null">Selecciona una habitación</option>
          <option v-for="h in habitaciones" :key="h.id" :value="h.id">
            Habitación {{ h.numero }} - {{ h.tipo_nombre }}
          </option>
        </select>
      </div>

      <div class="mb-2">
        <label>Check-in</label>
        <input type="date" v-model="nuevaReserva.fecha_checkin" class="form-control" />
      </div>

      <div class="mb-2">
        <label>Check-out</label>
        <input type="date" v-model="nuevaReserva.fecha_checkout" class="form-control" />
      </div>

      <div class="mb-2">
        <label>Número de huéspedes</label>
        <input type="number" v-model="nuevaReserva.numero_huespedes" class="form-control" min="1" max="10" />
      </div>

      <div class="mb-2">
        <label>Notas (opcional)</label>
        <textarea v-model="nuevaReserva.notas" class="form-control" rows="2"></textarea>
      </div>

      <button class="btn btn-primary mt-2" @click="crearReserva">Reservar</button>
    </div>

    <!-- Lista de reservas -->
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

    <!-- Modal editar fechas -->
    <div v-if="reservaEditando" class="modal">
      <div class="modal-content">
        <h5 class="mb-3">Actualizar fechas de reserva</h5>

        <p><strong>Habitación:</strong> {{ reservaEditando.habitacion_numero }} - {{ reservaEditando.tipo_habitacion }}</p>

        <div class="mb-2">
          <label>Check-in:</label>
          <input type="date" v-model="nuevaCheckin" class="form-control" />
        </div>

        <div class="mb-2">
          <label>Check-out:</label>
          <input type="date" v-model="nuevaCheckout" class="form-control" />
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-secondary me-2" @click="cancelarEdicion">Cancelar</button>
          <button class="btn btn-primary" @click="guardarFecha">Guardar cambios</button>
        </div>
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
    const habitaciones = ref([]);
    const toast = useToast();

    const reservaEditando = ref(null);
    const nuevaCheckin = ref('');
    const nuevaCheckout = ref('');

    const nuevaReserva = ref({
      habitacion_id: null,
      fecha_checkin: '',
      fecha_checkout: '',
      numero_huespedes: 1,
      notas: ''
    });

    const cargarReservas = async () => {
      try {
        const res = await api.get('/reservas');
        reservas.value = res.data.filter(r => r.estado !== 'cancelada');
      } catch (err) {
        toast.error('Error al cargar reservas');
      }
    };

    const cargarHabitaciones = async () => {
      try {
        const res = await api.get('/habitaciones/disponibles');
        habitaciones.value = res.data;
      } catch (err) {
        toast.error('Error al cargar habitaciones');
      }
    };

     const crearReserva = async () => {
      try {
        const { habitacion_id, fecha_checkin, fecha_checkout, numero_huespedes } = nuevaReserva.value;

        if (!habitacion_id || !fecha_checkin || !fecha_checkout || !numero_huespedes) {
          toast.warning('Completa todos los campos obligatorios');
          return;
        }

        await api.post('/reservas', nuevaReserva.value);
        toast.success('Reserva creada exitosamente');

        // Limpia el formulario
        nuevaReserva.value = {
          habitacion_id: null,
          fecha_checkin: '',
          fecha_checkout: '',
          numero_huespedes: 1,
          notas: ''
        };

      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || 'Error al reservar');
      }

    const cancelar = async (id) => {
      try {
        await api.put(`/reservas/${id}/cancelar`);
        toast.success('Reserva cancelada');

        if (reservaEditando.value?.id === id) {
          reservaEditando.value = null;
        }

        cargarReservas();
      } catch {
        toast.error('No se pudo cancelar');
      }
    };

    const toDateInput = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // retorna yyyy-MM-dd
    };  
    const editar = (reserva) => {
      reservaEditando.value = reserva;
      nuevaCheckin.value = reserva.fecha_checkin.split('T')[0];
      nuevaCheckout.value = reserva.fecha_checkout.split('T')[0];
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


    onMounted(() => {
      cargarReservas();
      cargarHabitaciones();
    });

    return {
      reservas,
      habitaciones,
      nuevaReserva,
      cancelar,
      editar,
      reservaEditando,
      nuevaCheckin,
      nuevaCheckout,
      guardarFecha,
      cancelarEdicion,
      crearReserva
      };
    }
  }
};
</script>

<style>
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

.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

</style>