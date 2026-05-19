<template>
  <div class="analytics-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="header-title">Analítica y Reportes</h1>
        <p class="header-subtitle">Panel de control empresarial para el análisis de rendimiento hotelero</p>
      </div>
      <div class="header-actions">
        <button class="btn-export" @click="exportData">
          <DownloadIcon :size="18" />
          Exportar Reporte
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <AnalyticsCard 
        label="Total Reservas" 
        :value="data.resumen.totalReservas" 
        :trend="12"
      >
        <template #icon><CalendarIcon :size="24" /></template>
      </AnalyticsCard>
      
      <AnalyticsCard 
        label="Ingresos del Mes" 
        :value="formatCurrency(data.resumen.ingresosMes)" 
        :trend="8.5"
        variant="primary"
      >
        <template #icon><DollarIcon :size="24" /></template>
      </AnalyticsCard>

      <AnalyticsCard 
        label="Clientes Totales" 
        :value="data.resumen.totalClientes" 
        :trend="5.2"
      >
        <template #icon><UsersIcon :size="24" /></template>
      </AnalyticsCard>

      <AnalyticsCard 
        label="Servicios Activos" 
        :value="data.resumen.serviciosActivos" 
      >
        <template #icon><BellIcon :size="24" /></template>
      </AnalyticsCard>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-col main-chart">
        <RevenueChart :data="data.ingresos" />
      </div>
      <div class="chart-col side-chart">
        <OccupancyChart :stats="data.resumen" />
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <div class="bottom-col table-col">
        <RecentReservations :data="data.reservas" />
      </div>
      <div class="bottom-col side-col">
        <div class="side-stack">
          <ServicesChart :data="data.servicios" />
          <ActivityTimeline :data="data.actividad" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../services/api';
import AnalyticsCard from '../components/analytics/AnalyticsCard.vue';
import RevenueChart from '../components/analytics/RevenueChart.vue';
import OccupancyChart from '../components/analytics/OccupancyChart.vue';
import ServicesChart from '../components/analytics/ServicesChart.vue';
import RecentReservations from '../components/analytics/RecentReservations.vue';
import ActivityTimeline from '../components/analytics/ActivityTimeline.vue';
import { 
  Calendar as CalendarIcon, 
  DollarSign as DollarIcon, 
  Users as UsersIcon, 
  Bell as BellIcon,
  Download as DownloadIcon
} from 'lucide-vue-next';

const data = ref({
  resumen: {
    totalReservas: 0,
    habitacionesDisponibles: 0,
    habitacionesOcupadas: 0,
    habitacionesMantenimiento: 0,
    totalClientes: 0,
    ingresosMes: 0,
    serviciosActivos: 0
  },
  ingresos: [],
  servicios: [],
  reservas: [],
  actividad: []
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(val);
};

const cargarAnalytics = async () => {
  try {
    const res = await api.get('/analytics');
    data.value = res.data;
  } catch (error) {
    console.error('Error al cargar analítica:', error);
  }
};

const exportData = async () => {
  try {
    const response = await api.get('/analytics/export', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Reporte-Empresarial-OliveBone.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error al exportar reporte:', error);
    alert('No se pudo generar el reporte empresarial en este momento.');
  }
};

onMounted(cargarAnalytics);
</script>

<style scoped>
.analytics-dashboard {
  padding: 2rem;
  display: grid;
  gap: 2.5rem;
  background: #fdfaf7;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.25rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.header-subtitle {
  font-size: 1rem;
  color: #6a7c6b;
  margin: 0.5rem 0 0;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 0.75rem;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-export:hover {
  background: #f4f6f2;
  border-color: #4a5d4b;
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
}

.side-stack {
  display: grid;
  gap: 1.5rem;
}

@media (max-width: 1200px) {
  .charts-section, .bottom-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}
</style>
