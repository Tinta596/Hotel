<template>
  <Card hover padding="lg" class="stat-card">
    <div class="stat-card__top">
      <div class="stat-card__icon">
        <component :is="icon" v-if="icon" :size="22" />
      </div>
      <Badge :variant="trendVariant" size="sm">{{ trend }}</Badge>
    </div>

    <div class="stat-card__content">
      <p>{{ title }}</p>
      <strong>{{ value }}</strong>
      <span>{{ subtitle }}</span>
    </div>
  </Card>
</template>

<script setup>
import Card from '../common/Card.vue';
import Badge from '../common/Badge.vue';

defineProps({
  icon: {
    type: [Object, Function],
    default: null
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    default: 'Estable'
  },
  trendVariant: {
    type: String,
    default: 'success'
  }
});
</script>

<style scoped>
.stat-card {
  animation: fadeInUp 420ms ease both;
}

.stat-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  color: var(--color-olive-dark);
  background: var(--color-sage-soft);
  border-radius: 0.95rem;
}

.stat-card__content {
  display: grid;
  gap: 0.3rem;
}

.stat-card__content p,
.stat-card__content span {
  margin: 0;
  color: var(--color-muted);
}

.stat-card__content p {
  font-size: 0.86rem;
  font-weight: 800;
}

.stat-card__content strong {
  color: var(--color-ink);
  font-size: clamp(1.7rem, 3vw, 2.45rem);
  font-weight: 900;
  line-height: 1.05;
}

.stat-card__content span {
  font-size: 0.82rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
