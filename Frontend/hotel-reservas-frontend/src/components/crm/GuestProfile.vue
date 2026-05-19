<template>
  <div class="guest-profile" v-if="guest" :class="{ 'gp--premium': guest.nivel_fidelidad === 'premium' }">
    <!-- Header -->
    <div class="gp-header">
      <div class="gp-avatar">
        <img v-if="guest.foto_perfil" :src="guest.foto_perfil" :alt="guest.nombre" />
        <span v-else>{{ initials }}</span>
      </div>
      <div class="gp-identity">
        <div class="gp-name-row">
          <h2 class="gp-name">{{ guest.nombre }}</h2>
          <span class="gp-level" :class="`level--${guest.nivel_fidelidad}`">{{ levelLabel }}</span>
          <span class="gp-status" :class="guest.activo ? 'status--active' : 'status--inactive'">
            {{ guest.activo ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        <p class="gp-email">{{ guest.email }}</p>
        <p class="gp-since">Cliente desde {{ formatDate(guest.created_at) }}</p>
      </div>
      <button class="gp-close" @click="$emit('close')">✕</button>
    </div>

    <!-- Tabs -->
    <div class="gp-tabs">
      <button v-for="t in tabs" :key="t.id" class="gp-tab" :class="{ 'gp-tab--active': tab === t.id }" @click="tab = t.id">
        {{ t.label }}
      </button>
    </div>

    <!-- Tab: Overview -->
    <div v-if="tab === 'overview'" class="gp-section">
      <!-- Contact info -->
      <div class="gp-info-grid">
        <div class="gp-info-item">
          <span class="gp-info-label">Documento</span>
          <span class="gp-info-val">{{ guest.documento || '—' }}</span>
        </div>
        <div class="gp-info-item">
          <span class="gp-info-label">Teléfono</span>
          <span class="gp-info-val">{{ guest.telefono || '—' }}</span>
        </div>
        <div class="gp-info-item">
          <span class="gp-info-label">Dirección</span>
          <span class="gp-info-val">{{ guest.direccion || '—' }}</span>
        </div>
        <div class="gp-info-item">
          <span class="gp-info-label">Tipo de cliente</span>
          <span class="gp-info-val gp-capitalize">{{ guest.tipo_cliente }}</span>
        </div>
      </div>
      <!-- Stats -->
      <GuestDashboard :stats="guest.stats" :isPremium="guest.nivel_fidelidad === 'premium'" />
    </div>

    <!-- Tab: Fidelidad -->
    <div v-if="tab === 'loyalty'" class="gp-section">
      <LoyaltyCard
        :points="guest.puntos_fidelidad"
        :level="guest.loyalty?.currentLevel"
        :next-min="guest.loyalty?.nextMin"
        :next-level="guest.loyalty?.nextLevel"
        :progress="guest.loyalty?.progress"
        :descuento="guest.loyalty?.descuento"
      />
      <!-- Loyalty history -->
      <div v-if="guest.loyaltyHistory?.length" class="lh-list">
        <h4 class="lh-title">Historial de puntos</h4>
        <div v-for="h in guest.loyaltyHistory" :key="h.id" class="lh-item">
          <span class="lh-pts" :class="h.tipo === 'canjeados' ? 'lh-pts--red' : 'lh-pts--green'">
            {{ h.tipo === 'canjeados' ? '-' : '+' }}{{ h.puntos }} pts
          </span>
          <span class="lh-desc">{{ h.descripcion }}</span>
          <span class="lh-date">{{ formatDate(h.creado_en) }}</span>
        </div>
      </div>
    </div>

    <!-- Tab: Historial -->
    <div v-if="tab === 'history'" class="gp-section">
      <GuestHistory :history="guest.history ?? []" :isPremium="guest.nivel_fidelidad === 'premium'" />
    </div>

    <!-- Tab: Notas -->
    <div v-if="tab === 'notes'" class="gp-section">
      <GuestNotes
        :notes="localNotes"
        :isPremium="guest.nivel_fidelidad === 'premium'"
        @create="onCreateNote"
        @update="onUpdateNote"
        @delete="onDeleteNote"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../services/api';
import GuestDashboard from './GuestDashboard.vue';
import LoyaltyCard    from './LoyaltyCard.vue';
import GuestHistory   from './GuestHistory.vue';
import GuestNotes     from './GuestNotes.vue';

const props = defineProps({ guest: { type: Object, default: null } });
const emit  = defineEmits(['close', 'refresh']);

const tab   = ref('overview');
const tabs  = [
  { id: 'overview', label: '👤 Perfil' },
  { id: 'loyalty',  label: '⭐ Fidelidad' },
  { id: 'history',  label: '📋 Historial' },
  { id: 'notes',    label: '📝 Notas' },
];

const localNotes = ref([]);

watch(() => props.guest, (g) => {
  if (g) localNotes.value = [...(g.notes ?? [])];
}, { immediate: true });

const initials = computed(() =>
  props.guest?.nombre?.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()
);
const levelLabel = computed(() =>
  ({ basico:'Básico', preferencial:'Preferencial', vip:'VIP', premium:'Premium' }[props.guest?.nivel_fidelidad] ?? 'Básico')
);

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' }) : '—';

const onCreateNote = async (data) => {
  try {
    const res = await api.post(`/guests/${props.guest.id}/notes`, data);
    localNotes.value.unshift({ id: res.data.id, ...data, creado_en: new Date().toISOString() });
  } catch (e) { console.error(e); }
};

const onUpdateNote = async (id, data) => {
  try {
    await api.put(`/guests/${props.guest.id}/notes/${id}`, data);
    const idx = localNotes.value.findIndex(n => n.id === id);
    if (idx >= 0) localNotes.value[idx] = { ...localNotes.value[idx], ...data };
  } catch (e) { console.error(e); }
};

const onDeleteNote = async (id) => {
  try {
    await api.delete(`/guests/${props.guest.id}/notes/${id}`);
    localNotes.value = localNotes.value.filter(n => n.id !== id);
  } catch (e) { console.error(e); }
};
</script>

<style scoped>
.guest-profile { display: flex; flex-direction: column; height: 100%; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.gp--premium {
  background: #0a0a0a;
  color: #e5e5e5;
}

/* Header */
.gp-header { display: flex; gap: 1rem; align-items: flex-start; padding: 1.5rem; border-bottom: 1px solid #f0ede8; }
.gp--premium .gp-header { border-bottom-color: rgba(212, 175, 55, 0.2); background: linear-gradient(to bottom, #111, #0a0a0a); }
.gp-avatar { flex: 0 0 3.5rem; width: 3.5rem; height: 3.5rem; border-radius: 50%;
             background: linear-gradient(135deg,#6a8c6b,#4a5d4b); display: grid; place-items: center;
             font-weight: 800; font-size: 1.1rem; color: white; overflow: hidden; }
.gp-avatar img { width:100%; height:100%; object-fit: cover; }
.gp--premium .gp-avatar { border: 2px solid #d4af37; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }

.gp-identity { flex: 1; min-width: 0; }
.gp-name-row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-bottom: .2rem; }
.gp-name     { font-size: 1.15rem; font-weight: 900; color: #1a1a1a; margin: 0; }
.gp--premium .gp-name { color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.2); }
.gp-level    { font-size: .65rem; font-weight: 800; padding: .2rem .5rem; border-radius: 99px; text-transform: uppercase; }
.level--basico       { background:#f0ede8; color:#6a7c6b; }
.level--preferencial { background:#e8f4e8; color:#2e7d32; }
.level--vip          { background:#fef3cd; color:#7a5f00; }
.level--premium      { background:#1a1a1a; color:#d4af37; }
.gp-status { font-size: .65rem; padding: .2rem .5rem; border-radius: 99px; font-weight: 700; }
.status--active   { background:#d1fae5; color:#065f46; }
.status--inactive { background:#fee2e2; color:#991b1b; }
.gp-email  { font-size: .82rem; color: #9aa89b; margin: 0 0 .15rem; }
.gp-since  { font-size: .72rem; color: #c5bfb5; margin: 0; }
.gp-close  { background: none; border: none; font-size: 1rem; cursor: pointer; color: #9aa89b; padding: .25rem; border-radius: 50%; transition: background 150ms; }
.gp-close:hover { background: #f0ede8; color: #1a1a1a; }
.gp--premium .gp-close:hover { background: rgba(212, 175, 55, 0.1); color: #d4af37; }

/* Tabs */
.gp-tabs { display: flex; gap: .25rem; padding: 0 1.5rem; border-bottom: 1px solid #f0ede8; }
.gp--premium .gp-tabs { border-bottom-color: rgba(212, 175, 55, 0.2); }
.gp-tab  { background: none; border: none; border-bottom: 2px solid transparent; padding: .75rem .6rem;
           font-size: .82rem; font-weight: 700; color: #9aa89b; cursor: pointer; transition: color 150ms, border-color 150ms; white-space: nowrap; }
.gp-tab--active { color: #4a5d4b; border-bottom-color: #4a5d4b; }
.gp--premium .gp-tab--active { color: #d4af37; border-bottom-color: #d4af37; }
.gp-tab:hover:not(.gp-tab--active) { color: #4a5d4b; }
.gp--premium .gp-tab:hover:not(.gp-tab--active) { color: #f0d080; }

/* Sections */
.gp-section { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

.gp-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.gp-info-item { background: #fdfaf7; border: 1px solid #f0ede8; border-radius: .85rem; padding: .85rem; }
.gp--premium .gp-info-item { background: #151515; border-color: rgba(212, 175, 55, 0.15); }
.gp-info-label { display: block; font-size: .7rem; color: #9aa89b; font-weight: 700; text-transform: uppercase; margin-bottom: .25rem; }
.gp--premium .gp-info-label { color: #888; }
.gp-info-val   { font-size: .9rem; font-weight: 700; color: #1a1a1a; }
.gp--premium .gp-info-val { color: #e5e5e5; }
.gp-capitalize { text-transform: capitalize; }

/* Loyalty history */
.lh-list  { display: flex; flex-direction: column; gap: .5rem; }
.lh-title { font-size: .9rem; font-weight: 800; color: #1a1a1a; margin: 0 0 .5rem; }
.gp--premium .lh-title { color: #d4af37; }
.lh-item  { display: flex; align-items: center; gap: .75rem; background: white; border: 1px solid #f0ede8; border-radius: .75rem; padding: .65rem .85rem; }
.gp--premium .lh-item { background: #151515; border-color: rgba(212, 175, 55, 0.1); }
.lh-pts       { font-weight: 800; font-size: .85rem; min-width: 4.5rem; }
.lh-pts--green { color: #059669; }
.lh-pts--red   { color: #dc2626; }
.lh-desc { flex: 1; font-size: .8rem; color: #4a5a4c; }
.lh-date { font-size: .7rem; color: #9aa89b; white-space: nowrap; }
</style>
