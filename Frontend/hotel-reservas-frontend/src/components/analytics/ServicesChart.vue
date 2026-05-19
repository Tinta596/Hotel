<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">Servicios Populares</h3>
      <p class="chart-subtitle">Top 5 servicios más solicitados por los huéspedes</p>
    </div>
    <div class="services-list">
      <div v-for="(s, index) in data" :key="s.nombre" class="service-item">
        <div class="service-info">
          <span class="service-rank">#{{ index + 1 }}</span>
          <span class="service-name">{{ s.nombre }}</span>
          <span class="service-count">{{ s.cantidad }} usos</span>
        </div>
        <div class="service-progress">
          <div class="progress-bar" :style="{ width: `${(s.cantidad / maxCount) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: Array
});

const maxCount = computed(() => {
  if (!props.data.length) return 1;
  return Math.max(...props.data.map(d => d.cantidad));
});
</script>

<style scoped>
.chart-container {
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 1.5rem;
  padding: 1.5rem;
  height: 100%;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: #1a1a1a;
}

.chart-subtitle {
  font-size: 0.85rem;
  color: #6a7c6b;
  margin: 0.25rem 0 0;
}

.services-list {
  display: grid;
  gap: 1.25rem;
}

.service-item {
  display: grid;
  gap: 0.5rem;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.service-rank {
  font-weight: 800;
  color: #4a5d4b;
  width: 1.5rem;
}

.service-name {
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
}

.service-count {
  font-weight: 700;
  color: #6a7c6b;
  font-size: 0.8rem;
}

.service-progress {
  height: 6px;
  background: #f4f6f2;
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #4a5d4b;
  border-radius: 99px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
