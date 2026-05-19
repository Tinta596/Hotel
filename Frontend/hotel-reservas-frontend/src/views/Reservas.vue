<template>
  <div class="res-page">

    <!-- Page Header -->
    <div class="res-header">
      <div>
        <h1 class="res-header__title">Mis Reservas</h1>
        <p class="res-header__sub">Administra y crea reservas de habitaciones fácilmente</p>
      </div>
    </div>

    <!-- Create reservation form -->
    <section class="res-form-card">
      <h2 class="res-section-title">➕ Nueva reserva</h2>

      <div class="res-form-grid">
        <!-- Room -->
        <div class="res-field res-field--wide">
          <label class="res-label">Habitación</label>
          <select v-model="habitacionSeleccionada" class="res-input">
            <option :value="null">Selecciona una habitación</option>
            <option v-for="h in habitaciones" :key="h.id" :value="h">
              Habitación {{ h.numero }} — {{ h.tipo }}
            </option>
          </select>
        </div>

        <!-- Dates -->
        <div class="res-field">
          <label class="res-label">Check-in</label>
          <Datepicker 
            v-model="fechaCheckinDate" 
            class="res-datepicker" 
            :disabled-dates="disabledDates"
            placeholder="Selecciona fecha"
            :lower-limit="new Date()"
          />
        </div>
        <div class="res-field">
          <label class="res-label">Check-out</label>
          <Datepicker 
            v-model="fechaCheckoutDate" 
            class="res-datepicker" 
            :disabled-dates="disabledDates"
            placeholder="Selecciona fecha"
            :lower-limit="fechaCheckinDate || new Date()"
          />
        </div>

        <!-- Guests & Plan -->
        <div class="res-field">
          <label class="res-label">N.° de huéspedes</label>
          <input type="number" v-model="huespedes" class="res-input" min="1" max="10" />
        </div>
        <div class="res-field">
          <label class="res-label">Plan (opcional)</label>
          <select v-model="planSeleccionado" class="res-input">
            <option :value="null">Sin plan</option>
            <option v-for="plan in planes" :key="plan.id" :value="plan.id">
              {{ plan.nombre }} (+${{ plan.precio_adicional }})
            </option>
          </select>
        </div>

        <!-- Notes -->
        <div class="res-field res-field--full">
          <label class="res-label">Notas (opcional)</label>
          <textarea v-model="notas" rows="2" class="res-input res-textarea"></textarea>
        </div>
      </div>

      <!-- Estimated price -->
      <div class="res-price-row">
        <span class="res-price-label">Precio estimado</span>
        <span v-if="error" class="res-price-error">{{ error }}</span>
        <span v-else class="res-price-value">{{ precioEstimado || '—' }}</span>
      </div>

      <button class="res-btn res-btn--primary" @click="crearReserva">
        Confirmar reserva
      </button>
    </section>

    <!-- My reservations list -->
    <section>
      <h2 class="res-section-title">📋 Historial de reservas</h2>

      <div v-if="reservas.length" class="res-list">
        <div v-for="res in reservas" :key="res.id" class="res-card">
          <div class="res-card__top">
            <div>
              <p class="res-card__room">🏨 Habitación {{ res.habitacion_numero }}</p>
              <p class="res-card__type">{{ res.tipo_habitacion }}</p>
            </div>
            <span class="res-card__estado" :class="estadoClass(res.estado)">
              {{ res.estado }}
            </span>
          </div>

          <div class="res-card__dates">
            <div class="res-card__date-item">
              <p class="res-card__date-label">Check-in</p>
               <p class="res-card__date-value">{{ formatFecha(res.fecha_entrada) }}</p>
            </div>
            <div class="res-card__date-sep">→</div>
            <div class="res-card__date-item">
              <p class="res-card__date-label">Check-out</p>
               <p class="res-card__date-value">{{ formatFecha(res.fecha_salida) }}</p>
            </div>
          </div>

          <div v-if="['pendiente', 'confirmada'].includes(res.estado)" class="res-card__actions">
            <button class="res-btn res-btn--outline" @click="abrirModal(res)">
              Cambiar fechas
            </button>
            <button class="res-btn res-btn--outline" @click="verFactura(res.id)">
              Ver Factura
            </button>
            <InvoiceDownloadButton :reserva-id="res.id" />
            <button 
              v-if="['admin', 'trabajador'].includes(usuario?.rol)" 
              class="res-btn res-btn--outline" 
              @click="abrirConsumoModal(res)"
              style="border-color: #4a5d4b; color: #4a5d4b; font-weight: 700;"
            >
              🍽️ Registrar Consumo
            </button>
            <button class="res-btn res-btn--danger" @click="cancelar(res.id)">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="res-empty">
        <span class="res-empty__icon">📭</span>
        <h3>No tienes reservas activas</h3>
        <p>Crea una nueva reserva usando el formulario de arriba.</p>
      </div>
    </section>

    <!-- Update dates modal -->
    <transition name="modal-fade">
      <div v-if="modalAbierto" class="res-modal" @click.self="cerrarModal">
        <div class="res-modal__card">
          <div class="res-modal__header">
            <h3 class="res-modal__title">Actualizar fechas</h3>
            <button class="res-modal__close" @click="cerrarModal">✕</button>
          </div>

          <div class="res-modal__grid">
            <div class="res-field">
              <label class="res-label">Check-in</label>
              <Datepicker 
                v-model="nuevaCheckinDate" 
                class="res-datepicker" 
                :disabled-dates="disabledDatesModal"
                :lower-limit="new Date()"
              />
            </div>
            <div class="res-field">
              <label class="res-label">Check-out</label>
              <Datepicker 
                v-model="nuevaCheckoutDate" 
                class="res-datepicker" 
                :disabled-dates="disabledDatesModal"
                :lower-limit="nuevaCheckinDate || new Date()"
              />
            </div>
          </div>

          <div class="res-modal__footer">
            <button class="res-btn res-btn--ghost" @click="cerrarModal">Cancelar</button>
            <button class="res-btn res-btn--primary" @click="guardarFecha">Guardar cambios</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Invoice Modal -->
    <InvoicePreviewModal 
      :is-open="facturaModalOpen" 
      :reserva-id="facturaReservaId" 
      @close="facturaModalOpen = false" 
    />

    <!-- Registrar Consumo Modal -->
    <RegistrarConsumoModal 
      :is-open="consumoModalOpen" 
      :reserva="reservaSeleccionadaConsumo" 
      @close="consumoModalOpen = false" 
      @saved="cargarDatos" 
    />
  </div>
