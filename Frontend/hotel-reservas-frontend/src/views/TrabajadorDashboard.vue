<template>
  <div class="container mt-4">
    <h2>Panel de Trabajador</h2>

    <!-- Consultar disponibilidad -->
    <div class="mb-4">
      <h4>Consultar disponibilidad de Habitación</h4>
      <div class="row mb-3">
        <label>Habitación</label>
        <select v-model="habitacionSeleccionada" class="form-select">
          <option :value="null">Seleccionar</option>
          <option v-for="h in habitaciones" :key="h.id" :value="h.id">
            Habitación {{ h.numero }}
          </option>
        </select>

        <div class="col-md-4">
          <label>Fecha de Registro</label>
          <input type="date" v-model="fechaCheckin" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>Fecha Verificar</label>
          <input type="date" v-model="fechaCheckout" class="form-control" />
        </div>
        <div class="col-md-12 mt-3">
          <button class="btn btn-primary" @click="consultarDisponibilidad">
            Ver Disponibilidad
          </button>
        </div>
      </div>

      <div
        v-if="disponible !== null"
        class="alert mt-3"
        :class="disponible ? 'alert-success' : 'alert-danger'"
      >
        {{ disponible ? 'Disponible para reserva' : 'No disponible para esas fechas' }}
      </div>
    </div>

    <!-- Habitaciones activas -->
    <div class="mt-4">
      <h4>Habitaciones Activas</h4>
      <ul class="list-group">
        <li
          v-for="h in habitaciones"
          :key="h.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>Número:</strong> {{ h.numero }} |
            <strong>Tipo:</strong> {{ h.tipo_nombre }} |
            <strong>Precio:</strong> ${{ h.precio_base }}
          </div>
          <router-link
            :to="`/trabajador/habitaciones/${h.id}`"
            class="btn btn-sm btn-info"
          >
            Ver Detalles
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Servicios -->
    <div class="mt-4">
      <h4>Servicios disponibles</h4>
      <ul class="list-group">
        <li v-for="s in servicios" :key="s.id" class="list-group-item">
          <strong>{{ s.nombre }}</strong> : {{ s.descripcion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const habitaciones = ref([]);
    const servicios = ref([]);
    const habitacionSeleccionada = ref(null);
    const fechaCheckin = ref('');
    const fechaCheckout = ref('');
    const disponible = ref(null);
    const toast = useToast();

    const cargarDatos = async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          api.get('/habitaciones/disponibles'),
          api.get('/servicios')
        ]);

        habitaciones.value = hRes.data;
        servicios.value = sRes.data;
        console.log('✅ Habitaciones cargadas:', habitaciones.value);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        toast.error('Error al cargar habitaciones o servicios');
      }
    };

    const consultarDisponibilidad = async () => {
      if (!habitacionSeleccionada.value || !fechaCheckin.value || !fechaCheckout.value) {
        toast.warning('Selecciona habitación y fechas');
        return;
      }

      try {
        const res = await api.get('/habitaciones/verificar-disponibilidad', {
          params: {
            habitacion_id: habitacionSeleccionada.value,
            fecha_checkin: fechaCheckin.value,
            fecha_checkout: fechaCheckout.value
          }
        });

        disponible.value = res.data.disponible;
      } catch (error) {
        toast.error('Error al consultar disponibilidad');
        disponible.value = null;
      }
    };

    onMounted(cargarDatos);

    return {
      habitaciones,
      servicios,
      habitacionSeleccionada,
      fechaCheckin,
      fechaCheckout,
      disponible,
      consultarDisponibilidad
    };
  }
};
</script>