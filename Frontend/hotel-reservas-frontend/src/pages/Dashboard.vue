<template>
  <MainLayout title="Dashboard">
    <div class="dashboard">
      <section class="dashboard__hero">
        <div>
          <Badge variant="info" dot>Operacion hotelera</Badge>
          <h1>Panel administrativo</h1>
          <p>Vista ejecutiva de reservas, ocupacion, habitaciones y actividad reciente.</p>
        </div>
        <div class="dashboard__hero-actions">
          <Button variant="outline">
            <template #icon><Download :size="17" /></template>
            Exportar
          </Button>
          <Button>
            <template #icon><CalendarPlus :size="17" /></template>
            Nueva reserva
          </Button>
        </div>
      </section>

      <section class="dashboard__stats">
        <StatCard
          :icon="CalendarCheck"
          title="Total reservas"
          :value="reservas.length"
          subtitle="Reservas registradas"
          trend="+12% mensual"
          trend-variant="success"
        />
        <StatCard
          :icon="BedDouble"
          title="Habitaciones disponibles"
          :value="habitacionesDisponibles"
          subtitle="Listas para venta"
          trend="Inventario sano"
          trend-variant="info"
        />
        <StatCard
          :icon="UsersRound"
          title="Usuarios activos"
          :value="usuarios.length"
          subtitle="Perfiles en el sistema"
          trend="Equipo activo"
          trend-variant="neutral"
        />
        <StatCard
          :icon="WalletCards"
          title="Ingresos estimados"
          :value="currency(totalIngresos)"
          subtitle="Segun reservas cargadas"
          trend="+8.4%"
          trend-variant="success"
        />
      </section>

      <section class="dashboard__grid">
        <Card title="Reservas recientes" description="Ultimos movimientos confirmados" hover>
          <div class="reservation-list">
            <div v-if="cargando" class="dashboard__empty">Cargando reservas...</div>
            <div v-else-if="reservasRecientes.length === 0" class="dashboard__empty">No hay reservas recientes.</div>
            <article v-for="reserva in reservasRecientes" v-else :key="reserva.id" class="reservation-row">
              <div class="reservation-row__main">
                <strong>#{{ reserva.id }} · Habitacion {{ reserva.habitacion_id }}</strong>
                <span>{{ formatDate(reserva.fecha_checkin) }} - {{ formatDate(reserva.fecha_checkout) }}</span>
              </div>
              <div class="reservation-row__meta">
                <Badge :variant="reservationVariant(reserva.estado)" dot>
                  {{ reserva.estado || 'confirmada' }}
                </Badge>
                <strong>{{ currency(reserva.precio_total) }}</strong>
              </div>
            </article>
          </div>
        </Card>

        <Card title="Habitaciones disponibles" description="Inventario operativo" hover>
          <div class="room-grid">
            <article v-if="cargando" class="dashboard__empty">Cargando habitaciones...</article>
            <article v-for="habitacion in habitacionesDestacadas" v-else :key="habitacion.id" class="room-item">
              <div>
                <strong>Habitacion {{ habitacion.numero }}</strong>
                <span>{{ habitacion.tipo_nombre || habitacion.tipo || 'Suite hotelera' }}</span>
              </div>
              <Badge :variant="roomVariant(habitacion.estado)" dot>{{ habitacion.estado || 'disponible' }}</Badge>
            </article>
          </div>
        </Card>
      </section>

      <section class="dashboard__bottom">
        <Card title="Actividad reciente" description="Senales clave del sistema" hover>
          <div class="activity-list">
            <div v-for="item in actividad" :key="item.title" class="activity-item">
              <div class="activity-item__icon">
                <component :is="item.icon" :size="17" />
              </div>
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.description }}</span>
              </div>
              <Badge :variant="item.variant">{{ item.label }}</Badge>
            </div>
          </div>
        </Card>

        <Card title="Acciones rapidas" description="Flujos frecuentes del equipo" hover>
          <div class="quick-actions">
            <Button variant="primary" to="/reservas">
              <template #icon><CalendarCheck :size="17" /></template>
              Gestionar reservas
            </Button>
            <Button variant="outline" to="/habitaciones">
              <template #icon><BedDouble :size="17" /></template>
              Ver habitaciones
            </Button>
            <Button variant="secondary" to="/servicios">
              <template #icon><ConciergeBell :size="17" /></template>
              Servicios
            </Button>
            <Button variant="outline" to="/register/trabajador">
              <template #icon><UsersRound :size="17" /></template>
              Registrar trabajador
            </Button>
            <Button variant="outline" to="/register/admin">
              <template #icon><ShieldPlus :size="17" /></template>
              Registrar admin
            </Button>
            <Button variant="danger" :loading="cargando" @click="cargarDatos">
              <template #icon><RefreshCw :size="17" /></template>
              Sincronizar datos
            </Button>
          </div>
        </Card>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  BedDouble,
  CalendarCheck,
  CalendarPlus,
  ConciergeBell,
  Download,
  RefreshCw,
  ShieldPlus,
  Sparkles,
  UsersRound,
  WalletCards
} from 'lucide-vue-next';
import MainLayout from '../components/layout/MainLayout.vue';
import StatCard from '../components/dashboard/StatCard.vue';
import Card from '../components/common/Card.vue';
import Badge from '../components/common/Badge.vue';
import Button from '../components/common/Button.vue';
import api from '../services/api';