</template>

<script>
import api from '../services/api';
import Datepicker from 'vue3-datepicker';
import { format, parseISO, eachDayOfInterval, isWithinInterval } from 'date-fns';
import InvoicePreviewModal from '../components/analytics/InvoicePreviewModal.vue';
import InvoiceDownloadButton from '../components/analytics/InvoiceDownloadButton.vue';
import RegistrarConsumoModal from '../components/crm/RegistrarConsumoModal.vue';

export default {
  components: { Datepicker, InvoicePreviewModal, InvoiceDownloadButton, RegistrarConsumoModal },
  data() {
    return {
      habitacionSeleccionada: null,
      fechaCheckin: '',
      fechaCheckout: '',
      planSeleccionado: null,
      huespedes: 1,
      notas: '',
      precioEstimado: '',
      error: '',
      habitaciones: [],
      planes: [],
      reservas: [],
      fechasOcupadas: [],
      modalAbierto: false,
      nuevaCheckin: '',
      nuevaCheckout: '',
      reservaSeleccionada: null,
      facturaModalOpen: false,
      facturaReservaId: null,
      consumoModalOpen: false,
      reservaSeleccionadaConsumo: null,
      usuario: null
    };
  },


  computed: {
    fechaCheckinDate: {
      get() { return this.fechaCheckin ? parseISO(this.fechaCheckin) : null; },
      set(val) { this.fechaCheckin = val ? format(val, 'yyyy-MM-dd') : ''; }
    },
    fechaCheckoutDate: {
      get() { return this.fechaCheckout ? parseISO(this.fechaCheckout) : null; },
      set(val) { this.fechaCheckout = val ? format(val, 'yyyy-MM-dd') : ''; }
    },
    nuevaCheckinDate: {
      get() { return this.nuevaCheckin ? parseISO(this.nuevaCheckin) : null; },
      set(val) { this.nuevaCheckin = val ? format(val, 'yyyy-MM-dd') : ''; }
    },
    nuevaCheckoutDate: {
      get() { return this.nuevaCheckout ? parseISO(this.nuevaCheckout) : null; },
      set(val) { this.nuevaCheckout = val ? format(val, 'yyyy-MM-dd') : ''; }
    },
    disabledDates() {
      return {
        dates: this.fechasOcupadas.flatMap(range => 
          eachDayOfInterval({ start: parseISO(range.fecha_entrada), end: parseISO(range.fecha_salida) })
        )
      };
    },
    disabledDatesModal() {
      if (!this.reservaSeleccionada) return this.disabledDates;
      // Para el modal, excluimos la reserva actual del bloqueo
      const filtradas = this.fechasOcupadas.filter(f => f.id !== this.reservaSeleccionada.id);
      return {
        dates: filtradas.flatMap(range => 
          eachDayOfInterval({ start: parseISO(range.fecha_entrada), end: parseISO(range.fecha_salida) })
        )
      };
    }
  },

  watch: {
    habitacionSeleccionada: {
      handler(newVal) {
        this.cargarOcupacion();
        this.calcularPrecio();
      },
      immediate: true
    },
    fechaCheckin: 'calcularPrecio',
    fechaCheckout: 'calcularPrecio',
    planSeleccionado: 'calcularPrecio'
  },

  methods: {
    formatFecha(fecha) {
      if (!fecha) return '—';
      return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    estadoClass(estado) {
      if (estado === 'confirmada') return 'estado--confirmada';
      if (estado === 'pendiente')  return 'estado--pendiente';
      if (estado === 'cancelada')  return 'estado--cancelada';
      return '';
    },

    async cargarDatos() {
      try {
        const [habitacionesRes, planesRes, reservasRes] = await Promise.all([
          api.get('/habitaciones/disponibles'),
          api.get('/planes'),
          api.get('/reservas')
        ]);
        this.habitaciones = habitacionesRes.data.map(h => ({
          ...h,
          tipo_id: h.tipo_id || h.tipo_habitacion_id || null
        }));
        this.planes = planesRes.data;
        this.reservas = reservasRes.data;
      } catch (error) {
        this.error = 'Error al cargar datos.';
        console.error(error);
      }
    },

    async cargarOcupacion() {
      if (!this.habitacionSeleccionada) {
        this.fechasOcupadas = [];
        return;
      }
      try {
        const res = await api.get(`/reservas/ocupacion/${this.habitacionSeleccionada.id}`);
        this.fechasOcupadas = res.data;
      } catch (error) {
        console.error('Error al cargar ocupación:', error);
      }
    },

    async calcularPrecio() {
      this.error = '';
      this.precioEstimado = '';
      if (!this.habitacionSeleccionada || !this.fechaCheckin || !this.fechaCheckout) return;
      try {
        const res = await api.post('/reservas/calcular-precio', {
          fecha_checkin: this.fechaCheckin,
          fecha_checkout: this.fechaCheckout,
          habitacion_id: this.habitacionSeleccionada.id,
          plan_id: this.planSeleccionado || null
        });
        this.precioEstimado = `$${res.data.total}`;
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo calcular el precio.';
      }
    },

    async crearReserva() {
      if (!this.habitacionSeleccionada || !this.fechaCheckin || !this.fechaCheckout) {
        this.error = 'Por favor completa los campos obligatorios.';
        return;
      }
      try {
        await api.post('/reservas', {
          habitacion_id: this.habitacionSeleccionada.id,
          fecha_checkin: this.fechaCheckin,
          fecha_checkout: this.fechaCheckout,
          plan_id: this.planSeleccionado || null,
          numero_huespedes: this.huespedes,
          notas: this.notas
        });
        await this.cargarDatos();
        this.resetFormulario();
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo crear la reserva.';
      }
    },

    resetFormulario() {
      this.habitacionSeleccionada = null;
      this.fechaCheckin = '';
      this.fechaCheckout = '';
      this.planSeleccionado = null;
      this.huespedes = 1;
      this.notas = '';
      this.precioEstimado = '';
      this.error = '';
    },

    abrirModal(reserva) {
      this.modalAbierto = true;
      this.nuevaCheckin = reserva.fecha_entrada;
      this.nuevaCheckout = reserva.fecha_salida;
      this.reservaSeleccionada = reserva;
    },

    cerrarModal() {
      this.modalAbierto = false;
      this.nuevaCheckin = '';
      this.nuevaCheckout = '';
      this.reservaSeleccionada = null;
    },

    async guardarFecha() {
      try {
        await api.patch(`/reservas/${this.reservaSeleccionada.id}/fechas`, {
          fecha_checkin: this.nuevaCheckin,
          fecha_checkout: this.nuevaCheckout,
          habitacion_id: this.reservaSeleccionada.habitacion_id
        });
        await this.cargarDatos();
        this.cerrarModal();
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo actualizar la reserva.';
      }
    },

    async cancelar(id) {
      if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
      try {
        await api.delete(`/reservas/${id}`);
        await this.cargarDatos();
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo cancelar la reserva.';
      }
    },

    verFactura(id) {
      this.facturaReservaId = id;
      this.facturaModalOpen = true;
    },

    abrirConsumoModal(reserva) {
      this.reservaSeleccionadaConsumo = reserva;
      this.consumoModalOpen = true;
    }
  },

  mounted() {
    const usuarioRaw = localStorage.getItem('usuario');
    if (usuarioRaw) {
      try {
        this.usuario = JSON.parse(usuarioRaw);
      } catch (e) {
        console.error('Error al parsear usuario en Reservas.vue', e);
      }
    }
    this.cargarDatos();
  }
};
</script>

<style scoped>
/* ── Page ── */
.res-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
  display: grid;
  gap: 2.5rem;
}

