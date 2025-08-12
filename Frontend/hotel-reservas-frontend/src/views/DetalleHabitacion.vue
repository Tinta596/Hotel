<template>
  <div class="container mt-4" v-if="habitacion">
    <h2>Detalles de Habitación {{ habitacion.numero }}</h2>

    <img :src="habitacion.imagen_url || '/Hotel1.jpg'" alt="imagen habitación" class="img-fluid mb-3" />

    <ul class="list-group">
      <li class="list-group-item"><strong>Tipo:</strong> {{ habitacion.tipo_nombre }}</li>
      <li class="list-group-item"><strong>Capacidad:</strong> {{ habitacion.capacidad_personas }} personas</li>
      <li class="list-group-item"><strong>Precio base:</strong> ${{ habitacion.precio_base }}</li>
      <li class="list-group-item"><strong>Estado:</strong> {{ habitacion.estado }}</li>
      <li class="list-group-item"><strong>Descripción:</strong> {{ habitacion.descripcion }}</li>
      <li class="list-group-item" v-if="habitacion.servicios?.length">
        <strong>Servicios:</strong>
        <ul>
          <li v-for="s in habitacion.servicios" :key="s.nombre">
            {{ s.nombre }} - {{ s.descripcion }}
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <div v-else class="container mt-4">
    <p>Cargando detalles...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const habitacion = ref(null);
    const route = useRoute();
    const toast = useToast();

    const cargarDetalles = async () => {
      try {
        const res = await api.get(`/habitaciones/${route.params.id}`);
        habitacion.value = res.data;
      } catch (err) {
        toast.error('No se pudieron cargar los detalles de la habitación');
      }
    };

    onMounted(cargarDetalles);

    return { habitacion };
  }
};
</script>