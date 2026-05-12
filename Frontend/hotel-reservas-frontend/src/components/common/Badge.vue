<template>
  <span :class="badgeClasses">
    <span v-if="dot" class="ui-badge__dot" aria-hidden="true"></span>
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: value => ['success', 'warning', 'danger', 'info', 'neutral'].includes(value)
  },
  dot: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md'].includes(value)
  }
});

const badgeClasses = computed(() => [
  'ui-badge',
  `ui-badge--${props.variant}`,
  `ui-badge--${props.size}`
]);
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  border: 1px solid transparent;
  border-radius: 999px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.ui-badge--sm {
  padding: 0.28rem 0.55rem;
  font-size: 0.7rem;
}

.ui-badge--md {
  padding: 0.42rem 0.7rem;
  font-size: 0.76rem;
}

.ui-badge--success {
  color: #47512f;
  background: #e5eadc;
  border-color: #cbd5b8;
}

.ui-badge--warning {
  color: #7b5b26;
  background: #f2e4c9;
  border-color: #dec894;
}

.ui-badge--danger {
  color: #84352c;
  background: #f1ddd6;
  border-color: #dfb9ae;
}

.ui-badge--info {
  color: #555b3d;
  background: #ede6d8;
  border-color: #d8c8ad;
}

.ui-badge--neutral {
  color: var(--color-muted);
  background: #f4efe5;
  border-color: var(--color-border);
}

.ui-badge__dot {
  width: 0.45rem;
  height: 0.45rem;
  background: currentColor;
  border-radius: 999px;
}
</style>