/* ── Header ── */
.res-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.res-header__title {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 900;
  color: var(--color-ink);
  letter-spacing: -0.02em;
}
.res-header__sub {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  color: var(--color-muted);
}

/* ── Section title ── */
.res-section-title {
  margin: 0 0 1.25rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.01em;
}

/* ── Form card ── */
.res-form-card {
  padding: 1.75rem 1.85rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.25rem;
}

.res-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.res-field {
  display: grid;
  gap: 0.35rem;
}
.res-field--wide { grid-column: 1 / -1; }
.res-field--full { grid-column: 1 / -1; }

.res-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.res-input {
  width: 100%;
  padding: 0.68rem 0.9rem;
  background: #f6f0e4;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 180ms, box-shadow 180ms;
}
.res-input:focus {
  outline: none;
  border-color: var(--color-olive);
  box-shadow: 0 0 0 3px rgba(111, 116, 83, 0.16);
}

:deep(.res-datepicker) {
  width: 100%;
}

:deep(.v3dp__datepicker) {
  --v3dp-bg-color: #f6f0e4;
  --v3dp-border-color: var(--color-border);
  --v3dp-hover-bg-color: var(--color-sage-soft);
  --v3dp-selected-bg-color: var(--color-olive-dark);
  --v3dp-selected-color: var(--color-bone);
}

