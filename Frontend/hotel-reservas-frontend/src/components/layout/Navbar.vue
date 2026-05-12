<template>
  <header class="topbar">
    <div class="topbar__left">
      <Button
        class="topbar__menu"
        variant="ghost"
        icon-only
        aria-label="Abrir menu"
        @click="$emit('toggle-sidebar')"
      >
        <template #icon><Menu :size="20" /></template>
      </Button>

      <div class="topbar__breadcrumbs">
        <span>Administracion</span>
        <ChevronRight :size="15" />
        <strong>{{ title }}</strong>
      </div>
    </div>

    <div class="topbar__search">
      <Input v-model="search" placeholder="Buscar reserva, habitacion o huesped">
        <template #icon><Search :size="18" /></template>
      </Input>
    </div>

    <div class="topbar__actions">
      <Button variant="ghost" icon-only aria-label="Notificaciones">
        <template #icon><Bell :size="19" /></template>
      </Button>

      <Button variant="outline" size="sm">
        <template #icon><Plus :size="16" /></template>
        Nueva reserva
      </Button>

      <div class="topbar__user">
        <div class="topbar__avatar">{{ initials }}</div>
        <div class="topbar__identity">
          <strong>{{ userName }}</strong>
          <span>{{ userRole }}</span>
        </div>
      </div>

      <Button variant="ghost" icon-only aria-label="Cerrar sesion" @click="logout">
        <template #icon><LogOut :size="18" /></template>
      </Button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Bell, ChevronRight, LogOut, Menu, Plus, Search } from 'lucide-vue-next';
import Button from '../common/Button.vue';
import Input from '../common/Input.vue';

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
});

defineEmits(['toggle-sidebar']);

const router = useRouter();
const store = useStore();
const search = ref('');

const storedUser = computed(() => store.state.usuario || JSON.parse(localStorage.getItem('usuario') || '{}'));
const userName = computed(() => storedUser.value?.nombre || storedUser.value?.name || 'Administrador');
const userRole = computed(() => storedUser.value?.rol || 'admin');
const initials = computed(() =>
  userName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
);

const logout = () => {
  store.commit('logout');
  router.push('/login');
};
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(13rem, 1fr) minmax(18rem, 28rem) auto;
  align-items: center;
  gap: 1rem;
  min-height: 5rem;
  padding: 1rem 1.5rem;
  background: rgba(251, 248, 240, 0.88);
  border-bottom: 1px solid rgba(222, 213, 196, 0.9);
  backdrop-filter: blur(18px);
}

.topbar__left,
.topbar__actions,
.topbar__user,
.topbar__breadcrumbs {
  display: flex;
  align-items: center;
}

.topbar__left,
.topbar__actions {
  gap: 0.75rem;
}

.topbar__breadcrumbs {
  gap: 0.4rem;
  color: var(--color-muted);
  font-size: 0.86rem;
  font-weight: 700;
}

.topbar__breadcrumbs strong {
  color: var(--color-ink);
}

.topbar__menu {
  display: none;
}

.topbar__search {
  min-width: 0;
}

.topbar__user {
  gap: 0.65rem;
  padding-left: 0.35rem;
}

.topbar__avatar {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  color: var(--color-bone);
  background: var(--color-soft-black);
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 900;
}

.topbar__identity {
  display: grid;
  gap: 0.08rem;
  min-width: 7rem;
}

.topbar__identity strong {
  color: var(--color-ink);
  font-size: 0.88rem;
}

.topbar__identity span {
  color: var(--color-muted);
  font-size: 0.75rem;
  text-transform: capitalize;
}

@media (max-width: 1024px) {
  .topbar {
    grid-template-columns: 1fr auto;
  }

  .topbar__search {
    display: none;
  }

  .topbar__menu {
    display: inline-flex;
  }
}

@media (max-width: 720px) {
  .topbar {
    min-height: 4.25rem;
    padding: 0.75rem 1rem;
  }

  .topbar__breadcrumbs span,
  .topbar__breadcrumbs svg,
  .topbar__identity,
  .topbar__actions > :nth-child(2) {
    display: none;
  }
}
</style>
