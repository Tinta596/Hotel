<template>
  <MainLayout title="Misión y Visión">
    <div class="mision-vision">
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="badge">Nuestros Valores</span>
          <h1>Excelencia en cada detalle</h1>
          <p>Descubre el alma de nuestro hotel y el compromiso que tenemos con tu bienestar.</p>
        </div>
      </section>

      <section class="content-section">
        <div class="card-grid">
          <div class="info-card animate-slide-up">
            <div class="card-header">
              <div class="icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
              </div>
              <h2>Nuestra Misión</h2>
            </div>
            <div class="card-body">
              <p>
                Brindar una experiencia de hospitalidad inigualable, combinando el lujo clásico con la calidez del hogar. 
                Nuestra meta es superar siempre las expectativas de nuestros huéspedes a través de un servicio 
                totalmente personalizado y de excelencia técnica.
              </p>
            </div>
          </div>

          <div class="info-card animate-slide-up" style="animation-delay: 0.2s">
            <div class="card-header">
              <div class="icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <h2>Nuestra Visión</h2>
            </div>
            <div class="card-body">
              <p>
                Ser el hotel referente de la región para el año 2028, reconocido mundialmente por nuestra elegancia, 
                innovación tecnológica y firme compromiso con la sostenibilidad ambiental, creando recuerdos 
                memorables en el corazón de cada visitante.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="values-section">
        <h2 class="section-title">Valores que nos definen</h2>
        <div class="values-grid">
          <div class="value-item" v-for="v in valores" :key="v.titulo">
            <div class="value-icon">{{ v.icon }}</div>
            <h3>{{ v.titulo }}</h3>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/layout/MainLayout.vue';

const valores = [
  { icon: '💎', titulo: 'Calidad', desc: 'Buscamos la perfección en cada servicio que ofrecemos.' },
  { icon: '🤝', titulo: 'Hospitalidad', desc: 'Hacemos que cada huésped se sienta como en su propia casa.' },
  { icon: '🌱', titulo: 'Sostenibilidad', desc: 'Respetamos y protegemos nuestro entorno natural.' },
  { icon: '✨', titulo: 'Integridad', desc: 'Actuamos con transparencia y honestidad en todo momento.' }
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;700&display=swap');

.mision-vision {
  font-family: 'Outfit', sans-serif;
  color: #2c3e2d;
  background: #fdfaf7;
  padding-bottom: 5rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 450px;
  background-image: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 0 0 50px 50px;
  overflow: hidden;
  margin-bottom: -60px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(44, 62, 45, 0.7), rgba(44, 62, 45, 0.4));
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 0 2rem;
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 900;
  margin: 0.5rem 0;
}

.hero-content p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
}

.badge {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(5px);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Content Cards */
.content-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.info-card {
  background: white;
  padding: 3rem;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(44, 62, 45, 0.08);
  border: 1px solid rgba(44, 62, 45, 0.03);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.icon-wrap {
  width: 64px;
  height: 64px;
  background: #fdfaf7;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5d4b;
}

.card-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  margin: 0;
}

.card-body p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #6a7c6b;
}

/* Values Section */
.values-section {
  max-width: 1100px;
  margin: 6rem auto 0;
  text-align: center;
  padding: 0 2rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  margin-bottom: 3.5rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.value-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.value-item h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.value-item p {
  font-size: 0.9rem;
  color: #6a7c6b;
}

/* Animations */
.animate-slide-up {
  animation: slideUp 0.8s ease backwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .card-grid { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-content h1 { font-size: 3rem; }
}
</style>
