<template>
  <router-view />
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const usuario = computed(() => store.state.usuario);
const isPremium = computed(() => usuario.value?.nivel_fidelidad === 'premium');

const updateTheme = (premium) => {
  if (premium) {
    document.body.classList.add('theme--premium');
  } else {
    document.body.classList.remove('theme--premium');
  }
};

watch(isPremium, (val) => updateTheme(val));
onMounted(() => updateTheme(isPremium.value));
</script>

<style>
/* Global styles if any */
</style>
