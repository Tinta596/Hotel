<template>
  <div class="guest-dashboard" :class="{ 'gd--premium': isPremium }">
    <!-- Stats row -->
    <div class="gd-stats">
      <div class="gd-stat">
        <div class="gd-stat-icon" style="background:#e8f4e8"><CalendarIcon :size="18" color="#2e7d32" /></div>
        <div class="gd-stat-body">
          <span class="gd-stat-val">{{ stats.total_reservas ?? 0 }}</span>
          <span class="gd-stat-lbl">Reservas totales</span>
        </div>
      </div>
      <div class="gd-stat">
        <div class="gd-stat-icon" style="background:#fef3cd"><MoonIcon :size="18" color="#b8860b" /></div>
        <div class="gd-stat-body">
          <span class="gd-stat-val">{{ stats.total_noches ?? 0 }}</span>
          <span class="gd-stat-lbl">Noches hospedado</span>
        </div>
      </div>
      <div class="gd-stat">
        <div class="gd-stat-icon" style="background:#e0ecff"><DollarIcon :size="18" color="#2563eb" /></div>
        <div class="gd-stat-body">
          <span class="gd-stat-val">{{ formatMoney(stats.total_gastado) }}</span>
          <span class="gd-stat-lbl">Total invertido</span>
        </div>
      </div>
      <div class="gd-stat">
        <div class="gd-stat-icon" style="background:#fce8e8"><AlertIcon :size="18" color="#dc2626" /></div>
        <div class="gd-stat-body">
          <span class="gd-stat-val">{{ stats.reservas_canceladas ?? 0 }}</span>
          <span class="gd-stat-lbl">Cancelaciones</span>
        </div>
      </div>
    </div>

    <!-- Last visit -->
    <div v-if="stats.ultima_visita" class="gd-last">
      <span class="gd-last-label">Última visita</span>
      <span class="gd-last-date">{{ formatDate(stats.ultima_visita) }}</span>
    </div>
  </div>
</template>

<script setup>
import { Calendar as CalendarIcon, Moon as MoonIcon, DollarSign as DollarIcon, AlertTriangle as AlertIcon } from 'lucide-vue-next';

const props = defineProps({
  stats: { type: Object, default: () => ({}) },
  isPremium: { type: Boolean, default: false }
});

const formatMoney = (v) =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(v || 0);
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' }) : '—';
</script>

<style scoped>
.guest-dashboard { display: flex; flex-direction: column; gap: 1rem; }

.gd-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: .85rem; }

.gd-stat { display: flex; align-items: center; gap: .85rem; background: white; border: 1px solid #f0ede8;
           border-radius: 1rem; padding: 1rem; transition: all 180ms ease; }
.gd--premium .gd-stat { background: #151515; border-color: rgba(212,175,55,0.15); }
.gd-stat:hover { box-shadow: 0 4px 16px rgba(74,93,75,.1); }
.gd--premium .gd-stat:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.4); border-color: rgba(212,175,55,0.4); }
.gd-stat-icon { width: 2.5rem; height: 2.5rem; border-radius: .75rem; display: grid; place-items: center; flex-shrink: 0; }
.gd-stat-body { display: flex; flex-direction: column; }
.gd-stat-val  { font-size: 1.1rem; font-weight: 900; color: #1a1a1a; }
.gd--premium .gd-stat-val { color: #d4af37; }
.gd-stat-lbl  { font-size: .72rem; color: #9aa89b; }
.gd--premium .gd-stat-lbl { color: #888; }

.gd-last { display: flex; justify-content: space-between; align-items: center;
           background: #f4f6f2; border-radius: .85rem; padding: .75rem 1rem; }
.gd--premium .gd-last { background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); }
.gd-last-label { font-size: .8rem; color: #6a7c6b; font-weight: 700; }
.gd--premium .gd-last-label { color: #d4af37; }
.gd-last-date  { font-size: .85rem; color: #1a1a1a; font-weight: 800; }
.gd--premium .gd-last-date { color: #e5e5e5; }
</style>
