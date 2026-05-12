<template>
  <div class="detalle-page" v-if="habitacion">

    <!-- Hero banner -->
    <div class="detalle-hero">
      <img
        :src="habitacion.imagen_url || '/Hotel1.jpg'"
        alt="Imagen de la habitación"
        class="detalle-hero__img"
      />
      <div class="detalle-hero__overlay">
        <span class="detalle-hero__badge" :class="badgeClass">{{ habitacion.estado }}</span>
        <h1 class="detalle-hero__title">Habitación {{ habitacion.numero }}</h1>
        <p class="detalle-hero__type">{{ habitacion.tipo_nombre }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="detalle-body">

      <!-- Stats row -->
      <div class="detalle-stats">
        <div class="detalle-stat">
          <span class="detalle-stat__icon">👥</span>
          <div>
            <p class="detalle-stat__label">Capacidad</p>
            <p class="detalle-stat__value">{{ habitacion.capacidad_personas || habitacion.capacidad }} personas</p>
          </div>
        </div>
        <div class="detalle-stat">
          <span class="detalle-stat__icon">💰</span>
          <div>
            <p class="detalle-stat__label">Precio base</p>
            <p class="detalle-stat__value">${{ habitacion.precio || habitacion.precio_base || habitacion.precio_noche }} / noche</p>
          </div>
        </div>
        <div class="detalle-stat">
          <span class="detalle-stat__icon">🏷️</span>
          <div>
            <p class="detalle-stat__label">Tipo</p>
            <p class="detalle-stat__value">{{ habitacion.tipo_nombre || habitacion.tipo }}</p>
          </div>
        </div>
        <div class="detalle-stat">
          <span class="detalle-stat__icon">✅</span>
          <div>
            <p class="detalle-stat__label">Estado</p>
            <p class="detalle-stat__value capitalize">{{ habitacion.estado }}</p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="detalle-section" v-if="habitacion.descripcion">
        <h2 class="detalle-section__title">Descripción</h2>
        <p class="detalle-section__text">{{ habitacion.descripcion }}</p>
      </div>

      <!-- Services -->
      <div class="detalle-section" v-if="habitacion.servicios?.length">
        <h2 class="detalle-section__title">Servicios incluidos</h2>
        <div class="detalle-services">
          <div
            v-for="s in habitacion.servicios"
            :key="s.nombre"
            class="detalle-service-card"
          >
            <span class="detalle-service-card__icon">🛎️</span>
            <div>
              <p class="detalle-service-card__name">{{ s.nombre }}</p>
              <p class="detalle-service-card__desc">{{ s.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back button -->
      <div class="detalle-footer">
        <router-link to="/habitaciones" class="btn-back">← Volver a habitaciones</router-link>
      </div>
    </div>
  </div>

  <!-- Loading state -->
  <div v-else class="detalle-loading">
    <div class="detalle-loading__spinner"></div>
    <p>Cargando detalles de la habitación…</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const habitacion = ref(null);
    const route = useRoute();
    const toast = useToast();

    const badgeClass = computed(() => {
      const estado = habitacion.value?.estado?.toLowerCase();
      if (estado === 'disponible') return 'badge--success';
      if (estado === 'ocupada') return 'badge--danger';
      return 'badge--warning';
    });

    const cargarDetalles = async () => {
      try {
        const res = await api.get(`/habitaciones/${route.params.id}`);
        habitacion.value = res.data;
      } catch (err) {
        toast.error('No se pudieron cargar los detalles de la habitación');
      }
    };

    onMounted(cargarDetalles);

    return { habitacion, badgeClass };
  }
};
</script>

<style scoped>
/* ── Page wrapper ── */
.detalle-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem 3rem;
}

/* ── Hero ── */
.detalle-hero {
  position: relative;
  width: 100%;
  height: 380px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-hover);
}

.detalle-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.detalle-hero:hover .detalle-hero__img {
  transform: scale(1.03);
}

.detalle-hero__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  background: linear-gradient(to top, rgba(16, 18, 14, 0.82) 0%, transparent 60%);
}

.detalle-hero__badge {
  align-self: flex-start;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.badge--success { background: #47703a; color: #d6f0cc; }
.badge--danger  { background: #7a2b22; color: #f7d5d0; }
.badge--warning { background: #7a6020; color: #f7e8c8; }

.detalle-hero__title {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  color: #f6f0e4;
  line-height: 1.1;
}

.detalle-hero__type {
  margin: 0.3rem 0 0;
  font-size: 1rem;
  color: #c5b28f;
  font-weight: 500;
}

/* ── Body ── */
.detalle-body {
  margin-top: 2rem;
  display: grid;
  gap: 2rem;
}

/* ── Stats row ── */
.detalle-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.detalle-stat {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.15rem 1.25rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.detalle-stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.detalle-stat__icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.detalle-stat__label {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.detalle-stat__value {
  margin: 0.15rem 0 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ink);
}

/* ── Sections ── */
.detalle-section {
  padding: 1.5rem 1.75rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.detalle-section__title {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.01em;
}

.detalle-section__text {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.75;
}

/* ── Services grid ── */
.detalle-services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
}

.detalle-service-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: #f6f0e4;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.detalle-service-card__icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.detalle-service-card__name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-ink);
}

.detalle-service-card__desc {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* ── Footer / back btn ── */
.detalle-footer {
  display: flex;
  justify-content: flex-start;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-olive-dark);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}
.btn-back:hover {
  background: var(--color-bone);
  box-shadow: var(--shadow-soft);
  transform: translateY(-1px);
}

/* ── Loading ── */
.detalle-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 1rem;
  color: var(--color-muted);
}

.detalle-loading__spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-olive);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.capitalize { text-transform: capitalize; }
</style>