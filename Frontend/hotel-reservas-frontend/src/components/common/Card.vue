<template>
  <section :class="cardClasses">
    <header v-if="$slots.header || title || $slots.actions" class="ui-card__header">
      <div>
        <p v-if="eyebrow" class="ui-card__eyebrow">{{ eyebrow }}</p>
        <h3 v-if="title" class="ui-card__title">{{ title }}</h3>
        <p v-if="description" class="ui-card__description">{{ description }}</p>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="ui-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="ui-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md',
    validator: value => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  hover: Boolean,
  flush: Boolean
});

const cardClasses = computed(() => [
  'ui-card',
  `ui-card--${props.padding}`,
  {
    'ui-card--hover': props.hover,
    'ui-card--flush': props.flush
  }
]);
</script>

<style scoped>
.ui-card {
  overflow: hidden;
  color: var(--color-ink);
  background: rgba(255, 253, 247, 0.94);
  border: 1px solid rgba(222, 213, 196, 0.9);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  transition:
    transform 190ms ease,
    box-shadow 190ms ease,
    border-color 190ms ease;
}

.ui-card--hover:hover {
  transform: translateY(-3px);
  border-color: rgba(154, 164, 135, 0.55);
  box-shadow: var(--shadow-hover);
}

.ui-card--none .ui-card__body {
  padding: 0;
}

.ui-card--sm .ui-card__body,
.ui-card--sm .ui-card__header,
.ui-card--sm .ui-card__footer {
  padding: 1rem;
}

.ui-card--md .ui-card__body,
.ui-card--md .ui-card__header,
.ui-card--md .ui-card__footer {
  padding: 1.25rem;
}

.ui-card--lg .ui-card__body,
.ui-card--lg .ui-card__header,
.ui-card--lg .ui-card__footer {
  padding: 1.5rem;
}

.ui-card--flush .ui-card__body {
  padding-top: 0;
}

.ui-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0;
}

.ui-card__actions {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
}

.ui-card__eyebrow {
  margin: 0 0 0.35rem;
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.ui-card__title {
  margin: 0;
  color: var(--color-ink);
  font-size: 1rem;
  font-weight: 800;
}

.ui-card__description {
  margin: 0.35rem 0 0;
  color: var(--color-muted);
  font-size: 0.88rem;
  line-height: 1.55;
}

.ui-card__footer {
  border-top: 1px solid rgba(222, 213, 196, 0.72);
}
</style>
