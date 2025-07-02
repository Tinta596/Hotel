<template>
  <div class="container mt-4">
    <h3>Selecciona tus fechas de reserva</h3>

    <div class="mb-3">
      <label>Fecha Check-in</label>
      <Datepicker v-model="fechaCheckin" :min-date="new Date()" />
    </div>

    <div class="mb-3">
      <label>Fecha Check-out</label>
      <Datepicker v-model="fechaCheckout" :min-date="fechaCheckin || new Date()" />
    </div>

    <div class="mb-3">
      <label>Habitación</label>
      <select v-model="habitacionId" class="form-select">
        <option disabled value="">Selecciona una habitación</option>
        <option v-for="habitacion in habitaciones" :key="habitacion.id" :value="habitacion.id">
          Habitación {{ habitacion.numero }}
        </option>
      </select>
    </div>

    <button class="btn btn-primary" @click="verificarDisponibilidad">Verificar disponibilidad</button>

    <div v-if="disponible !== null" class="mt-3">
      <p v-if="disponible" class="text-success">✅ La habitación está disponible</p>
      <p v-else class="text-danger">❌ No disponible en esas fechas</p>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import api from '../services/api';
import { ref, onMounted } from 'vue';

export default {
  components: { Datepicker },
  setup() {
    const fechaCheckin = ref(null);
    const fechaCheckout = ref(null);
    const habitacionId = ref('');
    const habitaciones = ref([]);
    const disponible = ref(null);

    const cargarHabitaciones = async () => {
      const res = await api.get('/habitaciones'); // o habitaciones disponibles
      habitaciones.value = res.data;
    };

    const verificarDisponibilidad = async () => {
      if (!fechaCheckin.value || !fechaCheckout.value || !habitacionId.value) return;

      const { data } = await api.get('/reservas/verificar', {
        params: {
          habitacion_id: habitacionId.value,
          fecha_checkin: fechaCheckin.value.toISOString().slice(0, 10),
          fecha_checkout: fechaCheckout.value.toISOString().slice(0, 10)
        }
      });

      disponible.value = data.disponible;
    };

    onMounted(() => {
      cargarHabitaciones();
    });

    return {
      fechaCheckin,
      fechaCheckout,
      habitacionId,
      habitaciones,
      disponible,
      verificarDisponibilidad
    };
  }
};
</script>