<template>
  <div class="home-page" :class="{ 'home--premium': usuario?.nivel_fidelidad === 'premium' }">

    <!-- Hero section -->
    <section class="home-hero">
      <div class="home-hero__content">
        <div class="home-hero__badge">
          <span class="home-hero__dot"></span>
          Sistema de Reservas
        </div>
        <h1 class="home-hero__title">
          Bienvenido al<br />
          <em>Hotel Reservas</em>
        </h1>
        <p class="home-hero__sub">
          Gestiona habitaciones, reservas y servicios desde una sola interfaz elegante y eficiente.
        </p>

        <div v-if="usuario" class="home-hero__user">
          <div class="home-hero__avatar">{{ initials }}</div>
          <div>
            <p class="home-hero__user-name">{{ usuario.nombre }}</p>
            <p class="home-hero__user-role">{{ usuario.rol }}</p>
          </div>
        </div>

        <div class="home-hero__actions">
          <router-link class="home-btn home-btn--primary" to="/habitaciones">🏨 Habitaciones</router-link>
          <router-link class="home-btn home-btn--outline" to="/reservas">📅 Mis Reservas</router-link>
          <router-link class="home-btn home-btn--outline" to="/servicios">🛎️ Servicios</router-link>
        </div>
      </div>

      <div class="home-hero__img-wrap">
        <img src="/Hotel1.jpg" alt="Hotel" class="home-hero__img" />
        <div class="home-hero__img-glow"></div>
      </div>
    </section>

    <!-- Features row -->
    <section class="home-features">
      <div
        v-for="feat in features"
        :key="feat.title"
        class="home-feature-card"
      >
        <span class="home-feature-card__icon">{{ feat.icon }}</span>
        <h3 class="home-feature-card__title">{{ feat.title }}</h3>
        <p class="home-feature-card__desc">{{ feat.desc }}</p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="home-mvision">
      <div class="home-mvision__item">
        <span class="home-mvision__icon">🌟</span>
        <div>
          <h3 class="home-mvision__title">Nuestra Misión</h3>
          <p class="home-mvision__text">
            Brindar a nuestros huéspedes una experiencia inolvidable combinando hospitalidad
            cálida, atención personalizada y tecnología moderna que permita realizar reservas
            de manera fácil, rápida y segura.
          </p>
        </div>
      </div>
      <div class="home-mvision__item">
        <span class="home-mvision__icon">🚀</span>
        <div>
          <h3 class="home-mvision__title">Nuestra Visión</h3>
          <p class="home-mvision__text">
            Ser reconocidos a nivel nacional como el hotel líder en innovación tecnológica
            aplicada a la experiencia del huésped, integrando soluciones digitales que
            transformen la forma en que las personas interactúan con nuestros servicios.
          </p>
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <blockquote class="home-quote">
      <p>«Una experiencia excelente, fácil de reservar y con una atención increíble»</p>
      <footer>— Cliente satisfecho</footer>
    </blockquote>
  </div>
</template>

<script>
import logo from '../assets/logo.png';

export default {
  name: 'Home',
  data() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log('--- DEBUG HOME ---');
    console.log('Usuario:', usuario);
    console.log('Nivel:', usuario?.nivel_fidelidad);
    const initials = usuario?.nombre
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase() || '';
    return {
      usuario,
      logoUrl: logo,
      initials,
      features: [
        { icon: '📶', title: 'Wi-Fi de alta velocidad',  desc: 'Conectividad premium en toda la instalación sin costo adicional.' },
        { icon: '🌊', title: 'Vista al mar y terraza',   desc: 'Habitaciones con vistas privilegiadas y espacios al aire libre.' },
        { icon: '🍽️', title: 'Servicio a la habitación', desc: 'Disponible las 24 horas para satisfacer tus necesidades.' },
        { icon: '🔒', title: 'Caja fuerte y minibar',    desc: 'Amenidades de lujo incluidas en cada habitación.' },
      ]
    };
  }
};
</script>

<style scoped>
/* ── Page wrapper ── */
.home-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
  display: grid;
  gap: 3rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.home--premium {
  background: #080808;
  color: #f0ede8;
}

/* ── Hero ── */
.home-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: center;
}

.home-hero__content {
  display: grid;
  gap: 1.25rem;
}

.home-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  background: var(--color-sage-soft);
  border: 1px solid #c3cc9b;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--color-olive-dark);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  width: fit-content;
}
.home--premium .home-hero__badge {
  background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05));
  border-color: rgba(212,175,55,0.4);
  color: #f0d080;
}

