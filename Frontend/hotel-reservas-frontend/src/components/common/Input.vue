<template>
  <label :class="fieldClasses">
    <span v-if="label" class="ui-input__label">{{ label }}</span>

    <span class="ui-input__control-wrap">
      <span v-if="$slots.icon" class="ui-input__icon" aria-hidden="true">
        <slot name="icon" />
      </span>

      <textarea
        v-if="textarea"
        v-bind="$attrs"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        class="ui-input__control ui-input__control--textarea"
        @input="emitValue"
        @blur="$emit('blur', $event)"
      ></textarea>

      <select
        v-else-if="select"
        v-bind="$attrs"
        :value="modelValue"
        :disabled="disabled"
        class="ui-input__control"
        @change="emitValue"
        @blur="$emit('blur', $event)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="optionValue(option)"
          :value="optionValue(option)"
        >
          {{ optionLabel(option) }}
        </option>
      </select>

      <input
        v-else
        v-bind="$attrs"
        :value="type === 'file' ? undefined : modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :accept="accept"
        class="ui-input__control"
        @input="emitValue"
        @change="emitChange"
        @blur="$emit('blur', $event)"
      />
    </span>

    <span v-if="error" class="ui-input__message">{{ error }}</span>
    <span v-else-if="hint" class="ui-input__hint">{{ hint }}</span>
  </label>
</template>

<script setup>
import { computed, useSlots } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  select: Boolean,
  textarea: Boolean,
  options: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Number,
    default: 4
  },
  accept: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'blur']);
const slots = useSlots();

const fieldClasses = computed(() => [
    'ui-input',
    {
      'ui-input--error': props.error,
      'ui-input--disabled': props.disabled,
      'ui-input--with-icon': Boolean(slots.icon)
    }
]);

const optionValue = option => (typeof option === 'object' ? option.value : option);
const optionLabel = option => (typeof option === 'object' ? option.label : option);

const emitValue = event => {
  emit('update:modelValue', event.target.value);
};

const emitChange = event => {
  if (props.type === 'file') {
    const file = event.target.files?.[0] || null;
    emit('update:modelValue', file);
    emit('change', event);
    return;
  }

  emit('change', event);
};
</script>

<style scoped>
.ui-input {
  display: grid;
  gap: 0.45rem;
  color: var(--color-ink);
}

.ui-input__label {
  color: var(--color-graphite);
  font-size: 0.82rem;
  font-weight: 800;
}

.ui-input__control-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.ui-input__icon {
  position: absolute;
  left: 0.9rem;
  display: inline-flex;
  color: #8f896f;
  pointer-events: none;
}

.ui-input__control {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.72rem 0.9rem;
  color: var(--color-ink);
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.85rem;
  font: inherit;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.ui-input--with-icon .ui-input__control {
  padding-left: 2.45rem;
}

.ui-input__control::placeholder {
  color: #a9a08c;
}

.ui-input__control:focus {
  outline: none;
  border-color: var(--color-olive);
  box-shadow: 0 0 0 4px rgba(111, 116, 83, 0.14);
}

.ui-input__control--textarea {
  min-height: 7rem;
  resize: vertical;
}

.ui-input__message {
  color: var(--color-danger);
  font-size: 0.78rem;
  font-weight: 700;
}

.ui-input__hint {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.ui-input--error .ui-input__control {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 4px rgba(155, 63, 52, 0.11);
}

.ui-input--disabled {
  opacity: 0.65;
}
</style>
