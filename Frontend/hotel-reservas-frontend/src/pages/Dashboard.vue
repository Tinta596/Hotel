<template>
  <MainLayout title="Dashboard">
    <div class="dashboard">
      <!-- Header / Hero Section -->
      <section class="dashboard__hero">
        <div class="hero-content">
          <div class="badge-wrapper">
            <span class="status-badge">Operación Hotelera</span>
          </div>
          <h1>Panel Administrativo</h1>
          <p>Vista ejecutiva de reservas, ocupación, habitaciones y actividad reciente del hotel.</p>
        </div>
        <div class="hero-actions">
          <button class="btn-secondary" @click="cargarDatos">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
            Sincronizar
          </button>
          <router-link to="/admin/habitaciones" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Gestionar Habitaciones
          </router-link>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon res">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Reservas</span>
            <h2 class="stat-value">{{ reservas.length }}</h2>
            <span class="stat-trend success">Reservas registradas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon hab">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"></path><path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path><path d="M3 18h18"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Hab. Disponibles</span>
            <h2 class="stat-value">{{ habitacionesDisponibles }}</h2>
            <span class="stat-trend info">Listas para venta</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon user">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Usuarios Activos</span>
            <h2 class="stat-value">{{ usuarios.length }}</h2>
            <span class="stat-trend success">Equipo en línea</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon money">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Ingresos Estimados</span>
            <h2 class="stat-value">{{ currency(totalIngresos) }}</h2>
            <span class="stat-trend success">Ventas confirmadas</span>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Reservas Recientes -->
        <div class="grid-card">
          <div class="card-header">
            <h3>Reservas Recientes</h3>
            <router-link to="/reservas" class="view-all">Ver todas</router-link>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="loading-state">Cargando...</div>
            <div v-else-if="reservasRecientes.length === 0" class="empty-state">No hay reservas recientes</div>
            <div v-else class="data-list">
              <div v-for="res in reservasRecientes" :key="res.id" class="data-item">
                <div class="item-info">
                  <strong>Habitación {{ res.habitacion_numero }}</strong>
                  <span>Ref: {{ res.numero_confirmacion }}</span>
                </div>
                <div class="item-meta">
                  <span class="badge" :class="res.estado">{{ res.estado }}</span>
                  <span class="price">{{ currency(res.total_estimado) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventario de Habitaciones -->
        <div class="grid-card">
          <div class="card-header">
            <h3>Estado Habitaciones</h3>
            <router-link to="/habitaciones" class="view-all">Ver todas</router-link>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="loading-state">Cargando...</div>
            <div v-else class="room-grid">
              <div v-for="hab in habitacionesDestacadas" :key="hab.id" class="room-pill">
                <span class="room-num">{{ hab.numero }}</span>
                <span class="room-status" :class="hab.estado"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import MainLayout from '../components/layout/MainLayout.vue';
import api from '../services/api';

const cargando = ref(false);
const reservas = ref([]);
const habitaciones = ref([]);
const usuarios = ref([]);

const habitacionesDisponibles = computed(() =>
  habitaciones.value.filter(h => (h.estado || '').toLowerCase() === 'disponible').length
);

const totalIngresos = computed(() =>
  reservas.value.reduce((total, res) => total + Number(res.total_estimado || 0), 0)
);

const reservasRecientes = computed(() => reservas.value.slice(0, 5));
const habitacionesDestacadas = computed(() => habitaciones.value.slice(0, 15));

const cargarDatos = async () => {
  cargando.value = true;
  try {
    const [resRes, habRes, usuRes] = await Promise.all([
      api.get('/reservas'),
      api.get('/habitaciones'),
      api.get('/usuarios')
    ]);

    reservas.value = Array.isArray(resRes.data) ? resRes.data : [];
    habitaciones.value = Array.isArray(habRes.data) ? habRes.data : [];
    usuarios.value = Array.isArray(usuRes.data) ? usuRes.data : [];
  } catch (error) {
    console.error('Error al cargar datos dashboard:', error);
    reservas.value = [];
    habitaciones.value = [];
    usuarios.value = [];
  } finally {
    cargando.value = false;
  }
};

const currency = value =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

onMounted(cargarDatos);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;700&display=swap');

.dashboard {
  font-family: 'Outfit', sans-serif;
  color: #2c3e2d;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 3rem;
}

/* Hero Section */
.dashboard__hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 0;
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0.5rem 0;
  color: #1a1a1a;
}

.hero-content p {
  font-size: 1.1rem;
  color: #6a7c6b;
  max-width: 600px;
}

.status-badge {
  background: rgba(74, 93, 75, 0.1);
  color: #4a5d4b;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #4a5d4b;
  color: white;
  text-decoration: none;
}

.btn-secondary {
  background: white;
  color: #4a5d4b;
  border: 1px solid rgba(74, 93, 75, 0.2);
}

.btn-primary:hover { background: #3d4d3e; transform: translateY(-2px); }
.btn-secondary:hover { background: #fdfaf7; transform: translateY(-2px); }

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 10px 30px rgba(44, 62, 45, 0.05);
  border: 1px solid rgba(44, 62, 45, 0.03);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.res { background: #f0ede8; color: #4a5d4b; }
.stat-icon.hab { background: #eef2ef; color: #4a5d4b; }
.stat-icon.user { background: #fdfaf7; color: #c4a484; }
.stat-icon.money { background: #f0f7f1; color: #2e7d32; }

.stat-label {
  font-size: 0.9rem;
  color: #6a7c6b;
  display: block;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  margin: 2px 0;
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-trend.success { color: #2e7d32; }
.stat-trend.info { color: #4a5d4b; }

/* Content Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
}

.grid-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(44, 62, 45, 0.04);
  border: 1px solid rgba(44, 62, 45, 0.02);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  margin: 0;
}

.view-all {
  color: #c4a484;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fdfaf7;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.data-item:hover { transform: scale(1.01); background: #f9f6f1; }

.item-info { display: flex; flex-direction: column; }
.item-info strong { font-size: 0.95rem; }
.item-info span { font-size: 0.8rem; color: #6a7c6b; }

.item-meta { display: flex; align-items: center; gap: 15px; }
.price { font-weight: 700; color: #4a5d4b; }

.badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.confirmada { background: #eef2ef; color: #4a5d4b; }
.badge.pendiente { background: #fffaf0; color: #d69e2e; }

/* Room Grid */
.room-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.room-pill {
  background: #fdfaf7;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.room-num { font-weight: 700; font-size: 0.9rem; }
.room-status { width: 8px; height: 8px; border-radius: 50%; }
.room-status.disponible { background: #4caf50; box-shadow: 0 0 8px #4caf50; }
.room-status.ocupada { background: #f44336; }
.room-status.mantenimiento { background: #ff9800; }

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hero-actions { display: none; }
  .hero-content h1 { font-size: 2.5rem; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>>
