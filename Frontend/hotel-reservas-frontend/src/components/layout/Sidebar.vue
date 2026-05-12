<template>
  <aside :class="sidebarClasses">
    <div class="sidebar__brand">
      <div class="sidebar__mark">H</div>
      <div v-if="!collapsed" class="sidebar__brand-copy">
        <strong>Hotel Reservas</strong>
        <span>Enterprise Suite</span>
      </div>
    </div>

    <nav class="sidebar__nav" aria-label="Navegacion principal">
      <RouterLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="sidebar__link"
        active-class="sidebar__link--active"
        @click="$emit('navigate')"
      >
        <component :is="item.icon" :size="19" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar__footer">
      <div v-if="!collapsed" class="sidebar__status">
        <span></span>
        Operacion estable
      </div>
      <Button variant="ghost" icon-only :aria-label="collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'" @click="$emit('toggle-collapse')">
        <template #icon>
          <PanelLeftClose v-if="!collapsed" :size="18" />
          <PanelLeftOpen v-else :size="18" />
        </template>
      </Button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  BedDouble,
  CalendarCheck,
  ConciergeBell,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  UsersRound
} from 'lucide-vue-next';
import Button from '../common/Button.vue';

const props = defineProps({
  collapsed: Boolean,
  mobileOpen: Boolean
});

defineEmits(['toggle-collapse', 'navigate']);

const navigation = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Reservas', to: '/reservas', icon: CalendarCheck },
  { label: 'Habitaciones', to: '/habitaciones', icon: BedDouble },
  { label: 'Servicios', to: '/servicios', icon: ConciergeBell },
  { label: 'Usuarios', to: '/register/trabajador', icon: UsersRound }
];

const sidebarClasses = computed(() => [
  'sidebar',
  {
    'sidebar--collapsed': props.collapsed,
    'sidebar--mobile-open': props.mobileOpen
  }
]);
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 17.5rem;
  height: 100vh;
  padding: 1.2rem;
  color: #ede6d8;
  background:
    linear-gradient(180deg, rgba(31, 33, 28, 0.98), rgba(18, 20, 15, 0.99)),
    var(--color-soft-black);
  border-right: 1px solid rgba(216, 200, 173, 0.14);
  transition: width 220ms ease, transform 220ms ease;
}

.sidebar--collapsed {
  width: 5.75rem;
}

.sidebar__brand,
.sidebar__link,
.sidebar__footer,
.sidebar__status {
  display: flex;
  align-items: center;
}

.sidebar__brand {
  gap: 0.8rem;
  min-height: 3rem;
  margin-bottom: 1.5rem;
}

.sidebar__mark {
  display: grid;
  place-items: center;
  flex: 0 0 2.8rem;
  width: 2.8rem;
  height: 2.8rem;
  color: var(--color-soft-black);
  background: var(--color-beige);
  border-radius: 0.9rem;
  font-weight: 900;
}

.sidebar__brand-copy {
  display: grid;
  gap: 0.15rem;
}

.sidebar__brand-copy strong {
  color: var(--color-bone);
  font-size: 0.95rem;
}

.sidebar__brand-copy span {
  color: #a9a08c;
  font-size: 0.74rem;
}

.sidebar__nav {
  display: grid;
  gap: 0.35rem;
}

.sidebar__link {
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0 0.78rem;
  color: #c8bea9;
  border-radius: 0.85rem;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.sidebar__link:hover {
  color: var(--color-bone);
  background: rgba(238, 229, 212, 0.08);
  transform: translateX(2px);
}

.sidebar__link--active {
  color: var(--color-bone);
  background: rgba(238, 229, 212, 0.13);
}

.sidebar__footer {
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
}

.sidebar__status {
  gap: 0.45rem;
  color: #c8bea9;
  font-size: 0.78rem;
  font-weight: 700;
}

.sidebar__status span {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-sage);
  border-radius: 999px;
  box-shadow: 0 0 0 5px rgba(154, 164, 135, 0.16);
}

:deep(.ui-button--ghost) {
  color: #d8c8ad;
}

:deep(.ui-button--ghost:hover) {
  color: var(--color-bone);
  background: rgba(238, 229, 212, 0.08);
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    z-index: 60;
    transform: translateX(-105%);
    box-shadow: 24px 0 60px rgba(31, 33, 28, 0.28);
  }

  .sidebar--mobile-open {
    transform: translateX(0);
  }
}
</style>
