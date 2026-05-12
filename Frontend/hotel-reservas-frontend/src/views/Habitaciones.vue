<template>
  <div class="hab-page">

    <!-- Page header -->
    <div class="hab-header">
      <div>
        <h1 class="hab-header__title">Habitaciones</h1>
        <p class="hab-header__sub">Explora nuestras opciones y reserva la experiencia perfecta</p>
      </div>
      <span class="hab-header__count" v-if="habitaciones.length">
        {{ habitaciones.length }} disponibles
      </span>
    </div>

    <!-- Grid of rooms -->
    <div v-if="habitaciones.length" class="hab-grid">
      <div
        v-for="h in habitaciones"
        :key="h.id"
        class="hab-card"
      >
        <div class="hab-card__img-wrap">
          <img
            :src="h.imagen_url ? h.imagen_url : miHabitacionImg"
            :alt="`Habitación ${h.numero}`"
            class="hab-card__img"
            @error="e => e.target.src = miHabitacionImg"
          />
          <span class="hab-card__badge">Disponible</span>
        </div>

        <div class="hab-card__body">
          <div class="hab-card__meta">
            <h2 class="hab-card__name">Habitación {{ h.numero }}</h2>
            <p class="hab-card__type">{{ h.tipo_nombre || h.tipo }}</p>
          </div>

          <p class="hab-card__price">
            <span class="hab-card__price-amount">${{ h.precio || h.precio_base || h.precio_noche || 0 }}</span>
            <span class="hab-card__price-unit"> / noche</span>
          </p>

          <div class="hab-card__actions">
            <router-link
              class="hab-btn hab-btn--outline"
              :to="{ name: 'DetalleHabitacion', params: { id: h.id } }"
            >
              Ver detalle
            </router-link>
            <button class="hab-btn hab-btn--primary" @click="abrirReserva(h)">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="hab-empty">
      <span class="hab-empty__icon">🏨</span>
      <h3>No hay habitaciones disponibles en este momento</h3>
      <p>Vuelve pronto para encontrar la habitación perfecta para ti.</p>
    </div>

    <!-- Reservation Modal -->
    <transition name="modal-fade">
      <div v-if="habitacionSeleccionada" class="hab-modal" @click.self="cerrarModal">
        <div class="hab-modal__card">
          <div class="hab-modal__header">
            <div>
              <h3 class="hab-modal__title">Reservar habitación {{ habitacionSeleccionada.numero }}</h3>
              <p class="hab-modal__sub">{{ habitacionSeleccionada.tipo_nombre || habitacionSeleccionada.tipo }}</p>
            </div>
            <button class="hab-modal__close" @click="cerrarModal" aria-label="Cerrar">✕</button>
          </div>

          <div class="hab-modal__grid">
            <div class="hab-modal__field">
              <label class="hab-modal__label">Check-in</label>
              <input type="date" v-model="checkin" class="hab-modal__input" />
            </div>
            <div class="hab-modal__field">
              <label class="hab-modal__label">Check-out</label>
              <input type="date" v-model="checkout" class="hab-modal__input" />
            </div>
          </div>

          <div class="hab-modal__field">
            <label class="hab-modal__label">Plan</label>
            <select v-model="planSeleccionado" class="hab-modal__input">
              <option :value="null">Sin plan adicional</option>
              <option v-for="plan in planes" :key="plan.id" :value="plan.id">
                {{ plan.nombre }} (+${{ plan.precio_adicional }})
              </option>
            </select>
          </div>

          <div class="hab-modal__field" v-if="servicios.length">
            <label class="hab-modal__label">Servicios extras</label>
            <div class="hab-modal__services">
              <label
                v-for="servicio in servicios"
                :key="servicio.id"
                class="hab-service-pill"
                :class="{ 'hab-service-pill--checked': serviciosSeleccionados.includes(servicio.id) }"
              >
                <input
                  type="checkbox"
                  :value="servicio.id"
                  v-model="serviciosSeleccionados"
                  class="hab-service-pill__input"
                />
                <span class="hab-service-pill__check">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="hab-service-pill__svg">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="hab-service-pill__info">
                  <span class="hab-service-pill__name">{{ servicio.nombre }}</span>
                  <span class="hab-service-pill__price" v-if="servicio.precio">&nbsp;+${{ servicio.precio }}</span>
                </span>
              </label>
            </div>
          </div>

          <div class="hab-modal__footer">
            <button class="hab-btn hab-btn--ghost" @click="cerrarModal">Cancelar</button>
            <button class="hab-btn hab-btn--primary" @click="confirmarReserva">
              Confirmar reserva
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';
import miHabitacionImg from '../assets/images/inside-101.png';

