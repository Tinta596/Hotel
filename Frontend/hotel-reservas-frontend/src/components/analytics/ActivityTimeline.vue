<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <h3 class="timeline-title">Actividad del Sistema</h3>
      <p class="timeline-subtitle">Últimos eventos y registros de auditoría</p>
    </div>
    <div class="timeline">
      <div v-for="item in data" :key="item._id" class="timeline-item">
        <div class="timeline-point"></div>
        <div class="timeline-content">
          <div class="timeline-info">
            <span class="timeline-user">{{ item.usuario_nombre }}</span>
            <span class="timeline-time">{{ formatTime(item.timestamp) }}</span>
          </div>
          <p class="timeline-desc">{{ item.descripcion || `${item.accion} en ${item.entidad}` }}</p>
          <div class="timeline-meta">
            <span class="meta-tag">{{ item.entidad }}</span>
            <span class="meta-action">{{ item.accion }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Array
});

const formatTime = (t) => {
  if (!t) return '';
  const date = new Date(t);
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.timeline-container {
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 1.5rem;
  padding: 1.5rem;
  height: 100%;
}

.timeline-header {
  margin-bottom: 2rem;
}

.timeline-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.timeline-subtitle {
  font-size: 0.85rem;
  color: #6a7c6b;
  margin: 0.25rem 0 0;
}

.timeline {
  display: grid;
  gap: 1.5rem;
  position: relative;
  padding-left: 1rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  bottom: 0;
  width: 1px;
  background: #f0ede8;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 1.5rem;
}

.timeline-point {
  position: absolute;
  left: -1rem;
  top: 0.4rem;
  width: 9px;
  height: 9px;
  background: #4a5d4b;
  border-radius: 50%;
  transform: translateX(-50%);
  border: 2px solid white;
}

.timeline-content {
  flex: 1;
  display: grid;
  gap: 0.35rem;
}

.timeline-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-user {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
}

.timeline-time {
  font-size: 0.75rem;
  color: #9ead9f;
  font-weight: 600;
}

.timeline-desc {
  font-size: 0.85rem;
  color: #6a7c6b;
  margin: 0;
  line-height: 1.4;
}

.timeline-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.meta-tag {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #4a5d4b;
  background: #f4f6f2;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.meta-action {
  font-size: 0.7rem;
  font-weight: 700;
  color: #9ead9f;
}
</style>