const cargando = ref(false);
const reservas = ref([]);
const habitaciones = ref([]);
const usuarios = ref([]);

const habitacionesDisponibles = computed(() =>
  habitaciones.value.filter(habitacion => (habitacion.estado || '').toLowerCase() === 'disponible').length
);

const totalIngresos = computed(() =>
  reservas.value.reduce((total, reserva) => total + Number(reserva.precio_total || 0), 0)
);

const reservasRecientes = computed(() => reservas.value.slice(0, 5));
const habitacionesDestacadas = computed(() => habitaciones.value.slice(0, 6));

const actividad = computed(() => [
  {
    icon: CalendarPlus,
    title: `${reservas.value.length} reservas monitoreadas`,
    description: 'Seguimiento centralizado de ocupacion y fechas.',
    variant: 'info',
    label: 'Reservas'
  },
  {
    icon: BedDouble,
    title: `${habitacionesDisponibles.value} habitaciones listas`,
    description: 'Inventario disponible para nuevas ventas.',
    variant: habitacionesDisponibles.value > 0 ? 'success' : 'warning',
    label: 'Inventario'
  },
  {
    icon: Sparkles,
    title: 'Experiencia premium activa',
    description: 'Interfaz limpia para operacion administrativa diaria.',
    variant: 'neutral',
    label: 'SaaS'
  }
]);

const cargarDatos = async () => {
  cargando.value = true;

  try {
    const [reservasResponse, habitacionesResponse, usuariosResponse] = await Promise.all([
      api.get('/reservas'),
      api.get('/habitaciones'),
      api.get('/usuarios')
    ]);

    reservas.value = Array.isArray(reservasResponse.data) ? reservasResponse.data : [];
    habitaciones.value = Array.isArray(habitacionesResponse.data) ? habitacionesResponse.data : [];
    usuarios.value = Array.isArray(usuariosResponse.data) ? usuariosResponse.data : [];
  } catch (error) {
    console.error(error);
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

const formatDate = value => {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-CO', { month: 'short', day: '2-digit' }).format(new Date(value));
};

const reservationVariant = estado => {
  const status = (estado || 'confirmada').toLowerCase();
  if (['confirmada', 'activa', 'pagada'].includes(status)) return 'success';
  if (['pendiente', 'proceso'].includes(status)) return 'warning';
  if (['cancelada', 'rechazada'].includes(status)) return 'danger';
  return 'info';
};

const roomVariant = estado => {
  const status = (estado || 'disponible').toLowerCase();
  if (status === 'disponible') return 'success';
  if (status === 'mantenimiento') return 'warning';
  if (status === 'ocupada') return 'danger';
  return 'neutral';
};

onMounted(cargarDatos);
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 1.35rem;
  animation: fadeIn 360ms ease both;
}

.dashboard__hero,
.dashboard__stats,
.dashboard__grid,
.dashboard__bottom {
  display: grid;
  gap: 1rem;
}

.dashboard__hero {
  grid-template-columns: 1fr auto;
  align-items: end;
  padding: 0.45rem 0 0.8rem;
}

.dashboard__hero h1 {
  margin: 0.8rem 0 0.35rem;
  color: var(--color-ink);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.02;
}

.dashboard__hero p {
  max-width: 44rem;
  margin: 0;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.65;
}

.dashboard__hero-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.dashboard__stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.dashboard__grid {
  grid-template-columns: minmax(0, 1.35fr) minmax(20rem, 0.85fr);
}

.dashboard__bottom {
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.7fr);
}

.reservation-list,
.room-grid,
.activity-list,
.quick-actions {
  display: grid;
  gap: 0.75rem;
}

.reservation-row,
.room-item,
.activity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem;
  background: rgba(244, 239, 229, 0.72);
  border: 1px solid rgba(222, 213, 196, 0.72);
  border-radius: 0.9rem;
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.reservation-row:hover,
.room-item:hover,
.activity-item:hover {
  transform: translateY(-2px);
  background: var(--color-card);
  border-color: var(--color-sage);
}

.reservation-row__main,
.room-item > div,
.activity-item > div:not(.activity-item__icon) {
  display: grid;
  gap: 0.22rem;
}

.reservation-row strong,
.room-item strong,
.activity-item strong {
  color: var(--color-ink);
  font-size: 0.92rem;
}

.reservation-row span,
.room-item span,
.activity-item span {
  color: var(--color-muted);
  font-size: 0.82rem;
}

.reservation-row__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.activity-item {
  justify-content: start;
  grid-template-columns: auto minmax(0, 1fr) auto;
}

.activity-item__icon {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  color: var(--color-olive-dark);
  background: var(--color-sage-soft);
  border-radius: 0.8rem;
}

.quick-actions {
  grid-template-columns: 1fr;
}

.dashboard__empty {
  padding: 1.25rem;
  color: var(--color-muted);
  background: rgba(244, 239, 229, 0.72);
  border: 1px dashed #b9ad96;
  border-radius: 0.9rem;
  font-weight: 700;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1180px) {
  .dashboard__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard__grid,
  .dashboard__bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .dashboard__hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .dashboard__hero-actions,
  .reservation-row,
  .reservation-row__meta {
    align-items: stretch;
    flex-direction: column;
  }

  .dashboard__stats {
    grid-template-columns: 1fr;
  }
}
</style>
