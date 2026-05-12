<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    :type="isButton ? type : undefined"
    :disabled="isButton ? isDisabled : undefined"
    :aria-disabled="!isButton && isDisabled ? 'true' : undefined"
    :aria-label="iconOnly ? ariaLabel : undefined"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <span v-else-if="$slots.icon" class="btn-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span v-if="!iconOnly" class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'outline', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: Boolean,
  disabled: Boolean,
  iconOnly: Boolean,
  ariaLabel: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['click']);

const componentTag = computed(() => {
  if (props.to) return RouterLink;
  if (props.href) return 'a';
  return 'button';
});

const isButton = computed(() => componentTag.value === 'button');
const isDisabled = computed(() => props.disabled || props.loading);

const buttonClasses = computed(() => [
  'ui-button',
  `ui-button--${props.variant}`,
  `ui-button--${props.size}`,
  {
    'ui-button--loading': props.loading,
    'ui-button--disabled': isDisabled.value,
    'ui-button--icon-only': props.iconOnly
  }
]);

const handleClick = event => {
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }

  emit('click', event);
};
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border: 1px solid transparent;
  border-radius: 0.8rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.ui-button:hover {
  transform: translateY(-1px);
}

.ui-button:focus-visible {
  outline: 3px solid rgba(111, 116, 83, 0.24);
  outline-offset: 2px;
}

.ui-button--sm {
  min-height: 2.25rem;
  padding: 0.55rem 0.8rem;
  font-size: 0.82rem;
}

.ui-button--md {
  min-height: 2.75rem;
  padding: 0.72rem 1rem;
  font-size: 0.92rem;
}

.ui-button--lg {
  min-height: 3.15rem;
  padding: 0.9rem 1.25rem;
  font-size: 1rem;
}

.ui-button--primary {
  color: var(--color-bone);
  background: var(--color-olive-dark);
  box-shadow: 0 14px 26px rgba(86, 91, 61, 0.18);
}

.ui-button--primary:hover {
  background: #464a32;
  box-shadow: 0 18px 34px rgba(86, 91, 61, 0.24);
}

.ui-button--secondary {
  color: var(--color-ink);
  background: var(--color-sage-soft);
}

.ui-button--secondary:hover {
  background: #d5ddc9;
}

.ui-button--outline {
  color: var(--color-ink);
  background: var(--color-card);
  border-color: var(--color-border);
}

.ui-button--outline:hover {
  border-color: #b9ad96;
  box-shadow: 0 12px 24px rgba(31, 33, 28, 0.08);
}

.ui-button--danger {
  color: var(--color-bone);
  background: var(--color-danger);
  box-shadow: 0 14px 26px rgba(155, 63, 52, 0.16);
}

.ui-button--danger:hover {
  background: #82342b;
}

.ui-button--ghost {
  color: var(--color-muted);
  background: transparent;
}

.ui-button--ghost:hover {
  color: var(--color-ink);
  background: rgba(111, 116, 83, 0.1);
}

.ui-button--disabled,
.ui-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
  box-shadow: none;
}

.ui-button--icon-only {
  width: 2.75rem;
  min-width: 2.75rem;
  padding: 0;
}

.ui-button--icon-only.ui-button--sm {
  width: 2.25rem;
  min-width: 2.25rem;
}

.ui-button--icon-only.ui-button--lg {
  width: 3.15rem;
  min-width: 3.15rem;
}

.btn-icon,
.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 999px;
  animation: spin 700ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
