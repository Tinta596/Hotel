<template>
  <div class="container mt-4">
    <h2>Mis Reservas</h2>

<<<<<<< HEAD
    <!-- Crear nueva reserva -->
    <div class="mb-4 p-3">
      <h5>Crear nueva reserva</h5>
      <div class="row">
        <!-- Habitación -->
        <div class="col-md-6 mb-2">
          <label>Habitación</label>
          <select v-model="habitacionSeleccionada" class="form-select">
            <option :value="null">Selecciona una habitación</option>
            <option v-for="h in habitaciones" :key="h.id" :value="h">
              Habitación {{ h.numero }} - {{ h.tipo_habitacion || h.tipo_nombre }}
            </option>
          </select>
        </div>

        <!-- Fechas -->
        <div class="col-md-3 mb-2">
          <label>Check-in</label>
          <input type="date" v-model="fechaCheckin" class="form-control" />
        </div>

        <div class="col-md-3 mb-2">
          <label>Check-out</label>
          <input type="date" v-model="fechaCheckout" class="form-control" />
        </div>

        <!-- Huéspedes y plan -->
        <div class="col-md-3 mb-2">
          <label># Huéspedes</label>
          <input type="number" v-model="huespedes" class="form-control" min="1" max="10" />
        </div>

        <div class="col-md-3 mb-2">
          <label>Plan (opcional)</label>
          <select v-model="planSeleccionado" class="form-select">
            <option :value="null">Sin plan</option>
            <option v-for="plan in planes" :key="plan.id" :value="plan.id">
              {{ plan.nombre }} - {{ plan.tipo }} {{ plan.porcentaje_descripcion }}%
            </option>
          </select>
        </div>
      </div>

      <!-- Notas -->
      <div class="mb-2">
        <label>Notas (opcional)</label>
        <textarea v-model="notas" rows="2" class="form-control"></textarea>
      </div>

      <!-- Precio estimado -->
      <div class="mb-2">
        <strong>Precio estimado:</strong>
        <span v-if="error" class="text-danger">{{ error }}</span>
        <span v-else>{{ precioEstimado || '-' }}</span>
=======
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
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
      </div>

      <button class="btn btn-primary mt-2" @click="crearReserva">Reservar</button>
    </div>

    <!-- Lista de reservas -->
    <div v-if="reservas.length">