:deep(.v3dp__input) {
  width: 100%;
  padding: 0.68rem 0.9rem;
  background: #f6f0e4;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.9rem;
}

.res-textarea {
  resize: vertical;
  min-height: 70px;
}

/* ── Price row ── */
.res-price-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  background: var(--color-sage-soft);
  border: 1px solid #c3cc9b;
  border-radius: var(--radius-md);
}
.res-price-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-olive-dark);
}
.res-price-value {
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--color-olive-dark);
  margin-left: auto;
}
.res-price-error {
  font-size: 0.85rem;
  color: var(--color-danger);
  margin-left: auto;
  font-weight: 700;
}

/* ── Buttons ── */
.res-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1.2rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  text-align: center;
}
.res-btn--primary {
  background: var(--color-olive-dark);
  color: var(--color-bone);
}
.res-btn--primary:hover {
  background: #353e22;
  box-shadow: 0 10px 24px rgba(66, 72, 47, 0.28);
  transform: translateY(-1px);
}
.res-btn--outline {
  background: var(--color-card);
  color: var(--color-ink);
  border-color: var(--color-border);
}
.res-btn--outline:hover { background: var(--color-bone); }
.res-btn--danger {
  background: var(--color-danger);
  color: #f7d5d0;
}
.res-btn--danger:hover { background: #7a2b22; }
.res-btn--ghost {
  background: transparent;
  color: var(--color-muted);
  border-color: var(--color-border);
}
.res-btn--ghost:hover { background: var(--color-bone); }

/* ── Reservations list ── */
.res-list {
  display: grid;
  gap: 1rem;
}

.res-card {
  padding: 1.35rem 1.5rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1rem;
  transition: box-shadow 180ms ease;
}
.res-card:hover { box-shadow: var(--shadow-hover); }

.res-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.res-card__room {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-ink);
}
.res-card__type {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--color-muted);
}