export default {
  setup() {
    const toast = useToast();
    const habitaciones = ref([]);
    const servicios = ref([]);
    const planes = ref([]);

    const habitacionSeleccionada = ref(null);
    const serviciosSeleccionados = ref([]);
    const planSeleccionado = ref(null);
    const checkin = ref('');
    const checkout = ref('');

    const cargarHabitaciones = async () => {
      try {
        const res = await api.get('/habitaciones/disponibles');
        habitaciones.value = res.data;
      } catch (err) {
        toast.error('Error al cargar habitaciones');
      }
    };

    const cargarOpciones = async () => {
      try {
        servicios.value = (await api.get('/servicios')).data;
        planes.value = (await api.get('/planes')).data;
      } catch {
        toast.error('Error al cargar opciones');
      }
    };

    const abrirReserva = (habitacion) => {
      habitacionSeleccionada.value = habitacion;
      const hoy = new Date();
      checkin.value = hoy.toISOString().split('T')[0];
      const manana = new Date();
      manana.setDate(hoy.getDate() + 1);
      checkout.value = manana.toISOString().split('T')[0];
      serviciosSeleccionados.value = [];
      planSeleccionado.value = null;
    };

    const cerrarModal = () => {
      habitacionSeleccionada.value = null;
    };

    const confirmarReserva = async () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (!usuario) {
        toast.error('Debes iniciar sesión para reservar');
        return;
      }
      if (new Date(checkin.value) >= new Date(checkout.value)) {
        toast.warning('La fecha de salida debe ser posterior a la de entrada');
        return;
      }
      try {
        await api.post('/reservas/reservar', {
          habitacion_id: habitacionSeleccionada.value.id,
          usuario_id: usuario.id,
          fecha_checkin: checkin.value,
          fecha_checkout: checkout.value,
          numero_huespedes: 1,
          plan_id: planSeleccionado.value,
          servicios: serviciosSeleccionados.value
        });
        toast.success('¡Reserva realizada correctamente!');
        cerrarModal();
        cargarHabitaciones();
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error al reservar');
      }
    };

    onMounted(() => {
      cargarHabitaciones();
      cargarOpciones();
    });

    return {
      habitaciones, habitacionSeleccionada,
      checkin, checkout,
      servicios, planes,
      serviciosSeleccionados, planSeleccionado,
      abrirReserva, cerrarModal, confirmarReserva,
      miHabitacionImg
    };
  }
};
</script>

<style scoped>
/* ── Page ── */
.hab-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

/* ── Header ── */
.hab-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.hab-header__title {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 900;
  color: var(--color-ink);
  letter-spacing: -0.02em;
}

.hab-header__sub {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  color: var(--color-muted);
}

.hab-header__count {
  padding: 0.35rem 0.9rem;
  background: var(--color-sage-soft);
  border: 1px solid #c3cc9b;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--color-olive-dark);
  white-space: nowrap;
}

/* ── Grid ── */
.hab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.5rem;
}

/* ── Card ── */
.hab-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform 220ms ease, box-shadow 220ms ease;
  display: flex;
  flex-direction: column;
}
.hab-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.hab-card__img-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.hab-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}
.hab-card:hover .hab-card__img {
  transform: scale(1.06);
}

.hab-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.7rem;
  background: rgba(71, 112, 58, 0.88);
  color: #d6f0cc;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

.hab-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.25rem 1.35rem 1.35rem;
  flex: 1;
}

.hab-card__name {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-ink);
}

.hab-card__type {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  color: var(--color-muted);
  font-weight: 500;
}

