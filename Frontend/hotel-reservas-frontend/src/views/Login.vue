<template>
  <AuthLayout
    title="Bienvenido de nuevo"
    subtitle="Accede a una operacion hotelera calmada, elegante y lista para equipos de alto rendimiento."
  >
    <LoginForm />
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../components/auth/AuthLayout.vue';
import LoginForm from '../components/auth/LoginForm.vue';
</script>
