<template>
  <div class="container mt-4">
    <h2>Mis Reservas</h2>

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
      </div>

      <button class="btn btn-primary mt-2" @click="crearReserva">Reservar</button>
    </div>

    <!-- Lista de reservas -->
    <div v-if="reservas.length">
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
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
</style>