.home-hero__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--color-olive);
  animation: pulse 2s ease infinite;
}
.home--premium .home-hero__dot {
  background: #d4af37;
  box-shadow: 0 0 8px #d4af37;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}

.home-hero__title {
  margin: 0;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 900;
  color: var(--color-ink);
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.home--premium .home-hero__title {
  color: #fff;
}

.home-hero__title em {
  font-style: normal;
  color: var(--color-olive-dark);
}
.home--premium .home-hero__title em {
  color: #d4af37;
  text-shadow: 0 0 15px rgba(212,175,55,0.3);
}

.home-hero__sub {
  margin: 0;
  font-size: 1rem;
  color: var(--color-muted);
  line-height: 1.7;
  max-width: 38ch;
}
.home--premium .home-hero__sub {
  color: #aaa;
}

/* User pill */
.home-hero__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  width: fit-content;
}
.home--premium .home-hero__user {
  background: #111;
  border-color: rgba(212,175,55,0.2);
}

.home-hero__avatar {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  background: var(--color-soft-black);
  color: var(--color-bone);
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 900;
  flex-shrink: 0;
}
.home--premium .home-hero__avatar {
  background: linear-gradient(135deg, #c9a84c, #f0d080);
  color: #1a1a1a;
  box-shadow: 0 0 15px rgba(212,175,55,0.3);
}

.home-hero__user-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-ink);
}
.home--premium .home-hero__user-name {
  color: #fff;
}

.home-hero__user-role {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: capitalize;
}

/* Nav actions */
.home-hero__actions {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.15rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.home-btn--primary {
  background: var(--color-olive-dark);
  color: var(--color-bone);
}
.home--premium .home-btn--primary {
  background: linear-gradient(135deg, #c9a84c, #b8860b);
  color: #111;
  border: none;
}
.home--premium .home-btn--primary:hover {
  background: linear-gradient(135deg, #f0d080, #c9a84c);
  box-shadow: 0 10px 24px rgba(212,175,55,0.3);
}
.home-btn--primary:hover {
  background: #353e22;
  box-shadow: 0 10px 24px rgba(66, 72, 47, 0.28);
  transform: translateY(-1px);
}

.home-btn--outline {
  background: var(--color-card);
  color: var(--color-ink);
  border-color: var(--color-border);
}
.home--premium .home-btn--outline {
  background: rgba(255,255,255,0.05);
  color: #d4af37;
  border-color: rgba(212,175,55,0.3);
}
.home--premium .home-btn--outline:hover {
  background: rgba(212,175,55,0.1);
  border-color: #d4af37;
}
.home-btn--outline:hover {
  background: var(--color-bone);
  transform: translateY(-1px);
}

/* Hero image */
.home-hero__img-wrap {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 360px;
  box-shadow: var(--shadow-hover);
}

.home-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.home-hero__img-wrap:hover .home-hero__img {
  transform: scale(1.04);
}

.home-hero__img-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(95,101,72,0.15), transparent);
  pointer-events: none;
}
.home--premium .home-hero__img-glow {
  background: linear-gradient(135deg, rgba(212,175,55,0.2), transparent);
}

/* ── Features ── */
.home-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.home-feature-card {
  padding: 1.35rem 1.25rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 0.5rem;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.home--premium .home-feature-card {
  background: #111;
  border-color: rgba(212,175,55,0.1);
}
.home-feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.home-feature-card__icon {
  font-size: 1.75rem;
}

.home-feature-card__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-ink);
}
.home--premium .home-feature-card__title {
  color: #d4af37;
}

.home-feature-card__desc {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-muted);
  line-height: 1.55;
}

/* ── Mission / Vision ── */
.home-mvision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.home-mvision__item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  align-items: flex-start;
}
.home--premium .home-mvision__item {
  background: #111;
  border-color: rgba(212,175,55,0.1);
}

.home-mvision__icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.home-mvision__title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-ink);
}
.home--premium .home-mvision__title {
  color: #d4af37;
}

.home-mvision__text {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-muted);
  line-height: 1.7;
}

/* ── Quote ── */
.home-quote {
  margin: 0;
  padding: 1.5rem 2rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-olive);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}
.home--premium .home-quote {
  background: #111;
  border-color: rgba(212,175,55,0.2);
  border-left-color: #d4af37;
}

.home-quote p {
  margin: 0;
  font-size: 1.15rem;
  font-style: italic;
  color: var(--color-ink);
  line-height: 1.6;
}
.home--premium .home-quote p {
  color: #fff;
}

.home-quote footer {
  margin-top: 0.65rem;
  font-size: 0.82rem;
  color: var(--color-muted);
  font-weight: 600;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .home-hero {
    grid-template-columns: 1fr;
  }
  .home-hero__img-wrap {
    height: 240px;
    order: -1;
  }
  .home-mvision {
    grid-template-columns: 1fr;
  }
}
</style>
