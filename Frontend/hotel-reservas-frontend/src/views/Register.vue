<template>
  <AuthLayout
    title="Reserva con una experiencia superior"
    subtitle="Crea tu cuenta y entra a un sistema hotelero minimalista, seguro y pensado para una atencion impecable."
  >
    <RegisterForm />
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../components/auth/AuthLayout.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';
</script>
