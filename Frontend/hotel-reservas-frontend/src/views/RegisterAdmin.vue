<template>
  <AuthLayout
    title="Administracion segura"
    subtitle="Crea perfiles administrativos con permisos completos para la plataforma hotelera."
  >
    <AdminCreateForm />
  </AuthLayout>
</template>

<script setup>
import AdminCreateForm from '../components/auth/AdminCreateForm.vue';
import AuthLayout from '../components/auth/AuthLayout.vue';
</script>