.res-card__estado {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: capitalize;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.modern-table th {
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ead9f;
  border-bottom: 1px solid #f0ede8;
}

.text-right { text-align: right; }

.modern-table td { text-align: right; }

.modern-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0ede8;
}

.estado--confirmada { background: #d6f0cc; color: #2e5c20; }
.estado--pendiente  { background: #f7e8c8; color: #7a6020; }
.estado--cancelada  { background: #f7d5d0; color: #7a2b22; }

.res-card__dates {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: #f6f0e4;
  border-radius: var(--radius-md);
}

.res-card__date-item { display: grid; gap: 0.1rem; }
.res-card__date-sep { color: var(--color-muted); font-size: 1.2rem; }

.res-card__date-label {
  margin: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}
.res-card__date-value {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-ink);
}

.res-card__actions {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

/* ── Empty ── */
.res-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-muted);
  gap: 0.5rem;
}
.res-empty__icon { font-size: 3rem; }
.res-empty h3 { margin: 0; color: var(--color-ink); font-size: 1.1rem; }
.res-empty p  { margin: 0; font-size: 0.9rem; }

/* ── Modal ── */
.res-modal {
  position: fixed;
  inset: 0;
  background: rgba(16, 18, 14, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  backdrop-filter: blur(4px);
}
.res-modal__card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 32px 80px rgba(16, 18, 14, 0.28);
  padding: 1.75rem;
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 1.1rem;
}
.res-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.res-modal__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-ink);
}
.res-modal__close {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.res-modal__close:hover { background: var(--color-bone); color: var(--color-ink); }
.res-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.res-modal__footer {
  display: flex;
  gap: 0.75rem;
}

/* ── Transition ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 200ms ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 600px) {
  .res-form-grid { grid-template-columns: 1fr; }
  .res-field--wide { grid-column: auto; }
  .res-modal__grid { grid-template-columns: 1fr; }
}
</style>