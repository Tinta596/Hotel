<template>
  <div class="container mt-5">
    <h2>Servicios del Hotel</h2>
    <div v-if="servicios.length === 0" class="mt-3">No hay servicios disponibles.</div>

    <div class="row mt-4" v-else>
      <div class="col-md-4 mb-4" v-for="servicio in servicios" :key="servicio.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ servicio.nombre }}</h5>
            <p class="card-text">{{ servicio.descripcion }}</p>
            <p><strong>Precio:</strong> ${{ servicio.precio }}</p>
            <p><strong>Horario:</strong> {{ servicio.horario_inicio }} - {{ servicio.horario_fin }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { ref, onMounted } from 'vue';

export default {
  name: 'Servicios',
  setup() {
    const servicios = ref([]);

    const cargarServicios = async () => {
      const response = await api.get('/servicios');
      servicios.value = response.data;
    };

    onMounted(cargarServicios);

    return { servicios };
  }
};
</script>