.hab-card__price {
  margin: 0;
}
.hab-card__price-amount {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-olive-dark);
}
.hab-card__price-unit {
  font-size: 0.82rem;
  color: var(--color-muted);
}

.hab-card__actions {
  display: flex;
  gap: 0.6rem;
  margin-top: auto;
}

/* ── Buttons ── */
.hab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  flex: 1;
  text-align: center;
}
.hab-btn--primary {
  background: var(--color-olive-dark);
  color: var(--color-bone);
  border-color: var(--color-olive-dark);
}
.hab-btn--primary:hover {
  background: #353e22;
  box-shadow: 0 8px 20px rgba(66, 72, 47, 0.28);
  transform: translateY(-1px);
}
.hab-btn--outline {
  background: transparent;
  color: var(--color-olive-dark);
  border-color: var(--color-border);
}
.hab-btn--outline:hover {
  background: var(--color-bone);
}
.hab-btn--ghost {
  background: transparent;
  color: var(--color-muted);
  border-color: var(--color-border);
}
.hab-btn--ghost:hover {
  background: var(--color-bone);
}

/* ── Empty ── */
.hab-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 35vh;
  text-align: center;
  color: var(--color-muted);
  gap: 0.5rem;
}
.hab-empty__icon { font-size: 3.5rem; }
.hab-empty h3 { margin: 0; color: var(--color-ink); font-size: 1.2rem; }
.hab-empty p  { margin: 0; font-size: 0.9rem; }

/* ── Modal ── */
.hab-modal {
  position: fixed;
  inset: 0;
  background: rgba(16, 18, 14, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.hab-modal__card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 32px 80px rgba(16, 18, 14, 0.28);
  padding: 1.75rem;
  width: 100%;
  max-width: 460px;
  display: grid;
  gap: 1.1rem;
}

.hab-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.hab-modal__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-ink);
}

.hab-modal__sub {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.hab-modal__close {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  line-height: 1;
  flex-shrink: 0;
}
.hab-modal__close:hover { background: var(--color-bone); color: var(--color-ink); }

.hab-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.hab-modal__field {
  display: grid;
  gap: 0.35rem;
}

.hab-modal__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hab-modal__input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: #f6f0e4;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 180ms, box-shadow 180ms;
}
.hab-modal__input:focus {
  outline: none;
  border-color: var(--color-olive);
  box-shadow: 0 0 0 3px rgba(111, 116, 83, 0.16);
}

.hab-modal__services {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f6f0e4;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  max-height: 150px;
  overflow-y: auto;
}

.hab-modal__service-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.88rem;
  cursor: pointer;
  color: var(--color-ink);
}

/* ── Custom service pill checkboxes ── */
.hab-modal__services {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.25rem 0;
}

.hab-service-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  background: var(--color-bone);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  user-select: none;
}

.hab-service-pill:hover {
  background: #ece5d5;
  border-color: var(--color-sage);
}

.hab-service-pill--checked {
  background: var(--color-sage-soft);
  border-color: var(--color-olive);
  box-shadow: 0 0 0 3px rgba(111, 116, 83, 0.14);
}

.hab-service-pill__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.hab-service-pill__check {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 1.5px solid var(--color-border);
  border-radius: 0.35rem;
  background: #fff;
  color: transparent;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.hab-service-pill__check svg.hab-service-pill__svg {
  width: 0.7rem !important;
  height: 0.7rem !important;
  display: block;
}

.hab-service-pill--checked .hab-service-pill__check {
  background: var(--color-olive-dark);
  border-color: var(--color-olive-dark);
  color: var(--color-bone);
}

.hab-service-pill__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 0.5rem;
  min-width: 0;
}

.hab-service-pill__name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hab-service-pill--checked .hab-service-pill__name {
  color: var(--color-olive-dark);
  font-weight: 700;
}

.hab-service-pill__price {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-muted);
  white-space: nowrap;
  padding: 0.15rem 0.5rem;
  background: rgba(0,0,0,0.05);
  border-radius: 999px;
}

.hab-service-pill--checked .hab-service-pill__price {
  background: rgba(66, 72, 47, 0.12);
  color: var(--color-olive-dark);
}

.hab-modal__footer {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

/* ── Transitions ── */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 200ms ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>