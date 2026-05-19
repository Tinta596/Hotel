<template>
  <div class="guest-history" :class="{ 'gh--premium': isPremium }">
    <div class="gh-header">
      <h3 class="gh-title">Historial de Reservas</h3>
      <div class="gh-filters">
        <select v-model="filterEstado" class="gh-select">
          <option value="">Todos los estados</option>
          <option value="confirmada">Confirmada</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
          <option value="checkin">En curso</option>
        </select>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="gh-empty">
      No hay reservas registradas.
    </div>

    <div class="gh-timeline">
      <div v-for="(r, i) in filtered" :key="r.id" class="gh-item">
        <!-- Timeline dot -->
        <div class="gh-dot-col">
          <div class="gh-dot" :class="`dot--${r.estado}`"></div>
          <div v-if="i < filtered.length - 1" class="gh-line"></div>
        </div>

        <div class="gh-card">
          <div class="gh-card-top">
            <div class="gh-room">
              <span class="gh-room-num">Hab. {{ r.habitacion_numero }}</span>
              <span class="gh-room-type">{{ r.tipo_habitacion }}</span>
            </div>
            <span class="gh-status" :class="`status--${r.estado}`">{{ statusLabel(r.estado) }}</span>
          </div>
          <div class="gh-dates">
            {{ formatDate(r.fecha_entrada) }} → {{ formatDate(r.fecha_salida) }}
            <span class="gh-nights">{{ r.noches }} noche{{ r.noches > 1 ? 's' : '' }}</span>
          </div>
          <div class="gh-bottom">
            <span class="gh-confirm">#{{ r.numero_confirmacion }}</span>
            <span class="gh-total">{{ formatMoney(r.precio_total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  history: { type: Array, default: () => [] },
  isPremium: { type: Boolean, default: false }
});
const filterEstado = ref('');

const filtered = computed(() =>
  filterEstado.value ? props.history.filter(r => r.estado === filterEstado.value) : props.history
);

const statusLabel = (s) => ({ confirmada:'Confirmada', completada:'Completada', cancelada:'Cancelada', checkin:'En curso', pendiente:'Pendiente' }[s] ?? s);
const formatDate  = (d) => d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const formatMoney = (v) => new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(v || 0);
</script>

<style scoped>
.guest-history { display: flex; flex-direction: column; gap: 1.25rem; }
.gh-header     { display: flex; justify-content: space-between; align-items: center; }
.gh-title      { font-size: 1.05rem; font-weight: 800; color: #1a1a1a; margin: 0; }
.gh--premium .gh-title { color: #d4af37; }
.gh-select     { border: 1px solid #e8e2d8; border-radius: .65rem; padding: .4rem .75rem; font-size: .82rem; outline: none; }
.gh--premium .gh-select { background: #151515; border-color: rgba(212,175,55,0.2); color: #e5e5e5; }

.gh-empty { text-align: center; color: #9aa89b; padding: 2rem 0; }

/* Timeline */
.gh-timeline { display: flex; flex-direction: column; }
.gh-item     { display: flex; gap: 1rem; }
.gh-dot-col  { display: flex; flex-direction: column; align-items: center; }
.gh-dot      { width: 12px; height: 12px; border-radius: 50%; border: 2px solid; flex-shrink: 0; margin-top: .35rem; }
.gh-line     { flex: 1; width: 2px; background: #f0ede8; margin: .35rem 0; min-height: 1.5rem; }
.dot--confirmada { background: #d1fae5; border-color: #059669; }
.dot--completada { background: #dbeafe; border-color: #2563eb; }
.dot--cancelada  { background: #fee2e2; border-color: #dc2626; }
.dot--checkin    { background: #fef3cd; border-color: #d97706; }
.dot--pendiente  { background: #f3f4f6; border-color: #9ca3af; }

.gh-card { flex: 1; background: white; border: 1px solid #f0ede8; border-radius: 1rem; padding: 1rem; margin-bottom: .75rem;
           transition: all 180ms ease; }
.gh--premium .gh-card { background: #151515; border-color: rgba(212,175,55,0.1); }
.gh-card:hover { box-shadow: 0 4px 16px rgba(74,93,75,.1); }
.gh--premium .gh-card:hover { border-color: rgba(212,175,55,0.3); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

.gh-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: .5rem; }
.gh-room     { display: flex; flex-direction: column; }
.gh-room-num { font-weight: 800; font-size: .95rem; color: #1a1a1a; }
.gh--premium .gh-room-num { color: #e5e5e5; }
.gh-room-type{ font-size: .75rem; color: #9aa89b; }

.gh-status { font-size: .7rem; font-weight: 800; padding: .2rem .55rem; border-radius: 99px; }
.status--confirmada { background: #d1fae5; color: #065f46; }
.status--completada { background: #dbeafe; color: #1e40af; }
.status--cancelada  { background: #fee2e2; color: #991b1b; }
.status--checkin    { background: #fef3cd; color: #92400e; }
.status--pendiente  { background: #f3f4f6; color: #6b7280; }

.gh-dates  { font-size: .82rem; color: #4a5a4c; }
.gh--premium .gh-dates { color: #aaa; }
.gh-nights { background: #f4f6f2; color: #4a5d4b; font-size: .7rem; font-weight: 700; padding: .15rem .45rem; border-radius: 6px; margin-left: .5rem; }
.gh--premium .gh-nights { background: rgba(212,175,55,0.1); color: #d4af37; }

.gh-bottom  { display: flex; justify-content: space-between; margin-top: .5rem; }
.gh-confirm { font-size: .72rem; color: #9aa89b; }
.gh-total   { font-weight: 800; font-size: .9rem; color: #4a5d4b; }
.gh--premium .gh-total { color: #d4af37; }
</style>
