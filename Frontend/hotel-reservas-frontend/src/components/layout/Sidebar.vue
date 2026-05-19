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
        v-for="item in visibleNavigation"
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
import { useStore } from 'vuex';
import {
  BedDouble,
  CalendarCheck,
  ConciergeBell,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  UsersRound,
  Info,
  BarChart3,
  Users
} from 'lucide-vue-next';
import Button from '../common/Button.vue';

const props = defineProps({
  collapsed: Boolean,
  mobileOpen: Boolean
});

defineEmits(['toggle-collapse', 'navigate']);

const store = useStore();
const storedUser = computed(() => store.state.usuario || JSON.parse(localStorage.getItem('usuario') || '{}'));
const userRole = computed(() => storedUser.value?.rol || 'admin');

const navigation = [
  { label: 'Dashboard',      to: '/admin',      icon: LayoutDashboard, roles: ['admin'] },
  { label: 'Estadísticas',   to: '/analytics',  icon: BarChart3,       roles: ['admin'] },
  { label: 'Huéspedes',      to: '/huespedes',  icon: Users,           roles: ['admin', 'trabajador'] },
  { label: 'Reservas',       to: '/reservas',   icon: CalendarCheck,   roles: ['admin', 'trabajador', 'cliente'] },
  { label: 'Habitaciones',   to: '/habitaciones', icon: BedDouble,     roles: ['admin', 'trabajador', 'cliente'] },
  { label: 'Misión y Visión',to: '/mision-vision', icon: Info,         roles: ['admin', 'trabajador', 'cliente'] },
  { label: 'Servicios',      to: '/servicios',  icon: ConciergeBell,   roles: ['admin', 'trabajador', 'cliente'] },
  { label: 'Usuarios',       to: '/register/trabajador', icon: UsersRound, roles: ['admin'] }
];

const visibleNavigation = computed(() => 
  navigation.filter(item => !item.roles || item.roles.includes(userRole.value))
);

const sidebarClasses = computed(() => [
  'sidebar',
  {
    'sidebar--collapsed': props.collapsed,
    'sidebar--mobile-open': props.mobileOpen,
    'sidebar--premium': storedUser.value?.nivel_fidelidad === 'premium'
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
  transition: width 220ms ease, transform 220ms ease, background 0.4s ease;
}
.sidebar--premium {
  background: linear-gradient(180deg, #050505, #0a0a0a);
  border-right-color: rgba(212, 175, 55, 0.15);
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
.sidebar--premium .sidebar__mark {
  background: linear-gradient(135deg, #c9a84c, #f0d080);
  color: #000;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.sidebar__brand-copy {
  display: grid;
  gap: 0.15rem;
}

.sidebar__brand-copy strong {
  color: var(--color-bone);
  font-size: 0.95rem;
}
.sidebar--premium .sidebar__brand-copy strong {
  color: #fff;
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
.sidebar--premium .sidebar__link:hover {
  color: #f0d080;
  background: rgba(212, 175, 55, 0.1);
}

.sidebar__link--active {
  color: var(--color-bone);
  background: rgba(238, 229, 212, 0.13);
}
.sidebar--premium .sidebar__link--active {
  color: #000;
  background: linear-gradient(90deg, #c9a84c, #f0d080);
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
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
.sidebar--premium .sidebar__status span {
  background: #d4af37;
  box-shadow: 0 0 0 5px rgba(212, 175, 55, 0.15);
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
