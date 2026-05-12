<template>
  <main class="auth-layout">
    <section class="auth-layout__panel">
      <div class="auth-layout__brand">
        <div class="auth-layout__mark">H</div>
        <div>
          <strong>Hotel Reservas</strong>
          <span>Hospitalidad empresarial</span>
        </div>
      </div>

      <div class="auth-layout__copy">
        <Badge variant="success" dot>Acceso seguro</Badge>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
    </section>

    <section class="auth-layout__content">
      <slot />
    </section>
  </main>
</template>

<script setup>
import Badge from '../common/Badge.vue';

defineProps({
  title: {
    type: String,
    default: 'Gestion hotelera premium'
  },
  subtitle: {
    type: String,
    default: 'Una experiencia serena, segura y organizada para equipos modernos.'
  }
});
</script>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: minmax(22rem, 0.85fr) minmax(0, 1.15fr);
  min-height: 100vh;
  background:
    radial-gradient(circle at 82% 18%, rgba(95, 101, 72, 0.22), transparent 24rem),
    linear-gradient(135deg, #ded2bc 0%, #c8bea9 56%, #b8bea7 100%);
}

.auth-layout__panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(2rem, 5vw, 4.5rem);
  color: var(--color-bone);
  background:
    linear-gradient(180deg, rgba(31, 33, 28, 0.94), rgba(21, 23, 17, 0.98)),
    var(--color-soft-black);
}

.auth-layout__brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.auth-layout__mark {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  color: var(--color-soft-black);
  background: var(--color-beige);
  border-radius: 1rem;
  font-weight: 900;
}

.auth-layout__brand div:last-child,
.auth-layout__copy {
  display: grid;
  gap: 0.25rem;
}

.auth-layout__brand strong {
  font-size: 1rem;
}

.auth-layout__brand span,
.auth-layout__copy p {
  color: #c8bea9;
}

.auth-layout__copy {
  max-width: 31rem;
}

.auth-layout__copy h1 {
  margin: 1rem 0 0.25rem;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  line-height: 0.98;
}

.auth-layout__copy p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.75;
}

.auth-layout__content {
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
}

@media (max-width: 900px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-layout__panel {
    min-height: 18rem;
  }
}
</style>
