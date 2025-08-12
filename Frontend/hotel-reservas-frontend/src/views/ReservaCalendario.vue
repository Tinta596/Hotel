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
<<<<<<< HEAD
        <option
          v-for="habitacion in habitaciones"
          :key="habitacion.id"
          :value="habitacion.id"
        >
          Habitación {{ habitacion.numero }} - {{ habitacion.tipo_habitacion }}
=======
        <option v-for="habitacion in habitaciones" :key="habitacion.id" :value="habitacion.id">
          Habitación {{ habitacion.numero }}
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
        </option>
      </select>
    </div>

<<<<<<< HEAD
    <div class="mb-3">
      <label>Plan</label>
      <select v-model="planId" class="form-select">
        <option value="">Sin plan</option>
        <option v-for="plan in planes" :key="plan.id" :value="plan.id">
          {{ plan.nombre }} ({{ plan.tipo }}: {{ plan.porcentaje_descripcion }}%)
        </option>
      </select>
    </div>

    <button class="btn btn-primary" @click="verificarDisponibilidad">
      Verificar disponibilidad
    </button>

    <button class="btn btn-secondary ms-2" @click="calcularPrecio">
      Calcular precio
    </button>
=======
    <button class="btn btn-primary" @click="verificarDisponibilidad">Verificar disponibilidad</button>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a

    <div v-if="disponible !== null" class="mt-3">
      <p v-if="disponible" class="text-success">✅ La habitación está disponible</p>
      <p v-else class="text-danger">❌ No disponible en esas fechas</p>
    </div>
<<<<<<< HEAD

    <div v-if="precio !== null" class="mt-3">
      <p class="fw-bold">💰 Precio total estimado: ${{ precio.toLocaleString() }}</p>
    </div>

    <div v-if="errorMensaje" class="text-danger mt-2">
      ⚠️ {{ errorMensaje }}
    </div>
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
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
<<<<<<< HEAD
    const planId = ref('');
    const habitaciones = ref([]);
    const planes = ref([]);
    const disponible = ref(null);
    const precio = ref(null);
    const errorMensaje = ref('');

    const cargarHabitaciones = async () => {
      const res = await api.get('/habitaciones');
      habitaciones.value = res.data;
    };

    const cargarPlanes = async () => {
      const res = await api.get('/planes');
      planes.value = res.data;
    };

    const verificarDisponibilidad = async () => {
      errorMensaje.value = '';
      if (!fechaCheckin.value || !fechaCheckout.value || !habitacionId.value) {
        errorMensaje.value = 'Debes completar todos los campos';
        return;
      }

      try {
        const { data } = await api.get('/reservas/verificar', {
          params: {
            habitacion_id: habitacionId.value,
            fecha_checkin: fechaCheckin.value.toISOString().slice(0, 10),
            fecha_checkout: fechaCheckout.value.toISOString().slice(0, 10)
          }
        });

        disponible.value = data.disponible;
      } catch (error) {
        console.error('❌ Error al verificar disponibilidad:', error);
        errorMensaje.value = 'No se pudo verificar disponibilidad';
      }
    };

    const calcularPrecio = async () => {
      errorMensaje.value = '';
      precio.value = null;

      if (!fechaCheckin.value || !fechaCheckout.value || !habitacionId.value) {
        errorMensaje.value = 'Debes completar todos los campos';
        return;
      }

      try {
        const habitacion = habitaciones.value.find(h => h.id === habitacionId.value);
        const tipoHabitacionId = habitacion.tipo_habitacion_id;

        const response = await api.post('/reservas/calcular-precio', {
          fecha_checkin: fechaCheckin.value.toISOString().slice(0, 10),
          fecha_checkout: fechaCheckout.value.toISOString().slice(0, 10),
          tipo_habitacion_id: tipoHabitacionId,
          plan_id: planId.value || null
        });

        precio.value = response.data.total;
      } catch (error) {
        console.error('❌ Error al calcular precio:', error);
        errorMensaje.value = error.response?.data?.error || 'Error al calcular precio';
      }
=======
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
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    };

    onMounted(() => {
      cargarHabitaciones();
<<<<<<< HEAD
      cargarPlanes();
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    });

    return {
      fechaCheckin,
      fechaCheckout,
      habitacionId,
<<<<<<< HEAD
      planId,
      habitaciones,
      planes,
      disponible,
      precio,
      errorMensaje,
      verificarDisponibilidad,
      calcularPrecio
=======
      habitaciones,
      disponible,
      verificarDisponibilidad
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    };
  }
};
</script>