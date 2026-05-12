<template>
  <AuthLayout
    title="Equipo operativo"
    subtitle="Gestiona accesos internos con una experiencia sobria, segura y enfocada en la operacion diaria."
  >
    <WorkerCreateForm />
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../components/auth/AuthLayout.vue';
import WorkerCreateForm from '../components/auth/WorkerCreateForm.vue';
</script>
