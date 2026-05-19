<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">Ingresos Mensuales</h3>
      <p class="chart-subtitle">Análisis de crecimiento de ingresos en los últimos 6 meses</p>
    </div>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  data: Array
});

const chartData = computed(() => ({
  labels: props.data.map(d => d.mes),
  datasets: [{
    label: 'Ingresos',
    data: props.data.map(d => d.total),
    backgroundColor: '#4a5d4b',
    borderRadius: 8,
    hoverBackgroundColor: '#3d4d3e',
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f0ede8' },
      ticks: {
        font: { size: 12 },
        callback: (value) => '$' + value.toLocaleString()
      }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 12 } }
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
  height: 300px;
}
</style>
