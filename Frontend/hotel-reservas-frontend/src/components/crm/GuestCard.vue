<template>
  <div class="guest-card" :class="{ 'guest-card--inactive': !guest.activo }" @click="$emit('select', guest)">
    <div class="gc-avatar">
      <img v-if="guest.foto_perfil" :src="guest.foto_perfil" :alt="guest.nombre" />
      <span v-else>{{ initials }}</span>
    </div>

    <div class="gc-body">
      <div class="gc-top">
        <h3 class="gc-name">{{ guest.nombre }}</h3>
        <span class="gc-badge" :class="`badge--${guest.nivel_fidelidad}`">
          {{ levelLabel }}
        </span>
      </div>
      <p class="gc-email">{{ guest.email }}</p>
      <p v-if="guest.telefono" class="gc-phone">{{ guest.telefono }}</p>

      <div class="gc-stats">
        <div class="gc-stat">
          <span class="gc-stat__value">{{ guest.total_reservas }}</span>
          <span class="gc-stat__label">Reservas</span>
        </div>
        <div class="gc-stat">
          <span class="gc-stat__value">{{ guest.total_noches }}</span>
          <span class="gc-stat__label">Noches</span>
        </div>
        <div class="gc-stat">
          <span class="gc-stat__value">{{ formatMoney(guest.total_gastado) }}</span>
          <span class="gc-stat__label">Gastado</span>
        </div>
      </div>
    </div>

    <div class="gc-loyalty">
      <div class="gc-points">{{ guest.puntos_fidelidad }}</div>
      <div class="gc-points-label">pts</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ guest: { type: Object, required: true } });
defineEmits(['select']);

const initials = computed(() =>
  props.guest.nombre?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
);
const levelLabel = computed(() => ({
  basico: 'Básico', preferencial: 'Preferencial', vip: 'VIP', premium: 'Premium'
}[props.guest.nivel_fidelidad] ?? 'Básico'));

const formatMoney = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0);
</script>

<style scoped>
.guest-card {
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 1.25rem;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  position: relative;
  overflow: hidden;
}
.guest-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(74,93,75,.04) 0%, transparent 60%);
  pointer-events: none;
}
.guest-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(74,93,75,.12);
  border-color: #c5d4c6;
}
.guest-card--inactive { opacity: .55; }

/* Avatar */
.gc-avatar {
  flex: 0 0 3rem;
  width: 3rem; height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a8c6b, #4a5d4b);
  display: grid; place-items: center;
  font-weight: 800; font-size: 1rem; color: white;
  overflow: hidden; box-shadow: 0 4px 12px rgba(74,93,75,.2);
}
.gc-avatar img { width: 100%; height: 100%; object-fit: cover; }

/* Body */
.gc-body { flex: 1; min-width: 0; }
.gc-top  { display: flex; align-items: center; gap: .5rem; margin-bottom: .2rem; }
.gc-name { font-size: .95rem; font-weight: 800; color: #1a1a1a; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.gc-badge {
  font-size: .65rem; font-weight: 800; padding: .2rem .55rem;
  border-radius: 99px; text-transform: uppercase; white-space: nowrap;
}
.badge--basico       { background: #f0ede8; color: #6a7c6b; }
.badge--preferencial { background: #e8f4e8; color: #2e6b30; }
.badge--vip          { background: #fef3cd; color: #7a5f00; }
.badge--premium      { background: #1a1a1a; color: #d4af37; }

.gc-email, .gc-phone { font-size: .8rem; color: #9aa89b; margin: 0 0 .1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.gc-stats { display: flex; gap: .75rem; margin-top: .75rem; }
.gc-stat  { display: flex; flex-direction: column; align-items: center; }
.gc-stat__value { font-size: .85rem; font-weight: 800; color: #1a1a1a; }
.gc-stat__label { font-size: .65rem; color: #9aa89b; }

/* Loyalty */
.gc-loyalty { display: flex; flex-direction: column; align-items: center; gap: .1rem; padding-left: .5rem; border-left: 1px solid #f0ede8; }
.gc-points  { font-size: 1.2rem; font-weight: 900; color: #4a5d4b; }
.gc-points-label { font-size: .65rem; color: #9aa89b; font-weight: 700; }
</style>
