<template>
  <div class="analytics-card" :class="`analytics-card--${variant}`">
    <div class="analytics-card__body">
      <div class="analytics-card__icon">
        <slot name="icon"></slot>
      </div>
      <div class="analytics-card__content">
        <p class="analytics-card__label">{{ label }}</p>
        <h3 class="analytics-card__value">{{ value }}</h3>
        <div v-if="trend !== undefined" class="analytics-card__trend" :class="trend >= 0 ? 'trend--up' : 'trend--down'">
          <span class="trend__icon">{{ trend >= 0 ? '↑' : '↓' }}</span>
          <span class="trend__value">{{ Math.abs(trend) }}%</span>
          <span class="trend__text">vs mes anterior</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  trend: Number,
  variant: {
    type: String,
    default: 'default'
  }
});
</script>

<style scoped>
.analytics-card {
  background: var(--color-card, #ffffff);
  border: 1px solid var(--color-border, #f0ede8);
  border-radius: 1.5rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.analytics-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  border-color: var(--color-sage, #9ead9f);
}

.analytics-card__body {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.analytics-card__icon {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: var(--color-sage-soft, #f4f6f2);
  color: var(--color-olive-dark, #4a5d4b);
}

.analytics-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.analytics-card__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-muted, #6a7c6b);
  margin: 0;
}

.analytics-card__value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-ink, #1a1a1a);
  margin: 0;
  letter-spacing: -0.025em;
}

.analytics-card__trend {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.trend--up { color: #10b981; }
.trend--down { color: #ef4444; }

.trend__text {
  color: var(--color-muted, #6a7c6b);
  font-weight: 500;
}

/* Variantes */
.analytics-card--primary .analytics-card__icon {
  background: var(--color-olive-dark, #4a5d4b);
  color: white;
}
</style>
