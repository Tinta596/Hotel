<template>
  <div class="main-layout">
    <Sidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="collapsed = !collapsed"
      @navigate="mobileOpen = false"
    />

    <div v-if="mobileOpen" class="main-layout__scrim" aria-label="Cerrar menu" role="presentation" @click="mobileOpen = false"></div>

    <div class="main-layout__workspace">
      <Navbar :title="title" @toggle-sidebar="mobileOpen = true" />
      <main class="main-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
});

const collapsed = ref(false);
const mobileOpen = ref(false);
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(95, 101, 72, 0.18), transparent 28rem),
    linear-gradient(180deg, #e8dfcf 0%, #d8cbb6 100%);
}

.main-layout__workspace {
  flex: 1;
  min-width: 0;
}

.main-layout__content {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 1.6rem;
}

.main-layout__scrim {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(31, 33, 28, 0.42);
}

@media (max-width: 720px) {
  .main-layout__content {
    padding: 1rem;
  }
}
</style>
