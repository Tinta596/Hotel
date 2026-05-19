<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">Ocupación Actual</h3>
      <p class="chart-subtitle">Distribución del estado de las habitaciones</p>
    </div>
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  stats: Object
});

const chartData = computed(() => ({
  labels: ['Disponibles', 'Ocupadas', 'Mantenimiento'],
  datasets: [{
    data: [
      props.stats.habitacionesDisponibles,
      props.stats.habitacionesOcupadas,
      props.stats.habitacionesMantenimiento
    ],
    backgroundColor: ['#9ead9f', '#4a5d4b', '#d32f2f'],
    borderWidth: 0,
    hoverOffset: 4
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: '600' }
      }
    },
    tooltip: {
      backgroundColor: '#1a1a1a',
      padding: 12,
      cornerRadius: 8
    }
  }
};
</script>

<style scoped>
.chart-container {
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 1.5rem;
  padding: 1.5rem;
  height: 100%;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: #1a1a1a;
}

.chart-subtitle {
  font-size: 0.85rem;
  color: #6a7c6b;
  margin: 0.25rem 0 0;
}

.chart-wrapper {
  height: 250px;
  position: relative;
}
</style>