<<<<<<< HEAD
      <div v-for="res in reservas" :key="res.id" class="card mb-3 p-3">
        <p><strong>Habitación:</strong> {{ res.habitacion_numero }} ({{ res.tipo_habitacion }})</p>
        <p><strong>Check-in:</strong> {{ res.fecha_checkin }}</p>
        <p><strong>Check-out:</strong> {{ res.fecha_checkout }}</p>
        <p><strong>Estado:</strong> {{ res.estado }}</p>

        <!-- Mostrar botones solo si está pendiente o confirmada -->
        <div v-if="['pendiente', 'confirmada'].includes(res.estado)">
          <button class="btn btn-warning btn-sm me-2" @click="abrirModal(res)">
            Actualizar fechas
          </button>
          <button class="btn btn-danger btn-sm" @click="cancelar(res.id)">
            Cancelar
          </button>
        </div>
      </div>
    </div>
    <p v-else class="text-muted">No tienes reservas activas.</p>

    <!-- Modal actualizar fechas -->
    <div v-if="modalAbierto" class="modal" @click.self="cerrarModal">
      <div class="modal-content">
        <h5>Actualizar fechas</h5>
        <label>Check-in:</label>
        <input type="date" v-model="nuevaCheckin" class="form-control" />
        <label>Check-out:</label>
        <input type="date" v-model="nuevaCheckout" class="form-control" />

        <button class="btn btn-success mt-2" @click="guardarFecha">Guardar</button>
        <button class="btn btn-secondary mt-2" @click="cerrarModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      // Datos del formulario
      habitacionSeleccionada: null,
      fechaCheckin: '',
      fechaCheckout: '',
      planSeleccionado: null,
      huespedes: 1,
      notas: '',
      precioEstimado: '',
      error: '',

      // Datos cargados desde la API
      habitaciones: [],
      planes: [],
      reservas: [],

      // Modal
      modalAbierto: false,
      nuevaCheckin: '',
      nuevaCheckout: '',
      reservaSeleccionada: null
    };
  },

  watch: {
    habitacionSeleccionada: 'calcularPrecio',
    fechaCheckin: 'calcularPrecio',
    fechaCheckout: 'calcularPrecio',
    planSeleccionado: 'calcularPrecio'
  },

  methods: {
    async cargarDatos() {
      try {
        const [habitacionesRes, planesRes, reservasRes] = await Promise.all([
          api.get('/habitaciones/disponibles'),
          api.get('/planes'),
          api.get('/reservas')
        ]);
        
        this.habitaciones = habitacionesRes.data.map(h => ({
          ...h,
          tipo_id : h.tipo_habitacion_id || h.tipo_id || null
        }));
        this.planes = planesRes.data;
        this.reservas = reservasRes.data;
      } catch (error) {
        this.error = 'Error al cargar datos.';
        console.error(error);
      }
    },

    async calcularPrecio() {
      this.error = '';
      this.precioEstimado = '';

      console.log("Habitacion seleccionada: ", this.habitacionSeleccionada)

      if (!this.habitacionSeleccionada || !this.fechaCheckin || !this.fechaCheckout) return;

      const tipoHabitacionId = this.habitacionSeleccionada.tipo_id;

      if (!tipoHabitacionId) {
        this.error = 'Tipo de habitación inválido.';
        return;
      }

      try {
        const res = await api.post('/reservas/calcular-precio', {
          fecha_checkin: this.fechaCheckin,
          fecha_checkout: this.fechaCheckout,
          tipo_habitacion_id: tipoHabitacionId,
          plan_id: this.planSeleccionado || null
        });
        this.precioEstimado = `$${res.data.total}`;
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo calcular el precio.';
      }
    },

    async crearReserva() {
      if (!this.habitacionSeleccionada || !this.fechaCheckin || !this.fechaCheckout) {
        this.error = 'Por favor completa los campos obligatorios.';
        return;
      }

      try {
        await api.post('/reservas', {
          habitacion_id: this.habitacionSeleccionada.id,
          fecha_checkin: this.fechaCheckin,
          fecha_checkout: this.fechaCheckout,
          plan_id: this.planSeleccionado || null,
          numero_huespedes: this.huespedes,
          notas: this.notas
        });

        await this.cargarDatos();
        this.resetFormulario();
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo crear la reserva.';
      }
    },

    resetFormulario() {
      this.habitacionSeleccionada = null;
      this.fechaCheckin = '';
      this.fechaCheckout = '';
      this.planSeleccionado = null;
      this.huespedes = 1;
      this.notas = '';
      this.precioEstimado = '';
      this.error = '';
    },

    abrirModal(reserva) {
      this.modalAbierto = true;
      this.nuevaCheckin = reserva.fecha_checkin;
      this.nuevaCheckout = reserva.fecha_checkout;
      this.reservaSeleccionada = reserva;
    },

    cerrarModal() {
      this.modalAbierto = false;
      this.nuevaCheckin = '';
      this.nuevaCheckout = '';
      this.reservaSeleccionada = null;
    },

    async guardarFecha() {
      try {
        await api.put(`/reservas/${this.reservaSeleccionada.id}`, {
          fecha_checkin: this.nuevaCheckin,
          fecha_checkout: this.nuevaCheckout
        });

        await this.cargarDatos();
        this.cerrarModal();
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo actualizar la reserva.';
      }
    },

    async cancelar(id) {
      if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

      try {
        await api.delete(`/reservas/${id}`);
        await this.cargarDatos();
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo cancelar la reserva.';
      }
    }
  },

  mounted() {
    this.cargarDatos();
=======
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
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  }
};
</script>

<<<<<<< HEAD
<style scoped>
=======
<style>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
<<<<<<< HEAD
  z-index: 9999;
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
}
.modal-content {
  background: white;
  padding: 20px;
<<<<<<< HEAD
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
=======
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

>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
</style>