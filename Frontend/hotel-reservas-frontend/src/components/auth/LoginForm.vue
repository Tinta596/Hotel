<template>
  <Card class="auth-card" padding="lg" hover>
    <form class="auth-form" @submit.prevent="submit">
      <div class="auth-form__header">
        <div class="auth-form__icon">
          <LogIn :size="28" />
        </div>
        <div>
          <h2>Iniciar sesion</h2>
          <p>Ingresa con tus credenciales para continuar.</p>
        </div>
      </div>

      <Input
        v-model="form.email"
        label="Correo electronico"
        type="email"
        autocomplete="email"
        placeholder="tu@hotel.com"
        required
        :error="errors.email"
      >
        <template #icon><Mail :size="18" /></template>
      </Input>

      <Input
        v-model="form.password"
        label="Contrasena"
        type="password"
        autocomplete="current-password"
        placeholder="Minimo 6 caracteres"
        minlength="6"
        required
        :error="errors.password"
      >
        <template #icon><LockKeyhole :size="18" /></template>
      </Input>

      <div v-if="message" class="auth-form__message">{{ message }}</div>

      <Button type="submit" size="lg" :loading="loading">
        <template #icon><ArrowRight :size="18" /></template>
        Ingresar
      </Button>

      <p class="auth-form__footer">
        No tienes cuenta?
        <RouterLink to="/register">Crear usuario</RouterLink>
      </p>
    </form>
  </Card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRight, LockKeyhole, LogIn, Mail } from 'lucide-vue-next';
import Card from '../common/Card.vue';
import Input from '../common/Input.vue';
import Button from '../common/Button.vue';
import useAuth from '../../composables/useAuth';

const { login } = useAuth();

const loading = ref(false);
const message = ref('');
const form = reactive({
  email: '',
  password: ''
});
const errors = reactive({
  email: '',
  password: ''
});

const validate = () => {
  errors.email = form.email ? '' : 'El correo es obligatorio.';
  errors.password = form.password.length >= 6 ? '' : 'La contrasena debe tener minimo 6 caracteres.';
  return !errors.email && !errors.password;
};

const submit = async () => {
  message.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    await login({ email: form.email, password: form.password });
  } catch (error) {
    message.value = error.response?.data?.error || 'Credenciales incorrectas o usuario inactivo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-card {
  width: min(100%, 28rem);
}

.auth-form,
.auth-form__header {
  display: grid;
  gap: 1rem;
}

.auth-form__header {
  justify-items: center;
  text-align: center;
  margin-bottom: 0.35rem;
}

.auth-form__icon {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  color: var(--color-olive-dark);
  background: var(--color-sage-soft);
  border-radius: 1.25rem;
}

.auth-form h2 {
  margin: 0;
  color: var(--color-ink);
  font-size: 1.85rem;
}

.auth-form p {
  margin: 0.3rem 0 0;
  color: var(--color-muted);
}

.auth-form__message {
  padding: 0.85rem 1rem;
  color: var(--color-danger);
  background: #f1ddd6;
  border: 1px solid #dfb9ae;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 800;
  text-align: center;
}

.auth-form__footer {
  text-align: center;
  font-size: 0.9rem;
}

.auth-form__footer a {
  color: var(--color-olive-dark);
  font-weight: 900;
  text-decoration: none;
}
</style>
