<template>
  <div class="crm-page">
    <!-- Left Panel: search + grid -->
    <div class="crm-left" :class="{ 'crm-left--narrow': selectedGuest }">
      <!-- Header -->
      <div class="crm-header">
        <div>
          <h1 class="crm-title">Huéspedes</h1>
          <p class="crm-subtitle">{{ total }} clientes registrados</p>
        </div>
        <div class="crm-header-actions">
          <select v-model="filterNivel" class="crm-select" @change="loadGuests">
            <option value="">Todos los niveles</option>
            <option value="basico">Básico</option>
            <option value="preferencial">Preferencial</option>
            <option value="vip">VIP</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <!-- Search -->
      <div class="crm-search">
        <SearchIcon :size="17" class="crm-search-icon" />
        <input
          v-model="search"
          class="crm-search-input"
          placeholder="Buscar por nombre, email, documento, teléfono..."
          @input="debouncedLoad"
        />
        <button v-if="search" class="crm-search-clear" @click="search = ''; loadGuests()">✕</button>
      </div>

      <!-- Skeleton loading -->
      <div v-if="loading" class="crm-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card"></div>
      </div>

      <!-- Guest grid -->
      <div v-else-if="guests.length > 0" class="crm-grid">
        <GuestCard
          v-for="g in guests"
          :key="g.id"
          :guest="g"
          :class="{ 'gc-selected': selectedGuest?.id === g.id }"
          @select="openGuest"
        />
      </div>

      <div v-else class="crm-empty">
        <UsersIcon :size="48" color="#c5bfb5" />
        <p>No se encontraron huéspedes</p>
      </div>

      <!-- Pagination -->
      <div v-if="pages > 1" class="crm-pagination">
        <button class="page-btn" :disabled="page === 1" @click="goPage(page - 1)">‹</button>
        <span class="page-info">{{ page }} / {{ pages }}</span>
        <button class="page-btn" :disabled="page === pages" @click="goPage(page + 1)">›</button>
      </div>
    </div>

    <!-- Right Panel: guest detail -->
    <transition name="slide-panel">
      <div v-if="selectedGuest" class="crm-right">
        <GuestProfile
          :guest="selectedGuest"
          @close="selectedGuest = null"
          @refresh="reloadGuest"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search as SearchIcon, Users as UsersIcon } from 'lucide-vue-next';
import api       from '../services/api';
import GuestCard    from '../components/crm/GuestCard.vue';
import GuestProfile from '../components/crm/GuestProfile.vue';

const guests       = ref([]);
const selectedGuest = ref(null);
const loading      = ref(false);
const search       = ref('');
const filterNivel  = ref('');
const page         = ref(1);
const pages        = ref(1);
const total        = ref(0);

let debounceTimer = null;
const debouncedLoad = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { page.value = 1; loadGuests(); }, 350);
};

const loadGuests = async () => {
  loading.value = true;
  try {
    const res = await api.get('/guests', {
      params: { search: search.value, nivel: filterNivel.value, page: page.value, limit: 12 }
    });
    guests.value = res.data.data;
    total.value  = res.data.total;
    pages.value  = res.data.pages;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const openGuest = async (guest) => {
  try {
    const res = await api.get(`/guests/${guest.id}`);
    selectedGuest.value = res.data;
  } catch (e) { console.error(e); }
};

const reloadGuest = async () => {
  if (!selectedGuest.value) return;
  const res = await api.get(`/guests/${selectedGuest.value.id}`);
  selectedGuest.value = res.data;
};

const goPage = (p) => { page.value = p; loadGuests(); };

onMounted(loadGuests);
</script>

<style scoped>
/* Layout */
.crm-page { display: flex; height: 100%; min-height: 0; background: #fdfaf7; overflow: hidden; }

.crm-left { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; padding: 2rem; overflow-y: auto; min-width: 0; transition: flex 300ms ease; }
.crm-left--narrow { flex: 0 0 42%; min-width: 0; }

.crm-right { width: 58%; border-left: 1px solid #f0ede8; background: white; display: flex; flex-direction: column; overflow: hidden; }

/* Header */
.crm-header { display: flex; justify-content: space-between; align-items: flex-start; }
.crm-title  { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #1a1a1a; margin: 0; }
.crm-subtitle { font-size: .9rem; color: #9aa89b; margin: .25rem 0 0; }
.crm-header-actions { display: flex; gap: .75rem; align-items: center; }
.crm-select { border: 1px solid #e8e2d8; border-radius: .75rem; padding: .5rem .85rem; font-size: .85rem; outline: none; background: white; }

/* Search */
.crm-search { position: relative; display: flex; align-items: center; }
.crm-search-icon  { position: absolute; left: 1rem; color: #9aa89b; pointer-events: none; }
.crm-search-input { width: 100%; background: white; border: 1px solid #e8e2d8; border-radius: 1rem; padding: .75rem 1rem .75rem 2.75rem; font-size: .9rem; outline: none; transition: border-color 150ms, box-shadow 150ms; }
.crm-search-input:focus { border-color: #4a5d4b; box-shadow: 0 0 0 3px rgba(74,93,75,.1); }
.crm-search-clear { position: absolute; right: 1rem; background: none; border: none; cursor: pointer; color: #9aa89b; font-size: .9rem; }

/* Grid */
.crm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.gc-selected { outline: 2px solid #4a5d4b; }

/* Skeleton */
.skeleton-card { height: 140px; background: linear-gradient(90deg, #f0ede8 25%, #fdfaf7 50%, #f0ede8 75%); background-size: 200%; border-radius: 1.25rem; animation: shimmer 1.4s infinite; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* Empty */
.crm-empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem 0; color: #9aa89b; }
.crm-empty p { font-size: 1rem; }

/* Pagination */
.crm-pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; }
.page-btn  { width: 2rem; height: 2rem; border: 1px solid #e8e2d8; background: white; border-radius: .5rem; cursor: pointer; font-size: 1rem; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: .85rem; color: #9aa89b; }

/* Panel transition */
.slide-panel-enter-active { transition: transform 280ms cubic-bezier(.4,0,.2,1), opacity 280ms; }
.slide-panel-leave-active { transition: transform 220ms cubic-bezier(.4,0,.2,1), opacity 220ms; }
.slide-panel-enter-from, .slide-panel-leave-to { transform: translateX(40px); opacity: 0; }

@media (max-width: 1024px) {
  .crm-page { flex-direction: column; }
  .crm-left--narrow { flex: none; }
  .crm-right { width: 100%; height: 60vh; border-left: none; border-top: 1px solid #f0ede8; }
}
</style>
