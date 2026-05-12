<template>
  <Card class="create-card" padding="lg" hover>
    <form class="create-form" @submit.prevent="submit">
      <div class="create-form__header">
        <Badge :variant="badgeVariant" dot>{{ roleLabel }}</Badge>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>

      <div class="create-form__grid">
        <Input v-model="form.nombre" label="Nombre completo" placeholder="Nombre del usuario" required :error="errors.nombre">
          <template #icon><UserRound :size="18" /></template>
        </Input>

        <Input v-model="form.email" label="Correo electronico" type="email" placeholder="correo@hotel.com" required :error="errors.email">
          <template #icon><Mail :size="18" /></template>
        </Input>

        <Input v-model="form.password" label="Contrasena" type="password" minlength="6" placeholder="Minimo 6 caracteres" required :error="errors.password">
          <template #icon><LockKeyhole :size="18" /></template>
        </Input>

        <Input v-model="form.telefono" label="Telefono" placeholder="+57 300 000 0000">
          <template #icon><Phone :size="18" /></template>
        </Input>

        <Input v-model="form.direccion" class="create-form__wide" label="Direccion" placeholder="Direccion de contacto">
          <template #icon><MapPin :size="18" /></template>
        </Input>
      </div>

      <div v-if="message" :class="['create-form__message', `create-form__message--${messageType}`]">
        {{ message }}
      </div>

      <Button type="submit" size="lg" :loading="loading">
        <template #icon><UserPlus :size="18" /></template>
        {{ submitLabel }}
      </Button>
    </form>
  </Card>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { LockKeyhole, Mail, MapPin, Phone, UserPlus, UserRound } from 'lucide-vue-next';
import Badge from '../common/Badge.vue';
import Button from '../common/Button.vue';
import Card from '../common/Card.vue';
import Input from '../common/Input.vue';
import api from '../../services/api';
import useAuth from '../../composables/useAuth';

const props = defineProps({
  role: {
    type: String,
    default: 'usuario',
    validator: value => ['usuario', 'trabajador', 'admin'].includes(value)
  },
  title: {
    type: String,
    default: 'Crear usuario'
  },
  description: {
    type: String,
    default: 'Registra una cuenta con permisos adecuados para el sistema.'
  },
  autoLogin: Boolean
});

const emit = defineEmits(['created']);
const { register } = useAuth();

const loading = ref(false);
const message = ref('');
const messageType = ref('error');
const form = reactive({
  nombre: '',
  email: '',
  password: '',
  telefono: '',
  direccion: ''
});
const errors = reactive({
  nombre: '',
  email: '',
  password: ''
});

const roleLabel = computed(() => ({
  usuario: 'Usuario',
  trabajador: 'Trabajador',
  admin: 'Administrador'
}[props.role]));

const badgeVariant = computed(() => (props.role === 'admin' ? 'warning' : props.role === 'trabajador' ? 'info' : 'success'));
const submitLabel = computed(() => `Registrar ${roleLabel.value.toLowerCase()}`);

const validate = () => {
  errors.nombre = form.nombre.trim().length >= 2 ? '' : 'El nombre debe tener minimo 2 caracteres.';
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Ingresa un correo valido.';
  errors.password = form.password.length >= 6 ? '' : 'La contrasena debe tener minimo 6 caracteres.';
  return !errors.nombre && !errors.email && !errors.password;
};

const reset = () => {
  form.nombre = '';
  form.email = '';
  form.password = '';
  form.telefono = '';
  form.direccion = '';
};

const submit = async () => {
  message.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    const payload = {
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      telefono: form.telefono,
      direccion: form.direccion,
      rol: props.role
    };

    const result = props.autoLogin ? await register(payload) : await api.post('/auth/register', payload);

    messageType.value = 'success';
    message.value = `${roleLabel.value} registrado correctamente.`;
    emit('created', result);
    if (!props.autoLogin) reset();
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.error || 'No fue posible registrar el usuario.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-card {
  width: min(100%, 42rem);
}

.create-form,
.create-form__header {
  display: grid;
  gap: 1rem;
}

.create-form__header {
  text-align: left;
}

.create-form__header h2 {
  margin: 0;
  color: var(--color-ink);
  font-size: 1.65rem;
}

.create-form__header p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.create-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.create-form__wide {
  grid-column: 1 / -1;
}

.create-form__message {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 800;
}

.create-form__message--error {
  color: var(--color-danger);
  background: #f1ddd6;
  border: 1px solid #dfb9ae;
}

.create-form__message--success {
  color: #47512f;
  background: var(--color-sage-soft);
  border: 1px solid #cbd5b8;
}

@media (max-width: 680px) {
  .create-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
